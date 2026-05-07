export default function GearDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }}>
      <defs>
        <clipPath id="gear-teeth-subtle" clipPathUnits="objectBoundingBox">
          <path d="M0,0 h0.05 l0.02,0.015 h0.06 l0.02,-0.015 h0.06 l0.02,0.015 h0.06 l0.02,-0.015 h0.06 l0.02,0.015 h0.06 l0.02,-0.015 h0.06 l0.02,0.015 h0.06 l0.02,-0.015 h0.06 l0.02,0.015 H1 V1 h-0.05 l-0.02,-0.015 h-0.06 l-0.02,0.015 h-0.06 l-0.02,-0.015 h-0.06 l-0.02,0.015 h-0.06 l-0.02,-0.015 h-0.06 l-0.02,0.015 h-0.06 l-0.02,-0.015 h-0.06 l-0.02,0.015 h-0.06 l-0.02,-0.015 H0 Z" />
        </clipPath>
        <clipPath id="gear-teeth-heavy" clipPathUnits="objectBoundingBox">
          <path d="M0,0 h0.04 l0.03,0.03 h0.05 l0.03,-0.03 h0.05 l0.03,0.03 h0.05 l0.03,-0.03 h0.05 l0.03,0.03 h0.05 l0.03,-0.03 h0.05 l0.03,0.03 h0.05 l0.03,-0.03 h0.05 l0.03,0.03 H1 V1 h-0.04 l-0.03,-0.03 h-0.05 l-0.03,0.03 h-0.05 l-0.03,-0.03 h-0.05 l-0.03,0.03 h-0.05 l-0.03,-0.03 h-0.05 l-0.03,0.03 h-0.05 l-0.03,-0.03 h-0.05 l-0.03,0.03 h-0.05 l-0.03,-0.03 H0 Z" />
        </clipPath>
      </defs>
    </svg>
  );
}

export function GearSvg({ size = 40, className = "" }) {
  const r = size / 2;
  const teeth = 12;
  const outerR = r * 0.95;
  const innerR = r * 0.7;
  const toothH = r * 0.18;

  let d = "";
  for (let i = 0; i < teeth; i++) {
    const a1 = (i / teeth) * Math.PI * 2;
    const a2 = ((i + 0.35) / teeth) * Math.PI * 2;
    const a3 = ((i + 0.5) / teeth) * Math.PI * 2;
    const a4 = ((i + 0.85) / teeth) * Math.PI * 2;

    const cmd = i === 0 ? "M" : "L";
    d += `${cmd}${r + Math.cos(a1) * innerR},${r + Math.sin(a1) * innerR} `;
    d += `L${r + Math.cos(a2) * (outerR + toothH)},${r + Math.sin(a2) * (outerR + toothH)} `;
    d += `L${r + Math.cos(a3) * (outerR + toothH)},${r + Math.sin(a3) * (outerR + toothH)} `;
    d += `L${r + Math.cos(a4) * innerR},${r + Math.sin(a4) * innerR} `;
  }
  d += "Z";

  const holeR = r * 0.25;

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="currentColor"
    >
      <path d={d} fillRule="evenodd" />
      <circle cx={r} cy={r} r={holeR} fill="var(--washi-bg-main, #FAF7F2)" />
    </svg>
  );
}
