# 第二章「復讐」 Chapter Spec

> 設計初稿。場景文本為佔位符，待劇本編輯器填入正式原著文本。
> Source: 芥川龍之介《歯車》二「復讐」
> 青空文庫 https://www.aozora.gr.jp/cards/000879/files/42377_15163.html

---

## 概要

| 項目 | 值 |
|------|------|
| chapter | 2 |
| title | 復讐 |
| titleCn | 復仇 |
| startScene | ch02_dawn |
| startLocation | ch02.hotel_morning |
| 預估場景數 | ~28 |
| 預估選擇點 | ~9 |
| 預估 connections | 4 |

## 主題

第一章的「雨衣」是反覆出現的不祥符號；第二章的「復讐」則是一個概念——死者對生者的報復。姊夫臥軌自殺身亡，穿著與季節不符的雨衣。他的死是事故、自殺、還是對妻子的復仇？主角在這一章被迫直面死亡的細節，同時自身的精神狀態持續惡化。

核心張力：
- **外在事件**：姊夫之死的真相逐步揭露
- **人際觀察**：姊姊的冷靜、姪女的慌張、家族的反應
- **內在瓦解**：齒輪再現、偏頭痛加劇、「All right」的餘音

## 與 CH1 的銜接

### carryOver state（D3）

從 CH1 帶入的：
- `notebook` — 所有 CH1 筆記（raincoat_station, raincoat_train, raincoat_hotel, raincoat_death, gear_first, book_worm, wing_corridor 等，視玩家選擇而定）
- `choicesMade` — 所有 CH1 flag（pondered_allright, observed_raincoat_1, etc.）
- `connections` — CH1 已形成的連結
- `nerve` / `insight` / `writing` — 數值延續

### 重置的（D4）

- `journey` — 全部重置，使用 CH2 自己的 locations
- `currentSceneId` / `currentChapter` — 由 `createChapterState` 設定

### CH1 flag 依賴

以下 CH1 flag 會影響 CH2 動態文本：

| CH1 flag | CH2 效果 |
|----------|----------|
| `pondered_allright` | 序場景：主角回想 All right 的含義時有額外內心獨白 |
| `observed_raincoat_1` | 得知姊夫穿雨衣時，觸發更強的既視感反應 |
| `checked_raincoat_2` | 同上，疊加 |
| `traced_worm` | 與漢學家對話的回憶在 CH2 火災場景產生聯想 |
| `stared_coat` | 旅館房間場景有額外內心描寫 |

---

## 場景清單

### 第一段：翌朝・旅館（scenes 1–5）

| ID | 類型 | 用途 | 選擇 |
|----|------|------|------|
| `ch02_dawn` | auto | 翌朝。主角在旅館醒來，頭痛殘餘。昨晚姪女的電話仍在腦中。 | — |
| `ch02_newspaper` | auto | 早報上登了一則轢死事故的報導。地點、時間——與昨晚的電話吻合。 | — |
| `ch02_newspaper_react` | choice | 讀完報導後的反應。 | **C1** |
| `ch02_checkout` | auto | 退房，叫車前往姊姊家。 | — |
| `ch02_car_ride` | auto | 車中。街景掠過窗外。主角回想 CH1 的車程（對比開場）。 | — |

**C1：讀完報導的反應**
- A)「反覆讀那一段——穿著雨衣。」→ +insight, notebook `ch02.newspaper_raincoat`, flag `ch02.reread_article`
- B)「把報紙折好放下。已經知道了。」→ flag `ch02.skipped_article`

### 第二段：姊姊的家（scenes 6–14）

| ID | 類型 | 用途 | 選擇 |
|----|------|------|------|
| `ch02_arrival` | auto | 到達。門口的氣氛。姪女迎出來，眼圈紅的。 | — |
| `ch02_niece_talk` | choice | 姪女在玄關低聲說了事情的經過。 | **C2** |
| `ch02_hallway` | auto | 穿過走廊。注意到家中的氣氛不像是悲傷，更像是某種壓抑的緊張。 | — |
| `ch02_sister_meet` | auto | 見到姊姊。她出乎意料地冷靜——甚至帶著一絲解脫。 | — |
| `ch02_sister_react` | choice | 對姊姊態度的反應。 | **C3** |
| `ch02_details` | auto | 姊姊平靜地敘述：他是在下午臥軌的。穿著那件雨衣。遺書沒有。 | — |
| `ch02_raincoat_shock` | auto (dynamic) | 「雨衣」這個詞擊中了主角。動態文本：根據 CH1 是否觀察過雨衣男人，反應強度不同。 | — |
| `ch02_mistress` | choice | 姊姊提到了丈夫的愛人。語氣平靜得像在說別人的事。 | **C4** |
| `ch02_revenge_concept` | auto | 姊姊說出了那個詞——「復讐」。他的死，是對她的復仇。 | — |

**C2：姪女的述說**
- A)「耐心聽完，追問細節。」→ +insight, flag `ch02.pressed_niece`
- B)「安撫她，不追問。」→ flag `ch02.comforted_niece`

