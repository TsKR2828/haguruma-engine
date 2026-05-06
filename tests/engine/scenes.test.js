import { describe, it, expect } from "vitest";
import { getSceneById, resolveText, resolveChoices } from "../../src/engine/scenes.js";

const MOCK_CHAPTER = {
  chapter: 1,
  startScene: "prologue",
  scenes: {
    prologue: {
      id: "prologue",
      text: [
        { type: "system", content: "第一章" },
        { type: "narration", content: "冬日。" },
      ],
      choices: null,
      next: "scene_b",
    },
    scene_b: {
      id: "scene_b",
      text: [{ type: "narration", content: "繼續。" }],
      choices: [
        { text: "選項 A", next: "scene_c", flag: "chose_a" },
        { text: "選項 B", next: "scene_d", flag: "chose_b" },
      ],
      next: null,
    },
    scene_dynamic: {
      id: "scene_dynamic",
      text: (state) => {
        if (state.choicesMade.chose_a) {
          return [{ type: "narration", content: "你選了 A。" }];
        }
        return [{ type: "narration", content: "你沒選 A。" }];
      },
      choices: null,
      next: null,
    },
    scene_conditional: {
      id: "scene_conditional",
      text: [{ type: "narration", content: "test" }],
      choices: [
        { text: "always", next: "prologue" },
        {
          text: "conditional",
          next: "prologue",
          condition: (s) => s.insight >= 3,
        },
      ],
      next: null,
    },
  },
};

describe("getSceneById", () => {
  it("returns scene for valid id", () => {
    const scene = getSceneById(MOCK_CHAPTER, "prologue");
    expect(scene).toBe(MOCK_CHAPTER.scenes.prologue);
  });

  it("returns null for missing id", () => {
    expect(getSceneById(MOCK_CHAPTER, "nonexistent")).toBeNull();
  });

  it("returns null when chapter has no scenes", () => {
    expect(getSceneById({}, "prologue")).toBeNull();
  });
});

describe("resolveText", () => {
  it("returns static text array as-is", () => {
    const scene = MOCK_CHAPTER.scenes.prologue;
    const text = resolveText(scene, {});
    expect(text).toBe(scene.text);
    expect(text.length).toBe(2);
  });

  it("calls dynamic text function with state", () => {
    const scene = MOCK_CHAPTER.scenes.scene_dynamic;
    const result = resolveText(scene, { choicesMade: { chose_a: true } });
    expect(result[0].content).toBe("你選了 A。");
  });

  it("dynamic text varies based on state", () => {
    const scene = MOCK_CHAPTER.scenes.scene_dynamic;
    const resultA = resolveText(scene, { choicesMade: { chose_a: true } });
    const resultB = resolveText(scene, { choicesMade: {} });
    expect(resultA[0].content).not.toBe(resultB[0].content);
  });

  it("returns empty array when text is missing", () => {
    expect(resolveText({ text: null }, {})).toEqual([]);
    expect(resolveText({}, {})).toEqual([]);
  });
});

describe("resolveChoices", () => {
  it("returns choices array for scene with choices", () => {
    const scene = MOCK_CHAPTER.scenes.scene_b;
    const result = resolveChoices(scene, {});
    expect(result.length).toBe(2);
    expect(result[0].text).toBe("選項 A");
  });

  it("returns null for scene without choices", () => {
    const scene = MOCK_CHAPTER.scenes.prologue;
    expect(resolveChoices(scene, {})).toBeNull();
  });

  it("filters choices with condition function", () => {
    const scene = MOCK_CHAPTER.scenes.scene_conditional;
    const low = resolveChoices(scene, { insight: 1 });
    expect(low.length).toBe(1);
    expect(low[0].text).toBe("always");

    const high = resolveChoices(scene, { insight: 5 });
    expect(high.length).toBe(2);
  });
});
