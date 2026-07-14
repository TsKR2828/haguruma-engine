// ═══════════════════════════════════════════════════════════
// 第五章「赤光」
// Source: 芥川龍之介《歯車》五「赤光」
// 青空文庫 https://www.aozora.gr.jp/cards/000879/files/42377_34745.html
// 底本檔案：reference/aozora/haguruma_original.txt（CH5 = B:L369–L461）
//
// 場景格式定義：docs/chapter-data-schema.md
// 施工圖（唯一來源）：docs/ch5-source-map.md（全域政策沿用 docs/ch1-source-map.md §0，
//   cn 為第一人稱「我」，見 ch1-source-map D12 定案敘述）
// 參考（⚠ 第二段「赤光池塘／穿寢衣老婦／死鼴鼠」整段是幻覺（audit §1c-5），且漏掉
//   章題眼《赤光》歌集——本圖已取代之。docs/chapter05-spec.md 檔頭已加註作廢警語，
//   僅其餘段落 cn 可參考）：docs/chapter05-spec.md
//
// Batch F9：§1 骨架 + §2 全 39 場景（ch5_prologue ～ ch5_ending）逐字回填 jp（一律 Read
//   底本複製，未手打）+ 新譯 cn（一人稱「我」），含 7 選擇點。§3 connections（6 條，
//   含 1 條跨章 CH1 依賴 book_worm、1 條跨章 CH4 依賴 ch04.la_mort）補上。symbols.js
//   CH5 區、chapterRegistry.js、README、DEV-LOG 同批更新。
//
// 特別處理：
// - 舊 chapter05-spec.md 捏造的「赤光池塘」「穿寢衣老婦」「死鼴鼠」整段內容本章
//   完全不存在——原文該段（B:L435）是「運河・達磨船」（郊外養父母家的回憶＋運河上
//   達磨船底透出的薄光，那裡也有一家人生活著），已依施工圖逐字回填於 ch5_canal，
//   無池塘、無老婦、無死鼴鼠。
// - 章題眼《赤光》歌集信（B:L441「歌集『赤光』の再版を送りますから……」）為
//   ch5_shakko 場景的核心 narration block，逐字含括號收錄，並觸發 nerve −1
//   （赤光——連信裡都是）與 notebook「ch05.shakko_letter」。
// - 法語記者對白三句（B:L425／L427／L429）逐字收錄，含空格與標點（法語排版慣例：
//   問號／驚嘆號前有半形空格，如「pourquoi ?」「mort !」），cn 附直譯而非意譯。
// - §1 骨架標頭 sceneCount 標 38，但 §2 實際逐一枚舉為 39 個場景 id（含全部
//   choice／分支／auto 場景）。本檔以 §2 實際枚舉為準記 sceneCount: 39，已在此註記
//   偏離（同 CH3／ch3-source-map.md 先例：F7-1 遇到同類骨架標頭與實際枚舉不一致時，
//   以實際枚舉為準）。
// - portraits 欄位省略（沿用 CH3／CH4 慣例，尚無立繪）。
// ═══════════════════════════════════════════════════════════

