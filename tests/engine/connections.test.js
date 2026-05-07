import { describe, it, expect } from "vitest";
import { resolveConnections, applyConnection } from "../../src/engine/connections.js";

const MOCK_CONNECTIONS = [
  {
    id: "raincoat_double",
    requires: ["raincoat_station", "raincoat_train"],
    title: "兩件雨衣",
    insightGain: 1,
  },
  {
    id: "raincoat_triple",
    requires: ["raincoat_station", "raincoat_train", "raincoat_hotel"],
    title: "三件雨衣",
    insightGain: 1,
  },
  {
    id: "allright_meaning",
    check: (s) =>
      s.choicesMade.pondered_allright &&
      s.notebook.some((n) => n.key === "raincoat_death"),
    title: "All right",
    insightGain: 1,
  },
];

const base = () => ({
  nerve: 10,
  insight: 0,
  currentChapter: 1,
  notebook: [],
  choicesMade: {},
  connections: [],
});

describe("resolveConnections", () => {
  it("returns empty when no connections are met", () => {
    const result = resolveConnections(base(), MOCK_CONNECTIONS);
    expect(result).toEqual([]);
  });

  it("returns connection when requires are satisfied", () => {
    const s = {
      ...base(),
      notebook: [
        { key: "raincoat_station", symbol: "raincoat", desc: "a" },
        { key: "raincoat_train", symbol: "raincoat", desc: "b" },
      ],
    };
    const result = resolveConnections(s, MOCK_CONNECTIONS);
    expect(result.length).toBe(1);
    expect(result[0].id).toBe("raincoat_double");
  });

  it("returns multiple connections when multiple are met", () => {
    const s = {
      ...base(),
      notebook: [
        { key: "raincoat_station", symbol: "raincoat", desc: "a" },
        { key: "raincoat_train", symbol: "raincoat", desc: "b" },
        { key: "raincoat_hotel", symbol: "raincoat", desc: "c" },
      ],
    };
    const result = resolveConnections(s, MOCK_CONNECTIONS);
    const ids = result.map((c) => c.id);
    expect(ids).toContain("raincoat_double");
    expect(ids).toContain("raincoat_triple");
  });

  it("skips already-formed connections", () => {
    const s = {
      ...base(),
      connections: [{ id: "raincoat_double", title: "兩件雨衣", chapter: 1 }],
      notebook: [
        { key: "raincoat_station", symbol: "raincoat", desc: "a" },
        { key: "raincoat_train", symbol: "raincoat", desc: "b" },
      ],
    };
    const result = resolveConnections(s, MOCK_CONNECTIONS);
    expect(result).toEqual([]);
  });

  it("handles custom check function", () => {
    const s = {
      ...base(),
      choicesMade: { pondered_allright: true },
      notebook: [{ key: "raincoat_death", symbol: "raincoat", desc: "d" }],
    };
    const result = resolveConnections(s, MOCK_CONNECTIONS);
    expect(result.length).toBe(1);
    expect(result[0].id).toBe("allright_meaning");
  });

  it("custom check returns false when condition not met", () => {
    const s = {
      ...base(),
      choicesMade: { pondered_allright: true },
      notebook: [],
    };
    const result = resolveConnections(s, MOCK_CONNECTIONS);
    expect(result).toEqual([]);
  });
});

describe("applyConnection", () => {
  it("adds connection object to state", () => {
    const s = base();
    const conn = MOCK_CONNECTIONS[0];
    const result = applyConnection(s, conn);
    expect(result.connections).toHaveLength(1);
    expect(result.connections[0].id).toBe("raincoat_double");
    expect(result.connections[0].title).toBe("兩件雨衣");
    expect(result.connections[0].chapter).toBe(1);
  });

  it("adds insight gain for new connection", () => {
    const s = base();
    const conn = { id: "test", title: "Test", insightGain: 2 };
    const result = applyConnection(s, conn);
    expect(result.insight).toBe(2);
  });

  it("upgrades existing connection without duplicate insight", () => {
    const s = {
      ...base(),
      connections: [{ id: "raincoat_double", title: "兩件雨衣", subtitle: null, icon: "◇", chapter: 1 }],
      insight: 5,
      currentChapter: 2,
    };
    const upgraded = { id: "raincoat_double", title: "兩件雨衣（確認）", subtitle: "迴路確認", icon: "◈", insightGain: 1 };
    const result = applyConnection(s, upgraded);
    expect(result.connections).toHaveLength(1);
    expect(result.connections[0].title).toBe("兩件雨衣（確認）");
    expect(result.connections[0].chapter).toBe(2);
    expect(result.insight).toBe(5); // no duplicate gain
  });

  it("does not mutate original state", () => {
    const s = base();
    applyConnection(s, MOCK_CONNECTIONS[0]);
    expect(s.connections).toEqual([]);
    expect(s.insight).toBe(0);
  });
});

describe("resolveConnections: v2 migration metadata upgrade", () => {
  it("does not skip connection when existing entry lacks title", () => {
    const s = {
      ...base(),
      connections: [{ id: "raincoat_double" }],
      notebook: [
        { key: "raincoat_station", symbol: "raincoat", desc: "a" },
        { key: "raincoat_train", symbol: "raincoat", desc: "b" },
      ],
    };
    const result = resolveConnections(s, MOCK_CONNECTIONS);
    expect(result.length).toBe(1);
    expect(result[0].id).toBe("raincoat_double");
  });

  it("skips connection when existing entry already has title", () => {
    const s = {
      ...base(),
      connections: [{ id: "raincoat_double", title: "兩件雨衣", chapter: 1 }],
      notebook: [
        { key: "raincoat_station", symbol: "raincoat", desc: "a" },
        { key: "raincoat_train", symbol: "raincoat", desc: "b" },
      ],
    };
    const result = resolveConnections(s, MOCK_CONNECTIONS);
    expect(result).toEqual([]);
  });

  it("applyConnection upgrades metadata without adding insight", () => {
    const s = {
      ...base(),
      connections: [{ id: "raincoat_double" }],
      insight: 3,
    };
    const result = applyConnection(s, MOCK_CONNECTIONS[0]);
    expect(result.connections[0].title).toBe("兩件雨衣");
    expect(result.connections[0].chapter).toBe(1);
    expect(result.insight).toBe(3);
  });
});
