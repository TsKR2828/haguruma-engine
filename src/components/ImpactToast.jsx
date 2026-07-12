import { useState, useEffect } from "react";

/**
 * Floating impact notification — red for loss, green for gain.
 * Supports multiple simultaneous toasts stacked vertically, each fading
 * out independently on its own timer (Bug 4 fix: a compound effect no
 * longer overwrites/hides earlier toasts — every stat change gets shown).
 *
 * Props:
 *   impacts: Array<{ id, type: "loss"|"gain", label: string, amount: number, reason?: string }>
 *   onDismiss?: (id) => void — called once a toast's fade-out finishes
 *   duration?: number (ms, default 2200)
 *
 * Usage:
 *   const [impacts, setImpacts] = useState([]);
 *   <ImpactToast impacts={impacts} onDismiss={(id) => setImpacts((c) => c.filter((i) => i.id !== id))} />
 *   setImpacts((c) => [...c, { id: 1, type: "loss", label: "神經", amount: 1, reason: "你想起了齒輪" }]);
 */
function ToastItem({ impact, duration, onDone }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    const hideTimer = setTimeout(() => setVisible(false), duration);
    const removeTimer = setTimeout(() => onDone?.(impact.id), duration + 400);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(hideTimer);
      clearTimeout(removeTimer);
    };
    // Each toast mounts once (keyed by impact.id) and manages its own
    // lifecycle independently of sibling toasts being added/removed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isLoss = impact.type === "loss";
  const bg = isLoss ? "rgba(40, 10, 10, 0.92)" : "rgba(20, 30, 20, 0.92)";
  const border = isLoss ? "#8b4040" : "#6b8a4a";
  const textColor = isLoss ? "#d4a89a" : "#b8c89a";
  const sign = isLoss ? "−" : "+";

  return (
    <div
      className="impact-toast"
      style={{
        transform: `translateY(${visible ? 0 : -20}px)`,
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: 6,
        padding: "10px 22px",
        color: textColor,
        fontSize: 13,
        fontFamily: "'Noto Serif TC', serif",
        letterSpacing: "0.04em",
        transition: "transform 0.4s ease, opacity 0.4s ease",
        opacity: visible ? 1 : 0,
        pointerEvents: "none",
        boxShadow: `0 4px 20px rgba(0, 0, 0, 0.5)`,
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      <span style={{ fontWeight: 500 }}>{impact.label}</span>
      <span style={{ fontSize: 15, fontWeight: 600 }}>
        {sign}
        {impact.amount}
      </span>
      {impact.reason && (
        <span style={{ fontSize: 11, opacity: 0.7, marginLeft: 4 }}>— {impact.reason}</span>
      )}
    </div>
  );
}

export default function ImpactToast({ impacts = [], onDismiss, duration = 2200 }) {
  if (!impacts || impacts.length === 0) return null;

  return (
    <div
      className="impact-toast-stack"
      style={{
        position: "fixed",
        top: 28,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        zIndex: 200,
        pointerEvents: "none",
      }}
    >
      {impacts.map((impact) => (
        <ToastItem key={impact.id} impact={impact} duration={duration} onDone={onDismiss} />
      ))}
    </div>
  );
}
