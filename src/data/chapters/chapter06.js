// ═══════════════════════════════════════════════════════════
// 第六章「飛行機」
// Source: 芥川龍之介《歯車》六「飛行機」
// 青空文庫 https://www.aozora.gr.jp/cards/000879/files/42377_34745.html
// 底本檔案：reference/aozora/haguruma_original.txt（CH6 = B:L470–L548）
//
// 場景格式定義：docs/chapter-data-schema.md
// 施工圖（唯一來源）：docs/ch6-source-map.md（全域政策沿用 docs/ch1-source-map.md §0，
//   cn 為第一人稱「我」，見 ch1-source-map D12 定案敘述）
// 參考（⚠ 舊 docs/chapter06-spec.md「主題」段的稻荷狐狸信仰／義妹蓚酸毒殺是幻覺
//   （audit §1c-7），原文根本沒有這段內容；且「飛行機病」台詞的說話者被舊 spec
//   誤標為妻の母，正確說話者是妻の弟——本圖已取代之，chapter06-spec.md 檔頭已
//   加註作廢警語）：docs/chapter06-spec.md
//
// Batch F10：§1 骨架 + §2 全 29 場景（ch6_prologue ～ ch6_ending）逐字回填 jp（一律
//   Read 底本複製，未手打）+ 新譯 cn（一人稱「我」），含 4 選擇點（全在前半，
//   ch6_final_walk 起零選擇——命運收攏，讀者只剩「不得不做」的 forced steps）。
//   §3 connections（6 條，全部跨章：CH1／CH4／CH5×4）補上。symbols.js CH6 區、
//   chapterRegistry.js、README、DEV-LOG 同批更新。
//
// 特別處理：
// - 舊 chapter06-spec.md 捏造的「叔父的稻荷狐狸信仰」「義妹的丈夫逼她喝草酸」整段
//   內容本章完全不存在——原文該段（B:L488）是「避暑地也是世の中」（妻の実家的
//   世間話：毒殺病人的醫生、放火的老太婆、奪妹妹財產的律師），已依施工圖逐字
//   回填於 ch6_hell_houses，無稻荷、無狐狸、無草酸、無義妹。
// - 「飛行機病」對白（B:L522／L526）逐字含括號收錄於 ch6_airplane_disease，說話者
//   訂正為 speakerId: "wifes_brother"（妻の弟），非舊 spec 誤標的 wifes_mother。
// - 章尾雨衣呼應：ch6_prologue 的司機雨衣（B:L470）與 CH1 raincoat_death 跨章
//   connection「ch06.raincoat_final」首尾呼應（物語は雨衣に始まり雨衣に終る）。
// - ch6_final_walk 是本引擎「文中互動」（Batch F6 action/forced 機制）在本章的
//   唯一使用點：forced steps ["把脖子挺直。","繼續走。","不要停下。"] 插在
//   「僕は愈最後の時の近づいたことを恐れながら、頸すじをまっ直にして歩いて行った。」
//   （B:L534）之後、「歯車は数の殖えるのにつれ……」之前，對應 nerve≈0 時「按鈕
//   深度侵蝕＋齒輪覆蓋全開」的視覺崩壞。
// - ch6_ending 不給任何數值 effects（沉默的結尾）——原著在此中斷，全卷完。
// - portraits 欄位省略（沿用 CH3～CH5 慣例，尚無立繪）。
//
// §1 骨架標頭 sceneCount 標 28，但 §2 實際逐一枚舉為 29 個場景 id（含全部
// choice／分支／auto 場景，`grep -c '^### ch6_'` 實測 29）。本檔以 §2 實際枚舉為
// 準記 sceneCount: 29，已在此註記偏離（同 CH3／CH5 先例：F7-1／F9 遇到同類骨架
// 標頭與實際枚舉不一致時，以實際枚舉為準）。
// ═══════════════════════════════════════════════════════════

