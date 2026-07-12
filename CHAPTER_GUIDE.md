# 歯車引擎 — 各章劇本設計筆記

> 原著：芥川龍之介《歯車》（1927 年，遺稿）  
> 底本：青空文庫 https://www.aozora.gr.jp/cards/000879/files/42377_34745.html  
> 用途：每章的改編要點、場景分割、符號追蹤、選擇設計思路

---

## 全書概覽

《歯車》是芥川龍之介自殺前的最後作品之一。以第一人稱記述精神崩潰的過程。全文分 6 章，沒有明確的「故事」——而是一連串日常場景中，意象反覆出現、精神逐漸瓦解的記錄。

改編為互動遊戲時，核心問題是：**如何讓「被動的閱讀」變成「主動的觀察」，但不破壞原著的文學性。**

答案：玩家的選擇不改變故事走向（原著的命運是確定的），而是改變「你看見了多少」和「你如何理解你看見的」。

---

## 第一章「レエン・コオト」（雨衣）

### 原著摘要

敘述者從避暑地趕往東京出席友人婚宴。途中：
- 理髮店主人講述穿雨衣的幽靈
- 停車場看見穿雨衣的男人
- 三等車廂的女學生們
- 遇見 T 君，省線電車上又見穿雨衣的男人
- 走路時視野出現旋轉的齒輪
- 婚宴上與漢學家的對話，以及蛆蟲
- 旅館房間，外套、鏡子、綠燈
- 第三次看見雨衣
- All right 的反覆
- 姪女來電：姊夫被火車輾死，穿著雨衣

### 場景分割

```
prologue                    冬日，皮箱，趕路
  ↓ auto
auto_barber                 理髮店主人的幽靈故事
  ↓
barber_response             [選擇] 回應方式（玩笑/沉默）
  ↓ auto
auto_barber_2               理髮店主人續（動態文本）
  ↓ auto
auto_station                停車場，穿雨衣的男人
  ↓
station_choice              [選擇] 觀察雨衣男/直走咖啡廳
  ├→ station_observe        觀察（+notebook）
  └→ cafe                   跳過（空橋接）
  ↓ auto
auto_cafe                   咖啡廳，可可，紙牌
  ↓
cafe_choice                 [選擇] 細看紙牌/喝完走人
  ├→ cafe_signs             地玉子（+writing）
  └→ train_3rd              跳過（空橋接）
  ↓ auto
auto_train_3rd              三等車廂，女學生們
  ↓
train_choice                [選擇] 觀察年長女學生/忽略
  ├→ train_mature_girl      觀察（+insight）
  └→ train_to_t             跳過
  ↓ auto
auto_train_to_t             遇到 T 君，土耳其石戒指
  ↓ auto
auto_train_t_raincoat       省線電車上的雨衣男人 + 灰色披肩女人
  ↓
raincoat_train_choice       [選擇] 注意雨衣男人/繼續聊天
  ├→ raincoat_gone          他消失了（+notebook）
  └→ raincoat_gone_passive  被動發現消失
  ↓ auto
auto_walk_gears             步行，齒輪初現（+notebook, nerve -1）
  ↓
gears_choice                [選擇] 測試右眼/低頭走
  ��→ gears_test             左眼沒事，右眼齒輪
  └→ gears_endure           忍耐
  ↓ auto
auto_hotel_arrive           旅館，頭痛，打電話
  ↓ auto
auto_banquet                婚宴，漢學家
  ↓
banquet_choice              [選擇] 破壞慾（主張堯舜虛構）/壓下
  ├→ banquet_destroy        漢學家不快（+insight, nerve -1）
  └→ banquet_calm           平穩結束
  ↓ auto
auto_banquet_worm           蛆蟲
  ↓
worm_choice                 [選擇] 追蹤 Worm 語義/不想
  ├→ worm_trace             語言滑移（+insight, +notebook）
  └→ hotel_night            跳過
  ↓ auto
auto_hotel_night            旅館房間，外套
  ↓
coat_choice                 [選擇] 塞衣櫃/盯著看
  ├→ hotel_mirror           直接（空橋接）
  └→ hotel_coat_stare       盯（nerve -1）
  ↓ auto
auto_hotel_mirror           鏡子，綠燈
  ↓ auto
auto_raincoat_3             第三次雨衣（+notebook）
  ↓
link_choice                 [選擇] 嘗試連結/不想
  ├→ raincoat_link          連結判定（動態）
  └→ allright_corridor      跳過
  ↓ auto
auto_allright_corridor      All right
  ↓
allright_choice             [選擇] 解讀/不管
  ├→ allright_puzzle        追問意義
  └→ room_writing           回房寫稿
  ↓ auto
auto_room_writing           寫不出來，只寫 All right
  ↓ auto
auto_phone                  姪女電話
  ↓ auto
auto_allright_resolve       真相揭露（+notebook）
  ↓ auto
auto_ending                 深夜，翅膀聲（+notebook）
  → null                    第一章結束
```

