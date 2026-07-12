import { describe, it, expect } from "vitest";
import { validateOrigin } from "../../scripts/validate-chapters.js";

function makeChapter(num, scenes) {
  return { chapter: num, scenes };
}

describe("origin validation", () => {
  it("CH1: blocks missing origin produce a single grandfathered warning, no errors", () => {
    const ch1 = makeChapter(1, {
      s1: { text: [{ type: "narration", content: "x" }, { type: "dialogue", speaker: "A", jp: "j", cn: "c" }] },
    });
    const errors = [], warnings = [];
    validateOrigin(ch1, errors, warnings);
    expect(errors).toHaveLength(0);
    expect(warnings).toHaveLength(1);
    expect(warnings[0]).toContain("grandfathered");
    expect(warnings[0]).toContain("2");
  });

  it("CH2: blocks missing origin are also grandfathered (legacy data, no error)", () => {
    const ch2 = makeChapter(2, {
      s1: { text: [{ type: "narration", content: "x" }] },
    });
    const errors = [], warnings = [];
    validateOrigin(ch2, errors, warnings);
    expect(errors).toHaveLength(0);
    expect(warnings).toHaveLength(1);
  });

  it("CH3+: blocks missing origin are hard errors", () => {
    const ch3 = makeChapter(3, {
      s1: { text: [{ type: "narration", content: "x" }] },
    });
    const errors = [], warnings = [];
    validateOrigin(ch3, errors, warnings);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain("missing \"origin\"");
  });

  it("CH3+: origin:source with proper jp passes clean", () => {
    const ch3 = makeChapter(3, {
      s1: { text: [{ type: "narration", origin: "source", jp: "冬の日である。", cn: "冬日。" }] },
    });
    const errors = [], warnings = [];
    validateOrigin(ch3, errors, warnings);
    expect(errors).toHaveLength(0);
  });

  it("origin:source with empty jp is an error in any chapter (including CH1)", () => {
    const ch1 = makeChapter(1, {
      s1: { text: [{ type: "narration", origin: "source", jp: "", cn: "冬日。" }] },
    });
    const errors = [], warnings = [];
    validateOrigin(ch1, errors, warnings);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain("missing jp");
  });

  it("origin:source with missing jp field entirely is also an error", () => {
    const ch3 = makeChapter(3, {
      s1: { text: [{ type: "dialogue", speaker: "A", cn: "冬日。" }] },
    });
    const errors = [], warnings = [];
    validateOrigin(ch3, errors, warnings);
    expect(errors).toHaveLength(1);
  });

  it("invalid origin value is an error in any chapter", () => {
    const ch1 = makeChapter(1, {
      s1: { text: [{ type: "narration", origin: "bogus", content: "x" }] },
    });
    const errors = [], warnings = [];
    validateOrigin(ch1, errors, warnings);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain("invalid origin");
  });

  it("origin:added narration is valid without jp/cn (content-only)", () => {
    const ch3 = makeChapter(3, {
      s1: { text: [{ type: "narration", origin: "added", content: "橋接敘述。" }] },
    });
    const errors = [], warnings = [];
    validateOrigin(ch3, errors, warnings);
    expect(errors).toHaveLength(0);
  });

  it("system/break/pause blocks are ignored (no origin required)", () => {
    const ch3 = makeChapter(3, {
      s1: {
        text: [
          { type: "system", content: "x" },
          { type: "break" },
          { type: "pause", duration: 500 },
        ],
      },
    });
    const errors = [], warnings = [];
    validateOrigin(ch3, errors, warnings);
    expect(errors).toHaveLength(0);
    expect(warnings).toHaveLength(0);
  });

  it("dynamic text function is resolved against a default state", () => {
    const ch3 = makeChapter(3, {
      s1: {
        text: (state) =>
          state.choicesMade.some_flag
            ? [{ type: "narration", content: "branch A" }]
            : [{ type: "narration", content: "branch B (default)" }],
      },
    });
    const errors = [], warnings = [];
    validateOrigin(ch3, errors, warnings);
    // default state has choicesMade: {} → falls into the else branch, still
    // missing origin → 1 error for the default-branch block.
    expect(errors).toHaveLength(1);
  });
});
