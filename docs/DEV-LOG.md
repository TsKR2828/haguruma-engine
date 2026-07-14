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

## 2026-07-12

### 已完成

#### F1-b — 原文標記（origin marking）Schema＋渲染＋Validator＋文件同步

狀態：完成

規格來源：`docs/origin-marking-spec.md` §1 §2 §3 §6。

完成內容：

- TextBlock v2 schema（`origin: "source" | "added"`）：`docs/chapter-data-schema.md`、`SCENES_FORMAT.md`（新增「八、原文與添補」章節）、`CLAUDE.md` 同步
- 新增 `src/utils/textBlock.js`（純函式：`isDualBlock` / `joinDual` / `blockRawText` / `addedClass`）與 `src/components/TextBlockBody.jsx`（共用渲染子件），供 `SceneText.jsx` 與 `HagurumaEngine.jsx` 的 `HistoryBlock` 共用，確保打字階段與歷史區樣式一致
- 順手修 Bug 3：`[jp, cn].filter(Boolean).join("\n")` 在 `jp` 為空字串時會把 `cn` 誤判成日文樣式，改為固定雙槽 `joinDual`
- CSS：`global.css` 新增 `--added-ink` / `--added-accent`；`game.css` 新增 `.block-added`（左側色條＋「補」角標）與 `.block-added-legend`
- `RightSidebar.jsx` 底部加圖例：「補＝非原文的添補內容」
- `scripts/validate-chapters.js` 新增 `validateOrigin`：narration/inner/dialogue 缺 `origin`（CH1／CH2 grandfathered warning，CH3+ error）、`origin:"source"` 缺 `jp` error（所有章）、`origin` 值非法 error（所有章）
- Vitest 新測試：`tests/components/HistoryBlock.test.jsx`、`tests/components/SceneText.test.jsx`、`tests/components/RightSidebar.test.jsx`、`tests/scripts/origin.test.js`
- 未修改 chapter01/02 劇情文字；不 commit / 不 push（全部留 unstaged）

與規格字面的一處偏離（已刻意記錄）：spec §3 寫「CH2+ error」，但現行 chapter02.js 尚無任何 `origin` 欄位（與 CH1 同為 legacy），若照字面對 CH2 發 error 會直接打破 `npm run validate:chapters`。改為新增獨立的 `ORIGIN_EXEMPT_CHAPTERS = [1, 2]`（不影響既有 `EXEMPT_CHAPTERS` 的 namespace 檢查），CH2 origin 缺失暫列 warning，CH3+ 才是 error；待 CH2 補標 origin 後可將 2 移出清單。

驗收結果：

- `npm run build` 通過
- `npm test` 通過（172 tests，含新增 25 個測試）
- `npm run validate:chapters` 通過（CH1 2 條 warning、CH2 1 條 warning，0 error）

備註：

- `CLAUDE.md` 驗收流程新增第 4 步 `npm run validate:fidelity` 通過——該 script 屬 F1-c（`scripts/validate-fidelity.js`），本批尚未落地，文件先按規格 §6 同步，待 F1-c 完成後才會是可執行步驟
- F1-a（底本轉換）已先行完成，`reference/aozora/haguruma_original.txt` 已存在

---

#### F2-3 — CH1 原文回填（後 17 場景＋新增場景）＋附帶修正

狀態：完成

規格來源：`docs/ch1-source-map.md` §1（auto_banquet～auto_ending）、§2（附帶修正）。前 17 場景（prologue～auto_hotel_arrive，F2-1／F2-2）進場前已完工，本批未動。

完成內容：

- `auto_banquet`：n1/inner/n2/d1/n3 轉 `origin:"source"`，inner「破壞慾」標 `origin:"added"`
- `banquet_destroy`：新增堯舜/春秋段 source narration（插最前）；d1 堯舜台詞逐字修正——噓（原文實際字形 U+5653，非規格文件註記的 U+5652，已以底本檔為準核對逐字節相符）＋句尾 `ない」` 無句点
- `banquet_calm`：全部標 `origin:"added"`
- `auto_banquet_worm` / `worm_trace`：全部轉 source / 標 added
- `auto_hotel_night`：n1～n3 轉 source；choice A 的 `next` 改指向新場景 `hotel_coat_hide`
- **新增場景 `hotel_coat_hide`**（`sceneCount: 33 → 34`）：單一 source narration（B:L89 衣裳戸棚句），`next: "auto_hotel_mirror"`
- `hotel_coat_stare`：n1 標 added，n2 轉 source（與 `hotel_coat_hide` 同句，cn 補回「急忙」語感）
- `auto_hotel_mirror`：全部 6 個 block 轉 source
- `auto_raincoat_3`：n1/inner 轉 source；choice A 文字改為不劇透版「雨衣。又是雨衣。——這是第幾次了？」（原文字避免替讀者數次數）
- `raincoat_link`：動態函式結構維持，兩分支 4 個 block 全標 `origin:"added"`
- `auto_allright_corridor`：n1/n2/inner 轉 source；`d「All right.」` 標 `origin:"added"`（沿用既有 §0-6 例外）
- `allright_puzzle`：全部標 added
- `auto_room_writing`：n1 拆兩 source block、n2/n3/inner 轉 source；inner 的 `All right sir` 修正為無逗號（原「All right, sir」→ 逐字比對底本改回 `All right sir`）
- `auto_phone`：全部轉 source；新增被刪的「何だい？　どうかしたのかい？」source dialogue；L109/L113 逐字修正句読點（`もんですから。`／句尾 `です」`／`ですよ」`，皆刪除既有多餘讀點與句点）
- `auto_allright_resolve`：動態函式結構維持，兩分支重排——pondered 分支單一 source block；非 pondered 分支「同一 source block ＋ 既有解釋句」，解釋句改標 `origin:"added"`；n1/n2 轉 source
- `auto_ending`：n1/n2 轉 source，system 不動
- §2 附帶修正：chapter01.js 檔頭 URL `42377_15163.html` → `42377_34745.html` ＋加註底本路徑；`docs/DECISIONS.md` 追加決策（原規格標「D11」，因 D11 已被 Save Cursor 策略佔用，改編為 **D12** 並在條目內註記此偏離）；README.md:141「第二至十一章」→「第二至六章」
- 不 commit／不 push（全部留 unstaged）；不動 chapter02.js

驗收結果：

- `npm run validate:fidelity` 通過：**0 error**（CH1／CH2 皆零 warning 以外的 error）；**CH1 coverage: 99.8%（4916/4924 字元）**
- `npm run validate:chapters` 通過：CH1 場景數 34、選擇點 11、ending 1，22/22 playthroughs 抵達結局，0 error（1 條既有 grandfathered key-namespace warning）
- `npm test` 通過：172/172

CH1 coverage 剩餘 0.2%（8 字元）未覆蓋，經逐字元比對定位為底本章節切分標記行「【第1章】　　　　　一　レエン・コオト」本身（章節 marker + 標題行），屬底本轉換用的結構標記，非敘事正文，內容已由 `prologue` 的兩個 `system` block（「第一章　レエン・コオト」／「——雨衣——」）對應呈現，故未再轉為 source block。CH1 全部敘事正文（地の文＋台詞）已 100% 回填。

---

#### Batch F3 — CH2「復讐」重切（前置動作 + 場景重寫 + F3-3 收尾）

狀態：完成

規格來源：`docs/ch2-source-map.md`（唯一施工圖來源；全域政策沿用 `docs/ch1-source-map.md` §0）。動機：舊 `chapter02.js`／`docs/chapter02-spec.md` 含幻覺內容（捏造姊姊台詞／養子／震災／Polikushka 錯誤情節），見 `reports/full-audit-2026-07-11.md` §1c，全部作廢不得沿用。

