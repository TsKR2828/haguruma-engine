import { useState, useEffect, useRef, useCallback } from "react";
import { corruptText } from "../engine/corrupt";
import { blockRawText, isDualBlock, addedClass } from "../utils/textBlock";
import TextBlockBody from "./TextBlockBody";

const SPEED = { narration: 18, inner: 25, dialogue: 20, system: 0 };

const rawText = blockRawText;

export default function SceneText({
  blocks,
  nerve,
  onComplete,
  onActiveBlockChange,
  editMode = false,
  editLocked = false,
  onEditBlock,
}) {
  const [doneCount, setDoneCount] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [pausing, setPausing] = useState(false);
  const completeFired = useRef(false);
  const endRef = useRef(null);

  const active = doneCount < blocks.length ? blocks[doneCount] : null;

  useEffect(() => {
    if (active?.type === "break") return;
    onActiveBlockChange?.(active);
  }, [doneCount, blocks]);

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
      if (active.type === "dialogue") return;
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
    if (charIdx < text.length) {
      setCharIdx(text.length);
    } else if (active.type === "dialogue") {
      advance();
    }
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
    const dual = isDualBlock(block);
    const cursorCls = !dual && typing ? " typing-cursor" : "";
    const added = addedClass(block);

    // 編輯器潤飾模式（DEV only，見 docs/batch-f5-ux.md §Lane E-3）：
    // narration/inner/dialogue 在 editMode 下可 hover+點擊開編輯面板；
    // 動態場景（editLocked）停用點擊、改顯示 🔒 tooltip。
    // `import.meta.env.DEV &&` 前綴讓 production build 把整條 editable 折成
    // 常數 false，esbuild 才能把底下的 CSS class／tooltip 字面字串一起消掉。
    const editable =
      import.meta.env.DEV && editMode && (block.type === "dialogue" || block.type === "inner" || block.type === "narration");
    const editCls = editable ? (editLocked ? " edit-locked" : " edit-hoverable") : "";
    const editExtraProps = editable
      ? editLocked
        ? { title: "動態場景請直接改檔" }
        : {
            onClick: (e) => {
              e.stopPropagation();
              onEditBlock?.(block, idx);
            },
          }
      : {};
    const lockBadge = editable && editLocked ? (
      <span className="edit-lock-badge" aria-hidden="true">🔒</span>
    ) : null;

    switch (block.type) {
      case "break":
        return <div key={idx} className="scene-block-break" />;
      case "system":
        return (
          <div key={idx} className="scene-block scene-block-system">
            {display}
          </div>
        );
      case "dialogue":
        return (
          <div key={idx} className={`scene-block scene-block-dialogue${added}${editCls}`} {...editExtraProps}>
            {lockBadge}
            <TextBlockBody block={block} display={display} />
          </div>
        );
      case "inner":
        return (
          <div key={idx} className={`scene-block scene-block-inner${cursorCls}${added}${editCls}`} {...editExtraProps}>
            {lockBadge}
            <TextBlockBody block={block} display={display} />
          </div>
        );
      default:
        return (
          <div key={idx} className={`scene-block scene-block-narration${cursorCls}${added}${editCls}`} {...editExtraProps}>
            {lockBadge}
            <TextBlockBody block={block} display={display} />
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
