import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════
   歯車 — 第一章「レエン・コオト」
   沉浸式文字解謎 TRPG ・ React 互動版
   ═══════════════════════════════════════════════════════════ */

// ── Game State Types ──
const INITIAL_STATE = {
  nerve: 10,
  insight: 0,
  writing: 0,
  notebook: [],
  scene: "prologue",
  history: [],
  choicesMade: {},
  typing: false,
  pendingText: null,
};

// ── Notebook symbols ──
const SYMBOLS = {
  raincoat: { icon: "🧥", label: "雨衣", system: "レエン・コオト" },
  gear: { icon: "⚙️", label: "齒輪", system: "歯車" },
  wing: { icon: "🪽", label: "翼", system: "翼" },
  book: { icon: "📖", label: "書物", system: "本" },
  bw: { icon: "◐", label: "黑與白", system: "Black & White" },
};

// ── Scene Data ──
const SCENES = {
  prologue: {
    text: [
      { type: "system", content: "第一章　レエン・コオト" },
      { type: "system", content: "——雨衣——" },
      { type: "break" },
      {
        type: "narration",
        content:
          "冬日。你提著一只皮箱，為了出席某位友人的結婚披露宴，從避暑地叫了一輛汽車趕往東海道的某個停車場。",
      },
      {
        type: "narration",
        content:
          "道路兩旁大多只長著松樹。能不能趕上上行列車，相當令人懷疑。",
      },
      {
        type: "narration",
        content:
          "車上除了你以外，還坐著一位理髮店的老闆。他是個棗子般圓滾滾的男人，留著短短的下巴鬍。你一邊在意著時間，一邊偶爾跟他聊上幾句。",
      },
    ],
    next: "auto_barber",
  },

  auto_barber: {
    text: [
      {
        type: "dialogue",
        speaker: "理髮店主人",
        jp: "「妙なこともありますね。××さんの屋敷には昼間でも幽霊が出るって云うんですが。」",
        cn: "「也有奇怪的事呢。聽說 ×× 先生的宅邸，白天也有幽靈出沒。」",
      },
      {
        type: "narration",
        content:
          "你看著對面冬日西曬的松山，隨口附和著。",
      },
      {
        type: "dialogue",
        speaker: "理髮店主人",
        jp: "「尤も天気の善い日には出ないそうです。一番多いのは雨の降る日だって云うんですが。」",
        cn: "「不過天氣好的時候不會出現。最常出沒的是下雨天。」",
      },
    ],
    choices: [
      {
        text: "「下雨天出來——是來淋雨的吧？」",
        next: "auto_barber_2",
        effect: { writing: 1 },
        flag: "joke_response",
      },
      {
        text: "沉默地望向窗外的松林。",
        next: "auto_barber_2",
        effect: {},
        flag: "silent_response",
      },
    ],
  },

  auto_barber_2: {
    text: (state) => {
      const base = [];
      if (state.choicesMade.joke_response) {
        base.push({
          type: "dialogue",
          speaker: "理髮店主人",
          jp: "「御常談で。……しかしレエン・コオトを着た幽霊だって云うんです。」",
          cn: "「您說笑了。……不過聽說是穿著雨衣的幽靈呢。」",
        });
      } else {
        base.push({
          type: "narration",
          content: "理髮店主人見你沉默，又自顧自地說了下去。",
        });
        base.push({
          type: "dialogue",
          speaker: "理髮店主人",
          jp: "「しかしレエン・コオトを着た幽霊だって云うんです。」",
          cn: "「不過聽說是穿著雨衣的幽靈呢。」",
        });
      }
      base.push({
        type: "narration",
        content:
          "汽車鳴著喇叭，橫靠在了某個停車場旁。你與理髮店主人告別，走進了停車場。",
      });
      base.push({
        type: "narration",
        content: "果然——上行列車在兩三分鐘前剛剛開走了。",
      });
      return base;
    },
    next: "auto_station",
  },

  auto_station: {
    text: [
      {
        type: "narration",
        content:
          "候車室的長椅上，一個穿著雨衣的男人獨自茫然地望著窗外。",
      },
      {
        type: "inner",
        content:
          "你想起了剛才聽到的幽靈故事。不過只是苦笑了一下，決定到停車場前的咖啡廳去等下一班列車。",
      },
    ],
    choices: [
      {
        text: "仔細觀察那個穿雨衣的男人。",
        next: "station_observe",
        effect: {},
        flag: "observed_raincoat_1",
        notebook: { key: "raincoat_station", symbol: "raincoat", desc: "停車場候車室——穿雨衣的男人，茫然望向窗外" },
      },
      {
        text: "沒有多想，直接走向咖啡廳。",
        next: "cafe",
        effect: {},
        flag: "skipped_raincoat_1",
      },
    ],
  },

  station_observe: {
    text: [
      {
        type: "narration",
        content:
          "他就那樣坐著。雨衣的顏色在冬天的光線下顯得不合時令。他的臉模糊不清——或者說，你沒有記住它。",
      },
      {
        type: "system",
        content: "🧥 手帖新增：停車場的雨衣男人",
      },
      {
        type: "narration",
        content: "你轉身走向咖啡廳。",
      },
    ],
    next: "auto_cafe",
  },

  cafe: {
    text: [
      {
        type: "narration",
        content: "你轉身走向咖啡廳。",
      },
    ],
    next: "auto_cafe",
  },

  auto_cafe: {
    text: [
      {
        type: "narration",
        content:
          "說是咖啡廳，其實叫它咖啡廳都嫌勉強。你坐在角落的桌子前，點了一杯可可。",
      },
      {
        type: "narration",
        content:
          "桌上鋪的油布是白底藍格的粗格紋，角落已經磨出了底下的帆布。膠水味的可可。牆上貼著好幾張紙牌——「親子丼」「炸豬排」。",
      },
      {
        type: "narration",
        content: "還有一張：「地玉子、オムレツ」。",
      },
    ],
    choices: [
      {
        text: "細看那些紙牌。",
        next: "cafe_signs",
        effect: { writing: 1 },
        flag: "read_signs",
      },
      {
        text: "喝完可可，等列車。",
        next: "train_3rd",
        effect: {},
        flag: "skip_signs",
      },
    ],
  },

  cafe_signs: {
    text: [
      {
        type: "narration",
        content:
          "「地玉子」——本地雞蛋。這三個字讓你感覺到了東海道沿線的鄉下。那是麥田和甘藍田之間通著電氣機關車的田舍。",
      },
      {
        type: "inner",
        content: "電氣機關車通過麥田的田舍——這幾個字在你腦裡留下了什麼。",
      },
      {
        type: "system",
        content: "執筆 +1",
      },
    ],
    next: "auto_train_3rd",
  },

  train_3rd: {
    text: [],
    next: "auto_train_3rd",
  },

  auto_train_3rd: {
    text: [
      { type: "break" },
      {
        type: "narration",
        content:
          "等到搭上下一班上行列車時，天色已經接近黃昏。你平常坐二等車廂，但因為某種緣故，這次坐了三等。",
      },
      {
        type: "narration",
        content:
          "車廂裡相當擁擠。你的前後全是去大磯之類地方遠足歸來的小學女學生。她們個個活潑，幾乎沒停過嘴。",
      },
      {
        type: "dialogue",
        speaker: "女學生",
        jp: "「写真屋さん、ラヴ・シインって何？」",
        cn: "「照相館叔叔，Love scene 是什麼？」",
      },
      {
        type: "narration",
        content:
          "隨隊的「照相館叔叔」含混地搪塞過去了。但那個十四五歲的女學生還在追問。你注意到她鼻子有蓄膿症，忍不住微笑了一下。",
      },
      {
        type: "narration",
        content:
          "你旁邊坐著的十二三歲女學生則坐在年輕女老師的膝上，一手摟著她的脖子，一手撫著她的臉頰。",
      },
      {
        type: "dialogue",
        speaker: "女學生",
        jp: "「可愛いわね、先生は。可愛い目をしていらっしゃるわね。」",
        cn: "「好可愛呢，老師。老師的眼睛真可愛。」",
      },
    ],
    choices: [
      {
        text: "觀察那個年紀稍長、踩了別人腳道歉的女學生。",
        next: "train_mature_girl",
        effect: { insight: 1 },
        flag: "observed_mature_girl",
      },
      {
        text: "抽著卷菸，不太在意她們。",
        next: "train_to_t",
        effect: {},
        flag: "ignored_girls",
      },
    ],
  },

  train_mature_girl: {
    text: [
      {
        type: "narration",
        content:
          "年紀較大的那個女學生路過你身邊時似乎踩了誰的腳——",
      },
      {
        type: "dialogue",
        speaker: "年長的女學生",
        jp: "「御免なさいまし」",
        cn: "「非常抱歉」",
      },
      {
        type: "inner",
        content:
          "她比其他人更早熟——但正因如此，反而是她最像「女學生」。你嘴裡含著卷菸，對自己感受到的這個矛盾冷笑了一聲。",
      },
      {
        type: "system",
        content: "洞察 +1",
      },
    ],
    next: "auto_train_to_t",
  },

  train_to_t: {
    text: [],
    next: "auto_train_to_t",
  },

  auto_train_to_t: {
    text: [
      { type: "break" },
      {
        type: "narration",
        content:
          "不知何時車廂亮了燈。列車終於停靠在某個郊外的停車場。你在寒風凜冽的月台上下車，越過天橋，等候省線電車。",
      },
      {
        type: "narration",
        content: "在那裡，你偶然遇到了在某公司任職的 T 君。",
      },
      {
        type: "narration",
        content:
          "你們在等電車的間隙聊了些不景氣之類的話題。T 君的粗壯手指上嵌著一枚與不景氣毫無關係的土耳其石戒指。",
      },
      {
        type: "dialogue",
        speaker: "T 君",
        jp: "「これか？ これはハルピンへ商売に行っていた友だちの指環を買わされたんだよ。」",
        cn: "「這個？這是被一個去哈爾濱做生意的朋友硬塞的。那傢伙現在也走投無路了。」",
      },
      {
        type: "narration",
        content:
          "省線電車幸好不像火車那麼擠。你們並肩坐下，聊起了巴黎的事。T 君今年春天才從巴黎的分公司回到東京。卡約夫人的事、螃蟹料理的事、某位殿下出訪的事。",
      },
    ],
    next: "auto_train_t_raincoat",
  },

  auto_train_t_raincoat: {
    text: [
      {
        type: "narration",
        content:
          "這時——一個穿雨衣的男人走過來，在你們對面坐下了。",
      },
      {
        type: "inner",
        content: "你感到一瞬間的不安。想把之前聽到的幽靈故事告訴 T 君。",
      },
      {
        type: "narration",
        content:
          "但 T 君搶先把手杖的握柄朝左轉了一下，臉仍朝前，壓低聲音跟你說——",
      },
      {
        type: "dialogue",
        speaker: "T 君",
        jp: "「あすこに女が一人いるだろう？ 鼠色の毛糸のショールをした、……」",
        cn: "「那邊有個女人看到了嗎？灰色毛線披肩的……」",
      },
      {
        type: "dialogue",
        speaker: "T 君",
        jp: "「あいつはこの夏は軽井沢にいたよ。ちょっと洒落た洋装などをしてね。」",
        cn: "「她這個夏天在輕井澤。穿得挺時髦的。」",
      },
      {
        type: "narration",
        content:
          "但眼前的她明顯衣著寒酸。你一邊跟 T 君說話，一邊偷偷打量她。她的眉間帶著某種瘋狂的氣息。包袱裡還露出了一塊像豹紋的海綿。",
      },
    ],
    choices: [
      {
        text: "注意那個穿雨衣的男人——他還在嗎？",
        next: "raincoat_gone",
        effect: {},
        flag: "checked_raincoat_2",
        notebook: { key: "raincoat_train", symbol: "raincoat", desc: "省線電車——穿雨衣的男人坐在對面，後來不知何時消失了" },
      },
      {
        text: "繼續跟 T 君聊那個女人。",
        next: "raincoat_gone_passive",
        effect: {},
        flag: "ignored_raincoat_2",
      },
    ],
  },

  raincoat_gone: {
    text: [
      {
        type: "narration",
        content: "你與 T 君告別時回頭望——穿雨衣的男人不知何時已經不在了。",
      },
      {
        type: "system",
        content: "🧥 手帖新增：省線電車的雨衣男人（消失了）",
      },
    ],
    next: "auto_walk_gears",
  },

  raincoat_gone_passive: {
    text: [
      {
        type: "narration",
        content:
          "T 君還在說那女人的事——「跟年輕的美國人跳舞什麼的，Modern……叫什麼來著。」——等你與 T 君告別時，穿雨衣的男人不知何時已經不在了。",
      },
    ],
    next: "auto_walk_gears",
  },

  auto_walk_gears: {
    text: [
      { type: "break" },
      {
        type: "narration",
        content:
          "你提著皮箱，從省線電車的某個停車場步行前往旅館。道路兩側大多是高大的大樓。",
      },
      {
        type: "narration",
        content: "走著走著，你忽然想起了松林。",
      },
      {
        type: "narration",
        content: "然後——你的視野中出現了奇怪的東西。",
      },
      { type: "pause", duration: 2000 },
      {
        type: "narration",
        content:
          "半透明的齒輪。不停旋轉的齒輪。",
      },
      {
        type: "inner",
        content:
          "你以前也有過幾次這樣的經驗。齒輪會逐漸增多，遮住你半邊視野，但不會持續太久——消失之後，隨之而來的是頭痛。每次都是如此。",
      },
    ],
    choices: [
      {
        text: "用手遮住右眼，測試左眼的視力。",
        next: "gears_test",
        effect: { nerve: -1 },
        flag: "tested_eyes",
        notebook: { key: "gear_first", symbol: "gear", desc: "往旅館途中——半透明的齒輪初次出現在右眼瞼內側" },
      },
      {
        text: "又來了。低頭繼續走。",
        next: "gears_endure",
        effect: { nerve: -1 },
        flag: "endured_gears",
        notebook: { key: "gear_first", symbol: "gear", desc: "往旅館途中——半透明的齒輪初次出現" },
      },
    ],
  },

  gears_test: {
    text: [
      {
        type: "narration",
        content: "左眼沒事。",
      },
      {
        type: "narration",
        content:
          "但右眼瞼的內側——齒輪仍在旋轉。不止一個。它們的數量正在增加。",
      },
      {
        type: "narration",
        content:
          "你看著右邊的大樓一棟棟消失在齒輪後面，加快腳步朝旅館走去。",
      },
      {
        type: "system",
        content: "⚙️ 手帖新增：齒輪（初次出現）",
      },
      {
        type: "system",
        content: "神經 -1",
      },
    ],
    next: "auto_hotel_arrive",
  },

  gears_endure: {
    text: [
      {
        type: "narration",
        content:
          "你低著頭快步走著。視野右側的大樓逐漸被吞沒。你知道這會過去的。齒輪總是會消失。代價是頭痛。",
      },
      {
        type: "system",
        content: "⚙️ 手帖新增：齒輪（初次出現）",
      },
      {
        type: "system",
        content: "神經 -1",
      },
    ],
    next: "auto_hotel_arrive",
  },

  auto_hotel_arrive: {
    text: [
      { type: "break" },
      {
        type: "narration",
        content:
          "走進旅館玄關時，齒輪已經消失了。但頭痛還在。你寄存了外套和帽子，順便要了一間房。又打電話給某雜誌社商量了錢的事。",
      },
      {
        type: "narration",
        content: "結婚披露宴的晚餐早就開始了。",
      },
    ],
    next: "auto_banquet",
  },

  auto_banquet: {
    text: [
      {
        type: "narration",
        content:
          "你坐在長桌的角落，開始動起刀叉。正面的新郎新婦，白色凹字形桌邊入座的五十餘人——所有人都很快活。",
      },
      {
        type: "inner",
        content: "但你的心情在明亮的電燈光下越來越陰鬱。",
      },
      {
        type: "narration",
        content:
          "為了逃避這種感覺，你跟隔壁的客人搭了話。他是個獅子般白色頰髯的老人——某位著名的漢學家，你也知道他的名字。話題自然地轉到了古典。",
      },
      {
        type: "dialogue",
        speaker: "你",
        jp: "「麒麟はつまり一角獣ですね。それから鳳凰もフェニックスと云う鳥の、……」",
        cn: "「麒麟其實就是一角獸。然後鳳凰也是 Phoenix 這種鳥的——」",
      },
      {
        type: "narration",
        content: "漢學家似乎對你的話很有興趣。",
      },
      {
        type: "inner",
        content:
          "你在機械性地說話的同時，漸漸感到了一種病態的破壞慾。",
      },
    ],
    choices: [
      {
        text: "順從破壞慾——主張堯舜是架空人物，《春秋》的作者其實是漢代的人。",
        next: "banquet_destroy",
        effect: { nerve: -1, insight: 1 },
        flag: "destroyed_classics",
      },
      {
        text: "壓下衝動，繼續平穩地聊下去。",
        next: "banquet_calm",
        effect: {},
        flag: "stayed_calm",
      },
    ],
  },

  banquet_destroy: {
    text: [
      {
        type: "narration",
        content:
          "漢學家露骨地露出了不快的表情。他不再看你的臉，像老虎低吼般截斷了你的話——",
      },
      {
        type: "dialogue",
        speaker: "漢學家",
        jp: "「もし堯舜もいなかったとすれば、孔子は嘘をつかれたことになる。聖人の嘘をつかれる筈はない。」",
        cn: "「如果連堯舜都不存在，那孔子豈不是說了謊。聖人不可能說謊。」",
      },
      {
        type: "narration",
        content: "你當然沉默了。",
      },
      {
        type: "system",
        content: "洞察 +1",
      },
      {
        type: "system",
        content: "神經 -1",
      },
    ],
    next: "auto_banquet_worm",
  },

  banquet_calm: {
    text: [
      {
        type: "narration",
        content:
          "你壓下了那股衝動。對話平穩地結束了。漢學家似乎對你的博學留有好印象。",
      },
      {
        type: "inner",
        content: "但你感覺到那股衝動並沒有消失。",
      },
    ],
    next: "auto_banquet_worm",
  },

  auto_banquet_worm: {
    text: [
      {
        type: "narration",
        content:
          "你重新拿起刀叉，準備切盤中的肉。這時——",
      },
      {
        type: "narration",
        content: "一隻小蛆蟲在肉的邊緣靜靜地蠕動著。",
      },
      {
        type: "inner",
        content:
          "蛆——Worm。這個英語單字突然冒了出來。Worm 同時也是某種傳說動物的意思，就像麒麟和鳳凰一樣。",
      },
      {
        type: "narration",
        content:
          "你放下了刀叉。看著有人往你的酒杯裡倒入香檳。",
      },
    ],
    choices: [
      {
        text: "在腦中追蹤 Worm 這個詞的意義。",
        next: "worm_trace",
        effect: { insight: 1 },
        flag: "traced_worm",
        notebook: { key: "book_worm", symbol: "book", desc: "蛆→Worm→傳說動物——語言在你腦中自行滑移" },
      },
      {
        text: "不去想它。喝掉香檳。",
        next: "hotel_night",
        effect: {},
        flag: "drank_champagne",
      },
    ],
  },

  worm_trace: {
    text: [
      {
        type: "inner",
        content:
          "蛆蟲、Worm、龍——worm 的古義。麒麟是一角獸，鳳凰是 Phoenix，那麼蛆蟲是……它也活在某個傳說裡嗎？",
      },
      {
        type: "system",
        content: "📖 手帖新增：Worm——語言滑移（蛆→傳說動物）",
      },
      {
        type: "system",
        content: "洞察 +1",
      },
    ],
    next: "auto_hotel_night",
  },

  hotel_night: {
    text: [],
    next: "auto_hotel_night",
  },

  auto_hotel_night: {
    text: [
      { type: "break" },
      {
        type: "narration",
        content:
          "晚餐終於結束。你沿著無人的走廊，走向之前訂好的房間。走廊給你的感覺與其說是旅館，不如說更像監獄。不過頭痛倒是不知不覺減輕了。",
      },
      {
        type: "narration",
        content: "房間裡，皮箱、帽子和外套都已經送來了。",
      },
      {
        type: "narration",
        content:
          "——掛在牆上的外套讓你感覺到了你自己站立的身影。",
      },
    ],
    choices: [
      {
        text: "急忙把外套塞進房間角落的衣櫃裡。",
        next: "hotel_mirror",
        effect: {},
        flag: "hid_coat",
      },
      {
        text: "盯著那件外套看了一會兒。",
        next: "hotel_coat_stare",
        effect: { nerve: -1 },
        flag: "stared_coat",
      },
    ],
  },

  hotel_coat_stare: {
    text: [
      {
        type: "narration",
        content:
          "它就掛在那裡。袖子微微垂著。像一個沒有頭的你。",
      },
      {
        type: "narration",
        content: "……你終於走上前去，把它塞進了衣櫃。",
      },
      { type: "system", content: "神經 -1" },
    ],
    next: "auto_hotel_mirror",
  },

  hotel_mirror: {
    text: [],
    next: "auto_hotel_mirror",
  },

  auto_hotel_mirror: {
    text: [
      {
        type: "narration",
        content:
          "你走到梳妝台前，盯著鏡中的自己。",
      },
      {
        type: "narration",
        content: "鏡中映出的你的臉——皮膚底下的骨骼結構清晰可見。",
      },
      {
        type: "inner",
        content: "蛆蟲的記憶又鮮明地浮了上來。",
      },
      {
        type: "narration",
        content:
          "你打開門走進走廊，漫無目的地走著。然後在通向大廳的轉角，你看到了一盞綠色燈罩的落地燈，映在玻璃門上，鮮明而安靜。",
      },
      {
        type: "inner",
        content: "這盞燈讓你感到了某種平和。",
      },
      {
        type: "narration",
        content: "你在燈前的椅子上坐了下來。想著各種事情。但連五分鐘都坐不住——",
      },
    ],
    next: "auto_raincoat_3",
  },

  auto_raincoat_3: {
    text: [
      {
        type: "narration",
        content:
          "因為你身旁的長椅靠背上，一件雨衣正懶洋洋地搭著。",
      },
      {
        type: "inner",
        content: "而且現在是嚴冬。",
      },
      {
        type: "system",
        content: "🧥 手帖新增：旅館長椅上的雨衣",
      },
    ],
    notebook: { key: "raincoat_hotel", symbol: "raincoat", desc: "旅館走廊——嚴冬中，一件雨衣搭在長椅靠背上" },
    choices: [
      {
        text: "嘗試連結：到目前為止你已經三次遇見雨衣了。這意味著什麼？",
        next: "raincoat_link",
        effect: {},
        flag: "attempted_link",
      },
      {
        text: "不去想它。回房間。",
        next: "allright_corridor",
        effect: {},
        flag: "ignored_link",
      },
    ],
  },

  raincoat_link: {
    text: (state) => {
      const count = state.notebook.filter((n) => n.symbol === "raincoat").length;
      if (count >= 2) {
        return [
          {
            type: "inner",
            content:
              "停車場。省線電車。旅館走廊。三次——不，算上理髮店主人的故事，是四次。穿雨衣的幽靈。在冬天。在不該穿雨衣的季節。",
          },
          {
            type: "narration",
            content: "你的背脊一陣發涼。但你抓不住這個念頭要指向哪裡。",
          },
          {
            type: "system",
            content: "連結：🧥 × 3 ——方向未明，但迴路已形成。洞察 +1",
          },
        ];
      }
      return [
        {
          type: "inner",
          content: "雨衣。你想到了理髮店主人的故事。但具體的記憶太少，連結還建立不起來。",
        },
        {
          type: "system",
          content: "空轉：手帖中的雨衣記錄不足。",
        },
      ];
    },
    effectFn: (state) => {
      const count = state.notebook.filter((n) => n.symbol === "raincoat").length;
      return count >= 2 ? { insight: 1 } : {};
    },
    next: "auto_allright_corridor",
  },

  allright_corridor: {
    text: [],
    next: "auto_allright_corridor",
  },

  auto_allright_corridor: {
    text: [
      {
        type: "narration",
        content:
          "你沿著走廊往回走。走廊盡頭的服務生休息處一個人影也沒有。但他們的說話聲掠過你的耳邊。",
      },
      {
        type: "narration",
        content:
          "那是在回應什麼人的話——一句英語。",
      },
      { type: "pause", duration: 1500 },
      {
        type: "dialogue",
        speaker: "???",
        jp: "",
        cn: "\"All right.\"",
      },
      { type: "pause", duration: 1000 },
      {
        type: "inner",
        content:
          "「All right」？你不知不覺地開始追問這句對話的準確含義。「All right」？「All right」？到底什麼是「All right」？",
      },
    ],
    choices: [
      {
        text: "嘗試解讀 All right 的意義——「一切都對了」？「一切就緒了」？",
        next: "allright_puzzle",
        effect: {},
        flag: "pondered_allright",
      },
      {
        text: "只是普通的應答吧。回房間寫稿。",
        next: "room_writing",
        effect: {},
        flag: "dismissed_allright",
      },
    ],
  },

  allright_puzzle: {
    text: [
      {
        type: "inner",
        content:
          "All right——一切都到位了。一切都被安排好了。但被安排好的是什麼？被誰安排的？",
      },
      {
        type: "narration",
        content: "這個念頭像齒輪一樣開始空轉。你回到房間。",
      },
    ],
    next: "auto_room_writing",
  },

  room_writing: {
    text: [],
    next: "auto_room_writing",
  },

  auto_room_writing: {
    text: [
      {
        type: "narration",
        content:
          "房間很安靜。但打開門走進去的這個動作，莫名地讓你覺得不安。你猶豫了一下，還是走進去了。避開鏡子，坐進書桌前的椅子。蜥蜴皮般的青色摩洛哥皮安樂椅。",
      },
      {
        type: "narration",
        content:
          "你打開皮箱，取出原稿用紙，想要繼續那篇短篇小說。但蘸了墨水的筆怎麼也動不了。",
      },
      {
        type: "narration",
        content: "好不容易動了——卻只是反覆寫著同一組字。",
      },
      { type: "pause", duration: 1500 },
      {
        type: "inner",
        content:
          "All right…… All right…… All right, sir…… All right……",
      },
    ],
    next: "auto_phone",
  },

  auto_phone: {
    text: [
      { type: "break" },
      {
        type: "narration",
        content: "——突然，床邊的電話響了。",
      },
      {
        type: "narration",
        content: "你驚得站起來，把聽筒貼到耳邊。",
      },
      {
        type: "dialogue",
        speaker: "你",
        jp: "「どなた？」",
        cn: "「哪位？」",
      },
      {
        type: "dialogue",
        speaker: "姪女",
        jp: "「あたしです。あたし……」",
        cn: "「是我。是我……」",
      },
      {
        type: "narration",
        content: "是你姊姊的女兒。",
      },
      {
        type: "dialogue",
        speaker: "姪女",
        jp: "「ええ、あの大へんなことが起ったんです。ですから、……大へんなことが起ったもんですから、今叔母さんにも電話をかけたんです。」",
        cn: "「是的，出大事了。所以……因為出了大事，我剛剛也打了電話給阿姨。」",
      },
      {
        type: "dialogue",
        speaker: "你",
        jp: "「大へんなこと？」",
        cn: "「大事？」",
      },
      {
        type: "dialogue",
        speaker: "姪女",
        jp: "「ええ、ですからすぐに来て下さい。すぐにですよ。」",
        cn: "「是的，所以請馬上過來。馬上。」",
      },
      {
        type: "narration",
        content: "電話就此斷了。",
      },
      {
        type: "narration",
        content:
          "你掛上聽筒，反射性地按下了門鈴的按鈕。但你清楚地意識到自己的手在發抖。服務生遲遲不來。你感到的不是焦躁，而是痛苦。你反覆按著門鈴——",
      },
    ],
    next: "auto_allright_resolve",
  },

  auto_allright_resolve: {
    text: (state) => {
      const pondered = state.choicesMade.pondered_allright;
      const base = [];
      if (pondered) {
        base.push({
          type: "inner",
          content:
            "——你終於理解了命運教給你的那句「All right」的含義。",
        });
        base.push({
          type: "system",
          content: "洞察 +1",
        });
      } else {
        base.push({
          type: "inner",
          content:
            "你現在明白了。All right——命運說的，是一切都到位了。",
        });
      }
      base.push({ type: "break" });
      base.push({
        type: "narration",
        content:
          "你姊姊的丈夫在當天下午，在離東京不遠的某個鄉下被火車輾死了。",
      });
      base.push({
        type: "narration",
        content: "而且穿著一件與季節毫不相稱的雨衣。",
      });
      base.push({
        type: "system",
        content: "🧥 手帖新增：姊夫的雨衣——季節外れのレエン・コオト",
      });
      return base;
    },
    effectFn: (state) => {
      return state.choicesMade.pondered_allright ? { insight: 1 } : {};
    },
    notebook: { key: "raincoat_death", symbol: "raincoat", desc: "姊夫轢死——穿著與季節不符的雨衣" },
    next: "auto_ending",
  },

  auto_ending: {
    text: [
      { type: "break" },
      {
        type: "narration",
        content:
          "你仍然在這間旅館的房間裡，繼續寫著之前那篇短篇。深夜的走廊沒有人經過。",
      },
      {
        type: "narration",
        content: "但偶爾——門外會傳來翅膀的聲音。也許什麼地方養了鳥。",
      },
      {
        type: "system",
        content: "🪽 手帖新增：翼聲——深夜走廊的翅膀聲",
      },
      { type: "break" },
      { type: "break" },
      {
        type: "system",
        content: "第一章「レエン・コオト」 終",
      },
    ],
    notebook: { key: "wing_corridor", symbol: "wing", desc: "旅館深夜——門外傳來翅膀的聲音" },
    next: null,
  },
};