### 選擇清單

| # | 選擇 | 選項 A | 效果 A | 選項 B | 效果 B |
|---|------|--------|--------|--------|--------|
| 1 | 回應理髮店主人 | 玩笑 | writing+1 | 沉默 | — |
| 2 | 停車場雨衣男 | 觀察 | +notebook | 跳過 | — |
| 3 | 咖啡廳紙牌 | 細看 | writing+1 | 跳過 | — |
| 4 | 年長女學生 | 觀察 | insight+1 | 忽略 | — |
| 5 | 省線雨衣男 | 注意 | +notebook | 繼續聊 | — |
| 6 | 齒輪反應 | 測試右眼 | nerve-1, +notebook | 低頭走 | nerve-1, +notebook |
| 7 | 婚宴破壞慾 | 順從 | insight+1, nerve-1 | 壓下 | — |
| 8 | Worm 語義 | 追蹤 | insight+1, +notebook | 不想 | — |
| 9 | 旅館外套 | 塞衣櫃 | — | 盯著看 | nerve-1 |
| 10 | 雨衣連結 | 嘗試 | 條件判定 | 不想 | — |
| 11 | All right | 解讀 | flag | 不管 | — |

### 符號追蹤

| 符號 | 出現點 | notebook key |
|------|--------|-------------|
| 🧥 雨衣 | 停車場觀察 | raincoat_station |
| 🧥 雨衣 | 省線電車 | raincoat_train |
| 🧥 雨衣 | 旅館走廊（場景級） | raincoat_hotel |
| 🧥 雨衣 | 姊夫之死（場景級） | raincoat_death |
| ⚙️ 齒輪 | 步行時初現 | gear_first |
| 📖 書物 | Worm 語義追蹤 | book_worm |
| 🪽 翼 | 結尾翅膀聲（場景級） | wing_corridor |

### 連結判定

| 連結 | 閾值 | 觸發點 | 成功 | 失敗 |
|------|------|--------|------|------|
| 🧥 × 2+ | 2 筆雨衣記錄 | link_choice | insight+1 + 隱藏文本 | 空轉提示 |

---

## 第二章「復讐」（復仇）— 待寫

### 原著要點
- 翌日早晨，旅館房間
- 報紙上的兩起火災
- Strindberg 的《地獄》
- 復仇的主題
- 與妻子的電話
- 再度看見齒輪

### 設計筆記
- 新增符號：🔥 火
- 火的意象開始與齒輪交織
- 報紙閱讀可以設計成選擇（讀哪一則新聞）
- Strindberg 作為文學嵌套（書中書）

---

## 第三章「夜」— 待寫

### 原著要點
- 深夜的不安
- 妻子不在的房間
- 老鼠的聲音
- 人偶的恐怖
- 神社參拜

### 設計筆記
- 新增符號：⛩️ 神
- 夜間場景可強化視覺崩壞（低光環境）
- 人偶場景的選擇：看還是不看

---

## 第四至六章 — 待寫

（各章寫作時再展開）

---

## 附錄：青空文庫原文節錄對照

### 第一章開頭

> 冬の夜ることだった。僕は或友人の結婚披露の饗宴に列する為に、避暑地から自動車を駆って東海道の或停車場へ急いでゐた。

→ 遊戲文本：「冬日。你提著一只皮箱，為了出席某位友人的結婚披露宴，從避暑地叫了一輛汽車趕往東海道的某個停車場。」

### 齒輪初現

> それは半透明の歯車だった。歯車は次第に数を殖やし、僕の視界の半ばを蔽ひはじめた。

→ 遊戲文本：「半透明的齒輪。不停旋轉的齒輪。」

---

*// end of chapter guide*
