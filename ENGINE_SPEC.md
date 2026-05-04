# 歯車引擎 — 技術架構規格書

> 基於《歯車》第一章 React 原型 + 《最後一封信》CoC 引擎 v27 合併重構  
> 架構：React 資料驅動  
> 維護者：月月　版本：v0.1　最後更新：2026-05-04

---

## 一、設計原則

### 1.1 為什麼是 React 資料驅動

歯車原著共 11 章 51 節。每個場景如果寫成獨立渲染函式（最後一封信模式），預估 6000+ 行且無法維護。

資料驅動架構：
- 場景是 JSON 資料，渲染器是通用元件
- 新增一個場景 = 新增一筆 SCENES 資料（~20 行）
- 引擎修改一處，全場景生效

### 1.2 合併策略

| 來源 | 搬入的東西 | 改造方式 |
|------|-----------|---------|
| 歯車原型 | SCENES 資料結構、手帖系統、TextBlock 元件、選擇系統 | 保留為核心 |
| 最後一封信 | SAN 視覺崩壞、corrupt() 文字雜訊、存檔系統、擲骰判定動畫 | React 化 |
| CoC spec | 設計規範、色彩語言、動畫標準、品質 checklist | 作為約束條件 |

### 1.3 不做的事

- 不做角色建立擲骰（歯車沒有 CoC 式角色卡）
- 不做房間導覽 Hub（歯車是線性敘事，不是迴廊探索）
- 不做時間壓力倒計時（壓力來自神經衰退，不是時鐘）
- 不做 RPG Maker 式地圖探索（迷茫感用文字和視覺崩壞表現，不用空間迷路）

### 1.4 追加系統（v0.1 後討論確定）

| 系統 | 說明 | 詳見 |
|------|------|------|
| SVG 軌跡圖 | 不是探索地圖，是會崩壞的路線記錄圖 | §四A |
| 意義漂移物品 | 物品描述隨 nerve/chapter 動態改變 | §四B |
| 微互動行為 | 場景中的輕量動作（放聖經、塞外套） | §四C |
| 動作粒度遞增 | 神經越低，同一行為被拆成越多步驟 | §四D |

---

## 二、遊戲狀態

### 2.1 State 物件

```typescript
interface GameState {
  // ── 場景 ──
  scene: string;              // 當前場景 ID
  chapter: number;            // 當前章節（1-11）
  history: TextBlock[];       // 已顯示文字歷史
  choicesMade: Record<string, boolean>;  // 選擇旗標

  // ── 三軸數值 ──
  nerve: number;              // 神經（10→0，歸零即崩潰）
  insight: number;            // 洞察（0→∞，累計制）
  writing: number;            // 執筆（0→∞，累計制）

  // ── 手帖 ──
  notebook: NotebookEntry[];  // 符號收集記錄

  // ── 物品 ──
  inventory: string[];        // 持有物品 ID（§四B）

  // ── UI 狀態 ──
  typing: boolean;
  pendingText: string | null;
}
```

### 2.2 三軸系統設計

歯車不用 CoC 的 SAN/POW/INT/EDU/LUC 五屬性。改用三軸：

| 軸 | 方向 | 觸發 | 效果 |
|----|------|------|------|
| 神經 (nerve) | 10→0 遞減 | 齒輪出現、失眠、幻覺、衝動行為 | 驅動視覺崩壞；歸零觸發崩潰結局 |
| 洞察 (insight) | 0→∞ 累加 | 觀察細節、追蹤語言滑移、連結符號 | 解鎖隱藏文本和連結判定 |
| 執筆 (writing) | 0→∞ 累加 | 注意文學細節、觀察咖啡廳紙牌等 | 影響結局分歧（作家的自我是否存續） |

**神經 = SAN 的對應物**，但方向相反：
- SAN 是「理智被超自然恐怖侵蝕」
- 神經是「精神在日常中自行瓦解」——沒有外在怪物，敵人是自己的大腦

### 2.3 數值變動規則

所有數值變動必須透過專用函式，不可直接修改 state：

```javascript
// 神經損失（含視覺效果）
async function loseNerveAnimated(amount, reason)

// 洞察獲得
function gainInsight(amount, reason)

// 執筆獲得  
function gainWriting(amount, reason)
```

---

## 三、場景系統

### 3.1 場景資料結構

