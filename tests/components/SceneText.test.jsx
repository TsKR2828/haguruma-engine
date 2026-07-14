// @vitest-environment jsdom
import { describe, it, expect, afterEach, beforeEach } from "vitest";
import { render, cleanup, waitFor, fireEvent } from "@testing-library/react";
import SceneText from "../../src/components/SceneText";

beforeEach(() => {
  // jsdom doesn't implement scrollIntoView.
  Element.prototype.scrollIntoView = () => {};
});

afterEach(cleanup);

describe("SceneText", () => {
  it("Bug 3 fix: dialogue with empty jp shows only cn (not merged into jp style) while typing", async () => {
    const blocks = [{ type: "dialogue", speaker: "你", jp: "", cn: '"All right."' }];
    const { container } = render(<SceneText blocks={blocks} nerve={10} />);
    await waitFor(() => {
      const cn = container.querySelector(".scene-block-cn");
      expect(cn?.textContent).toBe('"All right."');
    });
    expect(container.querySelector(".scene-block-jp")).toBeNull();
  });

  it("origin:source narration renders jp-over-cn once typed, no typing-cursor class", async () => {
    const blocks = [
      { type: "narration", origin: "source", jp: "冬の日である。", cn: "冬日。" },
    ];
    const { container } = render(<SceneText blocks={blocks} nerve={10} />);
    await waitFor(() => {
      expect(container.querySelector(".scene-block-cn")?.textContent).toBe("冬日。");
    });
    expect(container.querySelector(".scene-block-jp").textContent).toBe("冬の日である。");
    expect(container.querySelector(".scene-block-narration").className).not.toContain("typing-cursor");
  });

  it("legacy (no origin) narration renders single-line content, unchanged behavior", async () => {
    const blocks = [{ type: "narration", content: "冬日。你提著一只皮箱。" }];
    const { container } = render(<SceneText blocks={blocks} nerve={10} />);
    await waitFor(() => {
      const el = container.querySelector(".scene-block-narration");
      expect(el.textContent).toBe("冬日。你提著一只皮箱。");
    });
    const el = container.querySelector(".scene-block-narration");
    expect(el.querySelector(".scene-block-jp")).toBeNull();
    expect(el.className).not.toContain("block-added");
  });

  it("origin:added narration gets the block-added class", async () => {
    const blocks = [{ type: "narration", origin: "added", content: "橋接敘述。" }];
    const { container } = render(<SceneText blocks={blocks} nerve={10} />);
    await waitFor(() => {
      expect(container.querySelector(".scene-block-narration")?.textContent).toBe("橋接敘述。");
    });
    expect(container.querySelector(".scene-block-narration").className).toContain("block-added");
  });

  it("origin:source inner is tagged .scene-block-inner with dual jp/cn rows", async () => {
    const blocks = [
      { type: "inner", origin: "source", jp: "幽霊の話を思い出した。", cn: "想起了幽靈的故事。" },
    ];
    const { container } = render(<SceneText blocks={blocks} nerve={10} />);
    await waitFor(() => {
      expect(container.querySelector(".scene-block-inner .scene-block-cn")?.textContent).toBe(
        "想起了幽靈的故事。"
      );
    });
    expect(container.querySelector(".scene-block-inner .scene-block-jp").textContent).toBe(
      "幽霊の話を思い出した。"
    );
  });

  it("dialogue with empty jp moved into the past-blocks list stays consistent (Bug 3 holds after advancing)", async () => {
    const blocks = [
      { type: "dialogue", speaker: "你", jp: "", cn: '"All right."' },
      { type: "narration", content: "接下來。" },
    ];
    const { container } = render(<SceneText blocks={blocks} nerve={10} />);
    await waitFor(() => {
      expect(container.querySelector(".scene-block-cn")?.textContent).toBe('"All right."');
    });
    // Dialogue pauses for a click once fully typed; advance past it.
    fireEvent.click(container.firstChild);
    await waitFor(() => {
      expect(container.querySelector(".scene-block-narration")?.textContent).toBe("接下來。");
    });
    const historical = container.querySelector(".scene-block-dialogue");
    expect(historical.querySelector(".scene-block-jp")).toBeNull();
    expect(historical.querySelector(".scene-block-cn").textContent).toBe('"All right."');
  });
});

