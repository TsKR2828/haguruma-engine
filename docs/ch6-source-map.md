# CH6「飛行機」重切施工圖（Batch F10）

> 狀態：定案（2026-07-12，Fable）。**docs/chapter06-spec.md 的稻荷狐狸信仰／義妹蓚酸毒殺是幻覺（audit §1c-7），且「飛行機病」說話者誤標妻の母（正確＝妻の弟）**——本圖取代之。
> 底本：B:L470–L548。全域政策沿用 ch1-source-map §0；cn 第一人稱（D12）。**F6 的 action/forced 機制已上線，本章終幕使用。**

## 1. 骨架

```js
chapter: 6, title: "飛行機", titleCn: "飛機",
startScene: "ch6_prologue", startLocation: "ch06.road_home", sceneCount: 28,
```

- speakerId：`wife`／`wifes_mother`（妻の母）／`wifes_brother`（妻の弟）；主角 `protagonist`（「我」）。
- **nerve 預算**：CH5 章末 ≈0。ch6_home **+3**（妻子與催眠藥的二三日平和——原文明寫）；正典 −1（史特林堡擦身）−1（烏鴉四聲）−1（鼴鼠死骸）−2（最後の歩行）→ 終幕神經歸零，視覺崩壞全開，配「誰か僕の眠っているうちに…」。
- **設計語言**：選擇點漸稀（4 個，全在前半），**ch6_final_walk 起零選擇**——命運收攏，讀者只剩「不得不做」的 forced steps。
- locations（4）：ch06.road_home（帰り道・葬列）circle, symbolKey ch06.driver_raincoat／ch06.home（僕の家・二階）rect, symbolKey ch06.magpie_joy／ch06.inlaws（妻の実家）rect, symbolKey ch06.airplane_disease／ch06.dunes（砂山・松林）mountain, symbolKey ch06.last_gears。

## 2. 場景逐一（28 場景，4 選擇點）

### ch6_prologue（auto → ch6_funeral）
- system「第六章　飛行機」＋system「——飛機——」＋break
- source(B:L470, 僕は東海道線の或停車場から…飛ばした。)／source(B:L470, 運転手はなぜかこの寒さに…ひっかけていた。)／source(B:L470, 僕はこの暗合を無気味に思い…やることにした。)
- notebook { key:"ch06.driver_raincoat", symbol:"raincoat", desc:"大冷天，司機偏偏披著一件舊雨衣——這個暗合讓我不敢看他" }
- links: { visit:"ch06.road_home", unlock:"ch06.driver_raincoat" }

### ch6_funeral（choice）
- source(B:L470, すると低い松の生えた向うに、――恐らくは古い街道に…みつけた。)／source(B:L470, 白張りの提灯や竜燈は…いないらしかった。)
- choice A「目送那列葬儀。」→ ch6_funeral_watch；flag ch06.watched_funeral；insight+1；notebook { key:"ch06.funeral", symbol:"raincoat", desc:"歸途上的葬列——金銀紙蓮花在靈輿前後靜靜搖著" }
- choice B「把視線收回車內。」→ ch6_home；flag ch06.looked_inside

### ch6_funeral_watch（分支A，auto → ch6_home）
- source(B:L470, が、金銀の造花の蓮は…揺いで行った。……)

### ch6_home（auto → ch6_sepia）
- source(B:L472, やっと僕の家へ帰った後…平和に暮らした。)／source(B:L472, 僕の二階は松林の上に…覗かせていた。)／source(B:L472, 僕はこの二階の机に向かい…することにした。)／source(B:L472, 鳥は鳩や鴉の外に…舞いこんだりした。)／source(B:L472, それもまた僕には愉快だった。)／source(B:L472, 「喜雀堂に入る」――僕はペンを持ったまま…思い出した。)
- effects: nerve +3（reason: 妻子與催眠藥的二三日平和）
- notebook { key:"ch06.magpie_joy", symbol:"wing", desc:"二樓聽得見鴿聲，麻雀飛進簷廊——『喜鵲入堂』。難得的平和" }
- links: { visit:"ch06.home", fold:"── 帰り道 · 葬列 ──" }

### ch6_sepia（auto → ch6_strindberg）
- source(B:L474, 或生暖かい曇天の午後…出かけて行った。)／source(B:L474, するとその店に並んでいるのは…ばかりだった。)／source(B:L474, セピア色のインクは…常としていた。)／source(B:L474, 僕はやむを得ずこの店を出…歩いて行った。)

