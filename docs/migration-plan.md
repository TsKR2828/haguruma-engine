# 歯車引擎 — Vanilla → Vite + React 遷移計畫

> 盤點日期：2026-05-06
> 基於 prototype.html v2（2767 行，第一章 33 場景通過驗收）

---

## 1. Current State

### 1.1 檔案結構

```
haguruma-engine/                        2026-05-06 盤點
├── .claude/launch.json
├── .env.example
├── .gitignore
├── CHAPTER_GUIDE.md                    章節劇本設計筆記
├── ENGINE_SPEC.md                      技術規格書（v0.1）
├── README.md
├── SCENES_FORMAT.md                    場景資料寫作指南
├── prototype.html                      ★ 可玩原型（2767 行，vanilla HTML/CSS/JS + React widgets）
├── docs/
│   └── migration-plan.md               ← 本文件
├── reference/
│   ├── GAME_DEV_PLAN.md                305 行，脈輪覺醒開發計畫（封存）
│   ├── coc-game-spec.md                696 行，CoC 文字冒險設計規格
│   ├── haguruma_ch1.jsx                1842 行，歯車 React 原型（第一章，舊版）
│   └── last-letter-game.html           2141 行，CoC 引擎 v27（最後一封信）
└── src/
    └── components/
        ├── index.js                    barrel export（4 元件）
        ├── ImpactToast.jsx             64 行，浮動增減通知
        ├── NerveBar.jsx                59 行，神經衰減進度條
        ├── Particles.jsx               49 行，浮動粒子（神經連動變色）
        └── StatRadar.jsx               69 行，三軸雷達圖（SVG）
```

### 1.2 prototype.html 剖析

單檔 2767 行，分為三大段：

| 區段 | 行號 | 內容 |
|------|------|------|
| CSS | 7–677 | 全域樣式：和紙色系 CSS 變數、三欄佈局、distortion/noise 層、forced button 齒輪侵蝕效果、overlays（手帖/結算/設定/地圖）、打字機動畫 |
| HTML body | 684–787 | 結構骨架：`#particles-root`、`#distortion`、`#noise`、`#impact-toast-root`、三欄 layout（aside/main/aside）、四個 overlay（手帖/結算/設定/地圖）、SVG gear icon `<symbol>` |
| JS (vanilla) | 789–2602 | STATE → SETTINGS → AUDIO → SYMBOLS → corrupt → distortion → typeText → updateStatus → renderChapterPanel → renderMiniMap → renderMiniNotebook → renderConnections → renderMap → showImpact → loseNerve/gainStat → renderForcedBtn → showChoices → showEndOverlay → renderTitle → renderBlock → playScene → saveGame/loadSaveRaw → **SCENES (33 entries)** → init |
| JS (React/Babel) | 2609–2765 | Particles、NerveBar、ImpactToast 的 inline 副本 + CustomEvent 橋接（`hgr-state`、`hgr-impact`）+ MutationObserver mount |

**入口：** `renderTitle()`（行 2601），由 `<script>` 尾端直接呼叫。

**場景資料：** `const SCENES = { ... }`（行 2156–2598），共 33 個場景 key，內嵌在 vanilla JS `<script>` 中。

**UI 邏輯：** 全部是命令式 DOM 操作（`$('#game').innerHTML`、`typeText()`、`showChoices()`）。React 只負責三個 widget（Particles、NerveBar、ImpactToast），透過 CustomEvent 單向接收 state。

### 1.3 已存在的 React 元件

| 元件 | 檔案 | 行數 | 狀態 | 備註 |
|------|------|------|------|------|
| Particles | `src/components/Particles.jsx` | 49 | 可用 | prototype inline 版有微小色差（`zIndex: 0` vs `1`），以 src 版為準 |
| NerveBar | `src/components/NerveBar.jsx` | 59 | 可用 | prototype inline 版已切換為和紙色系，src 版仍用舊暗色系；**遷移時以 prototype 版為準** |
| ImpactToast | `src/components/ImpactToast.jsx` | 64 | 可用 | prototype inline 版已切換為和紙色系，src 版仍用舊暗色系；**遷移時以 prototype 版為準** |
| StatRadar | `src/components/StatRadar.jsx` | 69 | 可用但未掛載 | prototype 中 **未使用**，但右側欄有空間可放；仍用舊暗色系 |

