import { SYMBOL_GLYPHS } from "../data/symbols";
import StatRadar from "./StatRadar";

export default function NotebookPanel({ state, chapter, onClose }) {
  const { notebook, connections, nerve, insight, writing } = state;

  return (
    <div className="notebook-overlay" onClick={onClose}>
      <div className="notebook-panel" onClick={(e) => e.stopPropagation()}>
        <div className="notebook-header">
          <span>手帖</span>
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
              {SYMBOL_GLYPHS[entry.key] || "◇"}
            </span>
            <span className="notebook-desc">{entry.desc}</span>
          </div>
        ))}

        {connections.length > 0 && (
          <>
            <div className="notebook-section-title">連結</div>
            {connections.map((connId, i) => {
              const conn = (chapter?.connections ?? []).find((c) => c.id === connId);
              return (
                <div key={i} className="notebook-entry notebook-connection">
                  <span className="notebook-symbol">{conn?.icon || "✦"}</span>
                  <span className="notebook-desc">
                    {conn?.title || connId}
                    {conn?.subtitle ? ` — ${conn.subtitle}` : ""}
                  </span>
                </div>
              );
            })}
          </>
        )}

        <div className="notebook-radar-wrap">
          <StatRadar nerve={nerve} insight={insight} writing={writing} />
        </div>
      </div>
    </div>
  );
}
