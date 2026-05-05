# Engine Core Modules

引擎模組位於 `src/engine/`，分為兩層：純函式核心（無瀏覽器依賴）與瀏覽器 adapter。

純函式核心不可 import 瀏覽器 adapter；UI 層只透過 adapter 呼叫瀏覽器功能。

## 模組一覽

### 純函式核心

| 模組 | 責任 |
|------|------|
| `state.js` | GameState 定義、initialState、reducer |
| `effects.js` | 三軸數值變動（nerve / insight / writing） |
| `corrupt.js` | 神經衰弱時的文字雜訊化 |
| `connections.js` | 筆記符號 → 連結判定 |
| `scenes.js` | 場景查詢、文本解析、選項過濾 |

### 瀏覽器 Adapter

| 模組 | 責任 |
|------|------|
| `audio.js` | Web Audio API 封裝（ambient / sfx / 音量） |
| `save.js` | 三層備援存檔（localStorage → sessionStorage → memory） |
| `settings.js` | 使用者設定讀寫（localStorage） |

| 檔案 | 責任 |
|------|------|
| `index.js` | Barrel export（核心 + adapter） |

---

## state.js

定義遊戲狀態結構與 reducer。

### initialState

```js
{
  currentSceneId: null,
  currentChapter: 1,
  nerve: 10,        // 10→0 衰減
  insight: 0,       // 0→∞ 累積
  writing: 0,       // 0→∞ 累積
  notebook: [],     // [{ key, symbol, desc }]
  choicesMade: {},   // { [flag]: true }
  journey: { current, visited, symbols },
  connections: [],   // [connectionId]
}
```

### reducer actions

| Action | Payload | 說明 |
|--------|---------|------|
| `ADVANCE_SCENE` | `sceneId` | 切換當前場景 |
| `SET_FLAG` | `flag` | 記錄玩家選擇 |
| `ADD_NOTEBOOK` | `entry` | 新增筆記 |
| `APPLY_EFFECTS` | `effects` | 套用三軸數值變動 |
| `FORM_CONNECTION` | `connectionId, insightGain` | 形成連結 + 獲得洞察 |
| `VISIT_LOCATION` | `locationId` | 造訪地點 |
| `UNLOCK_SYMBOL` | `key` | 解鎖符號 |
| `RESET` | — | 重置為 initialState |

---

## effects.js

三軸數值的純函式操作，所有函式回傳新 state，不 mutate 原物件。

| 函式 | 簽名 | 說明 |
|------|------|------|
| `loseNerve` | `(state, amount) → state` | nerve 扣減，clamp ≥ 0 |
| `gainInsight` | `(state, amount) → state` | insight 增加 |
| `gainWriting` | `(state, amount) → state` | writing 增加 |
| `applyEffects` | `(state, effects) → state` | 統一處理 `{ nerve, insight, writing }` 格式 |

`applyEffects` 接受 chapter01.js 的標準 effects 格式：
```js
{ nerve: { amount: -1, reason }, insight: { amount: 1, reason } }
```

---

## corrupt.js

根據 nerve 數值對文本施加 combining diacritical marks 雜訊。

| 函式 | 簽名 |
|------|------|
| `corruptText` | `(text, nerveLevel) → string` |

- nerve > 5：原文不變
- nerve ≤ 5：根據 `(0.5 - nerve/10) × 2` 的強度疊加 combining characters
- Deterministic：相同輸入永遠產生相同輸出（hash-based，非 Math.random）

---

## connections.js

判定筆記符號是否形成連結。

| 函式 | 簽名 | 說明 |
|------|------|------|
| `resolveConnections` | `(state, connections) → conn[]` | 回傳新形成的連結（排除已有的） |
| `applyConnection` | `(state, conn) → state` | 將連結寫入 state + 加算 insight |

連結判定邏輯：
- `conn.requires`：檢查 notebook 是否包含所有必要 key
- `conn.check(state)`：自訂判定函式（例：`allright_meaning`）

---

## scenes.js

場景資料存取與解析。

| 函式 | 簽名 | 說明 |
|------|------|------|
| `getSceneById` | `(chapter, sceneId) → scene \| null` | 查詢場景 |
| `resolveText` | `(scene, state) → TextBlock[]` | 解析靜態或動態 text |
| `resolveChoices` | `(scene, state) → Choice[] \| null` | 回傳選項，過濾 `condition` |

`resolveText` 處理兩種格式：
- 靜態：`text: TextBlock[]` — 直接回傳
- 動態：`text: (state) => TextBlock[]` — 傳入 state 呼叫

`resolveChoices` 支援選項上的 `condition: (state) => boolean` 過濾。

---

---

## audio.js

Web Audio API 封裝。管理 ambient 背景音樂與 sfx 音效。

| 函式 | 簽名 | 說明 |
|------|------|------|
| `playAmbient` | `(url, opts?) → Promise` | 播放背景音，支援 loop 與 fadeIn（預設 1.5s），自動 crossfade |
| `playSfx` | `(url) → Promise` | 播放一次性音效 |
| `stopAllAudio` | `(fadeOut?) → void` | 停止所有音訊，預設 1.5s 淡出 |
| `setVolumes` | `({ ambientVol?, sfxVol? }) → void` | 即時調整音量，ambient 會平滑過渡 |

內部快取已解碼的 AudioBuffer，避免重複 fetch + decode。

---

## save.js

三層備援存讀檔系統：localStorage → sessionStorage → memory。

| 函式 | 簽名 | 說明 |
|------|------|------|
| `saveGame` | `(state) → void` | 序列化 state 並寫入三層 |
| `loadSave` | `() → object \| null` | 依序嘗試三層讀取 |
| `hasSave` | `() → boolean` | 是否有有效存檔 |
| `clearSave` | `() → void` | 清除所有層的存檔 |
| `restoreState` | `(saved) → state` | 從存檔物件還原為 engine state |
| `exportSave` | `(state) → string` | 匯出 JSON 字串（供手動備份） |
| `importSave` | `(json) → state \| null` | 從 JSON 字串匯入，失敗回傳 null |

`saveGame` 接收 engine state 物件（非全域變數），`restoreState` 回傳新 state 物件。

---

## settings.js

使用者偏好設定，持久化到 localStorage。

| 函式 | 簽名 | 說明 |
|------|------|------|
| `loadSettings` | `() → settings` | 從 localStorage 讀取，回傳合併後的設定 |
| `saveSettings` | `() → void` | 將當前設定寫入 localStorage |
| `getSettings` | `() → settings` | 取得當前設定（不讀 storage） |
| `updateSettings` | `(partial) → settings` | 部分更新 + 自動持久化 |
| `resetSettings` | `() → settings` | 重置為預設值 + 持久化 |

### 預設值

```js
{
  textSpeed: 18,                          // ms/字
  audioVolume: { ambient: 0.6, sfx: 0.8 },
  reducedMotion: false,
  autoplay: false,
  autoplayDelay: 2000,                    // ms
}
```

---

## 測試

```bash
npm test                    # vitest run（一次性）
npm run test:watch          # vitest（watch mode）
```

測試檔案位於 `tests/engine/`，涵蓋純函式核心模組。瀏覽器 adapter 需在整合測試中驗證。
