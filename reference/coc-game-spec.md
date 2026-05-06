# CoC 文字冒險遊戲 — 定義指南與寫作標準

> 基於《最後一封信》(The Last Letter) v27 架構拆解  
> 用途：作為 prompt 或參考文件，讓 AI 在單一 HTML artifact 中生成完整可玩的 CoC 風格文字冒險遊戲  
> 維護者：月月　最後更新：2026-05

---

## 一、技術架構

### 1.1 檔案結構

單一 `.html` 檔案，三段式結構：

```
<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="UTF-8">
  <style>/* 所有 CSS */</style>
</head>
<body>
  <div id="distortion"></div>   <!-- SAN 視覺扭曲層 -->
  <div id="noise"></div>        <!-- 雜訊效果層 -->
  <div id="game"></div>         <!-- 主遊戲容器 -->
  <script>/* 所有 JS */</script>
</body>
</html>
```

**硬規則：**

- 全部寫在一個檔案裡，不拆分 CSS/JS
- `@import url(...)` 若使用 Google Fonts，必須放在 `<style>` 標籤內所有規則之前
- 不依賴任何外部框架（純 vanilla JS）
- 不使用 `localStorage`（artifact 環境不支援），存檔用 `window.storage`（persistent storage API）或純記憶體變數

### 1.2 遊戲狀態物件 (`state`)

所有遊戲狀態集中在單一物件，方便存檔/讀檔整份序列化：

```js
const state = {
  scene: 'title',         // 當前場景 ID（字串）
  stats: {                 // 角色數值
    san: 0,                //   理智值（當前）
    sanMax: 0,             //   理智值上限（= 起始值）
    pow: 0,                //   意志
    int: 0,                //   智力
    edu: 0,                //   教育
    luck: 0,               //   幸運
    // 可擴充：str, dex, con, app, siz, hp, mp...
  },
  rerollUsed: false,       // 是否已使用重骰
  time: 0,                 // 遊戲內已過分鐘數
  timeLimit: 360,          // 時間上限（分鐘），到達即觸發時間結局
  clues: [],               // 已收集線索（字串陣列）
  visited: {},             // 已探索房間 { roomId: true }
  flags: {},               // 事件旗標 { flagName: true/value }
  chaptersRead: [],        // 已讀禁忌文獻章節 ID
  inventory: [],           // 道具欄（選用）
};
```

**設計原則：**

- `flags` 是萬用鍵值對，用於追蹤任何一次性事件（已讀日記、已拿鑰匙、已看鏡子…）
- `visited` 專門追蹤房間探索狀態，與 `flags` 分開避免命名衝突
- 所有數值變動都透過專用函式（`loseSan`、`addClue`、`advanceTime`），不直接改 state

---

## 二、核心系統

### 2.1 擲骰系統

```js
// 基礎擲骰
const roll = (n, sides) => {
  let total = 0;
  for (let i = 0; i < n; i++) total += Math.floor(Math.random() * sides) + 1;
  return total;
};
```

### 2.2 角色建立（CoC 7e 規則）

| 屬性 | 公式 | 備註 |
|------|------|------|
| POW | 3d6 × 5 | 先擲 |
| SAN | = POW | 起始綁定，之後獨立扣減 |
| INT | (2d6+6) × 5 | |
| EDU | (2d6+6) × 5 | |
| LUC | 3d6 × 5 | |
| sanMax | = 起始 SAN | 不因 POW 後續變化而改變 |

**擲骰流程：**

1. 依序擲出：POW → SAN（自動同步）→ INT → EDU → LUC
2. 每個屬性播放跳數字動畫（12 次隨機 + 落定）
3. SAN 動畫較短（8 次），落定後更新公式欄為 `= POW (xx)`
4. 提供一次重骰機會（`rerollUsed` 旗標控制）
5. 確認後顯示屬性詮釋文字（依數值高低給不同描述）

### 2.3 判定系統

**d100 判定（技能/屬性檢定）：**

