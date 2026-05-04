# 脈輪覺醒 — 開發行動計畫

## 概要

| 項目 | 內容 |
|------|------|
| 遊戲名稱 | 脈輪覺醒（暫定） |
| 類型 | AVG + 探索型心理 RPG |
| 引擎 | TyranoBuilder Visual Novel Studio（AVG 核心） |
| 自製系統 | HTML/JS/SVG（脈輪專屬機制，透過 TyranoScript 嵌入） |
| 目標時長 | 3-4 小時 |
| 輸出平台 | Browser（優先）/ Windows |
| 自製系統開發工具 | Claude Code（7 月開始） |

---

## 一、TyranoBuilder 負責的部分

TyranoBuilder 是你的「主編輯器」，以下功能全部在 GUI 裡操作，不需要寫程式：

### 1. 對話系統
- 在 TyranoBuilder 編輯器裡直接打字輸入對話
- 支援說話者名稱、自動換行、逐字顯示
- 分歧選項用內建的「選擇肢」元件拖放即可

### 2. 立繪與表情差分
- 將角色立繪圖片（PNG，透明背景）放入專案的 `data/fgimage/` 資料夾
- TyranoBuilder 3.0 支援**模組化角色部件**：
  - 底圖（身體 + 服裝）
  - 表情層（眼睛 + 嘴巴）
  - 不需要每個表情做一整張圖
- 在編輯器裡選擇「角色」元件 → 選圖片 → 拖放到場景

### 3. 背景圖
- 放入 `data/bgimage/` 資料夾
- 建議尺寸：1920×1080（16:9）
- 每個脈輪區域準備 2-3 張背景（外在世界 + 內在世界 + 過場）

### 4. BGM 與音效
- 放入 `data/bgm/` 和 `data/sound/`
- 格式：OGG（不支援 MP3，有版權費問題）
- 每個脈輪需要：1 首 BGM + 進入內在世界的轉場音效

### 5. 存檔 / 讀檔
- 內建功能，不需要自己寫

### 6. 場景管理
- 每個 .ks 檔案 = 一個場景
- 用 `[jump]` 標籤在場景之間跳轉

---

## 二、自製系統（Claude Code 開發）

以下功能 TyranoBuilder 做不到或做不好，需要用 HTML/JS 自己寫，再嵌入 TyranoBuilder：

### 1. SVG 互動地圖
- 七個脈輪節點的探索地圖
- 已覺醒的脈輪發光、可點擊進入
- 未解鎖的灰化不可互動
- 點擊節點 → 回傳到 TyranoBuilder 跳轉對應場景

### 2. 脈輪能量 UI
- 頂部七個脈輪指示燈
- 覺醒程度（不是 0/1，是光譜值 0-100）
- 共感值顯示

### 3. 情緒共鳴戰鬥系統
- 非暴力「戰鬥」畫面
- 觀察 → 理解 → 接納 → 轉化 的四步驟 UI
- Shadow 的情緒狀態視覺化
- 選擇回應方式（不是攻擊指令）

### 4. 脈輪專屬小遊戲
- 每個脈輪有不同機制（資源管理、創作謎題、對話挑戰等）
- 這些是獨立的 HTML 頁面，完成後回傳結果給 TyranoBuilder

---

## 三、TyranoBuilder ↔ 自製系統 的接口

### 從 TyranoBuilder 呼叫自製系統：

```tyranoScript
; 隱藏對話框
[layopt layer=message0 visible=false]

; 載入自製的 SVG 地圖
[html name="chakra_map"]
<div id="chakra-map-container"></div>
<script src="data/others/chakra-map.js"></script>
[endhtml]
```

### 從自製系統回傳結果給 TyranoBuilder：

```javascript
// 在你的 chakra-map.js 裡
function onNodeClick(chakraId) {
  // 設定 TyranoBuilder 的遊戲變數
  TYRANO.kag.stat.f.selected_chakra = chakraId;
  
  // 移除 HTML 層
  TYRANO.kag.ftag.startTag("freehtml", { name: "chakra_map" });
  
  // 恢復對話框
  TYRANO.kag.ftag.startTag("layopt", { 
    layer: "message0", visible: "true" 
  });
  
  // 跳轉到對應場景
  TYRANO.kag.ftag.startTag("jump", { 
    storage: "chakra_" + chakraId + ".ks" 
  });
}
```

### 共用變數對照表

| TyranoBuilder 變數 | 用途 | 型別 |
|-------------------|------|------|
| `f.chakra_1` ~ `f.chakra_7` | 各脈輪覺醒程度 | Number 0-100 |
| `f.empathy` | 共感值 | Number |
| `f.current_chapter` | 目前章節 | String |
| `f.shadow_state` | Shadow 情緒狀態 | String |
| `sf.bgm_volume` | BGM 音量（系統存檔） | Number |

---

## 四、專案資料夾結構