完成內容：

- **前置動作**（§0）：舊 `chapter02.js` 複製封存為 `legacy/chapter02_deprecated_v1.js`（檔頭加註作廢說明，僅供 schema 參考）；`docs/chapter02-spec.md` 檔頭加註「已被 ch2-source-map.md 取代」（內文保留不動，供歷史對照）；`src/data/symbols.js` CH2 區依 §3 key 清單重整（新增 fire／rat／slipper 三個 symbol 類別）
- **場景重寫**（§1–§3）：`chapter02.js` 依施工圖整檔重寫，全部 jp block 逐字取自底本 `reference/aozora/haguruma_original.txt`（B:L126–L216），cn 為新譯或沿用舊版未被審查點名的譯文；34 場景（含分支/added 場景）、8 選擇點、12 notebook keys、5 條 connections（含跨章 `ch02.raincoat_returns`，requires 內的 `raincoat_death` 是 CH1 grandfathered key）
- **F3-3 收尾**：
  - `tests/scripts/cross-ref.test.js` 新增 2 個測試：① `CHAPTER_02` 搭配從 `CHAPTER_01` 動態收集的 `priorNotebookKeys` 跑 `validateChapter` 應零 error；② 用真實 `resolveConnections` + 真實 `CHAPTER_02.connections` 驗證跨章 connection `ch02.raincoat_returns` 在 notebook 同時含 CH1 的 `raincoat_death` 與 CH2 的 `ch02.raincoat_hotel` 時可實際觸發，缺少 CH1 key 時不觸發（測試數 202 → 204）
  - 文件同步：本條目、README 開發狀態 CH2 打勾（含場景數/選擇點/coverage）＋專案結構樹（`ch2-source-map.md`、`legacy/chapter02_deprecated_v1.js`）＋啟動方式段落、`CLAUDE.md` 專案概要 CH2 WIP 敘述改為完工敘述

驗收結果（§4 驗收項逐一核對）：

- `npm run validate:fidelity`：**0 error**；CH2 coverage **99.9%（4483/4486 字元）**（≥ 99% 達標；CH1 coverage 99.8% 同批未變動）
- `npm run validate:chapters`：CH2 場景數 34、選擇點 8、ending 1，**22/22 playthroughs 抵達結局**，0 error；跨章 connection `ch02.raincoat_returns` 已由新增的 cross-ref 真實資料測試確認可觸發
- `npm test`：**204/204 通過**（23 test files）
- `npm run build`：通過

備註：

- CH2 coverage 剩餘 0.1%（3 字元，經逐字元比對定位為底本切分標記緊接的「二復讐」章號+標題殘字）未覆蓋，同 CH1 模式，屬底本章節切分用的結構標記，非敘事正文，已由 `ch2_prologue` 的兩個 `system` block（「第二章　復讐」／「——復仇——」）對應呈現
- 不 commit／不 push（全部留 unstaged）；未動 `chapter01.js`

---

#### Batch F4 Lane B — 文件清理（11 章殘留 + README/migration-plan 現況同步）

狀態：完成

規格來源：`docs/batch-f4-bugs-docs.md` Lane B、`reports/full-audit-2026-07-11.md` §3/§6。純文字修訂，不碰程式。

動機：

Batch 7（2026-05-16）已發現原著實為 6 章（非 CLAUDE.md 舊載的「11 章 51 節」）並修正了 CLAUDE.md，但同一筆誤仍殘留在 `ENGINE_SPEC.md` / `CHAPTER_GUIDE.md` / `docs/DECISIONS.md` / `docs/chapter06-spec.md` 共 8 處；`README.md` 開發現況（第一章遷移敘述、驗收數字、開發狀態 checklist、專案結構樹）也落後於 F1（origin marking）/ F2（CH1 原文回填）之後的實際進度。

完成內容：

- 「11 章」殘留清理（8 處，README:141 已於 F2-3 先行修正不計入）：
  - `ENGINE_SPEC.md:13`「歯車原著共 11 章 51 節」→「歯車原著共 6 章」
  - `ENGINE_SPEC.md:438`「到第十一章『敗北』」→「到第六章『飛行機』」
  - `ENGINE_SPEC.md:1089`「全 11 章完成」→「全 6 章完成」
  - `CHAPTER_GUIDE.md:11`「全文分 11 章」→「全文分 6 章」
  - `CHAPTER_GUIDE.md:192`「## 第四至十一章 — 待寫」→「## 第四至六章 — 待寫」（施工圖字面寫「第三至六章」，但 CH2/CH3 在本檔上方已各有獨立「待寫」小節，改為「第三至六章」會與既有 CH3 小節重複；核對實際文件結構後改採與 ENGINE_SPEC「v0.3 — 第四至六章」一致的「第四至六章」，已在 Lane B 交付說明中註記此偏離）
  - `docs/DECISIONS.md` D1、D9：在原句「11 章 51 節」／「11 章」後加註〔更正 2026-07-12：原著實為 6 章〕，不改寫決策原文
  - `docs/chapter06-spec.md:419`：開放問題「原著只有六章」標記刪除線＋補「已解決（2026-07-12）」說明
- `README.md` 現況同步（依 `docs/DEV-LOG.md` F1-b / F2-3 條目核實後撰寫）：
  - 第一章遷移說明改為含原文回填現況（origin marking 100% 覆蓋敘事正文、`validate:fidelity` 通過），CH2 註明為框架驗證 WIP（11/~24 場景），CH3–CH6 註明僅有 spec 尚未實作
  - 開發狀態 checklist 新增 5 項已完成工作：章節管理機制、角色立繪、origin 標記＋fidelity 工具、CH2–CH6 spec、測試數 125→172
  - 第一章驗收表加註：表中數字為 **prototype 版數據（2026-05-05）**，React 版洞察實為 13（見 Batch 3），場景數含 F2-3 新增場景為 34
  - 專案結構樹補齊 `scripts/`（3 個工具）、`tests/`（4 個子目錄）、`docs/` 新檔（DECISIONS / DEV-LOG / schema / chapter02–06-spec / ch1-source-map / origin-marking-spec）、`reference/aozora/`（底本原始檔，標註不可刪除）
- `docs/migration-plan.md:344`：驗收數字同步加註 prototype 版數據來源說明
- `docs/DEV-LOG.md`：本條目

驗收結果：

- `npm test` 通過（172/172，未變動程式）
- `npm run build` 通過
- `npm run validate:chapters` 通過
- `npm run validate:fidelity` 通過
- `grep -nE "十一章|11 章|11章" README.md ENGINE_SPEC.md CHAPTER_GUIDE.md docs/DECISIONS.md docs/migration-plan.md` 零命中（DECISIONS 兩處加註更正行本身不含此三種格式的殘留寫法，未被 grep 命中）
- 不 commit／不 push（全部留 unstaged）；未動 `src/data/chapters/*.js`、`legacy/`、`reference/aozora/` 內容本身（僅在 README 補述其存在）

---

#### Batch F5 Lane R — 選項回溯

狀態：完成

規格來源：`docs/batch-f5-ux.md` §Lane R（最後施工，動 `HagurumaEngine`；與已完工的 Lane E 潤飾模式共存，未動 `editMode` 相關邏輯）。

完成內容：

