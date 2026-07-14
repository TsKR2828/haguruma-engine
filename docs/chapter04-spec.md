# 第四章「まだ？」 Chapter Spec

> ⚠ 舊友場景為幻覺內容已作廢；場景切分以 docs/ch4-source-map.md 為準。
> 本檔「與前章的銜接」「Ｃ2：舊友的兒子」及 text blocks 中「ch04_old_friend」段落捏造了
> 「兒子自殺未遂」「暴君」等原文沒有的對話，且遺漏了朱舜水／不眠症語言崩解母題——
> 已由 `docs/ch4-source-map.md`（Batch F8，2026-07-12 定案）取代，`src/data/chapters/chapter04.js`
> 依該圖重切完工。本檔僅其餘段落（舊友場景以外）的 cn 譯文可作參考，場景切分與
> 舊友場景全部內容一律不可採用。
>
> 基於青空文庫原文的場景分割。文本欄位為原文段落對照，待劇本編輯器精修格式。
> Source: 芥川龍之介《歯車》四「まだ？」
> 青空文庫 https://www.aozora.gr.jp/cards/000879/files/42377_34745.html
> 原著為公有領域（著作権消滅）

---

## 概要

| 項目 | 值 |
|------|------|
| chapter | 4 |
| title | まだ？ |
| titleCn | 還沒？ |
| startScene | ch04_manuscript |
| startLocation | ch04.hotel_room |
| 預估場景數 | ~16 |
| 預估選擇點 | ~7 |
| 預估 connections | 4 |

## 主題

原文結構：「僕」寫完短篇 → 銀座買書（紙屑=薔薇）→ 咖啡廳的母子亂倫暗示 → Mérimée 帶來鐵的意志 → Beethoven 肖像 → 舊友的兒子自殺未遂 → 斷髮孕婦 → 痔瘡＋Beethoven 的坐浴 → 房間裡狂寫 → 電話中的「モオル」→ Mole → la mort。全章是白天到傍晚，「僕」在短暫的意志力高峰與崩潰之間反覆。

核心意象：
- **紙屑=薔薇** — 路上的紙屑在光線下像薔薇花。「何ものかの好意」——唯一的善意徵兆
- **母子的親和力** — 咖啡廳裡母子像戀人。「現世を地獄にする或意志」
- **Mérimée 的格言** — 書信集中的格言使「僕」的心像鐵一樣堅固。「何でも来い」——但只持續了片刻
- **Beethoven 的坐浴** — 痔痛→坐浴→Beethoven 也坐浴。硫黄的幻嗅
- **モオル→Mole→la mort** — 電話中的曖昧詞彙 → 英語「鼴鼠」→ 法語「死亡」。第三條語言滑移鏈
- **鏡中的微笑** — 感到恐怖的同時，又覺得可笑。鏡中的自己在微笑。這可笑從何而來？

---

## 與前章的銜接

### carryOver state（D3）

- `notebook` — CH1–CH3 筆記全部帶入
- `choicesMade` — 所有 flag 帶入
- `connections` — 已形成的連結
- `nerve` / `insight` / `writing` — 數值延續

### 前章 flag 依賴

| 前章 flag | CH4 效果 |
|----------|----------|
| `ch03.wept_for_novel` | ch04_manuscript：寫完短篇時回想起昨晚讀《暗夜行路》而落淚的事 |
| `ch03.faced_penname` | ch04_mirror：鏡中微笑時，「寿陵余子」三個字浮現 |
| `ch02.traced_tantalus` | ch04_mole：Mole→la mort 的聯想中額外閃過 Tantalus→Inferno |
| `ch02.nowhere_to_return` | ch04_cafe：「何でも来い」的意志力更顯脆弱——昨天才無處可歸 |

---

## 場景清單（基於原文段落）

### 第一段：寫完稿・銀座（scenes 1–5）

原文段落：寫完短篇→銀座書店→紙屑薔薇→買書→咖啡廳母子

