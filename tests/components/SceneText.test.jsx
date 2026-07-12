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
