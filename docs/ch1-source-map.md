# CH1 原文回填地圖（Batch F2 施工圖）

> 狀態：規劃定案（2026-07-12，Fable）。工兵逐場景照做，不需自行決策。
> 底本：`reference/aozora/haguruma_original.txt`（下稱 B，引用格式 B:L行號）。CH1 = B:L13–L117。
> 目標：CH1 fidelity coverage ≥ 99%，`npm run validate:fidelity` 零 error，全部 text block 都有 origin。

## 0. 全域政策（先讀完再動工）

1. **jp 一律從 B 逐字複製**（用編輯器複製，不准手打、不准憑記憶）。句読点、踊り字、假名遣い（ふる/降る 混用是原文原樣）、噓（非嘘）、半形 All right——全部以 B 為準。句尾是 `」` 就不是 `。」`。
2. **正規化只容忍空白差異**：全形/半形空格、換行不影響比對，其餘一字不差。
3. **部分引用去外層括號**：引用台詞的一部分時，jp 不含 `「」`（否則非底本子字串）。整句引用才帶 `「」`。
4. **cn 政策**：維持既有「你」二人稱沉浸式改寫（jp 原文保真在上）。既有 cn 準確者沿用；本圖指名的錯譯要修；新回填句的 cn 由工兵新譯（芥川式短句，語域對齊既有 cn）。
5. **正典分歧原則**：原文中「僕」實際做的事＝正典選項，其後場景收錄原文；偏離選項的分支內容標 `origin:"added"`。
6. **added dialogue 禁令的既有例外**：`auto_allright_corridor` 的 `{jp:"", cn:"\"All right.\""}` 獨立對話 beat 保留、標 `origin:"added"`（原文該句嵌在地の文，地の文本身另以 source 收錄，不算替角色編台詞）。
7. 完成每一批後必跑：`npm run validate:fidelity`（不得有 E1/E2/E3）、`npm run validate:chapters`、`npm test`。
8. 不 commit。不動 chapter02.js。

## 1. 場景逐一指示

格式：`場景 id` → 每個 block 的處置。「轉source(B:Lx, 起…訖)」= 該 block 改為 `origin:"source"`，jp 取 B 該行從「起」錨點到「訖」錨點（含兩端）的連續文字；cn 沿用或按指示修。「標added」= 加 `origin:"added"`，內容不動（除非指示）。「新增source」= 插入新 block。

### prologue
- n1「冬日。你提著…」→ 轉source(B:L13, 僕は或知り人…自動車を飛ばした。)。cn 修：「某位友人」→「某個熟人」；刪 cn 開頭自加的「冬日。」（原文無）。
- n2「道路兩旁…」→ 轉source(B:L13, 自動車の走る道…違いなかった。)
- n3「車上除了你…」→ 轉source(B:L13, 自動車には丁度…時々彼と話をした。)
- system×2、break 不動（結構块）。

### auto_barber
- d1 幽靈台詞 → 轉source(B:L15 整行含括號)。**句尾是 が」不是 が。」**。
- **新增source** dialogue（speaker「你」, speakerId "protagonist"）jp=B:L17 整行「昼間でもね」，插在 d1 之後。cn 新譯（如「就算白天也？」）。
- n1「你看著對面…」→ 轉source(B:L19, 僕は冬の西日…調子を合せていた。)
- d2「尤も…」→ 轉source(B:L21 整行)。**雨のふる日（假名）**，句尾 が」。
- choice A「下雨天出來…」：加 `sourceJp`=B:L23 整行。choice B 不動。

### auto_barber_2（動態 text，維持函式結構）
- joke 分支：**新增source** dialogue（你）jp=B:L23 整行（選項選了之後原文台詞完整入正文），再接主人 d → 轉source(B:L25 整行)。
- silent 分支：added narration「理髮店主人見你沉默…」→ 標added；主人 d → 轉source(B:L25, 部分引用去括號：しかしレエン・コオト…云うんです)。
- 尾段 n「汽車鳴著喇叭…」→ 轉source(B:L27, 自動車はラッパ…はいって行った。)
- 尾段 n「果然——上行列車…」→ 轉source(B:L27, すると果して…出たばかりだった。)