- 新檔 `src/engine/rewind.js`：純邏輯 + I/O，比照 `save.js`/`textOverlay.js` 的 try/catch 防禦慣例。
  - 快照棧（`sessionStorage` key `haguruma_rewind_v1`，單一 slot `{chapter, entries}`）：`pushSnapshot`（`structuredClone` 深拷貝 state，60 筆 FIFO）、`markTopChosen`（棧頂填入 `{index, text}`）、`truncateToCheckpoint`（截斷至選定點並重置該點 chosen）。換章清空靠儲存格式本身達成——`loadRewindStack(chapterNum)` 讀到的 `chapter` 與目前章節不同即視為空棧，下一次 push 自然用新章節覆寫掉舊資料，不需要額外的清空呼叫。
  - 已見標記（`localStorage` key `haguruma_choice_seen_v1`，`${chapter}:${sceneId}:${choiceIndex}` 為原始資料索引）：`markChoiceSeen`/`isChoiceSeen`，獨立於快照棧，回溯截斷不影響已見狀態（跨回溯持久）。
- `HagurumaEngine.jsx`：
  - `onTextComplete` 進入有 choices 的場景時 push 快照（`historyLen` 一併記錄，供回溯時把 scrollback 截回快照當時長度，避免「未來」場景歷史殘留）。
  - `onChoice` 新增 `originalIndex` 參數，選擇時標記已見＋把回溯棧棧頂 `chosen` 填入。
  - header 新增「⟲ 回溯」按鈕（不受 `import.meta.env.DEV` 限制——這是給玩家的正式功能，不是 Lane E 的開發者工具）；`handleRewindSelect` 走 confirm → 截斷棧 → `cloneState` 恢復 state → 直接設定 scene/blocks/phase（不經過 `loadScene`，因為 journey 等副作用已包含在快照 state 裡）→ `save()` 寫存檔。
  - choices render block 算出每個選項的資料原始索引（沿用既有 `withIdx`），組出 `seen` 旗標陣列傳給 `ChoiceList`。
- `ChoiceList.jsx`：`onSelect(choice, i)` 多帶一個 display index 參數（供呼叫端換算原始索引）；`seen[i]` 為真時在選項文字尾端渲染淡色 `✓`（`.choice-seen-mark`）。
- 新檔 `src/components/RewindPanel.jsx`：比照 `NotebookPanel` 的 overlay + slide-in 面板樣式，列出本章已選擇點（新→舊，`chosen` 為 null 的棧頂——即玩家目前正卡住的那個選擇畫面——不列入，因為沒有「當時所選的選項文字」可顯示）。
- CSS：`game.css` 新增 `.rewind-toggle` / `.rewind-overlay` / `.rewind-panel` / `.rewind-header` / `.rewind-close` / `.rewind-empty` / `.rewind-entry*` / `.choice-seen-mark`，沿用既有 washi 色系變數，不新增變數。
- 新測試：`tests/engine/rewind.test.js`（cloneState 深拷貝隔離、sessionStorage I/O、換章清空、pushSnapshot FIFO、markTopChosen、truncateToCheckpoint、已見標記持久與防禦性 try/catch）、`tests/components/HagurumaEngine.rewind.test.jsx`（端對端：空面板狀態、面板列出 checkpoint、confirm 恢復後 state 正確且已見 ✓ 持久、confirm 取消不改動任何東西）。
- 未動 Lane E 的 `editMode`/`textOverlay`/`EditPanel` 相關邏輯；`jp` 欄位全程未被觸碰。

驗收結果：

- `npm test` 通過（273/273，新增 30 個測試：19 個 `rewind.test.js` + 11 個 `HagurumaEngine.rewind.test.jsx`）
- `npm run build` 通過
- `npm run validate:chapters` 通過（CH1/CH2 皆 0 error）
- `npm run validate:fidelity` 通過（CH1 99.8%、CH2 99.9%，0 error / 0 warning）
- 不 commit／不 push（全部留 unstaged）

---

#### Batch F6 — 文中互動啟用（action / forced blocks）

狀態：完成

規格來源：`docs/batch-f6-inline-actions.md`（定案，2026-07-12）。月月目標 3 的核心互動：「你必須站起來」式指令，增強閱讀記憶。ActionBlock.jsx / ForcedSteps.jsx / GearOverlay.jsx 原是完成品孤兒元件（連 legacy prototype 都只有機械沒資料），本批定 schema＋接線＋首批內容。

完成內容：

- Schema（`docs/chapter-data-schema.md` 增補）：`{ type:"action", origin:"added", prompt, response?, flag?, effects? }`（讀者必須點擊才繼續，天生添補內容 origin 必為 `"added"`）、`{ type:"forced", origin:"added", steps: String[] }`（連續強制步驟，逐一點擊，nerve 低時按鈕侵蝕＋齒輪覆蓋沿用 ForcedSteps 既有視覺）
- 引擎接線：`SceneText.jsx` 打字流程遇 action/forced block 暫停推進、渲染互動元件並等待完成才繼續；點擊套用 `effects`（走既有 `applyEffects` + ImpactToast 堆疊）與設 flag；`TextBlockBody`/`HistoryBlock` 完成態渲染 `✓ prompt`（＋response 縮排一行，`.action-block--done` / `.forced-step--done`）；`game.css` 補齊 `.forced-btn`/`.forced-wrapper`/侵蝕 `clip-path` 全套樣式（比對 prototype.html 移植）；潤飾模式（editMode）下點 action/forced＝編輯文字不觸發互動；回溯相容（flag/effects 已含在 state 快照內，無需額外處理）
- Validator／fidelity 增補：`validate-chapters.js` 檢查 action 需非空 `prompt`、forced 需非空 `steps[]`、兩者 `origin` 必為 `"added"`；playthrough 模擬器將 action/forced 視為直通（套 `action.effects`）；`validate-fidelity.js` 新 type 不參與 jp 比對（無 jp 欄位）
- 首批內容（三處，全部 `added`、命令形無主詞、「先做、後讀芥川的句子」）：
  1. CH1 `auto_phone`：`僕はもとのように受話器をかけ…意識していた。` 之後、`給仕は容易に…鈕を押した。` 之前插入 `forced`（`["按下門鈴的按鈕。","再按。","再按一次。"]`，具現化「何度もベルの鈕を押した」）
  2. CH2 `ch2_polikouchka`：跳床摔書段插入 `forced`（`["從床上跳起來。","把書摔向房間的角落。"]`）
  3. CH2 `ch2_rat_search`：場景最前插入 `action`（`prompt:"追進浴室，開門搜索。"`，無 response，後續 source 敘述接手）
- 新測試：`tests/components/ForcedSteps.test.jsx`、`tests/components/HagurumaEngine.actionForced.test.jsx`、`tests/scripts/action-forced.test.js`

驗收結果：

- `npm run build` 通過
- `npm test` 通過
- `npm run validate:chapters` 通過（action/forced 三處內容位置與施工圖一致，22/22 playthroughs 仍全通，互動不阻斷模擬器）
- `npm run validate:fidelity` 通過（新 block 不影響 coverage）
- 打字流程：互動 block 前文字打完→暫停→點擊→繼續，「點擊繼續」不能繞過互動；editMode／回溯不受破壞
- 不 commit／不 push（全部留 unstaged）；本批未動 DEV-LOG（依施工圖 §5 指示留給 CH3 批統一記錄，即本條目）

---

#### Batch F7 — CH3「夜」重切（§1 骨架＋前 22 場景 F7-1、後 16 場景＋connections F7-2）

狀態：完成

規格來源：`docs/ch3-source-map.md`（唯一施工圖來源；全域政策沿用 `docs/ch1-source-map.md` §0，cn 為第一人稱「我」，見該圖 D12 定案敘述）。動機：舊 `docs/chapter03-spec.md` 引文抽查全真（audit 判定「小修可用」），但場景切分改以本圖為準，重新整檔實作。

完成內容：

