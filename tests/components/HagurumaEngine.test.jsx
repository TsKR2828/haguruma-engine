// @vitest-environment jsdom
import { describe, it, expect, afterEach, beforeEach } from "vitest";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import HagurumaEngine from "../../src/components/HagurumaEngine";

beforeEach(() => {
  // jsdom doesn't implement scrollIntoView.
  Element.prototype.scrollIntoView = () => {};
});

afterEach(cleanup);

const CHAPTER = {
  chapter: 1,
  title: "T",
  titleCn: "t",
  startScene: "s1",
  startLocation: null,
  connections: [],
  scenes: {
    s1: {
      id: "s1",
      text: [{ type: "system", content: "x" }],
      choices: null,
      next: null,
      effects: {
        nerve: { amount: -2, reason: "神經測試" },
        insight: { amount: 1, reason: "洞察測試" },
        writing: { amount: 1, reason: "執筆測試" },
      },
      flags: [],
      notebook: null,
      links: { showEnd: true },
    },
  },
};

describe("HagurumaEngine — Bug 4: compound effects toast independently", () => {
  it("shows all three stat toasts at once for a scene with combined nerve/insight/writing effects", async () => {
    render(
      <HagurumaEngine
        chapter={CHAPTER}
        carryOver={null}
        initialState={null}
        hasNextChapter={false}
      />,
    );

    await waitFor(() => expect(screen.getByText("神經")).toBeTruthy(), { timeout: 3000 });
    expect(screen.getByText("洞察")).toBeTruthy();
    expect(screen.getByText("執筆")).toBeTruthy();
  });
});
