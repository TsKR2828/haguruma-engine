const COMBINING = "̷̧̢̡̕͝͞҉̴̶̸͍̩̭̮̯̪̟̱̬̜̦̤̳";

// 泛化版：thresholdLevel/statMax 取代寫死的 5/10（施工圖 §1 S1）。
// 當 thresholdLevel=5, statMax=10 時與舊版 corruptText 逐位元一致
// （halfRatio=0.5，intensity=(0.5-ratio)*2 的等價形式）。
export function corruptTextFor(text, nerveLevel, thresholdLevel = 5, statMax = 10) {
  const halfRatio = statMax > 0 ? thresholdLevel / statMax : 0;
  const ratio = statMax > 0 ? nerveLevel / statMax : 0;
  if (ratio > halfRatio) return text;

  const intensity = halfRatio > 0 ? (halfRatio - ratio) / halfRatio : 0;
  const threshold = intensity * 0.15;

  return text
    .split("")
    .map((c, i) => {
      if (!c.trim()) return c;
      const hash = ((c.charCodeAt(0) * 31 + i * 17 + nerveLevel * 7) & 0xffff) / 0xffff;
      if (hash < threshold) {
        const gi = ((c.charCodeAt(0) + i * 13) & 0xffff) % COMBINING.length;
        return c + COMBINING[gi];
      }
      return c;
    })
    .join("");
}

// haguruma 綁定版（向後相容，既有呼叫點不帶 threshold/max 參數）。
export function corruptText(text, nerveLevel) {
  return corruptTextFor(text, nerveLevel, 5, 10);
}