```typescript
interface Scene {
  // 文本內容（靜態陣列或動態函式）
  text: TextBlock[] | ((state: GameState) => TextBlock[]);

  // 選項（可選，無選項則自動推進）
  choices?: Choice[];

  // 自動推進的下一場景（無 choices 時使用）
  next?: string | null;   // null = 遊戲結束

  // 場景級手帖記錄（進入場景即記錄）
  notebook?: NotebookEntry;

  // 場景級數值效果（動態計算）
  effectFn?: (state: GameState) => Partial<Effects>;
}
```

### 3.2 文本塊類型

```typescript
type TextBlock =
  | { type: "narration"; content: string }   // 敘述（主色）
  | { type: "inner"; content: string }       // 內心獨白（斜體紫）
  | { type: "dialogue"; speaker: string; jp: string; cn: string }  // 對話（日中雙語）
  | { type: "system"; content: string }      // 系統提示（綠邊線）
  | { type: "break" }                        // 空行分隔
  | { type: "pause"; duration: number }      // 靜默停頓（ms）
  | { type: "action"; prompt: string; flag: string; response?: string }  // 微互動（§四C）
  | { type: "forced"; steps: string[] }      // 強制動作序列（§四D）
```

### 3.3 選擇資料結構

```typescript
interface Choice {
  text: string;                    // 選項文字
  next: string;                    // 跳轉場景 ID
  effect?: Partial<Effects>;       // 數值效果
  flag?: string;                   // 設定旗標
  notebook?: NotebookEntry;        // 手帖記錄
  condition?: (state: GameState) => boolean;  // 顯示條件（新增）
}

interface Effects {
  nerve: number;     // 負數 = 損失
  insight: number;   // 正數 = 獲得
  writing: number;   // 正數 = 獲得
}
```

### 3.4 場景命名規範

```
auto_xxx      自動推進場景（無選擇），玩家經過但不停留
xxx           需要玩家選擇的場景
xxx_yyy       選擇分支結果
```

場景 ID 格式：`ch{章}_s{節}_{描述}`

```
ch1_s01_prologue          第一章 序
ch1_s02_auto_barber       自動：理髮店主人的幽靈故事
ch1_s03_barber_response   選擇：回應理髮店主人
ch1_s04_auto_station      自動：停車場
...
```

### 3.5 場景流轉模式

```
                    ┌─ choice A ─→ [scene_a]
[auto_scene] → [choice_scene] ─┤                  ─→ [auto_scene_next]
                    └─ choice B ─→ [scene_b] ──┘
```

- `auto_` 場景：文本播完後自動跳到 `next`
- 選擇場景：文本播完後顯示選項，玩家點選後跳轉
- 分支場景：處理分支文本後匯合回主線

---

## 四、手帖系統

### 4.1 符號體系

歯車的核心文學裝置是「反覆出現的意象」。手帖系統將這些意象數據化：

```typescript
interface NotebookEntry {
  key: string;        // 唯一 ID（防重複）
  symbol: string;     // 符號分類 key
  desc: string;       // 記錄描述
}

const SYMBOLS: Record<string, Symbol> = {
  raincoat: { icon: "🧥", label: "雨衣",   system: "レエン・コオト" },
  gear:     { icon: "⚙️", label: "齒輪",   system: "歯車" },
  wing:     { icon: "🪽", label: "翼",     system: "翼" },
  book:     { icon: "📖", label: "書物",   system: "本" },
  bw:       { icon: "◐",  label: "黑與白", system: "Black & White" },
  fire:     { icon: "🔥", label: "火",     system: "火" },         // ch2+
  god:      { icon: "⛩️", label: "神",     system: "神" },         // ch3+
  death:    { icon: "💀", label: "死",     system: "死" },         // ch5+
};
```

### 4.2 連結判定

當同一符號的手帖記錄達到閾值，玩家可嘗試「連結」：

```javascript
// 連結條件
const count = state.notebook.filter(n => n.symbol === symbolKey).length;
if (count >= threshold) {
  // 連結成功：解鎖隱藏文本 + insight +1
} else {
  // 空轉：記錄不足，連結建立不起來
}
```

連結是歯車獨有的機制——不是 CoC 的技能判定，而是「你有沒有在之前的場景注意到這件事」。

---

## 四A、SVG 軌跡圖

### 概念

不是探索地圖，是**路線記錄**。顯示主角從避暑地到東京的移動軌跡，以及每個地點發生過什麼。

```
避暑地 ──→ 停車場 ──→ 咖啡廳 ──→ 三等車廂 ──→ 省線車站 ──→ 旅館
         🧥(1)                              🧥(2)         🧥(3)
                                   ⚙️(1)
```

### 設計規則

