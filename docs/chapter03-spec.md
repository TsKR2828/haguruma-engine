# 第三章「夜」 Chapter Spec

> 基於青空文庫原文的場景分割。文本欄位為原文段落對照，待劇本編輯器精修格式。
> Source: 芥川龍之介《歯車》三「夜」
> 青空文庫 https://www.aozora.gr.jp/cards/000879/files/42377_34745.html
> 原著為公有領域（著作権消滅）
>
> **場景切分以 `docs/ch3-source-map.md` 為準**（本檔僅供 cn 引文參考；引文抽查全真，
> 但場景 ID、選擇分支、connections、locations 已在該施工圖重新切分，與本檔不完全一致）。
> `src/data/chapters/chapter03.js` 依施工圖實作，2026-07-12 起以施工圖為唯一來源。

---

## 概要

| 項目 | 值 |
|------|------|
| chapter | 3 |
| title | 夜 |
| titleCn | 夜 |
| startScene | ch03_maruzen |
| startLocation | ch03.maruzen |
| 預估場景數 | ~18 |
| 預估選擇點 | ~7 |
| 預估 connections | 4 |

## 主題

原文結構：「僕」在丸善書店裡翻書 → 每本書都刺痛他 → 旅館大廳遇彫刻家 → 房間中鏡子與女人的談話 → 讀《暗夜行路》而落淚 → 齒輪再現 → 惡夢（裸體的復讐之神）→ 凌晨三點半的大廳。全章是一個晚上的事，從黃昏到翌晨。

核心意象：
- **書中之針** — 每本書都藏著刺向「僕」的針。Strindberg《傳說》、精神病者畫集中的齒輪、Madame Bovary 中的自己
- **寿陵余子** — 《韓非子》的青年：忘了自己的步法，蛇行匍匐歸鄉。筆名即預言
- **聖喬治與屠龍** — 海報中的騎士臉像「僕」的敵人；「屠竜の技」的無用
- **鏡** — 彫刻家背後的鏡子，反射後姿；耳下的黃色膏藥
- **《暗夜行路》** — 志賀直哉的主角精神鬥爭令「僕」落淚，淚水短暫帶來平和
- **復讐の神（夢中）** — 列車寢台上木乃伊般的裸體女人＝「或狂人の娘」
- **凌晨三點半** — 綠衣的美國女人在大廳讀書，「僕」像等死的老人等待天明

---

## 與 CH2 的銜接

### carryOver state（D3）

- `notebook` — CH1 + CH2 筆記全部帶入
- `choicesMade` — CH1 + CH2 flag 全部帶入
- `connections` — 已形成的連結
- `nerve` / `insight` / `writing` — 數值延續

### 前章 flag 依賴

| 前章 flag | CH3 效果 |
|----------|----------|
| `ch02.read_nemesis` | ch03_maruzen：翻到《希臘神話》黃色封面時，想起昨天在銀座讀到的那行字 |
| `ch02.traced_tantalus` | ch03_religion：「寿陵余子」的聯想額外迴響——又一條語言滑移鏈 |
| `ch02.examined_portrait` | ch03_sculptor_mirror：鏡中看到彫刻家的背影時，想起姊夫肖像畫的口髭 |

---

## 場景清單（基於原文段落）

### 第一段：丸善書店（scenes 1–6）

原文段落：Strindberg《傳說》→ 精神病者畫集 → Madame Bovary → 宗教書 → 寿陵余子 → 聖喬治海報

| ID | 類型 | 原文對應 | 選擇 |
|----|------|----------|------|
| `ch03_maruzen` | auto | 丸善二樓書棚。找到 Strindberg《傳說》——黃色封面，內容和「僕」的經驗大同小異。 | — |
| `ch03_books_needle` | choice | 隨手抽出一本厚書——精神病者畫集，插畫中有長著人類五官的齒輪。接著翻 Madame Bovary——「僕」就是中產階級的 Monsieur Bovary。每本書都藏著針。 | **C1** |
| `ch03_religion` | auto | 走到「宗教」書棚前。綠色封面的書，目次寫著「恐しい四つの敵——疑惑、恐怖、驕慢、官能的欲望」。這些「敵」不過是感受性和理智的別名。 | — |
| `ch03_juryoyoshi` | choice | 想起筆名「寿陵余子」——《韓非子》中忘了自己步法、蛇行匍匐歸鄉的青年。今天的「僕」在誰眼裡都是「寿陵余子」。 | **C2** |
| `ch03_poster` | auto | 走進海報展覽室。一張海報畫著聖喬治刺殺有翼之龍。騎士的盔下露出的臉——像「僕」的敵人之一。想起《韓非子》「屠竜の技」。 | — |
| `ch03_lobby` | auto | 穿過展覽室到大廳。坐在椅子上構思長篇計畫——從推古到明治、三十餘篇短篇串成的編年體長篇。想起皇宮前的銅像。「嘘！」——從過去滑回現代。 | — |