// Batch F6: 文中互動（action / forced）。規格：docs/batch-f6-inline-actions.md §2.1 §5。
describe("SceneText — action/forced inline interactions (Batch F6)", () => {
  it("pauses at an action block: subsequent block does not render until clicked", async () => {
    const blocks = [
      { type: "action", origin: "added", prompt: "站起來。" },
      { type: "narration", content: "接下來的敘述。" },
    ];
    const { container } = render(<SceneText blocks={blocks} nerve={10} />);
    await waitFor(() => {
      expect(container.querySelector(".action-btn")?.textContent).toBe("站起來。");
    });
    // Give any stray timers a chance to fire — must NOT have auto-advanced.
    await new Promise((r) => setTimeout(r, 100));
    expect(container.querySelector(".scene-block-narration")).toBeNull();
  });

  it("clicking the scene area (not the button) does not bypass the action block", async () => {
    const blocks = [
      { type: "action", origin: "added", prompt: "站起來。" },
      { type: "narration", content: "接下來的敘述。" },
    ];
    const { container } = render(<SceneText blocks={blocks} nerve={10} />);
    await waitFor(() => expect(container.querySelector(".action-btn")).toBeTruthy());
    fireEvent.click(container.firstChild);
    expect(container.querySelector(".scene-block-narration")).toBeNull();
    expect(container.querySelector(".action-btn")).toBeTruthy();
  });

  it("clicking the action button advances to the next block", async () => {
    const blocks = [
      { type: "action", origin: "added", prompt: "站起來。" },
      { type: "narration", content: "接下來的敘述。" },
    ];
    const { container } = render(<SceneText blocks={blocks} nerve={10} />);
    const btn = await waitFor(() => {
      const el = container.querySelector(".action-btn");
      if (!el) throw new Error("not yet");
      return el;
    });
    fireEvent.click(btn);
    await waitFor(() => {
      expect(container.querySelector(".scene-block-narration")).toBeTruthy();
    });
    // The completed action block renders read-only ✓ prompt in the past area.
    expect(container.querySelector(".action-prompt-done")?.textContent).toBe("✓ 站起來。");
  });

  it("action onAction fires onFlag and onBlockEffects then advances", async () => {
    const flags = [];
    const effectsCalls = [];
    const blocks = [
      {
        type: "action",
        origin: "added",
        prompt: "站起來。",
        flag: "ch01.stood_up",
        effects: { nerve: { amount: -1, reason: "test" } },
      },
      { type: "narration", content: "接下來。" },
    ];
    const { container } = render(
      <SceneText
        blocks={blocks}
        nerve={10}
        onFlag={(f) => flags.push(f)}
        onBlockEffects={(fx) => effectsCalls.push(fx)}
      />,
    );
    const btn = await waitFor(() => {
      const el = container.querySelector(".action-btn");
      if (!el) throw new Error("not yet");
      return el;
    });
    fireEvent.click(btn);
    await waitFor(() => expect(container.querySelector(".scene-block-narration")).toBeTruthy());
    expect(flags).toEqual(["ch01.stood_up"]);
    expect(effectsCalls).toHaveLength(1);
    expect(effectsCalls[0]).toEqual({ nerve: { amount: -1, reason: "test" } });
  });

  it("forced steps must be clicked through in order; onComplete advances past it", async () => {
    const blocks = [
      { type: "forced", origin: "added", steps: ["一", "二"] },
      { type: "narration", content: "之後。" },
    ];
    const { container } = render(<SceneText blocks={blocks} nerve={10} />);
    await waitFor(() => expect(container.querySelectorAll(".forced-btn")).toHaveLength(1));

    fireEvent.click(container.querySelector(".forced-btn"));
    await waitFor(() => expect(container.querySelectorAll(".forced-step--done")).toHaveLength(1));
    expect(container.querySelector(".scene-block-narration")).toBeNull();

    fireEvent.click(container.querySelector(".forced-btn"));
    await waitFor(
      () => {
        expect(container.querySelector(".scene-block-narration")).toBeTruthy();
      },
      { timeout: 2000 },
    );
  });

  it("origin:added action/forced blocks get the block-added class", async () => {
    const blocks = [{ type: "action", origin: "added", prompt: "站起來。" }];
    const { container } = render(<SceneText blocks={blocks} nerve={10} />);
    await waitFor(() => expect(container.querySelector(".scene-block-action")).toBeTruthy());
    expect(container.querySelector(".scene-block-action").className).toContain("block-added");
  });
});
