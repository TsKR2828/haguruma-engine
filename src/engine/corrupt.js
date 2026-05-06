const COMBINING = "̷̧̢̡̕͝͞҉̴̶̸͍̩̭̮̯̪̟̱̬̜̦̤̳";

export function corruptText(text, nerveLevel) {
  const ratio = nerveLevel / 10;
  if (ratio > 0.5) return text;

  const intensity = (0.5 - ratio) * 2;
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
