import { useState, useCallback } from "react";
import HagurumaEngine from "./components/HagurumaEngine";
import { getChapter } from "./data/chapterRegistry";
import { loadSave, clearSave } from "./engine/save";
import "./styles/game.css";

export default function App() {
  const [playing, setPlaying] = useState(false);
  const [chapterNum, setChapterNum] = useState(() => {
    const saved = loadSave();
    return saved?.currentChapter ?? 1;
  });
  const [carryOver, setCarryOver] = useState(null);

  const chapter = getChapter(chapterNum);

  const handleChapterEnd = useCallback((finalState) => {
    const { currentSceneId, currentChapter, journey, ...persistent } = finalState;
    setCarryOver(persistent);
  }, []);

  const advanceChapter = useCallback(() => {
    const next = getChapter(chapterNum + 1);
    if (next) {
      setChapterNum(chapterNum + 1);
    }
  }, [chapterNum]);

  if (playing && chapter) {
    return (
      <HagurumaEngine
        key={chapterNum}
        chapter={chapter}
        carryOver={carryOver}
        onChapterEnd={handleChapterEnd}
        hasNextChapter={!!getChapter(chapterNum + 1)}
        onAdvance={advanceChapter}
      />
    );
  }

  return (
    <div className="app-shell">
      <header className="shell-header">
        <h1 className="shell-title">歯車</h1>
        <p className="shell-subtitle">haguruma-engine</p>
      </header>

      <main className="shell-main">
        <div className="shell-card">
          <p className="shell-status">芥川龍之介《歯車》（1927）</p>
          <p className="shell-desc">
            ——「半透明の歯車。それが不意に彼の視野を遮り始めた。」
          </p>
          <button
            className="title-start-btn"
            onClick={() => setPlaying(true)}
          >
            開始遊玩
          </button>
        </div>

        <a className="shell-legacy-link" href="/prototype.html" style={{ marginTop: 20 }}>
          遊玩 Legacy Prototype（第一章）
        </a>
      </main>

      <footer className="shell-footer">
        原著文本為公有領域
      </footer>
    </div>
  );
}
