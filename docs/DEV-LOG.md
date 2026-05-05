# Haguruma Engine DEV-LOG

> 用來記錄每一批 agent / Codex / Claude Code 的工作內容、驗收結果、commit 狀態與下一批任務。  
> 原則：每次只記錄已完成或明確排入的批次，不把尚未確認的構想寫成已完成。

---

## 2026-05-06

### 已完成

#### Batch 1 — Chapter Validator

狀態：完成

完成內容：

- 新增章節資料驗收器
- 可掃描章節資料
- 可檢查 scene id、choices、next、ending 可達性
- 可跑 always_first_choice / always_second_choice / random_choice 測試
- 可輸出 validation report
- 已確認不破壞既有 prototype

驗收結果：

- chapter validator 可執行
- Ch1 可被讀取
- 章節結構可檢查
- 後續 Ch2～Ch11 可沿用同一套驗收流程

備註：

- 之後新增章節前，先寫 chapter spec
- 新增章節 JSON 後，必須先跑 validator
- 不應直接把章節接進 UI 後才發現資料錯誤

---

### 進行中 / 下一批

#### Batch 2A — Pure Engine Core Modules

狀態：待執行

目標：

將 prototype 裡的命令式遊戲邏輯，拆成可測試、無瀏覽器依賴的純函式模組。

預定檔案：

- src/engine/state.js
- src/engine/effects.js
- src/engine/corrupt.js
- src/engine/connections.js
- src/engine/scenes.js

本批次範圍：

- initialState
- reducer
- nerve / insight / writing 狀態變化
- flags / notebook / connections 管理
- applyEffects
- resolveText
- resolveChoices
- getSceneById
- corruptText
- resolveConnections

本批次排除：

- audio.js
- save.js
- settings.js
- React UI 接線
- 劇情文字修改
- 章節內容新增

驗收條件：

- npm run build 通過
- npm run validate:chapters 通過
- engine module 可被 import
- 新增 engine 測試
- 不修改 Ch1 劇情文字
- 不破壞 legacy prototype

預定 commit message：

refactor: extract pure engine core modules

---

### 後續批次

#### Batch 2B — Browser Engine Adapters

狀態：待排程

範圍：

- src/engine/audio.js
- src/engine/save.js
- src/engine/settings.js

說明：

這批處理 Web Audio API、localStorage、sessionStorage、使用者設定等瀏覽器相關功能。  
必須等 Batch 2A 完成後再做，避免純函式核心被瀏覽器依賴污染。

---

#### Batch 3 — React UI Integration

狀態：待排程

目標：

將 React UI 接上 engine core，讓 Ch1 可以透過 React 版本完整遊玩。

前置條件：

- Batch 2A 完成
- Batch 2B 完成
- chapter validator 通過

---

#### Batch 4 — Chapter 2 Spec

狀態：待排程

目標：

先寫 Ch2「復讐」章節規格，不直接生成正式 scene JSON。

內容包含：

- 章節主題
- 場景列表
- 選擇點
- flags
- notebook symbols
- connections
- Nerve / Insight / Writing 變化
- 驗收條件

---

## Commit Log

| Date | Batch | Commit | Status | Notes |
|---|---|---|---|---|
| 2026-05-06 | Batch 1 | test: add chapter validation tool | done | chapter validator completed |
| 2026-05-06 | Batch 2A | refactor: extract pure engine core modules | planned | pure engine extraction |

---

## Rules for Future Agents

1. 每一批只做指定範圍。
2. 不要自行擴張任務。
3. 不要刪除 legacy prototype。
4. 不要修改劇情文字，除非任務明確要求。
5. 每批完成後更新 DEV-LOG。
6. 每批都要留下驗收結果。
7. 每批都要有 commit message。
8. 新增章節前先寫 spec。
9. 新增章節資料後先跑 validator。
10. React UI 接線前，engine core 必須先可測試。
