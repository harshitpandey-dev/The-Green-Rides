import React, { createContext, useContext, useState, useCallback } from "react";
import Toast from "../components/common/Toast";

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = Date.now() + Math.random();
    const newToast = {
      id,
      type: "info",
      duration: 5000,
      ...toast,
    };

    setToasts((prev) => [...prev, newToast]);

    // Auto remove toast after duration
    setTimeout(() => {
      removeToast(id);
    }, newToast.duration);

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showSuccess = useCallback(
    (message, options = {}) => {
      return addToast({
        type: "success",
        message,
        ...options,
      });
    },
    [addToast]
  );

  const showError = useCallback(
    (message, options = {}) => {
      return addToast({
        type: "error",
        message,
        duration: 7000, // Errors stay longer
        ...options,
      });
    },
    [addToast]
  );

  const showWarning = useCallback(
    (message, options = {}) => {
      return addToast({
        type: "warning",
        message,
        ...options,
      });
    },
    [addToast]
  );

  const showInfo = useCallback(
    (message, options = {}) => {
      return addToast({
        type: "info",
        message,
        ...options,
      });
    },
    [addToast]
  );

  const value = {
    toasts,
    addToast,
    removeToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-container">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            {...toast}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};
