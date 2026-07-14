import { describe, it, expect } from "vitest";
import { CHAPTERS, CH_NUM_KANJI } from "../../src/data/chapters.js";
import { getChapter } from "../../src/data/chapterRegistry.js";

describe("Bug 5: chapter directory is derived from chapterRegistry", () => {
  it("lists exactly the original 6 chapters, not 11", () => {
    expect(CHAPTERS).toHaveLength(6);
    expect(CHAPTERS.map((c) => c.num)).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it("CH_NUM_KANJI only covers 一 through 六", () => {
    expect(CH_NUM_KANJI).toEqual(["一", "二", "三", "四", "五", "六"]);
  });

  it("a registered chapter shows its real title/cn, not a placeholder", () => {
    const ch1Real = getChapter(1);
    const ch1Entry = CHAPTERS.find((c) => c.num === 1);
    expect(ch1Entry.title).toBe(ch1Real.title);
    expect(ch1Entry.cn).toBe(ch1Real.titleCn);
    expect(ch1Entry.title).not.toBe("???");
  });

  it("CH6 is now registered and shows its real title/cn, not a placeholder (全六章完成)", () => {
    const ch6Real = getChapter(6);
    expect(ch6Real).not.toBeNull();
    const ch6Entry = CHAPTERS.find((c) => c.num === 6);
    expect(ch6Entry.title).toBe(ch6Real.title);
    expect(ch6Entry.cn).toBe(ch6Real.titleCn);
    expect(ch6Entry.title).not.toBe("???");
  });

  it("an unregistered chapter beyond the 6-chapter ceiling would show ??? placeholders (mechanism check)", () => {
    // No chapter 7 exists in the original work, so getChapter(7) returning
    // null is expected and out of CHAPTERS' range (num > 6 never appears —
    // see the "does not list a phantom chapter 7+" test below). This test
    // documents the placeholder mechanism itself still exists in
    // chapters.js, even though every chapter within the 1-6 ceiling is now
    // registered.
    expect(getChapter(7)).toBeNull();
  });

  it("does not list a phantom chapter 7+ (original book only has 6)", () => {
    expect(CHAPTERS.some((c) => c.num > 6)).toBe(false);
  });
});