export const CHAPTER_06 = {
  chapter: 6,
  title: "飛行機",
  titleCn: "飛機",
  startScene: "ch6_prologue",
  startLocation: "ch06.road_home",
  sceneCount: 29,

  locations: [
    { id: "ch06.road_home", label: "帰り道", sub: "葬列", x: 50, y: 50, shape: "circle", symbolKey: "ch06.driver_raincoat" },
    { id: "ch06.home", label: "僕の家", sub: "二階", x: 120, y: 120, shape: "rect", symbolKey: "ch06.magpie_joy" },
    { id: "ch06.inlaws", label: "妻の実家", sub: "レグホン", x: 190, y: 200, shape: "rect", symbolKey: "ch06.airplane_disease" },
    { id: "ch06.dunes", label: "砂山", sub: "松林", x: 130, y: 280, shape: "mountain", symbolKey: "ch06.last_gears" },
  ],

  // docs/ch6-source-map.md §3（6 條，全部跨章：raincoat_final 依賴 CH1 grandfathered
  // key "raincoat_death"、bw_dog／wings_everywhere／strindberg_twice／mole_end 依賴
  // CH5 key、four_caws 依賴 CH4 key "ch04.la_mort"）。
  connections: [
    { id: "ch06.raincoat_final", requires: ["raincoat_death", "ch06.driver_raincoat"], title: "雨衣——最初與最後", subtitle: "物語は雨衣に始まり雨衣に終る", icon: "✶", insightGain: 2 }, // 跨章 CH1
    { id: "ch06.bw_dog", requires: ["ch05.bw_whiskey", "ch06.half_black_dog"], title: "Black and White，第三次", subtitle: "ウイスキイ、手紙、犬とタイ", icon: "◇", insightGain: 2 }, // 跨章 CH5
    { id: "ch06.wings_everywhere", requires: ["ch05.airship", "ch06.silver_wing"], title: "翼，無所不在", subtitle: "煙草、商標、網膜の裏", icon: "✦", insightGain: 2 }, // 跨章 CH5
    { id: "ch06.strindberg_twice", requires: ["ch05.karamazov", "ch06.strindberg_pass"], title: "史特林堡——書裡與街上", subtitle: "イヴァンの隣に並んだ名", icon: "◈", insightGain: 1 }, // 跨章 CH5
    { id: "ch06.four_caws", requires: ["ch04.la_mort", "ch06.gallows_crow"], title: "四聲", subtitle: "四＝し＝死。la mort、もう一度", icon: "◉", insightGain: 2 }, // 跨章 CH4
    { id: "ch06.mole_end", requires: ["ch05.mole_curtain", "ch06.dead_mole"], title: "鼴鼠之死", subtitle: "カアテンの内に生きたものの末路", icon: "◉", insightGain: 2 }, // 跨章 CH5
  ],

  scenes: {
    // ═══════════════ 帰り道 · 葬列 ═══════════════

    ch6_prologue: {
      id: "ch6_prologue",
      text: [
        { type: "system", content: "第六章　飛行機" },
        { type: "system", content: "——飛機——" },
        { type: "break" },
        {
          type: "narration",
          origin: "source",
          jp: "僕は東海道線の或停車場からその奥の或避暑地へ自動車を飛ばした。",
          cn: "我從東海道線的某個車站，驅車直奔更深處的某個避暑地。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "運転手はなぜかこの寒さに古いレエン・コオトをひっかけていた。",
          cn: "不知為何，司機在這樣的寒天裡，卻披著一件舊雨衣。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "僕はこの暗合を無気味に思い、努めて彼を見ないように窓の外へ目をやることにした。",
          cn: "這個暗合讓我覺得不祥，我盡量不去看他，把視線移向了窗外。",
        },
      ],
      choices: null,
      next: "ch6_funeral",
      effects: null,
      flags: [],
      notebook: { key: "ch06.driver_raincoat", symbol: "raincoat", desc: "大冷天，司機偏偏披著一件舊雨衣——這個暗合讓我不敢看他" },
      links: { visit: "ch06.road_home", unlock: "ch06.driver_raincoat" },
    },

    ch6_funeral: {
      id: "ch6_funeral",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "すると低い松の生えた向うに、――恐らくは古い街道に葬式が一列通るのをみつけた。",
          cn: "這時，我望見矮松叢生的那頭——大概是一條古街道上——正有一列送葬的隊伍走過。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "白張りの提灯や竜燈はその中に加わってはいないらしかった。",
          cn: "白紙糊的燈籠與龍燈似乎並不在隊伍之中。",
        },
      ],
      choices: [
        {
          text: "目送那列葬儀。",
          next: "ch6_funeral_watch",
          flag: "ch06.watched_funeral",
          effects: { insight: { amount: 1, reason: "目送送葬的隊伍" } },
          notebook: { key: "ch06.funeral", symbol: "raincoat", desc: "歸途上的葬列——金銀紙蓮花在靈輿前後靜靜搖著" },
          unlock: "ch06.funeral",
        },
        {
          text: "把視線收回車內。",
          next: "ch6_home",
          flag: "ch06.looked_inside",
          effects: null,
          notebook: null,
          unlock: null,
        },
      ],
      next: null,
      effects: null,
      flags: ["ch06.watched_funeral", "ch06.looked_inside"],
      notebook: null,
      links: null,
    },

    ch6_funeral_watch: {
      id: "ch6_funeral_watch",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "が、金銀の造花の蓮は静かに輿の前後に揺いで行った。……",
          cn: "只有金銀紙紮的蓮花，靜靜地在靈輿前後搖曳而過。……",
        },
      ],
      choices: null,
      next: "ch6_home",
      effects: null,
      flags: [],
      notebook: null,
      links: null,
    },

    ch6_home: {
      id: "ch6_home",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "やっと僕の家へ帰った後、僕は妻子や催眠薬の力により、二三日は可也平和に暮らした。",
          cn: "好不容易回到家後，靠著妻兒與安眠藥的力量，我倒也平靜地過了兩三天。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "僕の二階は松林の上にかすかに海を覗かせていた。",
          cn: "我住的二樓，越過松林的樹梢，能隱約望見一角海景。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "僕はこの二階の机に向かい、鳩の声を聞きながら、午前だけ仕事をすることにした。",
          cn: "我對著這二樓的書桌，一面聽著鴿子的叫聲，一面決定只在上午工作。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "鳥は鳩や鴉の外に雀も縁側へ舞いこんだりした。",
          cn: "鳥兒除了鴿子、烏鴉，還有麻雀，時常飛進簷廊來。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "それもまた僕には愉快だった。",
          cn: "這也讓我覺得愉快。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "「喜雀堂に入る」――僕はペンを持ったまま、その度にこんな言葉を思い出した。",
          cn: "『喜鵲入堂』——每逢此刻，我總是握著筆，想起這句話來。",
        },
      ],
      choices: null,
      next: "ch6_sepia",
      effects: { nerve: { amount: 3, reason: "妻子與催眠藥的二三日平和" } },
      flags: [],
      notebook: { key: "ch06.magpie_joy", symbol: "wing", desc: "二樓聽得見鴿聲，麻雀飛進簷廊——『喜鵲入堂』。難得的平和" },
      links: { visit: "ch06.home", fold: "── 帰り道 · 葬列 ──" },
    },

    // ═══════════════ セピア · 黒白の犬 ═══════════════

    ch6_sepia: {
      id: "ch6_sepia",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "或生暖かい曇天の午後、僕は或雑貨店へインクを買いに出かけて行った。",
          cn: "某個溫吞的陰天午後，我出門去某家雜貨店買墨水。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "するとその店に並んでいるのはセピア色のインクばかりだった。",
          cn: "可店裡陳列的，卻清一色是深褐色的墨水。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "セピア色のインクはどのインクよりも僕を不快にするのを常としていた。",
          cn: "深褐色的墨水，向來比任何顏色的墨水都更教我不快。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "僕はやむを得ずこの店を出、人通りの少ない往来をぶらぶらひとり歩いて行った。",
          cn: "我只得走出這家店，獨自一人，沿著行人稀少的大街，漫無目的地走著。",
        },
      ],
      choices: null,
      next: "ch6_strindberg",
      effects: null,
      flags: [],
      notebook: null,
      links: null,
    },

    ch6_strindberg: {
      id: "ch6_strindberg",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "そこへ向うから近眼らしい四十前後の外国人が一人肩を聳かせて通りかかった。",
          cn: "這時，一個像是近視、四十歲上下的外國人，聳著肩，從對面走了過來。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "彼はここに住んでいる被害妄想狂の瑞典人だった。",
          cn: "他是住在這裡的一個患有被害妄想症的瑞典人。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "しかも彼の名はストリントベルグだった。",
          cn: "而且，他的名字偏偏叫史特林堡。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "僕は彼とすれ違う時、肉体的に何かこたえるのを感じた。",
          cn: "與他擦身而過的瞬間，我感到某種東西實實在在地打在了身上。",
        },
      ],
      choices: null,
      next: "ch6_black_dog",
      effects: { nerve: { amount: -1, reason: "與史特林堡擦身" } },
      flags: [],
      notebook: { key: "ch06.strindberg_pass", symbol: "gear", desc: "住在此地的被害妄想狂瑞典人——他的名字偏偏叫史特林堡。擦身時全身像被打到" },
      links: null,
    },

    ch6_black_dog: {
      id: "ch6_black_dog",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "この往来は僅かに二三町だった。",
          cn: "這條街不過二三町長。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "が、その二三町を通るうちに丁度半面だけ黒い犬は四度も僕の側を通って行った。",
          cn: "可就在走過這二三町的當兒，一隻半邊全黑的狗，竟四度從我身邊經過。",
        },
      ],
      choices: [
        {
          text: "數牠經過的次數。",
          next: "ch6_dog_count",
          flag: "ch06.counted_dog",
          effects: { insight: { amount: 1, reason: "數黑狗經過的次數" } },
          notebook: { key: "ch06.half_black_dog", symbol: "gear", desc: "半邊全黑的狗，四度從我身邊經過——Black and White。史特林堡的領帶也是黑白" },
          unlock: "ch06.half_black_dog",
        },
        {
          text: "加快腳步。",
          next: "ch6_glass_bowl",
          flag: "ch06.sped_up",
          effects: null,
          notebook: null,
          unlock: null,
        },
      ],
      next: null,
      effects: null,
      flags: ["ch06.counted_dog", "ch06.sped_up"],
      notebook: null,
      links: null,
    },

    ch6_dog_count: {
      id: "ch6_dog_count",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "僕は横町を曲りながら、ブラック・アンド・ホワイトのウイスキイを思い出した。",
          cn: "我一面拐進小巷，一面想起了 Black and White 那種威士忌。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "のみならず今のストリントベルグのタイも黒と白だったのを思い出した。",
          cn: "不僅如此，我還想起方才那個史特林堡的領帶，也是黑白兩色的。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "それは僕にはどうしても偶然であるとは考えられなかった。",
          cn: "這無論如何，我都不認為只是偶然。",
        },
      ],
      choices: null,
      next: "ch6_glass_bowl",
      effects: null,
      flags: [],
      notebook: null,
      links: null,
    },

    ch6_glass_bowl: {
      id: "ch6_glass_bowl",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "若し偶然でないとすれば、――僕は頭だけ歩いているように感じ、ちょっと往来に立ち止まった。",
          cn: "要是並非偶然的話——我感覺彷彿只剩一顆頭顱在走著，不由得在街上停下了腳步。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "道ばたには針金の柵の中にかすかに虹の色を帯びた硝子の鉢が一つ捨ててあった。",
          cn: "路邊，鐵絲圍欄裡，丟著一只隱隱透出虹彩的玻璃缽。",
        },
      ],
      choices: [
        {
          text: "蹲下看那只玻璃缽。",
          next: "ch6_bowl_look",
          flag: "ch06.saw_bowl",
          effects: { insight: { amount: 1, reason: "細看玻璃缽的紋樣" } },
          notebook: { key: "ch06.glass_bowl", symbol: "wing", desc: "廢棄的玻璃缽底浮著翼的紋樣——麻雀們飛下來，一到缽邊卻像約好了似的一齊逃走" },
          unlock: "ch06.glass_bowl",
        },
        {
          text: "繞開它。",
          next: "ch6_inlaws",
          flag: "ch06.walked_around",
          effects: null,
          notebook: null,
          unlock: null,
        },
      ],
      next: null,
      effects: null,
      flags: ["ch06.saw_bowl", "ch06.walked_around"],
      notebook: null,
      links: null,
    },

    ch6_bowl_look: {
      id: "ch6_bowl_look",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "この鉢は又底のまわりに翼らしい模様を浮き上らせていた。",
          cn: "這只缽的底部周圍，還隱約浮著一圈像是翼的紋樣。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "そこへ松の梢から雀が何羽も舞い下って来た。",
          cn: "這時，幾隻麻雀從松梢飛落下來。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "が、この鉢のあたりへ来ると、どの雀も皆言い合わせたように一度に空中へ逃げのぼって行った。……",
          cn: "可一飛近這只缽，每隻麻雀都像事先約好了似的，一齊振翅逃回半空中去了。……",
        },
      ],
      choices: null,
      next: "ch6_inlaws",
      effects: null,
      flags: [],
      notebook: null,
      links: null,
    },

    ch6_inlaws: {
      id: "ch6_inlaws",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "僕は妻の実家へ行き、庭先の籐椅子に腰をおろした。",
          cn: "我到了妻子的娘家，在院子裡的藤椅上坐下。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "庭の隅の金網の中には白いレグホン種の鶏が何羽も静かに歩いていた。",
          cn: "院子角落的鐵網裡，幾隻白色的來亨雞正安靜地踱著步。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "それから又僕の足もとには黒犬も一匹横になっていた。",
          cn: "而在我腳邊，還躺著一隻黑狗。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "僕は誰にもわからない疑問を解こうとあせりながら、とにかく外見だけは冷やかに妻の母や弟と世間話をした。",
          cn: "我一面焦躁地想解開那誰也不懂的疑問，一面表面上還是故作冷靜，和岳母、內弟閒話家常。",
        },
      ],
      choices: null,
      next: "ch6_yononaka",
      effects: null,
      flags: [],
      notebook: null,
      links: { visit: "ch06.inlaws", fold: "── セピア · 黒白の犬 ──" },
    },

    // ═══════════════ 妻の実家 · 飛行機 ═══════════════

    ch6_yononaka: {
      id: "ch6_yononaka",
      text: [
        {
          type: "dialogue",
          origin: "source",
          speaker: "我",
          speakerId: "protagonist",
          jp: "「静かですね、ここへ来ると」",
          cn: "「一到這裡，就覺得安靜呢。」",
        },
        {
          type: "dialogue",
          origin: "source",
          speaker: "岳母",
          speakerId: "wifes_mother",
          jp: "「それはまだ東京よりもね」",
          cn: "「那是自然，總比東京強些。」",
        },
        {
          type: "dialogue",
          origin: "source",
          speaker: "我",
          speakerId: "protagonist",
          jp: "「ここでもうるさいことはあるのですか？」",
          cn: "「這裡也會有煩心事嗎？」",
        },
        {
          type: "dialogue",
          origin: "source",
          speaker: "岳母",
          speakerId: "wifes_mother",
          jp: "「だってここも世の中ですもの」",
          cn: "「這裡畢竟也是人世間呀。」",
        },
      ],
      choices: null,
      next: "ch6_hell_houses",
      effects: null,
      flags: [],
      notebook: null,
      links: null,
    },

    ch6_hell_houses: {
      id: "ch6_hell_houses",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "妻の母はこう言って笑っていた。",
          cn: "岳母這麼說著，笑了起來。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "実際この避暑地もまた「世の中」であるのに違いなかった。",
          cn: "這片避暑地，確實也無疑是個『人世間』。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "僕は僅かに一年ばかりの間にどのくらいここにも罪悪や悲劇の行われているかを知り悉していた。",
          cn: "短短一年之間，這裡發生過多少罪惡與悲劇，我早已一清二楚。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "徐ろに患者を毒殺しようとした医者、養子夫婦の家に放火した老婆、妹の資産を奪おうとした弁護士、――それ等の人々の家を見ることは僕にはいつも人生の中に地獄を見ることに異らなかった。",
          cn: "慢慢地想毒殺病人的醫生、放火燒了養子夫婦家的老太婆、想奪走妹妹財產的律師——望著這些人的家，對我來說，向來都無異於在人生中窺見地獄。",
        },
      ],
      choices: null,
      next: "ch6_h_chan",
      effects: { insight: { amount: 1, reason: "在避暑地看見的人世地獄" } },
      flags: [],
      notebook: { key: "ch06.hell_houses", symbol: "fire", desc: "避暑地也是『人世』——毒殺病人的醫生、放火的老太婆、奪妹妹財產的律師" },
      links: null,
    },

    ch6_h_chan: {
      id: "ch6_h_chan",
      text: [
        {
          type: "dialogue",
          origin: "source",
          speaker: "我",
          speakerId: "protagonist",
          jp: "「この町には気違いが一人いますね」",
          cn: "「這鎮上有個瘋子吧。」",
        },
        {
          type: "dialogue",
          origin: "source",
          speaker: "岳母",
          speakerId: "wifes_mother",
          jp: "「Ｈちゃんでしょう。あれは気違いじゃないのですよ。莫迦になってしまったのですよ」",
          cn: "「你說的是小Ｈ吧。那不是瘋，是變傻了。」",
        },
        {
          type: "dialogue",
          origin: "source",
          speaker: "我",
          speakerId: "protagonist",
          jp: "「早発性痴呆と云うやつですね。僕はあいつを見る度に気味が悪くってたまりません。あいつはこの間もどう云う量見か、馬頭観世音の前にお時宜をしていました」",
          cn: "「就是所謂的早發性癡呆吧。我每次看見他都毛骨悚然。前陣子他不知怎麼想的，還對著馬頭觀世音鞠躬呢。」",
        },
      ],
      choices: null,
      next: "ch6_brother_joins",
      effects: null,
      flags: [],
      notebook: null,
      links: null,
    },

    ch6_brother_joins: {
      id: "ch6_brother_joins",
      text: [
        {
          type: "dialogue",
          origin: "source",
          speaker: "岳母",
          speakerId: "wifes_mother",
          jp: "「気味が悪くなるなんて、……もっと強くならなければ駄目ですよ」",
          cn: "「說什麼毛骨悚然……你得再堅強一點才行。」",
        },
        {
          type: "dialogue",
          origin: "source",
          speaker: "妻弟",
          speakerId: "wifes_brother",
          jp: "「兄さんは僕などよりも強いのだけれども、――」",
          cn: "「姊夫可比我堅強多了，可是——」",
        },
        {
          type: "narration",
          origin: "source",
          jp: "無精髭を伸ばした妻の弟も寝床の上に起き直ったまま、いつもの通り遠慮勝ちに僕等の話に加わり出した。",
          cn: "留著一臉沒剃的鬍子，妻弟仍舊坐在病榻上，像平時一樣，怯生生地加入了我們的話題。",
        },
      ],
      choices: null,
      next: "ch6_both_poles",
      effects: null,
      flags: [],
      notebook: null,
      links: null,
    },

    ch6_both_poles: {
      id: "ch6_both_poles",
      text: [
        {
          type: "dialogue",
          origin: "source",
          speaker: "妻弟",
          speakerId: "wifes_brother",
          jp: "「強い中に弱いところもあるから。……」",
          cn: "「堅強裡頭，也還是有脆弱的地方……」",
        },
        {
          type: "dialogue",
          origin: "source",
          speaker: "岳母",
          speakerId: "wifes_mother",
          jp: "「おやおや、それは困りましたね」",
          cn: "「哎呀哎呀，那可傷腦筋了。」",
        },
        {
          type: "narration",
          origin: "source",
          jp: "僕はこう言った妻の母を見、苦笑しない訣には行かなかった。",
          cn: "看著這麼說的岳母，我不能不苦笑。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "すると弟も微笑しながら、遠い垣の外の松林を眺め、何かうっとりと話しつづけた。",
          cn: "妻弟也微笑著，望向籬笆外遠處的松林，恍惚地繼續說著什麼。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "（この若い病後の弟は時々僕には肉体を脱した精神そのもののように見えるのだった）",
          cn: "（這位病後的年輕內弟，在我眼裡，有時竟像是脫離了肉體、純然的精神本身。）",
        },
        {
          type: "dialogue",
          origin: "source",
          speaker: "妻弟",
          speakerId: "wifes_brother",
          jp: "「妙に人間離れをしているかと思えば、人間的欲望もずいぶん烈しいし、……」",
          cn: "「說他脫離人味兒吧，人性的欲望卻又激烈得很……」",
        },
        {
          type: "dialogue",
          origin: "source",
          speaker: "我",
          speakerId: "protagonist",
          jp: "「善人かと思えば、悪人でもあるしさ」",
          cn: "「說他是善人吧，卻又是個惡人。」",
        },
        {
          type: "dialogue",
          origin: "source",
          speaker: "妻弟",
          speakerId: "wifes_brother",
          jp: "「いや、善悪と云うよりも何かもっと反対なものが、……」",
          cn: "「不，與其說是善惡，不如說是某種更相反的東西……」",
        },
        {
          type: "dialogue",
          origin: "source",
          speaker: "我",
          speakerId: "protagonist",
          jp: "「じゃ大人の中に子供もあるのだろう」",
          cn: "「那就是大人裡頭，也還藏著孩子囉。」",
        },
        {
          type: "dialogue",
          origin: "source",
          speaker: "妻弟",
          speakerId: "wifes_brother",
          jp: "「そうでもない。僕にははっきりと言えないけれど、……電気の両極に似ているのかな。何しろ反対なものを一しょに持っている」",
          cn: "「也不盡然。我也說不清楚，……大概像電的兩極吧。總之，是同時擁有著相反的東西。」",
        },
      ],
      choices: null,
      next: "ch6_airplane",
      effects: { insight: { amount: 1, reason: "電的兩極" } },
      flags: [],
      notebook: { key: "ch06.both_poles", symbol: "book", desc: "病後的弟弟像脫離了肉體的精神——『像電的兩極。總之同時擁有相反的東西』" },
      links: null,
    },

    ch6_airplane: {
      id: "ch6_airplane",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "そこへ僕等を驚かしたのは烈しい飛行機の響きだった。",
          cn: "這時，把我們嚇了一跳的，是一陣猛烈的飛機轟鳴聲。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "僕は思わず空を見上げ、松の梢に触れないばかりに舞い上った飛行機を発見した。",
          cn: "我不由得抬頭望向天空，發現一架幾乎要擦到松梢的飛機正騰空飛過。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "それは翼を黄いろに塗った。珍らしい単葉の飛行機だった。",
          cn: "那是一架機翼塗成黃色、少見的單翼飛機。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "鶏や犬はこの響きに驚き、それぞれ八方へ逃げまわった。",
          cn: "雞和狗都被這聲響嚇著了，四散逃竄。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "殊に犬は吠え立てながら、尾を捲いて縁の下へはいってしまった。",
          cn: "尤其是那隻狗，一面狂吠，一面夾著尾巴鑽進了緣廊底下。",
        },
      ],
      choices: null,
      next: "ch6_airplane_disease",
      effects: null,
      flags: [],
      notebook: null,
      links: null,
    },

    ch6_airplane_disease: {
      id: "ch6_airplane_disease",
      text: [
        {
          type: "dialogue",
          origin: "source",
          speaker: "我",
          speakerId: "protagonist",
          jp: "「あの飛行機は落ちはしないか？」",
          cn: "「那架飛機該不會掉下來吧？」",
        },
        {
          type: "dialogue",
          origin: "source",
          speaker: "妻弟",
          speakerId: "wifes_brother",
          jp: "「大丈夫。……兄さんは飛行機病と云う病気を知っている？」",
          cn: "「不會的。……姊夫知道有種病叫『飛行機病』嗎？」",
        },
        {
          type: "narration",
          origin: "source",
          jp: "僕は巻煙草に火をつけながら、「いや」と云う代りに頭を振った。",
          cn: "我一面點起一支菸，一面搖頭代替回答『不知道』。",
        },
        {
          type: "dialogue",
          origin: "source",
          speaker: "妻弟",
          speakerId: "wifes_brother",
          jp: "「ああ云う飛行機に乗っている人は高空の空気ばかり吸っているものだから、だんだんこの地面の上の空気に堪えられないようになってしまうのだって。……」",
          cn: "「聽說常搭那種飛機的人，因為老是吸著高空的空氣，漸漸就受不了這地面上的空氣了。……」",
        },
      ],
      choices: null,
      next: "ch6_why_me",
      effects: { insight: { amount: 1, reason: "飛行機病" } },
      flags: [],
      notebook: { key: "ch06.airplane_disease", symbol: "wing", desc: "『飛行機病』——一直呼吸高空空氣的人，會漸漸受不了地面上的空氣" },
      links: null,
    },

    ch6_why_me: {
      id: "ch6_why_me",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "妻の母の家を後ろにした後、僕は枝一つ動かさない松林の中を歩きながら、じりじり憂鬱になって行った。",
          cn: "把岳母家拋在身後之後，我走在連一根枝條都不曾晃動的松林裡，心情漸漸沉鬱起來。",
        },
      ],
      choices: [
        {
          text: "追問那些『為什麼』。",
          next: "ch6_why_ask",
          flag: "ch06.asked_why",
          effects: { insight: { amount: 1, reason: "追問那些為什麼" } },
          notebook: null,
          unlock: null,
        },
        {
          text: "甩甩頭，不去想。",
          next: "ch6_gallows",
          flag: "ch06.shook_off",
          effects: null,
          notebook: null,
          unlock: null,
        },
      ],
      next: null,
      effects: null,
      flags: ["ch06.asked_why", "ch06.shook_off"],
      notebook: null,
      links: { visit: "ch06.dunes", fold: "── 妻の実家 · 飛行機 ──" },
    },

    ch6_why_ask: {
      id: "ch6_why_ask",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "なぜあの飛行機はほかへ行かずに僕の頭の上を通ったのであろう？",
          cn: "為什麼那架飛機不飛去別處，偏偏要從我的頭頂上通過呢？",
        },
        {
          type: "narration",
          origin: "source",
          jp: "なぜ又あのホテルは巻煙草のエエア・シップばかり売っていたのであろう？",
          cn: "為什麼那家旅館，賣的又偏偏只有 Airship 牌的香菸呢？",
        },
        {
          type: "narration",
          origin: "source",
          jp: "僕はいろいろの疑問に苦しみ、人気のない道を選って歩いて行った。",
          cn: "我被種種疑問折磨著，專挑無人的路走了下去。",
        },
      ],
      choices: null,
      next: "ch6_gallows",
      effects: null,
      flags: [],
      notebook: null,
      links: null,
    },

    ch6_gallows: {
      id: "ch6_gallows",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "海は低い砂山の向うに一面に灰色に曇っていた。",
          cn: "海在低矮的砂丘那頭，整片灰濛濛地陰著。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "その又砂山にはブランコのないブランコ台が一つ突っ立っていた。",
          cn: "那砂丘上，孤零零立著一座沒有鞦韆的鞦韆架。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "僕はこのブランコ台を眺め、忽ち絞首台を思い出した。",
          cn: "我望著這鞦韆架，猛然想起了絞刑台。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "実際又ブランコ台の上には鴉が二三羽とまっていた、",
          cn: "而那鞦韆架上，確實也停著兩三隻烏鴉，",
        },
        {
          type: "narration",
          origin: "source",
          jp: "鴉は皆僕を見ても、飛び立つ気色さえ示さなかった。",
          cn: "烏鴉們見了我，竟連要飛走的樣子都沒有。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "のみならずまん中にとまっていた鴉は大きい嘴を空へ挙げながら、確かに四たび声を出した。",
          cn: "不僅如此，停在正中央的那隻烏鴉，昂起大喙朝向天空，確確實實地叫了四聲。",
        },
      ],
      choices: null,
      next: "ch6_burned_villa",
      effects: { nerve: { amount: -1, reason: "烏鴉叫了四聲" } },
      flags: [],
      notebook: { key: "ch06.gallows_crow", symbol: "raincoat", desc: "沒有鞦韆的鞦韆架像絞刑台。正中央的烏鴉朝天張喙，確確實實叫了四聲" },
      links: null,
    },

    ch6_burned_villa: {
      id: "ch6_burned_villa",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "僕は芝の枯れた砂土手に沿い、別荘の多い小みちを曲ることにした。",
          cn: "我沿著長滿枯草的砂堤，拐進了一條別墅密集的小路。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "この小みちの右側にはやはり高い松の中に二階のある木造の西洋家屋が一軒白じらと立っている筈だった。",
          cn: "這條小路的右側，理應有一棟兩層樓的西式木造房屋，白晃晃地立在高聳的松林之中。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "（僕の親友はこの家のことを「春のいる家」と称していた）",
          cn: "（我一位摯友，管這棟房子叫『住著春天的家』。）",
        },
        {
          type: "narration",
          origin: "source",
          jp: "が、この家の前へ通りかかると、そこにはコンクリイトの土台の上にバス・タッブが一つあるだけだった。",
          cn: "可我走到這房子前一看，卻只剩水泥地基上，孤零零地擺著一只浴缸。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "火事――僕はすぐにこう考え、そちらを見ないように歩いて行った。",
          cn: "火災——我立刻這麼想著，不敢再往那頭看，逕自走了過去。",
        },
      ],
      choices: null,
      next: "ch6_cyclist",
      effects: null,
      flags: [],
      notebook: { key: "ch06.burned_villa", symbol: "fire", desc: "『住著春天的家』只剩水泥地基上的一只浴缸——火災" },
      links: null,
    },

    ch6_cyclist: {
      id: "ch6_cyclist",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "すると自転車に乗った男が一人まっすぐに向うから近づき出した。",
          cn: "這時，一個騎自行車的男人，正筆直地從對面靠近過來。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "彼は焦茶いろの鳥打ち帽をかぶり、妙にじっと目を据えたまま、ハンドルの上へ身をかがめていた。",
          cn: "他戴著焦茶色的鴨舌帽，眼神詭異地凝定不動，弓著身子伏在車把上。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "僕はふと彼の顔に姉の夫の顔を感じ、彼の目の前へ来ないうちに横の小みちへはいることにした。",
          cn: "我忽然從他臉上感覺到姊夫的臉，趕在他走到我跟前之前，拐進了旁邊的小路。",
        },
      ],
      choices: null,
      next: "ch6_dead_mole",
      effects: null,
      flags: [],
      notebook: null,
      links: null,
    },

    ch6_dead_mole: {
      id: "ch6_dead_mole",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "しかしこの小みちのまん中にも腐った鼴鼠の死骸が一つ腹を上にして転がっていた。",
          cn: "可這條小路的正中央，也躺著一具腐爛的鼴鼠屍骸，肚皮朝天。",
        },
      ],
      choices: null,
      next: "ch6_final_walk",
      effects: { nerve: { amount: -1, reason: "腐爛的鼴鼠屍骸" } },
      flags: [],
      notebook: { key: "ch06.dead_mole", symbol: "gear", desc: "小路正中央，一具腐爛的鼴鼠屍骸腹部朝天躺著" },
      links: null,
    },

    // ═══════════════ 絞首台 · 鼴鼠——最後の歩行 ═══════════════
    // ch6_final_walk 起零選擇：命運收攏，讀者只剩「不得不做」的 forced steps。

    ch6_final_walk: {
      id: "ch6_final_walk",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "何ものかの僕を狙っていることは一足毎に僕を不安にし出した。",
          cn: "有什麼東西正在窺伺著我——這感覺，隨著每一步都愈發讓我不安起來。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "そこへ半透明な歯車も一つずつ僕の視野を遮り出した。",
          cn: "這時，半透明的齒輪，也一枚一枚地開始遮住了我的視野。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "僕は愈最後の時の近づいたことを恐れながら、頸すじをまっ直にして歩いて行った。",
          cn: "我害怕著最後的時刻終於逼近，只得挺直脖頸，繼續往前走。",
        },
        { type: "forced", origin: "added", steps: ["把脖子挺直。", "繼續走。", "不要停下。"] },
        {
          type: "narration",
          origin: "source",
          jp: "歯車は数の殖えるのにつれ、だんだん急にまわりはじめた。",
          cn: "齒輪的數目越來越多，也漸漸開始急速地旋轉起來。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "同時に又右の松林はひっそりと枝をかわしたまま、丁度細かい切子硝子を透かして見るようになりはじめた。",
          cn: "與此同時，右側的松林靜靜地交錯著枝椏，看起來竟像是透過細密的切子玻璃望出去一般。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "僕は動悸の高まるのを感じ、何度も道ばたに立ち止まろうとした。",
          cn: "我感到心悸越來越劇烈，好幾次想在路邊停下腳步。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "けれども誰かに押されるように立ち止まることさえ容易ではなかった。……",
          cn: "可就像被誰在背後推著似的，就連停下腳步，也不是件容易的事。……",
        },
      ],
      choices: null,
      next: "ch6_silver_wing",
      effects: { nerve: { amount: -2, reason: "最後の時" } },
      flags: [],
      notebook: { key: "ch06.last_gears", symbol: "gear", desc: "齒輪一枚一枚遮住視野，越轉越快——連停下腳步都做不到，像被誰推著" },
      links: { unlock: "ch06.last_gears", fold: "── 絞首台 · 鼴鼠 ──" },
    },

    ch6_silver_wing: {
      id: "ch6_silver_wing",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "三十分ばかりたった後、僕は僕の二階に仰向けになり、じっと目をつぶったまま、烈しい頭痛をこらえていた。",
          cn: "大約三十分鐘後，我仰躺在二樓房間裡，緊閉著雙眼，強忍著劇烈的頭痛。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "すると僕の眶の裏に銀色の羽根を鱗のように畳んだ翼が一つ見えはじめた。",
          cn: "這時，我的眼瞼裡側，開始浮現出一片銀色羽毛、像鱗片般疊起的翼。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "それは実際網膜の上にはっきりと映っているものだった。",
          cn: "那確確實實是清楚地映在視網膜上的東西。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "僕は目をあいて天井を見上げ、勿論何も天井にはそんなもののないことを確めた上、もう一度目をつぶることにした。",
          cn: "我睜開眼望向天花板，確認上頭當然什麼也沒有，才又重新閉上了眼睛。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "しかしやはり銀色の翼はちゃんと暗い中に映っていた。",
          cn: "可那銀色的翼，依舊清清楚楚地映在黑暗之中。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "僕はふとこの間乗った自動車のラディエエタア・キャップにも翼のついていたことを思い出した。……",
          cn: "我忽然想起，前些日子搭乘的那輛車，水箱蓋上也裝著一對翼。……",
        },
      ],
      choices: null,
      next: "ch6_wife_stairs",
      effects: null,
      flags: [],
      notebook: { key: "ch06.silver_wing", symbol: "wing", desc: "閉上眼，銀色的翼像鱗片般疊在視網膜上——之前那輛車的水箱蓋上，也有翼" },
      links: null,
    },

    ch6_wife_stairs: {
      id: "ch6_wife_stairs",
      text: [
        {
          type: "narration",
          origin: "source",
          jp: "そこへ誰か梯子段を慌しく昇って来たかと思うと、すぐに又ばたばた駈け下りて行った。",
          cn: "這時，忽然有人急急忙忙地跑上樓梯，才這麼想著，卻又噠噠噠地跑下去了。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "僕はその誰かの妻だったことを知り、驚いて体を起すが早いか、丁度梯子段の前にある、薄暗い茶の間へ顔を出した。",
          cn: "我認出那是妻子，驚訝地一躍而起，隨即探頭望向樓梯前那間昏暗的茶室。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "すると妻は突っ伏したまま、息切れをこらえていると見え、絶えず肩を震わしていた。",
          cn: "只見妻子伏在地上，看似正忍著喘不過氣，肩膀不斷地顫抖著。",
        },
      ],
      choices: null,
      next: "ch6_wife_words",
      effects: null,
      flags: [],
      notebook: null,
      links: null,
    },

    ch6_wife_words: {
      id: "ch6_wife_words",
      text: [
        {
          type: "dialogue",
          origin: "source",
          speaker: "我",
          speakerId: "protagonist",
          jp: "「どうした？」",
          cn: "「怎麼了？」",
        },
        {
          type: "dialogue",
          origin: "source",
          speaker: "妻",
          speakerId: "wife",
          jp: "「いえ、どうもしないのです。……」",
          cn: "「沒事，沒什麼事的。……」",
        },
        {
          type: "narration",
          origin: "source",
          jp: "妻はやっと顔を擡げ、無理に微笑して話しつづけた。",
          cn: "妻子這才抬起頭，勉強擠出微笑，繼續說了下去。",
        },
        {
          type: "dialogue",
          origin: "source",
          speaker: "妻",
          speakerId: "wife",
          jp: "「どうもした訣ではないのですけれどもね、唯何だかお父さんが死んでしまいそうな気がしたものですから。……」",
          cn: "「也不是真的出了什麼事，只是總覺得爸爸好像快要死掉了……」",
        },
      ],
      choices: null,
      next: "ch6_ending",
      effects: null,
      flags: [],
      notebook: { key: "ch06.wife_premonition", symbol: "raincoat", desc: "妻壓著喘息、肩膀不停顫抖——『總覺得爸爸好像快要死掉了』" },
      links: null,
    },

    ch6_ending: {
      id: "ch6_ending",
      text: [
        { type: "break" },
        {
          type: "narration",
          origin: "source",
          jp: "それは僕の一生の中でも最も恐しい経験だった。――",
          cn: "那是我一生之中，最為恐怖的一次經驗。——",
        },
        {
          type: "narration",
          origin: "source",
          jp: "僕はもうこの先を書きつづける力を持っていない。",
          cn: "我已經沒有力氣，再繼續寫下去了。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "こう云う気もちの中に生きているのは何とも言われない苦痛である。",
          cn: "活在這樣的心情裡，是一種難以言喻的痛苦。",
        },
        {
          type: "narration",
          origin: "source",
          jp: "誰か僕の眠っているうちにそっと絞め殺してくれるものはないか？",
          cn: "有誰能趁我熟睡的時候，悄悄把我勒死嗎？",
        },
        { type: "system", content: "第六章「飛行機」 終" },
        { type: "system", content: "歯車　――完――" },
      ],
      choices: null,
      next: null,
      effects: null,
      flags: [],
      notebook: null,
      links: { showEnd: true },
    },
  },
};
