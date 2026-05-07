import { useState, useCallback } from "react";
import HagurumaEngine from "./HagurumaEngine";

export default function GameLayout({
  chapter,
  carryOver,
  initialState,
  onChapterEnd,
  hasNextChapter,
  onAdvance,
}) {
  const [gs, setGs] = useState(null);

  const handleStateChange = useCallback((state) => {
    setGs(state);
  }, []);

  return (
    <div className="layout">
      <aside className="layout-left">
        <div className="layout-placeholder">左欄 placeholder</div>
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
        <div className="layout-placeholder">右欄 placeholder</div>
      </aside>
    </div>
  );
}
