// ═══════════════════════════════════════════════════════════
// 第三章「夜」
// Source: 芥川龍之介《歯車》三「夜」
// 青空文庫 https://www.aozora.gr.jp/cards/000879/files/42377_34745.html
// 底本檔案：reference/aozora/haguruma_original.txt（CH3 = B:L225–L295）
//
// 場景格式定義：docs/chapter-data-schema.md
// 施工圖（唯一來源）：docs/ch3-source-map.md
// 參考（引文抽查全真，可作 cn 參考，場景切分不以此為準）：docs/chapter03-spec.md
//
// Batch F7-1：§1 骨架 + §2 前 22 場景（ch3_prologue ～ ch3_sculptor_talk，
//   逐字回填 jp + 新譯 cn，一人稱「我」）全數完工。
// Batch F7-2：§2 後段 16 場景（ch3_room_women ～ ch3_end_wait）逐字回填
//   jp + 新譯 cn 完工（含夢境段全 auto、L287 復讐の神句、L295 結尾垂死
//   老人意象）。§3 connections（6 條，含 2 個跨章 CH1 依賴）補上。
//   symbols.js CH3 區、README、DEV-LOG 同批更新。
//
// 注意：docs/ch3-source-map.md §1 骨架标 sceneCount: 36，但 §2 實際
//   枚舉場景（### ch3_xxx）逐一計數為 38（含全部分支/夢境/choice 場景）。
//   本檔以 §2 實際枚舉為準，sceneCount 記為 38——此為文件內部數字不一致，
//   已在批次回報中註明，待月月確認是否需要回頭修正施工圖標頭。
// ═══════════════════════════════════════════════════════════