```
d100 ≤ 屬性值 → 成功
d100 ≤ 屬性值/2 → 極限成功（可選）
d100 > 屬性值 → 失敗
```

**判定動畫流程：**

1. 顯示判定框（標題 + 公式 `d100 ≤ STAT (value)`）
2. 跳數字動畫（20 次，前快後慢：`sleep(40 + i * 10)`）
3. 落定顯示結果數字（變色：成功金/失敗紅）
4. 延遲 500ms 後顯示文字結果（✓ 判定成功 / ✗ 判定失敗）
5. 延遲 1100ms 後繼續後續流程

**判定使用時機：**
- INT → 解讀文獻、辨識符號、觀察細節
- EDU → 閱讀禁忌文獻的門檻（靜態，不擲骰）
- POW → 抵抗精神攻擊、抗拒凝視
- LUC → 隨機事件、道具獲取

### 2.4 SAN 系統

**扣減函式（含動畫版）：**

```js
async function loseSanAnimated(amount, reason) {
  const before = state.stats.san;
  state.stats.san = Math.max(0, state.stats.san - amount);
  updateDistortion();      // 更新視覺扭曲
  showImpact([...]);       // 顯示影響框
  updateStatusBar();       // 更新狀態列
  await sleep(800);        // 留時間給玩家消化
}
```

**規則：所有 SAN 扣減必須經過 `loseSanAnimated()`**，不可直接呼叫無動畫版 `loseSan()`。這確保：
- 視覺扭曲同步更新
- 影響框出現
- 狀態列即時刷新
- SAN 歸零時統一導向同化結局

**SAN 視覺效果（隨 SAN 比例遞增）：**

| SAN 比例 | 效果 |
|----------|------|
| > 70% | 無效果 |
| 40%–70% | 暗角漸現（radial-gradient 遮罩層 `opacity` 漸增） |
| < 40% | 暗角 + 雜訊紋理疊加（feTurbulence SVG filter） |
| 0% | 強制進入同化結局 |

**文字雜訊化（`corrupt()` 函式）：**

- SAN > 50%：文字正常
- SAN ≤ 50%：隨機插入組合用字元（combining characters），強度隨比例增加
- 每個非空白字元有 `intensity * 0.15` 機率被附加亂碼

### 2.5 時間系統

- 起始時間：23:00（遊戲開始）
- 時間上限：06:00（+360 分鐘，天亮）
- 每個行動消耗固定分鐘數（移動 3 分鐘、閱讀 8–10 分鐘、搜索 2 分鐘等）
- 每次進入房間或執行行動後檢查 `checkTimeOut()`
- 時間到則強制進入天亮結局

### 2.6 線索系統

```js
function addClue(text) {
  if (!state.clues.includes(text)) {
    state.clues.push(text);
    return true;   // 新線索
  }
  return false;    // 已有
}
```

- 線索用純文字字串，格式：`來源：內容摘要`
- 線索數量影響結局分流
- 玩家可隨時在迴廊查看已收集線索

### 2.7 存檔系統

**推薦方案（artifact 環境）：**

```js
// 使用 window.storage persistent API
async function saveGame(slot = 'auto') {
  try {
    await window.storage.set(`game-save-${slot}`, JSON.stringify({
      state: JSON.parse(JSON.stringify(state)),
      timestamp: new Date().toISOString(),
      slot,
    }));
    return true;
  } catch (e) {
    console.error('Save failed:', e);
    return false;
  }
}

async function loadGame(slot = 'auto') {
  try {
    const result = await window.storage.get(`game-save-${slot}`);
    if (result) {
      const data = JSON.parse(result.value);
      Object.assign(state, data.state);
      return data;
    }
    return null;
  } catch (e) {
    return null;
  }
}
```

**備用方案（純記憶體）：**

```js
window.__gameSaves = window.__gameSaves || {};
```

**存檔時機：**
- 自動存檔：每次進入迴廊（hub）時
- 手動存檔：玩家從選單觸發
- 重新開始時清除自動存檔，保留手動存檔

---

## 三、場景系統

### 3.1 場景流程圖

