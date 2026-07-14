# Batch F11 施工圖：換書泛化（book bundle 化）

> 狀態：定案（2026-07-12，Fable）。D9 的前提「全章文本穩定」已達成（六章完工、fidelity 全綠）。目標：**換一本書＝只加一個 `src/books/<id>/` 目錄**，引擎與 UI 零修改。
> 依據：reports/full-audit-2026-07-11.md §4 的 hardcoded 盤點與 8 項工作清單。
> 紀律：不 commit；jp/cn 章節資料一字不動；**行為不變是硬約束**——重構前後四驗證輸出必須一致。

## 0. Book Bundle 格式（單一事實來源）

新目錄 `src/books/haguruma/index.js`：

```js
export const BOOK = {
  id: "haguruma",
  meta: { title: "歯車", author: "芥川龍之介", year: "1927",
          quote: "——「半透明の歯車。それが不意に彼の視野を遮り始めた。」",
          license: "Public Domain（青空文庫）" },
  stats: [
    { key: "nerve",   label: "神經", initial: 10, min: 0, max: 10, kind: "drain" },
    { key: "insight", label: "洞察", initial: 0,  min: 0, max: null, kind: "gain" },
    { key: "writing", label: "執筆", initial: 0,  min: 0, max: null, kind: "gain" },
  ],
  corruption: {           // 視覺崩壞全部閾值（現值照抄現行為）
    stat: "nerve",        // 觸發軸
    textCorruptAt: 5,     // SceneText 文字亂碼
    forcedErodeAt: 4, forcedDeepAt: 2, gearOverlayAt: 3,  // ForcedSteps 分級
    particleRatioOf: 10,  // Particles 用 stat/particleRatioOf 變色
  },
  motif: "gears",         // 特效 motif id（見 §2-3 motif registry）
  ui: { notebookLabel: "手帖", connectionLabel: "連結", continueHint: "點擊繼續",
        nextChapterLabel: "次の章へ", chapterListWarning: "此人生之書能預知命運。…（現行全文）",
        numerals: ["一","二","三","四","五","六","七","八","九","十"],
        addedLegend: "補＝非原文的添補內容",
        startLabel: "開始遊玩", resumeLabel: "繼續遊玩", newGameLabel: "新的開始" },
  saveKey: "haguruma_save",   // overlay/rewind/seen key 由 `${id}_` 前綴派生
  chapters: CHAPTER_REGISTRY,    // 沿用現檔 import
  symbols: SYMBOL_GLYPHS,        // 沿用現檔 import
  palette: PALETTE,              // 沿用現檔；App 啟動時注入 CSS 變數
  validator: { namespaceExemptChapters: [1], originExemptChapters: [1, 2] },
  fidelity: { sourceText: "reference/aozora/haguruma_original.txt", chapterMarker: "【第N章】" },
};
```

App 換書點：`src/bookLoader.js` 一行 `export { BOOK } from "./books/haguruma";`。`src/config/gameConfig.js`（死代碼）廢除，內容併入 bundle（檔案改為 re-export BOOK 以防殘留 import，加 deprecation 註解）。

## 1. S1 引擎核心參數化

- `engine/state.js`：初始 state 的 stat 欄位由 `BOOK.stats` 生成（`createInitialState(book)`；現行 export 保留為 haguruma 綁定版以免測試大改，新增工廠函式）。
- `engine/effects.js`：applyEffects 迭代 `book.stats`，依 min/max 夾制（取代寫死的 nerve/insight/writing 三個 if）。
- `engine/corrupt.js`：閾值與觸發軸讀 `book.corruption`。
- `engine/save.js`：saveKey 讀 bundle；rewind/overlay/seen key 加 `${book.id}_` 前綴（**注意向後相容：haguruma 的既有 key 名不變**，派生規則對 haguruma 特判或直接沿用現名）。
- 引擎純函式簽名統一為「顯式收 book/config 參數」，不做全域單例（維持可測性）。

## 2. S2 元件層

1. **標籤**：HagurumaEngine header 三軸顯示、toastEffects、EndScreen、StatRadar（**軸數動態**＝stats.length）、NerveBar（內部改讀 `stats.find(kind==="drain")`，檔名不改）全部讀 config。
2. **閾值**：SceneText 崩壞、ForcedSteps 分級、Particles 變色讀 `book.corruption`。
3. **Motif registry**：新檔 `src/components/motifs/index.js`——`{ gears: { Defs: GearDefs, Overlay: GearOverlay }, none: {...空實作} }`；ForcedSteps/背景特效經 registry 取用 `BOOK.motif`。
4. **App 標題頁**：title/author/quote/license/按鈕文字讀 `BOOK.meta`＋`BOOK.ui`。
5. **章節目錄**：LeftSidebar 警語與漢數字讀 `BOOK.ui`；chapters.js 的派生邏輯收 book 參數。
6. **UI 字串**：手帖/連結/點擊繼續/次の章へ/圖例等散落字串全部集中到 `BOOK.ui`（grep 中文字串逐一遷移，UI 專屬非敘事字串才遷）。
7. **inline hex 收斂**：元件內 hex 色碼改 CSS 變數；`PALETTE` 在 App 啟動時注入 `:root`（現有 --washi-* 保留，缺的補）。

## 3. S3 工具層去書本化

- `scripts/validate-chapters.js`：SYMBOL_GLYPHS／EXEMPT_CHAPTERS／simulate 的 stat 欄位改由 bundle 提供（CLI `--book=haguruma` 預設）。
- `scripts/validate-fidelity.js`：底本路徑／章 marker 讀 `BOOK.fidelity`。
- 兩工具的輸出格式不變（驗收要 diff 前後輸出）。

## 4. S4 換書證明（煙霧書）

- `tests/fixtures/book-smoke/index.js`：迷你書——雙軸 stat（courage(drain,max 5)/memory(gain)）、motif:"none"、2 章 ×3 場景（含 1 choice、1 connection、1 個 origin:added block）、獨立 saveKey、獨立 ui 標籤。
- 整合測試 `tests/integration/book-smoke.test.js`：用煙霧書驗證——createInitialState 生成 courage/memory 欄位、applyEffects 夾制 courage 上限 5、corrupt 用 courage 閾值、validator 以煙霧書跑通（0 error）、UI 標籤來自煙霧書 config（元件 smoke render）。
- **這個測試就是「換書只需換 data」的可執行證明。**

## 5. 驗收（Opus 硬指標）

1. **行為不變**：重構前先把四驗證輸出存檔（reports/pre-f11-baseline.txt），重構後 diff——fidelity 六章 coverage 逐字相同、validate:chapters 統計相同、323 tests 全過（測試改讀 config 屬允許的最小修改，行為斷言不得放寬）。
2. 煙霧書整合測試通過。
3. 殘留掃描：`grep -rn "神經\|洞察\|執筆" src/engine src/components`（bundle 與註解外零命中）；`grep -rn "haguruma_save" src/engine src/components`（僅 bundle）；`grep -rn "#[0-9a-fA-F]\{6\}" src/components`（應趨近零，剩餘逐條說明）。
4. 實跑 dev build 遊戲可玩（工兵以 npm run build 通過＋元件測試代替人工遊玩，Fable 最終實機驗收）。
5. DEV-LOG／DECISIONS（D9 標記完成）／README（開發狀態補「換書泛化」）更新。

## 6. 施工順序

S1 → S2 → S3 → S4 單線接力（同一工兵可分段，段間跑四綠）；Opus 在 S2 後做中途抽驗（引擎＋元件行為不變最容易在這裡壞），S4 後總驗證；修復迴圈 ≤3。
