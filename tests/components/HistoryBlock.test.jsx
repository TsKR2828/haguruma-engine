// @vitest-environment jsdom
import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { HistoryBlock } from "../../src/components/HagurumaEngine";

afterEach(cleanup);

describe("HistoryBlock", () => {
  it("renders legacy (no origin) narration exactly as before — plain content, no added styling", () => {
    const block = { type: "narration", content: "冬日。你提著一只皮箱。" };
    const { container } = render(<HistoryBlock block={block} />);
    const el = container.querySelector(".scene-block-narration");
    expect(el.textContent).toBe("冬日。你提著一只皮箱。");
    expect(el.className).not.toContain("block-added");
    expect(el.querySelector(".scene-block-jp")).toBeNull();
  });

  it("renders origin:added narration with block-added class and plain content", () => {
    const block = { type: "narration", origin: "added", content: "橋接敘述。" };
    const { container } = render(<HistoryBlock block={block} />);
    const el = container.querySelector(".scene-block-narration");
    expect(el.className).toContain("block-added");
    expect(el.textContent).toBe("橋接敘述。");
  });

  it("renders origin:source narration as jp line over cn line, no speaker", () => {
    const block = { type: "narration", origin: "source", jp: "冬の日である。", cn: "冬日。" };
    const { container } = render(<HistoryBlock block={block} />);
    const jp = container.querySelector(".scene-block-jp");
    const cn = container.querySelector(".scene-block-cn");
    expect(jp.textContent).toBe("冬の日である。");
    expect(cn.textContent).toBe("冬日。");
    expect(container.querySelector(".scene-block-speaker")).toBeNull();
    expect(container.querySelector(".scene-block-narration").className).not.toContain("block-added");
  });

  it("renders origin:source inner the same dual way, tagged as inner not narration", () => {
    const block = { type: "inner", origin: "source", jp: "幽霊の話を思い出した。", cn: "想起了幽靈的故事。" };
    const { container } = render(<HistoryBlock block={block} />);
    expect(container.querySelector(".scene-block-inner .scene-block-jp").textContent).toBe("幽霊の話を思い出した。");
    expect(container.querySelector(".scene-block-inner .scene-block-cn").textContent).toBe("想起了幽靈的故事。");
  });

  it("dialogue with speaker renders speaker + jp + cn rows", () => {
    const block = { type: "dialogue", speaker: "理髮店主人", jp: "「妙なこと」", cn: "「奇怪的事」" };
    const { container } = render(<HistoryBlock block={block} />);
    expect(container.querySelector(".scene-block-speaker").textContent).toBe("理髮店主人");
    expect(container.querySelector(".scene-block-jp").textContent).toBe("「妙なこと」");
    expect(container.querySelector(".scene-block-cn").textContent).toBe("「奇怪的事」");
  });

  it("Bug 3 fix: dialogue with empty jp renders only cn, styled as cn (not jp)", () => {
    const block = { type: "dialogue", speaker: "你", jp: "", cn: '"All right."' };
    const { container } = render(<HistoryBlock block={block} />);
    expect(container.querySelector(".scene-block-jp")).toBeNull();
    const cn = container.querySelector(".scene-block-cn");
    expect(cn.textContent).toBe('"All right."');
  });

  it("dialogue origin:added gets block-added class applied to the wrapper", () => {
    const block = { type: "dialogue", origin: "added", speaker: "你", jp: "", cn: "添補的台詞。" };
    const { container } = render(<HistoryBlock block={block} />);
    expect(container.querySelector(".scene-block-dialogue").className).toContain("block-added");
  });

  it("system block renders plain content, unaffected by origin logic", () => {
    const block = { type: "system", content: "第一章　レエン・コオト" };
    const { container } = render(<HistoryBlock block={block} />);
    expect(container.querySelector(".scene-block-system").textContent).toBe("第一章　レエン・コオト");
  });

  // Batch F6: 文中互動歷史區完成態。docs/batch-f6-inline-actions.md §2.3。
  it("action block renders ✓ prompt with action-block--done styling", () => {
    const block = { type: "action", origin: "added", prompt: "站起來。" };
    const { container } = render(<HistoryBlock block={block} />);
    expect(container.querySelector(".action-block--done")).toBeTruthy();
    expect(container.querySelector(".action-prompt-done").textContent).toBe("✓ 站起來。");
    expect(container.querySelector(".action-response")).toBeNull();
    expect(container.querySelector(".scene-block-action").className).toContain("block-added");
  });

  it("action block with a response renders it indented below the prompt", () => {
    const block = { type: "action", origin: "added", prompt: "追進浴室，開門搜索。", response: "什麼都沒有。" };
    const { container } = render(<HistoryBlock block={block} />);
    expect(container.querySelector(".action-prompt-done").textContent).toBe("✓ 追進浴室，開門搜索。");
    expect(container.querySelector(".action-response").textContent).toBe("什麼都沒有。");
  });

  it("forced block renders every step as ✓ step with forced-step--done styling", () => {
    const block = { type: "forced", origin: "added", steps: ["按下門鈴的按鈕。", "再按。", "再按一次。"] };
    const { container } = render(<HistoryBlock block={block} />);
    const steps = container.querySelectorAll(".forced-step--done");
    expect(steps).toHaveLength(3);
    expect(steps[0].textContent).toBe("✓ 按下門鈴的按鈕。");
    expect(steps[2].textContent).toBe("✓ 再按一次。");
    expect(container.querySelector(".scene-block-forced").className).toContain("block-added");
  });
});
