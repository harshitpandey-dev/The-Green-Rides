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
import SystemAlerts from "../../components/admin/SystemAlerts";
import FinanceAdminScreen from "../financeAdmin/FinanceAdminScreen";
import { userService } from "../../services/user.service";
import "../../styles/screens/dashboardScreen.css";

const DashboardScreen = () => {
  const { currentUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    students: { total: 0, active: 0, suspended: 0 },
    guards: { total: 0, active: 0 },
    cycles: { total: 0, available: 0, rented: 0, maintenance: 0 },
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

      const [statsData] = await Promise.all([userService.getUsersStatistics()]);

      setDashboardData({
        students: statsData.studentsData,
        guards: statsData.guardsData,
        cycles: statsData.cyclesData,
        rentals: statsData.rentalsData,
      });
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading admin dashboard..." />;
  }

  return (
    <div className="screen-container">
      {/* Page Header */}
      <div className="screen-header">
        <div className="header-content">
          <h1>
            <FaChartLine className="header-icon" />
            Admin Dashboard
          </h1>
          <p className="header-subtitle">
            Complete system management and oversight
          </p>
        </div>
        <div className="header-actions">
          <button className="notification-btn">
            <FaBell />
            {systemAlerts.length > 0 && (
              <span className="notification-badge">{systemAlerts.length}</span>
            )}
          </button>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="dashboard-content">
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
        <div className="stats-grid dashboard-cards">
          <DashboardCard
            title="Total Students"
            value={dashboardData.students.total}
            icon={<FaUsers />}
            trend={`${dashboardData.students.active} Active`}
            subtitle={`${dashboardData.students.suspended} Suspended`}
            color="primary"
          />

          <DashboardCard
            title="Security Guards"
            value={dashboardData.guards.total}
            icon={<FaUserShield />}
            trend={`${dashboardData.guards.active} Active`}
            subtitle="On duty personnel"
            color="info"
          />

          <DashboardCard
            title="Total Cycles"
            value={dashboardData.cycles.total}
            icon={<FaBicycle />}
            trend={`${dashboardData.cycles.available} Available`}
            subtitle={`${dashboardData.cycles.rented} Rented, ${dashboardData.cycles.maintenance} Maintenance`}
            color="success"
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
            title="Maintenance Required"
            value={dashboardData.cycles.maintenance}
            icon={<FaCog />}
            trend="urgent"
            subtitle="Cycles need attention"
            color="danger"
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardScreen;
