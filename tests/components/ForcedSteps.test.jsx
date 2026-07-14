// @vitest-environment jsdom
//
// ForcedSteps 是 Batch F6 前就存在的完成品孤兒元件；這裡驗收「低 nerve 掛
// erosion class / 齒輪 props」這條既有視覺邏輯在接線後仍然正確。
// 規格：docs/batch-f6-inline-actions.md §5「nerve 侵蝕視覺」。

import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import ForcedSteps from "../../src/components/ForcedSteps";

afterEach(cleanup);

describe("ForcedSteps — nerve-driven erosion visuals", () => {
  it("nerve > 4: plain button, no erosion class, no gear overlay", () => {
    const { container } = render(<ForcedSteps steps={["一"]} nerve={10} />);
    const btn = container.querySelector(".forced-btn");
    expect(btn.className).not.toContain("eroded");
    expect(container.querySelector(".gear-overlay")).toBeNull();
  });

  it("nerve === 4: eroded (light), no gear overlay yet (gears start at nerve<=3)", () => {
    const { container } = render(<ForcedSteps steps={["一"]} nerve={4} />);
    const btn = container.querySelector(".forced-btn");
    expect(btn.className).toContain("forced-btn--eroded");
    expect(btn.className).not.toContain("forced-btn--eroded-deep");
    expect(container.querySelector(".gear-overlay")).toBeNull();
  });

  it("nerve === 3: eroded (light) AND gear overlay present", () => {
    const { container } = render(<ForcedSteps steps={["一"]} nerve={3} />);
    const btn = container.querySelector(".forced-btn");
    expect(btn.className).toContain("forced-btn--eroded");
    expect(container.querySelector(".gear-overlay")).toBeTruthy();
  });

  it("nerve <= 2: eroded-deep, gear overlay present", () => {
    const { container } = render(<ForcedSteps steps={["一"]} nerve={2} />);
    const btn = container.querySelector(".forced-btn");
    expect(btn.className).toContain("forced-btn--eroded-deep");
    expect(container.querySelector(".gear-overlay")).toBeTruthy();
  });

  it("nerve <= 1: heaviest gear overlay (count 3, overflow visible)", () => {
    const { container } = render(<ForcedSteps steps={["一"]} nerve={1} />);
    const overlay = container.querySelector(".gear-overlay");
    expect(overlay).toBeTruthy();
    expect(overlay.querySelectorAll(".gear-overlay-svg")).toHaveLength(3);
    expect(overlay.style.overflow).toBe("visible");
  });

  it("clicking through all steps calls onComplete once, after the last step", async () => {
    let completed = 0;
    const { container, findAllByRole } = render(
      <ForcedSteps steps={["一", "二"]} nerve={10} onComplete={() => completed++} />,
    );
    let buttons = await findAllByRole("button");
    expect(buttons).toHaveLength(1);
    buttons[0].click();

    await new Promise((r) => setTimeout(r, 0));
    buttons = container.querySelectorAll("button");
    expect(buttons).toHaveLength(1); // second step now visible
    buttons[0].click();

    await new Promise((r) => setTimeout(r, 350));
    expect(completed).toBe(1);
  });
});