**F7-1（§1 骨架＋前 22 場景）**：

- `chapter03.js` 全新建立：§1 骨架（5 個 location：丸善／日本橋通り／カッフェ／ホテル／部屋）、`ch3_prologue` ～ `ch3_sculptor_talk` 22 場景逐字回填 `jp`（取自底本 B:L225–L259）＋新譯 `cn`（第一人稱「我」）
- 後 16 場景（`ch3_room_women` ～ `ch3_end_wait`）先建立正確的 `choices`/`next`/`flags`/`notebook`/`links` 拓樸骨架，`text` 標 TODO 佔位；`§3 connections` 留空陣列
- 發現施工圖 §1 標頭 `sceneCount: 36` 與 §2 實際枚舉（逐一計數含全部分支/夢境/choice 場景）38 場景不一致，本檔以 §2 實際枚舉為準記 `sceneCount: 38`，已在檔頭註記此偏離

**F7-2（本批，§2 後 16 場景＋§3 connections＋symbols.js＋文件）**：

- `ch3_room_women` ～ `ch3_end_wait` 16 個 stub 場景逐字回填 `jp`（B:L261–L295）＋新譯 `cn`，包含：
  - 分支選擇（清教徒譏諷 女人話題 vs 忍住不開口）、鏡中膏藥監視意象（`ch03.mirror_watch`）
  - 齒輪再現分支（數齒輪 vs 立即服藥），nerve −1
  - **夢境段全 auto（`ch3_dream_pool` → `ch3_dream_platform` → `ch3_dream_train`，無選擇是刻意設計）**：泳池／妻「おとうさん、タオルは？」對話、鄉下月台／Ｈ與老婦對話、寢台上木乃伊裸女——**L287 復讐の神句**逐字回填（`それは又僕の復讐の神、――或狂人の娘に違いなかった。……`），nerve −1
  - 醒轉後翼聲／鼠聲、給仕「三時半ぐらいでございます」、大廳讀書的美國女人（綠洋裝）
  - **L295 結尾**逐字回填（`長年の病苦に悩み抜いた揚句、静かに死を待っている老人のように。……`），insight +1，`showEnd`
- `§3 connections` 6 條全部補上（`ch03.yellow_circuit` / `ch03.gear_multiply` / `ch03.hanfeizi` / `ch03.nemesis_shape` / `ch03.wing_again` / `ch03.green_omen`），其中 `gear_multiply`／`wing_again` 依賴 CH1 grandfathered key（`gear_first`／`wing_corridor`，無 `chNN.` 前綴）
- `symbols.js` CH3 區（`SYMBOL_GLYPHS`）於前批（F7-1／或更早）已補齊全部 12 個 notebook key 的 glyph，本批核對確認無缺漏，未再變動
- `tests/scripts/cross-ref.test.js` 新增 3 個測試：① `CHAPTER_03` 搭配從 `CHAPTER_01`+`CHAPTER_02` 動態收集的 `priorNotebookKeys` 跑 `validateChapter` 應零 error；② `ch03.gear_multiply` 用真實 `resolveConnections` 驗證：notebook 同時含 CH1 grandfathered `gear_first` 與 CH3 `ch03.gear_faces` 時可觸發，缺 CH1 key 時不觸發（比照 `ch02.raincoat_returns` 模式）；③ `ch03.wing_again` 同模式驗證 `wing_corridor` + `ch03.wing_rat`
- 文件同步：`chapter03.js` 檔頭註解更新（F7-1/F7-2 完工狀態）、README（開發現況、開發狀態 checklist、專案結構樹補 `ch3-source-map.md`／`batch-f6-inline-actions.md`／`chapters/chapter02.js`／`chapters/chapter03.js`、測試數同步）、本條目
- 不 commit／不 push（全部留 unstaged）；未動 `chapter01.js`／`chapter02.js`

驗收結果：

- `npm run validate:fidelity`：**0 error**；**CH3 coverage 100.0%（4117/4119 字元）**（CH1 99.8%、CH2 99.9% 同批未變動）
- `npm run validate:chapters`：CH3 場景數 38、選擇點 7、ending 1，**22/22 playthroughs 抵達結局**，0 error
- `npm test`：**309/309 通過**（33 test files，含新增 3 個 CH3 跨章 connection / real-data 測試）
- `npm run build`：通過

備註：

- CH3 coverage 剩餘 0.05%（2 字元）未覆蓋，經核對定位為底本章節切分標記行本身（章號標題殘字），非敘事正文，同 CH1/CH2 模式，已由 `ch3_prologue` 的兩個 `system` block（「第三章　夜」／「——夜——」）對應呈現，CH3 全部敘事正文（地の文＋台詞）已 100% 回填
- 施工圖 §1 標頭 `sceneCount: 36` 與 §2 實際枚舉 38 場景的不一致，維持 F7-1 已記錄的偏離說明，待月月確認是否需回頭修正施工圖標頭（不影響本批驗收，已以實際枚舉為準）

---

## 2026-07-13

### 已完成

#### Batch F8 — Chapter 4「まだ？」重切完工

狀態：完成（unstaged）

完成內容：

- 依 `docs/ch4-source-map.md`（Batch F8，2026-07-12 定案）重寫 `src/data/chapters/chapter04.js`：§1 骨架（`chapter:4`／`title:"まだ？"`／`titleCn:"還沒？"`／`startScene:"ch4_prologue"`／`startLocation:"ch04.hotel_room"`／`sceneCount:28`）＋ 4 個 locations（`ch04.hotel_room` rect／`ch04.ginza` circle／`ch04.cafe2` circle／`ch04.mirror` diamond）
- §2 全 28 場景逐字回填 `jp`（一律 Read 底本 `reference/aozora/haguruma_original.txt` B:L304–L360 複製，未手打）+ 新譯 `cn`（一人稱「我」），含 6 選擇點（`ch4_roses`／`ch4_cafe_pair`／`ch4_eye_memory`／`ch4_street_faces`／`ch4_woman`／`ch4_mirror_choice`）、12 個 notebook keys
- **舊友場景（`ch4_friend`～`ch4_madman_son`）完全依施工圖重寫**：`docs/chapter04-spec.md` 該段原捏造「兒子自殺未遂」「暴君」對話，且遺漏了原文真正的朱舜水建碑式敘舊、結膜炎規律、『点鬼簿』自伝問答、不眠症互答、「気違いの息子には当り前だ」內心獨白母題——本批已改為以 B:L312–L344 逐字回填的正確版本，`docs/chapter04-spec.md` 檔頭已加註作廢警語
- `「気違いの息子には当り前だ」` 標記為 `type:"inner"`（非 dialogue，非替角色新編台詞），origin:"source"，含括號逐字收錄（B:L344）
- **nerve −1 事件**：施工圖 §2 明列 3 處（`ch4_shushun` 朱舜水發音失敗／`ch4_madman_son` 気違いの息子／`ch4_lamort` la mort）；另依上游任務特別指示「朱舜水／不眠症兩處發音失敗各 −1 nerve」，於 `ch4_insomnia`（B:L342 後段「不眠症」的「症」発音失敗）追加第 4 個 −1 nerve 事件（reason:「症」也發不出音）——與施工圖 nerve 預算敘述（−1×3）不完全一致，因 engine `applyEffects` 對 nerve 有 0–10 clamp（`src/engine/effects.js`），章末仍收斂在 0 附近，不影響「章末回到 ≈0」的設計目標，已在批次回報中向月月說明此處理，若判定應以施工圖 3 處為準可回頭移除 `ch4_insomnia` 的 effects
- §3 connections 6 條全部補上（`ch04.affinity_eye`／`ch04.roses_faces`／`ch04.word_betrayal`／`ch04.death_approach`／`ch04.second_me`／`ch04.sitz_bath`），其中 `death_approach` 依賴 CH1 grandfathered key `raincoat_death`、`second_me` 依賴 CH3 key `ch03.mirror_watch`（跨章依賴）
- `symbols.js` `SYMBOL_GLYPHS` 新增 CH4 區 12 個 notebook key 的 glyph
- `chapterRegistry.js` 註冊 `CHAPTER_04`
- 一次性腳本（未留存於 repo）以真實 `resolveConnections`／`applyEffects` 模擬「carryOver 含 CH1 `raincoat_death` + CH3 `ch03.mirror_watch`」＋「全程選 A」的完整 playthrough：27/28 場景可達（僅 `ch4_mirror_choice` 分支 B 的 `ch4_mirror_hesitate` 因選 A 未經過，屬預期），CH4 全部 6 條 connections（含 2 條跨章）均正確觸發
- **幻覺清零 grep**：`自殺未遂`／`暴君` 在 `chapter04.js` 場景資料中零命中（僅出現在檔頭註解描述已作廢內容）。`息子` 一詞則有 3 處合法命中——均為底本原文逐字收錄（B:L308 咖啡館母子段 ×2、B:L344「気違いの息子には当り前だ」×1），非舊 spec 捏造內容；施工圖 §4 grep 清單本身與其 §2 明列的逐字回填指示互相矛盾（`息子` 本就是原文用字），已在批次回報中向月月說明此矛盾點，未依字面誤刪合法原文
- 文件同步：`chapter04.js` 檔頭註解、`docs/chapter04-spec.md` 檔頭作廢警語、README（開發現況、開發狀態 checklist、專案結構樹、npm run dev 說明段）、本條目
- 不 commit／不 push（全部留 unstaged）；未動 `chapter01.js`／`chapter02.js`／`chapter03.js`