- 章節過場時顯示（不是隨時可開的 UI）
- 已經過的路線亮起，未到的灰化
- 符號標記在出現的地點上
- **神經崩壞效果**：nerve ≤ 4 時路線開始扭曲（SVG path 加入隨機偏移），地名文字 corrupt()
- 極簡風格：深底 + 細線 + 節點圓點，不是寫實地圖

### 資料結構

```typescript
interface MapNode {
  id: string;
  name: string;           // "停車場"
  position: [number, number];  // SVG 座標
  chapter: number;
  symbols: string[];      // 出現在此地的符號 key
}

interface MapEdge {
  from: string;
  to: string;
  transport: string;      // "汽車" / "徒步" / "火車" / "電車"
}
```

---

## 四B、意義漂移物品系統

### 概念

物品不是「道具」，是**會改變意義的符號**。同一件東西在不同章節、不同神經值下，描述文字完全不同。

### 物品清單（已確認）

| 物品 | 出現章 | 初見描述 | 後期描述（nerve ≤ 3） |
|------|--------|---------|---------------------|
| ヴェロナール（安眠藥） | ch2+ | 「白色粉末。醫生開的安眠藥。」 | 「0.8 克。你為什麼知道致死量？」 |
| 原稿 | ch1+ | 「正在寫的短篇小說。」 | 「白紙。只有 All right 反覆寫了幾十行。」 |
| 聖經 | ch8+ | 「床頭的書。某種慣例。」 | 「你打開它。一個字也讀不進去。但你的手不肯放開。」 |
| 銅鑰匙（隱喻） | — | 不作為物品，作為 notebook 符號 | — |

### 資料結構

```typescript
interface Item {
  id: string;
  name: string;
  icon: string;
  acquired: boolean;
  desc: (state: GameState) => string;   // 動態描述
  canUse?: (state: GameState) => boolean;
  onUse?: string;                        // 觸發的 flag
}
```

### 物品面板

- 與手帖分開：手帖是「觀察記錄」，物品是「身上帶著的」
- 物品數量始終很少（3-5 件），不是 RPG 道具欄
- 每次打開都重新計算描述——玩家會注意到描述變了

---

## 四C、微互動行為

### 概念

比「選擇」更輕的互動。不跳轉場景，不分歧劇情，只是讓玩家「做了某件事」。

### TextBlock 定義

```typescript
{ 
  type: "action", 
  prompt: "把聖經放到枕邊。",     // 按鈕文字
  flag: "bible_placed",            // 設定的旗標
  response: "書的重量讓枕頭微微凹陷。"  // 按下後顯示的文字（可選）
}
```

### 渲染行為

1. 文字流播放到 action 塊時，暫停
2. 顯示一個小型按鈕（不是全寬的選擇面板，是內嵌在文字流中的）
3. 玩家點擊後：
   - 按鈕消失
   - 顯示 response 文字（打字機效果）
   - 設定 flag
   - 繼續播放後續 TextBlock

### 與選擇的區別

| | 選擇 (Choice) | 微互動 (Action) |
|--|---------------|----------------|
| 出現位置 | 場景末尾 | 文字流中間 |
| 按鈕數量 | 2-3 個 | 1 個 |
| 跳轉場景 | 是 | 否 |
| 可以拒絕 | 是（選另一個） | 否（必須按才能繼續） |
| 語感 | 「你想做什麼？」 | 「做這件事。」 |

### 範例

```javascript
// 第一章：旅館房間
{ type: "narration", content: "掛在牆上的外套讓你感覺到了你自己站立的身影。" },
{ type: "action", prompt: "把外套塞進衣櫃裡。", flag: "coat_hidden", 
  response: "衣櫃門關上了。但你知道它還在裡面。" },
{ type: "narration", content: "你走到梳妝台前。" },
```

---

## 四D、動作粒度遞增系統

### 概念

隨著神經值下降，原本一步完成的動作被強制拆解成多個步驟。玩家必須逐一點擊才能完成。

**這不是懲罰機制，是體驗設計**——讓玩家感受到「活著變成了勞動」。

### 粒度等級

| 神經值 | 等級 | 「回到房間」的呈��� |
|--------|------|-------------------|
| 8-10 | 0 — 正常 | `[回到房間]` 一個按鈕 |
| 5-7 | 1 — 分解 | `[站起來]` → `[走回房間]` |
| 3-4 | 2 — 碎片 | `[站起來]` → `[左腳]` → `[右腳]` → `[左腳]` → `[開門]` → `[進去]` |
| 1-2 | 3 — 崩潰 | `[你必須：睜開眼睛]` → `[你必須：呼吸]` → `[你必須：...]` |

### TextBlock 定義

