# CH5「赤光」重切施工圖（Batch F9）

> 狀態：定案（2026-07-12，Fable）。**docs/chapter05-spec.md 的「赤光池塘／穿寢衣老婦／死鼴鼠」段整段是幻覺（audit §1c-5），且漏掉章題眼《赤光》歌集**——本圖取代之。
> 底本：B:L369–L461。全域政策沿用 ch1-source-map §0；cn 第一人稱（D12）。

## 1. 骨架

```js
chapter: 5, title: "赤光", titleCn: "赤光",
startScene: "ch5_prologue", startLocation: "ch05.hotel_room", sceneCount: 38,
```

- speakerId：`hermit`（屋根裏の老人）／`barman`（地下室侍者）／`journalist_a`・`journalist_b`（法語記者）／`hotel_waiter`；主角 `protagonist`（「我」）。
- **nerve 預算**：CH4 章末 ≈0。開場 **+2**（蟄居寫作的固定節奏）；正典 −1×3（赤光燈籠／《赤光》歌集信／卡拉馬助夫訂錯頁）→ 章末 ≈0（黎明鄉愁）。
- locations（5）：ch05.hotel_room（ホテル・カアテンの内）rect, symbolKey ch05.mole_curtain／ch05.attic（聖書会社の屋根裏）mountain, symbolKey ch05.unicorn／ch05.bar_street（夜の往来・赤光）circle, symbolKey ch05.red_lantern／ch05.basement（地下室のバア）rect, symbolKey ch05.bw_whiskey／ch05.canal（運河・達磨船）circle, symbolKey ch05.darma_boat。

## 2. 場景逐一（38 場景，7 選擇點）

### ch5_prologue（auto → ch5_taine）
- system「第五章　赤光」＋system「——赤光——」＋break
- source(B:L369, 日の光は僕を苦しめ出した。)／source(B:L369, 僕は実際鼴鼠のように…つづけて行った。)
- effects: nerve +2（reason: 窗簾內的固定節奏）；notebook { key:"ch05.mole_curtain", symbol:"gear", desc:"拉下窗簾、白天也點著燈——我像鼴鼠一樣活著" }；links: { visit:"ch05.hotel_room", unlock:"ch05.mole_curtain" }

### ch5_taine（choice）
- source(B:L369, それから仕事に疲れると…目を通した。)／source(B:L369, 彼等はいずれも不幸だった。)／source(B:L369, エリザベス朝の巨人たちさえ…陥っていた。)
- choice A「品味這份殘酷的歡喜。」→ ch5_cruel_joy；flag ch05.savored；insight+1
- choice B「合上文學史。」→ ch5_hermit_visit；flag ch05.closed_taine

### ch5_cruel_joy（分支A，auto → ch5_hermit_visit）
- source(B:L369, 僕はこう云う彼等の不幸に…いられなかった。)

### ch5_hermit_visit（auto → ch5_hermit_questions）
- source(B:L371, 或東かぜの強い夜、（それは僕には善い徴だった）僕は地下室を抜けて…尋ねることにした。)（含括號）／source(B:L371, 彼は或聖書会社の屋根裏に…精進していた。)／source(B:L371, 僕等は火鉢に手をかざしながら…話し合った。)
- links: { visit:"ch05.attic", fold:"── カアテンの内 ──" }

### ch5_hermit_questions（auto → ch5_gardener_girl）
- source(B:L371, なぜ僕の母は発狂したか？…なぜ又僕は罰せられたか？――それ等の秘密を知っている彼は…僕の相手をした。)／source(B:L371, のみならず時々短い言葉に…描いたりした。)／source(B:L371, 僕はこの屋根裏の隠者を…行かなかった。)／source(B:L371, しかし彼と話しているうちに…発見した。――)
- notebook { key:"ch05.hermit", symbol:"book", desc:"聖書會社閣樓的隱者——知道我為何受罰的人。但他也被親和力驅動著" }

