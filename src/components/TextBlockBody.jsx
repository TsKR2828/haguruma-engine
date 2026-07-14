import { isDualBlock } from "../utils/textBlock";

/**
 * Shared body renderer for dialogue / narration / inner TextBlocks.
 *
 * `display` is the already-typed/already-corrupted text to show (a full
 * string for dialogue-shaped blocks is "jp\ncn"). This component only
 * decides *structure* (speaker + jp/cn rows vs. plain text) so that the
 * typing stage (SceneText) and the history area (HagurumaEngine's
 * HistoryBlock) render identically for the same block — see
 * docs/origin-marking-spec.md §2.3 §2.4.
 */
export default function TextBlockBody({ block, display }) {
  // action / forced（Batch F6）：互動 block 的「完成態」渲染——一旦不再是
  // 目前正在互動的 active block（已被推進過，或編輯模式下的預覽），一律
  // 顯示 ✓ 已完成樣式。與 ActionBlock.jsx / ForcedSteps.jsx 內部「done」分支
  // 使用完全相同的 class，見 docs/batch-f6-inline-actions.md §2.3。
  if (block.type === "action") {
    return (
      <div className="action-block action-block--done">
        <div className="action-prompt-done">✓ {block.prompt}</div>
        {block.response && <div className="action-response">{block.response}</div>}
      </div>
    );
  }
  if (block.type === "forced") {
    return (
      <div className="forced-steps">
        {(block.steps ?? []).map((step, i) => (
          <div key={i} className="forced-step forced-step--done">
            ✓ {step}
          </div>
        ))}
      </div>
    );
  }
  if (block.type === "dialogue" || isDualBlock(block)) {
    const lines = display.split("\n");
    const jp = lines[0] || "";
    const cn = lines[1] || "";
    return (
      <>
        {block.type === "dialogue" && block.speaker && (
          <div className="scene-block-speaker">{block.speaker}</div>
        )}
        {jp && <div className="scene-block-jp">{jp}</div>}
        {cn && <div className="scene-block-cn">{cn}</div>}
      </>
    );
  }
  return display;
}
