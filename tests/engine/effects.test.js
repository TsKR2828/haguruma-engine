import { describe, it, expect } from "vitest";
import { loseNerve, gainInsight, gainWriting, applyEffects } from "../../src/engine/effects.js";

const base = () => ({ nerve: 10, insight: 0, writing: 0 });

describe("loseNerve", () => {
  it("decreases nerve by amount", () => {
    expect(loseNerve(base(), 3).nerve).toBe(7);
  });

  it("clamps at 0", () => {
    expect(loseNerve(base(), 15).nerve).toBe(0);
  });

  it("does not mutate original state", () => {
    const s = base();
    loseNerve(s, 3);
    expect(s.nerve).toBe(10);
  });
});

describe("gainInsight", () => {
  it("increases insight", () => {
    expect(gainInsight(base(), 2).insight).toBe(2);
  });

  it("accumulates", () => {
    const s = { ...base(), insight: 5 };
    expect(gainInsight(s, 3).insight).toBe(8);
  });
});

describe("gainWriting", () => {
  it("increases writing", () => {
    expect(gainWriting(base(), 1).writing).toBe(1);
  });
});

describe("applyEffects", () => {
  it("returns state unchanged when effects is null", () => {
    const s = base();
    expect(applyEffects(s, null)).toBe(s);
  });

  it("handles nerve loss (negative amount)", () => {
    const result = applyEffects(base(), {
      nerve: { amount: -2, reason: "test" },
    });
    expect(result.nerve).toBe(8);
  });

  it("handles insight gain", () => {
    const result = applyEffects(base(), {
      insight: { amount: 1, reason: "test" },
    });
    expect(result.insight).toBe(1);
  });

  it("handles writing gain", () => {
    const result = applyEffects(base(), {
      writing: { amount: 1, reason: "test" },
    });
    expect(result.writing).toBe(1);
  });

  it("handles combined effects", () => {
    const result = applyEffects(base(), {
      nerve: { amount: -1, reason: "a" },
      insight: { amount: 2, reason: "b" },
      writing: { amount: 1, reason: "c" },
    });
    expect(result.nerve).toBe(9);
    expect(result.insight).toBe(2);
    expect(result.writing).toBe(1);
  });

  it("clamps nerve at 0", () => {
    const s = { ...base(), nerve: 1 };
    const result = applyEffects(s, {
      nerve: { amount: -5, reason: "x" },
    });
    expect(result.nerve).toBe(0);
  });

  it("clamps nerve at 10 (upper bound, Bug 9)", () => {
    const s = { ...base(), nerve: 9 };
    const result = applyEffects(s, {
      nerve: { amount: 5, reason: "x" },
    });
    expect(result.nerve).toBe(10);
  });

  it("clamps nerve at 10 even when already at max", () => {
    const result = applyEffects(base(), {
      nerve: { amount: 3, reason: "x" },
    });
    expect(result.nerve).toBe(10);
  });

  it("does not mutate original state", () => {
    const s = base();
    applyEffects(s, { nerve: { amount: -3, reason: "x" } });
    expect(s.nerve).toBe(10);
  });
});
