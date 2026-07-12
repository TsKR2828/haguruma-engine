export default function EndScreen({ state, chapter, hasNextChapter, onAdvance, onClose }) {
  return (
    <div className="end-overlay">
      <div className="end-card">
        {onClose && (
          <button className="end-close" onClick={onClose} aria-label="關閉">×</button>
        )}
        <div className="end-title">
          第{chapter.chapter}章　終
        </div>
        <div className="end-subtitle">
          {chapter.title}（{chapter.titleCn}）
        </div>
        <div className="end-stats">
          <div className="end-stat-row">
            <span>神經</span>
            <span>{state.nerve} / 10</span>
          </div>
          <div className="end-stat-row">
            <span>洞察</span>
            <span>{state.insight}</span>
          </div>
          <div className="end-stat-row">
            <span>執筆</span>
            <span>{state.writing}</span>
          </div>
          <div className="end-stat-row">
            <span>手帖</span>
            <span>{state.notebook.length} 筆</span>
          </div>
          <div className="end-stat-row">
            <span>連結</span>
            <span>{state.connections.length}</span>
          </div>
        </div>
        {hasNextChapter && onAdvance && (
          <button className="end-advance-btn" onClick={onAdvance}>
            次の章へ ▸
          </button>
        )}
      </div>
    </div>
  );
}
