import { getChapter } from "./chapterRegistry";

// 原著《歯車》共 6 章：レエン・コオト／復讐／夜／まだ？／赤光／飛行機。
// Bug 5 fix: this used to be a hardcoded 11-entry list with permanent
// "???" placeholders — CHAPTERS is now derived live from chapterRegistry,
// so a registered chapter always shows its real title/titleCn, and an
// unregistered chapter (up to the original 6-chapter ceiling) shows "???".
const ORIGINAL_CHAPTER_COUNT = 6;

export const CH_NUM_KANJI = ["一", "二", "三", "四", "五", "六"];

export const CHAPTERS = Array.from({ length: ORIGINAL_CHAPTER_COUNT }, (_, i) => {
  const num = i + 1;
  const chapter = getChapter(num);
  return {
    num,
    title: chapter ? chapter.title : "???",
    cn: chapter ? chapter.titleCn : "???",
  };
});
