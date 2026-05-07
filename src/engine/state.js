export const initialState = {
  currentSceneId: null,
  currentChapter: 1,
  nerve: 10,
  insight: 0,
  writing: 0,
  notebook: [],
  choicesMade: {},
  journey: {
    current: null,
    visited: [],
    symbols: {},
  },
  connections: [],
};

export function createChapterState(chapter, carryOver) {
  if (!carryOver) {
    return {
      ...initialState,
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
    ...initialState,
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

