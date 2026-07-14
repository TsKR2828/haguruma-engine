import { describe, it, expect } from "vitest";
import { validateChapter } from "../../scripts/validate-chapters.js";
import { resolveConnections } from "../../src/engine/connections.js";

function makeChapter(overrides = {}) {
  return {
    chapter: 1,
    title: "T",
    titleCn: "t",
    startScene: "s1",
    startLocation: overrides.startLocation ?? "loc_a",
    sceneCount: undefined,
    locations: overrides.locations ?? [
      { id: "loc_a", label: "A", sub: "", x: 0, y: 0, shape: "circle", symbolKey: "raincoat_station" },
    ],
    connections: overrides.connections ?? [],
    scenes: overrides.scenes ?? {
      s1: {
        id: "s1",
        text: [{ type: "narration", content: "x" }],
        choices: null,
        next: null,
        effects: null,
        flags: [],
        notebook: null,
        links: { showEnd: true },
      },
    },
  };
}

describe("cross-reference validation", () => {
  it("startLocation must exist in locations[]", () => {
    const ch = makeChapter({ startLocation: "nonexistent" });
    const report = validateChapter(ch, "test.js");
    expect(report.errors.some((e) => e.includes("startLocation") && e.includes("nonexistent"))).toBe(true);
  });

  it("links.visit must reference valid location", () => {
    const ch = makeChapter({
      scenes: {
        s1: {
          id: "s1", text: [{ type: "narration", content: "x" }],
          choices: null, next: null, effects: null, flags: [],
          notebook: null, links: { visit: "fake_place", showEnd: true },
        },
      },
    });
    const report = validateChapter(ch, "test.js");
    expect(report.errors.some((e) => e.includes("links.visit") && e.includes("fake_place"))).toBe(true);
  });

  it("links.unlock warns on unknown symbol key", () => {
    const ch = makeChapter({
      scenes: {
        s1: {
          id: "s1", text: [{ type: "narration", content: "x" }],
          choices: null, next: null, effects: null, flags: [],
          notebook: null, links: { unlock: "unknown_symbol_xyz", showEnd: true },
        },
      },
    });
    const report = validateChapter(ch, "test.js");
    expect(report.warnings.some((w) => w.includes("links.unlock") && w.includes("unknown_symbol_xyz"))).toBe(true);
  });

  it("choice.unlock warns on unknown symbol key", () => {
    const ch = makeChapter({
      scenes: {
        s1: {
          id: "s1", text: [{ type: "narration", content: "x" }],
          choices: [{ text: "A", next: "s1", flag: "f", effects: null, notebook: null, unlock: "bad_sym" }],
          next: null, effects: null, flags: ["f"],
          notebook: null, links: { showEnd: true },
        },
      },
    });
    const report = validateChapter(ch, "test.js");
    expect(report.warnings.some((w) => w.includes("choice.unlock") && w.includes("bad_sym"))).toBe(true);
  });

  it("connection.requires warns on unknown key", () => {
    const ch = makeChapter({
      connections: [{ id: "c1", requires: ["nonexistent_key"], title: "T", insightGain: 1 }],
    });
    const report = validateChapter(ch, "test.js");
    expect(report.warnings.some((w) => w.includes("requires") && w.includes("nonexistent_key"))).toBe(true);
  });

  it("duplicate connection.id produces error", () => {
    const ch = makeChapter({
      connections: [
        { id: "dup_conn", requires: [], title: "A", insightGain: 1 },
        { id: "dup_conn", requires: [], title: "B", insightGain: 1 },
      ],
    });
    const report = validateChapter(ch, "test.js");
    expect(report.errors.some((e) => e.includes("Duplicate connection") && e.includes("dup_conn"))).toBe(true);
  });

  it("flags completeness warns on undeclared flag", () => {
    const ch = makeChapter({
      scenes: {
        s1: {
          id: "s1", text: [{ type: "narration", content: "x" }],
          choices: [
            { text: "A", next: "s1", flag: "flag_a", effects: null, notebook: null, unlock: null },
            { text: "B", next: "s1", flag: "flag_b", effects: null, notebook: null, unlock: null },
          ],
          next: null, effects: null,
          flags: ["flag_a"],
          notebook: null, links: { showEnd: true },
        },
      },
    });
    const report = validateChapter(ch, "test.js");
    expect(report.warnings.some((w) => w.includes("flag_b") && w.includes("not listed"))).toBe(true);
  });

  it("flags completeness warns on extra declared flag", () => {
    const ch = makeChapter({
      scenes: {
        s1: {
          id: "s1", text: [{ type: "narration", content: "x" }],
          choices: [{ text: "A", next: "s1", flag: "flag_a", effects: null, notebook: null, unlock: null }],
          next: null, effects: null,
          flags: ["flag_a", "phantom_flag"],
          notebook: null, links: { showEnd: true },
        },
      },
    });
    const report = validateChapter(ch, "test.js");
    expect(report.warnings.some((w) => w.includes("phantom_flag") && w.includes("no choice defines"))).toBe(true);
  });

  it("location shape warns on unknown value", () => {
    const ch = makeChapter({
      locations: [{ id: "loc_a", label: "A", sub: "", x: 0, y: 0, shape: "hexagon" }],
    });
    const report = validateChapter(ch, "test.js");
    expect(report.warnings.some((w) => w.includes("shape") && w.includes("hexagon"))).toBe(true);
  });

  it("location symbolKey warns on unknown symbol", () => {
    const ch = makeChapter({
      locations: [{ id: "loc_a", label: "A", sub: "", x: 0, y: 0, shape: "circle", symbolKey: "totally_fake" }],
    });
    const report = validateChapter(ch, "test.js");
    expect(report.warnings.some((w) => w.includes("symbolKey") && w.includes("totally_fake"))).toBe(true);
  });

  it("CH1 real data passes with zero errors", async () => {
    const { CHAPTER_01 } = await import("../../src/data/chapters/chapter01.js");
    const report = validateChapter(CHAPTER_01, "chapter01.js");
    expect(report.errors).toHaveLength(0);
  });

  it("CH2 real data passes with zero errors when validated with CH1 priorNotebookKeys", async () => {
    const { CHAPTER_01 } = await import("../../src/data/chapters/chapter01.js");
    const { CHAPTER_02 } = await import("../../src/data/chapters/chapter02.js");
    const prior = new Set();
    for (const scene of Object.values(CHAPTER_01.scenes)) {
      if (scene.notebook?.key) prior.add(scene.notebook.key);
      for (const c of scene.choices ?? []) {
        if (c.notebook?.key) prior.add(c.notebook.key);
      }
    }
    expect(prior.has("raincoat_death")).toBe(true);
    const report = validateChapter(CHAPTER_02, "chapter02.js", prior);
    expect(report.errors).toHaveLength(0);
  });

  it("cross-chapter connection ch02.raincoat_returns can actually be triggered by real engine logic", async () => {
    const { CHAPTER_02 } = await import("../../src/data/chapters/chapter02.js");
    const conn = CHAPTER_02.connections.find((c) => c.id === "ch02.raincoat_returns");
    expect(conn).toBeDefined();

    // Simulate a player who carried the CH1 grandfathered key "raincoat_death"
    // into CH2's notebook (as save/continue does), then reached CH2's
    // ch2_hospital_return scene which grants "ch02.raincoat_hotel".
    const state = {
      nerve: 5,
      insight: 0,
      currentChapter: 2,
      notebook: [
        { key: "raincoat_death", symbol: "raincoat", desc: "姊夫轢死——穿著與季節不符的雨衣" },
        { key: "ch02.raincoat_hotel", symbol: "raincoat", desc: "旅館玄關——穿雨衣的男人在與綠制服的車伕爭吵。你調頭離開" },
      ],
      choicesMade: {},
      connections: [],
    };

    const formed = resolveConnections(state, CHAPTER_02.connections);
    expect(formed.map((c) => c.id)).toContain("ch02.raincoat_returns");

    // Without the CH1 key carried over, it must not fire.
    const withoutCarryOver = { ...state, notebook: state.notebook.slice(1) };
    const formedWithout = resolveConnections(withoutCarryOver, CHAPTER_02.connections);
    expect(formedWithout.map((c) => c.id)).not.toContain("ch02.raincoat_returns");
  });

  it("CH3 real data passes with zero errors when validated with CH1+CH2 priorNotebookKeys", async () => {
    const { CHAPTER_01 } = await import("../../src/data/chapters/chapter01.js");
    const { CHAPTER_02 } = await import("../../src/data/chapters/chapter02.js");
    const { CHAPTER_03 } = await import("../../src/data/chapters/chapter03.js");
    const prior = new Set();
    for (const chapter of [CHAPTER_01, CHAPTER_02]) {
      for (const scene of Object.values(chapter.scenes)) {
        if (scene.notebook?.key) prior.add(scene.notebook.key);
        for (const c of scene.choices ?? []) {
          if (c.notebook?.key) prior.add(c.notebook.key);
        }
      }
    }
    expect(prior.has("gear_first")).toBe(true);
    expect(prior.has("wing_corridor")).toBe(true);
    const report = validateChapter(CHAPTER_03, "chapter03.js", prior);
    expect(report.errors).toHaveLength(0);
  });

  it("cross-chapter connection ch03.gear_multiply can actually be triggered by real engine logic (CH1 grandfathered key)", async () => {
    const { CHAPTER_03 } = await import("../../src/data/chapters/chapter03.js");
    const conn = CHAPTER_03.connections.find((c) => c.id === "ch03.gear_multiply");
    expect(conn).toBeDefined();

    // Simulate a player who carried the CH1 grandfathered key "gear_first"
    // into CH3's notebook (as save/continue does), then saw the gear-faces
    // illustration at the ch3_gear_faces choice branch, granting "ch03.gear_faces".
    const state = {
      nerve: 5,
      insight: 0,
      currentChapter: 3,
      notebook: [
        { key: "gear_first", symbol: "gear", desc: "往旅館途中——半透明的齒輪初次出現" },
        { key: "ch03.gear_faces", symbol: "gear", desc: "精神病者畫集的插畫——排滿了與我們人類無異、有眼有鼻的齒輪" },
      ],
      choicesMade: {},
      connections: [],
    };

    const formed = resolveConnections(state, CHAPTER_03.connections);
    expect(formed.map((c) => c.id)).toContain("ch03.gear_multiply");

    // Without the CH1 key carried over, it must not fire.
    const withoutCarryOver = { ...state, notebook: state.notebook.slice(1) };
    const formedWithout = resolveConnections(withoutCarryOver, CHAPTER_03.connections);
    expect(formedWithout.map((c) => c.id)).not.toContain("ch03.gear_multiply");
  });

  it("cross-chapter connection ch03.wing_again can actually be triggered by real engine logic (CH1 grandfathered key)", async () => {
    const { CHAPTER_03 } = await import("../../src/data/chapters/chapter03.js");
    const conn = CHAPTER_03.connections.find((c) => c.id === "ch03.wing_again");
    expect(conn).toBeDefined();

    // Simulate a player who carried the CH1 grandfathered key "wing_corridor"
    // into CH3's notebook, then reached ch3_wake which grants "ch03.wing_rat".
    const state = {
      nerve: 5,
      insight: 0,
      currentChapter: 3,
      notebook: [
        { key: "wing_corridor", symbol: "wing", desc: "旅館深夜——門外傳來翅膀的聲音" },
        { key: "ch03.wing_rat", symbol: "wing", desc: "深夜三點的房間——翅膀的聲音，還有老鼠的吱鳴" },
      ],
      choicesMade: {},
      connections: [],
    };

    const formed = resolveConnections(state, CHAPTER_03.connections);
    expect(formed.map((c) => c.id)).toContain("ch03.wing_again");

    // Without the CH1 key carried over, it must not fire.
    const withoutCarryOver = { ...state, notebook: state.notebook.slice(1) };
    const formedWithout = resolveConnections(withoutCarryOver, CHAPTER_03.connections);
    expect(formedWithout.map((c) => c.id)).not.toContain("ch03.wing_again");
  });

  it("connection.requires satisfied by priorNotebookKeys emits carryOver info instead of missing warning", () => {
    const ch = makeChapter({
      chapter: 2,
      connections: [{ id: "ch02.cross_conn", requires: ["prior_key"], title: "T", insightGain: 1 }],
    });
    const prior = new Set(["prior_key"]);
    const report = validateChapter(ch, "test.js", prior);
    expect(report.warnings.some((w) => w.includes("carryOver") && w.includes("prior_key"))).toBe(true);
    expect(report.warnings.some((w) => w.includes("not found"))).toBe(false);
  });

  it("connection.requires truly missing key still warns even with priorNotebookKeys", () => {
    const ch = makeChapter({
      chapter: 2,
      connections: [{ id: "ch02.bad_conn", requires: ["nowhere_key"], title: "T", insightGain: 1 }],
    });
    const prior = new Set(["other_key"]);
    const report = validateChapter(ch, "test.js", prior);
    expect(report.warnings.some((w) => w.includes("not found") && w.includes("nowhere_key"))).toBe(true);
  });

  it("CH5 real data passes with zero errors when validated with CH1+CH2+CH3+CH4 priorNotebookKeys", async () => {
    const { CHAPTER_01 } = await import("../../src/data/chapters/chapter01.js");
    const { CHAPTER_02 } = await import("../../src/data/chapters/chapter02.js");
    const { CHAPTER_03 } = await import("../../src/data/chapters/chapter03.js");
    const { CHAPTER_04 } = await import("../../src/data/chapters/chapter04.js");
    const { CHAPTER_05 } = await import("../../src/data/chapters/chapter05.js");
    const prior = new Set();
    for (const chapter of [CHAPTER_01, CHAPTER_02, CHAPTER_03, CHAPTER_04]) {
      for (const scene of Object.values(chapter.scenes)) {
        if (scene.notebook?.key) prior.add(scene.notebook.key);
        for (const c of scene.choices ?? []) {
          if (c.notebook?.key) prior.add(c.notebook.key);
        }
      }
    }
    expect(prior.has("book_worm")).toBe(true);
    expect(prior.has("ch04.la_mort")).toBe(true);
    const report = validateChapter(CHAPTER_05, "chapter05.js", prior);
    expect(report.errors).toHaveLength(0);
  });

  it("cross-chapter connection ch05.mole_self can actually be triggered by real engine logic (CH4 key)", async () => {
    const { CHAPTER_05 } = await import("../../src/data/chapters/chapter05.js");
    const conn = CHAPTER_05.connections.find((c) => c.id === "ch05.mole_self");
    expect(conn).toBeDefined();

    // Simulate a player who carried CH4's "ch04.la_mort" into CH5's notebook
    // (as save/continue does), then reached ch5_prologue which grants
    // "ch05.mole_curtain".
    const state = {
      nerve: 5,
      insight: 0,
      currentChapter: 5,
      notebook: [
        { key: "ch04.la_mort", symbol: "raincoat", desc: "Mole——鼴鼠——la mort。死，像逼近姊夫那樣逼近我。而我竟在微笑" },
        { key: "ch05.mole_curtain", symbol: "gear", desc: "拉下窗簾、白天也點著燈——我像鼴鼠一樣活著" },
      ],
      choicesMade: {},
      connections: [],
    };

    const formed = resolveConnections(state, CHAPTER_05.connections);
    expect(formed.map((c) => c.id)).toContain("ch05.mole_self");

    // Without the CH4 key carried over, it must not fire.
    const withoutCarryOver = { ...state, notebook: state.notebook.slice(1) };
    const formedWithout = resolveConnections(withoutCarryOver, CHAPTER_05.connections);
    expect(formedWithout.map((c) => c.id)).not.toContain("ch05.mole_self");
  });

  it("cross-chapter connection ch05.kirin_child can actually be triggered by real engine logic (CH1 grandfathered key)", async () => {
    const { CHAPTER_05 } = await import("../../src/data/chapters/chapter05.js");
    const conn = CHAPTER_05.connections.find((c) => c.id === "ch05.kirin_child");
    expect(conn).toBeDefined();

    // Simulate a player who carried the CH1 grandfathered key "book_worm"
    // into CH5's notebook, then chose to look closely at the apple in
    // ch5_unicorn, granting "ch05.unicorn".
    const state = {
      nerve: 5,
      insight: 0,
      currentChapter: 5,
      notebook: [
        { key: "book_worm", symbol: "book", desc: "Worm——蛆蟲——龍的古義" },
        { key: "ch05.unicorn", symbol: "book", desc: "蘋果泛黃的皮上現出一角獸——麒麟。批評家叫過我『九百十年代的麒麟兒』" },
      ],
      choicesMade: {},
      connections: [],
    };

    const formed = resolveConnections(state, CHAPTER_05.connections);
    expect(formed.map((c) => c.id)).toContain("ch05.kirin_child");

    // Without the CH1 key carried over, it must not fire.
    const withoutCarryOver = { ...state, notebook: state.notebook.slice(1) };
    const formedWithout = resolveConnections(withoutCarryOver, CHAPTER_05.connections);
    expect(formedWithout.map((c) => c.id)).not.toContain("ch05.kirin_child");
  });

  it("CH6 real data passes with zero errors when validated with CH1+CH2+CH3+CH4+CH5 priorNotebookKeys", async () => {
    const { CHAPTER_01 } = await import("../../src/data/chapters/chapter01.js");
    const { CHAPTER_02 } = await import("../../src/data/chapters/chapter02.js");
    const { CHAPTER_03 } = await import("../../src/data/chapters/chapter03.js");
    const { CHAPTER_04 } = await import("../../src/data/chapters/chapter04.js");
    const { CHAPTER_05 } = await import("../../src/data/chapters/chapter05.js");
    const { CHAPTER_06 } = await import("../../src/data/chapters/chapter06.js");
    const prior = new Set();
    for (const chapter of [CHAPTER_01, CHAPTER_02, CHAPTER_03, CHAPTER_04, CHAPTER_05]) {
      for (const scene of Object.values(chapter.scenes)) {
        if (scene.notebook?.key) prior.add(scene.notebook.key);
        for (const c of scene.choices ?? []) {
          if (c.notebook?.key) prior.add(c.notebook.key);
        }
      }
    }
    expect(prior.has("raincoat_death")).toBe(true);
    expect(prior.has("ch04.la_mort")).toBe(true);
    expect(prior.has("ch05.bw_whiskey")).toBe(true);
    expect(prior.has("ch05.airship")).toBe(true);
    expect(prior.has("ch05.karamazov")).toBe(true);
    expect(prior.has("ch05.mole_curtain")).toBe(true);
    const report = validateChapter(CHAPTER_06, "chapter06.js", prior);
    expect(report.errors).toHaveLength(0);
  });

  it("cross-chapter connection ch06.raincoat_final can actually be triggered by real engine logic (CH1 grandfathered key)", async () => {
    const { CHAPTER_06 } = await import("../../src/data/chapters/chapter06.js");
    const conn = CHAPTER_06.connections.find((c) => c.id === "ch06.raincoat_final");
    expect(conn).toBeDefined();

    // Simulate a player who carried CH1's grandfathered "raincoat_death" key
    // into CH6's notebook, then reached ch6_prologue which grants
    // "ch06.driver_raincoat".
    const state = {
      nerve: 5,
      insight: 0,
      currentChapter: 6,
      notebook: [
        { key: "raincoat_death", symbol: "raincoat", desc: "姊夫死時穿著一件與季節不符的雨衣" },
        { key: "ch06.driver_raincoat", symbol: "raincoat", desc: "大冷天，司機偏偏披著一件舊雨衣——這個暗合讓我不敢看他" },
      ],
      choicesMade: {},
      connections: [],
    };

    const formed = resolveConnections(state, CHAPTER_06.connections);
    expect(formed.map((c) => c.id)).toContain("ch06.raincoat_final");

    const withoutCarryOver = { ...state, notebook: state.notebook.slice(1) };
    const formedWithout = resolveConnections(withoutCarryOver, CHAPTER_06.connections);
    expect(formedWithout.map((c) => c.id)).not.toContain("ch06.raincoat_final");
  });

  it("cross-chapter connection ch06.bw_dog can actually be triggered by real engine logic (CH5 key)", async () => {
    const { CHAPTER_06 } = await import("../../src/data/chapters/chapter06.js");
    const conn = CHAPTER_06.connections.find((c) => c.id === "ch06.bw_dog");
    expect(conn).toBeDefined();

    const state = {
      nerve: 5,
      insight: 0,
      currentChapter: 6,
      notebook: [
        { key: "ch05.bw_whiskey", symbol: "book", desc: "地下室的酒吧只有一種威士忌——Black and White" },
        { key: "ch06.half_black_dog", symbol: "gear", desc: "半邊全黑的狗，四度從我身邊經過——Black and White。史特林堡的領帶也是黑白" },
      ],
      choicesMade: {},
      connections: [],
    };

    const formed = resolveConnections(state, CHAPTER_06.connections);
    expect(formed.map((c) => c.id)).toContain("ch06.bw_dog");

    const withoutCarryOver = { ...state, notebook: state.notebook.slice(1) };
    const formedWithout = resolveConnections(withoutCarryOver, CHAPTER_06.connections);
    expect(formedWithout.map((c) => c.id)).not.toContain("ch06.bw_dog");
  });

  it("cross-chapter connection ch06.wings_everywhere can actually be triggered by real engine logic (CH5 key)", async () => {
    const { CHAPTER_06 } = await import("../../src/data/chapters/chapter06.js");
    const conn = CHAPTER_06.connections.find((c) => c.id === "ch06.wings_everywhere");
    expect(conn).toBeDefined();

    const state = {
      nerve: 5,
      insight: 0,
      currentChapter: 6,
      notebook: [
        { key: "ch05.airship", symbol: "wing", desc: "手上的菸不知何時成了 Airship——人工的翼又一次浮現眼前。Star 偏偏缺貨" },
        { key: "ch06.silver_wing", symbol: "wing", desc: "閉上眼，銀色的翼像鱗片般疊在視網膜上——之前那輛車的水箱蓋上，也有翼" },
      ],
      choicesMade: {},
      connections: [],
    };

    const formed = resolveConnections(state, CHAPTER_06.connections);
    expect(formed.map((c) => c.id)).toContain("ch06.wings_everywhere");

    const withoutCarryOver = { ...state, notebook: state.notebook.slice(1) };
    const formedWithout = resolveConnections(withoutCarryOver, CHAPTER_06.connections);
    expect(formedWithout.map((c) => c.id)).not.toContain("ch06.wings_everywhere");
  });

  it("cross-chapter connection ch06.strindberg_twice can actually be triggered by real engine logic (CH5 key)", async () => {
    const { CHAPTER_06 } = await import("../../src/data/chapters/chapter06.js");
    const conn = CHAPTER_06.connections.find((c) => c.id === "ch06.strindberg_twice");
    expect(conn).toBeDefined();

    const state = {
      nerve: 5,
      insight: 0,
      currentChapter: 6,
      notebook: [
        { key: "ch05.karamazov", symbol: "gear", desc: "《罪與罰》裡訂進了《卡拉馬助夫兄弟》的一節——而我偏偏翻開了那一頁" },
        { key: "ch06.strindberg_pass", symbol: "gear", desc: "住在此地的被害妄想狂瑞典人——他的名字偏偏叫史特林堡。擦身時全身像被打到" },
      ],
      choicesMade: {},
      connections: [],
    };

    const formed = resolveConnections(state, CHAPTER_06.connections);
    expect(formed.map((c) => c.id)).toContain("ch06.strindberg_twice");

    const withoutCarryOver = { ...state, notebook: state.notebook.slice(1) };
    const formedWithout = resolveConnections(withoutCarryOver, CHAPTER_06.connections);
    expect(formedWithout.map((c) => c.id)).not.toContain("ch06.strindberg_twice");
  });

  it("cross-chapter connection ch06.four_caws can actually be triggered by real engine logic (CH4 key)", async () => {
    const { CHAPTER_06 } = await import("../../src/data/chapters/chapter06.js");
    const conn = CHAPTER_06.connections.find((c) => c.id === "ch06.four_caws");
    expect(conn).toBeDefined();

    const state = {
      nerve: 5,
      insight: 0,
      currentChapter: 6,
      notebook: [
        { key: "ch04.la_mort", symbol: "raincoat", desc: "Mole——鼴鼠——la mort。死，像逼近姊夫那樣逼近我。而我竟在微笑" },
        { key: "ch06.gallows_crow", symbol: "raincoat", desc: "沒有鞦韆的鞦韆架像絞刑台。正中央的烏鴉朝天張喙，確確實實叫了四聲" },
      ],
      choicesMade: {},
      connections: [],
    };

    const formed = resolveConnections(state, CHAPTER_06.connections);
    expect(formed.map((c) => c.id)).toContain("ch06.four_caws");

    const withoutCarryOver = { ...state, notebook: state.notebook.slice(1) };
    const formedWithout = resolveConnections(withoutCarryOver, CHAPTER_06.connections);
    expect(formedWithout.map((c) => c.id)).not.toContain("ch06.four_caws");
  });

  it("cross-chapter connection ch06.mole_end can actually be triggered by real engine logic (CH5 key)", async () => {
    const { CHAPTER_06 } = await import("../../src/data/chapters/chapter06.js");
    const conn = CHAPTER_06.connections.find((c) => c.id === "ch06.mole_end");
    expect(conn).toBeDefined();

    const state = {
      nerve: 5,
      insight: 0,
      currentChapter: 6,
      notebook: [
        { key: "ch05.mole_curtain", symbol: "gear", desc: "拉下窗簾、白天也點著燈——我像鼴鼠一樣活著" },
        { key: "ch06.dead_mole", symbol: "gear", desc: "小路正中央，一具腐爛的鼴鼠屍骸腹部朝天躺著" },
      ],
      choicesMade: {},
      connections: [],
    };

    const formed = resolveConnections(state, CHAPTER_06.connections);
    expect(formed.map((c) => c.id)).toContain("ch06.mole_end");

    const withoutCarryOver = { ...state, notebook: state.notebook.slice(1) };
    const formedWithout = resolveConnections(withoutCarryOver, CHAPTER_06.connections);
    expect(formedWithout.map((c) => c.id)).not.toContain("ch06.mole_end");
  });
});
