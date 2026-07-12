# 原文標記（origin marking）＋忠實度驗證規格 v1

> 狀態：規格定案（2026-07-12，Fable 規劃）。本文件是 Batch F1 的施工地圖，工兵照做即可，不需自行決策。
> 動機：專案核心要求「原文一字不漏＋新增內容以顏色區分」在現行 schema 中無對應機制（見 `reports/full-audit-2026-07-11.md` §1）。

---

## 0. 名詞

- **原文（source）**：芥川《歯車》青空文庫底本的逐字文本。基準檔：`reference/aozora/haguruma_original.txt`（由 `reference/aozora/42377_34745_raw.html` 轉出，見 §4）。
- **添補（added）**：任何非原文內容——AI/編者新增的過場敘述、擴寫的內心獨白、橋接句、互動指令文本。
- **譯文（cn）**：原文的中文翻譯。譯文「代表」原文，不算添補；添補內容的中文就是添補。

## 1. TextBlock schema v2

`narration` / `inner` / `dialogue` 三型新增必填欄位 `origin: "source" | "added"`。`system` / `break` / `pause` 不變、不需 origin。

```js
// 原文敘述（地の文）：jp 必須逐字等於底本，cn 為譯文
{ type: "narration", origin: "source", jp: String, cn: String }
{ type: "inner",     origin: "source", jp: String, cn: String }

// 添補敘述：僅中文（保留現行 content 欄位）
{ type: "narration", origin: "added", content: String }
{ type: "inner",     origin: "added", content: String }

// 對話：欄位不變，加 origin。source 的 jp 必須逐字等於底本
{ type: "dialogue", origin: "source", speaker, speakerId, jp: String, cn: String }
{ type: "dialogue", origin: "added",  speaker, speakerId, jp: String|"" , cn: String }
```

**向後相容**：缺 `origin` 的 block（現行 CH1 全部）視為 legacy——渲染照舊、validator 對 CH1 發 warning、對 CH2+ 發 error（比照 namespace grandfather 模式）。渲染器只在 `origin === "added"` 時套添補樣式，legacy 不套。

**Choice 補充欄位**（選項本身是 UI 添加物，天然可辨識，不套色）：

```js
{ text, next, flag, effects, notebook, unlock, condition,
  sourceJp: String | undefined }  // 若選項文字改編自主角的原文台詞，此欄放原文逐字句
```

**寫作規則（進 SCENES_FORMAT.md §7）**：
1. 主角的原文台詞若被做成選項，選中後的下一場景**必須**以 `origin:"source"` 的 dialogue block（speaker「你"僕"」）完整收錄該句原文——原文不因互動化而消失。
2. `origin:"added"` 的 dialogue 原則上禁止（不替芥川筆下人物編台詞）；如過場確有必要，改用 added narration 轉述。
3. jp 欄位禁止表記現代化（ハルビン≠ハルピン、雨のふる日≠雨の降る日）、禁止刪句、禁止句讀改動。

## 2. 渲染規格

改動點：`src/components/SceneText.jsx`、`HagurumaEngine.jsx` 的 `HistoryBlock`（約 :22）、`src/styles/global.css`（CSS 變數）＋ `game.css`（block 樣式）、`src/components/RightSidebar.jsx`（圖例）。

1. **CSS 變數**（global.css `:root`，跟隨現有 `--washi-*` 命名）：
   ```css
   --added-ink: #6f9fae;      /* 淺蔥——與和紙底對比、明顯異於本文墨色 */
   --added-accent: #4a8296;
   ```
2. **添補樣式**：`origin:"added"` 的 narration/inner/dialogue 外層加 class `block-added`：
   ```css
   .block-added { border-left: 2px solid var(--added-accent); padding-left: 0.6em; }
   .block-added, .block-added * { color: var(--added-ink); }
   .block-added::before { content: "補"; font-size: 0.65em; color: var(--added-accent);
                          vertical-align: super; margin-right: 0.35em; opacity: 0.8; }
   ```
   inner 原有的紫色斜體在 added 時被 `--added-ink` 覆蓋（顏色以「是否原文」優先於「文類」）。
3. **source narration/inner 渲染**：比照 dialogue 的雙語呈現——jp 一行（`.scene-block-jp` 樣式族）在上、cn 一行在下。無 speaker 標籤。
4. **順手修 Bug 3**（同一代碼區）：SceneText 不得再用 `[jp, cn].filter(Boolean)` 推斷語言；改為顯式按欄位渲染：jp 空字串→只渲染 cn 且套 cn 樣式。打字階段與 HistoryBlock 的樣式必須一致（同一 block 進歷史區後外觀不變）。
5. **圖例**：RightSidebar 底部加一行固定圖例：`<span class="block-added-legend">補＝非原文的添補內容</span>`，樣式用 --added-ink 小字。
6. legacy `prototype.html` 不改。

## 3. Validator 增補（scripts/validate-chapters.js）

1. 新檢查（結構層）：narration/inner/dialogue 缺 `origin` → CH1 warning、CH2+ error（沿用 `EXEMPT_CHAPTERS` 機制）。
2. `origin:"source"` 但缺 jp 或 jp 為空 → error（所有章）。
3. `origin` 值不在 `["source","added"]` → error。

