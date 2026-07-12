# Batch F5 施工圖：肖像名冊＋潤飾模式＋第一人稱＋選項回溯

> 狀態：定案（2026-07-12，Fable，依月月 4 項指示）。紀律沿用前批（不 commit、四綠驗收）。

## Lane P：肖像名冊制（修閃爍）

**病根**（GameLayout.jsx:36-43）：主角台詞（speakerId=protagonist，無立繪檔）會把 portraitId 切到不存在的 key → 立繪整張消失；下一句 NPC 說話又出現 → 閃爍。且一次只顯示一張，換人說話前一位直接被换掉。

**月月要的行為**：立繪從角色首次說話出現，維持到**換場景**才消失；沒在說話時變**淡影**；換別人說話時前一位仍在（淡影）。

**實作**：
1. GameLayout 狀態改名冊制：`roster: string[]`（本場景已出現過的 speakerId，僅收 `chapter.portraits` 裡有圖的）＋ `activeId: string|null`。
   - `handleActiveBlockChange`：block 是 dialogue 且 speakerId 有立繪 → roster 加入（若無）＋ `activeId=speakerId`；其他情況（narration/inner/主角或無立繪 speaker）→ **只** `activeId=null`，roster 不動。
   - 場景切換（現有 useLayoutEffect）→ roster 清空、activeId=null。
2. LeftSidebar 渲染整個 roster（出現順序，垂直堆疊）：`activeId` 那張全亮，其餘 `.dim`（opacity .35 + grayscale(.4)）；activeId=null 時全部 dim。CSS 過渡 `transition: opacity .3s, filter .3s`（消滅硬切閃爍感）；多張時每張 max-height 均分（CH1 同場最多 3 張）。
3. 測試：protagonist 台詞不清 roster（閃爍回歸測試）、narration 只 dim 不清、換場景清空、無立繪 speaker 不進 roster。

## Lane E：編輯器潤飾模式（優先）

**目標**：月月在真實遊戲畫面裡直接改字（所見即所得），改動存 overlay，匯出 patch 由腳本套回源檔。**僅 `import.meta.env.DEV` 下存在**，production build 零痕跡。

1. **overlay store**：新檔 `src/engine/textOverlay.js`。localStorage key `haguruma_overlay_v1`。entry key：block=`${chapter}:${sceneId}:b${blockIndex}`、choice=`${chapter}:${sceneId}:c${choiceIndex}`（choiceIndex 用**資料原始索引**，非 condition 過濾後的顯示索引）。value 只存改動欄位 `{jp?, cn?, content?, text?}` ＋原值快照 `{orig: {...}}`（供 patch 生成與還原）。API：get/set/remove/clearAll/exportPatch。
2. **套用點**：HagurumaEngine 解析完 scene text blocks 後、渲染前套 overlay（靜態陣列 index 穩定）。**動態 text 函式場景停用編輯**（typeof function → 該場景 blocks 顯示 🔒 tooltip「動態場景請直接改檔」）。choices 同理套用（動態場景除外——目前 choices 無動態，直接套）。
3. **UI**：
   - header 加「✎ 潤飾」toggle（DEV only）。
   - editMode 下：文字 block（打字區＋歷史區）hover 顯示外框、點擊開底部編輯面板：dual block 兩個 textarea（jp/cn）、content block 一個；按鈕＝儲存／還原此塊／取消。
   - editMode 下點 choice 按鈕＝開編輯面板改 `text`（**不觸發選擇**，防誤點）。
   - `origin:"source"` block 的 jp 欄位編輯時顯示紅字警告「⚠ 原文區塊：改動 jp 將無法通過 fidelity 驗證」（仍允許——可能是修正抄錄錯誤）。
   - 面板常駐顯示「匯出 patch (N)」（N=改動數，點擊下載 JSON blob）與「清除全部修改」（confirm）。
