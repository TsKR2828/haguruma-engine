# 歯車引擎 — 場景資料寫作指南

> 給寫劇本的人看的文件。你不需要寫任何 React 元件，只需要按格式寫場景資料。  
> 引擎會自動處理渲染、打字機效果、選項、存檔。

---

## 一、場景檔案位置

每章一個檔案：

```
src/data/chapters/
  ch1_raincoat.js      第一章「レエン・コオト」
  ch2_revenge.js       第二章「復讐」
  ch3_night.js         第三章「夜」
  ...
```

每個檔案 export 一個 SCENES 物件片段：

```javascript
// ch1_raincoat.js
export const CH1_SCENES = {
  ch1_s01_prologue: { ... },
  ch1_s02_auto_barber: { ... },
  ...
};
```

引擎在啟動時合併所有章節：

```javascript
const ALL_SCENES = {
  ...CH1_SCENES,
  ...CH2_SCENES,
  ...
};
```

---

## 二、場景 ID 命名

```
ch{章號}_s{節號}_{類型}_{描述}
```

| 片段 | 說明 | 範例 |
|------|------|------|
| `ch1` | 章節號 | ch1, ch2, ch11 |
| `s01` | 節號（兩位數，01-99） | s01, s12, s99 |
| 類型 | `auto_` = 自動推進，無前綴 = 需要選擇 | auto_barber, station |
| 描述 | 蛇底線分隔的簡短描述 | barber_response, raincoat_gone |

範例：
```
ch1_s01_prologue              序
ch1_s02_auto_barber           理髮店主人（自動推進）
ch1_s03_barber_response       回應選擇
ch1_s04_auto_barber_2         理髮店主人續（自動）
ch1_s05_station               停車場（選擇）
ch1_s05a_station_observe      分支：觀察雨衣男人
ch1_s06_auto_cafe             咖啡廳（自動）
```

分支場景用 `a/b/c` 後綴區分，但它們最終必須匯合回主線。

---

## 三、文本塊（TextBlock）類型

> narration / inner / dialogue 三型都需要 `origin: "source" | "added"` 欄位——見「八、原文與添補」。以下範例分別示範兩種寫法。

### 3.1 narration — 敘述

主要的敘事文字。灰白色，正常字體。

原文逐字收錄（`origin:"source"`，日文一行、中文一行）：

```javascript
{ type: "narration", origin: "source", jp: "冬の日である。", cn: "冬日。" }
```

添補的過場敘述（`origin:"added"`，僅中文，套添補色＋「補」角標）：

```javascript
{ type: "narration", origin: "added", content: "你提著一只皮箱，為了出席某位友人的結婚披露宴，從避暑地叫了一輛汽車趕往東海道的某個停車場。" }
```

### 3.2 inner — 內心獨白

主角的思緒。紫色，斜體（`origin:"added"` 時斜體覆蓋為添補色）。

```javascript
{ type: "inner", origin: "added", content: "你想起了剛才聽到的幽靈故事。不過只是苦笑了一下。" }
```

原文中的內心獨白同樣可以是 `origin:"source"`（日文一行、中文一行，寫法同 narration）。

### 3.3 dialogue — 對話

日中雙語。暖金色。上面是日文原文，下面是中文翻譯。原文台詞用 `origin:"source"`：

```javascript
{
  type: "dialogue",
  origin: "source",
  speaker: "理髮店主人",
  jp: "「妙なこともありますね。××さんの屋敷には昼間でも幽霊が出るって云うんですが。」",
  cn: "「也有奇怪的事呢。聽說 ×× 先生的宅邸，白天也有幽靈出沒。」",
}
```

如果某句只有中文（例如主角自言自語的翻譯），可以省略 `jp`：

```javascript
{ type: "dialogue", origin: "source", speaker: "你", jp: "", cn: "\"All right.\"" }
```

`origin:"added"` 的 dialogue 原則上禁止使用——見「八、原文與添補」寫作規則。

### 3.4 system — 系統提示

綠色邊線，小字。用於手帖新增、數值變動等提示。

```javascript
{ type: "system", content: "🧥 手帖新增：停車場的雨衣男人" }
{ type: "system", content: "神經 -1" }
{ type: "system", content: "洞察 +1" }
{ type: "system", content: "連結：🧥 × 3 ——方向未明，但迴路已形成。洞察 +1" }
```

### 3.5 break — 空行

場景內的段落分隔。

```javascript
{ type: "break" }
```

### 3.6 pause — 靜默

