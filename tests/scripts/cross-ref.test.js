import { describe, it, expect } from "vitest";
import { validateChapter } from "../../scripts/validate-chapters.js";
import { resolveConnections } from "../../src/engine/connections.js";

function makeChapter(overrides = {}) {
  return {
    chapter: 1,
    title: "T",
    titleCn: "t",
    startScene: "s1",
    startLocation: overrides.startLocation ?? "loc_a",
    sceneCount: undefined,
    locations: overrides.locations ?? [
      { id: "loc_a", label: "A", sub: "", x: 0, y: 0, shape: "circle", symbolKey: "raincoat_station" },
    ],
    connections: overrides.connections ?? [],
    scenes: overrides.scenes ?? {
      s1: {
        id: "s1",
        text: [{ type: "narration", content: "x" }],
        choices: null,
        next: null,
        effects: null,
        flags: [],
        notebook: null,
        links: { showEnd: true },
      },
    },
  };
}

describe("cross-reference validation", () => {
  it("startLocation must exist in locations[]", () => {
    const ch = makeChapter({ startLocation: "nonexistent" });
    const report = validateChapter(ch, "test.js");
    expect(report.errors.some((e) => e.includes("startLocation") && e.includes("nonexistent"))).toBe(true);
  });

  it("links.visit must reference valid location", () => {
    const ch = makeChapter({
      scenes: {
        s1: {
          id: "s1", text: [{ type: "narration", content: "x" }],
          choices: null, next: null, effects: null, flags: [],
          notebook: null, links: { visit: "fake_place", showEnd: true },
        },
      },
    });
    const report = validateChapter(ch, "test.js");
    expect(report.errors.some((e) => e.includes("links.visit") && e.includes("fake_place"))).toBe(true);
  });

  it("links.unlock warns on unknown symbol key", () => {
    const ch = makeChapter({
      scenes: {
        s1: {
          id: "s1", text: [{ type: "narration", content: "x" }],
          choices: null, next: null, effects: null, flags: [],
          notebook: null, links: { unlock: "unknown_symbol_xyz", showEnd: true },
        },
      },
    });
    const report = validateChapter(ch, "test.js");
    expect(report.warnings.some((w) => w.includes("links.unlock") && w.includes("unknown_symbol_xyz"))).toBe(true);
  });

  it("choice.unlock warns on unknown symbol key", () => {
    const ch = makeChapter({
      scenes: {
        s1: {
          id: "s1", text: [{ type: "narration", content: "x" }],
          choices: [{ text: "A", next: "s1", flag: "f", effects: null, notebook: null, unlock: "bad_sym" }],
          next: null, effects: null, flags: ["f"],
          notebook: null, links: { showEnd: true },
        },
      },
    });
    const report = validateChapter(ch, "test.js");
    expect(report.warnings.some((w) => w.includes("choice.unlock") && w.includes("bad_sym"))).toBe(true);
  });

  it("connection.requires warns on unknown key", () => {
    const ch = makeChapter({
      connections: [{ id: "c1", requires: ["nonexistent_key"], title: "T", insightGain: 1 }],
    });
    const report = validateChapter(ch, "test.js");
    expect(report.warnings.some((w) => w.includes("requires") && w.includes("nonexistent_key"))).toBe(true);
  });

  it("duplicate connection.id produces error", () => {
    const ch = makeChapter({
      connections: [
        { id: "dup_conn", requires: [], title: "A", insightGain: 1 },
        { id: "dup_conn", requires: [], title: "B", insightGain: 1 },
      ],
    });
    const report = validateChapter(ch, "test.js");
    expect(report.errors.some((e) => e.includes("Duplicate connection") && e.includes("dup_conn"))).toBe(true);
  });

  it("flags completeness warns on undeclared flag", () => {
    const ch = makeChapter({
      scenes: {
        s1: {
          id: "s1", text: [{ type: "narration", content: "x" }],
          choices: [
            { text: "A", next: "s1", flag: "flag_a", effects: null, notebook: null, unlock: null },
            { text: "B", next: "s1", flag: "flag_b", effects: null, notebook: null, unlock: null },
          ],
          next: null, effects: null,
          flags: ["flag_a"],
          notebook: null, links: { showEnd: true },
        },
      },
    });
    const report = validateChapter(ch, "test.js");
    expect(report.warnings.some((w) => w.includes("flag_b") && w.includes("not listed"))).toBe(true);
  });

  it("flags completeness warns on extra declared flag", () => {
    const ch = makeChapter({
      scenes: {
        s1: {
          id: "s1", text: [{ type: "narration", content: "x" }],
          choices: [{ text: "A", next: "s1", flag: "flag_a", effects: null, notebook: null, unlock: null }],
          next: null, effects: null,
          flags: ["flag_a", "phantom_flag"],
          notebook: null, links: { showEnd: true },
        },
      },
    });
    const report = validateChapter(ch, "test.js");
    expect(report.warnings.some((w) => w.includes("phantom_flag") && w.includes("no choice defines"))).toBe(true);
  });

  it("location shape warns on unknown value", () => {
    const ch = makeChapter({
      locations: [{ id: "loc_a", label: "A", sub: "", x: 0, y: 0, shape: "hexagon" }],
    });
    const report = validateChapter(ch, "test.js");
    expect(report.warnings.some((w) => w.includes("shape") && w.includes("hexagon"))).toBe(true);
  });

  it("location symbolKey warns on unknown symbol", () => {
    const ch = makeChapter({
      locations: [{ id: "loc_a", label: "A", sub: "", x: 0, y: 0, shape: "circle", symbolKey: "totally_fake" }],
    });
    const report = validateChapter(ch, "test.js");
    expect(report.warnings.some((w) => w.includes("symbolKey") && w.includes("totally_fake"))).toBe(true);
  });

  it("CH1 real data passes with zero errors", async () => {
    const { CHAPTER_01 } = await import("../../src/data/chapters/chapter01.js");
    const report = validateChapter(CHAPTER_01, "chapter01.js");
    expect(report.errors).toHaveLength(0);
  });

  it("CH2 real data passes with zero errors when validated with CH1 priorNotebookKeys", async () => {
    const { CHAPTER_01 } = await import("../../src/data/chapters/chapter01.js");
    const { CHAPTER_02 } = await import("../../src/data/chapters/chapter02.js");
    const prior = new Set();
    for (const scene of Object.values(CHAPTER_01.scenes)) {
      if (scene.notebook?.key) prior.add(scene.notebook.key);
      for (const c of scene.choices ?? []) {
        if (c.notebook?.key) prior.add(c.notebook.key);
      }
    }
    expect(prior.has("raincoat_death")).toBe(true);
    const report = validateChapter(CHAPTER_02, "chapter02.js", prior);
    expect(report.errors).toHaveLength(0);
  });

  it("cross-chapter connection ch02.raincoat_returns can actually be triggered by real engine logic", async () => {
    const { CHAPTER_02 } = await import("../../src/data/chapters/chapter02.js");
    const conn = CHAPTER_02.connections.find((c) => c.id === "ch02.raincoat_returns");
    expect(conn).toBeDefined();

    // Simulate a player who carried the CH1 grandfathered key "raincoat_death"
    // into CH2's notebook (as save/continue does), then reached CH2's
    // ch2_hospital_return scene which grants "ch02.raincoat_hotel".
    const state = {
      nerve: 5,
      insight: 0,
      currentChapter: 2,
      notebook: [
        { key: "raincoat_death", symbol: "raincoat", desc: "姊夫轢死——穿著與季節不符的雨衣" },
        { key: "ch02.raincoat_hotel", symbol: "raincoat", desc: "旅館玄關——穿雨衣的男人在與綠制服的車伕爭吵。你調頭離開" },
      ],
      choicesMade: {},
      connections: [],
    };

    const formed = resolveConnections(state, CHAPTER_02.connections);
    expect(formed.map((c) => c.id)).toContain("ch02.raincoat_returns");

    // Without the CH1 key carried over, it must not fire.
    const withoutCarryOver = { ...state, notebook: state.notebook.slice(1) };
    const formedWithout = resolveConnections(withoutCarryOver, CHAPTER_02.connections);
    expect(formedWithout.map((c) => c.id)).not.toContain("ch02.raincoat_returns");
  });

  it("connection.requires satisfied by priorNotebookKeys emits carryOver info instead of missing warning", () => {
    const ch = makeChapter({
      chapter: 2,
      connections: [{ id: "ch02.cross_conn", requires: ["prior_key"], title: "T", insightGain: 1 }],
    });
    const prior = new Set(["prior_key"]);
    const report = validateChapter(ch, "test.js", prior);
    expect(report.warnings.some((w) => w.includes("carryOver") && w.includes("prior_key"))).toBe(true);
    expect(report.warnings.some((w) => w.includes("not found"))).toBe(false);
  });

  it("connection.requires truly missing key still warns even with priorNotebookKeys", () => {
    const ch = makeChapter({
      chapter: 2,
      connections: [{ id: "ch02.bad_conn", requires: ["nowhere_key"], title: "T", insightGain: 1 }],
    });
    const prior = new Set(["other_key"]);
    const report = validateChapter(ch, "test.js", prior);
    expect(report.warnings.some((w) => w.includes("not found") && w.includes("nowhere_key"))).toBe(true);
  });
});
