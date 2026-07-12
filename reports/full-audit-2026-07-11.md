# haguruma-engine 盤點總審查（2026-07-11）

審查方式：三路並行深查（引擎程式碼＋測試實跑／劇本內容 vs 青空文庫原文逐字比對／專案狀態＋akasha 編輯器整合評估），由 Claude 整合。

## 總判定

| 面向 | 判定 |
|---|---|
| 目標 1：AVG 沉浸式閱讀引擎 | ✅ 大致達成。CH1 可完整遊玩，125/125 測試綠，但有 8 個真 bug + 3 個地雷（見 §3）；「文中互動」元件在 React 版是孤兒代碼未被渲染 |
| 目標 2：引擎可換書 | ⚠️ 約 60%。敘事機制層已資料驅動；三軸數值/UI 文案/崩壞閾值/齒輪特效綁死《歯車》。屬 DECISIONS D9 記錄在案的刻意延後，方向合理 |
| 目標 3：原文一字不漏＋新增內容標記 | ❌ **架構性未達成**。無任何「原文 vs AI 添加」標記機制；地の文日文原文完全未收錄；jp 欄位有刪改甚至添字；CH2/CH4/CH5/CH6 spec 含中到重度幻覺 |
| 目標 4：akasha 劇本編輯器整合 | ✅ 高度可行。技術棧完全同構，dialogue 格式當初就是為對接而標準化的；三方案見 §5 |
| Opus 4.6 劇本代審結論 | **不可直接用**：CH1 大修、CH2 重做、CH3 spec 小修可用、CH4/CH5 spec 局部重做、CH6 spec 中修 |

---

## 1. 目標 3 審查詳情（最嚴重，劇本代審）

比對基準：青空文庫 42377_34745.html 全文下載逐字比對。

### 1a. 「一字不漏」不成立

- **地の文（約佔原著七成篇幅）完全沒有收錄日文原文**，只有中文第二人稱改寫。例：開頭「僕は或知り人の結婚披露式につらなる為に…」遊戲內只剩中文，且「或知り人（熟人）」誤作「友人」。
- **對話 jp 欄位也有刪改**：T 君戒指台詞後半兩句被刪（cn 卻保留譯文，jp/cn 不對應）；「ハルビン」→「ハルピン」、「雨のふる日」→「雨の降る日」等表記被擅自現代化；主角多句台詞整句刪除或改成中文選項按鈕（日文原文消失）。
- chapter02.js:128 在 jp 欄位**添字**「碌く」——製造不存在的原文。
- 忠實的部分也存在（漢學家堯舜段、麒麟＝一角獸、女學生、拖鞋段等逐字相符），證明「做得到但沒有全做」。

### 1b. 「非原文標記」機制不存在

- schema（docs/chapter-data-schema.md）的 TextBlock 六型中沒有任何欄位區分「芥川原文 vs AI 新增」。
- SCENES_FORMAT 的顏色只區分文本類型（敘述/內心/對話），不是原文/添加。紫色 inner 裡原文直譯與 AI 發明（「這個念頭像齒輪一樣開始空轉」）視覺上無法分辨。
- 唯一事實上可辨識的添加物是選項按鈕本身。
- 註：CLAUDE.md 工作規則第 10 條「遊戲文本由月月提供」——現行文本產出流程違反專案自訂規則。

### 1c. 幻覺清單（jp 欄位/spec 聲稱原文的捏造）

1. chapter02.js:272 姊姊台詞「あの人はあなたのように強がりも云えないし…」——原文全篇不存在（grep 確認）。
2. chapter02.js「養子與黑痣男」：黑痣青年原著是街上遇到的愛讀者，被移植成姊姊家「養子」（原著姊姊家只有「三人の子供たち」）；spec 還把此幻覺當「原文疑點」討論。
3. ch02_depart「關東大震災後簡易住宅」——原著無；姊姊住 barrack 是自家失火。
4. ch02_tolstoy：Polikushka 情節轉述錯誤＋刪掉原著「くたばってしまえ！」摔書/老鼠竄出關鍵場景。
5. chapter05-spec scenes 8–12「松林夜路→赤光池塘→穿寢衣老婦→死鼴鼠」整段捏造；原著題眼《赤光》歌集再版（外甥來信）反而沒有對應場景。
6. chapter04-spec ch04_old_friend 舊友對話整段捏造（兒子自殺未遂）；原著的朱舜水/不眠症「發不出讀音」語言崩解母題整個丟失。
7. chapter06-spec：稻荷狐狸信仰、義妹蓚酸毒殺未遂皆原著無；「飛行機病」說話者是妻の弟，誤標妻の母。
8. CH3 spec 抽查引用全部相符——六份 spec 中品質最好。