### ch6_strindberg（auto → ch6_black_dog）
- source(B:L474, そこへ向うから近眼らしい…通りかかった。)／source(B:L474, 彼はここに住んでいる…瑞典人だった。)／source(B:L474, しかも彼の名はストリントベルグだった。)／source(B:L474, 僕は彼とすれ違う時…感じた。)
- effects: nerve −1（reason: 與史特林堡擦身）
- notebook { key:"ch06.strindberg_pass", symbol:"gear", desc:"住在此地的被害妄想狂瑞典人——他的名字偏偏叫史特林堡。擦身時全身像被打到" }

### ch6_black_dog（choice）
- source(B:L476, この往来は僅かに二三町だった。)／source(B:L476, が、その二三町を通るうちに…通って行った。)
- choice A「數牠經過的次數。」→ ch6_dog_count；flag ch06.counted_dog；insight+1；notebook { key:"ch06.half_black_dog", symbol:"gear", desc:"半邊全黑的狗，四度從我身邊經過——Black and White。史特林堡的領帶也是黑白" }
- choice B「加快腳步。」→ ch6_glass_bowl；flag ch06.sped_up

### ch6_dog_count（分支A，auto → ch6_glass_bowl）
- source(B:L476, 僕は横町を曲りながら…思い出した。)／source(B:L476, のみならず今のストリントベルグの…思い出した。)／source(B:L476, それは僕にはどうしても…考えられなかった。)

### ch6_glass_bowl（choice）
- source(B:L476, 若し偶然でないとすれば、――僕は頭だけ歩いているように感じ…立ち止まった。)／source(B:L476, 道ばたには針金の柵の中に…捨ててあった。)
- choice A「蹲下看那只玻璃缽。」→ ch6_bowl_look；flag ch06.saw_bowl；insight+1；notebook { key:"ch06.glass_bowl", symbol:"wing", desc:"廢棄的玻璃缽底浮著翼的紋樣——麻雀們飛下來，一到缽邊卻像約好了似的一齊逃走" }
- choice B「繞開它。」→ ch6_inlaws；flag ch06.walked_around

### ch6_bowl_look（分支A，auto → ch6_inlaws）
- source(B:L476, この鉢は又底のまわりに…浮き上らせていた。)／source(B:L476, そこへ松の梢から…舞い下って来た。)／source(B:L476, が、この鉢のあたりへ来ると…逃げのぼって行った。……)

### ch6_inlaws（auto → ch6_yononaka）
- source(B:L478 整段)（妻の実家/籐椅子/レグホン/黒犬/世間話）
- links: { visit:"ch06.inlaws", fold:"── セピア · 黒白の犬 ──" }

### ch6_yononaka（auto → ch6_hell_houses）
- dialogue source(B:L480 整行) speaker 我／dialogue source(B:L482 整行) speaker 妻の母/wifes_mother／dialogue source(B:L484 整行) speaker 我／dialogue source(B:L486 整行) speaker 妻の母

### ch6_hell_houses（auto → ch6_h_chan）
- source(B:L488, 妻の母はこう言って笑っていた。)／source(B:L488, 実際この避暑地もまた…違いなかった。)／source(B:L488, 僕は僅かに一年ばかりの間に…知り悉していた。)／source(B:L488, 徐ろに患者を毒殺しようとした医者…弁護士、――それ等の人々の家を見ることは…異らなかった。)
- notebook { key:"ch06.hell_houses", symbol:"fire", desc:"避暑地也是『人世』——毒殺病人的醫生、放火的老太婆、奪妹妹財產的律師" }；insight+1

### ch6_h_chan（auto → ch6_brother_joins）
- dialogue source(B:L490 整行) speaker 我／dialogue source(B:L492 整行) speaker 妻の母／dialogue source(B:L494 整行) speaker 我（早発性痴呆／馬頭観世音）

### ch6_brother_joins（auto → ch6_both_poles）
- dialogue source(B:L496 整行) speaker 妻の母／dialogue source(B:L498 整行) speaker 妻の弟/wifes_brother
- source(B:L500 整段)（無精髭／寝床の上／遠慮勝ちに加わる）

### ch6_both_poles（auto → ch6_airplane）
- dialogue source(B:L502 整行) speaker 妻の弟／dialogue source(B:L504 整行) speaker 妻の母
- source(B:L506, 僕はこう言った妻の母を見…行かなかった。)／source(B:L506, すると弟も微笑しながら…話しつづけた。)／source(B:L506, （この若い病後の弟は…見えるのだった）)（含括號）
- dialogue source(B:L508 整行) speaker 妻の弟／dialogue source(B:L510 整行) speaker 我／dialogue source(B:L512 整行) speaker 妻の弟／dialogue source(B:L514 整行) speaker 我／dialogue source(B:L516 整行) speaker 妻の弟
- notebook { key:"ch06.both_poles", symbol:"book", desc:"病後的弟弟像脫離了肉體的精神——『像電的兩極。總之同時擁有相反的東西』" }；insight+1

