import React, { useState, useEffect } from "react";
import { FaUserShield, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { userService } from "../../services/user.service";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import DataTable from "../../components/common/DataTable";
import EditFinanceAdminModal from "../../components/modals/EditFinanceAdminModal";
import "../../styles/screens/financeAdminsScreen.css";

const FinanceAdminsScreen = () => {
  const [financeAdmins, setFinanceAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
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

  const handleEditAdmin = (admin) => {
    setEditingAdmin(admin);
    setShowCreateModal(true);
  };

  const handleEditSuccess = (updatedAdmin) => {
    setFinanceAdmins((prev) =>
      prev.map((admin) =>
        admin._id === updatedAdmin._id ? { ...admin, ...updatedAdmin } : admin
      )
    );
    setMessage(`Finance admin "${updatedAdmin.name}" updated successfully!`);
    setShowCreateModal(false);
    setEditingAdmin(null);
    setTimeout(() => setMessage(""), 5000);
  };

  const columns = [
    {
      key: "name",
      header: "Name",
      sortable: true,
      render: (value) => <span className="entity-name">{value || "N/A"}</span>,
    },
    {
      key: "email",
      header: "Email",
      sortable: true,
      render: (value) => <span className="email">{value || "N/A"}</span>,
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
            className="action-btn edit-btn"
            onClick={() => handleEditAdmin(admin)}
            title="Edit Admin"
          >
            <FaEdit />
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

  if (loading) {
    return <LoadingSpinner message="Loading finance admins..." />;
  }

  return (
    <div className="screen-container">
      <div className="screen-header">
        <div className="header-content">
          <h1>
            <FaUserShield className="header-icon" />
            Finance Administrators
          </h1>
          <p className="header-subtitle">
            Manage finance admin accounts and permissions
          </p>
        </div>
        <button
          className="primary-btn"
          onClick={() => setShowCreateModal(true)}
        >
          <FaPlus />
          Add Finance Admin
        </button>
      </div>

      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}

      <div className="stats-grid">
        <div className="stat-card total">
          <h3>Total Finance Admins</h3>
          <p className="stat-number">{financeAdmins.length}</p>
        </div>
        <div className="stat-card active">
          <h3>Active Admins</h3>
          <p className="stat-number">
            {financeAdmins.filter((admin) => admin.status === "active").length}
          </p>
        </div>
        <div className="stat-card inactive">
          <h3>Disabled Admins</h3>
          <p className="stat-number">
            {
              financeAdmins.filter((admin) => admin.status === "disabled")
                .length
            }
          </p>
        </div>
      </div>

      <div className="table-section">
        <DataTable
          data={financeAdmins}
          columns={columns}
          searchable={true}
          sortable={true}
          paginated={true}
          pageSize={10}
        />
      </div>

      <EditFinanceAdminModal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setEditingAdmin(null);
        }}
        onSuccess={editingAdmin ? handleEditSuccess : handleCreateSuccess}
        editMode={!!editingAdmin}
        adminData={editingAdmin}
      />
    </div>
  );
};

export default FinanceAdminsScreen;