**C3：對姊姊態度的反應**
- A)「觀察她的表情——這不是悲傷。」→ +insight, notebook `ch02.sister_composure`, flag `ch02.observed_sister`
- B)「不去評判。她有她的立場。」→ flag `ch02.neutral_sister`

**C4：關於愛人的反應**
- A)「你知道那個人是誰？」→ flag `ch02.asked_mistress`, 觸發額外場景 `ch02_mistress_detail`
- B)「沉默。」→ flag `ch02.silent_mistress`

### 第三段：火事（scenes 15–19）

| ID | 類型 | 用途 | 選擇 |
|----|------|------|------|
| `ch02_mistress_detail` | auto | （條件場景，僅 C4A 觸發）姊姊簡短描述愛人的身分。語氣仍然是平靜的。 | — |
| `ch02_garden` | auto | 走到庭院透氣。冬天的庭院。遠處有煙。 | — |
| `ch02_fire` | auto | 附近起火了。消防車的聲音。火光映在冬天的天空上。 | — |
| `ch02_fire_react` | choice | 火災的聯想。 | **C5** |
| `ch02_fire_aftermath` | auto | 火勢被撲滅。但煙味留在空氣中。 | — |

**C5：火災的聯想**
- A)「火——另一種毀滅方式。與臥軌不同。」→ +insight, notebook `ch02.fire_destruction`, flag `ch02.linked_fire`
- B)「只是巧合。跟這件事無關。」→ flag `ch02.dismissed_fire`

### 第四段：死者的房間（scenes 20–24）

| ID | 類型 | 用途 | 選擇 |
|----|------|------|------|
| `ch02_upstairs` | auto | 上樓。姊姊領主角去看死者生前的房間。 | — |
| `ch02_room` | choice | 房間裡殘留的痕跡：書桌、書信、一件掛著的外套。 | **C6** |
| `ch02_desk` | auto | （條件：C6A）書桌上的東西。沒有遺書，但有一本翻開的書。書頁折角處——一個關於「復讐」的段落。 | — |
| `ch02_coat` | auto | （條件：C6B）那件外套。不是雨衣——雨衣已被帶走作為證物。但外套掛在那裡的姿態讓主角想起旅館夜裡掛著的自己的外套。 | — |
| `ch02_child` | auto | 從房間出來。死者的孩子——主角的甥/姪——在走廊上安靜地站著。 | — |

**C6：進入死者房間後**
- A)「走向書桌。」→ flag `ch02.checked_desk`, 進入 `ch02_desk`
- B)「注意到掛著的外套。」→ notebook `ch02.coat_echo`, flag `ch02.noticed_coat`, 進入 `ch02_coat`

> 兩條路線在 `ch02_child` 合流。

### 第五段：歸路・齒輪再現（scenes 25–28）

| ID | 類型 | 用途 | 選擇 |
|----|------|------|------|
| `ch02_farewell` | auto | 告別。姊姊送到門口。最後一句話。 | — |
| `ch02_return_car` | choice | 回程的車上。齒輪再次出現在視野中。 | **C7** |
| `ch02_gears_return` | auto (dynamic) | 齒輪場景。動態文本：CH1 是否 tested_eyes 影響主角的應對方式。 | — |
| `ch02_ending` | auto | 回到旅館。走廊上的綠色燈。主角坐下來。翅膀的聲音又響了。 | — |

**C7：車中齒輪再現**
- A)「閉上眼睛等它過去。」→ nerve −1, flag `ch02.endured_gears_2`
- B)「盯著它看——計算齒輪的數量。」→ nerve −1, +insight, notebook `ch02.gear_count`, flag `ch02.counted_gears`

---

## Connections

| ID | requires | title | subtitle | icon | insightGain | 備註 |
|----|----------|-------|----------|------|-------------|------|
| `ch02.revenge_raincoat` | `raincoat_death` + `ch02.newspaper_raincoat` | 季節外れの復讐 | 雨衣的最終意義 | ✦ | 2 | 跨章：需 CH1 `raincoat_death`（carryOver） |
| `ch02.coat_loop` | `ch02.coat_echo` + `ch02.sister_composure` | 外套的迴路 | 掛著的不在場者 | ◇ | 1 | CH2 內部 |
| `ch02.fire_revenge` | `ch02.fire_destruction` + `ch02.sister_composure` | 炎と復讐 | 毀滅的形式 | ◈ | 1 | CH2 內部 |
| `ch02.gear_progression` | `gear_first` + `ch02.gear_count` | 齒輪の増殖 | 視野が狭まる | ⚙ | 1 | 跨章：需 CH1 `gear_first`（carryOver） |

---

## Locations

| ID | label | sub | x | y | shape | symbolKey |
|----|-------|-----|---|---|-------|-----------|
| `ch02.hotel_morning` | 旅館 | 翌朝 | 50 | 50 | rect | — |
| `ch02.car_route` | 車中 | 往復 | 110 | 120 | circle | — |
| `ch02.sister_house` | 姊の家 | 郊外 | 180 | 200 | rect | `ch02.sister_composure` |
| `ch02.garden` | 庭 | 火事 | 220 | 260 | mountain | `ch02.fire_destruction` |
| `ch02.dead_room` | 死者の部屋 | 二階 | 250 | 320 | diamond | `ch02.coat_echo` |