## 4. 底本轉換（reference/aozora/haguruma_original.txt）

一次性腳本 `scripts/build-aozora-text.js`（保留進 repo，可重跑）：

1. 讀 `reference/aozora/42377_34745_raw.html`（Shift_JIS → UTF-8；Node 用 `new TextDecoder("shift_jis")` 解 buffer）。
2. 取 `<div class="main_text">` 內容。
3. **Ruby 處理**：`<ruby><rb>X</rb>…<rt>Y</rt>…</ruby>` → 保留 `X`，丟棄注音 Y 與括號。
4. **外字（gaiji）處理**：`<img class="gaiji" alt="※（注記）">` → 依 alt 注記對照 Unicode 補回正字。已知本篇至少含：「噓」（U+5652）。腳本內建 `GAIJI_MAP = { <alt注記子字串>: <字> }`，遇到 map 沒有的注記 → 腳本報 error 列出注記全文（人工補 map，禁止靜默丟字）。
5. 其餘 tag 剝除；`<br />` → 換行；保留全形空白（段首縮排）與所有標點。
6. 章節標題「一」～「六」單獨成行，前後加 marker 行 `【第N章】`（N=1..6），供 fidelity 工具做章節切分。
7. 輸出檔尾附轉換 metadata 註解行（來源檔名、轉換日期、外字數）。

**驗收**（Opus）：與 raw HTML 抽 10 段對照（含 ruby 密集段、外字「噓」出現處、「レエン・コオト」「堯舜」「Ａll right」「赤光」）逐字一致；六個章 marker 齊全；無殘留 tag/entity。

## 5. Fidelity 驗證工具（scripts/validate-fidelity.js）

新 npm script：`"validate:fidelity": "node scripts/validate-fidelity.js"`。CI/驗收流程在 validate:chapters 之後跑。

**正規化定義**（雙方相同處理後再比對）：移除所有空白字元（半形/全形空白、換行、tab）。**其餘一字不動**——標點、踊り字、假名遣い、漢字表記全部保持。此定義容忍 block 切分跨原文換行，同時保證可見字符逐字一致。

**演算法**：
1. 載入底本 → 正規化 → 六章各自成一字串（依 §4 marker 切分）＋全文字串。
2. 逐章載入 chapter data（複用 validate-chapters.js 的載入方式）。動態 `text` 函式呼叫兩次取聯集：`{choicesMade:{}, notebook:[]}` 與 `{choicesMade: <該章所有 flags 全 true>, notebook: <該章所有 notebook entry>}`，兩次結果的 block 聯集（去重：JSON 序列化比對）。
3. 檢查規則：
   - **E1**：`origin:"source"` block 的正規化 jp 不是**該章**底本字串的子字串 → error（訊息附：場景 id、jp 前 30 字、在全文其他章找到時附「出現在第 M 章」提示錯章）。
   - **E2**：`origin:"source"` 而 jp 空 → error。
   - **E3**：`choice.sourceJp` 存在但非該章底本子字串 → error。
   - **W1**：`origin:"added"` 或 legacy block 的 jp 欄位長度 ≥ 8 且是底本子字串 → warning「應標記為 source」。
   - **W2**：legacy（缺 origin）block → CH1 warning 計數（彙總一行），CH2+ 由 validate-chapters 擋。
4. **覆蓋率報告**（informational，不影響 exit code）：每章以所有 source jp 在底本中的匹配區間聯集，計算「底本字符被收錄比例」，輸出如 `CH1 coverage: 41.2% (2103/5104 chars)`。這是「一字不漏」的進度儀表。
5. 任一 error → exit 1。輸出格式仿 validate-chapters.js 現有風格。

**單元測試**（tests/scripts/fidelity.test.js）：正規化函式、E1 錯章提示、W1 偵測、動態 text 雙態聯集、覆蓋率計算（用迷你 fixture 底本，不依賴真實底本）。

## 6. 文件同步

- `docs/chapter-data-schema.md`：TextBlock 段落改為 v2（§1 內容），Choice 加 sourceJp。
- `SCENES_FORMAT.md`：新增「原文與添補」章節（§1 寫作規則 + §2 顏色語意）。
- `CLAUDE.md`：驗收流程加第 4 步「npm run validate:fidelity 通過」；工作規則加「jp 欄位一律逐字取自 reference/aozora/haguruma_original.txt，禁止改寫」。

## 7. Batch F1 工作切分（工兵任務邊界）

| Task | 範圍 | 產出 |
|---|---|---|
| F1-a 底本轉換 | scripts/build-aozora-text.js + 執行產出 txt | §4 全部 |
| F1-b Schema+渲染 | SceneText / HistoryBlock / CSS / RightSidebar / validate-chapters 增補 / 文件同步 | §1 §2 §3 §6 |
| F1-c Fidelity 工具 | scripts/validate-fidelity.js + npm script + 測試 | §5 |

依賴：F1-a → F1-c（工具需要底本）。F1-b 與 F1-c 可並行。
共同紀律：不 commit、不 push（全部留 unstaged）；不改劇情文字（本批不動 chapter01/02.js 的文本內容）；跑過 `npm test`、`npm run build`、`npm run validate:chapters` 三綠再交付。
