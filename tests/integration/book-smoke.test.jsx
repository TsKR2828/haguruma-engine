// @vitest-environment jsdom
// ═══════════════════════════════════════════════════════════
// 換書證明（book-smoke）— 施工圖 §4 S4
//
// 用 tests/fixtures/book-smoke（雙軸 courage/memory、motif:"none"、
// 獨立 saveKey/UI 標籤的迷你假書）驗證：換一本書只需換 data，
// src/engine 與 src/components 一行都不用改。
// ═══════════════════════════════════════════════════════════
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { createInitialState } from "../../src/engine/state.js";
import { applyEffectsFor } from "../../src/engine/effects.js";
import { corruptTextFor } from "../../src/engine/corrupt.js";
import { validateChapter, simulate } from "../../scripts/validate-chapters.js";
import NerveBar from "../../src/components/NerveBar.jsx";
import StatRadar from "../../src/components/StatRadar.jsx";
import LeftSidebar from "../../src/components/LeftSidebar.jsx";
import { BOOK_SMOKE, CHAPTER_REGISTRY } from "../fixtures/book-smoke/index.js";

afterEach(cleanup);

const CHAPTER_1 = CHAPTER_REGISTRY.getChapter(1);
const CHAPTER_2 = CHAPTER_REGISTRY.getChapter(2);

describe("book-smoke — createInitialState 生成 courage/memory 欄位", () => {
  it("state 的 stat 欄位來自 book.stats（不是 nerve/insight/writing）", () => {
    const state = createInitialState(BOOK_SMOKE);
    expect(state.courage).toBe(3);
    expect(state.memory).toBe(0);
    expect(state).not.toHaveProperty("nerve");
    expect(state).not.toHaveProperty("insight");
    expect(state).not.toHaveProperty("writing");
  });
});

describe("book-smoke — applyEffectsFor 夾制 courage 上限 5", () => {
  it("courage 加到超過 max 時被夾在 5", () => {
    const state = createInitialState(BOOK_SMOKE);
    const next = applyEffectsFor(BOOK_SMOKE, state, { courage: { amount: 10 } });
    expect(next.courage).toBe(5);
  });

  it("courage 減到低於 min 時被夾在 0", () => {
    const state = createInitialState(BOOK_SMOKE);
    const next = applyEffectsFor(BOOK_SMOKE, state, { courage: { amount: -99 } });
    expect(next.courage).toBe(0);
  });

  it("memory（kind:gain, max:null）不受上限夾制", () => {
    const state = createInitialState(BOOK_SMOKE);
    const next = applyEffectsFor(BOOK_SMOKE, state, { memory: { amount: 100 } });
    expect(next.memory).toBe(100);
  });
});

describe("book-smoke — corrupt 用 courage 閾值（textCorruptAt:3, max:5）", () => {
  // 較長文字降低「剛好所有字元 hash 都未命中」的機率為近乎零（腐蝕本身仍是
  // 純函式、非隨機——同輸入永遠同輸出，見 tests/engine/corrupt.test.js
  // 既有的 determinism 測試）。
  const text = "これはテスト文章です。もう少し長くしてみます。";
  const statMax = BOOK_SMOKE.stats.find((s) => s.key === BOOK_SMOKE.corruption.stat).max;

  it("courage 在閾值以上（ratio > threshold/max＝0.6）時文字不崩壞", () => {
    // courage=5 → ratio=1 > halfRatio(3/5=0.6) → 不崩壞
    const out = corruptTextFor(text, 5, BOOK_SMOKE.corruption.textCorruptAt, statMax);
    expect(out).toBe(text);
  });

  it("courage 剛好等於閾值（ratio===halfRatio）時 intensity=0，文字仍不崩壞", () => {
    // courage=3 → ratio=0.6，等於 halfRatio(0.6) → intensity=(0.6-0.6)/0.6=0 → 不崩壞。
    // 這個邊界值由煙霧書自己的 textCorruptAt(3)/max(5) 算出，跟 haguruma 的
    // 5/10 是兩組完全不同的數字，證明真的讀 book.corruption 而非寫死 0.5。
    const out = corruptTextFor(text, 3, BOOK_SMOKE.corruption.textCorruptAt, statMax);
    expect(out).toBe(text);
  });

  it("courage 低於閾值時文字崩壞（產生額外 combining 字元）", () => {
    // courage=0 → ratio=0 < halfRatio(0.6) → 崩壞
    const out = corruptTextFor(text, 0, BOOK_SMOKE.corruption.textCorruptAt, statMax);
    expect(out).not.toBe(text);
    expect(out.length).toBeGreaterThan(text.length);
  });
});

