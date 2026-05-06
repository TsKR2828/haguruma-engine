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

export function applyEffects(state, effects) {
  if (!effects) return state;
  let next = state;
  if (effects.nerve) {
    next = { ...next, nerve: Math.max(0, next.nerve + effects.nerve.amount) };
  }
  if (effects.insight) {
    next = { ...next, insight: next.insight + effects.insight.amount };
  }
  if (effects.writing) {
    next = { ...next, writing: next.writing + effects.writing.amount };
  }
  return next;
}
