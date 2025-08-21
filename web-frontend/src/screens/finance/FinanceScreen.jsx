import React, { useState, useEffect } from "react";
import {
  FaMoneyBillWave,
  FaChartLine,
  FaFileDownload,
  FaSearch,
  FaCalendarAlt,
} from "react-icons/fa";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import DashboardCard from "../../components/admin/DashboardCard";
import FinanceList from "../../components/admin/FinanceList";
import { financeService } from "../../services/finance.service";

import "./FinanceScreen.css";

const FinanceScreen = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [dashboardData, setDashboardData] = useState({
    totalAmount: 0,
    paidAmount: 0,
    pendingAmount: 0,
    overdueAmount: 0,
    totalFines: 0,
    todayCollection: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [summaryData, dashboardData] = await Promise.all([
        financeService.getFinancialSummary(),
        financeService.getFinanceDashboard(),
      ]);

      setDashboardData({
        totalAmount: summaryData.totalAmount || 0,
        paidAmount: summaryData.paidAmount || 0,
        pendingAmount: summaryData.pendingAmount || 0,
        overdueAmount: summaryData.overdueAmount || 0,
        totalFines: summaryData.totalFines || 0,
        todayCollection: dashboardData.todayCollection || 0,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <FaChartLine />,
    },
    {
      id: "fines",
      label: "Fine Management",
      icon: <FaMoneyBillWave />,
    },
    {
      id: "reports",
      label: "Reports",
      icon: <FaFileDownload />,
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "fines":
        return <FinanceList onDataUpdate={fetchDashboardData} />;
      case "reports":
        return renderReports();
      default:
        return renderDashboard();
    }
  };

  const renderDashboard = () => (
    <div className="finance-dashboard">
      <div className="dashboard-cards">
        <DashboardCard
          title="Total Amount"
          value={`₹${dashboardData.totalAmount.toFixed(2)}`}
          icon={<FaMoneyBillWave />}
          trend={`${dashboardData.totalFines} Total Fines`}
          subtitle="All-time collection"
          color="primary"
          onClick={() => setActiveTab("fines")}
        />

        <DashboardCard
          title="Pending Amount"
          value={`₹${dashboardData.pendingAmount.toFixed(2)}`}
          icon={<FaCalendarAlt />}
          trend="Awaiting Collection"
          subtitle="Outstanding payments"
          color="warning"
          onClick={() => setActiveTab("fines")}
        />

        <DashboardCard
          title="Collected Amount"
          value={`₹${dashboardData.paidAmount.toFixed(2)}`}
          icon={<FaChartLine />}
          trend={`₹${dashboardData.todayCollection.toFixed(2)} Today`}
          subtitle="Successfully collected"
          color="success"
          onClick={() => setActiveTab("fines")}
        />

        <DashboardCard
          title="Overdue Amount"
          value={`₹${dashboardData.overdueAmount.toFixed(2)}`}
          icon={<FaSearch />}
          trend="Requires Action"
          subtitle="Past due date"
          color="danger"
          onClick={() => setActiveTab("fines")}
        />
      </div>

      <div className="finance-actions">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <button
            className="quick-action-btn"
            onClick={() => setActiveTab("fines")}
          >
            <FaMoneyBillWave />
            <span>Manage Fines</span>
          </button>
          <button
            className="quick-action-btn"
            onClick={() => setActiveTab("reports")}
          >
            <FaFileDownload />
            <span>Generate Report</span>
          </button>
          <button className="quick-action-btn" onClick={() => window.print()}>
            <FaChartLine />
            <span>Print Summary</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="finance-reports">
      <div className="reports-header">
        <h2>Financial Reports</h2>
        <p>Generate and download comprehensive financial reports</p>
      </div>

      <div className="report-options">
        <div className="report-card">
          <h3>Daily Collection Report</h3>
          <p>Get detailed report of daily fine collections and transactions</p>
          <button className="btn-primary">
            <FaFileDownload />
            Generate Daily Report
          </button>
        </div>

        <div className="report-card">
          <h3>Monthly Summary</h3>
          <p>
            Comprehensive monthly financial summary with trends and analytics
          </p>
          <button className="btn-primary">
            <FaFileDownload />
            Generate Monthly Report
          </button>
        </div>

        <div className="report-card">
          <h3>Outstanding Fines</h3>
          <p>Report of all pending and overdue fines requiring attention</p>
          <button className="btn-primary">
            <FaFileDownload />
            Generate Outstanding Report
          </button>
        </div>

        <div className="report-card">
          <h3>Student Wise Report</h3>
          <p>Individual student fine history and payment records</p>
          <button className="btn-primary">
            <FaFileDownload />
            Generate Student Report
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <LoadingSpinner message="Loading finance dashboard..." />;
  }

  return (
    <div className="finance-screen">
      <div className="finance-header">
        <div className="finance-title">
          <h1>Finance Portal</h1>
          <p>Comprehensive financial management and reporting</p>
        </div>
      </div>

      <div className="finance-content">
        <nav className="finance-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`finance-tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="finance-tab-content">{renderContent()}</div>
      </div>
    </div>
  );
};

export default FinanceScreen;
