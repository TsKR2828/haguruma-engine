# 第二章「復讐」 Chapter Spec

> 基於青空文庫原文的場景分割。文本欄位為原文段落對照，待劇本編輯器精修格式。
> Source: 芥川龍之介《歯車》二「復讐」
> 青空文庫 https://www.aozora.gr.jp/cards/000879/files/42377_34745.html
> 原著為公有領域（著作権消滅）

---

## 概要

| 項目 | 值 |
|------|------|
| chapter | 2 |
| title | 復讐 |
| titleCn | 復仇 |
| startScene | ch02_slipper |
| startLocation | ch02.hotel_morning |
| 預估場景數 | ~24 |
| 預估選擇點 | ~8 |
| 預估 connections | 4 |

## 主題

原文結構：「僕」在旅館醒來的翌朝 → 回想姊夫（放火嫌疑、自殺）→ 前往姊姊家 → 肖像畫的異象 → 精神病院 → 銀座書店的「復讐の神」。全章是一天之內的事，從早晨到黃昏。

核心意象：
- **拖鞋** — 希臘神話中只穿一隻涼鞋的王子（不祥前兆）
- **火** — 姊夫的放火嫌疑、火災保險、「僕」每次回東京都看到火
- **肖像畫的口髭** — 轢死後只剩口髭，畫上的口髭也模糊
- **黃色計程車** — 交通事故的預兆
- **Tantalus → Dante 地獄** — 語言的連鎖滑移（承接 CH1 的 Worm 連鎖）
- **復讐の神** — 書店偶然翻到的一行字，全章收束

---

## 與 CH1 的銜接

### carryOver state（D3）

- `notebook` — CH1 筆記全部帶入
- `choicesMade` — CH1 flag 全部帶入
- `connections` — CH1 已形成的連結
- `nerve` / `insight` / `writing` — 數值延續

### CH1 flag 依賴

| CH1 flag | CH2 效果 |
|----------|----------|
| `pondered_allright` | ch02_writing 場景：「All right」在腦中迴響的內心段落 |
| `traced_worm` | ch02_tantalus 場景：語言滑移有額外迴響（Worm→Tantalus 的模式重複） |
| `stared_coat` | ch02_portrait 場景：看肖像畫時想起旅館掛著的外套 |
| `observed_raincoat_1` / `checked_raincoat_2` | ch02_hotel_raincoat 場景：再見雨衣男人時的既視感強度 |

---

## 場景清單（基於原文段落）

### 第一段：旅館早晨（scenes 1–4）

原文段落：拖鞋→給仕→咖啡→執筆→回想

| ID | 類型 | 原文對應 | 選擇 |
|----|------|----------|------|
| `ch02_slipper` | auto | 旅館早晨。床邊拖鞋只有一隻。「希臘神話中只穿一隻涼鞋的王子」聯想。叫給仕找到——在浴室裡。 | — |
| `ch02_writing` | auto | 喝黑咖啡，試圖繼續寫小說。窗外是積雪的庭院，沈丁花的蓓蕾被煤煙弄髒了。筆動不了。想起妻子、孩子、姊夫。 | — |
| `ch02_fire_memory` | choice | 回想姊夫的背景：放火嫌疑、二倍火災保險、偽證罪。更不安的是——每次回東京都看到火。 | **C1** |
| `ch02_tolstoy` | auto | 放棄寫作，躺在床上讀 Tolstoy 的 Polikouchka。小說主人公的虛榮心和病態傾向——和「僕」一樣。 | — |

**C1：回想火的記憶**
- A)「追溯那些火的記憶——汽車裡看到的山火、常磐橋的火災。」→ +insight, notebook `ch02.fire_premonition`, flag `ch02.traced_fires`
- B)「努力把妄想推開，拿起筆。」→ flag `ch02.resisted_delusion`

#### 原文 text blocks（待劇本編輯器格式化）

