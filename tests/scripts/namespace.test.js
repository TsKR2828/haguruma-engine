import { describe, it, expect } from "vitest";
import { validateNamespaces } from "../../scripts/validate-chapters.js";

function makeChapter(num, overrides = {}) {
  return {
    chapter: num,
    title: "Test",
    titleCn: "test",
    startScene: "s1",
    startLocation: "loc1",
    locations: overrides.locations ?? [{ id: `ch${String(num).padStart(2, "0")}.loc1`, label: "L", sub: "", x: 0, y: 0, shape: "circle" }],
    connections: overrides.connections ?? [],
    scenes: overrides.scenes ?? {
      s1: {
        id: "s1",
        text: [],
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

describe("namespace validation", () => {
  it("CH1 keys produce warnings only, no errors", () => {
    const ch1 = makeChapter(1, {
      locations: [{ id: "station", label: "S", sub: "", x: 0, y: 0, shape: "circle", symbolKey: "raincoat_station" }],
      connections: [{ id: "raincoat_double", requires: ["raincoat_station"], title: "T", insightGain: 1 }],
      scenes: {
        s1: {
          id: "s1", text: [], choices: [
            { text: "A", next: "s1", flag: "joke_response", effects: null, notebook: { key: "raincoat_station", symbol: "raincoat", desc: "d" }, unlock: "raincoat_station" },
          ],
          next: null, effects: null, flags: ["joke_response"],
          notebook: null, links: { unlock: "raincoat_station", showEnd: true },
        },
      },
    });
    const errors = [], warnings = [];
    validateNamespaces(ch1, errors, warnings);
    expect(errors).toHaveLength(0);
    expect(warnings.length).toBeGreaterThan(0);
    expect(warnings[0]).toContain("grandfathered");
  });

  it("CH2 keys with proper prefix pass", () => {
    const ch2 = makeChapter(2, {
      locations: [{ id: "ch02.ginza", label: "G", sub: "", x: 0, y: 0, shape: "circle", symbolKey: "ch02.shadow" }],
      connections: [{ id: "ch02.link1", requires: [], title: "T", insightGain: 1 }],
      scenes: {
        s1: {
          id: "s1", text: [], choices: [
            { text: "A", next: "s1", flag: "ch02.flag_a", effects: null, notebook: { key: "ch02.note1", symbol: "gear", desc: "d" }, unlock: "ch02.sym1" },
          ],
          next: null, effects: null, flags: ["ch02.flag_a"],
          notebook: { key: "ch02.auto_note", symbol: "gear", desc: "d" },
          links: { unlock: "ch02.unlock1", showEnd: true },
        },
      },
    });
    const errors = [], warnings = [];
    validateNamespaces(ch2, errors, warnings);
    expect(errors).toHaveLength(0);
  });

  it("CH2 keys without prefix produce errors", () => {
    const ch2 = makeChapter(2, {
      locations: [{ id: "ginza", label: "G", sub: "", x: 0, y: 0, shape: "circle" }],
      connections: [{ id: "bad_conn", requires: [], title: "T", insightGain: 1 }],
      scenes: {
        s1: {
          id: "s1", text: [], choices: [
            { text: "A", next: "s1", flag: "bad_flag", effects: null, notebook: null, unlock: "bad_unlock" },
          ],
          next: null, effects: null, flags: ["bad_flag"],
          notebook: { key: "bad_note", symbol: "gear", desc: "d" },
          links: { unlock: "bad_links_unlock", showEnd: true },
        },
      },
    });
    const errors = [], warnings = [];
    validateNamespaces(ch2, errors, warnings);
    expect(errors.length).toBeGreaterThanOrEqual(6);
    expect(errors.every((e) => e.includes('ch02.') || e.includes('global.'))).toBe(true);
  });

  it("global. prefixed keys pass for any non-exempt chapter", () => {
    const ch3 = makeChapter(3, {
      locations: [{ id: "global.hub", label: "H", sub: "", x: 0, y: 0, shape: "circle", symbolKey: "global.sym" }],
      connections: [{ id: "global.conn1", requires: [], title: "T", insightGain: 1 }],
      scenes: {
        s1: {
          id: "s1", text: [], choices: [
            { text: "A", next: "s1", flag: "global.flag", effects: null, notebook: { key: "global.note", symbol: "gear", desc: "d" }, unlock: "global.unlock" },
          ],
          next: null, effects: null, flags: ["global.flag"],
          notebook: null, links: { unlock: "global.scene_unlock", showEnd: true },
        },
      },
    });
    const errors = [], warnings = [];
    validateNamespaces(ch3, errors, warnings);
    expect(errors).toHaveLength(0);
  });
});
