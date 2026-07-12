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
});