**ch02_slipper:**
```
type: system  「第二章　復讐」
type: system  「——復仇——」
type: break
type: narration 「僕」在旅館房間裡醒來，大約早上八點。正要下床時發現拖鞋不可思議地只有一隻。
type: inner  這一兩年來，這種現象總是帶給「僕」恐懼和不安。不僅如此，還讓人想起希臘神話中只穿一隻涼鞋的王子。
type: narration 按了門鈴叫給仕來找。給仕一臉狐疑地在狹小的房間裡找了一圈。
type: dialogue  speaker:給仕 「ここにありました。このバスの部屋の中に」 cn:「找到了。在浴室裡面。」
type: dialogue  speaker:你 「どうして又そんな所に行っていたのだろう？」 cn:「怎麼會跑到那種地方去呢？」
type: dialogue  speaker:給仕 「さあ、鼠かも知れません」 cn:「嗯，也許是老鼠吧。」
```

**ch02_writing:**
```
type: narration 給仕退下後，喝了不加牛奶的咖啡，試圖繼續寫之前的小說。
type: narration 凝灰岩砌成的方窗面對著積雪的庭院。每次停下筆都會茫然地望著那片雪。
type: narration 雪在帶蓓蕾的沈丁花下，被都會的煤煙弄髒了。那是一幅讓人心痛的景象。
type: inner  一邊抽著卷菸，不知不覺停下了筆，想著各種事情。妻子的事、孩子們的事——尤其是姊夫的事。
```

**ch02_fire_memory:**
```
type: narration 姊夫自殺之前背負著放火嫌疑。這也是無可奈何的——他在房子燒掉之前投了房價兩倍的火災保險。而且還因為偽證罪正處於緩刑之中。
type: inner  但讓「僕」不安的，與其說是他的自殺，不如說是「僕」每次回東京都必定看到火在燃燒。
type: narration 從汽車裡看到山火、從自動車裡（那時妻子也在一起）看到常磐橋一帶的火災。
type: dialogue  speaker:你 「今年は家が火事になるかも知れないぜ」 cn:「今年家裡也許會失火呢。」
type: dialogue  speaker:妻 「そんな縁起の悪いことを。……それでも火事になったら大変ですね。保険は碌くについていないし、……」 cn:「別說這種不吉利的話。……不過真要是著火了可不得了。保險也沒怎麼保……」
```

**ch02_tolstoy:**
```
type: narration 寫不動。終於離開書桌，躺在床上讀起了 Tolstoy 的 Polikouchka。
type: inner  這部小說的主人公也是虛榮心作祟、帶有病態傾向——最後把紙幣丟進壁爐後自縊而死。不只他一個——他的妻子也把嬰兒拋進了浴盆裡。
type: narration 「僕」不由得把書放下。
```

### 第二段：姊姊家（scenes 5–12）

原文段落：出門→姊家的 barracks → 養子 → 姊的態度 → 對話 → 肖像畫

| ID | 類型 | 原文對應 | 選擇 |
|----|------|----------|------|
| `ch02_depart` | auto | 打電話通知後出門。前往姊姊如今住的 barracks（關東大震災後的簡易住宅）。 | — |
| `ch02_sister_house` | auto | 到達。姊姊不相變地冷靜。養子穿著金鈕扣的制服，大正十二年的火災讓這家人住進了 barracks。 | — |
| `ch02_adopted_son` | choice | 注意到養子——穿金鈕扣軍服，嘴唇薄，有「祈禱時的表情」。旁邊坐著一個有黑痣的男人，一直怯生生地看著「僕」。 | **C2** |
| `ch02_sister_talk` | auto (dynamic) | 姊姊的態度：她一直在嘲笑死去的丈夫。說他既不像「僕」逞強，也沒骨氣。 | — |
| `ch02_money_talk` | auto | 努力只談錢的事。「什麼都賣了吧」——打字機、畫。 | — |
| `ch02_portrait` | choice | 「順便把 N（姊夫）的肖像畫也賣掉嗎？」然後看到了那幅畫——口髭異常模糊。 | **C3** |
| `ch02_portrait_detail` | auto (dynamic) | 轢死後只剩口髭。但肖像畫上偏偏口髭最模糊。不是錯覺。 | — |
| `ch02_leave_sister` | auto | 決定在午飯前離開。姊姊問去哪——「青山的精神病院」。催眠藥名單：ヴェロナアル、ノイロナアル、トリオナアル、ヌマアル。 | — |

