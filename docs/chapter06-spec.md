# 第六章「飛行機」 Chapter Spec

> 基於青空文庫原文的場景分割。文本欄位為原文段落對照，待劇本編輯器精修格式。
> Source: 芥川龍之介《歯車》六「飛行機」
> 青空文庫 https://www.aozora.gr.jp/cards/000879/files/42377_34745.html
> 原著為公有領域（著作権消滅）
>
> **注意：本章為《歯車》最終章。原著在此中斷。**

---

## 概要

| 項目 | 值 |
|------|------|
| chapter | 6 |
| title | 飛行機 |
| titleCn | 飛行機 |
| startScene | ch06_return_home |
| startLocation | ch06.tokaido |
| 預估場景數 | ~26 |
| 預估選擇點 | ~8 |
| 預估 connections | 5 |

## 主題

原文結構：「僕」搭東海道線回到避暑地的家 → 妻子與催眠藥帶來數日平和 → 二樓工作 → 買墨水（只有 sepia）→ 遇瑞典人 Strindberg → 半黑的狗四次經過 → 妻子娘家 → 義妹的丈夫逼她喝草酸 → 叔父的稻荷信仰 → 飛行機兩次飛過 → 松林散步 → 鞦韆架=絞首台 → 「春之家」燒毀 → 自行車上的姊夫面孔 → 死去的鼴鼠 → 齒輪最終視覺 → 回到家中 → 妻子的預感 → 中斷。

核心意象：
- **雨衣的司機** — CH1→CH6 首尾呼應。回到東海道同一條路，司機穿著雨衣
- **喪列** — 途中看到的葬禮隊伍。金銀造花蓮花搖曳
- **sepia 墨水** — 最令「僕」不快的顏色。只有 sepia
- **半黑的狗** — 四次經過。Black and White 威士忌。Strindberg 的黑白領帶。不是偶然
- **飛行機** — 兩次飛過頭頂。Air Ship 牌香菸。為什麼偏偏飛過「僕」？
- **草酸** — 義妹的丈夫逼她喝的毒藥。家庭暴力的極端
- **稻荷** — 叔父的狐狸信仰。「家中有人得罪了狐狸」
- **鞦韆架=絞首台** — 海邊空蕩的鞦韆架上停著三隻烏鴉。其中一隻叫了四聲
- **「春之家」燒毀** — 朋友稱為「春のいる家」的西洋房屋只剩浴缸和水泥地基
- **自行車上的姊夫** — 迎面騎來的男人有姊夫的臉。路中央腹部朝上的鼴鼠屍體
- **最終齒輪** — 齒輪數量增加、旋轉加速。松林像透過切子玻璃看到的。心悸
- **妻子的預感** — 「只是覺得爸爸好像要死了。」——全作品中最恐怖的經驗
- **中斷** — 「僕はもうこの先を書きつづける力を持っていない。」

---

## 與前章的銜接

### carryOver state（D3）

- `notebook` — CH1–CH5 筆記全部帶入
- `choicesMade` — 所有 flag 帶入
- `connections` — 已形成的連結
- `nerve` / `insight` / `writing` — 數值延續

### 前章 flag 依賴

| 前章 flag | CH6 效果 |
|----------|----------|
| CH1 `observed_raincoat_1` | ch06_return_home：看到司機穿雨衣時，所有雨衣記憶一起湧上 |
| `ch05.pondered_diable` | ch06_swing：鞦韆架=絞首台時，「le diable est mort」在腦中閃過 |
| `ch05.saw_dead_mole` | ch06_dead_mole_2：又是鼴鼠屍體——第二次 |
| `ch02.traced_fires` | ch06_spring_house：看到燒毀的「春之家」時，火的記憶再次湧上 |
| `ch04.traced_mole` | ch06_dead_mole_2：Mole→la mort→屍體→又一具屍體 |
| `ch03.watched_gears` | ch06_final_gear：齒輪從 CH1 第一次→CH3 增殖→CH6 最終加速 |

---

## 場景清單（基於原文段落）

### 第一段：歸途・家（scenes 1–5）

原文段落：東海道線→雨衣司機→喪列→回家→二樓工作→麻雀