// ── Style constants ──
const PALETTE = {
  bg: "#0a0a0c",
  bgLight: "#111114",
  text: "#c8c4b8",
  textDim: "#6b6860",
  textBright: "#e8e4d8",
  accent: "#8b7355",
  accentDim: "#5a4a38",
  system: "#4a6858",
  systemText: "#7aaa8a",
  dialogue: "#a08060",
  inner: "#7070a0",
  border: "#1e1e24",
  danger: "#8b4040",
  choice: "#1a1a20",
  choiceHover: "#222230",
  choiceBorder: "#2a2a35",
};

// ── Components ──

function TextBlock({ block, onComplete, visible }) {
  const [displayedText, setDisplayedText] = useState("");
  const [done, setDone] = useState(false);
  const intervalRef = useRef(null);

  const fullText =
    block.type === "dialogue"
      ? block.jp
        ? `${block.jp}\n${block.cn}`
        : block.cn
      : block.content;

  useEffect(() => {
    if (!visible) return;
    if (block.type === "break" || block.type === "pause") {
      const t = setTimeout(() => {
        setDone(true);
        onComplete?.();
      }, block.type === "pause" ? (block.duration || 1000) : 300);
      return () => clearTimeout(t);
    }

    let i = 0;
    const speed = block.type === "system" ? 40 : block.type === "inner" ? 25 : 18;
    intervalRef.current = setInterval(() => {
      i++;
      setDisplayedText(fullText.slice(0, i));
      if (i >= fullText.length) {
        clearInterval(intervalRef.current);
        setDone(true);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(intervalRef.current);
  }, [visible]);

  const skipToEnd = () => {
    if (done || !visible) return;
    clearInterval(intervalRef.current);
    setDisplayedText(fullText);
    setDone(true);
    onComplete?.();
  };

  if (!visible) return null;
  if (block.type === "break") return <div style={{ height: "1.2em" }} />;
  if (block.type === "pause") return null;

  const styles = {
    narration: {
      color: PALETTE.text,
      lineHeight: "1.9",
      fontSize: "15px",
      letterSpacing: "0.03em",
    },
    inner: {
      color: PALETTE.inner,
      lineHeight: "1.9",
      fontSize: "15px",
      fontStyle: "italic",
      letterSpacing: "0.03em",
    },
    dialogue: {
      color: PALETTE.dialogue,
      lineHeight: "1.9",
      fontSize: "15px",
      letterSpacing: "0.02em",
      whiteSpace: "pre-wrap",
    },
    system: {
      color: PALETTE.systemText,
      lineHeight: "1.7",
      fontSize: "13px",
      letterSpacing: "0.05em",
      padding: "6px 12px",
      borderLeft: `2px solid ${PALETTE.system}`,
      marginTop: "4px",
      marginBottom: "4px",
    },
  };

  return (
    <div
      onClick={skipToEnd}
      style={{
        ...styles[block.type],
        cursor: done ? "default" : "pointer",
        marginBottom: "10px",
        transition: "opacity 0.3s",
        opacity: visible ? 1 : 0,
      }}
    >
      {block.type === "dialogue" && block.speaker && (
        <span
          style={{
            color: PALETTE.textDim,
            fontSize: "12px",
            display: "block",
            marginBottom: "2px",
            letterSpacing: "0.08em",
          }}
        >
          ── {block.speaker}
        </span>
      )}
      {displayedText}
      {!done && (
        <span
          style={{
            opacity: 0.5,
            animation: "blink 1s infinite",
          }}
        >
          ▍
        </span>
      )}
    </div>
  );
}

function ChoicePanel({ choices, onChoice, visible }) {
  if (!visible || !choices) return null;

  return (
    <div
      style={{
        marginTop: "24px",
        marginBottom: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        animation: "fadeIn 0.6s ease",
      }}
    >
      <div
        style={{
          color: PALETTE.textDim,
          fontSize: "11px",
          letterSpacing: "0.15em",
          marginBottom: "4px",
        }}
      >
        ── 行動選擇 ──
      </div>
      {choices.map((c, i) => (
        <button
          key={i}
          onClick={() => onChoice(c, i)}
          style={{
            background: PALETTE.choice,
            border: `1px solid ${PALETTE.choiceBorder}`,
            color: PALETTE.textBright,
            padding: "12px 16px",
            fontSize: "14px",
            lineHeight: "1.6",
            textAlign: "left",
            cursor: "pointer",
            borderRadius: "2px",
            transition: "all 0.2s",
            letterSpacing: "0.02em",
          }}
          onMouseEnter={(e) => {
            e.target.style.background = PALETTE.choiceHover;
            e.target.style.borderColor = PALETTE.accent;
          }}
          onMouseLeave={(e) => {
            e.target.style.background = PALETTE.choice;
            e.target.style.borderColor = PALETTE.choiceBorder;
          }}
        >
          {c.text}
        </button>
      ))}
    </div>
  );
}

function Notebook({ entries, open, onClose }) {
  if (!open) return null;
  const grouped = {};
  entries.forEach((e) => {
    if (!grouped[e.symbol]) grouped[e.symbol] = [];
    grouped[e.symbol].push(e);
  });

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(5,5,8,0.92)",
        zIndex: 100,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        animation: "fadeIn 0.3s ease",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: PALETTE.bgLight,
          border: `1px solid ${PALETTE.border}`,
          padding: "32px",
          maxWidth: "500px",
          width: "90%",
          maxHeight: "70vh",
          overflowY: "auto",
          borderRadius: "2px",
        }}
      >
        <div
          style={{
            color: PALETTE.accent,
            fontSize: "14px",
            letterSpacing: "0.2em",
            marginBottom: "20px",
            borderBottom: `1px solid ${PALETTE.border}`,
            paddingBottom: "12px",
          }}
        >
          手帖
        </div>
        {Object.entries(grouped).map(([sym, items]) => (
          <div key={sym} style={{ marginBottom: "16px" }}>
            <div
              style={{
                color: PALETTE.textDim,
                fontSize: "12px",
                letterSpacing: "0.1em",
                marginBottom: "6px",
              }}
            >
              {SYMBOLS[sym]?.icon} {SYMBOLS[sym]?.system}
            </div>
            {items.map((item, i) => (
              <div
                key={i}
                style={{
                  color: PALETTE.text,
                  fontSize: "13px",
                  lineHeight: "1.6",
                  paddingLeft: "16px",
                  marginBottom: "4px",
                  borderLeft: `1px solid ${PALETTE.accentDim}`,
                }}
              >
                {item.desc}
              </div>
            ))}
          </div>
        ))}
        {entries.length === 0 && (
          <div style={{ color: PALETTE.textDim, fontSize: "13px" }}>
            尚無記錄。
          </div>
        )}
        <button
          onClick={onClose}
          style={{
            marginTop: "16px",
            background: "none",
            border: `1px solid ${PALETTE.border}`,
            color: PALETTE.textDim,
            padding: "6px 16px",
            fontSize: "12px",
            cursor: "pointer",
          }}
        >
          關閉
        </button>
      </div>
    </div>
  );
}

