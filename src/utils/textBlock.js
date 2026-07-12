// Shared TextBlock v2 helpers (origin marking).
// See docs/origin-marking-spec.md §1 §2.
//
// Pure functions only — used by both SceneText.jsx (typing) and
// HagurumaEngine.jsx's HistoryBlock (history area) so the two stay
// in sync instead of drifting (spec §2.4).

/** origin:"added" blocks get the .block-added treatment. Legacy blocks
 *  (no origin field) are NOT added — they render exactly as before. */
export function isAddedOrigin(block) {
  return block.origin === "added";
}

/** Blocks that render as jp-line-over-cn-line (no single merged string):
 *  dialogue always has this shape; narration/inner only when origin
 *  is explicitly "source" (added/legacy narration/inner stay single-line
 *  `content`). */
export function isDualBlock(block) {
  if (block.type === "dialogue") return true;
  return (
    (block.type === "narration" || block.type === "inner") &&
    block.origin === "source"
  );
}

/** Joins jp/cn without ever dropping an empty jp into the cn slot.
 *  Fixes Bug 3: `[jp, cn].filter(Boolean).join("\n")` would collapse
 *  jp:"" into a single-element array, so cn ended up rendered with the
 *  jp style. Always keep both slots. */
export function joinDual(jp, cn) {
  return `${jp || ""}\n${cn || ""}`;
}

/** Raw (untyped/uncorrupted) text for a block, used both as the full
 *  string to type out char-by-char and as the string shown in history. */
export function blockRawText(block) {
  if (isDualBlock(block)) return joinDual(block.jp, block.cn);
  return block.content || "";
}

/** className suffix (leading space included) for origin:"added" blocks. */
export function addedClass(block) {
  return isAddedOrigin(block) ? " block-added" : "";
}
