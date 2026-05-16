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

---

#### Batch 5A — Save/Restore + Idempotency

狀態：完成

動機：

App.jsx 只從 loadSave() 讀 currentChapter，restoreState() 未接入 HagurumaEngine，reload 後全部 state 歸零。且 reload 後重進同一場景會重複套用 effects。

完成內容：

- save.js v1→v2 migration：新增 nextScene 欄位（指向下一個未處理場景）
- buildSaveData / saveGame 接受 nextScene 參數
- restoreState 優先使用 nextScene（ending 時為 null）
- HagurumaEngine 新增 initialState prop，可跳過 createChapterState
- App.jsx 啟動時完整 restore（loadSave → restoreState → initialState）
- 新增 tests/engine/save.test.js（8 個 v2 save 測試）
- 更新 tests/integration/game-flow.test.js 存檔測試為 v2 格式

驗收結果：

- npm run build 通過
- npm run test 通過（89/89）
- npm run validate:chapters 通過（22/22）
- 瀏覽器驗證：play → save → reload → resume 從正確場景繼續，stats 保持
- nextScene cursor 策略避免了 effects 重複套用（D11）

---

#### Batch 5B — Key Namespace Convention

狀態：完成

動機：

notebook.key、choicesMade flag、connection.id 跨章保留（D3），flat key 在 CH2 後必然撞名。

完成內容：

- validate-chapters.js 新增 validateNamespaces()：CH1 警告（grandfathered），CH2+ 強制 `chNN.` / `global.` 前綴
- 導出 validateChapter / validateNamespaces 供測試 import（移除 shebang、guard main()）
- docs/DECISIONS.md 新增 D10（Key Namespace Convention）
- docs/chapter-data-schema.md 新增「Key Naming Convention」段落
- 新增 tests/scripts/namespace.test.js（4 個測試）

驗收結果：

- npm run build 通過
- npm run test 通過（89/89）
- npm run validate:chapters 通過（0 errors, 1 warning: 43 grandfathered keys）

---

#### Batch 5C — Schema + Validator Sync

狀態：完成

動機：

schema 文件 shape enum 與 CH1 資料不符（缺 "rect"/"mountain"），validator 缺少多項 cross-reference 檢查。

完成內容：

- validate-chapters.js 新增 9 項 cross-reference 檢查：
  - startLocation 存在於 locations[]（error）
  - links.visit 存在於 locations[]（error）
  - links.unlock / choice.unlock 存在於 SYMBOL_GLYPHS（warning）
  - locations.symbolKey 存在於 SYMBOL_GLYPHS（warning）
  - connections.requires 為有效 notebook key 或 symbol key（warning）
  - scene.flags 列出所有 choice flags（雙向 warning）
  - connection.id 不重複（error）
  - location.shape 為有效值（warning）
- chapter-data-schema.md 修正 shape enum + 新增完整驗證規則清單
- DECISIONS.md 新增 D11（Save Cursor Strategy）
- 新增 tests/scripts/cross-ref.test.js（11 個測試，含 CH1 真實資料零 error 驗證）

驗收結果：

- npm run build 通過
- npm run test 通過（89/89）
- npm run validate:chapters 通過（CH1 零 error）
- CH1 通過所有新 cross-reference 檢查

---

#### P2D — Character Portrait Wiring

狀態：完成

動機：

左側欄底部已有 `.left-image-area`，但尚未接通角色立繪。需要在對話 block 顯示時動態切換對應角色的立繪圖片。

完成內容：

- chapter01.js 新增 `portraits` 對照表（7 位角色 → 圖片路徑）
- chapter01.js 16 個 dialogue block 新增 `speakerId`（barbershop_owner, female_student_a/b, older_female_student, t_kun, sinologist, niece）
- SceneText.jsx 新增 `onActiveBlockChange` callback（隨 doneCount 觸發）
- HagurumaEngine.jsx 純 props pass-through（onActiveBlockChange 從 GameLayout 傳入 SceneText）
- GameLayout.jsx 新增 `activePortraitId` state，dialogue+speakerId 時設定，非 dialogue 時清除
- LeftSidebar.jsx 使用 `activePortraitId` + `chapter.portraits` 渲染立繪 `<img>`
- public/portraits/ch1/ 放置 7 張 PNG 素材

設計決策：

