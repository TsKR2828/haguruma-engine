import { useState, useCallback } from "react";
import { corruptText } from "../engine/corrupt";
import GearOverlay from "./GearOverlay";

function ForcedButton({ text, nerve, onClick, disabled }) {
  const corrupt = nerve <= 2;
  const display = corrupt ? corruptText(text, nerve) : text;

  let erosionClass = "";
  if (nerve <= 2) erosionClass = "forced-btn--eroded-deep";
  else if (nerve <= 4) erosionClass = "forced-btn--eroded";

  const showGears = nerve <= 3;
  let gearProps = null;
  if (nerve <= 1) gearProps = { count: 3, speed: 8, opacity: 0.18, scale: 2.0, overflow: true };
  else if (nerve <= 2) gearProps = { count: 2, speed: 20, opacity: 0.10, scale: 1.5, overflow: false };
  else if (nerve <= 3) gearProps = { count: 1, speed: 60, opacity: 0.04, scale: 0.8, overflow: false };

  return (
    <div className="forced-btn-wrapper">
      {showGears && <GearOverlay {...gearProps} />}
      <button
        className={`forced-btn ${erosionClass}`}
        onClick={onClick}
        disabled={disabled}
      >
        {display}
      </button>
    </div>
  );
}

export default function ForcedSteps({ steps, nerve, onComplete }) {
  const [doneIdx, setDoneIdx] = useState(-1);

  const handleClick = useCallback(
    (idx) => {
      setDoneIdx(idx);
      if (idx === steps.length - 1) {
        setTimeout(() => onComplete?.(), 300);
      }
    },
    [steps.length, onComplete],
  );

  return (
    <div className="forced-steps">
      {steps.map((step, i) => {
        if (i > doneIdx + 1) return null;
        if (i <= doneIdx) {
          return (
            <div key={i} className="forced-step forced-step--done">
              ✓ {step}
            </div>
          );
        }
        return (
          <ForcedButton
            key={i}
            text={step}
            nerve={nerve}
            onClick={() => handleClick(i)}
            disabled={false}
          />
        );
      })}
    </div>
  );
}
