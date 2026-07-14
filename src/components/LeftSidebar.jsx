import { useState, Fragment } from "react";
import { BOOK } from "../bookLoader";
import { CHAPTERS } from "../data/chapters";

export default function LeftSidebar({ state, chapter, roster, activeId, book = BOOK }) {
  const [expanded, setExpanded] = useState(false);

  if (!state) return null;

  const cur = state.currentChapter;
  const warningLines = book.ui.chapterListWarning.split("\n");

  return (
    <div className="left-sidebar">
      <div>
        <div
          className={`ch-header${expanded ? " expanded" : ""}`}
          onClick={() => setExpanded((v) => !v)}
        >
          <span>章節目錄</span>
          <span className="ch-arrow">∨</span>
        </div>

        {!expanded ? (
          <div className="ch-warning">
            {warningLines.map((line, i) => (
              <Fragment key={i}>
                {line}
                {i < warningLines.length - 1 && <br />}
              </Fragment>
            ))}
          </div>
        ) : (
          <div className="ch-list">
            {CHAPTERS.map((c) => {
              let cls = "";
              if (c.num === cur) cls = "current";
              else if (c.num < cur) cls = "unlocked";

              const showTitle = c.num <= cur;

              return (
                <div key={c.num} className={`ch-item ${cls}`}>
                  <span className="ch-item-num">
                    第 {book.ui.numerals[c.num - 1]} 章
                  </span>
                  {showTitle ? c.title : "???"}
                  <br />
                  <span className="ch-item-cn">
                    {showTitle ? c.cn : "???"}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="left-image-area">
        {roster?.length > 0 && (
          <div className="left-roster">
            {roster.map((id) =>
              chapter.portraits?.[id] ? (
                <img
                  key={id}
                  className={`left-portrait${id === activeId ? "" : " dim"}`}
                  src={`${import.meta.env.BASE_URL}${chapter.portraits[id]}`}
                  alt=""
                />
              ) : null,
            )}
          </div>
        )}
      </div>
    </div>
  );
}
