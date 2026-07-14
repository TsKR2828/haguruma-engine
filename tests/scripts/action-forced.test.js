// Batch F6：action/forced block 的 validator + 模擬器測試。
// 規格：docs/batch-f6-inline-actions.md §3。

import { describe, it, expect } from "vitest";
import { validateActionForced, validateChapter, simulate } from "../../scripts/validate-chapters.js";

function makeChapter(num, scenes) {
  return { chapter: num, scenes };
}

describe("validateActionForced", () => {
  it("action block with non-empty prompt and origin:added passes clean", () => {
    const ch = makeChapter(1, {
      s1: { text: [{ type: "action", origin: "added", prompt: "站起來。" }] },
    });
    const errors = [];
    validateActionForced(ch, errors);
    expect(errors).toHaveLength(0);
  });

  it("action block missing prompt is an error", () => {
    const ch = makeChapter(1, {
      s1: { text: [{ type: "action", origin: "added" }] },
    });
    const errors = [];
    validateActionForced(ch, errors);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain("non-empty \"prompt\"");
  });

  it("action block with blank/whitespace-only prompt is an error", () => {
    const ch = makeChapter(1, {
      s1: { text: [{ type: "action", origin: "added", prompt: "   " }] },
    });
    const errors = [];
    validateActionForced(ch, errors);
    expect(errors).toHaveLength(1);
  });

  it("action block with origin other than added is an error", () => {
    const ch = makeChapter(1, {
      s1: { text: [{ type: "action", origin: "source", prompt: "站起來。" }] },
    });
    const errors = [];
    validateActionForced(ch, errors);
    expect(errors.some((e) => e.includes('origin:"added"'))).toBe(true);
  });

  it("forced block with non-empty steps[] and origin:added passes clean", () => {
    const ch = makeChapter(1, {
      s1: { text: [{ type: "forced", origin: "added", steps: ["按下。", "再按。"] }] },
    });
    const errors = [];
    validateActionForced(ch, errors);
    expect(errors).toHaveLength(0);
  });

  it("forced block with empty steps[] is an error", () => {
    const ch = makeChapter(1, {
      s1: { text: [{ type: "forced", origin: "added", steps: [] }] },
    });
    const errors = [];
    validateActionForced(ch, errors);
    expect(errors.some((e) => e.includes('non-empty "steps[]"'))).toBe(true);
  });

  it("forced block missing steps entirely is an error", () => {
    const ch = makeChapter(1, {
      s1: { text: [{ type: "forced", origin: "added" }] },
    });
    const errors = [];
    validateActionForced(ch, errors);
    expect(errors.some((e) => e.includes('non-empty "steps[]"'))).toBe(true);
  });

  it("forced block with a blank step in the array is an error", () => {
    const ch = makeChapter(1, {
      s1: { text: [{ type: "forced", origin: "added", steps: ["按下。", "  "] }] },
    });
    const errors = [];
    validateActionForced(ch, errors);
    expect(errors.some((e) => e.includes('non-empty "steps[]"'))).toBe(true);
  });

  it("forced block with origin other than added is an error", () => {
    const ch = makeChapter(1, {
      s1: { text: [{ type: "forced", origin: "added2", steps: ["按下。"] }] },
    });
    const errors = [];
    validateActionForced(ch, errors);
    expect(errors.some((e) => e.includes('origin:"added"'))).toBe(true);
  });

  it("applies to every chapter — no CH1/CH2 grandfathering (unlike origin checks)", () => {
    const ch1 = makeChapter(1, { s1: { text: [{ type: "action", origin: "added" }] } });
    const errors = [];
    validateActionForced(ch1, errors);
    expect(errors).toHaveLength(1);
  });

  it("narration/inner/dialogue/system/break/pause blocks are untouched", () => {
    const ch = makeChapter(3, {
      s1: {
        text: [
          { type: "narration", origin: "source", jp: "x", cn: "y" },
          { type: "system", content: "z" },
          { type: "break" },
          { type: "pause", duration: 500 },
        ],
      },
    });
    const errors = [];
    validateActionForced(ch, errors);
    expect(errors).toHaveLength(0);
  });

  it("resolves dynamic text() functions against the default state", () => {
    const ch = makeChapter(3, {
      s1: { text: () => [{ type: "action", origin: "added" }] },
    });
    const errors = [];
    validateActionForced(ch, errors);
    expect(errors).toHaveLength(1);
  });
});

describe("validateChapter integration: action/forced errors surface in the full report", () => {
  it("a scene with an invalid action block fails validateChapter", () => {
    const ch = {
      chapter: 1,
      title: "T",
      titleCn: "t",
      startScene: "s1",
      startLocation: undefined,
      sceneCount: 1,
      locations: [],
      connections: [],
      scenes: {
        s1: {
          id: "s1",
          text: [{ type: "action", origin: "added" }],
          choices: null,
          next: null,
          effects: null,
          flags: [],
          notebook: null,
          links: { showEnd: true },
        },
      },
    };
    const report = validateChapter(ch, "test.js");
    expect(report.errors.some((e) => e.includes('non-empty "prompt"'))).toBe(true);
  });
});

describe("simulate(): action/forced blocks are pass-through, action.effects applied", () => {
  it("does not break the scene graph — forced/action blocks are inert to flow", () => {
    const ch = {
      startScene: "s1",
      scenes: {
        s1: {
          id: "s1",
          text: [
            { type: "forced", origin: "added", steps: ["一", "二"] },
            { type: "action", origin: "added", prompt: "站起來。" },
          ],
          choices: null,
          next: null,
          links: { showEnd: true },
        },
      },
    };
    const result = simulate(ch, "first");
    expect(result.success).toBe(true);
    expect(result.reachedEnding).toBe(true);
  });

  it("applies action.effects to the simulated running state (nerve loss)", () => {
    const ch = {
      startScene: "s1",
      scenes: {
        s1: {
          id: "s1",
          text: [
            { type: "action", origin: "added", prompt: "站起來。", effects: { nerve: { amount: -3, reason: "test" } } },
          ],
          choices: null,
          next: null,
          links: { showEnd: true },
        },
      },
    };
    const result = simulate(ch, "first");
    expect(result.success).toBe(true);
    // initialState.nerve default is 10 in this engine (see engine/state.js).
    expect(result.state.nerve).toBe(7);
  });

  it("applies action.effects even when the action is inside a dynamic text() scene", () => {
    const ch = {
      startScene: "s1",
      scenes: {
        s1: {
          id: "s1",
          text: () => [
            { type: "action", origin: "added", prompt: "站起來。", effects: { insight: { amount: 2, reason: "test" } } },
          ],
          choices: null,
          next: null,
          links: { showEnd: true },
        },
      },
    };
    const result = simulate(ch, "first");
    expect(result.success).toBe(true);
    expect(result.state.insight).toBeGreaterThanOrEqual(2);
  });

  it("forced blocks (no effects field in schema) do not throw and do not alter stats", () => {
    const ch = {
      startScene: "s1",
      scenes: {
        s1: {
          id: "s1",
          text: [{ type: "forced", origin: "added", steps: ["一"] }],
          choices: null,
          next: null,
          links: { showEnd: true },
        },
      },
    };
    const result = simulate(ch, "first");
    expect(result.success).toBe(true);
  });
});