### ch5_gardener_girl（auto → ch5_unicorn）
- dialogue source(B:L373 整行) speaker 老人/hermit／dialogue source(B:L375 整行「いくつ？」) speaker 我／dialogue source(B:L377 整行) speaker 老人

### ch5_unicorn（choice）
- source(B:L379, それは彼には父らしい愛で…かも知れなかった。)／source(B:L379, しかし僕は彼の目の中に…いられなかった。)／source(B:L379, のみならず彼の勧めた林檎は…現していた。)
- choice A「細看那顆蘋果的紋路。」→ ch5_apple_look；flag ch05.saw_unicorn；insight+1；notebook { key:"ch05.unicorn", symbol:"book", desc:"蘋果泛黃的皮上現出一角獸——麒麟。批評家叫過我『九百十年代的麒麟兒』" }；links unlock ch05.unicorn
- choice B「把蘋果放下。」→ ch5_faith_talk；flag ch05.put_down

### ch5_apple_look（分支A，auto → ch5_faith_talk）
- source(B:L379, （僕は木目や珈琲茶碗の亀裂に…発見していた）)（含括號）／source(B:L379, 一角獣は麒麟に違いなかった。)／source(B:L379, 僕は或敵意のある批評家の…感じた。)

### ch5_faith_talk（auto → ch5_devil_talk）
- dialogue source(B:L381 整行) speaker 老人／dialogue source(B:L383 整行) speaker 我／dialogue source(B:L385 整行) speaker 老人／dialogue source(B:L387 整行) speaker 我／dialogue source(B:L389 整行) speaker 老人

### ch5_devil_talk（auto → ch5_miracles）
- dialogue source(B:L391 整行「悪魔を信じることは…」) speaker 我／dialogue source(B:L393 整行) speaker 老人／dialogue source(B:L395 整行「しかし光のない暗も…」) speaker 我／dialogue source(B:L397 整行「光のない暗とは？」) speaker 老人
- source(B:L399, 僕は黙るより外はなかった。)／source(B:L399, 彼もまた僕のように…信じていた。)／source(B:L399, 僕等の論理の異るのは…一点だけだった。)／source(B:L399, しかしそれは少くとも…違いなかった。……)
- notebook { key:"ch05.dark_no_light", symbol:"raincoat", desc:"『沒有光的暗也是存在的吧』——他答不上來，我也沉默了。跨不過去的溝" }；insight+1

### ch5_miracles（auto → ch5_dostoevsky）
- dialogue source(B:L401 整行) speaker 老人／dialogue source(B:L403 整行) speaker 我／dialogue source(B:L405 整行) speaker 老人
- source(B:L407, 僕はこの一二年の間…誘惑を感じた。)／source(B:L407, が、彼から妻子に伝わり…行かなかった。)

### ch5_dostoevsky（auto → ch5_dark_streets）
- dialogue source(B:L409 整行「あすこにあるのは？」) speaker 我／source(B:L411 整段)（牧羊神表情）／dialogue source(B:L413 整行) speaker 老人
- source(B:L415, 僕は勿論十年前にも…親しんでいた。)／source(B:L415, が、偶然（？）彼の言った…帰ることにした。)（含括號）
- notebook { key:"ch05.crime_punish", symbol:"book", desc:"隱者借我的《罪與罰》——偶然（？）這個詞打動了我" }

### ch5_dark_streets（auto → ch5_bar_retreat）
- source(B:L415, 電燈の光に輝いた…不快だった。)／source(B:L415, 殊に知り人に遇うことは…違いなかった。)／source(B:L415, 僕は努めて暗い往来を選び…歩いて行った。)
- links: { visit:"ch05.bar_street", fold:"── 屋根裏の隠者 ──" }