**C2：養子與旁邊的男人**
- A)「觀察那個有黑痣的男人。他是誰？為什麼一直看著你？」→ +insight, notebook `ch02.mole_man`, flag `ch02.noticed_mole_man`
- B)「把注意力放回姊姊身上。」→ flag `ch02.ignored_mole_man`

**C3：肖像畫**
- A)「從各種角度審視那幅畫——這不是光線的問題。」→ +insight, notebook `ch02.portrait_mustache`, flag `ch02.examined_portrait`
- B)「移開目光。不去想它。」→ flag `ch02.avoided_portrait`

#### 原文 text blocks

**ch02_portrait:**
```
type: dialogue  speaker:你 「次手にＮさんの肖像画も売るか？　しかしあれは……」 cn:「順便把 N 的肖像畫也賣掉嗎？不過那幅畫……」
type: narration 看著 barracks 牆上掛的、沒有框的 Conté 素描，覺得不能隨便開玩笑了。
type: narration 轢死的他因為被火車碾過，臉已經完全變成肉塊，據說只有口髭還殘留著。
type: inner  這件事本身當然令人毛骨悚然。但他的肖像畫——雖然每處都畫得很完整，唯獨口髭不知為何模糊不清。
```

**ch02_portrait_detail (dynamic):**
```
// if stared_coat (CH1):
type: inner  旅館那晚掛在牆上的外套——無頭的「僕」。現在是無髭的他。掛著的東西都像在顯示缺席。

type: dialogue  speaker:姊 「何をしているの？」 cn:「你在做什麼？」
type: dialogue  speaker:你 「何でもないよ。……唯あの肖像画は口のまわりだけ、……」 cn:「沒什麼。……只是那幅肖像畫嘴巴周圍——」
type: narration 姊姊回頭看了一眼，好像沒注意到什麼似地回答。
type: dialogue  speaker:姊 「髭だけ妙に薄いようでしょう」 cn:「只有鬍子奇怪地淡了對吧。」
type: inner  不是錯覺。
```

### 第三段：精神病院與街頭（scenes 13–19）

原文段落：餐廳→計程車→Tantalus→精神病院→青山齋場→旅館雨衣男

| ID | 類型 | 原文對應 | 選擇 |
|----|------|----------|------|
| `ch02_restaurant` | auto | 三十分鐘後。進大樓搭電梯到三樓。餐廳玻璃門推不開——「定休日」。透過玻璃看到桌上的蘋果和香蕉。 | — |
| `ch02_irritated` | auto | 走出大樓時兩個公司職員擦肩而過，其中一人說「イライラしてね」。站在路邊等計程車。只有黃色的——黃色計程車總帶來交通事故。 | — |
| `ch02_tantalus` | choice | 終於找到一輛綠色的。腦中的語言開始滑移：イライラする → tantalizing → Tantalus → Inferno。 | **C4** |
| `ch02_taxi_ride` | auto | 車裡。感到萬物都不過是掩蓋這可怕人生的彩色琺瑯。呼吸困難。打開車窗。心臟被擠壓的感覺不散。 | — |
| `ch02_lost` | auto | 到了神宮前，找不到精神病院的巷子。沿電車軌道來回兜了好幾趟，最終下車步行。 | — |
| `ch02_cemetery` | choice | 走錯路，來到了青山齋場。十年前夏目先生的告別式以來沒來過。十年前的「僕」雖然不幸福，但至少平和。 | **C5** |
| `ch02_hospital` | auto | 從精神病院出來。決定回旅館。 | — |

