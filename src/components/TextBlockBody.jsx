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