驗收結果：

- `npm run validate:chapters`：CH4 場景數 28、選擇點 6、ending 1，**22/22 playthroughs 抵達結局**，0 error
- `npm run validate:fidelity`：**0 error**；**CH4 coverage 99.9%（2843/2847 字元）**（CH1 99.8%、CH2 99.9%、CH3 100.0% 同批未變動）
- `npm test`：**312/312 通過**（33 test files；`tests/data/chapters.test.js` 動態掃描新章節，未需新增專屬測試檔）
- `npm run build`：通過

備註：

- CH4 coverage 剩餘 0.1%（4 字元）未覆蓋，經核對為底本章節切分標記行本身（章號標題殘字），非敘事正文，同 CH1–CH3 模式，已由 `ch4_prologue` 的兩個 `system` block（「第四章　まだ？」／「——還沒？——」）對應呈現
- `ch4_insomnia` 的追加 nerve −1 事件與施工圖 nerve 預算敘述「−1×3」的落差，待月月確認是否維持（4 處）或改回施工圖原案（3 處，移除 `ch4_insomnia.effects`）

---

---

## 2026-07-13（續）

### 已完成

#### Batch F9 — Chapter 5「赤光」重切完工

狀態：完成（unstaged）

規格來源：`docs/ch5-source-map.md`（唯一施工圖來源；全域政策沿用 `docs/ch1-source-map.md` §0，cn 為第一人稱「我」）。動機：舊 `docs/chapter05-spec.md` 第二段「主題」概述中「松林中的赤光（紅色池塘）」「老婦人」一節，以及對應場景切分，整段是幻覺內容（audit §1c-5）——原文（B:L435）該段實際是「運河・達磨船」，並無池塘、並無老婦人、並無死鼴鼠；該檔概述亦漏掉了章題眼《赤光》歌集信（B:L441）。

完成內容：

- 全新建立 `src/data/chapters/chapter05.js`：§1 骨架（`chapter:5`／`title:"赤光"`／`titleCn:"赤光"`／`startScene:"ch5_prologue"`／`startLocation:"ch05.hotel_room"`）＋ 5 個 locations（`ch05.hotel_room` rect／`ch05.attic` mountain／`ch05.bar_street` circle／`ch05.basement` rect／`ch05.canal` circle）
- §2 全 39 場景逐字回填 `jp`（一律 Read 底本 `reference/aozora/haguruma_original.txt` B:L369–L461 複製，未手打）+ 新譯 `cn`（一人稱「我」），含 7 選擇點（`ch5_taine`／`ch5_unicorn`／`ch5_red_lantern`／`ch5_journalists`／`ch5_icarus`／`ch5_karamazov`／`ch5_dawn_window`）、16 個 notebook keys
- **舊 spec「赤光池塘／穿寢衣老婦／死鼴鼠」幻覺段完全不存在於本檔**：`ch5_canal` 場景依 B:L435 逐字回填為「運河・達磨船」（郊外養父母家的回憶＋運河上達磨船底透出的薄光，那裡也有一家人生活著，為了相愛而互相憎恨），無池塘、無老婦、無死鼴鼠
- **章題眼《赤光》歌集信**（B:L441「歌集『赤光』の再版を送りますから……」）於 `ch5_shakko` 場景逐字含括號收錄為 narration block，觸發 nerve −1（reason: 赤光——連信裡都是）與 `notebook: { key:"ch05.shakko_letter", symbol:"fire", ... }`
- **法語記者對白三句**（B:L425／L427／L429）於 `ch5_french` 逐字收錄，含法語排版慣例的半形空格（`pourquoi ?`／`mort !`），cn 附直譯（好……很糟……為什麼？／為什麼？……惡魔已經死了！……／對，對……地獄的……）
- nerve 事件依施工圖列 3 處 −1（`ch5_red_lantern` 赤い光／`ch5_shakko` 赤光歌集信／`ch5_karamazov` 訂錯頁的書），加上開場 `ch5_prologue` +2，未額外增補
- §3 connections 6 條全部補上（`ch05.mole_self`／`ch05.kirin_child`／`ch05.black_white`／`ch05.artificial_wings`／`ch05.red_light`／`ch05.diable`），其中 `mole_self` 依賴 CH4 key `ch04.la_mort`、`kirin_child` 依賴 CH1 grandfathered key `book_worm`（跨章依賴）
- `symbols.js` `SYMBOL_GLYPHS` 新增 CH5 區 16 個 notebook key 的 glyph（沿用既有 5 個符號類別 raincoat/gear/wing/book/fire，未新增類別）
- `chapterRegistry.js` 註冊 `CHAPTER_05`
- `tests/scripts/cross-ref.test.js` 新增 3 個測試：① `CHAPTER_05` 搭配從 `CHAPTER_01`+`CHAPTER_02`+`CHAPTER_03`+`CHAPTER_04` 動態收集的 `priorNotebookKeys` 跑 `validateChapter` 應零 error；② `ch05.mole_self` 用真實 `resolveConnections` 驗證：notebook 同時含 CH4 `ch04.la_mort` 與 CH5 `ch05.mole_curtain` 時可觸發，缺 CH4 key 時不觸發；③ `ch05.kirin_child` 同模式驗證 CH1 grandfathered `book_worm` + CH5 `ch05.unicorn`
- 文件同步：`chapter05.js` 檔頭註解、`docs/chapter05-spec.md` 檔頭作廢警語（第二段幻覺內容＋漏掉的章題眼）、README（開發現況、開發狀態 checklist、專案結構樹、npm run dev 說明段）、本條目
- 不 commit／不 push（全部留 unstaged）；未動 `chapter01.js`／`chapter02.js`／`chapter03.js`／`chapter04.js`

驗收結果：

