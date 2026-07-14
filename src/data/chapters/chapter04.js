// ═══════════════════════════════════════════════════════════
// 第四章「まだ？」
// Source: 芥川龍之介《歯車》四「まだ？」
// 青空文庫 https://www.aozora.gr.jp/cards/000879/files/42377_34745.html
// 底本檔案：reference/aozora/haguruma_original.txt（CH4 = B:L304–L360）
//
// 場景格式定義：docs/chapter-data-schema.md
// 施工圖（唯一來源）：docs/ch4-source-map.md
// 參考（⚠ 舊友場景整段是幻覺——捏造「兒子自殺未遂」對話、丟失朱舜水／不眠症語言崩解
//   母題，本圖已取代之；docs/chapter04-spec.md 僅其餘段落 cn 可參考，檔頭已加註警語）：
//   docs/chapter04-spec.md
//
// Batch F8：§1 骨架 + §2 全 28 場景（ch4_prologue ～ ch4_desk_return）逐字回填
//   jp + 新譯 cn（一人稱「我」）完工，含 6 選擇點。§3 connections（6 條，含 1 條跨章
//   CH1 依賴 raincoat_death、1 條跨章 CH3 依賴 ch03.mirror_watch）補上。symbols.js
//   CH4 區、README、DEV-LOG 同批更新。
//
// 特別處理：
// - 舊友場景（ch4_friend ～ ch4_madman_son）完全依本圖重寫，捨棄 chapter04-spec.md
//   捏造的「兒子自殺未遂／暴君」對話；改為原文的朱舜水建碑式敘舊、結膜炎規律、
//   『点鬼簿』自伝問答、不眠症互答、「気違いの息子には当り前だ」內心獨白（inner,
//   origin:"source"，方括號含括號逐字收錄，非替角色新編台詞）。
// - nerve −1 事件本圖列 3 處（朱舜水發音失敗 / 気違いの息子 / la mort），另依上游
//   特別指示對「不眠症」的「症」発音失敗（ch4_insomnia，L342 後段）追加 −1（見批次
//   回報，因 engine nerve 有 0–10 clamp，章末仍落在 0 附近，不影響「≈0」設計目標）。
// - portraits 欄位省略（沿用 CH3 慣例，CH4 尚無立繪）。
// ═══════════════════════════════════════════════════════════

