import { BOOK } from "../bookLoader";
import { SYMBOL_GLYPHS } from "../data/symbols";
import StatRadar from "./StatRadar";

export default function NotebookPanel({ state, chapter, onClose, book = BOOK }) {
  const { notebook, connections } = state;
  const stats = book.stats.map((s) => ({ ...s, value: state[s.key] }));

  return (
    <div className="notebook-overlay" onClick={onClose}>
      <div className="notebook-panel" onClick={(e) => e.stopPropagation()}>
        <div className="notebook-header">
          <span>{book.ui.notebookLabel}</span>
          <button className="notebook-close" onClick={onClose}>
            ✕
          </button>
        </div>

        {notebook.length === 0 && (
          <div className="notebook-empty">尚無記錄</div>
        )}

        {notebook.map((entry, i) => (
          <div key={i} className="notebook-entry">
            <span className="notebook-symbol">
              {SYMBOL_GLYPHS[entry.key]?.glyph || "◇"}
            </span>
            <span className="notebook-desc">{entry.desc}</span>
          </div>
        ))}

        {connections.length > 0 && (
          <>
            <div className="notebook-section-title">{book.ui.connectionLabel}</div>
            {connections.map((conn, i) => (
              <div key={i} className="notebook-entry notebook-connection">
                <span className="notebook-symbol">{conn.icon || "✦"}</span>
                <span className="notebook-desc">
                  {conn.title || conn.id}
                  {conn.subtitle ? ` — ${conn.subtitle}` : ""}
                </span>
              </div>
            ))}
          </>
        )}

        <div className="notebook-radar-wrap">
          <StatRadar stats={stats} />
        </div>
      </div>
    </div>
  );
}
