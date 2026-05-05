// Pure core (no browser dependency)
export { initialState, reducer } from "./state.js";
export { loseNerve, gainInsight, gainWriting, applyEffects } from "./effects.js";
export { corruptText } from "./corrupt.js";
export { resolveConnections, applyConnection } from "./connections.js";
export { getSceneById, resolveText, resolveChoices } from "./scenes.js";

// Browser adapters
export { playAmbient, playSfx, stopAllAudio, setVolumes } from "./audio.js";
export { saveGame, loadSave, hasSave, clearSave, restoreState, exportSave, importSave } from "./save.js";
export { loadSettings, saveSettings, getSettings, updateSettings, resetSettings } from "./settings.js";
