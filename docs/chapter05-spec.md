# 第五章「赤光」 Chapter Spec

> ⚠ **作廢警語（2026-07-13，Batch F9）**：本檔第二段「主題」概述中「松林中的赤光（紅色
> 池塘）」「老婦人」一節，以及與其對應的場景切分，整段是幻覺內容（audit §1c-5）——
> 原文（B:L435）該段實際是「運河・達磨船」（郊外養父母家的回憶＋運河上達磨船底透出
> 的薄光），並無池塘、並無老婦人、並無死鼴鼠。本檔概述亦漏掉了章題眼《赤光》歌集信
> （B:L441「歌集『赤光』の再版を送りますから……」）。**場景切分與逐字回填一律以
> `docs/ch5-source-map.md`（Batch F9 施工圖，唯一來源）為準**，已據此重寫
> `src/data/chapters/chapter05.js`（39 場景、7 選擇點、16 notebook keys、6 條
> connections）。本檔僅供歷史對照，不得回流至正式資料。
>
> 基於青空文庫原文的場景分割。文本欄位為原文段落對照，待劇本編輯器精修格式。
> Source: 芥川龍之介《歯車》五「赤光」
> 青空文庫 https://www.aozora.gr.jp/cards/000879/files/42377_34745.html
> 原著為公有領域（著作権消滅）

---

## 概要

| 項目 | 值 |
|------|------|
| chapter | 5 |
| title | 赤光 |
| titleCn | 赤光 |
| startScene | ch05_photophobia |
| startLocation | ch05.hotel_room |
| 預估場景數 | ~24 |
| 預估選擇點 | ~8 |
| 預估 connections | 5 |

## 主題

原文結構：「僕」畏光如鼠，拉簾在電燈下工作 → 讀 Taine 的英國文學史 → 夜訪屋根裏的老基督徒 → 信仰對話（悪魔は信じられる、神の愛は信じられない）→ 松林中的赤光（紅色池塘）→ 老婦人 → 酒場的法語（le diable est mort）→ Raskolnikov 的懺悔衝動 → Icarus / Orestes → 運河的達磨船 → 回房讀《罪與罰》→ 卻翻到《卡拉馬佐夫兄弟》（裝訂錯誤）→ 催眠藥用完 → 拼命寫作 → 「Le diable est mort」再現 → 黎明的赤光。全章跨越數天，是最長的章節。

核心意象：
- **畏光** — 像老鼠一樣拉上窗簾。日光即痛苦
- **屋根裏の隠者** — 聖書會社的老人。信仰的可能與不可能。「悪魔は信じられる」
- **一角獣の林檎** — 老人遞來的蘋果皮上浮現麒麟圖案。木紋、龜裂都藏著神話動物
- **赤光** — 松林中紅色的池塘。不是火——是反射光。但「僕」第一眼以為是火
- **le diable est mort** — 酒場裡法語記者的對話。「魔鬼已死」——被竊聽的斷片
- **Icarus / Orestes** — 輪胎商標上的翼 → Icarus → 逃離的夢想 → 被復讐之神追趕的 Orestes
- **裝訂錯誤** — 《罪與罰》裡夾著《卡拉馬佐夫》的頁面。偶然翻到的是 Ivan 被惡魔折磨的場景
- **深夜寫作** — 催眠藥用完。以死物狂的心態寫作。超自然動物。自畫像

---

## 與前章的銜接

### carryOver state（D3）

- `notebook` — CH1–CH4 筆記全部帶入
- `choicesMade` — 所有 flag 帶入
- `connections` — 已形成的連結
- `nerve` / `insight` / `writing` — 數值延續

### 前章 flag 依賴

| 前章 flag | CH5 效果 |
|----------|----------|
| `ch04.traced_mole` | ch05_raskolnikov：Mole→la mort 的恐懼與 Raskolnikov 的懺悔衝動疊加 |
| `ch04.embraced_mania` | ch05_midnight_writing：深夜寫作時，誇大妄想的記憶使「僕」更加投入 |
| `ch03.watched_gears` | ch05_photophobia：畏光與齒輪的關聯——上次看齒輪後開始怕光 |
| `ch02.traced_fires` | ch05_red_light：看到赤光時，第一反應是「又是火」 |

