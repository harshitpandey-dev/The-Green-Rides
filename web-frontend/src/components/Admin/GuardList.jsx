import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaEdit,
  FaTrash,
  FaEye,
  FaKey,
  FaFilter,
  FaUserPlus,
  FaUserShield,
} from "react-icons/fa";
import DataTable from "../common/DataTable";
import { userService } from "../../services/user.service";
import "./adminList.css";

const GuardList = () => {
  const [guards, setGuards] = useState([]);
  const [filteredGuards, setFilteredGuards] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedGuard, setSelectedGuard] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalType, setModalType] = useState("view"); // 'view', 'edit', 'add'
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
      // Fallback to empty array on error
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
        guard.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guard.guard_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guard.email.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleViewGuard = (guard) => {
    setSelectedGuard(guard);
    setModalType("view");
    setShowModal(true);
  };

  const handleEditGuard = (guard) => {
    setSelectedGuard(guard);
    setModalType("edit");
    setShowModal(true);
  };

  const handleAddGuard = () => {
    setSelectedGuard({
      guard_id: "",
      name: "",
      email: "",
      phone: "",
      shift: "Morning",
      status: "active",
    });
    setModalType("add");
    setShowModal(true);
  };

  const handleDeleteGuard = async (guard) => {
    if (
      window.confirm(`Are you sure you want to delete guard ${guard.name}?`)
    ) {
      try {
        await userService.deleteUser(guard._id || guard.id);
        // Refresh the list after deletion
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
      // Update local state
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

  const handleSaveGuard = (formData) => {
    if (modalType === "add") {
      const newGuard = {
        ...formData,
        id: `GRD${String(guards.length + 1).padStart(3, "0")}`,
        join_date: new Date().toISOString().split("T")[0],
        last_login: "Never",
        cycles_assigned: 0,
      };
      setGuards((prev) => [...prev, newGuard]);
    } else if (modalType === "edit") {
      setGuards((prev) =>
        prev.map((guard) =>
          guard.id === selectedGuard.id ? { ...guard, ...formData } : guard
        )
      );
    }
    setShowModal(false);
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
    <div className="admin-list-container">
      <div className="list-header">
        <div className="header-content">
          <h2>
            <FaUserShield />
            Security Guard Management
          </h2>
          <p>Manage security personnel and shift assignments</p>
        </div>
        <div className="header-actions">
          <button className="add-btn" onClick={handleAddGuard}>
            <FaUserPlus /> Add Guard
          </button>
        </div>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by name, guard ID, or email..."
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
            <option value="inactive">Inactive</option>
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
        <div className="stat-card available">
          <h3>Morning Shift</h3>
          <p className="stat-number">
            {guards.filter((g) => g.shift === "Morning").length}
          </p>
        </div>
        <div className="stat-card rented">
          <h3>Evening Shift</h3>
          <p className="stat-number">
            {guards.filter((g) => g.shift === "Evening").length}
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

      {showModal && selectedGuard && (
        <GuardModal
          guard={selectedGuard}
          type={modalType}
          onSave={handleSaveGuard}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

// Guard Modal Component
const GuardModal = ({ guard, type, onSave, onClose }) => {
  const [formData, setFormData] = useState(guard);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (type === "add" && !formData.guard_id.trim())
      newErrors.guard_id = "Guard ID is required";

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    // Phone validation
    const phoneRegex = /^\+91-\d{10}$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = "Phone must be in format: +91-XXXXXXXXXX";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  const isReadOnly = type === "view";

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            {type === "add"
              ? "Add New Guard"
              : type === "edit"
              ? "Edit Guard"
              : "Guard Details"}
          </h3>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit} className="guard-form">
            <div className="form-row">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  readOnly={isReadOnly}
                  className={errors.name ? "error" : ""}
                />
                {errors.name && (
                  <span className="error-text">{errors.name}</span>
                )}
              </div>

              {type !== "add" && (
                <>
                  <div className="form-group">
                    <label>Join Date</label>
                    <input
                      type="text"
                      value={new Date(formData.join_date).toLocaleDateString()}
                      readOnly
                    />
                  </div>
                </>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  readOnly={isReadOnly}
                  className={errors.email ? "error" : ""}
                />
                {errors.email && (
                  <span className="error-text">{errors.email}</span>
                )}
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  readOnly={isReadOnly}
                  placeholder="+91-XXXXXXXXXX"
                  className={errors.phone ? "error" : ""}
                />
                {errors.phone && (
                  <span className="error-text">{errors.phone}</span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Shift</label>
                <select
                  name="shift"
                  value={formData.guardShift}
                  onChange={handleInputChange}
                  disabled={isReadOnly}
                >
                  <option value="Morning">Morning</option>
                  <option value="Evening">Evening</option>
                  <option value="Night">Night</option>
                </select>
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  disabled={isReadOnly}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            {!isReadOnly && (
              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  {type === "add" ? "Add Guard" : "Save Changes"}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default GuardList;
