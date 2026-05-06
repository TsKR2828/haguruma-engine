export const initialState = {
  currentSceneId: null,
  currentChapter: 1,
  nerve: 10,
  insight: 0,
  writing: 0,
  notebook: [],
  choicesMade: {},
  journey: {
    current: null,
    visited: [],
    symbols: {},
  },
  connections: [],
};

export function createChapterState(chapter, carryOver) {
  if (!carryOver) {
    return {
      ...initialState,
      currentChapter: chapter.chapter,
      currentSceneId: chapter.startScene,
      journey: {
        current: chapter.startLocation ?? null,
        visited: chapter.startLocation ? [chapter.startLocation] : [],
        symbols: {},
      },
    };
  }
  return {
    ...initialState,
    currentChapter: chapter.chapter,
    currentSceneId: chapter.startScene,
    nerve: carryOver.nerve,
    insight: carryOver.insight,
    writing: carryOver.writing,
    notebook: carryOver.notebook,
    choicesMade: carryOver.choicesMade,
    connections: carryOver.connections,
    journey: {
      current: chapter.startLocation ?? null,
      visited: chapter.startLocation ? [chapter.startLocation] : [],
      symbols: {},
    },
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case "ADVANCE_SCENE":
      return { ...state, currentSceneId: action.sceneId };

    case "SET_FLAG":
      return {
        ...state,
        choicesMade: { ...state.choicesMade, [action.flag]: true },
      };

    case "ADD_NOTEBOOK":
      return { ...state, notebook: [...state.notebook, action.entry] };

    case "APPLY_EFFECTS": {
      if (!action.effects) return state;
      let next = state;
      if (action.effects.nerve) {
        next = {
          ...next,
          nerve: Math.max(0, next.nerve + action.effects.nerve.amount),
        };
      }
      if (action.effects.insight) {
        next = { ...next, insight: next.insight + action.effects.insight.amount };
      }
      if (action.effects.writing) {
        next = { ...next, writing: next.writing + action.effects.writing.amount };
      }
      return next;
    }

    case "FORM_CONNECTION":
      return {
        ...state,
        connections: [...state.connections, action.connectionId],
        insight: state.insight + (action.insightGain ?? 0),
      };

    case "VISIT_LOCATION":
      return {
        ...state,
        journey: {
          ...state.journey,
          current: action.locationId,
          visited: state.journey.visited.includes(action.locationId)
            ? state.journey.visited
            : [...state.journey.visited, action.locationId],
        },
      };

    case "UNLOCK_SYMBOL":
      return {
        ...state,
        journey: {
          ...state.journey,
          symbols: { ...state.journey.symbols, [action.key]: true },
        },
      };

    case "RESET":
      return { ...initialState };

    default:
      return state;
  }
}
