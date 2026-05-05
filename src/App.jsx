import {
  CH1_SCENES,
  CONNECTIONS,
  LOCATIONS,
  SYMBOLS,
  SYMBOL_GLYPHS,
  CHAPTERS,
} from "./data";

const sceneKeys = Object.keys(CH1_SCENES);
const dynamicScenes = sceneKeys.filter(
  (k) => typeof CH1_SCENES[k].text === "function"
);

export default function App() {
  return (
    <div className="app-shell">
      <header className="shell-header">
        <h1 className="shell-title">歯車</h1>
        <p className="shell-subtitle">haguruma-engine</p>
      </header>

      <main className="shell-main">
        <div className="shell-card">
          <p className="shell-status">React 版建置中</p>
          <p className="shell-desc">
            引擎正在從 vanilla prototype 遷移至 Vite + React 架構。
          </p>
          <div className="shell-info">
            <div className="shell-info-row">
              <span className="shell-label">原型</span>
              <span className="shell-value">第一章 33 場景驗收通過</span>
            </div>
            <div className="shell-info-row">
              <span className="shell-label">目標</span>
              <span className="shell-value">React 資料驅動場景系統</span>
            </div>
            <div className="shell-info-row">
              <span className="shell-label">狀態</span>
              <span className="shell-value">Batch 1 — 資料層提取</span>
            </div>
          </div>

          <div className="shell-info" style={{ marginTop: 16 }}>
            <div className="shell-info-row">
              <span className="shell-label">場景數</span>
              <span className="shell-value">{sceneKeys.length}</span>
            </div>
            <div className="shell-info-row">
              <span className="shell-label">動態場景</span>
              <span className="shell-value">{dynamicScenes.length}（{dynamicScenes.join(", ")}）</span>
            </div>
            <div className="shell-info-row">
              <span className="shell-label">連結規則</span>
              <span className="shell-value">{CONNECTIONS.length}</span>
            </div>
            <div className="shell-info-row">
              <span className="shell-label">地點</span>
              <span className="shell-value">{LOCATIONS.length}</span>
            </div>
            <div className="shell-info-row">
              <span className="shell-label">符號類別</span>
              <span className="shell-value">{Object.keys(SYMBOLS).length}</span>
            </div>
            <div className="shell-info-row">
              <span className="shell-label">符號 Glyphs</span>
              <span className="shell-value">{Object.keys(SYMBOL_GLYPHS).length}</span>
            </div>
            <div className="shell-info-row">
              <span className="shell-label">章節</span>
              <span className="shell-value">{CHAPTERS.length}</span>
            </div>
          </div>

          <a className="shell-legacy-link" href="/prototype.html">
            遊玩 Legacy Prototype（第一章）
          </a>
        </div>
      </main>

      <footer className="shell-footer">
        芥川龍之介《歯車》（1927）— 原著文本為公有領域
      </footer>
    </div>
  );
}
