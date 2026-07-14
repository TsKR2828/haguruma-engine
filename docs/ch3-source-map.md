# CH3「夜」重切施工圖（Batch F7）

> 狀態：定案（2026-07-12，Fable）。docs/chapter03-spec.md 引用抽查全真（audit 判定「小修可用」）可作參考，但**場景切分以本圖為準**。
> 底本：B = reference/aozora/haguruma_original.txt，CH3 = B:L225–L295。
> 全域政策沿用 docs/ch1-source-map.md §0；cn 為**第一人稱「我」**（D12）；「→轉/新增source(B:Lx, 起…訖)」語法同前。

## 1. 骨架

```js
chapter: 3, title: "夜", titleCn: "夜",
startScene: "ch3_prologue", startLocation: "ch03.maruzen", sceneCount: 38,
```

- 無 portraits；speakerId：`cafe_waitress` / `sculptor` / `wife` / `old_woman` / `student_h` / `hotel_waiter`；主角 `protagonist`（speaker「我」）。
- **nerve 預算**：CH3 與 CH2 同日夜間，**無開場恢復**。正典全觀察路線 nerve −3（銅貨屈辱/齒輪再現/木乃伊夢各 −1）→ 章末神經見底（視覺崩壞最大化，配「靜靜等天亮的垂死老人」意象）。CH4 開場再 +3（晨間淺眠）。
- locations（5）：

| id | label | sub | shape | symbolKey |
|---|---|---|---|---|
| ch03.maruzen | 丸善 | 二階の書棚 | rect | ch03.gear_faces |
| ch03.nihonbashi | 日本橋通り | 夜 | circle | ch03.dragon_slay |
| ch03.cafe | カッフェ | 薔薇色の壁 | circle | ch03.napoleon |
| ch03.hotel_lobby | ホテル | 炉端 | rect | ch03.wing_rat |
| ch03.hotel_room | 部屋 | 夢 | diamond | ch03.mummy |

## 2. 場景逐一（38 場景，7 選擇點；**夢境段全 auto——夢中無選擇是刻意設計**。〔更正：以本節逐場清單為準，實作採 38〕）

### ch3_prologue（auto → ch3_books）
- system「第三章　夜」＋system「——夜——」＋break
- source(B:L225, 僕は丸善の二階の…目を通した。)／source(B:L225, それは僕の経験と…表紙をしていた。)
- notebook { key:"ch03.yellow_cover", symbol:"book", desc:"丸善——史特林堡《傳說》，寫著與我的經驗大同小異的事。又是黃色的書皮" }
- links: { visit:"ch03.maruzen", unlock:"ch03.yellow_cover" }。**無 nerve 恢復**。

### ch3_books（choice）
- source(B:L225, 僕は「伝説」を書棚へ戻し…引きずり出した。)／source(B:L225, しかしこの本も挿し画の…並べていた。)
- choice A「細看那幅插畫。」→ ch3_gear_faces；flag ch03.saw_gear_faces；insight+1；notebook { key:"ch03.gear_faces", symbol:"gear", desc:"精神病者畫集的插畫——排滿了與我們人類無異、有眼有鼻的齒輪" }；links unlock ch03.gear_faces
- choice B「把書塞回去。」→ ch3_bovary；flag ch03.shoved_back

### ch3_gear_faces（分支A，auto → ch3_bovary）
- source(B:L225, （それは或独逸人の集めた精神病者の画集だった）)（含括號逐字）

### ch3_bovary（auto → ch3_religion）
- source(B:L225, 僕はいつか憂鬱の中に…開いて行った。)／source(B:L225, が、なぜかどの本も…隠していた。)／source(B:L225, どの本も？――僕は何度も…外ならないのを感じた。……)

