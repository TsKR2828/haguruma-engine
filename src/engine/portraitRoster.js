// Lane P（肖像名冊制）純邏輯。見 docs/batch-f5-ux.md。
//
// 名冊行為：立繪從角色首次說話出現，維持到換場景才消失；沒在說話時變淡影；
// 換別人說話時前一位仍在（淡影）。
//
// - roster: 本場景已出現過、且在 chapter.portraits 有圖的 speakerId 陣列（出現順序）。
// - activeId: 目前正在說話者的 speakerId，非立繪 dialogue（narration/inner/主角無立繪等）時為 null。

function hasPortrait(block, portraits) {
  return Boolean(block?.type === "dialogue" && block?.speakerId && portraits?.[block.speakerId]);
}

/** 依目前 active block 算出下一個 activeId。 */
export function nextActiveId(block, portraits) {
  return hasPortrait(block, portraits) ? block.speakerId : null;
}

/** 依目前 active block 算出下一個 roster（不可變更新，若無變化回傳原陣列）。 */
export function nextRoster(roster, block, portraits) {
  if (hasPortrait(block, portraits) && !roster.includes(block.speakerId)) {
    return [...roster, block.speakerId];
  }
  return roster;
}

/** 換場景時重置名冊。 */
export function resetRoster() {
  return { roster: [], activeId: null };
}
