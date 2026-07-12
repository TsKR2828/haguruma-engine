// 選項回溯（Lane R）純邏輯測試。規格：docs/batch-f5-ux.md §Lane R-4。
// 涵蓋：快照深拷貝隔離、截斷邏輯、換章清空、seen 標記持久。

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  cloneState,
  loadRewindStack,
  saveRewindStack,
  clearRewindStack,
  pushSnapshot,
  markTopChosen,
  truncateToCheckpoint,
  choiceSeenKey,
  isChoiceSeen,
  markChoiceSeen,
} from "../../src/engine/rewind.js";

function mockStorage() {
  const store = {};
  return {
    getItem: vi.fn((k) => (k in store ? store[k] : null)),
    setItem: vi.fn((k, v) => {
      store[k] = String(v);
    }),
    removeItem: vi.fn((k) => {
      delete store[k];
    }),
    _store: store,
  };
}

describe("rewind — cloneState 深拷貝隔離", () => {
  it("回傳的物件與原物件不同參照，且巢狀結構（notebook/journey/choicesMade）也不共享引用", () => {
    const state = {
      currentSceneId: "s1",
      nerve: 10,
      notebook: [{ key: "a", desc: "x" }],
      choicesMade: { chose_a: true },
      journey: { current: "loc", visited: ["loc"], symbols: { sym: true } },
      connections: [{ id: "c1" }],
    };
    const clone = cloneState(state);
    expect(clone).toEqual(state);
    expect(clone).not.toBe(state);
    expect(clone.notebook).not.toBe(state.notebook);
    expect(clone.notebook[0]).not.toBe(state.notebook[0]);
    expect(clone.choicesMade).not.toBe(state.choicesMade);
    expect(clone.journey).not.toBe(state.journey);
    expect(clone.journey.symbols).not.toBe(state.journey.symbols);
    expect(clone.connections).not.toBe(state.connections);

    // 改動 clone 不影響原本
    clone.notebook.push({ key: "b", desc: "y" });
    clone.journey.symbols.sym2 = true;
    expect(state.notebook.length).toBe(1);
    expect(state.journey.symbols.sym2).toBeUndefined();
  });
});