### ch5_bar_retreat（auto → ch5_red_lantern）
- source(B:L417, しかし僕は暫らくの後…感じ出した。)／source(B:L417, この痛みを止めるものは…あるだけだった。)／source(B:L417, 僕は或バアを見つけ…はいろうとした。)／source(B:L417, けれども狭いバアの中には…飲んでいた。)／source(B:L417, のみならず彼等のまん中には…弾きつづけていた。)／source(B:L417, 僕は忽ち当惑を感じ…引き返した。)

### ch5_red_lantern（choice）
- source(B:L417, するといつか僕の影の…発見した。)／source(B:L417, しかも僕を照らしているのは…赤い光だった。)／source(B:L417, 僕は往来に立ちどまった。)／source(B:L417, けれども僕の影は…動いていた。)
- effects: nerve −1（reason: 赤い光）
- choice A「回頭，找出光的來源。」（正典）→ ch5_lantern_stare；flag ch05.turned；notebook { key:"ch05.red_lantern", symbol:"fire", desc:"照著我的影子左右搖晃的，是不祥的赤紅的光——酒吧簷下的彩色玻璃燈籠" }；links unlock ch05.red_lantern
- choice B「不要回頭，往前走。」→ ch5_basement；flag ch05.no_turn（added 過場：終究還是回了頭——標added 一句後接同 A 的 source？**不**：B 分支不收 L417 尾句，直接進 ch5_basement；A 分支收）

### ch5_lantern_stare（分支A，auto → ch5_basement）
- source(B:L417, 僕は怯ず怯ずふり返り…発見した。)／source(B:L417, ランタアンは烈しい風の為に…動いていた。……)

### ch5_basement（auto → ch5_journalists）
- source(B:L419 整段)／dialogue source(B:L421 整行) speaker 侍者/barman
- source(B:L423, 僕は曹達水の中に…飲みはじめた。)
- notebook { key:"ch05.bw_whiskey", symbol:"book", desc:"地下室的酒吧只有一種威士忌——Black and White" }
- links: { visit:"ch05.basement" }

### ch5_journalists（choice）
- source(B:L423, 僕の鄰には新聞記者らしい…話していた。)／source(B:L423, のみならず仏蘭西語を使っていた。)／source(B:L423, 僕は彼等に背中を向けたまま…感じた。)／source(B:L423, それは実際電波のように…ものだった。)／source(B:L423, 彼等は確かに僕の名を知り…しているらしかった。)
- choice A「豎起耳朵。」→ ch5_listen；flag ch05.listened；insight+1；notebook { key:"ch05.french_whisper", symbol:"gear", desc:"背後的法語像電波竄過全身——他們在議論我" }
- choice B「別過頭去。」→ ch5_french；flag ch05.tried_ignore

### ch5_listen（分支A，auto → ch5_french）
- added inner：不想聽。但每一個音節都自己鑽進耳朵裡（標added）。

### ch5_french（auto → ch5_raskolnikov）
- dialogue source(B:L425 整行) speaker 記者/journalist_a／dialogue source(B:L427 整行) speaker 記者/journalist_b／dialogue source(B:L429 整行) speaker 記者/journalist_a
-（cn 附法語直譯：好……很糟……為什麼？／為什麼？……惡魔已經死了！……／對，對……地獄的……）

### ch5_raskolnikov（auto → ch5_icarus）
- source(B:L431, 僕は銀貨を一枚投げ出し、（それは僕の持っている最後の一枚の銀貨だった）この地下室の外へ…ことにした。)（含括號）／source(B:L431, 夜風の吹き渡る往来は…丈夫にした。)／source(B:L431, 僕はラスコルニコフを思い出し…感じた。)／source(B:L431, が、それは僕自身の外にも…違いなかった。)／source(B:L431, のみならずこの欲望さえ…疑わしかった。)／source(B:L431, 若し僕の神経さえ…行かなければならなかった。)／source(B:L431, マドリッドへ、リオへ、サマルカンドへ、……)

