export default function ChoiceList({ choices, seen = [], onSelect, editMode = false, onEditChoice }) {
  if (!choices || choices.length === 0) return null;
  // `import.meta.env.DEV &&` 讓 production build 把這裡折成常數 false，
  // 連 "edit-hoverable" 這個 class 字面字串都能被 esbuild 一併消掉。
  const dev = import.meta.env.DEV && editMode;
  return (
    <div className="choice-list">
      {choices.map((choice, i) => (
        <button
          key={i}
          className={`choice-btn${dev ? " edit-hoverable" : ""}`}
          // editMode 下點擊改為開編輯面板改 text，不觸發選擇（防誤點）。
          // 見 docs/batch-f5-ux.md §Lane E-3。
          // 非 editMode：把 display index i 一併傳出去，讓呼叫端能對應回
          // 選項的資料原始索引（見 docs/batch-f5-ux.md §Lane R，已見標記
          // ／回溯快照的 chosen.index 都需要原始索引，不是這裡的顯示索引）。
          onClick={() => (dev ? onEditChoice?.(i) : onSelect(choice, i))}
        >
          {choice.text}
          {seen[i] && (
            <span className="choice-seen-mark" aria-hidden="true">
              {" "}
              ✓
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
