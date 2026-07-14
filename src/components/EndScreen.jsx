import { BOOK } from "../bookLoader";

export default function EndScreen({ state, chapter, hasNextChapter, onAdvance, onClose, book = BOOK }) {
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
          {book.stats.map((s) => (
            <div className="end-stat-row" key={s.key}>
              <span>{s.label}</span>
              <span>{s.max != null ? `${state[s.key]} / ${s.max}` : state[s.key]}</span>
            </div>
          ))}
          <div className="end-stat-row">
            <span>{book.ui.notebookLabel}</span>
            <span>{state.notebook.length} 筆</span>
          </div>
          <div className="end-stat-row">
            <span>{book.ui.connectionLabel}</span>
            <span>{state.connections.length}</span>
          </div>
        </div>
        {hasNextChapter && onAdvance && (
          <button className="end-advance-btn" onClick={onAdvance}>
            {book.ui.nextChapterLabel} ▸
          </button>
        )}
      </div>
    </div>
  );
}