- `npm run validate:chapters`：CH5 場景數 39、選擇點 7、ending 1，**22/22 playthroughs 抵達結局**，0 error
- `npm run validate:fidelity`：**0 error**；**CH5 coverage 99.9%（5010/5013 字元）**（CH1 99.8%、CH2 99.9%、CH3 100.0%、CH4 99.9% 同批未變動）
- `npm test`：**315/315 通過**（33 test files；`tests/scripts/cross-ref.test.js` 新增 3 個 CH5 專屬測試）
- `npm run build`：通過
- **幻覺清零 grep**：`池塘`／`寢衣`／`老婦`在 `chapter05.js` 場景資料中零命中（僅出現在檔頭註解描述已作廢內容，共 3 處，均在 `//` 註解行內）。`歌集` 一詞命中 3 處合法場景資料（`ch5_shakko` 的 narration jp/cn＋notebook desc），確認章題眼在場

備註：

- CH5 coverage 剩餘 0.1%（3 字元）未覆蓋，經核對為底本章節切分標記行本身（章號標題殘字「五　赤光」），非敘事正文，同 CH1–CH4 模式，已由 `ch5_prologue` 的兩個 `system` block（「第五章　赤光」／「——赤光——」）對應呈現
- 施工圖 `ch5-source-map.md` §1 骨架標頭 `sceneCount: 38` 與 §2 實際逐一枚舉的 39 個場景 id 不一致（`grep -c '^### ch5_'` 實測 39），本檔以 §2 實際枚舉為準記 `sceneCount: 39`，已在檔頭與本條目註記此偏離（同 CH3／`ch3-source-map.md` F7-1 先例：遇到骨架標頭與實際枚舉不一致時，以實際枚舉為準）

---

#### Batch F10 — Chapter 6「飛行機」重切完工（《歯車》全卷完工）

狀態：完成（unstaged）

規格來源：`docs/ch6-source-map.md`（唯一施工圖來源；全域政策沿用 `docs/ch1-source-map.md` §0，cn 為第一人稱「我」）。動機：舊 `docs/chapter06-spec.md`「主題」段概述的「叔父的稻荷狐狸信仰」「義妹的丈夫逼她喝草酸」整段內容是幻覺（audit §1c-7）——原文（B:L488）該段實際是「避暑地也是世の中」（妻の実家的世間話：毒殺病人的醫生、放火的老太婆、奪妹妹財產的律師），無稻荷、無狐狸、無草酸、無義妹；且「飛行機病」對白（B:L522／L526）的說話者被舊 spec 誤標為妻の母，正確說話者是妻の弟。

完成內容：

- 全新建立 `src/data/chapters/chapter06.js`：§1 骨架（`chapter:6`／`title:"飛行機"`／`titleCn:"飛機"`／`startScene:"ch6_prologue"`／`startLocation:"ch06.road_home"`）＋ 4 個 locations（`ch06.road_home` circle／`ch06.home` rect／`ch06.inlaws` rect／`ch06.dunes` mountain）
- §2 全 29 場景逐字回填 `jp`（一律 Read 底本 `reference/aozora/haguruma_original.txt` B:L470–L548 複製，未手打）+ 新譯 `cn`（一人稱「我」），含 4 選擇點（`ch6_funeral`／`ch6_black_dog`／`ch6_glass_bowl`／`ch6_why_me`，全在前半），`ch6_final_walk` 起零選擇——命運收攏，讀者只剩「不得不做」的 forced steps，共 15 個 notebook keys
- **舊 spec「叔父稻荷狐狸信仰／義妹蓚酸毒殺」幻覺段完全不存在於本檔**：`ch6_hell_houses` 依 B:L488 逐字回填為「避暑地也是世の中」（毒殺病人的醫生、放火養子夫婦家的老太婆、奪妹妹資產的律師——僕眼中人生中的地獄），無稻荷、無狐狸、無草酸、無義妹
- **「飛行機病」對白說話者訂正**：`ch6_airplane_disease` 的 B:L522／B:L526 兩句飛行機病台詞，`speakerId` 訂正為 `"wifes_brother"`（妻の弟），非舊 spec 誤標的 `wifes_mother`
- **雨衣首尾呼應**：`ch6_prologue`（B:L470，回避暑地的司機偏偏披著雨衣）與 CH1 grandfathered key `raincoat_death`（姊夫死時的雨衣）組成跨章 connection `ch06.raincoat_final`（「物語は雨衣に始まり雨衣に終る」）
- **文中互動（Batch F6 forced steps）**：`ch6_final_walk` 依施工圖，把 `{ type:"forced", origin:"added", steps:["把脖子挺直。","繼續走。","不要停下。"] }` 插在 B:L534「僕は愈最後の時の近づいたことを恐れながら、頸すじをまっ直にして歩いて行った。」之後、「歯車は数の殖えるのにつれ……」之前——本章唯一使用點，對應終幕 nerve≈0 時的視覺崩壞
- nerve 事件依施工圖列 4 處：`ch6_home` +3（妻子與催眠藥的二三日平和，原文明寫）、`ch6_strindberg` −1（與史特林堡擦身）、`ch6_gallows` −1（烏鴉叫了四聲）、`ch6_dead_mole` −1（腐爛的鼴鼠屍骸）、`ch6_final_walk` −2（最後の時）→ 終幕神經歸零，配合視覺崩壞全開；`ch6_ending` 無任何數值 effects（沉默的結尾，原著在此中斷）
- §3 connections 6 條全部補上，**全部跨章**：`ch06.raincoat_final`（CH1 `raincoat_death`）、`ch06.bw_dog`（CH5 `ch05.bw_whiskey`）、`ch06.wings_everywhere`（CH5 `ch05.airship`）、`ch06.strindberg_twice`（CH5 `ch05.karamazov`）、`ch06.four_caws`（CH4 `ch04.la_mort`）、`ch06.mole_end`（CH5 `ch05.mole_curtain`）
- `symbols.js` `SYMBOL_GLYPHS` 新增 CH6 區 15 個 notebook key 的 glyph（沿用既有 5 個符號類別 raincoat/gear/wing/book/fire，未新增類別）
- `chapterRegistry.js` 註冊 `CHAPTER_06`
- `tests/scripts/cross-ref.test.js` 新增 7 個測試：① `CHAPTER_06` 搭配從 `CHAPTER_01`～`CHAPTER_05` 動態收集的 `priorNotebookKeys` 跑 `validateChapter` 應零 error；②～⑦ 六條跨章 connections（`ch06.raincoat_final`／`ch06.bw_dog`／`ch06.wings_everywhere`／`ch06.strindberg_twice`／`ch06.four_caws`／`ch06.mole_end`）逐一用真實 `resolveConnections` 驗證：帶跨章 key 時可觸發，缺該 key 時不觸發
- `tests/data/chapters.test.js` 更新：CH6 現已註冊，舊「CH6 顯示 ??? 佔位」測試改為「CH6 顯示真實標題」（比照 CH1 測試），另補一個對 CH7（原著範圍外，不存在）的機制檢查測試，保留「不佔位」機制本身的覆蓋
- 文件同步：`chapter06.js` 檔頭註解、`docs/chapter06-spec.md` 檔頭作廢警語（稻荷／蓚酸幻覺段＋飛行機病說話者更正）、README（開發現況、開發狀態 checklist、專案結構樹、npm run dev 啟動說明段：「第一章可遊玩」→「全六章可遊玩」）、`CLAUDE.md`（專案概要段更新為全六章完成、npm test 數字同步）、本條目
- 不 commit／不 push（全部留 unstaged）；未動 `chapter01.js`～`chapter05.js`

驗收結果：