**元件色系不一致警告：** `src/components/` 的 NerveBar 和 ImpactToast 使用 ENGINE_SPEC 的暗色系（`#0a0a0c` 底），但 prototype.html 已全面切換為和紙色系（`--washi-*` 變數）。遷移時必須統一為和紙色系。

### 1.4 Prototype 額外資料物件

除了 SCENES，prototype 還定義了以下資料物件需要提取：

| 物件 | 行號 | 說明 |
|------|------|------|
| `state` | 790–807 | 初始 GameState（含 journey/connections） |
| `CHAPTERS` | 810–817 | 章節清單（6 章，2-6 為 `???`） |
| `CONNECTIONS` | 821–862 | 連結規則（5 條） |
| `LOCATIONS` | 866–872 | 東京路線圖地點（5 個） |
| `SYMBOL_GLYPHS` | 874–882 | 符號 glyph 對照（7 筆） |
| `SYMBOLS` | 884–889 | 符號定義（4 類） |
| `settings` | 899–905 | 預設設定值 |

---

## 2. Target Architecture

```
haguruma-engine/
├── prototype.html                      ← 保留，legacy playable prototype
├── reference/                          ← 保留，設計參考
├── docs/                               ← 文件
│   └── migration-plan.md
│
├── index.html                          Vite 入口 HTML
├── package.json                        Vite + React 18 + dependencies
├── vite.config.js
│
└── src/
    ├── main.jsx                        React mount 入口
    ├── App.jsx                         根元件（路由/全域 Provider）
    │
    ├── engine/                         引擎核心邏輯（純 JS，無 UI）
    │   ├── state.js                    GameState 定義 + 初始值 + reducer
    │   ├── scenes.js                   場景載入器 + 流轉邏輯（playScene）
    │   ├── effects.js                  loseNerve / gainInsight / gainWriting
    │   ├── corrupt.js                  文字雜訊化
    │   ├── audio.js                    Web Audio API（ambient / sfx）
    │   ├── save.js                     三層備援存檔
    │   ├── connections.js              連結判定邏輯
    │   └── settings.js                 使用者設定（速度/音量/自動推進）
    │
    ├── components/                     React UI 元件
    │   ├── HagurumaEngine.jsx          根遊戲元件（state 管理 + scene dispatch）
    │   ├── TextBlock.jsx               文字塊渲染（打字機效果）
    │   ├── ChoicePanel.jsx             選項面板
    │   ├── ForcedButton.jsx            強制動作按鈕（含齒輪侵蝕）
    │   ├── StatusBar.jsx               狀態列
    │   ├── ChapterPanel.jsx            左側章節目錄
    │   ├── Notebook.jsx                手帖 overlay
    │   ├── ConnectionCards.jsx         連結卡面板
    │   ├── MapOverlay.jsx              東京路線圖 overlay
    │   ├── EndScreen.jsx               章節結算畫面
    │   ├── SettingsPanel.jsx           設定面板
    │   ├── TitleScreen.jsx             標題畫面
    │   ├── DistortionLayer.jsx         暗角效果層
    │   ├── NoiseLayer.jsx              雜訊效果層
    │   ├── Particles.jsx               浮動粒子（已有，同步色系）
    │   ├── NerveBar.jsx                神經進度條（已有，同步色系）
    │   ├── ImpactToast.jsx             浮動通知（已有，同步色系）
    │   └── StatRadar.jsx               三軸雷達圖（已有，同步色系）
    │
    ├── data/
    │   ├── symbols.js                  SYMBOLS + SYMBOL_GLYPHS
    │   ├── palette.js                  和紙色系 CSS 變數 → JS 常數
    │   ├── chapters.js                 CHAPTERS 章節清單
    │   ├── connections.js              CONNECTIONS 連結規則
    │   ├── locations.js                LOCATIONS 路線圖資料
    │   └── chapters/
    │       └── ch1_raincoat.js         第一章 33 場景
    │
    └── styles/
        ├── global.css                  全域樣式 + 和紙色系 CSS 變數
        ├── typography.css              字型 + 打字速度
        ├── layout.css                  三欄佈局
        ├── distortion.css              崩壞效果層
        ├── forced-button.css           齒輪侵蝕 CSS（clip-path + gear pattern）
        └── overlays.css                overlay 共用樣式
```