---

## 場景清單（基於原文段落）

### 第一段：畏光・屋根裏（scenes 1–7）

原文段落：拉簾工作→ Taine →老人→信仰對話→一角獣→離開

| ID | 類型 | 原文對應 | 選擇 |
|----|------|----------|------|
| `ch05_photophobia` | auto | 日光開始折磨「僕」。像老鼠一樣拉上窗簾，白天也開著電燈繼續寫小說。疲了就讀 Taine 的英國文學史——詩人們無一不不幸。連 Ben Jonson 都曾看到腳趾上的羅馬軍對戰。 | — |
| `ch05_old_man` | auto | 某個東風強勁的夜晚（對「僕」來說是好徵兆），穿過地下室走到街上，去拜訪一個老人。他獨自在某聖書會社的屋根裏當小使，過著祈禱和讀書的生活。 | — |
| `ch05_faith_talk` | choice | 火盆旁、十字架下。為什麼母親發了瘋？為什麼父親的事業失敗了？為什麼「僕」被懲罰了？——他帶著莊嚴的微笑一直作陪。 | **C1** |
| `ch05_gardener_girl` | auto | 但老人也被「親和力」驅動。說起園丁的女兒——十八歲、長得好、心地好、對他很溫柔。眼中有情熱。 | — |
| `ch05_unicorn_apple` | choice | 老人遞來的蘋果——泛黃的皮上浮現了一角獸的姿態。（「僕」常在木紋和咖啡杯的裂紋中發現神話動物。）一角獸就是麒麟。想起某個批評家叫「僕」「九百十年代的麒麟児」。連這屋根裏也不是安全地帶。 | **C2** |
| `ch05_faith_answer` | auto | 「信者になる気はありませんか？」——「悪魔は信じられるが、神の愛は信じられない。」 | — |
| `ch05_leave_attic` | auto | 辭別老人，走進松林的夜色中。 | — |

**C1：信仰的問答**
- A)「正視這些問題——為什麼「僕」被懲罰？也許他知道答案。」→ +insight, notebook `ch05.punishment`, flag `ch05.asked_why`
- B)「不想聽答案。轉移話題。」→ flag `ch05.avoided_answer`

**C2：一角獸的蘋果**
- A)「盯著蘋果上的紋路——木紋、龜裂、果皮都藏著神話動物。」→ +insight, notebook `ch05.unicorn_apple`, flag `ch05.saw_unicorn`
- B)「咬一口蘋果，不去想。」→ flag `ch05.ate_apple`

#### 原文 text blocks

**ch05_photophobia:**
```
type: system  「第五章　赤光」
type: system  「——赤光——」
type: break
type: narration 日光開始折磨「僕」。像老鼠一樣在窗前拉下窗簾，白天也點著電燈，埋頭繼續寫小說。
type: narration 寫累了就翻開 Taine 的英國文學史，看詩人們的生涯。他們無一不不幸。
type: inner  連伊莉莎白朝的巨人——一代學者 Ben Jonson——都曾經精神衰竭到看見腳趾上有羅馬軍和迦太基軍在交戰。
type: inner  對這些詩人的不幸，不由得感到殘酷的、充滿惡意的歡愉。
```

**ch05_faith_talk:**
```
type: narration 在火盆旁、掛在牆上的十字架下，談了各種各樣的事。
type: inner  為什麼母親發了瘋？為什麼父親的事業失敗了？為什麼「僕」被懲罰了？
type: narration 知道那些秘密的他，帶著奇妙莊嚴的微笑，一直作陪到底。而且偶爾用簡短的話描繪出人生的諷刺畫。
```