```typescript
{
  type: "forced",
  steps: [
    "站起來。",
    "把左腳往前踏。",
    "把右腳往前踏。",
    "伸手握住門把。",
    "轉動門把。",
    "推開門。",
  ],
}
```

### 渲染行為

1. 每個 step 渲染為一個小型按鈕
2. 按下後：按鈕變成已完成的灰色文字，下一個 step 按鈕出現
3. 全部完成後繼續播放後續 TextBlock
4. **不可跳過**——這是重點

### 動態生成

場景資料不需要為每個神經等級寫不同版本。引擎提供一個展開函式：

```typescript
function expandAction(
  action: string,          // "回到房間"
  nerve: number,           // 當前神經值
  expansions: Record<number, string[]>  // 各等級的展開步驟
): TextBlock

// 用法：
expandAction("回到房間", state.nerve, {
  0: [],                                          // nerve 8-10：不展開，直接執行
  1: ["站起來。", "走回房間。"],                     // nerve 5-7
  2: ["站起來。", "左腳。", "右腳。", "左腳。", "右腳。", "開門。", "進去。"],  // nerve 3-4
  3: ["你必須：睜開眼睛。", "你必須：感覺你的腿。", "你必須：站起來。", 
      "你必須：記住房間在哪個方向。", "你必須：走。", "你必須：繼續走。",
      "你必須：不要停下來。"],  // nerve 1-2
})
```

### 敘事整合

等級 3 的強制步驟應該融入敘事語感，不只是「按左腳按右腳」的機械重複：

```
你必須：把意識集中在右手上。
你必須：感覺到手指。
你必須：感覺到手指碰到門把的冷。
你必須：轉。
你必須：推。
```

到第十一章「敗北」，最後一個動作可能是：

```
你必須：                    ← 空白。什麼都不寫。按鈕上只有一個冒號。
```

按下去之後——結局。

### 齒輪侵蝕效果（forced 按鈕專用）

強制動作按鈕會隨神經值下降，逐步被齒輪意象「侵蝕」。三層效果疊加：

**Layer 1 — 齒痕邊框（nerve ≤ 4）**

正常按鈕是直線邊框。nerve 下降後，邊框用 SVG `clip-path` 替換為鋸齒狀，模擬齒輪咬過的痕跡：

```css
/* nerve ≤ 4：細微鋸齒，玩家可能還沒注意到 */
.forced-btn--eroded {
  clip-path: url(#gear-teeth-subtle);
  border: none;
}

/* nerve ≤ 2：鋸齒加深，邊緣明顯不規則 */
.forced-btn--eroded-deep {
  clip-path: url(#gear-teeth-heavy);
}
```

**Layer 2 — 齒輪紋背景（nerve ≤ 3）**

按鈕背景浮現極淡的齒輪 SVG pattern。opacity 隨 nerve 遞增：

```jsx
const gearOpacity = nerve <= 2 ? 0.15 : nerve <= 3 ? 0.06 : 0;

<button style={{
  backgroundImage: gearOpacity > 0 ? GEAR_PATTERN_SVG : 'none',
  backgroundSize: '40px 40px',
  backgroundRepeat: 'repeat',
  backgroundPosition: 'center',
  opacity: gearOpacity,  // 背景層 opacity，不影響文字
}}>
```

玩家第一次發現按鈕裡有紋路時，應該感到不安——「這是一直都有的嗎？」

**Layer 3 — 旋轉齒輪（nerve ≤ 2）**

按鈕後方出現 SVG 齒輪，緩慢旋轉。按鈕本身半透明，齒輪從背後透出來：

| nerve | 齒輪大小 | 轉速 | opacity | 數量 |
|-------|---------|------|---------|------|
| 4 | — | — | 0 | 0 |
| 3 | 按鈕高度 ×0.8 | 60s/圈 | 0.04 | 1 |
| 2 | 按鈕高度 ×1.5 | 20s/圈 | 0.10 | 2（互相咬合） |
| 1 | 按鈕高度 ×2.0，溢出邊界 | 8s/圈 | 0.18 | 3+（佈滿，文字被半遮擋） |

