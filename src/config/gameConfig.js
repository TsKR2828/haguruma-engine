// DEPRECATED (Batch F11 — 換書泛化，見 docs/batch-f11-generalize.md §0)。
// 這份手寫 spec 已被 src/books/haguruma/index.js 的 BOOK bundle 取代（bundle
// 才是單一事實來源，由 src/bookLoader.js 匯出）。本檔只保留 re-export 以防
// 殘留 import 炸掉；不要再從這裡讀設定，改用 `import { BOOK } from
// "../bookLoader"`。
export { BOOK as gameConfig } from "../bookLoader.js";