### auto_station
- n1「候車室的長椅上…」→ 轉source(B:L27, 待合室のベンチには…眺めていた。)
- inner「你想起了…」→ 轉source(B:L27, 僕は今聞いたばかりの…はいることにした。)

### station_observe
- 全部 block 標added（互動擴寫，原文無此駐留描寫）。

### auto_cafe
- n1 → 轉source(B:L29, それはカッフェ…註文した。)
- n2 → 轉source(B:L29, テエブルにかけた…見まわした。)（注意這段含「膠臭いココア」句，cn 已涵蓋）
- n3「還有一張…」→ 拆兩塊：轉source(B:L29, 埃じみたカッフェの壁…貼ってあった。) ＋ **新增source** narration jp=B:L31 整行「地玉子、オムレツ」（含括號）。cn 沿用「還有一張：『地玉子、オムレツ』」拆配。

### cafe_signs
- n1 → 轉source(B:L33, 僕はこう云う紙札…通る田舎だった。……)（整行到刪節號）。
- inner「電氣機關車通過…留下了什麼」→ 標added。

### auto_train_3rd
- n1 → 轉source(B:L35 整行)
- n2 → 轉source(B:L37 整行)
- d1 写真屋さん → 轉source(B:L39 整行)（已相符，仍逐字重抄覆核）
- n3「隨隊的…微笑了一下」→ 轉source(B:L41, やはり遠足について…いられなかった。)
- n4「你旁邊坐著的…」→ 轉source(B:L41, それから又僕の隣りに…話しかけていた。)
- d2 可愛いわね → 轉source(B:L43 整行)。**句尾 わね」不是 わね。」**。

### train_mature_girl
- **新增source** narration（插最前）jp=B:L45, 彼等は僕には…剥いていることを除けば。……。cn 新譯（「一人前の女」觀察段，先前被刪）。
- n1「年紀較大的…」→ 轉source(B:L45, しかし年かさらしい…踏んだと見え、)（部分引用，句中斷點）。
- d 御免なさいまし → 轉source(B:L45, 部分引用含括號：「御免なさいまし」)。
- inner「她比其他人更早熟…」→ 轉source(B:L45, と声をかけた。彼女だけは…行かなかった。)，type 改 narration（原文為地の文）。cn 開頭補「——她這麼說了。」承接 と声をかけた。

### auto_train_to_t
- n1 → 轉source(B:L47, いつか電燈を…待つことにした。)
- n2「在那裡，你偶然遇到…」→ 轉source(B:L47, すると偶然…Ｔ君だった、)（注意句尾是読点「、」，原文如此）
- n3「你們在等電車…」→ 轉source(B:L47, 僕等は電車を…嵌まっていた。)
- **新增source** dialogue（你）jp=B:L49 整行「大したものを嵌めているね」。cn 新譯。
- d1 T君戒指 → 轉source(B:L51 整行)。**還原後半（そいつも今は往生している。…）、ハルビン、のだよ**。cn 沿用（本來就譯了全句）。
- n4「省線電車幸好…」→ 轉source(B:L53 整行)。cn 修：「巴黎的分公司」→「巴黎的任職處」。
- **新增source** dialogue（T 君）jp=B:L55 整行（仏蘭西は存外…）＋ **新增source** dialogue（你）jp=B:L57 整行（だってフランは暴落するしさ）＋ **新增source** dialogue（T 君）jp=B:L59 整行（それは新聞を…大洪水があるから）。三句 cn 新譯。插在 n4 之後（巴黎話題自然接續）。