**ch05_unicorn_apple:**
```
type: narration 他遞來的蘋果——泛黃的皮上不知何時浮現了一角獸的姿態。
type: inner  （「僕」常在木紋和咖啡杯的裂紋中發現神話動物。）一角獸就是麒麟。
type: inner  想起某個懷有敵意的批評家叫「僕」「九百十年代的麒麟児」。連這掛著十字架的屋根裏也不是安全地帶。
```

**ch05_faith_answer:**
```
type: dialogue  speaker:老人 「如何ですか、この頃は？」 cn:「最近如何？」
type: dialogue  speaker:你 「不相変神経ばかり苛々してね」 cn:「老樣子，神經一直很煩躁。」
type: dialogue  speaker:老人 「それは薬でも駄目ですよ。信者になる気はありませんか？」 cn:「那吃藥也沒用的。有沒有想過成為信徒？」
type: dialogue  speaker:你 「若し僕でもなれるものなら……」 cn:「如果連我也能的話……」
type: dialogue  speaker:老人 「何もむずかしいことはないのです。唯神を信じ、神の子の基督を信じ、基督の行った奇蹟を信じさえすれば……」 cn:「一點也不難。只要相信神、相信神子基督、相信基督行過的奇蹟就好……」
type: dialogue  speaker:你 「悪魔を信じることは出来ますがね。……」 cn:「惡魔倒是信得了。……」
type: dialogue  speaker:老人 「では何故神を信じないのですか？」 cn:「那為什麼不信神呢？」
type: dialogue  speaker:你 「神の愛は信じられないのです。……」 cn:「信不了神的愛。……」
```

### 第二段：赤光・老婦人（scenes 8–12）

原文段落：松林的夜路→燒焦的氣味→赤光池塘→老婦人→鼴鼠

| ID | 類型 | 原文對應 | 選擇 |
|----|------|----------|------|
| `ch05_pine_night` | auto | 走在松林中的夜路。微風。某處傳來燒焦的氣味。比起煙味更像是什麼在悶燒。 | — |
| `ch05_red_light` | choice | 看到了——松林深處有一片泛紅的光。不是火。走近後發現是某個水池反射了不知何處的光源。但第一眼確實以為是火。 | **C3** |
| `ch05_old_woman` | auto | 遇到一個穿寢衣的老婦人。她也看到了赤光。兩人站在原地說了幾句話。 | — |
| `ch05_dead_mole` | choice | 赤光的源頭附近——一隻死掉的鼴鼠（もぐらもち）。又是鼴鼠。 | **C4** |
| `ch05_return_path` | auto | 轉身回旅館。松林的路看起來比來的時候更長了。 | — |

**C3：赤光**
- A)「走近確認——是反射光，不是火。但為什麼第一眼就認定是火？」→ +insight, notebook `ch05.red_light`, flag `ch05.approached_light`
- B)「不走近。遠遠繞過去。」→ nerve −1, flag `ch05.avoided_light`

**C4：死去的鼴鼠**
- A)「盯著那隻鼴鼠——Mole、la mort、現在是真正的鼴鼠屍體。」→ +insight, nerve −1, notebook `ch05.dead_mole`, flag `ch05.saw_dead_mole`
- B)「視而不見地走過。」→ flag `ch05.ignored_mole`

#### 原文 text blocks

**ch05_red_light:**
```
type: narration 松林深處泛著紅色的光。
// if ch02.traced_fires:
type: inner  又是火——第一個念頭是火。每次回東京都看到火。
type: narration 走近後才看清——是一片水池，反射了不知何處的光源。水面在微風中泛著紅光。
type: inner  不是火。但「僕」的第一反應確實是火。
```

### 第三段：酒場・街頭（scenes 13–18）

原文段落：酒場法語→ Raskolnikov → Icarus/Orestes → 運河達磨船→外國人女

