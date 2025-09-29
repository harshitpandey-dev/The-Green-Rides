import React, { useState, useRef } from "react";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import Modal from "./Modal";
import { changePassword } from "../../services/auth.service";
import { useToast } from "../../contexts/ToastContext";

const ChangePasswordModal = ({ isOpen, onClose, currentUser }) => {
  const { showSuccess, showError } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const currentPasswordRef = useRef();
  const newPasswordRef = useRef();
  const confirmPasswordRef = useRef();

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const currentPassword = currentPasswordRef.current.value;
    const newPassword = newPasswordRef.current.value;
    const confirmPassword = confirmPasswordRef.current.value;

    if (!currentPassword || !newPassword || !confirmPassword) {
      showError("Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      showError("New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      showError("New password must be at least 6 characters long");
      return;
    }

    if (currentPassword === newPassword) {
      showError("New password must be different from current password");
      return;
    }

    setIsLoading(true);

    try {
      const response = await changePassword({
        email: currentUser?.email,
        oldPassword: currentPassword,
        newPassword: newPassword,
      });

      if (response.success) {
        showSuccess("Password changed successfully!");
        setTimeout(() => {
          onClose();
          // Reset form
          currentPasswordRef.current.value = "";
          newPasswordRef.current.value = "";
          confirmPasswordRef.current.value = "";
        }, 1500);
      } else {
        showError(response.message || "Failed to change password");
      }
    } catch (error) {
      showError("Network error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
      if (currentPasswordRef.current) currentPasswordRef.current.value = "";
      if (newPasswordRef.current) newPasswordRef.current.value = "";
      if (confirmPasswordRef.current) confirmPasswordRef.current.value = "";
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Change Password"
      size="small"
    >
      <form className="modal-form" onSubmit={handleSubmit}>
        <div className="modal-form-group">
          <label className="modal-form-label">
            <FaLock />
            Current Password
          </label>
          <div style={{ position: "relative" }}>
            <input
              type={showPasswords.current ? "text" : "password"}
              ref={currentPasswordRef}
              className="modal-form-input"
              placeholder="Enter your current password"
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("current")}
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                color: "#6c757d",
                cursor: "pointer",
              }}
            >
              {showPasswords.current ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        <div className="modal-form-group">
          <label className="modal-form-label">
            <FaLock />
            New Password
          </label>
          <div style={{ position: "relative" }}>
            <input
              type={showPasswords.new ? "text" : "password"}
              ref={newPasswordRef}
              className="modal-form-input"
              placeholder="Enter your new password (min 6 characters)"
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("new")}
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                color: "#6c757d",
                cursor: "pointer",
              }}
            >
              {showPasswords.new ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        <div className="modal-form-group">
          <label className="modal-form-label">
            <FaLock />
            Confirm New Password
          </label>
          <div style={{ position: "relative" }}>
            <input
              type={showPasswords.confirm ? "text" : "password"}
              ref={confirmPasswordRef}
              className="modal-form-input"
              placeholder="Confirm your new password"
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("confirm")}
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                color: "#6c757d",
                cursor: "pointer",
              }}
            >
              {showPasswords.confirm ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        <div className="modal-form-actions">
          <button
            type="button"
            className="modal-btn modal-btn-secondary"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="modal-btn modal-btn-primary"
            disabled={isLoading}
          >
            {isLoading && <div className="loading-spinner"></div>}
            {isLoading ? "Changing..." : "Change Password"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ChangePasswordModal;