### ch3_religion（choice）
- source(B:L227, 日の暮に近い丸善の…目を通した。)／source(B:L227, この本は目次の第何章かに…並べていた。)（四つの敵）
- choice A「逐一咀嚼那四個名字——疑惑、恐怖、驕慢、官能的欲望。」→ ch3_enemies；flag ch03.chewed_enemies；insight+1；notebook { key:"ch03.four_enemies", symbol:"book", desc:"綠皮宗教書——可怕的四個敵人：疑惑、恐怖、驕慢、官能的欲望" }
- choice B「合上那本書。」→ ch3_juryo；flag ch03.closed_book

### ch3_enemies（分支A，auto → ch3_juryo）
- source(B:L227, 僕はこう云う言葉を見るが早いか…外ならなかった。)／source(B:L227, が、伝統的精神も…たまらなかった。)

### ch3_juryo（auto → ch3_poster）
- source(B:L227, 僕はこの本を手にしたまま…思い出した。)／source(B:L227, それは邯鄲の歩みを…青年だった。)／source(B:L227, 今日の僕は誰の目にも…用いていたことは、――)
- notebook { key:"ch03.juryo", symbol:"book", desc:"壽陵余子——學不會邯鄲之步、又忘了壽陵之步，蛇行匍匐而歸的青年。我的舊筆名" }

### ch3_poster（auto → ch3_street）
- source(B:L227, 僕は大きい書棚を後ろに…はいって行った。)／source(B:L227, が、そこにも一枚のポスタアの…露していた。)／source(B:L227, 僕は又「韓非子」の中の…下って行った。)
- notebook { key:"ch03.dragon_slay", symbol:"book", desc:"聖喬治刺龍的海報，騎士的臉像我的敵人——屠龍之技" }
- links: { fold:"── 丸善 · 針を隠した本 ──", unlock:"ch03.dragon_slay" }

### ch3_street（choice）
- source(B:L229, 僕はもう夜になった…考えつづけた。)／source(B:L229, それは又僕の持っている…破産してしまった。)
- choice A「抬頭看星空。」→ ch3_stars；flag ch03.looked_up；insight+1
- choice B「加快腳步。」→ ch3_cafe_refuge；flag ch03.hurried
- links: { visit:"ch03.nihonbashi" }

### ch3_stars（分支A，auto → ch3_cafe_refuge）
- source(B:L229, 僕は高い空を見上げ…考えようとした。)／source(B:L229, しかし昼間は晴れていた空も…曇っていた。)

### ch3_cafe_refuge（auto → ch3_cafe）
- source(B:L229, 僕は突然何ものかの…避難することにした。)

### ch3_cafe（auto → ch3_napoleon）
- source(B:L231, それは「避難」に違いなかった。…腰をおろした。)／source(B:L231, そこには幸い僕の外に…ふかし出した。)／source(B:L231, 巻煙草の煙は…愉快だった。)
- links: { visit:"ch03.cafe", fold:"── 夜の日本橋通り ──" }

### ch3_napoleon（choice）
- source(B:L231, けれども僕は暫らくの後…感じ出した。)
- choice A「盯著那幅拿破崙像。」→ ch3_napoleon_stare；flag ch03.stared_napoleon；insight+1；notebook { key:"ch03.napoleon", symbol:"book", desc:"咖啡館牆上的拿破崙——學生時代在筆記本末頁寫下『聖赫勒拿，小島』的男人" }；links unlock ch03.napoleon
- choice B「移開視線。」→ ch3_own_works；flag ch03.avoided_napoleon

### ch3_napoleon_stare（分支A，auto → ch3_own_works）
- source(B:L231, ナポレオンはまだ学生だった時…記していた。)／source(B:L231, それは或は僕等の言うように…確かだった。……)

### ch3_own_works（auto → ch3_cafe_change）
- source(B:L233, 僕はナポレオンを見つめたまま…考え出した。)／source(B:L233, するとまず記憶に浮かんだのは…アフォリズムだった。)／source(B:L233, （殊に「人生は地獄よりも地獄的である」と云う言葉だった）)（含括號）／source(B:L233, それから「地獄変」の主人公…運命だった。)
- notebook { key:"ch03.hell_aphorism", symbol:"book", desc:"我自己寫下的話——『人生比地獄還要地獄』" }

