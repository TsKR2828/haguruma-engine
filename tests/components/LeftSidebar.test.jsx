// @vitest-environment jsdom
import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import LeftSidebar from "../../src/components/LeftSidebar";

afterEach(cleanup);

const state = {
  currentChapter: 1,
  notebook: [],
  connections: [],
  journey: { current: null, visited: [] },
};

const chapter = {
  chapter: 1,
  title: "レエン・コオト",
  titleCn: "雨衣",
  portraits: {
    t_kun: "portraits/ch1/t_kun.png",
    niece: "portraits/ch1/niece.png",
  },
};

describe("LeftSidebar — 肖像名冊渲染", () => {
  it("roster 內僅 activeId 那張全亮，其餘 .dim", () => {
    const { container } = render(
      <LeftSidebar state={state} chapter={chapter} roster={["t_kun", "niece"]} activeId="niece" />,
    );
    const imgs = container.querySelectorAll(".left-portrait");
    expect(imgs).toHaveLength(2);
    expect(imgs[0].className).toContain("dim");
    expect(imgs[1].className).not.toContain("dim");
  });

  it("activeId=null 時 roster 內全部 .dim", () => {
    const { container } = render(
      <LeftSidebar state={state} chapter={chapter} roster={["t_kun"]} activeId={null} />,
    );
    const img = container.querySelector(".left-portrait");
    expect(img.className).toContain("dim");
  });

  it("roster 為空時不渲染任何立繪", () => {
    const { container } = render(
      <LeftSidebar state={state} chapter={chapter} roster={[]} activeId={null} />,
    );
    expect(container.querySelector(".left-portrait")).toBeNull();
  });
});