describe("rewind — 快照棧 sessionStorage I/O", () => {
  beforeEach(() => {
    vi.stubGlobal("sessionStorage", mockStorage());
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("loadRewindStack 對空 store 回傳空陣列", () => {
    expect(loadRewindStack(1)).toEqual([]);
  });

  it("saveRewindStack 寫入後 loadRewindStack 同章節讀回相同內容", () => {
    const entries = [{ sceneId: "s1", state: { nerve: 10 }, chosen: null, historyLen: 0 }];
    saveRewindStack(1, entries);
    expect(loadRewindStack(1)).toEqual(entries);
  });

  it("換章清空：saveRewindStack(1,...) 後用 loadRewindStack(2) 讀取回傳空陣列", () => {
    const entries = [{ sceneId: "s1", state: { nerve: 10 }, chosen: null, historyLen: 0 }];
    saveRewindStack(1, entries);
    expect(loadRewindStack(2)).toEqual([]);
    // 原章節資料不受影響
    expect(loadRewindStack(1)).toEqual(entries);
  });

  it("clearRewindStack 後 loadRewindStack 回傳空陣列", () => {
    saveRewindStack(1, [{ sceneId: "s1", state: {}, chosen: null, historyLen: 0 }]);
    clearRewindStack();
    expect(loadRewindStack(1)).toEqual([]);
  });

  it("sessionStorage 拋錯時靜默降級，不拋出", () => {
    vi.unstubAllGlobals();
    vi.stubGlobal("sessionStorage", {
      getItem: () => {
        throw new Error("no storage");
      },
      setItem: () => {
        throw new Error("no storage");
      },
    });
    expect(() => saveRewindStack(1, [{ sceneId: "s1", state: {}, chosen: null }])).not.toThrow();
    expect(loadRewindStack(1)).toEqual([]);
  });
});

describe("rewind — 快照棧操作（純函式）", () => {
  it("pushSnapshot 深拷貝 state，之後修改原 state 不影響已 push 的快照", () => {
    const state = { nerve: 10, notebook: [{ key: "a" }] };
    const entries = pushSnapshot([], "s1", state, 3);
    expect(entries.length).toBe(1);
    expect(entries[0].sceneId).toBe("s1");
    expect(entries[0].chosen).toBeNull();
    expect(entries[0].historyLen).toBe(3);
    expect(entries[0].state).toEqual(state);
    expect(entries[0].state).not.toBe(state);

    state.nerve = 999;
    state.notebook.push({ key: "b" });
    expect(entries[0].state.nerve).toBe(10);
    expect(entries[0].state.notebook.length).toBe(1);
  });

  it("pushSnapshot 超過 60 筆時 FIFO 丟棄最舊的一筆", () => {
    let entries = [];
    for (let i = 0; i < 61; i++) {
      entries = pushSnapshot(entries, `s${i}`, { nerve: i }, 0);
    }
    expect(entries.length).toBe(60);
    expect(entries[0].sceneId).toBe("s1"); // s0 被丟棄
    expect(entries[entries.length - 1].sceneId).toBe("s60");
  });

  it("markTopChosen 只改動棧頂（最後一筆），其餘不變", () => {
    let entries = pushSnapshot([], "s1", { nerve: 10 }, 0);
    entries = pushSnapshot(entries, "s2", { nerve: 9 }, 1);
    entries = markTopChosen(entries, 1, "選項乙");
    expect(entries[0].chosen).toBeNull();
    expect(entries[1].chosen).toEqual({ index: 1, text: "選項乙" });
  });

  it("markTopChosen 對空陣列原樣回傳", () => {
    expect(markTopChosen([], 0, "x")).toEqual([]);
  });

  it("truncateToCheckpoint 截斷至 pos（含），該點 chosen 重置為 null，之後的 entries 全丟棄", () => {
    let entries = pushSnapshot([], "s1", { nerve: 10 }, 0);
    entries = markTopChosen(entries, 0, "選項A");
    entries = pushSnapshot(entries, "s2", { nerve: 9 }, 1);
    entries = markTopChosen(entries, 0, "選項B");
    entries = pushSnapshot(entries, "s3", { nerve: 8 }, 2);
    entries = markTopChosen(entries, 0, "選項C");

    const truncated = truncateToCheckpoint(entries, 1); // 回到 s2 這個 checkpoint
    expect(truncated.length).toBe(2);
    expect(truncated[0].sceneId).toBe("s1");
    expect(truncated[0].chosen).toEqual({ index: 0, text: "選項A" });
    expect(truncated[1].sceneId).toBe("s2");
    expect(truncated[1].chosen).toBeNull(); // 玩家即將在此重新選擇
  });

  it("truncateToCheckpoint 對超出範圍的 pos 原樣回傳", () => {
    const entries = pushSnapshot([], "s1", { nerve: 10 }, 0);
    expect(truncateToCheckpoint(entries, 5)).toBe(entries);
    expect(truncateToCheckpoint(entries, -1)).toBe(entries);
  });
});

describe("rewind — 已見標記（localStorage，跨回溯持久）", () => {
  beforeEach(() => {
    vi.stubGlobal("localStorage", mockStorage());
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("choiceSeenKey 格式為 chapter:sceneId:choiceIndex", () => {
    expect(choiceSeenKey(1, "s1", 2)).toBe("1:s1:2");
  });

  it("未標記過的選項 isChoiceSeen 回傳 false", () => {
    expect(isChoiceSeen(choiceSeenKey(1, "s1", 0))).toBe(false);
  });

  it("markChoiceSeen 後 isChoiceSeen 回傳 true，且持久（模擬跨回溯 = 重複讀取）", () => {
    const key = choiceSeenKey(1, "s1", 0);
    markChoiceSeen(key);
    expect(isChoiceSeen(key)).toBe(true);
    // 「跨回溯持久」在這裡的意義是：markChoiceSeen 不受快照棧截斷影響——
    // 它寫進獨立的 localStorage key，多次讀取（模擬回溯後再次查詢）結果一致。
    expect(isChoiceSeen(key)).toBe(true);
  });

  it("不同選項各自獨立標記，互不影響", () => {
    markChoiceSeen(choiceSeenKey(1, "s1", 0));
    expect(isChoiceSeen(choiceSeenKey(1, "s1", 0))).toBe(true);
    expect(isChoiceSeen(choiceSeenKey(1, "s1", 1))).toBe(false);
    expect(isChoiceSeen(choiceSeenKey(1, "s2", 0))).toBe(false);
  });

  it("localStorage 拋錯時靜默降級，不拋出", () => {
    vi.unstubAllGlobals();
    vi.stubGlobal("localStorage", {
      getItem: () => {
        throw new Error("no storage");
      },
      setItem: () => {
        throw new Error("no storage");
      },
    });
    expect(() => markChoiceSeen("1:s1:0")).not.toThrow();
    expect(isChoiceSeen("1:s1:0")).toBe(false);
  });
});
