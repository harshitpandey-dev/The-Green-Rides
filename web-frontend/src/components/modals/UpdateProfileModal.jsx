import React, { useState, useRef } from "react";
import { FaUser, FaEnvelope } from "react-icons/fa";
import Modal from "./Modal";
import { useToast } from "../../contexts/ToastContext";

const UpdateProfileModal = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateSuccess,
}) => {
  const { showSuccess, showError } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const nameRef = useRef();
  const emailRef = useRef();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newName = nameRef.current.value.trim();
    const newEmail = emailRef.current.value.trim();

    if (!newName || !newEmail) {
      showError("Please fill in all fields");
      return;
    }

    if (newName === currentUser?.name && newEmail === currentUser?.email) {
      showError("No changes detected");
      return;
    }

    setIsLoading(true);

    try {
      // Here you would call your update profile service
      // For now, I'll simulate the API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      showSuccess("Profile updated successfully!");

      // Call the success callback if provided
      if (onUpdateSuccess) {
        onUpdateSuccess({ name: newName, email: newEmail });
      }

      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      showError("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
      // Reset form to original values
      if (nameRef.current) nameRef.current.value = currentUser?.name || "";
      if (emailRef.current) emailRef.current.value = currentUser?.email || "";
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Update Profile"
      size="small"
    >
      <form className="modal-form" onSubmit={handleSubmit}>
        <div className="modal-form-group">
          <label className="modal-form-label">
            <FaUser />
            Full Name
          </label>
          <input
            type="text"
            ref={nameRef}
            className="modal-form-input"
            placeholder="Enter your full name"
            defaultValue={currentUser?.name || ""}
            required
            disabled={isLoading}
          />
        </div>

        <div className="modal-form-group">
          <label className="modal-form-label">
            <FaEnvelope />
            Email Address
          </label>
          <input
            type="email"
            ref={emailRef}
            className="modal-form-input"
            placeholder="Enter your email address"
            defaultValue={currentUser?.email || ""}
            required
            disabled={isLoading}
          />
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
            {isLoading ? "Updating..." : "Update Profile"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default UpdateProfileModal;
