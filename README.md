# 歯車引擎 haguruma-engine

芥川龍之介《歯車》改編 CoC TRPG 沉浸式閱讀引擎。  
React + 資料驅動架構。

---

## 概要

將芥川龍之介 1927 年的遺稿《歯車》改編為可互動的沉浸式閱讀體驗。  
玩家的選擇不改變故事走向——芥川的命運是確定的。選擇改變的是「你觀察到了什麼」和「你如何理解你觀察到的」。

## 核心機制

| 機制 | 說明 |
|------|------|
| 三軸系統 | 神經（遞減 → 視覺崩壞）/ 洞察（累加）/ 執筆（累加） |
| 手帖 | 追蹤反覆出現的文學意象，累積觸發「連結」判定 |
| 視覺崩壞 | 神經值下降 → 暗角、雜訊、文字亂碼（移植自 CoC 引擎 SAN 系統） |
| 日中雙語 | 日文原文在上，中文翻譯在下 |
| 存檔 | 三層備援（persistent storage / sessionStorage / 記憶體） |

## 文件

- [`ENGINE_SPEC.md`](ENGINE_SPEC.md) — 技術規格
- [`SCENES_FORMAT.md`](SCENES_FORMAT.md) — 場景資料格式
- [`CHAPTER_GUIDE.md`](CHAPTER_GUIDE.md) — 第一章場景設計

## 專案結構

