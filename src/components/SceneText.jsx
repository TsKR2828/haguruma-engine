import { useState, useEffect, useRef, useCallback } from "react";
import { BOOK } from "../bookLoader";
import { corruptTextFor } from "../engine/corrupt";
import { blockRawText, isDualBlock, addedClass } from "../utils/textBlock";
import TextBlockBody from "./TextBlockBody";
import ActionBlock from "./ActionBlock";
import ForcedSteps from "./ForcedSteps";

const SPEED = { narration: 18, inner: 25, dialogue: 20, system: 0 };

const rawText = blockRawText;

export default function SceneText({
  blocks,
  nerve,
  onComplete,
  onActiveBlockChange,
  onFlag,
  onBlockEffects,
  editMode = false,
  editLocked = false,
  onEditBlock,
  book = BOOK,
}) {
  const corruption = book.corruption;
  const statMax = book.stats.find((s) => s.key === corruption.stat)?.max ?? 10;
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

    if (active.type === "action" || active.type === "forced") {
      // 文中互動（Batch F6）：不打字、不設 timer。暫停在這裡等玩家點擊
      // ActionBlock/ForcedSteps（見 handleAction/handleForcedComplete），
      // 由它們呼叫 advance() 才繼續後續 block——「點擊繼續」不得繞過它。
      return;
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

  // 文中互動（Batch F6）：action 點擊時設 flag／套 effects（走 HagurumaEngine
  // 既有的 onFlag/onBlockEffects——onFlag 是 F1 留下的孤兒通路，這裡接通；
  // onBlockEffects 走跟 sc.effects 一樣的 applyEffects＋ImpactToast），然後
  // advance() 繼續後續 block。forced 完成（最後一步）也是同一顆 advance()。
  const handleAction = useCallback(
    (block) => {
      if (block.flag) onFlag?.(block.flag);
      if (block.effects) onBlockEffects?.(block.effects);
      advance();
    },
    [onFlag, onBlockEffects, advance],
  );

  const handleForcedComplete = useCallback(() => {
    advance();
  }, [advance]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [doneCount, charIdx]);

  function renderBlock(block, idx, isActive) {
    const text = rawText(block);
    const shown = isActive ? text.slice(0, charIdx) : text;
    const corrupt =
      (block.type === "narration" || block.type === "inner") && nerve <= corruption.textCorruptAt;
    const display = corrupt ? corruptTextFor(shown, nerve, corruption.textCorruptAt, statMax) : shown;
    const typing = isActive && charIdx < text.length;
    const dual = isDualBlock(block);
    const cursorCls = !dual && typing ? " typing-cursor" : "";
    const added = addedClass(block);

    // 編輯器潤飾模式（DEV only，見 docs/batch-f5-ux.md §Lane E-3）：
    // narration/inner/dialogue 在 editMode 下可 hover+點擊開編輯面板；
    // 動態場景（editLocked）停用點擊、改顯示 🔒 tooltip。
    // action/forced（Batch F6）比照同一套規則——editMode 下點擊＝編輯
    // prompt/steps 文字，不觸發互動（比照 choice 的處理，見 ChoiceList.jsx）。
    // `import.meta.env.DEV &&` 前綴讓 production build 把整條 editable 折成
    // 常數 false，esbuild 才能把底下的 CSS class／tooltip 字面字串一起消掉。
    const editable =
      import.meta.env.DEV &&
      editMode &&
      (block.type === "dialogue" ||
        block.type === "inner" ||
        block.type === "narration" ||
        block.type === "action" ||
        block.type === "forced");
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
    // editMode 開啟且未鎖定時，editExtraProps 已把點擊改接去開編輯面板
    // （不觸發互動）；此時 action/forced 不渲染即時互動元件，改走跟
    // 「已完成」相同的 TextBlockBody 唯讀預覽（可點擊進編輯）。鎖定
    // （動態場景）時沒有 onClick 覆蓋，維持正常互動，比照其他型別。
    const showLiveInteraction = isActive && !(editable && !editLocked);

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
      case "action":
        return (
          <div key={idx} className={`scene-block scene-block-action${added}${editCls}`} {...editExtraProps}>
            {lockBadge}
            {showLiveInteraction ? (
              <ActionBlock
                prompt={block.prompt}
                response={block.response}
                onAction={() => handleAction(block)}
              />
            ) : (
              <TextBlockBody block={block} display={display} />
            )}
          </div>
        );
      case "forced":
        return (
          <div key={idx} className={`scene-block scene-block-forced${added}${editCls}`} {...editExtraProps}>
            {lockBadge}
            {showLiveInteraction ? (
              <ForcedSteps steps={block.steps} nerve={nerve} onComplete={handleForcedComplete} book={book} />
            ) : (
              <TextBlockBody block={block} display={display} />
            )}
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
