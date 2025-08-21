import React, { useState, useEffect } from "react";
import { FaUserShield, FaPlus, FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { userService } from "../../services/user.service";
import LoadingSpinner from "../common/LoadingSpinner";
import DataTable from "../common/DataTable";
import CreateFinanceAdmin from "./CreateFinanceAdmin";
import "./FinanceAdminList.css";

const FinanceAdminList = () => {
  const [financeAdmins, setFinanceAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchFinanceAdmins();
  }, []);

  const fetchFinanceAdmins = async () => {
    try {
      setLoading(true);
      const data = await userService.getAllUsersByRole("finance_admin");
      setFinanceAdmins(data || []);
    } catch (err) {
      setError("Failed to load finance admins");
      console.error("Error fetching finance admins:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSuccess = (newAdmin) => {
    setFinanceAdmins((prev) => [...prev, newAdmin]);
    setMessage(`Finance admin "${newAdmin.name}" created successfully!`);
    setTimeout(() => setMessage(""), 5000);
  };

  const handleDeleteAdmin = async (admin) => {
    if (
      window.confirm(
        `Are you sure you want to delete finance admin "${admin.name}"?`
      )
    ) {
      try {
        await userService.deleteUser(admin._id);
        setFinanceAdmins((prev) => prev.filter((a) => a._id !== admin._id));
        setMessage(`Finance admin "${admin.name}" deleted successfully!`);
        setTimeout(() => setMessage(""), 5000);
      } catch (err) {
        setError(`Failed to delete finance admin: ${err.message}`);
        setTimeout(() => setError(""), 5000);
      }
    }
  };

  const handleUpdateStatus = async (admin, newStatus) => {
    try {
      const updatedAdmin = await userService.updateUserStatus(
        admin._id,
        newStatus
      );
      setFinanceAdmins((prev) =>
        prev.map((a) =>
          a._id === admin._id ? { ...a, status: updatedAdmin?.status } : a
        )
      );
      setMessage(`Finance admin status updated successfully!`);
      setTimeout(() => setMessage(""), 5000);
    } catch (err) {
      setError(`Failed to update status: ${err.message}`);
      setTimeout(() => setError(""), 5000);
    }
  };

  const columns = [
    {
      key: "name",
      header: "Name",
      sortable: true,
      render: (value) => <span className="admin-name">{value || "N/A"}</span>,
    },
    {
      key: "email",
      header: "Email",
      sortable: true,
      render: (value) => <span className="admin-email">{value || "N/A"}</span>,
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (value) => (
        <span className={`status-badge status-${value || "unknown"}`}>
          {value && typeof value === "string"
            ? value.charAt(0).toUpperCase() + value.slice(1)
            : "Unknown"}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Created Date",
      sortable: true,
      render: (value) => (value ? new Date(value).toLocaleDateString() : "N/A"),
    },
    {
      key: "createdBy",
      header: "Created By",
      sortable: false,
      render: (value, admin) => (
        <span className="created-by">{admin.createdBy?.name || "System"}</span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (_, admin) => (
        <div className="action-buttons">
          <button
            className="action-btn view-btn"
            onClick={() => handleViewAdmin(admin)}
            title="View Details"
          >
            <FaEye />
          </button>
          <button
            className={`action-btn status-btn ${
              admin.status === "active" ? "disable-btn" : "enable-btn"
            }`}
            onClick={() =>
              handleUpdateStatus(
                admin,
                admin.status === "active" ? "disabled" : "active"
              )
            }
            title={admin.status === "active" ? "Disable Admin" : "Enable Admin"}
          >
            {admin.status === "active" ? "🔒" : "🔓"}
          </button>
          <button
            className="action-btn delete-btn"
            onClick={() => handleDeleteAdmin(admin)}
            title="Delete Admin"
          >
            <FaTrash />
          </button>
        </div>
      ),
    },
  ];

  const handleViewAdmin = (admin) => {
    // Implement view admin details modal or redirect
    console.log("View admin:", admin);
  };

  if (loading) {
    return <LoadingSpinner message="Loading finance admins..." />;
  }

  return (
    <div className="finance-admin-list">
      <div className="list-header">
        <div className="header-content">
          <h2>
            <FaUserShield />
            Finance Administrators
          </h2>
          <p>Manage finance admin accounts and permissions</p>
        </div>
        <button
          className="create-admin-btn"
          onClick={() => setShowCreateModal(true)}
        >
          <FaPlus />
          Add Finance Admin
        </button>
      </div>

      {message && <div className="success-message">{message}</div>}

      {error && <div className="error-message">{error}</div>}

      <div className="stats-cards">
        <div className="stat-card">
          <h3>Total Finance Admins</h3>
          <p className="stat-number">{financeAdmins.length}</p>
        </div>
        <div className="stat-card">
          <h3>Active Admins</h3>
          <p className="stat-number">
            {financeAdmins.filter((admin) => admin.status === "active").length}
          </p>
        </div>
        <div className="stat-card">
          <h3>Disabled Admins</h3>
          <p className="stat-number">
            {
              financeAdmins.filter((admin) => admin.status === "disabled")
                .length
            }
          </p>
        </div>
      </div>

      <div className="table-container">
        <DataTable
          data={financeAdmins}
          columns={columns}
          searchable={true}
          sortable={true}
          paginated={true}
          pageSize={10}
        />
      </div>

      <CreateFinanceAdmin
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
};

export default FinanceAdminList;
