# CH4「まだ？」重切施工圖（Batch F8）

> 狀態：定案（2026-07-12，Fable）。**docs/chapter04-spec.md 的舊友場景整段是幻覺（audit §1c-6）**：捏造「兒子自殺未遂」對話、丟失朱舜水/不眠症語言崩解母題——本圖取代之，spec 僅其餘段落 cn 可參考。
> 底本：B:L304–L360。全域政策沿用 ch1-source-map §0；cn 第一人稱（D12）。

## 1. 骨架

```js
chapter: 4, title: "まだ？", titleCn: "還沒？",
startScene: "ch4_prologue", startLocation: "ch04.hotel_room", sceneCount: 28,
```

- speakerId：`old_friend`（應用化學教授）；主角 `protagonist`（speaker「我」）。
- **nerve 預算**：CH3 章末見底（≈0）。開場 **+3**（晨光＋脫稿的滿足）；正典路線 −1×3（朱舜水發音／気違いの息子／la mort）→ 章末回到 ≈0。**本章主題就是語言與自我的崩解，數值曲線配合。**
- locations（4）：ch04.hotel_room（ホテル・脱稿）rect／ch04.ginza（銀座・紙屑の薔薇）circle, symbolKey ch04.rose_scraps／ch04.cafe2（カッフェ・旧友）circle, symbolKey ch04.shushun／ch04.mirror（鏡の前）diamond, symbolKey ch04.doppelganger。

## 2. 場景逐一（28 場景，6 選擇點）

### ch4_prologue（auto → ch4_roses）
- system「第四章　まだ？」＋system「——還沒？——」＋break
- source(B:L304, 僕はこのホテルの部屋に…送ることにした。)／source(B:L304, 尤も僕の原稿料は…足りないものだった。)／source(B:L304, が、僕は僕の仕事を…出かけることにした。)
- effects: nerve +3（reason: 脫稿的早晨）；links: { visit:"ch04.hotel_room" }

### ch4_roses（choice）
- source(B:L306, 冬の日の当ったアスファルトの…ころがっていた。)／source(B:L306, それらの紙屑は光の加減か…そっくりだった。)
- choice A「蹲下來，細看那些紙屑。」→ ch4_roses_look；flag ch04.saw_roses；insight+1；notebook { key:"ch04.rose_scraps", symbol:"book", desc:"冬日柏油路上的紙屑——每一片都像薔薇的花" }；links unlock ch04.rose_scraps
- choice B「逕自走進書店。」→ ch4_bookstore；flag ch04.walked_in
- links: { visit:"ch04.ginza" }

### ch4_roses_look（分支A，auto → ch4_bookstore）
- added inner：連垃圾都向我示好的早晨——這份好意來自哪裡（標added，不劇透）。

### ch4_bookstore（auto → ch4_cafe_pair）
- source(B:L306, 僕は何ものかの好意を感じ…はいって行った。)／source(B:L306, そこもまたふだんよりも小綺麗だった。)／source(B:L306, 唯目金をかけた小娘が…ないこともなかった。)／source(B:L306, けれども僕は往来に落ちた…買うことにした。)

### ch4_cafe_pair（choice）
- source(B:L308, 僕は二冊の本を抱え…待つことにした。)／source(B:L308, 僕の向うには親子らしい…坐っていた。)／source(B:L308, その息子は僕よりも…そっくりだった。)／source(B:L308, のみならず彼等は恋人同志の…話し合っていた。)
- choice A「觀察那對母子。」→ ch4_affinity；flag ch04.watched_pair；insight+1；notebook { key:"ch04.affinity", symbol:"gear", desc:"咖啡館裡的母子像戀人般貼近——親和力，把現世變成地獄的某種意志" }
- choice B「移開視線，翻開書。」→ ch4_merimee；flag ch04.looked_away

### ch4_affinity（分支A，auto → ch4_merimee）
- source(B:L308, 僕は彼等を見ているうちに…気づき出した。)／source(B:L308, それは僕にも覚えのある…一例に違いなかった。)／source(B:L308, 同時に又現世を地獄にする…違いなかった。)

