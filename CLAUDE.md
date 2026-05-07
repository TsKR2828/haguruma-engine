# Haguruma Engine — CLAUDE.md

## 專案概要

芥川龍之介《歯車》互動文學引擎。React + Vite，資料驅動架構。
原著 11 章 51 節，目前完成第一章（33 場景）。

## 技術棧

- Vite 6 + React 18（JSX，無 TypeScript）
- 無 CSS-in-JS — 全域 CSS + CSS 變數（和紙色系 `--washi-*`）
- 無 router — 單頁遊戲
- Vitest 測試
- 場景資料是 JS 物件，不是 JSON（因為有動態 `text: (state) => [...]` 函式）

## 目錄結構

```
src/
├── engine/          純邏輯（state, effects, scenes, connections, corrupt, save, audio, settings）
├── components/      React UI（HagurumaEngine 為主協調器）
├── data/
│   ├── chapterRegistry.js   章節註冊表（getChapter(num)）
│   ├── chapters/            每章一個自含檔案
│   ├── symbols.js           符號定義（全域）
│   ├── palette.js           色系常數
│   └── chapters.js          章節目錄清單
├── styles/          全域 CSS
└── utils/           工具函式
scripts/             validate-chapters.js 章節驗證器
tests/               Vitest 單元測試
docs/                DEV-LOG, migration-plan, schema doc
reference/           封存的設計參考文件（不可刪除）
legacy/              舊版檔案（prototype-ch1.html, 孤兒資料檔）
```

## 常用指令

```bash
npm run dev              # Vite dev server
npm run build            # production build
npm test                 # Vitest（39 tests）
npm run validate:chapters  # 章節資料驗證
npm run legacy           # 啟動 legacy prototype（port 3456）
```

## 章節資料格式

每章是一個自含物件，放在 `src/data/chapters/chapterXX.js`：

```javascript
export const CHAPTER_XX = {
  chapter: 2,
  title: "復讐",
  titleCn: "復仇",
  startScene: "prologue",
  startLocation: "tokyo_station",
  sceneCount: N,
  locations: [...],
  connections: [...],
  scenes: { ... },
};
```

加新章節只需：
1. 寫 `src/data/chapters/chapterXX.js`
2. 在 `src/data/chapterRegistry.js` 加一行 import + 註冊

## 工作規則

1. 每一批只做指定範圍，不自行擴張任務。
2. 不刪除 `legacy/` 和 `reference/` 下的任何檔案。
3. 不修改劇情文字，除非任務明確要求。
4. 每批完成後更新 `docs/DEV-LOG.md`。
5. 每批都要留下驗收結果。
6. 新增章節前先寫 chapter spec。
7. 新增章節資料後先跑 `npm run validate:chapters`。
8. engine core 是純函式，不可引入瀏覽器依賴。
9. 重大設計決策記錄到 `docs/DECISIONS.md`。
10. 遊戲文本由使用者（月月）提供，agent 負責技術實作。

## 驗收流程

每批完成後依序檢查：
1. `npm run build` 通過
2. `npm test` 通過
3. `npm run validate:chapters` 通過
4. 瀏覽器 preview 可遊玩
5. prototype.html 仍可獨立運行
6. 零 console error

## 權威文件

- `ENGINE_SPEC.md` — 技術架構規格書
- `SCENES_FORMAT.md` — 場景資料寫作指南
- `CHAPTER_GUIDE.md` — 章節劇本設計筆記
- `docs/chapter-data-schema.md` — 場景 schema 定義
- `docs/DECISIONS.md` — 設計決策紀錄
