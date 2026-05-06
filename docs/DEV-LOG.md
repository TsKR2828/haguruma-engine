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

#### Batch 2A — Pure Engine Core Modules

狀態：完成

完成內容：

- src/engine/state.js — initialState + reducer（8 action types）
- src/engine/effects.js — loseNerve / gainInsight / gainWriting / applyEffects（純函式）
- src/engine/corrupt.js — corruptText（確定性 hash，非 Math.random）
- src/engine/connections.js — resolveConnections / applyConnection（純函式）
- src/engine/scenes.js — getSceneById / resolveText / resolveChoices（純函式）
- src/engine/index.js — barrel export
- 完整單元測試覆蓋

驗收結果：

- npm run build 通過
- npm run validate:chapters 通過
- npm run test 通過
- 純核心模組零瀏覽器依賴
- 不修改 Ch1 劇情文字
- 不破壞 legacy prototype

---

#### Batch 2B — Browser Engine Adapters

狀態：完成

完成內容：

- src/engine/audio.js — Web Audio API 管理（playAmbient / playSfx / stopAllAudio / setVolumes）
- src/engine/save.js — 三層存檔（localStorage → sessionStorage → memory）
- src/engine/settings.js — 使用者設定（textSpeed / audioVolume / reducedMotion / autoplay）

驗收結果：

- npm run build 通過
- 瀏覽器 adapter 與純核心分離
- barrel export 分 Pure core / Browser adapters 兩區

---

#### Batch 3 — React UI Integration

狀態：完成

完成內容：

- src/components/HagurumaEngine.jsx — 主遊戲協調器（loadScene / onTextComplete / onChoice / onContinue）
- src/components/SceneText.jsx — 打字機文字渲染（narration 18ms / inner 25ms / dialogue 20ms / system instant）
- src/components/ChoiceList.jsx — 選項列表
- src/components/EndScreen.jsx — 章末結算畫面
- src/components/NotebookPanel.jsx — 手帖側欄（符號 + 連結 + StatRadar）
- src/styles/game.css — 完整遊戲 CSS（和紙色系）
- src/App.jsx — 標題畫面 + 遊戲切換
- 整合既有元件：Particles / NerveBar / ImpactToast / StatRadar

驗收結果：

- npm run build 通過
- npm run validate:chapters 通過（22/22 playthroughs reached ending）
- React 版可從 Ch1 prologue 遊玩到 auto_ending
- always_first_choice 路線完整通過
- 最終狀態：神經 6/10、洞察 13、執筆 2、手帖 7 筆、連結 5
- 打字機效果正常、選項正常、繼續提示正常
- 連結形成 toast 正常顯示
- 零 console error
- 不修改 Ch1 劇情文字
- 不破壞 legacy prototype

---

---

## 2026-05-07

### 已完成

#### Batch 3.5A — Chapter Management Mechanism

狀態：完成

動機：

審查框架後發現 HagurumaEngine 硬寫 CHAPTER_01、CONNECTIONS 全域、initialState 硬寫 kasugai，無法直接加 Ch2。在寫 Ch2 spec 前先補章節管理層。

完成內容：

- chapter01.js 改為自含式（scenes + connections + locations + startLocation）
- 新增 src/data/chapterRegistry.js — 章節註冊表（getChapter / getAllChapters / getChapterCount）
- src/engine/state.js 新增 createChapterState(chapter, carryOver) — 取代 hardcode initialState
- HagurumaEngine.jsx 改為接收 chapter / carryOver / onChapterEnd props
- App.jsx 新增章節管理（chapterNum state + handleChapterEnd + advanceChapter）
- NotebookPanel 改用 chapter.connections 取代全域 CONNECTIONS import
- data/index.js 清理，移除舊的全域 export

驗收結果：

- npm run build 通過
- npm run test 通過（39/39）
- Ch1 仍可從 prologue 遊玩到 ending
- 加新章節只需：寫 chapterXX.js + 在 chapterRegistry 加一行 import

---

#### Batch 3.5B — Framework Audit Fix

狀態：完成

動機：

全面審計框架，發現 Critical 4 項 + Important 5 項問題。在 Ch2 開發前修復以避免事後通盤改。

完成內容：

- C1：EndScreen 新增「次の章へ」按鈕 + advanceChapter 接通（App → HagurumaEngine → EndScreen）
- C2：save.js restoreState 移除 hardcode "kasugai" fallback，改為 null
- C3：HagurumaEngine 每次選擇後自動呼叫 saveGame；App.jsx 啟動時從 loadSave 恢復 chapterNum
- I1：NotebookPanel 修復 SYMBOL_GLYPHS 渲染 bug（object → glyph 屬性）
- I3：handleChapterEnd 改用排除式（解構排除 currentSceneId / currentChapter / journey），未來新增 state 欄位自動 carry over
- I5：孤兒檔案（ch1_raincoat.js / connections.js / locations.js）移至 legacy/
- N1：loadScene useCallback deps 修正為 [chapter]
- 新增 .end-advance-btn CSS 樣式（和紙色系一致）

驗收結果：

- npm run build 通過
- npm run test 通過（39/39）
- Ch1 遊戲流程正常
- 瀏覽器 preview 標題畫面 → 開始遊玩 → 打字機效果正常
- 零 console error

備註：

- C4（schema doc + validator 更新 locations/connections/startLocation）留到 Batch 4 寫 Ch2 spec 時一起處理
- I2（journey.symbols 跨章節是否保留）為設計決策，待確認

---

#### Batch 3.5C — Scene History UX

狀態：完成

動機：

對比 prototype，React 版缺少三項閱讀體驗功能。

完成內容：

