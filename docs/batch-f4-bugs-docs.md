# Batch F4 施工圖：bug 修復＋文件清理

> 狀態：定案（2026-07-12，Fable）。依據 `reports/full-audit-2026-07-11.md` §3（bug 編號沿用該報告）與 §6。
> 範圍外：Bug 8（ActionBlock/ForcedSteps 文中互動復活）另開批次，本批不碰。

## Lane A：bug 修復（引擎/元件/validator）

1. **Bug 1（validator）**：`scripts/validate-chapters.js` 兩處——(a) playthrough 有 FAIL 時計入 error（exit 1），不再只看結構 errors；(b) 新增靜態檢查：場景有 choices 時每個 choice 必須有 `next` 且指向存在場景（缺 next = error）。
2. **Bug 1（引擎防禦）**：`HagurumaEngine.jsx` onChoice——`choice.next` 不存在時 `console.error` 並不推進、不存檔（禁止把 null 寫進 save 的 nextScene，除非該場景 `links.showEnd`）。
3. **Bug 7（新的開始）**：`App.jsx` 標題畫面——偵測到存檔時顯示第二顆按鈕「新的開始」（樣式次要於「繼續遊玩」；原「開始遊玩」在有存檔時改標「繼續遊玩」）。點「新的開始」→ `window.confirm` 確認 → `clearSave()` ＋重置 state 從第一章開頭開始。
4. **Bug 2（legacy 連結 404）**：`App.jsx:70` 連結改 `href={import.meta.env.BASE_URL + "prototype.html"}` 且僅 `import.meta.env.DEV` 時渲染（production build 不含 prototype.html，不給死連結）。
5. **Bug 4（toast 只顯示第一項）**：`HagurumaEngine.jsx` toastEffects 改為收集所有變動（nerve/insight/writing/連結）為陣列；`ImpactToast.jsx` 支援同時堆疊顯示多則（垂直排列，各自淡出）。
6. **Bug 6（換章不存檔）**：`App.jsx` advanceChapter 成功切章後立即寫入存檔（新章 startScene）。
7. **Bug 9（nerve 無上限）**：`engine/effects.js` applyEffects 對 nerve 加 `Math.min(10, ...)` 上限夾制（10 = 現行寫死上限，等 gameConfig 泛化再參數化）。
8. **Bug 10（audio 競態）**：`engine/audio.js` playAmbient 加 generation counter：進入時遞增並捕捉，await 後 generation 不符則丟棄結果不播放。
9. **Bug 11（validator 模擬偏差）**：validate-chapters.js 模擬器——(a) 執行 `choice.condition`（不滿足的選項不列入 playthrough 分支）；(b) 動態 `text` 函式以兩態 probe 呼叫（比照 validate-fidelity 的做法）包 try/catch，crash 即 error；(c) 模擬 applyEffects 加下限/上限夾制與 engine 一致。
10. **Bug 5（章節目錄）**：`src/data/chapters.js` 廢除硬列 11 章——改由 `chapterRegistry` 派生：已註冊章顯示真標題，未註冊章以原著章名總數 6 為上限顯示 "???"。`LeftSidebar.jsx` 揭示邏輯不變。漢數字表只留 一～六。

每項修完補/改對應 Vitest 測試（比照現有測試風格）。

## Lane B：文件清理

依 audit §6 逐項（全部是文字修訂，不碰程式）：
1. 「11 章」殘留：`ENGINE_SPEC.md:13`（11 章 51 節→6 章）、`ENGINE_SPEC.md:438`（「第十一章『敗北』」→「第六章『飛行機』」）、`ENGINE_SPEC.md:1089`（全 11 章→全 6 章）、`CHAPTER_GUIDE.md:11`、`CHAPTER_GUIDE.md:192`（第四至十一章→第三至六章）、`docs/DECISIONS.md` D1 與 D9 的 11 章敘述加註更正（在原文後加「〔更正 2026-07-12：原著實為 6 章〕」，不改寫歷史決策原文）、`docs/chapter06-spec.md:419` 開放問題標記已解決。
2. `README.md`：:92「第二章以後尚未遷移」→ 更新為 CH1 完成（含原文回填）、CH2 WIP 之現況；:141 checklist「第二至十一章」若 F2 已改則覆核；開發狀態 checklist 補：角色立繪、章節管理、125→現行測試數、CH2–CH6 spec 完成、origin 標記＋fidelity 工具（新增）；專案結構樹補 `scripts/`、`tests/`、`docs/` 新檔、`reference/aozora/`。
3. CH1 驗收數字：README 驗收表加註「prototype 版數據（2026-05-05）；React 版洞察 13（見 DEV-LOG Batch 3）」，migration-plan.md:344 同步加註。
4. `docs/DEV-LOG.md` 補 F4 條目（F1/F2 條目工兵已寫，覆核存在即可）。

## 驗收

- Lane A：`npm test`、`npm run build`、`npm run validate:chapters`、`npm run validate:fidelity` 四綠；故意構造一個缺 next 的 choice 餵 validator 確認報 error（用臨時檔測，測完刪）。
- Lane B：grep「十一章|11 章|11章」在上述文件應零殘留（DECISIONS 的加註更正除外）。
- 共同：不 commit；不動 `src/data/chapters/*.js` 與 `legacy/`、`reference/`（aozora 除外——也不動）。
