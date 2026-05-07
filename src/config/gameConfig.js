// Game configuration schema for haguruma-engine.
// This file is a living spec — not imported by any runtime module yet.
// After CH2 stabilizes, save.js and state.js will be the first consumers.
// See DECISIONS.md D9 for the full parameterization roadmap.

export const gameConfig = {
  id: "haguruma",
  title: "歯車",
  author: "芥川龍之介",
  year: 1927,
  epigraph: "半透明の歯車。それが不意に彼の視野を遮り始めた。",

  stats: {
    nerve:   { label: "神經", initial: 10, max: 10, direction: "down" },
    insight: { label: "洞察", initial: 0,  max: null, direction: "up" },
    writing: { label: "執筆", initial: 0,  max: null, direction: "up" },
  },

  ui: {
    notebook: "手帖",
    connections: "連結",
    nextChapter: "次の章へ",
    continuePrompt: "▾ 點擊繼續",
  },

  saveKey: "haguruma_save",
  legacySaveKey: "haguruma_save_v1",

  corrupt: {
    triggerStat: "nerve",
    threshold: 5,
    maxStat: 10,
  },

  theme: "washi",
};
