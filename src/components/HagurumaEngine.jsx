import { useState, useRef, useCallback, useEffect, useMemo, memo } from "react";
import { createChapterState } from "../engine/state";
import { applyEffects } from "../engine/effects";
import { resolveText, resolveChoices, getSceneById } from "../engine/scenes";
import { resolveConnections, applyConnection } from "../engine/connections";
import { saveGame } from "../engine/save";
import Particles from "./Particles";
import NerveBar from "./NerveBar";
import ImpactToast from "./ImpactToast";
import SceneText from "./SceneText";
import ChoiceList from "./ChoiceList";
import NotebookPanel from "./NotebookPanel";
import EndScreen from "./EndScreen";
import GearDefs from "./GearDefs";

const HistoryBlock = memo(function HistoryBlock({ block }) {
  if (block.type === "dialogue") {
    return (
      <div className={`scene-block scene-block-dialogue scene-block-read`}>
        {block.speaker && <div className="scene-block-speaker">{block.speaker}</div>}
        <div className="scene-block-jp">{block.jp}</div>
        {block.cn && <div className="scene-block-cn">{block.cn}</div>}
      </div>
    );
  }
  return (
    <div className={`scene-block scene-block-${block.type} scene-block-read`}>
      {block.content || ""}
    </div>
  );
});

const HistorySection = memo(function HistorySection({ section, isCollapsed, onToggle }) {
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
          {section.entries.flatMap((entry, ei) =>
            entry.blocks
              .filter((b) => b.type !== "break" && b.type !== "pause")
              .map((b, bi) => <HistoryBlock key={`${ei}-${bi}`} block={b} />)
          )}
        </div>
      )}
    </div>
  );
});

