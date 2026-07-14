// 編輯器潤飾模式 — 底部編輯面板。
// 規格：docs/batch-f5-ux.md §Lane E-3。DEV only（呼叫端負責 gate，見 HagurumaEngine.jsx）。
//
// 面板常駐顯示「匯出 patch (N)」與「清除全部修改」；有 target（使用者點了
// 某個 block/choice）時額外顯示編輯欄位（dual block 兩個 textarea、
// content/choice text 一個）與 儲存／還原此塊／取消 三個按鈕。

export default function EditPanel({
  target,
  overlayCount,
  onChangeField,
  onSave,
  onRevert,
  onCancel,
  onExport,
  onClearAll,
}) {
  return (
    <div className="edit-panel">
      {target && (
        <div className="edit-panel-fields">
          <div className="edit-panel-title">
            編輯{target.kind === "choice" ? "選項" : "文字"}
            {target.kind === "block" && target.dual ? "（原文雙語）" : ""}
            {target.blockType === "action" ? "（互動：action）" : ""}
            {target.blockType === "forced" ? "（互動：forced）" : ""}
          </div>

          {target.dual ? (
            <>
              <label className="edit-panel-label" htmlFor="edit-panel-jp">
                jp
                {target.origin === "source" && (
                  <span className="edit-panel-warning">
                    ⚠ 原文區塊：改動 jp 將無法通過 fidelity 驗證
                  </span>
                )}
              </label>
              <textarea
                id="edit-panel-jp"
                className="edit-panel-textarea"
                value={target.fields.jp ?? ""}
                onChange={(e) => onChangeField("jp", e.target.value)}
              />
              <label className="edit-panel-label" htmlFor="edit-panel-cn">
                cn
              </label>
              <textarea
                id="edit-panel-cn"
                className="edit-panel-textarea"
                value={target.fields.cn ?? ""}
                onChange={(e) => onChangeField("cn", e.target.value)}
              />
            </>
          ) : target.blockType === "action" ? (
            <>
              <label className="edit-panel-label" htmlFor="edit-panel-prompt">
                prompt
              </label>
              <textarea
                id="edit-panel-prompt"
                className="edit-panel-textarea"
                value={target.fields.prompt ?? ""}
                onChange={(e) => onChangeField("prompt", e.target.value)}
              />
              <label className="edit-panel-label" htmlFor="edit-panel-response">
                response（可留空）
              </label>
              <textarea
                id="edit-panel-response"
                className="edit-panel-textarea"
                value={target.fields.response ?? ""}
                onChange={(e) => onChangeField("response", e.target.value)}
              />
            </>
          ) : target.blockType === "forced" ? (
            <>
              <label className="edit-panel-label" htmlFor="edit-panel-steps">
                steps（每行一則）
              </label>
              <textarea
                id="edit-panel-steps"
                className="edit-panel-textarea"
                value={target.fields.steps ?? ""}
                onChange={(e) => onChangeField("steps", e.target.value)}
              />
            </>
          ) : (
            <>
              <label className="edit-panel-label" htmlFor="edit-panel-single">
                {target.kind === "choice" ? "text" : "content"}
              </label>
              <textarea
                id="edit-panel-single"
                className="edit-panel-textarea"
                value={(target.kind === "choice" ? target.fields.text : target.fields.content) ?? ""}
                onChange={(e) =>
                  onChangeField(target.kind === "choice" ? "text" : "content", e.target.value)
                }
              />
            </>
          )}

          <div className="edit-panel-actions">
            <button type="button" className="edit-panel-btn edit-panel-save" onClick={onSave}>
              儲存
            </button>
            <button type="button" className="edit-panel-btn edit-panel-revert" onClick={onRevert}>
              還原此塊
            </button>
            <button type="button" className="edit-panel-btn edit-panel-cancel" onClick={onCancel}>
              取消
            </button>
          </div>
        </div>
      )}

      <div className="edit-panel-toolbar">
        <span className="edit-panel-mode-label">✎ 潤飾模式</span>
        <button type="button" className="edit-panel-btn edit-panel-export" onClick={onExport}>
          匯出 patch ({overlayCount})
        </button>
        <button type="button" className="edit-panel-btn edit-panel-clear" onClick={onClearAll}>
          清除全部修改
        </button>
      </div>
    </div>
  );
}
