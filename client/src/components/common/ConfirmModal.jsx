import "./ConfirmModal.css";

function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmClass = "confirm-btn",
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  return (
    <div className="confirm-overlay">

      <div className="confirm-modal">

        <h2>{title}</h2>

        <p>{message}</p>

        <div className="confirm-actions">

          <button
            className="cancel-btn"
            onClick={onCancel}
          >
            {cancelText}
          </button>

          <button
            className={`confirm-btn ${confirmClass}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>

        </div>

      </div>

    </div>
  );
}

export default ConfirmModal;