### auto_train_t_raincoat
- n1「這時——一個穿雨衣…」→ 轉source(B:L61, するとレエン・コオト…腰をおろした。)
- inner「你感到一瞬間的不安…」→ 轉source(B:L61, 僕はちょっと無気味に…心もちを感じた。)
- n2「但 T 君搶先…」→ 轉source(B:L61, が、Ｔ君はその前に…話しかけた。)
- d1 → 轉source(B:L63 整行)。**ショオル**（非ショール）。
- **新增source** dialogue（你）jp=B:L65 整行「あの西洋髪に結った女か？」（先前被刪的主角句）。cn 新譯。
- d2 → 轉source(B:L67 整行)。**還原句首（うん、風呂敷包みを抱えている女さ。）與 洒落れた**。
- n3「但眼前的她…」→ 轉source(B:L69 整行)
- **新增source** dialogue（T 君）jp=B:L71 整行（軽井沢にいた時には…何と云うやつかね），插在 n3 之後、choice 之前。cn 新譯（raincoat_gone_passive 現有的中文轉述搬來用）。

### raincoat_gone
- n1 → 轉source(B:L73, レエン・コオトを着た男は…いなくなっていた。)。cn 沿用。

### raincoat_gone_passive
- n1 改寫：刪掉 T 君轉述（已上移至 auto_train_t_raincoat），只留 → 轉source(B:L73, レエン・コオトを着た男は…いなくなっていた。)，cn 同 raincoat_gone。

### auto_walk_gears
- n1「你提著皮箱…」→ 轉source(B:L73, 僕は省線電車の…ビルディングだった。)
- n2「走著走著…松林」→ 轉source(B:L73, 僕はそこを歩いている…思い出した。)
- n3「然後——你的視野…」→ 轉source(B:L73, のみならず僕の視野の…見つけ出した。)
- pause 不動。
- n4「半透明的齒輪…」→ 轉source(B:L73, 妙なものを？――と云うのは…歯車だった。)
- inner「你以前也有過…」→ 轉source(B:L73, 僕はこう云う経験を…同じことだった。)
- **新增source** narration jp=B:L73, 眼科の医者はこの錯覚（？）の…見えないことはなかった。（先前被刪的眼科醫/節煙段）。cn 新譯。

### gears_test（正典分支）
- **新增source** narration（插最前）jp=B:L73, 僕は又はじまったなと思い…塞いで見た。
- n1「左眼沒事。」→ 轉source(B:L73, 左の目は果して何ともなかった。)
- n2「但右眼瞼…」→ 轉source(B:L73, しかし右の目の瞼の裏には…まわっていた。)。cn 修（原文無「不止一個。它們的數量正在增加」，這兩句挪為 added inner 或刪除——**決定：刪除**，數量增加已在前面 inner 講過）。
- n3「你看著右邊…」→ 轉source(B:L73, 僕は右側のビルディングの…歩いて行った。)

### gears_endure（偏離分支）
- n1 標added。

### auto_hotel_arrive
- n1 拆兩塊：轉source(B:L75, ホテルの玄関を…とって貰うことにした。) ＋ 轉source(B:L75, それから或雑誌社へ…相談した。)
- n2「結婚披露宴的晚餐…」→ 轉source(B:L77, 結婚披露式の晩餐は…始まっていたらしかった。)

### auto_banquet
- n1 → 轉source(B:L77, 僕はテエブルの隅に…いずれも陽気だった。)
- inner「但你的心情…」→ 轉source(B:L77, が、僕の心もちは…なるばかりだった。)
- n2 → 轉source(B:L77, 僕はこの心もちを…落ちて行った。)
- d1 麒麟 → 轉source(B:L79 整行)（覆核逐字）。
- n3「漢學家似乎…」→ 轉source(B:L81, この名高い漢学者は…感じているらしかった。)
- inner「你在機械性地…破壞慾」→ 標added（原文後半含堯舜句，留給正典分支收錄，此處只是互動鋪陳）。

### banquet_destroy（正典分支）
- **新增source** narration（插最前）jp=B:L81, 僕は機械的にしゃべっている…話し出した。cn 新譯（含堯舜/春秋內容——選項文字已預告，此處是原文正錄）。
- n1「漢學家露骨地…」→ 轉source(B:L81, するとこの漢学者は…截り離した。)
- d1 堯舜 → 轉source(B:L83 整行)。**噓（U+5652）非嘘；句尾 ない」非 ない。」**。
- n2「你當然沉默了。」→ 轉source(B:L85, 僕は勿論黙ってしまった。)