```
標題畫面 (title)
    ↓
角色建立 (creation)
    ↓
門廳 (arrival) ← 遊戲起點
    ↓
迴廊 (hall) ← 中央 Hub，四向分岐
    ├── 書房 (study)
    │     ├── 日記（INT 判定）
    │     ├── 抽屜（取得鑰匙）
    │     └── 凸出的書 → 禁忌文獻系統
    ├── 圖書室 (library)
    │     ├── 鏡子（POW 判定）
    │     └── 未寄出的信
    ├── 主臥 (bedroom)
    │     ├── 床鋪
    │     ├── 木盒（LUC 判定）
    │     └── 粉筆圈（INT 判定）
    └── 地下室 (basement) ← 需要鑰匙
          ├── 焚毀文獻 → 逃離結局
          └── 完成儀式 → 見證結局

結局分流 (ending)
    ├── 逃離（焚毀文獻 or 線索≥5 且 SAN≥30）
    ├── 同化（SAN 歸零，任何時刻觸發）
    ├── 沉默（線索不足，活著但什麼都沒解開）
    ├── 見證（讀完全部禁忌文獻章節）
    └── 天亮（時間耗盡）
```

### 3.2 場景渲染模式

每個場景函式遵循統一模式：

```js
async function renderRoom() {
  state.scene = 'roomId';          // 1. 更新場景 ID
  state.visited.roomId = true;     // 2. 標記已探索
  autoSave();                      // 3. 自動存檔

  game().innerHTML = `             // 4. 重建 DOM
    ${statusBar()}
    <h1>場景名稱</h1>
    <div class="panel">
      <div class="narrative" id="text"></div>
      <div id="impact-area"></div>
      <div id="check-area"></div>
      <div id="actions" style="margin-top: 20px;"></div>
    </div>
  `;

  await typeText($('#text'),       // 5. 打字機效果敘述
    corrupt(`場景描述文字`), 25);

  // 6. 判定（如需要）
  // 7. SAN 損失（如觸發）
  // 8. 線索獲取
  // 9. SAN 歸零檢查
  if (state.stats.san <= 0) {
    $('#actions').innerHTML = `<button onclick="endingAssimilation()">……</button>`;
    return;
  }

  // 10. 顯示行動選項
  $('#actions').innerHTML = `<div class="button-row">...</div>`;
}
```

**關鍵：每個場景結束前都必須檢查 SAN 是否歸零。**

### 3.3 迴廊（Hub）設計

迴廊是所有探索的中心節點：

- 四向房間按鈕以 2×2 grid 排列
- 每個按鈕顯示房間名 + 狀態提示（未探索/已探索/需要鑰匙）
- 底部功能列：檢視線索、存檔選單、嘗試離開
- 「嘗試離開」按鈕僅在特定條件後出現（`canEscape` 旗標）
- 每次回到迴廊觸發自動存檔 + 時間耗盡檢查

### 3.4 禁忌文獻系統

結構化的多章節閱讀系統：

```js
const chapters = [
  {
    id: 0,
    title: '第一章 · 章節名',
    eduRequired: 0,        // EDU 門檻（靜態，不擲骰）
    sanLoss: '1d10',       // SAN 損失骰
    text: `章節內容...`,
    clue: '線索文字',
  },
  // ...
];
```

- 章節按順序解鎖（或依 EDU 門檻）
- 每章閱讀消耗時間 + 扣 SAN + 獲得線索
- 讀完所有章節解鎖特殊結局
- 已讀章節灰化顯示 ✓

---

## 四、結局系統

### 4.1 結局分流邏輯

結局判定優先順序（由高到低）：

1. **SAN 歸零 → 同化**（任何時刻，最高優先）
2. **時間耗盡 → 天亮**（每次行動後檢查）
3. **讀完全部禁忌章節 → 見證**（玩家主動選擇）
4. **焚毀文獻 → 逃離**（需道具 + 文獻）
5. **線索 ≥ 閾值 且 SAN ≥ 閾值 → 逃離**
6. **以上皆非 → 沉默**（默認結局）

