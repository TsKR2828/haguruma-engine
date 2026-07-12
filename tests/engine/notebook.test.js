import { describe, it, expect } from "vitest";
import { upsertNotebook } from "../../src/engine/notebook.js";

describe("upsertNotebook", () => {
  const existing = [
    { key: "raincoat_station", symbol: "raincoat", desc: "停車場的雨衣男" },
    { key: "gear_first", symbol: "gear", desc: "齒輪初現" },
  ];

  it("appends new entry when key does not exist", () => {
    const entry = { key: "book_worm", symbol: "book", desc: "Worm" };
    const result = upsertNotebook(existing, entry);
    expect(result).toHaveLength(3);
    expect(result[2]).toEqual(entry);
  });

  it("updates desc when key already exists", () => {
    const updated = { key: "raincoat_station", symbol: "raincoat", desc: "原來是死亡的前兆" };
    const result = upsertNotebook(existing, updated);
    expect(result).toHaveLength(2);
    expect(result[0].desc).toBe("原來是死亡的前兆");
    expect(result[1].key).toBe("gear_first"); // other entry unchanged
  });

  it("returns same array reference when entry is null", () => {
    const result = upsertNotebook(existing, null);
    expect(result).toBe(existing);
  });

  it("does not mutate original array", () => {
    const entry = { key: "book_worm", symbol: "book", desc: "Worm" };
    upsertNotebook(existing, entry);
    expect(existing).toHaveLength(2);
  });

  it("does not mutate original entry on update", () => {
    const updated = { key: "raincoat_station", symbol: "raincoat", desc: "updated" };
    const result = upsertNotebook(existing, updated);
    expect(existing[0].desc).toBe("停車場的雨衣男");
    expect(result[0].desc).toBe("updated");
  });

  it("works on empty notebook", () => {
    const entry = { key: "new_key", symbol: "wing", desc: "first entry" };
    const result = upsertNotebook([], entry);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(entry);
  });
});
