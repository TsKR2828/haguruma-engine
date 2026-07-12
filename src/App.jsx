import { useState, useCallback } from "react";
import GameLayout from "./components/GameLayout";
import { getChapter } from "./data/chapterRegistry";
import { createChapterState } from "./engine/state";
import { loadSave, restoreState, clearSave, hasSave, saveGame } from "./engine/save";
import "./styles/game.css";

export default function App() {
  const [playing, setPlaying] = useState(false);
  const [chapterNum, setChapterNum] = useState(() => {
    const saved = loadSave();
    return saved?.currentChapter ?? 1;
  });
  const [restoredState, setRestoredState] = useState(() => {
    const saved = loadSave();
    return saved ? restoreState(saved) : null;
  });
  const [carryOver, setCarryOver] = useState(null);
  // Bug 7: whether a save exists at title-screen time, so we can offer
  // "繼續遊玩" (resume) vs "新的開始" (start over) instead of only ever
  // "開始遊玩".
  const [hasExistingSave, setHasExistingSave] = useState(() => hasSave());

  const chapter = getChapter(chapterNum);

  const handleChapterEnd = useCallback((finalState) => {
    const { currentSceneId, currentChapter, journey, ...persistent } = finalState;
    setCarryOver(persistent);
    setRestoredState(null);
  }, []);

  const advanceChapter = useCallback(() => {
    const next = getChapter(chapterNum + 1);
    if (next) {
      // Bug 6: persist the new chapter's start state immediately on
      // advance — previously the save only updated on the next scene
      // transition inside that chapter, so closing the tab right after
      // "次の章へ" reverted progress back to the finished chapter.
      const freshState = createChapterState(next, carryOver);
      saveGame(freshState, next.startScene);
      setRestoredState(null);
      setChapterNum(chapterNum + 1);
    }
  }, [chapterNum, carryOver]);

  const handleNewGame = useCallback(() => {
    if (!window.confirm("確定要開始新遊戲嗎？現有進度將會被清除。")) return;
    clearSave();
    setCarryOver(null);
    setRestoredState(null);
    setChapterNum(1);
    setHasExistingSave(false);
    setPlaying(true);
  }, []);

  if (playing && chapter) {
    return (
      <GameLayout
        key={chapterNum}
        chapter={chapter}
        carryOver={carryOver}
        initialState={restoredState}
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
            {hasExistingSave ? "繼續遊玩" : "開始遊玩"}
          </button>
          {hasExistingSave && (
            <button
              className="title-newgame-btn"
              onClick={handleNewGame}
            >
              新的開始
            </button>
          )}
        </div>

        {import.meta.env.DEV && (
          <a
            className="shell-legacy-link"
            href={import.meta.env.BASE_URL + "prototype.html"}
            style={{ marginTop: 20 }}
          >
            遊玩 Legacy Prototype（第一章）
          </a>
        )}
      </main>

      <footer className="shell-footer">
        原著文本為公有領域
      </footer>
    </div>
  );
}
