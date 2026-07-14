# Chapter Data Schema

場景資料格式定義，適用於 `src/data/chapters/chapter*.js`。

## Chapter 物件

```js
{
  chapter:       Number,       // 章節序號（1-based）
  title:         String,       // 日文標題
  titleCn:       String,       // 中文標題
  startScene:    String,       // 起始場景 ID
  startLocation: String,       // 起始地點 ID（對應 locations[].id）
  sceneCount:    Number,       // 場景總數（用於驗證）
  locations:     Location[],   // 本章地點定義
  connections:   Connection[], // 本章連結定義
  scenes:        Object,       // { [sceneId]: Scene }
}
```

## Scene 物件

每個場景必須包含以下 8 個欄位：

| 欄位 | 型別 | 必填 | 說明 |
|------|------|------|------|
| `id` | `String` | ✓ | 場景 ID，必須與 key 一致 |
| `text` | `TextBlock[]` \| `(state) => TextBlock[]` | ✓ | 文本內容，靜態陣列或動態函式 |
| `choices` | `Choice[]` \| `null` | ✓ | 玩家選項；`null` 表示自動推進 |
| `next` | `String` \| `null` | ✓ | 自動推進目標；有 `choices` 時為 `null` |
| `effects` | `Effects` \| `null` | ✓ | 進入場景時的數值變動 |
| `flags` | `String[]` | ✓ | 此場景所有選項可能設定的 flag 列表 |
| `notebook` | `NotebookEntry` \| `null` | ✓ | 進入場景時寫入的筆記 |
| `links` | `Links` \| `null` | ✓ | 場景元資料（地點造訪、段落摺疊等） |
| `effectFn` | `(state) => Effects \| null` | — | 條件式動態效果（進場後、effects 之後觸發） |

> `choices` 和 `next` 互斥：有選項時 `next` 為 `null`，無選項時 `next` 指向下一場景。
> `effectFn` 為可選欄位，用於需根據當前狀態動態決定效果的場景（如累計計數判斷）。

## TextBlock（v2 — origin marking）

`narration` / `inner` / `dialogue` 三型新增必填欄位 `origin: "source" | "added"`，標記本段是否為芥川原文逐字收錄。`system` / `break` / `pause` 不變、不需 `origin`。

```js
// origin:"source" —— 原文敘述（地の文）：jp 必須逐字等於底本，cn 為譯文
{ type: "narration", origin: "source", jp: String, cn: String }
{ type: "inner",     origin: "source", jp: String, cn: String }

// origin:"added" —— 添補敘述（AI/編者新增的過場、擴寫、橋接句）：僅中文
{ type: "narration", origin: "added", content: String }
{ type: "inner",     origin: "added", content: String }

// dialogue：欄位不變，加 origin。origin:"source" 的 jp 必須逐字等於底本
{ type: "dialogue", origin: "source", speaker: String, speakerId: String | null, jp: String, cn: String }
{ type: "dialogue", origin: "added",  speaker: String, speakerId: String | null, jp: String | "", cn: String }
  // speaker:   畫面顯示名稱（如「T 君」「你」「???」）
  // speakerId: 程式辨識用 ID（立繪 key、角色資料卡 key；無角色時為 null）
  // jp / cn:   雙語劇本文本（日文原文 / 中文譯文）

{ type: "system",    content: String }           // 章節標題等，無 origin
{ type: "break" }                                // 視覺分隔，無 origin
{ type: "pause", duration: Number }              // 停頓（毫秒，預設 1000），無 origin
```

### 文中互動（action / forced，Batch F6）

天生是添補內容，`origin` 必為 `"added"`。SceneText 打字流程遇到這兩型會暫停推進、渲染互動元件，等玩家點擊（`onAction`/`onComplete`）才繼續後續 block——「點擊繼續」在互動元件未完成前不得跳過它。

```js
// action：讀者必須點擊才繼續，可選一行點擊後浮現的回應
{ type: "action", origin: "added", prompt: String,      // 指令文字（命令形，無主詞：「站起來。」）
  response: String|undefined,                            // 點擊後浮現的一行回應（可省略）
  flag: String|undefined, effects: Effects|undefined }   // 點擊時設 flag / 套 effects（走 ImpactToast）

// forced：連續強制步驟，逐一點擊；nerve 低時按鈕侵蝕＋齒輪覆蓋（ForcedSteps 既有視覺）
{ type: "forced", origin: "added", steps: String[] }
```

完成態（打字階段的「過去」區與歷史區一致）渲染 `✓ prompt`（＋response 縮排一行）／逐步 `✓ step`，樣式沿用 `.action-block--done` / `.forced-step--done`。

**向後相容（legacy）**：缺 `origin` 的 block（現行 CH1／CH2 全部）視為 legacy——渲染照舊（不套添補樣式），validator 對 CH1／CH2 發 warning，對 CH3+ 發 error。渲染器只在 `origin === "added"` 時套用添補樣式（見下方「添補樣式」）。

**寫作規則**（詳見 `SCENES_FORMAT.md`「原文與添補」章節）：
1. 主角的原文台詞若被做成選項，選中後的下一場景必須以 `origin:"source"` 的 dialogue block（speaker「你"僕"」）完整收錄該句原文。
2. `origin:"added"` 的 dialogue 原則上禁止；如過場確有必要，改用 added narration 轉述。
3. `jp` 欄位禁止表記現代化、禁止刪句、禁止句讀改動——一律逐字取自 `reference/aozora/haguruma_original.txt`。

