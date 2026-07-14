// 換書點：整個 app 只有這一行知道「現在玩的是哪本書」。
// 換一本書＝新增 src/books/<id>/index.js，把下面這行的來源改掉即可。
export { BOOK } from "./books/haguruma/index.js";
