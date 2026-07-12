# CH2「復讐」重切施工圖（Batch F3）

> 狀態：定案（2026-07-12，Fable）。**取代 docs/chapter02-spec.md 與現行 chapter02.js WIP**（兩者含幻覺內容，見 reports/full-audit-2026-07-11.md §1c——捏造姊姊台詞/養子/震災/Polikushka 錯誤情節，全部作廢不得沿用）。
> 底本：B = reference/aozora/haguruma_original.txt，CH2 = B:L126–L216。
> 全域政策沿用 docs/ch1-source-map.md §0（逐字複製、部分引用去括號、cn 二人稱、正典分歧、添補標 added、fidelity 零 error）。

## 0. 前置動作

1. 把現行 `src/data/chapters/chapter02.js` **複製**到 `legacy/chapter02_deprecated_v1.js`（檔頭加註「2026-07-12 作廢：含幻覺內容，僅供 schema 參考」），然後整檔重寫。
2. `docs/chapter02-spec.md` 檔頭加註「⚠ 已被 docs/ch2-source-map.md 取代（原 spec 含幻覺內容）」，內文不動。
3. `src/data/symbols.js` 的 CH2 區依 §3 的 key 清單重整（舊 key 不再使用者刪除）。

## 1. 章節骨架

```js
chapter: 2, title: "復讐", titleCn: "復仇",
startScene: "ch2_prologue", startLocation: "ch02.hotel_room", sceneCount: 34,
```

- **portraits 欄位省略**（CH2 尚無立繪）；dialogue 的 speakerId 先命名：`waiter` / `wife` / `fan_youth` / `sister`；主角沿用 `protagonist`。
- locations（5 個，樣式比照 CH1 的路徑下行）：

| id | label | sub | shape | symbolKey |
|---|---|---|---|---|
| ch02.hotel_room | ホテル | 朝・八時 | rect | ch02.slipper_omen |
| ch02.road | 雪解けの道 | 公園沿い | circle | ch02.dante |
| ch02.barrack | バラック | 姉の家 | rect | ch02.portrait |
| ch02.aoyama | 青山 | 斎場・病院 | diamond | ch02.led_by |
| ch02.ginza | 銀座 | 日暮 | circle | ch02.nemesis |

x/y 由工兵比照 chapter01.js 的遞增路徑自排（50,60 → ~254,348 區間）。

## 2. 場景逐一（34 場景，8 選擇點；「→轉source(B:Lx, 起…訖)」語法同 CH1 圖。〔更正 2026-07-12：本節實列 34 場景，標頭原誤記 31，以本節逐場清單為準〕）

### ch2_prologue（auto → ch2_slipper_found）
- system「第二章　復讐」＋system「——復仇——」＋break
- source(B:L126, 僕はこのホテルの部屋に…現象だった。)（醒來/拖鞋失蹤/一二年來的恐怖）
- source(B:L126, のみならずサンダアルを…現象だった。)（希臘神話王子——片履的傳說）
- source(B:L126, 僕はベルを押して…探しまわった。)
- effects: `nerve: { amount: +2, reason: "淺眠的恢復" }`（新的一天，夾制上限 10 由 F4 的 clamp 保證）
- notebook: { key:"ch02.slipper_omen", symbol:"slipper", desc:"清晨——拖鞋只剩一隻；只穿一隻鞋的希臘王子" }
- links: { visit:"ch02.hotel_room", unlock:"ch02.slipper_omen" }

### ch2_slipper_found（choice）
- dialogue source(B:L128 整行) speaker 給仕/waiter
- dialogue source(B:L130 整行) speaker 你（「どうして又そんな所に…」）
- dialogue source(B:L132 整行) speaker 給仕（「さあ、鼠かも知れません」）
- choice A「『老鼠』——把這個詞記下來。」→ ch2_rat_seed；flag ch02.noted_rat；notebook { key:"ch02.rat_hint", symbol:"rat", desc:"浴室裡的拖鞋——給仕說：也許是老鼠" }；effects insight+1（理由：不祥的預感）
- choice B「不過是件小事。開始今天的工作。」→ ch2_morning_writing；flag ch02.dismissed_rat

### ch2_rat_seed（分支A，auto → ch2_morning_writing）
- added inner：把「鼠」與失蹤的拖鞋放在一起想（不下結論、不劇透）。全 block 標added。

