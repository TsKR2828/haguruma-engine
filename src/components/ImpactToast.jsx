import { useState, useEffect, useCallback } from "react";

/**
 * Floating impact notification — red for loss, green for gain.
 * Props:
 *   impact: { type: "loss"|"gain", label: string, amount: number, reason?: string } | null
 *   duration?: number (ms, default 2200)
 *
 * Usage:
 *   const [impact, setImpact] = useState(null);
 *   <ImpactToast impact={impact} />
 *   setImpact({ type: "loss", label: "神經", amount: 1, reason: "你想起了齒輪" });
 */
export default function ImpactToast({ impact, duration = 2200 }) {
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState(null);

  useEffect(() => {
    if (!impact) return;
    setCurrent(impact);
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [impact, duration]);

  if (!current) return null;

  const isLoss = current.type === "loss";
  const bg = isLoss ? "rgba(40, 10, 10, 0.92)" : "rgba(20, 30, 20, 0.92)";
  const border = isLoss ? "#8b4040" : "#6b8a4a";
  const textColor = isLoss ? "#d4a89a" : "#b8c89a";
  const sign = isLoss ? "−" : "+";

  return (
    <div style={{
      position: "fixed",
      top: 28,
      left: "50%",
      transform: `translateX(-50%) translateY(${visible ? 0 : -50}px)`,
      background: bg,
      border: `1px solid ${border}`,
      borderRadius: 6,
      padding: "10px 22px",
      color: textColor,
      fontSize: 13,
      fontFamily: "'Noto Serif TC', serif",
      letterSpacing: "0.04em",
      zIndex: 200,
      transition: "transform 0.4s ease, opacity 0.4s ease",
      opacity: visible ? 1 : 0,
      pointerEvents: "none",
      boxShadow: `0 4px 20px rgba(0, 0, 0, 0.5)`,
      display: "flex",
      alignItems: "center",
      gap: 10,
    }}>
      <span style={{ fontWeight: 500 }}>{current.label}</span>
      <span style={{ fontSize: 15, fontWeight: 600 }}>{sign}{current.amount}</span>
      {current.reason && (
        <span style={{ fontSize: 11, opacity: 0.7, marginLeft: 4 }}>— {current.reason}</span>
      )}
    </div>
  );
}