### 4.2 結局模板

```js
async function endingXxx() {
  state.scene = 'ending';

  // 可選：調整視覺扭曲
  $('#noise').style.opacity = '0.4';
  $('#distortion').style.opacity = '0.6';

  game().innerHTML = `<div class="ending"><div id="ending-content"></div></div>`;
  await sleep(500);

  $('#ending-content').innerHTML = `
    <div class="ending-title" style="color: #結局色;">結　局　名</div>
    <div class="ending-text" id="text"></div>
    <div id="actions" style="margin-top: 30px;"></div>
  `;

  await typeText($('#text'), corrupt(`結局敘述...

  ——SAN：${state.stats.san}　結局標語。`), 22);

  $('#actions').innerHTML = `<button onclick="restart()">再開始一次</button>`;
}
```

### 4.3 結局色彩語言

| 結局 | 標題色 | 情緒 |
|------|--------|------|
| 逃離 | `#d4c089`（金） | 苦澀的倖存 |
| 同化 | `#a04040`（暗紅） | 恐怖、失去自我 |
| 沉默 | 預設色 | 空虛、遺忘 |
| 見證 | `#b8a76d`（暗金） | 孤獨的超越 |
| 天亮 | `#6b5e3a`（暗褐） | 被動的失敗 |

---

## 五、視覺設計規範

### 5.1 色彩系統

```css
/* 主色板 — 老宅 · 煤油燈 · 羊皮紙 */
--bg-deep:      #0a0d0a;     /* 背景：近乎純黑帶微綠 */
--bg-panel:     rgba(15, 18, 15, 0.8);  /* 面板背景 */
--border:       #3a3528;     /* 邊框：暗褐 */
--border-accent:#6b5e3a;     /* 強調邊框 */
--text-primary: #c9b88a;     /* 主文字：舊紙色 */
--text-heading: #d4c089;     /* 標題：亮金 */
--text-label:   #8a7d5a;     /* 標籤：暗金 */
--text-muted:   #6b5e3a;     /* 弱化文字 */
--text-dim:     #5a513a;     /* 最弱文字 */
--accent-gold:  #b8a76d;     /* 金色強調 */
--accent-warm:  #e8d99a;     /* 暖亮金（hover） */
--danger:       #a04040;     /* 危險/失敗：暗紅 */
--danger-text:  #d4a89a;     /* 損失文字 */
--gain:         #6b8a4a;     /* 獲得：暗綠 */
--gain-text:    #b8c89a;     /* 獲得文字 */
```

### 5.2 字型

```css
font-family: 'Noto Serif TC', 'Cormorant Garamond', serif;
```

- **Noto Serif TC**：中文主體（400/500/700）
- **Cormorant Garamond**：英文裝飾、數字顯示（400/600 + italic）
- 數值顯示（SAN、骰值）用 Cormorant Garamond 大字
- 公式、副標題用 Cormorant Garamond italic

### 5.3 排版

- 最大寬度：720px，置中
- 內距：40px 30px
- 行高：1.7（敘事文字）、2.0（信件/文獻）
- 字距：標題 0.15em、標籤 0.2em、按鈕 0.1em
- 敘事段落用 `text-align: justify`

### 5.4 元件規範

**面板 (`.panel`)**
- 半透明深色背景 + 1px 邊框 + 內陰影
- 標題帶底線分隔

**屬性卡 (`.stat`)**
- 左側 2px 金色邊線
- 三行：屬性名（小灰字 + 字距）、數值（大號 Cormorant）、公式（小斜體暗灰）

**按鈕**
- 透明背景 + 1px 邊框
- hover：深褐底 + 亮框 + 亮字
- disabled：opacity 0.3
- 按鈕群用 `.button-row`（flex wrap, gap 8px, justify center）

**信件 (`.letter`)**
- 漸層深背景 + feTurbulence 紙紋偽元素
- Cormorant Garamond italic 主字型
- 行高 2.0

**影響框 (`.impact-box`)**
- 損失：暗紅背景 + 紅色左邊線
- 獲得：暗綠背景 + 綠色左邊線

