import { getChapter } from "./chapterRegistry";

// 原著《歯車》共 6 章：レエン・コオト／復讐／夜／まだ？／赤光／飛行機。
// Bug 5 fix: this used to be a hardcoded 11-entry list with permanent
// "???" placeholders — CHAPTERS is now derived live from chapterRegistry,
// so a registered chapter always shows its real title/titleCn, and an
// unregistered chapter (up to the original 6-chapter ceiling) shows "???".
const ORIGINAL_CHAPTER_COUNT = 6;

// 向後相容：既有 import 點（如有）仍可用固定 6 章漢數字。
export const CH_NUM_KANJI = ["一", "二", "三", "四", "五", "六"];

// 施工圖 §2 S2-5：派生邏輯收 book 參數（換書只需傳不同的 book.chapters.getChapter）。
// book 未提供時退回現行 chapterRegistry（haguruma 綁定版，向後相容）。
export function buildChapterList(book, count = ORIGINAL_CHAPTER_COUNT) {
  const getCh = book?.chapters?.getChapter ?? getChapter;
  return Array.from({ length: count }, (_, i) => {
    const num = i + 1;
    const chapter = getCh(num);
    return {
      num,
      title: chapter ? chapter.title : "???",
      cn: chapter ? chapter.titleCn : "???",
    };
  });
}

export const CHAPTERS = buildChapterList();
