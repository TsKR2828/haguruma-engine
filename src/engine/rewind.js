// ═══════════════════════════════════════════════════════════
// Lane R — 選項回溯
// 規格：docs/batch-f5-ux.md §Lane R
//
// 快照棧（sessionStorage，60 筆 FIFO，換章清空）：進入有 choices 的
// 場景時 push 快照（深拷貝 state，chosen:null）；玩家選擇後把棧頂
// chosen 填入 {index, text}。回溯時挑一個 checkpoint，截斷棧、恢復
// 該快照的 state。
//
// 已見標記（localStorage，跨回溯持久）：玩家選過的選項記一筆，供
// ChoiceList 渲染 ✓。
//
// 本檔為純邏輯 + 儲存 I/O（比照 src/engine/save.js / textOverlay.js
// 慣例：對 sessionStorage/localStorage 的存取一律 try/catch 防禦，
// 非瀏覽器環境不拋錯，只是靜默無法持久化）。
// ═══════════════════════════════════════════════════════════

const SESSION_KEY = "haguruma_rewind_v1";
const SEEN_KEY = "haguruma_choice_seen_v1";
const MAX_ENTRIES = 60;

// ── 深拷貝 ──────────────────────────────────────────────────

/** 深拷貝 state（notebook/choicesMade/journey/connections 等不得共享引用）。 */
export function cloneState(state) {
  if (typeof structuredClone === "function") return structuredClone(state);
  // 環境無 structuredClone（極舊 node/瀏覽器）時的保底 fallback；
  // 遊戲 state 全是可 JSON 序列化的純資料，等價。
  return JSON.parse(JSON.stringify(state));
}

// ── 快照棧 I/O（sessionStorage）─────────────────────────────

/**
 * 讀取本章的快照棧。儲存格式為單一 slot `{chapter, entries}`——
 * 若讀出的 chapter 與目前章節不同，視為「換章」，回傳空陣列
 * （不需要額外的清空動作，下一次 saveRewindStack 自然會用新章節
 * 覆寫掉舊資料）。
 */
export function loadRewindStack(chapterNum) {
  let raw = null;
  try {
    raw = sessionStorage.getItem(SESSION_KEY);
  } catch (_) {
    return [];
  }
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.chapter !== chapterNum || !Array.isArray(parsed.entries)) {
      return [];
    }
    return parsed.entries;
  } catch (_) {
    return [];
  }
}

export function saveRewindStack(chapterNum, entries) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ chapter: chapterNum, entries }));
  } catch (_) {
    // 靜默失敗（無 sessionStorage 或配額爆滿）——不阻擋遊戲流程。
  }
}

export function clearRewindStack() {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch (_) {}
}

// ── 快照棧操作（純函式，回傳新陣列）─────────────────────────

/**
 * 進入有 choices 的場景時呼叫：push 一筆快照 `{sceneId, state, chosen:null, historyLen}`。
 * state 會被深拷貝隔離。超過 MAX_ENTRIES 時從最舊（陣列頭）丟棄（FIFO）。
 * historyLen 記錄當下 HagurumaEngine 的 history 陣列長度，供回溯時把畫面
 * 上已捲入 scrollback 的「未來」場景截斷掉。
 */
export function pushSnapshot(entries, sceneId, state, historyLen = 0) {
  const entry = { sceneId, state: cloneState(state), chosen: null, historyLen };
  const next = [...entries, entry];
  if (next.length > MAX_ENTRIES) next.shift();
  return next;
}

/** 玩家選擇後，把棧頂（最新 push 的那筆）entry 的 chosen 填入 {index, text}。 */
export function markTopChosen(entries, index, text) {
  if (entries.length === 0) return entries;
  const next = entries.slice();
  next[next.length - 1] = { ...next[next.length - 1], chosen: { index, text } };
  return next;
}

/**
 * 回溯到 `pos` 這個 checkpoint：截斷棧至該點（含），並把該點的 chosen
 * 重置為 null（玩家即將在此重新選擇）。pos 之後的 entries 全部捨棄。
 */
export function truncateToCheckpoint(entries, pos) {
  if (pos < 0 || pos >= entries.length) return entries;
  const kept = entries.slice(0, pos + 1);
  kept[kept.length - 1] = { ...kept[kept.length - 1], chosen: null };
  return kept;
}

// ── 已見標記（localStorage，跨回溯持久）──────────────────────

export function choiceSeenKey(chapterNum, sceneId, choiceIndex) {
  return `${chapterNum}:${sceneId}:${choiceIndex}`;
}

function loadSeenSet() {
  try {
    const raw = localStorage.getItem(SEEN_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (_) {
    return {};
  }
}

function saveSeenSet(all) {
  try {
    localStorage.setItem(SEEN_KEY, JSON.stringify(all));
  } catch (_) {}
}

/** 選項是否已選過（跨回溯持久，不因截斷快照棧而消失）。 */
export function isChoiceSeen(key) {
  return loadSeenSet()[key] === true;
}

/** 標記某選項已選過。 */
export function markChoiceSeen(key) {
  const all = loadSeenSet();
  if (all[key] === true) return;
  all[key] = true;
  saveSeenSet(all);
}
