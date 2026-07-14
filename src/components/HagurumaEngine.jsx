import { useState, useRef, useCallback, useEffect, useMemo, memo } from "react";
import { BOOK } from "../bookLoader";
import { createChapterStateFor } from "../engine/state";
import { applyEffectsFor } from "../engine/effects";
import { resolveText, resolveChoices, getSceneById } from "../engine/scenes";
import { resolveConnections, applyConnection } from "../engine/connections";
import { upsertNotebook } from "../engine/notebook";
import { createSaveModule } from "../engine/save";
import { getMotif } from "./motifs";
import Particles from "./Particles";
import NerveBar from "./NerveBar";
import ImpactToast from "./ImpactToast";
import SceneText from "./SceneText";
import ChoiceList from "./ChoiceList";
import NotebookPanel from "./NotebookPanel";
import EndScreen from "./EndScreen";
import TextBlockBody from "./TextBlockBody";
import EditPanel from "./EditPanel";
import RewindPanel from "./RewindPanel";
import { blockRawText, addedClass, isDualBlock } from "../utils/textBlock";
import {
  blockKey,
  choiceKey,
  getOverlay,
  setOverlay,
  removeOverlay,
  clearAllOverlays,
  countOverlays,
  exportPatch,
  overlayBlock,
  applyOverlayToBlocks,
  overlayChoice,
} from "../engine/textOverlay";
import {
  loadRewindStack,
  saveRewindStack,
  pushSnapshot,
  markTopChosen,
  truncateToCheckpoint,
  cloneState,
  choiceSeenKey,
  isChoiceSeen,
  markChoiceSeen,
} from "../engine/rewind";

// 編輯器潤飾模式（DEV only）：見 docs/batch-f5-ux.md §Lane E。
// HistoryBlock/HistorySection 額外接受 editMode/locked/onEdit props——
// 未傳入時（既有呼叫點/既有測試）行為與原本完全相同。

export const HistoryBlock = memo(function HistoryBlock({ block, editMode = false, locked = false, onEdit }) {
  const display = blockRawText(block);
  const added = addedClass(block);
  const editable =
    import.meta.env.DEV &&
    editMode &&
    (block.type === "dialogue" ||
      block.type === "inner" ||
      block.type === "narration" ||
      block.type === "action" ||
      block.type === "forced");
  const editCls = editable ? (locked ? " edit-locked" : " edit-hoverable") : "";
  const editExtraProps = editable
    ? locked
      ? { title: "動態場景請直接改檔" }
      : { onClick: () => onEdit?.(block) }
    : {};
  const lockBadge = editable && locked ? (
    <span className="edit-lock-badge" aria-hidden="true">🔒</span>
  ) : null;
  return (
    <div className={`scene-block scene-block-${block.type} scene-block-read${added}${editCls}`} {...editExtraProps}>
      {lockBadge}
      <TextBlockBody block={block} display={display} />
    </div>
  );
});

const HistorySection = memo(function HistorySection({
  section,
  isCollapsed,
  onToggle,
  chapter,
  editMode = false,
  onEditBlock,
  editTick, // 未直接使用；純粹讓 overlay 修改後 memo() 知道要重算顯示文字
}) {
  return (
    <div className="scene-section">
      {section.fold && (
        <div className="fold-divider fold-clickable" onClick={onToggle}>
          <span className="fold-arrow">{isCollapsed ? "▸" : "▾"}</span>
          {section.fold}
        </div>
      )}
      {!isCollapsed && (
        <div className="scene-past">
          {section.entries.flatMap((entry, ei) => {
            const locked = import.meta.env.DEV
              ? typeof getSceneById(chapter, entry.sceneId)?.text === "function"
              : false;
            return entry.blocks
              .map((b, bi) => ({ block: b, index: bi }))
              .filter(({ block }) => block.type !== "break" && block.type !== "pause")
              .map(({ block, index }) => {
                const displayBlock = import.meta.env.DEV
                  ? overlayBlock(block, chapter.chapter, entry.sceneId, index, locked)
                  : block;
                return (
                  <HistoryBlock
                    key={`${ei}-${index}`}
                    block={displayBlock}
                    editMode={editMode}
                    locked={locked}
                    onEdit={() => onEditBlock?.(entry.sceneId, index, displayBlock, locked)}
                  />
                );
              });
          })}
        </div>
      )}
    </div>
  );
});

