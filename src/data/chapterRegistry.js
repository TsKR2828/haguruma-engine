import { CHAPTER_01 } from "./chapters/chapter01";

const registry = {
  1: CHAPTER_01,
};

export function getChapter(num) {
  return registry[num] ?? null;
}

export function getAllChapters() {
  return Object.values(registry);
}

export function getChapterCount() {
  return Object.keys(registry).length;
}
