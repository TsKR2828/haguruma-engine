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
              <span className="shell-value">Batch 0 — 工具鏈建立</span>
            </div>
          </div>
          <a
            className="shell-legacy-link"
            href="/prototype.html"
          >
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