export default function HagurumaEngine({ chapter, carryOver, initialState, onChapterEnd, hasNextChapter, onAdvance, onStateChange, onActiveBlockChange, book = BOOK }) {
  const [gs, setGs] = useState(() => initialState ?? createChapterStateFor(book, chapter, carryOver));
  const saveModule = useMemo(() => createSaveModule(book), [book]);
  const { Defs: MotifDefs } = useMemo(() => getMotif(book.motif), [book.motif]);
  const drainStat = useMemo(() => book.stats.find((s) => s.kind === "drain") ?? book.stats[0], [book.stats]);
  const otherStats = useMemo(() => book.stats.filter((s) => s !== drainStat), [book.stats, drainStat]);
  const [scene, setScene] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [phase, setPhase] = useState("loading");
  const [impacts, setImpacts] = useState([]);
  const [showNb, setShowNb] = useState(false);
  const [history, setHistory] = useState([]);
  const [collapsed, setCollapsed] = useState({});
  const [endDismissed, setEndDismissed] = useState(false);

  // 編輯器潤飾模式（DEV only）狀態。見 docs/batch-f5-ux.md §Lane E。
  const [editMode, setEditMode] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [editTick, setEditTick] = useState(0);

  // 選項回溯（Lane R）狀態。見 docs/batch-f5-ux.md §Lane R。
  const [rewindStack, setRewindStack] = useState(() => loadRewindStack(chapter.chapter));
  const [showRewind, setShowRewind] = useState(false);

  const gsRef = useRef(gs);
  gsRef.current = gs;
  const sceneRef = useRef(null);
  const blocksRef = useRef(blocks);
  blocksRef.current = blocks;
  const historyRef = useRef(history);
  historyRef.current = history;
  const impactSeq = useRef(0);

  useEffect(() => {
    onStateChange?.(gs);
  }, [gs, onStateChange]);

  const toast = useCallback((type, label, amount, reason) => {
    impactSeq.current++;
    const id = impactSeq.current;
    setImpacts((cur) => [...cur, { id, type, label, amount, reason }]);
  }, []);

  const dismissImpact = useCallback((id) => {
    setImpacts((cur) => cur.filter((i) => i.id !== id));
  }, []);

  const save = useCallback((state, nextScene = null) => {
    const ok = saveModule.saveGame(state, nextScene);
    if (!ok) toast("loss", "存檔", 0, "儲存失敗，僅保留於記憶體");
  }, [toast, saveModule]);

  const toastEffects = useCallback(
    (fx) => {
      if (!fx) return;
      // Bug 4 fix: these must all fire independently (not if/else if) so a
      // compound effect (e.g. nerve loss + insight gain in one scene) shows
      // every stat change instead of only the first one.
      for (const stat of book.stats) {
        const e = fx[stat.key];
        if (!e) continue;
        if (stat.kind === "drain") toast("loss", stat.label, Math.abs(e.amount), e.reason);
        else toast("gain", stat.label, e.amount, e.reason);
      }
    },
    [toast, book],
  );

  const checkConns = useCallback(
    (st) => {
      let next = st;
      const conns = chapter.connections ?? [];
      const formed = resolveConnections(next, conns);
      for (const conn of formed) {
        next = applyConnection(next, conn);
        toast("gain", book.ui.connectionLabel, conn.insightGain ?? 0, conn.title);
      }
      return next;
    },
    [toast, chapter, book],
  );

  const loadScene = useCallback(
    (sceneId) => {
      const sc = getSceneById(chapter, sceneId);
      if (!sc) return;

      if (sceneRef.current && blocksRef.current.length > 0) {
        const prevBlocks = blocksRef.current;
        const prevFold = sceneRef.current.links?.fold || null;
        const prevId = gsRef.current.currentSceneId;
        setHistory((h) => [
          ...h,
          { sceneId: prevId, blocks: prevBlocks, fold: prevFold },
        ]);
      }

      let next = { ...gsRef.current, currentSceneId: sceneId };

      if (sc.links?.visit) {
        const v = sc.links.visit;
        next = {
          ...next,
          journey: {
            ...next.journey,
            current: v,
            visited: next.journey.visited.includes(v)
              ? next.journey.visited
              : [...next.journey.visited, v],
          },
        };
      }
      if (sc.links?.unlock) {
        next = {
          ...next,
          journey: {
            ...next.journey,
            symbols: { ...next.journey.symbols, [sc.links.unlock]: true },
          },
        };
      }

      setGs(next);
      gsRef.current = next;
      sceneRef.current = sc;
      setScene(sc);
      setBlocks(resolveText(sc, next));
      setPhase("text");
    },
    [chapter],
  );

  const onTextComplete = useCallback(() => {
    const sc = sceneRef.current;
    if (!sc) return;

    let next = { ...gsRef.current };

    if (sc.notebook) {
      next = { ...next, notebook: upsertNotebook(next.notebook, sc.notebook) };
    }

    if (sc.effects) {
      next = applyEffectsFor(book, next, sc.effects);
      toastEffects(sc.effects);
    }

    if (typeof sc.effectFn === "function") {
      const dyn = sc.effectFn(next);
      if (dyn) {
        next = applyEffectsFor(book, next, dyn);
        toastEffects(dyn);
      }
    }

    next = checkConns(next);

    setGs(next);
    gsRef.current = next;

    const choices = resolveChoices(sc, next);
    if (choices && choices.length > 0) {
      setPhase("choices");
      // Lane R：進入有 choices 的場景時 push 快照（深拷貝 state，chosen:null）。
      // `next` 是目前這輪 effects/connections 都套用完、選擇前的狀態——正是
      // 玩家回溯到此點時應該恢復的樣子。
      setRewindStack((st) => {
        const updated = pushSnapshot(st, sc.id, next, historyRef.current.length);
        saveRewindStack(chapter.chapter, updated);
        return updated;
      });
    } else if (sc.next) {
      setPhase("continue");
      save(next, sc.next);
    } else if (sc.links?.showEnd) {
      setPhase("ending");
      save(next, null);
      if (onChapterEnd) onChapterEnd(next);
    }
  }, [toastEffects, checkConns, onChapterEnd, chapter]);

  const onChoice = useCallback(
    (choice, originalIndex = null) => {
      // Bug 1 (engine defense): a choice with no "next" is a data bug — the
      // only legitimate case is a scene explicitly marked links.showEnd
      // (mirrors the ending path in onTextComplete). Never silently write
      // nextScene:null into the save for anything else, and never advance.
      if (!choice.next && !sceneRef.current?.links?.showEnd) {
        console.error(
          `[haguruma] choice "${choice.text ?? "?"}" in scene "${sceneRef.current?.id}" has no "next" — ignoring selection`,
          choice,
        );
        return;
      }

      // Lane R：記錄「已見」（跨回溯持久）＋把回溯棧棧頂的 chosen 填入
      // 這次選擇。originalIndex 是選項的資料原始索引（由呼叫端算好傳入，
      // 見下方 render 的 withIdx），不是 condition 過濾後的顯示索引。
      const sceneIdForChoice = sceneRef.current?.id;
      if (sceneIdForChoice != null && originalIndex != null) {
        markChoiceSeen(choiceSeenKey(chapter.chapter, sceneIdForChoice, originalIndex));
        setRewindStack((st) => {
          const updated = markTopChosen(st, originalIndex, choice.text);
          saveRewindStack(chapter.chapter, updated);
          return updated;
        });
      }

      let next = { ...gsRef.current };

      if (choice.flag) {
        next = {
          ...next,
          choicesMade: { ...next.choicesMade, [choice.flag]: true },
        };
      }
      if (choice.effects) {
        next = applyEffectsFor(book, next, choice.effects);
        toastEffects(choice.effects);
      }
      if (choice.notebook) {
        next = { ...next, notebook: upsertNotebook(next.notebook, choice.notebook) };
      }
      if (choice.unlock) {
        next = {
          ...next,
          journey: {
            ...next.journey,
            symbols: { ...next.journey.symbols, [choice.unlock]: true },
          },
        };
      }

      next = checkConns(next);

      setGs(next);
      gsRef.current = next;
      save(next, choice.next ?? null);

      if (choice.next) loadScene(choice.next);
    },
    [toastEffects, checkConns, loadScene, chapter],
  );

  const onFlag = useCallback((flag) => {
    const next = {
      ...gsRef.current,
      choicesMade: { ...gsRef.current.choicesMade, [flag]: true },
    };
    setGs(next);
    gsRef.current = next;
  }, []);

  // 文中互動（Batch F6）：action block 點擊時立即套 effects——跟 sc.effects
  // （onTextComplete）走同一套 applyEffects＋toastEffects（ImpactToast 多則
  // 堆疊），只是時機提前到互動當下而非整場文字打完。狀態進 gs，回溯快照
  // （pushSnapshot 在有 choices 的場景才 push，且抓的是當時的 gsRef.current）
  // 自然含在內，無需額外處理。
  const onBlockEffects = useCallback(
    (fx) => {
      if (!fx) return;
      const next = applyEffectsFor(book, gsRef.current, fx);
      setGs(next);
      gsRef.current = next;
      toastEffects(fx);
    },
    [toastEffects],
  );

  const onContinue = useCallback(() => {
    const sc = sceneRef.current;
    if (sc?.next) loadScene(sc.next);
  }, [loadScene]);

  // ─────────── 編輯器潤飾模式（DEV only） ───────────
  // 規格：docs/batch-f5-ux.md §Lane E。整段邏輯只在 import.meta.env.DEV
  // 下才會被觸發（UI 進入點是 header 的 ✎ 潤飾 toggle，本身就 DEV-gated），
  // production build 靠這個 compile-time 常數讓 bundler 把死分支砍掉。

  // 注意：每個 handler 的「真身」都寫成 `import.meta.env.DEV ? realFn : noop`
  // 三元式（而不是函式內部才 early-return）——DEV 在 production build 會被
  // vite 折成常數 false，esbuild 對「靜態恆為 false 的三元分支」做死碼消除，
  // 這樣 realFn 內對 textOverlay store 的呼叫才不會被打包進正式版 bundle。
  // 單純只在函式體內 `if (!import.meta.env.DEV) return` 不夠——函式本身
  // （及它閉包住的 getOverlay/setOverlay 等 import）仍會被視為「有被使用」
  // 而留在 bundle 裡（useCallback 是一般函式呼叫，minifier 無法斷定其純度、
  // 不敢移除賦值），實測驗證見 docs/batch-f5-ux.md §Lane E 驗收記錄。
  const noop = useCallback(() => {}, []);

  const openBlockEditor = useCallback(
    import.meta.env.DEV
      ? (sceneId, index, displayBlock, locked) => {
          if (locked) return;
          const sc = getSceneById(chapter, sceneId);
          const rawArr = Array.isArray(sc?.text) ? sc.text : [];
          const rawBlock = rawArr[index] ?? displayBlock;
          const key = blockKey(chapter.chapter, sceneId, index);
          const existing = getOverlay(key);
          const dual = isDualBlock(rawBlock);
          // action/forced（Batch F6）：不是 dual（jp/cn）也不是單一 content，
          // 各自有專屬欄位形狀。forced.steps 是陣列，textarea 只能編字串，
          // 存取時以換行接合／拆分（見下方 fields 讀取與 handleSaveEdit 寫回）。
          const isAction = rawBlock.type === "action";
          const isForced = rawBlock.type === "forced";
          const origFields = dual
            ? { jp: rawBlock.jp ?? "", cn: rawBlock.cn ?? "" }
            : isAction
              ? { prompt: rawBlock.prompt ?? "", response: rawBlock.response ?? "" }
              : isForced
                ? { steps: (rawBlock.steps ?? []).join("\n") }
                : { content: rawBlock.content ?? "" };
          const orig = existing?.orig ?? origFields;
          const fields = dual
            ? { jp: existing?.jp ?? orig.jp ?? "", cn: existing?.cn ?? orig.cn ?? "" }
            : isAction
              ? {
                  prompt: existing?.prompt ?? orig.prompt ?? "",
                  response: existing?.response ?? orig.response ?? "",
                }
              : isForced
                ? {
                    steps:
                      existing?.steps !== undefined
                        ? (Array.isArray(existing.steps) ? existing.steps.join("\n") : existing.steps)
                        : (orig.steps ?? ""),
                  }
                : { content: existing?.content ?? orig.content ?? "" };
          setEditTarget({
            kind: "block",
            key,
            chapterNum: chapter.chapter,
            sceneId,
            index,
            dual,
            blockType: rawBlock.type,
            origin: rawBlock.origin,
            orig,
            fields,
          });
        }
      : noop,
    [chapter, noop],
  );

  const openChoiceEditor = useCallback(
    import.meta.env.DEV
      ? (sceneId, index) => {
          const sc = getSceneById(chapter, sceneId);
          const rawChoice = Array.isArray(sc?.choices) ? sc.choices[index] : null;
          if (!rawChoice) return;
          const key = choiceKey(chapter.chapter, sceneId, index);
          const existing = getOverlay(key);
          const orig = existing?.orig ?? { text: rawChoice.text ?? "" };
          const fields = { text: existing?.text ?? orig.text ?? "" };
          setEditTarget({
            kind: "choice",
            key,
            chapterNum: chapter.chapter,
            sceneId,
            index,
            dual: false,
            origin: null,
            orig,
            fields,
          });
        }
      : noop,
    [chapter, noop],
  );

  const handleChangeField = useCallback((field, value) => {
    setEditTarget((t) => (t ? { ...t, fields: { ...t.fields, [field]: value } } : t));
  }, []);

  const handleSaveEdit = useCallback(
    import.meta.env.DEV
      ? () => {
          setEditTarget((t) => {
            if (!t) return t;
            const diff = {};
            for (const [k, v] of Object.entries(t.fields)) {
              if (v !== (t.orig?.[k] ?? "")) diff[k] = v;
            }
            // forced.steps（Batch F6）：textarea 存的是換行接合字串，寫回
            // overlay 前拆回陣列——ForcedSteps 元件跟 validator 都預期 steps
            // 是 String[]，不是接合過的單一字串。
            if (t.blockType === "forced" && diff.steps !== undefined) {
              diff.steps = diff.steps
                .split("\n")
                .map((s) => s.trim())
                .filter((s) => s.length > 0);
            }
            if (Object.keys(diff).length === 0) {
              removeOverlay(t.key);
            } else {
              setOverlay(t.key, diff, t.orig);
            }
            return null;
          });
          setEditTick((n) => n + 1);
        }
      : noop,
    [noop],
  );

  const handleRevertEdit = useCallback(
    import.meta.env.DEV
      ? () => {
          setEditTarget((t) => {
            if (t) removeOverlay(t.key);
            return null;
          });
          setEditTick((n) => n + 1);
        }
      : noop,
    [noop],
  );

  const handleCancelEdit = useCallback(() => {
    setEditTarget(null);
  }, []);

  const handleExportPatch = useCallback(
    import.meta.env.DEV
      ? () => {
          if (typeof document === "undefined") return;
          const patch = exportPatch();
          const blob = new Blob([JSON.stringify(patch, null, 2)], { type: "application/json" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `haguruma-patch-${Date.now()}.json`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
      : noop,
    [noop],
  );

  const handleClearAllOverlays = useCallback(
    import.meta.env.DEV
      ? () => {
          if (typeof window !== "undefined" && !window.confirm("清除全部潤飾修改？此動作無法復原。")) return;
          clearAllOverlays();
          setEditTarget(null);
          setEditTick((n) => n + 1);
        }
      : noop,
    [noop],
  );

  // ─────────── 選項回溯（Lane R） ───────────
  // 規格：docs/batch-f5-ux.md §Lane R。不受 DEV gate 限制（不像 Lane E
  // 是開發者專用工具，回溯是給玩家的正式功能）。

  // 面板列出的 checkpoint：只列已經做出選擇的（chosen 非 null）——尚未
  // 選擇的棧頂（目前正卡在的那個選擇畫面）沒有「當時所選的選項文字」可
  // 顯示，也沒有回溯它的意義（玩家已經站在那裡）。新→舊排序。
  const rewindCheckpoints = useMemo(() => {
    const list = [];
    rewindStack.forEach((entry, pos) => {
      if (!entry.chosen) return;
      const sc = getSceneById(chapter, entry.sceneId);
      list.push({
        pos,
        label: sc?.links?.fold || entry.sceneId,
        chosenText: entry.chosen.text,
      });
    });
    return list.reverse();
  }, [rewindStack, chapter]);

  const handleRewindSelect = useCallback(
    (pos) => {
      const entry = rewindStack[pos];
      if (!entry) return;
      if (
        typeof window !== "undefined" &&
        !window.confirm("回到這個選擇點？之後的進度（手帖/數值/連結）將回復")
      ) {
        return;
      }

      const sc = getSceneById(chapter, entry.sceneId);
      if (!sc) return;

      // 截斷棧至該點（含），該點 chosen 重置為 null（玩家即將重新選擇）。
      const truncated = truncateToCheckpoint(rewindStack, pos);
      setRewindStack(truncated);
      saveRewindStack(chapter.chapter, truncated);

      // 恢復該快照 state（再次深拷貝隔離，避免棧內物件被外部渲染路徑意外改動）。
      const restoredGs = cloneState(entry.state);

      setGs(restoredGs);
      gsRef.current = restoredGs;
      sceneRef.current = sc;
      setScene(sc);
      // 把 scrollback 截回快照當時的長度——回溯後不該還看得到「未來」場景的歷史文字。
      setHistory((h) => (entry.historyLen < h.length ? h.slice(0, entry.historyLen) : h));
      setBlocks(resolveText(sc, restoredGs));
      setPhase("text");
      setEndDismissed(false);
      setShowRewind(false);

      // 寫存檔：currentSceneId 與 nextScene 都設為回溯目標場景，確保重新
      // 整理頁面時也能從這裡繼續（而不是回到回溯前的位置）。
      save(restoredGs, entry.sceneId);
    },
    [rewindStack, chapter, save],
  );

  useEffect(() => {
    if (initialState && !initialState.currentSceneId) {
      setPhase("ending");
      if (onChapterEnd) onChapterEnd(gsRef.current);
      return;
    }
    loadScene(initialState ? initialState.currentSceneId : chapter.startScene);
  }, [loadScene]);

  const sections = useMemo(() => {
    const result = [];
    let cur = { fold: null, entries: [] };
    for (const entry of history) {
      if (entry.fold) {
        if (cur.entries.length > 0) result.push(cur);
        cur = { fold: entry.fold, entries: [entry] };
      } else {
        cur.entries.push(entry);
      }
    }
    if (cur.entries.length > 0) result.push(cur);
    return result;
  }, [history]);

  // 動態 text 函式場景停用編輯（block index 不穩定）。
  const dynamicScene = typeof scene?.text === "function";

  // 套用點：resolve 完 scene text blocks 後、渲染前套 overlay（WYSIWYG）。
  // 只在 DEV 下套用；production 直接回傳原始 blocks，overlay 相關呼叫在
  // production 常數折疊後成為死分支，見 §Lane E-2。
  const blocksForRender = useMemo(() => {
    if (!import.meta.env.DEV) return blocks;
    return applyOverlayToBlocks(blocks, chapter.chapter, gs.currentSceneId, dynamicScene);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blocks, chapter, gs.currentSceneId, dynamicScene, editTick]);

  const overlayCount = useMemo(() => {
    if (!import.meta.env.DEV) return 0;
    return countOverlays();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editTick]);

  return (
    <div className="game-container">
      <MotifDefs />
      <Particles nerve={gs[drainStat.key]} corruption={book.corruption} />
      <ImpactToast impacts={impacts} onDismiss={dismissImpact} />

      <header className="game-header">
        <span className="game-chapter-label">{chapter.titleCn}</span>
        <div className="game-stats">
          <div className="game-nerve-wrap">
            <NerveBar value={gs[drainStat.key]} book={book} />
          </div>
          {otherStats.map((s) => (
            <span className="game-stat" key={s.key}>
              {s.label} <span className="game-stat-val">{gs[s.key]}</span>
            </span>
          ))}
          <button
            className="notebook-toggle"
            onClick={() => setShowNb((v) => !v)}
          >
            {book.ui.notebookLabel} ({gs.notebook.length})
          </button>
          <button
            className="rewind-toggle"
            onClick={() => setShowRewind((v) => !v)}
            title="回到本章任一已經過的選擇點重選"
          >
            ⟲ 回溯
          </button>
          {import.meta.env.DEV && (
            <button
              className={`edit-mode-toggle${editMode ? " active" : ""}`}
              onClick={() => {
                setEditMode((v) => !v);
                setEditTarget(null);
              }}
              title="潤飾模式（僅開發環境，正式版不會出現）"
            >
              ✎ 潤飾
            </button>
          )}
        </div>
      </header>

      <main className="game-content">
        {sections.map((sec, si) => (
          <HistorySection
            key={si}
            section={sec}
            isCollapsed={collapsed[si] ?? (si !== sections.length - 1)}
            onToggle={() => setCollapsed((c) => ({ ...c, [si]: !(c[si] ?? (si !== sections.length - 1)) }))}
            chapter={chapter}
            editMode={import.meta.env.DEV && editMode}
            onEditBlock={openBlockEditor}
            editTick={editTick}
          />
        ))}

        {scene?.links?.fold && (
          <div className="fold-divider">{scene.links.fold}</div>
        )}

        {phase !== "loading" && (
          <SceneText
            key={gs.currentSceneId}
            blocks={blocksForRender}
            nerve={gs[drainStat.key]}
            book={book}
            onComplete={onTextComplete}
            onFlag={onFlag}
            onBlockEffects={onBlockEffects}
            onActiveBlockChange={onActiveBlockChange}
            editMode={import.meta.env.DEV && editMode}
            editLocked={dynamicScene}
            onEditBlock={(block, index) => openBlockEditor(gs.currentSceneId, index, block, dynamicScene)}
          />
        )}

        {phase === "choices" && (() => {
          const filtered = resolveChoices(scene, gs);
          if (!filtered) return null;
          const withIdx = filtered.map((c) => ({ c, idx: scene.choices.indexOf(c) }));
          const displayChoices = withIdx.map(({ c, idx }) =>
            import.meta.env.DEV ? overlayChoice(c, chapter.chapter, scene.id, idx) : c,
          );
          const seenFlags = withIdx.map(({ idx }) =>
            isChoiceSeen(choiceSeenKey(chapter.chapter, scene.id, idx)),
          );
          return (
            <ChoiceList
              choices={displayChoices}
              seen={seenFlags}
              onSelect={(choice, i) => onChoice(choice, withIdx[i].idx)}
              editMode={import.meta.env.DEV && editMode}
              onEditChoice={(i) => openChoiceEditor(gs.currentSceneId, withIdx[i].idx)}
            />
          );
        })()}

        {phase === "continue" && (
          <div className="continue-prompt" onClick={onContinue}>
            ▾ {book.ui.continueHint}
          </div>
        )}

        <div className="game-scroll-spacer" />
      </main>

      {showNb && (
        <NotebookPanel state={gs} chapter={chapter} onClose={() => setShowNb(false)} book={book} />
      )}

      {showRewind && (
        <RewindPanel
          checkpoints={rewindCheckpoints}
          onSelect={handleRewindSelect}
          onClose={() => setShowRewind(false)}
        />
      )}

      {phase === "ending" && !endDismissed && (
        <EndScreen
          state={gs}
          chapter={chapter}
          hasNextChapter={hasNextChapter}
          onAdvance={onAdvance}
          onClose={() => setEndDismissed(true)}
          book={book}
        />
      )}
      {phase === "ending" && endDismissed && hasNextChapter && onAdvance && (
        <div className="advance-fallback" onClick={onAdvance}>
          {book.ui.nextChapterLabel} ▸
        </div>
      )}

      {import.meta.env.DEV && editMode && (
        <EditPanel
          target={editTarget}
          overlayCount={overlayCount}
          onChangeField={handleChangeField}
          onSave={handleSaveEdit}
          onRevert={handleRevertEdit}
          onCancel={handleCancelEdit}
          onExport={handleExportPatch}
          onClearAll={handleClearAllOverlays}
        />
      )}
    </div>
  );
}
