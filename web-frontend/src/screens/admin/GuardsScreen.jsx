import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaEdit,
  FaTrash,
  FaFilter,
  FaDownload,
  FaUserShield,
  FaPlus,
} from "react-icons/fa";
import DataTable from "../../components/common/DataTable";
import EditGuardModal from "../../components/modals/EditGuardModal";
import { userService } from "../../services/user.service";
import "../../styles/screens/guardsScreen.css";
import "../../styles/components/modals.css";

const GuardsScreen = () => {
  const [guards, setGuards] = useState([]);
  const [filteredGuards, setFilteredGuards] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingGuard, setEditingGuard] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load guards data from API
  useEffect(() => {
    fetchGuards();
  }, []);

  const fetchGuards = async () => {
    try {
      setLoading(true);
      const guardsData = await userService.getAllUsersByRole("guard");
      setGuards(guardsData);
      setFilteredGuards(guardsData);
    } catch (error) {
      console.error("Error fetching guards:", error);
      setGuards([]);
      setFilteredGuards([]);
    } finally {
      setLoading(false);
    }
  };

  // Search and filter logic
  useEffect(() => {
    let filtered = guards.filter(
      (guard) =>
        (guard.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (guard.email || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filterStatus !== "all") {
      filtered = filtered.filter((guard) => guard.status === filterStatus);
    }

    setFilteredGuards(filtered);
  }, [guards, searchTerm, filterStatus]);

  const columns = [
    {
      key: "name",
      header: "Name",
      sortable: true,
      render: (value) => <span className="entity-name">{value}</span>,
    },
    {
      key: "email",
      header: "Email",
      sortable: true,
    },
    {
      key: "phone",
      header: "Phone",
      sortable: false,
    },
    {
      key: "shift",
      header: "Shift",
      sortable: true,
      render: (value) => (
        <span className={`shift-badge shift-${value?.toLowerCase()}`}>
          {value}
        </span>
      ),
    },
    {
      key: "cycles_assigned",
      header: "Cycles",
      sortable: true,
      render: (value) => (
        <span className="count-badge cycle-count">{value}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (value) => (
        <span className={`status-badge status-${value}`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (_, guard) => (
        <div className="action-buttons">
          <button
            className="action-btn edit-btn"
            onClick={() => handleEditGuard(guard)}
            title="Edit Guard"
          >
            <FaEdit />
          </button>
          <button
            className={`action-btn status-btn ${
              guard.status === "active" ? "disable-btn" : "enable-btn"
            }`}
            onClick={() => handleToggleStatus(guard)}
            title={
              guard.status === "active" ? "Deactivate Guard" : "Activate Guard"
            }
          >
            {guard.status === "active" ? "🔒" : "🔓"}
          </button>
          <button
            className="action-btn delete-btn"
            onClick={() => handleDeleteGuard(guard)}
            title="Delete Guard"
          >
            <FaTrash />
          </button>
        </div>
      ),
    },
  ];

  const handleEditGuard = (guard) => {
    setEditingGuard(guard);
    setShowEditModal(true);
  };

  const handleDeleteGuard = async (guard) => {
    if (
      window.confirm(`Are you sure you want to delete guard ${guard.name}?`)
    ) {
      try {
        await userService.deleteUser(guard._id || guard.id);
        fetchGuards();
      } catch (error) {
        console.error("Error deleting guard:", error);
        alert("Failed to delete guard. Please try again.");
      }
    }
  };

  const handleToggleStatus = async (guard) => {
    const newStatus = guard.status === "active" ? "disabled" : "active";
    try {
      await userService.updateUserStatus(guard._id || guard.id, newStatus);
      setGuards((prev) =>
        prev.map((g) =>
          (g._id || g.id) === (guard._id || guard.id)
            ? { ...g, status: newStatus }
            : g
        )
      );
      setFilteredGuards((prev) =>
        prev.map((g) =>
          (g._id || g.id) === (guard._id || guard.id)
            ? { ...g, status: newStatus }
            : g
        )
      );
    } catch (error) {
      console.error("Error updating guard status:", error);
      alert("Failed to update guard status. Please try again.");
    }
  };

  const handleUpdateGuard = async (guardData) => {
    try {
      if (editingGuard) {
        // Update existing guard
        await userService.updateUser(editingGuard._id, guardData);
      } else {
        // Create new guard
        await userService.createUser({
          ...guardData,
          role: "guard",
        });
      }
      setShowEditModal(false);
      setEditingGuard(null);
      fetchGuards();
    } catch (error) {
      console.error("Error saving guard:", error);
      alert("Failed to save guard. Please try again.");
    }
  };

  const exportGuards = () => {
    const csvContent = [
      ["Name", "Email", "Phone", "Shift", "Cycles", "Status", "Join Date"],
      ...filteredGuards.map((guard) => [
        guard.name,
        guard.email,
        guard.phone,
        guard.shift,
        guard.cycles_assigned,
        guard.status,
        new Date(guard.joinDate).toLocaleDateString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "guards.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading guards...</p>
      </div>
    );
  }

  return (
    <div className="screen-container">
      <div className="screen-header">
        <div className="header-content">
          <h1>
            <FaUserShield className="header-icon" />
            Guards Management
          </h1>
          <p className="header-subtitle">
            Manage security guard accounts and assignments
          </p>
        </div>
        <div className="header-actions">
          <button
            className="primary-btn"
            onClick={() => setShowEditModal(true)}
          >
            <FaPlus /> Add Guard
          </button>
          <button className="secondary-btn" onClick={exportGuards}>
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

      <div className="stats-container">
        <div className="stat-card total">
          <h3>Total Guards</h3>
          <p className="stat-number">{guards.length}</p>
        </div>
        <div className="stat-card active">
          <h3>Active Guards</h3>
          <p className="stat-number">
            {guards.filter((g) => g.status === "active").length}
          </p>
        </div>
        <div className="stat-card suspended">
          <h3>On Duty</h3>
          <p className="stat-number">
            {guards.filter((g) => g.shift && g.status === "active").length}
          </p>
        </div>
        <div className="stat-card suspended">
          <h3>Disabled Guards</h3>
          <p className="stat-number">
            {guards.filter((g) => g.status === "disabled").length}
          </p>
        </div>
      </div>

      <div className="table-container">
        <DataTable
          data={filteredGuards}
          columns={columns}
          searchable={false}
          sortable={true}
          paginated={true}
          pageSize={10}
        />
      </div>

      <EditGuardModal
        guard={editingGuard}
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onUpdate={handleUpdateGuard}
      />
    </div>
  );
};

export default GuardsScreen;