| ID | 類型 | 原文對應 | 選擇 |
|----|------|----------|------|
| `ch06_return_home` | auto (dynamic) | 東海道線的車站搭自動車回避暑地。司機不知為何在這種寒冷中穿著舊雨衣。感到不祥，努力不去看他，望向窗外。 | — |
| `ch06_funeral` | choice | 窗外——矮松林後面的舊街道上，一列葬禮隊伍正在行進。沒有白紙燈籠和龍燈，但金銀的造花蓮花在轎前後靜靜搖曳。 | **C1** |
| `ch06_home_peace` | auto | 終於回到家。靠著妻子和催眠藥，過了兩三天還算平和的日子。二樓面對松林，可以微微看到海。 | — |
| `ch06_sparrow` | auto | 上午在二樓桌前工作，聽著鴿子的聲音。除了鴿子和烏鴉，麻雀也飛到緣側來。「喜雀堂に入る」——每次都想起這句話。 | — |
| `ch06_sepia` | auto | 某個溫暖陰天的午後，去雜貨店買墨水。店裡只有 sepia 色的墨水——最令「僕」不快的顏色。只好空手離開。 | — |

**C1：葬禮隊伍**
- A)「注視那列隊伍——沒有燈籠，只有金銀蓮花。那是誰的葬禮？」→ +insight, notebook `ch06.funeral_lotus`, flag `ch06.watched_funeral`
- B)「轉過頭去，不看。」→ flag `ch06.turned_away`

#### 原文 text blocks

**ch06_return_home:**
```
type: system  「第六章　飛行機」
type: system  「——飛行機——」
type: break
type: narration 從東海道線的某車站搭自動車前往更深處的避暑地。
type: narration 司機不知為何在這種寒冷中套著一件舊雨衣。
// if observed_raincoat_1:
type: inner  雨衣。停車場——省線——旅館走廊——旅館玄關——現在是司機。
type: narration 感到這暗合的不祥，努力不去看他，把目光投向窗外。
```

**ch06_funeral:**
```
type: narration 矮松林後面——大概是舊街道——一列葬禮隊伍正在行進。
type: narration 沒有白紙燈籠和龍燈的樣子。但金銀造花的蓮花在轎的前後靜靜搖曳著。……
```

**ch06_sparrow:**
```
type: narration 二樓的窗面對松林，微微可以看到海。上午坐在桌前，一邊聽鴿子的聲音一邊工作。
type: narration 除了鴿子和烏鴉之外，麻雀也飛進緣側來。那也令人愉快。
type: inner  「喜雀堂に入る」——每次都想起這句話。
```

### 第二段：偶遇・暗合（scenes 6–10）

原文段落：瑞典人 Strindberg → 半黑的狗 → 路邊玻璃鉢 → 麻雀逃走

| ID | 類型 | 原文對應 | 選擇 |
|----|------|----------|------|
| `ch06_strindberg` | auto | 人煙稀少的路上，迎面來了一個四十歲左右近視的外國人。肩膀聳起。他是住在這裡的、患有被害妄想的瑞典人。而且他的名字是 Strindberg。擦肩而過時，身體感到了某種衝擊。 | — |
| `ch06_half_black_dog` | choice | 這段路不過兩三町。但在這兩三町裡，一隻恰好半邊是黑色的狗四次從「僕」身邊走過。想起 Black and White 威士忌。而且剛才 Strindberg 的領帶也是黑白的。 | **C2** |
| `ch06_glass_bowl` | auto | 路邊鐵絲柵欄裡，有一個微微帶虹彩的玻璃鉢。鉢底浮出翼般的模樣。 | — |
| `ch06_sparrows_flee` | auto | 松梢上飛下來幾隻麻雀。但一靠近這個鉢，所有麻雀像約好了一樣同時飛向天空。…… | — |
| `ch06_head_walking` | auto | 感覺只有頭在走路。在路上停下了腳步。 | — |

**C2：半黑的狗四次**
- A)「數著——四次。不是偶然。Black and White。Strindberg 的黑白領帶。」→ +insight, nerve −1, notebook `ch06.black_white`, flag `ch06.counted_dog`
- B)「只是一隻狗。繼續走。」→ flag `ch06.ignored_dog`

