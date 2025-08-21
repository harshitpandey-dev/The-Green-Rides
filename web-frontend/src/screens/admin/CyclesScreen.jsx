import React from "react";
import { FaBicycle } from "react-icons/fa";
import CycleList from "../../components/admin/CycleList";

const CyclesScreen = () => {
  return (
    <div className="dashboard-container">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">
            <FaBicycle className="page-icon" />
            Cycles Management
          </h1>
          <p className="page-subtitle">
            Manage bicycle inventory, status, and maintenance
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="dashboard-content">
        <CycleList />
      </div>
    </div>
  );
};

export default CyclesScreen;
