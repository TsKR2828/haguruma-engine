// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import ImpactToast from "../../src/components/ImpactToast";

afterEach(cleanup);

describe("ImpactToast (Bug 4: multi-effect stacking)", () => {
  it("renders nothing when impacts is empty", () => {
    const { container } = render(<ImpactToast impacts={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders nothing when impacts is not provided", () => {
    const { container } = render(<ImpactToast />);
    expect(container.firstChild).toBeNull();
  });

  it("renders multiple simultaneous toasts stacked (not overwriting each other)", () => {
    const impacts = [
      { id: 1, type: "loss", label: "神經", amount: 2, reason: "test A" },
      { id: 2, type: "gain", label: "洞察", amount: 1, reason: "test B" },
      { id: 3, type: "gain", label: "執筆", amount: 1, reason: "test C" },
    ];
    render(<ImpactToast impacts={impacts} duration={100000} />);

    expect(screen.getByText("神經")).toBeTruthy();
    expect(screen.getByText("洞察")).toBeTruthy();
    expect(screen.getByText("執筆")).toBeTruthy();
  });

  it("dismisses each toast independently after its own timer elapses", async () => {
    const onDismiss = vi.fn();
    const impacts = [
      { id: 1, type: "loss", label: "神經", amount: 1, reason: "a" },
      { id: 2, type: "gain", label: "洞察", amount: 1, reason: "b" },
    ];
    render(<ImpactToast impacts={impacts} duration={20} onDismiss={onDismiss} />);

    await waitFor(() => expect(onDismiss).toHaveBeenCalledWith(1), { timeout: 2000 });
    await waitFor(() => expect(onDismiss).toHaveBeenCalledWith(2), { timeout: 2000 });
    expect(onDismiss).toHaveBeenCalledTimes(2);
  });
});