#### 原文 text blocks

**ch06_strindberg:**
```
type: narration 迎面來了一個近視模樣的四十歲前後外國人，聳著肩膀走過。
type: narration 他是住在這裡的、患有被害妄想的瑞典人。而且他的名字就是 Strindberg。
type: inner  擦肩而過的瞬間，身體確實感到了某種衝擊。
```

**ch06_half_black_dog:**
```
type: narration 這段路不過兩三町。但在這兩三町裡，一隻恰好半邊是黑色的狗四次從身邊走過。
type: inner  想起了 Black and White 的威士忌。而且剛才的 Strindberg 的領帶也是黑白的。
type: inner  那怎麼想都不是偶然。如果不是偶然——感覺只有頭在走路，在路上停住了。
```

**ch06_glass_bowl:**
```
type: narration 路邊鐵絲柵欄裡擺著一個微微帶虹彩的玻璃鉢。鉢底浮出翼般的模樣。
type: narration 松梢上飛下來幾隻麻雀。但一靠近這個鉢，所有麻雀像約好了一樣同時飛向天空。……
```

### 第三段：妻子娘家（scenes 11–16）

原文段落：妻子娘家→義妹草酸→叔父稻荷→飛行機→Air Ship

| ID | 類型 | 原文對應 | 選擇 |
|----|------|----------|------|
| `ch06_wife_family` | auto | 去妻子娘家。妻子的母親在二樓，孩子們——包括「僕」的和妻子的弟妹——在一樓玩耍。 | — |
| `ch06_oxalic_acid` | choice | 妻子的義妹在場。她的丈夫曾經強迫她喝草酸——毒藥。 | **C3** |
| `ch06_uncle_inari` | choice | 叔父的故事。有人生病時，被告知家中得罪了狐狸，需要去拜稻荷。叔父真的去拜了。「僕」不由得打了個寒顫。 | **C4** |
| `ch06_airplane_1` | auto | 頭頂傳來飛行機的引擎聲。飛行機在低空飛過。 | — |
| `ch06_airship_cig` | choice | 想起旅館只賣 Air Ship 牌的捲菸。為什麼那架飛行機偏偏飛過「僕」頭上？為什麼旅館偏偏只有 Air Ship？ | **C5** |
| `ch06_airplane_2` | auto | 說話間飛行機又飛了過來。妻子的母親說：「聽說飛行員因為只呼吸高空的空氣，漸漸受不了地面的空氣了。」 | — |

**C3：草酸**
- A)「聽完義妹的遭遇——那不是一般的家庭糾紛，是謀殺未遂。」→ +insight, notebook `ch06.oxalic_acid`, flag `ch06.heard_acid`
- B)「不去細想。那是別人的事。」→ flag `ch06.dismissed_acid`

**C4：叔父與稻荷**
- A)「盯著叔父——他真的去拜了。「僕」也被什麼東西追著嗎？」→ +insight, notebook `ch06.inari_fox`, flag `ch06.pondered_fox`
- B)「搖頭，不接話。」→ flag `ch06.shook_head`

**C5：為什麼是飛行機？**
- A)「追問這些巧合——Air Ship 捲菸、飛行機兩次飛過、高空的空氣。」→ +insight, nerve −1, notebook `ch06.airplane_why`, flag `ch06.questioned_airplane`
- B)「不去問為什麼。偶然就是偶然。」→ flag `ch06.accepted_coincidence`

#### 原文 text blocks

**ch06_oxalic_acid:**
```
type: narration 妻子的義妹也在場。她的丈夫——
type: inner  曾經把草酸倒進杯子裡，逼她喝下去。
```

**ch06_uncle_inari:**
```
type: narration 叔父的故事。外甥生病的時候，有人告訴他：「家裡得罪了狐狸。」
type: narration 叔父就去拜了稻荷。
type: inner  「僕」不由得打了個寒顫。
```

**ch06_airplane_2:**
```
type: narration 說話間飛行機又飛了過來。
type: dialogue  speaker:妻の母 「ああ云う飛行機に乗っている人は高空の空気ばかり吸っているものだから、だんだんこの地面の上の空気に堪えられないようになってしまうのだって。……」 cn:「聽說坐那種飛行機的人因為只吸高空的空氣，漸漸就受不了地面上的空氣了。……」
```

