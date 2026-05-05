# Engine Core Modules

純函式引擎核心，位於 `src/engine/`。所有模組無瀏覽器依賴，可獨立測試。

## 模組一覽

| 模組 | 責任 |
|------|------|
| `state.js` | GameState 定義、initialState、reducer |
| `effects.js` | 三軸數值變動（nerve / insight / writing） |
| `corrupt.js` | 神經衰弱時的文字雜訊化 |
| `connections.js` | 筆記符號 → 連結判定 |
| `scenes.js` | 場景查詢、文本解析、選項過濾 |
| `index.js` | Barrel export |

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

## 測試

```bash
npm test                    # vitest run（一次性）
npm run test:watch          # vitest（watch mode）
```

測試檔案位於 `tests/engine/`，涵蓋所有模組。
