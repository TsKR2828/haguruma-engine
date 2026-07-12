import { describe, it, expect } from "vitest";
import { validateChapter, simulate } from "../../scripts/validate-chapters.js";

function makeChapter(overrides = {}) {
  return {
    chapter: 1,
    title: "T",
    titleCn: "t",
    startScene: "s1",
    startLocation: undefined,
    sceneCount: undefined,
    locations: [],
    connections: [],
    scenes: overrides.scenes,
  };
}

describe("Bug 1: choice missing next is a static error", () => {
  it("flags a choice with no next at all", () => {
    const ch = makeChapter({
      scenes: {
        s1: {
          id: "s1",
          text: [{ type: "narration", content: "x" }],
          choices: [{ text: "A", next: null, effects: null, notebook: null, unlock: null }],
          next: null,
          effects: null,
          flags: [],
          notebook: null,
          links: null,
        },
      },
    });
    const report = validateChapter(ch, "test.js");
    expect(report.errors.some((e) => e.includes('missing "next"') && e.includes('"A"'))).toBe(true);
  });

  it("does not flag a choice that has a valid next", () => {
    const ch = makeChapter({
      scenes: {
        s1: {
          id: "s1",
          text: [{ type: "narration", content: "x" }],
          choices: [{ text: "A", next: "s2", effects: null, notebook: null, unlock: null }],
          next: null,
          effects: null,
          flags: [],
          notebook: null,
          links: null,
        },
        s2: {
          id: "s2",
          text: [{ type: "narration", content: "y" }],
          choices: null,
          next: null,
          effects: null,
          flags: [],
          notebook: null,
          links: { showEnd: true },
        },
      },
    });
    const report = validateChapter(ch, "test.js");
    expect(report.errors.some((e) => e.includes('missing "next"'))).toBe(false);
  });
});

describe("Bug 1(a): a failed playthrough becomes a hard error", () => {
  it("promotes playthrough FAIL to report.errors (not just a warning)", () => {
    // Every choice at s1 is gated behind an always-false condition, so no
    // static check catches it (next points to a real scene), but every
    // simulated playthrough will find zero available choices at runtime.
    const ch = makeChapter({
      scenes: {
        s1: {
          id: "s1",
          text: [{ type: "narration", content: "x" }],
          choices: [
            { text: "A", next: "s2", effects: null, notebook: null, unlock: null, condition: () => false },
          ],
          next: null,
          effects: null,
          flags: [],
          notebook: null,
          links: null,
        },
        s2: {
          id: "s2",
          text: [{ type: "narration", content: "y" }],
          choices: null,
          next: null,
          effects: null,
          flags: [],
          notebook: null,
          links: { showEnd: true },
        },
      },
    });
    const report = validateChapter(ch, "test.js");
    expect(report.playthroughs.every((p) => !p.success)).toBe(true);
    expect(report.errors.some((e) => e.startsWith('Playthrough "') && e.includes("failed"))).toBe(true);
  });
});

describe("Bug 11(a): simulator executes choice.condition", () => {
  it("never picks a choice whose condition is not satisfied", () => {
    const ch = {
      startScene: "s1",
      scenes: {
        s1: {
          id: "s1",
          text: [],
          choices: [
            { text: "locked", next: "s2", condition: (s) => s.insight >= 999 },
            { text: "open", next: "s2" },
          ],
          next: null,
        },
        s2: { id: "s2", text: [], choices: null, next: null, links: { showEnd: true } },
      },
    };
    const result = simulate(ch, "first");
    expect(result.success).toBe(true);
    expect(result.choices[0].text).toBe("open");
  });

  it("fails the playthrough when all choices are filtered out", () => {
    const ch = {
      startScene: "s1",
      scenes: {
        s1: {
          id: "s1",
          text: [],
          choices: [{ text: "locked", next: "s2", condition: () => false }],
          next: null,
        },
        s2: { id: "s2", text: [], choices: null, next: null, links: { showEnd: true } },
      },
    };
    const result = simulate(ch, "first");
    expect(result.success).toBe(false);
    expect(result.error).toContain("filtered out");
  });
});

describe("Bug 11(b): simulator probes dynamic text() and catches crashes", () => {
  it("reports a crashing text() function as a playthrough error", () => {
    const ch = {
      startScene: "s1",
      scenes: {
        s1: {
          id: "s1",
          text: () => {
            throw new Error("boom");
          },
          choices: null,
          next: null,
          links: { showEnd: true },
        },
      },
    };
    const result = simulate(ch, "first");
    expect(result.success).toBe(false);
    expect(result.error).toContain("text() crashed");
    expect(result.error).toContain("boom");
  });

  it("does not crash on well-behaved dynamic text()", () => {
    const ch = {
      startScene: "s1",
      scenes: {
        s1: {
          id: "s1",
          text: (state) => (state.choicesMade.flag_a ? [{ type: "narration", content: "A" }] : [{ type: "narration", content: "B" }]),
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

describe("Bug 11(c): simulator effects clamping matches engine (nerve 0..10)", () => {
  it("clamps nerve at the same upper bound as engine/effects.js applyEffects", () => {
    const ch = {
      startScene: "s1",
      scenes: {
        s1: {
          id: "s1",
          text: [],
          choices: null,
          next: null,
          effects: { nerve: { amount: 50, reason: "test overflow" } },
          links: { showEnd: true },
        },
      },
    };
    const result = simulate(ch, "first");
    expect(result.success).toBe(true);
    expect(result.state.nerve).toBe(10);
  });

  it("still clamps nerve at 0 on the lower bound", () => {
    const ch = {
      startScene: "s1",
      scenes: {
        s1: {
          id: "s1",
          text: [],
          choices: null,
          next: null,
          effects: { nerve: { amount: -50, reason: "test underflow" } },
          links: { showEnd: true },
        },
      },
    };
    const result = simulate(ch, "first");
    expect(result.state.nerve).toBe(0);
  });
});
