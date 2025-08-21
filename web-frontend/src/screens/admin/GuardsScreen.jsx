import React from "react";
import { FaUserShield } from "react-icons/fa";
import GuardList from "../../components/admin/GuardList";

const GuardsScreen = () => {
  return (
    <div className="dashboard-container">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">
            <FaUserShield className="page-icon" />
            Guards Management
          </h1>
          <p className="page-subtitle">
            Manage security guard accounts and assignments
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="dashboard-content">
        <GuardList />
      </div>
    </div>
  );
};

export default GuardsScreen;
