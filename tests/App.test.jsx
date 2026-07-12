// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

vi.mock("../src/data/chapterRegistry", () => {
  const CH1 = {
    chapter: 1,
    title: "T1",
    titleCn: "t1",
    startScene: "s1",
    startLocation: null,
    connections: [],
    scenes: {
      s1: {
        id: "s1",
        text: [{ type: "system", content: "x" }],
        choices: null,
        next: null,
        effects: null,
        flags: [],
        notebook: null,
        links: { showEnd: true },
      },
    },
  };
  const CH2 = {
    chapter: 2,
    title: "T2",
    titleCn: "t2",
    startScene: "s2a",
    startLocation: null,
    connections: [],
    scenes: {
      s2a: {
        id: "s2a",
        text: [{ type: "system", content: "y" }],
        choices: null,
        next: null,
        effects: null,
        flags: [],
        notebook: null,
        links: { showEnd: true },
      },
    },
  };
  return {
    getChapter: (num) => (num === 1 ? CH1 : num === 2 ? CH2 : null),
  };
});

import App from "../src/App";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  // jsdom doesn't implement scrollIntoView (used by SceneText).
  Element.prototype.scrollIntoView = () => {};
});

function seedSave(overrides = {}) {
  const data = {
    v: 3,
    scene: "s1",
    nextScene: "s1",
    nerve: 10,
    insight: 0,
    writing: 0,
    currentChapter: 1,
    savedAt: Date.now(),
    ...overrides,
  };
  localStorage.setItem("haguruma_save", JSON.stringify(data));
}

describe("App title screen — Bug 7 (new game button)", () => {
  it("shows only 開始遊玩 when there is no save", () => {
    render(<App />);
    expect(screen.getByText("開始遊玩")).toBeTruthy();
    expect(screen.queryByText("新的開始")).toBeNull();
    expect(screen.queryByText("繼續遊玩")).toBeNull();
  });

  it("shows 繼續遊玩 + 新的開始 when a save exists", () => {
    seedSave();
    render(<App />);
    expect(screen.getByText("繼續遊玩")).toBeTruthy();
    expect(screen.getByText("新的開始")).toBeTruthy();
  });

  it("新的開始 clears the save after confirmation", () => {
    seedSave();
    vi.spyOn(window, "confirm").mockReturnValue(true);
    render(<App />);

    fireEvent.click(screen.getByText("新的開始"));

    expect(window.confirm).toHaveBeenCalled();
    expect(localStorage.getItem("haguruma_save")).toBeNull();
  });

  it("新的開始 does nothing if the user cancels the confirmation", () => {
    seedSave();
    vi.spyOn(window, "confirm").mockReturnValue(false);
    render(<App />);

    fireEvent.click(screen.getByText("新的開始"));

    expect(window.confirm).toHaveBeenCalled();
    expect(localStorage.getItem("haguruma_save")).not.toBeNull();
    // Still on the title screen with the resume label, not reset to fresh start.
    expect(screen.getByText("繼續遊玩")).toBeTruthy();
  });
});

describe("App — Bug 6 (advance chapter saves the new chapter immediately)", () => {
  it("writes the next chapter's start scene to the save the moment advanceChapter runs", async () => {
    render(<App />);
    fireEvent.click(screen.getByText("開始遊玩"));

    const advanceBtn = await screen.findByText(/次の章へ/, {}, { timeout: 3000 });
    fireEvent.click(advanceBtn);

    const saved = JSON.parse(localStorage.getItem("haguruma_save"));
    expect(saved.currentChapter).toBe(2);
    expect(saved.scene).toBe("s2a");
    expect(saved.nextScene).toBe("s2a");
  });
});

describe("App title screen — Bug 2 (legacy prototype link)", () => {
  it("renders the link (in dev) with an href built from BASE_URL", () => {
    render(<App />);
    const link = screen.queryByText(/遊玩 Legacy Prototype/);
    if (import.meta.env.DEV) {
      expect(link).toBeTruthy();
      expect(link.getAttribute("href")).toBe(`${import.meta.env.BASE_URL}prototype.html`);
    } else {
      expect(link).toBeNull();
    }
  });

  it("source no longer hardcodes an absolute /prototype.html path", async () => {
    // BASE_URL resolves to "/" under vitest regardless of vite.config's
    // configured base, which would make an href-only assertion pass even
    // for the old hardcoded-path bug — so also guard the source directly
    // against the regression (production build uses base:"/haguruma-engine/",
    // where a hardcoded "/prototype.html" would 404).
    const source = await readFile(resolve(process.cwd(), "src/App.jsx"), "utf-8");
    expect(source).not.toMatch(/href="\/prototype\.html"/);
    expect(source).toMatch(/BASE_URL/);
  });
});
