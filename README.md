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
├── ENGINE_SPEC.md          引擎技術規格書
├── SCENES_FORMAT.md        場景資料寫作指南
├── CHAPTER_GUIDE.md        各章劇本設計筆記
├── reference/              原始原型與參考規格
│   ├── haguruma_ch1.jsx        歯車 React 原型（第一章）
│   ├── last-letter-game.html   CoC 引擎 v27（最後一封信）
│   ├── coc-game-spec.md        CoC 文字冒險設計規格
│   └── GAME_DEV_PLAN.md        脈輪覺醒開發計畫（封存）
└── src/                    （實作中）
    ├── engine/                 引擎核心
    ├── components/             React 元件
    └── data/chapters/          各章場景資料
```

## 技術棧

- React（資料驅動場景渲染）
- Vanilla CSS（視覺崩壞效果層）
- SVG Filter（feTurbulence 雜訊）
- Google Fonts（Noto Serif TC / JP）

## 開發狀態

- [x] 引擎架構設計（ENGINE_SPEC.md）
- [x] 場景格式定義（SCENES_FORMAT.md）
- [x] 第一章場景分割設計（CHAPTER_GUIDE.md）
- [ ] 引擎核心實作（v0.1）
- [ ] 第一章場景遷移
- [ ] 視覺崩壞系統
- [ ] 存檔系統
- [ ] 第二至十一章

## 原著

芥川龍之介《歯車》（1927，遺稿）  
青空文庫：https://www.aozora.gr.jp/cards/000879/files/42377_34745.html  
原著文本為公有領域。

## 授權

引擎代碼：MIT（待正式宣告）  
原著文本：Public Domain（青空文庫）