| ID | 類型 | 原文對應 | 選擇 |
|----|------|----------|------|
| `ch04_manuscript` | auto | 旅館房間裡終於寫完了短篇，寄給雜誌社。稿費連一週住宿費都不夠。但寫完本身帶來了滿足。 | — |
| `ch04_roses` | auto | 為了尋求精神的強壯劑，出門前往銀座。冬日照在柏油路上，紙屑在光線下看起來完全像薔薇花。感到「何ものかの好意」。 | — |
| `ch04_bookstore` | auto | 走進書店。比平時整潔。一個戴眼鏡的小姑娘在和店員說話——有點在意。但想起路上的薔薇，買了 Anatole France 對話集和 Mérimée 書信集。 | — |
| `ch04_cafe_incest` | choice | 咖啡廳最裡面的桌子。對面坐著一對像戀人的母子。兒子比「僕」年輕，但長得幾乎一模一樣。「僕」意識到兒子在性的層面也給予了母親慰藉。 | **C1** |
| `ch04_merimee` | auto | 苦痛中拿起剛到的咖啡和 Mérimée 書信集。格言像鐵一樣使「僕」的心堅固起來。「何でも来い」——大步走出咖啡廳。 | — |

**C1：母子的親和力**
- A)「凝視這對母子——那是「僕」也有記憶的親和力。同時也是把現世變成地獄的意志。」→ +insight, notebook `ch04.affinity_hell`, flag `ch04.recognized_affinity`
- B)「趕緊翻開書，不去想。」→ flag `ch04.averted_eyes`

#### 原文 text blocks

**ch04_manuscript:**
```
type: system  「第四章　まだ？」
type: system  「——還沒？——」
type: break
type: narration 在旅館房間裡終於寫完了之前的短篇，決定寄給某本雜誌。稿費連一週的住宿費都不夠。
type: inner  但寫完了這件事本身帶來了滿足，為了尋求某種精神上的強壯劑，決定去銀座的書店。
```

**ch04_roses:**
```
type: narration 冬天的陽光照在柏油路上，幾張紙屑散落其間。
type: inner  那些紙屑在光的映照下，每一張都完全像薔薇花。感到了某種東西的好意。
```

**ch04_cafe_incest:**
```
type: narration 走進咖啡廳，坐在最裡面的桌前等咖啡。對面坐著一對似乎是親子的男女。
type: narration 兒子比「僕」年輕，但長得幾乎一模一樣。而且他們像戀人一樣湊近了臉在說話。
type: inner  漸漸意識到——至少兒子在性的層面也意識到自己給予了母親慰藉。
type: inner  那無疑是「僕」也有記憶的親和力。同時也無疑是——把現世變成地獄的某種意志。
```

**ch04_merimee:**
```
type: narration 怕再次陷入苦痛，恰好咖啡送來了，翻開 Mérimée 的書信集。
type: inner  他在書信中也像小說裡一樣閃爍著鋭利的格言。那些格言不知何時使「僕」的心像鐵一樣堅固了。
type: inner  （這種容易受影響也是「僕」的弱點之一。）
type: narration 喝完一杯咖啡後，帶著「什麼都來吧」的心情，大步走出了咖啡廳。
```

### 第二段：街頭偶遇（scenes 6–10）

原文段落：Beethoven 肖像→舊友（兒子自殺）→斷髮孕婦→痔瘡→硫黄幻嗅

| ID | 類型 | 原文對應 | 選擇 |
|----|------|----------|------|
| `ch04_beethoven` | auto | 走在街上看櫥窗。額縁屋裡掛著 Beethoven 肖像——髮髮倒豎、天才本人的樣子。「僕」覺得滑稽。 | — |
| `ch04_old_friend` | choice | 遇到高中以來的舊友——應用化學教授。大皮包、一隻眼睛血紅。他的兒子自殺未遂。因為一個「令人生厭的傢伙」。「做父親的自然如此。」 | **C2** |
| `ch04_ugly_woman` | auto | 不到十分鐘又獨自走在路上。迎面來了一個斷髮的女人。遠看很美，近看滿臉小皺紋而且醜陋。而且好像懷孕了。不由得別過臉去。 | — |
| `ch04_hemorrhoids` | auto | 轉進大馬路，開始感到痔的疼痛。除了坐浴沒有別的治法。 | — |
| `ch04_beethoven_bath` | choice | 「坐浴——Beethoven 也坐浴。……」硫黄的氣味忽然襲來。但路上當然哪裡都沒有硫黄。想起紙屑薔薇，努力穩住腳步。 | **C3** |

