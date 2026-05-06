import { useState, useEffect, useRef, useCallback } from "react";
import { corruptText } from "../engine/corrupt";

const SPEED = { narration: 18, inner: 25, dialogue: 20, system: 0 };

function rawText(block) {
  if (block.type === "dialogue") {
    return [block.jp, block.cn].filter(Boolean).join("\n");
  }
  return block.content || "";
}

export default function SceneText({ blocks, nerve, onComplete }) {
  const [doneCount, setDoneCount] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [pausing, setPausing] = useState(false);
  const completeFired = useRef(false);
  const endRef = useRef(null);

  const active = doneCount < blocks.length ? blocks[doneCount] : null;

  const advance = useCallback(() => {
    setDoneCount((d) => d + 1);
    setCharIdx(0);
    setPausing(false);
  }, []);

  useEffect(() => {
    if (!active) {
      if (!completeFired.current) {
        completeFired.current = true;
        onComplete?.();
      }
      return;
    }

    if (active.type === "break") {
      advance();
      return;
    }

    if (active.type === "pause") {
      setPausing(true);
      const t = setTimeout(advance, active.duration || 1000);
      return () => clearTimeout(t);
    }

    const text = rawText(active);
    const speed = SPEED[active.type] ?? 18;

    if (speed === 0 || charIdx >= text.length) {
      setCharIdx(text.length);
      const delay = active.type === "system" ? 350 : 60;
      const t = setTimeout(advance, delay);
      return () => clearTimeout(t);
    }

    const t = setTimeout(() => setCharIdx((i) => i + 1), speed);
    return () => clearTimeout(t);
  }, [active, doneCount, charIdx, advance, onComplete]);

  function handleClick() {
    if (pausing || !active) return;
    const text = rawText(active);
    if (charIdx < text.length) setCharIdx(text.length);
  }

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [doneCount, charIdx]);

  function renderBlock(block, idx, isActive) {
    const text = rawText(block);
    const shown = isActive ? text.slice(0, charIdx) : text;
    const corrupt =
      (block.type === "narration" || block.type === "inner") && nerve <= 5;
    const display = corrupt ? corruptText(shown, nerve) : shown;
    const typing = isActive && charIdx < text.length;

    switch (block.type) {
      case "break":
        return <div key={idx} className="scene-block-break" />;
      case "system":
        return (
          <div key={idx} className="scene-block scene-block-system">
            {display}
          </div>
        );
      case "dialogue": {
        const lines = display.split("\n");
        return (
          <div key={idx} className="scene-block scene-block-dialogue">
            {block.speaker && (
              <div className="scene-block-speaker">{block.speaker}</div>
            )}
            <div className="scene-block-jp">{lines[0] || ""}</div>
            {lines[1] !== undefined && (
              <div className="scene-block-cn">{lines[1]}</div>
            )}
          </div>
        );
      }
      case "inner":
        return (
          <div
            key={idx}
            className={`scene-block scene-block-inner${typing ? " typing-cursor" : ""}`}
          >
            {display}
          </div>
        );
      default:
        return (
          <div
            key={idx}
            className={`scene-block scene-block-narration${typing ? " typing-cursor" : ""}`}
          >
            {display}
          </div>
        );
    }
  }

  return (
    <div onClick={handleClick} style={{ cursor: "default" }}>
      {blocks.slice(0, doneCount).map((b, i) => renderBlock(b, i, false))}
      {active &&
        active.type !== "pause" &&
        active.type !== "break" &&
        renderBlock(active, doneCount, true)}
      <div ref={endRef} />
    </div>
  );
}
