import { useState, useRef, useCallback, useEffect } from "react";
import { createChapterState } from "../engine/state";
import { applyEffects } from "../engine/effects";
import { resolveText, resolveChoices, getSceneById } from "../engine/scenes";
import { resolveConnections, applyConnection } from "../engine/connections";
import Particles from "./Particles";
import NerveBar from "./NerveBar";
import ImpactToast from "./ImpactToast";
import SceneText from "./SceneText";
import ChoiceList from "./ChoiceList";
import NotebookPanel from "./NotebookPanel";
import EndScreen from "./EndScreen";

export default function HagurumaEngine({ chapter, carryOver, onChapterEnd }) {
  const [gs, setGs] = useState(() => createChapterState(chapter, carryOver));
  const [scene, setScene] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [phase, setPhase] = useState("loading");
  const [impact, setImpact] = useState(null);
  const [showNb, setShowNb] = useState(false);

  const gsRef = useRef(gs);
  gsRef.current = gs;
  const sceneRef = useRef(null);
  const impactSeq = useRef(0);

  const toast = useCallback((type, label, amount, reason) => {
    impactSeq.current++;
    setImpact({ type, label, amount, reason, _k: impactSeq.current });
  }, []);

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
    [],
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
    } else if (sc.links?.showEnd) {
      setPhase("ending");
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

      if (choice.next) loadScene(choice.next);
    },
    [toastEffects, checkConns, loadScene],
  );

  const onContinue = useCallback(() => {
    const sc = sceneRef.current;
    if (sc?.next) loadScene(sc.next);
  }, [loadScene]);

  useEffect(() => {
    loadScene(chapter.startScene);
  }, [loadScene]);

  return (
    <div className="game-container">
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
        {scene?.links?.fold && (
          <div className="fold-divider">{scene.links.fold}</div>
        )}

        {phase !== "loading" && (
          <SceneText
            key={gs.currentSceneId}
            blocks={blocks}
            nerve={gs.nerve}
            onComplete={onTextComplete}
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
      </main>

      {showNb && (
        <NotebookPanel state={gs} chapter={chapter} onClose={() => setShowNb(false)} />
      )}

      {phase === "ending" && (
        <EndScreen state={gs} chapter={chapter} />
      )}
    </div>
  );
}