- 兩個「女學生」共用 speaker 顯示名但使用不同 speakerId（female_student_a / female_student_b）
- speaker "你" 和 "???" 的 dialogue 不設 speakerId，不顯示立繪
- 不修改 engine core（src/engine/*）
- 不使用 fade 動畫、不支援雙立繪、不支援表情變體

驗收結果：

- npm run build 通過
- npm run test 通過（89/89）
- npm run validate:chapters 通過（22/22 playthroughs）
- 瀏覽器驗證：barbershop_owner / female_student_a / female_student_b / t_kun / niece 立繪正確顯示
- 非 dialogue block 正確清除立繪
- speaker "你" 的 dialogue 不觸發立繪
- 零 console error

---

---

## 2026-05-08

### 已完成

#### Dialogue Format Standardization

狀態：完成

動機：

CH1 dialogue block 有 4 處缺少 `speakerId` 欄位（speaker 為「你」或「???」的台詞）。為讓未來 Akasha Script Editor 可直接讀寫劇本資料，所有 dialogue block 須統一為五欄位格式：`type / speaker / speakerId / jp / cn`。

完成內容：

- chapter01.js：4 處 dialogue block 補上 speakerId
  - speaker「你」× 3 → `speakerId: "protagonist"`
  - speaker「???」× 1 → `speakerId: null`（身份未揭露）
- docs/chapter-data-schema.md：TextBlock dialogue 定義新增 `speakerId: String | null`，附欄位語義說明

CH1 全部 19 個 dialogue block 現在都有完整五欄位。

修改檔案：

- src/data/chapters/chapter01.js
- docs/chapter-data-schema.md

驗收結果：

- npm run build 通過
- npm run test 通過（89/89）
- npm run validate:chapters 通過（22/22 playthroughs）

---

### 待修問題清單

D3 save migration 已於 Batch 5A 實作（v1→v2）。清單項目已清除。

---

### 後續批次

---

#### Batch 6 — Chapter 2 Spec

狀態：完成

完成內容：

- docs/chapter02-spec.md 初稿 → 基於青空文庫原文全面改寫
- 從 https://www.aozora.gr.jp/cards/000879/files/42377_34745.html 提取二「復讐」原文
- ~24 場景、8 選擇點、4 connections（含 2 跨章）、7 notebook 條目
- 原文 text blocks 含實際日文對話（給仕、姊、妻、書中引用）＋中文翻譯
- nerve/insight/writing 曲線設計
- 5 個開放問題待月月確認

---

## 2026-05-16

### 已完成

#### Codex Audit Fixes — 4 bugs

狀態：完成

動機：

Codex 審計發現 4 個 bug：EndScreen dismiss 後無法前進、v2 migration 的 connection 永久卡住、save fallback 短路、cross-chapter validation 誤報。

完成內容：

- Fix 1：HagurumaEngine EndScreen dismiss 後新增 `.advance-fallback` 浮動按鈕
- Fix 2：connections.js skip 條件改為 `c.id === conn.id && c.title`，允許 v2 migrated 的 id-only entry 通過 upgrade branch
- Fix 3：save.js loadSave() 從 short-circuit 改為 loop-over-sources，每個 source 獨立 try/catch
- Fix 4：validate-chapters.js 新增 `priorNotebookKeys` 累積，connection requires 三路判斷（本章/前章 carryOver/真正缺失）

驗收結果：

- npm test 通過
- npm run build 通過
- 零 console error

---

#### Component Tests + Save Key Test

狀態：完成

完成內容：

- tests/components/EndScreen.test.jsx — 5 個 smoke tests
- tests/components/NotebookPanel.test.jsx — 5 個 smoke tests
- tests/engine/save.test.js — 新增 2 個測試（corrupted key fallback、legacy key isolation）
- tests/engine/connections.test.js — 新增 3 個測試（skip logic、metadata upgrade）
- tests/scripts/cross-ref.test.js — 新增 2 個測試（carryOver info、truly missing warning）
- 安裝 @testing-library/react、@testing-library/jest-dom、jsdom

驗收結果：

- 125/125 tests 通過
- 12 test files

---

#### D4 Appendix + gameConfig Schema Draft

狀態：完成

完成內容：

- docs/DECISIONS.md D4 附錄：確認跨章預解鎖用 choicesMade flag，不新增 globalSymbols
- src/config/gameConfig.js：設定檔 schema placeholder（stats/ui/saveKey/corrupt/theme），不被任何 runtime 模組 import

---

#### Batch 7 — Chapter 3–6 Specs

狀態：完成

動機：

月月要求一次寫完 CH3–CH6 spec，只寫文本不做程式異動。

完成內容：

- 從青空文庫提取三「夜」、四「まだ？」、五「赤光」、六「飛行機」全文
- docs/chapter03-spec.md — ~18 場景、7 選擇點、4 connections
  - 核心意象：書中之針、寿陵余子、鏡中膏藥、齒輪增殖、夢中復讐之神、凌晨三點半
- docs/chapter04-spec.md — ~16 場景、7 選擇點、4 connections
  - 核心意象：紙屑=薔薇、母子親和力、Mérimée 鐵意志、硫黄幻嗅、Mole→la mort、鏡中微笑
- docs/chapter05-spec.md — ~24 場景、8 選擇點、5 connections
  - 核心意象：畏光、屋根裏信仰問答、一角獸蘋果、赤光池塘、le diable est mort、裝訂錯誤、深夜寫作
- docs/chapter06-spec.md — ~26 場景、8 選擇點、5 connections（最終章）
  - 核心意象：雨衣首尾呼應、半黑狗四次、飛行機、鞦韆架=絞首台、齒輪最終加速、妻子預感、中斷

全 spec 均含：原文 text blocks（日文＋中文）、跨章 flag 依賴、connections（含跨章）、nerve/insight/writing 曲線、notebook 條目、portraits、開放問題。

發現：CLAUDE.md 記載「原著 11 章 51 節」有誤，青空文庫原文只有 6 章。已修正 CLAUDE.md。

驗收結果：

- 零程式碼異動
- 4 個 spec 文件共 1470 行

---

#### CLAUDE.md 修正

狀態：完成

完成內容：

- 修正「原著 11 章 51 節」→「原著 6 章（レエン・コオト／復讐／夜／まだ？／赤光／飛行機）」
- 更新測試數量 39 → 125
- 權威文件新增 chapter spec 參照

---

### 後續批次

---

#### B2 — Chapter 2 Implementation

狀態：待排程（blocked on 月月 review CH2 spec 開放問題）

目標：

根據 chapter02-spec.md 實作 src/data/chapters/chapter02.js

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
| 2026-05-06 | Batch 5A | fix: save/restore + idempotency | done | nextScene cursor, initialState prop, v1→v2 migration |
| 2026-05-06 | Batch 5B | feat: key namespace convention | done | CH2+ prefix enforcement, CH1 grandfathered |
| 2026-05-06 | Batch 5C | fix: schema + validator sync | done | 9 cross-ref checks, shape enum fix, 11 tests |
| 2026-05-07 | P1 | fix: remove incorrect SidePanel integration | done | cherry-pick from exciting-villani |
| 2026-05-07 | P2A | feat: restore three-column layout skeleton | done | GameLayout wrapper, .layout CSS |
| 2026-05-07 | P2B | feat: add persistent right sidebar | done | RightSidebar (手帖/連結/行路) |
| 2026-05-07 | P2C | feat: add left sidebar (chapter TOC + image area) | done | LeftSidebar, expand/collapse TOC, forward-compatible image display |
| 2026-05-07 | P2D | feat: wire character portraits to dialogue | done | portraits lookup, speakerId on 16 blocks, callback chain SceneText→HagurumaEngine→GameLayout→LeftSidebar |
| 2026-05-08 | Dialogue | fix: standardize chapter 1 dialogue block schema | done | 4 dialogue blocks +speakerId |
| 2026-05-16 | Audit Fix | fix: save fallback, connection metadata upgrade, EndScreen dismiss, cross-chapter validation | done | 4 Codex audit bugs |
| 2026-05-16 | A2+A3 | test: component smoke tests + save key isolation | done | EndScreen, NotebookPanel, save, connections, cross-ref |
| 2026-05-16 | D1+D2 | docs: D4 appendix + gameConfig schema draft | done | DECISIONS.md, gameConfig.js |
| 2026-05-16 | B1 | docs: CH2 spec draft → rewrite with Aozora Bunko text | done | chapter02-spec.md |
| 2026-05-16 | B1+ | docs: CH3–CH6 specs with Aozora Bunko text | done | chapter03–06-spec.md, 1470 lines |
| 2026-05-16 | Fix | docs: fix CLAUDE.md chapter count 11→6, test count 39→125 | done | CLAUDE.md + DEV-LOG.md |

---

## Rules for Future Agents

見 `CLAUDE.md`「工作規則」段落。設計決策見 `docs/DECISIONS.md`。