### ch5_icarus（choice）
- source(B:L433, そのうちに或店の軒に吊った…不安にした。)／source(B:L433, それは自動車のタイアアに…描いたものだった。)／source(B:L433, 僕はこの商標に人工の翼を…思い出した。)／source(B:L433, 彼は空中に舞い上った揚句…溺死していた。)
- notebook { key:"ch05.icarus", symbol:"wing", desc:"輪胎商標上的人工翼——騰空的希臘人被太陽燒掉翅膀，溺死在海裡" }；links unlock（無需）
- choice A「想起被復仇之神追趕的俄瑞斯忒斯。」→ ch5_orestes；flag ch05.orestes；insight+1
- choice B「移開視線。」→ ch5_canal；flag ch05.eyes_away

### ch5_orestes（分支A，auto → ch5_canal）
- source(B:L433, マドリッドへ、リオへ、サマルカンドへ、――僕はこう云う僕の夢を…行かなかった。)／source(B:L433, 同時に又復讐の神に追われた…行かなかった。)

### ch5_canal（auto → ch5_merimee_mask）
- source(B:L435, 僕は運河に沿いながら…歩いて行った。)／source(B:L435, そのうちに或郊外にある…思い出した。)／source(B:L435, 養父母は勿論僕の帰るのを…違いなかった。)／source(B:L435, 恐らくは僕の子供たちも、――しかし僕はそこへ帰ると…いられなかった。)／source(B:L435, 運河は波立った水の上に…横づけにしていた。)／source(B:L435, その又達磨船は…洩らしていた。)／source(B:L435, そこにも何人かの男女の家族は…違いなかった。)／source(B:L435, やはり愛し合う為に憎み合いながら。……)／source(B:L435, が、僕はもう一度戦闘的精神を…帰ることにした。)
- notebook { key:"ch05.darma_boat", symbol:"fire", desc:"達磨船底透出的薄光——那裡也有一家人生活著。為了相愛而互相憎恨" }
- links: { visit:"ch05.canal", fold:"── 赤光 · Black and White ──" }

### ch5_merimee_mask（auto → ch5_mail）
- source(B:L437, 僕は又机に向い…読みつづけた。)／source(B:L437, それは又いつの間にか…与えていた。)／source(B:L437, しかし僕は晩年のメリメエの…感じ出した。)／source(B:L437, 彼もまたやはり僕等のように…一人だった。)／source(B:L437, 暗の中を？――「暗夜行路」は…変りはじめた。)／source(B:L437, 僕は憂鬱を忘れる為に…読みはじめた。)／source(B:L437, が、この近代の牧羊神も…荷っていた。……)
- notebook { key:"ch05.merimee_mask", symbol:"book", desc:"梅里美晚年成了新教徒——面具背後的臉。他也走在暗中" }；insight+1；links: { visit:"ch05.hotel_room" }

### ch5_mail（auto → ch5_mail2）
- source(B:L439, 一時間ばかりたった後…顔を出した。)／source(B:L439, それ等の一つはライプツィッヒの…ものだった。)／source(B:L439, なぜ彼等は特に僕に…のであろう？)／source(B:L439, のみならずこの英語の手紙は…加えていた。)／source(B:L439, 僕はこう云う一行に…破ってしまった。)
- notebook { key:"ch05.bw_letter", symbol:"book", desc:"萊比錫的信附了一句手寫 P.S.——『黑與白』。跟那瓶威士忌同名" }

### ch5_mail2（auto → ch5_shakko）
- source(B:L439, それから今度は手当り次第に…目を通した。)／source(B:L439, この手紙を書いたのは…青年だった。)／source(B:L439, しかし二三行も読まないうちに…措かなかった。)／source(B:L439, 三番目に封を切った手紙は…来たものだった。)／source(B:L439, 僕はやっと一息つき…読んで行った。)／source(B:L439, けれどもそれさえ最後へ来ると…打ちのめした。)