### ch2_morning_writing（auto → ch2_brother_fires）
- source(B:L134, 僕は給仕の退いた後…仕上げにかかった。)
- source(B:L134, 凝灰岩を四角に組んだ窓は…眺めだった。)（雪、沈丁花、煤煙）
- source(B:L134, 僕は巻煙草をふかしながら…姉の夫のことを。……)
- links: { fold:"── 朝 · 片方のスリッパ ──" }

### ch2_brother_fires（choice）
- source(B:L136, 姉の夫は自殺する前に…体になっていた。)（縱火嫌疑/雙倍火險/偽證罪）
- source(B:L136, けれども僕を不安にしたのは…見たことだった。)
- choice A「追想那些火。」→ ch2_fires_recall；flag ch02.recalled_fires；effects insight+1；notebook { key:"ch02.fire_omen", symbol:"fire", desc:"每次回東京必定看見火——山火、常磐橋的火事" }
- choice B「甩開妄想，回到稿紙上。」→ ch2_fire_dialogue；flag ch02.pushed_away；effects writing+1

### ch2_fires_recall（分支A，auto → ch2_fire_dialogue）
- source(B:L136, 僕は或は汽車の中から…見たりしていた。)
- source(B:L136, それは彼の家の焼けない前にも…行かなかった。)

### ch2_fire_dialogue（auto → ch2_polikouchka）
- added narration 過場（回想標記：那時你對妻說過——）標added
- dialogue source(B:L138 整行) speaker 你
- dialogue source(B:L140 整行) speaker 妻/wife。**逐字：保険は碌についていないし（無「碌く」）**
- source(B:L142, 僕等はそんなことを話し合ったりした。)

### ch2_polikouchka（auto → ch2_rat）
- source(B:L142, しかし僕の家は焼けずに、――僕は努めて…読みはじめた。)
- source(B:L142, この小説の主人公は…カリカテュアだった。)（**照原文寫：虛榮心/病態傾向/名譽心交織的複雜性格；他的一生悲喜劇稍加修正即是你一生的漫畫**——不得添加原文沒有的 Polikushka 情節）
- source(B:L142, 殊に彼の悲喜劇の中に…抛りつけた。)
- dialogue source(B:L144 整行「くたばってしまえ！」) speaker 你
- effects: nerve −1（reason: 命運的冷笑）

### ch2_rat（choice）
- source(B:L146, すると大きい鼠が一匹…走って行った。)
- choice A「追進浴室，徹底搜。」→ ch2_rat_search；flag ch02.chased_rat；notebook { key:"ch02.rat", symbol:"rat", desc:"大老鼠斜穿地板逃進浴室——搜遍了，什麼都沒有" }
- choice B「不看。換鞋，離開房間。」→ ch2_cookroom；flag ch02.fled_rat；effects nerve −1（reason: 未確認的蠢動）

### ch2_rat_search（分支A，auto → ch2_cookroom）
- source(B:L146, 僕は一足飛びに…見えなかった。)
- source(B:L146, 僕は急に無気味になり…歩いて行った。)
- effects: nerve −1（reason: 空無一物的浴室）

### ch2_cookroom（auto → ch2_street_trees）
- source(B:L148, 廊下はきょうも不相変…はいっていた。)（cn 注意：「不相変」= 依然/一如往常，要譯出）
- source(B:L148, コック部屋は存外明るかった。…地獄を感じた。)
- source(B:L148, 「神よ、我を罰し給え。…行かなかった。)（祈禱句含括號一併收錄——原文將引文嵌於地の文）
- effects: nerve −1（reason: 墮入的地獄）
- notebook: { key:"ch02.hell", symbol:"fire", desc:"廚房的爐火與白帽廚師的冷眼——你感到自己墮入的地獄" }
- links: { fold:"── 鼠 · Polikouchka ──" }

### ch2_street_trees（choice）
- source(B:L150, 僕はこのホテルの外へ出ると…歩いて行った。)
- source(B:L150, 道に沿うた公園の樹木は…具えていた。)（樹木有前後如人）
- choice A「凝視那些樹。」→ ch2_trees_stare；flag ch02.stared_trees；effects insight+1；notebook { key:"ch02.dante", symbol:"book", desc:"有正面與背面的樹——但丁地獄裡化成樹木的靈魂" }；links unlock ch02.dante
- choice B「移開視線，走大樓那一側。」→ ch2_fan；flag ch02.avoided_trees
- links: { visit:"ch02.road" }