**技術棧：**
- Vite 6.x（dev server + build）
- React 18.3（JSX）
- 無 CSS-in-JS — 沿用全域 CSS + CSS 變數（和紙色系）
- 無 TypeScript（第一輪遷移保持 JS，後續可漸進加入）
- 無 router（單頁遊戲，不需要路由）

---

## 3. Migration Batches

### Batch 0 — 工具鏈建立（不動 prototype）

**目標：** `npm run dev` 可啟動空白 React app，與 prototype.html 並存。

- [ ] 初始化 `package.json`（`vite`、`react`、`react-dom`、`@vitejs/plugin-react`）
- [ ] 建立 `vite.config.js`
- [ ] 建立 `index.html`（Vite 入口，`<div id="root">`）
- [ ] 建立 `src/main.jsx` + `src/App.jsx`（空殼，顯示「歯車引擎 — React 版建置中」）
- [ ] 確認 `npm run dev` 和 `npx serve -s .`（prototype）可同時運行在不同 port

**驗收：** 瀏覽器開啟 Vite dev server 看到佔位文字；prototype.html 仍可獨立遊玩。

### Batch 1 — 資料層提取

**目標：** 把 prototype 中的純資料物件提取到 `src/data/`，不改 prototype。

- [ ] `src/data/symbols.js` — SYMBOLS + SYMBOL_GLYPHS
- [ ] `src/data/palette.js` — 從 prototype CSS `:root` 提取和紙色系常數
- [ ] `src/data/chapters.js` — CHAPTERS 清單
- [ ] `src/data/connections.js` — CONNECTIONS 規則（5 條）
- [ ] `src/data/locations.js` — LOCATIONS 地點（5 個）
- [ ] `src/data/chapters/ch1_raincoat.js` — 33 場景完整搬移

**驗收：** 每個模組可獨立 import，場景數 === 33，連結規則數 === 5。

### Batch 2 — 引擎核心模組

**目標：** 將 prototype 的命令式邏輯重構為可測試的純函式模組。

- [ ] `src/engine/state.js` — GameState 型別 + initialState + reducer（或 zustand store）
- [ ] `src/engine/effects.js` — loseNerve / gainInsight / gainWriting（純函式，回傳新 state）
- [ ] `src/engine/corrupt.js` — corrupt(text, nerve)（改為純函式，不讀全域 state）
- [ ] `src/engine/connections.js` — checkConnections(notebook, connections)
- [ ] `src/engine/scenes.js` — resolveText(scene, state) / resolveChoices(scene, state)
- [ ] `src/engine/audio.js` — AudioManager class（封裝 Web Audio API）
- [ ] `src/engine/save.js` — 三層備援 saveGame / loadGame / deleteSave
- [ ] `src/engine/settings.js` — 設定讀寫（localStorage）

**驗收：** 可寫單元測試驗證 state 轉移、corrupt 行為、連結判定。

### Batch 3 — 核心 UI 元件

**目標：** 實作最小可玩的 React 版本（單欄，無側邊欄）。

- [ ] `src/components/HagurumaEngine.jsx` — state context + scene runner
- [ ] `src/components/TextBlock.jsx` — 打字機效果（narration / inner / dialogue / system / break / pause）
- [ ] `src/components/ChoicePanel.jsx` — 選項按鈕
- [ ] `src/components/ForcedButton.jsx` — forced steps + 齒輪侵蝕 CSS
- [ ] `src/components/StatusBar.jsx` — 三軸數值 + 手帖按鈕
- [ ] `src/components/DistortionLayer.jsx` — 暗角
- [ ] `src/components/NoiseLayer.jsx` — 雜訊
- [ ] `src/styles/` — 從 prototype CSS 提取並拆分

**驗收：** 第一章可從 prologue 玩到 auto_ending，打字機效果 / 選擇 / forced steps / 視覺崩壞全部運作。

### Batch 4 — 側邊欄與 Overlay

**目標：** 補齊三欄佈局和彈窗。