**C1：書中之針**
- A)「忍住反感繼續翻——接下來打開的每一本都一樣。」→ +insight, notebook `ch03.needle_books`, flag `ch03.endured_needles`
- B)「把書推回書棚，離開這個區域。」→ flag `ch03.fled_books`

**C2：寿陵余子**
- A)「正視這個筆名——地獄之前就已經在用了。」→ +insight, notebook `ch03.juryoyoshi`, flag `ch03.faced_penname`
- B)「努力驅逐妄想，走向展覽室。」→ flag `ch03.dismissed_penname`

#### 原文 text blocks

**ch03_maruzen:**
```
type: system  「第三章　夜」
type: system  「——夜——」
type: break
type: narration 丸善二樓的書棚上找到了 Strindberg 的《傳說》，翻了兩三頁。內容與「僕」自身的經驗大同小異。而且是黃色封面。
type: narration 把《傳說》放回書棚，這次幾乎是隨手抽出一本厚書。但這本書的插畫裡也畫著和人類一樣有眼有鼻的齒輪。（那是某個德國人收集的精神病者畫集。）
```

**ch03_books_needle:**
```
type: inner  不知不覺在憂鬱中生出了反抗精神，像走投無路的賭徒一樣不斷翻開各種書。但不知為何，每本書都必定在文字或插畫中藏著多少的針。
type: narration 連讀了無數遍的《Madame Bovary》也不例外。
type: inner  畢竟「僕」自己也不過是一個中產階級的 Monsieur Bovary。……
```

**ch03_religion:**
```
type: narration 傍晚的丸善二樓幾乎沒有別的客人了。在電燈光中穿行於書棚之間。
type: narration 在掛著「宗教」牌子的書棚前停下腳步，翻開一本綠色封面的書。
type: inner  目次的某一章寫著「恐しい四つの敵——疑惑、恐怖、驕慢、官能的欲望」。
type: inner  一看到這些話，反抗精神更加強烈。那些被稱為「敵」的東西，至少對「僕」來說，不過是感受性和理智的別名罷了。
```

**ch03_juryoyoshi:**
```
type: inner  手裡拿著這本書，忽然想起了曾用作筆名的「寿陵余子」。
type: inner  那是《韓非子》中的青年——還沒學會邯鄲的步法，就忘了壽陵的步法，最後蛇行匍匐而歸。
type: inner  今天的「僕」在誰眼裡都是「寿陵余子」無疑。但還沒墮入地獄的時候，「僕」就已經在用這個筆名了——
```

**ch03_poster:**
```
type: narration 努力驅散妄想，走進正對面的海報展覽室。
type: narration 一張海報裡畫著一個像聖喬治的騎士，正在刺殺一條有翼的龍。那騎士在盔下露出的半張臉——像「僕」的敵人之一。
type: inner  又想起了《韓非子》中「屠竜之技」的故事。
```

**ch03_lobby:**
```
type: narration 穿過展覽室來到大廳，坐在椅子上。
type: inner  開始構思一直計畫中的長篇——從推古到明治、各時代的民為主角、大約三十餘篇短篇按時代順序串成。
type: narration 看著火星飛舞，忽然想起了皇宮前的某座銅像。
type: inner  那銅像穿著甲冑，忠義之心的化身般高踞馬上。但他的敵人——
type: dialogue  speaker:（內心） jp:「嘘！」 cn:「騙人！」
type: inner  又從遙遠的過去滑落到了眼前的現代。
```

### 第二段：彫刻家（scenes 7–11）

原文段落：彫刻家出現→握手→房間對話→女人的話→鏡中的膏藥

| ID | 類型 | 原文對應 | 選擇 |
|----|------|----------|------|
| `ch03_sculptor_arrive` | auto | 恰好來了一位前輩彫刻家。天鵞絨服、山羊鬚。「僕」握住他伸出的手——爬蟲類般濕冷的皮膚。 | — |
| `ch03_sculptor_room` | auto | 一起回到「僕」的房間。彫刻家背對鏡子坐下，開始說各種事情——大部分是女人的話。罪惡感加深憂鬱。 | — |
| `ch03_sculptor_lips` | choice | 「僕」一時成為清教徒，嘲笑那些女人。「S 子的嘴唇——那是因為無數次的接吻……」話說一半噤口，在鏡中看到彫刻家的背影——耳下貼著黃色膏藥。 | **C3** |
| `ch03_sculptor_detective` | auto | 彫刻家微笑點頭。「僕」感到他內心一直在用偵探般的眼神觀察自己。女人的話題無法中斷。 | — |
| `ch03_sculptor_leaves` | auto | 他終於離開了。 | — |

