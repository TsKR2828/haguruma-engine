import { SYMBOL_GLYPHS } from "../data/symbols";

function locStatus(journey, locId) {
  if (journey.current === locId) return "current";
  if (journey.visited.includes(locId)) return "visited";
  return "unseen";
}

function buildJourneyPath(locs) {
  if (locs.length === 0) return "";
  let p = `M ${locs[0].x} ${locs[0].y}`;
  for (let i = 1; i < locs.length; i++) {
    const prev = locs[i - 1];
    const cur = locs[i];
    const mx = (prev.x + cur.x) / 2;
    const my = (prev.y + cur.y) / 2;
    const offset = i % 2 === 0 ? -12 : 14;
    p += ` Q ${mx + offset} ${my + 6} ${cur.x} ${cur.y}`;
  }
  return p;
}

function JourneyMap({ locations, journey }) {
  if (!locations || locations.length === 0 || !journey) {
    return <div className="conn-empty">尚無行路記錄。</div>;
  }

  const W = 240;
  const H = 280;
  const locs = locations.map((l) => ({
    ...l,
    x: l.x * 0.78,
    y: (l.y - 40) * 0.7 + 20,
  }));
  const path = buildJourneyPath(locs);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "auto", display: "block" }}
    >
      <rect width={W} height={H} fill="#FAF7F2" />
      <rect width={W} height={H} opacity="0.3">
        <animate
          attributeName="opacity"
          values="0.3;0.4;0.3"
          dur="8s"
          repeatCount="indefinite"
        />
      </rect>
      <path
        d={path}
        stroke="#8B7E6E"
        strokeWidth="1"
        fill="none"
        strokeDasharray="2,3"
        opacity="0.6"
      />
      {locs.map((loc) => {
        const status = locStatus(journey, loc.id);
        const isCurrent = status === "current";
        const isVisited = status === "visited";
        const fillColor = isCurrent
          ? "#C9A86A"
          : isVisited
            ? "#8B7E6E"
            : "#DDD6C6";
        const strokeColor = isCurrent ? "#4A3F33" : "#C8BFA8";
        const labelColor = isCurrent
          ? "#2C2418"
          : isVisited
            ? "#4A3F33"
            : "#B5AA98";
        const labelText = status === "unseen" ? "?" : loc.label;
        const sw = isCurrent ? 1.2 : 0.8;

        return (
          <g key={loc.id}>
            {isCurrent && (
              <circle
                cx={loc.x}
                cy={loc.y}
                r="5"
                fill="none"
                stroke="#C9A86A"
                opacity="0.5"
              >
                <animate
                  attributeName="r"
                  values="5;14;5"
                  dur="2.4s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.5;0;0.5"
                  dur="2.4s"
                  repeatCount="indefinite"
                />
              </circle>
            )}
            {loc.shape === "rect" ? (
              <rect
                x={loc.x - 4}
                y={loc.y - 4}
                width="8"
                height="8"
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth={sw}
              />
            ) : loc.shape === "mountain" ? (
              <path
                d={`M ${loc.x - 5} ${loc.y + 4} L ${loc.x} ${loc.y - 5} L ${loc.x + 5} ${loc.y + 4} Z`}
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth={sw}
              />
            ) : (
              <circle
                cx={loc.x}
                cy={loc.y}
                r="3.5"
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth={sw}
              />
            )}
            <text
              x={loc.x + 9}
              y={loc.y + 3}
              fill={labelColor}
              fontSize="9"
              fontFamily="'Noto Serif TC', serif"
            >
              {labelText}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function RightSidebar({ state, chapter }) {
  if (!state) return null;

  const { notebook, connections, journey } = state;
  const locations = chapter?.locations ?? [];

  return (
    <>
      <section className="right-section">
        <div className="right-section-header">手帖</div>
        {notebook.length === 0 ? (
          <div className="mini-nb-empty">尚無記錄。</div>
        ) : (
          notebook.map((entry, i) => (
            <div key={i} className="mini-nb-entry">
              <span className="nb-icon">
                {SYMBOL_GLYPHS[entry.key]?.glyph || "◇"}
              </span>
              {entry.desc}
            </div>
          ))
        )}
      </section>

      <section className="right-section">
        <div className="right-section-header">連結</div>
        {connections.length === 0 ? (
          <div className="conn-empty">
            尚未浮現。
            <br />
            連結將在意象交會時自然顯現。
          </div>
        ) : (
          connections.map((conn, i) => (
            <div key={i} className="connection-card">
              <div className="connection-card-icon">{conn.icon || "✦"}</div>
              <div className="connection-card-title">{conn.title || conn.id}</div>
              {conn.subtitle && (
                <div className="connection-card-subtitle">
                  ── {conn.subtitle} ──
                </div>
              )}
            </div>
          ))
        )}
      </section>

      <section className="right-section">
        <div className="right-section-header">行路</div>
        <JourneyMap locations={locations} journey={journey} />
      </section>
    </>
  );
}