**C2：舊友的兒子**
- A)「聽完他的話——父親為兒子復仇是理所當然的嗎？」→ +insight, notebook `ch04.friend_son`, flag `ch04.heard_friend`
- B)「匆匆道別，不想再聽下去。」→ flag `ch04.fled_friend`

**C3：硫黄的幻嗅**
- A)「追蹤這個氣味——明明哪裡都沒有硫黄。嗅覺也開始產生幻覺了嗎？」→ +insight, nerve −1, notebook `ch04.phantom_sulfur`, flag `ch04.traced_smell`
- B)「想起紙屑薔薇的好意，努力穩住腳步。」→ flag `ch04.held_steady`

#### 原文 text blocks

**ch04_old_friend:**
```
type: narration 忽然遇到了高中以來的舊友。這位應用化學的大學教授抱著大皮包，一隻眼睛血紅。
type: dialogue  speaker:舊友 「どうです、この頃は？」 cn:「最近怎麼樣？」
type: dialogue  speaker:你 「不相変です。あなたは？」 cn:「老樣子。你呢？」
type: dialogue  speaker:舊友 「わたしも不相変です。しかし……」 cn:「我也老樣子。不過……」
type: narration 他的兒子自殺未遂。原因是某個「令人生厭的傢伙」。
type: dialogue  speaker:舊友 「虫の好かん奴でしてね、息子にはまるで暴君です」 cn:「就是個討人厭的傢伙，對我兒子簡直是個暴君。」
type: dialogue  speaker:你 「そう云う奴は殺してもいいですね」 cn:「那種傢伙殺了也行吧。」
type: dialogue  speaker:舊友 「父親なら当り前だ」 cn:「做父親的自然如此。」
```

**ch04_beethoven_bath:**
```
type: inner  「坐浴——Beethoven 也坐浴。……」
type: narration 坐浴用的硫黄氣味忽然襲來。但路上當然哪裡都看不見硫黄。
type: inner  想起了紙屑薔薇，努力穩住腳步向前走。
```

### 第三段：房間・電話・鏡（scenes 11–16）

原文段落：寫作狂潮→誇大妄想→電話→モオル→Mole→la mort→鏡中微笑

| ID | 類型 | 原文對應 | 選擇 |
|----|------|----------|------|
| `ch04_writing_frenzy` | auto | 一小時後，在房間裡開始寫新小說。筆在稿紙上飛速奔跑。但兩三小時後就像被什麼看不見的東西壓住一樣停了。 | — |
| `ch04_megalomania` | choice | 在房間裡來回走。誇大妄想最為劇烈的時刻：「僕」既無父母、也無妻子——只有從筆尖流出的生命。 | **C4** |
| `ch04_phone` | auto | 四五分鐘後，不得不去接電話。無論怎麼回答，對方只是反覆傳達某個曖昧的字。聽起來像「モオル」。 | — |
| `ch04_mole` | choice | 放下電話，在房間裡來回走。但「モオル」這個字一直縈繞不去。 | **C5** |
| `ch04_la_mort` | auto | Mole 是英語的鼴鼠。不愉快。但兩三秒後——把 Mole 重新拼成了 la mort。La mort——法語的「死」。死正像逼近姊夫那樣逼近著「僕」。 | — |
| `ch04_mirror` | choice | 但恐懼中又感到某種可笑。而且不知何時在微笑了。這可笑從何而來？久違地站在鏡前，正面對著自己的影子。 | **C6** |
| `ch04_ending` | auto | 結束。 | — |

**C4：誇大妄想**
- A)「沈浸在這野蠻的歡愉中——只有筆尖流出的生命。」→ +writing, notebook `ch04.pen_life`, flag `ch04.embraced_mania`
- B)「意識到這是病態，強迫自己坐回桌前。」→ flag `ch04.resisted_mania`

**C5：モオル的語言滑移**
- A)「追蹤這條聯想鏈——Mole→鼴鼠→la mort→死。」→ +insight, nerve −1, notebook `ch04.mole_mort`, flag `ch04.traced_mole`
- B)「拒絕去想。只是一通聽錯的電話。」→ flag `ch04.rejected_mole`