**C4：Tantalus 的語言滑移**
- A)「追蹤這條聯想鏈——Tantalus 就是隔著玻璃門看水果的自己。」→ +insight, notebook `ch02.tantalus_chain`, flag `ch02.traced_tantalus`
- B)「用力把 Dante 的地獄從腦中驅逐。」→ nerve −1, flag `ch02.fought_inferno`

**C5：青山齋場**
- A)「站在門前，感覺自己的一生也告了一個段落。」→ notebook `ch02.cemetery_decade`, flag `ch02.felt_closure`
- B)「不停留。直接找路去精神病院。」→ flag `ch02.passed_cemetery`

#### 原文 text blocks

**ch02_tantalus:**
```
type: inner  イライラする――tantalizing――Tantalus――Inferno……
type: inner  Tantalus 確實就是隔著玻璃門眺望水果的「僕」自己。
type: narration 一邊詛咒兩度浮上腦海的但丁地獄，一邊死死盯著司機的背影。
type: inner  漸漸覺得一切事物都是「一切」。政治、實業、藝術、科學——對這樣的「僕」來說，全都不過是掩蓋這可怕人生的雜色琺瑯罷了。
```

**ch02_cemetery:**
```
type: narration 不知什麼時候走錯了路，來到了青山齋場前。
type: inner  大約十年前的夏目先生告別式以來，連門前都沒經過。十年前的「僕」也不幸福。但至少是平和的。
type: narration 望著鋪了砂礫的門內，想起了「漱石山房」的芭蕉——
type: inner  不由得感到「僕」的一生也像是告了一個段落。而且不能不感到，某種東西在十年後把「僕」帶到了這座墓地前面。
```

### 第四段：雨衣再現・書店（scenes 20–24）

原文段落：旅館前的雨衣男→銀座→書店→「復讐の神」

| ID | 類型 | 原文對應 | 選擇 |
|----|------|----------|------|
| `ch02_hotel_raincoat` | auto (dynamic) | 回到旅館玄關。穿雨衣的男人正在跟穿綠色制服的車僮吵架。感到不吉，原路折返。 | — |
| `ch02_ginza` | choice | 到銀座通時已近黃昏。兩側的商店、熙攘的人群。尤其是那些像不知道「罪」這種東西一樣輕快走路的人們，令人不快。 | **C6** |
| `ch02_bookstore` | auto | 走進一家堆滿雜誌的書店。茫然地仰望書架。 | — |
| `ch02_greek_myth` | choice | 拿起一本黃色封面的《希臘神話》——給兒童寫的。偶然讀到的一行字讓「僕」崩潰。 | **C7** |
| `ch02_ending` | auto | 走出書店，走進人群之中。彎曲的脊背上，始終感覺有復仇之神在追蹤。 | — |

**C6：銀座的人群**
- A)「在薄暮與電燈混合的光線中一直向北走。」→ flag `ch02.walked_north`
- B)「想要回頭，但不知道該回到哪裡。」→ nerve −1, flag `ch02.nowhere_to_return`

**C7：「復讐の神」**
- A)「反覆讀那一行——『一番偉いツォイスの神でも復讐の神にはかないません。』」→ +insight, notebook `ch02.nemesis`, flag `ch02.read_nemesis`
- B)「闔上書，放回書架。」→ flag `ch02.closed_book`

#### 原文 text blocks

**ch02_hotel_raincoat (dynamic):**
```
type: narration 回到旅館玄關下車時，一個穿雨衣的男人正在跟什麼人吵架。
type: narration 不——那不是給仕，是穿綠色制服的車僮。
// if observed_raincoat_1 || checked_raincoat_2:
type: inner  又是雨衣。停車場——省線電車——旅館走廊——現在又是旅館玄關。
type: narration 感到進這間旅館有某種不吉，匆匆原路返回。
```