```
haguruma-engine/
├── index.html              Vite 入口 HTML
├── package.json            Vite + React 18
├── vite.config.js          Vite 設定
├── prototype.html          可遊玩原型（第一章完整版）
├── legacy/
│   ├── prototype-ch1.html      prototype 備份副本
│   └── chapter02_deprecated_v1.js  CH2 舊版（含幻覺內容，已作廢，僅供 schema 參考）
├── ENGINE_SPEC.md          引擎技術規格書
├── SCENES_FORMAT.md        場景資料寫作指南
├── CHAPTER_GUIDE.md        各章劇本設計筆記
├── scripts/                驗證與建置工具
│   ├── validate-chapters.js    章節資料驗收器（結構 + 通關模擬 + cross-ref + namespace，讀 book bundle）
│   ├── validate-fidelity.js    原文忠實度驗證器（origin:"source" 逐字比對底本，讀 book bundle）
│   ├── resolve-book.js         CLI `--book=<id>` 解析（Batch F11，兩支驗證器共用）
│   └── build-aozora-text.js    底本 HTML → 純文字轉換工具
├── tests/                  Vitest 測試（337 tests / 34 files）
│   ├── engine/                 引擎純函式測試
│   ├── components/             React 元件 smoke tests
│   ├── scripts/                validator 測試（cross-ref / namespace / origin）
│   ├── integration/            端到端遊戲流程測試 + book-smoke.test.jsx（換書可行性證明，Batch F11）
│   └── fixtures/book-smoke/    迷你假書 bundle（雙軸 courage/memory，Batch F11 換書證明用）
├── docs/
│   ├── migration-plan.md       遷移計畫
│   ├── DECISIONS.md            設計決策紀錄
│   ├── DEV-LOG.md              各批次工作日誌
│   ├── chapter-data-schema.md  場景資料 schema 定義
│   ├── chapter02-spec.md       第二章「復讐」舊規格書（⚠ 已被 ch2-source-map.md 取代，僅供歷史對照）
│   ├── chapter03-spec.md       第三章「夜」規格書
│   ├── chapter04-spec.md       第四章「まだ？」舊規格書（⚠ 舊友場景已被 ch4-source-map.md 取代，僅供歷史對照）
│   ├── chapter05-spec.md       第五章「赤光」規格書
│   ├── chapter06-spec.md       第六章「飛行機」舊規格書（⚠ 稻荷／蓚酸段已被 ch6-source-map.md 取代，僅供歷史對照）
│   ├── ch1-source-map.md       第一章原文回填對照表
│   ├── ch2-source-map.md       第二章重切施工圖（正典來源，Batch F3）
│   ├── ch3-source-map.md       第三章重切施工圖（正典來源，Batch F7）
│   ├── ch4-source-map.md       第四章重切施工圖（正典來源，Batch F8）
│   ├── ch5-source-map.md       第五章重切施工圖（正典來源，Batch F9）
│   ├── ch6-source-map.md       第六章重切施工圖（正典來源，Batch F10）
│   ├── batch-f6-inline-actions.md  文中互動（action/forced block）施工圖，Batch F6
│   └── origin-marking-spec.md  原文標記（origin marking）＋忠實度驗證規格
├── reference/              原始原型與參考規格
│   ├── haguruma_ch1.jsx        歯車 React 原型（第一章）
│   ├── last-letter-game.html   CoC 引擎 v27（最後一封信）
│   ├── coc-game-spec.md        CoC 文字冒險設計規格
│   ├── GAME_DEV_PLAN.md        脈輪覺醒開發計畫（封存）
│   └── aozora/                 青空文庫底本（原文回填的權威來源，不可刪除）
│       ├── 42377_34745_raw.html    底本原始 HTML
│       └── haguruma_original.txt   底本純文字（origin:"source" 逐字比對用）
└── src/
    ├── main.jsx                React 入口
    ├── App.jsx                 根元件（title/author/quote/UI 字串讀 BOOK.meta/BOOK.ui）
    ├── bookLoader.js           **換書點**（Batch F11）：一行 `export { BOOK } from "./books/haguruma/index.js"`
    ├── books/haguruma/index.js BOOK bundle 單一事實來源（stats/corruption/motif/ui/saveKey/validator/fidelity，Batch F11）
    ├── styles/                 全域樣式
    ├── components/             React 元件
    │   ├── HagurumaEngine.jsx      主遊戲協調器（收 book 參數，預設 haguruma 綁定）
    │   ├── SceneText.jsx           打字機文字渲染（崩壞門檻讀 book.corruption）
    │   ├── ChoiceList.jsx          選項列表
    │   ├── EndScreen.jsx           章末結算畫面
    │   ├── NotebookPanel.jsx       手帖側欄
    │   ├── Particles.jsx           浮動粒子（stat 連動變色，讀 book.corruption）
    │   ├── StatRadar.jsx           N 軸雷達圖（軸數＝book.stats.length，Batch F11）
    │   ├── NerveBar.jsx            drain 軸衰減進度條（讀 book.stats）
    │   ├── ImpactToast.jsx         浮動增減通知
    │   └── motifs/index.js         特效 motif registry（{gears, none}，book.motif 決定套用哪組，Batch F11）
    ├── engine/                 引擎核心邏輯（純函式，收顯式 book 參數；haguruma 綁定版保留向後相容）
    │   ├── state.js                初始 state（createInitialState(book) 由 book.stats 生成 stat 欄位）
    │   ├── effects.js              stat 變化夾制（applyEffectsFor(book, ...) 迭代 book.stats）
    │   ├── corrupt.js              文字崩壞效果（corruptTextFor 門檻/上限為顯式參數）
    │   ├── connections.js          連結判定（純函式）
    │   ├── scenes.js               場景解析（純函式）
    │   ├── audio.js                Web Audio API 管理
    │   ├── save.js                 三層存檔系統（createSaveModule(book) 讀 book.saveKey）
    │   └── settings.js             使用者設定
    ├── data/                   場景與章節資料
    │   ├── chapters/chapter01.js   第一章 34 場景（自含 connections + locations）
    │   ├── chapters/chapter02.js   第二章 34 場景
    │   ├── chapters/chapter03.js   第三章 38 場景
    │   ├── chapters/chapter04.js   第四章 28 場景
    │   ├── chapters/chapter05.js   第五章 39 場景
    │   ├── chapters/chapter06.js   第六章 29 場景
    │   ├── chapterRegistry.js      章節註冊表
    │   ├── symbols.js              符號字形對應表
    │   └── palette.js              色票（BOOK.palette 於 App 啟動時注入 --washi-* CSS 變數）
    └── utils/                  工具函式
```