**C6：鏡中的微笑**
- A)「盯著鏡中微笑的自己——這可笑從何而來？」→ +insight, notebook `ch04.mirror_smile`, flag `ch04.faced_mirror`
- B)「轉身離開鏡子。」→ flag `ch04.left_mirror`

#### 原文 text blocks

**ch04_writing_frenzy:**
```
type: narration 一小時後，在房間裡坐在窗前的桌子前，開始寫新的小說。
type: narration 筆連自己都覺得不可思議地在稿紙上飛速奔跑。但兩三小時後，像是被什麼看不見的東西壓住一樣停了下來。
```

**ch04_megalomania:**
```
type: narration 不得不離開桌子，在房間裡來回走動。
type: inner  誇大妄想在這種時候最為劇烈。在野蠻的歡愉中，感到「僕」既無父母、也無妻子——只有從筆尖流出的生命。
```

**ch04_mole:**
```
type: narration 放下電話，又在房間裡走來走去。但「モオル」這個字怎麼也揮不去。
type: inner  「モオル——Mole……」
type: inner  Mole 是英語的鼴鼠。這聯想也不令人愉快。
type: inner  但兩三秒後，把 Mole 重新拼成了 la mort。
type: inner  La mort——法語的「死」。死正像逼近姊夫那樣逼近著「僕」。
type: inner  但恐懼中又感到某種可笑。而且不知何時在微笑了。
```

**ch04_mirror:**
```
type: inner  這可笑從何而來？——連自己也不明白。
type: narration 久違地站在鏡前，正面對著自己的影子。
```

**ch04_ending:**
```
type: break
type: system  「第四章「まだ？」 終」
```

---

## Connections

| ID | requires | title | subtitle | icon | insightGain | 備註 |
|----|----------|-------|----------|------|-------------|------|
| `ch04.language_chain_3` | `ch04.mole_mort` + (CH2 `ch02.tantalus_chain`) | 言葉の三重鎖 | Worm→Tantalus→Mort | ◈ | 2 | 跨章：三條語言滑移鏈的累積 |
| `ch04.rose_and_needle` | `ch04.phantom_sulfur` + (CH3 `ch03.needle_books`) | 薔薇と針 | 好意と悪意の間 | ◇ | 1 | 跨章：CH3 書中的針 vs CH4 路上的薔薇——好意與惡意交替 |
| `ch04.affinity_web` | `ch04.affinity_hell` + `ch04.friend_son` | 親和力の網 | 愛するが故に | ✦ | 2 | 母子+父子：愛即地獄的兩個變奏 |
| `ch04.pen_mirror` | `ch04.pen_life` + `ch04.mirror_smile` | 筆と鏡 | 狂気の両面 | ◉ | 1 | 誇大妄想的歡愉＋鏡中微笑的恐懼——一體兩面 |

---

## Locations

| ID | label | sub | x | y | shape | symbolKey |
|----|-------|-----|---|---|-------|-----------|
| `ch04.hotel_room` | ホテル | 原稿 | 50 | 50 | rect | `ch04.pen_life` |
| `ch04.ginza_street` | 銀座 | 紙屑の薔薇 | 120 | 130 | diamond | — |
| `ch04.cafe` | カッフェ | 母と子 | 180 | 200 | circle | `ch04.affinity_hell` |
| `ch04.street_encounter` | 往来 | Beethoven | 240 | 280 | circle | `ch04.friend_son` |
| `ch04.room_phone` | 電話 | モオル | 290 | 350 | rect | `ch04.mole_mort` |

---

## Nerve / Insight / Writing 曲線

CH3 結束時典型範圍：nerve 3–6, insight 6–16, writing 3–5

### CH4 設計

| 軸 | 全章範圍 | 設計理由 |
|----|----------|----------|
| nerve | −1 ~ −2 | 本章有短暫的 Mérimée 高峰，nerve 下降較緩。但 la mort 和幻嗅是真正的打擊。 |
| insight | +2 ~ +5 | 親和力、硫黄幻嗅、語言滑移、鏡中微笑——被動但密集的洞察。 |
| writing | +1 ~ +2 | 本章「僕」實際動筆寫了兩篇（完成一篇+開始一篇），是全作品中 writing 最活躍的章節。 |