### ch2_trees_stare（分支A，auto → ch2_fan）
- source(B:L150, それもまた僕には…歩くことにした。)
- source(B:L150, しかしそこも一町とは…出来なかった。)

### ch2_fan（auto → ch2_fan_dialogue）
- （B 分支未收錄的 L150 末二句在此補：若玩家走 A，此處以動態 text 略過重複——**不用動態，改為**：ch2_trees_stare 只收錄「それもまた…思い出し、」，本場景固定收錄「ビルディングばかり並んでいる…出来なかった。」。工兵照此切分，避免重複）
- dialogue source(B:L152 整行) speaker「？？？」（未知青年，speakerId fan_youth）
- source(B:L154, それは金鈕の制服を着た…話しかけた。)（金鈕制服/二十二三/鼻左黑痣——**他是街上偶遇的愛讀者，與姊姊家無關**）

### ch2_fan_dialogue（choice）
- dialogue source(B:L156 整行) speaker 青年
- dialogue source(B:L158 整行「そうです」) speaker 你
- dialogue source(B:L160 整行) speaker 青年
- dialogue source(B:L162 整行「何か御用ですか？」) speaker 你
- dialogue source(B:L164 整行) speaker 青年（「…僕も先生の愛読者の……」）
- choice A「微微脫帽，逕自走開。」（正典）→ ch2_sensei；flag ch02.walked_off
- choice B「停下腳步，多看他一眼。」→ ch2_fan_pause；flag ch02.paused_fan

### ch2_fan_pause（分支B，auto → ch2_sensei）
- added narration：青年侷促、話沒有下文，你終究還是走開（不得替青年編新台詞）。標added。

### ch2_sensei（auto → ch2_barrack）
- source(B:L166, 僕はもうその時には…歩き出していた。)
- source(B:L166, 先生、Ａ先生、――…感じずにはいられなかった。)
- source(B:L166, 何ものかを？――しかし…神経だけである」……)（含同人誌引文全句）
- effects insight+1（reason: 「我有的只是神經」）
- notebook: { key:"ch02.nerves_only", symbol:"book", desc:"「我沒有任何良心，我有的只是神經」——兩三個月前你自己發表的話" }
- links: { fold:"── 往路 · 樹木と愛読者 ──" }

### ch2_barrack（auto → ch2_money_talk）
- source(B:L168, 姉は三人の子供たちと…寒いくらいだった。)（**姊姊＋三個孩子，無其他人**）
- source(B:L168, 僕等は火鉢に手をかざしながら…話したことはなかった。)（姊夫生前輕蔑你/公言作品不道德）
- source(B:L168, しかし姉と話しているうちに…云うことだった。)（**他也墮入地獄：寢台車中見幽靈**）
- source(B:L168, が、僕は巻煙草に火をつけ…話しつづけた。)
- notebook: { key:"ch02.ghost_train", symbol:"raincoat", desc:"姊夫生前在寢台車中見過幽靈——他也墮入了同一個地獄" }
- links: { visit:"ch02.barrack" }

### ch2_money_talk（auto → ch2_portrait）
- dialogue source(B:L170 整行) speaker 姉/sister（賣掉一切）
- dialogue source(B:L172 整行) speaker 你（打字機）
- dialogue source(B:L174 整行) speaker 姉（畫）
- dialogue source(B:L176 整行) speaker 你（「次手にＮさん…しかしあれは……」）

### ch2_portrait（choice）
- source(B:L178, 僕はバラックの壁にかけた…言われないのを感じた。)
- source(B:L178, 轢死した彼は…云うことだった。)（臉成肉塊、僅餘口髭）
- source(B:L178, この話は勿論…ぼんやりしていた。)（**畫中唯獨口髭模糊**）
- choice A「換各種角度細看那幅畫。」（正典）→ ch2_portrait_look；flag ch02.studied_portrait；effects insight+1；notebook { key:"ch02.portrait", symbol:"gear", desc:"姊夫的遺像——處處完好，唯獨口髭模糊。他死時僅剩口髭可辨" }；links unlock ch02.portrait
- choice B「把視線從畫上拉開。」→ ch2_portrait_talk；flag ch02.looked_away