**狀態列 (`#status-bar`)**
- sticky top, 半透明深底 + 模糊
- 三格：時間、SAN（低於 40% 變紅）、線索數

### 5.5 動畫

| 效果 | 實作 |
|------|------|
| 擲骰跳數字 | `shake` keyframes (translateX ±1px, 0.05s infinite) |
| 打字機 | 逐字 append + 游標閃爍偽元素 |
| 游標閃爍 | `blink` keyframes (opacity 0/1, 0.8s) |
| 新線索高亮 | `clueGlow` (2s 從亮金漸變回暗金) |
| SAN 扭曲 | fixed 全螢幕 radial-gradient 遮罩 + SVG feTurbulence 雜訊層 |

---

## 六、敘事寫作標準

### 6.1 文體

- **人稱**：第二人稱「妳」（女性主角預設，可改為「你」）
- **時態**：現在式為主，回憶/文獻用過去式
- **語調**：冷靜、節制、不渲染。恐怖感來自暗示而非描寫
- **句式**：短句。段落間留空行。關鍵轉折獨立成段

### 6.2 敘事節奏

```
環境描寫（2-3 句）
    ↓
異常暗示（1-2 句，用「但」「——」「不對」轉折）
    ↓
選擇分岐
    ↓
判定 + 後果
    ↓
SAN 扣減 + 情緒著地
```

### 6.3 恐怖寫作原則

1. **延遲揭露**：先給玩家正常的環境，再讓一個細節「不對」
2. **感官錯位**：停留時間不對、影子多了半秒、體溫還在但人不見
3. **理解即傷害**：看懂符號、讀懂文獻本身就是 SAN 損失的來源
4. **選擇的殘酷**：每個選項都有代價，沒有「正確答案」
5. **文獻作為武器**：禁忌書籍的每一章都給線索但同時扣 SAN，讀越多越危險但也越接近真相

### 6.4 打字速度建議

| 場景類型 | 速度 (ms/字) | 原因 |
|----------|-------------|------|
| 環境描寫 | 25 | 標準閱讀 |
| 信件/文獻 | 18–20 | 略快，模擬快速掃讀 |
| 恐怖揭露 | 28–30 | 放慢，製造緊張 |
| 結局敘述 | 22 | 中速，讓玩家消化 |

---

## 七、遊戲串接標準

### 7.1 跨遊戲存檔格式

若要讓多個遊戲共享角色或世界狀態，統一使用以下格式：

```js
const sharedSave = {
  version: '1.0',
  gameId: 'the-last-letter',     // 遊戲唯一 ID
  completedEndings: ['escape'],  // 已達成結局
  characterSeed: {               // 可帶到下一作的角色資料
    san: 45,
    sanMax: 60,
    pow: 60,
    int: 65,
    edu: 70,
    luck: 50,
    cluesCarried: [              // 跨作品線索
      '《死靈之書》第五章：開門儀式的全貌',
    ],
    flags: {
      bookBurned: true,
      mirrorSeen: true,
    },
  },
  timestamp: new Date().toISOString(),
};
```

**存檔鍵名規範：**

```
coc-shared:meta          → 共享元資料（已完成遊戲列表）
coc-shared:character     → 跨遊戲角色資料
coc-game:{gameId}:auto   → 單遊戲自動存檔
coc-game:{gameId}:manual → 單遊戲手動存檔
```

### 7.2 遊戲間傳遞機制