---

## Nerve / Insight / Writing 曲線

### 設計原則

CH1 結束時的典型數值範圍（視選擇而定）：
- nerve: 5–8（起始 10，最多 −5）
- insight: 2–7
- writing: 2–4

CH2 目標：
- **nerve**：繼續下降，但更緩慢（−2 ~ −4 全章）。CH2 的恐怖是心理性的，不是突發的。
- **insight**：持續上升（+3 ~ +6），觀察與理解構成本章核心。
- **writing**：幾乎不動（+0 ~ +1），CH2 主角在行動而非書寫。

### 逐場景數值變動

| 場景 | nerve | insight | writing | 觸發條件 |
|------|-------|---------|---------|----------|
| ch02_newspaper_react (C1A) | — | +1 | — | 選擇重讀報導 |
| ch02_niece_talk (C2A) | — | +1 | — | 選擇追問 |
| ch02_sister_react (C3A) | — | +1 | — | 選擇觀察 |
| ch02_raincoat_shock | −1 | — | — | 固定（場景 effects） |
| ch02_fire_react (C5A) | — | +1 | — | 選擇聯想 |
| ch02_room (C6B) | — | — | — | 筆記但無數值 |
| ch02_return_car (C7A) | −1 | — | — | 閉眼忍受 |
| ch02_return_car (C7B) | −1 | +1 | — | 計算齒輪 |
| ch02_ending | — | +1 | — | 固定 |
| connections | — | +1~+5 | — | 視形成數量 |

**全章範圍**：nerve −2 ~ −3, insight +3 ~ +6（含 connections）, writing +0

---

## Notebook 新增條目

| key | symbol | desc（佔位） | 觸發 |
|-----|--------|-------------|------|
| `ch02.newspaper_raincoat` | raincoat | 翌朝の新聞——轢死事故，穿著雨衣 | C1A |
| `ch02.sister_composure` | book | 姊姊的冷靜——像在說別人的事 | C3A |
| `ch02.fire_destruction` | gear | 近隣の火事——另一種毀滅 | C5A |
| `ch02.coat_echo` | wing | 掛著的外套——不在場的死者 | C6B |
| `ch02.gear_count` | gear | 齒輪再現——數量在增加 | C7B |

### Symbols 更新

需在 `src/data/symbols.js` 的 `SYMBOL_GLYPHS` 新增：

```js
"ch02.newspaper_raincoat": { glyph: "🧥", label: "雨衣・新聞" },
"ch02.sister_composure":   { glyph: "📖", label: "姊姊・冷靜" },
"ch02.fire_destruction":   { glyph: "⚙️", label: "火事・毀滅" },
"ch02.coat_echo":          { glyph: "🪽", label: "外套・迴響" },
"ch02.gear_count":         { glyph: "⚙️", label: "齒輪・增殖" },
```

---

## Portraits

CH2 需要的角色立繪：

| speakerId | 角色 | 首次出現 | 備註 |
|-----------|------|----------|------|
| `niece` | 姪女 | ch02_arrival | CH1 已有立繪，複用 |
| `ch02_sister` | 姊姊 | ch02_sister_meet | **新增** |
| `ch02_child` | 死者的孩子 | ch02_child | **新增**（可能不需要，視設計） |
| `protagonist` | 主角（你） | 對話場景 | 無立繪（CH1 慣例） |

---

## 待劇本編輯器處理的欄位

以下欄位在本 spec 中為佔位或缺省，需要在劇本編輯器中填入正式內容：

| 欄位 | 說明 |
|------|------|
| `scene.text` | 所有場景的文本陣列（narration / dialogue / inner / system / break / pause） |
| `dialogue.jp` | 日文原文台詞（需對照青空文庫） |
| `dialogue.cn` | 中文翻譯台詞 |
| `dialogue.speakerId` | 精確的角色 ID 指定 |
| `choice.text` | 選項的顯示文字（目前為概述） |
| `notebook.desc` | 筆記描述的正式文字 |
| `links.fold` | 段落摺疊標題文字 |
| `scene.effectFn` | 條件式動態效果的具體實作 |

---

## 驗證條件

實作完成後需通過：

1. `npm run validate:chapters` — CH2 zero errors
2. 所有 key 遵守 `ch02.` namespace（D10）
3. 跨章 connection requires 通過 carryOver 驗證（Fix 4）
4. 全場景可達（零 deadlock、零 unreachable）
5. Playthrough simulation 22/22 到達 ending
6. nerve 不歸零（保留 CH3+ 空間）
7. 動態文本函式的 `state.choicesMade` 引用都指向有效 flag

---

## 開放問題

1. **死者的孩子**是否需要對話場景？原著中的描寫極簡，可能只需旁白。
2. **愛人的身分**是否要具體化？原著中保持模糊。
3. **火災**是否需要視覺演出（corrupt 效果）？或純旁白即可？
4. **CH2 ending 的 showEnd**：是否與 CH1 相同格式的結算畫面？
5. **CH2 → CH3 銜接**：CH3「夜」的 startScene 需要什麼 carryOver context？