export const CHAPTER_05 = {
  chapter: 5,
  title: "赤光",
  titleCn: "赤光",
  startScene: "ch5_prologue",
  startLocation: "ch05.hotel_room",
  sceneCount: 39,

  locations: [
    { id: "ch05.hotel_room", label: "ホテル", sub: "カアテンの内", x: 50, y: 50, shape: "rect", symbolKey: "ch05.mole_curtain" },
    { id: "ch05.attic", label: "屋根裏", sub: "聖書会社", x: 130, y: 120, shape: "mountain", symbolKey: "ch05.unicorn" },
    { id: "ch05.bar_street", label: "夜の往来", sub: "赤光", x: 200, y: 190, shape: "circle", symbolKey: "ch05.red_lantern" },
    { id: "ch05.basement", label: "地下室", sub: "バア", x: 200, y: 260, shape: "rect", symbolKey: "ch05.bw_whiskey" },
    { id: "ch05.canal", label: "運河", sub: "達磨船", x: 120, y: 320, shape: "circle", symbolKey: "ch05.darma_boat" },
  ],

  // docs/ch5-source-map.md §3（6 條，含 1 個跨章 CH1 依賴：kirin_child 依賴 CH1
  // grandfathered key "book_worm"、1 個跨章 CH4 依賴：mole_self 依賴 CH4 key
  // "ch04.la_mort"）。
  connections: [
    { id: "ch05.mole_self", requires: ["ch04.la_mort", "ch05.mole_curtain"], title: "鼴鼠——我自己", subtitle: "Mole、la mort、カアテンの内", icon: "◉", insightGain: 2 }, // 跨章 CH4
    { id: "ch05.kirin_child", requires: ["book_worm", "ch05.unicorn"], title: "麒麟児", subtitle: "一角獣、林檎の皮の上に", icon: "◈", insightGain: 2 }, // 跨章 CH1
    { id: "ch05.black_white", requires: ["ch05.bw_whiskey", "ch05.bw_letter"], title: "Black and White", subtitle: "ウイスキイと手紙のＰ・Ｓ", icon: "◇", insightGain: 1 },
    { id: "ch05.artificial_wings", requires: ["ch05.icarus", "ch05.airship"], title: "人工の翼", subtitle: "タイアの商標から煙草の名へ", icon: "✦", insightGain: 1 },
    { id: "ch05.red_light", requires: ["ch05.red_lantern", "ch05.shakko_letter"], title: "赤光", subtitle: "ランタアンの赤、歌集の名", icon: "✶", insightGain: 2 },
    { id: "ch05.diable", requires: ["ch05.french_whisper", "ch05.diable_dream"], title: "Le diable est mort", subtitle: "地下室の仏蘭西語、夢の囁き", icon: "◉", insightGain: 2 },
  ],

  scenes: {
    // ═══════════════ ホテル・カアテンの内 ═══════════════

    ch5_prologue: {
      id: "ch5_prologue",
      text: [
        { type: "system", content: "第五章　赤光" },
        { type: "system", content: "——赤光——" },
        { type: "break" },
        {
          type: "narration",
          origin: "source",
          jp: "日の光は僕を苦しめ出した。",
          cn: "日光開始折磨我了。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "僕は実際鼴鼠のように窓の前へカアテンをおろし、昼間も電燈をともしたまま、せっせと前の小説をつづけて行った。",
          cn: "我簡直像隻鼴鼠，把窗前的窗簾拉下，即使白天也點著電燈，埋頭寫著先前那篇小說。",
        },
      ],
      choices: null,
      next: "ch5_taine",
      effects: { nerve: { amount: 2, reason: "窗簾內的固定節奏" } },
      flags: [],
      notebook: { key: "ch05.mole_curtain", symbol: "gear", desc: "拉下窗簾、白天也點著燈——我像鼴鼠一樣活著" },
      links: { visit: "ch05.hotel_room", unlock: "ch05.mole_curtain" },
    },

    ch5_taine: {
      id: "ch5_taine",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "それから仕事に疲れると、テエヌの英吉利文学史をひろげ、詩人たちの生涯に目を通した。",
          cn: "寫累了，就翻開泰納的英國文學史，瀏覽詩人們的生平。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "彼等はいずれも不幸だった。",
          cn: "他們無一不是不幸的。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "エリザベス朝の巨人たちさえ、――一代の学者だったベン・ジョンソンさえ彼の足の親指の上に羅馬とカルセエジとの軍勢の戦いを始めるのを眺めたほど神経的疲労に陥っていた。",
          cn: "就連伊莉莎白時代的巨人們——就連當代大學者本・強森，也曾陷入神經疲勞，到了會盯著自己的腳拇趾、看見羅馬與迦太基兩軍交戰的地步。",
        },
      ],
      choices: [
        {
          text: "品味這份殘酷的歡喜。",
          next: "ch5_cruel_joy",
          flag: "ch05.savored",
          effects: { insight: { amount: 1, reason: "殘酷的歡喜" } },
          notebook: null,
          unlock: null,
        },
        {
          text: "合上文學史。",
          next: "ch5_hermit_visit",
          flag: "ch05.closed_taine",
          effects: null,
          notebook: null,
          unlock: null,
        },
      ],
      next: null,
      effects: null,
      flags: ["ch05.savored", "ch05.closed_taine"],
      notebook: null,
      links: null,
    },

    ch5_cruel_joy: {
      id: "ch5_cruel_joy",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "僕はこう云う彼等の不幸に残酷な悪意に充ち満ちた歓びを感じずにはいられなかった。",
          cn: "我對他們這樣的不幸，忍不住感到一種充滿殘酷惡意的歡喜。",
        },
      ],
      choices: null,
      next: "ch5_hermit_visit",
      effects: null,
      flags: [],
      notebook: null,
      links: null,
    },

    // ═══════════════ 屋根裏 · 聖書会社 ═══════════════

    ch5_hermit_visit: {
      id: "ch5_hermit_visit",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "或東かぜの強い夜、（それは僕には善い徴だった）僕は地下室を抜けて往来へ出、或老人を尋ねることにした。",
          cn: "某個東風強勁的夜裡（那對我來說是個好兆頭），我穿過地下室走上大街，決定去拜訪一位老人。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "彼は或聖書会社の屋根裏にたった一人小使いをしながら、祈祷や読書に精進していた。",
          cn: "他獨自一人在某間聖經公司的閣樓裡當雜役，一心精進於祈禱與讀書。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "僕等は火鉢に手をかざしながら、壁にかけた十字架の下にいろいろのことを話し合った。",
          cn: "我們一面向著火盆烤手，一面在牆上掛著的十字架下，談了種種事情。",
        },
      ],
      choices: null,
      next: "ch5_hermit_questions",
      effects: null,
      flags: [],
      notebook: null,
      links: { visit: "ch05.attic", fold: "── カアテンの内 ──" },
    },

    ch5_hermit_questions: {
      id: "ch5_hermit_questions",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "なぜ僕の母は発狂したか？　なぜ僕の父の事業は失敗したか？　なぜ又僕は罰せられたか？――それ等の秘密を知っている彼は妙に厳かな微笑を浮かべ、いつまでも僕の相手をした。",
          cn: "為什麼我的母親會發瘋？為什麼我父親的事業會失敗？為什麼我又會受到懲罰？——彷彿知曉這些秘密似的，他浮現出一種奇異而莊重的微笑，始終陪著我說話。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "のみならず時々短い言葉に人生のカリカテュアを描いたりした。",
          cn: "不僅如此，他時常用寥寥數語，描繪出人生的漫畫像。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "僕はこの屋根裏の隠者を尊敬しない訣には行かなかった。",
          cn: "我不能不尊敬這位閣樓上的隱者。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "しかし彼と話しているうちに彼もまた親和力の為に動かされていることを発見した。――",
          cn: "可與他談著談著，我發現他也同樣被親和力所驅動著。——",
        },
      ],
      choices: null,
      next: "ch5_gardener_girl",
      effects: null,
      flags: [],
      notebook: { key: "ch05.hermit", symbol: "book", desc: "聖書會社閣樓的隱者——知道我為何受罰的人。但他也被親和力驅動著" },
      links: null,
    },

    ch5_gardener_girl: {
      id: "ch5_gardener_girl",
      text: [
        {
          type: "dialogue",
          origin: "source",
          speaker: "老人",
          speakerId: "hermit",
          jp: "「その植木屋の娘と云うのは器量も善いし、気立も善いし、――それはわたしに優しくしてくれるのです」",
          cn: "「那個花匠的女兒，長得好，性子也好，——她待我很溫柔的。」",
        },
        {
          type: "dialogue",
          origin: "source",
          speaker: "我",
          speakerId: "protagonist",
          jp: "「いくつ？」",
          cn: "「幾歲？」",
        },
        {
          type: "dialogue",
          origin: "source",
          speaker: "老人",
          speakerId: "hermit",
          jp: "「ことしで十八です」",
          cn: "「今年十八了。」",
        },
      ],
      choices: null,
      next: "ch5_unicorn",
      effects: null,
      flags: [],
      notebook: null,
      links: null,
    },

    ch5_unicorn: {
      id: "ch5_unicorn",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "それは彼には父らしい愛であるかも知れなかった。",
          cn: "那對他來說，或許是一種近乎父親的愛。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "しかし僕は彼の目の中に情熱を感じずにはいられなかった。",
          cn: "可我卻不能不在他的眼裡感覺到一種情熱。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "のみならず彼の勧めた林檎はいつか黄ばんだ皮の上へ一角獣の姿を現していた。",
          cn: "不僅如此，他遞給我的那顆蘋果，泛黃的皮上，不知何時竟浮現出了一角獸的模樣。",
        },
      ],
      choices: [
        {
          text: "細看那顆蘋果的紋路。",
          next: "ch5_apple_look",
          flag: "ch05.saw_unicorn",
          effects: { insight: { amount: 1, reason: "麒麟兒的記憶" } },
          notebook: { key: "ch05.unicorn", symbol: "book", desc: "蘋果泛黃的皮上現出一角獸——麒麟。批評家叫過我『九百十年代的麒麟兒』" },
          unlock: "ch05.unicorn",
        },
        {
          text: "把蘋果放下。",
          next: "ch5_faith_talk",
          flag: "ch05.put_down",
          effects: null,
          notebook: null,
          unlock: null,
        },
      ],
      next: null,
      effects: null,
      flags: ["ch05.saw_unicorn", "ch05.put_down"],
      notebook: null,
      links: null,
    },

    ch5_apple_look: {
      id: "ch5_apple_look",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "（僕は木目や珈琲茶碗の亀裂に度たび神話的動物を発見していた）",
          cn: "（我時常在木紋或咖啡杯的裂紋裡，發現神話裡的動物。）",
        },
        {
          type: "narration",
          origin: "source",
          jp: "一角獣は麒麟に違いなかった。",
          cn: "那一角獸無疑就是麒麟。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "僕は或敵意のある批評家の僕を「九百十年代の麒麟児」と呼んだのを思い出し、この十字架のかかった屋根裏も安全地帯ではないことを感じた。",
          cn: "我想起某位懷有敵意的評論家曾叫我「九百一十年代的麒麟兒」，於是感覺到，就連這掛著十字架的閣樓，也不是安全地帶。",
        },
      ],
      choices: null,
      next: "ch5_faith_talk",
      effects: null,
      flags: [],
      notebook: null,
      links: null,
    },

    ch5_faith_talk: {
      id: "ch5_faith_talk",
      text: [
        {
          type: "dialogue",
          origin: "source",
          speaker: "老人",
          speakerId: "hermit",
          jp: "「如何ですか、この頃は？」",
          cn: "「近來如何？」",
        },
        {
          type: "dialogue",
          origin: "source",
          speaker: "我",
          speakerId: "protagonist",
          jp: "「不相変神経ばかり苛々してね」",
          cn: "「老樣子，神經總是煩躁得很。」",
        },
        {
          type: "dialogue",
          origin: "source",
          speaker: "老人",
          speakerId: "hermit",
          jp: "「それは薬でも駄目ですよ。信者になる気はありませんか？」",
          cn: "「那光靠藥是不行的。有沒有想過當個信徒？」",
        },
        {
          type: "dialogue",
          origin: "source",
          speaker: "我",
          speakerId: "protagonist",
          jp: "「若し僕でもなれるものなら……」",
          cn: "「要是我也能成為信徒的話……」",
        },
        {
          type: "dialogue",
          origin: "source",
          speaker: "老人",
          speakerId: "hermit",
          jp: "「何もむずかしいことはないのです。唯神を信じ、神の子の基督を信じ、基督の行った奇蹟を信じさえすれば……」",
          cn: "「沒有什麼難的。只要相信神，相信神之子基督，相信基督所行的奇蹟就好……」",
        },
      ],
      choices: null,
      next: "ch5_devil_talk",
      effects: null,
      flags: [],
      notebook: null,
      links: null,
    },

    ch5_devil_talk: {
      id: "ch5_devil_talk",
      text: [
        {
          type: "dialogue",
          origin: "source",
          speaker: "我",
          speakerId: "protagonist",
          jp: "「悪魔を信じることは出来ますがね。……」",
          cn: "「惡魔，我倒是能相信的。……」",
        },
        {
          type: "dialogue",
          origin: "source",
          speaker: "老人",
          speakerId: "hermit",
          jp: "「ではなぜ神を信じないのです？　若し影を信じるならば、光も信じずにはいられないでしょう？」",
          cn: "「那為什麼不相信神呢？若是相信影子，也不能不相信光吧？」",
        },
        {
          type: "dialogue",
          origin: "source",
          speaker: "我",
          speakerId: "protagonist",
          jp: "「しかし光のない暗もあるでしょう」",
          cn: "「可也有沒有光的暗吧。」",
        },
        {
          type: "dialogue",
          origin: "source",
          speaker: "老人",
          speakerId: "hermit",
          jp: "「光のない暗とは？」",
          cn: "「沒有光的暗，是什麼意思？」",
        },
        {
          type: "narration",
          origin: "source",
          jp: "僕は黙るより外はなかった。",
          cn: "我只能沉默。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "彼もまた僕のように暗の中を歩いていた。が、暗のある以上は光もあると信じていた。",
          cn: "他也和我一樣，走在暗中。只是他相信，既有暗，就必有光。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "僕等の論理の異るのは唯こう云う一点だけだった。",
          cn: "我們的邏輯，分歧的地方就只在這一點。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "しかしそれは少くとも僕には越えられない溝に違いなかった。……",
          cn: "可那對我來說，至少無疑是一道跨不過去的溝。……",
        },
      ],
      choices: null,
      next: "ch5_miracles",
      effects: { insight: { amount: 1, reason: "跨不過去的溝" } },
      flags: [],
      notebook: { key: "ch05.dark_no_light", symbol: "raincoat", desc: "『沒有光的暗也是存在的吧』——他答不上來，我也沉默了。跨不過去的溝" },
      links: null,
    },

    ch5_miracles: {
      id: "ch5_miracles",
      text: [
        {
          type: "dialogue",
          origin: "source",
          speaker: "老人",
          speakerId: "hermit",
          jp: "「けれども光は必ずあるのです。その証拠には奇蹟があるのですから。……奇蹟などと云うものは今でも度たび起っているのですよ」",
          cn: "「可是光一定是存在的。證據就是奇蹟。……奇蹟這種東西，即使在今天，也還是屢屢發生的呢。」",
        },
        {
          type: "dialogue",
          origin: "source",
          speaker: "我",
          speakerId: "protagonist",
          jp: "「それは悪魔の行う奇蹟は。……」",
          cn: "「那也算是——惡魔所行的奇蹟嗎。……」",
        },
        {
          type: "dialogue",
          origin: "source",
          speaker: "老人",
          speakerId: "hermit",
          jp: "「どうして又悪魔などと云うのです？」",
          cn: "「你怎麼又提起惡魔來了？」",
        },
        {
          type: "narration",
          origin: "source",
          jp: "僕はこの一二年の間、僕自身の経験したことを彼に話したい誘惑を感じた。",
          cn: "我感到一股誘惑，想把這一兩年間自己所經歷的事告訴他。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "が、彼から妻子に伝わり、僕もまた母のように精神病院にはいることを恐れない訣にも行かなかった。",
          cn: "可我又不能不擔心，這件事會經他傳到我妻兒耳裡，讓我也像母親那樣被送進精神病院。",
        },
      ],
      choices: null,
      next: "ch5_dostoevsky",
      effects: null,
      flags: [],
      notebook: null,
      links: null,
    },

    ch5_dostoevsky: {
      id: "ch5_dostoevsky",
      text: [
        {
          type: "dialogue",
          origin: "source",
          speaker: "我",
          speakerId: "protagonist",
          jp: "「あすこにあるのは？」",
          cn: "「那邊擺著的是什麼？」",
        },
        {
          type: "narration",
          origin: "source",
          jp: "この逞しい老人は古い書棚をふり返り、何か牧羊神らしい表情を示した。",
          cn: "這位健壯的老人回頭望向舊書架，露出了一種近乎牧羊神的表情。",
        },
        {
          type: "dialogue",
          origin: "source",
          speaker: "老人",
          speakerId: "hermit",
          jp: "「ドストエフスキイ全集です。『罪と罰』はお読みですか？」",
          cn: "「是杜斯妥也夫斯基全集。《罪與罰》您讀過嗎？」",
        },
        {
          type: "narration",
          origin: "source",
          jp: "僕は勿論十年前にも四五冊のドストエフスキイに親しんでいた。",
          cn: "十年前，我當然也讀過四五冊杜斯妥也夫斯基，並不陌生。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "が、偶然（？）彼の言った『罪と罰』と云う言葉に感動し、この本を貸して貰った上、前のホテルへ帰ることにした。",
          cn: "可我卻被他偶然（？）說出的『罪與罰』這個詞打動了，向他借了這本書，決定回到先前那間旅館去。",
        },
      ],
      choices: null,
      next: "ch5_dark_streets",
      effects: null,
      flags: [],
      notebook: { key: "ch05.crime_punish", symbol: "book", desc: "隱者借我的《罪與罰》——偶然（？）這個詞打動了我" },
      links: null,
    },

    ch5_dark_streets: {
      id: "ch5_dark_streets",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "電燈の光に輝いた、人通りの多い往来はやはり僕には不快だった。",
          cn: "在電燈光下閃著光、人來人往的大街，果然還是讓我不快。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "殊に知り人に遇うことは到底堪えられないのに違いなかった。",
          cn: "尤其是遇見熟人這件事，無論如何都是我難以忍受的。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "僕は努めて暗い往来を選び、盗人のように歩いて行った。",
          cn: "我盡量挑著暗處走，像個賊一樣，一路走了下去。",
        },
      ],
      choices: null,
      next: "ch5_bar_retreat",
      effects: null,
      flags: [],
      notebook: null,
      links: { visit: "ch05.bar_street", fold: "── 屋根裏の隠者 ──" },
    },

    // ═══════════════ 夜の往来 · 赤光 ═══════════════

    ch5_bar_retreat: {
      id: "ch5_bar_retreat",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "しかし僕は暫らくの後、いつか胃の痛みを感じ出した。",
          cn: "可走了一會兒，我不知不覺，開始感到胃痛起來。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "この痛みを止めるものは一杯のウイスキイのあるだけだった。",
          cn: "能止住這疼痛的，就只有一杯威士忌了。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "僕は或バアを見つけ、その戸を押してはいろうとした。",
          cn: "我找到了一間酒吧，正想推門進去。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "けれども狭いバアの中には煙草の煙の立ちこめた中に芸術家らしい青年たちが何人も群がって酒を飲んでいた。",
          cn: "可那狹小的酒吧裡，煙霧繚繞之中，聚著幾個像是藝術家的青年，正群聚喝著酒。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "のみならず彼等のまん中には耳隠しに結った女が一人熱心にマンドリンを弾きつづけていた。",
          cn: "不僅如此，他們正中間，還有一個梳著耳隱髮式的女人，正熱衷地彈著曼陀林。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "僕は忽ち当惑を感じ、戸の中へはいらずに引き返した。",
          cn: "我頓時感到一陣為難，沒有進門，轉身退了回來。",
        },
      ],
      choices: null,
      next: "ch5_red_lantern",
      effects: null,
      flags: [],
      notebook: null,
      links: null,
    },

    ch5_red_lantern: {
      id: "ch5_red_lantern",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "するといつか僕の影の左右に揺れているのを発見した。",
          cn: "這時我發現，不知何時起，自己的影子正左右搖晃著。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "しかも僕を照らしているのは無気味にも赤い光だった。",
          cn: "而照著我的，竟是一種令人不祥的赤紅光。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "僕は往来に立ちどまった。",
          cn: "我在大街上停下了腳步。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "けれども僕の影は前のように絶えず左右に動いていた。",
          cn: "可我的影子仍舊像先前一樣，不停地左右晃動著。",
        },
      ],
      choices: [
        {
          text: "回頭，找出光的來源。",
          next: "ch5_lantern_stare",
          flag: "ch05.turned",
          effects: null,
          notebook: { key: "ch05.red_lantern", symbol: "fire", desc: "照著我的影子左右搖晃的，是不祥的赤紅的光——酒吧簷下的彩色玻璃燈籠" },
          unlock: "ch05.red_lantern",
        },
        {
          text: "不要回頭，往前走。",
          next: "ch5_basement",
          flag: "ch05.no_turn",
          effects: null,
          notebook: null,
          unlock: null,
        },
      ],
      next: null,
      effects: { nerve: { amount: -1, reason: "不祥的赤光" } },
      flags: ["ch05.turned", "ch05.no_turn"],
      notebook: null,
      links: null,
    },

    ch5_lantern_stare: {
      id: "ch5_lantern_stare",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "僕は怯ず怯ずふり返り、やっとこのバアの軒に吊った色硝子のランタアンを発見した。",
          cn: "我戰戰兢兢地回過頭去，這才發現，是那間酒吧簷下掛著的一盞彩色玻璃燈籠。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "ランタアンは烈しい風の為に徐ろに空中に動いていた。……",
          cn: "那燈籠正被烈風吹著，緩緩地在半空中晃動。……",
        },
      ],
      choices: null,
      next: "ch5_basement",
      effects: null,
      flags: [],
      notebook: null,
      links: null,
    },

    ch5_basement: {
      id: "ch5_basement",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "僕の次にはいったのは或地下室のレストオランだった。僕はそこのバアの前に立ち、ウイスキイを一杯註文した。",
          cn: "我接著走進的，是一間地下室的餐館。我站到那裡的吧台前，點了一杯威士忌。",
        },
        {
          type: "dialogue",
          origin: "source",
          speaker: "侍者",
          speakerId: "barman",
          jp: "「ウイスキイを？　Black and White ばかりでございますが、……」",
          cn: "「威士忌嗎？我們只有 Black and White 這一種……」",
        },
        {
          type: "narration",
          origin: "source",
          jp: "僕は曹達水の中にウイスキイを入れ、黙って一口ずつ飲みはじめた。",
          cn: "我把威士忌倒進蘇打水裡，默默地一口一口喝了起來。",
        },
      ],
      choices: null,
      next: "ch5_journalists",
      effects: null,
      flags: [],
      notebook: { key: "ch05.bw_whiskey", symbol: "book", desc: "地下室的酒吧只有一種威士忌——Black and White" },
      links: { visit: "ch05.basement" },
    },

    ch5_journalists: {
      id: "ch5_journalists",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "僕の鄰には新聞記者らしい三十前後の男が二人何か小声に話していた。",
          cn: "在我旁邊，兩個像是新聞記者、三十歲上下的男人，正壓低聲音說著什麼。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "のみならず仏蘭西語を使っていた。",
          cn: "不僅如此，他們說的還是法語。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "僕は彼等に背中を向けたまま、全身に彼等の視線を感じた。",
          cn: "我背對著他們，全身卻感覺到他們的視線。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "それは実際電波のように僕の体にこたえるものだった。",
          cn: "那視線簡直像電波一樣，穿透了我的身體。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "彼等は確かに僕の名を知り、僕の噂をしているらしかった。",
          cn: "他們似乎確實知道我的名字，正在議論著我的傳聞。",
        },
      ],
      choices: [
        {
          text: "豎起耳朵。",
          next: "ch5_listen",
          flag: "ch05.listened",
          effects: { insight: { amount: 1, reason: "背後的法語" } },
          notebook: { key: "ch05.french_whisper", symbol: "gear", desc: "背後的法語像電波竄過全身——他們在議論我" },
          unlock: null,
        },
        {
          text: "別過頭去。",
          next: "ch5_french",
          flag: "ch05.tried_ignore",
          effects: null,
          notebook: null,
          unlock: null,
        },
      ],
      next: null,
      effects: null,
      flags: ["ch05.listened", "ch05.tried_ignore"],
      notebook: null,
      links: null,
    },

    ch5_listen: {
      id: "ch5_listen",
      text: [
        {
          type: "inner",
          origin: "added",
          content: "不想聽。但每一個音節都自己鑽進耳朵裡。",
        },
      ],
      choices: null,
      next: "ch5_french",
      effects: null,
      flags: [],
      notebook: null,
      links: null,
    },

    ch5_french: {
      id: "ch5_french",
      text: [
        {
          type: "dialogue",
          origin: "source",
          speaker: "記者",
          speakerId: "journalist_a",
          jp: "「Bien……très mauvais……pourquoi ?……」",
          cn: "「好……很糟……為什麼？……」",
        },
        {
          type: "dialogue",
          origin: "source",
          speaker: "記者",
          speakerId: "journalist_b",
          jp: "「Pourquoi ?……le diable est mort !……」",
          cn: "「為什麼？……惡魔已經死了！……」",
        },
        {
          type: "dialogue",
          origin: "source",
          speaker: "記者",
          speakerId: "journalist_a",
          jp: "「Oui, oui……d'enfer……」",
          cn: "「對，對……地獄的……」",
        },
      ],
      choices: null,
      next: "ch5_raskolnikov",
      effects: null,
      flags: [],
      notebook: null,
      links: null,
    },

    ch5_raskolnikov: {
      id: "ch5_raskolnikov",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "僕は銀貨を一枚投げ出し、（それは僕の持っている最後の一枚の銀貨だった）この地下室の外へのがれることにした。",
          cn: "我丟下一枚銀幣（那是我身上僅剩的最後一枚銀幣），決定逃出這間地下室。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "夜風の吹き渡る往来は多少胃の痛みの薄らいだ僕の神経を丈夫にした。",
          cn: "夜風吹拂的大街，讓我那胃痛稍稍緩解的神經，重新變得堅強了些。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "僕はラスコルニコフを思い出し、何ごとも懺悔したい欲望を感じた。",
          cn: "我想起了拉斯柯尼科夫，感到一股想向什麼懺悔的慾望。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "が、それは僕自身の外にも、――いや、僕の家族の外にも悲劇を生じるのに違いなかった。",
          cn: "可那無疑會招致悲劇——不僅是我自身，也會波及我的家人。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "のみならずこの欲望さえ真実かどうかは疑わしかった。",
          cn: "不僅如此，就連這慾望本身是否真實，也令人懷疑。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "若し僕の神経さえ常人のように丈夫になれば、――けれども僕はその為にはどこかへ行かなければならなかった。",
          cn: "要是我的神經也能像常人一樣堅強起來就好了，——可為此，我勢必得去某個地方才行。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "マドリッドへ、リオへ、サマルカンドへ、……",
          cn: "去馬德里，去里約，去撒馬爾罕，……",
        },
      ],
      choices: null,
      next: "ch5_icarus",
      effects: null,
      flags: [],
      notebook: null,
      links: null,
    },

    ch5_icarus: {
      id: "ch5_icarus",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "そのうちに或店の軒に吊った、白い小型の看板は突然僕を不安にした。",
          cn: "就在這時，某家店簷下掛著的一塊白色小招牌，忽然讓我不安了起來。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "それは自動車のタイアアに翼のある商標を描いたものだった。",
          cn: "那是汽車輪胎的商標，畫著一對翅膀。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "僕はこの商標に人工の翼を手よりにした古代の希臘人を思い出した。",
          cn: "這商標讓我想起了那位倚仗人工翼翼的古希臘人。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "彼は空中に舞い上った揚句、太陽の光に翼を焼かれ、とうとう海中に溺死していた。",
          cn: "他騰空飛起之後，翅膀被太陽的光燒毀，終究溺死在了海中。",
        },
      ],
      choices: [
        {
          text: "想起被復仇之神追趕的俄瑞斯忒斯。",
          next: "ch5_orestes",
          flag: "ch05.orestes",
          effects: { insight: { amount: 1, reason: "被追趕的俄瑞斯忒斯" } },
          notebook: null,
          unlock: null,
        },
        {
          text: "移開視線。",
          next: "ch5_canal",
          flag: "ch05.eyes_away",
          effects: null,
          notebook: null,
          unlock: null,
        },
      ],
      next: null,
      effects: null,
      flags: ["ch05.orestes", "ch05.eyes_away"],
      notebook: { key: "ch05.icarus", symbol: "wing", desc: "輪胎商標上的人工翼——騰空的希臘人被太陽燒掉翅膀，溺死在海裡" },
      links: null,
    },

    ch5_orestes: {
      id: "ch5_orestes",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "マドリッドへ、リオへ、サマルカンドへ、――僕はこう云う僕の夢を嘲笑わない訣には行かなかった。",
          cn: "去馬德里，去里約，去撒馬爾罕，——我不能不嘲笑自己這樣的夢。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "同時に又復讐の神に追われたオレステスを考えない訣にも行かなかった。",
          cn: "同時，我也不能不想起那位被復仇女神追趕的俄瑞斯忒斯。",
        },
      ],
      choices: null,
      next: "ch5_canal",
      effects: null,
      flags: [],
      notebook: null,
      links: null,
    },

    ch5_canal: {
      id: "ch5_canal",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "僕は運河に沿いながら、暗い往来を歩いて行った。",
          cn: "我沿著運河，走在陰暗的街道上。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "そのうちに或郊外にある養父母の家を思い出した。",
          cn: "走著走著，我想起了郊外那座養父母的家。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "養父母は勿論僕の帰るのを待ち暮らしているのに違いなかった。",
          cn: "養父母無疑一直盼著我回去。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "恐らくは僕の子供たちも、――しかし僕はそこへ帰ると、おのずから僕を束縛してしまう或力を恐れずにはいられなかった。",
          cn: "或許連我的孩子們也是——可我一想到回去那裡，就不能不畏懼那股會自然而然束縛住我的力量。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "運河は波立った水の上に達磨船を一艘横づけにしていた。",
          cn: "運河那泛著波紋的水面上，橫泊著一艘達磨船。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "その又達磨船は船の底から薄い光を洩らしていた。",
          cn: "那艘達磨船，船底透出一絲微弱的光。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "そこにも何人かの男女の家族は生活しているのに違いなかった。",
          cn: "那裡頭無疑也住著幾口人家。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "やはり愛し合う為に憎み合いながら。……",
          cn: "同樣是為了相愛，才互相憎恨著吧。……",
        },
        {
          type: "narration",
          origin: "source",
          jp: "が、僕はもう一度戦闘的精神を呼び起し、ウイスキイの酔いを感じたまま、前のホテルへ帰ることにした。",
          cn: "可我又一次喚起了戰鬥的精神，帶著威士忌的醉意，決定回到先前那間旅館去。",
        },
      ],
      choices: null,
      next: "ch5_merimee_mask",
      effects: null,
      flags: [],
      notebook: { key: "ch05.darma_boat", symbol: "fire", desc: "達磨船底透出的薄光——那裡也有一家人生活著。為了相愛而互相憎恨" },
      links: { visit: "ch05.canal", fold: "── 赤光 · Black and White ──" },
    },

    // ═══════════════ ホテル・赤いワン・ピイス ═══════════════

    ch5_merimee_mask: {
      id: "ch5_merimee_mask",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "僕は又机に向い、「メリメエの書簡集」を読みつづけた。",
          cn: "我又面對書桌，繼續讀起《梅里美書簡集》。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "それは又いつの間にか僕に生活力を与えていた。",
          cn: "不知不覺，它又給了我活下去的力氣。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "しかし僕は晩年のメリメエの新教徒になっていたことを知ると、俄かに仮面のかげにあるメリメエの顔を感じ出した。",
          cn: "可當我得知梅里美晚年成了新教徒，忽然感覺到了那張藏在面具背後的臉。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "彼もまたやはり僕等のように暗の中を歩いている一人だった。",
          cn: "他也和我們一樣，是走在暗中的一人。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "暗の中を？――「暗夜行路」はこう云う僕には恐しい本に変りはじめた。",
          cn: "走在暗中？——《暗夜行路》這本書，就這樣在我眼裡，漸漸變成了一本可怕的書。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "僕は憂鬱を忘れる為に「アナトオル・フランスの対話集」を読みはじめた。",
          cn: "為了忘卻憂鬱，我讀起了《法朗士對話集》。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "が、この近代の牧羊神もやはり十字架を荷っていた。……",
          cn: "可就連這位近代的牧羊神，也同樣背負著十字架。……",
        },
      ],
      choices: null,
      next: "ch5_mail",
      effects: { insight: { amount: 1, reason: "面具背後的臉" } },
      flags: [],
      notebook: { key: "ch05.merimee_mask", symbol: "book", desc: "梅里美晚年成了新教徒——面具背後的臉。他也走在暗中" },
      links: { visit: "ch05.hotel_room" },
    },

    ch5_mail: {
      id: "ch5_mail",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "一時間ばかりたった後、給仕は僕に一束の郵便物を渡しに顔を出した。",
          cn: "約莫一小時後，服務生探頭進來，遞給我一疊郵件。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "それ等の一つはライプツィッヒの本屋から僕に「近代の日本の女」と云う小論文を書けと云うものだった。",
          cn: "其中一封，是萊比錫的一家書店，要我寫一篇題為〈近代的日本女性〉的小論文。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "なぜ彼等は特に僕にこう云う小論文を書かせるのであろう？",
          cn: "他們為什麼偏偏要我寫這樣的一篇小論文呢？",
        },
        {
          type: "narration",
          origin: "source",
          jp: "のみならずこの英語の手紙は「我々は丁度日本画のように黒と白の外に色彩のない女の肖像画でも満足である」と云う肉筆のＰ・Ｓを加えていた。",
          cn: "不僅如此，這封英文信末，還親筆加了一句附言：『就算是像日本畫那樣，除了黑白以外別無色彩的女性肖像畫，我們也心滿意足。』",
        },
        {
          type: "narration",
          origin: "source",
          jp: "僕はこう云う一行に Black and White と云うウイスキイの名を思い出し、ずたずたにこの手紙を破ってしまった。",
          cn: "這一行字讓我想起了 Black and White 這種威士忌的名字，我把這封信撕得粉碎。",
        },
      ],
      choices: null,
      next: "ch5_mail2",
      effects: null,
      flags: [],
      notebook: { key: "ch05.bw_letter", symbol: "book", desc: "萊比錫的信附了一句手寫 P.S.——『黑與白』。跟那瓶威士忌同名" },
      links: null,
    },

    ch5_mail2: {
      id: "ch5_mail2",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "それから今度は手当り次第に一つの手紙の封を切り、黄いろい書簡箋に目を通した。",
          cn: "接著，我隨手拆開另一封信，瀏覽起那泛黃的信箋。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "この手紙を書いたのは僕の知らない青年だった。",
          cn: "寫這封信的，是一位我不認識的青年。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "しかし二三行も読まないうちに「あなたの『地獄変』は……」と云う言葉は僕を苛立たせずには措かなかった。",
          cn: "可還沒讀上兩三行，『您的《地獄變》……』這句話，就已經讓我焦躁不已。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "三番目に封を切った手紙は僕の甥から来たものだった。",
          cn: "第三封拆開的信，是我外甥寄來的。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "僕はやっと一息つき、家事上の問題などを読んで行った。",
          cn: "我這才鬆了口氣，讀起裡頭家務上的種種瑣事。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "けれどもそれさえ最後へ来ると、いきなり僕を打ちのめした。",
          cn: "可就連這封信，讀到最後，也猛然把我擊倒了。",
        },
      ],
      choices: null,
      next: "ch5_shakko",
      effects: null,
      flags: [],
      notebook: null,
      links: null,
    },

    ch5_shakko: {
      id: "ch5_shakko",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "「歌集『赤光』の再版を送りますから……」",
          cn: "「歌集《赤光》再版了，我會寄給您的……」",
        },
        {
          type: "narration",
          origin: "source",
          jp: "赤光！　僕は何ものかの冷笑を感じ、僕の部屋の外へ避難することにした。",
          cn: "赤光！我感覺到某種東西的冷笑，決定逃出我的房間。",
        },
      ],
      choices: null,
      next: "ch5_lobby_airship",
      effects: { nerve: { amount: -1, reason: "赤光——連信裡都是" } },
      flags: [],
      notebook: { key: "ch05.shakko_letter", symbol: "fire", desc: "外甥的信在最後打倒了我——『《赤光》歌集再版，寄給您』" },
      links: { unlock: "ch05.shakko_letter" },
    },

    ch5_lobby_airship: {
      id: "ch5_lobby_airship",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "廊下には誰も人かげはなかった。",
          cn: "走廊上，一個人影也沒有。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "僕は片手に壁を抑え、やっとロッビイへ歩いて行った。",
          cn: "我一手扶著牆，好不容易走到了大廳。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "それから椅子に腰をおろし、とにかく巻煙草に火を移すことにした。",
          cn: "然後在椅子上坐下，總之先點起了一支菸。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "巻煙草はなぜかエエア・シップだった。",
          cn: "不知為何，那支菸是 Airship 牌的。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "（僕はこのホテルへ落ち着いてから、いつもスタアばかり吸うことにしていた）",
          cn: "（自從我在這間旅館落腳以來，一向只抽 Star 牌的。）",
        },
        {
          type: "narration",
          origin: "source",
          jp: "人工の翼はもう一度僕の目の前へ浮かび出した。",
          cn: "人工的翼，再一次浮現在了我眼前。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "僕は向うにいる給仕を呼び、スタアを二箱貰うことにした。",
          cn: "我叫來對面的服務生，想要兩包 Star。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "しかし給仕を信用すれば、スタアだけは生憎品切れだった。",
          cn: "可要是相信服務生的話，偏偏就只有 Star 缺貨。",
        },
        {
          type: "dialogue",
          origin: "source",
          speaker: "給仕",
          speakerId: "hotel_waiter",
          jp: "「エエア・シップならばございますが、……」",
          cn: "「Airship 的話倒是有……」",
        },
      ],
      choices: null,
      next: "ch5_red_dress",
      effects: null,
      flags: [],
      notebook: { key: "ch05.airship", symbol: "wing", desc: "手上的菸不知何時成了 Airship——人工的翼又一次浮現眼前。Star 偏偏缺貨" },
      links: null,
    },

    ch5_red_dress: {
      id: "ch5_red_dress",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "僕は頭を振ったまま、広いロッビイを眺めまわした。",
          cn: "我搖著頭，環視了一圈這寬敞的大廳。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "僕の向うには外国人が四五人テエブルを囲んで話していた。",
          cn: "對面，四五個外國人正圍著一張桌子交談著。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "しかも彼等の中の一人、――赤いワン・ピイスを着た女は小声に彼等と話しながら、時々僕を見ているらしかった。",
          cn: "而且他們之中的一個——一個穿著紅色連身裙的女人，一面壓低聲音跟他們說話，一面似乎不時瞥向我這邊。",
        },
      ],
      choices: null,
      next: "ch5_townshead",
      effects: null,
      flags: [],
      notebook: null,
      links: null,
    },

    ch5_townshead: {
      id: "ch5_townshead",
      text: [
        {
          type: "inner",
          origin: "source",
          jp: "「Mrs. Townshead……」",
          cn: "「陶恩海德夫人……」",
        },
        {
          type: "narration",
          origin: "source",
          jp: "何か僕の目に見えないものはこう僕に囁いて行った。",
          cn: "某種我肉眼看不見的東西，這樣在我耳邊低語而過。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "ミセス・タウンズヘッドなどと云う名は勿論僕の知らないものだった。",
          cn: "陶恩海德夫人這樣的名字，我當然是不認識的。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "たとい向うにいる女の名にしても、――僕は又椅子から立ち上り、発狂することを恐れながら、僕の部屋へ帰ることにした。",
          cn: "就算那真是對面那女人的名字好了，——我又一次從椅子上站起，一面害怕著自己會發瘋，一面決定回房去。",
        },
      ],
      choices: null,
      next: "ch5_karamazov",
      effects: null,
      flags: [],
      notebook: null,
      links: null,
    },

    // ═══════════════ 部屋 · 綴じ違え ═══════════════

    ch5_karamazov: {
      id: "ch5_karamazov",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "僕は僕の部屋へ帰ると、すぐに或精神病院へ電話をかけるつもりだった。",
          cn: "我一回到房間，本打算立刻打電話給某家精神病院。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "が、そこへはいることは僕には死ぬことに変らなかった。",
          cn: "可住進那種地方，對我來說，和死沒有兩樣。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "僕はさんざんためらった後、この恐怖を紛らす為に「罪と罰」を読みはじめた。",
          cn: "我猶豫再三之後，為了排遣這份恐懼，讀起了《罪與罰》。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "しかし偶然開いた頁は「カラマゾフ兄弟」の一節だった。",
          cn: "可偶然翻開的那一頁，卻是《卡拉馬助夫兄弟》裡的一節。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "僕は本を間違えたのかと思い、本の表紙へ目を落した。",
          cn: "我以為自己拿錯了書，低頭看向封面。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "「罪と罰」――本は「罪と罰」に違いなかった。",
          cn: "《罪與罰》——這本書無疑就是《罪與罰》。",
        },
      ],
      choices: [
        {
          text: "讀下去。",
          next: "ch5_ivan",
          flag: "ch05.read_on",
          effects: null,
          notebook: null,
          unlock: null,
        },
        {
          text: "闔上書。",
          next: "ch5_book_close",
          flag: "ch05.tried_close",
          effects: null,
          notebook: null,
          unlock: null,
        },
      ],
      next: null,
      effects: { nerve: { amount: -1, reason: "訂錯頁的書——命運的手指" } },
      flags: ["ch05.read_on", "ch05.tried_close"],
      notebook: { key: "ch05.karamazov", symbol: "gear", desc: "《罪與罰》裡訂進了《卡拉馬助夫兄弟》的一節——而我偏偏翻開了那一頁" },
      links: null,
    },

    ch5_book_close: {
      id: "ch5_book_close",
      text: [
        {
          type: "narration",
          origin: "added",
          content: "手不聽使喚。終究還是讀了下去。",
        },
      ],
      choices: null,
      next: "ch5_ivan",
      effects: null,
      flags: [],
      notebook: null,
      links: null,
    },

    ch5_ivan: {
      id: "ch5_ivan",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "僕はこの製本屋の綴じ違えに、――その又綴じ違えた頁を開いたことに運命の指の動いているのを感じ、やむを得ずそこを読んで行った。",
          cn: "面對這裝訂廠的裝訂錯誤——面對自己竟偏偏翻開了那裝訂錯了的一頁，我感覺到命運之指正在其中撥動，只得硬著頭皮讀了下去。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "けれども一頁も読まないうちに全身が震えるのを感じ出した。",
          cn: "可還沒讀上一頁，我便感到渾身顫抖起來。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "そこは悪魔に苦しめられるイヴァンを描いた一節だった。",
          cn: "那是描寫伊凡受惡魔折磨的一節。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "イヴァンを、ストリントベルグを、モオパスサンを、或はこの部屋にいる僕自身を。……",
          cn: "伊凡也好，史特林堡也好，莫泊桑也好，又或者，是此刻在這房間裡的我自己。……",
        },
      ],
      choices: null,
      next: "ch5_desperate_writing",
      effects: null,
      flags: [],
      notebook: null,
      links: null,
    },

    ch5_desperate_writing: {
      id: "ch5_desperate_writing",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "こう云う僕を救うものは唯眠りのあるだけだった。",
          cn: "能拯救這樣的我的，就只有睡眠了。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "しかし催眠剤はいつの間にか一包みも残らずになくなっていた。",
          cn: "可安眠藥不知不覺，已經一包不剩地用完了。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "僕は到底眠らずに苦しみつづけるのに堪えなかった。",
          cn: "我實在無法忍受不睡不休地繼續痛苦下去。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "が、絶望的な勇気を生じ、珈琲を持って来て貰った上、死にもの狂いにペンを動かすことにした。",
          cn: "可我生出了一股絕望的勇氣，叫人送來咖啡，決定拼死拼活地動起筆來。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "二枚、五枚、七枚、十枚、――原稿は見る見る出来上って行った。",
          cn: "兩張，五張，七張，十張，——稿子眼看著一張張完成了。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "僕はこの小説の世界を超自然の動物に満たしていた。",
          cn: "我把這篇小說的世界，填滿了超自然的動物。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "のみならずその動物の一匹に僕自身の肖像画を描いていた。",
          cn: "不僅如此，我還把自己的肖像，畫進了其中一隻動物裡。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "けれども疲労は徐ろに僕の頭を曇らせはじめた。",
          cn: "可疲勞漸漸開始蒙住了我的頭腦。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "僕はとうとう机の前を離れ、ベッドの上へ仰向けになった。",
          cn: "我終於離開了桌前，仰面倒在床上。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "それから四五十分間は眠ったらしかった。",
          cn: "接著，似乎睡了四五十分鐘。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "しかし又誰か僕の耳にこう云う言葉を囁いたのを感じ、忽ち目を醒まして立ち上った。",
          cn: "可我又感覺到有誰在我耳邊低語了這樣一句話，猛然驚醒，站了起來。",
        },
      ],
      choices: null,
      next: "ch5_diable",
      effects: null,
      flags: [],
      notebook: null,
      links: { fold: "── 赤いワン・ピイス · 綴じ違え ──" },
    },

    ch5_diable: {
      id: "ch5_diable",
      text: [
        {
          type: "inner",
          origin: "source",
          jp: "「Le diable est mort」",
          cn: "「惡魔已經死了」",
        },
      ],
      choices: null,
      next: "ch5_dawn_window",
      effects: null,
      flags: [],
      notebook: { key: "ch05.diable_dream", symbol: "raincoat", desc: "睡了不到一小時，有誰在耳邊低語——『惡魔已經死了』。地下室的法語又回來了" },
      links: null,
    },

    ch5_dawn_window: {
      id: "ch5_dawn_window",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "凝灰岩の窓の外はいつか冷えびえと明けかかっていた。",
          cn: "凝灰岩砌成的窗外，不知何時，已泛起一片清冷的曙色。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "僕は丁度戸の前に佇み、誰もいない部屋の中を眺めまわした。",
          cn: "我恰好佇立在門前，環視著這空無一人的房間。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "すると向うの窓硝子は斑らに外気に曇った上に小さい風景を現していた。",
          cn: "這時，對面的玻璃窗上，斑駁地蒙著一層外頭的霧氣，浮現出一幅小小的風景。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "それは黄ばんだ松林の向うに海のある風景に違いなかった。",
          cn: "那無疑是一幅風景——泛黃的松林那頭，是一片海。",
        },
      ],
      choices: [
        {
          text: "在窗前多待一會。",
          next: "ch5_window_linger",
          flag: "ch05.lingered",
          effects: { insight: { amount: 1, reason: "窗前的鄉愁" } },
          notebook: null,
          unlock: null,
        },
        {
          text: "開始收拾行李。",
          next: "ch5_ending",
          flag: "ch05.packed_fast",
          effects: null,
          notebook: null,
          unlock: null,
        },
      ],
      next: null,
      effects: null,
      flags: ["ch05.lingered", "ch05.packed_fast"],
      notebook: null,
      links: null,
    },

    ch5_window_linger: {
      id: "ch5_window_linger",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "僕は怯ず怯ず窓の前へ近づき、この風景を造っているものは実は庭の枯芝や池だったことを発見した。",
          cn: "我戰戰兢兢地走近窗前，發現造出這幅風景的，其實不過是庭院裡的枯草坪與一池水。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "けれども僕の錯覚はいつか僕の家に対する郷愁に近いものを呼び起していた。",
          cn: "可我這個錯覺，不知不覺，卻喚起了一種近乎對家的鄉愁。",
        },
      ],
      choices: null,
      next: "ch5_ending",
      effects: null,
      flags: [],
      notebook: null,
      links: null,
    },

    ch5_ending: {
      id: "ch5_ending",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "僕は九時にでもなり次第、或雑誌社へ電話をかけ、とにかく金の都合をした上、僕の家へ帰る決心をした。",
          cn: "我打定主意，一到九點，就打電話給某家雜誌社，總之先想辦法籌到錢，然後下定決心回家去。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "机の上に置いた鞄の中へ本や原稿を押しこみながら。",
          cn: "一面把書和原稿，塞進桌上那只皮箱裡。",
        },
        { type: "system", content: "第五章「赤光」 終" },
      ],
      choices: null,
      next: null,
      effects: { insight: { amount: 1, reason: "回家的決心" } },
      flags: [],
      notebook: null,
      links: { showEnd: true },
    },
  },
};