### ch4_merimee（auto → ch4_windows）
- source(B:L308, しかし、――僕は又苦しみに…読みはじめた、)／source(B:L308, 彼はこの書簡集の中にも…閃かせていた。)／source(B:L308, それ等のアフォリズムは…巌畳にし出した。)／source(B:L308, （この影響を受け易いことも…一つだった）)（含括號）／source(B:L308, 僕は一杯の珈琲を飲み了った後…後ろにして行った。)

### ch4_windows（auto → ch4_friend）
- source(B:L310 整段)（貝多芬肖像滑稽）
- notebook { key:"ch04.beethoven", symbol:"book", desc:"額縁店櫥窗——頭髮倒豎、天才本人似的貝多芬。我忍不住覺得滑稽" }

### ch4_friend（auto → ch4_eye_memory）
- source(B:L312 整段)（舊友教授/單眼充血）
- dialogue source(B:L314 整行) speaker 我／dialogue source(B:L316 整行) speaker 舊友/old_friend

### ch4_eye_memory（choice）
- source(B:L318, 僕はふと十四五年以来…思い出した。)
- choice A「把這條規律記下來。」→ ch4_friend_cafe；flag ch04.noted_eye；insight+1；notebook { key:"ch04.conjunctivitis", symbol:"gear", desc:"十四五年來，每當感到親和力，我的眼睛也會像他一樣結膜炎" }
- choice B「什麼都不說。」→ ch4_friend_cafe；flag ch04.said_nothing

### ch4_friend_cafe（auto → ch4_shushun）
- source(B:L318, が、何とも言わなかった。)／source(B:L318, 彼は僕の肩を叩き…話し出した。)／source(B:L318, それから話をつづけたまま…つれて行った。)

### ch4_shushun（auto → ch4_friend_talk）
- dialogue source(B:L320 整行) speaker 舊友／source(B:L322 整段)／dialogue source(B:L324 整行「そうだ。あのシュシュン……」) speaker 我
- source(B:L326, 僕はなぜか朱舜水と云う…出来なかった。)／source(B:L326, それは日本語だっただけに…不安にした。)
- effects: nerve −1（reason: 明明是日語，卻發不出音）
- notebook { key:"ch04.shushun", symbol:"book", desc:"朱舜水——我發不出這個詞的音。它是日語，這讓我不安" }；links: { visit:"ch04.cafe2", unlock:"ch04.shushun", fold:"── 銀座 · 紙屑の薔薇 ──" }

### ch4_friend_talk（auto → ch4_tenkibo）
- source(B:L326, しかし彼は無頓着に…毒瓦斯のことを。……)

### ch4_tenkibo（auto → ch4_insomnia）
- dialogue source(B:L328 整行) speaker 舊友／dialogue source(B:L330 整行「うん、僕の自叙伝だ」) speaker 我／dialogue source(B:L332 整行) speaker 舊友／dialogue source(B:L334 整行) speaker 我

### ch4_insomnia（auto → ch4_madman_son）
- dialogue source(B:L336 整行) speaker 舊友／dialogue source(B:L338 整行) speaker 我／dialogue source(B:L340 整行) speaker 舊友
- source(B:L342, 彼は左だけ充血した目に…浮かべていた。)／source(B:L342, 僕は返事をする前に…感じ出した。)

### ch4_madman_son（auto → ch4_street_faces）
- inner source(B:L344 整行含括號「気違いの息子には当り前だ」)
- effects: nerve −1（reason: 瘋人之子——遺傳的恐懼）
- notebook { key:"ch04.madman_son", symbol:"raincoat", desc:"瘋人的兒子失眠是理所當然——這句話在我心裡自己說了出來" }
- links: { fold:"── 旧友 · 発音できない言葉 ──" }

### ch4_street_faces（choice）
- source(B:L346, 僕は十分とたたないうちに…歩いて行った。)／source(B:L346, アスファルトの上に落ちた紙屑は…見えないことはなかった。)
- choice A「細看那些紙屑——早上它們還是薔薇。」→ ch4_faces_look；flag ch04.saw_faces；insight+1；notebook { key:"ch04.paper_faces", symbol:"gear", desc:"同一條路上的紙屑——早上像薔薇，現在像人的臉" }
- choice B「別開目光。」→ ch4_woman；flag ch04.averted

