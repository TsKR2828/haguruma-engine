import { useState, useCallback, useRef, useLayoutEffect } from "react";
import HagurumaEngine from "./HagurumaEngine";
import LeftSidebar from "./LeftSidebar";
import RightSidebar from "./RightSidebar";
import { getSceneById } from "../engine/scenes";
import { nextActiveId, nextRoster, resetRoster } from "../engine/portraitRoster";

export default function GameLayout({
  chapter,
  carryOver,
  initialState,
  onChapterEnd,
  hasNextChapter,
  onAdvance,
}) {
  const [gs, setGs] = useState(null);
  const [roster, setRoster] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const prevSceneRef = useRef(null);
  const scene = gs ? getSceneById(chapter, gs.currentSceneId) : null;

  useLayoutEffect(() => {
    const sceneId = gs?.currentSceneId ?? null;
    if (sceneId !== prevSceneRef.current) {
      if (prevSceneRef.current !== null) {
        const reset = resetRoster();
        setRoster(reset.roster);
        setActiveId(reset.activeId);
      }
      prevSceneRef.current = sceneId;
    }
  }, [gs?.currentSceneId]);

  const handleStateChange = useCallback((state) => {
    setGs(state);
  }, []);

  const handleActiveBlockChange = useCallback(
    (block) => {
      setActiveId(nextActiveId(block, chapter?.portraits));
      setRoster((prev) => nextRoster(prev, block, chapter?.portraits));
    },
    [chapter],
  );

  return (
    <div className="layout">
      <aside className="layout-left">
        <LeftSidebar state={gs} chapter={chapter} roster={roster} activeId={activeId} />
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
