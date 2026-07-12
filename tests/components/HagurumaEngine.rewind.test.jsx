// @vitest-environment jsdom
//
// 選項回溯（Lane R）端對端測試。規格：docs/batch-f5-ux.md §Lane R。
// 涵蓋：header 「⟲ 回溯」面板列出本章選擇點、confirm 後恢復快照 state
// （深拷貝隔離——effects 造成的數值改動在回溯後正確復原）、confirm 取消
// 不改動任何東西、已選過的選項顯示 ✓ 標記。

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, cleanup, waitFor, fireEvent, within } from "@testing-library/react";
import HagurumaEngine from "../../src/components/HagurumaEngine";

beforeEach(() => {
  Element.prototype.scrollIntoView = () => {};
  window.HTMLElement.prototype.scrollIntoView = () => {};
  localStorage.clear();
  sessionStorage.clear();
});

afterEach(() => {
  cleanup();
  localStorage.clear();
  sessionStorage.clear();
  vi.restoreAllMocks();
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
      text: [{ type: "narration", origin: "added", content: "十字路口。" }],
      choices: [
        {
          text: "選項A",
          next: "s2",
          flag: "chose_a",
          effects: { insight: { amount: 5, reason: "測試分歧" } },
        },
        { text: "選項B", next: "s3", flag: "chose_b" },
      ],
      next: null,
      effects: null,
      flags: ["chose_a", "chose_b"],
      notebook: null,
      links: { fold: "── 分歧 ──" },
    },
    s2: {
      id: "s2",
      text: [{ type: "narration", origin: "added", content: "走了A路。" }],
      choices: null,
      next: null,
      effects: null,
      flags: [],
      notebook: null,
      links: { showEnd: true },
    },
    s3: {
      id: "s3",
      text: [{ type: "narration", origin: "added", content: "走了B路。" }],
      choices: null,
      next: null,
      effects: null,
      flags: [],
      notebook: null,
      links: { showEnd: true },
    },
  },
};

function renderEngine() {
  return render(
    <HagurumaEngine chapter={CHAPTER} carryOver={null} initialState={null} hasNextChapter={false} />,
  );
}

function insightValue(container) {
  const stat = Array.from(container.querySelectorAll(".game-stat")).find((el) =>
    el.textContent.startsWith("洞察"),
  );
  return stat?.querySelector(".game-stat-val")?.textContent;
}

describe("HagurumaEngine — 選項回溯", () => {
  it("尚未做出任何選擇時，回溯面板顯示「本章尚無可回溯的選擇點」", async () => {
    renderEngine();
    await waitFor(() => expect(screen.getByText("選項A")).toBeTruthy(), { timeout: 3000 });

    fireEvent.click(screen.getByText("⟲ 回溯"));
    expect(screen.getByText("本章尚無可回溯的選擇點")).toBeTruthy();
  });

  it("回溯面板列出該選擇點＋所選文字（場景段落標籤取自 links.fold）", async () => {
    const { container } = renderEngine();
    await waitFor(() => expect(screen.getByText("選項A")).toBeTruthy(), { timeout: 3000 });

    fireEvent.click(screen.getByText("選項A"));
    await waitFor(() => expect(screen.getByText("走了A路。")).toBeTruthy(), { timeout: 3000 });
    expect(insightValue(container)).toBe("5");

    fireEvent.click(screen.getByText("⟲ 回溯"));
    // 這裡刻意用 .rewind-panel 範圍查詢——「── 分歧 ──」同時也是 s1 被
    // 歸檔進 scrollback 後 HistorySection 自己渲染的 fold-divider 文字，
    // 全頁查詢會撞到兩個相同文字節點。
    const panel = within(container.querySelector(".rewind-panel"));
    expect(panel.getByText("選項A")).toBeTruthy(); // 面板裡的所選文字
    expect(panel.getByText("── 分歧 ──")).toBeTruthy(); // 場景段落標籤（links.fold）
  });

  it("點擊 checkpoint → confirm 後恢復快照 state（深拷貝隔離：effects 造成的數值改動正確復原）", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);
    const { container } = renderEngine();
    await waitFor(() => expect(screen.getByText("選項A")).toBeTruthy(), { timeout: 3000 });

    fireEvent.click(screen.getByText("選項A"));
    await waitFor(() => expect(screen.getByText("走了A路。")).toBeTruthy(), { timeout: 3000 });
    expect(insightValue(container)).toBe("5");

    fireEvent.click(screen.getByText("⟲ 回溯"));
    const panel = within(container.querySelector(".rewind-panel"));
    fireEvent.click(panel.getByText("── 分歧 ──").closest(".rewind-entry"));

    expect(window.confirm).toHaveBeenCalledWith(
      "回到這個選擇點？之後的進度（手帖/數值/連結）將回復",
    );

    // 回到 s1，選項重新出現，且 insight 已回復到快照當時（選擇前）的 0——
    // 證明恢復的是深拷貝的快照 state，不是被 effects 動過的當前 state。
    await waitFor(() => expect(screen.getByText("選項A")).toBeTruthy(), { timeout: 3000 });
    expect(screen.getByText("選項B")).toBeTruthy();
    expect(insightValue(container)).toBe("0");

    // 已見標記跨回溯持久：選項A 尾端仍有 ✓，選項B 沒有。
    const btnA = screen.getByText("選項A").closest("button");
    const btnB = screen.getByText("選項B").closest("button");
    expect(btnA.querySelector(".choice-seen-mark")).toBeTruthy();
    expect(btnB.querySelector(".choice-seen-mark")).toBeNull();
  });

  it("confirm 取消時不恢復、不截斷，畫面維持原狀", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(false);
    const { container } = renderEngine();
    await waitFor(() => expect(screen.getByText("選項A")).toBeTruthy(), { timeout: 3000 });

    fireEvent.click(screen.getByText("選項A"));
    await waitFor(() => expect(screen.getByText("走了A路。")).toBeTruthy(), { timeout: 3000 });
    expect(insightValue(container)).toBe("5");

    fireEvent.click(screen.getByText("⟲ 回溯"));
    const panel = within(container.querySelector(".rewind-panel"));
    fireEvent.click(panel.getByText("── 分歧 ──").closest(".rewind-entry"));

    expect(window.confirm).toHaveBeenCalled();
    // 仍停留在 s2（沒有跳回 s1），insight 沒被復原。
    expect(screen.getByText("走了A路。")).toBeTruthy();
    expect(insightValue(container)).toBe("5");
  });
});
