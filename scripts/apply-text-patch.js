// ═══════════════════════════════════════════════════════════
// Patch 套用腳本 — scripts/apply-text-patch.js
// 規格：docs/batch-f5-ux.md §Lane E-5
//
// 讀入 src/engine/textOverlay.js exportPatch() 產出的 patch.json，
// 逐條在對應 chapterXX.js 找 oldValue 的唯一精確字串替換為
// newValue。找不到或不唯一 → 該條報 error 跳過（不得模糊匹配）。
//
// Usage: node scripts/apply-text-patch.js <patch.json>
// ═══════════════════════════════════════════════════════════

import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";

const CHAPTERS_DIR = resolve("src/data/chapters");

/** patch entry 的 chapter 編號 → 對應章節檔案路徑（chapterNN.js，兩位數補零）。 */
export function chapterFilePath(chapterNum) {
  const n = String(chapterNum).padStart(2, "0");
  return resolve(CHAPTERS_DIR, `chapter${n}.js`);
}

function countOccurrences(content, needle) {
  if (!needle) return 0;
  let count = 0;
  let idx = 0;
  for (;;) {
    const found = content.indexOf(needle, idx);
    if (found === -1) break;
    count++;
    idx = found + needle.length;
  }
  return count;
}

/**
 * 對單一檔案內容依序套用一批 patch entries（不做任何 fs I/O，純函式，供測試）。
 * 每條依「找到唯一 oldValue → 替換」規則處理；前一條的替換結果會影響後一條的
 * 唯一性判定（同一份 content 依序疊代套用）。
 *
 * 回傳 { content, results }：
 *   content — 套用後的字串
 *   results — 每條 entry 對應一筆 { entry, status, message }
 *             status ∈ "applied" | "not-found" | "not-unique"
 */
export function applyEntriesToContent(content, entries) {
  let current = content;
  const results = [];
  for (const entry of entries) {
    const { oldValue, newValue, key } = entry;
    if (typeof oldValue !== "string" || oldValue.length === 0) {
      results.push({ entry, status: "not-found", message: `oldValue 為空或非字串（key=${key}）` });
      continue;
    }
    const count = countOccurrences(current, oldValue);
    if (count === 0) {
      results.push({ entry, status: "not-found", message: `oldValue 在檔案中找不到（key=${key}）` });
      continue;
    }
    if (count > 1) {
      results.push({ entry, status: "not-unique", message: `oldValue 出現 ${count} 次，非唯一，跳過（key=${key}）` });
      continue;
    }
    const idx = current.indexOf(oldValue);
    current = current.slice(0, idx) + newValue + current.slice(idx + oldValue.length);
    results.push({ entry, status: "applied", message: `已替換（key=${key}）` });
  }
  return { content: current, results };
}

/**
 * 依 entry.chapter 把 patch 分組到各章節檔案，對每個檔案依序套用。
 * fileContents：Map<filePath, originalContentString>（缺檔案 → 該檔全部 entries 回報 not-found）。
 * 純函式，不做任何 fs I/O，供測試。
 *
 * 回傳 { fileResults, allResults }：
 *   fileResults — [{ file, content, results, changed }]（僅含實際讀到內容的檔案）
 *   allResults  — 全部 entries 的 { entry, status, message }，順序與輸入 patch 一致（依檔案分組後串接）
 */
export function planPatch(patch, fileContents) {
  const byFile = new Map();
  for (const entry of patch) {
    const filePath = chapterFilePath(entry.chapter);
    if (!byFile.has(filePath)) byFile.set(filePath, []);
    byFile.get(filePath).push(entry);
  }

  const fileResults = [];
  const allResults = [];
  for (const [filePath, entries] of byFile) {
    const original = fileContents.get(filePath);
    if (original === undefined) {
      for (const entry of entries) {
        allResults.push({ entry, status: "not-found", message: `找不到章節檔案：${filePath}（key=${entry.key}）` });
      }
      continue;
    }
    const { content, results } = applyEntriesToContent(original, entries);
    fileResults.push({
      file: filePath,
      content,
      results,
      changed: results.some((r) => r.status === "applied"),
    });
    allResults.push(...results);
  }
  return { fileResults, allResults };
}

// ── CLI ────────────────────────────────────────────────────

async function main() {
  const patchPath = process.argv[2];
  if (!patchPath) {
    console.error("Usage: node scripts/apply-text-patch.js <patch.json>");
    process.exit(1);
    return;
  }

  const raw = await readFile(resolve(patchPath), "utf-8");
  let patch;
  try {
    patch = JSON.parse(raw);
  } catch (err) {
    console.error(`patch.json 不是合法 JSON：${err.message}`);
    process.exit(1);
    return;
  }
  if (!Array.isArray(patch)) {
    console.error("patch.json 格式錯誤：頂層必須是陣列");
    process.exit(1);
    return;
  }
  if (patch.length === 0) {
    console.log("patch 為空，沒有要套用的修改。");
    process.exit(0);
    return;
  }

  const filePaths = [...new Set(patch.map((e) => chapterFilePath(e.chapter)))];
  const fileContents = new Map();
  for (const fp of filePaths) {
    try {
      fileContents.set(fp, await readFile(fp, "utf-8"));
    } catch (_) {
      // 留空 → planPatch 會把該檔的全部 entries 回報 not-found
    }
  }

  const { fileResults, allResults } = planPatch(patch, fileContents);

  for (const fr of fileResults) {
    if (fr.changed) {
      await writeFile(fr.file, fr.content, "utf-8");
    }
  }

  let applied = 0;
  let notFound = 0;
  let notUnique = 0;
  for (const r of allResults) {
    const icon = r.status === "applied" ? "✓" : "✗";
    console.log(`  ${icon} ${r.message}`);
    if (r.status === "applied") applied++;
    else if (r.status === "not-found") notFound++;
    else notUnique++;
  }

  console.log(`\n── Patch summary: ${applied} applied, ${notFound} not-found, ${notUnique} not-unique ──`);
  if (applied > 0) {
    console.log("請重新跑：npm test && npm run build && npm run validate:chapters && npm run validate:fidelity");
  }
  process.exit(notFound + notUnique > 0 ? 1 : 0);
}

const isDirectRun =
  process.argv[1] && fileURLToPath(import.meta.url) === fileURLToPath(pathToFileURL(resolve(process.argv[1])).href);

if (isDirectRun) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
