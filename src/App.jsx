import { useState, useCallback, useEffect } from "react";
import GameLayout from "./components/GameLayout";
import { BOOK } from "./bookLoader";
import { getChapter } from "./data/chapterRegistry";
import { createChapterState } from "./engine/state";
import { loadSave, restoreState, clearSave, hasSave, saveGame } from "./engine/save";
import "./styles/game.css";

// PALETTE → --washi-* CSS 變數名對照（施工圖 §2 S2-7）。global.css 的
// :root 已經定義同名變數為預設值；這裡在啟動時用 book.palette 覆寫一次，
// 換書時只要 palette 內容不同，畫面就會跟著換，不需要改 CSS。
// haguruma 的 PALETTE 值與 global.css 現行預設值逐字相同，注入後零視覺變化。
const PALETTE_VAR_MAP = {
  bg: { outer: "--washi-bg-outer", sidebar: "--washi-bg-sidebar", main: "--washi-bg-main", card: "--washi-bg-card" },
  ink: { deep: "--washi-ink-deep", body: "--washi-ink-body", muted: "--washi-ink-muted", ghost: "--washi-ink-ghost" },
  border: { normal: "--washi-border", light: "--washi-border-light", divider: "--washi-divider" },
  accent: { red: "--washi-accent-red", gold: "--washi-accent-gold", green: "--washi-accent-green", blue: "--washi-accent-blue" },
  ui: { hoverBg: "--washi-hover-bg", activeBg: "--washi-active-bg", selection: "--washi-selection" },
};

function injectPalette(palette) {
  if (typeof document === "undefined" || !palette) return;
  const root = document.documentElement;
  for (const [groupKey, varsForGroup] of Object.entries(PALETTE_VAR_MAP)) {
    const group = palette[groupKey];
    if (!group) continue;
    for (const [key, cssVar] of Object.entries(varsForGroup)) {
      if (group[key] != null) root.style.setProperty(cssVar, group[key]);
    }
  }
}

export default function App() {
  useEffect(() => {
    injectPalette(BOOK.palette);
  }, []);
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
        <h1 className="shell-title">{BOOK.meta.title}</h1>
        <p className="shell-subtitle">haguruma-engine</p>
      </header>

      <main className="shell-main">
        <div className="shell-card">
          <p className="shell-status">{BOOK.meta.author}《{BOOK.meta.title}》（{BOOK.meta.year}）</p>
          <p className="shell-desc">
            {BOOK.meta.quote}
          </p>
          <button
            className="title-start-btn"
            onClick={() => setPlaying(true)}
          >
            {hasExistingSave ? BOOK.ui.resumeLabel : BOOK.ui.startLabel}
          </button>
          {hasExistingSave && (
            <button
              className="title-newgame-btn"
              onClick={handleNewGame}
            >
              {BOOK.ui.newGameLabel}
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
