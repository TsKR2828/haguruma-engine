import { useMemo } from "react";
import { BOOK } from "../bookLoader";

/**
 * Ambient floating particles — shifts from cold gray (high nerve) to blood-red (low nerve).
 * 施工圖 §2 S2-2：變色比例讀 book.corruption.particleRatioOf（取代寫死的 /10）。
 * Props:
 *   nerve: number
 *   count?: number (default 15)
 *   corruption?: book.corruption（預設 haguruma，向後相容）
 */
export default function Particles({ nerve = 10, count = 15, corruption = BOOK.corruption }) {
  const ratio = nerve / (corruption?.particleRatioOf ?? 10);

  const baseColor = ratio > 0.5
    ? `rgba(200, 196, 184, ${0.08 + (1 - ratio) * 0.12})`   // cold gray
    : `rgba(139, 64, 64, ${0.10 + (1 - ratio) * 0.18})`;     // blood red

  const particles = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 8,
      dur: 6 + Math.random() * 6,
      size: 1 + Math.random() * 2,
    })), [count]);

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      {particles.map(p => (
        <div key={p.id} style={{
          position: "absolute",
          left: `${p.left}%`,
          bottom: "-5%",
          width: p.size,
          height: p.size,
          borderRadius: "50%",
          background: baseColor,
          animation: `hgr-float-up ${p.dur}s ${p.delay}s infinite linear`,
        }} />
      ))}
      <style>{`
        @keyframes hgr-float-up {
          0%   { transform: translateY(0);       opacity: 0;   }
          10%  { opacity: 0.3; }
          90%  { opacity: 0.05; }
          100% { transform: translateY(-105vh);   opacity: 0;   }
        }
      `}</style>
    </div>
  );
}