停頓。畫面上什麼都不顯示，等待指定毫秒數後自動繼續。

```javascript
{ type: "pause", duration: 2000 }  // 停頓 2 秒
```

---

## 四、場景結構

### 4.1 自動推進場景（最簡單）

文本播完後自動跳到 `next`。

```javascript
ch1_s01_prologue: {
  text: [
    { type: "system", content: "第一章　レエン・コオト" },
    { type: "system", content: "——雨衣——" },
    { type: "break" },
    { type: "narration", content: "冬日。你提著一只皮箱..." },
    { type: "narration", content: "道路兩旁大多只長著松樹。" },
  ],
  next: "ch1_s02_auto_barber",
}
```

### 4.2 選擇場景

文本播完後顯示選項按鈕。

```javascript
ch1_s03_barber_response: {
  text: [
    { type: "dialogue", speaker: "理髮店主人", jp: "「...」", cn: "「...」" },
  ],
  choices: [
    {
      text: "「下雨天出來——是來淋雨的吧？」",     // 按鈕文字
      next: "ch1_s04_auto_barber_2",               // 跳轉目標
      effect: { writing: 1 },                       // 數值效果
      flag: "joke_response",                         // 旗標
    },
    {
      text: "沉默地望向窗外的松林。",
      next: "ch1_s04_auto_barber_2",
      effect: {},
      flag: "silent_response",
    },
  ],
}
```

### 4.3 帶手帖記錄的選擇

```javascript
{
  text: "仔細觀察那個穿雨衣的男人。",
  next: "ch1_s05a_station_observe",
  effect: {},
  flag: "observed_raincoat_1",
  notebook: {
    key: "raincoat_station",             // 唯一 ID
    symbol: "raincoat",                   // 對應 SYMBOLS 的 key
    desc: "停車場候車室——穿雨衣的男人，茫然望向窗外",
  },
},
```

### 4.4 動態文本

當場景文本需要根據之前的選擇變化時，`text` 可以是一個函式：

```javascript
ch1_s04_auto_barber_2: {
  text: (state) => {
    const base = [];
    if (state.choicesMade.joke_response) {
      base.push({
        type: "dialogue",
        speaker: "理髮店主人",
        jp: "「御常談で。...」",
        cn: "「您說笑了。...」",
      });
    } else {
      base.push({ type: "narration", content: "理髮店主人見你沉默，又自顧自地說了下去。" });
    }
    return base;
  },
  next: "ch1_s05_auto_station",
}
```

### 4.5 動態數值效果

當效果需要根據狀態動態計算時：

```javascript
ch1_raincoat_link: {
  text: (state) => {
    const count = state.notebook.filter(n => n.symbol === "raincoat").length;
    if (count >= 2) {
      return [
        { type: "inner", content: "停車場。省線電車。旅館走廊。三次..." },
        { type: "system", content: "連結：🧥 × 3 ——洞察 +1" },
      ];
    }
    return [
      { type: "inner", content: "雨衣。你想到了理髮店主人的故事。但記憶太少。" },
      { type: "system", content: "空轉：手帖中的雨衣記錄不足。" },
    ];
  },
  effectFn: (state) => {
    const count = state.notebook.filter(n => n.symbol === "raincoat").length;
    return count >= 2 ? { insight: 1 } : {};
  },
  next: "ch1_s20_auto_allright_corridor",
}
```

### 4.6 場景級手帖（不需要選擇即記錄）

```javascript
ch1_s19_auto_raincoat_3: {
  text: [
    { type: "narration", content: "因為你身旁的長椅靠背上，一件雨衣正懶洋洋地搭著。" },
    { type: "inner", content: "而且現在是嚴冬。" },
    { type: "system", content: "🧥 手帖新增：旅館長椅上的雨衣" },
  ],
  notebook: {
    key: "raincoat_hotel",
    symbol: "raincoat",
    desc: "旅館走廊——嚴冬中，一件雨衣搭在長椅靠背上",
  },
  choices: [ ... ],
}
```

### 4.7 條件選項（新增）

某些選項只在特定條件下顯示：

```javascript
choices: [
  {
    text: "嘗試連結：到目前為止你已經三次遇見雨衣了。",
    next: "ch1_raincoat_link",
    flag: "attempted_link",
    condition: (state) => state.notebook.filter(n => n.symbol === "raincoat").length >= 2,
  },
  {
    text: "不去想它。回房間。",
    next: "ch1_s20_auto_allright_corridor",
    flag: "ignored_link",
  },
],
```

