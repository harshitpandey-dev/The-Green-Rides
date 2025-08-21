import React from "react";
import { FaMoneyBillWave } from "react-icons/fa";
import FinanceAdminList from "../../components/admin/FinanceAdminList";

const FinanceAdminsScreen = () => {
  return (
    <div className="dashboard-container">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">
            <FaMoneyBillWave className="page-icon" />
            Finance Admins Management
          </h1>
          <p className="page-subtitle">
            Manage finance administrator accounts and permissions
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="dashboard-content">
        <FinanceAdminList />
      </div>
    </div>
  );
};

export default FinanceAdminsScreen;
