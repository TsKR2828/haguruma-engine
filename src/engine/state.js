import { BOOK } from "../bookLoader.js";

// 純函式，顯式收 book 參數（施工圖 §1 S1）——不做全域單例。stat 欄位（key/initial）
// 由 book.stats 生成，取代寫死的 nerve/insight/writing 三個欄位。
export function createInitialState(book) {
  const stats = {};
  for (const s of book.stats) stats[s.key] = s.initial;
  return {
    currentSceneId: null,
    currentChapter: 1,
    ...stats,
    notebook: [],
    choicesMade: {},
    journey: {
      current: null,
      visited: [],
      symbols: {},
    },
    connections: [],
  };
}

export function createChapterStateFor(book, chapter, carryOver) {
  const base = createInitialState(book);
  if (!carryOver) {
    return {
      ...base,
      currentChapter: chapter.chapter,
      currentSceneId: chapter.startScene,
      journey: {
        current: chapter.startLocation ?? null,
        visited: chapter.startLocation ? [chapter.startLocation] : [],
        symbols: {},
      },
    };
  }
  return {
    ...base,
    ...carryOver,
    currentChapter: chapter.chapter,
    currentSceneId: chapter.startScene,
    journey: {
      current: chapter.startLocation ?? null,
      visited: chapter.startLocation ? [chapter.startLocation] : [],
      symbols: {},
    },
  };
}

// 現行 export 保留為 haguruma 綁定版（向後相容，測試/scripts 直接 import 這兩個名字）。
export const initialState = createInitialState(BOOK);

export function createChapterState(chapter, carryOver) {
  return createChapterStateFor(BOOK, chapter, carryOver);
}