4. **patch 格式**：`[{key, chapter, sceneId, kind:"block"|"choice", index, field, oldValue, newValue}]`。
5. **套用腳本**：`scripts/apply-text-patch.js <patch.json>`——逐條在對應 chapterXX.js 找 oldValue 的**唯一精確字串**替換為 newValue；找不到或不唯一 → 該條報 error 跳過（不得模糊匹配）。結尾提示重跑四驗證。含 fixture 測試（tests/scripts/apply-patch.test.js：命中替換／不唯一拒絕／缺失拒絕）。
6. 測試：overlay get/set/export roundtrip、套用點正確性、DEV gate（prod 下零渲染）。

## Lane 人稱：cn 全面轉第一人稱（D11 推翻）

月月裁定：cn 由二人稱「你」改**第一人稱「我」**。

1. 範圍：chapter01.js＋chapter02.js 的 `cn`、added block `content`、choice `text`、notebook `desc`、dialogue 主角的 `speaker: "你"` → `"我"`。**jp 一律不動**。
2. **文法轉寫不是瞎替換**：「你提著一只皮箱」→「我提著一只皮箱」；「你姊姊的丈夫」→「姊夫」或「我姊姊的丈夫」；「讓你感覺」→「讓我感覺」；祈使句選項無主詞者不動。
3. **例外（保留「你」）**：**其他角色**對主角說話的 cn 裡，稱呼主角的「你」是正確的第二人稱，**不得改**（例：T 君「你要是人在那邊看看就知道了」）。判斷基準：只轉「敘述視角」的你（narration/inner/主角台詞/選項/desc），不轉「對白內容中的稱謂」。
4. UI 字串：grep `src/`（data 以外）列出含「你」的字串回報，**只改明確屬敘事視角者**（如有），UI 提示語不動。
5. `docs/DECISIONS.md` D11 更新：「2026-07-12 月月裁定：cn 改第一人稱『我』。原二人稱方案作廢。」
6. 受影響測試（SceneText 等斷言 cn 字串者）同步更新。四綠必過（fidelity 不受影響——它只驗 jp）。

## Lane R：選項回溯（最後施工，動 HagurumaEngine）

**目標**：分支常只差一句話，重玩整章成本太高（無 skip）。允許回到本章任一已經過的選擇點重選；已選過的選項標記 ✓。

1. **快照棧**：新檔 `src/engine/rewind.js`。進入**有 choices 的場景**時 push 快照 `{sceneId, state: 深拷貝(structuredClone), chosen: null}`；玩家選擇後把棧頂 `chosen = {index, text}`。存 sessionStorage `haguruma_rewind_v1`，上限 60 筆 FIFO；換章清空。深拷貝必須含 notebook/choicesMade/數值（不得共享引用）。
2. **UI**：header 加「⟲ 回溯」按鈕 → 面板列出本章選擇點（新→舊）：場景段落（links.fold 或 scene id）＋當時所選的選項文字。點擊 → confirm「回到這個選擇點？之後的進度（手帖/數值/連結）將回復」→ 恢復該快照 state、跳回該場景、截斷棧至該點、寫存檔。
3. **已見標記**：localStorage `haguruma_choice_seen_v1`，key `${ch}:${sceneId}:${choiceIndex}`，選過即 true（跨回溯持久）。ChoiceList 對 seen 選項尾端渲染淡色「✓」。
4. 測試：快照深拷貝隔離、回溯後 state 正確、截斷邏輯、seen 標記持久、換章清空。

## 施工順序與驗收

- 順序：**P → parallel(E, 人稱) → R**（P 先做完避免與 E 搶 game.css；R 最後避免與 E 搶 HagurumaEngine）。
- 每 lane 完工四綠（test/build/validate:chapters/validate:fidelity）。
- Opus 總驗證重點：P 的閃爍回歸（構造 protagonist 台詞流）；E 的 patch roundtrip（改一條 cn → 匯出 → apply-text-patch → 源檔正確替換）與 prod 零痕跡；人稱的例外規則（grep cn 殘留「你」逐條判定是敘事視角漏改還是對白稱謂合法保留）；R 的深拷貝隔離與回溯後連結/手帖一致性。
