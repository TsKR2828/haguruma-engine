const SAVE_KEY = "haguruma_save_v1";
let _memorySave = null;

export function buildSaveData(state) {
  return {
    v: 1,
    scene: state.currentSceneId,
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

export function saveGame(state) {
  if (!state.currentSceneId) return;
  const data = JSON.stringify(buildSaveData(state));
  _memorySave = data;
  try { localStorage.setItem(SAVE_KEY, data); } catch (_) {}
  try { sessionStorage.setItem(SAVE_KEY, data); } catch (_) {}
}

export function loadSave() {
  let data = null;
  try { data = localStorage.getItem(SAVE_KEY); } catch (_) {}
  if (!data) { try { data = sessionStorage.getItem(SAVE_KEY); } catch (_) {} }
  if (!data) data = _memorySave;
  if (!data) return null;
  try { return JSON.parse(data); } catch (_) { return null; }
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
    currentSceneId: saved.scene,
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
  return JSON.stringify(buildSaveData(state), null, 2);
}

export function importSave(json) {
  try {
    const parsed = typeof json === "string" ? JSON.parse(json) : json;
    if (!parsed || !parsed.scene) return null;
    return restoreState(parsed);
  } catch (_) {
    return null;
  }
}