```jsx
function ForcedButton({ text, nerve, onClick }) {
  return (
    <div className="forced-btn-wrapper">
      {nerve <= 3 && (
        <GearOverlay
          count={nerve <= 1 ? 3 : nerve <= 2 ? 2 : 1}
          speed={nerve <= 1 ? 8 : nerve <= 2 ? 20 : 60}
          opacity={nerve <= 1 ? 0.18 : nerve <= 2 ? 0.10 : 0.04}
          scale={nerve <= 1 ? 2.0 : nerve <= 2 ? 1.5 : 0.8}
          overflow={nerve <= 1}   // 溢出按鈕邊界
        />
      )}
      <button
        className={`forced-btn ${nerve <= 2 ? 'forced-btn--eroded-deep' : nerve <= 4 ? 'forced-btn--eroded' : ''}`}
        onClick={onClick}
      >
        {corrupt(text, nerve)}
      </button>
    </div>
  );
}
```

**三層效果的疊加時間線：**

```
nerve 10-8:  正常按鈕
nerve  7-5:  正常按鈕（動作開始分解，但按鈕外觀不變）
nerve    4:  邊框出現細微鋸齒 ← 玩家開始不安
nerve    3:  鋸齒 + 背景浮現齒輪紋 + 背後有一個極淡齒輪在轉
nerve    2:  深鋸齒 + 齒輪紋更清晰 + 兩個互咬齒輪 + 按鈕文字開始 corrupt
nerve    1:  齒輪溢出按鈕、佈滿畫面、文字半被遮擋、最後那個空白冒號按鈕上只剩齒輪在轉
```

---

## 五、視覺崩壞系統

### 5.1 神經值 → 視覺效果映射

從《最後一封信》的 SAN 視覺系統搬入，改為由神經值驅動：

| 神經值 | 效果 | 實作 |
|--------|------|------|
| 8-10 | 無效果 | — |
| 5-7 | 暗角漸現 | `#distortion` 層 radial-gradient opacity 漸增 |
| 3-4 | 暗角 + 雜訊紋理 | `#noise` 層 feTurbulence SVG filter 疊加 |
| 1-2 | 暗角 + 雜訊 + 文字亂碼 | `corrupt()` 函式插入 combining characters |
| 0 | 強制崩潰結局 | 畫面全面崩壞 → 結局場景 |

### 5.2 視覺效果元件

```jsx
// 固定在畫面最上層的兩個效果層
<div id="distortion" />   // radial-gradient 暗角
<div id="noise" />         // feTurbulence 雜訊

// 隨 nerve 值更新
function updateDistortion(nerve) {
  const ratio = nerve / 10;
  distortion.style.opacity = ratio < 0.8 ? (0.8 - ratio) * 1.5 : 0;
  noise.style.opacity = ratio < 0.4 ? (0.4 - ratio) * 0.6 : 0;
}
```

### 5.3 文字雜訊化

```javascript
function corrupt(text, nerve) {
  const ratio = nerve / 10;
  if (ratio > 0.5) return text;
  const corruptChars = '̷̧̢̡̕͝͞҉̴̶̸͍̩̭̮̯̪̟̱̬̜̦̤̳';
  const intensity = (0.5 - ratio) * 2;
  return text.split('').map(c => {
    if (Math.random() < intensity * 0.15 && c.trim()) {
      return c + corruptChars[Math.floor(Math.random() * corruptChars.length)];
    }
    return c;
  }).join('');
}
```

### 5.4 神經損失動畫

```jsx
async function loseNerveAnimated(amount, reason) {
  const before = state.nerve;
  state.nerve = Math.max(0, state.nerve - amount);
  updateDistortion(state.nerve);
  showImpact({
    type: 'loss',
    label: '神經',
    before,
    after: state.nerve,
    amount,
    reason,
  });
  await sleep(800);
}
```

對應的 Impact 元件：

```jsx
function ImpactBox({ type, label, before, after, amount, reason }) {
  const isLoss = type === 'loss';
  return (
    <div className={`impact-box ${isLoss ? 'loss' : 'gain'}`}>
      <span className="impact-label">{label}</span>
      {before} → {after}
      <strong>{isLoss ? `−${amount}` : `+${amount}`}</strong>
      {reason && <div className="impact-reason">{reason}</div>}
    </div>
  );
}
```

---

## 六、存檔系統

### 6.1 三層備援

從《最後一封信》搬入，React 化：

```
Layer 1: window.storage (persistent, artifact 環境)
Layer 2: sessionStorage (當前分頁)
Layer 3: window.__hagurumaSaves (記憶體)
```

### 6.2 存檔 API

```typescript
const SAVE_PREFIX = 'haguruma-save:';

async function saveGame(slot: string = 'auto'): Promise<boolean>;
async function loadGame(slot: string = 'auto'): Promise<SaveData | null>;
async function deleteSave(slot: string = 'auto'): Promise<void>;
async function getSaveInfo(slot: string = 'auto'): Promise<SaveData | null>;
```