export const CHAPTER_03 = {
  chapter: 3,
  title: "夜",
  titleCn: "夜",
  startScene: "ch3_prologue",
  startLocation: "ch03.maruzen",
  sceneCount: 38,

  // portraits 欄位省略（CH3 尚無立繪，沿用 CH1／CH2 慣例）

  locations: [
    { id: "ch03.maruzen", label: "丸善", sub: "二階の書棚", x: 50, y: 50, shape: "rect", symbolKey: "ch03.gear_faces" },
    { id: "ch03.nihonbashi", label: "日本橋通り", sub: "夜", x: 110, y: 130, shape: "circle", symbolKey: "ch03.dragon_slay" },
    { id: "ch03.cafe", label: "カッフェ", sub: "薔薇色の壁", x: 170, y: 200, shape: "circle", symbolKey: "ch03.napoleon" },
    { id: "ch03.hotel_lobby", label: "ホテル", sub: "炉端", x: 220, y: 270, shape: "rect", symbolKey: "ch03.wing_rat" },
    { id: "ch03.hotel_room", label: "部屋", sub: "夢", x: 260, y: 330, shape: "diamond", symbolKey: "ch03.mummy" },
  ],

  // docs/ch3-source-map.md §3（6 條，含 2 個跨章 CH1 依賴：gear_multiply 依賴 CH1
  // grandfathered key "gear_first"、wing_again 依賴 CH1 grandfathered key "wing_corridor"）。
  connections: [
    { id: "ch03.yellow_circuit", requires: ["ch02.nemesis", "ch03.yellow_cover"], title: "黃色的書皮", subtitle: "希臘神話から伝説へ", icon: "◈", insightGain: 1 },
    { id: "ch03.gear_multiply", requires: ["gear_first", "ch03.gear_faces"], title: "有眼鼻的齒輪", subtitle: "視野の外にも、書物の中にも", icon: "◉", insightGain: 2 }, // 跨章 CH1
    { id: "ch03.hanfeizi", requires: ["ch03.juryo", "ch03.dragon_slay"], title: "韓非子的迴路", subtitle: "寿陵余子と屠竜の技", icon: "◇", insightGain: 1 },
    { id: "ch03.nemesis_shape", requires: ["ch02.nemesis", "ch03.mummy"], title: "復讐之神現形", subtitle: "ツォイスも敵わぬ神、寝台の上に", icon: "✶", insightGain: 2 },
    { id: "ch03.wing_again", requires: ["wing_corridor", "ch03.wing_rat"], title: "翼の音、再び", subtitle: "第一夜から続くもの", icon: "✦", insightGain: 1 }, // 跨章 CH1
    { id: "ch03.green_omen", requires: ["ch02.yellow_taxi", "ch03.green_dress"], title: "綠色＝吉兆", subtitle: "緑の車、緑のドレッス", icon: "◈", insightGain: 1 },
  ],

  scenes: {
    // ═══════════════ 丸善・書中之針 ═══════════════

    ch3_prologue: {
      id: "ch3_prologue",
      text: [
        { type: "system", content: "第三章　夜" },
        { type: "system", content: "——夜——" },
        { type: "break" },
        {
          type: "narration",
          origin: "source",
          jp: "僕は丸善の二階の書棚にストリントベルグの「伝説」を見つけ、二三頁ずつ目を通した。",
          cn: "我在丸善的二樓書架上，找到了史特林堡的《傳說》，翻了兩三頁。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "それは僕の経験と大差のないことを書いたものだった。のみならず黄いろい表紙をしていた。",
          cn: "那寫的是與我的經驗大同小異的事。不僅如此，還是黃色的封面。",
        },
      ],
      choices: null,
      next: "ch3_books",
      effects: null,
      flags: [],
      notebook: { key: "ch03.yellow_cover", symbol: "book", desc: "丸善——史特林堡《傳說》，寫著與我的經驗大同小異的事。又是黃色的書皮" },
      links: { visit: "ch03.maruzen", unlock: "ch03.yellow_cover" },
    },

    ch3_books: {
      id: "ch3_books",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "僕は「伝説」を書棚へ戻し、今度は殆ど手当り次第に厚い本を一冊引きずり出した。",
          cn: "我把《傳說》放回書架，這次幾乎是隨手抽出了一本厚書。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "しかしこの本も挿し画の一枚に僕等人間と変りのない、目鼻のある歯車ばかり並べていた。",
          cn: "可這本書的插畫裡，也整排畫著和我們人類毫無二致、有眼有鼻的齒輪。",
        },
      ],
      choices: [
        {
          text: "細看那幅插畫。",
          next: "ch3_gear_faces",
          flag: "ch03.saw_gear_faces",
          effects: { insight: { amount: 1, reason: "有眼有鼻的齒輪臉" } },
          notebook: { key: "ch03.gear_faces", symbol: "gear", desc: "精神病者畫集的插畫——排滿了與我們人類無異、有眼有鼻的齒輪" },
          unlock: "ch03.gear_faces",
        },
        {
          text: "把書塞回去。",
          next: "ch3_bovary",
          flag: "ch03.shoved_back",
          effects: null,
          notebook: null,
          unlock: null,
        },
      ],
      next: null,
      effects: null,
      flags: ["ch03.saw_gear_faces", "ch03.shoved_back"],
      notebook: null,
      links: null,
    },

    ch3_gear_faces: {
      id: "ch3_gear_faces",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "（それは或独逸人の集めた精神病者の画集だった）",
          cn: "（那是某個德國人收集的精神病者畫集。）",
        },
      ],
      choices: null,
      next: "ch3_bovary",
      effects: null,
      flags: [],
      notebook: null,
      links: null,
    },

    ch3_bovary: {
      id: "ch3_bovary",
      text: [
        {
          type: "inner",
          origin: "source",
          jp: "僕はいつか憂鬱の中に反抗的精神の起るのを感じ、やぶれかぶれになった賭博狂のようにいろいろの本を開いて行った。",
          cn: "不知不覺，我在憂鬱之中生出了一股反抗的精神，像個豁出去的賭徒一樣，接連翻開各式各樣的書。",
        },
        {
          type: "inner",
          origin: "source",
          jp: "が、なぜかどの本も必ず文章か挿し画かの中に多少の針を隠していた。",
          cn: "可不知為何，每一本書，必定都在文字或插畫裡，藏著多少的針。",
        },
        {
          type: "inner",
          origin: "source",
          jp: "どの本も？――僕は何度も読み返した「マダム・ボヴァリイ」を手にとった時さえ、畢竟僕自身も中産階級のムッシウ・ボヴァリイに外ならないのを感じた。……",
          cn: "每一本都是？——就連拿起我讀過無數次的《包法利夫人》時，我也感覺到，說到底，我自己不過是個中產階級的包法利先生罷了。……",
        },
      ],
      choices: null,
      next: "ch3_religion",
      effects: null,
      flags: [],
      notebook: null,
      links: null,
    },

    ch3_religion: {
      id: "ch3_religion",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "日の暮に近い丸善の二階には僕の外に客もないらしかった。僕は電燈の光の中に書棚の間をさまよって行った。それから「宗教」と云う札を掲げた書棚の前に足を休め、緑いろの表紙をした一冊の本へ目を通した。",
          cn: "近黃昏的丸善二樓，除了我似乎再沒有別的客人。我在電燈的光裡，在書架之間徘徊。接著在掛著『宗教』牌子的書架前停下腳步，翻開了一本綠色封面的書。",
        },
        {
          type: "inner",
          origin: "source",
          jp: "この本は目次の第何章かに「恐しい四つの敵、――疑惑、恐怖、驕慢、官能的欲望」と云う言葉を並べていた。",
          cn: "這本書的目次裡，第幾章寫著『可怕的四個敵人——疑惑、恐怖、驕慢、官能的欲望』這樣的字句。",
        },
      ],
      choices: [
        {
          text: "逐一咀嚼那四個名字——疑惑、恐怖、驕慢、官能的欲望。",
          next: "ch3_enemies",
          flag: "ch03.chewed_enemies",
          effects: { insight: { amount: 1, reason: "咀嚼四個敵人的名字" } },
          notebook: { key: "ch03.four_enemies", symbol: "book", desc: "綠皮宗教書——可怕的四個敵人：疑惑、恐怖、驕慢、官能的欲望" },
          unlock: "ch03.four_enemies",
        },
        {
          text: "合上那本書。",
          next: "ch3_juryo",
          flag: "ch03.closed_book",
          effects: null,
          notebook: null,
          unlock: null,
        },
      ],
      next: null,
      effects: null,
      flags: ["ch03.chewed_enemies", "ch03.closed_book"],
      notebook: null,
      links: null,
    },

    ch3_enemies: {
      id: "ch3_enemies",
      text: [
        {
          type: "inner",
          origin: "source",
          jp: "僕はこう云う言葉を見るが早いか、一層反抗的精神の起るのを感じた。それ等の敵と呼ばれるものは少くとも僕には感受性や理智の異名に外ならなかった。",
          cn: "我一看到這些字句，反抗的精神便愈發強烈起來。那些被稱作『敵人』的東西，至少對我而言，不過是感受性與理智的別名罷了。",
        },
        {
          type: "inner",
          origin: "source",
          jp: "が、伝統的精神もやはり近代的精神のようにやはり僕を不幸にするのは愈僕にはたまらなかった。",
          cn: "可傳統的精神，竟也和近代的精神一樣讓我不幸——這一點，愈發令我難以忍受。",
        },
      ],
      choices: null,
      next: "ch3_juryo",
      effects: null,
      flags: [],
      notebook: null,
      links: null,
    },

    ch3_juryo: {
      id: "ch3_juryo",
      text: [
        {
          type: "inner",
          origin: "source",
          jp: "僕はこの本を手にしたまま、ふといつかペン・ネエムに用いた「寿陵余子」と云う言葉を思い出した。",
          cn: "我手裡拿著這本書，忽然想起了自己曾用作筆名的『壽陵余子』這個詞。",
        },
        {
          type: "inner",
          origin: "source",
          jp: "それは邯鄲の歩みを学ばないうちに寿陵の歩みを忘れてしまい、蛇行匍匐して帰郷したと云う「韓非子」中の青年だった。",
          cn: "那是《韓非子》裡的一個青年——還沒學會邯鄲的步法，就先忘了壽陵的步法，最後只能蛇行匍匐，狼狽歸鄉。",
        },
        {
          type: "inner",
          origin: "source",
          jp: "今日の僕は誰の目にも「寿陵余子」であるのに違いなかった。しかしまだ地獄へ堕ちなかった僕もこのペン・ネエムを用いていたことは、――",
          cn: "如今的我，在任何人眼裡，無疑都是個『壽陵余子』。可還沒墮入地獄之前的我，早就已經用著這個筆名了，——",
        },
      ],
      choices: null,
      next: "ch3_poster",
      effects: null,
      flags: [],
      notebook: { key: "ch03.juryo", symbol: "book", desc: "壽陵余子——學不會邯鄲之步、又忘了壽陵之步，蛇行匍匐而歸的青年。我的舊筆名" },
      links: null,
    },

    ch3_poster: {
      id: "ch3_poster",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "僕は大きい書棚を後ろに努めて妄想を払うようにし、丁度僕の向うにあったポスタアの展覧室へはいって行った。",
          cn: "我把那座大書架拋在身後，努力驅散妄想，走進了正對面的海報展覽室。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "が、そこにも一枚のポスタアの中には聖ジョオジらしい騎士が一人翼のある竜を刺し殺していた。しかもその騎士は兜の下に僕の敵の一人に近いしかめ面を半ば露していた。",
          cn: "可就連那裡，一張海報中，一個像是聖喬治的騎士，正刺殺著一條長著翅膀的龍。而那騎士盔下半露的臉——竟有幾分像我的敵人之一。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "僕は又「韓非子」の中の屠竜の技の話を思い出し、展覧室へ通りぬけずに幅の広い階段を下って行った。",
          cn: "我又想起了《韓非子》裡屠龍之技的故事，沒有穿過展覽室，逕自走下了那道寬闊的樓梯。",
        },
      ],
      choices: null,
      next: "ch3_street",
      effects: null,
      flags: [],
      notebook: { key: "ch03.dragon_slay", symbol: "book", desc: "聖喬治刺龍的海報，騎士的臉像我的敵人——屠龍之技" },
      links: { fold: "── 丸善 · 針を隠した本 ──", unlock: "ch03.dragon_slay" },
    },

    // ═══════════════ 日本橋通り・カッフェ ═══════════════

    ch3_street: {
      id: "ch3_street",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "僕はもう夜になった日本橋通りを歩きながら、屠竜と云う言葉を考えつづけた。",
          cn: "我走在已然入夜的日本橋通上，一直想著『屠龍』這個詞。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "それは又僕の持っている硯の銘にも違いなかった。この硯を僕に贈ったのは或若い事業家だった。彼はいろいろの事業に失敗した揚句、とうとう去年の暮に破産してしまった。",
          cn: "那分明也正是我所擁有的那方硯台上的銘文。把這方硯台送給我的，是一位年輕的實業家。他做了各種各樣的事業，最終還是在去年年底徹底破產了。",
        },
      ],
      choices: [
        {
          text: "抬頭看星空。",
          next: "ch3_stars",
          flag: "ch03.looked_up",
          effects: { insight: { amount: 1, reason: "在星光中衡量自己的渺小" } },
          notebook: null,
          unlock: null,
        },
        {
          text: "加快腳步。",
          next: "ch3_cafe_refuge",
          flag: "ch03.hurried",
          effects: null,
          notebook: null,
          unlock: null,
        },
      ],
      next: null,
      effects: null,
      flags: ["ch03.looked_up", "ch03.hurried"],
      notebook: null,
      links: { visit: "ch03.nihonbashi" },
    },

    ch3_stars: {
      id: "ch3_stars",
      text: [
        {
          type: "inner",
          origin: "source",
          jp: "僕は高い空を見上げ、無数の星の光の中にどのくらいこの地球の小さいかと云うことを、――従ってどのくらい僕自身の小さいかと云うことを考えようとした。",
          cn: "我抬頭望向高空，想在無數星光之中，去想一想這個地球是多麼渺小——進而，我自己又是多麼渺小。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "しかし昼間は晴れていた空もいつかもうすっかり曇っていた。",
          cn: "可白天還放晴的天空，不知何時，已然完全陰了下來。",
        },
      ],
      choices: null,
      next: "ch3_cafe_refuge",
      effects: null,
      flags: [],
      notebook: null,
      links: null,
    },

    ch3_cafe_refuge: {
      id: "ch3_cafe_refuge",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "僕は突然何ものかの僕に敵意を持っているのを感じ、電車線路の向うにある或カッフェへ避難することにした。",
          cn: "我忽然感覺到，有某種東西正對我懷著敵意，於是決定躲進電車軌道對面的一間咖啡館避難。",
        },
      ],
      choices: null,
      next: "ch3_cafe",
      effects: null,
      flags: [],
      notebook: null,
      links: null,
    },

    ch3_cafe: {
      id: "ch3_cafe",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "それは「避難」に違いなかった。僕はこのカッフェの薔薇色の壁に何か平和に近いものを感じ、一番奥のテエブルの前にやっと楽々と腰をおろした。",
          cn: "那無疑是一場『避難』。我從這間咖啡館玫瑰色的牆壁上，感覺到了幾分近乎和平的東西，總算在最裡面的桌子前，鬆快地坐了下來。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "そこには幸い僕の外に二三人の客のあるだけだった。僕は一杯のココアを啜り、ふだんのように巻煙草をふかし出した。",
          cn: "幸好那裡除了我，只有兩三個客人。我啜著一杯可可，一如往常地抽起了卷菸。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "巻煙草の煙は薔薇色の壁へかすかに青い煙を立ちのぼらせて行った。この優しい色の調和もやはり僕には愉快だった。",
          cn: "菸的煙霧，朝著玫瑰色的牆壁，裊裊升起一縷淡淡的青煙。這溫柔的色彩調和，仍舊讓我感到愉快。",
        },
      ],
      choices: null,
      next: "ch3_napoleon",
      effects: null,
      flags: [],
      notebook: null,
      links: { visit: "ch03.cafe", fold: "── 夜の日本橋通り ──" },
    },

    ch3_napoleon: {
      id: "ch3_napoleon",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "けれども僕は暫らくの後、僕の左の壁にかけたナポレオンの肖像画を見つけ、そろそろ又不安を感じ出した。",
          cn: "可過了不久，我發現了左側牆上掛著的拿破崙肖像畫，漸漸又生出了一股不安。",
        },
      ],
      choices: [
        {
          text: "盯著那幅拿破崙像。",
          next: "ch3_napoleon_stare",
          flag: "ch03.stared_napoleon",
          effects: { insight: { amount: 1, reason: "拿破崙的『聖赫勒拿，小島』" } },
          notebook: { key: "ch03.napoleon", symbol: "book", desc: "咖啡館牆上的拿破崙——學生時代在筆記本末頁寫下『聖赫勒拿，小島』的男人" },
          unlock: "ch03.napoleon",
        },
        {
          text: "移開視線。",
          next: "ch3_own_works",
          flag: "ch03.avoided_napoleon",
          effects: null,
          notebook: null,
          unlock: null,
        },
      ],
      next: null,
      effects: null,
      flags: ["ch03.stared_napoleon", "ch03.avoided_napoleon"],
      notebook: null,
      links: null,
    },

    ch3_napoleon_stare: {
      id: "ch3_napoleon_stare",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "ナポレオンはまだ学生だった時、彼の地理のノオト・ブックの最後に「セエント・ヘレナ、小さい島」と記していた。",
          cn: "拿破崙還是學生的時候，曾在他地理筆記本的最後一頁，寫下『聖赫勒拿，小島』這樣的字句。",
        },
        {
          type: "inner",
          origin: "source",
          jp: "それは或は僕等の言うように偶然だったかも知れなかった。しかしナポレオン自身にさえ恐怖を呼び起したのは確かだった。……",
          cn: "那或許正如我們常說的，只是偶然罷了。可就連拿破崙本人，也確實因此感到過恐懼——這一點是確定的。……",
        },
      ],
      choices: null,
      next: "ch3_own_works",
      effects: null,
      flags: [],
      notebook: null,
      links: null,
    },

    ch3_own_works: {
      id: "ch3_own_works",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "僕はナポレオンを見つめたまま、僕自身の作品を考え出した。",
          cn: "我凝視著拿破崙，開始想起自己的作品來。",
        },
        {
          type: "inner",
          origin: "source",
          jp: "するとまず記憶に浮かんだのは「侏儒の言葉」の中のアフォリズムだった。",
          cn: "於是，最先浮現在記憶裡的，是《侏儒的話》裡的一句格言。",
        },
        {
          type: "inner",
          origin: "source",
          jp: "（殊に「人生は地獄よりも地獄的である」と云う言葉だった）",
          cn: "（尤其是那句『人生比地獄還要地獄』。）",
        },
        {
          type: "inner",
          origin: "source",
          jp: "それから「地獄変」の主人公、――良秀と云う画師の運命だった。",
          cn: "接著，是《地獄變》的主人公——那個名叫良秀的畫師的命運。",
        },
      ],
      choices: null,
      next: "ch3_cafe_change",
      effects: null,
      flags: [],
      notebook: { key: "ch03.hell_aphorism", symbol: "book", desc: "我自己寫下的話——『人生比地獄還要地獄』" },
      links: null,
    },

    ch3_cafe_change: {
      id: "ch3_cafe_change",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "それから……僕は巻煙草をふかしながら、こう云う記憶から逃れる為にこのカッフェの中を眺めまわした。",
          cn: "然後……我一面抽著菸，一面為了逃離這些記憶，環顧起這間咖啡館來。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "僕のここへ避難したのは五分もたたない前のことだった。しかしこのカッフェは短時間の間にすっかり容子を改めていた。",
          cn: "我躲進這裡避難，其實還不到五分鐘前的事。可這間咖啡館，卻在這短短的時間裡，徹底變了模樣。",
        },
        {
          type: "inner",
          origin: "source",
          jp: "就中僕を不快にしたのはマホガニイまがいの椅子やテエブルの少しもあたりの薔薇色の壁と調和を保っていないことだった。",
          cn: "尤其讓我不快的是，那些仿桃花心木的椅子與桌子，絲毫沒有和周圍玫瑰色的牆壁協調起來。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "僕はもう一度人目に見えない苦しみの中に落ちこむのを恐れ、銀貨を一枚投げ出すが早いか、匆々このカッフェを出ようとした。",
          cn: "我害怕再一次墜入那種不為人知的痛苦之中，慌忙丟下一枚銀幣，匆匆想要走出這間咖啡館。",
        },
      ],
      choices: null,
      next: "ch3_coin",
      effects: null,
      flags: [],
      notebook: null,
      links: null,
    },

    ch3_coin: {
      id: "ch3_coin",
      text: [
        { type: "dialogue", origin: "source", speaker: "女給", speakerId: "cafe_waitress", jp: "「もし、もし、二十銭頂きますが、……」", cn: "「先生，先生，還差二十錢，……」" },
        {
          type: "narration",
          origin: "source",
          jp: "僕の投げ出したのは銅貨だった。",
          cn: "我丟下的，是一枚銅幣。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "僕は屈辱を感じながら、ひとり往来を歩いているうちにふと遠い松林の中にある僕の家を思い出した。",
          cn: "我懷著屈辱，獨自走在大街上，忽然想起了那座在遙遠松林之中的家。",
        },
      ],
      choices: null,
      next: "ch3_home_memory",
      effects: { nerve: { amount: -1, reason: "銅貨的屈辱" } },
      flags: [],
      notebook: null,
      links: null,
    },

    ch3_home_memory: {
      id: "ch3_home_memory",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "それは或郊外にある僕の養父母の家ではない、唯僕を中心にした家族の為に借りた家だった。",
          cn: "那並不是我養父母在郊外的那個家，只是為了以我為中心的家人租下的一間房子。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "僕はかれこれ十年前にもこう云う家に暮らしていた。しかし或事情の為に軽率にも父母と同居し出した。",
          cn: "約莫十年前，我也曾住在這樣的家裡。可後來因為某些緣故，我輕率地和父母同居了起來。",
        },
        {
          type: "inner",
          origin: "source",
          jp: "同時に又奴隷に、暴君に、力のない利己主義者に変り出した。……",
          cn: "同時，我也漸漸變成了奴隸，變成了暴君，變成了一個無力的利己主義者。……",
        },
      ],
      choices: null,
      next: "ch3_hotel_fire",
      effects: null,
      flags: [],
      notebook: null,
      links: null,
    },

    // ═══════════════ ホテル・炉端 ═══════════════

    ch3_hotel_fire: {
      id: "ch3_hotel_fire",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "前のホテルに帰ったのはもうかれこれ十時だった。ずっと長い途を歩いて来た僕は僕の部屋へ帰る力を失い、太い丸太の火を燃やした炉の前の椅子に腰をおろした。",
          cn: "回到方才那間旅館時，已將近十點。走了好長一段路的我，已沒有力氣回到房間，只在燒著粗大原木的爐火前，一屁股坐進了椅子。",
        },
        {
          type: "inner",
          origin: "source",
          jp: "それから僕の計画していた長篇のことを考え出した。それは推古から明治に至る各時代の民を主人公にし、大体三十余りの短篇を時代順に連ねた長篇だった。",
          cn: "接著，我想起了自己一直在構思的那部長篇。那是一部以推古到明治，各個時代的百姓為主角，大約由三十餘篇短篇按時代順序串連而成的長篇。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "僕は火の粉の舞い上るのを見ながら、ふと宮城の前にある或銅像を思い出した。",
          cn: "我望著飛舞的火星，忽然想起了皇居前的一座銅像。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "この銅像は甲冑を着、忠義の心そのもののように高だかと馬の上に跨っていた。",
          cn: "那座銅像披著甲冑，忠義之心的化身一般，威風凜凜地跨在馬上。",
        },
        {
          type: "inner",
          origin: "source",
          jp: "しかし彼の敵だったのは、――",
          cn: "可他的敵人，卻是——",
        },
      ],
      choices: null,
      next: "ch3_uso",
      effects: null,
      flags: [],
      notebook: null,
      links: { visit: "ch03.hotel_lobby", fold: "── カッフェ · 銅貨 ──" },
    },

    ch3_uso: {
      id: "ch3_uso",
      text: [
        { type: "dialogue", origin: "source", speaker: "我", speakerId: "protagonist", jp: "「噓！」", cn: "「騙人！」" },
        {
          type: "narration",
          origin: "source",
          jp: "僕は又遠い過去から目近い現代へすべり落ちた。",
          cn: "我又從遙遠的過去，滑落回了眼前的現代。",
        },
      ],
      choices: null,
      next: "ch3_sculptor",
      effects: null,
      flags: [],
      notebook: null,
      links: null,
    },

    // ═══════════════ 彫刻家 ═══════════════

    ch3_sculptor: {
      id: "ch3_sculptor",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "そこへ幸いにも来合せたのは或先輩の彫刻家だった。彼は不相変天鵞絨の服を着、短い山羊髯を反らせていた。",
          cn: "恰在此時，湊巧遇上的，是一位前輩彫刻家。他一如既往地穿著天鵞絨的衣服，翹起短短的山羊鬍。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "僕は椅子から立ち上り、彼のさし出した手を握った。",
          cn: "我從椅子上站起身，握住了他伸出的手。",
        },
        {
          type: "inner",
          origin: "source",
          jp: "（それは僕の習慣ではない、パリやベルリンに半生を送った彼の習慣に従ったのだった）",
          cn: "（那並不是我的習慣——是遵從了在巴黎與柏林度過半生的他的習慣。）",
        },
        {
          type: "inner",
          origin: "source",
          jp: "が、彼の手は不思議にも爬虫類の皮膚のように湿っていた。",
          cn: "可他的手，卻不可思議地濕冷，像爬蟲類的皮膚一樣。",
        },
      ],
      choices: null,
      next: "ch3_sculptor_talk",
      effects: null,
      flags: [],
      notebook: null,
      links: null,
    },

    ch3_sculptor_talk: {
      id: "ch3_sculptor_talk",
      text: [
        { type: "dialogue", origin: "source", speaker: "彫刻家", speakerId: "sculptor", jp: "「君はここに泊っているのですか？」", cn: "「你住在這裡嗎？」" },
        { type: "dialogue", origin: "source", speaker: "我", speakerId: "protagonist", jp: "「ええ、……」", cn: "「嗯，……」" },
        { type: "dialogue", origin: "source", speaker: "彫刻家", speakerId: "sculptor", jp: "「仕事をしに？」", cn: "「來工作的？」" },
        { type: "dialogue", origin: "source", speaker: "我", speakerId: "protagonist", jp: "「ええ、仕事もしているのです」", cn: "「嗯，也在工作。」" },
        {
          type: "narration",
          origin: "source",
          jp: "彼はじっと僕の顔を見つめた。僕は彼の目の中に探偵に近い表情を感じた。",
          cn: "他直直地盯著我的臉看。我從他的眼睛裡，感覺到一種近乎偵探的神情。",
        },
        { type: "dialogue", origin: "source", speaker: "我", speakerId: "protagonist", jp: "「どうです、僕の部屋へ話しに来ては？」", cn: "「怎麼樣，要不要來我房間聊聊？」" },
        {
          type: "narration",
          origin: "source",
          jp: "僕は挑戦的に話しかけた。",
          cn: "我用一種挑釁的語氣，這樣向他搭了話。",
        },
        {
          type: "inner",
          origin: "source",
          jp: "（この勇気に乏しい癖に忽ち挑戦的態度をとるのは僕の悪癖の一つだった）",
          cn: "（明明缺乏勇氣，卻又忽然擺出挑釁的態度——這是我的惡習之一。）",
        },
        {
          type: "narration",
          origin: "source",
          jp: "すると彼は微笑しながら、「どこ、君の部屋は？」と尋ね返した。",
          cn: "於是他微笑著，反問了一句：『你的房間在哪兒？』",
        },
      ],
      choices: null,
      next: "ch3_room_women",
      effects: null,
      flags: [],
      notebook: null,
      links: null,
    },

    // ═══════════════ 僕の部屋・鏡 ═══════════════

    ch3_room_women: {
      id: "ch3_room_women",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "僕等は親友のように肩を並べ、静かに話している外国人たちの中を僕の部屋へ帰って行った。",
          cn: "我們像摯友一般肩並著肩，穿過那群正安靜交談的外國人，回到了我的房間。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "彼は僕の部屋へ来ると、鏡を後ろにして腰をおろした。それからいろいろのことを話し出した。",
          cn: "他一走進我的房間，便背對著鏡子坐下。接著，說起了種種事情。",
        },
        {
          type: "inner",
          origin: "source",
          jp: "いろいろのことを？――しかし大抵は女の話だった。",
          cn: "種種事情？――可大抵，說的都是女人的事。",
        },
        {
          type: "inner",
          origin: "source",
          jp: "僕は罪を犯した為に地獄に堕ちた一人に違いなかった。が、それだけに悪徳の話は愈僕を憂鬱にした。",
          cn: "我無疑是個因犯了罪才墮入地獄的人。可正因如此，罪惡的話題，反倒愈發讓我憂鬱起來。",
        },
      ],
      choices: [
        {
          text: "化作一時的清教徒，譏諷那些女人。",
          next: "ch3_s_ko",
          flag: "ch03.mocked",
          effects: null,
          notebook: null,
          unlock: null,
        },
        {
          text: "忍住不開口。",
          next: "ch3_hold_tongue",
          flag: "ch03.held_tongue",
          effects: null,
          notebook: null,
          unlock: null,
        },
      ],
      next: null,
      effects: null,
      flags: ["ch03.mocked", "ch03.held_tongue"],
      notebook: null,
      links: null,
    },

    ch3_hold_tongue: {
      id: "ch3_hold_tongue",
      text: [
        {
          type: "narration",
          origin: "added",
          content: "話題繞來繞去，終究還是回到了女人身上。我終究，還是開了口。",
        },
      ],
      choices: null,
      next: "ch3_s_ko",
      effects: null,
      flags: [],
      notebook: null,
      links: null,
    },

    ch3_s_ko: {
      id: "ch3_s_ko",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "僕は一時的清教徒になり、それ等の女を嘲り出した。",
          cn: "我化作了一時的清教徒，開始譏諷起那些女人來。",
        },
        {
          type: "dialogue",
          origin: "source",
          speaker: "我",
          speakerId: "protagonist",
          jp: "「Ｓ子さんの唇を見給え。あれは何人もの接吻の為に……」",
          cn: "「你看看Ｓ子小姐的嘴唇。那是被多少人吻過……」",
        },
        {
          type: "narration",
          origin: "source",
          jp: "僕はふと口を噤み、鏡の中に彼の後ろ姿を見つめた。",
          cn: "我忽然噤住了口，凝視著鏡中他的背影。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "彼は丁度耳の下に黄いろい膏薬を貼りつけていた。",
          cn: "他正巧在耳朵下方，貼著一塊黃色的膏藥。",
        },
      ],
      choices: null,
      next: "ch3_kiss_reply",
      effects: { insight: { amount: 1, reason: "鏡中的監視" } },
      flags: [],
      notebook: { key: "ch03.mirror_watch", symbol: "gear", desc: "鏡中他的背影——耳下貼著黃色膏藥。他在監視我" },
      links: null,
    },

    ch3_kiss_reply: {
      id: "ch3_kiss_reply",
      text: [
        {
          type: "dialogue",
          origin: "source",
          speaker: "彫刻家",
          speakerId: "sculptor",
          jp: "「何人もの接吻の為に？」",
          cn: "「被多少人吻過？」",
        },
        {
          type: "dialogue",
          origin: "source",
          speaker: "我",
          speakerId: "protagonist",
          jp: "「そんな人のように思いますがね」",
          cn: "「我總覺得，她就是這樣的人。」",
        },
        {
          type: "narration",
          origin: "source",
          jp: "彼は微笑して頷いていた。僕は彼の内心では僕の秘密を知る為に絶えず僕を注意しているのを感じた。",
          cn: "他微笑著點了點頭。我感覺到，在他心底，正不斷地留意著我——為了探知我的秘密。",
        },
        {
          type: "inner",
          origin: "source",
          jp: "けれどもやはり僕等の話は女のことを離れなかった。僕は彼を憎むよりも僕自身の気の弱いのを恥じ、愈憂鬱にならずにはいられなかった。",
          cn: "可我們的話題，終究還是離不開女人。比起憎恨他，我更羞愧於自己意志的軟弱，也就愈發沒法不憂鬱起來。",
        },
      ],
      choices: null,
      next: "ch3_anya",
      effects: null,
      flags: [],
      notebook: null,
      links: { fold: "── 彫刻家 · 鏡 ──" },
    },

    ch3_anya: {
      id: "ch3_anya",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "やっと彼の帰った後、僕はベッドの上に転がったまま、「暗夜行路」を読みはじめた。",
          cn: "他總算回去之後，我索性躺倒在床上，開始讀起《暗夜行路》來。",
        },
        {
          type: "inner",
          origin: "source",
          jp: "主人公の精神的闘争は一々僕には痛切だった。",
          cn: "主人公精神上的每一次掙扎，都讓我感到切身之痛。",
        },
        {
          type: "inner",
          origin: "source",
          jp: "僕はこの主人公に比べると、どのくらい僕の阿呆だったかを感じ、いつか涙を流していた。",
          cn: "與這位主人公相比，我感覺到自己是多麼的愚蠢，不知不覺，已流下了眼淚。",
        },
        {
          type: "inner",
          origin: "source",
          jp: "同時に又涙は僕の気もちにいつか平和を与えていた。",
          cn: "同時，這眼淚也不知不覺地，為我的心境帶來了幾分平靜。",
        },
      ],
      choices: null,
      next: "ch3_gears_return",
      effects: null,
      flags: [],
      notebook: null,
      links: null,
    },

    ch3_gears_return: {
      id: "ch3_gears_return",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "が、それも長いことではなかった。僕の右の目はもう一度半透明の歯車を感じ出した。",
          cn: "可這平靜，並沒有維持多久。我的右眼，又一次感覺到了那半透明的齒輪。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "歯車はやはりまわりながら、次第に数を殖やして行った。",
          cn: "齒輪一如既往地轉動著，數量也漸漸地增加了起來。",
        },
      ],
      choices: [
        {
          text: "在齒輪淹沒視野之前，數它們的數量。",
          next: "ch3_gears_count",
          flag: "ch03.counted_gears",
          effects: { insight: { amount: 1, reason: "數齒輪" } },
          notebook: null,
          unlock: null,
        },
        {
          text: "立刻吞下佛羅拿。",
          next: "ch3_veronal",
          flag: "ch03.swallowed_fast",
          effects: null,
          notebook: null,
          unlock: null,
        },
      ],
      next: null,
      effects: { nerve: { amount: -1, reason: "齒輪，再一次" } },
      flags: ["ch03.counted_gears", "ch03.swallowed_fast"],
      notebook: null,
      links: null,
    },

    ch3_gears_count: {
      id: "ch3_gears_count",
      text: [
        {
          type: "inner",
          origin: "added",
          content: "數不清。它們增殖的速度，比我數的速度還快。",
        },
      ],
      choices: null,
      next: "ch3_veronal",
      effects: null,
      flags: [],
      notebook: null,
      links: null,
    },

    ch3_veronal: {
      id: "ch3_veronal",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "僕は頭痛のはじまることを恐れ、枕もとに本を置いたまま、○・八グラムのヴェロナアルを嚥み、とにかくぐっすり眠ることにした。",
          cn: "我害怕頭痛就此開始，把書留在枕邊，吞下了○．八公克的佛羅拿，總之，決定好好睡上一覺。",
        },
      ],
      choices: null,
      next: "ch3_dream_pool",
      effects: null,
      flags: [],
      notebook: null,
      links: { visit: "ch03.hotel_room", fold: "── 暗夜行路 · 歯車 ──" },
    },

    // ═══════════════ 夢（全 auto——夢中無選擇是刻意設計） ═══════════════

    ch3_dream_pool: {
      id: "ch3_dream_pool",
      text: [
        { type: "break" },
        {
          type: "narration",
          origin: "source",
          jp: "けれども僕は夢の中に或プウルを眺めていた。",
          cn: "可我卻在夢中，望著一座泳池。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "そこには又男女の子供たちが何人も泳いだりもぐったりしていた。",
          cn: "那裡還有好幾個男孩女孩，時而游泳，時而潛入水中。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "僕はこのプウルを後ろに向うの松林へ歩いて行った。",
          cn: "我把這座泳池拋在身後，朝著對面的松林走去。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "すると誰か後ろから「おとうさん」と僕に声をかけた。",
          cn: "這時，有人從背後喊了我一聲「爸爸」。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "僕はちょっとふり返り、プウルの前に立った妻を見つけた。",
          cn: "我微微回過頭，看見了站在泳池前的妻子。",
        },
        {
          type: "inner",
          origin: "source",
          jp: "同時に又烈しい後悔を感じた。",
          cn: "同時，我也感覺到了一陣劇烈的後悔。",
        },
        {
          type: "dialogue",
          origin: "source",
          speaker: "妻",
          speakerId: "wife",
          jp: "「おとうさん、タオルは？」",
          cn: "「爸爸，毛巾呢？」",
        },
        {
          type: "dialogue",
          origin: "source",
          speaker: "我",
          speakerId: "protagonist",
          jp: "「タオルはいらない。子供たちに気をつけるのだよ」",
          cn: "「不用毛巾。你看好孩子們就行了。」",
        },
      ],
      choices: null,
      next: "ch3_dream_platform",
      effects: null,
      flags: [],
      notebook: { key: "ch03.dream_wife", symbol: "wing", desc: "夢裡的泳池——妻喊我『孩子的爸』。我感到劇烈的後悔" },
      links: null,
    },

    ch3_dream_platform: {
      id: "ch3_dream_platform",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "僕は又歩みをつづけ出した。が、僕の歩いているのはいつかプラットフォオムに変っていた。",
          cn: "我又邁開步子，繼續走了下去。可不知何時，我走著的地方，已經變成了月台。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "それは田舎の停車場だったと見え、長い生け垣のあるプラットフォオムだった。",
          cn: "看樣子，那似乎是個鄉下的車站，一座有著長長樹籬的月台。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "そこには又Ｈと云う大学生や年をとった女も佇んでいた。彼等は僕の顔を見ると、僕の前に歩み寄り、口々に僕へ話しかけた。",
          cn: "那裡還站著一位叫Ｈ的大學生，還有一個上了年紀的女人。他們一看見我的臉，便朝我走了過來，七嘴八舌地向我搭話。",
        },
        {
          type: "dialogue",
          origin: "source",
          speaker: "年老的女人",
          speakerId: "old_woman",
          jp: "「大火事でしたわね」",
          cn: "「這場火可真大呀。」",
        },
        {
          type: "dialogue",
          origin: "source",
          speaker: "Ｈ",
          speakerId: "student_h",
          jp: "「僕もやっと逃げて来たの」",
          cn: "「我也是好不容易才逃出來的。」",
        },
      ],
      choices: null,
      next: "ch3_dream_train",
      effects: null,
      flags: [],
      notebook: null,
      links: null,
    },

    ch3_dream_train: {
      id: "ch3_dream_train",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "僕はこの年をとった女に何か見覚えのあるように感じた。",
          cn: "我總覺得，這個上了年紀的女人，似乎有些眼熟。",
        },
        {
          type: "inner",
          origin: "source",
          jp: "のみならず彼女と話していることに或愉快な興奮を感じた。",
          cn: "不僅如此，我與她交談之際，還感覺到了一種愉快的興奮。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "そこへ汽車は煙をあげながら、静かにプラットフォオムへ横づけになった。",
          cn: "這時，火車冒著煙，靜靜地靠上了月台。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "僕はひとりこの汽車に乗り、両側に白い布を垂らした寝台の間を歩いて行った。",
          cn: "我獨自登上了這班火車，走在兩側垂著白布的臥鋪之間。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "すると或寝台の上にミイラに近い裸体の女が一人こちらを向いて横になっていた。",
          cn: "這時，某張臥鋪上，橫躺著一個近乎木乃伊的裸體女人，正朝著這邊。",
        },
        {
          type: "inner",
          origin: "source",
          jp: "それは又僕の復讐の神、――或狂人の娘に違いなかった。……",
          cn: "那無疑，正是我的復讐之神——某個狂人的女兒。……",
        },
      ],
      choices: null,
      next: "ch3_wake",
      effects: { nerve: { amount: -1, reason: "復讐の神の姿" } },
      flags: [],
      notebook: { key: "ch03.mummy", symbol: "raincoat", desc: "寢台上近乎木乃伊的裸女——我的復仇之神，某個狂人的女兒" },
      links: { unlock: "ch03.mummy" },
    },

    ch3_wake: {
      id: "ch3_wake",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "僕は目を醒ますが早いか、思わずベッドを飛び下りていた。",
          cn: "我一睜開眼，就不由自主地從床上跳了下來。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "僕の部屋は不相変電燈の光に明るかった。",
          cn: "我的房間，一如往常，被電燈的光照得明亮。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "が、どこかに翼の音や鼠のきしる音も聞えていた。",
          cn: "可不知哪裡，卻傳來了翅膀振動的聲音，還有老鼠吱吱的叫聲。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "僕は戸をあけて廊下へ出、前の炉の前へ急いで行った。",
          cn: "我打開房門走到走廊上，急急忙忙地走向先前那座壁爐前。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "それから椅子に腰をおろしたまま、覚束ない炎を眺め出した。",
          cn: "接著，我一屁股坐進椅子，望起那搖曳不定的火焰來。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "そこへ白い服を着た給仕が一人焚き木を加えに歩み寄った。",
          cn: "這時，一個穿著白色制服的服務生走了過來，往爐裡添起柴火。",
        },
      ],
      choices: null,
      next: "ch3_sanji_han",
      effects: null,
      flags: [],
      notebook: { key: "ch03.wing_rat", symbol: "wing", desc: "深夜三點的房間——翅膀的聲音，還有老鼠的吱鳴" },
      links: { fold: "── 夢 · 復讐の神 ──", unlock: "ch03.wing_rat" },
    },

    ch3_sanji_han: {
      id: "ch3_sanji_han",
      text: [
        {
          type: "dialogue",
          origin: "source",
          speaker: "我",
          speakerId: "protagonist",
          jp: "「何時？」",
          cn: "「幾點了？」",
        },
        {
          type: "dialogue",
          origin: "source",
          speaker: "給仕",
          speakerId: "hotel_waiter",
          jp: "「三時半ぐらいでございます」",
          cn: "「大概三點半左右。」",
        },
      ],
      choices: null,
      next: "ch3_lobby",
      effects: null,
      flags: [],
      notebook: null,
      links: null,
    },

    // ═══════════════ 大廳・凌晨三點半 ═══════════════

    ch3_lobby: {
      id: "ch3_lobby",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "しかし向うのロッビイの隅には亜米利加人らしい女が一人何か本を読みつづけた。",
          cn: "可就在對面大廳的角落，一個像是美國人的女人，正持續讀著什麼書。",
        },
      ],
      choices: [
        {
          text: "望著那個讀書的女人。",
          next: "ch3_green_stare",
          flag: "ch03.watched_green",
          effects: { insight: { amount: 1, reason: "綠衣女人的救贖感" } },
          notebook: { key: "ch03.green_dress", symbol: "book", desc: "凌晨的大廳——讀著書的美國女人，遠遠望去也是綠色的洋裝" },
          unlock: "ch03.green_dress",
        },
        {
          text: "閉上眼睛等天亮。",
          next: "ch3_end_wait",
          flag: "ch03.closed_eyes",
          effects: null,
          notebook: null,
          unlock: null,
        },
      ],
      next: null,
      effects: null,
      flags: ["ch03.watched_green", "ch03.closed_eyes"],
      notebook: null,
      links: null,
    },

    ch3_green_stare: {
      id: "ch3_green_stare",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "彼女の着ているのは遠目に見ても緑いろのドレッスに違いなかった。",
          cn: "她身上穿的，即便隔著老遠望去，也無疑是件綠色的洋裝。",
        },
      ],
      choices: null,
      next: "ch3_end_wait",
      effects: null,
      flags: [],
      notebook: null,
      links: null,
    },

    ch3_end_wait: {
      id: "ch3_end_wait",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "僕は何か救われたのを感じ、じっと夜のあけるのを待つことにした。",
          cn: "我感覺到了某種近乎救贖的東西，決定靜靜地，等待天亮。",
        },
        {
          type: "inner",
          origin: "source",
          jp: "長年の病苦に悩み抜いた揚句、静かに死を待っている老人のように。……",
          cn: "就像一個被多年病痛折磨殆盡、正靜靜等待死亡的老人一樣。……",
        },
        { type: "system", content: "第三章「夜」 終" },
      ],
      choices: null,
      next: null,
      effects: { insight: { amount: 1, reason: "等待天明" } },
      flags: [],
      notebook: null,
      links: { showEnd: true },
    },
  },
};
