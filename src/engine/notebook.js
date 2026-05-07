/**
 * Upsert a notebook entry: append if new key, update desc if key exists.
 * @param {Array} notebook - current notebook array
 * @param {Object|null} entry - { key, symbol, desc }
 * @returns {Array} updated notebook (new reference)
 */
export function upsertNotebook(notebook, entry) {
  if (!entry) return notebook;
  const idx = notebook.findIndex((n) => n.key === entry.key);
  if (idx >= 0) {
    return notebook.map((n, i) => (i === idx ? entry : n));
  }
  return [...notebook, entry];
}