- 已讀文字淡化（opacity 0.35，hover 恢復 0.55）
- 摺頁收合/展開（history 按 fold 標記分組，▸/▾ 切換）
- 閱讀位置優化（scrollIntoView block:"center" + 50vh 底部留白）
- HagurumaEngine 新增 history[] + collapsed{} + blocksRef

驗收結果：

- npm run build 通過
- npm run test 通過（39/39）
- 瀏覽器驗證：opacity 0.35、fold toggle 正常、spacer 正確
- 零 console error

---

#### Batch 3.5D — Pre-Ch2 Architecture Audit & Fixes

狀態：完成

動機：

Ch2 前全面總檢。確認資料格式、狀態管理、存檔相容、閱讀體驗、擴充性不會在 Ch2-Ch11 期間需要通盤改。

完成內容：

- F1：save.js 加入版本檢查 + migration 框架（CURRENT_VERSION + migrate() chain）
- F2：docs/chapter-data-schema.md 補齊 effectFn / pause / startLocation / condition / Location / Connection
- F3：底部留白從 50vh 調為 35vh
- F4：auto-advance 和 ending 場景也觸發 saveGame()（不再只有 choice 後才存）

驗收結果：

- npm run build 通過
- npm run test 通過（39/39）
- 瀏覽器驗證：spacer 252px (35vh)、save v:1 正確
- 零 console error

---

#### Batch 3.5E — Cleanup & Integration Tests

狀態：完成

動機：

清理審計產出的低優先項目（L1/L3/L4）並補充整合測試（L2）。

完成內容：

- L1：移除 state.js 未使用的 reducer（67 行死碼），barrel export 改為 createChapterState
- L2：新增 tests/integration/game-flow.test.js（27 個整合測試案例）
- L3：validate-chapters.js 改從 initialState import 初始值，不再 hardcode
- L4：saveGame() 回傳 boolean，失敗時 HagurumaEngine toast 通知用戶

測試覆蓋項目：
- 開始遊戲（state init + scene load）
- 推進 scene（auto-advance + notebook/effects）
- 選擇分歧（condition filter + navigation）
- flags 正確變化（set + dynamic text response）
- fold 展開/收合（grouping algorithm + toggle logic）
- 手帖新增（scene-level + choice-level + dedup + connections）
- 章結算正確（showEnd + full playthrough + carryOver）
- 存檔讀檔正確（serialize + restore + import + edge cases）

驗收結果：

- npm run build 通過
- npm run test 通過（66/66）
- npm run validate:chapters 通過（22/22 playthroughs）
- 零 console error

---

#### Batch 4 — History Render Optimization

狀態：完成

動機：

審計項目 D1「長篇 history 效能優化」。Ch1 有 33 場景，每次 setGs/setPhase 都會重新遍歷 history 並重建所有 section JSX。隨章節增長會線性惡化。

分析：

- 原始實作：history 分組邏輯在 render 內 IIFE 中，無 memo 邊界
- 每次 gs/phase/blocks 變化都觸發父層 re-render → 重建所有 history section 的 JSX
- 已摺疊的 section 原本已正確不渲染 blocks（`{!isCollapsed && ...}`）
- 打字機 charIdx 變化不觸發父層（僅在 SceneText 內部）✓
- 預估 Ch5+ 每章 40 場景，每次 state 變化重建 ~40 個 section 的 DOM diff 成本會增加

修正方式：

- 拆出 `HistorySection`（memo）— 只在 section/isCollapsed/onToggle 變化時重新渲染
- 拆出 `HistoryBlock`（memo）— 只在 block 資料變化時重新渲染
- 用 `useMemo([history])` 緩存 section 分組計算，不隨 gs/phase 變化重跑
- 已摺疊的 section 仍然不渲染內部 blocks（行為不變）
- 未導入虛擬列表套件（Ch1-Ch3 不需要）

修改檔案：

- src/components/HagurumaEngine.jsx

驗收結果：

- npm run build 通過
- npm run test 通過（66/66）
- npm run validate:chapters 通過（22/22）
- 瀏覽器驗證：fold toggle 正常（▸/▾）、opacity 0.35、展開/收合 block 數量正確
- 零 console error

---

### 待修問題清單（Architecture Audit 產出）

#### 不建議拖到 Ch5 後

| # | 項目 | 說明 |
|---|------|------|
| D3 | save migration 實際實作 | 若 Ch2-Ch4 間新增 state 欄位需 v1→v2 |

---

### 後續批次

---

#### Batch 5 — Chapter 2 Spec

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
| 2026-05-06 | Batch 2A | refactor: extract pure engine core modules | done | 5 pure modules + tests |
| 2026-05-06 | Batch 2B | feat: add browser engine adapters | done | audio / save / settings |
| 2026-05-06 | Batch 3 | feat: connect React UI to chapter one engine | done | Ch1 playable end-to-end |
| 2026-05-07 | Batch 3.5A | refactor: add chapter management | done | self-contained chapters + registry + props |
| 2026-05-07 | Batch 3.5B | fix: framework audit fixes | done | EndScreen / save / NotebookPanel / orphans |
| 2026-05-07 | Batch 3.5C | feat: scene history UX | done | fading / fold toggle / scroll comfort |
| 2026-05-07 | Batch 3.5D | fix: pre-Ch2 architecture fixes | done | save migration / schema / spacer / auto-save |
| 2026-05-07 | Batch 3.5E | refactor+test: cleanup + integration tests | done | remove reducer / sync validator / save warning / 27 tests |
| 2026-05-07 | Batch 4 | perf: optimize history fold rendering | done | React.memo + useMemo, no virtual list needed yet |

---

## Rules for Future Agents

見 `CLAUDE.md`「工作規則」段落。設計決策見 `docs/DECISIONS.md`。