### ch3_cafe_change（auto → ch3_coin）
- source(B:L233, それから……僕は巻煙草を…眺めまわした。)／source(B:L233, 僕のここへ避難したのは…改めていた。)／source(B:L233, 就中僕を不快にしたのは…保っていないことだった。)／source(B:L233, 僕はもう一度人目に見えない…出ようとした。)

### ch3_coin（auto → ch3_home_memory）
- dialogue source(B:L235 整行) speaker 女給/cafe_waitress
- source(B:L237, 僕の投げ出したのは銅貨だった。)
- source(B:L239, 僕は屈辱を感じながら…思い出した。)
- effects: nerve −1（reason: 銅貨的屈辱）

### ch3_home_memory（auto → ch3_hotel_fire）
- source(B:L239, それは或郊外にある…借りた家だった。)／source(B:L239, 僕はかれこれ十年前にも…同居し出した。)／source(B:L239, 同時に又奴隷に、暴君に…変り出した。……)

### ch3_hotel_fire（auto → ch3_uso）
- source(B:L241, 前のホテルに帰ったのは…腰をおろした。)／source(B:L241, それから僕の計画していた…長篇だった。)／source(B:L241, 僕は火の粉の舞い上るのを…思い出した。)／source(B:L241, この銅像は甲冑を着…跨っていた。)／source(B:L241, しかし彼の敵だったのは、――)
- links: { visit:"ch03.hotel_lobby", fold:"── カッフェ · 銅貨 ──" }

### ch3_uso（auto → ch3_sculptor）
- dialogue source(B:L243 整行「噓！」) speaker 我。**噓 U+5653**
- source(B:L245, 僕は又遠い過去から…すべり落ちた。)

### ch3_sculptor（auto → ch3_sculptor_talk）
- source(B:L245, そこへ幸いにも来合せたのは…反らせていた。)／source(B:L245, 僕は椅子から立ち上り…握った。)／source(B:L245, （それは僕の習慣ではない…従ったのだった）)（含括號）／source(B:L245, が、彼の手は不思議にも…湿っていた。)

### ch3_sculptor_talk（auto → ch3_room_women）
- dialogue source(B:L247 整行) speaker 彫刻家/sculptor／dialogue source(B:L249 整行「ええ、……」) speaker 我／dialogue source(B:L251 整行) speaker 彫刻家／dialogue source(B:L253 整行) speaker 我
- source(B:L255, 彼はじっと僕の顔を…表情を感じた。)
- dialogue source(B:L257 整行) speaker 我
- source(B:L259, 僕は挑戦的に話しかけた。)／source(B:L259, （この勇気に乏しい癖に…一つだった）)（含括號）／source(B:L259, すると彼は微笑しながら…尋ね返した。)（「どこ、君の部屋は？」嵌於地の文，整句收錄）

### ch3_room_women（choice）
- source(B:L261, 僕等は親友のように…帰って行った。)／source(B:L261, 彼は僕の部屋へ来ると…話し出した。)／source(B:L261, いろいろのことを？――しかし…女の話だった。)／source(B:L261, 僕は罪を犯した為に…憂鬱にした。)
- choice A「化作一時的清教徒，譏諷那些女人。」（正典）→ ch3_s_ko；flag ch03.mocked
- choice B「忍住不開口。」→ ch3_hold_tongue；flag ch03.held_tongue

### ch3_hold_tongue（分支B，auto → ch3_s_ko）
- added narration：話題繞來繞去還是回到女人身上，我終究開了口（標added，中性橋接）。

### ch3_s_ko（auto → ch3_kiss_reply）
- source(B:L261, 僕は一時的清教徒になり、それ等の女を嘲り出した。)
- dialogue source(B:L263 整行) speaker 我（Ｓ子さんの唇…）
- source(B:L265, 僕はふと口を噤み…見つめた。)／source(B:L265, 彼は丁度耳の下に…貼りつけていた。)
- notebook { key:"ch03.mirror_watch", symbol:"gear", desc:"鏡中他的背影——耳下貼著黃色膏藥。他在監視我" }；insight+1

