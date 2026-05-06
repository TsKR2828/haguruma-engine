import { describe, it, expect } from "vitest";
import { validateChapter } from "../../scripts/validate-chapters.js";

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
});
