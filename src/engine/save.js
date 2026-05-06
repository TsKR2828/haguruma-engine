const SAVE_KEY = "haguruma_save_v1";
const CURRENT_VERSION = 2;
let _memorySave = null;

const migrations = {
  1: (data) => ({ ...data, v: 2, nextScene: data.scene }),
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
  return {
    v: CURRENT_VERSION,
    scene: state.currentSceneId,
    nextScene,
    nerve: state.nerve,
    insight: state.insight,
    writing: state.writing,
    notebook: state.notebook,
    choicesMade: state.choicesMade,
    journey: state.journey,
    connections: state.connections,
    currentChapter: state.currentChapter,
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
  let data = null;
  try { data = localStorage.getItem(SAVE_KEY); } catch (_) {}
  if (!data) { try { data = sessionStorage.getItem(SAVE_KEY); } catch (_) {} }
  if (!data) data = _memorySave;
  if (!data) return null;
  try {
    const parsed = JSON.parse(data);
    return migrate(parsed);
  } catch (_) { return null; }
}

export function hasSave() {
  const s = loadSave();
  return !!(s && s.scene);
}

export function clearSave() {
  _memorySave = null;
  try { localStorage.removeItem(SAVE_KEY); } catch (_) {}
  try { sessionStorage.removeItem(SAVE_KEY); } catch (_) {}
}

export function restoreState(saved) {
  return {
    currentSceneId: saved.nextScene !== undefined ? saved.nextScene : saved.scene,
    currentChapter: saved.currentChapter || 1,
    nerve: saved.nerve,
    insight: saved.insight,
    writing: saved.writing,
    notebook: saved.notebook || [],
    choicesMade: saved.choicesMade || {},
    journey: saved.journey || { current: null, visited: [], symbols: {} },
    connections: saved.connections || [],
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
