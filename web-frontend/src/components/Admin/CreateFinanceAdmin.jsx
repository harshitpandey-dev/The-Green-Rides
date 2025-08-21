import React, { useState } from "react";
import { FaUserPlus, FaTimes } from "react-icons/fa";
import { userService } from "../../services/user.service";
import LoadingSpinner from "../common/LoadingSpinner";
import "./adminList.css";

const CreateFinanceAdmin = ({
  isOpen,
  onClose,
  onSuccess,
  editMode = false,
  adminData = null,
}) => {
  const [formData, setFormData] = useState({
    name: editMode && adminData ? adminData.name : "",
    email: editMode && adminData ? adminData.email : "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      return "Name is required";
    }
    if (!formData.email.trim()) {
      return "Email is required";
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      return "Please enter a valid email address";
    }

    // Password validation only required for new users or when password is being changed
    if (!editMode) {
      if (!formData.password) {
        return "Password is required";
      }
      if (formData.password.length < 6) {
        return "Password must be at least 6 characters long";
      }
      if (formData.password !== formData.confirmPassword) {
        return "Passwords do not match";
      }
    } else if (formData.password) {
      // If in edit mode and password is provided, validate it
      if (formData.password.length < 6) {
        return "Password must be at least 6 characters long";
      }
      if (formData.password !== formData.confirmPassword) {
        return "Passwords do not match";
      }
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError("");

      let result;

      if (editMode) {
        // Update existing admin
        const updateData = {
          name: formData.name.trim(),
          email: formData.email.trim(),
        };

        // Only include password if it's being changed
        if (formData.password) {
          updateData.password = formData.password;
        }

        result = await userService.updateUser(adminData._id, updateData);
      } else {
        // Create new admin
        result = await userService.createUser({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
          role: "finance_admin",
        });
      }

      // Reset form
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      onSuccess(result);
      onClose();
    } catch (err) {
      setError(
        err.message ||
          `Failed to ${editMode ? "update" : "create"} finance admin`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setError("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div
        className="create-finance-admin-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>
            <FaUserPlus />
            {editMode ? "Edit Finance Admin" : "Create Finance Admin"}
          </h2>
          <button
            className="close-btn"
            onClick={handleClose}
            disabled={loading}
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter full name"
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter email address"
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              Password {editMode ? "(leave blank to keep current)" : "*"}
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder={
                editMode
                  ? "Enter new password (optional)"
                  : "Enter password (min 6 characters)"
              }
              disabled={loading}
              required={!editMode}
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">
              Confirm Password {editMode && !formData.password ? "" : "*"}
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder={
                editMode ? "Confirm new password" : "Confirm password"
              }
              disabled={loading || (editMode && !formData.password)}
              required={!editMode || !!formData.password}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" className="create-btn" disabled={loading}>
              {loading ? (
                <>
                  <LoadingSpinner size="small" />
                  {editMode ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  <FaUserPlus />
                  {editMode ? "Update Finance Admin" : "Create Finance Admin"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateFinanceAdmin;
