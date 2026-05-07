import { GearSvg } from "./GearDefs";

export default function GearOverlay({ count = 1, speed = 60, opacity = 0.04, scale = 0.8, overflow = false }) {
  const gears = [];
  for (let i = 0; i < count; i++) {
    const size = 48 * scale;
    const reverse = i % 2 === 1;
    const offsetX = count === 1 ? 0 : (i - (count - 1) / 2) * size * 0.6;

    gears.push(
      <GearSvg
        key={i}
        size={size}
        className="gear-overlay-svg"
        style={{
          animation: `hgr-gear-spin ${speed}s linear infinite ${reverse ? "reverse" : "normal"}`,
          transform: `translateX(${offsetX}px)`,
        }}
      />,
    );
  }

  return (
    <div
      className="gear-overlay"
      style={{
        opacity,
        overflow: overflow ? "visible" : "hidden",
      }}
    >
      {gears}
    </div>
  );
}