### 1d. 翻譯品質

中上、無重大錯譯，芥川短句節奏保持不錯。個別問題：「或知り人」→友人、「巴黎的分公司」腦補、ch2「姊姊不相変地冷靜」日文詞未翻、T 君段 cn 比 jp 多內容。

### 1e. 設計品質

- 「觀察 vs 忽略」核心循環貼合主題，分支 3 場景內匯合紀律有守住。
- 劇透型選項：「主張堯舜是架空人物…」把台詞先講完；「你已經三次遇見雨衣了」替讀者數次數，削弱原著讓讀者自己發毛的效果。
- auto_allright_resolve 對未選 pondered_allright 的玩家硬塞白話解釋，過度詮釋。
- 人稱不一致：specs 用「僕」、js 用「你」。
- chapter01.js 頭部青空 URL 檔名錯（42377_15163.html）；ch02 spec connection 表與 js 實作 key 不一致。

---

## 2. 目標 3 的修復方向（先定格式再返工）

1. **schema 先行**：TextBlock 加原文標記（例：`origin: "source" | "added"`＋narration 補 `jp` 原文欄），UI 用不同顏色渲染 `added`——這決定所有返工格式，必須最先定案。
2. jp 欄位一律青空文庫逐字回填，禁止表記現代化、禁止刪句。
3. CH2/CH4/CH5 幻覺段整段作廢，從原文重切場景。
4. 建議加一支 **fidelity 驗證工具**：把所有 `origin:"source"` 的 jp 欄位對青空文庫全文做子字串比對，不匹配即 error——把「原文一字不漏」變成 CI 可擋的硬約束，不再依賴人力審查（對「十年後才有心力」的現實最重要）。

---

## 3. 引擎 bug 清單（測試 125/125 綠、validator 通過，但有漏網）

嚴重度排序：

1. **choice 缺 `next` → 存檔寫入 null → 重新整理偽造完章畫面**（HagurumaEngine.jsx:237 + save.js:90）；validator 抓不到：playthrough FAIL 也 exit 0（validate-chapters.js:57 只看 errors），且無 choice-missing-next 靜態檢查。
2. **生產部署 legacy 連結必 404**（App.jsx:70 絕對路徑 `/prototype.html`，忽略 vite base，且檔案不在 public/ 不會進 dist）。
3. 空 jp 的 dialogue，中文被套日文樣式，且與歷史區渲染不一致（SceneText.jsx:7-8；例 auto_allright_corridor）。
4. 複合 effects 只 toast 第一項（HagurumaEngine.jsx:91-97 if/else if）；多連結 toast 互相覆蓋。
5. 章節目錄標題永遠 "???"（chapters.js 佔位資料架空揭示邏輯；且列 11 章與原著 6 章矛盾）。
6. 換章後未立即存檔，關頁面進度回退（App.jsx:27-33）。
7. `clearSave` 無人呼叫——通關後無法重新開始（App.jsx:4）。
8. **ActionBlock/ForcedSteps/GearOverlay 是孤兒元件、onFlag 傳了沒人收**——「你必須站起來」式文中互動在 React 版實際不存在，只活在 legacy prototype。⚠️ 這是目標 3 的核心機制。
9. （地雷）applyEffects 對 nerve 無上限夾制（effects.js:19-21）。
10. （地雷）playAmbient 併發競態（audio.js:30-51，目前無人使用）。
11. （地雷）validator 模擬器三處與 engine 偏差：不執行 choice.condition、不呼叫動態 text 函式、effects 不夾制下限。

## 4. 換書通用性（目標 2）

已通用：場景圖/選擇/手帖/連結/地圖/存檔遷移/歷史摺疊、engine 8 檔中 4 檔書本無關、validator 大半通用。
綁死：三軸 stat 名稱與邏輯（state/effects/corrupt＋約 10 個元件的 UI 標籤與閾值）、齒輪 SVG、存檔 key、App 外殼文案、symbols 全域檔、大量 inline hex。gameConfig.js 是死代碼（零 import，檔頭自承）。

