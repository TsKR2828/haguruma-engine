/**
 * Three-axis radar chart for nerve / insight / writing.
 * Props:
 *   nerve:   number (0–10)
 *   insight: number (0–∞, clamped to display max)
 *   writing: number (0–∞, clamped to display max)
 *   displayMax?: number (default 30, soft cap for insight/writing axis length)
 */
export default function StatRadar({ nerve = 10, insight = 0, writing = 0, displayMax = 30 }) {
  const cx = 100, cy = 100, R = 72;
  const keys = ["nerve", "insight", "writing"];
  const labels = ["神經", "洞察", "執筆"];
  const values = [
    nerve / 10,
    Math.min(insight / displayMax, 1),
    Math.min(writing / displayMax, 1),
  ];
  const angles = keys.map((_, i) => (Math.PI * 2 * i) / 3 - Math.PI / 2);

  const poly = (scale) =>
    angles.map(a => `${cx + R * scale * Math.cos(a)},${cy + R * scale * Math.sin(a)}`).join(" ");

  const dataPoints = values
    .map((v, i) => `${cx + R * v * Math.cos(angles[i])},${cy + R * v * Math.sin(angles[i])}`)
    .join(" ");

  const nerveRatio = nerve / 10;
  const fillColor = nerveRatio > 0.5
    ? "rgba(200, 196, 184, 0.18)"
    : "rgba(139, 64, 64, 0.22)";
  const strokeColor = nerveRatio > 0.5 ? "#6b6860" : "#8b4040";
  const dotColor = nerveRatio > 0.5 ? "#c8c4b8" : "#8b4040";

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
        const raw = [nerve, insight, writing][i];
        return (
          <g key={keys[i]}>
            <circle
              cx={cx + R * v * Math.cos(angles[i])}
              cy={cy + R * v * Math.sin(angles[i])}
              r="3" fill={dotColor}
            />
            <text x={lx} y={ly} textAnchor="middle" dominantBaseline="central"
              fill="#6b6860" fontSize="10" fontFamily="'Noto Serif TC', serif">
              {labels[i]}
            </text>
            <text x={lx} y={ly + 13} textAnchor="middle" dominantBaseline="central"
              fill={i === 0 && nerveRatio <= 0.4 ? "#8b4040" : "#c8c4b8"} fontSize="11"
              fontFamily="'Noto Serif TC', serif">
              {i === 0 ? `${nerve}/10` : raw}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
