// @vitest-environment jsdom
import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import RightSidebar from "../../src/components/RightSidebar";

afterEach(cleanup);

const baseState = {
  notebook: [],
  connections: [],
  journey: { current: null, visited: [] },
};

const chapter = { chapter: 1, title: "レエン・コオト", titleCn: "雨衣", locations: [] };

describe("RightSidebar", () => {
  it("renders the added-content legend", () => {
    const { container } = render(<RightSidebar state={baseState} chapter={chapter} />);
    const legend = container.querySelector(".block-added-legend");
    expect(legend).not.toBeNull();
    expect(legend.textContent).toBe("補＝非原文的添補內容");
  });
});