工作項目按量降序：① stat 系統參數化（~12 檔＋125 測試連動，順修 bug 9）② 崩壞/特效 motif 抽換 ③ book bundle 格式定案（gameConfig+registry+symbols+palette 一入口）④ UI 字串表 ⑤ 標題頁＋目錄資料化（順修 bug 5）⑥ validator 去書本化（順修 bug 1）⑦ 存檔 key per-book ⑧ inline hex 收斂 CSS 變數。

## 5. akasha 編輯器整合（目標 4）

編輯器在 `akasha-library\modules\script-editor\`（~7,100 行，Vite+React18 無 TS，與 haguruma 同構）。四 TAB：Search／Editor（block 級編輯＋choice 模板）／Reader（雙語預覽）／Write（`角色：台詞`、`#choice: a / b` 行文法＋diff-merge 雙向同步）。最有價值資產：`src/lib/parser.js`（446 行、零依賴、可直接抽用）。

有利事實：haguruma 2026-05-08 dialogue 標準化的動機就是對接此編輯器（jp↔original、cn↔zh 幾乎 1:1）；編輯器 schema 本來就有 choice.nextBlockId 和 avg（sprite/bg/bgm/sfx）欄位。動態 `text:(state)=>` 全專案僅 4 處（ch1 三處：137/691/815；ch2 一處），可宣告式化。

| 方案 | 內容 | 工作量 | 取捨 |
|---|---|---|---|
| A 純 JSON＋條件 DSL 全面對接 | variants DSL＋解譯器＋雙向 adapter | 1.5–2 週 | 單一資料源、CH3–6 錄入受益最大；但成本最高、fork 編輯器要自維護、與 D9 精神衝突 |
| B 編輯器當寫作工具＋codegen 轉譯 | export blocks → 生成 chapterXX.js 骨架 | 2–3 天 | 最便宜、engine 零改動；但非真 WYSIWYG、雙資料源、動態場景不可編 |
| C haguruma 內建「潤飾模式」 | 遊玩中就地編輯 jp/cn/選項文字→localStorage overlay→匯出 patch | 3–5 天 | 唯一真 100% 所見即所得（實際遊戲畫面下改字）、零遷移；但不能改結構 |

建議：先 C（正中「潤飾劇情跟選擇肢」需求）＋B 作 CH3–6 錄入管線；CH2 完工後視痛感決定是否升級 A（與 D9 泛化一起做）。

## 6. 專案狀態

- **git**：現在 branch `claude/heuristic-sinoussi-a0ffaf`（與 origin 同步）領先 master 10 commit——master 還沒合這批已驗收工作。可刪分支：本地 batch1/batch2a/batch2b/batch3/tool 5 支＋遠端 3 支 claude/*（皆已 merge）。
- **未 commit**：chapter02.js（WIP 11 場景）＋registry/symbols 修改＋dev.bat。⚠️ **chapter02.js 被內容審查判「重做」（含捏造台詞/人物），建議不要直接 commit 進度，先處理 §2 的 schema 決策。**
- **DEV-LOG 落後**：寫著「B2 待排程 blocked on 月月 review」但工作樹已有 CH2 WIP——違反工作規則第 4 條。
- **「11 章」殘留 9 處**：README:141、ENGINE_SPEC:13/438/1089、CHAPTER_GUIDE:11/192、DECISIONS D1/D9、chapter06-spec:419（開放問題已可關閉）。原著實為 6 章。
- 其他：README:92「第二章以後尚未遷移」將失真；CH1 驗收數字三處不一致（洞察 11 vs 13，prototype vs React 版未註明）；README checklist 與結構樹缺多項已完成工作。dist/ 未進 repo、.gitignore 合理。

## 7. 建議行動順序

1. **定 schema「原文標記」格式**（§2-1）——一切返工的前提，半天內可定案。
2. **寫 fidelity 驗證工具**（§2-4）——之後所有文本返工都有硬閘門。
3. CH1 大修：地の文回填日文原文＋標記 origin＋修 jp 刪改；CH2 從原文重切（現有 WIP 作廢或降級為結構參考）。
4. 修 bug 1（validator 升級 playthrough FAIL 為 error＋補 choice-missing-next 檢查）與 bug 7（新遊戲按鈕），其餘 bug 隨手修。
5. 文件清理：11 章殘留 9 處＋DEV-LOG 補記＋master 合併＋刪 8 支舊分支。
6. 編輯器方案 C（潤飾模式）——3–5 天，之後月月可以在真實畫面裡直接改字。
7. 通用化（目標 2）照 D9 原計畫排在全章文本穩定之後。
