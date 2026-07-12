// Batch F1-a — 底本轉換
// 讀取青空文庫《歯車》raw HTML（Shift_JIS）→ 產出逐字純文字底本（UTF-8）。
// 規格：docs/origin-marking-spec.md §4。可重跑，冪等（每次執行覆蓋輸出檔）。

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const SRC_PATH = resolve("reference/aozora/42377_34745_raw.html");
const OUT_PATH = resolve("reference/aozora/haguruma_original.txt");
const SRC_FILENAME = "42377_34745_raw.html";

// ── 外字（gaiji）對照表 ──────────────────────────────────────
// key：alt 注記文字中的可辨識子字串；value：對應正字。
// 遇到不在表中的注記，腳本必須報 error 並中止（不可靜默丟字，見規格 §4-4）。
const GAIJI_MAP = {
  "言＋墟のつくり": "噓", // U+5652。「うそ」（言われたことになる／である）
  "勹＜夕": "匆", // U+5306。與後面的「々」合為「匆々」（そうそう）
  "鼬」の「由」に代えて「晏」": "鼴", // U+9F34。與後面的「鼠」合為「鼴鼠」（もぐらもち）
  "グレーブアクセント付きE小文字": "è", // U+00E8。仏語「très」
  "目＋匡": "眶", // U+7736。「まぶた」
};

// ── 1. 讀檔 + Shift_JIS 解碼 ─────────────────────────────────

function loadRawHtml() {
  const buf = readFileSync(SRC_PATH);
  const decoder = new TextDecoder("shift_jis");
  return decoder.decode(buf);
}

// ── 2. 取出 main_text 區塊 ───────────────────────────────────

function extractMainText(html) {
  const startTag = '<div class="main_text">';
  const start = html.indexOf(startTag);
  if (start === -1) {
    throw new Error('找不到 <div class="main_text"> 區塊');
  }
  const contentStart = start + startTag.length;
  const end = html.indexOf("</div>", contentStart);
  if (end === -1) {
    throw new Error("main_text 區塊沒有對應的 </div>");
  }
  return html.slice(contentStart, end);
}

// ── 3. 外字處理 ──────────────────────────────────────────────
// <img gaiji="gaiji" src="..." alt="※（注記）" class="gaiji" /> → 對照表正字

function replaceGaiji(text) {
  const gaijiTagRe = /<img\b[^>]*\bclass="gaiji"[^>]*\/?>/g;
  const altRe = /alt="([^"]*)"/;
  const unresolved = [];
  const resolved = [];

  const replaced = text.replace(gaijiTagRe, (tag) => {
    const altMatch = tag.match(altRe);
    const alt = altMatch ? altMatch[1] : "";
    const key = Object.keys(GAIJI_MAP).find((k) => alt.includes(k));
    if (!key) {
      unresolved.push(alt);
      return tag; // 保留原 tag，讓後續檢查明顯抓到殘留
    }
    resolved.push({ alt, char: GAIJI_MAP[key] });
    return GAIJI_MAP[key];
  });

  if (unresolved.length > 0) {
    const list = unresolved.map((a, i) => `  ${i + 1}. ${a}`).join("\n");
    throw new Error(
      `發現 GAIJI_MAP 未涵蓋的外字注記，禁止靜默丟字，請人工補 map：\n${list}`
    );
  }

  return { text: replaced, resolved };
}

// ── ruby 剝除 ────────────────────────────────────────────────
// <ruby><rb>X</rb><rp>（</rp><rt>Y</rt><rp>）</rp></ruby> → X

function stripRuby(text) {
  return text
    .replace(/<rp>[^<]*<\/rp>/g, "")
    .replace(/<rt>[^<]*<\/rt>/g, "")
    .replace(/<\/?rb>/g, "")
    .replace(/<\/?ruby>/g, "");
}

// ── 其餘 tag 剝除（strong 傍點強調等）＋ <br /> 轉換行 ──────────