## 啟動方式

> **注意：** `index.html` 和 `dist/index.html` 都**不能**直接雙擊開啟（file:// 下路徑解析錯誤，頁面會空白）。必須透過下列方式啟動。

### React 版（全六章可遊玩）

```bash
npm install
npm run dev
```

瀏覽器開啟 `http://localhost:5173`，點擊「開始遊玩」即可進入第一章；六章可依序遊玩至《歯車》終幕。

> React 版第一至六章皆已完成遷移＋原文回填（`origin:"source"` 標記涵蓋全部敘事正文，`npm run validate:fidelity` 驗證通過），**《歯車》全六章可從開頭一路遊玩到終幕**。第二章依 `docs/ch2-source-map.md`（Batch F3）重切完工，共 34 場景、8 選擇點，取代含幻覺內容的舊版（`docs/chapter02-spec.md` 已標示作廢，作廢版存檔於 `legacy/chapter02_deprecated_v1.js`）。第三章依 `docs/ch3-source-map.md`（Batch F7）重切完工，共 38 場景、7 選擇點（含夢境段全 auto，無選擇），CH3 coverage 100.0%。第四章依 `docs/ch4-source-map.md`（Batch F8）重切完工，共 28 場景、6 選擇點，CH4 coverage 99.9%，取代含幻覺內容（捏造「兒子自殺未遂」對話）的舊友場景（`docs/chapter04-spec.md` 已標示作廢）。第五章依 `docs/ch5-source-map.md`（Batch F9）重切完工，共 39 場景、7 選擇點、16 notebook keys、6 條 connections（含 1 條跨章 CH1 依賴 `book_worm`、1 條跨章 CH4 依賴 `ch04.la_mort`），CH5 coverage 99.9%，取代含幻覺內容（捏造「赤光池塘」「穿寢衣老婦」「死鼴鼠」，且漏掉章題眼《赤光》歌集信）的段落（`docs/chapter05-spec.md` 已標示作廢）。第六章依 `docs/ch6-source-map.md`（Batch F10）重切完工，共 29 場景、4 選擇點（全在前半，`ch6_final_walk` 起零選擇——命運收攏，讀者只剩 forced steps）、15 notebook keys、6 條 connections（全部跨章：CH1／CH4／CH5 依賴），CH6 coverage 99.9%，取代含幻覺內容（捏造「叔父的稻荷狐狸信仰」「義妹的丈夫逼她喝草酸」，且「飛行機病」台詞說話者誤標妻の母）的段落（`docs/chapter06-spec.md` 已標示作廢），**至此《歯車》全卷六章完工**。
> Build 後需用 `npm run preview` 預覽，或將 `dist/` 部署至 web server 根目錄。

### Legacy Prototype（可遊玩 — 第一章完整版）

```bash
npx serve -l 3456 -s .
```

瀏覽器開啟 `http://localhost:3456/prototype.html` 即可遊玩。

> 無需 `npm install`。prototype.html 為純前端單檔，僅依賴 Google Fonts CDN。
> 備份副本保存於 `legacy/prototype-ch1.html`。

### npm scripts

| 指令 | 說明 |
|------|------|
| `npm run dev` | 啟動 Vite dev server（React 版） |
| `npm run build` | 建置生產版本至 `dist/` |
| `npm run preview` | 預覽 build 結果 |
| `npm run legacy` | 啟動 legacy prototype server（port 3456） |
| `npm run validate:chapters` | 章節資料驗收（結構 + 通關測試；支援 `-- --book=<id>` 換書驗證，預設 haguruma） |
| `npm run validate:fidelity` | 原文忠實度驗證（origin:"source" 逐字比對底本；同樣支援 `-- --book=<id>`） |
| `npm run test` | 執行 engine 單元測試 |