### ch2_portrait_look（分支A，auto → ch2_portrait_talk）
- source(B:L178, 僕は光線の加減かと思い…眺めるようにした。)

### ch2_portrait_talk（auto → ch2_leave）
- dialogue source(B:L180 整行「何をしているの？」) speaker 姉
- dialogue source(B:L182 整行) speaker 你
- source(B:L184, 姉はちょっと振り返りながら…返事をした。)
- dialogue source(B:L186 整行「髭だけ妙に薄いようでしょう」) speaker 姉
- source(B:L188, 僕の見たものは錯覚ではなかった。)
- effects: nerve −1（reason: 不是錯覺）

### ch2_leave（auto → ch2_restaurant）
- source(B:L188, しかし錯覚ではないとすれば、――僕は午飯の…出ることにした。)
- dialogue source(B:L190 整行) speaker 姉
- dialogue source(B:L192 整行) speaker 你（青山）
- dialogue source(B:L194 整行) speaker 姉
- dialogue source(B:L196 整行) speaker 你（**藥名四連：ヴェロナアル、ノイロナアル、トリオナアル、ヌマアル……逐字**）
- notebook: { key:"ch02.veronal", symbol:"book", desc:"催眠藥的名字像咒語——Veronal、Neuronal、Trional、Numal" }
- links: { fold:"── バラック · 遺像 ──" }

### ch2_restaurant（choice）
- source(B:L198, 三十分ばかりたった後…下っていた。)（定休日）
- source(B:L198, 僕は愈不快になり…出ることにした。)（玻璃門後的蘋果與香蕉）
- source(B:L198, すると会社員らしい男が…言ったらしかった。)
- choice A「那句『イライラしてね』黏在你耳裡。」→ ch2_irritation；flag ch02.caught_word；notebook { key:"ch02.tantalus_seed", symbol:"book", desc:"擦肩者的一句『イライラしてね』——這個詞開始在腦中滾動" }
- choice B「不去理會，走到街上等車。」→ ch2_taxi；flag ch02.let_go

### ch2_irritation（分支A，auto → ch2_taxi）
- added inner：詞在腦中滾動但尚未成形（不得預先講出 Tantalus——留給原文）。標added。

### ch2_taxi（auto → ch2_tantalus）
- source(B:L200, 僕は往来に佇んだなり…常としていた）)（**黃色計程車的括號注記一併逐字收錄**）
- source(B:L200, そのうちに僕は縁起の好い…出かけることにした。)
- notebook: { key:"ch02.yellow_taxi", symbol:"gear", desc:"黃色計程車＝交通事故的預兆；你等到了吉利的綠色車" }
- links: { visit:"ch02.aoyama" }

### ch2_tantalus（auto → ch2_lost_street）
- inner source(B:L202 整行含括號「イライラする、――tantalizing――Tantalus――Inferno……」)
- source(B:L204, タンタルスは実際…眺めていた。)
- source(B:L204, そのうちに又あらゆるものの噓である…外ならなかった。)（**噓 U+5653 逐字**）
- source(B:L204, 僕はだんだん息苦しさを感じ…去らなかった。)
- effects: nerve −1（reason: 語言的滑移直墜地獄）

### ch2_lost_street（auto → ch2_saijo）
- source(B:L206 整段)

### ch2_saijo（choice）
- source(B:L208, 僕はやっとその横町を見つけ…出てしまった。)
- source(B:L208, それはかれこれ十年前に…平和だった。)（夏目先生告別式）
- source(B:L208, 僕は砂利を敷いた門の中を…行かなかった。)（漱石山房的芭蕉/一生告一段落）
- choice A「去感受那個『把你帶到墓地前的什麼』。」→ ch2_led_by；flag ch02.felt_led；effects insight+1；notebook { key:"ch02.led_by", symbol:"wing", desc:"十年後把你帶到青山墓地前的——某種東西" }；links unlock ch02.led_by
- choice B「快步找回正路。」→ ch2_hospital_return；flag ch02.hurried_on
- links: { fold:"── 青山 · 斎場 ──" }

### ch2_led_by（分支A，auto → ch2_hospital_return）
- source(B:L208, のみならずこの墓地の前へ…行かなかった。)

