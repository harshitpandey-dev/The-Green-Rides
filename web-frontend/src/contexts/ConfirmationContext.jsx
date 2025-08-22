import React, { createContext, useContext } from "react";
import { useConfirmation } from "../hooks/useConfirmation";
import ConfirmationModal from "../components/modals/ConfirmationModal";

const ConfirmationContext = createContext();

export const useConfirmationDialog = () => {
  const context = useContext(ConfirmationContext);
  if (!context) {
    throw new Error(
      "useConfirmationDialog must be used within a ConfirmationProvider"
    );
  }
  return context;
};

export const ConfirmationProvider = ({ children }) => {
  const {
    confirmation,
    showConfirmation,
    hideConfirmation,
    confirmDelete,
    confirmLogout,
    confirmStatusChange,
  } = useConfirmation();

  const value = {
    showConfirmation,
    confirmDelete,
    confirmLogout,
    confirmStatusChange,
  };

  return (
    <ConfirmationContext.Provider value={value}>
      {children}
      <ConfirmationModal
        isOpen={confirmation.isOpen}
        onClose={hideConfirmation}
        onConfirm={confirmation.onConfirm}
        title={confirmation.title}
        message={confirmation.message}
        type={confirmation.type}
        confirmText={confirmation.confirmText}
        cancelText={confirmation.cancelText}
        isLoading={confirmation.isLoading}
      />
    </ConfirmationContext.Provider>
  );
};
