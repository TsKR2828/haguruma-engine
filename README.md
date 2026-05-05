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
│   └── prototype-ch1.html      prototype 備份副本
├── ENGINE_SPEC.md          引擎技術規格書
├── SCENES_FORMAT.md        場景資料寫作指南
├── CHAPTER_GUIDE.md        各章劇本設計筆記
├── docs/
│   └── migration-plan.md       遷移計畫
├── reference/              原始原型與參考規格
│   ├── haguruma_ch1.jsx        歯車 React 原型（第一章）
│   ├── last-letter-game.html   CoC 引擎 v27（最後一封信）
│   ├── coc-game-spec.md        CoC 文字冒險設計規格
│   └── GAME_DEV_PLAN.md        脈輪覺醒開發計畫（封存）
└── src/
    ├── main.jsx                React 入口
    ├── App.jsx                 根元件
    ├── styles/                 全域樣式
    ├── components/             React 元件
    │   ├── HagurumaEngine.jsx      主遊戲協調器
    │   ├── SceneText.jsx           打字機文字渲染
    │   ├── ChoiceList.jsx          選項列表
    │   ├── EndScreen.jsx           章末結算畫面
    │   ├── NotebookPanel.jsx       手帖側欄
    │   ├── Particles.jsx           浮動粒子（神經連動變色）
    │   ├── StatRadar.jsx           三軸雷達圖
    │   ├── NerveBar.jsx            神經衰減進度條
    │   └── ImpactToast.jsx         浮動增減通知
    ├── engine/                 引擎核心邏輯
    │   ├── state.js                初始狀態 + reducer
    │   ├── effects.js              nerve / insight / writing 變化（純函式）
    │   ├── corrupt.js              文字崩壞效果（純函式）
    │   ├── connections.js          連結判定（純函式）
    │   ├── scenes.js               場景解析（純函式）
    │   ├── audio.js                Web Audio API 管理
    │   ├── save.js                 三層存檔系統
    │   └── settings.js             使用者設定
    ├── data/                   場景與章節資料
    │   ├── chapters/chapter01.js   第一章 33 場景
    │   ├── connections.js          連結規則（5 條）
    │   └── symbols.js              符號字形對應表
    └── utils/                  工具函式
```

## 啟動方式

### React 版（第一章可遊玩）

```bash
npm install
npm run dev
```

瀏覽器開啟 `http://localhost:5173`，點擊「開始遊玩」即可進入第一章。

> React 版第一章已完成遷移，可從開頭一路遊玩到結算畫面。第二章以後尚未遷移。

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
| `npm run validate:chapters` | 章節資料驗收（結構 + 通關測試） |
| `npm run test` | 執行 engine 單元測試 |

## 技術棧

- **React 版（第一章已遷移）：** Vite 6 + React 18（JSX）
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
- [ ] 第二至十一章

## 第一章驗收結果

以「全選第一選項」路線自動測試通過（2026-05-05）：

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