### 第四段：松林・終局（scenes 17–26）

原文段落：松林散步→疑問→鞦韆架=絞首台→烏鴉四聲→「春之家」燒毀→自行車姊夫→鼴鼠屍體→齒輪加速→回家→妻子哭泣→中斷

| ID | 類型 | 原文對應 | 選擇 |
|----|------|----------|------|
| `ch06_pine_walk` | auto | 離開妻子娘家後，在一動不動的松林中走。越走越憂鬱。為什麼飛行機不去別處偏偏飛過「僕」的頭？為什麼旅館只賣 Air Ship 牌捲菸？ | — |
| `ch06_grey_sea` | auto | 海在低矮的砂丘後面灰濛濛地一片。 | — |
| `ch06_swing` | choice | 砂丘上——一個沒有鞦韆的鞦韆架孤零零地立著。「僕」立刻想到了絞首台。鞦韆架上停著兩三隻烏鴉，看到「僕」也毫無飛走的意思。正中間那隻對著天空張開大嘴，確實叫了四聲。 | **C6** |
| `ch06_spring_house` | auto (dynamic) | 沿著枯芝的砂土堤轉進別墅區的小路。右側應該有一棟高松間的二層木造西洋房屋（朋友稱之為「春のいる家」）。但走到跟前——只剩水泥地基上的浴缸。火事。不去看地往前走。 | — |
| `ch06_cyclist` | auto | 迎面來了一個騎自行車的男人。焦茶色的鳥打帽，目不轉睛地盯著前方，身體趴在車把上。忽然感到他的臉像姊夫的臉。在他到跟前之前轉進旁邊的小路。 | — |
| `ch06_dead_mole_2` | choice | 但這條小路正中央——一隻腐爛的鼴鼠屍體腹部朝上躺著。 | **C7** |
| `ch06_final_gear` | auto | 被什麼東西盯上了——這感覺每走一步都在加深。半透明的齒輪也一個接一個遮蔽視野。齒輪隨著數量增加而加速旋轉。同時右邊的松林——寂靜地交錯著枝椏——開始像透過切子玻璃看到的一樣。心悸加速。 | — |
| `ch06_pushed_forward` | auto | 想在路邊停下來。但像是被什麼人從後面推著一樣，不得不挺直頸項繼續走。 | — |
| `ch06_home_wife` | choice | 到達家門口時已經筋疲力盡。妻子一直在肩膀顫抖。「怎麼了？」「沒什麼……」她勉強抬起頭，擠出微笑。「沒什麼事。只是覺得……爸爸好像要死了。」 | **C8** |
| `ch06_ending` | auto | 「那是「僕」一生中最恐怖的經驗。——僕はもうこの先を書きつづける力を持っていない。……誰か僕の眠っているうちにそっと絞め殺してくれるものはないか？」 | — |

**C6：鞦韆架=絞首台**
- A)「盯著那三隻烏鴉——正中間那隻叫了四聲。像是在數什麼。」→ +insight, nerve −1, notebook `ch06.gallows_crow`, flag `ch06.watched_crows`
- B)「加快腳步走過去。」→ flag `ch06.hurried_past`

**C7：第二隻鼴鼠**
- A)「又是鼴鼠。腹部朝上。Mole→la mort→赤光旁的那隻→現在又是一隻。」→ +insight, nerve −1, notebook `ch06.mole_belly_up`, flag `ch06.saw_second_mole`
- B)「繞過去。不看。」→ flag `ch06.stepped_around`

**C8：妻子的預感**
- A)「問她——為什麼這麼覺得？」→ notebook `ch06.wife_premonition`, flag `ch06.asked_wife`
- B)「什麼都不說，只是握住她的手。」→ notebook `ch06.wife_premonition`, flag `ch06.held_hand`

> 注意：C8 的兩個選擇都觸發同一個 notebook 條目——因為妻子的話是全作品的終極一擊，無論如何都必須記錄。區別在於玩家面對恐懼的姿態。

#### 原文 text blocks