- [ ] `src/components/ChapterPanel.jsx` — 左側章節目錄（摺疊/展開）
- [ ] `src/components/Notebook.jsx` — 手帖 overlay
- [ ] `src/components/ConnectionCards.jsx` — 連結卡面板
- [ ] `src/components/MapOverlay.jsx` — SVG 東京路線圖（含神經扭曲）
- [ ] `src/components/EndScreen.jsx` — 章節結算
- [ ] `src/components/SettingsPanel.jsx` — 設定面板
- [ ] `src/components/TitleScreen.jsx` — 標題畫面（齒輪旋轉 + 開始按鈕）

**驗收：** 與 prototype 視覺完全一致；三欄佈局 + 所有 overlay 正常。

### Batch 5 — 既有元件整合與色系統一

**目標：** 同步 `src/components/` 的 4 個 React 元件到和紙色系。

- [ ] Particles.jsx — `zIndex` 對齊，色值同步
- [ ] NerveBar.jsx — 全面改用和紙色系（`--washi-*` 變數）
- [ ] ImpactToast.jsx — 同上
- [ ] StatRadar.jsx — 同上，決定是否掛載到右側欄
- [ ] 移除 CustomEvent 橋接（`hgr-state` / `hgr-impact`）——React 版用 context/props 直接傳遞

**驗收：** 4 元件在 React 版中正確顯示，色系與 prototype 一致。

### Batch 6 — 存檔 + 部署

**目標：** 存讀檔系統上線 + 靜態部署。

- [ ] 存檔 UI（存檔槽選擇、讀取確認）
- [ ] 自動存檔（每次選擇後 + 每次進入新章節）
- [ ] `vite build` 輸出到 `dist/`
- [ ] GitHub Pages 或 Vercel 部署設定
- [ ] prototype.html 移至 `/legacy/prototype.html`（保留但不作為主入口）

**驗收：** 部署後可從公開 URL 遊玩完整第一章；存檔跨 session 保留。

---

## 4. Files to Preserve

以下檔案在遷移過程中**不可刪除、不可覆寫**：

| 檔案 | 理由 | 遷移後位置 |
|------|------|-----------|
| `prototype.html` | 唯一可玩版本，遷移完成前是 ground truth | Batch 6 後移至 `legacy/prototype.html` |
| `reference/last-letter-game.html` | CoC 引擎參考（存檔系統、SAN 崩壞） | 不動 |
| `reference/haguruma_ch1.jsx` | 舊版 React 原型，結構參考 | 不動 |
| `reference/coc-game-spec.md` | 設計規範參考 | 不動 |
| `reference/GAME_DEV_PLAN.md` | 封存文件 | 不動 |
| `ENGINE_SPEC.md` | 權威技術規格 | 不動（遷移後更新版本號） |
| `SCENES_FORMAT.md` | 場景寫作指南 | 不動 |
| `CHAPTER_GUIDE.md` | 章節設計筆記 | 不動 |
| `src/components/*.jsx` | 已有 React 元件 | 原地升級色系 |

---

## 5. Risk Points

### R1 — 打字機效果的 React 化（高風險）

**問題：** prototype 的 `typeText()` 是命令式 async 函式，逐字操作 DOM（`el.innerHTML += char`）。React 的宣告式渲染不直接支援這種模式。

**方案：** `useEffect` + `requestAnimationFrame` 逐字遞增 `displayedText` state。需要處理：
- 打字中途使用者點擊「跳過」（set full text immediately）
- 多個 TextBlock 的串接 Promise 鏈
- pause 類型的等待
- action 類型的中途暫停

**驗收標準：** 打字節奏與 prototype 無感差異（18ms/字 narration、25ms/字 inner）。

### R2 — forced steps 的齒輪侵蝕 CSS（中風險）

**問題：** prototype 用 SVG `clip-path`、背景 gear pattern、旋轉齒輪 overlay 三層疊加。這些效果依賴精確的 CSS class 和 SVG `<symbol>` 定義。

**方案：** 將齒輪 SVG 和 clip-path 定義提取到 `src/styles/forced-button.css`，ForcedButton 元件根據 nerve 值動態加 class。

**驗收標準：** nerve 4/3/2/1 四個等級的視覺效果與 prototype 一致。

### R3 — 場景資料提取的正確性（中風險）

