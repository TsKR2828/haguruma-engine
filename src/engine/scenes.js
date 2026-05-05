export function getSceneById(chapter, sceneId) {
  return chapter.scenes?.[sceneId] ?? null;
}

export function resolveText(scene, state) {
  if (typeof scene.text === "function") return scene.text(state);
  return scene.text ?? [];
}

export function resolveChoices(scene, state) {
  if (!Array.isArray(scene.choices)) return null;
  return scene.choices.filter((c) => {
    if (typeof c.condition === "function") return c.condition(state);
    return true;
  });
}
