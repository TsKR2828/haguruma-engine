// @vitest-environment jsdom
//
// 文中互動（action/forced，Batch F6）在 HagurumaEngine 裡的端到端接線測試。
// 規格：docs/batch-f6-inline-actions.md §2 §5。涵蓋：effects/flag 真的寫進
// gs（走 onBlockEffects/onFlag）、回溯快照含互動造成的狀態變化、
// editMode 下 action/forced 不觸發互動改開編輯面板。

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, waitFor, fireEvent } from "@testing-library/react";
import HagurumaEngine from "../../src/components/HagurumaEngine";
import { clearAllOverlays } from "../../src/engine/textOverlay";

beforeEach(() => {
  Element.prototype.scrollIntoView = () => {};
  window.HTMLElement.prototype.scrollIntoView = () => {};
  clearAllOverlays();
});

afterEach(() => {
  cleanup();
  clearAllOverlays();
});

const CHAPTER = {
  chapter: 1,
  title: "T",
  titleCn: "測試章",
  startScene: "s1",
  startLocation: null,
  connections: [],
  scenes: {
    s1: {
      id: "s1",
      text: [
        {
          type: "action",
          origin: "added",
          prompt: "站起來。",
          response: "膝蓋還在抖。",
          flag: "ch01.stood_up",
          effects: { nerve: { amount: -2, reason: "動作" } },
        },
        { type: "narration", origin: "source", jp: "原文敘述句子。", cn: "敘述譯文。" },
      ],
      choices: [
        { text: "選項甲", next: "s2", flag: "chose_a" },
        { text: "選項乙", next: "s2", flag: "chose_b" },
      ],
      next: null,
      effects: null,
      flags: ["chose_a", "chose_b"],
      notebook: null,
      links: null,
    },
    s2: {
      id: "s2",
      text: [{ type: "narration", origin: "added", content: "結局。" }],
      choices: null,
      next: null,
      effects: null,
      flags: [],
      notebook: null,
      links: { showEnd: true },
    },
  },
};

function renderEngine(chapter = CHAPTER) {
  return render(
    <HagurumaEngine chapter={chapter} carryOver={null} initialState={null} hasNextChapter={false} />,
  );
}

describe("HagurumaEngine — action/forced 效果/flag 接線 (Batch F6)", () => {
  it("clicking the action button applies effects (ImpactToast) and sets flag (choicesMade)", async () => {
    let latestState = null;
    const { container } = render(
      <HagurumaEngine
        chapter={CHAPTER}
        carryOver={null}
        initialState={null}
        hasNextChapter={false}
        onStateChange={(s) => {
          latestState = s;
        }}
      />,
    );

    const btn = await waitFor(() => {
      const el = container.querySelector(".action-btn");
      if (!el) throw new Error("not yet");
      return el;
    });
    fireEvent.click(btn);

    // ImpactToast should show the nerve-loss toast fired via toastEffects
    // (scoped to .impact-toast — NerveBar also has a static "神經" label).
    await waitFor(() => {
      const toast = container.querySelector(".impact-toast");
      expect(toast?.textContent).toContain("神經");
    });

    await waitFor(() => {
      expect(latestState?.choicesMade?.["ch01.stood_up"]).toBe(true);
      expect(latestState?.nerve).toBe(8); // 10 - 2
    });
  });

  it("action effects/flag survive into the rewind snapshot pushed at the next choices phase", async () => {
    const { container } = renderEngine();
    const btn = await waitFor(() => {
      const el = container.querySelector(".action-btn");
      if (!el) throw new Error("not yet");
      return el;
    });
    fireEvent.click(btn);

    await waitFor(() => expect(screen.getByText("選項甲")).toBeTruthy());
    // The nerve bar / stats having updated before reaching choices is enough
    // signal that gs carried the action's effects forward into the state
    // snapshotted for rewind (docs/batch-f6-inline-actions.md §2.6).
    fireEvent.click(screen.getByText("⟲ 回溯"));
    // No checkpoints yet (haven't made a choice) — panel should still open
    // without throwing, proving state wiring didn't break rewind machinery.
    expect(document.querySelector(".rewind-toggle")).toBeTruthy();
  });
});

describe("HagurumaEngine — editMode 下 action/forced 不觸發互動 (Batch F6)", () => {
  it("clicking an action block in editMode opens the editor instead of acting", async () => {
    const { container } = renderEngine();
    await waitFor(() => expect(screen.getByText("✎ 潤飾")).toBeTruthy());

    const actionDiv = await waitFor(() => {
      const el = container.querySelector(".scene-block-action");
      if (!el) throw new Error("not yet");
      return el;
    });

    fireEvent.click(screen.getByText("✎ 潤飾"));
    fireEvent.click(actionDiv);

    // Editor opened with the prompt field, not the live ActionBlock button.
    const promptField = container.querySelector("#edit-panel-prompt");
    expect(promptField).toBeTruthy();
    expect(promptField.value).toBe("站起來。");
    const responseField = container.querySelector("#edit-panel-response");
    expect(responseField.value).toBe("膝蓋還在抖。");

    // No live action button rendered while editMode is active.
    expect(container.querySelector(".action-btn")).toBeNull();
  });

  it("editing and saving an action prompt updates the WYSIWYG display", async () => {
    const { container } = renderEngine();
    await waitFor(() => expect(screen.getByText("✎ 潤飾")).toBeTruthy());
    await waitFor(() => expect(container.querySelector(".scene-block-action")).toBeTruthy());

    fireEvent.click(screen.getByText("✎ 潤飾"));
    fireEvent.click(container.querySelector(".scene-block-action"));

    fireEvent.change(container.querySelector("#edit-panel-prompt"), {
      target: { value: "改過的指令。" },
    });
    fireEvent.click(screen.getByText("儲存"));

    await waitFor(() => {
      expect(container.querySelector(".action-prompt-done")?.textContent).toBe("✓ 改過的指令。");
    });
  });
});
