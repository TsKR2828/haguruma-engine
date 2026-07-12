export function resolveConnections(state, connections) {
  const formed = [];
  for (const conn of connections) {
    if (state.connections.some((c) => c.id === conn.id && c.title)) continue;

    let met = false;
    if (typeof conn.check === "function") {
      met = conn.check(state);
    } else if (conn.requires) {
      met = conn.requires.every((req) =>
        state.notebook.some((n) => n.key === req)
      );
    }

    if (met) formed.push(conn);
  }
  return formed;
}

export function applyConnection(state, conn) {
  const entry = {
    id: conn.id,
    title: conn.title ?? conn.id,
    subtitle: conn.subtitle ?? null,
    icon: conn.icon ?? null,
    chapter: state.currentChapter,
  };

  const idx = state.connections.findIndex((c) => c.id === conn.id);
  if (idx >= 0) {
    // Upgrade: replace metadata, no duplicate insight
    return {
      ...state,
      connections: state.connections.map((c, i) => (i === idx ? entry : c)),
    };
  }
  return {
    ...state,
    connections: [...state.connections, entry],
    insight: state.insight + (conn.insightGain ?? 0),
  };
}
