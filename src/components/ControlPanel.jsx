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
      <div className="question-tips">
        <h3>💡 如何提出好问题</h3>
        <div className="tips-content">
          <div className="tip-section">
            <h4>✅ 好问题示例：</h4>
            <ul>
              <li>如果我接受这个工作机会，接下来三个月会发生什么？</li>
              <li>什么阻碍了我和伴侣的关系向前发展？</li>
              <li>我这次的项目申请能成功通过吗？</li>
            </ul>
          </div>
          <div className="tip-section">
            <h4>❌ 应避免的问题：</h4>
            <ul>
              <li>我应该做什么？（雷诺曼描述现状，不开处方）</li>
              <li>我做的选择对吗？（过于主观预设）</li>
              <li>我今年运气会怎么样？（太宽泛模糊）</li>
            </ul>
          </div>
          <div className="tip-section">
            <h4>📝 提问要点：</h4>
            <ul>
              <li>具体明确：聚焦特定事件，而非整个生活</li>
              <li>设定时间范围：让答案更有时效性</li>
              <li>保持客观中立：避免预设答案</li>
              <li>雷诺曼擅长描述「是什么」「会怎样」，而非「应该怎样」</li>
            </ul>
          </div>
        </div>
      </div>

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