### 添補樣式（渲染）

`origin:"added"` 的 narration/inner/dialogue 在畫面上（打字階段與歷史區一致）外層加 `block-added` class：淺蔥色文字（`--added-ink` / `--added-accent`）、左側色條、前綴「補」字小角標。顏色語意：**是否為原文優先於文類**（inner 原有的紫色斜體在 added 時被添補色覆蓋）。

## Choice

```js
{
  text:      String,                          // 選項顯示文字
  next:      String,                          // 目標場景 ID
  flag:      String | null,                   // 選擇後設定的 flag
  effects:   Effects | null,                  // 選擇後的數值變動
  notebook:  NotebookEntry | null,            // 選擇後寫入的筆記
  unlock:    String | null,                   // 解鎖的符號 key
  condition: ((state) => Boolean) | undefined,// 顯示條件（不滿足則隱藏）
  sourceJp:  String | undefined,              // 若選項文字改編自主角的原文台詞，此欄放原文逐字句（不套色，選項本身是 UI 添加物）
}
```

## Effects

統一的三軸數值變動格式。各軸皆為可選：

```js
{
  nerve:   { amount: Number, reason: String },  // 負數 = 消耗
  insight: { amount: Number, reason: String },  // 正數 = 獲得
  writing: { amount: Number, reason: String },  // 正數 = 獲得
}
```

原型中的 `nerveLoss: N` 對應 `nerve: { amount: -N, reason }`。

## NotebookEntry

```js
{
  key:    String,   // 筆記 ID（通常對應 SYMBOLS key）
  symbol: String,   // 符號類別（raincoat, gear, wing, book）
  desc:   String,   // 筆記描述文字
}
```

## Links

場景元資料，所有欄位皆為可選：

```js
{
  visit:   String,          // 造訪地點 ID（對應 LOCATIONS）
  fold:    String,          // 段落摺疊標題
  unlock:  String,          // 場景層級的符號解鎖
  showEnd: Boolean,         // 是否顯示章節結束畫面
}
```

## 動態文本

部分場景的 `text` 為函式，接收 `state` 參數：

```js
text: (state) => TextBlock[]
```

`state` 包含 `choicesMade`（flag 記錄）和 `notebook`（已收集筆記）。動態場景在第一章有 3 個：`auto_barber_2`、`street_gears`、`reflect_before_end`。

## Location

```js
{
  id:        String,              // 地點 ID
  label:     String,              // 顯示名稱
  sub:       String,              // 副標題
  x:         Number,              // 雷達圖 x 座標（0-100）
  y:         Number,              // 雷達圖 y 座標（0-100）
  shape:     "circle" | "diamond" | "rect" | "mountain", // 節點形狀
  symbolKey: String | undefined,  // 對應符號 key（與解鎖條件連動）
}
```

## Key Naming Convention

所有 identifier key 須遵守章節 namespace 規則：

- 章節內 key：`chNN.descriptive_name`（例如 `ch02.wife_accusation`）
- 全域 key：`global.descriptive_name`（例如 `global.total_nerve_lost`）
- 第一章 key 豁免（grandfathered，不需前綴）

適用欄位：`notebook.key`、`choice.flag`、`connection.id`、`location.id`、`location.symbolKey`、`links.unlock`、`choice.unlock`。

Validator 對 CH1 僅發出警告，對 CH2+ 違規視為 error。

## Connection

```js
{
  id:          String,                           // 連結 ID
  title:       String,                           // 連結標題（顯示用）
  requires:    String[],                         // 需要的符號 key 列表（notebook 匹配）
  insightGain: Number,                           // 形成時獲得的洞察值
  check:       ((state) => Boolean) | undefined, // 自訂判定函式（優先於 requires）
}
```

## 驗證規則

**Error（阻斷）：**
- `sceneCount` 必須等於 `Object.keys(scenes).length`
- 每個場景的 `id` 必須等於其在 `scenes` 中的 key
- 所有 `next` 引用（場景級和選項級）必須指向存在的場景 ID
- `startLocation` 必須存在於 `locations[].id` 中
- `links.visit` 必須存在於 `locations[].id` 中
- `connection.id` 不可重複
- CH2+ key 必須遵守 namespace 規則（見 Key Naming Convention）
- CH3+ 的 narration/inner/dialogue block 缺 `origin` 欄位
- `origin` 值不在 `["source", "added"]`
- `origin:"source"` 的 block 缺 `jp` 或 `jp` 為空字串（所有章節，含 CH1／CH2）
- `action` block 缺非空 `prompt`，或 `origin` 不為 `"added"`（所有章節）
- `forced` block 缺非空 `steps[]`（陣列為空或含空字串元素），或 `origin` 不為 `"added"`（所有章節）

**Warning（警告）：**
- `flags` 陣列應列出該場景所有選項的 `flag` 值（雙向檢查）
- `links.unlock` / `choice.unlock` 應存在於 `SYMBOL_GLYPHS`
- `locations.symbolKey` 應存在於 `SYMBOL_GLYPHS`
- `connections[].requires` 應對應有效的 notebook key 或 symbol key
- `location.shape` 應為支援的值（circle / diamond / rect / mountain）
- CH1 key 無 namespace 前綴（grandfathered）
- CH1／CH2 的 narration/inner/dialogue block 缺 `origin` 欄位（grandfathered——這兩章早於 origin 欄位訂定，待日後補標）
