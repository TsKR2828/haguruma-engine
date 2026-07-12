// @vitest-environment jsdom
//
// 編輯器潤飾模式（DEV only）測試。規格：docs/batch-f5-ux.md §Lane E-6。
// 涵蓋：套用點正確性（overlay 套到 blocks/choices）、UI 互動（點擊開面板、
// choice 點擊不觸發選擇、source jp 紅字警告）、DEV gate（模擬 prod 時零渲染）。

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, waitFor, fireEvent } from "@testing-library/react";
import HagurumaEngine from "../../src/components/HagurumaEngine";
import {
  blockKey,
  choiceKey,
  getOverlay,
  clearAllOverlays,
} from "../../src/engine/textOverlay";

beforeEach(() => {
  Element.prototype.scrollIntoView = () => {};
  window.HTMLElement.prototype.scrollIntoView = () => {};
  clearAllOverlays();
});

afterEach(() => {
  cleanup();
  clearAllOverlays();
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
      // 注意：不放 dialogue block——dialogue 型別打完字後需要點擊才會前進
      // （SceneText 的既有行為），會卡住自動前進到 choices，干擾這裡的測試。
      text: [
        { type: "system", content: "標題" },
        { type: "narration", origin: "source", jp: "原文敘述句子。", cn: "敘述譯文。" },
      ],
      choices: [
        { text: "選項甲", next: "s2", flag: "chose_a" },
        { text: "選項乙", next: "s2", flag: "chose_b" },
      ],
      next: null,
      effects: null,
      flags: ["chose_a", "chose_b"],
      notebook: null,
      links: null,
    },
    s2: {
      id: "s2",
      text: [{ type: "narration", origin: "added", content: "結局。" }],
      choices: null,
      next: null,
      effects: null,
      flags: [],
      notebook: null,
      links: { showEnd: true },
    },
  },
};

const DYNAMIC_CHAPTER = {
  chapter: 1,
  title: "T",
  titleCn: "測試章",
  startScene: "dyn",
  startLocation: null,
  connections: [],
  scenes: {
    dyn: {
      id: "dyn",
      text: () => [{ type: "narration", origin: "source", jp: "動態場景的原文。", cn: "動態場景譯文。" }],
      choices: null,
      next: null,
      effects: null,
      flags: [],
      notebook: null,
      links: { showEnd: true },
    },
  },
};

/** waitFor 對 querySelector 的包裝：querySelector 回傳 null 不會讓 waitFor 重試
 *  （回傳 null 不算「拋錯」），這裡明確在找不到時 throw 讓它繼續輪詢。 */
async function waitForSelector(container, selector) {
  return waitFor(() => {
    const el = container.querySelector(selector);
    if (!el) throw new Error(`not found yet: ${selector}`);
    return el;
  });
}

function renderEngine(chapter = CHAPTER) {
  return render(
    <HagurumaEngine chapter={chapter} carryOver={null} initialState={null} hasNextChapter={false} />,
  );
}