describe("book-smoke — validator 以煙霧書跑通（0 error）", () => {
  it("CH1／CH2 皆零 error（validateChapter 讀 book.validator/book.symbols）", () => {
    const priorNotebookKeys = new Set();
    const report1 = validateChapter(CHAPTER_1, "book-smoke-ch1", priorNotebookKeys, BOOK_SMOKE);
    expect(report1.errors).toEqual([]);
    for (const scene of Object.values(CHAPTER_1.scenes)) {
      if (scene.notebook?.key) priorNotebookKeys.add(scene.notebook.key);
      if (Array.isArray(scene.choices)) {
        for (const c of scene.choices) if (c.notebook?.key) priorNotebookKeys.add(c.notebook.key);
      }
    }
    const report2 = validateChapter(CHAPTER_2, "book-smoke-ch2", priorNotebookKeys, BOOK_SMOKE);
    expect(report2.errors).toEqual([]);
  });

  it("CH1 場景數/選擇點/ending 符合 fixture 設計（1 choice, 1 connection, 1 origin:added block）", () => {
    const report1 = validateChapter(CHAPTER_1, "book-smoke-ch1", new Set(), BOOK_SMOKE);
    expect(report1.sceneCount).toBe(3);
    expect(report1.choicePoints).toBe(1);
    expect(report1.endings).toEqual(["s3"]);
    expect(CHAPTER_1.connections).toHaveLength(1);
    const addedBlocks = Object.values(CHAPTER_1.scenes)
      .flatMap((s) => s.text)
      .filter((b) => b.origin === "added");
    expect(addedBlocks.length).toBeGreaterThanOrEqual(1);
  });

  it("simulate() 用煙霧書的 stat 欄位跑完整局（courage 被夾制在 [0,5]）", () => {
    const result = simulate(CHAPTER_1, "first", undefined, BOOK_SMOKE);
    expect(result.success).toBe(true);
    expect(result.reachedEnding).toBe(true);
    // choice.effects: courage -5 from initial 3 → clamped to 0
    expect(result.state.courage).toBe(0);
    expect(result.state.memory).toBe(2);
  });

  it("22 次 playthrough（first/second/20 random）全數抵達 ending，與 haguruma 章節同一套跑法", () => {
    const priorNotebookKeys = new Set();
    const report1 = validateChapter(CHAPTER_1, "book-smoke-ch1", priorNotebookKeys, BOOK_SMOKE);
    const report2 = validateChapter(CHAPTER_2, "book-smoke-ch2", priorNotebookKeys, BOOK_SMOKE);
    for (const r of [report1, report2]) {
      expect(r.playthroughs).toHaveLength(22);
      expect(r.playthroughs.every((p) => p.success)).toBe(true);
    }
  });
});

describe("book-smoke — UI 標籤來自煙霧書 config（元件 smoke render）", () => {
  it("NerveBar 顯示 book.stats 的 drain 軸 label／max（不是「神經」／10）", () => {
    render(<NerveBar value={3} book={BOOK_SMOKE} />);
    expect(screen.getByText("勇氣")).toBeTruthy();
    expect(screen.getByText("3 / 5")).toBeTruthy();
    expect(screen.queryByText("神經")).toBeNull();
  });

  it("StatRadar 軸數＝book.stats.length（2 軸，不是 haguruma 的 3 軸）", () => {
    const stats = BOOK_SMOKE.stats.map((s) => ({
      key: s.key,
      label: s.label,
      value: s.key === "courage" ? 3 : 0,
      max: s.max,
      kind: s.kind,
    }));
    const { container } = render(<StatRadar stats={stats} />);
    expect(container.querySelectorAll("svg > line")).toHaveLength(2);
    expect(screen.getByText("勇氣")).toBeTruthy();
    expect(screen.getByText("記憶")).toBeTruthy();
  });

  it("LeftSidebar 章節警語讀 book.ui.chapterListWarning（煙霧書專用字串，不是原著警語）", () => {
    const { container } = render(
      <LeftSidebar
        state={{ currentChapter: 1 }}
        chapter={CHAPTER_1}
        roster={[]}
        activeId={null}
        book={BOOK_SMOKE}
      />,
    );
    // 兩行文字被 <br/> 分隔成同一個 .ch-warning 內的相鄰 text node，
    // 用 textContent 一次比對整段，避開 getByText 對單一 text node 的限制。
    const warningText = container.querySelector(".ch-warning").textContent;
    expect(warningText).toContain("煙霧書沒有預言能力。");
    expect(warningText).toContain("這裡只是測試字串。");
    expect(warningText).not.toContain("此人生之書能預知命運");
  });
});
