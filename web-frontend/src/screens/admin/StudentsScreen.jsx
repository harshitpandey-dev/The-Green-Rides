import React from "react";
import { FaUsers } from "react-icons/fa";
import StudentList from "../../components/admin/StudentList";

const StudentsScreen = () => {
  return (
    <div className="dashboard-container">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">
            <FaUsers className="page-icon" />
            Students Management
          </h1>
          <p className="page-subtitle">
            Manage student accounts, registrations, and status
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="dashboard-content">
        <StudentList />
      </div>
    </div>
  );
};

export default StudentsScreen;
