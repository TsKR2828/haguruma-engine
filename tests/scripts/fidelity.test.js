import { describe, it, expect } from "vitest";
import {
  normalize,
  splitChapters,
  unionBlocks,
  collectFlagsAndNotebook,
  computeCoverage,
  checkChapter,
} from "../../scripts/validate-fidelity.js";

// ── 迷你 fixture 底本 ────────────────────────────────────────

const FIXTURE_SOURCE = `


【第1章】
　　　　　一　テスト


　これはテストの　文章です。
雨の降る日に猫が歩いた。

【第2章】
　　　　　二　べつのテスト


　まったく違う話です。犬が走った。

# ---- 轉換 metadata ----
# source: fixture
# converted: 2026-07-12
`;

describe("normalize", () => {
  it("removes half-width and full-width spaces, newlines, and tabs", () => {
    expect(normalize("これは　テストの\n文章です。\tはい")).toBe("これはテストの文章です。はい");
  });

  it("keeps punctuation, kana, and kanji untouched", () => {
    expect(normalize("「雨の降る日に……」")).toBe("「雨の降る日に……」");
  });

  it("returns empty string for non-string input", () => {
    expect(normalize(undefined)).toBe("");
    expect(normalize(null)).toBe("");
  });
});

describe("splitChapters", () => {
  const chapters = splitChapters(FIXTURE_SOURCE);

  it("splits into per-chapter normalized strings, one per marker", () => {
    expect(Object.keys(chapters).sort()).toEqual(["1", "2"]);
  });

  it("chapter 1 content matches normalized source text between markers", () => {
    expect(chapters[1]).toBe(normalize("　　　　　一　テスト\n\n\n　これはテストの　文章です。\n雨の降る日に猫が歩いた。\n\n"));
  });

  it("chapter 2 excludes the trailing metadata comment block", () => {
    expect(chapters[2]).not.toMatch(/metadata|source|converted/);
    expect(chapters[2]).toContain("まったく違う話です。犬が走った。");
  });

  it("does not include the 【第N章】 marker text itself in chapter content", () => {
    expect(chapters[1]).not.toContain("第1章");
    expect(chapters[2]).not.toContain("第2章");
  });
});

describe("collectFlagsAndNotebook", () => {
  it("collects flags and notebook entries from scenes and choices", () => {
    const chapter = {
      scenes: {
        s1: {
          flags: ["flag_a"],
          notebook: { key: "note_a", symbol: "x", desc: "d" },
          choices: [
            { flag: "flag_b", notebook: { key: "note_b", symbol: "y", desc: "d2" } },
            { flag: "flag_a", notebook: null },
          ],
        },
        s2: { flags: [], notebook: null, choices: null },
      },
    };
    const { flags, notebook } = collectFlagsAndNotebook(chapter);
    expect(new Set(flags)).toEqual(new Set(["flag_a", "flag_b"]));
    expect(notebook).toEqual([
      { key: "note_a", symbol: "x", desc: "d" },
      { key: "note_b", symbol: "y", desc: "d2" },
    ]);
  });
});

describe("unionBlocks (dynamic text dual-state union)", () => {
  it("returns static array text as-is", () => {
    const blocks = [{ type: "narration", origin: "added", content: "a" }];
    expect(unionBlocks(blocks, {}, {})).toBe(blocks);
  });

  it("unions blocks from both states, deduping identical blocks", () => {
    const text = (state) => {
      const base = [{ type: "narration", origin: "added", content: "共通" }];
      if (state.choicesMade.flag_a) {
        base.push({ type: "dialogue", origin: "source", speaker: "X", jp: "分岐したセリフ", cn: "分支台詞" });
      }
      return base;
    };
    const state1 = { choicesMade: {}, notebook: [] };
    const state2 = { choicesMade: { flag_a: true }, notebook: [] };
    const result = unionBlocks(text, state1, state2);

    expect(result).toHaveLength(2);
    expect(result.some((b) => b.content === "共通")).toBe(true);
    expect(result.some((b) => b.jp === "分岐したセリフ")).toBe(true);
  });

  it("does not duplicate a block that appears identically in both states", () => {
    const text = () => [{ type: "narration", origin: "added", content: "always same" }];
    const result = unionBlocks(text, { choicesMade: {}, notebook: [] }, { choicesMade: { x: true }, notebook: [] });
    expect(result).toHaveLength(1);
  });
});

