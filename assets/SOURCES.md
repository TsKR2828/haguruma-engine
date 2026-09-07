# 素材來源清單

本目錄下所有檔案皆來自公有領域（Public Domain）或 CC0 來源，可自由使用、商用、修改，無需署名。
為求嚴謹，仍建議在最終發布作品的工作人員名單中保留以下來源資訊。

下載日期：2026-05-05

---

## portraits/

歷史照片。1927 年（昭和 2 年）以前作品於日本與美國均已進入公有領域。

| 檔案 | 內容 | 原檔 | 來源 |
|------|------|------|------|
| `akutagawa_portrait.jpg` | 芥川龍之介本人肖像 | Akutagawa_Ryunosuke_photo.jpg | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Akutagawa_Ryunosuke_photo.jpg) |
| `tokyo_station_1920s.jpg` | 1920 年代東京車站 | Tokyo_Railway_Station_in_the_1920s.jpg | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Tokyo_Railway_Station_in_the_1920s.jpg) |
| `tokyo_station_square.jpg` | 東京車站前廣場 | Tokyo_Station_square.jpg | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Tokyo_Station_square.jpg) |
| `ginza_owaricho.jpg` | 銀座尾張町 | Ginza_Owaricho.jpg | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Ginza_Owaricho.jpg) |
| `ginza_nishi.jpg` | 西銀座街景 | Nishi_Ginza.jpg | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Nishi_Ginza.jpg) |
| `ginza_matsuya.jpg` | 銀座松屋百貨 | Ginza_Matsuya_depertment_store.jpg | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Ginza_Matsuya_depertment_store.jpg) |
| `shinbashi_station.jpg` | 新橋驛 | Shinbashi_eki.jpg | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Shinbashi_eki.jpg) |

授權：全部 Public Domain。

---

## audio/ambient/

長時間環境音，建議在場景背景循環播放（loop）。

| 檔案 | 用途建議 | 長度 | 來源 | 授權 |
|------|---------|------|------|------|
| `rain.ogg` | 一般雨聲，可作通用陰雨場景 | 短 | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Rain.ogg) | PD-self |
| `rain_window.ogg` | 雨打窗戶，房內視角；旅館章節適用 | ~1m22s | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Rain_against_the_window.ogg) | Public Domain |
| `steam_engine.ogg` | 蒸氣機車運轉聲 | 中 | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Steam_engine.ogg) | Public Domain (pdsounds.org) |
| `train_ambient.ogg` | 列車環境音 | 37s | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Train_(unidentified_sound).ogg) | Public Domain (NOAA, US Govt) |

---

## audio/sfx/

短音效，由場景事件觸發（不循環）。

| 檔案 | 用途建議 | 來源 | 授權 |
|------|---------|------|------|
| `church_bells.ogg` | 鐘聲；可用於時間流逝、不祥預兆 | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Churchbells.ogg) | Public Domain |
| `clock_ticking.ogg` | 時鐘滴答；旅館靜室、深夜寫作 | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Clock_ticking.ogg) | Public Domain |
| `heartbeat.ogg` | 心跳；神經值臨界時觸發 | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Heartbeat_mitral_valve_150_bpm.ogg) | Public Domain |
| `page_turn.ogg` | 翻書翻紙；連結卡形成、章節切換 | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Turning_a_page.ogg) | Public Domain |
| `knock_door.ogg` | 敲門/敲木；訪客場景 | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Knocking_on_wood_or_door.ogg) | Public Domain |
| `typewriter.ogg` | 打字聲；執筆值上升、寫作場景 | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Typing_medium_speed.ogg) | Public Domain |

---

## 場景對應建議（草案）

| 場景路線 | ambient | 候選 sfx |
|----------|---------|---------|
| prologue / 序章 | rain.ogg | clock_ticking, heartbeat |
| 春日井 (kasugai) | rain_window | page_turn |
| 車站 (station) | train_ambient | steam_engine（短促觸發）, church_bells |
| 街道 (street) | rain | knock_door |
| 旅館 (hotel) | rain_window | clock_ticking, typewriter, heartbeat |
| 自動結局 | （靜音 → heartbeat 逐漸放大） | church_bells（最終） |

以上為素材建議，實際指派由場景 JSON 的 `audio` 欄位決定，無需改動引擎程式碼。