### ch5_shakko（auto → ch5_lobby_airship）
- narration source(B:L441 整行含括號「歌集『赤光』の再版を送りますから……」)
- source(B:L443, 赤光！　僕は何ものかの冷笑を感じ…避難することにした。)
- effects: nerve −1（reason: 赤光——連信裡都是）
- notebook { key:"ch05.shakko_letter", symbol:"fire", desc:"外甥的信在最後打倒了我——『《赤光》歌集再版，寄給您』" }；links: { unlock:"ch05.shakko_letter" }

### ch5_lobby_airship（auto → ch5_red_dress）
- source(B:L443, 廊下には誰も人かげはなかった。)／source(B:L443, 僕は片手に壁を抑え…歩いて行った。)／source(B:L443, それから椅子に腰をおろし…移すことにした。)／source(B:L443, 巻煙草はなぜかエエア・シップだった。)／source(B:L443, （僕はこのホテルへ落ち着いてから…吸うことにしていた）)（含括號）／source(B:L443, 人工の翼はもう一度…浮かび出した。)／source(B:L443, 僕は向うにいる給仕を呼び…貰うことにした。)／source(B:L443, しかし給仕を信用すれば…品切れだった。)
- dialogue source(B:L445 整行) speaker 給仕/hotel_waiter
- notebook { key:"ch05.airship", symbol:"wing", desc:"手上的菸不知何時成了 Airship——人工的翼又一次浮現眼前。Star 偏偏缺貨" }

### ch5_red_dress（auto → ch5_townshead）
- source(B:L447, 僕は頭を振ったまま…眺めまわした。)／source(B:L447, 僕の向うには外国人が…話していた。)／source(B:L447, しかも彼等の中の一人、――赤いワン・ピイスを着た女は…見ているらしかった。)

### ch5_townshead（auto → ch5_karamazov）
- inner source(B:L449 整行含括號「Mrs. Townshead……」)
- source(B:L451, 何か僕の目に見えないものは…囁いて行った。)／source(B:L451, ミセス・タウンズヘッドなどと云う名は…ものだった。)／source(B:L451, たとい向うにいる女の名にしても、――僕は又椅子から立ち上り…帰ることにした。)

### ch5_karamazov（choice）
- source(B:L453, 僕は僕の部屋へ帰ると…つもりだった。)／source(B:L453, が、そこへはいることは…変らなかった。)／source(B:L453, 僕はさんざんためらった後…読みはじめた。)／source(B:L453, しかし偶然開いた頁は…一節だった。)／source(B:L453, 僕は本を間違えたのかと思い…目を落した。)／source(B:L453, 「罪と罰」――本は「罪と罰」に違いなかった。)
- effects: nerve −1（reason: 訂錯頁的書——命運的手指）
- notebook { key:"ch05.karamazov", symbol:"gear", desc:"《罪與罰》裡訂進了《卡拉馬助夫兄弟》的一節——而我偏偏翻開了那一頁" }
- choice A「讀下去。」（正典）→ ch5_ivan；flag ch05.read_on
- choice B「闔上書。」→ ch5_book_close；flag ch05.tried_close

### ch5_book_close（分支B，auto → ch5_ivan）
- added narration：手不聽使喚。終究還是讀了下去（標added）。

### ch5_ivan（auto → ch5_desperate_writing）
- source(B:L453, 僕はこの製本屋の綴じ違えに…読んで行った。)／source(B:L453, けれども一頁も読まないうちに…感じ出した。)／source(B:L453, そこは悪魔に苦しめられる…一節だった。)／source(B:L453, イヴァンを、ストリントベルグを…僕自身を。……)

### ch5_desperate_writing（auto → ch5_diable）
- source(B:L455, こう云う僕を救うものは…あるだけだった。)／source(B:L455, しかし催眠剤はいつの間にか…なくなっていた。)／source(B:L455, 僕は到底眠らずに…堪えなかった。)／source(B:L455, が、絶望的な勇気を生じ…動かすことにした。)／source(B:L455, 二枚、五枚、七枚、十枚、――原稿は見る見る…行った。)／source(B:L455, 僕はこの小説の世界を…満たしていた。)／source(B:L455, のみならずその動物の一匹に…描いていた。)／source(B:L455, けれども疲労は徐ろに…曇らせはじめた。)／source(B:L455, 僕はとうとう机の前を離れ…仰向けになった。)／source(B:L455, それから四五十分間は眠ったらしかった。)／source(B:L455, しかし又誰か僕の耳に…立ち上った。)
- links: { fold:"── 赤いワン・ピイス · 綴じ違え ──" }