### ch3_kiss_reply（auto → ch3_anya）
- dialogue source(B:L267 整行) speaker 彫刻家／dialogue source(B:L269 整行) speaker 我
- source(B:L271, 彼は微笑して頷いていた。…注意しているのを感じた。)／source(B:L271, けれどもやはり僕等の話は…いられなかった。)
- links: { fold:"── 彫刻家 · 鏡 ──" }

### ch3_anya（auto → ch3_gears_return）
- source(B:L273, やっと彼の帰った後…読みはじめた。)／source(B:L273, 主人公の精神的闘争は…痛切だった。)／source(B:L273, 僕はこの主人公に比べると…流していた。)／source(B:L273, 同時に又涙は…与えていた。)

### ch3_gears_return（choice）
- source(B:L273, が、それも長いことではなかった。…感じ出した。)／source(B:L273, 歯車はやはりまわりながら…殖やして行った。)
- choice A「在齒輪淹沒視野之前，數它們的數量。」→ ch3_gears_count；flag ch03.counted_gears；insight+1
- choice B「立刻吞下佛羅拿。」→ ch3_veronal；flag ch03.swallowed_fast
- effects: nerve −1（reason: 齒輪，再一次）

### ch3_gears_count（分支A，auto → ch3_veronal）
- added inner：數不清。它們增殖的速度比我數的速度快（標added）。

### ch3_veronal（auto → ch3_dream_pool）
- source(B:L273, 僕は頭痛のはじまることを恐れ…眠ることにした。)
- links: { visit:"ch03.hotel_room", fold:"── 暗夜行路 · 歯車 ──" }

### ch3_dream_pool（auto → ch3_dream_platform）※夢境無選擇
- break＋source(B:L275, けれども僕は夢の中に…眺めていた。)／source(B:L275, そこには又男女の子供たちが…していた。)／source(B:L275, 僕はこのプウルを後ろに…歩いて行った。)／source(B:L275, すると誰か後ろから…声をかけた。)／source(B:L275, 僕はちょっとふり返り…見つけた。)／source(B:L275, 同時に又烈しい後悔を感じた。)
- dialogue source(B:L277 整行) speaker 妻/wife／dialogue source(B:L279 整行) speaker 我
- notebook { key:"ch03.dream_wife", symbol:"wing", desc:"夢裡的泳池——妻喊我『孩子的爸』。我感到劇烈的後悔" }

### ch3_dream_platform（auto → ch3_dream_train）
- source(B:L281, 僕は又歩みをつづけ出した。…変っていた。)／source(B:L281, それは田舎の停車場だったと見え…プラットフォオムだった。)／source(B:L281, そこには又Ｈと云う大学生や…話しかけた。)
- dialogue source(B:L283 整行) speaker 年老的女人/old_woman／dialogue source(B:L285 整行) speaker Ｈ/student_h

### ch3_dream_train（auto → ch3_wake）
- source(B:L287, 僕はこの年をとった女に…感じた。)／source(B:L287, のみならず彼女と話していることに…感じた。)／source(B:L287, そこへ汽車は煙をあげながら…横づけになった。)／source(B:L287, 僕はひとりこの汽車に乗り…歩いて行った。)／source(B:L287, すると或寝台の上に…横になっていた。)／source(B:L287, それは又僕の復讐の神、――或狂人の娘に違いなかった。……)
- notebook { key:"ch03.mummy", symbol:"raincoat", desc:"寢台上近乎木乃伊的裸女——我的復仇之神，某個狂人的女兒" }
- effects: nerve −1（reason: 復讐の神の姿）；links: { unlock:"ch03.mummy" }