**ch06_swing:**
```
type: narration 海在低矮的砂丘後面灰濛濛地一片。砂丘上——一個沒有鞦韆的鞦韆架孤零零地立著。
type: inner  立刻想到了絞首台。鞦韆架上停著兩三隻烏鴉。看到「僕」也毫無飛走的意思。
type: narration 正中間那隻對著天空張開大嘴——確實叫了四聲。
```

**ch06_spring_house:**
```
type: narration 轉進別墅區的小路。右側的高松間應該有一棟二層木造的西洋房屋。
type: inner  （朋友稱之為「春のいる家」。）
type: narration 但走到跟前——水泥地基上只剩一個浴缸。
type: inner  火事——立刻這麼想。不去看地往前走。
// if ch02.traced_fires:
type: inner  又是火。每次都是火。
```

**ch06_dead_mole_2:**
```
type: narration 但這條小路正中央——一隻腐爛的鼴鼠屍體腹部朝上躺著。
// if ch05.saw_dead_mole:
type: inner  又是鼴鼠。赤光旁的那隻——現在又是一隻。
// if ch04.traced_mole:
type: inner  Mole→la mort→屍體→又一具屍體。
```

**ch06_final_gear:**
```
type: narration 被什麼東西盯上了——這感覺每走一步都在加深。
type: narration 半透明的齒輪也一個接一個遮蔽了視野。齒輪隨著數量增加而加速旋轉。
type: narration 同時右邊的松林——寂靜地交錯著枝椏——開始像透過切子玻璃看到的一樣。
type: inner  心悸加速。想在路邊停下來。但像是被什麼人從後面推著一樣，不得不挺直頸項繼續走。
```

**ch06_home_wife:**
```
type: narration 到達家門口時已經筋疲力盡。妻子一直在顫抖著肩膀。
type: dialogue  speaker:你 「どうした？」 cn:「怎麼了？」
type: dialogue  speaker:妻 「いえ、どうもしないのです。……」 cn:「沒什麼……」
type: narration 妻子勉強抬起頭，擠出微笑繼續說。
type: dialogue  speaker:妻 「どうもした訣ではないのですけれどもね、唯何だかお父さんが死んでしまいそうな気がしたものですから。……」 cn:「倒不是出了什麼事……只是總覺得爸爸好像要死了。……」
type: inner  那是「僕」一生中最恐怖的經驗。
```

**ch06_ending:**
```
type: break
type: pause  duration: 3000
type: narration 僕はもうこの先を書きつづける力を持っていない。
type: narration こう云う気もちの中に生きているのは何とも言われない苦痛である。
type: pause  duration: 2000
type: narration 誰か僕の眠っているうちにそっと絞め殺してくれるものはないか？
type: break
type: system  「第六章「飛行機」 終」
type: break
type: system  「歯車　了」
```

---

## Connections

| ID | requires | title | subtitle | icon | insightGain | 備註 |
|----|----------|-------|----------|------|-------------|------|
| `ch06.raincoat_full_circle` | `ch06.funeral_lotus` + (CH1 `raincoat_station`) | 雨衣の円環 | 出発と帰還 | ✦ | 2 | 跨章：CH1 停車場的雨衣→CH6 歸途司機的雨衣。首尾呼應 |
| `ch06.mole_trilogy` | `ch06.mole_belly_up` + (CH5 `ch05.dead_mole`) | 鼠もぐらの三部作 | Mole→屍→屍 | ◈ | 2 | 跨章：CH4 語言→CH5 第一具→CH6 第二具。鼴鼠的完成 |
| `ch06.fire_burns_all` | `ch06.watched_funeral` + (CH2 `ch02.fire_premonition`) | 火は全てを焼く | 保険・赤光・春の家 | ◉ | 2 | 跨章：CH2 放火保險→CH5 赤光→CH6「春之家」燒毀。火的三部曲 |
| `ch06.coincidence_web` | `ch06.black_white` + `ch06.airplane_why` | 偶然の網 | 犬・飛行機・煙草 | ◇ | 2 | 半黑狗+飛行機+Air Ship——暗合的密度已不可能是偶然 |
| `ch06.gear_finale` | (CH1 `gear_first`) + (CH3 `ch03.gear_count`) | 歯車の終章 | 半透明から不透明へ | ✶ | 3 | 跨章：CH1 初見→CH3 增殖→CH6 加速。三章連結的最終形態。特殊 connection |