**問題：** SCENES 中有 5 個場景使用動態 `text: (s) => ...`，引用 `state.choicesMade` 和 `state.notebook`。提取時必須確保閉包引用正確轉換為參數傳遞。

**方案：** 場景函式簽名統一為 `text: (state) => TextBlock[]`，由引擎在 `playScene` 時傳入當前 state。

**驗收標準：** 33 場景全部可達，動態文本在所有 flag 組合下正確。

### R4 — 色系不一致（低風險）

**問題：** `src/components/` 的 4 個元件使用 ENGINE_SPEC 定義的暗色系（`#0a0a0c` 底），但 prototype 已切換為和紙色系（`#FAF7F2` 底、`#2C2418` 文字）。ENGINE_SPEC 的色彩章節尚未更新。

**方案：** Batch 5 統一色系時，以 prototype 的 CSS 變數為準。遷移完成後更新 ENGINE_SPEC §9.1。

### R5 — CustomEvent 橋接移除（低風險）

**問題：** prototype 用 `hgr-state` 和 `hgr-impact` CustomEvent 讓 vanilla JS 單向廣播 state 給 React widgets。React 版不需要這個橋接，但移除時需確保所有 widget 改為從 context/props 接收資料。

**方案：** Batch 5 移除 CustomEvent，改用 React context 或 zustand store。

---

## 6. Validation Checklist

每個 Batch 完成後，執行以下驗證：

### 通用

- [ ] prototype.html 仍可獨立運行（`npx serve -l 3456 -s .`）
- [ ] 無檔案被刪除（除非明確標記為 Batch 6 的搬移）
- [ ] `npm run dev` 正常啟動
- [ ] 瀏覽器 console 無錯誤

### Batch 1 驗證

- [ ] `import { CH1_SCENES } from './data/chapters/ch1_raincoat'` 成功
- [ ] `Object.keys(CH1_SCENES).length === 33`
- [ ] `CONNECTIONS.length === 5`
- [ ] `LOCATIONS.length === 5`
- [ ] 場景中的動態 `text` 函式仍為 function type

### Batch 2 驗證

- [ ] `corrupt("測試文字", 3)` 回傳含 combining characters 的字串
- [ ] `corrupt("測試文字", 8)` 回傳原文不變
- [ ] `loseNerve(state, 2)` 回傳 nerve 正確遞減的新 state
- [ ] `checkConnections(notebook, CONNECTIONS)` 在 3 筆 raincoat 記錄時觸發 `raincoat_triple`

### Batch 3 驗證（關鍵）

- [ ] 從 prologue 到 auto_ending 的全選第一選項路線可跑通
- [ ] 最終 nerve === 6, insight === 11, writing === 2（與 README 驗收結果一致；注：此為 **prototype 版數據 2026-05-05**，React 版洞察為 **13**，見 DEV-LOG Batch 3）
- [ ] 手帖 7 筆（raincoat ×4, gear, worm, wing）
- [ ] 連結 5/5 全部形成
- [ ] 11 個選擇點全部正常觸發
- [ ] forced steps 按鈕逐一出現、不可跳過
- [ ] 視覺崩壞在 nerve ≤ 5 時觸發

### Batch 4 驗證

- [ ] 三欄佈局與 prototype 視覺一致
- [ ] 左側章節目錄可摺疊/展開
- [ ] 手帖 overlay 開關正常
- [ ] 連結卡在條件滿足時自動出現
- [ ] SVG 路線圖顯示 5 個地點 + 連線
- [ ] 章結算畫面正確顯示統計

### Batch 5 驗證

- [ ] 4 個 React 元件全部使用和紙色系
- [ ] Particles 粒子在 nerve 高時為灰、低時為紅
- [ ] NerveBar 在 nerve ≤ 4 時顯示危險色
- [ ] ImpactToast 在數值變動時正確浮現
- [ ] 無 CustomEvent 殘留（搜尋 `hgr-state` / `hgr-impact` 零結果）

### Batch 6 驗證

- [ ] `vite build` 成功，`dist/` 輸出無錯誤
- [ ] 部署 URL 可遊玩完整第一章
- [ ] 存檔 → 關閉瀏覽器 → 重開 → 讀檔成功
- [ ] `legacy/prototype.html` 仍可獨立運行

---

*// end of migration plan*