### ch6_airplane（auto → ch6_airplane_disease）
- source(B:L518, そこへ僕等を驚かしたのは…響きだった。)／source(B:L518, 僕は思わず空を見上げ…発見した。)／source(B:L518, それは翼を黄いろに塗った。珍らしい単葉の飛行機だった。)／source(B:L518, 鶏や犬はこの響きに驚き…逃げまわった。)／source(B:L518, 殊に犬は吠え立てながら…はいってしまった。)

### ch6_airplane_disease（auto → ch6_why_me）
- dialogue source(B:L520 整行) speaker 我／dialogue source(B:L522 整行) speaker **妻の弟**（audit 修正：非妻の母）
- source(B:L524 整段)（頭を振る）
- dialogue source(B:L526 整行) speaker **妻の弟**
- notebook { key:"ch06.airplane_disease", symbol:"wing", desc:"『飛行機病』——一直呼吸高空空氣的人，會漸漸受不了地面上的空氣" }；insight+1

### ch6_why_me（choice）
- source(B:L528, 妻の母の家を後ろにした後…なって行った。)
- choice A「追問那些『為什麼』。」→ ch6_why_ask；flag ch06.asked_why；insight+1
- choice B「甩甩頭，不去想。」→ ch6_gallows；flag ch06.shook_off
- links: { visit:"ch06.dunes", fold:"── 妻の実家 · 飛行機 ──" }

### ch6_why_ask（分支A，auto → ch6_gallows）
- source(B:L528, なぜあの飛行機はほかへ行かずに…通ったのであろう？)／source(B:L528, なぜ又あのホテルは…売っていたのであろう？)／source(B:L528, 僕はいろいろの疑問に苦しみ…歩いて行った。)

### ch6_gallows（auto → ch6_burned_villa）※以下零選擇
- source(B:L530, 海は低い砂山の向うに…曇っていた。)／source(B:L530, その又砂山にはブランコのない…突っ立っていた。)／source(B:L530, 僕はこのブランコ台を眺め…思い出した。)／source(B:L530, 実際又ブランコ台の上には…とまっていた、)／source(B:L530, 鴉は皆僕を見ても…示さなかった。)／source(B:L530, のみならずまん中にとまっていた鴉は…四たび声を出した。)
- effects: nerve −1（reason: 烏鴉叫了四聲）
- notebook { key:"ch06.gallows_crow", symbol:"raincoat", desc:"沒有鞦韆的鞦韆架像絞刑台。正中央的烏鴉朝天張喙，確確實實叫了四聲" }

### ch6_burned_villa（auto → ch6_cyclist）
- source(B:L532, 僕は芝の枯れた砂土手に沿い…曲ることにした。)／source(B:L532, この小みちの右側には…立っている筈だった。)／source(B:L532, （僕の親友はこの家のことを「春のいる家」と称していた）)（含括號）／source(B:L532, が、この家の前へ通りかかると…あるだけだった。)／source(B:L532, 火事――僕はすぐにこう考え…歩いて行った。)
- notebook { key:"ch06.burned_villa", symbol:"fire", desc:"『住著春天的家』只剩水泥地基上的一只浴缸——火災" }

### ch6_cyclist（auto → ch6_dead_mole）
- source(B:L532, すると自転車に乗った男が…近づき出した。)／source(B:L532, 彼は焦茶いろの鳥打ち帽をかぶり…かがめていた。)／source(B:L532, 僕はふと彼の顔に姉の夫の顔を感じ…はいることにした。)

### ch6_dead_mole（auto → ch6_final_walk）
- source(B:L532, しかしこの小みちのまん中にも…転がっていた。)
- effects: nerve −1（reason: 腐爛的鼴鼠屍骸）
- notebook { key:"ch06.dead_mole", symbol:"gear", desc:"小路正中央，一具腐爛的鼴鼠屍骸腹部朝天躺著" }

### ch6_final_walk（auto → ch6_silver_wing）**含 forced steps——本引擎文中互動的正主場**
- source(B:L534, 何ものかの僕を狙っていることは…不安にし出した。)／source(B:L534, そこへ半透明な歯車も…遮り出した。)／source(B:L534, 僕は愈最後の時の近づいたことを…歩いて行った。)
- **{ type:"forced", origin:"added", steps:["把脖子挺直。","繼續走。","不要停下。"] }**（此刻 nerve≈0-1，按鈕深度侵蝕＋齒輪覆蓋全開）
- source(B:L534, 歯車は数の殖えるのにつれ…まわりはじめた。)／source(B:L534, 同時に又右の松林は…なりはじめた。)／source(B:L534, 僕は動悸の高まるのを感じ…立ち止まろうとした。)／source(B:L534, けれども誰かに押されるように…容易ではなかった。……)
- effects: nerve −2（reason: 最後の時）
- notebook { key:"ch06.last_gears", symbol:"gear", desc:"齒輪一枚一枚遮住視野，越轉越快——連停下腳步都做不到，像被誰推著" }
- links: { unlock:"ch06.last_gears", fold:"── 絞首台 · 鼴鼠 ──" }