- `npm run validate:chapters`：CH6 場景數 29、選擇點 4、ending 1，**22/22 playthroughs 抵達結局**，0 error，0 warning
- `npm run validate:fidelity`：**0 error**；**CH6 coverage 99.9%（3575/3579 字元）**（CH1 99.8%、CH2 99.9%、CH3 100.0%、CH4 99.9%、CH5 99.9% 同批未變動）
- `npm test`：**323/323 通過**（33 test files；`tests/scripts/cross-ref.test.js` 新增 7 個 CH6 專屬測試，`tests/data/chapters.test.js` 同步更新 1 個測試）
- `npm run build`：通過
- **幻覺清零 grep**：`稲荷`／`狐`／`蓚酸`在 `chapter06.js` 場景資料中零命中（僅出現在檔頭註解描述已作廢內容，共 3 處，均在 `//` 註解行內）
- **飛行機病說話者檢查**：`grep -B3 "飛行機病"` 確認兩處對白 block 的 `speakerId` 皆為 `"wifes_brother"`
- **forced steps 接線檢查**：`ch6_final_walk` 的 `{ type:"forced", ... }` block 確認位於「頸すじをまっ直にして歩いて行った。」與「歯車は数の殖えるのにつれ……」兩個 source block 之間，符合施工圖指定位置

備註：

- CH6 coverage 剩餘 0.1%（4 字元）未覆蓋，經核對為底本章節切分標記行本身（章號標題殘字「六　飛行機」），非敘事正文，同 CH1–CH5 模式，已由 `ch6_prologue` 的兩個 `system` block（「第六章　飛行機」／「——飛機——」）對應呈現
- 施工圖 `ch6-source-map.md` §1 骨架標頭 `sceneCount: 28` 與 §2 實際逐一枚舉的 29 個場景 id 不一致（`grep -c '^### ch6_'` 實測 29），本檔以 §2 實際枚舉為準記 `sceneCount: 29`，已在檔頭與本條目註記此偏離（同 CH3／CH5 先例：F7-1／F9 遇到同類骨架標頭與實際枚舉不一致時，以實際枚舉為準）
- **《歯車》全卷六章至此完工**：CH1～CH6 皆已依各章 `docs/chX-source-map.md` 施工圖重切完工，`origin:"source"` 標記涵蓋全部敘事正文，四項驗收（validate:fidelity／validate:chapters／test／build）全綠，README／CLAUDE.md 已同步更新為全六章完成狀態

---

## 2026-07-15

### 已完成

#### Batch F11 — 換書泛化（book bundle 化），D9 完成

狀態：完成（unstaged）

規格來源：`docs/batch-f11-generalize.md`（唯一施工圖來源）。前提：D9「先完成歯車，再抽通用引擎」的前提「全章文本穩定」已於 F10（CH6 完工，全卷六章）達成。目標：換一本書＝只加一個 `src/books/<id>/` 目錄，引擎與 UI 零修改。分 S1（引擎核心）→S2（元件層）→S3（工具層）→S4（換書證明）單線接力，本條目涵蓋全批（S1/S2 承接自前段工兵，S3/S4＋文件更新為本段完成）。

**S1 — 引擎核心參數化**（`src/bookLoader.js`／`src/books/haguruma/index.js`／`src/engine/{state,effects,corrupt,save}.js`）：

- 新增 `src/books/haguruma/index.js`（BOOK bundle 單一事實來源：`meta`／`stats`／`corruption`／`motif`／`ui`／`saveKey`／`chapters`／`symbols`／`palette`／`validator`／`fidelity`）與 `src/bookLoader.js`（換書點：一行 `export { BOOK } from "./books/haguruma/index.js"`）
- `state.js`：`createInitialState(book)` 由 `book.stats` 生成 stat 欄位（取代寫死的 nerve/insight/writing），`initialState`/`createChapterState` 保留為 haguruma 綁定版
- `effects.js`：`applyEffectsFor(book, state, effects)` 迭代 `book.stats` 依 min/max 夾制，`applyEffects` 為 haguruma 綁定版
- `corrupt.js`：`corruptTextFor(text, level, thresholdLevel, statMax)` 泛化門檻/上限為顯式參數
- `save.js`：`createSaveModule(book)` 讀 `book.saveKey` 生成 `SAVE_KEY`/`LEGACY_SAVE_KEY`；haguruma 綁定版逐字沿用舊 key 名（向後相容既有存檔）

**S2 — 元件層**（`HagurumaEngine`／`NerveBar`／`StatRadar`／`EndScreen`／`SceneText`／`ForcedSteps`／`Particles`／`LeftSidebar`／`App` 等）：

- 三軸顯示、`toastEffects`、`EndScreen`、`StatRadar`（軸數動態＝`stats.length`）、`NerveBar`（內部改讀 `book.stats.find(kind==="drain")`，檔名不改）全部收 `book` 參數，預設 `book = BOOK`（haguruma 綁定，向後相容既有呼叫端）
- `SceneText`／`ForcedSteps`／`Particles` 崩壞門檻改讀 `book.corruption`
- 新增 `src/components/motifs/index.js`（motif registry：`{ gears, none }`，`book.motif` 決定套用哪組 `{ Defs, Overlay }`）
- `App.jsx` 標題頁 title/author/quote/license/按鈕文字讀 `BOOK.meta`/`BOOK.ui`；`LeftSidebar` 章節警語與漢數字讀 `book.ui`
- `PALETTE` 於 App 啟動時注入 `:root`（`--washi-*` CSS 變數），haguruma 現值與 `global.css` 預設逐字相同，注入後零視覺變化

**S3 — 工具層去書本化**（`scripts/validate-chapters.js`／`scripts/validate-fidelity.js`／新增 `scripts/resolve-book.js`，本段完成）：

- `validate-chapters.js`：`EXEMPT_CHAPTERS`/`ORIGIN_EXEMPT_CHAPTERS` 兩個寫死模組常數移除，改讀 `book.validator.namespaceExemptChapters`/`originExemptChapters`；`SYMBOL_GLYPHS` 靜態 import 移除，cross-ref 檢查改用 `book.symbols`；`defaultTextState()`（供 origin 檢查探測 dynamic `text()`）與 `simulate()` 的初始 state 改由 `book.stats` 生成（取代寫死的 nerve/insight/writing 三欄位）；`simulate()` 的 clamp 邏輯不再自己維護一份 nerve∈[0,10] 判斷，改直接呼叫 `engine/effects.js` 的 `applyEffectsFor(book, ...)`，與真實引擎保證同一套數字。`validateNamespaces`/`validateOrigin`/`validateActionForced`/`validateChapter`/`simulate` 五個 export 都新增 `book = DEFAULT_BOOK`（haguruma 綁定）為最後一個可選參數，既有 3-arg/2-arg 呼叫端（`tests/scripts/*.test.js`）零修改仍全部通過
- `validate-fidelity.js`：`SOURCE_PATH`/`CHAPTER_MARKER_RE` 兩個寫死模組常數移除，改讀 `book.fidelity.sourceText`/`chapterMarker`；新增 `buildChapterMarkerRegex(markerTemplate)` 把 `"【第N章】"` 這種以字面 `"N"` 當章號佔位符的樣板轉成 `(\d+)` 擷取群組的 regex；`splitChapters(rawText, markerTemplate)` 新增可選第二參數，不帶時走預設樣板，`tests/scripts/fidelity.test.js` 既有單參數呼叫零修改仍全部通過
- 新增 `scripts/resolve-book.js`：兩支 CLI 共用的 `parseBookIdArg(defaultId)`/`resolveBook(bookId, defaultBook)`，支援 `--book=<id>` 旗標（動態 `import` `src/books/<id>/index.js`），不帶旗標時走預設 `haguruma`，輸出逐字不變
- **行為不變驗證**：`npm run validate:chapters`/`npm run validate:fidelity` 重構前後輸出與 `reports/pre-f11-baseline.txt` 逐字 diff 一致（僅 npm 包裝層的前導空行差異，`diff -B` 後零差異）；`npm test` 323/323（S3 改動前後測試數不變，因為新增的 `book` 參數皆為向後相容的可選參數）

