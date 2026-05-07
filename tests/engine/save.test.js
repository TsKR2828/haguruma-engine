import { describe, it, expect, vi } from "vitest";
import { buildSaveData, restoreState, importSave, loadSave } from "../../src/engine/save.js";

describe("save v3: connection objects", () => {
  const baseState = {
    currentSceneId: "scene_A",
    currentChapter: 1,
    nerve: 7,
    insight: 3,
    writing: 2,
    notebook: [{ key: "k1", symbol: "gear", desc: "d" }],
    choicesMade: { flag_x: true },
    journey: { current: "loc1", visited: ["loc1"], symbols: {} },
    connections: [{ id: "conn_1", title: "Test", subtitle: null, icon: null, chapter: 1 }],
  };

  it("buildSaveData includes nextScene field", () => {
    const save = buildSaveData(baseState, "scene_B");
    expect(save.v).toBe(3);
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

  it("v2 save migrates connections from string[] to object[]", () => {
    const v2 = JSON.stringify({
      v: 2, scene: "scene_A", nextScene: "scene_B",
      nerve: 8, insight: 2, writing: 1,
      connections: ["raincoat_double", "worm_chain"],
    });
    const restored = importSave(v2);
    expect(restored.connections).toHaveLength(2);
    expect(restored.connections[0]).toEqual({ id: "raincoat_double" });
    expect(restored.connections[1]).toEqual({ id: "worm_chain" });
  });

  it("v2 save with empty connections migrates cleanly", () => {
    const v2 = JSON.stringify({
      v: 2, scene: "scene_A", nextScene: null,
      nerve: 10, insight: 0, writing: 0, connections: [],
    });
    const restored = importSave(v2);
    expect(restored.connections).toEqual([]);
  });

  it("unknown future fields round-trip through save/restore (I3 exclusion)", () => {
    const stateWithExtra = {
      ...baseState,
      playstyle: { insight: 3, variant: 2, canon: 1 },
      customFlag: "future",
    };
    const save = buildSaveData(stateWithExtra, "scene_B");
    expect(save.playstyle).toEqual({ insight: 3, variant: 2, canon: 1 });
    expect(save.customFlag).toBe("future");

    const restored = restoreState(save);
    expect(restored.playstyle).toEqual({ insight: 3, variant: 2, canon: 1 });
    expect(restored.customFlag).toBe("future");
    expect(restored.currentSceneId).toBe("scene_B");
  });

  it("restoreState provides defaults for missing fields in legacy saves", () => {
    const minimal = { scene: "prologue", nerve: 5 };
    const restored = restoreState(minimal);
    expect(restored.currentSceneId).toBe("prologue");
    expect(restored.nerve).toBe(5);
    expect(restored.notebook).toEqual([]);
    expect(restored.choicesMade).toEqual({});
    expect(restored.connections).toEqual([]);
    expect(restored.journey).toEqual({ current: null, visited: [], symbols: {} });
    expect(restored.currentChapter).toBe(1);
  });
});

describe("loadSave fallback on corrupted new key", () => {
  const validV3 = JSON.stringify({ v: 3, scene: "scene_A", nextScene: "scene_B", nerve: 7, insight: 0, writing: 0, connections: [] });

  it("falls back to legacy key when new key has corrupted JSON", () => {
    const store = { haguruma_save: "{corrupted!", haguruma_save_v1: validV3 };
    const mock = { getItem: vi.fn((k) => store[k] ?? null), setItem: vi.fn(), removeItem: vi.fn() };
    vi.stubGlobal("localStorage", mock);
    vi.stubGlobal("sessionStorage", { getItem: vi.fn(() => null), setItem: vi.fn(), removeItem: vi.fn() });
    const result = loadSave();
    expect(result).not.toBeNull();
    expect(result.scene).toBe("scene_A");
    vi.unstubAllGlobals();
  });
});
