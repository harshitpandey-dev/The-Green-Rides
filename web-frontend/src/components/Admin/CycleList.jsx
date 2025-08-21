import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaEye,
  FaEdit,
  FaTools,
  FaFilter,
  FaPlus,
  FaChartLine,
} from "react-icons/fa";
import DataTable from "../common/DataTable";
import { cycleService } from "../../services/cycle.service";
import "./adminList.css";

const CycleList = () => {
  const [cycles, setCycles] = useState([]);
  const [filteredCycles, setFilteredCycles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedCycle, setSelectedCycle] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [modalType, setModalType] = useState("view");
  const [loading, setLoading] = useState(true);

  // Load cycles data from API
  useEffect(() => {
    fetchCycles();
  }, []);

  const fetchCycles = async () => {
    try {
      setLoading(true);
      const cyclesData = await cycleService.getAllCycles();

      setCycles(cyclesData);
      setFilteredCycles(cyclesData);
    } catch (error) {
      console.error("Error fetching cycles:", error);
      // Fallback to empty array on error
      setCycles([]);
      setFilteredCycles([]);
    } finally {
      setLoading(false);
    }
  };

  // Search and filter logic
  useEffect(() => {
    let filtered = cycles.filter(
      (cycle) =>
        cycle.cycleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cycle.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filterStatus !== "all") {
      filtered = filtered.filter((cycle) => cycle.status === filterStatus);
    }
    setFilteredCycles(filtered);
  }, [cycles, searchTerm, filterStatus]);

  const columns = [
    {
      key: "cycleNumber",
      header: "Cycle ID",
      sortable: true,
      render: (value) => <span className="cycle-id">{value}</span>,
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
      key: "status",
      header: "Rent Status",
      sortable: true,
      render: (value) => (
        <span className={`rent-status-badge rent-${value}`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      ),
    },
    {
      key: "location",
      header: "Location",
      sortable: true,
      render: (value) => <span className="location">{value}</span>,
    },
    {
      key: "totalRentCount",
      header: "Rentals",
      sortable: true,
      render: (value) => <span className="rental-count">{value}</span>,
    },
    {
      key: "actions",
      header: "Actions",
      render: (_, cycle) => (
        <div className="action-buttons">
          <button
            className="action-btn view-btn"
            onClick={() => handleViewCycle(cycle)}
            title="View Details"
          >
            <FaEye />
          </button>
          <button
            className="action-btn edit-btn"
            onClick={() => handleEditCycle(cycle)}
            title="Edit Cycle"
          >
            <FaEdit />
          </button>
          <button
            className="action-btn stats-btn"
            onClick={() => handleViewStats(cycle)}
            title="View Statistics"
          >
            <FaChartLine />
          </button>
          {cycle.status === "active" && (
            <button
              className="action-btn maintenance-btn"
              onClick={() => handleMaintenance(cycle)}
              title="Mark for Maintenance"
            >
              <FaTools />
            </button>
          )}
        </div>
      ),
    },
  ];

  const handleViewCycle = (cycle) => {
    setSelectedCycle(cycle);
    setModalType("view");
    setShowModal(true);
  };

  const handleEditCycle = (cycle) => {
    setSelectedCycle({ ...cycle });
    setModalType("edit");
    setShowModal(true);
  };

  const handleAddCycle = () => {
    setSelectedCycle({
      cycleNumber: "",
      status: "active",
      status: "available",
      location: "",
      battery_level: 100,
      totalRentCount: 0,
    });
    setModalType("add");
    setShowModal(true);
  };

  const handleViewStats = (cycle) => {
    setSelectedCycle(cycle);
    setShowStatsModal(true);
  };

  const handleMaintenance = (cycle) => {
    if (window.confirm(`Mark ${cycle.cycleNumber} for maintenance?`)) {
      setCycles((prev) =>
        prev.map((c) =>
          c.id === cycle.id
            ? {
                ...c,
                status: "maintenance",
                location: "Maintenance Hub",
              }
            : c
        )
      );
      console.log("Mark for maintenance:", cycle);
    }
  };

  const handleSaveCycle = (formData) => {
    if (modalType === "add") {
      const newCycle = {
        ...formData,
        id: `CYC${String(cycles.length + 1).padStart(3, "0")}`,
        last_maintenance: new Date().toISOString().split("T")[0],
        totalRentCount: 0,
      };
      setCycles((prev) => [...prev, newCycle]);
    } else if (modalType === "edit") {
      setCycles((prev) =>
        prev.map((cycle) =>
          cycle.id === selectedCycle.id ? { ...cycle, ...formData } : cycle
        )
      );
    }
    setShowModal(false);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading cycles...</p>
      </div>
    );
  }

  return (
    <div className="cycle-list">
      <div className="cycle-list-header">
        <h2>Cycle Management</h2>
        <div className="header-actions">
          <button className="add-btn" onClick={handleAddCycle}>
            <FaPlus /> Add Cycle
          </button>
        </div>
      </div>

      <div className="cycle-filters">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by cycle ID, location, or user..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <div className="status-filter">
            <FaFilter className="filter-icon" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="available">Active</option>
              <option value="rented">Rented</option>
              <option value="under_maintenance">Under maintenance</option>
              <option value="disabled">Unavailable</option>
            </select>
          </div>
        </div>
      </div>

      <div className="cycle-stats">
        <div className="stat-card">
          <h3>Total Cycles</h3>
          <p>{cycles.length}</p>
        </div>
        <div className="stat-card available">
          <h3>Available</h3>
          <p>{cycles.filter((c) => c.status === "available").length}</p>
        </div>
        <div className="stat-card rented">
          <h3>Currently Rented</h3>
          <p>{cycles.filter((c) => c.status === "rented").length}</p>
        </div>
        <div className="stat-card maintenance">
          <h3>In Maintenance</h3>
          <p>{cycles.filter((c) => c.status === "maintenance").length}</p>
        </div>
      </div>

      <DataTable
        data={filteredCycles}
        columns={columns}
        searchable={false}
        sortable={true}
        paginated={true}
        pageSize={10}
      />

      {showModal && selectedCycle && (
        <CycleModal
          cycle={selectedCycle}
          type={modalType}
          onSave={handleSaveCycle}
          onClose={() => setShowModal(false)}
        />
      )}

      {showStatsModal && selectedCycle && (
        <CycleStatsModal
          cycle={selectedCycle}
          onClose={() => setShowStatsModal(false)}
        />
      )}
    </div>
  );
};