### ch3_wake（auto → ch3_sanji_han）
- source(B:L289, 僕は目を醒ますが早いか…飛び下りていた。)／source(B:L289, 僕の部屋は不相変…明るかった。)／source(B:L289, が、どこかに翼の音や…聞えていた。)／source(B:L289, 僕は戸をあけて廊下へ出…急いで行った。)／source(B:L289, それから椅子に腰をおろしたまま…眺め出した。)／source(B:L289, そこへ白い服を着た給仕が…歩み寄った。)
- notebook { key:"ch03.wing_rat", symbol:"wing", desc:"深夜三點的房間——翅膀的聲音，還有老鼠的吱鳴" }
- links: { fold:"── 夢 · 復讐の神 ──", unlock:"ch03.wing_rat" }

### ch3_sanji_han（auto → ch3_lobby）
- dialogue source(B:L291 整行「何時？」) speaker 我／dialogue source(B:L293 整行) speaker 給仕/hotel_waiter

### ch3_lobby（choice）
- source(B:L295, しかし向うのロッビイの隅には…読みつづけた。)
- choice A「望著那個讀書的女人。」→ ch3_green_stare；flag ch03.watched_green；insight+1；notebook { key:"ch03.green_dress", symbol:"book", desc:"凌晨的大廳——讀著書的美國女人，遠遠望去也是綠色的洋裝" }；links unlock ch03.green_dress
- choice B「閉上眼睛等天亮。」→ ch3_end_wait；flag ch03.closed_eyes

### ch3_green_stare（分支A，auto → ch3_end_wait）
- source(B:L295, 彼女の着ているのは…違いなかった。)

### ch3_end_wait（auto，showEnd）
- source(B:L295, 僕は何か救われたのを感じ…待つことにした。)／source(B:L295, 長年の病苦に悩み抜いた…老人のように。……)
- system「第三章「夜」 終」；effects insight+1（reason: 等待天明）；links: { showEnd: true }

## 3. connections（6）

```js
{ id:"ch03.yellow_circuit", requires:["ch02.nemesis","ch03.yellow_cover"], title:"黃色的書皮", subtitle:"希臘神話から伝説へ", icon:"◈", insightGain:1 },
{ id:"ch03.gear_multiply", requires:["gear_first","ch03.gear_faces"], title:"有眼鼻的齒輪", subtitle:"視野の外にも、書物の中にも", icon:"◉", insightGain:2 },  // 跨章 CH1
{ id:"ch03.hanfeizi", requires:["ch03.juryo","ch03.dragon_slay"], title:"韓非子的迴路", subtitle:"寿陵余子と屠竜の技", icon:"◇", insightGain:1 },
{ id:"ch03.nemesis_shape", requires:["ch02.nemesis","ch03.mummy"], title:"復讐之神現形", subtitle:"ツォイスも敵わぬ神、寝台の上に", icon:"✶", insightGain:2 },
{ id:"ch03.wing_again", requires:["wing_corridor","ch03.wing_rat"], title:"翼の音、再び", subtitle:"第一夜から続くもの", icon:"✦", insightGain:1 },  // 跨章 CH1
{ id:"ch03.green_omen", requires:["ch02.yellow_taxi","ch03.green_dress"], title:"綠色＝吉兆", subtitle:"緑の車、緑のドレッス", icon:"◈", insightGain:1 },
```

symbols.js CH3 區：上列 notebook keys（yellow_cover / gear_faces / four_enemies / juryo / dragon_slay / napoleon / hell_aphorism / mirror_watch / dream_wife / mummy / wing_rat / green_dress）補 glyph。

## 4. 前置與驗收

- 前置：docs/chapter03-spec.md 檔頭加註「場景切分以 docs/ch3-source-map.md 為準（引用可信，可作 cn 參考）」。registry 註冊 CHAPTER_03。
- 驗收：四綠；CH3 coverage ≥ 99%；playthrough 全通；跨章 connections（gear_multiply / wing_again 依賴 CH1 無前綴 key）比照 ch02.raincoat_returns 補 real-data 測試；DEV-LOG 補 F6＋F7 條目（**F6 的也在本批記**）。
