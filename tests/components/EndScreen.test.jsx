// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import EndScreen from "../../src/components/EndScreen";

afterEach(cleanup);

const baseProps = {
  state: { nerve: 7, insight: 3, writing: 2, notebook: [{ key: "k1" }], connections: [{ id: "c1" }] },
  chapter: { chapter: 1, title: "レエン・コオト", titleCn: "雨衣" },
  hasNextChapter: false,
  onAdvance: vi.fn(),
  onClose: vi.fn(),
};

describe("EndScreen", () => {
  it("renders chapter title and stats", () => {
    const { container } = render(<EndScreen {...baseProps} />);
    expect(container.querySelector(".end-title").textContent).toContain("章");
    expect(container.querySelector(".end-subtitle").textContent).toContain("レエン・コオト");
    expect(screen.getByText("7 / 10")).toBeTruthy();
    expect(screen.getByText("3")).toBeTruthy();
  });

  it("shows advance button when hasNextChapter is true", () => {
    render(<EndScreen {...baseProps} hasNextChapter={true} />);
    expect(screen.getByText(/次の章へ/)).toBeTruthy();
  });

  it("hides advance button when hasNextChapter is false", () => {
    render(<EndScreen {...baseProps} hasNextChapter={false} />);
    expect(screen.queryByText(/次の章へ/)).toBeNull();
  });

  it("calls onAdvance when advance button is clicked", () => {
    const onAdvance = vi.fn();
    render(<EndScreen {...baseProps} hasNextChapter={true} onAdvance={onAdvance} />);
    fireEvent.click(screen.getByText(/次の章へ/));
    expect(onAdvance).toHaveBeenCalledOnce();
  });

  it("calls onClose when close button is clicked", () => {
    const onClose = vi.fn();
    render(<EndScreen {...baseProps} onClose={onClose} />);
    fireEvent.click(screen.getByLabelText("關閉"));
    expect(onClose).toHaveBeenCalledOnce();
  });
});