// Cycle Modal Component
const CycleModal = ({ cycle, type, onSave, onClose }) => {
  const [formData, setFormData] = useState(cycle);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type: inputType } = e.target;
    const processedValue =
      inputType === "number" ? parseInt(value) || 0 : value;

    setFormData((prev) => ({ ...prev, [name]: processedValue }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.cycleNumber.trim())
      newErrors.cycleNumber = "Cycle ID is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";

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
              ? "Add New Cycle"
              : type === "edit"
              ? "Edit Cycle"
              : "Cycle Details"}
          </h3>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit} className="cycle-form">
            <div className="form-row">
              <div className="form-group">
                <label>Cycle ID</label>
                <input
                  type="text"
                  name="cycleNumber"
                  value={formData.cycleNumber}
                  onChange={handleInputChange}
                  readOnly={type === "edit" || isReadOnly}
                  className={errors.cycleNumber ? "error" : ""}
                />
                {errors.cycleNumber && (
                  <span className="error-text">{errors.cycleNumber}</span>
                )}
              </div>

              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  readOnly={isReadOnly}
                  className={errors.location ? "error" : ""}
                />
                {errors.location && (
                  <span className="error-text">{errors.location}</span>
                )}
              </div>
            </div>

            <div className="form-row">
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
                  <option value="maintenance">Maintenance</option>
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
                  <option value="available">Available</option>
                  <option value="rented">Rented</option>
                  <option value="unavailable">Unavailable</option>
                </select>
              </div>
            </div>

            {!isReadOnly && (
              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  {type === "add" ? "Add Cycle" : "Save Changes"}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

// Cycle Statistics Modal
const CycleStatsModal = ({ cycle, onClose }) => {
  const statsData = {
    usage: {
      totalRentals: cycle.totalRentCount,
      totalDistance: cycle.total_distance,
      averageRentalDuration: "2.5 hours",
      utilizationRate: "78%",
    },
    maintenance: {
      lastMaintenanceAt: cycle.last_maintenance,
      nextMaintenanceDate: "2024-02-10",
      maintenanceCount: 3,
      totalDowntime: "12 hours",
    },
    performance: {
      batteryHealth: "Good",
      averageBatteryLife: "6.5 hours",
      energyEfficiency: "92%",
      performanceScore: "8.5/10",
    },
    financial: {
      totalRevenue: "₹2,340",
      averageRevenuePerRental: "₹52",
      maintenanceCost: "₹450",
      profitability: "₹1,890",
    },
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content stats-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>Statistics for {cycle.cycleNumber}</h3>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="stats-grid">
            <div className="stats-section">
              <h4>Usage Statistics</h4>
              <div className="stats-items">
                <div className="stat-item">
                  <span className="stat-label">Total Rentals</span>
                  <span className="stat-value">
                    {statsData.usage.totalRentals}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Total Distance</span>
                  <span className="stat-value">
                    {statsData.usage.totalDistance} km
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Avg Rental Duration</span>
                  <span className="stat-value">
                    {statsData.usage.averageRentalDuration}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Utilization Rate</span>
                  <span className="stat-value">
                    {statsData.usage.utilizationRate}
                  </span>
                </div>
              </div>
            </div>

            <div className="stats-section">
              <h4>Maintenance History</h4>
              <div className="stats-items">
                <div className="stat-item">
                  <span className="stat-label">Last Maintenance</span>
                  <span className="stat-value">
                    {new Date(
                      statsData.maintenance.lastMaintenanceAt
                    ).toLocaleDateString()}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Next Maintenance</span>
                  <span className="stat-value">
                    {new Date(
                      statsData.maintenance.nextMaintenanceDate
                    ).toLocaleDateString()}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Maintenance Count</span>
                  <span className="stat-value">
                    {statsData.maintenance.maintenanceCount}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Total Downtime</span>
                  <span className="stat-value">
                    {statsData.maintenance.totalDowntime}
                  </span>
                </div>
              </div>
            </div>

            <div className="stats-section">
              <h4>Performance Metrics</h4>
              <div className="stats-items">
                <div className="stat-item">
                  <span className="stat-label">Battery Health</span>
                  <span className="stat-value good">
                    {statsData.performance.batteryHealth}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Avg Battery Life</span>
                  <span className="stat-value">
                    {statsData.performance.averageBatteryLife}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Energy Efficiency</span>
                  <span className="stat-value">
                    {statsData.performance.energyEfficiency}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Performance Score</span>
                  <span className="stat-value excellent">
                    {statsData.performance.performanceScore}
                  </span>
                </div>
              </div>
            </div>

            <div className="stats-section">
              <h4>Financial Summary</h4>
              <div className="stats-items">
                <div className="stat-item">
                  <span className="stat-label">Total Revenue</span>
                  <span className="stat-value revenue">
                    {statsData.financial.totalRevenue}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Avg Revenue/Rental</span>
                  <span className="stat-value">
                    {statsData.financial.averageRevenuePerRental}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Maintenance Cost</span>
                  <span className="stat-value cost">
                    {statsData.financial.maintenanceCost}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Net Profitability</span>
                  <span className="stat-value profit">
                    {statsData.financial.profitability}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CycleList;
