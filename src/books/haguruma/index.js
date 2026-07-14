// 歯車 book bundle — 單一事實來源（施工圖 docs/batch-f11-generalize.md §0）。
// 換書＝只加一個 src/books/<id>/ 目錄；引擎與 UI 讀這個物件，不直接讀章節/符號/色票模組。
import * as chapterRegistry from "../../data/chapterRegistry.js";
import { SYMBOL_GLYPHS } from "../../data/symbols.js";
import { PALETTE } from "../../data/palette.js";

export const BOOK = {
  id: "haguruma",
  meta: {
    title: "歯車",
    author: "芥川龍之介",
    year: "1927",
    quote: "——「半透明の歯車。それが不意に彼の視野を遮り始めた。」",
    license: "Public Domain（青空文庫）",
  },
  stats: [
    { key: "nerve", label: "神經", initial: 10, min: 0, max: 10, kind: "drain" },
    { key: "insight", label: "洞察", initial: 0, min: 0, max: null, kind: "gain" },
    { key: "writing", label: "執筆", initial: 0, min: 0, max: null, kind: "gain" },
  ],
  corruption: {
    // 視覺崩壞全部閾值（現值照抄現行為，見 SceneText/ForcedSteps/Particles）。
    stat: "nerve", // 觸發軸
    textCorruptAt: 5, // SceneText 文字亂碼
    forcedErodeAt: 4,
    forcedDeepAt: 2,
    gearOverlayAt: 3, // ForcedSteps 分級
    particleRatioOf: 10, // Particles 用 stat/particleRatioOf 變色
  },
  motif: "gears", // 特效 motif id（見 src/components/motifs/index.js）
  ui: {
    notebookLabel: "手帖",
    connectionLabel: "連結",
    continueHint: "點擊繼續",
    nextChapterLabel: "次の章へ",
    chapterListWarning: "此人生之書能預知命運。\n然而事先得知章節數量，\n可能會降低未知的樂趣。",
    numerals: ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"],
    addedLegend: "補＝非原文的添補內容",
    startLabel: "開始遊玩",
    resumeLabel: "繼續遊玩",
    newGameLabel: "新的開始",
  },
  saveKey: "haguruma_save", // overlay/rewind/seen key 由 `${id}_` 前綴派生
  chapters: chapterRegistry, // { getChapter, getAllChapters, getChapterCount }
  symbols: SYMBOL_GLYPHS,
  palette: PALETTE,
  validator: { namespaceExemptChapters: [1], originExemptChapters: [1, 2] },
  fidelity: {
    sourceText: "reference/aozora/haguruma_original.txt",
    chapterMarker: "【第N章】",
  },
};