describe("computeCoverage", () => {
  it("computes covered ratio from non-overlapping intervals", () => {
    const { covered, total, percent } = computeCoverage([[0, 5], [10, 20]], 100);
    expect(covered).toBe(15);
    expect(total).toBe(100);
    expect(percent).toBeCloseTo(15);
  });

  it("merges overlapping intervals without double-counting", () => {
    const { covered } = computeCoverage([[0, 10], [5, 15], [20, 25]], 100);
    expect(covered).toBe(20); // [0,15) + [20,25)
  });

  it("returns 0 when there are no intervals", () => {
    const { covered, percent } = computeCoverage([], 50);
    expect(covered).toBe(0);
    expect(percent).toBe(0);
  });
});

describe("checkChapter — E1 wrong-chapter hint", () => {
  const allChapterSources = splitChapters(FIXTURE_SOURCE);

  it("flags jp not found in its own chapter's source as E1, with cross-chapter hint when found elsewhere", () => {
    const chapter = {
      chapter: 1,
      scenes: {
        s1: {
          text: [
            { type: "narration", origin: "source", jp: "まったく違う話です。", cn: "完全不同的故事。" },
          ],
        },
      },
    };
    const { errors } = checkChapter(chapter, 1, allChapterSources[1], allChapterSources);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatch(/^E1/);
    expect(errors[0]).toContain("出現在第2章");
  });

  it("passes when jp matches (ignoring whitespace differences) its own chapter's source", () => {
    const chapter = {
      chapter: 1,
      scenes: {
        s1: {
          text: [
            { type: "narration", origin: "source", jp: "これはテストの文章です。", cn: "這是測試文章。" },
          ],
        },
      },
    };
    const { errors } = checkChapter(chapter, 1, allChapterSources[1], allChapterSources);
    expect(errors).toHaveLength(0);
  });

  it("E2: origin source with empty jp is an error", () => {
    const chapter = {
      chapter: 1,
      scenes: { s1: { text: [{ type: "narration", origin: "source", jp: "", cn: "x" }] } },
    };
    const { errors } = checkChapter(chapter, 1, allChapterSources[1], allChapterSources);
    expect(errors.some((e) => e.startsWith("E2"))).toBe(true);
  });

  it("E3: choice.sourceJp not found in chapter source is an error", () => {
    const chapter = {
      chapter: 1,
      scenes: {
        s1: {
          text: [],
          choices: [{ text: "opt", sourceJp: "存在しない台詞のテキスト" }],
        },
      },
    };
    const { errors } = checkChapter(chapter, 1, allChapterSources[1], allChapterSources);
    expect(errors.some((e) => e.startsWith("E3"))).toBe(true);
  });
});

describe("checkChapter — W1 legacy/added jp that matches source", () => {
  const allChapterSources = splitChapters(FIXTURE_SOURCE);

  it("warns when a legacy (no origin) block's long jp is actually a substring of the source", () => {
    const chapter = {
      chapter: 1,
      scenes: {
        s1: {
          text: [
            { type: "dialogue", speaker: "猫", jp: "雨の降る日に猫が歩いた。", cn: "下雨天貓走過。" },
          ],
        },
      },
    };
    const { warnings } = checkChapter(chapter, 1, allChapterSources[1], allChapterSources);
    expect(warnings.some((w) => w.startsWith("W1"))).toBe(true);
  });

  it("does not warn W1 for short jp under the length threshold", () => {
    const chapter = {
      chapter: 1,
      scenes: {
        s1: { text: [{ type: "dialogue", speaker: "猫", jp: "猫が", cn: "貓" }] },
      },
    };
    const { warnings } = checkChapter(chapter, 1, allChapterSources[1], allChapterSources);
    expect(warnings.some((w) => w.startsWith("W1"))).toBe(false);
  });

  it("aggregates legacy (missing-origin) blocks into a single W2 warning line with a count", () => {
    const chapter = {
      chapter: 1,
      scenes: {
        s1: {
          text: [
            { type: "narration", content: "添補敘述一" },
            { type: "narration", content: "添補敘述二" },
          ],
        },
      },
    };
    const { warnings } = checkChapter(chapter, 1, allChapterSources[1], allChapterSources);
    const w2 = warnings.filter((w) => w.startsWith("W2"));
    expect(w2).toHaveLength(1);
    expect(w2[0]).toContain("2");
  });
});

describe("checkChapter — no source text for chapter", () => {
  it("errors clearly when the base text has no marker for this chapter number", () => {
    const allChapterSources = splitChapters(FIXTURE_SOURCE);
    const chapter = { chapter: 9, scenes: {} };
    const { errors } = checkChapter(chapter, 9, allChapterSources[9], allChapterSources);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain("9");
  });
});
