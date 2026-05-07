import { describe, it, expect, beforeEach } from "vitest";
import { createChapterState, initialState } from "../../src/engine/state.js";
import { applyEffects } from "../../src/engine/effects.js";
import { getSceneById, resolveText, resolveChoices } from "../../src/engine/scenes.js";
import { resolveConnections, applyConnection } from "../../src/engine/connections.js";
import { buildSaveData, restoreState, importSave } from "../../src/engine/save.js";

const TEST_CHAPTER = {
  chapter: 1,
  title: "テスト",
  titleCn: "測試",
  startScene: "prologue",
  startLocation: "place_a",
  sceneCount: 6,
  locations: [
    { id: "place_a", label: "場所A", sub: "起點", x: 30, y: 50, shape: "circle" },
    { id: "place_b", label: "場所B", sub: "終點", x: 70, y: 50, shape: "diamond" },
  ],
  connections: [
    { id: "conn_ab", title: "A與B之連結", requires: ["symbol_a", "symbol_b"], insightGain: 2 },
  ],
  scenes: {
    prologue: {
      id: "prologue",
      text: [
        { type: "system", content: "第一章 測試" },
        { type: "narration", content: "遊戲開始。" },
      ],
      choices: null,
      next: "scene_choice",
      effects: null,
      flags: [],
      notebook: { key: "symbol_a", symbol: "gear", desc: "開頭自動筆記" },
      links: { visit: "place_a", fold: "── 序幕 ──" },
    },
    scene_choice: {
      id: "scene_choice",
      text: [{ type: "narration", content: "面前有兩條路。" }],
      choices: [
        {
          text: "走左邊",
          next: "scene_left",
          flag: "chose_left",
          effects: { nerve: { amount: -1, reason: "緊張" } },
          notebook: { key: "symbol_b", symbol: "wing", desc: "左邊的筆記" },
          unlock: null,
        },
        {
          text: "走右邊",
          next: "scene_right",
          flag: "chose_right",
          effects: { insight: { amount: 1, reason: "觀察" } },
          notebook: null,
          unlock: null,
        },
        {
          text: "隱藏選項",
          next: "scene_left",
          flag: "chose_hidden",
          effects: null,
          notebook: null,
          unlock: null,
          condition: (s) => s.insight >= 5,
        },
      ],
      next: null,
      effects: null,
      flags: ["chose_left", "chose_right", "chose_hidden"],
      notebook: null,
      links: { fold: "── 分歧 ──" },
    },
    scene_left: {
      id: "scene_left",
      text: [{ type: "narration", content: "你走了左邊。" }],
      choices: null,
      next: "scene_merge",
      effects: { writing: { amount: 1, reason: "左路心得" } },
      flags: [],
      notebook: null,
      links: { visit: "place_b" },
    },
    scene_right: {
      id: "scene_right",
      text: [{ type: "narration", content: "你走了右邊。" }],
      choices: null,
      next: "scene_merge",
      effects: null,
      flags: [],
      notebook: null,
      links: null,
    },
    scene_merge: {
      id: "scene_merge",
      text: (state) => {
        if (state.choicesMade.chose_left) {
          return [{ type: "narration", content: "左邊的路匯合了。" }];
        }
        return [{ type: "narration", content: "右邊的路匯合了。" }];
      },
      choices: null,
      next: "ending",
      effects: null,
      flags: [],
      notebook: null,
      links: null,
    },
    ending: {
      id: "ending",
      text: [{ type: "system", content: "章節結束" }],
      choices: null,
      next: null,
      effects: null,
      flags: [],
      notebook: null,
      links: { showEnd: true },
    },
  },
};