describe("HagurumaEngine — 編輯器潤飾模式 UI", () => {
  it("DEV 下 header 顯示「✎ 潤飾」toggle", async () => {
    renderEngine();
    await waitFor(() => expect(screen.getByText("✎ 潤飾")).toBeTruthy());
  });

  it("開啟潤飾模式後面板常駐顯示「匯出 patch (N)」與「清除全部修改」", async () => {
    renderEngine();
    await waitFor(() => expect(screen.getByText("✎ 潤飾")).toBeTruthy());
    fireEvent.click(screen.getByText("✎ 潤飾"));
    expect(screen.getByText(/匯出 patch \(0\)/)).toBeTruthy();
    expect(screen.getByText("清除全部修改")).toBeTruthy();
  });

  it("點擊 narration block 開編輯面板，儲存後套用 overlay 並立即反映在畫面（WYSIWYG）", async () => {
    const { container } = renderEngine();
    await waitFor(() => expect(screen.getByText("✎ 潤飾")).toBeTruthy());
    fireEvent.click(screen.getByText("✎ 潤飾"));

    // 等打字動畫完整跑完（narrationCn 一出現就點會抓到還在打字的半截文字）。
    await waitFor(() => {
      const el = container.querySelector(".scene-block-narration .scene-block-cn");
      if (!el || el.textContent !== "敘述譯文。") throw new Error("still typing");
    });
    const narrationCn = container.querySelector(".scene-block-narration .scene-block-cn");
    fireEvent.click(narrationCn.closest(".scene-block"));

    const cnTextarea = container.querySelector("#edit-panel-cn");
    expect(cnTextarea).toBeTruthy();
    fireEvent.change(cnTextarea, { target: { value: "改過的敘述譯文。" } });
    fireEvent.click(screen.getByText("儲存"));

    await waitFor(() => {
      const cn = container.querySelector(".scene-block-narration .scene-block-cn");
      expect(cn.textContent).toBe("改過的敘述譯文。");
    });

    const overlay = getOverlay(blockKey(1, "s1", 1));
    expect(overlay.cn).toBe("改過的敘述譯文。");
    expect(overlay.orig).toEqual({ jp: "原文敘述句子。", cn: "敘述譯文。" });
  });

  it("origin:source block 編輯 jp 時顯示紅字警告", async () => {
    const { container } = renderEngine();
    await waitFor(() => expect(screen.getByText("✎ 潤飾")).toBeTruthy());
    fireEvent.click(screen.getByText("✎ 潤飾"));

    const narrationCn = await waitForSelector(container, ".scene-block-narration .scene-block-cn");
    fireEvent.click(narrationCn.closest(".scene-block"));

    expect(screen.getByText(/原文區塊：改動 jp 將無法通過 fidelity 驗證/)).toBeTruthy();
  });

  it("editMode 下點擊 choice 按鈕不觸發選擇（不進下一場景），改開編輯面板", async () => {
    const { container } = renderEngine();
    await waitFor(() => expect(screen.getByText("✎ 潤飾")).toBeTruthy());

    // 先讓場景走到 choices phase
    await waitFor(() => expect(screen.getByText("選項甲")).toBeTruthy(), { timeout: 3000 });

    fireEvent.click(screen.getByText("✎ 潤飾"));
    fireEvent.click(screen.getByRole("button", { name: "選項甲" }));

    // 沒有跳轉（仍是 s1 的 choices，選項甲/乙都還在畫面上，用 button role 避免
    // 和編輯面板 textarea 裡同樣文字內容的匹配衝突）。
    expect(screen.getByRole("button", { name: "選項甲" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "選項乙" })).toBeTruthy();

    // 面板開啟，text 欄位是 "選項甲"
    const textarea = container.querySelector("#edit-panel-single");
    expect(textarea.value).toBe("選項甲");

    fireEvent.change(textarea, { target: { value: "改過的選項甲" } });
    fireEvent.click(screen.getByText("儲存"));

    await waitFor(() => expect(screen.getByRole("button", { name: "改過的選項甲" })).toBeTruthy());

    const overlay = getOverlay(choiceKey(1, "s1", 0));
    expect(overlay.text).toBe("改過的選項甲");
  });

  it("還原此塊移除 overlay，畫面回復原文字", async () => {
    const { container } = renderEngine();
    await waitFor(() => expect(screen.getByText("✎ 潤飾")).toBeTruthy());
    fireEvent.click(screen.getByText("✎ 潤飾"));

    const narrationCn = await waitForSelector(container, ".scene-block-narration .scene-block-cn");
    fireEvent.click(narrationCn.closest(".scene-block"));
    fireEvent.change(container.querySelector("#edit-panel-cn"), { target: { value: "改過的敘述譯文。" } });
    fireEvent.click(screen.getByText("儲存"));

    await waitFor(() => expect(getOverlay(blockKey(1, "s1", 1))).not.toBeNull());

    fireEvent.click(container.querySelector(".scene-block-narration").closest(".scene-block"));
    fireEvent.click(screen.getByText("還原此塊"));

    await waitFor(() => {
      const cn = container.querySelector(".scene-block-narration .scene-block-cn");
      expect(cn.textContent).toBe("敘述譯文。");
    });
    expect(getOverlay(blockKey(1, "s1", 1))).toBeNull();
  });

  it("動態場景（text 為函式）的 block 不可點擊編輯（無 edit-hoverable class）", async () => {
    const { container } = renderEngine(DYNAMIC_CHAPTER);
    await waitFor(() => expect(screen.getByText("✎ 潤飾")).toBeTruthy());
    fireEvent.click(screen.getByText("✎ 潤飾"));

    const narrationBlock = await waitForSelector(container, ".scene-block-narration");
    expect(narrationBlock.className).toContain("edit-locked");
    expect(narrationBlock.className).not.toContain("edit-hoverable");
    expect(narrationBlock.getAttribute("title")).toBe("動態場景請直接改檔");
  });
});

describe("HagurumaEngine — DEV gate（模擬 production 零渲染）", () => {
  let originalDev;

  beforeEach(() => {
    originalDev = import.meta.env.DEV;
    import.meta.env.DEV = false;
  });

  afterEach(() => {
    import.meta.env.DEV = originalDev;
  });

  it("import.meta.env.DEV=false 時不渲染「✎ 潤飾」toggle 與 EditPanel", async () => {
    renderEngine();
    await waitFor(() => expect(screen.getByText("測試章")).toBeTruthy());
    expect(screen.queryByText("✎ 潤飾")).toBeNull();
    expect(screen.queryByText(/匯出 patch/)).toBeNull();
    expect(screen.queryByText("清除全部修改")).toBeNull();
  });
});
