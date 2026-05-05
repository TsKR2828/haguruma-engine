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
├── prototype.html          可遊玩原型（第一章完整版）
├── ENGINE_SPEC.md          引擎技術規格書
├── SCENES_FORMAT.md        場景資料寫作指南
├── CHAPTER_GUIDE.md        各章劇本設計筆記
├── reference/              原始原型與參考規格
│   ├── haguruma_ch1.jsx        歯車 React 原型（第一章）
│   ├── last-letter-game.html   CoC 引擎 v27（最後一封信）
│   ├── coc-game-spec.md        CoC 文字冒險設計規格
│   └── GAME_DEV_PLAN.md        脈輪覺醒開發計畫（封存）
└── src/components/         備用 React 元件
    ├── Particles.jsx           浮動粒子（神經連動變色）
    ├── StatRadar.jsx           三軸雷達圖
    ├── NerveBar.jsx            神經衰減進度條
    └── ImpactToast.jsx         浮動增減通知
```

## 啟動方式

```bash
npx serve -l 3456 -s .
```

瀏覽器開啟 `http://localhost:3456/prototype.html` 即可遊玩。

> 無需 `npm install`。prototype.html 為純前端單檔，僅依賴 Google Fonts CDN。

## 技術棧

- Vanilla JS + HTML（資料驅動場景渲染，單檔原型）
- Vanilla CSS（視覺崩壞效果層、摺書動畫）
- SVG Filter（feTurbulence 雜訊、feDisplacementMap 地圖扭曲）
- Google Fonts（Noto Serif TC / JP）
- React 18 元件（src/components/ — 同步 inline 至 prototype.html，透過 CDN + Babel standalone 執行）

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
