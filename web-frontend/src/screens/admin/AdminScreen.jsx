import React, { useState, useEffect, useContext } from "react";
import {
  FaUsers,
  FaBicycle,
  FaChartLine,
  FaMoneyBillWave,
  FaUserShield,
  FaCog,
  FaBell,
  FaPlus,
} from "react-icons/fa";

import { AuthContext } from "../../contexts/authContext";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import DashboardCard from "../../components/admin/DashboardCard";
import StudentList from "../../components/admin/StudentList";
import GuardList from "../../components/admin/GuardList";
import CycleList from "../../components/admin/CycleList";
import FinanceAdminList from "../../components/admin/FinanceAdminList";
import SystemAlerts from "../../components/admin/SystemAlerts";
import FinanceAdminScreen from "./FinanceAdminScreen";
import { adminService } from "../../services/admin.service";
import { userService } from "../../services/user.service";
import { cycleService } from "../../services/cycle.service";

import "./AdminScreen.css";

const AdminScreen = () => {
  const { currentUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [dashboardData, setDashboardData] = useState({
    students: { total: 0, active: 0, suspended: 0 },
    guards: { total: 0, active: 0 },
    cycles: { total: 0, available: 0, rented: 0, maintenance: 0 },
    finance: { totalFines: 0, collectedToday: 0, pendingFines: 0 },
    rentals: { activeRentals: 0, overdueRentals: 0, totalToday: 0 },
  });
  const [systemAlerts, setSystemAlerts] = useState([]);

  // Check user role to determine interface type
  const userRole = currentUser?.role;
  const isFinanceAdmin = userRole === "finance_admin";
  const isSuperAdmin = userRole === "super_admin";

  // If finance admin, show simplified interface
  if (isFinanceAdmin) {
    return <FinanceAdminScreen />;
  }

  useEffect(() => {
    if (isSuperAdmin) {
      fetchDashboardData();
    }
  }, [isSuperAdmin]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [
        studentsData,
        guardsData,
        cyclesData,
        financeData,
        rentalsData,
        alertsData,
      ] = await Promise.all([
        //userService.getStudentStats(),
        // userService.getGuardStats(),
        //  cycleService.getCycleStats(),
        //userService.getFinanceStats(),
        //rentService.getRentalStats(),
        userService.getSystemAlerts(),
      ]);

      setDashboardData({
        students: studentsData,
        guards: guardsData,
        cycles: cyclesData,
        finance: financeData,
        rentals: rentalsData,
      });

      setSystemAlerts(alertsData);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: <FaChartLine /> },
    { id: "students", label: "Students", icon: <FaUsers /> },
    { id: "guards", label: "Guards", icon: <FaUserShield /> },
    { id: "cycles", label: "Cycles", icon: <FaBicycle /> },
    {
      id: "finance-admins",
      label: "Finance Admins",
      icon: <FaMoneyBillWave />,
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return renderDashboard();
      case "students":
        return <StudentList />;
      case "guards":
        return <GuardList />;
      case "cycles":
        return <CycleList />;
      case "finance-admins":
        return <FinanceAdminList />;
      default:
        return renderDashboard();
    }
  };

  const renderDashboard = () => (
    <div className="admin-dashboard">
      {/* System Alerts */}
      {systemAlerts.length > 0 && (
        <SystemAlerts
          alerts={systemAlerts}
          onDismiss={(id) => {
            setSystemAlerts((alerts) =>
              alerts.filter((alert) => alert.id !== id)
            );
          }}
        />
      )}

      {/* Dashboard Cards */}
      <div className="dashboard-cards">
        <DashboardCard
          title="Total Students"
          value={dashboardData.students.total}
          icon={<FaUsers />}
          trend={`${dashboardData.students.active} Active`}
          subtitle={`${dashboardData.students.suspended} Suspended`}
          color="primary"
          onClick={() => setActiveTab("students")}
        />

        <DashboardCard
          title="Security Guards"
          value={dashboardData.guards.total}
          icon={<FaUserShield />}
          trend={`${dashboardData.guards.active} Active`}
          subtitle="On duty personnel"
          color="info"
          onClick={() => setActiveTab("guards")}
        />

        <DashboardCard
          title="Total Cycles"
          value={dashboardData.cycles.total}
          icon={<FaBicycle />}
          trend={`${dashboardData.cycles.available} Available`}
          subtitle={`${dashboardData.cycles.rented} Rented, ${dashboardData.cycles.maintenance} Maintenance`}
          color="success"
          onClick={() => setActiveTab("cycles")}
        />

        <DashboardCard
          title="Active Rentals"
          value={dashboardData.rentals.activeRentals}
          icon={<FaChartLine />}
          trend={`${dashboardData.rentals.totalToday} Today`}
          subtitle={`${dashboardData.rentals.overdueRentals} Overdue`}
          color="warning"
        />

        <DashboardCard
          title="Total Fines"
          value={`₹${dashboardData.finance.totalFines}`}
          icon={<FaMoneyBillWave />}
          trend={`₹${dashboardData.finance.collectedToday} Today`}
          subtitle={`₹${dashboardData.finance.pendingFines} Pending`}
          color="accent"
          onClick={() => setActiveTab("finance")}
        />

        <DashboardCard
          title="Maintenance Required"
          value={dashboardData.cycles.maintenance}
          icon={<FaCog />}
          trend="urgent"
          subtitle="Cycles need attention"
          color="danger"
        />
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-section">
        <h2>Quick Actions</h2>
        <div className="quick-actions-grid">
          <button
            className="quick-action-btn"
            onClick={() => setActiveTab("students")}
          >
            <FaPlus />
            <span>Add Student</span>
          </button>
          <button
            className="quick-action-btn"
            onClick={() => setActiveTab("guards")}
          >
            <FaPlus />
            <span>Add Guard</span>
          </button>
          <button
            className="quick-action-btn"
            onClick={() => setActiveTab("cycles")}
          >
            <FaPlus />
            <span>Add Cycle</span>
          </button>
          <button
            className="quick-action-btn"
            onClick={() => setActiveTab("finance")}
          >
            <FaPlus />
            <span>Add Finance admin</span>
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <LoadingSpinner message="Loading admin dashboard..." />;
  }

  return (
    <div className="admin-screen">
      <div className="admin-header">
        <div className="admin-title">
          <h1>Admin Portal</h1>
          <p>Complete system management and oversight</p>
        </div>
        <div className="admin-actions">
          <button className="notification-btn">
            <FaBell />
            {systemAlerts.length > 0 && (
              <span className="notification-badge">{systemAlerts.length}</span>
            )}
          </button>
        </div>
      </div>

      <div className="admin-content">
        <nav className="admin-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`admin-tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="admin-tab-content">{renderContent()}</div>
      </div>
    </div>
  );
};

export default AdminScreen;
