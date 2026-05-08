export default function ConfirmModal({ onConfirm, onCancel, question }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div
        className="modal-box"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-mark" aria-hidden="true" />

        <h3 id="confirm-modal-title">确认你的问题</h3>

        <p>
          你问的是：「{question || "未输入"}」
        </p>

        <p>
          在抽牌前，请确保你已专注于此问题。
          牌面将如实反映当下的能量状态。
        </p>

        <div className="modal-actions">
          <button type="button" className="btn btn-primary" onClick={onConfirm}>
            我已想好，继续
          </button>
          <button type="button" className="btn btn-outline" onClick={onCancel}>
            再想想
          </button>
        </div>
      </div>
    </div>
  );
}
