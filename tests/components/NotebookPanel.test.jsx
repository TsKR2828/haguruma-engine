// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import NotebookPanel from "../../src/components/NotebookPanel";

afterEach(cleanup);

const baseState = {
  nerve: 8,
  insight: 4,
  writing: 2,
  notebook: [],
  connections: [],
};

const chapter = { chapter: 1, title: "レエン・コオト", titleCn: "雨衣" };

describe("NotebookPanel", () => {
  it("shows empty message when notebook is empty", () => {
    render(<NotebookPanel state={baseState} chapter={chapter} onClose={() => {}} />);
    expect(screen.getByText("尚無記錄")).toBeTruthy();
  });

  it("renders notebook entries", () => {
    const state = {
      ...baseState,
      notebook: [
        { key: "raincoat_station", desc: "停車場の雨衣" },
        { key: "raincoat_train", desc: "省線の雨衣" },
      ],
    };
    render(<NotebookPanel state={state} chapter={chapter} onClose={() => {}} />);
    expect(screen.getByText("停車場の雨衣")).toBeTruthy();
    expect(screen.getByText("省線の雨衣")).toBeTruthy();
  });

  it("renders connections section when connections exist", () => {
    const state = {
      ...baseState,
      connections: [{ id: "raincoat_double", title: "兩件雨衣", icon: "◈", subtitle: "重複" }],
    };
    render(<NotebookPanel state={state} chapter={chapter} onClose={() => {}} />);
    expect(screen.getByText("連結")).toBeTruthy();
    expect(screen.getByText(/兩件雨衣/)).toBeTruthy();
    expect(screen.getByText("◈")).toBeTruthy();
  });

  it("hides connections section when empty", () => {
    render(<NotebookPanel state={baseState} chapter={chapter} onClose={() => {}} />);
    expect(screen.queryByText("連結")).toBeNull();
  });

  it("calls onClose when close button is clicked", () => {
    const onClose = vi.fn();
    render(<NotebookPanel state={baseState} chapter={chapter} onClose={onClose} />);
    fireEvent.click(screen.getByText("✕"));
    expect(onClose).toHaveBeenCalledOnce();
  });
});
