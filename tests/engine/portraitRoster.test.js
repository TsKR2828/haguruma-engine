import { describe, it, expect } from "vitest";
import { nextActiveId, nextRoster, resetRoster } from "../../src/engine/portraitRoster";

const portraits = {
  t_kun: "portraits/ch1/t_kun.png",
  niece: "portraits/ch1/niece.png",
};

describe("portraitRoster — Lane P 閃爍修復", () => {
  it("主角台詞（speakerId=protagonist，無立繪）不清空 roster，只讓 activeId 變 null", () => {
    const roster = ["t_kun"];
    const protagonistLine = { type: "dialogue", speakerId: "protagonist" };

    expect(nextRoster(roster, protagonistLine, portraits)).toBe(roster);
    expect(nextActiveId(protagonistLine, portraits)).toBeNull();
  });

  it("narration block 只讓前一位變淡影（activeId=null），不清空 roster", () => {
    const roster = ["t_kun", "niece"];
    const narrationBlock = { type: "narration", content: "…" };

    expect(nextRoster(roster, narrationBlock, portraits)).toBe(roster);
    expect(nextActiveId(narrationBlock, portraits)).toBeNull();
  });

  it("換場景時 roster 與 activeId 完全清空", () => {
    expect(resetRoster()).toEqual({ roster: [], activeId: null });
  });

  it("沒有立繪的 speaker 不會進入 roster", () => {
    const roster = ["t_kun"];
    const noPortraitSpeaker = { type: "dialogue", speakerId: "unknown_extra" };

    expect(nextRoster(roster, noPortraitSpeaker, portraits)).toBe(roster);
    expect(nextActiveId(noPortraitSpeaker, portraits)).toBeNull();
  });

  it("有立繪的新 speaker 說話時加入 roster 並成為 activeId（不重複加入）", () => {
    const roster = ["t_kun"];
    const nieceLine = { type: "dialogue", speakerId: "niece" };

    const updated = nextRoster(roster, nieceLine, portraits);
    expect(updated).toEqual(["t_kun", "niece"]);
    expect(nextActiveId(nieceLine, portraits)).toBe("niece");

    // 同一人再說一次不重複加入
    expect(nextRoster(updated, nieceLine, portraits)).toBe(updated);
  });
});
