import { describe, it, expect } from "vitest";
import { buildSaveData, restoreState, importSave } from "../../src/engine/save.js";

describe("save v2: nextScene cursor", () => {
  const baseState = {
    currentSceneId: "scene_A",
    currentChapter: 1,
    nerve: 7,
    insight: 3,
    writing: 2,
    notebook: [{ key: "k1", symbol: "gear", desc: "d" }],
    choicesMade: { flag_x: true },
    journey: { current: "loc1", visited: ["loc1"], symbols: {} },
    connections: ["conn_1"],
  };

  it("buildSaveData includes nextScene field", () => {
    const save = buildSaveData(baseState, "scene_B");
    expect(save.v).toBe(2);
    expect(save.scene).toBe("scene_A");
    expect(save.nextScene).toBe("scene_B");
    expect(save.nerve).toBe(7);
    expect(save.savedAt).toBeGreaterThan(0);
  });

  it("buildSaveData defaults nextScene to null", () => {
    const save = buildSaveData(baseState);
    expect(save.nextScene).toBeNull();
  });

  it("restoreState uses nextScene as currentSceneId", () => {
    const save = buildSaveData(baseState, "scene_B");
    const restored = restoreState(save);
    expect(restored.currentSceneId).toBe("scene_B");
    expect(restored.nerve).toBe(7);
    expect(restored.notebook).toEqual(baseState.notebook);
  });

  it("restoreState with nextScene=null yields null currentSceneId (ending)", () => {
    const save = buildSaveData(baseState, null);
    const restored = restoreState(save);
    expect(restored.currentSceneId).toBeNull();
  });

  it("restoreState falls back to scene for v1 saves (no nextScene field)", () => {
    const v1Save = { scene: "scene_A", nerve: 10, insight: 0, writing: 0 };
    const restored = restoreState(v1Save);
    expect(restored.currentSceneId).toBe("scene_A");
  });

  it("v1 save migrates to v2 via importSave", () => {
    const v1 = JSON.stringify({ v: 1, scene: "scene_A", nerve: 8, insight: 2, writing: 1 });
    const restored = importSave(v1);
    expect(restored.currentSceneId).toBe("scene_A");
    expect(restored.nerve).toBe(8);
  });

  it("importSave round-trips v2 save correctly", () => {
    const save = buildSaveData(baseState, "scene_C");
    const json = JSON.stringify(save);
    const restored = importSave(json);
    expect(restored.currentSceneId).toBe("scene_C");
    expect(restored.nerve).toBe(baseState.nerve);
    expect(restored.choicesMade).toEqual(baseState.choicesMade);
    expect(restored.connections).toEqual(baseState.connections);
  });

  it("effects are not double-applied when restoring to nextScene", () => {
    const stateAfterEffects = { ...baseState, nerve: 5, writing: 4 };
    const save = buildSaveData(stateAfterEffects, "scene_B");
    const restored = restoreState(save);
    expect(restored.nerve).toBe(5);
    expect(restored.writing).toBe(4);
  });
});