### ch4_faces_look（分支A，auto → ch4_woman）
- added inner：同樣的紙屑。變的不是它們（標added）。

### ch4_woman（choice）
- source(B:L346, すると向うから断髪にした女が…通りかかった。)／source(B:L346, 彼女は遠目には美しかった。)／source(B:L346, けれども目の前へ来たのを見ると…していた。)／source(B:L346, のみならず妊娠しているらしかった。)
- choice A「回頭再看一眼。」→ ch4_woman_look；flag ch04.looked_back
- choice B「快步彎進橫町。」→ ch4_hemorrhoid；flag ch04.turned_away

### ch4_woman_look（分支A，auto → ch4_hemorrhoid）
- added narration：她已經走遠了。遠遠望去，又是美的（標added——遠美近醜的回文）。

### ch4_hemorrhoid（auto → ch4_writing）
- source(B:L346, 僕は思わず顔をそむけ…曲って行った。)／source(B:L346, が、暫らく歩いているうちに…感じ出した。)／source(B:L346, それは僕には坐浴より外に…痛みだった。)
- inner source(B:L348 整行含括號「坐浴、――ベエトオヴェンも…」)
- source(B:L350, 坐浴に使う硫黄の匂いは…襲い出した。)／source(B:L350, しかし勿論往来には…見えなかった。)／source(B:L350, 僕はもう一度紙屑の薔薇の花を…歩いて行った。)
- notebook { key:"ch04.sulfur", symbol:"gear", desc:"街上撲鼻而來的硫磺味——街上哪裡都沒有硫磺" }

### ch4_writing（auto → ch4_phone_mole）
- source(B:L352, 一時間ばかりたった後…とりかかっていた。)／source(B:L352, ペンは僕にも不思議だったくらい…走って行った。)／source(B:L352, しかしそれも二三時間の後には…とまってしまった。)／source(B:L352, 僕はやむを得ず机の前を離れ…歩きまわった。)／source(B:L352, 僕の誇大妄想は…著しかった。)／source(B:L352, 僕は野蛮な歓びの中に…気になっていた。)
- notebook { key:"ch04.pen_life", symbol:"book", desc:"我沒有父母也沒有妻兒，只有從我筆尖流出來的生命" }；insight+1
- links: { visit:"ch04.hotel_room", fold:"── 往来 · 紙屑と硫黄 ──" }

### ch4_phone_mole（auto → ch4_lamort）
- source(B:L354, けれども僕は四五分の後…ならなかった。)／source(B:L354, 電話は何度返事をしても…ばかりだった。)／source(B:L354, が、それはともかくも…違いなかった。)／source(B:L354, 僕はとうとう電話を離れ…歩き出した。)／source(B:L354, しかしモオルと云う言葉だけは…ならなかった。)
- inner source(B:L356 整行含括號「モオル――Mole……」)

### ch4_lamort（auto → ch4_mirror_choice）
- source(B:L358, モオルは鼴鼠と云う英語だった。)／source(B:L358, この聯想も僕には愉快ではなかった。)／source(B:L358, が、僕は二三秒の後、Mole を la mort に綴り直した。)／source(B:L358, ラ・モオルは、――死と云う仏蘭西語は…不安にした。)／source(B:L358, 死は姉の夫に迫っていたように…迫っているらしかった。)／source(B:L358, けれども僕は不安の中にも…感じていた。)／source(B:L358, のみならずいつか微笑していた。)／source(B:L358, この可笑しさは何の為に起るか？――それは僕自身にもわからなかった。)
- effects: nerve −1（reason: la mort）
- notebook { key:"ch04.la_mort", symbol:"raincoat", desc:"Mole——鼴鼠——la mort。死，像逼近姊夫那樣逼近我。而我竟在微笑" }

