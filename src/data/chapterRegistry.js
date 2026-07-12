import { CHAPTER_01 } from "./chapters/chapter01";
import { CHAPTER_02 } from "./chapters/chapter02";

const registry = {
  1: CHAPTER_01,
  2: CHAPTER_02,
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