> `ch06.gear_finale` 的 insightGain: 3 是全遊戲最高。齒輪的意象貫穿全作品，這個 connection 代表所有碎片的最終匯聚。

---

## Locations

| ID | label | sub | x | y | shape | symbolKey |
|----|-------|-----|---|---|-------|-----------|
| `ch06.tokaido` | 東海道 | 帰路 | 50 | 50 | rect | `ch06.funeral_lotus` |
| `ch06.home` | 家 | 避暑地 | 110 | 130 | rect | — |
| `ch06.street` | 往来 | Strindberg | 170 | 200 | circle | `ch06.black_white` |
| `ch06.wife_family` | 妻の実家 | 飛行機 | 230 | 280 | rect | `ch06.airplane_why` |
| `ch06.pine_walk` | 松林 | 齒輪 | 280 | 340 | mountain | `ch06.gallows_crow` |
| `ch06.final_path` | 小みち | 鼠もぐら | 330 | 400 | diamond | `ch06.mole_belly_up` |

---

## Nerve / Insight / Writing 曲線

CH5 結束時典型範圍：nerve 0–3, insight 11–26, writing 5–9

### CH6 設計

| 軸 | 全章範圍 | 設計理由 |
|----|----------|----------|
| nerve | −3 ~ −5 | 最終章。鞦韆架、鼴鼠、齒輪、妻子的預感——每一步都在逼近 0。nerve 到達 0 觸發 corrupt 全開。 |
| insight | +3 ~ +7 | 暗合的密度最高。但 insight 的增加已經不再帶來任何安慰。 |
| writing | +0 | 「僕」在家工作（ch06_sparrow），但本章沒有新的創作衝動。最後一句「書きつづける力を持っていない」。 |

### 逐場景數值

| 場景 | nerve | insight | writing | 條件 |
|------|-------|---------|---------|------|
| ch06_funeral C1A | — | +1 | — | 選擇注視 |
| ch06_half_black_dog C2A | −1 | +1 | — | 選擇數算 |
| ch06_oxalic_acid C3A | — | +1 | — | 選擇聆聽 |
| ch06_uncle_inari C4A | — | +1 | — | 選擇思考 |
| ch06_airship_cig C5A | −1 | +1 | — | 選擇追問 |
| ch06_swing C6A | −1 | +1 | — | 選擇注視烏鴉 |
| ch06_dead_mole_2 C7A | −1 | +1 | — | 選擇注視 |
| ch06_final_gear | −1 | — | — | 固定 |
| ch06_home_wife C8A/B | — | — | — | 筆記（兩選擇都觸發） |
| ch06_ending | — | +1 | — | 固定（最終洞察） |
| connections | — | +2~+11 | — | 視形成數量 |

### Nerve 設計特記

本章設計上 nerve 可能到達 0。當 nerve ≤ `corrupt.threshold`（gameConfig: 5）時，文本腐蝕效果啟動。當 nerve = 0 時，最終場景（ch06_ending）應呈現最大程度的文本腐蝕——與原著的崩潰感一致。

---

## Notebook 新增條目

| key | symbol | desc（待精修） | 觸發 |
|-----|--------|---------------|------|
| `ch06.funeral_lotus` | wing | 歸途的葬禮——金銀造花蓮花搖曳 | C1A |
| `ch06.black_white` | gear | 半黑的狗四次。Black and White。Strindberg 的黑白領帶 | C2A |
| `ch06.oxalic_acid` | gear | 義妹的丈夫逼她喝草酸 | C3A |
| `ch06.inari_fox` | book | 叔父去拜稻荷——「家裡得罪了狐狸」 | C4A |
| `ch06.airplane_why` | gear | 為什麼飛行機飛過「僕」的頭？為什麼只有 Air Ship 牌？ | C5A |
| `ch06.gallows_crow` | gear | 鞦韆架=絞首台。三隻烏鴉。中間那隻叫了四聲 | C6A |
| `ch06.mole_belly_up` | gear | 小路中央腹部朝上的鼴鼠屍體——又是鼴鼠 | C7A |
| `ch06.wife_premonition` | wing | 妻子：「只是覺得爸爸好像要死了。」 | C8A 或 C8B |