export default function HagurumaEngine({ chapter, carryOver, initialState, onChapterEnd, hasNextChapter, onAdvance, onStateChange, onActiveBlockChange }) {
  const [gs, setGs] = useState(() => initialState ?? createChapterState(chapter, carryOver));
  const [scene, setScene] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [phase, setPhase] = useState("loading");
  const [impact, setImpact] = useState(null);
  const [showNb, setShowNb] = useState(false);
  const [history, setHistory] = useState([]);
  const [collapsed, setCollapsed] = useState({});

  const gsRef = useRef(gs);
  gsRef.current = gs;
  const sceneRef = useRef(null);
  const blocksRef = useRef(blocks);
  blocksRef.current = blocks;
  const impactSeq = useRef(0);

  useEffect(() => {
    onStateChange?.(gs);
  }, [gs, onStateChange]);

  const toast = useCallback((type, label, amount, reason) => {
    impactSeq.current++;
    setImpact({ type, label, amount, reason, _k: impactSeq.current });
  }, []);

  const save = useCallback((state, nextScene = null) => {
    const ok = saveGame(state, nextScene);
    if (!ok) toast("loss", "存檔", 0, "儲存失敗，僅保留於記憶體");
  }, [toast]);

  const toastEffects = useCallback(
    (fx) => {
      if (!fx) return;
      if (fx.nerve)
        toast("loss", "神經", Math.abs(fx.nerve.amount), fx.nerve.reason);
      else if (fx.insight)
        toast("gain", "洞察", fx.insight.amount, fx.insight.reason);
      else if (fx.writing)
        toast("gain", "執筆", fx.writing.amount, fx.writing.reason);
    },
    [toast],
  );

  const checkConns = useCallback(
    (st) => {
      let next = st;
      const conns = chapter.connections ?? [];
      const formed = resolveConnections(next, conns);
      for (const conn of formed) {
        next = applyConnection(next, conn);
        toast("gain", "連結", conn.insightGain ?? 0, conn.title);
      }
      return next;
    },
    [toast, chapter],
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

    if (
      sc.notebook &&
      !next.notebook.some((n) => n.key === sc.notebook.key)
    ) {
      next = { ...next, notebook: [...next.notebook, sc.notebook] };
    }

    if (sc.effects) {
      next = applyEffects(next, sc.effects);
      toastEffects(sc.effects);
    }

    if (typeof sc.effectFn === "function") {
      const dyn = sc.effectFn(next);
      if (dyn) {
        next = applyEffects(next, dyn);
        toastEffects(dyn);
      }
    }

    next = checkConns(next);

    setGs(next);
    gsRef.current = next;

    const choices = resolveChoices(sc, next);
    if (choices && choices.length > 0) {
      setPhase("choices");
    } else if (sc.next) {
      setPhase("continue");
      save(next, sc.next);
    } else if (sc.links?.showEnd) {
      setPhase("ending");
      save(next, null);
      if (onChapterEnd) onChapterEnd(next);
    }
  }, [toastEffects, checkConns, onChapterEnd]);

  const onChoice = useCallback(
    (choice) => {
      let next = { ...gsRef.current };

      if (choice.flag) {
        next = {
          ...next,
          choicesMade: { ...next.choicesMade, [choice.flag]: true },
        };
      }
      if (choice.effects) {
        next = applyEffects(next, choice.effects);
        toastEffects(choice.effects);
      }
      if (
        choice.notebook &&
        !next.notebook.some((n) => n.key === choice.notebook.key)
      ) {
        next = { ...next, notebook: [...next.notebook, choice.notebook] };
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
    [toastEffects, checkConns, loadScene],
  );

  const onFlag = useCallback((flag) => {
    const next = {
      ...gsRef.current,
      choicesMade: { ...gsRef.current.choicesMade, [flag]: true },
    };
    setGs(next);
    gsRef.current = next;
  }, []);

  const onContinue = useCallback(() => {
    const sc = sceneRef.current;
    if (sc?.next) loadScene(sc.next);
  }, [loadScene]);

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

  return (
    <div className="game-container">
      <GearDefs />
      <Particles nerve={gs.nerve} />
      <ImpactToast impact={impact} />

      <header className="game-header">
        <span className="game-chapter-label">{chapter.titleCn}</span>
        <div className="game-stats">
          <div className="game-nerve-wrap">
            <NerveBar nerve={gs.nerve} />
          </div>
          <span className="game-stat">
            洞察 <span className="game-stat-val">{gs.insight}</span>
          </span>
          <span className="game-stat">
            執筆 <span className="game-stat-val">{gs.writing}</span>
          </span>
          <button
            className="notebook-toggle"
            onClick={() => setShowNb((v) => !v)}
          >
            手帖 ({gs.notebook.length})
          </button>
        </div>
      </header>

      <main className="game-content">
        {sections.map((sec, si) => (
          <HistorySection
            key={si}
            section={sec}
            isCollapsed={collapsed[si] ?? (si !== sections.length - 1)}
            onToggle={() => setCollapsed((c) => ({ ...c, [si]: !(c[si] ?? (si !== sections.length - 1)) }))}
          />
        ))}

        {scene?.links?.fold && (
          <div className="fold-divider">{scene.links.fold}</div>
        )}

        {phase !== "loading" && (
          <SceneText
            key={gs.currentSceneId}
            blocks={blocks}
            nerve={gs.nerve}
            onComplete={onTextComplete}
            onFlag={onFlag}
            onActiveBlockChange={onActiveBlockChange}
          />
        )}

        {phase === "choices" && (
          <ChoiceList
            choices={resolveChoices(scene, gs)}
            onSelect={onChoice}
          />
        )}

        {phase === "continue" && (
          <div className="continue-prompt" onClick={onContinue}>
            ▾ 點擊繼續
          </div>
        )}

        <div className="game-scroll-spacer" />
      </main>

      {showNb && (
        <NotebookPanel state={gs} chapter={chapter} onClose={() => setShowNb(false)} />
      )}

      {phase === "ending" && (
        <EndScreen
          state={gs}
          chapter={chapter}
          hasNextChapter={hasNextChapter}
          onAdvance={onAdvance}
        />
      )}
    </div>
  );
}
