import { useState, useCallback, useRef, useLayoutEffect } from "react";
import HagurumaEngine from "./HagurumaEngine";
import LeftSidebar from "./LeftSidebar";
import RightSidebar from "./RightSidebar";
import { getSceneById } from "../engine/scenes";

export default function GameLayout({
  chapter,
  carryOver,
  initialState,
  onChapterEnd,
  hasNextChapter,
  onAdvance,
}) {
  const [gs, setGs] = useState(null);
  const [portraitId, setPortraitId] = useState(null);
  const [portraitDim, setPortraitDim] = useState(false);
  const prevSceneRef = useRef(null);
  const scene = gs ? getSceneById(chapter, gs.currentSceneId) : null;

  useLayoutEffect(() => {
    const sceneId = gs?.currentSceneId ?? null;
    if (sceneId !== prevSceneRef.current) {
      if (prevSceneRef.current !== null) {
        setPortraitId(null);
        setPortraitDim(false);
      }
      prevSceneRef.current = sceneId;
    }
  }, [gs?.currentSceneId]);

  const handleStateChange = useCallback((state) => {
    setGs(state);
  }, []);

  const handleActiveBlockChange = useCallback((block) => {
    if (block?.type === "dialogue" && block?.speakerId) {
      setPortraitId(block.speakerId);
      setPortraitDim(false);
    } else {
      setPortraitDim(true);
    }
  }, []);

  return (
    <div className="layout">
      <aside className="layout-left">
        <LeftSidebar state={gs} chapter={chapter} portraitId={portraitId} portraitDim={portraitDim} />
      </aside>
      <main className="layout-center">
        <HagurumaEngine
          chapter={chapter}
          carryOver={carryOver}
          initialState={initialState}
          onChapterEnd={onChapterEnd}
          hasNextChapter={hasNextChapter}
          onAdvance={onAdvance}
          onStateChange={handleStateChange}
          onActiveBlockChange={handleActiveBlockChange}
        />
      </main>
      <aside className="layout-right">
        <RightSidebar state={gs} chapter={chapter} />
      </aside>
    </div>
  );
}