**ch02_greek_myth:**
```
type: narration 拿起一本黃色封面的《希臘神話》。像是為兒童寫的。
type: narration 但偶然讀到的一行——
type: pause  duration: 1500
type: dialogue  speaker:（書） jp:「一番偉いツォイスの神でも復讐の神にはかないません。……」 cn:「即使是最偉大的宙斯，也敵不過復仇之神……」
```

**ch02_ending:**
```
type: break
type: narration 走出書店，走進人群之中。
type: narration 不知何時彎曲的脊背上，始終感覺著——追蹤「僕」的復仇之神。
type: break
type: system  「第二章「復讐」 終」
```

---

## Connections

| ID | requires | title | subtitle | icon | insightGain | 備註 |
|----|----------|-------|----------|------|-------------|------|
| `ch02.fire_chain` | `ch02.fire_premonition` + `ch02.portrait_mustache` | 火と肉塊 | 保険・放火・轢死 | ✦ | 2 | 火的預感→死亡的細節 |
| `ch02.language_slip` | `ch02.tantalus_chain` + (CH1 `book_worm`) | 言葉の連鎖 | Worm→Tantalus→Inferno | ◈ | 1 | 跨章：CH1 的 Worm 語言滑移 |
| `ch02.nemesis_loop` | `ch02.nemesis` + `ch02.cemetery_decade` | 復讐の神 | 十年後の再会 | ◉ | 2 | 齋場+復仇之神=命運的閉環 |
| `ch02.raincoat_persist` | (CH1 `raincoat_death`) + `ch02.newspaper_raincoat` | 雨衣は消えない | 死してなお | ◇ | 1 | 跨章：CH1 雨衣之死的延續 |

> 注意：`ch02.newspaper_raincoat` 在 C1A 觸發。若玩家 C1B 跳過，此 connection 不形成——需要另一條路徑。
> 候補：ch02_hotel_raincoat 場景固定給 notebook `ch02.raincoat_hotel_2`，作為 `ch02.raincoat_persist` 的替代 requires。

---

## Locations

| ID | label | sub | x | y | shape | symbolKey |
|----|-------|-----|---|---|-------|-----------|
| `ch02.hotel_morning` | ホテル | 翌朝 | 50 | 50 | rect | — |
| `ch02.sister_barracks` | 姊の家 | バラック | 140 | 150 | rect | `ch02.portrait_mustache` |
| `ch02.aoyama` | 青山 | 精神病院 | 220 | 240 | circle | `ch02.cemetery_decade` |
| `ch02.ginza` | 銀座通 | 黄昏 | 280 | 310 | diamond | `ch02.nemesis` |

---

## Nerve / Insight / Writing 曲線

CH1 結束時典型範圍：nerve 5–8, insight 2–7, writing 2–4

### CH2 設計

| 軸 | 全章範圍 | 設計理由 |
|----|----------|----------|
| nerve | −2 ~ −3 | CH2 的恐怖是緩慢心理壓迫，不是突發事件。nerve 下降點少但每次都有重量。 |
| insight | +3 ~ +7 | 觀察與理解是本章核心。connections 額外 +1~+6。 |
| writing | +0 | CH2 主角完全在行動/觀察，沒有書寫的場景（開場寫不出來就放棄了）。 |

### 逐場景數值

| 場景 | nerve | insight | writing | 條件 |
|------|-------|---------|---------|------|
| ch02_fire_memory C1A | — | +1 | — | 選擇追溯 |
| ch02_adopted_son C2A | — | +1 | — | 選擇觀察 |
| ch02_portrait C3A | — | +1 | — | 選擇審視 |
| ch02_tantalus C4A | — | +1 | — | 選擇追蹤 |
| ch02_tantalus C4B | −1 | — | — | 選擇抵抗 |
| ch02_cemetery C5A | — | — | — | 筆記但無數值 |
| ch02_ginza C6B | −1 | — | — | 無處可回 |
| ch02_greek_myth C7A | — | +1 | — | 選擇反覆讀 |
| ch02_ending | — | +1 | — | 固定 |
| connections | — | +1~+6 | — | 視形成數量 |

