import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  blockKey,
  choiceKey,
  getOverlay,
  getAllOverlays,
  setOverlay,
  removeOverlay,
  clearAllOverlays,
  countOverlays,
  exportPatch,
  isDynamicSceneText,
  overlayBlock,
  applyOverlayToBlocks,
  overlayChoice,
} from "../../src/engine/textOverlay.js";

function mockLocalStorage() {
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

describe("textOverlay — key 產生", () => {
  it("blockKey 格式為 chapter:sceneId:bIndex", () => {
    expect(blockKey(1, "prologue", 0)).toBe("1:prologue:b0");
  });
  it("choiceKey 格式為 chapter:sceneId:cIndex", () => {
    expect(choiceKey(1, "auto_barber", 2)).toBe("1:auto_barber:c2");
  });
});

describe("textOverlay — get/set/remove/clearAll roundtrip", () => {
  beforeEach(() => {
    vi.stubGlobal("localStorage", mockLocalStorage());
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("getOverlay 對不存在的 key 回傳 null", () => {
    expect(getOverlay("1:x:b0")).toBeNull();
  });

  it("setOverlay 寫入後 getOverlay 讀回相同內容（含 orig 快照）", () => {
    const key = blockKey(1, "prologue", 0);
    setOverlay(key, { cn: "我提著一只皮箱" }, { jp: "僕は…", cn: "你提著一只皮箱" });
    const entry = getOverlay(key);
    expect(entry.cn).toBe("我提著一只皮箱");
    expect(entry.orig).toEqual({ jp: "僕は…", cn: "你提著一只皮箱" });
  });

  it("第二次 setOverlay 同一 key 保留第一次的 orig 快照，不被覆蓋", () => {
    const key = blockKey(1, "prologue", 0);
    setOverlay(key, { cn: "第一次改動" }, { jp: "jp0", cn: "orig-cn" });
    setOverlay(key, { cn: "第二次改動" }, { jp: "jp0", cn: "應該不會用到這個 orig" });
    const entry = getOverlay(key);
    expect(entry.cn).toBe("第二次改動");
    expect(entry.orig).toEqual({ jp: "jp0", cn: "orig-cn" });
  });

  it("removeOverlay 移除後 getOverlay 回傳 null", () => {
    const key = blockKey(1, "prologue", 0);
    setOverlay(key, { content: "改動" }, { content: "原文" });
    expect(getOverlay(key)).not.toBeNull();
    removeOverlay(key);
    expect(getOverlay(key)).toBeNull();
  });

  it("countOverlays 反映目前修改數，clearAllOverlays 全部清空", () => {
    setOverlay(blockKey(1, "s1", 0), { content: "a" }, { content: "orig-a" });
    setOverlay(blockKey(1, "s1", 1), { content: "b" }, { content: "orig-b" });
    expect(countOverlays()).toBe(2);
    clearAllOverlays();
    expect(countOverlays()).toBe(0);
    expect(getAllOverlays()).toEqual({});
  });

  it("getOverlay/setOverlay 在無 localStorage（拋錯）環境下靜默降級，不拋出", () => {
    vi.unstubAllGlobals();
    vi.stubGlobal("localStorage", {
      getItem: () => {
        throw new Error("no storage");
      },
      setItem: () => {
        throw new Error("no storage");
      },
    });
    expect(() => setOverlay("1:x:b0", { content: "a" }, { content: "orig" })).not.toThrow();
    expect(getOverlay("1:x:b0")).toBeNull();
  });
});

describe("textOverlay — exportPatch", () => {
  beforeEach(() => {
    vi.stubGlobal("localStorage", mockLocalStorage());
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("空 store 匯出空陣列", () => {
    expect(exportPatch()).toEqual([]);
  });

  it("單欄位修改展開成一條 patch entry", () => {
    setOverlay(blockKey(1, "prologue", 0), { content: "新內容" }, { content: "舊內容" });
    const patch = exportPatch();
    expect(patch).toEqual([
      {
        key: "1:prologue:b0",
        chapter: 1,
        sceneId: "prologue",
        kind: "block",
        index: 0,
        field: "content",
        oldValue: "舊內容",
        newValue: "新內容",
      },
    ]);
  });

  it("dual block（jp+cn 都改）展開成兩條 patch entry", () => {
    setOverlay(
      blockKey(2, "s7", 3),
      { jp: "新jp", cn: "新cn" },
      { jp: "舊jp", cn: "舊cn" },
    );
    const patch = exportPatch();
    expect(patch.length).toBe(2);
    const fields = patch.map((p) => p.field).sort();
    expect(fields).toEqual(["cn", "jp"]);
    expect(patch.every((p) => p.chapter === 2 && p.sceneId === "s7" && p.kind === "block" && p.index === 3)).toBe(true);
  });

  it("choice 修改的 kind 為 choice，index 為選項原始索引", () => {
    setOverlay(choiceKey(1, "auto_barber", 1), { text: "新選項文字" }, { text: "舊選項文字" });
    const patch = exportPatch();
    expect(patch[0].kind).toBe("choice");
    expect(patch[0].index).toBe(1);
    expect(patch[0].sceneId).toBe("auto_barber");
  });

  it("roundtrip：改一條→匯出→套用邏輯可從 patch 還原 oldValue/newValue 對應關係", () => {
    const key = blockKey(1, "prologue", 0);
    setOverlay(key, { cn: "我提著一只皮箱" }, { jp: "僕は…", cn: "你提著一只皮箱" });
    const patch = exportPatch();
    expect(patch.length).toBe(1);
    const [p] = patch;
    expect(p.oldValue).toBe("你提著一只皮箱");
    expect(p.newValue).toBe("我提著一只皮箱");
  });
});

describe("textOverlay — 套用點 helpers", () => {
  beforeEach(() => {
    vi.stubGlobal("localStorage", mockLocalStorage());
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("isDynamicSceneText 正確判斷 text 是否為函式", () => {
    expect(isDynamicSceneText({ text: [] })).toBe(false);
    expect(isDynamicSceneText({ text: (s) => [] })).toBe(true);
    expect(isDynamicSceneText({})).toBe(false);
  });

  it("overlayBlock 無修改時原樣回傳（同參照）", () => {
    const block = { type: "narration", origin: "source", jp: "j", cn: "c" };
    expect(overlayBlock(block, 1, "s1", 0, false)).toBe(block);
  });

  it("overlayBlock 有修改時回傳合併後的新物件，不修改原 block", () => {
    const block = { type: "narration", origin: "source", jp: "j", cn: "c" };
    setOverlay(blockKey(1, "s1", 0), { cn: "改過的cn" }, { jp: "j", cn: "c" });
    const result = overlayBlock(block, 1, "s1", 0, false);
    expect(result.cn).toBe("改過的cn");
    expect(result.jp).toBe("j");
    expect(block.cn).toBe("c"); // 原物件不變
  });

  it("overlayBlock locked=true（動態場景）一律原樣回傳，即使有 overlay entry", () => {
    const block = { type: "narration", origin: "source", jp: "j", cn: "c" };
    setOverlay(blockKey(1, "s1", 0), { cn: "改過的cn" }, { jp: "j", cn: "c" });
    expect(overlayBlock(block, 1, "s1", 0, true)).toBe(block);
  });

  it("overlayBlock 對 break/pause/system 一律原樣回傳", () => {
    const brk = { type: "break" };
    const sys = { type: "system", content: "x" };
    expect(overlayBlock(brk, 1, "s1", 0, false)).toBe(brk);
    expect(overlayBlock(sys, 1, "s1", 1, false)).toBe(sys);
  });

  it("applyOverlayToBlocks 逐一套用陣列中每個 block 的 overlay，其餘保持原參照", () => {
    const blocks = [
      { type: "narration", origin: "source", jp: "j0", cn: "c0" },
      { type: "narration", origin: "source", jp: "j1", cn: "c1" },
    ];
    setOverlay(blockKey(1, "s1", 1), { cn: "改過的c1" }, { jp: "j1", cn: "c1" });
    const result = applyOverlayToBlocks(blocks, 1, "s1", false);
    expect(result[0]).toBe(blocks[0]);
    expect(result[1]).not.toBe(blocks[1]);
    expect(result[1].cn).toBe("改過的c1");
  });

  it("applyOverlayToBlocks locked=true 時整個陣列原樣回傳", () => {
    const blocks = [{ type: "narration", origin: "source", jp: "j0", cn: "c0" }];
    setOverlay(blockKey(1, "s1", 0), { cn: "不該套用" }, { jp: "j0", cn: "c0" });
    expect(applyOverlayToBlocks(blocks, 1, "s1", true)).toBe(blocks);
  });

  it("overlayChoice 有修改時回傳合併後的新物件", () => {
    const choice = { text: "原選項", next: "n1" };
    setOverlay(choiceKey(1, "s1", 0), { text: "改過的選項" }, { text: "原選項" });
    const result = overlayChoice(choice, 1, "s1", 0);
    expect(result.text).toBe("改過的選項");
    expect(result.next).toBe("n1");
  });

  it("overlayChoice 無修改時原樣回傳（同參照）", () => {
    const choice = { text: "原選項", next: "n1" };
    expect(overlayChoice(choice, 1, "s1", 0)).toBe(choice);
  });
});
