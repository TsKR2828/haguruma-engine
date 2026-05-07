import { initialState } from "./state.js";

const SAVE_KEY = "haguruma_save";
const LEGACY_SAVE_KEY = "haguruma_save_v1";
const CURRENT_VERSION = 3;
let _memorySave = null;

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

export function buildSaveData(state, nextScene = null) {
  const { currentSceneId, ...gameState } = state;
  return {
    ...gameState,
    v: CURRENT_VERSION,
    scene: currentSceneId,
    nextScene,
    savedAt: Date.now(),
  };
}

export function saveGame(state, nextScene = null) {
  if (!state.currentSceneId) return false;
  const data = JSON.stringify(buildSaveData(state, nextScene));
  _memorySave = data;
  let persisted = false;
  try { localStorage.setItem(SAVE_KEY, data); persisted = true; } catch (_) {}
  try { sessionStorage.setItem(SAVE_KEY, data); persisted = true; } catch (_) {}
  if (!persisted) {
    console.warn("[haguruma] save failed: storage unavailable, using memory only");
  }
  return persisted;
}

export function loadSave() {
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

export function hasSave() {
  const s = loadSave();
  return !!(s && s.scene);
}

export function clearSave() {
  _memorySave = null;
  try { localStorage.removeItem(SAVE_KEY); } catch (_) {}
  try { localStorage.removeItem(LEGACY_SAVE_KEY); } catch (_) {}
  try { sessionStorage.removeItem(SAVE_KEY); } catch (_) {}
  try { sessionStorage.removeItem(LEGACY_SAVE_KEY); } catch (_) {}
}

export function restoreState(saved) {
  const { v, scene, nextScene, savedAt, ...rest } = saved;
  // Filter out null/undefined so initialState defaults take effect
  const clean = Object.fromEntries(
    Object.entries(rest).filter(([_, val]) => val != null)
  );
  return {
    ...initialState,
    ...clean,
    currentSceneId: nextScene !== undefined ? nextScene : scene,
  };
}

export function exportSave(state) {
  return JSON.stringify(buildSaveData(state, state.currentSceneId), null, 2);
}

export function importSave(json) {
  try {
    const parsed = typeof json === "string" ? JSON.parse(json) : json;
    if (!parsed || !parsed.scene) return null;
    return restoreState(migrate(parsed));
  } catch (_) {
    return null;
  }
}