### ch5_diable（auto → ch5_dawn_window）
- inner source(B:L457 整行含括號「Le diable est mort」)
- notebook { key:"ch05.diable_dream", symbol:"raincoat", desc:"睡了不到一小時，有誰在耳邊低語——『惡魔已經死了』。地下室的法語又回來了" }

### ch5_dawn_window（choice）
- source(B:L459, 凝灰岩の窓の外は…明けかかっていた。)／source(B:L459, 僕は丁度戸の前に佇み…眺めまわした。)／source(B:L459, すると向うの窓硝子は…現していた。)／source(B:L459, それは黄ばんだ松林の向うに…違いなかった。)
- choice A「在窗前多待一會。」→ ch5_window_linger；flag ch05.lingered；insight+1
- choice B「開始收拾行李。」→ ch5_ending；flag ch05.packed_fast

### ch5_window_linger（分支A，auto → ch5_ending）
- source(B:L459, 僕は怯ず怯ず窓の前へ近づき…発見した。)／source(B:L459, けれども僕の錯覚は…呼び起していた。)

### ch5_ending（auto，showEnd）
- source(B:L461, 僕は九時にでもなり次第…決心をした。)／source(B:L461, 机の上に置いた鞄の中へ…押しこみながら。)
- system「第五章「赤光」 終」；effects insight+1（reason: 回家的決心）；links: { showEnd: true }

## 3. connections（6）

```js
{ id:"ch05.mole_self", requires:["ch04.la_mort","ch05.mole_curtain"], title:"鼴鼠——我自己", subtitle:"Mole、la mort、カアテンの内", icon:"◉", insightGain:2 },
{ id:"ch05.kirin_child", requires:["book_worm","ch05.unicorn"], title:"麒麟児", subtitle:"一角獣、林檎の皮の上に", icon:"◈", insightGain:2 },   // 跨章 CH1（麒麟＝一角獸的婚宴對話）
{ id:"ch05.black_white", requires:["ch05.bw_whiskey","ch05.bw_letter"], title:"Black and White", subtitle:"ウイスキイと手紙のＰ・Ｓ", icon:"◇", insightGain:1 },
{ id:"ch05.artificial_wings", requires:["ch05.icarus","ch05.airship"], title:"人工の翼", subtitle:"タイアの商標から煙草の名へ", icon:"✦", insightGain:1 },
{ id:"ch05.red_light", requires:["ch05.red_lantern","ch05.shakko_letter"], title:"赤光", subtitle:"ランタアンの赤、歌集の名", icon:"✶", insightGain:2 },
{ id:"ch05.diable", requires:["ch05.french_whisper","ch05.diable_dream"], title:"Le diable est mort", subtitle:"地下室の仏蘭西語、夢の囁き", icon:"◉", insightGain:2 },
```

## 4. 前置與驗收

- 前置：docs/chapter05-spec.md 檔頭加註「⚠ 第二段（赤光池塘等）為幻覺內容已作廢；場景切分以 docs/ch5-source-map.md 為準」。registry 註冊 CHAPTER_05。symbols.js CH5 區補 glyph（新 symbol 類別無需增——沿用既有）。
- 驗收：四綠；CH5 coverage ≥ 99%；playthrough 全通；跨章 connections real-data 測試；DEV-LOG／README 更新。
- **幻覺清零 grep**：池塘／寢衣／老婦（舊 spec 捏造詞）在 chapter05.js 零命中；《赤光》歌集信必須在場（grep 歌集 命中）。