function stripRemainingTags(text) {
  let out = text.replace(/<br\s*\/?>/g, "\n");
  out = out.replace(/<\/?[a-zA-Z][^>]*>/g, "");
  return out;
}

// ── HTML entity 解碼（保險，避免殘留 &amp; 等）──────────────────

function decodeEntities(text) {
  return text
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");
}

// ── 6. 章節 marker 插入 ──────────────────────────────────────
// 章節標題行（如「　　　　　一　レエン・コオト」）前插入 marker 行 【第N章】。
// 一個 marker 同時作為前一章的結尾邊界與下一章的起始邊界，全文恰好 6 個 marker。

const CHAPTER_KANJI_TO_NUM = { 一: 1, 二: 2, 三: 3, 四: 4, 五: 5, 六: 6 };
const CHAPTER_TITLE_LINE_RE = /^　{5}([一二三四五六])　(.*)$/;

function insertChapterMarkers(text) {
  const lines = text.split("\n");
  const out = [];
  const found = [];
  for (const line of lines) {
    const m = line.match(CHAPTER_TITLE_LINE_RE);
    if (m) {
      const num = CHAPTER_KANJI_TO_NUM[m[1]];
      found.push(num);
      out.push(`【第${num}章】`);
    }
    out.push(line);
  }
  return { text: out.join("\n"), found };
}

// ── 主流程 ───────────────────────────────────────────────────

function main() {
  console.log(`讀取 ${SRC_PATH} ...`);
  const html = loadRawHtml();

  console.log("擷取 main_text ...");
  const mainTextHtml = extractMainText(html);

  console.log("處理外字（gaiji）...");
  const { text: afterGaiji, resolved } = replaceGaiji(mainTextHtml);

  console.log("剝除 ruby 標記...");
  const afterRuby = stripRuby(afterGaiji);

  console.log("剝除其餘 tag、<br /> 轉換行...");
  const afterTags = stripRemainingTags(afterRuby);

  console.log("解碼殘留 HTML entity...");
  const afterEntities = decodeEntities(afterTags);

  console.log("插入六章 marker...");
  const { text: afterMarkers, found } = insertChapterMarkers(afterEntities);

  const expectedChapters = [1, 2, 3, 4, 5, 6];
  const missing = expectedChapters.filter((n) => !found.includes(n));
  if (missing.length > 0) {
    throw new Error(
      `章節 marker 不齊全，缺少第 ${missing.join("、")} 章（找到：${found.join(",")}）`
    );
  }

  // 殘留 tag / entity 檢查（自我防呆，不應該發生）
  if (/[<>]/.test(afterMarkers.replace(/【第\d章】/g, ""))) {
    throw new Error("輸出文字中仍偵測到殘留的 < 或 > 字元，轉換未完全乾淨");
  }
  if (/&[a-zA-Z#0-9]+;/.test(afterMarkers)) {
    throw new Error("輸出文字中仍偵測到殘留的 HTML entity");
  }

  const convertedDate = new Date().toISOString().slice(0, 10);
  const metadata = [
    "",
    "# ---- 轉換 metadata ----",
    `# source: ${SRC_FILENAME}`,
    `# converted: ${convertedDate}`,
    `# gaiji_replaced: ${resolved.length}`,
    "# ------------------------",
    "",
  ].join("\n");

  const finalText = afterMarkers.trimEnd() + "\n" + metadata;

  writeFileSync(OUT_PATH, finalText, { encoding: "utf-8" });

  console.log(`\n完成，輸出 ${OUT_PATH}`);
  console.log(`總字數（含空白）：${finalText.length}`);
  console.log(`外字處理：${resolved.length} 處`);
  const gaijiSummary = {};
  for (const r of resolved) {
    gaijiSummary[r.char] = (gaijiSummary[r.char] || 0) + 1;
  }
  for (const [char, count] of Object.entries(gaijiSummary)) {
    console.log(`  ${char}: ${count} 次`);
  }
  console.log(`章節 marker：${found.map((n) => `第${n}章`).join("、")}`);
}

main();