```js
// 遊戲 A 結束時寫入共享存檔
async function exportToShared() {
  const shared = {
    version: '1.0',
    gameId: GAME_ID,
    completedEndings: [currentEnding],
    characterSeed: {
      san: state.stats.san,
      sanMax: state.stats.sanMax,
      pow: state.stats.pow,
      int: state.stats.int,
      edu: state.stats.edu,
      luck: state.stats.luck,
      cluesCarried: state.clues.filter(c => c.startsWith('《')),
      flags: { ...state.flags },
    },
    timestamp: new Date().toISOString(),
  };
  await window.storage.set('coc-shared:character', JSON.stringify(shared), false);

  // 更新已完成遊戲列表
  let meta = { completedGames: [] };
  try {
    const existing = await window.storage.get('coc-shared:meta');
    if (existing) meta = JSON.parse(existing.value);
  } catch (e) {}
  if (!meta.completedGames.includes(GAME_ID)) {
    meta.completedGames.push(GAME_ID);
  }
  await window.storage.set('coc-shared:meta', JSON.stringify(meta), false);
}

// 遊戲 B 開始時讀取共享存檔
async function importFromShared() {
  try {
    const result = await window.storage.get('coc-shared:character');
    if (result) {
      const prev = JSON.parse(result.value);
      // 繼承角色 or 給予加成 or 解鎖特殊選項
      return prev;
    }
  } catch (e) {}
  return null;
}
```

### 7.3 串接設計模式

**模式 A — 續作（同一角色）：**
- 直接繼承 `characterSeed`，SAN 從上作結算值開始
- 上作線索作為起始知識，影響新對話選項

**模式 B — 平行（不同角色，共享世界）：**
- 讀取 `completedEndings` 改變世界狀態
- 例：上作焚毀《死靈之書》→ 本作中該書不再出現，但灰燼仍在

**模式 C — 解鎖（集齊條件開啟隱藏內容）：**
- 讀取 `meta.completedGames`，集齊多個遊戲後解鎖最終章
- 各遊戲獨立可玩，但全部完成後有彩蛋

---

## 八、新遊戲開發 Checklist

### 8.1 Prompt 模板

```
請根據以下設定，製作一個 CoC 風格文字冒險遊戲。
技術規格遵循附件的定義指南（或：遵循《最後一封信》的架構模式）。

【遊戲設定】
- 標題：
- 副標題（英文）：
- 時代/地點：
- 主角設定（人稱/性別）：
- 時間壓力（有/無，上限幾小時）：
- 核心恐怖主題：

【場景結構】
- 起點場景：
- 中央 Hub：
- 探索房間（4-6 個）：
- 需要鑰匙/條件才能進入的房間：

【禁忌文獻】
- 書名：
- 章節數：
- EDU 門檻分佈：
- 每章 SAN 損失範圍：

【結局設計】（至少 3 個）
- 好結局條件：
- 壞結局條件：
- 隱藏結局條件：

【串接需求】（選填）
- 是否讀取前作存檔：
- 跨遊戲共享的線索/旗標：
- 前作結局如何影響本作：
```

### 8.2 品質確認清單

- [ ] `@import` 在所有 CSS 規則之前
- [ ] 所有被 `onclick` 引用的函式都有定義
- [ ] 所有 SAN 扣減都用 `loseSanAnimated()`（不用無動畫版）
- [ ] 每個場景末尾都檢查 `state.stats.san <= 0`
- [ ] 存檔系統不依賴 `localStorage`
- [ ] `resumeScene()` 涵蓋所有場景 ID
- [ ] `sceneNameMap` 包含所有場景中文名
- [ ] 時間系統：每個行動都呼叫 `advanceTime()`
- [ ] 結局分流邏輯覆蓋所有可能路徑（無死路）
- [ ] 禁忌文獻的 EDU 門檻 + SAN 損失平衡測試
- [ ] 移動端 viewport meta 標籤存在
- [ ] 打字速度在 18–30ms 範圍內

---

## 九、已知問題與待辦（The Last Letter v27）

供後續迭代參考：

1. **`forceLookMirror()` 未定義** — 按鈕引用但函式不存在
2. **`lookMirror()` 用了無動畫版 `loseSan()`** — 應改為 `loseSanAnimated()`
3. **`@import` 位置** — 應移到 `<style>` 標籤內第一行
4. **存檔系統** — 從 `sessionStorage` 遷移到 `window.storage` persistent API
5. **圖書室 `state.flags.mirrorRevisited`** — 從未被設為 true，第二次看鏡子的按鈕永遠存在

---

*// end of spec*
