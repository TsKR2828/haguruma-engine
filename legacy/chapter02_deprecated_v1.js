// ═══════════════════════════════════════════════════════════
// 2026-07-12 作廢：含幻覺內容，僅供 schema 參考。
// 作廢原因：捏造姊姊台詞／養子／震災／Polikushka 錯誤情節，
// 詳見 reports/full-audit-2026-07-11.md §1c。
// 取代者：src/data/chapters/chapter02.js（依 docs/ch2-source-map.md 重寫）。
// 本檔僅保留作為 schema／格式參考，不得回流任何劇情內容。
// ═══════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════
// 第二章「復讐」（復仇）— 前 1/3 場景（框架驗證用）
// Source: 芥川龍之介《歯車》二「復讐」
// 青空文庫 https://www.aozora.gr.jp/cards/000879/files/42377_34745.html
//
// 場景格式定義：docs/chapter-data-schema.md
// 章節規格書：docs/chapter02-spec.md
//
// ⚠ WIP：僅包含 scenes 1–8（旅館早晨＋姊姊家前半），
//   後續場景待框架驗證通過後補完。
// ═══════════════════════════════════════════════════════════

export const CHAPTER_02 = {
  chapter: 2,
  title: "復讐",
  titleCn: "復仇",
  startScene: "ch02_slipper",
  startLocation: "ch02.hotel_morning",
  sceneCount: 11, // WIP：最終版 ~24

  portraits: {
    ch02_bellboy: "portraits/ch2/bellboy.png",
    ch02_sister: "portraits/ch2/sister.png",
    ch02_wife: "portraits/ch2/wife.png",
  },

  locations: [
    { id: "ch02.hotel_morning", label: "ホテル", sub: "翌朝", x: 50, y: 50, shape: "rect" },
    { id: "ch02.sister_barracks", label: "姊の家", sub: "バラック", x: 140, y: 150, shape: "rect", symbolKey: "ch02.portrait_mustache" },
    { id: "ch02.aoyama", label: "青山", sub: "精神病院", x: 220, y: 240, shape: "circle", symbolKey: "ch02.cemetery_decade" },
    { id: "ch02.ginza", label: "銀座通", sub: "黄昏", x: 280, y: 310, shape: "diamond", symbolKey: "ch02.nemesis" },
  ],

  connections: [
    {
      id: "ch02.fire_chain",
      requires: ["ch02.fire_premonition", "ch02.portrait_mustache"],
      title: "火と肉塊",
      subtitle: "保険・放火・轢死",
      icon: "✦",
      insightGain: 2,
    },
    {
      id: "ch02.language_slip",
      requires: ["ch02.tantalus_chain", "book_worm"],
      title: "言葉の連鎖",
      subtitle: "Worm→Tantalus→Inferno",
      icon: "◈",
      insightGain: 1,
    },
    {
      id: "ch02.nemesis_loop",
      requires: ["ch02.nemesis", "ch02.cemetery_decade"],
      title: "復讐の神",
      subtitle: "十年後の再会",
      icon: "◉",
      insightGain: 2,
    },
    {
      id: "ch02.raincoat_persist",
      requires: ["raincoat_death", "ch02.raincoat_hotel_2"],
      title: "雨衣は消えない",
      subtitle: "死してなお",
      icon: "◇",
      insightGain: 1,
    },
  ],

  scenes: {
    // ═══════════════ 第一段：旅館早晨 ═══════════════

    // ─────────────── 拖鞋：不祥的聯想 ───────────────

    ch02_slipper: {
      id: "ch02_slipper",
      text: [
        { type: "system", content: "第二章　復讐" },
        { type: "system", content: "——復仇——" },
        { type: "break" },
        { type: "narration", content: "旅館的房間裡，大約早上八點。正要下床時發現拖鞋不可思議地只有一隻。" },
        { type: "inner", content: "這一兩年來，這種現象總是帶給你恐懼和不安。不僅如此，還讓人想起希臘神話中只穿一隻涼鞋的王子。" },
        { type: "narration", content: "按了門鈴叫給仕來找。給仕一臉狐疑地在狹小的房間裡找了一圈。" },
        { type: "dialogue", speaker: "給仕", speakerId: "ch02_bellboy", jp: "「ここにありました。このバスの部屋の中に。」", cn: "「找到了。在浴室裡面。」" },
        { type: "dialogue", speaker: "你", speakerId: "protagonist", jp: "「どうして又そんな所に行っていたのだろう？」", cn: "「怎麼會跑到那種地方去呢？」" },
        { type: "dialogue", speaker: "給仕", speakerId: "ch02_bellboy", jp: "「さあ、鼠かも知れません。」", cn: "「嗯，也許是老鼠吧。」" },
      ],
      choices: null,
      next: "ch02_writing",
      effects: null,
      flags: [],
      notebook: null,
      links: { visit: "ch02.hotel_morning" },
    },

    // ─────────────── 晨間執筆：窗外的煤煙 ───────────────

    ch02_writing: {
      id: "ch02_writing",
      text: (state) => {
        const base = [
          { type: "narration", content: "給仕退下後，喝了不加牛奶的咖啡，試圖繼續寫之前的小說。" },
          { type: "narration", content: "凝灰岩砌成的方窗面對著積雪的庭院。每次停下筆都會茫然地望著那片雪。" },
          { type: "narration", content: "雪在帶蓓蕾的沈丁花下，被都會的煤煙弄髒了。那是一幅讓人心痛的景象。" },
        ];
        if (state.choicesMade.pondered_allright) {
          base.push({ type: "inner", content: "腦中浮現了那兩個字——All right。昨夜在稿紙上反覆寫下的那兩個字。筆尖卻怎麼也接不上去。" });
        }
        base.push({ type: "inner", content: "一邊抽著卷菸，不知不覺停下了筆，想著各種事情。妻子的事、孩子們的事——尤其是姊夫的事。" });
        return base;
      },
      choices: null,
      next: "ch02_fire_memory",
      effects: null,
      flags: [],
      notebook: null,
      links: null,
    },

    // ─────────────── 火的記憶：姊夫的放火嫌疑 ───────────────

    ch02_fire_memory: {
      id: "ch02_fire_memory",
      text: [
        { type: "narration", content: "姊夫自殺之前背負著放火嫌疑。這也是無可奈何的——他在房子燒掉之前投了房價兩倍的火災保險。而且還因為偽證罪正處於緩刑之中。" },
        { type: "inner", content: "但讓你不安的，與其說是他的自殺，不如說是每次回東京都必定看到火在燃燒。" },
        { type: "narration", content: "從汽車裡看到山火、從自動車裡——那時妻子也在一起——看到常磐橋一帶的火災。" },
        { type: "dialogue", speaker: "你", speakerId: "protagonist", jp: "「今年は家が火事になるかも知れないぜ。」", cn: "「今年家裡也許會失火呢。」" },
        { type: "dialogue", speaker: "妻", speakerId: "ch02_wife", jp: "「そんな縁起の悪いことを。……それでも火事になったら大変ですね。保険は碌くについていないし、……」", cn: "「別說這種不吉利的話。……不過真要是著火了可不得了。保險也沒怎麼保……」" },
      ],
      choices: [
        {
          text: "追溯那些火的記憶——汽車裡看到的山火、常磐橋的火災。",
          next: "ch02_fire_traced",
          flag: "ch02.traced_fires",
          effects: { insight: { amount: 1, reason: "火的預感" } },
          notebook: { key: "ch02.fire_premonition", symbol: "gear", desc: "每次回東京都看到火——放火嫌疑、二倍保險" },
          unlock: "ch02.fire_premonition",
        },
        {
          text: "努力把妄想推開，拿起筆。",
          next: "ch02_tolstoy",
          flag: "ch02.resisted_delusion",
          effects: null,
          notebook: null,
          unlock: null,
        },
      ],
      next: null,
      effects: null,
      flags: ["ch02.traced_fires", "ch02.resisted_delusion"],
      notebook: null,
      links: null,
    },

    ch02_fire_traced: {
      id: "ch02_fire_traced",
      text: [
        { type: "inner", content: "山火。常磐橋。都內的夜空映出紅光。火災保險。偽證罪。自殺。" },
        { type: "inner", content: "這些事之間有某種看不見的齒輪在轉動——但你說不出它的形狀。" },
      ],
      choices: null,
      next: "ch02_tolstoy",
      effects: null,
      flags: [],
      notebook: null,
      links: null,
    },

    // ─────────────── Tolstoy：Polikouchka ───────────────

    ch02_tolstoy: {
      id: "ch02_tolstoy",
      text: [
        { type: "narration", content: "寫不動。終於離開書桌，躺在床上讀起了 Tolstoy 的 Polikouchka。" },
        { type: "inner", content: "這部小說的主人公也是虛榮心作祟、帶有病態傾向——最後把紙幣丟進壁爐後自縊而死。不只他一個——他的妻子也把嬰兒拋進了浴盆裡。" },
        { type: "narration", content: "你不由得把書放下。" },
      ],
      choices: null,
      next: "ch02_depart",
      effects: null,
      flags: [],
      notebook: null,
      links: { fold: "── 旅館 · 拖鞋與火 ──" },
    },

    // ═══════════════ 第二段：姊姊家（前半） ═══════════════

    // ─────────────── 出門：前往 barracks ───────────────

    ch02_depart: {
      id: "ch02_depart",
      text: [
        { type: "break" },
        { type: "narration", content: "打了電話通知之後，出門前往姊姊家。" },
        { type: "narration", content: "大震災之後，姊姊住在 barracks——關東大震災後的簡易住宅。" },
      ],
      choices: null,
      next: "ch02_sister_house",
      effects: null,
      flags: [],
      notebook: null,
      links: { visit: "ch02.sister_barracks" },
    },

    // ─────────────── 姊姊家：養子與黑痣男 ───────────────

    ch02_sister_house: {
      id: "ch02_sister_house",
      text: [
        { type: "narration", content: "到達了。姊姊不相變地冷靜。" },
        { type: "narration", content: "養子穿著金鈕扣的制服。大正十二年的火災讓這家人住進了 barracks。" },
      ],
      choices: null,
      next: "ch02_adopted_son",
      effects: null,
      flags: [],
      notebook: null,
      links: null,
    },

    ch02_adopted_son: {
      id: "ch02_adopted_son",
      text: [
        { type: "narration", content: "養子穿著金鈕扣軍服，嘴唇薄，帶著一種祈禱時的表情。" },
        { type: "narration", content: "旁邊坐著一個有黑痣的男人。他一直怯生生地看著你。" },
      ],
      choices: [
        {
          text: "觀察那個有黑痣的男人。他是誰？為什麼一直看著你？",
          next: "ch02_adopted_observed",
          flag: "ch02.noticed_mole_man",
          effects: { insight: { amount: 1, reason: "注意到不該注意的視線" } },
          notebook: { key: "ch02.mole_man", symbol: "book", desc: "有黑痣的男人一直盯著你看" },
          unlock: "ch02.mole_man",
        },
        {
          text: "把注意力放回姊姊身上。",
          next: "ch02_sister_talk",
          flag: "ch02.ignored_mole_man",
          effects: null,
          notebook: null,
          unlock: null,
        },
      ],
      next: null,
      effects: null,
      flags: ["ch02.noticed_mole_man", "ch02.ignored_mole_man"],
      notebook: null,
      links: null,
    },

    ch02_adopted_observed: {
      id: "ch02_adopted_observed",
      text: [
        { type: "narration", content: "黑痣的男人——不知道他和這家人是什麼關係。他的視線並不帶有惡意，但那種怯生生的凝視，反而讓人更加不安。" },
        { type: "inner", content: "他是不是知道什麼？還是只是好奇——好奇來訪的你是個什麼樣的人？" },
      ],
      choices: null,
      next: "ch02_sister_talk",
      effects: null,
      flags: [],
      notebook: null,
      links: null,
    },

    // ─────────────── 姊姊的態度 ───────────────

    ch02_sister_talk: {
      id: "ch02_sister_talk",
      text: [
        { type: "narration", content: "姊姊始終冷靜。談起死去的丈夫，她的嘴角甚至帶著嘲笑。" },
        { type: "dialogue", speaker: "姊姊", speakerId: "ch02_sister", jp: "「あの人はあなたのように強がりも云えないし、又骨もなかったのですからね。」", cn: "「那個人既不像你會逞強，也沒有骨氣。」" },
        { type: "inner", content: "你說不出這份冷靜是堅強還是某種更深的東西。" },
      ],
      choices: null,
      next: "ch02_wip_end",
      effects: null,
      flags: [],
      notebook: null,
      links: { fold: "── 姊の家 · 養子と痣 ──" },
    },

    // ═══════════════ WIP 臨時結尾 ═══════════════

    ch02_wip_end: {
      id: "ch02_wip_end",
      text: [
        { type: "break" },
        { type: "system", content: "【開發中】第二章後續場景尚未實裝。" },
        { type: "system", content: "第二章「復讐」 （未完）" },
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