export const CHAPTER_04 = {
  chapter: 4,
  title: "まだ？",
  titleCn: "還沒？",
  startScene: "ch4_prologue",
  startLocation: "ch04.hotel_room",
  sceneCount: 28,

  locations: [
    { id: "ch04.hotel_room", label: "ホテル", sub: "脱稿", x: 50, y: 50, shape: "rect" },
    { id: "ch04.ginza", label: "銀座", sub: "紙屑の薔薇", x: 120, y: 130, shape: "circle", symbolKey: "ch04.rose_scraps" },
    { id: "ch04.cafe2", label: "カッフェ", sub: "旧友", x: 190, y: 210, shape: "circle", symbolKey: "ch04.shushun" },
    { id: "ch04.mirror", label: "鏡", sub: "第二の僕", x: 260, y: 290, shape: "diamond", symbolKey: "ch04.doppelganger" },
  ],

  // docs/ch4-source-map.md §3（6 條，含 1 個跨章 CH1 依賴：death_approach 依賴 CH1
  // grandfathered key "raincoat_death"、1 個跨章 CH3 依賴：second_me 依賴 CH3 key
  // "ch03.mirror_watch"）。
  connections: [
    { id: "ch04.affinity_eye", requires: ["ch04.affinity", "ch04.conjunctivitis"], title: "親和力", subtitle: "目は結膜炎を起す", icon: "◇", insightGain: 1 },
    { id: "ch04.roses_faces", requires: ["ch04.rose_scraps", "ch04.paper_faces"], title: "紙屑——薔薇與人臉", subtitle: "変ったのは紙屑ではない", icon: "◈", insightGain: 1 },
    { id: "ch04.word_betrayal", requires: ["ch04.shushun", "ch04.la_mort"], title: "詞語的背叛", subtitle: "発音できない、綴り直される", icon: "◉", insightGain: 2 },
    { id: "ch04.death_approach", requires: ["raincoat_death", "ch04.la_mort"], title: "死、迫って来る", subtitle: "姉の夫に迫っていたように", icon: "✶", insightGain: 2 }, // 跨章 CH1
    { id: "ch04.second_me", requires: ["ch03.mirror_watch", "ch04.doppelganger"], title: "鏡中的存在", subtitle: "見つめる者、見られる者", icon: "✦", insightGain: 1 }, // 跨章 CH3
    { id: "ch04.sitz_bath", requires: ["ch04.beethoven", "ch04.sulfur"], title: "貝多芬也坐浴", subtitle: "滑稽と硫黄", icon: "◇", insightGain: 1 },
  ],

  scenes: {
    // ═══════════════ ホテル・脱稿 ═══════════════

    ch4_prologue: {
      id: "ch4_prologue",
      text: [
        { type: "system", content: "第四章　まだ？" },
        { type: "system", content: "——還沒？——" },
        { type: "break" },
        {
          type: "narration",
          origin: "source",
          jp: "僕はこのホテルの部屋にやっと前の短篇を書き上げ、或雑誌に送ることにした。",
          cn: "我在這間旅館的房間裡，總算把之前的短篇寫完了，決定寄給某本雜誌。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "尤も僕の原稿料は一週間の滞在費にも足りないものだった。",
          cn: "不過，我的稿費連一週的住宿費都不夠。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "が、僕は僕の仕事を片づけたことに満足し、何か精神的強壮剤を求める為に銀座の或本屋へ出かけることにした。",
          cn: "可我還是為完成了工作而感到滿足，為了尋求某種精神上的強壯劑，決定前往銀座的一家書店。",
        },
      ],
      choices: null,
      next: "ch4_roses",
      effects: { nerve: { amount: 3, reason: "脫稿的早晨" } },
      flags: [],
      notebook: null,
      links: { visit: "ch04.hotel_room" },
    },

    ch4_roses: {
      id: "ch4_roses",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "冬の日の当ったアスファルトの上には紙屑が幾つもころがっていた。",
          cn: "冬日的陽光照在柏油路上，路面上散落著幾張紙屑。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "それらの紙屑は光の加減か、いずれも薔薇の花にそっくりだった。",
          cn: "或許是光線的緣故，那些紙屑，每一張都活像薔薇的花。",
        },
      ],
      choices: [
        {
          text: "蹲下來，細看那些紙屑。",
          next: "ch4_roses_look",
          flag: "ch04.saw_roses",
          effects: { insight: { amount: 1, reason: "紙屑的薔薇" } },
          notebook: { key: "ch04.rose_scraps", symbol: "book", desc: "冬日柏油路上的紙屑——每一片都像薔薇的花" },
          unlock: "ch04.rose_scraps",
        },
        {
          text: "逕自走進書店。",
          next: "ch4_bookstore",
          flag: "ch04.walked_in",
          effects: null,
          notebook: null,
          unlock: null,
        },
      ],
      next: null,
      effects: null,
      flags: ["ch04.saw_roses", "ch04.walked_in"],
      notebook: null,
      links: { visit: "ch04.ginza" },
    },

    ch4_roses_look: {
      id: "ch4_roses_look",
      text: [
        {
          type: "inner",
          origin: "added",
          content: "連垃圾都向我示好的早晨——這份好意，究竟從哪裡來？",
        },
      ],
      choices: null,
      next: "ch4_bookstore",
      effects: null,
      flags: [],
      notebook: null,
      links: null,
    },

    ch4_bookstore: {
      id: "ch4_bookstore",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "僕は何ものかの好意を感じ、その本屋の店へはいって行った。",
          cn: "我感覺到了某種東西的好意，走進了那家書店。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "そこもまたふだんよりも小綺麗だった。",
          cn: "那裡也比平常整潔幾分。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "唯目金をかけた小娘が一人何か店員と話していたのは僕には気がかりにならないこともなかった。",
          cn: "只是一個戴著眼鏡的小姑娘正和店員說著什麼，這讓我多少有些在意。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "けれども僕は往来に落ちた紙屑の薔薇の花を思い出し、「アナトオル・フランスの対話集」や「メリメエの書簡集」を買うことにした。",
          cn: "可我想起了大街上那些薔薇般的紙屑，決定買下《法朗士對話集》與《梅里美書簡集》。",
        },
      ],
      choices: null,
      next: "ch4_cafe_pair",
      effects: null,
      flags: [],
      notebook: null,
      links: null,
    },

    ch4_cafe_pair: {
      id: "ch4_cafe_pair",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "僕は二冊の本を抱え、或カッフェへはいって行った。それから一番奥のテエブルの前に珈琲の来るのを待つことにした。",
          cn: "我抱著那兩冊書，走進了一間咖啡館，在最裡面的桌子前坐下，等著咖啡送來。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "僕の向うには親子らしい男女が二人坐っていた。",
          cn: "在我對面，坐著一對像是母子的男女。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "その息子は僕よりも若かったものの、殆ど僕にそっくりだった。",
          cn: "那個兒子雖然比我年輕，卻幾乎和我長得一模一樣。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "のみならず彼等は恋人同志のように顔を近づけて話し合っていた。",
          cn: "不僅如此，他們還像戀人一樣，湊近了臉交談著。",
        },
      ],
      choices: [
        {
          text: "觀察那對母子。",
          next: "ch4_affinity",
          flag: "ch04.watched_pair",
          effects: { insight: { amount: 1, reason: "親和力的觀察" } },
          notebook: { key: "ch04.affinity", symbol: "gear", desc: "咖啡館裡的母子像戀人般貼近——親和力，把現世變成地獄的某種意志" },
          unlock: null,
        },
        {
          text: "移開視線，翻開書。",
          next: "ch4_merimee",
          flag: "ch04.looked_away",
          effects: null,
          notebook: null,
          unlock: null,
        },
      ],
      next: null,
      effects: null,
      flags: ["ch04.watched_pair", "ch04.looked_away"],
      notebook: null,
      links: null,
    },

    ch4_affinity: {
      id: "ch4_affinity",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "僕は彼等を見ているうちに少くとも息子は性的にも母親に慰めを与えていることを意識しているのに気づき出した。",
          cn: "我看著他們，漸漸察覺到，至少那個兒子，意識到自己在性的層面上，也給予了母親某種慰藉。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "それは僕にも覚えのある親和力の一例に違いなかった。",
          cn: "那無疑是我也曾體會過的親和力的一個例子。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "同時に又現世を地獄にする或意志の一例にも違いなかった。",
          cn: "同時，也無疑是把現世變成地獄的某種意志的一個例子。",
        },
      ],
      choices: null,
      next: "ch4_merimee",
      effects: null,
      flags: [],
      notebook: null,
      links: null,
    },

    ch4_merimee: {
      id: "ch4_merimee",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "しかし、――僕は又苦しみに陥るのを恐れ、丁度珈琲の来たのを幸い、「メリメエの書簡集」を読みはじめた、",
          cn: "可是——我害怕再度陷入痛苦，正巧咖啡送了上來，便翻開《梅里美書簡集》讀了起來，",
        },
        {
          type: "narration",
          origin: "source",
          jp: "彼はこの書簡集の中にも彼の小説の中のように鋭いアフォリズムを閃かせていた。",
          cn: "他在這部書簡集裡，也像在他的小說中一樣，閃爍著犀利的格言。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "それ等のアフォリズムは僕の気もちをいつか鉄のように巌畳にし出した。",
          cn: "那些格言，不知不覺，使我的心情變得如鐵一般堅固起來。",
        },
        {
          type: "inner",
          origin: "source",
          jp: "（この影響を受け易いことも僕の弱点の一つだった）",
          cn: "（這種容易受人影響的性格，也是我的弱點之一。）",
        },
        {
          type: "narration",
          origin: "source",
          jp: "僕は一杯の珈琲を飲み了った後、「何でも来い」と云う気になり、さっさとこのカッフェを後ろにして行った。",
          cn: "喝完那一杯咖啡後，我懷著「什麼都放馬過來」的心情，很快地把這間咖啡館拋在了身後。",
        },
      ],
      choices: null,
      next: "ch4_windows",
      effects: null,
      flags: [],
      notebook: null,
      links: null,
    },

    ch4_windows: {
      id: "ch4_windows",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "僕は往来を歩きながら、いろいろの飾り窓を覗いて行った。或額縁屋の飾り窓はベエトオヴェンの肖像画を掲げていた。それは髪を逆立てた天才そのものらしい肖像画だった。僕はこのベエトオヴェンを滑稽に感ぜずにはいられなかった。……",
          cn: "我一面走在街上，一面窺看著各式各樣的櫥窗。一家畫框店的櫥窗裡，掛著一幅貝多芬的肖像畫，那是一幅頭髮倒豎、活脫脫是天才本人似的肖像畫。我忍不住覺得，這個貝多芬實在滑稽。……",
        },
      ],
      choices: null,
      next: "ch4_friend",
      effects: null,
      flags: [],
      notebook: { key: "ch04.beethoven", symbol: "book", desc: "額縁店櫥窗——頭髮倒豎、天才本人似的貝多芬。我忍不住覺得滑稽" },
      links: null,
    },

    // ═══════════════ カッフェ・旧友 ═══════════════

    ch4_friend: {
      id: "ch4_friend",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "そのうちにふと出合ったのは高等学校以来の旧友だった。この応用化学の大学教授は大きい中折れ鞄を抱え、片目だけまっ赤に血を流していた。",
          cn: "就在這時，我忽然遇見了一位高中時代以來的舊友。這位應用化學的大學教授，抱著一個大大的中折帽形皮包，一隻眼睛滿是血紅。",
        },
        {
          type: "dialogue",
          origin: "source",
          speaker: "我",
          speakerId: "protagonist",
          jp: "「どうした、君の目は？」",
          cn: "「怎麼了，你的眼睛？」",
        },
        {
          type: "dialogue",
          origin: "source",
          speaker: "舊友",
          speakerId: "old_friend",
          jp: "「これか？　これは唯の結膜炎さ」",
          cn: "「這個？這只是普通的結膜炎罷了。」",
        },
      ],
      choices: null,
      next: "ch4_eye_memory",
      effects: null,
      flags: [],
      notebook: null,
      links: null,
    },

    ch4_eye_memory: {
      id: "ch4_eye_memory",
      text: [
        {
          type: "inner",
          origin: "source",
          jp: "僕はふと十四五年以来、いつも親和力を感じる度に僕の目も彼の目のように結膜炎を起すのを思い出した。",
          cn: "我忽然想起，這十四五年來，每當我感覺到親和力時，我的眼睛也會像他的眼睛一樣，發起結膜炎來。",
        },
      ],
      choices: [
        {
          text: "把這條規律記下來。",
          next: "ch4_friend_cafe",
          flag: "ch04.noted_eye",
          effects: { insight: { amount: 1, reason: "親和力與結膜炎的規律" } },
          notebook: { key: "ch04.conjunctivitis", symbol: "gear", desc: "十四五年來，每當感到親和力，我的眼睛也會像他一樣結膜炎" },
          unlock: "ch04.conjunctivitis",
        },
        {
          text: "什麼都不說。",
          next: "ch4_friend_cafe",
          flag: "ch04.said_nothing",
          effects: null,
          notebook: null,
          unlock: null,
        },
      ],
      next: null,
      effects: null,
      flags: ["ch04.noted_eye", "ch04.said_nothing"],
      notebook: null,
      links: null,
    },

    ch4_friend_cafe: {
      id: "ch4_friend_cafe",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "が、何とも言わなかった。",
          cn: "可我什麼也沒說。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "彼は僕の肩を叩き、僕等の友だちのことを話し出した。",
          cn: "他拍了拍我的肩膀，說起了我們共同朋友的事。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "それから話をつづけたまま、或カッフェへ僕をつれて行った。",
          cn: "接著，他一面說著話，一面把我帶進了一間咖啡館。",
        },
      ],
      choices: null,
      next: "ch4_shushun",
      effects: null,
      flags: [],
      notebook: null,
      links: null,
    },

    ch4_shushun: {
      id: "ch4_shushun",
      text: [
        {
          type: "dialogue",
          origin: "source",
          speaker: "舊友",
          speakerId: "old_friend",
          jp: "「久しぶりだなあ。朱舜水の建碑式以来だろう」",
          cn: "「好久不見了啊。上次見面，該是朱舜水的建碑典禮那時候了吧。」",
        },
        {
          type: "narration",
          origin: "source",
          jp: "彼は葉巻に火をつけた後、大理石のテエブル越しにこう僕に話しかけた。",
          cn: "他點燃雪茄後，隔著大理石桌面，這樣向我搭起話來。",
        },
        {
          type: "dialogue",
          origin: "source",
          speaker: "我",
          speakerId: "protagonist",
          jp: "「そうだ。あのシュシュン……」",
          cn: "「對，就是那個朱舜……」",
        },
        {
          type: "narration",
          origin: "source",
          jp: "僕はなぜか朱舜水と云う言葉を正確に発音出来なかった。",
          cn: "不知為何，我竟無法準確地發出「朱舜水」這個詞的音。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "それは日本語だっただけにちょっと僕を不安にした。",
          cn: "正因為那是日語，這件事讓我有些不安起來。",
        },
      ],
      choices: null,
      next: "ch4_friend_talk",
      effects: { nerve: { amount: -1, reason: "明明是日語，卻發不出音" } },
      flags: [],
      notebook: { key: "ch04.shushun", symbol: "book", desc: "朱舜水——我發不出這個詞的音。它是日語，這讓我不安" },
      links: { visit: "ch04.cafe2", unlock: "ch04.shushun", fold: "── 銀座 · 紙屑の薔薇 ──" },
    },

    ch4_friend_talk: {
      id: "ch4_friend_talk",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "しかし彼は無頓着にいろいろのことを話して行った。Ｋと云う小説家のことを、彼の買ったブル・ドッグのことを、リウイサイトと云う毒瓦斯のことを。……",
          cn: "可他毫不在意地，接連說了種種事情——說起一位名叫Ｋ的小說家，說起他新買的鬥牛犬，說起一種叫作路易氏毒氣的毒瓦斯。……",
        },
      ],
      choices: null,
      next: "ch4_tenkibo",
      effects: null,
      flags: [],
      notebook: null,
      links: null,
    },

    ch4_tenkibo: {
      id: "ch4_tenkibo",
      text: [
        {
          type: "dialogue",
          origin: "source",
          speaker: "舊友",
          speakerId: "old_friend",
          jp: "「君はちっとも書かないようだね。『点鬼簿』と云うのは読んだけれども。……あれは君の自叙伝かい？」",
          cn: "「你好像完全不寫東西了呢。不過《點鬼簿》倒是讀了。……那是你的自傳嗎？」",
        },
        {
          type: "dialogue",
          origin: "source",
          speaker: "我",
          speakerId: "protagonist",
          jp: "「うん、僕の自叙伝だ」",
          cn: "「嗯，是我的自傳。」",
        },
        {
          type: "dialogue",
          origin: "source",
          speaker: "舊友",
          speakerId: "old_friend",
          jp: "「あれはちょっと病的だったぜ。この頃体は善いのかい？」",
          cn: "「那篇東西有點病態啊。最近身體還好嗎？」",
        },
        {
          type: "dialogue",
          origin: "source",
          speaker: "我",
          speakerId: "protagonist",
          jp: "「不相変薬ばかり嚥んでいる始末だ」",
          cn: "「老樣子，成天只是在吞藥罷了。」",
        },
      ],
      choices: null,
      next: "ch4_insomnia",
      effects: null,
      flags: [],
      notebook: null,
      links: null,
    },

    ch4_insomnia: {
      id: "ch4_insomnia",
      text: [
        {
          type: "dialogue",
          origin: "source",
          speaker: "舊友",
          speakerId: "old_friend",
          jp: "「僕もこの頃は不眠症だがね」",
          cn: "「我最近也犯著失眠症呢。」",
        },
        {
          type: "dialogue",
          origin: "source",
          speaker: "我",
          speakerId: "protagonist",
          jp: "「僕も？――どうして君は『僕も』と言うのだ？」",
          cn: "「我也？——你為什麼要說『我也』？」",
        },
        {
          type: "dialogue",
          origin: "source",
          speaker: "舊友",
          speakerId: "old_friend",
          jp: "「だって君も不眠症だって言うじゃないか？　不眠症は危険だぜ。……」",
          cn: "「因為你不也說自己失眠了嗎？失眠可是很危險的啊。……」",
        },
        {
          type: "narration",
          origin: "source",
          jp: "彼は左だけ充血した目に微笑に近いものを浮かべていた。",
          cn: "他那隻只有左眼充血的臉上，浮現出近乎微笑的神情。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "僕は返事をする前に「不眠症」のショウの発音を正確に出来ないのを感じ出した。",
          cn: "在我回答之前，我察覺到自己無法準確發出「不眠症」那個「症」字的音。",
        },
      ],
      choices: null,
      next: "ch4_madman_son",
      effects: { nerve: { amount: -1, reason: "「症」也發不出音" } },
      flags: [],
      notebook: null,
      links: null,
    },

    ch4_madman_son: {
      id: "ch4_madman_son",
      text: [
        {
          type: "inner",
          origin: "source",
          jp: "「気違いの息子には当り前だ」",
          cn: "「瘋子的兒子會這樣，也是理所當然的。」",
        },
      ],
      choices: null,
      next: "ch4_street_faces",
      effects: { nerve: { amount: -1, reason: "瘋人之子——遺傳的恐懼" } },
      flags: [],
      notebook: { key: "ch04.madman_son", symbol: "raincoat", desc: "瘋人的兒子失眠是理所當然——這句話在我心裡自己說了出來" },
      links: { fold: "── 旧友 · 発音できない言葉 ──" },
    },

    // ═══════════════ 往来 · 紙屑と硫黄 ═══════════════

    ch4_street_faces: {
      id: "ch4_street_faces",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "僕は十分とたたないうちにひとり又往来を歩いて行った。",
          cn: "不到十分鐘，我又獨自一人走在了大街上。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "アスファルトの上に落ちた紙屑は時々僕等人間の顔のようにも見えないことはなかった。",
          cn: "落在柏油路上的紙屑，這時看起來，竟也不是沒有幾分像我們人類的臉。",
        },
      ],
      choices: [
        {
          text: "細看那些紙屑——早上它們還是薔薇。",
          next: "ch4_faces_look",
          flag: "ch04.saw_faces",
          effects: { insight: { amount: 1, reason: "紙屑從薔薇變成臉" } },
          notebook: { key: "ch04.paper_faces", symbol: "gear", desc: "同一條路上的紙屑——早上像薔薇，現在像人的臉" },
          unlock: "ch04.paper_faces",
        },
        {
          text: "別開目光。",
          next: "ch4_woman",
          flag: "ch04.averted",
          effects: null,
          notebook: null,
          unlock: null,
        },
      ],
      next: null,
      effects: null,
      flags: ["ch04.saw_faces", "ch04.averted"],
      notebook: null,
      links: null,
    },

    ch4_faces_look: {
      id: "ch4_faces_look",
      text: [
        {
          type: "inner",
          origin: "added",
          content: "同樣的紙屑。變的，不是它們。",
        },
      ],
      choices: null,
      next: "ch4_woman",
      effects: null,
      flags: [],
      notebook: null,
      links: null,
    },

    ch4_woman: {
      id: "ch4_woman",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "すると向うから断髪にした女が一人通りかかった。",
          cn: "這時，對面走來了一個剪短了頭髮的女人。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "彼女は遠目には美しかった。",
          cn: "她遠遠望去，是美麗的。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "けれども目の前へ来たのを見ると、小皺のある上に醜い顔をしていた。",
          cn: "可等她走到眼前，才看清那張臉上滿是細紋，而且醜陋。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "のみならず妊娠しているらしかった。",
          cn: "不僅如此，她似乎還懷著身孕。",
        },
      ],
      choices: [
        {
          text: "回頭再看一眼。",
          next: "ch4_woman_look",
          flag: "ch04.looked_back",
          effects: null,
          notebook: null,
          unlock: null,
        },
        {
          text: "快步彎進橫町。",
          next: "ch4_hemorrhoid",
          flag: "ch04.turned_away",
          effects: null,
          notebook: null,
          unlock: null,
        },
      ],
      next: null,
      effects: null,
      flags: ["ch04.looked_back", "ch04.turned_away"],
      notebook: null,
      links: null,
    },

    ch4_woman_look: {
      id: "ch4_woman_look",
      text: [
        {
          type: "narration",
          origin: "added",
          content: "她已經走遠了。遠遠望去，又是美的。",
        },
      ],
      choices: null,
      next: "ch4_hemorrhoid",
      effects: null,
      flags: [],
      notebook: null,
      links: null,
    },

    ch4_hemorrhoid: {
      id: "ch4_hemorrhoid",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "僕は思わず顔をそむけ、広い横町を曲って行った。",
          cn: "我不由得別開了臉，拐進了一條寬闊的橫巷。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "が、暫らく歩いているうちに痔の痛みを感じ出した。",
          cn: "可走著走著，我漸漸感到了痔瘡的疼痛。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "それは僕には坐浴より外に瘉すことの出来ない痛みだった。",
          cn: "那是一種除了坐浴之外，我別無他法治癒的疼痛。",
        },
        {
          type: "inner",
          origin: "source",
          jp: "「坐浴、――ベエトオヴェンもやはり坐浴をしていた。……」",
          cn: "「坐浴——貝多芬似乎也是坐浴的呢。……」",
        },
        {
          type: "narration",
          origin: "source",
          jp: "坐浴に使う硫黄の匂いは忽ち僕の鼻を襲い出した。",
          cn: "坐浴用的硫磺氣味，忽然撲鼻而來。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "しかし勿論往来にはどこにも硫黄は見えなかった。",
          cn: "可街上當然哪裡都看不見硫磺的蹤影。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "僕はもう一度紙屑の薔薇の花を思い出しながら、努めてしっかりと歩いて行った。",
          cn: "我又一次想起了紙屑的薔薇花，努力打起精神，穩穩地走了下去。",
        },
      ],
      choices: null,
      next: "ch4_writing",
      effects: null,
      flags: [],
      notebook: { key: "ch04.sulfur", symbol: "gear", desc: "街上撲鼻而來的硫磺味——街上哪裡都沒有硫磺" },
      links: null,
    },

    ch4_writing: {
      id: "ch4_writing",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "一時間ばかりたった後、僕は僕の部屋にとじこもったまま、窓の前の机に向かい、新らしい小説にとりかかっていた。",
          cn: "約莫一小時後，我把自己關在房間裡，面對著窗前的桌子，開始動筆寫起新的小說來。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "ペンは僕にも不思議だったくらい、ずんずん原稿用紙の上を走って行った。",
          cn: "筆連我自己都感到不可思議，飛快地在稿紙上奔跑著。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "しかしそれも二三時間の後には誰か僕の目に見えないものに抑えられたようにとまってしまった。",
          cn: "可兩三個小時後，那筆卻像是被某種我看不見的東西按住了一般，停了下來。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "僕はやむを得ず机の前を離れ、あちこちと部屋の中を歩きまわった。",
          cn: "我無可奈何地離開了桌前，在房間裡來回踱著步。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "僕の誇大妄想はこう云う時に最も著しかった。",
          cn: "我的誇大妄想，在這種時候最為顯著。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "僕は野蛮な歓びの中に僕には両親もなければ妻子もない、唯僕のペンから流れ出した命だけあると云う気になっていた。",
          cn: "在一種野蠻的歡愉之中，我漸漸生出這樣的念頭——我既沒有父母，也沒有妻兒，只有從我筆尖流淌出來的生命。",
        },
      ],
      choices: null,
      next: "ch4_phone_mole",
      effects: { insight: { amount: 1, reason: "筆尖流出的命" } },
      flags: [],
      notebook: { key: "ch04.pen_life", symbol: "book", desc: "我沒有父母也沒有妻兒，只有從我筆尖流出來的生命" },
      links: { visit: "ch04.hotel_room", fold: "── 往来 · 紙屑と硫黄 ──" },
    },

    ch4_phone_mole: {
      id: "ch4_phone_mole",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "けれども僕は四五分の後、電話に向わなければならなかった。",
          cn: "可四五分鐘後，我不得不走向電話。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "電話は何度返事をしても、唯何か曖昧な言葉を繰り返して伝えるばかりだった。",
          cn: "無論我怎麼應答，電話那頭都只是反覆傳來某個曖昧不清的詞。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "が、それはともかくもモオルと聞えたのに違いなかった。",
          cn: "可不管怎樣，聽起來無疑是「モオル」。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "僕はとうとう電話を離れ、もう一度部屋の中を歩き出した。",
          cn: "我終於放下了電話，又一次在房間裡走了起來。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "しかしモオルと云う言葉だけは妙に気になってならなかった。",
          cn: "可唯獨「モオル」這個詞，卻莫名地縈繞不去。",
        },
        {
          type: "inner",
          origin: "source",
          jp: "「モオル――Mole……」",
          cn: "「モオル——Mole……」",
        },
      ],
      choices: null,
      next: "ch4_lamort",
      effects: null,
      flags: [],
      notebook: null,
      links: null,
    },

    ch4_lamort: {
      id: "ch4_lamort",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "モオルは鼴鼠と云う英語だった。",
          cn: "モオル，是英語裡「鼴鼠」的意思。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "この聯想も僕には愉快ではなかった。",
          cn: "這個聯想，同樣不令我愉快。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "が、僕は二三秒の後、Mole を la mort に綴り直した。",
          cn: "可兩三秒後，我把 Mole 重新拼成了 la mort。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "ラ・モオルは、――死と云う仏蘭西語は忽ち僕を不安にした。",
          cn: "La mort——這個意為「死」的法語詞，頃刻間讓我不安起來。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "死は姉の夫に迫っていたように僕にも迫っているらしかった。",
          cn: "死，似乎正像逼近姊夫那樣，逼近著我。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "けれども僕は不安の中にも何か可笑しさを感じていた。",
          cn: "可我在不安之中，卻又感覺到了某種可笑。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "のみならずいつか微笑していた。",
          cn: "不僅如此，不知不覺，我已經微笑了起來。",
        },
        {
          type: "inner",
          origin: "source",
          jp: "この可笑しさは何の為に起るか？――それは僕自身にもわからなかった。",
          cn: "這可笑究竟因何而起？——連我自己也不明白。",
        },
      ],
      choices: null,
      next: "ch4_mirror_choice",
      effects: { nerve: { amount: -1, reason: "la mort" } },
      flags: [],
      notebook: { key: "ch04.la_mort", symbol: "raincoat", desc: "Mole——鼴鼠——la mort。死，像逼近姊夫那樣逼近我。而我竟在微笑" },
      links: null,
    },

    // ═══════════════ 鏡 · 第二の僕 ═══════════════

    ch4_mirror_choice: {
      id: "ch4_mirror_choice",
      text: [{ type: "break" }],
      choices: [
        {
          text: "走到鏡子前，正面看。",
          next: "ch4_mirror",
          flag: "ch04.faced_mirror",
          effects: null,
          notebook: null,
          unlock: null,
        },
        {
          text: "不要看鏡子。",
          next: "ch4_mirror_hesitate",
          flag: "ch04.hesitated",
          effects: null,
          notebook: null,
          unlock: null,
        },
      ],
      next: null,
      effects: null,
      flags: ["ch04.faced_mirror", "ch04.hesitated"],
      notebook: null,
      links: null,
    },

    ch4_mirror_hesitate: {
      id: "ch4_mirror_hesitate",
      text: [
        {
          type: "narration",
          origin: "added",
          content: "猶豫了片刻，我終究還是站到了鏡子前。",
        },
      ],
      choices: null,
      next: "ch4_mirror",
      effects: null,
      flags: [],
      notebook: null,
      links: null,
    },

    ch4_mirror: {
      id: "ch4_mirror",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "僕は久しぶりに鏡の前に立ち、まともに僕の影と向い合った。",
          cn: "我久違地站到鏡子前，正面與自己的影子相對而立。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "僕の影も勿論微笑していた。",
          cn: "我的影子，當然也在微笑著。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "僕はこの影を見つめているうちに第二の僕のことを思い出した。",
          cn: "我凝視著這個影子，漸漸想起了「第二個我」的事。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "第二の僕、――独逸人の所謂 Doppel gaenger は仕合せにも僕自身に見えたことはなかった。",
          cn: "第二個我——也就是德國人所謂的 Doppelgänger，所幸從未讓我親眼見過。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "しかし亜米利加の映画俳優になったＫ君の夫人は第二の僕を帝劇の廊下に見かけていた。",
          cn: "可成了美國電影演員的Ｋ君夫人，卻曾在帝國劇場的走廊上，見過那個第二個我。",
        },
        {
          type: "inner",
          origin: "source",
          jp: "（僕は突然Ｋ君の夫人に「先達はつい御挨拶もしませんで」と言われ、当惑したことを覚えている）",
          cn: "（我記得自己曾被Ｋ君夫人突然說了句「上回竟沒能向您打聲招呼」，當時窘迫得不知如何是好。）",
        },
        {
          type: "narration",
          origin: "source",
          jp: "それからもう故人になった或隻脚の飜訳家もやはり銀座の或煙草屋に第二の僕を見かけていた。",
          cn: "此外，一位如今已然故去的獨腳翻譯家，也同樣在銀座的一家菸草店裡，見過那個第二個我。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "死は或は僕よりも第二の僕に来るのかも知れなかった。",
          cn: "死，或許不是先找上我，而是先找上那個第二個我，也未可知。",
        },
      ],
      choices: null,
      next: "ch4_desk_return",
      effects: { insight: { amount: 1, reason: "第二個我" } },
      flags: [],
      notebook: { key: "ch04.doppelganger", symbol: "raincoat", desc: "第二個我——K 君夫人在帝劇走廊、獨腳翻譯家在銀座菸草店都見過。死也許先找上他" },
      links: { visit: "ch04.mirror", unlock: "ch04.doppelganger" },
    },

    ch4_desk_return: {
      id: "ch4_desk_return",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "若し又僕に来たとしても、――僕は鏡に後ろを向け、窓の前の机へ帰って行った。",
          cn: "即便死終究還是會找上我，——我還是背過身，離開了鏡子，回到了窗前的桌邊。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "四角に凝灰岩を組んだ窓は枯芝や池を覗かせていた。",
          cn: "那扇以方形凝灰岩砌成的窗，透出外頭枯萎的草坪與一池水。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "僕はこの庭を眺めながら、遠い松林の中に焼いた何冊かのノオト・ブックや未完成の戯曲を思い出した。",
          cn: "我望著這座庭院，想起了曾在遠方的松林裡，燒掉的那幾冊筆記本，還有那未完成的戲曲。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "それからペンをとり上げると、もう一度新らしい小説を書きはじめた。",
          cn: "接著，我提起筆，再一次，開始寫起新的小說來。",
        },
        { type: "system", content: "第四章「まだ？」 終" },
      ],
      choices: null,
      next: null,
      effects: { insight: { amount: 1, reason: "還沒。" } },
      flags: [],
      notebook: { key: "ch04.burned_notes", symbol: "book", desc: "遠方松林裡燒掉的幾冊筆記、未完成的戲曲——我又一次開始寫新的小說" },
      links: { showEnd: true, fold: "── 鏡 · 第二の僕 ──" },
    },
  },
};