**C3：鏡中的膏藥**
- A)「盯著鏡中的黃色膏藥——他在隱藏什麼？」→ +insight, notebook `ch03.mirror_plaster`, flag `ch03.noticed_plaster`
- B)「把話題轉回去，不去想鏡子裡的東西。」→ flag `ch03.ignored_mirror`

#### 原文 text blocks

**ch03_sculptor_arrive:**
```
type: narration 幸好這時候來了一位前輩的彫刻家。他一如既往穿著天鵞絨的衣服，翹起短短的山羊鬚。
type: narration 「僕」從椅子上站起來，握住他伸出的手。（那不是「僕」的習慣——是在巴黎和柏林度過半生的他的習慣。）
type: inner  但他的手不可思議地濕冷，像爬蟲類的皮膚。
```

**ch03_sculptor_room:**
```
type: dialogue  speaker:彫刻家 「君はここに泊っているのですか？」 cn:「你住在這裡嗎？」
type: dialogue  speaker:你 「ええ、……」 cn:「嗯……」
type: dialogue  speaker:彫刻家 「仕事をしに？」 cn:「來工作的？」
type: dialogue  speaker:你 「ええ、仕事もしているのです」 cn:「嗯，也在工作。」
type: narration 他直直地盯著「僕」的臉。「僕」從他的眼睛裡感到一種接近偵探的表情。
type: dialogue  speaker:你 「どうです、僕の部屋へ話しに来ては？」 cn:「怎麼樣，來我房間聊聊？」
type: inner  （這種明明缺乏勇氣卻忽然擺出挑戰姿態，是「僕」的惡癖之一。）
```

**ch03_sculptor_lips:**
```
type: narration 他背對鏡子坐下，開始說各種事情。各種事情？——但大部分是女人的話。
type: inner  「僕」是因犯了罪而墮入地獄的人。正因如此，惡德的話題愈加令人憂鬱。
type: dialogue  speaker:你 「Ｓ子さんの唇を見給え。あれは何人もの接吻の為に……」 cn:「你看 S 子的嘴唇。那是因為無數次的接吻——」
type: narration 忽然噤了口，在鏡中盯著他的背影。他的耳下正貼著一塊黃色的膏藥。
type: dialogue  speaker:彫刻家 「何人もの接吻の為に？」 cn:「無數次的接吻？」
type: dialogue  speaker:你 「そんな人のように思いますがね」 cn:「我覺得她是那樣的人吧。」
type: narration 他微笑著點了點頭。
```

### 第三段：暗夜行路・齒輪・惡夢（scenes 12–18）

原文段落：讀書落淚→齒輪再現→頭痛→夢→列車→木乃伊→凌晨大廳

| ID | 類型 | 原文對應 | 選擇 |
|----|------|----------|------|
| `ch03_ankokoji` | choice | 彫刻家走後，躺在床上讀《暗夜行路》。主角的精神鬥爭句句痛切。和他一比，「僕」是多麼愚蠢。不知不覺流下了淚水。淚水帶來了短暫的平和。 | **C4** |
| `ch03_gear_return` | auto | 但不長久。右眼再次感到半透明的齒輪。頭痛。瞇起眼，感覺到齒輪的數量在增加。 | — |
| `ch03_headache` | choice | 頭痛加劇。吃了催眠藥，在床上輾轉。終於睡著了。 | **C5** |
| `ch03_dream_platform` | auto | 夢。站在月台上。旁邊有個年長的女人，好像見過。和她說話時感到一種愉快的興奮。 | — |
| `ch03_dream_train` | auto | 火車進站。獨自上了車，走過兩側垂著白布的寢台之間。 | — |
| `ch03_dream_mummy` | auto | 某個寢台上，一個像木乃伊的裸體女人面朝這邊躺著。那又是「僕」的復讐之神——某個狂人的女兒。…… | — |
| `ch03_dawn` | choice | 醒來時已是凌晨三點半。走到大廳的爐火前。一個穿白衣的給仕來加柴。對面大廳角落裡，一個穿綠衣的美國女人在讀書。感到被什麼拯救了，決定靜靜等待天亮。 | **C6** |
| `ch03_ending` | auto | 像久病之後靜待死亡的老人一樣。…… | — |

