import { useState, useCallback } from "react";
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
  const scene = gs ? getSceneById(chapter, gs.currentSceneId) : null;

  const handleStateChange = useCallback((state) => {
    setGs(state);
  }, []);

  return (
    <div className="layout">
      <aside className="layout-left">
        <LeftSidebar state={gs} chapter={chapter} scene={scene} />
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
        />
      </main>
      <aside className="layout-right">
        <RightSidebar state={gs} chapter={chapter} />
      </aside>
    </div>
  );
}