### 逐場景數值

| 場景 | nerve | insight | writing | 條件 |
|------|-------|---------|---------|------|
| ch04_manuscript | — | — | +1 | 固定（寫完短篇） |
| ch04_cafe_incest C1A | — | +1 | — | 選擇凝視 |
| ch04_old_friend C2A | — | +1 | — | 選擇聆聽 |
| ch04_beethoven_bath C3A | −1 | +1 | — | 選擇追蹤幻嗅 |
| ch04_megalomania C4A | — | — | +1 | 選擇沈浸 |
| ch04_mole C5A | −1 | +1 | — | 選擇追蹤語言鏈 |
| ch04_mirror C6A | — | +1 | — | 選擇面對鏡子 |
| connections | — | +1~+6 | — | 視形成數量 |

---

## Notebook 新增條目

| key | symbol | desc（待精修） | 觸發 |
|-----|--------|---------------|------|
| `ch04.affinity_hell` | book | 咖啡廳的母子——「僕」也有記憶的親和力。現世即地獄 | C1A |
| `ch04.friend_son` | gear | 舊友的兒子自殺未遂。「做父親的自然如此。」 | C2A |
| `ch04.phantom_sulfur` | gear | 硫黄的幻嗅——路上沒有硫黄，但「僕」聞到了 | C3A |
| `ch04.pen_life` | wing | 誇大妄想的頂點：既無父母也無妻子，只有筆尖流出的生命 | C4A |
| `ch04.mole_mort` | book | モオル→Mole→la mort。死像逼近姊夫那樣逼近了 | C5A |
| `ch04.mirror_smile` | gear | 鏡中微笑的自己。恐懼中的可笑——從何而來？ | C6A |

### Symbols 更新

需在 `src/data/symbols.js` 的 `SYMBOL_GLYPHS` 新增：

```js
"ch04.affinity_hell":   { glyph: "📖", label: "親和力・地獄" },
"ch04.friend_son":      { glyph: "⚙️", label: "旧友・息子" },
"ch04.phantom_sulfur":  { glyph: "⚙️", label: "硫黄・幻嗅" },
"ch04.pen_life":        { glyph: "🪽", label: "筆の命" },
"ch04.mole_mort":       { glyph: "📖", label: "Mole・la mort" },
"ch04.mirror_smile":    { glyph: "⚙️", label: "鏡・微笑" },
```

---

## Portraits

| speakerId | 角色 | 首次出現 | 備註 |
|-----------|------|----------|------|
| `ch04_old_friend` | 舊友（化學教授） | ch04_old_friend | **新增**——片目血紅、大皮包 |
| `protagonist` | 主角 | 對話場景 | 無立繪（慣例） |

---

## 待劇本編輯器處理

| 欄位 | 說明 |
|------|------|
| `text[]` 的精確分段 | 上面的 text blocks 是段落對照，需要逐句校對原文並分割成 TextBlock 陣列 |
| `dialogue.jp` | 需要從原文精確提取，含振假名標記（ruby） |
| `dialogue.cn` | 中文翻譯需要月月撰寫 |
| `effectFn` | 動態效果的具體條件實作 |
| `condition` | 條件選項的 state 判斷函式 |

---

## 開放問題

1. **紙屑薔薇**——是否作為 notebook 固定條目？這是全章唯一正面的意象，但玩家沒有選擇的餘地。（建議：固定觸發，但不設選擇點）
2. **Beethoven**——在額縁屋和坐浴中出現兩次。是否合為一個 notebook？（建議：坐浴含幻嗅更重要，Beethoven 本身只是背景）
3. **斷髮孕婦**——「遠看美、近看醜且懷孕」——是否值得 notebook？（建議：不設，這是一閃而過的印象，但增加了全章「美醜交替」的節奏）
4. **電話中的「モオル」**——原文中電話那頭說的是什麼？是否需要暗示某個具體的人打來？（建議：保持原文的曖昧——重點是「僕」聽到的音節）
5. **CH4→CH5 銜接**——CH5「赤光」開頭「僕」在房間裡拉上窗簾用電燈工作。時間上是 CH4 的同一天或隔天？