**S4 — 換書證明（煙霧書）**（新增 `tests/fixtures/book-smoke/`／`tests/integration/book-smoke.test.jsx`，本段完成）：

- `tests/fixtures/book-smoke/index.js`：迷你假書 `BOOK_SMOKE`——雙軸 stat `courage`（drain, initial 3, max 5）/`memory`（gain, no max，皆非 nerve/insight/writing）、`motif:"none"`、獨立 `saveKey:"book_smoke_save"`、獨立 UI 標籤（`勇氣`/`記憶`/`備忘錄`/`牽絆`……全部非原著字串）、`validator` 兩個豁免清單皆為空陣列（不像 haguruma CH1/CH2 有 grandfathered 豁免，兩章都要求全面合規）。2 章 × 3 場景：CH1 含 1 choice、1 connection、1 個 `origin:"added"` block；`chapters` 欄位形狀比照 `src/data/chapterRegistry.js`（`getChapter`/`getAllChapters`/`getChapterCount`）
- `tests/integration/book-smoke.test.jsx`（14 tests，涵蓋施工圖 §4 列的五個面向）：
  1. `createInitialState(BOOK_SMOKE)` 生成 `courage`/`memory` 欄位，且不含 `nerve`/`insight`/`writing`
  2. `applyEffectsFor(BOOK_SMOKE, ...)` 驗證 courage 上下限夾制（[0,5]）與 memory（無上限）不受夾制
  3. `corruptTextFor` 用煙霧書自己的門檻比例（3/5=0.6，異於 haguruma 的 5/10=0.5）：高於門檻不崩壞、等於門檻（intensity=0）不崩壞、低於門檻崩壞
  4. `validateChapter`/`simulate`（從 `scripts/validate-chapters.js` 直接 import，帶入 `book=BOOK_SMOKE`）驗證煙霧書兩章零 error、22/22 playthrough 抵達 ending，且 `simulate()` 跑出的最終 state 數值符合煙霧書自己的 clamp（courage: 3−5→clamp 0）
  5. 元件 smoke render：`NerveBar`（label＝`勇氣`、非`神經`；`3 / 5`、非以 10 為分母）、`StatRadar`（2 軸而非 haguruma 的 3 軸）、`LeftSidebar`（章節警語為煙霧書字串，非原著警語）——`src/engine`、`src/components` 全程零修改，只換了傳入的 `book` 參數
- 這個測試就是「換書只需換 data」的可執行證明（施工圖 §4 明文要求）

**D9 完成標記**：`docs/DECISIONS.md` D9 條目補上完成標記，逐項對照 D9 當年列出的五處「綁死歯車」如何被本批解決。

殘留掃描（施工圖 §5-3）：

- `grep -rn "神經\|洞察\|執筆" src/engine src/components`：1 命中，`ImpactToast.jsx` JSDoc 範例註解內的字面示範文字，非邏輯硬編碼
- `grep -rn "haguruma_save" src/engine src/components`：2 命中，皆為 `save.js` 內解釋「派生結果與現行字面值逐字相同」的註解，非硬編碼邏輯
- `grep -rn "#[0-9a-fA-F]\{6\}" src/components`：23 命中（`GearDefs.jsx`／`ImpactToast.jsx`／`NerveBar.jsx`／`RightSidebar.jsx`／`StatRadar.jsx`），屬於 §2 S2-7「inline hex 收斂」範圍——這批 S3/S4 沒有動這幾個檔案，殘留清零留待後續一批處理（不影響本批「行為不變」與「換書證明」兩項硬指標，因為顏色是渲染細節，不是書本資料）

驗收結果：

- `npm test`：**337/337 通過**（34 test files；較 F10 基準 323 增加 14 個，全部來自新增的 `tests/integration/book-smoke.test.jsx`，既有測試零修改零減少）
- `npm run build`：通過（71 modules transformed，較基準 67 增加來自 S1/S2 新增的 `bookLoader.js`/`books/haguruma/index.js`/`motifs/index.js` 三個模組，非本批新增）
- `npm run validate:chapters`：與 `reports/pre-f11-baseline.txt` 逐字一致——6 章、202 場景、43 選擇點、6 ending、132（22×6）playthroughs 全數抵達 ending、CH1 1 個 grandfathered warning（不變）
- `npm run validate:fidelity`：與基準逐字一致——0 error／0 warning，coverage CH1 99.8%／CH2 99.9%／CH3 100.0%／CH4 99.9%／CH5 99.9%／CH6 99.9%
- 不 commit／不 push（全部留 unstaged）；`src/data/chapters/*.js` 的 jp/cn 文本一字未動

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
| 2026-07-12 | F1-b | feat: origin marking schema + rendering + validator + docs | unstaged | TextBlock v2 origin field, block-added styling, validateOrigin, 25 new tests |
| 2026-07-12 | F3 | feat: rewrite CH2 chapter02.js from ch2-source-map.md, retire hallucinated v1 | unstaged | 34 scenes, 8 choices, 12 notebook keys, 5 connections, coverage 99.9%, +2 cross-chapter connection tests |
| 2026-07-12 | F4 Lane B | docs: clean up 11-chapter residue + sync README/migration-plan to F1/F2 state | unstaged | ENGINE_SPEC/CHAPTER_GUIDE/DECISIONS/chapter06-spec 11章殘留清理, README checklist+structure tree sync |
| 2026-07-12 | F5 Lane R | feat: choice rewind (snapshot stack + seen marks) | unstaged | rewind.js snapshot stack, ⟲ 回溯 panel, ChoiceList ✓ marks, 30 new tests, coexists with Lane E editMode |
| 2026-07-13 | F8 | feat: rewrite CH4 chapter04.js from ch4-source-map.md, retire hallucinated old-friend scene | unstaged | 28 scenes, 6 choices, 12 notebook keys, 6 connections (2 cross-chapter), coverage 99.9% |
| 2026-07-13 | F9 | feat: build CH5 chapter05.js from ch5-source-map.md, retire hallucinated red-pond/old-woman scene | unstaged | 39 scenes, 7 choices, 16 notebook keys, 6 connections (2 cross-chapter), coverage 99.9%, restores 《赤光》歌集 letter |
| 2026-07-13 | F10 | feat: build CH6 chapter06.js from ch6-source-map.md, retire hallucinated inari-fox/oxalic-acid scene — 《歯車》全卷完工 | unstaged | 29 scenes, 4 choices (zero-choice forced-steps finale), 15 notebook keys, 6 connections (all cross-chapter), coverage 99.9%, corrects 飛行機病 speaker to wifes_brother |
| 2026-07-15 | F11 | refactor: book-bundle generalize (S1-S4) — D9 完成，換書只需換 `src/books/<id>/` | unstaged | BOOK bundle + bookLoader 換書點；engine/components/scripts 全面收 book 參數（haguruma 綁定版向後相容）；tests/fixtures/book-smoke + book-smoke.test.jsx 14 tests 為換書可行性證明；337/337 tests，四驗證與 pre-f11-baseline.txt 逐字一致 |

---

## Rules for Future Agents

見 `CLAUDE.md`「工作規則」段落。設計決策見 `docs/DECISIONS.md`。
