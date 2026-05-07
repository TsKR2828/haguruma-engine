import { useState } from "react";

export default function ActionBlock({ prompt, response, onAction }) {
  const [acted, setActed] = useState(false);
  const [showResponse, setShowResponse] = useState(false);

  function handleClick() {
    if (acted) return;
    setActed(true);
    onAction?.();
    if (response) {
      setTimeout(() => setShowResponse(true), 150);
    }
  }

  if (acted && showResponse) {
    return (
      <div className="action-block action-block--done">
        <div className="action-prompt-done">✓ {prompt}</div>
        <div className="action-response">{response}</div>
      </div>
    );
  }

  if (acted) {
    return (
      <div className="action-block action-block--done">
        <div className="action-prompt-done">✓ {prompt}</div>
      </div>
    );
  }

  return (
    <div className="action-block">
      <button className="action-btn" onClick={handleClick}>
        {prompt}
      </button>
    </div>
  );
}
