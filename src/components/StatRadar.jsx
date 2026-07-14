/**
 * N-axis radar chart driven by book.stats (施工圖 §2 S2-1：軸數動態＝stats.length).
 * Props:
 *   stats: Array<{ key, label, value, max?, kind: "drain"|"gain" }>
 *     drain axis  → ratio = value/max, label text shows "value/max".
 *     gain  axis  → ratio = min(value/displayMax, 1), label text shows raw value.
 *   displayMax?: number (default 30, soft cap for gain-axis length)
 */
export default function StatRadar({ stats, displayMax = 30 }) {
  const cx = 100, cy = 100, R = 72;
  const n = stats.length;

  const drain = stats.find((s) => s.kind === "drain") ?? stats[0];
  const drainRatio = drain && drain.max ? drain.value / drain.max : 0;
  const safeScheme = drainRatio > 0.5;
  const danger = drainRatio <= 0.4;

  const values = stats.map((s) =>
    s.kind === "drain"
      ? (s.max ? s.value / s.max : 0)
      : Math.min(s.value / displayMax, 1),
  );
  const angles = stats.map((_, i) => (Math.PI * 2 * i) / n - Math.PI / 2);

  const poly = (scale) =>
    angles.map(a => `${cx + R * scale * Math.cos(a)},${cy + R * scale * Math.sin(a)}`).join(" ");

  const dataPoints = values
    .map((v, i) => `${cx + R * v * Math.cos(angles[i])},${cy + R * v * Math.sin(angles[i])}`)
    .join(" ");

  const fillColor = safeScheme
    ? "rgba(200, 196, 184, 0.18)"
    : "rgba(139, 64, 64, 0.22)";
  const strokeColor = safeScheme ? "#6b6860" : "#8b4040";
  const dotColor = safeScheme ? "#c8c4b8" : "#8b4040";

  return (
    <svg viewBox="0 0 200 200" style={{ width: "100%", maxWidth: 220 }}>
      {[0.25, 0.5, 0.75, 1].map(s => (
        <polygon key={s} points={poly(s)} fill="none" stroke="rgba(107,104,96,0.12)" strokeWidth="1" />
      ))}
      {angles.map((a, i) => (
        <line key={i} x1={cx} y1={cy} x2={cx + R * Math.cos(a)} y2={cy + R * Math.sin(a)}
          stroke="rgba(107,104,96,0.15)" strokeWidth="1" />
      ))}
      <polygon points={dataPoints} fill={fillColor} stroke={strokeColor} strokeWidth="1.5" />
      {values.map((v, i) => {
        const lx = cx + (R + 20) * Math.cos(angles[i]);
        const ly = cy + (R + 20) * Math.sin(angles[i]);
        const s = stats[i];
        const isDrain = s.kind === "drain";
        return (
          <g key={s.key}>
            <circle
              cx={cx + R * v * Math.cos(angles[i])}
              cy={cy + R * v * Math.sin(angles[i])}
              r="3" fill={dotColor}
            />
            <text x={lx} y={ly} textAnchor="middle" dominantBaseline="central"
              fill="#6b6860" fontSize="10" fontFamily="'Noto Serif TC', serif">
              {s.label}
            </text>
            <text x={lx} y={ly + 13} textAnchor="middle" dominantBaseline="central"
              fill={isDrain && danger ? "#8b4040" : "#c8c4b8"} fontSize="11"
              fontFamily="'Noto Serif TC', serif">
              {isDrain ? `${s.value}/${s.max}` : s.value}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