| ID | 類型 | 原文對應 | 選擇 |
|----|------|----------|------|
| `ch05_bar` | auto | 地下室的酒場。蘇打水加威士忌。隔壁兩個記者模樣的男人在用法語小聲說話。全身感到他們的視線——像電波一樣。 | — |
| `ch05_diable` | choice | 斷斷續續聽到法語。「Bien……très mauvais……pourquoi?……」「le diable est mort!」「Oui, oui……d'enfer……」投出最後一枚銀幣逃出酒場。 | **C5** |
| `ch05_raskolnikov` | auto | 夜風中想起 Raskolnikov。感到想要懺悔一切的衝動。但懺悔會為自己以外的人——家人以外的人——帶來悲劇。而且這衝動本身是否真實也值得懷疑。 | — |
| `ch05_icarus` | choice | 某個店的招牌上——輪胎商標畫著有翼的圖案。想起用人工翅膀的古代希臘人（Icarus）——飛到空中，被太陽燒毀翅膀，溺死海中。逃到 Madrid、Rio、Samarkand 的夢是可笑的。同時又想到被復讐之神追趕的 Orestes。 | **C6** |
| `ch05_canal` | auto | 沿著運河走在黑暗的街上。水面上橫著一艘達磨船，船底漏出微弱的光。那裡面也有人在生活。「因為相愛所以相恨。」 | — |
| `ch05_mrs_townshead` | auto | 回到旅館的某個房間。外國人四五人圍桌談話。穿紅色 one-piece 的女人不時看向「僕」。「Mrs. Townshead……」——某個看不見的東西在耳邊低語。站起來，怕發狂，回房間。 | — |

**C5：le diable est mort**
- A)「在腦中反覆那句法語——le diable est mort。魔鬼已死。那麼折磨「僕」的又是什麼？」→ +insight, notebook `ch05.diable_mort`, flag `ch05.pondered_diable`
- B)「立刻離開。不想聽下去。」→ nerve −1, flag `ch05.fled_bar`

**C6：Icarus 與 Orestes**
- A)「正視逃離的不可能——Icarus 的翅膀一定會被燒毀。而 Orestes 到哪裡都被追趕。」→ +insight, notebook `ch05.icarus_orestes`, flag `ch05.faced_fate`
- B)「繼續走。不去想。」→ flag `ch05.walked_on`

#### 原文 text blocks

**ch05_bar:**
```
type: narration 在蘇打水裡加了威士忌，默默一口一口喝起來。隔壁是兩個記者模樣的三十歲前後的男人，在用法語小聲說話。
type: inner  全身感到他們的視線。那確實像電波一樣擊中了「僕」的身體。他們一定知道「僕」的名字，在說「僕」的傳聞。
```

**ch05_diable:**
```
type: dialogue  speaker:（法語斷片） jp:「Bien……très mauvais……pourquoi?……」 cn:「好……非常糟……為什麼？……」
type: dialogue  speaker:（法語斷片） jp:「Pourquoi?……le diable est mort!……」 cn:「為什麼？……魔鬼已死！……」
type: dialogue  speaker:（法語斷片） jp:「Oui, oui……d'enfer……」 cn:「是的，是的……地獄……」
type: narration 投出一枚銀幣——那是「僕」手中最後一枚銀幣——逃出了這間地下室。
```

**ch05_icarus:**
```
type: narration 某個店的招牌上掛著白色小看板——汽車輪胎的商標畫著有翼的圖案。
type: inner  想起了依靠人工翅膀的古代希臘人。他飛上天空，被太陽灼燒了翅膀，最終溺死海中。
type: inner  Madrid、Rio、Samarkand——不能不嘲笑這樣的夢。
type: inner  同時也不能不想起被復讐之神追趕的 Orestes。
```

### 第四段：裝訂錯誤・深夜寫作（scenes 19–24）

原文段落：讀《罪與罰》→裝訂錯誤→Ivan→催眠藥用完→拼命寫作→Le diable est mort→黎明