**C4：暗夜行路的淚**
- A)「任由淚水流下——和這本書的主角比起來，「僕」有多愚蠢。」→ notebook `ch03.tears_peace`, flag `ch03.wept_for_novel`
- B)「合上書，不想再受刺激。」→ flag `ch03.closed_novel`

**C5：齒輪與頭痛**
- A)「盯著齒輪——試圖看清它們的形狀和數量。」→ +insight, nerve −1, notebook `ch03.gear_count`, flag `ch03.watched_gears`
- B)「閉上眼睛，吞下催眠藥。」→ flag `ch03.took_pills`

**C6：凌晨的大廳**
- A)「望著那個穿綠衣的美國女人——她的存在本身就是某種救贖。」→ notebook `ch03.green_dress`, flag `ch03.watched_woman`
- B)「只看著爐火，什麼都不想。」→ flag `ch03.stared_fire`

#### 原文 text blocks

**ch03_ankokoji:**
```
type: narration 他走了之後，躺在床上讀起了《暗夜行路》。
type: inner  主角的精神鬥爭句句痛切。和這個主角一比，「僕」不知有多愚蠢。不知不覺流下了淚水。
type: inner  同時——淚水也不知何時為「僕」的心帶來了平和。但那也不長久。
```

**ch03_gear_return:**
```
type: narration 右眼再次感到半透明的齒輪。
type: inner  頭痛。齒輪的數量在增加。
type: narration 視野逐漸被遮蔽。和上次一樣——不，比上次更多。
```

**ch03_dream_mummy:**
```
type: narration 某個寢台上，一個像木乃伊般的裸體女人面朝這邊橫躺著。
type: inner  那又是「僕」的復讐之神——某個狂人的女兒。……
type: break
type: narration 醒來時立刻從床上跳了下來。房間裡依然亮著電燈。但不知從哪裡傳來翅膀的聲音和老鼠的吱吱聲。
```

**ch03_dawn:**
```
type: narration 開門走到走廊，急忙來到爐火前。坐在椅子上，望著微弱的火焰。
type: narration 一個穿白衣的給仕走過來加柴。
type: dialogue  speaker:你 「何時？」 cn:「幾點了？」
type: dialogue  speaker:給仕 「三時半ぐらいでございます」 cn:「大概三點半。」
type: narration 對面大廳角落裡，一個像美國人的女人在讀書。即使從遠處看，她穿的也無疑是綠色的洋裝。
type: inner  感到像是被什麼拯救了，決定靜靜等待天亮。
```

**ch03_ending:**
```
type: inner  像承受了多年病苦、靜靜等待死亡的老人一樣。……
type: break
type: system  「第三章「夜」 終」
```

---

## Connections

| ID | requires | title | subtitle | icon | insightGain | 備註 |
|----|----------|-------|----------|------|-------------|------|
| `ch03.books_mirror` | `ch03.needle_books` + `ch03.mirror_plaster` | 針と膏薬 | 本にも人にも | ◈ | 2 | 書中藏針、人身上也藏膏藥——到處都是隱藏的異象 |
| `ch03.gear_evolution` | `ch03.gear_count` + (CH1 `gear_first`) | 歯車の増殖 | 初見から再発 | ✦ | 2 | 跨章：CH1 齒輪初現→CH3 數量增加 |
| `ch03.penname_prophecy` | `ch03.juryoyoshi` + `ch03.tears_peace` | 寿陵余子の涙 | 蛇行匍匐 | ◉ | 1 | 筆名的預言＋淚水的短暫平和——都指向同一個結局 |
| `ch03.nemesis_dream` | `ch03.gear_count` + (CH2 `ch02.nemesis`) | 夢の復讐神 | 歯車の先に | ◇ | 2 | 跨章：CH2 書店的復讐之神→CH3 夢中的裸體女人 |

---

## Locations

| ID | label | sub | x | y | shape | symbolKey |
|----|-------|-----|---|---|-------|-----------|
| `ch03.maruzen` | 丸善 | 二階書棚 | 50 | 50 | rect | `ch03.needle_books` |
| `ch03.poster_room` | 展覽室 | ポスタア | 120 | 120 | circle | — |
| `ch03.hotel_lobby` | ホテル | ロッビイ | 180 | 200 | rect | `ch03.mirror_plaster` |
| `ch03.hotel_room` | 僕の部屋 | 暗夜行路 | 230 | 280 | rect | `ch03.gear_count` |
| `ch03.dawn_lobby` | 爐火前 | 三時半 | 270 | 350 | circle | `ch03.green_dress` |

---

## Nerve / Insight / Writing 曲線

CH2 結束時典型範圍：nerve 4–7, insight 4–12, writing 2–4

### CH3 設計

