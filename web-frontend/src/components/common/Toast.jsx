import React, { useEffect, useState } from "react";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaInfoCircle,
  FaTimes,
  FaExclamationTriangle,
} from "react-icons/fa";
import "../../styles/components/toast.css";

const Toast = ({ id, type, message, title, duration, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
    }, 300); // Match the exit animation duration
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return <FaCheckCircle className="toast-icon" />;
      case "error":
        return <FaExclamationCircle className="toast-icon" />;
      case "warning":
        return <FaExclamationTriangle className="toast-icon" />;
      default:
        return <FaInfoCircle className="toast-icon" />;
    }
  };

  const getTitle = () => {
    if (title) return title;

    switch (type) {
      case "success":
        return "Success";
      case "error":
        return "Error";
      case "warning":
        return "Warning";
      default:
        return "Info";
    }
  };

  return (
    <div
      className={`toast toast--${type} ${isVisible ? "toast--visible" : ""} ${
        isExiting ? "toast--exiting" : ""
      }`}
      role="alert"
      aria-live="polite"
    >
      <div className="toast-content">
        <div className="toast-icon-wrapper">{getIcon()}</div>

        <div className="toast-text">
          <div className="toast-title">{getTitle()}</div>
          <div className="toast-message">{message}</div>
        </div>
      </div>

      <button
        className="toast-close"
        onClick={handleClose}
        aria-label="Close notification"
        type="button"
      >
        <FaTimes />
      </button>

      <div className={`toast-progress toast-progress--${type}`}>
        <div
          className="toast-progress-bar"
          style={{ animationDuration: `${duration}ms` }}
        />
      </div>
    </div>
  );
};

export default Toast;
