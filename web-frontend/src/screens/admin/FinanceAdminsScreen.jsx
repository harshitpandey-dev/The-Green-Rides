import React, { useState, useEffect } from "react";
import {
  FaUserShield,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaFilter,
  FaDownload,
} from "react-icons/fa";
import { userService } from "../../services/user.service";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import DataTable from "../../components/common/DataTable";
import AddEditFinanceAdminModal from "../../components/modals/AddEditFinanceAdminModal";
import "../../styles/screens/financeAdminsScreen.css";

const FinanceAdminsScreen = () => {
  const [financeAdmins, setFinanceAdmins] = useState([]);
  const [filteredAdmins, setFilteredAdmins] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [selectedFinanceAdmin, setSelectedFinanceAdmin] = useState(null);

  useEffect(() => {
    fetchFinanceAdmins();
  }, []);

  // Search and filter logic
  useEffect(() => {
    let filtered = financeAdmins.filter(
      (admin) =>
        (admin.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (admin.email || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filterStatus !== "all") {
      filtered = filtered.filter((admin) => admin.status === filterStatus);
    }

    setFilteredAdmins(filtered);
  }, [financeAdmins, searchTerm, filterStatus]);

  const fetchFinanceAdmins = async () => {
    try {
      setLoading(true);
      const data = await userService.getAllUsersByRole("finance_admin");
      setFinanceAdmins(data || []);
      setFilteredAdmins(data || []);
    } catch (err) {
      setError("Failed to load finance admins");
      console.error("Error fetching finance admins:", err);
    } finally {
      setLoading(false);
    }
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
    } catch (err) {
      setError(`Failed to update status: ${err.message}`);
      setTimeout(() => setError(""), 5000);
    }
  };

  const handleEditAdmin = (admin) => {
    setSelectedFinanceAdmin(admin);
    setShowAddEditModal(true);
  };

  const handleAddEditSuccess = async (updatedAdmin) => {
    if (selectedFinanceAdmin) {
      // Update existing student
      await userService.updateUser(selectedFinanceAdmin._id, updatedAdmin);
    } else {
      // Create new student
      await userService.createUser({
        ...updatedAdmin,
        role: "finance_admin",
      });
    }
    setShowAddEditModal(false);
    setSelectedFinanceAdmin(null);
    fetchFinanceAdmins();
  };

  const exportFinanceAdmins = () => {
    const csvContent = [
      ["Name", "Email", "Status", "Created Date", "Created By"],
      ...filteredAdmins.map((admin) => [
        admin.name,
        admin.email,
        admin.status,
        new Date(admin.createdAt).toLocaleDateString(),
        admin.createdBy?.name || "System",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "finance-admins.csv";
    a.click();
    window.URL.revokeObjectURL(url);
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
        <div className="header-actions">
          <button
            className="primary-btn"
            onClick={() => setShowAddEditModal(true)}
          >
            <FaPlus /> Add Finance Admin
          </button>
          <button className="secondary-btn" onClick={exportFinanceAdmins}>
            <FaDownload /> Export CSV
          </button>
        </div>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="status-filter">
          <FaFilter className="filter-icon" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="disabled">Disabled</option>
          </select>
        </div>
      </div>

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
          data={filteredAdmins}
          columns={columns}
          searchable={false}
          sortable={true}
          paginated={true}
          pageSize={10}
        />
      </div>

      <AddEditFinanceAdminModal
        isOpen={showAddEditModal}
        onClose={() => {
          setShowAddEditModal(false);
          setSelectedFinanceAdmin(null);
        }}
        onUpdate={handleAddEditSuccess}
        financeAdmin={selectedFinanceAdmin}
      />
    </div>
  );
};

export default FinanceAdminsScreen;