不滿足 condition 的選項不會顯示。

---

## 五、空場景（橋接用）

有時需要一個空場景來統一匯合分支：

```javascript
ch1_s06_cafe: {
  text: [],
  next: "ch1_s06_auto_cafe",
}
```

---

## 六、結束場景

`next: null` 表示遊戲結束（或章節結束）：

```javascript
ch1_ending: {
  text: [
    { type: "system", content: "第一章「レエン・コオト」 終" },
  ],
  notebook: { key: "wing_corridor", symbol: "wing", desc: "旅館深夜——門外傳來翅膀的聲音" },
  next: null,
}
```

---

## 七、寫作注意事項

### 7.1 文體

- 第二人稱「你」
- 現在式為主
- 日文原文從青空文庫校對
- 中文翻譯保持芥川的簡潔：短句、少形容詞、精準

### 7.2 system 提示格式

```
手帖新增：   🧥 手帖新增：{描述}
數值變動：   神經 -1 / 洞察 +1 / 執筆 +1
連結成功：   連結：{符號} × {數量} ——{描述}。洞察 +1
連結失敗：   空轉：手帖中的{符號名}記錄不足。
章節標題：   第{N}章　{日文標題}
章節副標：   ——{中文標題}——
章節結束：   第{N}章「{日文標題}」 終
```

### 7.3 選擇設計原則

1. **不要有明顯的「正確答案」**——兩個選項都合理
2. **代價透明**——如果會扣神經，讓玩家有預感（但不直接說）
3. **觀察 vs 忽略**——歯車的核心選擇模式：你選擇看見，就要承受看見的代價
4. **匯合回主線**——分支不要太長，3 個場景內必須回到主線
5. **flag 命名清晰**——`observed_raincoat_1`、`joke_response`、`traced_worm`

---

## 八、原文與添補

規格定案於 `docs/origin-marking-spec.md`（施工地圖，遇疑義以該檔為準）。核心動機：專案要求「原文一字不漏＋新增內容以顏色區分」，`origin` 欄位就是這個機制。

- **原文（source）**：芥川《歯車》青空文庫底本的逐字文本。基準檔：`reference/aozora/haguruma_original.txt`。
- **添補（added）**：任何非原文內容——過場敘述、擴寫的內心獨白、橋接句、互動指令文本。
- **譯文（cn）**：原文的中文翻譯。譯文「代表」原文，不算添補；添補內容的中文就是添補。

### 8.1 寫作規則

1. **選項改編自原文台詞時，原文不得因互動化而消失**：主角的原文台詞若被做成 `choice.text`（可搭配 `choice.sourceJp` 保留原句），選中後的下一場景**必須**以 `origin:"source"` 的 dialogue block（speaker「你"僕"」）完整收錄該句原文。
2. **不替芥川筆下人物編台詞**：`origin:"added"` 的 dialogue 原則上禁止；如過場確有必要銜接對話語境，改用 `origin:"added"` 的 narration 轉述，不要虛構人物的原創台詞。
3. **`jp` 欄位禁止改寫**：一律逐字取自 `reference/aozora/haguruma_original.txt`——禁止表記現代化（例：ハルビン≠ハルピン、雨のふる日≠雨の降る日）、禁止刪句、禁止句讀改動。`origin:"source"` 但 `jp` 缺失或為空字串，validator 視為 error。

### 8.2 顏色語意

| 狀態 | 樣式 |
|------|------|
| `origin:"source"`（原文） | 依文類原本的顏色（narration 灰白／inner 紫斜體／dialogue 暖金），日文一行在上、中文一行在下，無 speaker 時省略標籤 |
| `origin:"added"`（添補） | 外層加 `block-added`：淺蔥色文字（`--added-ink` / `--added-accent`）、左側 2px 色條、內容前綴「補」字小角標（`::before`）。**顏色以「是否為原文」優先於「文類」**——inner 原有的紫色斜體在 added 時被添補色覆蓋 |
| 缺 `origin`（legacy，CH1／CH2） | 渲染照舊，不套添補樣式；validator 發 warning，待日後補標 |

打字階段（`SceneText`）與歷史區（`HagurumaEngine` 的 `HistoryBlock`）套用同一份判斷邏輯（`src/utils/textBlock.js` + `src/components/TextBlockBody.jsx`），同一個 block 進歷史區後外觀不變。

畫面右側資訊欄底部有固定圖例：`補＝非原文的添補內容`，供玩家對照色彩含意。

---

*// end of format guide*