### 6.3 存檔資料結構

```typescript
interface SaveData {
  state: GameState;
  timestamp: string;       // ISO 8601
  slot: string;
  version: string;         // 引擎版本，用於遷移
  chapter: number;
  sceneName: string;       // 人類可讀場景名
}
```

### 6.4 自動存檔時機

- 每次進入新章節
- 每次做出選擇後
- 手動存檔由玩家觸發

### 6.5 讀檔恢復

```javascript
function resumeFromSave(saveData) {
  // 1. 恢復 state
  setState(saveData.state);
  // 2. 重新渲染當前場景（不重播歷史動畫）
  // 3. 恢復視覺效果層
  updateDistortion(saveData.state.nerve);
}
```

---

## 七、判定系統

### 7.1 歯車的判定 ≠ CoC 的判定

CoC 用 d100 vs 屬性值。歯車不適合這個模型——芥川龍之介的故事裡沒有「技能檢定」。

歯車的判定改為**手帖連結判定**：

```
連結判定：
  條件 = notebook.filter(symbol === X).length >= threshold
  成功 → 解鎖隱藏文本 + insight
  失敗 → 空轉提示
```

和**神經耐受判定**（極少數場景）：

```
神經判定：
  d10 ≤ nerve → 耐受成功（不額外扣神經）
  d10 > nerve → 耐受失敗（額外扣神經 + 觸發幻覺文本）
```

### 7.2 判定動畫

從最後一封信搬入骰值跳動動畫，但簡化：

```jsx
function NerveCheck({ nerve, label, onResult }) {
  // 1. 顯示判定框（標題 + 公式 d10 ≤ nerve）
  // 2. 數字跳動動畫（10 次，前快後慢）
  // 3. 落定 → 變色（成功金/失敗紅）
  // 4. 延遲後回傳結果
}
```

---

## 八、元件架構

### 8.1 元件樹

```
<HagurumaEngine>
  ├── <DistortionLayer nerve={nerve} />      // 暗角效果
  ├── <NoiseLayer nerve={nerve} />            // 雜訊效果
  ├── <StatusBar nerve={} insight={} writing={} />
  ├── <NotebookButton count={} onClick={} />
  │
  ├── <SceneRenderer>                         // 核心渲染器
  │   ├── <HistoryDisplay history={} />       // 已播放文字（淡化）
  │   ├── <TextBlock block={} />              // 當前播放文字
  │   ├── <ImpactBox />                       // 數值變動提示
  │   ├── <NerveCheck />                      // 判定動畫（條件渲染）
  │   └── <ChoicePanel choices={} />          // 選項面板
  │
  ├── <Notebook entries={} />                 // 手帖彈窗
  └── <SaveMenu />                            // 存讀檔彈窗
```

### 8.2 核心渲染流程

```
loadScene(sceneKey)
  │
  ├─ 1. 更新 state.scene
  ├─ 2. 計算 text（靜態或動態函式）
  ├─ 3. 記錄場景級 notebook
  ├─ 4. 逐塊顯示 TextBlock（打字機效果）
  │     └─ 每塊完成後 → onTextComplete()
  ├─ 5. 全部文字顯示完畢
  │     ├─ 有 choices → 顯示 ChoicePanel
  │     └─ 無 choices → 延遲後自動跳到 next
  └─ 6. 玩家選擇
        ├─ 記錄 flag
        ├─ 執行 effect
        ├─ 記錄 notebook
        ├─ 自動存檔
        └─ loadScene(choice.next)
```

---

## 九、視覺設計

### 9.1 色彩系統

歯車原型的色盤（保留），不用最後一封信的煤油燈色調：

```javascript
const PALETTE = {
  bg:          "#0a0a0c",     // 近黑
  bgLight:     "#111114",     // 面板底
  text:        "#c8c4b8",     // 主文字：灰白
  textDim:     "#6b6860",     // 弱化文字
  textBright:  "#e8e4d8",     // 亮文字
  accent:      "#8b7355",     // 強調：暗金
  accentDim:   "#5a4a38",     // 弱強調
  system:      "#4a6858",     // 系統框：暗綠
  systemText:  "#7aaa8a",     // 系統文字：綠
  dialogue:    "#a08060",     // 對話：暖金
  inner:       "#7070a0",     // 內心：紫
  border:      "#1e1e24",     // 邊框
  danger:      "#8b4040",     // 危險：暗紅
  choice:      "#1a1a20",     // 選項底
  choiceHover: "#222230",     // 選項 hover
  choiceBorder:"#2a2a35",     // 選項邊框
  impact: {
    lossBg:    "rgba(40, 10, 10, 0.4)",
    lossBorder:"#8b4040",
    lossText:  "#d4a89a",
    gainBg:    "rgba(20, 30, 20, 0.4)",
    gainBorder:"#6b8a4a",
    gainText:  "#b8c89a",
  },
};
```

