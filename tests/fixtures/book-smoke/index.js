// ═══════════════════════════════════════════════════════════
// 煙霧書（book-smoke）— F11 換書泛化證明 fixture
// 施工圖 docs/batch-f11-generalize.md §4 S4
//
// 這不是真的書，是一本迷你假書：雙軸 stat（courage/memory，非
// nerve/insight/writing）、motif:"none"（非 gears）、獨立 saveKey、
// 獨立 UI 標籤字串。目的：證明整個引擎/驗證工具鏈只要換這個
// bundle 就能運作，不必碰 src/engine 或 src/components 任何一行。
// ═══════════════════════════════════════════════════════════

// ── 章節資料：2 章 × 3 場景 ──
// CH1 含 1 choice、1 connection、1 個 origin:"added" block。
// namespaceExemptChapters/originExemptChapters 皆為空陣列——不像
// haguruma CH1/CH2 有 grandfathered 豁免，煙霧書兩章都要求全面合規，
// 藉此證明 validator 對「無豁免的一般書」也能跑出 0 error。

const CHAPTER_1 = {
  chapter: 1,
  title: "煙霧の章",
  titleCn: "煙霧之章",
  startScene: "s1",
  startLocation: "ch01.loc1",
  sceneCount: 3,
  locations: [
    { id: "ch01.loc1", label: "起點", sub: "", x: 0, y: 0, shape: "circle" },
  ],
  connections: [
    {
      id: "ch01.conn1",
      requires: ["ch01.note1"],
      title: "煙霧連結",
      subtitle: "測試用",
      icon: "◇",
      insightGain: 1,
    },
  ],
  scenes: {
    s1: {
      id: "s1",
      text: [
        { type: "narration", origin: "source", jp: "これはテスト文章です。", cn: "這是測試句子。" },
        { type: "narration", origin: "added", content: "（補）煙霧書專用補述段落，證明換書時 origin:\"added\" 標記可運作。" },
      ],
      choices: [
        {
          text: "選項甲",
          next: "s2",
          flag: "ch01.chose_a",
          effects: { courage: { amount: -5, reason: "驚嚇測試" } },
          notebook: { key: "ch01.note1", symbol: "x", desc: "d" },
          unlock: null,
        },
      ],
      next: null,
      effects: null,
      flags: ["ch01.chose_a"],
      notebook: null,
      links: { visit: "ch01.loc1" },
    },
    s2: {
      id: "s2",
      text: [
        { type: "dialogue", origin: "source", speaker: "角色", jp: "これは第二の場面です。", cn: "這是第二個場景。" },
      ],
      choices: null,
      next: "s3",
      effects: { memory: { amount: 2, reason: "" } },
      flags: [],
      notebook: { key: "ch01.note2", symbol: "x", desc: "d" },
      links: {},
    },
    s3: {
      id: "s3",
      text: [
        { type: "narration", origin: "added", content: "（補）第一章結束。" },
      ],
      choices: null,
      next: null,
      effects: null,
      flags: [],
      notebook: null,
      links: { showEnd: true },
    },
  },
};

const CHAPTER_2 = {
  chapter: 2,
  title: "煙霧の続き",
  titleCn: "煙霧之續",
  startScene: "s1",
  startLocation: "ch02.loc1",
  sceneCount: 3,
  locations: [
    { id: "ch02.loc1", label: "續點", sub: "", x: 0, y: 0, shape: "circle" },
  ],
  connections: [],
  scenes: {
    s1: {
      id: "s1",
      text: [
        { type: "narration", origin: "source", jp: "第二章開始のテスト文です。", cn: "第二章開始的測試句。" },
      ],
      choices: null,
      next: "s2",
      effects: null,
      flags: [],
      notebook: null,
      links: { visit: "ch02.loc1" },
    },
    s2: {
      id: "s2",
      text: [
        { type: "inner", origin: "source", jp: "内心のテスト文。", cn: "內心測試句。" },
      ],
      choices: null,
      next: "s3",
      effects: { courage: { amount: -1, reason: "" } },
      flags: [],
      notebook: null,
      links: {},
    },
    s3: {
      id: "s3",
      text: [{ type: "system", content: "完" }],
      choices: null,
      next: null,
      effects: null,
      flags: [],
      notebook: null,
      links: { showEnd: true },
    },
  },
};

const registry = { 1: CHAPTER_1, 2: CHAPTER_2 };

// 形狀比照 src/data/chapterRegistry.js（getChapter/getAllChapters/
// getChapterCount），book.chapters 讀這個介面，不直接讀章節檔案。
export const CHAPTER_REGISTRY = {
  getChapter: (num) => registry[num] ?? null,
  getAllChapters: () => Object.values(registry),
  getChapterCount: () => Object.keys(registry).length,
};

// ── 符號／色票（形狀比照 src/data/symbols.js、src/data/palette.js） ──

export const SYMBOL_GLYPHS_SMOKE = {
  "ch01.smoke_seed": { glyph: "✦", label: "煙霧種子" },
};

export const PALETTE_SMOKE = {
  bg: { outer: "#111111", sidebar: "#181818", main: "#1f1f1f", card: "#242424" },
  ink: { deep: "#eeeeee", body: "#cccccc", muted: "#999999", ghost: "#666666" },
  border: { normal: "#333333", light: "#3a3a3a", divider: "#404040" },
  accent: { red: "#aa3333", gold: "#aa8833", green: "#338833", blue: "#3355aa" },
  ui: { hoverBg: "#2a2a2a", activeBg: "#333333", selection: "rgba(170,136,51,0.2)" },
};

// ── Book bundle（施工圖 §0 格式） ──

export const BOOK_SMOKE = {
  id: "book-smoke",
  meta: {
    title: "煙霧書",
    author: "測試作者",
    year: "0000",
    quote: "——「這只是一本用來證明換書可行的假書。」",
    license: "Fixture only（非公開出版）",
  },
  // 雙軸、非 nerve/insight/writing：courage(drain,max 5) / memory(gain)。
  stats: [
    { key: "courage", label: "勇氣", initial: 3, min: 0, max: 5, kind: "drain" },
    { key: "memory", label: "記憶", initial: 0, min: 0, max: null, kind: "gain" },
  ],
  corruption: {
    stat: "courage",
    textCorruptAt: 3,
    forcedErodeAt: 2,
    forcedDeepAt: 1,
    gearOverlayAt: 2,
    particleRatioOf: 5,
  },
  motif: "none",
  ui: {
    notebookLabel: "備忘錄",
    connectionLabel: "牽絆",
    continueHint: "點一下繼續",
    nextChapterLabel: "下一段煙霧",
    chapterListWarning: "煙霧書沒有預言能力。\n這裡只是測試字串。",
    numerals: ["壹", "貳", "參", "肆", "伍", "陸", "柒", "捌", "玖", "拾"],
    addedLegend: "補＝煙霧書測試用添補內容",
    startLabel: "開始煙霧",
    resumeLabel: "繼續煙霧",
    newGameLabel: "重新煙霧",
  },
  saveKey: "book_smoke_save",
  chapters: CHAPTER_REGISTRY,
  symbols: SYMBOL_GLYPHS_SMOKE,
  palette: PALETTE_SMOKE,
  validator: { namespaceExemptChapters: [], originExemptChapters: [] },
  fidelity: {
    sourceText: "tests/fixtures/book-smoke/source.txt",
    chapterMarker: "【第N章】",
  },
};
