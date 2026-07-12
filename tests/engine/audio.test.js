// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";

function makeFakeAudioContext() {
  return {
    state: "running",
    currentTime: 0,
    destination: {},
    resume: vi.fn(),
    createGain: vi.fn(() => ({
      gain: { setValueAtTime: vi.fn(), linearRampToValueAtTime: vi.fn(), value: 0 },
      connect: vi.fn(),
    })),
    createBufferSource: vi.fn(() => ({
      buffer: null,
      loop: false,
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
    })),
    decodeAudioData: vi.fn(async (buf) => buf), // pass the tagged "buffer" through
  };
}

function deferred() {
  let resolve;
  const promise = new Promise((r) => {
    resolve = r;
  });
  return { promise, resolve };
}

describe("engine/audio playAmbient race guard (Bug 10)", () => {
  let fakeCtx;

  beforeEach(() => {
    vi.resetModules();
    fakeCtx = makeFakeAudioContext();
    // Must be a real constructible function (not vi.fn(arrowFn)) — `new`
    // on a mock wrapping an arrow function throws in this environment.
    window.AudioContext = function FakeAudioContext() {
      return fakeCtx;
    };
  });

  it("discards a stale playAmbient() result when an older call resolves after a newer one", async () => {
    const { playAmbient } = await import("../../src/engine/audio.js");

    const firstFetch = deferred();
    const secondFetch = deferred();
    let call = 0;
    global.fetch = vi.fn(() => {
      call++;
      return call === 1 ? firstFetch.promise : secondFetch.promise;
    });

    // Older call started first, but its fetch is slow.
    const p1 = playAmbient("a.mp3");
    // Newer call started second, its fetch resolves first.
    const p2 = playAmbient("b.mp3");

    secondFetch.resolve({ arrayBuffer: async () => ({ _tag: "b.mp3" }) });
    await p2;

    // The newer call already created and started its buffer source.
    expect(fakeCtx.createBufferSource).toHaveBeenCalledTimes(1);

    // Now the stale, older call finally resolves.
    firstFetch.resolve({ arrayBuffer: async () => ({ _tag: "a.mp3" }) });
    await p1;

    // Bug 10 fix: the stale call must be discarded — it should NOT create a
    // second buffer source (which would silently replace the newer ambient
    // track with the older, out-of-date one).
    expect(fakeCtx.createBufferSource).toHaveBeenCalledTimes(1);
    const startedSource = fakeCtx.createBufferSource.mock.results[0].value;
    expect(startedSource.buffer._tag).toBe("b.mp3");
    expect(startedSource.start).toHaveBeenCalledTimes(1);
  });

  it("plays normally when calls are not overlapping", async () => {
    const { playAmbient } = await import("../../src/engine/audio.js");
    global.fetch = vi.fn(async () => ({ arrayBuffer: async () => ({ _tag: "x.mp3" }) }));

    await playAmbient("x.mp3");

    expect(fakeCtx.createBufferSource).toHaveBeenCalledTimes(1);
    const source = fakeCtx.createBufferSource.mock.results[0].value;
    expect(source.start).toHaveBeenCalledTimes(1);
  });
});