### 9.2 字型

```css
font-family: 'Noto Serif TC', 'Noto Serif JP', 'Georgia', serif;
```

- Noto Serif TC：中文主體
- Noto Serif JP：日文原文
- 日中雙語對話中，日文原文在上、中文在下

### 9.3 打字速度

| 文本類型 | 速度 (ms/字) | 原因 |
|----------|-------------|------|
| narration | 18 | 芥川文體簡潔，不需要太慢 |
| inner | 25 | 內心獨白需要停頓感 |
| dialogue | 18 | 對話節奏要流暢 |
| system | 40 | 系統訊息需要辨識 |
| 恐怖揭露 | 28-30 | 特定場景可在 TextBlock 加 speed override |

### 9.4 動畫

| 效果 | Keyframes | 用途 |
|------|-----------|------|
| blink | opacity 0/1, 0.8s | 打字游標 |
| fadeIn | opacity 0→1 + translateY 8→0, 0.6s | 新元素進入 |
| slowPulse | opacity 0.3↔0.6, 3s | 標題畫面提示 |
| gearSpin | rotate 0→360, 60s | 標題畫面背景齒輪 |
| shake | translateX ±1px, 0.05s | 擲骰跳動 |

---

## 十、章節結構（全書）

### 10.1 原著對照

| 章 | 原題 | 中文 | 核心意象 | 主要符號 |
|----|------|------|----------|---------|
| 1 | レエン・コオト | 雨衣 | 雨衣反覆出現、齒輪初現 | 🧥⚙️🪽 |
| 2 | 復讐 | 復仇 | 火災、Strindberg、復仇心理 | 🔥📖 |
| 3 | 夜 | 夜 | 失眠、幽靈、人偶 | ⚙️◐ |
| 4 | もう一人の自分 | 另一個自己 | 分身、翅膀聲 | 🪽◐ |
| 5 | 赤光 | 紅光 | 火災預兆、松林 | 🔥⚙️ |
| 6 | 飛行機 | 飛機 | 機械文明、黑白 | ⚙️◐ |
| 7 | ラヂオ | 收音機 | 電波幻聽 | ⚙️📖 |
| 8 | 少くとも | 至少 | 藥物、自殺意念 | 💀 |
| 9 | 剃刀 | 剃刀 | 自傷衝動 | 💀⚙️ |
| 10 | 誰か | 某人 | 被跟蹤感 | 🧥💀 |
| 11 | 敗北 | 敗北 | 結局 | 全符號 |

### 10.2 場景數估計

| 章 | auto 場景 | 選擇場景 | 分支場景 | 合計 |
|----|----------|---------|---------|------|
| 1 | 12 | 8 | 10 | 30 |
| 2-11 | ~10 each | ~6 each | ~8 each | ~240 |
| **總計** | | | | **~270** |

### 10.3 結局分歧

```
神經歸零（任何時刻）→ 崩潰結局
  ├── 齒輪吞沒視野 → 永久閉眼
  └── 變體由 insight 和 writing 決定

全書通過（神經 > 0）→ 依三軸分流
  ├── 高洞察 + 高執筆 → 「遺稿」結局（最接近真實歷史）
  ├── 高洞察 + 低執筆 → 「沉默」結局（看見但寫不出）
  ├── 低洞察 + 高執筆 → 「虛構」結局（寫出來但沒看見真相）
  └── 低洞察 + 低執筆 → 「日常」結局（什麼都沒發生）
```

---

## 十一、檔案結構

