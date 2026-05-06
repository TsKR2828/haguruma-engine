import { describe, it, expect } from "vitest";
import { corruptText } from "../../src/engine/corrupt.js";

describe("corruptText", () => {
  it("returns text unchanged when nerve > 5", () => {
    expect(corruptText("測試文字", 8)).toBe("測試文字");
    expect(corruptText("hello", 6)).toBe("hello");
    expect(corruptText("abc", 10)).toBe("abc");
  });

  it("returns text unchanged when nerve is exactly 6", () => {
    expect(corruptText("test", 6)).toBe("test");
  });

  it("corrupts text when nerve <= 5", () => {
    const original = "測試文字範例句子";
    const corrupted = corruptText(original, 3);
    expect(corrupted).not.toBe(original);
    expect(corrupted.length).toBeGreaterThan(original.length);
  });

  it("corrupts more aggressively at lower nerve", () => {
    const text = "這是一段很長的測試文字用來確認腐蝕程度的差異";
    const mild = corruptText(text, 5);
    const severe = corruptText(text, 0);
    expect(severe.length).toBeGreaterThanOrEqual(mild.length);
  });

  it("is deterministic — same input produces same output", () => {
    const text = "齒輪在旋轉";
    const a = corruptText(text, 2);
    const b = corruptText(text, 2);
    expect(a).toBe(b);
  });

  it("preserves whitespace characters", () => {
    const text = "a b\tc";
    const result = corruptText(text, 1);
    const spaces = result.split("").filter((c) => c === " " || c === "\t");
    expect(spaces.length).toBeGreaterThanOrEqual(2);
  });

  it("handles empty string", () => {
    expect(corruptText("", 0)).toBe("");
  });
});