### Symbols 更新

需在 `src/data/symbols.js` 的 `SYMBOL_GLYPHS` 新增：

```js
"ch06.funeral_lotus":    { glyph: "🪽", label: "葬列・蓮花" },
"ch06.black_white":      { glyph: "⚙️", label: "黒白・四度" },
"ch06.oxalic_acid":      { glyph: "⚙️", label: "蓚酸" },
"ch06.inari_fox":        { glyph: "📖", label: "稲荷・狐" },
"ch06.airplane_why":     { glyph: "⚙️", label: "飛行機・暗合" },
"ch06.gallows_crow":     { glyph: "⚙️", label: "鶏冠架・鴉" },
"ch06.mole_belly_up":    { glyph: "⚙️", label: "鼠もぐら・再" },
"ch06.wife_premonition": { glyph: "🪽", label: "妻の予感" },
```

---

## Portraits

| speakerId | 角色 | 首次出現 | 備註 |
|-----------|------|----------|------|
| `ch06_wife` | 妻 | ch06_home_wife | CH2 回想出現過，此處正式登場 |
| `ch06_mother_in_law` | 妻の母 | ch06_wife_family | **新增**——飛行機的對話 |
| `protagonist` | 主角 | 對話場景 | 無立繪（慣例） |

---

## 結局設計（全遊戲終結）

本章是《歯車》最終章。原著在「誰か僕の眠っているうちにそっと絞め殺してくれるものはないか？」處中斷（芥川龍之介於 1927 年 7 月 24 日服安眠藥自殺，此作為遺稿發表）。

### EndScreen 特殊處理

- `hasNextChapter: false` — 沒有下一章
- EndScreen 應顯示全遊戲統計（六章累計的 notebook、connections、最終 nerve/insight/writing）
- 考慮追加一個「全作品回顧」畫面，列出玩家收集的所有 notebook 條目和 connections
- 最終文字：忠於原著，不添加任何「解說」或「結語」

---

## 待劇本編輯器處理

| 欄位 | 說明 |
|------|------|
| `text[]` 的精確分段 | 上面的 text blocks 是段落對照，需要逐句校對原文並分割成 TextBlock 陣列 |
| `dialogue.jp` | 需要從原文精確提取，含振假名標記（ruby） |
| `dialogue.cn` | 中文翻譯需要月月撰寫 |
| `effectFn` | 動態效果的具體條件實作（大量跨章 flag 判斷） |
| `condition` | 條件選項的 state 判斷函式 |
| corrupt 效果 | nerve ≤ 5 時的文本腐蝕——最終章需要最重的腐蝕等級 |

---

## 開放問題

1. **原著只有六章**——CLAUDE.md 記載「原著 11 章 51 節」，但青空文庫文本只有六個標題章節。需確認：是否將六章拆分為更多遊戲章節？或修正 CLAUDE.md 的描述？
2. **結局的 nerve = 0 觸發**——如果玩家 nerve 在最終場景仍 > 0，ending 文本是否仍顯示腐蝕？（建議：最終兩段固定顯示腐蝕——原著本身就是崩潰狀態的文本）
3. **「春之家」**——是否需要更多背景？原文中朋友稱之為「春のいる家」，但沒有解釋。是否在 notebook 中補充？
4. **自行車上的姊夫面孔**——是否值得 notebook？（建議：不設獨立條目——這是 CH2 姊夫主題的最終回聲，但太短暫）
5. **全遊戲結束後的體驗**——是否顯示「再讀一次」按鈕？是否提供不同 nerve 路線的差異說明？
6. **妻子角色**——CH6 是妻子第一次正式對話出場（CH2 只有回想）。是否需要立繪？（建議：需要——最後一幕的衝擊需要視覺支撐）
7. **sepia 墨水與半黑狗之間是否需要場景**——原文中「僕」離開墨水店後在路上走了一段，才遇到 Strindberg 和狗。是否需要過渡場景？
