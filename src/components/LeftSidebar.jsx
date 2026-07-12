import { useState } from "react";
import { CHAPTERS, CH_NUM_KANJI } from "../data/chapters";

export default function LeftSidebar({ state, chapter, roster, activeId }) {
  const [expanded, setExpanded] = useState(false);

  if (!state) return null;

  const cur = state.currentChapter;

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
            此人生之書能預知命運。
            <br />
            然而事先得知章節數量，
            <br />
            可能會降低未知的樂趣。
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
                    第 {CH_NUM_KANJI[c.num - 1]} 章
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
