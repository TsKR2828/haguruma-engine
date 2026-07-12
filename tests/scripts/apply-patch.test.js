import { describe, it, expect } from "vitest";
import { applyEntriesToContent, planPatch, chapterFilePath } from "../../scripts/apply-text-patch.js";

describe("chapterFilePath", () => {
  it("章節編號補零成兩位數對應 chapterNN.js", () => {
    expect(chapterFilePath(1)).toMatch(/[\\/]chapter01\.js$/);
    expect(chapterFilePath(12)).toMatch(/[\\/]chapter12\.js$/);
  });
});

describe("applyEntriesToContent — 命中替換", () => {
  it("唯一 oldValue 被精確替換為 newValue", () => {
    const content = `{ jp: "僕は或知り人の結婚披露式", cn: "你提著一只皮箱" }`;
    const entries = [{ key: "1:prologue:b0", oldValue: "你提著一只皮箱", newValue: "我提著一只皮箱" }];
    const { content: out, results } = applyEntriesToContent(content, entries);
    expect(out).toBe(`{ jp: "僕は或知り人の結婚披露式", cn: "我提著一只皮箱" }`);
    expect(results[0].status).toBe("applied");
  });

  it("同檔案多條依序套用，各自替換成功且互不干擾", () => {
    const content = `x("你好"); y("再見");`;
    const entries = [
      { key: "k4", oldValue: "你好", newValue: "哈囉" },
      { key: "k5", oldValue: "再見", newValue: "掰掰" },
    ];
    const { content: out, results } = applyEntriesToContent(content, entries);
    expect(out).toBe(`x("哈囉"); y("掰掰");`);
    expect(results.every((r) => r.status === "applied")).toBe(true);
  });
});

describe("applyEntriesToContent — 不唯一拒絕", () => {
  it("oldValue 出現超過一次時不替換、回報 not-unique", () => {
    const content = `a("你好"); b("你好");`;
    const entries = [{ key: "k2", oldValue: "你好", newValue: "哈囉" }];
    const { content: out, results } = applyEntriesToContent(content, entries);
    expect(out).toBe(content); // 內容未變動
    expect(results[0].status).toBe("not-unique");
  });

  it("前一條把 oldValue 替換成與另一條相同的字串後，該條仍依當下內容判定唯一性", () => {
    // entry1 把 "A" 換成 "X"，此時 content 出現兩個 "X"（一個是原本就有的），
    // entry2 想找 "X" 時應該因不唯一被拒絕。
    const content = `p("A"); q("X");`;
    const entries = [
      { key: "k1", oldValue: "A", newValue: "X" },
      { key: "k2", oldValue: "X", newValue: "Y" },
    ];
    const { results } = applyEntriesToContent(content, entries);
    expect(results[0].status).toBe("applied");
    expect(results[1].status).toBe("not-unique");
  });
});

describe("applyEntriesToContent — 缺失拒絕", () => {
  it("oldValue 在檔案中找不到時不替換、回報 not-found", () => {
    const content = `a("existing text");`;
    const entries = [{ key: "k3", oldValue: "missing text", newValue: "new text" }];
    const { content: out, results } = applyEntriesToContent(content, entries);
    expect(out).toBe(content);
    expect(results[0].status).toBe("not-found");
  });

  it("oldValue 為空字串時直接回報 not-found（不允許模糊/空匹配）", () => {
    const content = `a("existing text");`;
    const entries = [{ key: "k6", oldValue: "", newValue: "x" }];
    const { results } = applyEntriesToContent(content, entries);
    expect(results[0].status).toBe("not-found");
  });
});

describe("planPatch", () => {
  it("找不到對應章節檔案時，整批 entries 回報 not-found", () => {
    const patch = [{ key: "k1", chapter: 99, sceneId: "x", kind: "block", index: 0, field: "cn", oldValue: "a", newValue: "b" }];
    const { allResults } = planPatch(patch, new Map());
    expect(allResults[0].status).toBe("not-found");
  });

  it("依 entry.chapter 分派到對應檔案並正確套用", () => {
    const filePath = chapterFilePath(1);
    const fileContents = new Map([[filePath, `{ cn: "你提著一只皮箱" }`]]);
    const patch = [
      { key: "1:prologue:b0", chapter: 1, sceneId: "prologue", kind: "block", index: 0, field: "cn", oldValue: "你提著一只皮箱", newValue: "我提著一只皮箱" },
    ];
    const { fileResults } = planPatch(patch, fileContents);
    expect(fileResults[0].file).toBe(filePath);
    expect(fileResults[0].content).toBe(`{ cn: "我提著一只皮箱" }`);
    expect(fileResults[0].changed).toBe(true);
  });

  it("同一檔案混合命中與拒絕時，changed 仍為 true（只要有至少一條 applied）", () => {
    const filePath = chapterFilePath(2);
    const fileContents = new Map([[filePath, `{ a: "1", b: "重複重複" }`]]);
    const patch = [
      { key: "k1", chapter: 2, sceneId: "s", kind: "block", index: 0, field: "a", oldValue: "1", newValue: "2" },
      { key: "k2", chapter: 2, sceneId: "s", kind: "block", index: 1, field: "b", oldValue: "重複", newValue: "x" }, // 出現兩次，not-unique
    ];
    const { fileResults } = planPatch(patch, fileContents);
    expect(fileResults[0].changed).toBe(true);
    expect(fileResults[0].content).toBe(`{ a: "2", b: "重複重複" }`);
    expect(fileResults[0].results.map((r) => r.status)).toEqual(["applied", "not-unique"]);
  });
});