| ID | 類型 | 原文對應 | 選擇 |
|----|------|----------|------|
| `ch05_crime_punishment` | choice | 回到房間，不敢打電話給精神病院——進去等於死。為了轉移恐懼，翻開《罪與罰》。但偶然翻到的頁面是《卡拉馬佐夫兄弟》的一節——裝訂工的失誤。 | **C7** |
| `ch05_ivan` | auto | 那一節描寫的是被惡魔折磨的 Ivan。Ivan、Strindberg、Maupassant——或是這個房間裡的「僕」自己。不到一頁就全身顫抖。 | — |
| `ch05_no_pills` | auto | 能拯救「僕」的只有睡眠。但催眠藥不知何時已經一包不剩了。 | — |
| `ch05_midnight_writing` | choice | 忍受不了不睡的痛苦。但生出了絕望的勇氣。叫了咖啡來，拼死地動筆。二枚、五枚、七枚、十枚——原稿飛速完成。這篇小說裡充滿了超自然的動物。其中一隻畫的是「僕」自己的肖像。 | **C8** |
| `ch05_diable_whisper` | auto | 疲勞漸漸使頭腦昏暗。離開桌子躺在床上。睡了四五十分鐘。但又有什麼在耳邊低語，立刻醒了過來。「Le diable est mort。」 | — |
| `ch05_ending` | auto | 凝灰岩窗外不知何時冷冷地亮了。站在門前望著空無一人的房間。窗玻璃上霧氣斑駁，浮現了一幅小風景——泛黃松林後面有海。那又是赤光。 | — |

**C7：裝訂錯誤——命運的手指**
- A)「在這裝訂錯誤中感到命運的手指——偶然翻開的正是 Ivan 被惡魔折磨的一節。」→ +insight, notebook `ch05.binding_error`, flag `ch05.felt_destiny`
- B)「合上書。不看下去。」→ flag `ch05.closed_dostoevsky`

**C8：深夜寫作**
- A)「把自己畫進超自然動物之中——如果要瘋，就在瘋之前寫完。」→ +writing, +insight, notebook `ch05.self_portrait_beast`, flag `ch05.wrote_portrait`
- B)「寫到疲勞為止就停。不再勉強。」→ flag `ch05.stopped_writing`

#### 原文 text blocks

**ch05_crime_punishment:**
```
type: narration 回到房間，本來打算立刻打電話給精神病院。但進去等於死。
type: narration 猶豫再三之後，為了轉移恐懼，翻開了《罪與罰》。
type: narration 但偶然翻到的頁面——是《卡拉馬佐夫兄弟》的一節。
type: inner  以為拿錯了書，看了看封面。「罪與罰」——沒有錯。
type: inner  在這裝訂工的失誤——在翻到這失誤的頁面上——感到命運的手指在動。
```

**ch05_ivan:**
```
type: narration 不得不讀了下去。但不到一頁就感到全身在顫抖。
type: inner  那裡描寫的是被惡魔折磨的 Ivan。Ivan、Strindberg、Maupassant——或是這個房間裡的「僕」自己。……
```

**ch05_midnight_writing:**
```
type: inner  能拯救「僕」的只有睡眠。但催眠藥不知何時一包都不剩了。
type: narration 忍受不了不睡的痛苦。但生出了絕望的勇氣，叫了咖啡，拼死地動筆。
type: narration 二枚、五枚、七枚、十枚——原稿飛速完成。
type: inner  這篇小說裡充滿了超自然的動物。而且其中一隻畫的是「僕」自己的肖像。
```

**ch05_diable_whisper:**
```
type: narration 疲勞漸漸使頭腦昏暗。離開桌子躺在床上。大概睡了四五十分鐘。
type: narration 但又有誰在耳邊低語了這樣的話，立刻醒了過來。
type: pause  duration: 1500
type: dialogue  speaker:（耳語） jp:「Le diable est mort」 cn:「魔鬼已死。」
```

**ch05_ending:**
```
type: narration 凝灰岩的窗外不知何時冷冷地亮了。
type: narration 站在門前，望著空無一人的房間。窗玻璃上霧氣斑駁，浮現了一幅小風景。
type: inner  那是泛黃的松林後面有海的風景。
type: break
type: system  「第五章「赤光」 終」
```

---

## Connections

