import { BOOK } from "../bookLoader";

/**
 * Drain-stat decay progress bar — fills right-to-left as the stat drops.
 * Color shifts from cold gray (safe) → danger red (critical).
 * 施工圖 §2 S2-1：內部改讀 `book.stats.find(kind==="drain")`（檔名不改）。
 * Props:
 *   value: number — 目前值（沿用舊 prop 名 `nerve` 以防呼叫端漏改）
 *   book?: book bundle（預設 haguruma，向後相容）
 */
export default function NerveBar({ nerve, value, book = BOOK }) {
  const stat = book.stats.find((s) => s.kind === "drain") ?? book.stats[0];
  const max = stat?.max ?? 10;
  const label = stat?.label ?? "";
  const cur = value ?? nerve ?? max;

  const ratio = cur / max;
  const pct = Math.max(0, Math.min(100, ratio * 100));

  const isDanger = ratio <= 0.4;
  const isCritical = ratio <= 0.2;

  const barColor = isCritical
    ? "linear-gradient(90deg, #8b4040, #5e2a2a)"
    : isDanger
      ? "linear-gradient(90deg, #8b4040, #a05050)"
      : "linear-gradient(90deg, #6b6860, #c8c4b8)";

  const labelColor = isDanger ? "#8b4040" : "#6b6860";
  const valueColor = isDanger ? "#d4a89a" : "#c8c4b8";

  return (
    <div style={{ margin: "10px 0" }}>
      <div style={{
        display: "flex", justifyContent: "space-between",
        fontSize: 11, letterSpacing: "0.08em", marginBottom: 4,
      }}>
        <span style={{ color: labelColor, fontFamily: "'Noto Serif TC', serif" }}>{label}</span>
        <span style={{ color: valueColor, fontFamily: "'Noto Serif TC', serif" }}>
          {cur} / {max}
        </span>
      </div>
      <div style={{
        height: 6,
        background: "rgba(30, 30, 36, 0.8)",
        borderRadius: 3,
        overflow: "hidden",
        border: `1px solid ${isDanger ? "rgba(139,64,64,0.3)" : "#1e1e24"}`,
      }}>
        <div style={{
          width: `${pct}%`,
          height: "100%",
          background: barColor,
          borderRadius: 3,
          transition: "width 0.8s ease, background 0.6s ease",
          ...(isCritical ? { animation: "hgr-nerve-pulse 2s infinite" } : {}),
        }} />
      </div>
      <style>{`
        @keyframes hgr-nerve-pulse {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}
