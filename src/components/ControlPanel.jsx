import { useState } from "react";

export default function ControlPanel({
  question,
  setQuestion,
  onConfirm,
  onReset,
  confirmed,
  cardsDrawn,
}) {
  const [showError, setShowError] = useState(false);

  function handleConfirm() {
    if (!question.trim()) {
      setShowError(true);
      setTimeout(() => setShowError(false), 2500);
      return;
    }
    setShowError(false);
    onConfirm();
  }

  return (
    <div className="control-panel">
      <textarea
        value={question}
        onChange={(e) => {
          setQuestion(e.target.value);
          if (showError) setShowError(false);
        }}
        aria-label="占卜问题"
        placeholder="请在此写下你心中想问的事情..."
        className={`control-textarea ${showError ? "error" : ""}`}
        rows={3}
      />

      {showError && (
        <div className="control-hint">请先写下你的问题再确认</div>
      )}

      <div className="control-actions">
        {!confirmed && (
          <button type="button" className="btn btn-primary" onClick={handleConfirm}>
            确认问题
          </button>
        )}

        {cardsDrawn && (
          <button type="button" className="btn btn-outline" onClick={onReset}>
            重新提问
          </button>
        )}
      </div>
    </div>
  );
}