describe("Integration: game flow", () => {
  let state;

  beforeEach(() => {
    state = createChapterState(TEST_CHAPTER, null);
  });

  describe("開始遊戲", () => {
    it("initializes state from chapter metadata", () => {
      expect(state.currentSceneId).toBe("prologue");
      expect(state.currentChapter).toBe(1);
      expect(state.nerve).toBe(initialState.nerve);
      expect(state.insight).toBe(0);
      expect(state.writing).toBe(0);
      expect(state.notebook).toEqual([]);
      expect(state.journey.current).toBe("place_a");
      expect(state.journey.visited).toEqual(["place_a"]);
    });

    it("loads the start scene correctly", () => {
      const scene = getSceneById(TEST_CHAPTER, state.currentSceneId);
      expect(scene).not.toBeNull();
      expect(scene.id).toBe("prologue");
      const blocks = resolveText(scene, state);
      expect(blocks.length).toBe(2);
      expect(blocks[0].type).toBe("system");
    });
  });

  describe("推進 scene", () => {
    it("auto-advances from prologue to scene_choice via next", () => {
      const prologue = getSceneById(TEST_CHAPTER, "prologue");
      expect(prologue.next).toBe("scene_choice");
      const nextScene = getSceneById(TEST_CHAPTER, prologue.next);
      expect(nextScene.id).toBe("scene_choice");
    });

    it("collects scene-level notebook on entry", () => {
      const prologue = getSceneById(TEST_CHAPTER, "prologue");
      if (prologue.notebook && !state.notebook.some((n) => n.key === prologue.notebook.key)) {
        state = { ...state, notebook: [...state.notebook, prologue.notebook] };
      }
      expect(state.notebook.length).toBe(1);
      expect(state.notebook[0].key).toBe("symbol_a");
    });

    it("applies scene-level effects on entry", () => {
      const sceneLeft = getSceneById(TEST_CHAPTER, "scene_left");
      state = applyEffects(state, sceneLeft.effects);
      expect(state.writing).toBe(1);
    });
  });

  describe("選擇分歧", () => {
    it("shows available choices filtered by condition", () => {
      const scene = getSceneById(TEST_CHAPTER, "scene_choice");
      const choices = resolveChoices(scene, state);
      expect(choices.length).toBe(2);
      expect(choices[0].text).toBe("走左邊");
      expect(choices[1].text).toBe("走右邊");
    });

    it("reveals conditional choice when condition is met", () => {
      const scene = getSceneById(TEST_CHAPTER, "scene_choice");
      const highInsight = { ...state, insight: 5 };
      const choices = resolveChoices(scene, highInsight);
      expect(choices.length).toBe(3);
      expect(choices[2].text).toBe("隱藏選項");
    });

    it("choice navigates to correct next scene", () => {
      const scene = getSceneById(TEST_CHAPTER, "scene_choice");
      const choices = resolveChoices(scene, state);
      expect(choices[0].next).toBe("scene_left");
      expect(choices[1].next).toBe("scene_right");
    });
  });

  describe("flags 正確變化", () => {
    it("sets flag from choice", () => {
      const choice = { flag: "chose_left", effects: null, notebook: null };
      if (choice.flag) {
        state = { ...state, choicesMade: { ...state.choicesMade, [choice.flag]: true } };
      }
      expect(state.choicesMade.chose_left).toBe(true);
      expect(state.choicesMade.chose_right).toBeUndefined();
    });

    it("dynamic text responds to flags", () => {
      state = { ...state, choicesMade: { chose_left: true } };
      const scene = getSceneById(TEST_CHAPTER, "scene_merge");
      const blocks = resolveText(scene, state);
      expect(blocks[0].content).toBe("左邊的路匯合了。");
    });

    it("dynamic text varies with different flags", () => {
      state = { ...state, choicesMade: { chose_right: true } };
      const scene = getSceneById(TEST_CHAPTER, "scene_merge");
      const blocks = resolveText(scene, state);
      expect(blocks[0].content).toBe("右邊的路匯合了。");
    });
  });

  describe("fold 展開 / 收合", () => {
    it("scenes carry fold metadata for history grouping", () => {
      const prologue = getSceneById(TEST_CHAPTER, "prologue");
      const choiceScene = getSceneById(TEST_CHAPTER, "scene_choice");
      expect(prologue.links.fold).toBe("── 序幕 ──");
      expect(choiceScene.links.fold).toBe("── 分歧 ──");
    });

    it("history entries can be grouped by fold markers", () => {
      const history = [
        { sceneId: "prologue", blocks: [{ type: "narration", content: "a" }], fold: "── 序幕 ──" },
        { sceneId: "scene_choice", blocks: [{ type: "narration", content: "b" }], fold: "── 分歧 ──" },
        { sceneId: "scene_left", blocks: [{ type: "narration", content: "c" }], fold: null },
      ];

      const sections = [];
      let cur = { fold: null, entries: [] };
      for (const entry of history) {
        if (entry.fold) {
          if (cur.entries.length > 0) sections.push(cur);
          cur = { fold: entry.fold, entries: [entry] };
        } else {
          cur.entries.push(entry);
        }
      }
      if (cur.entries.length > 0) sections.push(cur);

      expect(sections.length).toBe(2);
      expect(sections[0].fold).toBe("── 序幕 ──");
      expect(sections[0].entries.length).toBe(1);
      expect(sections[1].fold).toBe("── 分歧 ──");
      expect(sections[1].entries.length).toBe(2);
    });

    it("collapsed state toggles sections independently", () => {
      let collapsed = {};
      const isCollapsed = (si) => collapsed[si] ?? true;
      const toggle = (si) => ({ ...collapsed, [si]: !isCollapsed(si) });

      collapsed = toggle(0);
      expect(collapsed[0]).toBe(false);
      expect(isCollapsed(1)).toBe(true);

      collapsed = { ...collapsed, ...toggle(1) };
      expect(collapsed[0]).toBe(false);
      expect(collapsed[1]).toBe(false);
    });
  });

  describe("手帖新增", () => {
    it("scene-level notebook added on entry", () => {
      const prologue = getSceneById(TEST_CHAPTER, "prologue");
      state = { ...state, notebook: [...state.notebook, prologue.notebook] };
      expect(state.notebook.length).toBe(1);
      expect(state.notebook[0]).toEqual({ key: "symbol_a", symbol: "gear", desc: "開頭自動筆記" });
    });

    it("choice-level notebook added on selection", () => {
      const scene = getSceneById(TEST_CHAPTER, "scene_choice");
      const choice = scene.choices[0];
      state = { ...state, notebook: [...state.notebook, choice.notebook] };
      expect(state.notebook.length).toBe(1);
      expect(state.notebook[0].key).toBe("symbol_b");
    });

    it("duplicate notebook entries are prevented", () => {
      const entry = { key: "symbol_a", symbol: "gear", desc: "test" };
      state = { ...state, notebook: [entry] };
      if (!state.notebook.some((n) => n.key === entry.key)) {
        state = { ...state, notebook: [...state.notebook, entry] };
      }
      expect(state.notebook.length).toBe(1);
    });

    it("connections form when notebook requirements are met", () => {
      state = {
        ...state,
        notebook: [
          { key: "symbol_a", symbol: "gear", desc: "a" },
          { key: "symbol_b", symbol: "wing", desc: "b" },
        ],
        connections: [],
      };
      const formed = resolveConnections(state, TEST_CHAPTER.connections);
      expect(formed.length).toBe(1);
      expect(formed[0].id).toBe("conn_ab");

      state = applyConnection(state, formed[0]);
      expect(state.connections).toContain("conn_ab");
      expect(state.insight).toBe(2);
    });
  });

  describe("章結算正確", () => {
    it("ending scene has showEnd link", () => {
      const ending = getSceneById(TEST_CHAPTER, "ending");
      expect(ending.links.showEnd).toBe(true);
      expect(ending.next).toBeNull();
      expect(ending.choices).toBeNull();
    });

    it("full playthrough reaches ending with correct state", () => {
      const prologue = getSceneById(TEST_CHAPTER, "prologue");
      state = { ...state, notebook: [...state.notebook, prologue.notebook] };
      state = { ...state, currentSceneId: "scene_choice" };

      const choice = TEST_CHAPTER.scenes.scene_choice.choices[0];
      state = { ...state, choicesMade: { [choice.flag]: true } };
      state = applyEffects(state, choice.effects);
      state = { ...state, notebook: [...state.notebook, choice.notebook] };
      state = { ...state, currentSceneId: choice.next };

      const sceneLeft = getSceneById(TEST_CHAPTER, state.currentSceneId);
      state = applyEffects(state, sceneLeft.effects);
      state = { ...state, currentSceneId: sceneLeft.next };

      state = { ...state, currentSceneId: "ending" };

      const formed = resolveConnections(state, TEST_CHAPTER.connections);
      for (const conn of formed) state = applyConnection(state, conn);

      expect(state.currentSceneId).toBe("ending");
      expect(state.nerve).toBe(9);
      expect(state.writing).toBe(1);
      expect(state.insight).toBe(2);
      expect(state.notebook.length).toBe(2);
      expect(state.choicesMade.chose_left).toBe(true);
      expect(state.connections).toContain("conn_ab");
    });

    it("carryOver excludes transient state for next chapter", () => {
      state = { ...state, currentSceneId: "ending", nerve: 7, insight: 5, notebook: [{ key: "x" }] };
      const { currentSceneId, currentChapter, journey, ...persistent } = state;
      expect(persistent.nerve).toBe(7);
      expect(persistent.insight).toBe(5);
      expect(persistent.notebook).toEqual([{ key: "x" }]);
      expect(persistent.currentSceneId).toBeUndefined();
      expect(persistent.journey).toBeUndefined();
    });
  });

  describe("存檔讀檔正確", () => {
    it("buildSaveData serializes all required fields", () => {
      state = { ...state, currentSceneId: "scene_choice", nerve: 8, insight: 3 };
      const save = buildSaveData(state, "scene_left");
      expect(save.v).toBe(2);
      expect(save.scene).toBe("scene_choice");
      expect(save.nextScene).toBe("scene_left");
      expect(save.nerve).toBe(8);
      expect(save.insight).toBe(3);
      expect(save.currentChapter).toBe(1);
      expect(save.savedAt).toBeGreaterThan(0);
    });

    it("restoreState reconstructs state from save data", () => {
      const save = buildSaveData(state, "scene_merge");
      const restored = restoreState(save);
      expect(restored.currentSceneId).toBe("scene_merge");
      expect(restored.nerve).toBe(state.nerve);
      expect(restored.notebook).toEqual(state.notebook);
      expect(restored.choicesMade).toEqual(state.choicesMade);
      expect(restored.journey).toEqual(state.journey);
    });

    it("restoreState handles missing optional fields gracefully", () => {
      const minimal = { scene: "prologue", nerve: 10, insight: 0, writing: 0 };
      const restored = restoreState(minimal);
      expect(restored.currentSceneId).toBe("prologue");
      expect(restored.notebook).toEqual([]);
      expect(restored.choicesMade).toEqual({});
      expect(restored.connections).toEqual([]);
      expect(restored.journey).toEqual({ current: null, visited: [], symbols: {} });
    });

    it("importSave parses JSON string and restores state", () => {
      state = { ...state, currentSceneId: "scene_left", nerve: 6, insight: 4 };
      const json = JSON.stringify(buildSaveData(state, "scene_merge"));
      const restored = importSave(json);
      expect(restored.currentSceneId).toBe("scene_merge");
      expect(restored.nerve).toBe(6);
      expect(restored.insight).toBe(4);
    });

    it("importSave returns null for invalid data", () => {
      expect(importSave("not json")).toBeNull();
      expect(importSave("{}")).toBeNull();
      expect(importSave(null)).toBeNull();
    });

    it("save version is v2 with nextScene cursor", () => {
      const save = buildSaveData(state);
      expect(save.v).toBe(2);
      expect(save).toHaveProperty("nextScene");
    });
  });
});
