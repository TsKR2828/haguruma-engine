// ═══════════════════════════════════════════════════════════
// 第一章「レエン・コオト」（雨衣）— 正規化場景資料
// Source: 芥川龍之介《歯車》
// 青空文庫 https://www.aozora.gr.jp/cards/000879/files/42377_34745.html
// 底本檔案：reference/aozora/haguruma_original.txt
//
// 場景格式定義：docs/chapter-data-schema.md
// ═══════════════════════════════════════════════════════════

export const CHAPTER_01 = {
  chapter: 1,
  title: "レエン・コオト",
  titleCn: "雨衣",
  startScene: "prologue",
  startLocation: "kasugai",
  sceneCount: 34,

  portraits: {
    barbershop_owner: "portraits/ch1/barbershop_owner.png",
    female_student_a: "portraits/ch1/female_student_a.png",
    female_student_b: "portraits/ch1/female_student_b.png",
    older_female_student: "portraits/ch1/older_female_student.png",
    t_kun: "portraits/ch1/t_kun.png",
    sinologist: "portraits/ch1/sinologist.png",
    niece: "portraits/ch1/niece.png",
  },

  locations: [
    { id: "kasugai", label: "避暑地", sub: "鎌倉", x: 50, y: 60, shape: "mountain" },
    { id: "station", label: "停車場", sub: "東海道", x: 110, y: 142, shape: "rect", symbolKey: "raincoat_station" },
    { id: "t_san", label: "省線", sub: "T 君と", x: 170, y: 220, shape: "circle", symbolKey: "raincoat_train" },
    { id: "street", label: "街道", sub: "齒輪", x: 210, y: 280, shape: "circle", symbolKey: "gear_first" },
    { id: "hotel", label: "旅館", sub: "東京", x: 254, y: 348, shape: "rect", symbolKey: "wing_corridor" },
  ],

  connections: [
    {
      id: "raincoat_double",
      requires: ["raincoat_station", "raincoat_train"],
      title: "兩件雨衣",
      subtitle: "迴路初現",
      icon: "◇",
      insightGain: 1,
    },
    {
      id: "raincoat_triple",
      requires: ["raincoat_station", "raincoat_train", "raincoat_hotel"],
      title: "三件雨衣",
      subtitle: "形未明，迴路已成",
      icon: "◈",
      insightGain: 1,
    },
    {
      id: "raincoat_omen",
      requires: ["raincoat_station", "raincoat_death"],
      title: "季節外れの雨衣",
      subtitle: "死の予兆",
      icon: "✦",
      insightGain: 2,
    },
    {
      id: "allright_meaning",
      check: (s) =>
        s.choicesMade.pondered_allright &&
        s.notebook.some((n) => n.key === "raincoat_death"),
      title: "All right",
      subtitle: "すべて整ふ",
      icon: "✶",
      insightGain: 1,
    },
    {
      id: "worm_chain",
      requires: ["book_worm", "wing_corridor"],
      title: "麒麟・鳳凰・蛆",
      subtitle: "言葉の滑り",
      icon: "◉",
      insightGain: 1,
    },
  ],

  scenes: {
    // ─────────────── 序：避暑地出發 ───────────────

    prologue: {
      id: "prologue",
      text: [
        { type: "system", content: "第一章　レエン・コオト" },
        { type: "system", content: "——雨衣——" },
        { type: "break" },
        { type: "narration", origin: "source", jp: "僕は或知り人の結婚披露式につらなる為に鞄を一つ下げたまま、東海道の或停車場へその奥の避暑地から自動車を飛ばした。", cn: "我提著一只皮箱，為了出席某個熟人的結婚披露宴，從避暑地叫了一輛汽車趕往東海道的某個停車場。" },
        { type: "narration", origin: "source", jp: "自動車の走る道の両がわは大抵松ばかり茂っていた。上り列車に間に合うかどうかは可也怪しいのに違いなかった。", cn: "道路兩旁大多只長著松樹。能不能趕上上行列車，相當令人懷疑。" },
        { type: "narration", origin: "source", jp: "自動車には丁度僕の外に或理髪店の主人も乗り合せていた。彼は棗のようにまるまると肥った、短い顋髯の持ち主だった。僕は時間を気にしながら、時々彼と話をした。", cn: "車上除了我以外，還坐著一位理髮店的老闆。他是個棗子般圓滾滾的男人，留著短短的下巴鬍。我一邊在意著時間，一邊偶爾跟他聊上幾句。" },
      ],
      choices: null,
      next: "auto_barber",
      effects: null,
      flags: [],
      notebook: null,
      links: { visit: "kasugai" },
    },

    // ─────────────── 理髮店主人的怪談 ───────────────

    auto_barber: {
      id: "auto_barber",
      text: [
        { type: "dialogue", origin: "source", speaker: "理髮店主人", speakerId: "barbershop_owner", jp: "「妙なこともありますね。××さんの屋敷には昼間でも幽霊が出るって云うんですが」", cn: "「也有奇怪的事呢。聽說 ×× 先生的宅邸，白天也有幽靈出沒。」" },
        { type: "dialogue", origin: "source", speaker: "我", speakerId: "protagonist", jp: "「昼間でもね」", cn: "「就算白天也？」" },
        { type: "narration", origin: "source", jp: "僕は冬の西日の当った向うの松山を眺めながら、善い加減に調子を合せていた。", cn: "我看著對面冬日西曬的松山，隨口附和著。" },
        { type: "dialogue", origin: "source", speaker: "理髮店主人", speakerId: "barbershop_owner", jp: "「尤も天気の善い日には出ないそうです。一番多いのは雨のふる日だって云うんですが」", cn: "「不過天氣好的時候不會出現。最常出沒的是下雨天。」" },
      ],
      choices: [
        {
          text: "「下雨天出來——是來淋雨的吧？」",
          next: "auto_barber_2",
          flag: "joke_response",
          effects: { writing: { amount: 1, reason: "俏皮話的試刀" } },
          notebook: null,
          unlock: null,
          sourceJp: "「雨の降る日に濡れに来るんじゃないか？」",
        },
        {
          text: "沉默地望向窗外的松林。",
          next: "auto_barber_2",
          flag: "silent_response",
          effects: { writing: { amount: 1, reason: "寡言的觀察" } },
          notebook: null,
          unlock: null,
        },
      ],
      next: null,
      effects: null,
      flags: ["joke_response", "silent_response"],
      notebook: null,
      links: null,
    },

    auto_barber_2: {
      id: "auto_barber_2",
      text: (state) => {
        const base = [];
        if (state.choicesMade.joke_response) {
          base.push({ type: "dialogue", origin: "source", speaker: "我", speakerId: "protagonist", jp: "「雨の降る日に濡れに来るんじゃないか？」", cn: "「下雨天出來——是來淋雨的吧？」" });
          base.push({ type: "dialogue", origin: "source", speaker: "理髮店主人", speakerId: "barbershop_owner", jp: "「御常談で。……しかしレエン・コオトを着た幽霊だって云うんです」", cn: "「您說笑了。……不過聽說是穿著雨衣的幽靈呢。」" });
        } else {
          base.push({ type: "narration", origin: "added", content: "理髮店主人見我沉默，又自顧自地說了下去。" });
          base.push({ type: "dialogue", origin: "source", speaker: "理髮店主人", speakerId: "barbershop_owner", jp: "しかしレエン・コオトを着た幽霊だって云うんです", cn: "「不過聽說是穿著雨衣的幽靈呢。」" });
        }
        base.push({ type: "narration", origin: "source", jp: "自動車はラッパを鳴らしながら、或停車場へ横着けになった。僕は或理髪店の主人に別れ、停車場の中へはいって行った。", cn: "汽車鳴著喇叭，橫靠在了某個停車場旁。我與理髮店主人告別，走進了停車場。" });
        base.push({ type: "narration", origin: "source", jp: "すると果して上り列車は二三分前に出たばかりだった。", cn: "果然——上行列車在兩三分鐘前剛剛開走了。" });
        return base;
      },
      choices: null,
      next: "auto_station",
      effects: null,
      flags: [],
      notebook: null,
      links: null,
    },

    // ─────────────── 停車場：雨衣男人 ───────────────

    auto_station: {
      id: "auto_station",
      text: [
        { type: "narration", origin: "source", jp: "待合室のベンチにはレエン・コオトを着た男が一人ぼんやり外を眺めていた。", cn: "候車室的長椅上，一個穿著雨衣的男人獨自茫然地望著窗外。" },
        { type: "inner", origin: "source", jp: "僕は今聞いたばかりの幽霊の話を思い出した。が、ちょっと苦笑したぎり、とにかく次の列車を待つ為に停車場前のカッフェへはいることにした。", cn: "我想起了剛才聽到的幽靈故事。不過只是苦笑了一下，決定到停車場前的咖啡廳去等下一班列車。" },
      ],
      choices: [
        {
          text: "仔細觀察那個穿雨衣的男人。",
          next: "station_observe",
          flag: "observed_raincoat_1",
          effects: { insight: { amount: 1, reason: "注意到不該注意的" } },
          notebook: { key: "raincoat_station", symbol: "raincoat", desc: "停車場候車室——穿雨衣的男人，茫然望向窗外" },
          unlock: "raincoat_station",
        },
        {
          text: "沒有多想，直接走向咖啡廳。",
          next: "auto_cafe",
          flag: "skipped_raincoat_1",
          effects: null,
          notebook: null,
          unlock: null,
        },
      ],
      next: null,
      effects: null,
      flags: ["observed_raincoat_1", "skipped_raincoat_1"],
      notebook: null,
      links: { fold: "── 車中 · 怪談 ──", visit: "station" },
    },

    station_observe: {
      id: "station_observe",
      text: [
        { type: "narration", origin: "added", content: "他就那樣坐著。雨衣的顏色在冬天的光線下顯得不合時令。他的臉模糊不清——或者說，我沒有記住它。" },
        { type: "narration", origin: "added", content: "我轉身走向咖啡廳。" },
      ],
      choices: null,
      next: "auto_cafe",
      effects: null,
      flags: [],
      notebook: null,
      links: null,
    },

    // ─────────────── 咖啡廳：紙牌 ───────────────

    auto_cafe: {
      id: "auto_cafe",
      text: [
        { type: "narration", origin: "source", jp: "それはカッフェと云う名を与えるのも考えものに近いカッフェだった。僕は隅のテエブルに坐り、ココアを一杯註文した。", cn: "說是咖啡廳，其實叫它咖啡廳都嫌勉強。我坐在角落的桌子前，點了一杯可可。" },
        { type: "narration", origin: "source", jp: "テエブルにかけたオイル・クロオスは白地に細い青の線を荒い格子に引いたものだった。しかしもう隅々には薄汚いカンヴァスを露していた。僕は膠臭いココアを飲みながら、人げのないカッフェの中を見まわした。", cn: "桌上鋪的油布是白底藍格的粗格紋，角落已經磨出了底下的帆布。膠水味的可可。" },
        { type: "narration", origin: "source", jp: "埃じみたカッフェの壁には「親子丼」だの「カツレツ」だのと云う紙札が何枚も貼ってあった。", cn: "牆上貼著好幾張紙牌——「親子丼」「炸豬排」。" },
        { type: "narration", origin: "source", jp: "「地玉子、オムレツ」", cn: "還有一張：「地玉子、オムレツ」。" },
      ],
      choices: [
        {
          text: "細看那些紙牌。",
          next: "cafe_signs",
          flag: "read_signs",
          effects: { writing: { amount: 1, reason: "田舍的氣息" } },
          notebook: null,
          unlock: null,
        },
        {
          text: "喝完可可，等列車。",
          next: "auto_train_3rd",
          flag: "skip_signs",
          effects: null,
          notebook: null,
          unlock: null,
        },
      ],
      next: null,
      effects: null,
      flags: ["read_signs", "skip_signs"],
      notebook: null,
      links: null,
    },

    cafe_signs: {
      id: "cafe_signs",
      text: [
        { type: "narration", origin: "source", jp: "僕はこう云う紙札に東海道線に近い田舎を感じた。それは麦畑やキャベツ畑の間に電気機関車の通る田舎だった。……", cn: "「地玉子」——本地雞蛋。這三個字讓我感覺到了東海道沿線的鄉下。那是麥田和甘藍田之間通著電氣機關車的田舍。" },
        { type: "inner", origin: "added", content: "電氣機關車通過麥田的田舍——這幾個字在我腦裡留下了什麼。" },
      ],
      choices: null,
      next: "auto_train_3rd",
      effects: null,
      flags: [],
      notebook: null,
      links: null,
    },

    // ─────────────── 三等車廂：女學生 ───────────────

    auto_train_3rd: {
      id: "auto_train_3rd",
      text: [
        { type: "break" },
        { type: "narration", origin: "source", jp: "次の上り列車に乗ったのはもう日暮に近い頃だった。僕はいつも二等に乗っていた。が、何かの都合上、その時は三等に乗ることにした。", cn: "等到搭上下一班上行列車時，天色已經接近黃昏。我平常坐二等車廂，但因為某種緣故，這次坐了三等。" },
        { type: "narration", origin: "source", jp: "汽車の中は可也こみ合っていた。しかも僕の前後にいるのは大磯かどこかへ遠足に行ったらしい小学校の女生徒ばかりだった。僕は巻煙草に火をつけながら、こう云う女生徒の群れを眺めていた。彼等はいずれも快活だった。のみならず殆どしゃべり続けだった。", cn: "車廂裡相當擁擠。我的前後全是去大磯之類地方遠足歸來的小學女學生。她們個個活潑，幾乎沒停過嘴。" },
        { type: "dialogue", origin: "source", speaker: "女學生", speakerId: "female_student_a", jp: "「写真屋さん、ラヴ・シインって何？」", cn: "「照相館叔叔，Love scene 是什麼？」" },
        { type: "narration", origin: "source", jp: "やはり遠足について来たらしい、僕の前にいた「写真屋さん」は何とかお茶を濁していた。しかし十四五の女生徒の一人はまだいろいろのことを問いかけていた。僕はふと彼女の鼻に蓄膿症のあることを感じ、何か頬笑まずにはいられなかった。", cn: "隨隊的「照相館叔叔」含混地搪塞過去了。但那個十四五歲的女學生還在追問。我注意到她鼻子有蓄膿症，忍不住微笑了一下。" },
        { type: "narration", origin: "source", jp: "それから又僕の隣りにいた十二三の女生徒の一人は若い女教師の膝の上に坐り、片手に彼女の頸を抱きながら、片手に彼女の頬をさすっていた。しかも誰かと話す合い間に時々こう女教師に話しかけていた。", cn: "我旁邊坐著的十二三歲女學生則坐在年輕女老師的膝上，一手摟著她的脖子，一手撫著她的臉頰。" },
        { type: "dialogue", origin: "source", speaker: "女學生", speakerId: "female_student_b", jp: "「可愛いわね、先生は。可愛い目をしていらっしゃるわね」", cn: "「好可愛呢，老師。老師的眼睛真可愛。」" },
      ],
      choices: [
        {
          text: "觀察那個年紀稍長、踩了別人腳道歉的女學生。",
          next: "train_mature_girl",
          flag: "observed_mature_girl",
          effects: { insight: { amount: 1, reason: "矛盾的早熟" } },
          notebook: null,
          unlock: null,
        },
        {
          text: "抽著卷菸，不太在意她們。",
          next: "auto_train_to_t",
          flag: "ignored_girls",
          effects: null,
          notebook: null,
          unlock: null,
        },
      ],
      next: null,
      effects: null,
      flags: ["observed_mature_girl", "ignored_girls"],
      notebook: null,
      links: { fold: "── 停車場 · 雨衣與紙牌 ──" },
    },

    train_mature_girl: {
      id: "train_mature_girl",
      text: [
        { type: "narration", origin: "source", jp: "彼等は僕には女生徒よりも一人前の女と云う感じを与えた。林檎を皮ごと噛じっていたり、キャラメルの紙を剥いていることを除けば。……", cn: "她們在我眼中，與其說是女學生，倒更像是不折不扣的女人——若不是整顆帶皮啃著蘋果、剝著牛奶糖紙的模樣。……" },
        { type: "narration", origin: "source", jp: "しかし年かさらしい女生徒の一人は僕の側を通る時に誰かの足を踏んだと見え、", cn: "年紀較大的那個女學生路過我身邊時似乎踩了誰的腳——" },
        { type: "dialogue", origin: "source", speaker: "年長的女學生", speakerId: "older_female_student", jp: "「御免なさいまし」", cn: "「非常抱歉」" },
        { type: "narration", origin: "source", jp: "と声をかけた。彼女だけは彼等よりもませているだけに反って僕には女生徒らしかった。僕は巻煙草を啣えたまま、この矛盾を感じた僕自身を冷笑しない訣には行かなかった。", cn: "——她這麼說了。她比其他人更早熟——但正因如此，反而是她最像「女學生」。我嘴裡含著卷菸，對自己感受到的這個矛盾冷笑了一聲。" },
      ],
      choices: null,
      next: "auto_train_to_t",
      effects: null,
      flags: [],
      notebook: null,
      links: null,
    },

    // ─────────────── 省線電車：T 君 ───────────────

    auto_train_to_t: {
      id: "auto_train_to_t",
      text: [
        { type: "break" },
        { type: "narration", origin: "source", jp: "いつか電燈をともした汽車はやっと或郊外の停車場へ着いた。僕は風の寒いプラットホオムへ下り、一度橋を渡った上、省線電車の来るのを待つことにした。", cn: "不知何時車廂亮了燈。列車終於停靠在某個郊外的停車場。我在寒風凜冽的月台上下車，越過天橋，等候省線電車。" },
        { type: "narration", origin: "source", jp: "すると偶然顔を合せたのは或会社にいるＴ君だった、", cn: "在那裡，我偶然遇到了在某公司任職的 T 君。" },
        { type: "narration", origin: "source", jp: "僕等は電車を待っている間に不景気のことなどを話し合った。Ｔ君は勿論僕などよりもこう云う問題に通じていた。が、逞しい彼の指には余り不景気には縁のない土耳古石の指環も嵌まっていた。", cn: "我們在等電車的間隙聊了些不景氣之類的話題。T 君的粗壯手指上嵌著一枚與不景氣毫無關係的土耳其石戒指。" },
        { type: "dialogue", origin: "source", speaker: "我", speakerId: "protagonist", jp: "「大したものを嵌めているね」", cn: "「戴著挺不錯的東西嘛。」" },
        { type: "dialogue", origin: "source", speaker: "T 君", speakerId: "t_kun", jp: "「これか？　これはハルビンへ商売に行っていた友だちの指環を買わされたのだよ。そいつも今は往生している。コオペラティヴと取引きが出来なくなったものだから」", cn: "「這個？這是被一個去哈爾濱做生意的朋友硬塞的。那傢伙現在也走投無路了。因為跟合作社做不成生意了。」" },
        { type: "narration", origin: "source", jp: "僕等の乗った省線電車は幸いにも汽車ほどこんでいなかった。僕等は並んで腰をおろし、いろいろのことを話していた。Ｔ君はついこの春に巴里にある勤め先から東京へ帰ったばかりだった。従って僕等の間には巴里の話も出勝ちだった。カイヨオ夫人の話、蟹料理の話、御外遊中の或殿下の話、……", cn: "省線電車幸好不像火車那麼擠。我們並肩坐下，聊起了巴黎的事。T 君今年春天才從巴黎的任職處回到東京。卡約夫人的事、螃蟹料理的事、某位殿下出訪的事。" },
        { type: "dialogue", origin: "source", speaker: "T 君", speakerId: "t_kun", jp: "「仏蘭西は存外困ってはいないよ、唯元来仏蘭西人と云うやつは税を出したがらない国民だから、内閣はいつも倒れるがね。……」", cn: "「法國其實沒那麼慘啦，只不過法國人這種國民天生不愛繳稅，所以內閣總是垮台就是了……」" },
        { type: "dialogue", origin: "source", speaker: "我", speakerId: "protagonist", jp: "「だってフランは暴落するしさ」", cn: "「可是法郎在暴跌啊。」" },
        { type: "dialogue", origin: "source", speaker: "T 君", speakerId: "t_kun", jp: "「それは新聞を読んでいればね。しかし向うにいて見給え。新聞紙上の日本なるものはのべつ大地震や大洪水があるから」", cn: "「那是看報紙才會這麼想。你要是人在那邊看看就知道了，報紙上的日本啊，動不動就是大地震、大洪水的。」" },
      ],
      choices: null,
      next: "auto_train_t_raincoat",
      effects: null,
      flags: [],
      notebook: null,
      links: { fold: "── 三等車廂 · 女學生 ──", visit: "t_san" },
    },

    auto_train_t_raincoat: {
      id: "auto_train_t_raincoat",
      text: [
        { type: "narration", origin: "source", jp: "するとレエン・コオトを着た男が一人僕等の向うへ来て腰をおろした。", cn: "這時——一個穿雨衣的男人走過來，在我們對面坐下了。" },
        { type: "inner", origin: "source", jp: "僕はちょっと無気味になり、何か前に聞いた幽霊の話をＴ君に話したい心もちを感じた。", cn: "我感到一瞬間的不安。想把之前聽到的幽靈故事告訴 T 君。" },
        { type: "narration", origin: "source", jp: "が、Ｔ君はその前に杖の柄をくるりと左へ向け、顔は前を向いたまま、小声に僕に話しかけた。", cn: "但 T 君搶先把手杖的握柄朝左轉了一下，臉仍朝前，壓低聲音跟我說——" },
        { type: "dialogue", origin: "source", speaker: "T 君", speakerId: "t_kun", jp: "「あすこに女が一人いるだろう？　鼠色の毛糸のショオルをした、……」", cn: "「那邊有個女人看到了嗎？灰色毛線披肩的……」" },
        { type: "dialogue", origin: "source", speaker: "我", speakerId: "protagonist", jp: "「あの西洋髪に結った女か？」", cn: "「你是說梳西式髮型的那個女人？」" },
        { type: "dialogue", origin: "source", speaker: "T 君", speakerId: "t_kun", jp: "「うん、風呂敷包みを抱えている女さ。あいつはこの夏は軽井沢にいたよ。ちょっと洒落れた洋装などをしてね」", cn: "「嗯，就是那個抱著包袱巾的女人。她這個夏天在輕井澤。穿得挺時髦的。」" },
        { type: "narration", origin: "source", jp: "しかし彼女は誰の目にも見すぼらしいなりをしているのに違いなかった。僕はＴ君と話しながら、そっと彼女を眺めていた。彼女はどこか眉の間に気違いらしい感じのする顔をしていた。しかもその又風呂敷包みの中から豹に似た海綿をはみ出させていた。", cn: "但眼前的她明顯衣著寒酸。我一邊跟 T 君說話，一邊偷偷打量她。她的眉間帶著某種瘋狂的氣息。包袱裡還露出了一塊像豹紋的海綿。" },
        { type: "dialogue", origin: "source", speaker: "T 君", speakerId: "t_kun", jp: "「軽井沢にいた時には若い亜米利加人と踊ったりしていたっけ。モダアン……何と云うやつかね」", cn: "「她在輕井澤的時候，還跟年輕的美國人跳舞什麼的。Modern……叫什麼來著。」" },
      ],
      choices: [
        {
          text: "注意那個穿雨衣的男人——他還在嗎？",
          next: "raincoat_gone",
          flag: "checked_raincoat_2",
          effects: null,
          notebook: { key: "raincoat_train", symbol: "raincoat", desc: "省線電車——穿雨衣的男人坐在對面，後來不知何時消失了" },
          unlock: "raincoat_train",
        },
        {
          text: "繼續跟 T 君聊那個女人。",
          next: "raincoat_gone_passive",
          flag: "ignored_raincoat_2",
          effects: null,
          notebook: null,
          unlock: null,
        },
      ],
      next: null,
      effects: null,
      flags: ["checked_raincoat_2", "ignored_raincoat_2"],
      notebook: null,
      links: null,
    },

    raincoat_gone: {
      id: "raincoat_gone",
      text: [
        { type: "narration", origin: "source", jp: "レエン・コオトを着た男は僕のＴ君と別れる時にはいつかそこにいなくなっていた。", cn: "我與 T 君告別時回頭望——穿雨衣的男人不知何時已經不在了。" },
      ],
      choices: null,
      next: "auto_walk_gears",
      effects: null,
      flags: [],
      notebook: null,
      links: null,
    },

    raincoat_gone_passive: {
      id: "raincoat_gone_passive",
      text: [
        { type: "narration", origin: "source", jp: "レエン・コオトを着た男は僕のＴ君と別れる時にはいつかそこにいなくなっていた。", cn: "我與 T 君告別時回頭望——穿雨衣的男人不知何時已經不在了。" },
      ],
      choices: null,
      next: "auto_walk_gears",
      effects: null,
      flags: [],
      notebook: null,
      links: null,
    },

    // ─────────────── 步行：齒輪初現 ───────────────

    auto_walk_gears: {
      id: "auto_walk_gears",
      text: [
        { type: "break" },
        { type: "narration", origin: "source", jp: "僕は省線電車の或停車場からやはり鞄をぶら下げたまま、或ホテルへ歩いて行った。往来の両側に立っているのは大抵大きいビルディングだった。", cn: "我提著皮箱，從省線電車的某個停車場步行前往旅館。道路兩側大多是高大的大樓。" },
        { type: "narration", origin: "source", jp: "僕はそこを歩いているうちにふと松林を思い出した。", cn: "走著走著，我忽然想起了松林。" },
        { type: "narration", origin: "source", jp: "のみならず僕の視野のうちに妙なものを見つけ出した。", cn: "然後——我的視野中出現了奇怪的東西。" },
        { type: "pause", duration: 1500 },
        { type: "narration", origin: "source", jp: "妙なものを？――と云うのは絶えずまわっている半透明の歯車だった。", cn: "半透明的齒輪。不停旋轉的齒輪。" },
        { type: "inner", origin: "source", jp: "僕はこう云う経験を前にも何度か持ち合せていた。歯車は次第に数を殖やし、半ば僕の視野を塞いでしまう、が、それも長いことではない、暫らくの後には消え失せる代りに今度は頭痛を感じはじめる、――それはいつも同じことだった。", cn: "我以前也有過幾次這樣的經驗。齒輪會逐漸增多，遮住我半邊視野，但不會持續太久——消失之後，隨之而來的是頭痛。每次都是如此。" },
        { type: "narration", origin: "source", jp: "眼科の医者はこの錯覚（？）の為に度々僕に節煙を命じた。しかしこう云う歯車は僕の煙草に親まない二十前にも見えないことはなかった。", cn: "眼科醫生因為這種錯覺（？）屢次叫我節制抽菸。可是這種齒輪，早在我二十歲前還不沾菸的時候，也不是沒見過。" },
      ],
      choices: [
        {
          text: "用手遮住右眼，測試左眼的視力。",
          next: "gears_test",
          flag: "tested_eyes",
          effects: {
            nerve: { amount: -1, reason: "齒輪出現" },
            insight: { amount: 1, reason: "確認了異象的位置" },
          },
          notebook: { key: "gear_first", symbol: "gear", desc: "往旅館途中——半透明的齒輪初次出現在右眼瞼內側" },
          unlock: "gear_first",
        },
        {
          text: "又來了。低頭繼續走。",
          next: "gears_endure",
          flag: "endured_gears",
          effects: {
            nerve: { amount: -1, reason: "齒輪出現" },
          },
          notebook: { key: "gear_first", symbol: "gear", desc: "往旅館途中——半透明的齒輪初次出現" },
          unlock: "gear_first",
        },
      ],
      next: null,
      effects: null,
      flags: ["tested_eyes", "endured_gears"],
      notebook: null,
      links: { fold: "── 省線電車 · T 君 ──", visit: "street" },
    },

    gears_test: {
      id: "gears_test",
      text: [
        { type: "narration", origin: "source", jp: "僕は又はじまったなと思い、左の目の視力をためす為に片手に右の目を塞いで見た。", cn: "我心想又來了，為了測試左眼視力，用一隻手遮住了右眼。" },
        { type: "narration", origin: "source", jp: "左の目は果して何ともなかった。", cn: "左眼沒事。" },
        { type: "narration", origin: "source", jp: "しかし右の目の瞼の裏には歯車が幾つもまわっていた。", cn: "但右眼瞼的內側，卻有好幾個齒輪還在轉動。" },
        { type: "narration", origin: "source", jp: "僕は右側のビルディングの次第に消えてしまうのを見ながら、せっせと往来を歩いて行った。", cn: "我看著右邊的大樓一棟棟消失在齒輪後面，加快腳步朝旅館走去。" },
      ],
      choices: null,
      next: "auto_hotel_arrive",
      effects: null,
      flags: [],
      notebook: null,
      links: null,
    },

    gears_endure: {
      id: "gears_endure",
      text: [
        { type: "narration", origin: "added", content: "我低著頭快步走著。視野右側的大樓逐漸被吞沒。我知道這會過去的。齒輪總是會消失。代價是頭痛。" },
      ],
      choices: null,
      next: "auto_hotel_arrive",
      effects: null,
      flags: [],
      notebook: null,
      links: null,
    },

    // ─────────────── 旅館：到達 ───────────────

    auto_hotel_arrive: {
      id: "auto_hotel_arrive",
      text: [
        { type: "break" },
        { type: "narration", origin: "source", jp: "ホテルの玄関をはいった時には歯車ももう消え失せていた。が、頭痛はまだ残っていた。僕は外套や帽子を預ける次手に部屋を一つとって貰うことにした。", cn: "走進旅館玄關時，齒輪已經消失了。但頭痛還在。我寄存了外套和帽子，順便要了一間房。" },
        { type: "narration", origin: "source", jp: "それから或雑誌社へ電話をかけて金のことを相談した。", cn: "又打電話給某雜誌社商量了錢的事。" },
        { type: "narration", origin: "source", jp: "結婚披露式の晩餐はとうに始まっていたらしかった。", cn: "結婚披露宴的晚餐早就開始了。" },
      ],
      choices: null,
      next: "auto_banquet",
      effects: null,
      flags: [],
      notebook: null,
      links: { fold: "── 步行 · 齒輪 ──", visit: "hotel" },
    },

    // ─────────────── 婚宴：漢學家與蛆蟲 ───────────────

    auto_banquet: {
      id: "auto_banquet",
      text: [
        { type: "narration", origin: "source", jp: "結婚披露式の晩餐はとうに始まっていたらしかった。僕はテエブルの隅に坐り、ナイフやフォオクを動かし出した。正面の新郎や新婦をはじめ、白い凹字形のテエブルに就いた五十人あまりの人びとは勿論いずれも陽気だった。", cn: "我坐在長桌的角落，開始動起刀叉。正面的新郎新婦，白色凹字形桌邊入座的五十餘人——所有人都很快活。" },
        { type: "inner", origin: "source", jp: "が、僕の心もちは明るい電燈の光の下にだんだん憂鬱になるばかりだった。", cn: "但我的心情在明亮的電燈光下越來越陰鬱。" },
        { type: "narration", origin: "source", jp: "僕はこの心もちを遁れる為に隣にいた客に話しかけた。彼は丁度獅子のように白い頬髯を伸ばした老人だった。のみならず僕も名を知っていた或名高い漢学者だった。従って又僕等の話はいつか古典の上へ落ちて行った。", cn: "為了逃避這種感覺，我跟隔壁的客人搭了話。他是個獅子般白色頰髯的老人——某位著名的漢學家，我也知道他的名字。話題自然地轉到了古典。" },
        { type: "dialogue", origin: "source", speaker: "我", speakerId: "protagonist", jp: "「麒麟はつまり一角獣ですね。それから鳳凰もフェニックスと云う鳥の、……」", cn: "「麒麟其實就是一角獸。然後鳳凰也是 Phoenix 這種鳥的——」" },
        { type: "narration", origin: "source", jp: "この名高い漢学者はこう云う僕の話にも興味を感じているらしかった。", cn: "漢學家似乎對我的話很有興趣。" },
        { type: "inner", origin: "added", content: "我在機械性地說話的同時，漸漸感到了一種病態的破壞慾。" },
      ],
      choices: [
        {
          text: "順從破壞慾——主張堯舜是架空人物，《春秋》的作者其實是漢代的人。",
          next: "banquet_destroy",
          flag: "destroyed_classics",
          effects: {
            nerve: { amount: -1, reason: "破壞慾" },
            insight: { amount: 1, reason: "感受到內在的瓦解" },
          },
          notebook: null,
          unlock: null,
        },
        {
          text: "壓下衝動，繼續平穩地聊下去。",
          next: "banquet_calm",
          flag: "stayed_calm",
          effects: null,
          notebook: null,
          unlock: null,
        },
      ],
      next: null,
      effects: null,
      flags: ["destroyed_classics", "stayed_calm"],
      notebook: null,
      links: null,
    },

    banquet_destroy: {
      id: "banquet_destroy",
      text: [
        { type: "narration", origin: "source", jp: "僕は機械的にしゃべっているうちにだんだん病的な破壊慾を感じ、堯舜を架空の人物にしたのは勿論、「春秋」の著者もずっと後の漢代の人だったことを話し出した。", cn: "我在機械性地說話的同時，漸漸感到了一種病態的破壞慾——不僅主張堯舜是架空人物，還說出了《春秋》的作者其實是漢代人這件事。" },
        { type: "narration", origin: "source", jp: "するとこの漢学者は露骨に不快な表情を示し、少しも僕の顔を見ずに殆ど虎の唸るように僕の話を截り離した。", cn: "漢學家露骨地露出了不快的表情。他不再看我的臉，像老虎低吼般截斷了我的話——" },
        { type: "dialogue", origin: "source", speaker: "漢學家", speakerId: "sinologist", jp: "「もし堯舜もいなかったとすれば、孔子は噓をつかれたことになる。聖人の噓をつかれる筈はない」", cn: "「如果連堯舜都不存在，那孔子豈不是說了謊。聖人不可能說謊。」" },
        { type: "narration", origin: "source", jp: "僕は勿論黙ってしまった。", cn: "我當然沉默了。" },
      ],
      choices: null,
      next: "auto_banquet_worm",
      effects: null,
      flags: [],
      notebook: null,
      links: null,
    },

    banquet_calm: {
      id: "banquet_calm",
      text: [
        { type: "narration", origin: "added", content: "我壓下了那股衝動。對話平穩地結束了。漢學家似乎對我的博學留有好印象。" },
        { type: "inner", origin: "added", content: "但我感覺到那股衝動並沒有消失。" },
      ],
      choices: null,
      next: "auto_banquet_worm",
      effects: null,
      flags: [],
      notebook: null,
      links: null,
    },

    auto_banquet_worm: {
      id: "auto_banquet_worm",
      text: [
        { type: "narration", origin: "source", jp: "それから又皿の上の肉へナイフやフォオクを加えようとした。", cn: "我重新拿起刀叉，準備切盤中的肉。這時——" },
        { type: "narration", origin: "source", jp: "すると小さい蛆が一匹静かに肉の縁に蠢めいていた。", cn: "一隻小蛆蟲在肉的邊緣靜靜地蠕動著。" },
        { type: "inner", origin: "source", jp: "蛆は僕の頭の中に Worm と云う英語を呼び起した。それは又麒麟や鳳凰のように或伝説的動物を意味している言葉にも違いなかった。", cn: "蛆——Worm。這個英語單字突然冒了出來。Worm 同時也是某種傳說動物的意思，就像麒麟和鳳凰一樣。" },
        { type: "narration", origin: "source", jp: "僕はナイフやフォオクを置き、いつか僕の杯にシャンパアニュのつがれるのを眺めていた。", cn: "我放下了刀叉。看著有人往我的酒杯裡倒入香檳。" },
      ],
      choices: [
        {
          text: "在腦中追蹤 Worm 這個詞的意義。",
          next: "worm_trace",
          flag: "traced_worm",
          effects: { insight: { amount: 1, reason: "語言的滑移" } },
          notebook: { key: "book_worm", symbol: "book", desc: "蛆→Worm→傳說動物——語言在我腦中自行滑移" },
          unlock: "book_worm",
        },
        {
          text: "不去想它。喝掉香檳。",
          next: "auto_hotel_night",
          flag: "drank_champagne",
          effects: null,
          notebook: null,
          unlock: null,
        },
      ],
      next: null,
      effects: null,
      flags: ["traced_worm", "drank_champagne"],
      notebook: null,
      links: null,
    },

    worm_trace: {
      id: "worm_trace",
      text: [
        { type: "inner", origin: "added", content: "蛆蟲、Worm、龍——worm 的古義。麒麟是一角獸，鳳凰是 Phoenix，那麼蛆蟲是……它也活在某個傳說裡嗎？" },
      ],
      choices: null,
      next: "auto_hotel_night",
      effects: null,
      flags: [],
      notebook: null,
      links: null,
    },

    // ─────────────── 旅館：夜 ───────────────

    auto_hotel_night: {
      id: "auto_hotel_night",
      text: [
        { type: "break" },
        { type: "narration", origin: "source", jp: "やっと晩餐のすんだ後、僕は前にとって置いた僕の部屋へこもる為に人気のない廊下を歩いて行った。廊下は僕にはホテルよりも監獄らしい感じを与えるものだった。しかし幸いにも頭痛だけはいつの間にか薄らいでいた。", cn: "晚餐終於結束。我沿著無人的走廊，走向之前訂好的房間。走廊給我的感覺與其說是旅館，不如說更像監獄。不過頭痛倒是不知不覺減輕了。" },
        { type: "narration", origin: "source", jp: "僕の部屋には鞄は勿論、帽子や外套も持って来てあった。", cn: "房間裡，皮箱、帽子和外套都已經送來了。" },
        { type: "narration", origin: "source", jp: "僕は壁にかけた外套に僕自身の立ち姿を感じ、", cn: "——掛在牆上的外套讓我感覺到了我自己站立的身影。" },
      ],
      choices: [
        {
          text: "急忙把外套塞進房間角落的衣櫃裡。",
          next: "hotel_coat_hide",
          flag: "hid_coat",
          effects: null,
          notebook: null,
          unlock: null,
        },
        {
          text: "盯著那件外套看了一會兒。",
          next: "hotel_coat_stare",
          flag: "stared_coat",
          effects: { nerve: { amount: -1, reason: "無頭的我" } },
          notebook: null,
          unlock: null,
        },
      ],
      next: null,
      effects: null,
      flags: ["hid_coat", "stared_coat"],
      notebook: null,
      links: { fold: "── 婚宴 · 蛆蟲與 Worm ──" },
    },

    hotel_coat_hide: {
      id: "hotel_coat_hide",
      text: [
        { type: "narration", origin: "source", jp: "急いでそれを部屋の隅の衣裳戸棚の中へ抛りこんだ。", cn: "我急忙把它塞進了房間角落的衣裳戸棚裡。" },
      ],
      choices: null,
      next: "auto_hotel_mirror",
      effects: null,
      flags: [],
      notebook: null,
      links: null,
    },

    hotel_coat_stare: {
      id: "hotel_coat_stare",
      text: [
        { type: "narration", origin: "added", content: "它就掛在那裡。袖子微微垂著。像一個沒有頭的我。" },
        { type: "narration", origin: "source", jp: "急いでそれを部屋の隅の衣裳戸棚の中へ抛りこんだ。", cn: "……我終於還是忍不住，急忙把它塞進了衣裳戸棚。" },
      ],
      choices: null,
      next: "auto_hotel_mirror",
      effects: null,
      flags: [],
      notebook: null,
      links: null,
    },

    auto_hotel_mirror: {
      id: "auto_hotel_mirror",
      text: [
        { type: "narration", origin: "source", jp: "それから鏡台の前へ行き、じっと鏡に僕の顔を映した。", cn: "我走到梳妝台前，盯著鏡中的自己。" },
        { type: "narration", origin: "source", jp: "鏡に映った僕の顔は皮膚の下の骨組みを露わしていた。", cn: "鏡中映出的我的臉——皮膚底下的骨骼結構清晰可見。" },
        { type: "inner", origin: "source", jp: "蛆はこう云う僕の記憶に忽ちはっきり浮び出した。", cn: "蛆蟲的記憶又鮮明地浮了上來。" },
        { type: "narration", origin: "source", jp: "僕は戸をあけて廊下へ出、どこと云うことなしに歩いて行った。するとロッビイへ出る隅に緑いろの笠をかけた、脊の高いスタンドの電燈が一つ硝子戸に鮮かに映っていた。", cn: "我打開門走進走廊，漫無目的地走著。然後在通向大廳的轉角，我看到了一盞綠色燈罩的落地燈，映在玻璃門上，鮮明而安靜。" },
        { type: "inner", origin: "source", jp: "それは何か僕の心に平和な感じを与えるものだった。", cn: "這盞燈讓我感到了某種平和。" },
        { type: "narration", origin: "source", jp: "僕はその前の椅子に坐り、いろいろのことを考えていた。が、そこにも五分とは坐っている訣に行かなかった。", cn: "我在燈前的椅子上坐了下來。想著各種事情。但連五分鐘都坐不住——" },
      ],
      choices: null,
      next: "auto_raincoat_3",
      effects: null,
      flags: [],
      notebook: null,
      links: null,
    },

    // ─────────────── 走廊：第三件雨衣 ───────────────

    auto_raincoat_3: {
      id: "auto_raincoat_3",
      text: [
        { type: "narration", origin: "source", jp: "レエン・コオトは今度もまた僕の横にあった長椅子の背に如何にもだらりと脱ぎかけてあった。", cn: "因為我身旁的長椅靠背上，一件雨衣正懶洋洋地搭著。" },
        { type: "inner", origin: "source", jp: "「しかも今は寒中だと云うのに」", cn: "而且現在是嚴冬。" },
      ],
      choices: [
        {
          text: "雨衣。又是雨衣。——這是第幾次了？",
          next: "raincoat_link",
          flag: "attempted_link",
          effects: null,
          notebook: null,
          unlock: null,
        },
        {
          text: "不去想它。回房間。",
          next: "auto_allright_corridor",
          flag: "ignored_link",
          effects: null,
          notebook: null,
          unlock: null,
        },
      ],
      next: null,
      effects: null,
      flags: ["attempted_link", "ignored_link"],
      notebook: { key: "raincoat_hotel", symbol: "raincoat", desc: "旅館走廊——嚴冬中，一件雨衣搭在長椅靠背上" },
      links: { unlock: "raincoat_hotel" },
    },

    raincoat_link: {
      id: "raincoat_link",
      text: (state) => {
        const count = state.notebook.filter((n) => n.symbol === "raincoat").length;
        if (count >= 2) {
          return [
            { type: "inner", origin: "added", content: "停車場。省線電車。旅館走廊。三次——不，算上理髮店主人的故事，是四次。穿雨衣的幽靈。在冬天。在不該穿雨衣的季節。" },
            { type: "narration", origin: "added", content: "我的背脊一陣發涼。但我抓不住這個念頭要指向哪裡。" },
          ];
        }
        return [
          { type: "inner", origin: "added", content: "雨衣。我想到了理髮店主人的故事。但具體的記憶太少，連結還建立不起來。" },
          { type: "narration", origin: "added", content: "我站起身，朝走廊深處走去。" },
        ];
      },
      choices: null,
      next: "auto_allright_corridor",
      effects: null,
      effectFn: (state) => {
        const count = state.notebook.filter((n) => n.symbol === "raincoat").length;
        return count >= 2 ? { insight: { amount: 1, reason: "迴路已形成，方向未明" } } : null;
      },
      flags: [],
      notebook: null,
      links: null,
    },

    // ─────────────── 走廊：All right ───────────────

    auto_allright_corridor: {
      id: "auto_allright_corridor",
      text: [
        { type: "narration", origin: "source", jp: "僕はこんなことを考えながら、もう一度廊下を引き返して行った。廊下の隅の給仕だまりには一人も給仕は見えなかった。", cn: "我沿著走廊往回走。走廊盡頭的服務生休息處一個人影也沒有。但他們的說話聲掠過我的耳邊。" },
        { type: "narration", origin: "source", jp: "しかし彼等の話し声はちょっと僕の耳をかすめて行った。それは何とか言われたのに答えた All right と云う英語だった。", cn: "那是在回應什麼人的話——一句英語。" },
        { type: "pause", duration: 1500 },
        { type: "dialogue", origin: "added", speaker: "???", speakerId: null, jp: "", cn: "\"All right.\"" },
        { type: "pause", duration: 1000 },
        { type: "inner", origin: "source", jp: "「オオル・ライト」？――僕はいつかこの対話の意味を正確に掴もうとあせっていた。「オオル・ライト」？　「オオル・ライト」？　何が一体オオル・ライトなのであろう？", cn: "「All right」？我不知不覺地開始追問這句對話的準確含義。「All right」？「All right」？到底什麼是「All right」？" },
      ],
      choices: [
        {
          text: "嘗試解讀 All right 的意義——「一切都對了」？「一切就緒了」？",
          next: "allright_puzzle",
          flag: "pondered_allright",
          effects: null,
          notebook: null,
          unlock: null,
        },
        {
          text: "只是普通的應答吧。回房間寫稿。",
          next: "auto_room_writing",
          flag: "dismissed_allright",
          effects: null,
          notebook: null,
          unlock: null,
        },
      ],
      next: null,
      effects: null,
      flags: ["pondered_allright", "dismissed_allright"],
      notebook: null,
      links: null,
    },

    allright_puzzle: {
      id: "allright_puzzle",
      text: [
        { type: "inner", origin: "added", content: "All right——一切都到位了。一切都被安排好了。但被安排好的是什麼？被誰安排的？" },
        { type: "narration", origin: "added", content: "這個念頭像齒輪一樣開始空轉。我回到房間。" },
      ],
      choices: null,
      next: "auto_room_writing",
      effects: null,
      flags: [],
      notebook: null,
      links: null,
    },

    // ─────────────── 房間：寫稿 ───────────────

    auto_room_writing: {
      id: "auto_room_writing",
      text: [
        { type: "narration", origin: "source", jp: "僕の部屋は勿論ひっそりしていた。が、戸をあけてはいることは妙に僕には無気味だった。僕はちょっとためらった後、思い切って部屋の中へはいって行った。", cn: "房間很安靜。但打開門走進去的這個動作，莫名地讓我覺得不安。我猶豫了一下，還是走進去了。" },
        { type: "narration", origin: "source", jp: "それから鏡を見ないようにし、机の前の椅子に腰をおろした。椅子は蜥蜴の皮に近い、青いマロック皮の安楽椅子だった。", cn: "避開鏡子，坐進書桌前的椅子。蜥蜴皮般的青色摩洛哥皮安樂椅。" },
        { type: "narration", origin: "source", jp: "僕は鞄をあけて原稿用紙を出し、或短篇を続けようとした。けれどもインクをつけたペンはいつまでたっても動かなかった。", cn: "我打開皮箱，取出原稿用紙，想要繼續那篇短篇小說。但蘸了墨水的筆怎麼也動不了。" },
        { type: "narration", origin: "source", jp: "のみならずやっと動いたと思うと、同じ言葉ばかり書きつづけていた。", cn: "好不容易動了——卻只是反覆寫著同一組字。" },
        { type: "pause", duration: 1500 },
        { type: "inner", origin: "source", jp: "All right……All right……All right sir……All right……", cn: "All right……All right……All right sir……All right……" },
      ],
      choices: null,
      next: "auto_phone",
      effects: null,
      flags: [],
      notebook: null,
      links: { fold: "── 走廊 · All right ──" },
    },

    // ─────────────── 電話：姪女 ───────────────

    auto_phone: {
      id: "auto_phone",
      text: [
        { type: "break" },
        { type: "narration", origin: "source", jp: "そこへ突然鳴り出したのはベッドの側にある電話だった。", cn: "——突然，床邊的電話響了。" },
        { type: "narration", origin: "source", jp: "僕は驚いて立ち上り、受話器を耳へやって返事をした。", cn: "我驚得站起來，把聽筒貼到耳邊。" },
        { type: "dialogue", origin: "source", speaker: "我", speakerId: "protagonist", jp: "「どなた？」", cn: "「哪位？」" },
        { type: "dialogue", origin: "source", speaker: "姪女", speakerId: "niece", jp: "「あたしです。あたし……」", cn: "「是我。是我……」" },
        { type: "narration", origin: "source", jp: "相手は僕の姉の娘だった。", cn: "是我姊姊的女兒。" },
        { type: "dialogue", origin: "source", speaker: "我", speakerId: "protagonist", jp: "「何だい？　どうかしたのかい？」", cn: "「怎麼了？出什麼事了嗎？」" },
        { type: "dialogue", origin: "source", speaker: "姪女", speakerId: "niece", jp: "「ええ、あの大へんなことが起ったんです。ですから、……大へんなことが起ったもんですから。今叔母さんにも電話をかけたんです」", cn: "「是的，出大事了。所以……因為出了大事，我剛剛也打了電話給阿姨。」" },
        { type: "dialogue", origin: "source", speaker: "我", speakerId: "protagonist", jp: "「大へんなこと？」", cn: "「大事？」" },
        { type: "dialogue", origin: "source", speaker: "姪女", speakerId: "niece", jp: "「ええ、ですからすぐに来て下さい。すぐにですよ」", cn: "「是的，所以請馬上過來。馬上。」" },
        { type: "narration", origin: "source", jp: "電話はそれぎり切れてしまった。", cn: "電話就此斷了。" },
        { type: "narration", origin: "source", jp: "僕はもとのように受話器をかけ、反射的にベルの鈕を押した。しかし僕の手の震えていることは僕自身はっきり意識していた。", cn: "我掛上聽筒，反射性地按下了門鈴的按鈕。但我清楚地意識到自己的手在發抖。" },
        { type: "forced", origin: "added", steps: ["按下門鈴的按鈕。", "再按。", "再按一次。"] },
        { type: "narration", origin: "source", jp: "給仕は容易にやって来なかった。僕は苛立たしさよりも苦しさを感じ、何度もベルの鈕を押した。", cn: "服務生遲遲不來。我感到的不是焦躁，而是痛苦。我反覆按著門鈴——" },
      ],
      choices: null,
      next: "auto_allright_resolve",
      effects: null,
      flags: [],
      notebook: null,
      links: null,
    },

    // ─────────────── 揭曉：雨衣與死亡 ───────────────

    auto_allright_resolve: {
      id: "auto_allright_resolve",
      text: (state) => {
        const base = [];
        if (state.choicesMade.pondered_allright) {
          base.push({ type: "inner", origin: "source", jp: "やっと運命の僕に教えた「オオル・ライト」と云う言葉を了解しながら。", cn: "——我終於理解了命運教給我的那句「オオル・ライト」的含義。" });
        } else {
          base.push({ type: "inner", origin: "source", jp: "やっと運命の僕に教えた「オオル・ライト」と云う言葉を了解しながら。", cn: "——我終於理解了命運教給我的那句「オオル・ライト」的含義。" });
          base.push({ type: "inner", origin: "added", content: "我現在明白了。All right——命運說的，是一切都到位了。" });
        }
        base.push({ type: "break" });
        base.push({ type: "narration", origin: "source", jp: "僕の姉の夫はその日の午後、東京から余り離れていない或田舎に轢死していた。", cn: "姊夫在當天下午，在離東京不遠的某個鄉下被火車輾死了。" });
        base.push({ type: "narration", origin: "source", jp: "しかも季節に縁のないレエン・コオトをひっかけていた。", cn: "而且穿著一件與季節毫不相稱的雨衣。" });
        return base;
      },
      choices: null,
      next: "auto_ending",
      effects: { nerve: { amount: -2, reason: "死亡與雨衣的連結" } },
      flags: [],
      notebook: { key: "raincoat_death", symbol: "raincoat", desc: "姊夫轢死——穿著與季節不符的雨衣" },
      links: { unlock: "raincoat_death" },
    },

    // ─────────────── 結尾 ───────────────

    auto_ending: {
      id: "auto_ending",
      text: [
        { type: "break" },
        { type: "narration", origin: "source", jp: "僕はいまもそのホテルの部屋に前の短篇を書きつづけている。真夜中の廊下には誰も通らない。", cn: "我仍然在這間旅館的房間裡，繼續寫著之前那篇短篇。深夜的走廊沒有人經過。" },
        { type: "narration", origin: "source", jp: "が、時々戸の外に翼の音の聞えることもある。どこかに鳥でも飼ってあるのかも知れない。", cn: "但偶爾——門外會傳來翅膀的聲音。也許什麼地方養了鳥。" },
        { type: "break" },
        { type: "system", content: "第一章「レエン・コオト」 終" },
      ],
      choices: null,
      next: null,
      effects: { insight: { amount: 1, reason: "夜半之聲" } },
      flags: [],
      notebook: { key: "wing_corridor", symbol: "wing", desc: "旅館深夜——門外傳來翅膀的聲音" },
      links: { unlock: "wing_corridor", showEnd: true },
    },
  },
};
