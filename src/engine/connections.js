export function resolveConnections(state, connections) {
  const formed = [];
  for (const conn of connections) {
    if (state.connections.includes(conn.id)) continue;

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
  return {
    ...state,
    connections: [...state.connections, conn.id],
    insight: state.insight + (conn.insightGain ?? 0),
  };
}