| 軸 | 全章範圍 | 設計理由 |
|----|----------|----------|
| nerve | −2 ~ −3 | 齒輪再現＋惡夢是本章的心理高峰。nerve 下降集中在後半。 |
| insight | +2 ~ +5 | 書中之針、鏡中膏藥、齒輪觀察——全是被動的洞察，不是主動探索。 |
| writing | +1 | 構思長篇計畫的一瞬（ch03_lobby），但沒有實際動筆。 |

### 逐場景數值

| 場景 | nerve | insight | writing | 條件 |
|------|-------|---------|---------|------|
| ch03_books_needle C1A | — | +1 | — | 選擇忍受 |
| ch03_juryoyoshi C2A | — | +1 | — | 選擇正視 |
| ch03_sculptor_lips C3A | — | +1 | — | 選擇注意膏藥 |
| ch03_ankokoji C4A | — | — | — | 筆記但無數值 |
| ch03_headache C5A | −1 | +1 | — | 選擇盯著齒輪 |
| ch03_dawn C6A | — | — | — | 筆記但無數值 |
| ch03_lobby | — | — | +1 | 固定（構思長篇） |
| ch03_ending | −1 | — | — | 固定（等死的老人） |
| connections | — | +1~+7 | — | 視形成數量 |

---

## Notebook 新增條目

| key | symbol | desc（待精修） | 觸發 |
|-----|--------|---------------|------|
| `ch03.needle_books` | book | 每本書都藏著刺向「僕」的針——齒輪畫集、Bovary、宗教書 | C1A |
| `ch03.juryoyoshi` | gear | 筆名「寿陵余子」——蛇行匍匐歸鄉的青年。墮入地獄前就已預言 | C2A |
| `ch03.mirror_plaster` | gear | 鏡中彫刻家耳下的黃色膏藥——偵探般的視線 | C3A |
| `ch03.tears_peace` | wing | 讀《暗夜行路》落淚。淚水帶來短暫平和 | C4A |
| `ch03.gear_count` | gear | 半透明齒輪再現——右眼，數量比上次更多 | C5A |
| `ch03.green_dress` | wing | 凌晨三點半。穿綠衣的美國女人。某種救贖 | C6A |

### Symbols 更新

需在 `src/data/symbols.js` 的 `SYMBOL_GLYPHS` 新增：

```js
"ch03.needle_books":   { glyph: "📖", label: "書の針" },
"ch03.juryoyoshi":     { glyph: "⚙️", label: "寿陵余子" },
"ch03.mirror_plaster": { glyph: "⚙️", label: "鏡・膏薬" },
"ch03.tears_peace":    { glyph: "🪽", label: "暗夜行路・涙" },
"ch03.gear_count":     { glyph: "⚙️", label: "歯車・増殖" },
"ch03.green_dress":    { glyph: "🪽", label: "緑の女" },
```

---

## Portraits

| speakerId | 角色 | 首次出現 | 備註 |
|-----------|------|----------|------|
| `ch03_sculptor` | 彫刻家 | ch03_sculptor_arrive | **新增**——天鵞絨、山羊鬚、爬蟲類的手 |
| `ch03_bellboy_night` | 給仕（夜） | ch03_dawn | 可省略（僅一句對話） |
| `protagonist` | 主角 | 對話場景 | 無立繪（慣例） |

---

## 待劇本編輯器處理

| 欄位 | 說明 |
|------|------|
| `text[]` 的精確分段 | 上面的 text blocks 是段落對照，需要逐句校對原文並分割成 TextBlock 陣列 |
| `dialogue.jp` | 需要從原文精確提取，含振假名標記（ruby） |
| `dialogue.cn` | 中文翻譯需要月月撰寫 |
| `effectFn` | 動態效果的具體條件實作（前章 flag 判斷） |
| `condition` | 條件選項的 state 判斷函式 |

---

## 開放問題

1. **長篇計畫**——「僕」構思的推古→明治三十餘篇編年體長篇，是否值得 notebook？（建議：+writing，因為這是全章唯一的創作衝動）
2. **聖喬治海報**——騎士臉像「僕」的敵人——這個「敵人」是否需要具體化？（原文未指明，建議留曖昧）
3. **彫刻家的身分**——原文中只說「或先輩の彫刻家」，歷史考據可能是某特定人物。是否在 notebook 中提示？
4. **夢境場景**——是否需要特殊視覺效果（模糊、色調變化）？夢中的月台→寢台轉場是否用 `type: break`？
5. **CH3→CH4 銜接**——CH4「まだ？」開頭「僕」在旅館房間寫完了短篇。時間是 CH3 翌日或數日後？