| ID | requires | title | subtitle | icon | insightGain | 備註 |
|----|----------|-------|----------|------|-------------|------|
| `ch05.mole_chain` | `ch05.dead_mole` + (CH4 `ch04.mole_mort`) | 鼠もぐらの連鎖 | Mole→la mort→屍 | ✦ | 2 | 跨章：CH4 語言上的鼴鼠→CH5 實體的鼴鼠屍體 |
| `ch05.fire_red` | `ch05.red_light` + (CH2 `ch02.fire_premonition`) | 火の幻視 | 赤光は火ではない | ◈ | 2 | 跨章：CH2 每次回東京都看到火→CH5 赤光被誤認為火 |
| `ch05.devil_triangle` | `ch05.diable_mort` + `ch05.binding_error` | 悪魔の三角 | Ivan・酒場・耳語 | ◉ | 2 | 酒場法語＋裝訂錯誤的 Ivan＋耳語——惡魔三次出場 |
| `ch05.nemesis_orestes` | `ch05.icarus_orestes` + (CH2 `ch02.nemesis`) | 復讐神の系譜 | ツォイス→Orestes | ◇ | 2 | 跨章：CH2 宙斯也敵不過復讐之神→CH5 Orestes 被追趕 |
| `ch05.faith_unicorn` | `ch05.punishment` + `ch05.unicorn_apple` | 祈りと麒麟 | 安全地帯はない | ◈ | 1 | 信仰的問答＋蘋果上的麒麟——聖地也不安全 |

---

## Locations

| ID | label | sub | x | y | shape | symbolKey |
|----|-------|-----|---|---|-------|-----------|
| `ch05.hotel_room` | ホテル | 電燈 | 50 | 50 | rect | `ch05.self_portrait_beast` |
| `ch05.attic` | 屋根裏 | 聖書会社 | 120 | 130 | circle | `ch05.punishment` |
| `ch05.pine_grove` | 松林 | 赤光 | 190 | 210 | mountain | `ch05.red_light` |
| `ch05.underground_bar` | 地下室 | le diable | 250 | 290 | rect | `ch05.diable_mort` |
| `ch05.canal` | 運河 | 達磨船 | 300 | 350 | diamond | `ch05.icarus_orestes` |

---

## Nerve / Insight / Writing 曲線

CH4 結束時典型範圍：nerve 2–5, insight 8–20, writing 4–7

### CH5 設計

| 軸 | 全章範圍 | 設計理由 |
|----|----------|----------|
| nerve | −3 ~ −5 | 本章是心理崩潰的前夜。赤光、le diable、裝訂錯誤、催眠藥用完——每一擊都很重。 |
| insight | +3 ~ +7 | 信仰問答、赤光、語言碎片、Icarus/Orestes、裝訂錯誤——密集的洞察。connections 額外加。 |
| writing | +1 ~ +2 | 深夜的絕望寫作是最後的創作衝動。自畫像動物。 |

### 逐場景數值

| 場景 | nerve | insight | writing | 條件 |
|------|-------|---------|---------|------|
| ch05_photophobia | −1 | — | — | 固定（畏光） |
| ch05_faith_talk C1A | — | +1 | — | 選擇正視 |
| ch05_unicorn_apple C2A | — | +1 | — | 選擇注視 |
| ch05_red_light C3A | — | +1 | — | 選擇走近 |
| ch05_red_light C3B | −1 | — | — | 選擇迴避 |
| ch05_dead_mole C4A | −1 | +1 | — | 選擇注視 |
| ch05_diable C5A | — | +1 | — | 選擇思考 |
| ch05_diable C5B | −1 | — | — | 選擇逃離 |
| ch05_icarus C6A | — | +1 | — | 選擇面對 |
| ch05_crime_punishment C7A | — | +1 | — | 選擇感受命運 |
| ch05_midnight_writing C8A | — | +1 | +1 | 選擇畫自畫像 |
| ch05_diable_whisper | −1 | — | — | 固定（耳語） |
| connections | — | +1~+9 | — | 視形成數量 |