---

## Notebook 新增條目

| key | symbol | desc（待精修） | 觸發 |
|-----|--------|---------------|------|
| `ch02.fire_premonition` | gear | 每次回東京都看到火——放火嫌疑、二倍保險 | C1A |
| `ch02.mole_man` | book | 有黑痣的男人一直盯著「僕」看 | C2A |
| `ch02.portrait_mustache` | gear | 肖像畫上口髭模糊——轢死後只剩口髭 | C3A |
| `ch02.tantalus_chain` | book | Tantalus 就是隔著玻璃門看水果的自己 | C4A |
| `ch02.cemetery_decade` | wing | 青山齋場——十年後的再訪，一生的段落 | C5A |
| `ch02.nemesis` | book | 「即使宙斯也敵不過復仇之神」 | C7A |
| `ch02.raincoat_hotel_2` | raincoat | 旅館玄關——穿雨衣的男人與車僮爭吵 | 固定（ch02_hotel_raincoat） |

### Symbols 更新

需在 `src/data/symbols.js` 的 `SYMBOL_GLYPHS` 新增：

```js
"ch02.fire_premonition":   { glyph: "⚙️", label: "火・予感" },
"ch02.mole_man":           { glyph: "📖", label: "黒子の男" },
"ch02.portrait_mustache":  { glyph: "⚙️", label: "肖像画・口髭" },
"ch02.tantalus_chain":     { glyph: "📖", label: "Tantalus・連鎖" },
"ch02.cemetery_decade":    { glyph: "🪽", label: "青山・十年" },
"ch02.nemesis":            { glyph: "📖", label: "復讐の神" },
"ch02.raincoat_hotel_2":   { glyph: "🧥", label: "雨衣・旅館再会" },
```

---

## Portraits

| speakerId | 角色 | 首次出現 | 備註 |
|-----------|------|----------|------|
| `ch02_bellboy` | 給仕 | ch02_slipper | 新增（僅對話兩句，可省略立繪） |
| `ch02_sister` | 姊姊 | ch02_sister_house | **新增** |
| `ch02_wife` | 妻 | ch02_fire_memory（回想對話） | 可省略（回想中的對話） |
| `protagonist` | 主角 | 對話場景 | 無立繪（CH1 慣例） |

---

## 待劇本編輯器處理

| 欄位 | 說明 |
|------|------|
| `text[]` 的精確分段 | 上面的 text blocks 是段落對照，需要逐句校對原文並分割成 TextBlock 陣列 |
| `dialogue.jp` | 需要從原文精確提取，含振假名標記（ruby） |
| `dialogue.cn` | 中文翻譯需要月月撰寫 |
| `dialogue.speakerId` | 精確角色 ID |
| `links.fold` | 段落摺疊標題文字 |
| `effectFn` | 動態效果的具體條件實作 |
| `condition` | 條件選項的 state 判斷函式 |

---

## 開放問題

1. **養子旁邊的黑痣男人**——原文中沒有後續交代，是否值得一個 notebook 條目？（建議：保留，增加不安感）
2. **精神病院的場景**——原文只有「門を出た後」一句，病院內部完全省略。是否加入推測性場景？（建議：不加，忠於原文）
3. **催眠藥名單**——ヴェロナアル、ノイロナアル、トリオナアル、ヌマアル。是否作為 system text 或特殊排版？
4. **ch02_hotel_raincoat 的 notebook**——建議設為固定觸發（不需選擇），因為原文中「僕」是不由自主地注意到。
5. **CH2→CH3 銜接**——CH3「夜」的起始情境？「僕」回到旅館後的那個夜晚。