### ch4_mirror_choice（choice）
- choice A「走到鏡子前，正面看。」（正典）→ ch4_mirror；flag ch04.faced_mirror
- choice B「不要看鏡子。」→ ch4_mirror_hesitate；flag ch04.hesitated
-（本場景無新文本，僅承接上場景的沉默；可放一個 break）

### ch4_mirror_hesitate（分支B，auto → ch4_mirror）
- added narration：猶豫了一會兒，我終究還是站到了鏡子前（標added）。

### ch4_mirror（auto → ch4_desk_return）
- source(B:L358, 僕は久しぶりに鏡の前に立ち…向い合った。)／source(B:L358, 僕の影も勿論微笑していた。)／source(B:L358, 僕はこの影を見つめているうちに…思い出した。)／source(B:L358, 第二の僕、――独逸人の所謂 Doppel gaenger は…見えたことはなかった。)／source(B:L358, しかし亜米利加の映画俳優になった…見かけていた。)／source(B:L358, （僕は突然Ｋ君の夫人に…覚えている）)（含括號）／source(B:L358, それからもう故人になった…見かけていた。)／source(B:L358, 死は或は僕よりも…かも知れなかった。)
- notebook { key:"ch04.doppelganger", symbol:"raincoat", desc:"第二個我——K 君夫人在帝劇走廊、獨腳翻譯家在銀座菸草店都見過。死也許先找上他" }；insight+1；links: { visit:"ch04.mirror", unlock:"ch04.doppelganger" }

### ch4_desk_return（auto，showEnd）
- source(B:L358, 若し又僕に来たとしても、――僕は鏡に後ろを向け…帰って行った。)
- source(B:L360, 四角に凝灰岩を組んだ窓は…覗かせていた。)／source(B:L360, 僕はこの庭を眺めながら…思い出した。)／source(B:L360, それからペンをとり上げると…書きはじめた。)
- notebook { key:"ch04.burned_notes", symbol:"book", desc:"遠方松林裡燒掉的幾冊筆記、未完成的戲曲——我又一次開始寫新的小說" }
- system「第四章「まだ？」 終」；effects insight+1（reason: 還沒。）；links: { showEnd: true, fold:"── 鏡 · 第二の僕 ──" }

## 3. connections（6）

```js
{ id:"ch04.affinity_eye", requires:["ch04.affinity","ch04.conjunctivitis"], title:"親和力", subtitle:"目は結膜炎を起す", icon:"◇", insightGain:1 },
{ id:"ch04.roses_faces", requires:["ch04.rose_scraps","ch04.paper_faces"], title:"紙屑——薔薇與人臉", subtitle:"変ったのは紙屑ではない", icon:"◈", insightGain:1 },
{ id:"ch04.word_betrayal", requires:["ch04.shushun","ch04.la_mort"], title:"詞語的背叛", subtitle:"発音できない、綴り直される", icon:"◉", insightGain:2 },
{ id:"ch04.death_approach", requires:["raincoat_death","ch04.la_mort"], title:"死、迫って来る", subtitle:"姉の夫に迫っていたように", icon:"✶", insightGain:2 },   // 跨章 CH1
{ id:"ch04.second_me", requires:["ch03.mirror_watch","ch04.doppelganger"], title:"鏡中的存在", subtitle:"見つめる者、見られる者", icon:"✦", insightGain:1 },       // 跨章 CH3
{ id:"ch04.sitz_bath", requires:["ch04.beethoven","ch04.sulfur"], title:"貝多芬也坐浴", subtitle:"滑稽と硫黄", icon:"◇", insightGain:1 },
```

## 4. 前置與驗收

- 前置：docs/chapter04-spec.md 檔頭加註「⚠ 舊友場景為幻覺內容已作廢；場景切分以 docs/ch4-source-map.md 為準」。registry 註冊 CHAPTER_04。symbols.js CH4 區補 12 個 key 的 glyph。
- 驗收：四綠；CH4 coverage ≥ 99%；playthrough 全通；跨章 connections real-data 測試；DEV-LOG 補條目；README CH4 更新。
- **幻覺清零 grep**：息子/自殺未遂/暴君（舊 spec 捏造詞）在 chapter04.js 零命中。
