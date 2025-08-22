import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useUser } from "../../contexts/authContext";
import {
  FaTachometerAlt,
  FaUsers,
  FaBicycle,
  FaUserShield,
  FaMoneyBillWave,
  FaChartLine,
  FaCog,
  FaUser,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaHome,
  FaFileInvoiceDollar,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import logo from "../../assets/gogreen.png";
import "../../styles/components/sidebar.css";

const Sidebar = () => {
  const { currentUser, logout } = useUser();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Update body class when sidebar is collapsed
  useEffect(() => {
    // Always add sidebar-present class when component mounts
    document.body.classList.add("sidebar-present");

    if (isCollapsed) {
      document.body.classList.add("sidebar-collapsed");
    } else {
      document.body.classList.remove("sidebar-collapsed");
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove("sidebar-collapsed", "sidebar-present");
    };
  }, [isCollapsed]);

  const userRole = currentUser?.role;
  const isSuperAdmin = userRole === "super_admin";
  const isFinanceAdmin = userRole === "finance_admin";

  const superAdminItems = [
    { path: "/admin", icon: FaTachometerAlt, label: "Dashboard", exact: true },
    { path: "/admin/students", icon: FaUsers, label: "Students" },
    { path: "/admin/guards", icon: FaUserShield, label: "Guards" },
    { path: "/admin/cycles", icon: FaBicycle, label: "Cycles" },
    {
      path: "/admin/finance-admins",
      icon: FaMoneyBillWave,
      label: "Finance Admins",
    },
  ];

  const financeAdminItems = [
    {
      path: "/finance-admin",
      icon: FaTachometerAlt,
      label: "Dashboard",
      exact: true,
    },
    {
      path: "/finance-admin/transactions",
      icon: FaFileInvoiceDollar,
      label: "Transactions",
    },
    { path: "/finance-admin/reports", icon: FaChartLine, label: "Reports" },
    { path: "/finance-admin/settings", icon: FaCog, label: "Settings" },
  ];

  const menuItems = isSuperAdmin ? superAdminItems : financeAdminItems;

  const handleLogout = () => {
    logout();
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <>
      {/* Mobile menu button */}
      <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
        {isMobileOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <div
        className={`sidebar ${isCollapsed ? "collapsed" : ""} ${
          isMobileOpen ? "mobile-open" : ""
        }`}
      >
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <img src={logo} alt="Green Rides" className="brand-logo" />
            {!isCollapsed && (
              <div className="brand-content">
                <span className="brand-title">Green Rides</span>
                <span className="brand-subtitle">
                  {isSuperAdmin ? "Super Admin" : "Finance Admin"}
                </span>
              </div>
            )}
          </div>
          <button
            className="collapse-btn desktop-only"
            onClick={toggleCollapse}
            title={isCollapsed ? "Expand" : "Collapse"}
          >
            {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="sidebar-nav">
          <ul className="nav-list">
            {menuItems.map((item) => {
              const IconComponent = item.icon;

              return (
                <li key={item.path} className="nav-item">
                  <NavLink
                    to={item.path}
                    className="nav-link"
                    activeClassName="active"
                    exact={item.exact}
                    onClick={() => setIsMobileOpen(false)}
                  >
                    <IconComponent className="nav-icon" />
                    {!isCollapsed && (
                      <span className="nav-text">{item.label}</span>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              <FaUser />
            </div>
            {!isCollapsed && (
              <div className="user-details">
                <div className="user-name">{currentUser?.name}</div>
                <div className="user-role">
                  {isSuperAdmin ? "Super Admin" : "Finance Admin"}
                </div>
              </div>
            )}
          </div>

          <div className="sidebar-actions">
            <NavLink
              to="/profile"
              className="action-btn"
              title="Profile"
              onClick={() => setIsMobileOpen(false)}
            >
              <FaUser />
              {!isCollapsed && <span>Profile</span>}
            </NavLink>
            <button
              onClick={handleLogout}
              className="action-btn logout-btn"
              title="Logout"
            >
              <FaSignOutAlt />
              {!isCollapsed && <span>Logout</span>}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
