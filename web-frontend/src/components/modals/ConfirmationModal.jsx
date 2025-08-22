import React from "react";
import {
  FaExclamationTriangle,
  FaQuestion,
  FaInfoCircle,
  FaCheck,
} from "react-icons/fa";
import "../../styles/components/modals.css";

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = "warning", // warning, danger, info, success
  confirmText = "Confirm",
  cancelText = "Cancel",
  isLoading = false,
}) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose();
    }
  };

  const getIcon = () => {
    switch (type) {
      case "danger":
        return (
          <FaExclamationTriangle className="confirmation-icon confirmation-icon--danger" />
        );
      case "info":
        return (
          <FaInfoCircle className="confirmation-icon confirmation-icon--info" />
        );
      case "success":
        return (
          <FaCheck className="confirmation-icon confirmation-icon--success" />
        );
      default:
        return (
          <FaQuestion className="confirmation-icon confirmation-icon--warning" />
        );
    }
  };

  const getTypeClass = () => {
    switch (type) {
      case "danger":
        return "confirmation-modal--danger";
      case "info":
        return "confirmation-modal--info";
      case "success":
        return "confirmation-modal--success";
      default:
        return "confirmation-modal--warning";
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div
        className={`modal-content modal-small confirmation-modal ${getTypeClass()}`}
      >
        <div className="confirmation-header">
          {getIcon()}
          <h3 className="confirmation-title">{title}</h3>
        </div>

        <div className="confirmation-body">
          <p className="confirmation-message">{message}</p>
        </div>

        <div className="confirmation-actions">
          <button
            className="secondary-btn confirmation-cancel"
            onClick={onClose}
            disabled={isLoading}
            type="button"
          >
            {cancelText}
          </button>
          <button
            className={`primary-btn confirmation-confirm ${
              type === "danger" ? "confirmation-confirm--danger" : ""
            }`}
            onClick={onConfirm}
            disabled={isLoading}
            type="button"
          >
            {isLoading ? (
              <>
                <div className="btn-spinner"></div>
                Processing...
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