```
haguruma-engine/
├── ENGINE_SPEC.md          ← 本文件
├── SCENES_FORMAT.md        ← 場景資料寫作指南
├── CHAPTER_GUIDE.md        ← 各章劇本設計筆記
│
├── src/
│   ├── engine/
│   │   ├── state.js        ← GameState 定義 + 初始值
│   │   ├── scenes.js       ← 場景載入器 + 流轉邏輯
│   │   ├── effects.js      ← 數值變動函式（loseNerve, gainInsight...）
│   │   ├── save.js         ← 三層存檔系統
│   │   ├── corrupt.js      ← 文字雜訊化
│   │   └── dice.js         ← 擲骰 + 判定邏輯
│   │
│   ├── components/
│   │   ├── HagurumaEngine.jsx   ← 根元件
│   │   ├── TextBlock.jsx        ← 文字塊渲染（打字機效果）
│   │   ├── ChoicePanel.jsx      ← 選項面板
│   │   ├── StatusBar.jsx        ← 狀態列
│   │   ├── Notebook.jsx         ← 手帖彈窗
│   │   ├── ImpactBox.jsx        ← 數值變動提示
│   │   ├── NerveCheck.jsx       ← 判定動畫
│   │   ├── DistortionLayer.jsx  ← 暗角效果層
│   │   ├── NoiseLayer.jsx       ← 雜訊效果層
│   │   └── SaveMenu.jsx         ← 存讀檔介面
│   │
│   ├── data/
│   │   ├── symbols.js           ← SYMBOLS 定義
│   │   ├── palette.js           ← PALETTE 色彩定義
│   │   └── chapters/
│   │       ├── ch1_raincoat.js  ← 第一章場景資料
│   │       ├── ch2_revenge.js   ← 第二章場景資料
│   │       └── ...
│   │
│   └── index.jsx                ← 入口
│
├── public/
│   └── index.html
│
└── package.json
```

---

## 十二、場景資料寫作指南（摘要）

詳見 [SCENES_FORMAT.md](SCENES_FORMAT.md)。

### 12.1 最小場景範例

```javascript
ch1_s01_prologue: {
  text: [
    { type: "system", content: "第一章　レエン・コオト" },
    { type: "system", content: "——雨衣——" },
    { type: "break" },
    { type: "narration", content: "冬日。你提著一只皮箱..." },
  ],
  next: "ch1_s02_auto_barber",
}
```

### 12.2 帶選擇的場景

```javascript
ch1_s03_barber_response: {
  text: [
    { type: "dialogue", speaker: "理髮店主人", jp: "「...」", cn: "「...」" },
  ],
  choices: [
    {
      text: "「下雨天出來——是來淋雨的吧？」",
      next: "ch1_s04_auto_barber_2",
      effect: { writing: 1 },
      flag: "joke_response",
    },
    {
      text: "沉默地望向窗外的松林。",
      next: "ch1_s04_auto_barber_2",
      effect: {},
      flag: "silent_response",
    },
  ],
}
```

### 12.3 動態文本場景

```javascript
ch1_s04_auto_barber_2: {
  text: (state) => {
    if (state.choicesMade.joke_response) {
      return [{ type: "dialogue", speaker: "理髮店主人", jp: "...", cn: "..." }];
    }
    return [{ type: "narration", content: "理髮店主人見你沉默..." }];
  },
  next: "ch1_s05_auto_station",
}
```

---

## 十三、品質確認清單

### 引擎

- [ ] 所有神經扣減都用 `loseNerveAnimated()`
- [ ] 每個場景末尾檢查 `nerve <= 0`（有 choices 的場景在 effect 執行後檢查）
- [ ] 存檔系統不依賴 `localStorage`
- [ ] `corrupt()` 只在 `nerve <= 5` 時啟動
- [ ] 視覺崩壞層 z-index 正確（distortion > noise > game）
- [ ] 打字速度在 18-40ms 範圍內
- [ ] 所有場景 ID 在 SCENES 物件中有定義（無死路）
- [ ] 歷史文字正確淡化顯示

### 場景資料

- [ ] 每個 choice 都有 `next` 指向有效場景
- [ ] 動態 text 函式覆蓋所有 flag 組合
- [ ] notebook entry 的 key 不重複
- [ ] 日文原文正確（對照青空文庫）
- [ ] 中文翻譯保持芥川文體

### 部署

- [ ] `@import` Google Fonts 在所有 CSS 規則之前
- [ ] 移動端 viewport meta 標籤存在
- [ ] 單檔打包版本可獨立運行

---

## 十四、開發路線

### v0.1 — 引擎核心 + 第一章（當前目標）

- [ ] 引擎核心元件
- [ ] 視覺崩壞系統
- [ ] 存檔系統
- [ ] 第一章全部場景遷移
- [ ] 部署到 GitHub Pages 或 Vercel

### v0.2 — 第二至三章

- [ ] 新增符號：🔥 火、⛩️ 神
- [ ] 連結判定系統完善
- [ ] 跨章節手帖累計

### v0.3 — 第四至六章

- [ ] 分身系統（另一個自己）
- [ ] 黑白視覺模式切換

### v1.0 — 全書

- [ ] 全 11 章完成
- [ ] 結局分歧系統
- [ ] 跨遊戲存檔（預留 CoC 宇宙串接口）

---

*// end of spec*