### ch2_hospital_return（auto → ch2_ginza）
- source(B:L210, 或精神病院の門を出た後…喧嘩をしていた。)
- source(B:L210, 給仕と？――いや、それは給仕ではない…自動車掛りだった。)
- source(B:L210, 僕はこのホテルへはいることに…引き返して行った。)
- effects: nerve −1（reason: 又是雨衣）
- notebook: { key:"ch02.raincoat_hotel", symbol:"raincoat", desc:"旅館玄關——穿雨衣的男人在與綠制服的車伕爭吵。你調頭離開" }
- links: { unlock:"ch02.raincoat_hotel" }

### ch2_ginza（auto → ch2_zeus）
- source(B:L212, 僕の銀座通りへ出た時には…不快だった。)
- source(B:L212, 僕は薄明るい外光に…見上げた。)
- source(B:L212, それから「希臘神話」と…打ちのめした。)
- links: { visit:"ch02.ginza", fold:"── 帰路 · 玄関の雨衣 ──" }

### ch2_zeus（auto → ch2_ending）
- narration source(B:L214 整行含括號「一番偉いツォイスの神でも復讐の神にはかないません。……」)
- effects: nerve −1（reason: 復讐の神）
- notebook: { key:"ch02.nemesis", symbol:"book", desc:"童書裡的一行——連最偉大的宙斯，也敵不過復仇之神" }

### ch2_ending（auto，showEnd）
- source(B:L216 整段)（彎曲的背上，復讐之神緊追）
- system「第二章「復讐」 終」
- effects insight+1（reason: 被盯上的自覺）
- links: { showEnd: true }

## 3. connections（5 條）與 notebook key 總表

```js
connections: [
  { id:"ch02.greek_circuit", requires:["ch02.slipper_omen","ch02.nemesis"],
    title:"希臘的迴路", subtitle:"片履の王子から復讐の神へ", icon:"◈", insightGain:1 },
  { id:"ch02.fire_karma", requires:["ch02.fire_omen","ch02.portrait"],
    title:"火與遺像", subtitle:"保険・放火・肉塊", icon:"✦", insightGain:1 },
  { id:"ch02.word_slide", requires:["ch02.tantalus_seed","ch02.dante"],
    title:"イライラ→Tantalus→Inferno", subtitle:"言葉の滑り、再び", icon:"◉", insightGain:1 },
  { id:"ch02.raincoat_returns", requires:["raincoat_death","ch02.raincoat_hotel"],
    title:"雨衣仍在", subtitle:"死は済んでいない", icon:"✶", insightGain:2 },   // 跨章：raincoat_death 是 CH1 grandfathered key
  { id:"ch02.hell_shared", check:(s)=> s.notebook.some(n=>n.key==="ch02.hell") && s.notebook.some(n=>n.key==="ch02.ghost_train"),
    title:"同墮地獄", subtitle:"寝台車の幽霊", icon:"◇", insightGain:1 },
]
```

notebook keys（12）：ch02.slipper_omen / ch02.rat_hint / ch02.fire_omen / ch02.rat / ch02.hell / ch02.dante / ch02.nerves_only / ch02.ghost_train / ch02.portrait / ch02.veronal / ch02.tantalus_seed / ch02.yellow_taxi / ch02.raincoat_hotel / ch02.led_by / ch02.nemesis（→ symbols.js CH2 區重整為這些 key 對應的 glyph；symbol 類別沿用 raincoat/gear/book/wing/fire/rat/slipper——後三者為新 symbol 類別，需在 SYMBOL_GLYPHS 補 glyph 與樣式無關的字形即可）

## 4. 數值預算與驗收

- nerve：+2（prologue）−1×7（polikouchka/rat 或 rat_search/cookroom/portrait_talk/tantalus/hospital_return/zeus）→ 全觀察路線淨 −5（8→3）；insight 全觀察 +7 加 connections +6 = 至多 +13；writing +1。〔更正 2026-07-12：依 §2 逐場實算〕
- 驗收：四驗證全綠；**CH2 fidelity coverage ≥ 99%**（章題 8 字除外邏輯同 CH1）；validate:chapters 的 CH2 playthrough 全通、無死結；跨章 connection `ch02.raincoat_returns` 需在整合測試確認可觸發（比照現有 cross-ref 測試）。
- 文件：DEV-LOG 補條目；README 開發狀態 CH2 打勾。
