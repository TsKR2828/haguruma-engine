import { CHAPTER_01 } from "./chapters/chapter01.js";
import { CHAPTER_02 } from "./chapters/chapter02.js";
import { CHAPTER_03 } from "./chapters/chapter03.js";
import { CHAPTER_04 } from "./chapters/chapter04.js";
import { CHAPTER_05 } from "./chapters/chapter05.js";
import { CHAPTER_06 } from "./chapters/chapter06.js";

const registry = {
  1: CHAPTER_01,
  2: CHAPTER_02,
  3: CHAPTER_03,
  4: CHAPTER_04,
  5: CHAPTER_05,
  6: CHAPTER_06,
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
