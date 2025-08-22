import React, { useState } from "react";
import { useUser } from "../../contexts/authContext";
import ChangePasswordModal from "../../components/modals/ChangePasswordModal";
import UpdateProfileModal from "../../components/modals/UpdateProfileModal";
import {
  FaUser,
  FaEnvelope,
  FaIdCard,
  FaKey,
  FaEdit,
  FaShieldAlt,
  FaUserCog,
} from "react-icons/fa";
import "./UserProfile.css";

const UserProfile = () => {
  const { currentUser } = useUser();
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showUpdateProfileModal, setShowUpdateProfileModal] = useState(false);

  const getRoleDisplayName = (role) => {
    switch (role) {
      case "super_admin":
        return "Super Administrator";
      case "finance_admin":
        return "Finance Administrator";
      case "guard":
        return "Security Guard";
      case "student":
        return "Student";
      default:
        return "User";
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "super_admin":
        return "#e74c3c";
      case "finance_admin":
        return "#f39c12";
      case "guard":
        return "#3498db";
      case "student":
        return "#27ae60";
      default:
        return "#95a5a6";
    }
  };

  const handleProfileUpdateSuccess = (updatedData) => {
    // Here you would update the user context with new data
    console.log("Profile updated:", updatedData);
  };

  return (
    <div className="profile-container">
      {/* Profile Header Card */}
      <div className="profile-header-card">
        <div className="profile-header">
          <div className="profile-avatar">
            <FaUser />
          </div>
          <div className="profile-info">
            <h1>{currentUser?.name}</h1>
            <p>{currentUser?.email}</p>
          </div>
          <div className="profile-actions">
            <button
              className="profile-btn profile-btn-primary"
              onClick={() => setShowUpdateProfileModal(true)}
            >
              <FaEdit /> Edit Profile
            </button>
            <button
              className="profile-btn profile-btn-secondary"
              onClick={() => setShowChangePasswordModal(true)}
            >
              <FaKey /> Change Password
            </button>
          </div>
        </div>
      </div>

      {/* Profile Sections */}
      <div className="profile-sections">
        {/* Personal Information */}
        <div className="profile-section">
          <div className="section-header">
            <h2>
              <FaUserCog />
              Personal Information
            </h2>
          </div>
          <div className="section-content">
            <div className="detail-group">
              <div className="detail-label">
                <FaUser />
                Full Name
              </div>
              <div className="detail-value">{currentUser?.name}</div>
            </div>

            <div className="detail-group">
              <div className="detail-label">
                <FaEnvelope />
                Email Address
              </div>
              <div className="detail-value">{currentUser?.email}</div>
            </div>

            {currentUser?.rollNo && (
              <div className="detail-group">
                <div className="detail-label">
                  <FaIdCard />
                  Roll Number
                </div>
                <div className="detail-value">{currentUser?.rollNo}</div>
              </div>
            )}

            <div className="detail-group">
              <div className="detail-label">
                <FaShieldAlt />
                User Role
              </div>
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

        {/* Account Security */}
        <div className="profile-section">
          <div className="section-header">
            <h2>
              <FaKey />
              Account Security
            </h2>
          </div>
          <div className="section-content">
            <div className="security-item">
              <div className="security-info">
                <h4>Password</h4>
                <p>Keep your account secure with a strong password</p>
              </div>
              <button
                className="profile-btn profile-btn-primary"
                onClick={() => setShowChangePasswordModal(true)}
              >
                <FaKey /> Change Password
              </button>
            </div>

            <div className="security-item">
              <div className="security-info">
                <h4>Account Status</h4>
                <p>Your account is currently active and verified</p>
              </div>
              <span className="status-chip status-active">Active</span>
            </div>

            <div className="security-item">
              <div className="security-info">
                <h4>Last Login</h4>
                <p>Monitor your account access</p>
              </div>
              <div style={{ color: "#6c757d", fontSize: "0.9rem" }}>
                Today at {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ChangePasswordModal
        isOpen={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
        currentUser={currentUser}
      />

      <UpdateProfileModal
        isOpen={showUpdateProfileModal}
        onClose={() => setShowUpdateProfileModal(false)}
        currentUser={currentUser}
        onUpdateSuccess={handleProfileUpdateSuccess}
      />
    </div>
  );
};

export default UserProfile;