---

## Notebook 新增條目

| key | symbol | desc（待精修） | 觸發 |
|-----|--------|---------------|------|
| `ch05.punishment` | book | 為什麼母親瘋了、父親失敗、「僕」被懲罰——老人的莊嚴微笑 | C1A |
| `ch05.unicorn_apple` | gear | 蘋果皮上的一角獸=麒麟。「九百十年代の麒麟児」。安全地帶不存在 | C2A |
| `ch05.red_light` | gear | 松林中的赤光——不是火，是池塘反射。但第一眼以為是火 | C3A |
| `ch05.dead_mole` | gear | 赤光旁的鼴鼠屍體。Mole→la mort→真正的鼴鼠 | C4A |
| `ch05.diable_mort` | book | 「le diable est mort」——酒場的法語碎片。魔鬼已死 | C5A |
| `ch05.icarus_orestes` | wing | Icarus 的翅膀被燒毀。Orestes 被復讐之神追趕 | C6A |
| `ch05.binding_error` | book | 《罪與罰》裡夾著《卡拉馬佐夫》——裝訂錯誤中命運的手指 | C7A |
| `ch05.self_portrait_beast` | wing | 深夜寫的小說充滿超自然動物。其中一隻是「僕」自己 | C8A |

### Symbols 更新

需在 `src/data/symbols.js` 的 `SYMBOL_GLYPHS` 新增：

```js
"ch05.punishment":          { glyph: "📖", label: "罰・問答" },
"ch05.unicorn_apple":       { glyph: "⚙️", label: "一角獣・林檎" },
"ch05.red_light":           { glyph: "⚙️", label: "赤光" },
"ch05.dead_mole":           { glyph: "⚙️", label: "鼠もぐら・屍" },
"ch05.diable_mort":         { glyph: "📖", label: "le diable est mort" },
"ch05.icarus_orestes":      { glyph: "🪽", label: "Icarus・Orestes" },
"ch05.binding_error":       { glyph: "📖", label: "綴違え・運命" },
"ch05.self_portrait_beast": { glyph: "🪽", label: "自画像・獣" },
```

---

## Portraits

| speakerId | 角色 | 首次出現 | 備註 |
|-----------|------|----------|------|
| `ch05_old_man` | 屋根裏の老人 | ch05_old_man | **新增**——聖書會社小使、莊嚴微笑 |
| `protagonist` | 主角 | 對話場景 | 無立繪（慣例） |

---

## 待劇本編輯器處理

| 欄位 | 說明 |
|------|------|
| `text[]` 的精確分段 | 上面的 text blocks 是段落對照，需要逐句校對原文並分割成 TextBlock 陣列 |
| `dialogue.jp` | 需要從原文精確提取，含振假名標記（ruby） |
| `dialogue.cn` | 中文翻譯需要月月撰寫 |
| `effectFn` | 動態效果的具體條件實作 |
| `condition` | 條件選項的 state 判斷函式 |

---

## 開放問題

1. **屋根裏老人的園丁女兒**——是否需要 notebook？（建議：不設獨立條目，歸入 ch05.punishment 的脈絡中提及「親和力」即可）
2. **le diable est mort 的三次出現**——酒場→耳語→是否需要第三次（例如窗玻璃上的凝結文字）？（原文只有兩次，建議忠於原文）
3. **Mrs. Townshead**——耳邊低語的陌生名字。是否值得 notebook？（建議：不設，這是幻聽的開始，但「僕」自己也不理解）
4. **達磨船的家庭**——「因為相愛所以相恨」——是否連結到 CH4 的親和力？（建議：可以，但不做獨立 connection）
5. **CH5→CH6 銜接**——CH6「飛行機」開頭「僕」搭東海道線回到避暑地的家。時間跨度較大（旅館生活結束→回家）
6. **本章時間跨度**——原文中跨越數天（「或東風的夜晚」→「不知何時」→黎明）。是否在 UI 上標示日期切換？