### banquet_calm（偏離分支）
- 全部標added。

### auto_banquet_worm
- n1「你重新拿起刀叉…」→ 轉source(B:L85, それから又皿の上の肉へ…加えようとした。)
- n2「一隻小蛆蟲…」→ 轉source(B:L85, すると小さい蛆が…蠢めいていた。)
- inner「蛆——Worm…」→ 轉source(B:L85, 蛆は僕の頭の中に…違いなかった。)
- n3「你放下了刀叉…」→ 轉source(B:L85, 僕はナイフやフォオクを置き…眺めていた。)

### worm_trace
- inner 標added（龍＝worm 古義是延伸詮釋，原文無）。

### auto_hotel_night
- n1 → 轉source(B:L87 整行三句)
- n2「房間裡，皮箱…」→ 轉source(B:L89, 僕の部屋には鞄は…持って来てあった。)
- n3「——掛在牆上的外套…」→ 轉source(B:L89, 部分引用：僕は壁にかけた外套に僕自身の立ち姿を感じ、)

### 【新增場景】hotel_coat_hide（sceneCount 33→34）
- choice A「急忙把外套塞進…」的 next 由 auto_hotel_mirror 改為 hotel_coat_hide。
- 場景內容：單一 source narration jp=B:L89, 急いでそれを部屋の隅の…抛りこんだ。cn 新譯。next="auto_hotel_mirror"，其餘欄位 null/[]。
- id 命名豁免同 CH1 慣例（無前綴）。

### hotel_coat_stare
- n1「它就掛在那裡…」→ 標added。
- n2「……你終於走上前去…」→ 轉source(B:L89, 急いでそれを…抛りこんだ。)（與 hotel_coat_hide 同句，兩分支各見一次，不重複）。cn 沿用語意但對齊原文（「急忙」要有）。

### auto_hotel_mirror
- n1「你走到梳妝台前…」→ 轉source(B:L89, それから鏡台の前へ…顔を映した。)
- n2「鏡中映出的…」→ 轉source(B:L89, 鏡に映った僕の顔は…露わしていた。)
- inner「蛆蟲的記憶…」→ 轉source(B:L89, 蛆はこう云う僕の記憶に…浮び出した。)
- n3「你打開門走進走廊…」→ 轉source(B:L91, 僕は戸をあけて…映っていた。)
- inner2「這盞燈讓你…」→ 轉source(B:L91, それは何か僕の心に…与えるものだった。)
- n4「你在燈前的椅子…」→ 轉source(B:L91, 僕はその前の椅子に…行かなかった。)

### auto_raincoat_3
- n1「因為你身旁的長椅…」→ 轉source(B:L91, レエン・コオトは今度もまた…脱ぎかけてあった。)
- inner「而且現在是嚴冬。」→ 轉source(B:L93 整行含括號「しかも今は寒中だと云うのに」)
- choice A「嘗試連結…」文字修剪劇透：改為「雨衣。又是雨衣。——這是第幾次了？」（不替讀者數次數）。

### raincoat_link
- 動態兩態全部標added（連結機制文本）。

### auto_allright_corridor
- n1「你沿著走廊往回走…」→ 轉source(B:L95, 僕はこんなことを考えながら…見えなかった。)
- n2「但他們的說話聲…一句英語」→ 轉source(B:L95, しかし彼等の話し声は…英語だった。)
- pause 不動；d「All right.」→ 標added（政策 §0-6）。
- inner「「All right」？你不知不覺…」→ 轉source(B:L95, 「オオル・ライト」？――僕はいつか…なのであろう？)

### allright_puzzle
- 全部標added。

