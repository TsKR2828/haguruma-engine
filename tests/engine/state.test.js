import { describe, it, expect } from "vitest";
import { createChapterState, initialState } from "../../src/engine/state.js";

const CH2_STUB = {
  chapter: 2,
  title: "復讐",
  titleCn: "復仇",
  startScene: "ch2_prologue",
  startLocation: "ginza",
};

const CH1_END_STATE = {
  nerve: 5,
  insight: 4,
  writing: 2,
  notebook: [
    { key: "raincoat_station", symbol: "raincoat", desc: "停車場的雨衣男" },
  ],
  choicesMade: { joke_response: true, observed_raincoat_1: true },
  connections: [{ id: "raincoat_double", title: "兩件雨衣", subtitle: "迴路初現", icon: "◇", chapter: 1 }],
};

describe("createChapterState", () => {
  describe("without carryOver", () => {
    it("uses initialState defaults", () => {
      const state = createChapterState(CH2_STUB, null);
      expect(state.nerve).toBe(initialState.nerve);
      expect(state.insight).toBe(0);
      expect(state.notebook).toEqual([]);
      expect(state.choicesMade).toEqual({});
      expect(state.connections).toEqual([]);
    });

    it("sets chapter metadata from chapter data", () => {
      const state = createChapterState(CH2_STUB, null);
      expect(state.currentChapter).toBe(2);
      expect(state.currentSceneId).toBe("ch2_prologue");
    });

    it("initializes journey from startLocation", () => {
      const state = createChapterState(CH2_STUB, null);
      expect(state.journey.current).toBe("ginza");
      expect(state.journey.visited).toEqual(["ginza"]);
      expect(state.journey.symbols).toEqual({});
    });
  });

  describe("with carryOver", () => {
    it("carries over nerve, insight, writing", () => {
      const state = createChapterState(CH2_STUB, CH1_END_STATE);
      expect(state.nerve).toBe(5);
      expect(state.insight).toBe(4);
      expect(state.writing).toBe(2);
    });

    it("carries over notebook, choicesMade, connections", () => {
      const state = createChapterState(CH2_STUB, CH1_END_STATE);
      expect(state.notebook).toHaveLength(1);
      expect(state.notebook[0].key).toBe("raincoat_station");
      expect(state.choicesMade.joke_response).toBe(true);
      expect(state.connections).toHaveLength(1);
      expect(state.connections[0].id).toBe("raincoat_double");
    });

    it("overrides currentChapter and currentSceneId from new chapter", () => {
      const state = createChapterState(CH2_STUB, CH1_END_STATE);
      expect(state.currentChapter).toBe(2);
      expect(state.currentSceneId).toBe("ch2_prologue");
    });

    it("resets journey for new chapter", () => {
      const state = createChapterState(CH2_STUB, {
        ...CH1_END_STATE,
        journey: { current: "hotel", visited: ["hotel", "station"], symbols: { gear_first: true } },
      });
      expect(state.journey.current).toBe("ginza");
      expect(state.journey.visited).toEqual(["ginza"]);
      expect(state.journey.symbols).toEqual({});
    });

    it("carries over unknown future fields (D3 exclusion principle)", () => {
      const carryWithExtra = {
        ...CH1_END_STATE,
        playstyle: { insight: 3, variant: 2, canon: 1 },
        someNewField: "future_value",
      };
      const state = createChapterState(CH2_STUB, carryWithExtra);
      expect(state.playstyle).toEqual({ insight: 3, variant: 2, canon: 1 });
      expect(state.someNewField).toBe("future_value");
    });
  });
});
