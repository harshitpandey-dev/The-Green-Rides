import { useState, useCallback } from "react";

export const useConfirmation = () => {
  const [confirmation, setConfirmation] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "warning",
    confirmText: "Confirm",
    cancelText: "Cancel",
    onConfirm: null,
    isLoading: false,
  });

  const showConfirmation = useCallback(
    ({
      title,
      message,
      type = "warning",
      confirmText = "Confirm",
      cancelText = "Cancel",
      onConfirm,
    }) => {
      return new Promise((resolve) => {
        setConfirmation({
          isOpen: true,
          title,
          message,
          type,
          confirmText,
          cancelText,
          onConfirm: async () => {
            try {
              setConfirmation((prev) => ({ ...prev, isLoading: true }));
              if (onConfirm) {
                await onConfirm();
              }
              resolve(true);
            } catch (error) {
              resolve(false);
              throw error;
            } finally {
              setConfirmation((prev) => ({
                ...prev,
                isOpen: false,
                isLoading: false,
              }));
            }
          },
          isLoading: false,
        });
      });
    },
    []
  );

  const hideConfirmation = useCallback(() => {
    setConfirmation((prev) => ({ ...prev, isOpen: false, isLoading: false }));
  }, []);

  const confirmDelete = useCallback(
    (itemName, onConfirm) => {
      return showConfirmation({
        title: "Delete Confirmation",
        message: `Are you sure you want to delete "${itemName}"? This action cannot be undone.`,
        type: "danger",
        confirmText: "Delete",
        cancelText: "Cancel",
        onConfirm,
      });
    },
    [showConfirmation]
  );

  const confirmLogout = useCallback(
    (onConfirm) => {
      return showConfirmation({
        title: "Logout Confirmation",
        message:
          "Are you sure you want to logout? Any unsaved changes will be lost.",
        type: "warning",
        confirmText: "Logout",
        cancelText: "Stay",
        onConfirm,
      });
    },
    [showConfirmation]
  );

  const confirmStatusChange = useCallback(
    (itemName, newStatus, onConfirm) => {
      return showConfirmation({
        title: "Status Change",
        message: `Are you sure you want to change the status of "${itemName}" to ${newStatus}?`,
        type: "info",
        confirmText: "Change Status",
        cancelText: "Cancel",
        onConfirm,
      });
    },
    [showConfirmation]
  );

  return {
    confirmation,
    showConfirmation,
    hideConfirmation,
    confirmDelete,
    confirmLogout,
    confirmStatusChange,
  };
};
