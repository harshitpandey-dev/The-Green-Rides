import React, { useState } from "react";
import { useUser } from "../../contexts/authContext";
import UpdatePassword from "../../components/Profile/UpdatePassword";
import {
  FaUser,
  FaEnvelope,
  FaIdCard,
  FaKey,
  FaEdit,
  FaSave,
  FaTimes,
} from "react-icons/fa";
import "../../styles/screens/userProfile.css";

const UserProfile = () => {
  const { currentUser } = useUser();
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
  });

  const handleEditToggle = () => {
    if (isEditing) {
      // Reset to original values when canceling
      setEditedUser({
        name: currentUser?.name || "",
        email: currentUser?.email || "",
      });
    }
    setIsEditing(!isEditing);
  };

  const handleSaveChanges = () => {
    // Here you would typically make an API call to update the user
    console.log("Saving changes:", editedUser);
    setIsEditing(false);
    // Show success message
  };

  const handleInputChange = (field, value) => {
    setEditedUser((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case "super_admin":
        return "Super Administrator";
      case "finance_admin":
        return "Finance Administrator";
      case "student":
        return "Student";
      case "guard":
        return "Security Guard";
      default:
        return role?.charAt(0).toUpperCase() + role?.slice(1);
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "super_admin":
        return "#e74c3c";
      case "finance_admin":
        return "#3498db";
      case "student":
        return "#27ae60";
      case "guard":
        return "#f39c12";
      default:
        return "#6c757d";
    }
  };

  return (
    <div className="profile-container">
      <div className="page-header">
        <h1 className="page-title">
          <FaUser />
          Profile Management
        </h1>
        <p className="page-subtitle">
          Manage your account information and settings
        </p>
      </div>

      <div className="page-content">
        <div className="profile-grid">
          {/* Profile Card */}
          <div className="profile-card">
            <div className="profile-header">
              <div className="profile-avatar">
                <FaUser />
              </div>
              <div className="profile-info">
                <h2>{currentUser?.name}</h2>
                <span
                  className="role-badge"
                  style={{ backgroundColor: getRoleColor(currentUser?.role) }}
                >
                  {getRoleDisplayName(currentUser?.role)}
                </span>
              </div>
              <div className="profile-actions">
                {!isEditing ? (
                  <button className="btn-primary" onClick={handleEditToggle}>
                    <FaEdit /> Edit Profile
                  </button>
                ) : (
                  <div className="edit-actions">
                    <button className="btn-success" onClick={handleSaveChanges}>
                      <FaSave /> Save
                    </button>
                    <button
                      className="btn-secondary"
                      onClick={handleEditToggle}
                    >
                      <FaTimes /> Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="profile-details">
              <div className="detail-group">
                <label>
                  <FaUser className="detail-icon" />
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedUser.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="form-input"
                  />
                ) : (
                  <div className="detail-value">{currentUser?.name}</div>
                )}
              </div>

              <div className="detail-group">
                <label>
                  <FaEnvelope className="detail-icon" />
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editedUser.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="form-input"
                  />
                ) : (
                  <div className="detail-value">{currentUser?.email}</div>
                )}
              </div>

              {currentUser?.rollNo && (
                <div className="detail-group">
                  <label>
                    <FaIdCard className="detail-icon" />
                    Roll Number
                  </label>
                  <div className="detail-value">{currentUser?.rollNo}</div>
                </div>
              )}

              <div className="detail-group">
                <label>
                  <FaIdCard className="detail-icon" />
                  User Role
                </label>
                <div className="detail-value">
                  <span
                    className="role-chip"
                    style={{ backgroundColor: getRoleColor(currentUser?.role) }}
                  >
                    {getRoleDisplayName(currentUser?.role)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Security Card */}
          <div className="security-card">
            <div className="card-header">
              <h3>
                <FaKey />
                Security Settings
              </h3>
            </div>

            <div className="card-content">
              <div className="security-item">
                <div className="security-info">
                  <h4>Password</h4>
                  <p>Keep your account secure with a strong password</p>
                </div>
                <button
                  className={`btn-outline ${
                    showChangePassword ? "btn-danger" : "btn-primary"
                  }`}
                  onClick={() => setShowChangePassword(!showChangePassword)}
                >
                  {showChangePassword ? (
                    <>
                      <FaTimes /> Cancel
                    </>
                  ) : (
                    <>
                      <FaKey /> Change Password
                    </>
                  )}
                </button>
              </div>

              {showChangePassword && (
                <div className="password-form-container">
                  <UpdatePassword currentUser={currentUser} />
                </div>
              )}

              <div className="security-item">
                <div className="security-info">
                  <h4>Account Status</h4>
                  <p>Your account is active and in good standing</p>
                </div>
                <div className="status-indicator active">Active</div>
              </div>
            </div>
          </div>

          {/* Statistics Card (for admins) */}
          {(currentUser?.role === "super_admin" ||
            currentUser?.role === "finance_admin") && (
            <div className="stats-card">
              <div className="card-header">
                <h3>Account Statistics</h3>
              </div>
              <div className="card-content">
                <div className="stat-item">
                  <div className="stat-label">Last Login</div>
                  <div className="stat-value">Today, 2:30 PM</div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">Account Created</div>
                  <div className="stat-value">Jan 15, 2024</div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">Total Sessions</div>
                  <div className="stat-value">247</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