### ch6_silver_wing（auto → ch6_wife_stairs）
- source(B:L536, 三十分ばかりたった後…こらえていた。)／source(B:L536, すると僕の眶の裏に…見えはじめた。)／source(B:L536, それは実際網膜の上に…ものだった。)／source(B:L536, 僕は目をあいて天井を見上げ…つぶることにした。)／source(B:L536, しかしやはり銀色の翼は…映っていた。)／source(B:L536, 僕はふとこの間乗った自動車の…思い出した。……)
- notebook { key:"ch06.silver_wing", symbol:"wing", desc:"閉上眼，銀色的翼像鱗片般疊在視網膜上——之前那輛車的水箱蓋上，也有翼" }

### ch6_wife_stairs（auto → ch6_wife_words）
- source(B:L538, そこへ誰か梯子段を…駈け下りて行った。)／source(B:L538, 僕はその誰かの妻だったことを知り…顔を出した。)／source(B:L538, すると妻は突っ伏したまま…震わしていた。)

### ch6_wife_words（auto → ch6_ending）
- dialogue source(B:L540 整行「どうした？」) speaker 我／dialogue source(B:L542 整行) speaker 妻/wife
- source(B:L544 整段)
- dialogue source(B:L546 整行) speaker 妻（「唯何だかお父さんが死んでしまいそうな気がしたものですから。……」）
- notebook { key:"ch06.wife_premonition", symbol:"raincoat", desc:"妻壓著喘息、肩膀不停顫抖——『總覺得爸爸好像快要死掉了』" }

### ch6_ending（auto，showEnd）
- break
- source(B:L548, それは僕の一生の中でも…経験だった。――)／source(B:L548, 僕はもうこの先を書きつづける力を持っていない。)／source(B:L548, こう云う気もちの中に生きているのは…苦痛である。)／source(B:L548, 誰か僕の眠っているうちに…ないか？)
- system「第六章「飛行機」 終」＋system「歯車　――完――」
- effects: 無（終幕不給數值——沉默）；links: { showEnd: true }

## 3. connections（6）

```js
{ id:"ch06.raincoat_final", requires:["raincoat_death","ch06.driver_raincoat"], title:"雨衣——最初與最後", subtitle:"物語は雨衣に始まり雨衣に終る", icon:"✶", insightGain:2 },  // 跨章 CH1
{ id:"ch06.bw_dog", requires:["ch05.bw_whiskey","ch06.half_black_dog"], title:"Black and White，第三次", subtitle:"ウイスキイ、手紙、犬とタイ", icon:"◇", insightGain:2 },   // 跨章 CH5
{ id:"ch06.wings_everywhere", requires:["ch05.airship","ch06.silver_wing"], title:"翼，無所不在", subtitle:"煙草、商標、網膜の裏", icon:"✦", insightGain:2 },              // 跨章 CH5
{ id:"ch06.strindberg_twice", requires:["ch05.karamazov","ch06.strindberg_pass"], title:"史特林堡——書裡與街上", subtitle:"イヴァンの隣に並んだ名", icon:"◈", insightGain:1 }, // 跨章 CH5
{ id:"ch06.four_caws", requires:["ch04.la_mort","ch06.gallows_crow"], title:"四聲", subtitle:"四＝し＝死。la mort、もう一度", icon:"◉", insightGain:2 },                        // 跨章 CH4
{ id:"ch06.mole_end", requires:["ch05.mole_curtain","ch06.dead_mole"], title:"鼴鼠之死", subtitle:"カアテンの内に生きたものの末路", icon:"◉", insightGain:2 },                  // 跨章 CH5
```

## 4. 前置與驗收

- 前置：docs/chapter06-spec.md 檔頭加註「⚠ 稻荷／蓚酸為幻覺內容已作廢、飛行機病說話者已更正為妻の弟；場景切分以 docs/ch6-source-map.md 為準」。registry 註冊 CHAPTER_06。symbols.js CH6 區補 glyph。
- 驗收：四綠；CH6 coverage ≥ 99%；playthrough 全通；六條跨章 connections real-data 測試；**幻覺清零 grep**：稲荷／狐／蓚酸 零命中；「飛行機病」的 speaker 必為 wifes_brother；forced steps 在 ch6_final_walk 正確接線。
- 完成後：README 開發狀態「第三至六章」全部打勾、CLAUDE.md 更新為全六章完成、DEV-LOG 補條目——**《歯車》全卷完工**。
