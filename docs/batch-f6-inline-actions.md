# Batch F6 施工圖：文中互動啟用（action / forced blocks）

> 狀態：定案（2026-07-12，Fable）。月月目標 3 的核心互動：「你必須站起來」式指令，增強閱讀記憶。
> 現況：ActionBlock.jsx / ForcedSteps.jsx / GearOverlay.jsx 是完成品孤兒元件（連 legacy prototype 都只有機械沒資料）。本批＝定 schema＋接線＋首批內容。
> 紀律沿用前批：不 commit、四綠、jp 不動。**本批不碰 DEV-LOG**（由 CH3 批統一記，避免並行衝突）。

## 1. Schema（docs/chapter-data-schema.md 增補）

```js
// 文中互動：讀者必須點擊才繼續。天生是添補內容，origin 必填 "added"
{ type: "action", origin: "added", prompt: String,      // 指令文字（命令形，無主詞：「站起來。」）
  response: String|undefined,                            // 點擊後浮現的一行回應（可省略）
  flag: String|undefined, effects: Effects|undefined }   // 點擊時設 flag / 套 effects（走 ImpactToast）
{ type: "forced", origin: "added", steps: String[] }     // 連續強制步驟，逐一點擊；nerve 低時按鈕侵蝕＋齒輪覆蓋（ForcedSteps 既有視覺）
```

## 2. 引擎接線

1. **打字流程**（SceneText.jsx）：blocks 逐一打字，遇 action/forced → 暫停推進、渲染互動元件（ActionBlock / ForcedSteps，傳入當前 nerve）、等 onAction/onComplete 才繼續後續 block。場景的「點擊繼續」在互動元件未完成前不得跳過它。
2. **效果**：action 點擊時套 effects（走現有 applyEffects＋ImpactToast 多則堆疊）、設 flag（進 choicesMade——把 F1 留下的孤兒 onFlag 通路接通或以現有機制替代，擇一，不要兩套）。
3. **歷史區**（TextBlockBody/HistoryBlock）：完成態渲染 `✓ prompt`（＋response 縮排一行），樣式沿用 .action-block--done / .forced-step--done。
4. **CSS**：prototype.html 有 .forced-btn/.forced-wrapper/侵蝕 clip-path 全套樣式，game.css 若缺則移植（比對現有 .action-block 樣式是否已在 game.css，缺哪補哪）。
5. **潤飾模式相容**：editMode 下點 action/forced 按鈕＝編輯 prompt/steps 文字，不觸發互動（比照 choice 的處理）。
6. **回溯相容**：action 的 flag/effects 已含在 state 快照內，無需特別處理；驗證確認即可。

## 3. Validator / fidelity 增補

- validate-chapters：action 需非空 prompt、forced 需非空 steps[]、兩者 origin 必為 "added"（缺=error）；模擬器把 action/forced 視為直通（套 action.effects）。
- validate-fidelity：新 type 不參與 jp 比對（無 jp 欄），W 檢查跳過。
- 測試：schema 驗證、打字流程暫停/續行、effects/flag 套用、歷史區完成態、模擬器直通。

## 4. 首批內容（三處，全部 added、命令形無主詞、不重複原文敘述而是「先做、後讀芥川的句子」）

1. **CH1 `auto_phone`**：在 source「僕はもとのように受話器をかけ…意識していた。」之後、「給仕は容易に…鈕を押した。」之前，插入
   `{ type:"forced", origin:"added", steps:["按下門鈴的按鈕。","再按。","再按一次。"] }`
   （具現化「何度もベルの鈕を押した」；此時玩家 nerve 通常已低，按鈕侵蝕視覺自然生效）
2. **CH2 `ch2_polikouchka`**：在「殊に彼の悲喜劇の中に…」source block 之後、「僕は一時間とたたないうちに…抛りつけた。」之前，插入
   `{ type:"forced", origin:"added", steps:["從床上跳起來。","把書摔向房間的角落。"] }`
   （先做動作，再讀芥川描述這個動作的原文——記憶錨點）
3. **CH2 `ch2_rat_search`**：場景最前插入
   `{ type:"action", origin:"added", prompt:"追進浴室，開門搜索。" }`（無 response，後續 source 敘述接手）

插入後跑四綠＋validate:fidelity（新 block 不影響 coverage）。

## 5. 驗收重點（Opus）

- 打字流程：互動 block 前的文字打完→暫停→點擊→繼續，「點擊繼續」不能繞過互動。
- nerve 侵蝕視覺：以低 nerve state 掛 ForcedSteps 確認 erosion class/齒輪 props 隨 nerve 分級。
- 三處內容位置與施工圖一致；playthrough 22/22 仍全通（互動不阻斷模擬器）。
- editMode/回溯不被破壞（跑既有測試）。
