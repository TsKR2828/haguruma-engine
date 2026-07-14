import { BOOK } from "../bookLoader.js";

export function loseNerve(state, amount) {
  return {
    ...state,
    nerve: Math.max(0, state.nerve - amount),
  };
}

export function gainInsight(state, amount) {
  return { ...state, insight: state.insight + amount };
}

export function gainWriting(state, amount) {
  return { ...state, writing: state.writing + amount };
}

// 泛化版 applyEffects：迭代 book.stats，依各軸 min/max 夾制（施工圖 §1 S1，
// 取代寫死的 nerve/insight/writing 三個 if）。
export function applyEffectsFor(book, state, effects) {
  if (!effects) return state;
  let next = state;
  for (const stat of book.stats) {
    const fx = effects[stat.key];
    if (!fx) continue;
    let val = next[stat.key] + fx.amount;
    if (stat.min != null) val = Math.max(stat.min, val);
    if (stat.max != null) val = Math.min(stat.max, val);
    next = { ...next, [stat.key]: val };
  }
  return next;
}

// haguruma 綁定版（向後相容，既有呼叫點不帶 book 參數）。
export function applyEffects(state, effects) {
  return applyEffectsFor(BOOK, state, effects);
}