### auto_room_writing
- n1「房間很安靜…」→ 拆：轉source(B:L97, 僕の部屋は勿論…はいって行った。) ＋ 轉source(B:L97, それから鏡を見ないようにし…安楽椅子だった。)
- n2「你打開皮箱…」→ 轉source(B:L97, 僕は鞄をあけて…動かなかった。)
- n3「好不容易動了…」→ 轉source(B:L97, のみならずやっと動いた…書きつづけていた。)
- inner「All right…… All right……」→ 轉source(B:L97, All right……All right……All right sir……All right……)。**sir 前無逗號**。cn 直接同文（英語不譯）。

### auto_phone
- n1「——突然，床邊的電話…」→ 轉source(B:L99, そこへ突然鳴り出した…電話だった。)
- n2「你驚得站起來…」→ 轉source(B:L99, 僕は驚いて立ち上り…返事をした。)
- d 你「どなた？」→ 轉source(B:L101 整行)
- d 姪女「あたしです。…」→ 轉source(B:L103 整行)
- n3「是你姊姊的女兒。」→ 轉source(B:L105 整行)
- **新增source** dialogue（你）jp=B:L107 整行「何だい？　どうかしたのかい？」（先前被刪）。cn 新譯。
- d 姪女大へんなこと → 轉source(B:L109 整行)。**逐字：ですから、……大へんなことが起ったもんですから。今叔母さんにも…（句点在ですから後）；句尾 です」**。
- d 你「大へんなこと？」→ 轉source(B:L111 整行)
- d 姪女すぐに → 轉source(B:L113 整行)。句尾 ですよ」。
- n4「電話就此斷了。」→ 轉source(B:L115, 電話はそれぎり切れてしまった。)
- n5「你掛上聽筒…反覆按著門鈴——」→ 拆：轉source(B:L115, 僕はもとのように…意識していた。) ＋ 轉source(B:L115, 給仕は容易に…鈕を押した。)

### auto_allright_resolve（動態，維持函式）
- pondered 分支 inner → 轉source(B:L115, やっと運命の僕に教えた…了解しながら。)，cn 沿用語意「——你終於理解了命運教給你的那句『オオル・ライト』」。
- 非 pondered 分支：同一 source block ＋ 現有解釋句「你現在明白了。All right——…」標added 放在 source 之後。
- n1「你姊姊的丈夫…」→ 轉source(B:L117, 僕の姉の夫はその日の午後…轢死していた。)
- n2「而且穿著…」→ 轉source(B:L117, しかも季節に縁のない…ひっかけていた。)

### auto_ending
- n1「你仍然在這間旅館…」→ 轉source(B:L117, 僕はいまもそのホテルの…誰も通らない。)
- n2「但偶爾——門外…」→ 轉source(B:L117, が、時々戸の外に…かも知れない。)
- system 不動。

## 2. 附帶修正（同批處理）

1. chapter01.js 檔頭 URL 錯誤：`42377_15163.html` → `42377_34745.html`，並加註底本檔案路徑。
2. `sceneCount: 33` → `34`（新增 hotel_coat_hide）。
3. `docs/DECISIONS.md` 追加 **D11**：「cn 維持二人稱『你』的沉浸式改寫；原文保真由 jp 欄位＋fidelity 工具承擔；cn 定位為『改編譯文』。待月月最終確認，如推翻則全 cn 改一人稱重譯。」
4. `docs/DEV-LOG.md` 追加本批條目。
5. README「第二至十一章」→「第二至六章」（README:141 順手修，其餘 11 章殘留留給文件清理批）。

## 3. 批次切分（單工序作業，不並行——同檔連續編輯）

- **F2-1**：prologue～train_mature_girl（§1 前 9 場景）→ 跑三驗證
- **F2-2**：auto_train_to_t～auto_hotel_arrive（中 8 場景＋新增巴黎對話/眼科段）→ 跑三驗證
- **F2-3**：auto_banquet～auto_ending（後 17 場景＋新增 hotel_coat_hide）＋ §2 附帶修正 → 跑三驗證
- 每批 fidelity 必須零 error；全部完成後 CH1 coverage 應 ≥ 99%（若低於，列出未覆蓋區間逐一補齊或說明）。
