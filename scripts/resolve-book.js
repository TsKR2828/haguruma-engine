// 共用：CLI 工具（validate-chapters.js／validate-fidelity.js）讀 --book=<id>
// 決定要驗證哪一本書的 bundle（施工圖 §3 S3）。
// 不帶旗標時的行為（走 defaultBook＝haguruma）逐字不變，只有明確指定
// --book=<非預設 id> 時才動態載入 src/books/<id>/index.js。
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

export function parseBookIdArg(defaultId) {
  const arg = process.argv.find((a) => a.startsWith("--book="));
  return arg ? arg.slice("--book=".length) : defaultId;
}

export async function resolveBook(bookId, defaultBook) {
  if (!bookId || bookId === defaultBook.id) return defaultBook;
  const url = pathToFileURL(resolve(`src/books/${bookId}/index.js`)).href;
  const mod = await import(url);
  return mod.BOOK;
}
