import { BOOK } from "../bookLoader.js";
import { createInitialState } from "./state.js";

const CURRENT_VERSION = 3;

const migrations = {
  1: (data) => ({ ...data, v: 2, nextScene: data.scene }),
  2: (data) => ({
    ...data,
    v: 3,
    connections: (data.connections || []).map((c) =>
      typeof c === "string" ? { id: c } : c
    ),
  }),
};

function migrate(data) {
  if (!data || typeof data.v !== "number") return data;
  let current = data;
  while (current.v < CURRENT_VERSION) {
    const fn = migrations[current.v];
    if (!fn) break;
    current = fn(current);
  }
  return current;
}

// 純函式簽名統一收 book 參數（施工圖 §1 S1）：saveKey 讀 book.saveKey，
// legacy key 為 `${saveKey}_v1`（haguruma 的既有 key 名不變——book.id/
// saveKey 本來就是 "haguruma"/"haguruma_save"，派生結果與現行字面值逐字相同）。
export function createSaveModule(book) {
  const SAVE_KEY = book.saveKey;
  const LEGACY_SAVE_KEY = `${book.saveKey}_v1`;
  let _memorySave = null;

  function buildSaveData(state, nextScene = null) {
    const { currentSceneId, ...gameState } = state;
    return {
      ...gameState,
      v: CURRENT_VERSION,
      scene: currentSceneId,
      nextScene,
      savedAt: Date.now(),
    };
  }

  function saveGame(state, nextScene = null) {
    if (!state.currentSceneId) return false;
    const data = JSON.stringify(buildSaveData(state, nextScene));
    _memorySave = data;
    let persisted = false;
    try { localStorage.setItem(SAVE_KEY, data); persisted = true; } catch (_) {}
    try { sessionStorage.setItem(SAVE_KEY, data); persisted = true; } catch (_) {}
    if (!persisted) {
      console.warn(`[${book.id}] save failed: storage unavailable, using memory only`);
    }
    return persisted;
  }

  function loadSave() {
    const sources = [];
    try { sources.push(localStorage.getItem(SAVE_KEY)); } catch (_) {}
    try { sources.push(localStorage.getItem(LEGACY_SAVE_KEY)); } catch (_) {}
    try { sources.push(sessionStorage.getItem(SAVE_KEY)); } catch (_) {}
    try { sources.push(sessionStorage.getItem(LEGACY_SAVE_KEY)); } catch (_) {}
    sources.push(_memorySave);
    for (const data of sources) {
      if (!data) continue;
      try { return migrate(JSON.parse(data)); } catch (_) {}
    }
    return null;
  }

  function hasSave() {
    const s = loadSave();
    return !!(s && s.scene);
  }

  function clearSave() {
    _memorySave = null;
    try { localStorage.removeItem(SAVE_KEY); } catch (_) {}
    try { localStorage.removeItem(LEGACY_SAVE_KEY); } catch (_) {}
    try { sessionStorage.removeItem(SAVE_KEY); } catch (_) {}
    try { sessionStorage.removeItem(LEGACY_SAVE_KEY); } catch (_) {}
  }

  function restoreState(saved) {
    const { v, scene, nextScene, savedAt, ...rest } = saved;
    // Filter out null/undefined so initialState defaults take effect
    const clean = Object.fromEntries(
      Object.entries(rest).filter(([_, val]) => val != null)
    );
    return {
      ...createInitialState(book),
      ...clean,
      currentSceneId: nextScene !== undefined ? nextScene : scene,
    };
  }

  function exportSave(state) {
    return JSON.stringify(buildSaveData(state, state.currentSceneId), null, 2);
  }

  function importSave(json) {
    try {
      const parsed = typeof json === "string" ? JSON.parse(json) : json;
      if (!parsed || !parsed.scene) return null;
      return restoreState(migrate(parsed));
    } catch (_) {
      return null;
    }
  }

  return {
    buildSaveData,
    saveGame,
    loadSave,
    hasSave,
    clearSave,
    restoreState,
    exportSave,
    importSave,
  };
}

// haguruma 綁定版（向後相容，既有呼叫點不帶 book 參數；SAVE_KEY/LEGACY_SAVE_KEY
// 與重構前逐字相同："haguruma_save" / "haguruma_save_v1"）。
const hagurumaSave = createSaveModule(BOOK);

export const buildSaveData = hagurumaSave.buildSaveData;
export const saveGame = hagurumaSave.saveGame;
export const loadSave = hagurumaSave.loadSave;
export const hasSave = hagurumaSave.hasSave;
export const clearSave = hagurumaSave.clearSave;
export const restoreState = hagurumaSave.restoreState;
export const exportSave = hagurumaSave.exportSave;
export const importSave = hagurumaSave.importSave;