## 技術棧

- **React 版（全六章）：** Vite 6 + React 18（JSX）
- **Legacy prototype：** Vanilla JS + HTML（資料驅動場景渲染，單檔原型）
- Vanilla CSS + CSS Variables（和紙色系）
- SVG Filter（feTurbulence 雜訊、feDisplacementMap 地圖扭曲）
- Google Fonts（Noto Serif TC / JP）
- React 18 元件（src/components/ — legacy prototype 中透過 CDN + Babel standalone inline 執行）

## 開發狀態

- [x] 引擎架構設計（ENGINE_SPEC.md）
- [x] 場景格式定義（SCENES_FORMAT.md）
- [x] 第一章場景分割設計（CHAPTER_GUIDE.md）
- [x] 引擎核心實作（prototype.html — 資料驅動 scene runner）
- [x] 第一章全 33 場景遷移（含 11 選擇點）
- [x] 視覺崩壞系統（暗角、雜訊、文字 corrupt）
- [x] 三欄佈局（章節目錄 / 遊戲本體 / 地圖＋手帖＋連結卡）
- [x] SVG 東京路線地圖（5 地點 + 神經扭曲）
- [x] 連結卡系統（5 條規則全部驗證通過）
- [x] 存檔系統（三層備援 localStorage / sessionStorage / 記憶體；場景進入時自動存檔）
- [x] React 元件整合（Particles / StatRadar / NerveBar / ImpactToast 經 CustomEvent 橋接）
- [x] 設定面板（打字速度 / 自動推進 / 音量，存 localStorage）
- [x] 音效基礎架構（Web Audio API：playAmbient / playSfx / stopAmbient，場景 audio 欄位）
- [x] 章節管理機制（`chapterRegistry.js` 章節註冊表、章節自含式資料結構、跨章 carryOver state）
- [x] 角色立繪（`portraits` 對照表 + `speakerId` 欄位 + LeftSidebar 動態切換，CH1 7 位角色）
- [x] 原文標記（origin marking）＋忠實度驗證工具（`origin:"source"|"added"` 欄位、`.block-added` 樣式、`npm run validate:fidelity`；CH1 敘事正文 100% 回填）
- [x] CH2–CH6 章節規格書（`docs/chapter0X-spec.md`，基於青空文庫原文全面改寫）
- [x] 第二章「復讐」重切完工（`docs/ch2-source-map.md` Batch F3：34 場景、8 選擇點、12 notebook keys、5 條 connections；`origin:"source"` 全面標記，CH2 coverage 99.9%；取代含幻覺內容的舊版 `chapter02-spec.md`／舊 `chapter02.js`，作廢版存檔於 `legacy/chapter02_deprecated_v1.js`）
- [x] 文中互動啟用（`docs/batch-f6-inline-actions.md` Batch F6：`action`／`forced` block schema、SceneText 打字流程暫停/續行接線、CH1 `auto_phone`／CH2 `ch2_polikouchka`／`ch2_rat_search` 三處內容）
- [x] 第三章「夜」重切完工（`docs/ch3-source-map.md` Batch F7：38 場景、7 選擇點（含全 auto 夢境段）、12 notebook keys、6 條 connections（含 2 條跨章 CH1 依賴）；`origin:"source"` 全面標記，CH3 coverage 100.0%）
- [x] 測試覆蓋擴增（204 → 323 tests，33 test files，含 component smoke tests / origin marking / cross-ref / F4 bug 修復回歸 / CH2～CH5 跨章 connection 觸發測試 / action-forced 測試）
- [x] 第四章「まだ？」重切完工（`docs/ch4-source-map.md` Batch F8：28 場景、6 選擇點、12 notebook keys、6 條 connections（含 1 條跨章 CH1 依賴 `raincoat_death`、1 條跨章 CH3 依賴 `ch03.mirror_watch`）；`origin:"source"` 全面標記，CH4 coverage 99.9%；取代含幻覺內容的舊友場景，`docs/chapter04-spec.md` 該段已標示作廢）
- [x] 第五章「赤光」重切完工（`docs/ch5-source-map.md` Batch F9：39 場景、7 選擇點、16 notebook keys、6 條 connections（含 1 條跨章 CH1 依賴 `book_worm`、1 條跨章 CH4 依賴 `ch04.la_mort`）；`origin:"source"` 全面標記，CH5 coverage 99.9%；取代含幻覺內容的「赤光池塘／穿寢衣老婦／死鼴鼠」段落並補回章題眼《赤光》歌集信，`docs/chapter05-spec.md` 該段已標示作廢）
- [x] 第六章「飛行機」重切完工（`docs/ch6-source-map.md` Batch F10：29 場景、4 選擇點（全在前半，`ch6_final_walk` 起零選擇）、15 notebook keys、6 條 connections（全部跨章：CH1 依賴 `raincoat_death`、CH4 依賴 `ch04.la_mort`、CH5 依賴 4 個 key）；`origin:"source"` 全面標記，CH6 coverage 99.9%；取代含幻覺內容的「叔父稻荷狐狸信仰／義妹蓚酸毒殺」段落並更正「飛行機病」說話者為妻の弟，`docs/chapter06-spec.md` 該段已標示作廢；`ch6_final_walk` 使用 Batch F6 forced steps 機制作為終幕視覺崩壞的文中互動；**《歯車》全六章完工**）
- [x] **換書泛化**（`docs/batch-f11-generalize.md` Batch F11，D9 完成）：全卷六章穩定後執行 D9 規劃的通用化——新增 `src/books/haguruma/index.js`（BOOK bundle：stat 定義／崩壞閾值／motif／UI 字串／saveKey／validator 豁免清單／fidelity 底本路徑，單一事實來源）與 `src/bookLoader.js`（換書點，一行 import）；engine（`state`/`effects`/`corrupt`/`save`）、元件（`HagurumaEngine`/`NerveBar`/`StatRadar`/`SceneText`/`ForcedSteps`/`Particles`/`LeftSidebar`/`App` 等）、工具（`validate-chapters.js`/`validate-fidelity.js`，CLI 支援 `--book=<id>`）全面收 `book` 參數，haguruma 綁定版保留向後相容；新增 `tests/fixtures/book-smoke/` 迷你假書＋ `tests/integration/book-smoke.test.jsx`（14 tests）作為「換書只需換 data、引擎與 UI 零修改」的可執行證明；四驗證（test/build/validate:chapters/validate:fidelity）與 `reports/pre-f11-baseline.txt` 重構前基準逐字一致，337/337 tests（較基準 323 增加 14 個換書證明測試）

## 第一章驗收結果

以「全選第一選項」路線自動測試通過（2026-05-05）：

> 注：以下為 **prototype 版數據（2026-05-05）**；React 版洞察 13（見 DEV-LOG Batch 3），場景數含 F2-3 新增場景為 34。

| 項目 | 結果 |
|------|------|
| 場景總數 | 33（prologue → auto_ending） |
| 最終神經 | 6/10 |
| 最終洞察 | 11 |
| 最終執筆 | 2 |
| 手帖 | 7 筆（raincoat ×4, gear, worm, wing） |
| 連結 | 5/5 全部形成 |
| 路線 | kasugai → station → t_san → street → hotel |
| 章結算畫面 | 顯示正確統計 |
| 關閉按鈕 | 存在 |
| 選擇分歧 | 11 個選擇點全部正常觸發 |
| 條件文本 | choicesMade 旗標正確切換 |

## 原著

芥川龍之介《歯車》（1927，遺稿）  
青空文庫：https://www.aozora.gr.jp/cards/000879/files/42377_34745.html  
原著文本為公有領域。

## 授權

引擎代碼：MIT（待正式宣告）  
原著文本：Public Domain（青空文庫）
