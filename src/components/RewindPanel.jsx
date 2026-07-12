// 選項回溯面板。規格：docs/batch-f5-ux.md §Lane R-2。
// 比照 NotebookPanel 的 overlay + slide-in panel 樣式。

export default function RewindPanel({ checkpoints, onSelect, onClose }) {
  return (
    <div className="rewind-overlay" onClick={onClose}>
      <div className="rewind-panel" onClick={(e) => e.stopPropagation()}>
        <div className="rewind-header">
          <span>⟲ 回溯</span>
          <button className="rewind-close" onClick={onClose}>
            ✕
          </button>
        </div>

        {checkpoints.length === 0 && (
          <div className="rewind-empty">本章尚無可回溯的選擇點</div>
        )}

        {checkpoints.map((cp) => (
          <button
            key={cp.pos}
            type="button"
            className="rewind-entry"
            onClick={() => onSelect(cp.pos)}
          >
            <span className="rewind-entry-fold">{cp.label}</span>
            <span className="rewind-entry-choice">{cp.chosenText}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
