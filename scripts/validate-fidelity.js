// ═══════════════════════════════════════════════════════════
// Fidelity 驗證工具 — scripts/validate-fidelity.js
// 規格：docs/origin-marking-spec.md §5
//
// 檢查每章 chapter data 裡 origin:"source" 的 jp 是否逐字（正規化後）
// 是底本（reference/aozora/haguruma_original.txt）該章的子字串，並
// 輸出「一字不漏」進度的覆蓋率報告。
// ═══════════════════════════════════════════════════════════

import { readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";

const CHAPTERS_DIR = resolve("src/data/chapters");
const SOURCE_PATH = resolve("reference/aozora/haguruma_original.txt");
const METADATA_MARKER = "# ---- 轉換 metadata ----";
const CHAPTER_MARKER_RE = /【第(\d)章】/g;
const ORIGIN_BLOCK_TYPES = new Set(["narration", "inner", "dialogue"]);
const W1_MIN_LENGTH = 8;

// ── 正規化 ──────────────────────────────────────────────────

/**
 * 移除所有空白字元（半形/全形空白、換行、tab）。其餘一字不動——
 * 標點、踊り字、假名遣い、漢字表記全部保持。
 */
export function normalize(str) {
  if (typeof str !== "string") return "";
  return str.replace(/[\s　]/g, "");
}

// ── 底本載入／章節切分 ─────────────────────────────────────

export function stripMetadata(rawText) {
  const idx = rawText.indexOf(METADATA_MARKER);
  return idx === -1 ? rawText : rawText.slice(0, idx);
}

/**
 * 依 【第N章】 marker 切分底本，回傳 { [chapterNum]: normalizedChapterText }。
 * marker 本身不計入內容；區間為 [此 marker 結尾, 下一 marker 開頭) 或到文末。
 */
export function splitChapters(rawText) {
  const text = stripMetadata(rawText);
  const markers = [];
  const re = new RegExp(CHAPTER_MARKER_RE);
  let m;
  while ((m = re.exec(text))) {
    markers.push({ num: Number(m[1]), contentStart: re.lastIndex, markerStart: m.index });
  }

  const chapters = {};
  for (let i = 0; i < markers.length; i++) {
    const { num, contentStart } = markers[i];
    const end = i + 1 < markers.length ? markers[i + 1].markerStart : text.length;
    chapters[num] = normalize(text.slice(contentStart, end));
  }
  return chapters;
}

// ── 動態 text 雙態聯集 ─────────────────────────────────────

/**
 * 收集章節內所有 flag（scene.flags[] + choice.flag）與所有 notebook entry
 * （scene.notebook + choice.notebook），供組出「全部達成」的第二態。
 */
export function collectFlagsAndNotebook(chapter) {
  const flags = new Set();
  const notebook = [];
  for (const scene of Object.values(chapter.scenes ?? {})) {
    if (Array.isArray(scene.flags)) {
      for (const f of scene.flags) flags.add(f);
    }
    if (scene.notebook) notebook.push(scene.notebook);
    if (Array.isArray(scene.choices)) {
      for (const c of scene.choices) {
        if (c.flag) flags.add(c.flag);
        if (c.notebook) notebook.push(c.notebook);
      }
    }
  }
  return { flags: [...flags], notebook };
}

/**
 * 呼叫動態 text 兩次（{choicesMade:{}, notebook:[]} 與「該章全達成」態），
 * 回傳兩次結果的 block 聯集（JSON 序列化比對去重）。靜態陣列 text 直接回傳。
 */
export function unionBlocks(text, state1, state2) {
  if (Array.isArray(text)) return text;
  if (typeof text !== "function") return [];

  const arr1 = text(state1) ?? [];
  const arr2 = text(state2) ?? [];
  const seen = new Set();
  const result = [];
  for (const block of [...arr1, ...arr2]) {
    const key = JSON.stringify(block);
    if (!seen.has(key)) {
      seen.add(key);
      result.push(block);
    }
  }
  return result;
}

// ── 覆蓋率 ──────────────────────────────────────────────────

/** 合併區間、算出底本字符被收錄的比例。 */
export function computeCoverage(intervals, totalLen) {
  if (totalLen === 0) return { covered: 0, total: 0, percent: 0 };
  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
  let covered = 0;
  let curStart = null;
  let curEnd = null;
  for (const [s, e] of sorted) {
    if (curStart === null) {
      curStart = s;
      curEnd = e;
      continue;
    }
    if (s <= curEnd) {
      curEnd = Math.max(curEnd, e);
    } else {
      covered += curEnd - curStart;
      curStart = s;
      curEnd = e;
    }
  }
  if (curStart !== null) covered += curEnd - curStart;
  return { covered, total: totalLen, percent: totalLen === 0 ? 0 : (covered / totalLen) * 100 };
}

/** 在其他章的底本字串中找 normJp，回傳最先命中的章號，找不到回傳 null。 */
export function findInOtherChapters(normJp, allChapterSources, excludeChapterNum) {
  for (const [numStr, src] of Object.entries(allChapterSources)) {
    const num = Number(numStr);
    if (num === excludeChapterNum) continue;
    if (src.length > 0 && src.includes(normJp)) return num;
  }
  return null;
}

// ── 單章檢查 ────────────────────────────────────────────────

/**
 * 檢查單一章節 chapter data 對底本的忠實度。
 * chapterSource / allChapterSources 皆為已正規化的字串。
 */
export function checkChapter(chapter, chapterNum, chapterSource, allChapterSources) {
  const errors = [];
  const warnings = [];
  const coverageIntervals = [];
  let legacyCount = 0;

  if (chapterSource === undefined) {
    errors.push(`Chapter ${chapterNum}: 底本找不到對應章節（【第${chapterNum}章】marker 缺失）`);
    return { errors, warnings, coverage: { covered: 0, total: 0, percent: 0 } };
  }

  const { flags, notebook } = collectFlagsAndNotebook(chapter);
  const state1 = { choicesMade: {}, notebook: [] };
  const state2 = { choicesMade: Object.fromEntries(flags.map((f) => [f, true])), notebook };

  for (const [sceneId, scene] of Object.entries(chapter.scenes ?? {})) {
    const blocks = unionBlocks(scene.text, state1, state2);

    for (const block of blocks) {
      if (!block || !ORIGIN_BLOCK_TYPES.has(block.type)) continue;
      const origin = block.origin;

      if (origin === "source") {
        if (!block.jp || block.jp.trim() === "") {
          // E2
          errors.push(`E2 [CH${chapterNum}/${sceneId}]: origin:"source" 但 jp 缺失或為空`);
          continue;
        }
        const normJp = normalize(block.jp);
        const idx = chapterSource.indexOf(normJp);
        if (idx === -1) {
          // E1
          const foundIn = findInOtherChapters(normJp, allChapterSources, chapterNum);
          const preview = block.jp.slice(0, 30);
          const hint = foundIn !== null ? `（出現在第${foundIn}章，疑似錯章）` : "";
          errors.push(`E1 [CH${chapterNum}/${sceneId}]: jp "${preview}…" 不是本章底本子字串${hint}`);
        } else {
          coverageIntervals.push([idx, idx + normJp.length]);
        }
      } else {
        // added / legacy
        if (typeof block.jp === "string" && block.jp.length >= W1_MIN_LENGTH) {
          const normJp = normalize(block.jp);
          if (normJp.length > 0 && chapterSource.includes(normJp)) {
            // W1
            const preview = block.jp.slice(0, 20);
            warnings.push(`W1 [CH${chapterNum}/${sceneId}]: jp "${preview}…" 應標記為 origin:"source"`);
          }
        }
        if (origin === undefined) legacyCount++;
      }
    }

    if (Array.isArray(scene.choices)) {
      for (const choice of scene.choices) {
        if (choice.sourceJp) {
          const normSourceJp = normalize(choice.sourceJp);
          if (!chapterSource.includes(normSourceJp)) {
            // E3
            const preview = choice.sourceJp.slice(0, 30);
            errors.push(`E3 [CH${chapterNum}/${sceneId}]: choice.sourceJp "${preview}…" 不是本章底本子字串`);
          }
        }
      }
    }
  }

  if (legacyCount > 0) {
    // W2（彙總一行）
    warnings.push(`W2 [CH${chapterNum}]: ${legacyCount} 個 block 缺 origin（legacy）`);
  }

  const coverage = computeCoverage(coverageIntervals, chapterSource.length);

  return { errors, warnings, coverage };
}

// ── Chapter 載入（複用 validate-chapters.js 的載入方式） ────

function extractChapter(mod) {
  for (const val of Object.values(mod)) {
    if (val && typeof val === "object" && val.scenes && val.startScene) {
      return val;
    }
  }
  return null;
}

async function loadChapters() {
  const files = (await readdir(CHAPTERS_DIR)).filter((f) => /^chapter\d+\.js$/.test(f)).sort();
  const chapters = [];
  for (const file of files) {
    const url = pathToFileURL(resolve(CHAPTERS_DIR, file)).href;
    const mod = await import(url);
    const chapter = extractChapter(mod);
    if (chapter) chapters.push({ chapter, file });
  }
  return chapters;
}

// ── 主流程 ──────────────────────────────────────────────────

async function main() {
  const rawSource = await readFile(SOURCE_PATH, "utf-8");
  const allChapterSources = splitChapters(rawSource);

  const loaded = await loadChapters();
  if (loaded.length === 0) {
    console.error("No chapter files found in src/data/chapters/");
    process.exit(1);
  }

  console.log(`Fidelity check against: ${SOURCE_PATH}`);
  console.log(`Found ${loaded.length} chapter file(s)\n`);

  const results = [];
  for (const { chapter, file } of loaded) {
    const chapterNum = chapter.chapter;
    const chapterSource = allChapterSources[chapterNum];
    const { errors, warnings, coverage } = checkChapter(chapter, chapterNum, chapterSource, allChapterSources);
    results.push({ chapterNum, file, title: chapter.title, titleCn: chapter.titleCn, errors, warnings, coverage });
    printSummary({ chapterNum, file, title: chapter.title, titleCn: chapter.titleCn, errors, warnings, coverage });
  }

  const totalErrors = results.reduce((n, r) => n + r.errors.length, 0);
  const totalWarnings = results.reduce((n, r) => n + r.warnings.length, 0);
  console.log(`── Fidelity summary: ${totalErrors} error(s), ${totalWarnings} warning(s) ──\n`);

  process.exit(totalErrors > 0 ? 1 : 0);
}

function printSummary({ chapterNum, file, title, titleCn, errors, warnings, coverage }) {
  const ok = errors.length === 0;
  const icon = ok ? "✓" : "✗";
  console.log(`  ${icon} CH${chapterNum} ${title ?? "?"}（${titleCn ?? ""}）— ${file}`);

  if (errors.length > 0) {
    console.log(`    Errors (${errors.length}):`);
    errors.forEach((e) => console.log(`      - ${e}`));
  }
  if (warnings.length > 0) {
    console.log(`    Warnings (${warnings.length}):`);
    warnings.forEach((w) => console.log(`      - ${w}`));
  }

  const pct = coverage.total === 0 ? "0.0" : coverage.percent.toFixed(1);
  console.log(`    CH${chapterNum} coverage: ${pct}% (${coverage.covered}/${coverage.total} chars)`);
  console.log();
}

// ── Run ────────────────────────────────────────────────────

const isDirectRun =
  process.argv[1] && fileURLToPath(import.meta.url) === fileURLToPath(pathToFileURL(resolve(process.argv[1])).href);

if (isDirectRun) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
