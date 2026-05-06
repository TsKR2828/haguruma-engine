/**
 * Nerve decay progress bar — fills right-to-left as nerve drops.
 * Color shifts from cold gray (safe) → danger red (critical).
 * Props:
 *   nerve: number (0–10)
 *   max?:  number (default 10)
 */
export default function NerveBar({ nerve = 10, max = 10 }) {
  const ratio = nerve / max;
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
        <span style={{ color: labelColor, fontFamily: "'Noto Serif TC', serif" }}>神經</span>
        <span style={{ color: valueColor, fontFamily: "'Noto Serif TC', serif" }}>
          {nerve} / {max}
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
