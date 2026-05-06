# Chapter Data Schema

場景資料格式定義，適用於 `src/data/chapters/chapter*.js`。

## Chapter 物件

```js
{
  chapter:    Number,   // 章節序號（1-based）
  title:      String,   // 日文標題
  titleCn:    String,   // 中文標題
  startScene: String,   // 起始場景 ID
  sceneCount: Number,   // 場景總數（用於驗證）
  scenes:     Object,   // { [sceneId]: Scene }
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

> `choices` 和 `next` 互斥：有選項時 `next` 為 `null`，無選項時 `next` 指向下一場景。

## TextBlock

```js
{ type: "narration", content: String }
{ type: "inner",     content: String }           // 內心獨白
{ type: "dialogue",  speaker: String, jp: String, cn: String }
{ type: "system",    content: String }           // 章節標題等
{ type: "break" }                                // 視覺分隔
```

## Choice

```js
{
  text:     String,              // 選項顯示文字
  next:     String,              // 目標場景 ID
  flag:     String,              // 選擇後設定的 flag
  effects:  Effects | null,      // 選擇後的數值變動
  notebook: NotebookEntry | null,// 選擇後寫入的筆記
  unlock:   String | null,       // 解鎖的符號 key
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

## 驗證規則

- `sceneCount` 必須等於 `Object.keys(scenes).length`
- 每個場景的 `id` 必須等於其在 `scenes` 中的 key
- 所有 `next` 引用（場景級和選項級）必須指向存在的場景 ID
- `flags` 陣列應列出該場景所有選項的 `flag` 值