```
chakra-awakening/
├── data/
│   ├── bgimage/          ← 背景圖
│   │   ├── cave_outer.png
│   │   ├── cave_inner.png
│   │   ├── forest_outer.png
│   │   └── ...
│   ├── fgimage/          ← 角色立繪
│   │   ├── player/
│   │   │   ├── base.png
│   │   │   ├── eye_neutral.png
│   │   │   ├── eye_sad.png
│   │   │   ├── mouth_smile.png
│   │   │   └── ...
│   │   └── guide/
│   │       ├── base.png
│   │       └── ...
│   ├── bgm/              ← 背景音樂（OGG）
│   │   ├── chakra1_outer.ogg
│   │   ├── chakra1_inner.ogg
│   │   └── ...
│   ├── sound/            ← 音效（OGG）
│   │   ├── transition.ogg
│   │   ├── awaken.ogg
│   │   └── ...
│   ├── scenario/         ← 劇本場景檔
│   │   ├── title.ks
│   │   ├── prologue.ks
│   │   ├── chakra_1.ks
│   │   ├── chakra_1_inner.ks
│   │   ├── chakra_1_battle.ks
│   │   ├── chakra_2.ks
│   │   └── ...
│   └── others/           ← 自製 JS/HTML 系統
│       ├── chakra-map.js
│       ├── chakra-map.css
│       ├── chakra-ui.js
│       ├── battle-system.js
│       └── plugin/
│           └── chakra_system/
│               └── init.ks
```

---

## 五、素材清單（最低需求）

### 角色立繪
| 角色 | 需要的素材 | 說明 |
|------|-----------|------|
| 主角 | 底圖 ×1 + 表情差分 ×6-8 | 可用模組化部件 |
| 引導者 | 底圖 ×1 + 表情差分 ×4-6 | 神秘感定位 |
| Shadow ×7 | 每個脈輪各 1 個 Shadow | 可以是同一角色的變體 |

### 背景圖
| 場景 | 數量 | 說明 |
|------|------|------|
| 標題畫面 | 1 | |
| 每個脈輪外在世界 | 7 | |
| 每個脈輪內在世界 | 7 | 視覺風格需要明顯不同 |
| 過場 / 通用 | 3-5 | |
| **合計** | ~20 張 | |

### 音樂與音效
| 類型 | 數量 | 說明 |
|------|------|------|
| BGM | 7-10 首 | 每個脈輪至少 1 首 |
| 轉場音效 | 3-5 個 | |
| UI 音效 | 5-8 個 | 選擇、確認、覺醒等 |

---

## 六、開發階段與時間軸

### Phase 0：準備（現在 ~ 3.0 debut 前）
- [ ] 買 TyranoBuilder（Steam US$14.99）
- [ ] 跑一遍官方 Tutorial，熟悉基本操作
- [ ] 寫第一章（海底輪）的完整劇本文字稿
- [ ] 準備佔位素材（可以先用免費素材或簡單圖形）

### Phase 1：Prototype（debut 後）
- [ ] 在 TyranoBuilder 裡做出海底輪完整流程
  - 外在世界探索 → 觸發事件 → 進入內在世界 → Shadow 對話 → 和解
- [ ] 驗證 [html] + [iscript] 嵌入自製系統的可行性
- [ ] 做出 SVG 地圖的基本版本

### Phase 2：核心系統（7 月，Claude Code 上線後）
- [ ] 用 Claude Code 建立完整的自製系統
  - SVG 互動地圖
  - 脈輪能量 UI
  - 情緒共鳴戰鬥系統 prototype
- [ ] 打包成 TyranoBuilder plugin（.tbp）
- [ ] 完成 2-3 個脈輪的完整流程

### Phase 3：內容填充
- [ ] 完成全部 7 個脈輪的劇本
- [ ] 替換所有佔位素材為正式素材
- [ ] 平衡各脈輪的遊戲時間（每個約 20-30 分鐘）

### Phase 4：Polish
- [ ] 結局分歧測試
- [ ] UI/UX 調整
- [ ] 音效完善
- [ ] Beta 測試
- [ ] 瀏覽器版輸出 + 部署到 Vercel 或 itch.io

---

## 七、劇本寫作格式（給 TyranoBuilder 用）

在 TyranoBuilder 裡你不需要直接寫 TyranoScript，大部分用拖放就好。
但如果你想直接編輯 .ks 檔案，格式長這樣：

```tyranoScript
*scene_start

; 設定背景
[bg storage="cave_outer.png" time=1000]

; 播放 BGM
[playbgm storage="chakra1.ogg" loop=true]

; 顯示角色（右邊）
[chara_show name="guide" face="neutral"]

; 引導者的對話
#引導者
你終於醒了。[l][r]
這裡是你的內在世界。你一直試著逃離的地方。[l][r]

; 切換表情
[chara_mod name="guide" face="gentle"]

#引導者
七道封印鎖住了你的脈輪。[l][r]

; 選項
[glink text="我準備好了" target="*ready" color="0x4a3728"]
[glink text="我還沒準備好" target="*hesitate" color="0x4a3728"]
[glink text="這是什麼地方？" target="*question" color="0x4a3728"]
[s]

*ready
; 跳轉到對應分支
[jump storage="chakra_1_ready.ks"]

*hesitate
[jump storage="chakra_1_hesitate.ks"]

*question
[jump storage="chakra_1_question.ks"]
```

---

## 八、開始之前的 Checklist

1. **去 Steam 買 TyranoBuilder**（US$14.99）
   - 建議切到 Beta 分支使用 3.0 版
2. **跑官方 Tutorial**（約 1-2 小時）
   - https://tyranobuilder.com/tutorials/
3. **開始寫劇本**
   - 不需要等素材，先用文字把故事寫出來
   - 建議用你習慣的文字編輯器寫，之後再貼進 TyranoBuilder
4. **準備一組佔位素材**
   - 背景：可以先用純色 + 文字說明
   - 立繪：可以先用簡單的剪影或 emoji 佔位
   - 音樂：可以先靜音開發

---

> 最重要的第一步不是買工具，是**把海底輪的劇本寫完**。
> 有了完整的文字，後面所有技術工作才有明確目標。
