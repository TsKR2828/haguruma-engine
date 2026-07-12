// ═══════════════════════════════════════════════════════════
// 第二章「復讐」（復仇）
// Source: 芥川龍之介《歯車》二「復讐」
// 青空文庫 https://www.aozora.gr.jp/cards/000879/files/42377_34745.html
// 底本檔案：reference/aozora/haguruma_original.txt（CH2 = B:L126–L216）
//
// 場景格式定義：docs/chapter-data-schema.md
// 施工圖（唯一來源）：docs/ch2-source-map.md
// 舊版（含幻覺內容，已作廢）：legacy/chapter02_deprecated_v1.js
//
// Batch F3-2：完整實作 ch2_sensei ～ ch2_ending（含施工圖§2 標註的
//   3 個先前暫緩分支場景 ch2_portrait_look／ch2_irritation／ch2_led_by，
//   ch2_portrait／ch2_restaurant／ch2_saijo 展開為正式 choice），
//   全章 31→34 場景，逐字回填 jp+cn 完成。
// ═══════════════════════════════════════════════════════════

export const CHAPTER_02 = {
  chapter: 2,
  title: "復讐",
  titleCn: "復仇",
  startScene: "ch2_prologue",
  startLocation: "ch02.hotel_room",
  sceneCount: 34,

  // portraits 欄位省略（CH2 尚無立繪，見施工圖§1）

  locations: [
    { id: "ch02.hotel_room", label: "ホテル", sub: "朝・八時", x: 50, y: 60, shape: "rect", symbolKey: "ch02.slipper_omen" },
    { id: "ch02.road", label: "雪解けの道", sub: "公園沿い", x: 110, y: 142, shape: "circle", symbolKey: "ch02.dante" },
    { id: "ch02.barrack", label: "バラック", sub: "姉の家", x: 170, y: 220, shape: "rect", symbolKey: "ch02.portrait" },
    { id: "ch02.aoyama", label: "青山", sub: "斎場・病院", x: 210, y: 280, shape: "diamond", symbolKey: "ch02.led_by" },
    { id: "ch02.ginza", label: "銀座", sub: "日暮", x: 254, y: 348, shape: "circle", symbolKey: "ch02.nemesis" },
  ],

  connections: [
    {
      id: "ch02.greek_circuit",
      requires: ["ch02.slipper_omen", "ch02.nemesis"],
      title: "希臘的迴路",
      subtitle: "片履の王子から復讐の神へ",
      icon: "◈",
      insightGain: 1,
    },
    {
      id: "ch02.fire_karma",
      requires: ["ch02.fire_omen", "ch02.portrait"],
      title: "火與遺像",
      subtitle: "保険・放火・肉塊",
      icon: "✦",
      insightGain: 1,
    },
    {
      id: "ch02.word_slide",
      requires: ["ch02.tantalus_seed", "ch02.dante"],
      title: "イライラ→Tantalus→Inferno",
      subtitle: "言葉の滑り、再び",
      icon: "◉",
      insightGain: 1,
    },
    {
      id: "ch02.raincoat_returns",
      // 跨章：raincoat_death 是 CH1 grandfathered key（無 ch01. 前綴）
      requires: ["raincoat_death", "ch02.raincoat_hotel"],
      title: "雨衣仍在",
      subtitle: "死は済んでいない",
      icon: "✶",
      insightGain: 2,
    },
    {
      id: "ch02.hell_shared",
      check: (s) =>
        s.notebook.some((n) => n.key === "ch02.hell") &&
        s.notebook.some((n) => n.key === "ch02.ghost_train"),
      title: "同墮地獄",
      subtitle: "寝台車の幽霊",
      icon: "◇",
      insightGain: 1,
    },
  ],

  scenes: {
    // ═══════════════ 旅館の朝 ═══════════════

    ch2_prologue: {
      id: "ch2_prologue",
      text: [
        { type: "system", content: "第二章　復讐" },
        { type: "system", content: "——復仇——" },
        { type: "break" },
        {
          type: "narration",
          origin: "source",
          jp: "僕はこのホテルの部屋に午前八時頃に目を醒ました。が、ベッドをおりようとすると、スリッパアは不思議にも片っぽしかなかった。それはこの一二年の間、いつも僕に恐怖だの不安だのを与える現象だった。",
          cn: "早上八點左右，你在這旅館的房間裡醒來。正要下床時，卻發現拖鞋不可思議地只剩一隻。這一兩年來，這種現象總是帶給你恐懼與不安。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "のみならずサンダアルを片っぽだけはいた希臘神話の中の王子を思い出させる現象だった。",
          cn: "不僅如此——這現象總讓你想起希臘神話裡，那位只穿了一隻涼鞋的王子。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "僕はベルを押して給仕を呼び、スリッパアの片っぽを探して貰うことにした。給仕はけげんな顔をしながら、狭い部屋の中を探しまわった。",
          cn: "你按了鈴，叫來給仕，要他去找拖鞋的另一隻。給仕面露狐疑，在狹小的房間裡找了一圈。",
        },
      ],
      choices: null,
      next: "ch2_slipper_found",
      effects: { nerve: { amount: 2, reason: "淺眠的恢復" } },
      flags: [],
      notebook: { key: "ch02.slipper_omen", symbol: "slipper", desc: "清晨——拖鞋只剩一隻；只穿一隻鞋的希臘王子" },
      links: { visit: "ch02.hotel_room", unlock: "ch02.slipper_omen" },
    },

    ch2_slipper_found: {
      id: "ch2_slipper_found",
      text: [
        { type: "dialogue", origin: "source", speaker: "給仕", speakerId: "waiter", jp: "「ここにありました。このバスの部屋の中に」", cn: "「找到了。就在浴室裡面。」" },
        { type: "dialogue", origin: "source", speaker: "你", speakerId: "protagonist", jp: "「どうして又そんな所に行っていたのだろう？」", cn: "「怎麼又跑到那種地方去了呢？」" },
        { type: "dialogue", origin: "source", speaker: "給仕", speakerId: "waiter", jp: "「さあ、鼠かも知れません」", cn: "「這個嘛，也許是老鼠吧。」" },
      ],
      choices: [
        {
          text: "『老鼠』——把這個詞記下來。",
          next: "ch2_rat_seed",
          flag: "ch02.noted_rat",
          effects: { insight: { amount: 1, reason: "不祥的預感" } },
          notebook: { key: "ch02.rat_hint", symbol: "rat", desc: "浴室裡的拖鞋——給仕說：也許是老鼠" },
          unlock: "ch02.rat_hint",
        },
        {
          text: "不過是件小事。開始今天的工作。",
          next: "ch2_morning_writing",
          flag: "ch02.dismissed_rat",
          effects: null,
          notebook: null,
          unlock: null,
        },
      ],
      next: null,
      effects: null,
      flags: ["ch02.noted_rat", "ch02.dismissed_rat"],
      notebook: null,
      links: null,
    },

    ch2_rat_seed: {
      id: "ch2_rat_seed",
      text: [
        {
          type: "inner",
          origin: "added",
          content: "老鼠。你把這個詞和失蹤的拖鞋放在一起想了想——沒有結論，只是一種說不出的預感，開始在心裡打轉。",
        },
      ],
      choices: null,
      next: "ch2_morning_writing",
      effects: null,
      flags: [],
      notebook: null,
      links: null,
    },

    ch2_morning_writing: {
      id: "ch2_morning_writing",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "僕は給仕の退いた後、牛乳を入れない珈琲を飲み、前の小説を仕上げにかかった。",
          cn: "給仕退下後，你喝著不加牛奶的咖啡，繼續之前那篇小說的收尾。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "凝灰岩を四角に組んだ窓は雪のある庭に向っていた。僕はペンを休める度にぼんやりとこの雪を眺めたりした。雪は莟を持った沈丁花の下に都会の煤煙によごれていた。それは何か僕の心に傷ましさを与える眺めだった。",
          cn: "凝灰岩砌成的方窗，面對著積雪的庭院。每回停筆，你總會茫然地望著這片雪。雪，在含苞的沈丁花下，被都會的煤煙弄髒了——那景象總帶著幾分傷感。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "僕は巻煙草をふかしながら、いつかペンを動かさずにいろいろのことを考えていた。妻のことを、子供たちのことを、就中姉の夫のことを。……",
          cn: "你抽著卷菸，不知不覺停了筆，想著各種各樣的事。妻子的事，孩子們的事，尤其是——姊夫的事。……",
        },
      ],
      choices: null,
      next: "ch2_brother_fires",
      effects: null,
      flags: [],
      notebook: null,
      links: { fold: "── 朝 · 片方のスリッパ ──" },
    },

    // ═══════════════ 火の記憶 ═══════════════

    ch2_brother_fires: {
      id: "ch2_brother_fires",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "姉の夫は自殺する前に放火の嫌疑を蒙っていた。それもまた実際仕かたはなかった。彼は家の焼ける前に家の価格に二倍する火災保険に加入していた。しかも偽証罪を犯した為に執行猶予中の体になっていた。",
          cn: "姊夫在自殺之前，曾背負放火的嫌疑——這也難怪，他在房子燒毀之前，投保了兩倍於房價的火災保險，還因偽證罪而處於緩刑之中。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "けれども僕を不安にしたのは彼の自殺したことよりも僕の東京へ帰る度に必ず火の燃えるのを見たことだった。",
          cn: "但真正讓你不安的，與其說是他的自殺，不如說是——你每次回東京，必定會看見火在燃燒。",
        },
      ],
      choices: [
        {
          text: "追想那些火。",
          next: "ch2_fires_recall",
          flag: "ch02.recalled_fires",
          effects: { insight: { amount: 1, reason: "火的預感" } },
          notebook: { key: "ch02.fire_omen", symbol: "fire", desc: "每次回東京必定看見火——山火、常磐橋的火事" },
          unlock: "ch02.fire_omen",
        },
        {
          text: "甩開妄想，回到稿紙上。",
          next: "ch2_fire_dialogue",
          flag: "ch02.pushed_away",
          effects: { writing: { amount: 1, reason: "回到稿紙" } },
          notebook: null,
          unlock: null,
        },
      ],
      next: null,
      effects: null,
      flags: ["ch02.recalled_fires", "ch02.pushed_away"],
      notebook: null,
      links: null,
    },

    ch2_fires_recall: {
      id: "ch2_fires_recall",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "僕は或は汽車の中から山を焼いている火を見たり、或は又自動車の中から（その時は妻子とも一しょだった）常磐橋界隈の火事を見たりしていた。",
          cn: "你曾從火車車廂裡，望見焚燒山林的火；也曾從汽車裡——那時妻兒都在車上——望見常磐橋一帶的火災。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "それは彼の家の焼けない前にもおのずから僕に火事のある予感を与えない訣には行かなかった。",
          cn: "在他家真正燒起來之前，那些火早就一次次，兀自給了你一種不祥的預感。",
        },
      ],
      choices: null,
      next: "ch2_fire_dialogue",
      effects: null,
      flags: [],
      notebook: null,
      links: null,
    },

    ch2_fire_dialogue: {
      id: "ch2_fire_dialogue",
      text: [
        { type: "narration", origin: "added", content: "那時，你曾這樣對妻子說過——" },
        { type: "dialogue", origin: "source", speaker: "你", speakerId: "protagonist", jp: "「今年は家が火事になるかも知れないぜ」", cn: "「今年家裡說不定也會失火呢。」" },
        { type: "dialogue", origin: "source", speaker: "妻", speakerId: "wife", jp: "「そんな縁起の悪いことを。……それでも火事になったら大変ですね。保険は碌についていないし、……」", cn: "「別說這種不吉利的話……不過，真的失火了可就糟了。保險也沒好好保……」" },
        {
          type: "narration",
          origin: "source",
          jp: "僕等はそんなことを話し合ったりした。",
          cn: "你們就這樣，說了些諸如此類的話。",
        },
      ],
      choices: null,
      next: "ch2_polikouchka",
      effects: null,
      flags: [],
      notebook: null,
      links: null,
    },

    ch2_polikouchka: {
      id: "ch2_polikouchka",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "しかし僕の家は焼けずに、――僕は努めて妄想を押しのけ、もう一度ペンを動かそうとした。が、ペンはどうしても一行とは楽に動かなかった。僕はとうとう机の前を離れ、ベッドの上に転がったまま、トルストイの Polikouchka を読みはじめた。",
          cn: "然而，你的房子並沒有燒起來。——你努力把妄想推開，想再一次動筆。可筆尖，無論如何也難以順暢地寫下哪怕一行。你終於離開了書桌，往床上一躺，讀起了托爾斯泰的《波利庫什卡》。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "この小説の主人公は虚栄心や病的傾向や名誉心の入り交った、複雑な性格の持ち主だった。しかも彼の一生の悲喜劇は多少の修正を加えさえすれば、僕の一生のカリカテュアだった。",
          cn: "這部小說的主人公，是個虛榮心、病態傾向與名譽心交纏在一起、性格複雜的人物。而他一生的悲喜劇，只要稍加修正，便成了你一生的漫畫像。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "殊に彼の悲喜劇の中に運命の冷笑を感じるのは次第に僕を無気味にし出した。僕は一時間とたたないうちにベッドの上から飛び起きるが早いか、窓かけの垂れた部屋の隅へ力一ぱい本を抛りつけた。",
          cn: "尤其是，在他的悲喜劇裡感受到命運的冷笑——這件事漸漸地讓你感到毛骨悚然。不到一小時，你便從床上一躍而起，把書狠狠地扔進了掛著窗簾的房間角落。",
        },
        { type: "dialogue", origin: "source", speaker: "你", speakerId: "protagonist", jp: "「くたばってしまえ！」", cn: "「去死吧！」" },
      ],
      choices: null,
      next: "ch2_rat",
      effects: { nerve: { amount: -1, reason: "命運的冷笑" } },
      flags: [],
      notebook: null,
      links: null,
    },

    // ═══════════════ 鼠 ═══════════════

    ch2_rat: {
      id: "ch2_rat",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "すると大きい鼠が一匹窓かけの下からバスの部屋へ斜めに床の上を走って行った。",
          cn: "就在這時，一隻大老鼠從窗簾底下竄出，斜穿過地板，跑進了浴室。",
        },
      ],
      choices: [
        {
          text: "追進浴室，徹底搜。",
          next: "ch2_rat_search",
          flag: "ch02.chased_rat",
          effects: null,
          notebook: { key: "ch02.rat", symbol: "rat", desc: "大老鼠斜穿地板逃進浴室——搜遍了，什麼都沒有" },
          unlock: "ch02.rat",
        },
        {
          text: "不看。換鞋，離開房間。",
          next: "ch2_cookroom",
          flag: "ch02.fled_rat",
          effects: { nerve: { amount: -1, reason: "未確認的蠢動" } },
          notebook: null,
          unlock: null,
        },
      ],
      next: null,
      effects: null,
      flags: ["ch02.chased_rat", "ch02.fled_rat"],
      notebook: null,
      links: null,
    },

    ch2_rat_search: {
      id: "ch2_rat_search",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "僕は一足飛びにバスの部屋へ行き、戸をあけて中を探しまわった。が、白いタッブのかげにも鼠らしいものは見えなかった。",
          cn: "你一個箭步衝進浴室，推開門四下搜尋。可白色浴缸的陰影裡，連個老鼠的影子也沒有。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "僕は急に無気味になり、慌ててスリッパアを靴に換えると、人気のない廊下を歩いて行った。",
          cn: "你忽然感到一陣毛骨悚然，慌忙把拖鞋換成鞋子，走過那條空無一人的走廊。",
        },
      ],
      choices: null,
      next: "ch2_cookroom",
      effects: { nerve: { amount: -1, reason: "空無一物的浴室" } },
      flags: [],
      notebook: null,
      links: null,
    },

    ch2_cookroom: {
      id: "ch2_cookroom",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "廊下はきょうも不相変牢獄のように憂鬱だった。僕は頭を垂れたまま、階段を上ったり下りたりしているうちにいつかコック部屋へはいっていた。",
          cn: "走廊今天也一如往常，陰鬱得像座牢獄。你低垂著頭，在樓梯間上上下下，不知不覺就走進了廚房。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "コック部屋は存外明るかった。が、片側に並んだ竈は幾つも炎を動かしていた。僕はそこを通りぬけながら、白い帽をかぶったコックたちの冷やかに僕を見ているのを感じた。同時に又僕の堕ちた地獄を感じた。",
          cn: "廚房裡意外地明亮。可一側並排的爐灶，仍有好幾座竈火在跳動。你穿行其間，感覺到戴著白帽的廚師們正冷冷地看著你——同時，你也感覺到自己墮入的地獄。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "「神よ、我を罰し給え。怒り給うこと勿れ。恐らくは我滅びん」――こう云う祈祷もこの瞬間にはおのずから僕の脣にのぼらない訣には行かなかった。",
          cn: "「神啊，懲罰我吧。不要動怒。恐怕我將要滅亡」——這樣的禱詞，在這一瞬間，也不由自主地湧上了你的嘴唇。",
        },
      ],
      choices: null,
      next: "ch2_street_trees",
      effects: { nerve: { amount: -1, reason: "墮入的地獄" } },
      flags: [],
      notebook: { key: "ch02.hell", symbol: "fire", desc: "廚房的爐火與白帽廚師的冷眼——你感到自己墮入的地獄" },
      links: { fold: "── 鼠 · Polikouchka ──" },
    },

    // ═══════════════ 往路：樹木と愛読者 ═══════════════

    ch2_street_trees: {
      id: "ch2_street_trees",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "僕はこのホテルの外へ出ると、青ぞらの映った雪解けの道をせっせと姉の家へ歩いて行った。",
          cn: "你走出旅館，沿著映著藍天的融雪道路，匆匆朝姊姊家走去。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "道に沿うた公園の樹木は皆枝や葉を黒ませていた。のみならずどれも一本ごとに丁度僕等人間のように前や後ろを具えていた。",
          cn: "沿路公園裡的樹木，枝葉全都發黑。不僅如此——每一株，都像我們人類一樣，具備著前面與後面。",
        },
      ],
      choices: [
        {
          text: "凝視那些樹。",
          next: "ch2_trees_stare",
          flag: "ch02.stared_trees",
          effects: { insight: { amount: 1, reason: "但丁地獄的既視感" } },
          notebook: { key: "ch02.dante", symbol: "book", desc: "有正面與背面的樹——但丁地獄裡化成樹木的靈魂" },
          unlock: "ch02.dante",
        },
        {
          text: "移開視線，走大樓那一側。",
          next: "ch2_fan",
          flag: "ch02.avoided_trees",
          effects: null,
          notebook: null,
          unlock: null,
        },
      ],
      next: null,
      effects: null,
      flags: ["ch02.stared_trees", "ch02.avoided_trees"],
      notebook: null,
      links: { visit: "ch02.road" },
    },

    ch2_trees_stare: {
      id: "ch2_trees_stare",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "それもまた僕には不快よりも恐怖に近いものを運んで来た。僕はダンテの地獄の中にある、樹木になった魂を思い出し、",
          cn: "這感覺帶給你的，與其說是不快，不如說更接近恐懼。你想起了但丁地獄裡，那些化作樹木的靈魂——",
        },
      ],
      choices: null,
      next: "ch2_fan",
      effects: null,
      flags: [],
      notebook: null,
      links: null,
    },

    ch2_fan: {
      id: "ch2_fan",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "ビルディングばかり並んでいる電車線路の向うを歩くことにした。しかしそこも一町とは無事に歩くことは出来なかった。",
          cn: "你打定主意，索性走到那滿是大樓、電車線路對面的那一側。可就連那一頭的一町路，也沒能平安走完。",
        },
        {
          type: "dialogue",
          origin: "source",
          speaker: "？？？",
          speakerId: "fan_youth",
          jp: "「ちょっと通りがかりに失礼ですが、……」",
          cn: "「不好意思，冒昧地打擾您了……」",
        },
        {
          type: "narration",
          origin: "source",
          jp: "それは金鈕の制服を着た二十二三の青年だった。僕は黙ってこの青年を見つめ、彼の鼻の左の側に黒子のあることを発見した。彼は帽を脱いだまま、怯ず怯ずこう僕に話しかけた。",
          cn: "那是個穿著金鈕扣制服、二十二三歲的青年。你默默地盯著這個青年看，發現他鼻子左側有一顆黑痣。他脫著帽子，怯生生地這樣向你搭話。",
        },
      ],
      choices: null,
      next: "ch2_fan_dialogue",
      effects: null,
      flags: [],
      notebook: null,
      links: null,
    },

    ch2_fan_dialogue: {
      id: "ch2_fan_dialogue",
      text: [
        { type: "dialogue", origin: "source", speaker: "青年", speakerId: "fan_youth", jp: "「Ａさんではいらっしゃいませんか？」", cn: "「請問您是不是 Ａ 先生？」" },
        { type: "dialogue", origin: "source", speaker: "你", speakerId: "protagonist", jp: "「そうです」", cn: "「是的。」" },
        { type: "dialogue", origin: "source", speaker: "青年", speakerId: "fan_youth", jp: "「どうもそんな気がしたものですから、……」", cn: "「我就覺得，好像是您……」" },
        { type: "dialogue", origin: "source", speaker: "你", speakerId: "protagonist", jp: "「何か御用ですか？」", cn: "「有什麼事嗎？」" },
        { type: "dialogue", origin: "source", speaker: "青年", speakerId: "fan_youth", jp: "「いえ、唯お目にかかりたかっただけです。僕も先生の愛読者の……」", cn: "「不，只是想見您一面而已。我也是先生的愛讀者之一……」" },
      ],
      choices: [
        {
          text: "微微脫帽，逕自走開。",
          next: "ch2_sensei",
          flag: "ch02.walked_off",
          effects: null,
          notebook: null,
          unlock: null,
        },
        {
          text: "停下腳步，多看他一眼。",
          next: "ch2_fan_pause",
          flag: "ch02.paused_fan",
          effects: null,
          notebook: null,
          unlock: null,
        },
      ],
      next: null,
      effects: null,
      flags: ["ch02.walked_off", "ch02.paused_fan"],
      notebook: null,
      links: null,
    },

    ch2_fan_pause: {
      id: "ch2_fan_pause",
      text: [
        {
          type: "narration",
          origin: "added",
          content: "青年顯得侷促不安，話說到一半便沒有了下文。你終究還是——轉身走開了。",
        },
      ],
      choices: null,
      next: "ch2_sensei",
      effects: null,
      flags: [],
      notebook: null,
      links: null,
    },

    // ═══════════════ 先生・Ａ先生（同人誌引文） ═══════════════

    ch2_sensei: {
      id: "ch2_sensei",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "僕はもうその時にはちょっと帽をとったぎり、彼を後ろに歩き出していた。",
          cn: "那時，你已經只是稍稍摘下了帽子，把他丟在身後，逕自走了起來。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "先生、Ａ先生、――それは僕にはこの頃で最も不快な言葉だった。僕はあらゆる罪悪を犯していることを信じていた。しかも彼等は何かの機会に僕を先生と呼びつづけていた。僕はそこに僕を嘲る何ものかを感じずにはいられなかった。",
          cn: "先生，Ａ先生——這是近來最讓你不快的稱呼。你一直相信自己犯下了種種罪惡，可他們卻總在什麼機緣裡，一逕稱你為先生。你不由得從中感覺到某種嘲弄你的東西。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "何ものかを？――しかし僕の物質主義は神秘主義を拒絶せずにはいられなかった。僕はつい二三箇月前にも或小さい同人雑誌にこう云う言葉を発表していた。――「僕は芸術的良心を始め、どう云う良心も持っていない。僕の持っているのは神経だけである」……",
          cn: "某種東西？——然而你的唯物主義，終究無法不拒絕神秘主義。就在兩三個月前，你也曾在某本小小的同人雜誌上，發表過這樣的話——「我沒有藝術的良心，也沒有任何其他的良心。我所擁有的，只有神經而已」……",
        },
      ],
      choices: null,
      next: "ch2_barrack",
      effects: { insight: { amount: 1, reason: "「我有的只是神經」" } },
      flags: [],
      notebook: { key: "ch02.nerves_only", symbol: "book", desc: "「我沒有任何良心，我有的只是神經」——兩三個月前你自己發表的話" },
      links: { fold: "── 往路 · 樹木と愛読者 ──" },
    },

    // ═══════════════ 姉の家・バラック ═══════════════

    ch2_barrack: {
      id: "ch2_barrack",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "姉は三人の子供たちと一しょに露地の奥のバラックに避難していた。褐色の紙を貼ったバラックの中は外よりも寒いくらいだった。",
          cn: "姊姊帶著三個孩子，一同避難在小巷深處的一間木板房裡。糊著褐色紙的木板房內，甚至比外頭還要冷。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "僕等は火鉢に手をかざしながら、いろいろのことを話し合った。体の逞しい姉の夫は人一倍痩せ細った僕を本能的に軽蔑していた。のみならず僕の作品の不道徳であることを公言していた。僕はいつも冷やかにこう云う彼を見おろしたまま、一度も打ちとけて話したことはなかった。",
          cn: "你們一面把手伸向火盆取暖，一面談了許多事。體格健壯的姊夫，本能地輕蔑著比常人瘦弱得多的你，甚至公然宣稱你的作品不道德。你總是冷冷地俯視著這樣的他，一次也不曾推心置腹地交談過。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "しかし姉と話しているうちにだんだん彼も僕のように地獄に堕ちていたことを悟り出した。彼は現に寝台車の中に幽霊を見たとか云うことだった。",
          cn: "可是與姊姊談著談著，你漸漸察覺到——他其實也和你一樣，早已墮入了地獄。據說他生前，確實曾在寢台車中看見過幽靈。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "が、僕は巻煙草に火をつけ、努めて金のことばかり話しつづけた。",
          cn: "但你點起了一支菸，只顧著儘量把話題扯到錢的事情上。",
        },
      ],
      choices: null,
      next: "ch2_money_talk",
      effects: null,
      flags: [],
      notebook: { key: "ch02.ghost_train", symbol: "raincoat", desc: "姊夫生前在寢台車中見過幽靈——他也墮入了同一個地獄" },
      links: { visit: "ch02.barrack" },
    },

    ch2_money_talk: {
      id: "ch2_money_talk",
      text: [
        { type: "dialogue", origin: "source", speaker: "姉", speakerId: "sister", jp: "「何しろこう云う際だしするから、何もかも売ってしまおうと思うの」", cn: "「畢竟事到如今，我想乾脆把什麼都賣了。」" },
        { type: "dialogue", origin: "source", speaker: "你", speakerId: "protagonist", jp: "「それはそうだ。タイプライタアなどは幾らかになるだろう」", cn: "「那也好。像打字機這類東西，多少能換點錢吧。」" },
        { type: "dialogue", origin: "source", speaker: "姉", speakerId: "sister", jp: "「ええ、それから画などもあるし」", cn: "「嗯，還有畫之類的也是。」" },
        { type: "dialogue", origin: "source", speaker: "你", speakerId: "protagonist", jp: "「次手にＮさん（姉の夫）の肖像画も売るか？　しかしあれは……」", cn: "「順便把 Ｎ 先生（姊夫）的肖像畫也賣了？不過那幅……」" },
      ],
      choices: null,
      next: "ch2_portrait",
      effects: null,
      flags: [],
      notebook: null,
      links: null,
    },

    // ═══════════════ 肖像画・口髭 ═══════════════

    ch2_portrait: {
      id: "ch2_portrait",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "僕はバラックの壁にかけた、額縁のない一枚のコンテ画を見ると、迂濶に常談も言われないのを感じた。",
          cn: "你望著木板房牆上，那幅沒有畫框的炭精畫像，忽然覺得連句玩笑話都無法輕率地說出口。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "轢死した彼は汽車の為に顔もすっかり肉塊になり、僅かに唯口髭だけ残っていたとか云うことだった。",
          cn: "據說他被火車輾死時，臉早已徹底碎成了肉塊，僅僅只剩下一撮口髭殘留下來。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "この話は勿論話自身も薄気味悪いのに違いなかった。しかし彼の肖像画はどこも完全に描いてあるものの、口髭だけはなぜかぼんやりしていた。",
          cn: "這段描述本身，當然也令人毛骨悚然。可他的肖像畫明明處處都畫得完整，唯獨那口髭，不知為何顯得模糊不清。",
        },
      ],
      choices: [
        {
          text: "換各種角度細看那幅畫。",
          next: "ch2_portrait_look",
          flag: "ch02.studied_portrait",
          effects: { insight: { amount: 1, reason: "模糊的口髭" } },
          notebook: { key: "ch02.portrait", symbol: "gear", desc: "姊夫的遺像——處處完好，唯獨口髭模糊。他死時僅剩口髭可辨" },
          unlock: "ch02.portrait",
        },
        {
          text: "把視線從畫上拉開。",
          next: "ch2_portrait_talk",
          flag: "ch02.looked_away",
          effects: null,
          notebook: null,
          unlock: null,
        },
      ],
      next: null,
      effects: null,
      flags: ["ch02.studied_portrait", "ch02.looked_away"],
      notebook: null,
      links: null,
    },

    ch2_portrait_look: {
      id: "ch2_portrait_look",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "僕は光線の加減かと思い、この一枚のコンテ画をいろいろの位置から眺めるようにした。",
          cn: "你猜想或許是光線的緣故，於是換了好幾個位置，細細打量著這幅炭精畫像。",
        },
      ],
      choices: null,
      next: "ch2_portrait_talk",
      effects: null,
      flags: [],
      notebook: null,
      links: null,
    },

    ch2_portrait_talk: {
      id: "ch2_portrait_talk",
      text: [
        { type: "dialogue", origin: "source", speaker: "姉", speakerId: "sister", jp: "「何をしているの？」", cn: "「你在做什麼呢？」" },
        { type: "dialogue", origin: "source", speaker: "你", speakerId: "protagonist", jp: "「何でもないよ。……唯あの肖像画は口のまわりだけ、……」", cn: "「沒什麼。……只是那幅肖像畫，嘴巴周圍……」" },
        {
          type: "narration",
          origin: "source",
          jp: "姉はちょっと振り返りながら、何も気づかないように返事をした。",
          cn: "姊姊微微回過頭，用一種毫不在意的口吻回答你。",
        },
        { type: "dialogue", origin: "source", speaker: "姉", speakerId: "sister", jp: "「髭だけ妙に薄いようでしょう」", cn: "「就只有鬍子看起來特別淡吧？」" },
        {
          type: "narration",
          origin: "source",
          jp: "僕の見たものは錯覚ではなかった。",
          cn: "你所看見的，並不是錯覺。",
        },
      ],
      choices: null,
      next: "ch2_leave",
      effects: { nerve: { amount: -1, reason: "不是錯覺" } },
      flags: [],
      notebook: null,
      links: null,
    },

    ch2_leave: {
      id: "ch2_leave",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "しかし錯覚ではないとすれば、――僕は午飯の世話にならないうちに姉の家を出ることにした。",
          cn: "然而，如果不是錯覺——你決定，在還沒被留下來吃午飯之前，就先離開姊姊家。",
        },
        { type: "dialogue", origin: "source", speaker: "姉", speakerId: "sister", jp: "「まあ、善いでしょう」", cn: "「哎，這樣也好吧。」" },
        { type: "dialogue", origin: "source", speaker: "你", speakerId: "protagonist", jp: "「又あしたでも、……きょうは青山まで出かけるのだから」", cn: "「改天再來吧……今天還得到青山去一趟呢。」" },
        { type: "dialogue", origin: "source", speaker: "姉", speakerId: "sister", jp: "「ああ、あすこ？　まだ体の具合は悪いの？」", cn: "「啊，那邊？身體還是不舒服嗎？」" },
        { type: "dialogue", origin: "source", speaker: "你", speakerId: "protagonist", jp: "「やっぱり薬ばかり嚥んでいる。催眠薬だけでも大変だよ。ヴェロナアル、ノイロナアル、トリオナアル、ヌマアル……」", cn: "「還是老樣子，只能靠藥撐著。光是安眠藥就夠受的了。維洛那爾、諾伊洛那爾、特里奧那爾、努馬爾……」" },
      ],
      choices: null,
      next: "ch2_restaurant",
      effects: null,
      flags: [],
      notebook: { key: "ch02.veronal", symbol: "book", desc: "催眠藥的名字像咒語——Veronal、Neuronal、Trional、Numal" },
      links: { fold: "── バラック · 遺像 ──" },
    },

    // ═══════════════ レストオラン・イライラ ═══════════════

    ch2_restaurant: {
      id: "ch2_restaurant",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "三十分ばかりたった後、僕は或ビルディングへはいり、昇降機に乗って三階へのぼった。それから或レストオランの硝子戸を押してはいろうとした。が、硝子戸は動かなかった。のみならずそこには「定休日」と書いた漆塗りの札も下っていた。",
          cn: "約莫過了三十分鐘，你走進了某棟大樓，搭電梯上到三樓，想推開一間餐廳的玻璃門進去。可玻璃門卻紋絲不動——不僅如此，門上還掛著一塊寫著「公休日」的漆牌。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "僕は愈不快になり、硝子戸の向うのテエブルの上に林檎やバナナを盛ったのを見たまま、もう一度往来へ出ることにした。",
          cn: "你益發感到不快，望著玻璃門另一側桌上堆著的蘋果與香蕉，只得再次走回了大街上。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "すると会社員らしい男が二人何か快活にしゃべりながら、このビルディングにはいる為に僕の肩をこすって行った。彼等の一人はその拍子に「イライラしてね」と言ったらしかった。",
          cn: "這時，兩個像是上班族的男人一面興高采烈地說著什麼，一面擦著你的肩膀，走進了這棟大樓。其中一人似乎正好在那當口說了句「真讓人心煩吶」。",
        },
      ],
      choices: [
        {
          text: "那句『イライラしてね』黏在你耳裡。",
          next: "ch2_irritation",
          flag: "ch02.caught_word",
          effects: null,
          notebook: { key: "ch02.tantalus_seed", symbol: "book", desc: "擦肩者的一句『イライラしてね』——這個詞開始在腦中滾動" },
          unlock: "ch02.tantalus_seed",
        },
        {
          text: "不去理會，走到街上等車。",
          next: "ch2_taxi",
          flag: "ch02.let_go",
          effects: null,
          notebook: null,
          unlock: null,
        },
      ],
      next: null,
      effects: null,
      flags: ["ch02.caught_word", "ch02.let_go"],
      notebook: null,
      links: null,
    },

    ch2_irritation: {
      id: "ch2_irritation",
      text: [
        {
          type: "inner",
          origin: "added",
          content: "「イライラしてね」——那句話黏在你耳邊，在腦中滾動打轉，卻還沒有凝成任何形狀。",
        },
      ],
      choices: null,
      next: "ch2_taxi",
      effects: null,
      flags: [],
      notebook: null,
      links: null,
    },

    ch2_taxi: {
      id: "ch2_taxi",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "僕は往来に佇んだなり、タクシイの通るのを待ち合せていた。タクシイは容易に通らなかった。のみならずたまに通ったのは必ず黄いろい車だった。（この黄いろいタクシイはなぜか僕に交通事故の面倒をかけるのを常としていた）",
          cn: "你佇立在大街上，等著計程車經過。可計程車遲遲不來——不僅如此，偶爾駛過的，也必定是黃色的車。（不知為何，這種黃色計程車總是給你帶來交通事故般的麻煩）",
        },
        {
          type: "narration",
          origin: "source",
          jp: "そのうちに僕は縁起の好い緑いろの車を見つけ、とにかく青山の墓地に近い精神病院へ出かけることにした。",
          cn: "沒過多久，你發現了一輛吉利的綠色車，總算決定前往那間靠近青山墓地的精神病院。",
        },
      ],
      choices: null,
      next: "ch2_tantalus",
      effects: null,
      flags: [],
      notebook: { key: "ch02.yellow_taxi", symbol: "gear", desc: "黃色計程車＝交通事故的預兆；你等到了吉利的綠色車" },
      links: { visit: "ch02.aoyama" },
    },

    // ═══════════════ イライラ→Tantalus→Inferno ═══════════════

    ch2_tantalus: {
      id: "ch2_tantalus",
      text: [
        {
          type: "inner",
          origin: "source",
          jp: "「イライラする、――tantalizing――Tantalus――Inferno……」",
          cn: "「真讓人心煩，——tantalizing——Tantalus——Inferno……」",
        },
        {
          type: "narration",
          origin: "source",
          jp: "タンタルスは実際硝子戸越しに果物を眺めた僕自身だった。僕は二度も僕の目に浮んだダンテの地獄を詛いながら、じっと運転手の背中を眺めていた。",
          cn: "坦塔羅斯——那其實正是你自己，隔著玻璃門凝視著水果的模樣。你一面咒罵著兩度浮上眼前的但丁地獄，一面死死盯著司機的背影。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "そのうちに又あらゆるものの噓であることを感じ出した。政治、実業、芸術、科学、――いずれも皆こう云う僕にはこの恐しい人生を隠した雑色のエナメルに外ならなかった。",
          cn: "漸漸地，你又感覺到——一切的一切都是謊言。政治、實業、藝術、科學——對如今的你而言，這些不過都是掩蓋這可怕人生的、五顏六色的琺瑯罷了。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "僕はだんだん息苦しさを感じ、タクシイの窓をあけ放ったりした。が、何か心臓をしめられる感じは去らなかった。",
          cn: "你漸漸感到呼吸困難，把計程車的車窗大大地敞開。可那種彷彿被扼住心臟的感覺，卻怎麼也揮之不去。",
        },
      ],
      choices: null,
      next: "ch2_lost_street",
      effects: { nerve: { amount: -1, reason: "語言的滑移直墜地獄" } },
      flags: [],
      notebook: null,
      links: null,
    },

    ch2_lost_street: {
      id: "ch2_lost_street",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "緑いろのタクシイはやっと神宮前へ走りかかった。そこには或精神病院へ曲る横町が一つある筈だった。しかしそれもきょうだけはなぜか僕にはわからなかった。僕は電車の線路に沿い、何度もタクシイを往復させた後、とうとうあきらめておりることにした。",
          cn: "綠色計程車總算駛近了神宮前。那附近，本該有一條轉往那間精神病院的小巷。可不知為何，唯獨今天，你怎麼也找不到。你沿著電車軌道，讓計程車來回開了好幾趟，終於還是死心，下了車。",
        },
      ],
      choices: null,
      next: "ch2_saijo",
      effects: null,
      flags: [],
      notebook: null,
      links: null,
    },

    // ═══════════════ 青山・斎場 ═══════════════

    ch2_saijo: {
      id: "ch2_saijo",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "僕はやっとその横町を見つけ、ぬかるみの多い道を曲って行った。するといつか道を間違え、青山斎場の前へ出てしまった。",
          cn: "你終於找到了那條小巷，拐進了一條泥濘不堪的路。可不知不覺又走錯了路，竟走到了青山齋場的門前。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "それはかれこれ十年前にあった夏目先生の告別式以来、一度も僕は門の前さえ通ったことのない建物だった。十年前の僕も幸福ではなかった。しかし少くとも平和だった。",
          cn: "那是自從約莫十年前，夏目先生的告別式以來，你連門前都不曾走過一次的建築。十年前的你，雖然稱不上幸福，至少還算平靜。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "僕は砂利を敷いた門の中を眺め、「漱石山房」の芭蕉を思い出しながら、何か僕の一生も一段落ついたことを感じない訣には行かなかった。",
          cn: "你望著鋪滿碎石的門內，想起「漱石山房」的那株芭蕉，不由得感覺到——自己的一生，似乎也已經告一段落了。",
        },
      ],
      choices: [
        {
          text: "去感受那個『把你帶到墓地前的什麼』。",
          next: "ch2_led_by",
          flag: "ch02.felt_led",
          effects: { insight: { amount: 1, reason: "被帶到墓地前的某種東西" } },
          notebook: { key: "ch02.led_by", symbol: "wing", desc: "十年後把你帶到青山墓地前的——某種東西" },
          unlock: "ch02.led_by",
        },
        {
          text: "快步找回正路。",
          next: "ch2_hospital_return",
          flag: "ch02.hurried_on",
          effects: null,
          notebook: null,
          unlock: null,
        },
      ],
      next: null,
      effects: null,
      flags: ["ch02.felt_led", "ch02.hurried_on"],
      notebook: null,
      links: { fold: "── 青山 · 斎場 ──" },
    },

    ch2_led_by: {
      id: "ch2_led_by",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "のみならずこの墓地の前へ十年目に僕をつれて来た何ものかを感じない訣にも行かなかった。",
          cn: "不僅如此，你也不由得感覺到——是某種東西，在第十年，把你帶到了這座墓地前。",
        },
      ],
      choices: null,
      next: "ch2_hospital_return",
      effects: null,
      flags: [],
      notebook: null,
      links: null,
    },

    ch2_hospital_return: {
      id: "ch2_hospital_return",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "或精神病院の門を出た後、僕は又自動車に乗り、前のホテルへ帰ることにした。が、このホテルの玄関へおりると、レエン・コオトを着た男が一人何か給仕と喧嘩をしていた。",
          cn: "走出那間精神病院的大門後，你又搭上了汽車，決定回到方才那間旅館。可一到旅館的玄關前，卻見一個穿著雨衣的男人，正跟給仕吵著什麼。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "給仕と？――いや、それは給仕ではない、緑いろの服を着た自動車掛りだった。",
          cn: "跟給仕？——不，那並不是給仕，而是個穿著綠色制服的司機。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "僕はこのホテルへはいることに何か不吉な心もちを感じ、さっさともとの道を引き返して行った。",
          cn: "你忽然對走進這間旅館，生出了某種不祥的預感，於是趕緊掉頭，順著原路走了回去。",
        },
      ],
      choices: null,
      next: "ch2_ginza",
      effects: { nerve: { amount: -1, reason: "又是雨衣" } },
      flags: [],
      notebook: { key: "ch02.raincoat_hotel", symbol: "raincoat", desc: "旅館玄關——穿雨衣的男人在與綠制服的車伕爭吵。你調頭離開" },
      links: { unlock: "ch02.raincoat_hotel" },
    },

    // ═══════════════ 帰路・銀座 ═══════════════

    ch2_ginza: {
      id: "ch2_ginza",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "僕の銀座通りへ出た時にはかれこれ日の暮も近づいていた。僕は両側に並んだ店や目まぐるしい人通りに一層憂鬱にならずにはいられなかった。殊に往来の人々の罪などと云うものを知らないように軽快に歩いているのは不快だった。",
          cn: "當你走到銀座通時，天色差不多已近黃昏。兩旁林立的店鋪與絡繹不絕的人潮，讓你不由得更加憂鬱起來。尤其令你不快的，是路上的行人們，個個都像不知罪為何物似的，輕快地走著。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "僕は薄明るい外光に電燈の光のまじった中をどこまでも北へ歩いて行った。そのうちに僕の目を捉えたのは雑誌などを積み上げた本屋だった。僕はこの本屋の店へはいり、ぼんやりと何段かの書棚を見上げた。",
          cn: "你在微亮的天光與電燈燈光交雜之中，一路往北走去。這時，你的目光被一間堆滿雜誌的書店吸引住了。你走進這間書店，茫然地抬頭望著幾層書架。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "それから「希臘神話」と云う一冊の本へ目を通すことにした。黄いろい表紙をした「希臘神話」は子供の為に書かれたものらしかった。けれども偶然僕の読んだ一行は忽ち僕を打ちのめした。",
          cn: "接著，你隨手翻閱起一本名為《希臘神話》的書。這本封面黃色的《希臘神話》，看來是為孩子寫的。可你偶然讀到的那一行，卻瞬間把你擊垮了。",
        },
      ],
      choices: null,
      next: "ch2_zeus",
      effects: null,
      flags: [],
      notebook: null,
      links: { visit: "ch02.ginza", fold: "── 帰路 · 玄関の雨衣 ──" },
    },

    ch2_zeus: {
      id: "ch2_zeus",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "「一番偉いツォイスの神でも復讐の神にはかないません。……」",
          cn: "「就連最偉大的宙斯神，也敵不過復仇之神。……」",
        },
      ],
      choices: null,
      next: "ch2_ending",
      effects: { nerve: { amount: -1, reason: "復讐の神" } },
      flags: [],
      notebook: { key: "ch02.nemesis", symbol: "book", desc: "童書裡的一行——連最偉大的宙斯，也敵不過復仇之神" },
      links: null,
    },

    ch2_ending: {
      id: "ch2_ending",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "僕はこの本屋の店を後ろに人ごみの中を歩いて行った。いつか曲り出した僕の背中に絶えず僕をつけ狙っている復讐の神を感じながら。……",
          cn: "你把這間書店拋在身後，走進了人潮之中。不知不覺已然彎曲的背脊上，你始終感覺到——那復仇之神，正不斷地緊追不捨、窺伺著你。……",
        },
        { type: "system", content: "第二章「復讐」 終" },
      ],
      choices: null,
      next: null,
      effects: { insight: { amount: 1, reason: "被盯上的自覺" } },
      flags: [],
      notebook: null,
      links: { showEnd: true },
    },
  },
};
