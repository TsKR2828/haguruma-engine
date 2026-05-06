# 設計決策紀錄

> 記錄已確認的設計決策。未來 agent 不應在沒有使用者同意下推翻這些決策。
> 格式：決策 → 理由 → 日期

---

## D1 — 資料驅動架構，非命令式渲染

場景是資料物件，渲染器是通用元件。不為每個場景寫獨立渲染函式。

理由：原著 11 章 51 節，命令式寫法預估 6000+ 行且無法維護。資料驅動下新增場景只需 ~20 行資料。

日期：2026-05-04

---

## D2 — 章節自含式結構

每章的 `connections`、`locations`、`startLocation` 內嵌在章節資料檔案中，不使用全域 connections/locations。

理由：全域 connections 會讓多章節混在一起；章節自含後，加新章節只需一個檔案 + 一行 import。

日期：2026-05-07

---

## D3 — 跨章節 state 持久化策略

章節結束時，以排除式 carry over state：排除 `currentSceneId`、`currentChapter`、`journey`，其餘全部帶到下一章。

`journey`（current location、visited、symbols）每章重置，因為每章有自己的地理空間。`notebook`、`choicesMade`、`connections` 跨章保留。

理由：排除式比白名單更安全——未來加新 state 欄位時不會被靜默丟棄。journey 重置是因為每章的地點集合不同。

日期：2026-05-07

---

## D4 — journey.symbols 每章重置

`journey.symbols`（場景解鎖的符號 key）在章節轉換時清空。跨章節的主題連結透過 `notebook` 實現，不透過 symbols。

理由：symbols 綁定在特定章節的 locations map 上，跨章沒有意義。notebook 是玩家的累積記錄，自然跨章。

日期：2026-05-07

---

## D5 — 保留 legacy prototype

`prototype.html`（移至 `legacy/prototype-ch1.html`）在整個開發過程中不可刪除。

理由：唯一經過完整驗證的第一章可玩版本，是 ground truth。遷移完成前作為行為參考。

日期：2026-05-06

---

## D6 — 不使用 TypeScript（第一輪）

遷移期間保持純 JS + JSX。可在引擎穩定後漸進加入。

理由：減少遷移複雜度。場景資料含動態函式（`text: (state) => [...]`），TS 型別定義成本高但收益有限。

日期：2026-05-06

---

## D7 — 和紙色系為視覺權威

所有元件統一使用和紙色系（`--washi-*` CSS 變數，`#FAF7F2` 底、`#2C2418` 文字）。ENGINE_SPEC 中的舊暗色系（`#0a0a0c`）已棄用。

理由：prototype.html 已全面切換為和紙色系並通過驗收，視覺效果更符合文學氛圍。

日期：2026-05-06

---

## D8 — SYMBOL_GLYPHS 暫維持全域

`src/data/symbols.js` 的 `SYMBOL_GLYPHS` 目前是全域字典，Ch2 新增符號需手動加入此檔案。

未來可考慮將符號定義移入章節資料內，但目前章節間可能共用符號（如「齒輪」跨章出現），全域字典更方便查找。

理由：跨章共用符號的需求尚未確認，先用最簡單的方案。

日期：2026-05-07

---

## D9 — 先完成歯車，再抽通用引擎

長期目標是將引擎泛化為「文學作品沉浸式閱讀平台」，可用於《地獄變》《罪與罰》等不同作品，只需替換文本和設定。

目前引擎有以下綁死歯車的地方，未來需要參數化：

- engine 層：`nerve` / `insight` / `writing` 三軸名稱和初始值寫死在 state.js / effects.js / save.js
- engine 層：`corruptText` 假設 nerve 上限 10
- engine 層：localStorage key 寫死 `"haguruma_*"`
- UI 層：`"神經"` `"洞察"` `"執筆"` `"手帖"` 等標籤寫死在元件中
- App 層：標題、作者、引言寫死

計畫引入 `gameConfig` 設定檔（stat 定義、UI 文字、主題色系），但不在歯車開發期間做。等歯車 11 章穩定後再抽象，屆時會更清楚哪些參數是真正需要的。

理由：過早抽象化會拖慢 Ch2–Ch11 進度，且沒有第二部作品驗證的抽象容易過度設計。

日期：2026-05-07
