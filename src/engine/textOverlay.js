// ═══════════════════════════════════════════════════════════
// 編輯器潤飾模式 — overlay store
// 規格：docs/batch-f5-ux.md §Lane E-1
//
// 存放月月在遊戲畫面直接改字的暫存修改（localStorage），供
// HagurumaEngine 渲染前套用（WYSIWYG）、供匯出 patch 交
// scripts/apply-text-patch.js 套回源檔。
//
// 僅 import.meta.env.DEV 下被呼叫（呼叫端負責判斷，見
// HagurumaEngine.jsx）；本檔本身對 localStorage 的存取一律
// try/catch 防禦（比照 src/engine/save.js 慣例），非瀏覽器環境
// （如 node 測試）不會拋錯，只是靜默無法持久化。
// ═══════════════════════════════════════════════════════════

import { BOOK } from "../bookLoader.js";

// key 前綴由 book.id 派生（施工圖 §1 S1）。haguruma 的既有 key 名不變——
// book.id === "haguruma" 使下面的常數與重構前逐字相同。
const STORAGE_KEY = `${BOOK.id}_overlay_v1`;

// ── 底層 store I/O ──────────────────────────────────────────

function loadAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (_) {
    return {};
  }
}

function saveAll(all) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch (_) {
    // 靜默失敗（無 localStorage 或配額爆滿）——不阻擋編輯流程。
  }
}

// ── Key 產生 ────────────────────────────────────────────────

/** block entry key：`${chapter}:${sceneId}:b${blockIndex}`（blockIndex 為場景 text 陣列的原始索引）。 */
export function blockKey(chapterNum, sceneId, blockIndex) {
  return `${chapterNum}:${sceneId}:b${blockIndex}`;
}

/** choice entry key：`${chapter}:${sceneId}:c${choiceIndex}`（choiceIndex 為資料原始索引，非 condition 過濾後的顯示索引）。 */
export function choiceKey(chapterNum, sceneId, choiceIndex) {
  return `${chapterNum}:${sceneId}:c${choiceIndex}`;
}

// ── CRUD API ────────────────────────────────────────────────

/** 取單一 key 的 overlay entry（含 orig 快照），無修改則回傳 null。 */
export function getOverlay(key) {
  const all = loadAll();
  return all[key] ?? null;
}

/** 取全部 overlay entries（key -> entry）。 */
export function getAllOverlays() {
  return loadAll();
}

/**
 * 寫入/更新一筆修改。changes 只放實際改動的欄位（如 {jp, cn} 或 {content} 或 {text}）。
 * orig 是原值快照——若該 key 已存在 entry，保留原本第一次記下的 orig（不被覆蓋），
 * 除非呼叫端明確傳入且目前尚無既有 entry。
 */
export function setOverlay(key, changes, orig) {
  const all = loadAll();
  const existingOrig = all[key]?.orig;
  const finalOrig = existingOrig !== undefined ? existingOrig : orig;
  all[key] = { ...changes, orig: finalOrig };
  saveAll(all);
  return all[key];
}

/** 移除單一 key 的修改（還原此塊）。 */
export function removeOverlay(key) {
  const all = loadAll();
  if (key in all) {
    delete all[key];
    saveAll(all);
  }
}

/** 清除全部修改。 */
export function clearAllOverlays() {
  saveAll({});
}

/** 目前總修改數（用於面板「匯出 patch (N)」的 N）。 */
export function countOverlays() {
  return Object.keys(loadAll()).length;
}

// ── Patch 匯出 ──────────────────────────────────────────────

function parseKey(key) {
  // `${chapter}:${sceneId}:b${index}` / `...:c${index}`
  const lastColon = key.lastIndexOf(":");
  const chapterNum = Number(key.slice(0, key.indexOf(":")));
  const sceneId = key.slice(key.indexOf(":") + 1, lastColon);
  const tail = key.slice(lastColon + 1); // "bN" or "cN"
  const kind = tail[0] === "c" ? "choice" : "block";
  const index = Number(tail.slice(1));
  return { chapterNum, sceneId, kind, index };
}

/**
 * 產出 patch 陣列：`[{key, chapter, sceneId, kind, index, field, oldValue, newValue}]`。
 * 一筆 overlay entry 可能改了多個欄位（如 dual block 的 jp+cn），會展開成多條 patch。
 */
export function exportPatch() {
  const all = loadAll();
  const patch = [];
  for (const [key, entry] of Object.entries(all)) {
    if (!entry || typeof entry !== "object") continue;
    const { chapterNum, sceneId, kind, index } = parseKey(key);
    const { orig, ...changed } = entry;
    for (const field of Object.keys(changed)) {
      patch.push({
        key,
        chapter: chapterNum,
        sceneId,
        kind,
        index,
        field,
        oldValue: orig?.[field] ?? null,
        newValue: changed[field],
      });
    }
  }
  return patch;
}

// ── 套用點 helpers（HagurumaEngine 渲染前呼叫） ──────────────

/** 場景 text 是動態函式 → 停用編輯（block index 不穩定）。 */
export function isDynamicSceneText(scene) {
  return typeof scene?.text === "function";
}

/** 對單一 block 套 overlay（若有）。locked=true（動態場景）時原樣回傳。 */
export function overlayBlock(block, chapterNum, sceneId, blockIndex, locked) {
  if (locked) return block;
  if (!block || block.type === "break" || block.type === "pause" || block.type === "system") {
    return block;
  }
  const ov = getOverlay(blockKey(chapterNum, sceneId, blockIndex));
  if (!ov) return block;
  const { orig, ...changes } = ov;
  return { ...block, ...changes };
}

/** 對整個（靜態）blocks 陣列套 overlay。locked=true 時原樣回傳（動態場景停用編輯）。 */
export function applyOverlayToBlocks(blocks, chapterNum, sceneId, locked) {
  if (locked || !Array.isArray(blocks)) return blocks;
  return blocks.map((b, i) => overlayBlock(b, chapterNum, sceneId, i, false));
}

/** 對單一 choice 套 overlay（choices 目前無動態場景例外，一律套用）。 */
export function overlayChoice(choice, chapterNum, sceneId, choiceIndex) {
  const ov = getOverlay(choiceKey(chapterNum, sceneId, choiceIndex));
  if (!ov) return choice;
  const { orig, ...changes } = ov;
  return { ...choice, ...changes };
}