function StatusBar({ nerve, insight, writing }) {
  const bar = (val, max, color) => (
    <div
      style={{
        width: "60px",
        height: "3px",
        background: PALETTE.border,
        borderRadius: "1px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${(val / max) * 100}%`,
          height: "100%",
          background: color,
          transition: "width 0.5s ease",
        }}
      />
    </div>
  );

  return (
    <div
      style={{
        display: "flex",
        gap: "16px",
        alignItems: "center",
        fontSize: "11px",
        color: PALETTE.textDim,
        letterSpacing: "0.08em",
      }}
    >
      <span>
        神經 {nerve}/10 {bar(nerve, 10, nerve <= 3 ? PALETTE.danger : PALETTE.accent)}
      </span>
      <span>
        洞察 {insight} {bar(insight, 10, PALETTE.systemText)}
      </span>
      <span>
        執筆 {writing} {bar(writing, 5, PALETTE.inner)}
      </span>
    </div>
  );
}

// ── Main Game Component ──
export default function HagurumaChapter1() {
  const [state, setState] = useState(INITIAL_STATE);
  const [textQueue, setTextQueue] = useState([]);
  const [visibleCount, setVisibleCount] = useState(0);
  const [showChoices, setShowChoices] = useState(false);
  const [currentChoices, setCurrentChoices] = useState(null);
  const [notebookOpen, setNotebookOpen] = useState(false);
  const [started, setStarted] = useState(false);
  const [ended, setEnded] = useState(false);
  const scrollRef = useRef(null);
  const autoAdvanceRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }, 50);
  }, []);

  const applyEffect = useCallback((effect, s) => {
    const newState = { ...s };
    if (effect.nerve) newState.nerve = Math.max(0, Math.min(10, s.nerve + effect.nerve));
    if (effect.insight) newState.insight = Math.max(0, Math.min(10, s.insight + effect.insight));
    if (effect.writing) newState.writing = Math.max(0, Math.min(5, s.writing + effect.writing));
    return newState;
  }, []);

  const loadScene = useCallback(
    (sceneKey, currentState) => {
      const scene = SCENES[sceneKey];
      if (!scene) return;

      let newState = { ...currentState, scene: sceneKey };

      // Add scene-level notebook entry
      if (scene.notebook) {
        const exists = newState.notebook.find(n => n.key === scene.notebook.key);
        if (!exists) {
          newState.notebook = [...newState.notebook, scene.notebook];
        }
      }

      const textBlocks =
        typeof scene.text === "function" ? scene.text(newState) : scene.text;

      const oldHistory = newState.history;
      const newHistory = [...oldHistory, ...textBlocks.map((b) => ({ ...b, sceneKey }))];
      newState.history = newHistory;

      setState(newState);
      setTextQueue(textBlocks);
      setVisibleCount(0);
      setShowChoices(false);
      setCurrentChoices(scene.choices || null);

      // Start revealing
      setTimeout(() => setVisibleCount(1), 100);
    },
    []
  );

  const onTextComplete = useCallback(() => {
    scrollToBottom();
    autoAdvanceRef.current = setTimeout(() => {
      setVisibleCount((prev) => {
        const next = prev + 1;
        if (next > textQueue.length) {
          // All text shown
          if (currentChoices) {
            setShowChoices(true);
          } else {
            // Auto-advance to next scene
            const scene = SCENES[state.scene];
            if (scene?.next) {
              setTimeout(() => loadScene(scene.next, state), 600);
            } else {
              setEnded(true);
            }
          }
        }
        return next;
      });
    }, 200);
  }, [textQueue, currentChoices, state, loadScene, scrollToBottom]);

  useEffect(() => {
    return () => clearTimeout(autoAdvanceRef.current);
  }, []);

  const handleChoice = useCallback(
    (choice) => {
      let newState = { ...state };

      // Apply flag
      if (choice.flag) {
        newState.choicesMade = { ...newState.choicesMade, [choice.flag]: true };
      }

      // Apply effect
      if (choice.effect) {
        newState = applyEffect(choice.effect, newState);
      }

      // Apply notebook
      if (choice.notebook) {
        const exists = newState.notebook.find(n => n.key === choice.notebook.key);
        if (!exists) {
          newState.notebook = [...newState.notebook, choice.notebook];
        }
      }

      // Add choice to history
      newState.history = [
        ...newState.history,
        { type: "choice", content: `▸ ${choice.text}` },
      ];

      setState(newState);
      setShowChoices(false);
      setCurrentChoices(null);

      // Navigate to next scene
      if (choice.next) {
        setTimeout(() => loadScene(choice.next, newState), 400);
      }
    },
    [state, applyEffect, loadScene]
  );

  // ── Also handle effectFn for dynamic scenes ──
  useEffect(() => {
    if (showChoices || !state.scene) return;
    const scene = SCENES[state.scene];
    if (scene?.effectFn && visibleCount > textQueue.length && !currentChoices) {
      const fx = scene.effectFn(state);
      if (fx && Object.keys(fx).length > 0) {
        setState((prev) => applyEffect(fx, prev));
      }
    }
  }, [showChoices, state.scene, visibleCount, textQueue.length]);

  // ── Start screen ──
  if (!started) {
    return (
      <div
        style={{
          background: PALETTE.bg,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "'Noto Serif TC', 'Noto Serif JP', 'Georgia', serif",
          cursor: "pointer",
          position: "relative",
          overflow: "hidden",
        }}
        onClick={() => {
          setStarted(true);
          setTimeout(() => loadScene("prologue", state), 500);
        }}
      >
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@300;400;500;600&family=Noto+Serif+JP:wght@300;400;500&display=swap');
          @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
          @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
          @keyframes slowPulse { 0%,100%{opacity:0.3} 50%{opacity:0.6} }
          @keyframes gearSpin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
          * { box-sizing: border-box; margin: 0; padding: 0; }
          ::-webkit-scrollbar { width: 4px; }
          ::-webkit-scrollbar-track { background: ${PALETTE.bg}; }
          ::-webkit-scrollbar-thumb { background: ${PALETTE.border}; }
        `}</style>

        {/* Faint gear in background */}
        <div
          style={{
            position: "absolute",
            width: "300px",
            height: "300px",
            opacity: 0.03,
            animation: "gearSpin 60s linear infinite",
          }}
        >
          <svg viewBox="0 0 100 100" fill={PALETTE.textBright}>
            <path d="M50 10 L54 25 L60 12 L58 28 L66 18 L60 32 L72 24 L62 36 L76 32 L64 40 L78 40 L64 44 L78 48 L62 48 L76 56 L60 52 L72 64 L56 54 L66 68 L52 56 L60 72 L50 56 L54 74 L48 56 L42 72 L46 54 L34 68 L44 52 L28 64 L40 48 L22 56 L38 44 L22 48 L36 40 L22 40 L38 36 L24 32 L40 32 L28 24 L42 28 L34 18 L44 32 L40 12 L46 28 L46 10 L48 26 Z" />
            <circle cx="50" cy="44" r="10" fill={PALETTE.bg} />
          </svg>
        </div>

        <div
          style={{
            color: PALETTE.textDim,
            fontSize: "12px",
            letterSpacing: "0.3em",
            marginBottom: "20px",
            animation: "fadeIn 1s ease",
          }}
        >
          芥川龍之介 遺稿
        </div>
        <div
          style={{
            color: PALETTE.textBright,
            fontSize: "48px",
            fontWeight: 300,
            letterSpacing: "0.3em",
            marginBottom: "8px",
            fontFamily: "'Noto Serif JP', serif",
            animation: "fadeIn 1.5s ease",
          }}
        >
          歯車
        </div>
        <div
          style={{
            color: PALETTE.textDim,
            fontSize: "14px",
            letterSpacing: "0.15em",
            marginBottom: "60px",
            animation: "fadeIn 2s ease",
          }}
        >
          齒輪
        </div>
        <div
          style={{
            color: PALETTE.accent,
            fontSize: "12px",
            letterSpacing: "0.2em",
            animation: "slowPulse 3s ease infinite",
          }}
        >
          點擊任意處開始
        </div>
      </div>
    );
  }

  // ── Ending screen ──
  if (ended) {
    return (
      <div
        style={{
          background: PALETTE.bg,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "'Noto Serif TC', 'Noto Serif JP', 'Georgia', serif",
          animation: "fadeIn 2s ease",
        }}
      >
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@300;400;500;600&family=Noto+Serif+JP:wght@300;400;500&display=swap');
          @keyframes fadeIn { from{opacity:0} to{opacity:1} }
          * { box-sizing: border-box; margin: 0; padding: 0; }
        `}</style>
        <div style={{ color: PALETTE.textDim, fontSize: "13px", letterSpacing: "0.2em", marginBottom: "24px" }}>
          第一章 終
        </div>
        <div style={{ color: PALETTE.text, fontSize: "14px", marginBottom: "32px", textAlign: "center", lineHeight: "2", maxWidth: "400px", padding: "0 20px" }}>
          手帖紀錄：{state.notebook.length} 筆<br />
          神經：{state.nerve}/10　洞察：{state.insight}　執筆：{state.writing}
        </div>
        <button
          onClick={() => setNotebookOpen(true)}
          style={{
            background: "none",
            border: `1px solid ${PALETTE.accent}`,
            color: PALETTE.accent,
            padding: "8px 24px",
            fontSize: "13px",
            letterSpacing: "0.1em",
            cursor: "pointer",
          }}
        >
          查看手帖
        </button>
        <Notebook entries={state.notebook} open={notebookOpen} onClose={() => setNotebookOpen(false)} />
      </div>
    );
  }

  // ── Game screen ──
  return (
    <div
      style={{
        background: PALETTE.bg,
        minHeight: "100vh",
        fontFamily: "'Noto Serif TC', 'Noto Serif JP', 'Georgia', serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@300;400;500;600&family=Noto+Serif+JP:wght@300;400;500&display=swap');
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: ${PALETTE.bg}; }
        ::-webkit-scrollbar-thumb { background: ${PALETTE.border}; }
      `}</style>

      {/* Top bar */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          background: `linear-gradient(180deg, ${PALETTE.bg} 60%, transparent)`,
          padding: "12px 20px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <StatusBar nerve={state.nerve} insight={state.insight} writing={state.writing} />
        <button
          onClick={() => setNotebookOpen(true)}
          style={{
            background: "none",
            border: `1px solid ${PALETTE.border}`,
            color: PALETTE.textDim,
            padding: "4px 12px",
            fontSize: "11px",
            letterSpacing: "0.1em",
            cursor: "pointer",
            borderRadius: "1px",
          }}
          onMouseEnter={(e) => (e.target.style.borderColor = PALETTE.accent)}
          onMouseLeave={(e) => (e.target.style.borderColor = PALETTE.border)}
        >
          手帖 ({state.notebook.length})
        </button>
      </div>

      {/* Text area */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "0 20px 40px",
          maxWidth: "640px",
          width: "100%",
          margin: "0 auto",
        }}
      >
        {/* Previously completed scenes */}
        {state.history
          .filter((b) => !textQueue.includes(b))
          .map((block, i) => {
            if (block.type === "break") return <div key={`h-${i}`} style={{ height: "1.2em" }} />;
            if (block.type === "pause") return null;
            if (block.type === "choice")
              return (
                <div
                  key={`h-${i}`}
                  style={{
                    color: PALETTE.accentDim,
                    fontSize: "13px",
                    marginBottom: "10px",
                    fontStyle: "italic",
                  }}
                >
                  {block.content}
                </div>
              );
            const sMap = {
              narration: { color: PALETTE.textDim, fontSize: "14px", lineHeight: "1.8" },
              inner: { color: "#555568", fontSize: "14px", lineHeight: "1.8", fontStyle: "italic" },
              dialogue: { color: "#7a6848", fontSize: "14px", lineHeight: "1.8", whiteSpace: "pre-wrap" },
              system: { color: "#5a8868", fontSize: "12px", lineHeight: "1.6", paddingLeft: "14px", borderLeft: `2px solid #3a5848` },
            };
            return (
              <div key={`h-${i}`} style={{ ...sMap[block.type], marginBottom: "8px", opacity: block.type === "system" ? 0.85 : 0.5 }}>
                {block.type === "dialogue" && block.speaker && (
                  <span style={{ color: PALETTE.textDim, fontSize: "11px", display: "block", marginBottom: "1px" }}>
                    ── {block.speaker}
                  </span>
                )}
                {block.type === "dialogue"
                  ? block.jp
                    ? `${block.jp}\n${block.cn}`
                    : block.cn
                  : block.content}
              </div>
            );
          })}

        {/* Current scene text */}
        {textQueue.map((block, i) => (
          <TextBlock
            key={`t-${state.scene}-${i}`}
            block={block}
            visible={i < visibleCount}
            onComplete={i === visibleCount - 1 ? onTextComplete : undefined}
          />
        ))}

        {/* Choices */}
        <ChoicePanel choices={currentChoices} onChoice={handleChoice} visible={showChoices} />
      </div>

      <Notebook entries={state.notebook} open={notebookOpen} onClose={() => setNotebookOpen(false)} />
    </div>
  );
}
