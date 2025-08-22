import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaEdit,
  FaTrash,
  FaTools,
  FaFilter,
  FaDownload,
  FaBicycle,
  FaPlus,
} from "react-icons/fa";
import DataTable from "../../components/common/DataTable";
import AddEditCycleModal from "../../components/modals/AddEditCycleModal";
import { cycleService } from "../../services/cycle.service";
import "../../styles/screens/cyclesScreen.css";
import "../../styles/components/modals.css";

const CyclesScreen = () => {
  const [cycles, setCycles] = useState([]);
  const [filteredCycles, setFilteredCycles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [selectedCycle, setSelectingCycle] = useState(null);
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
        (cycle.cycleNumber || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (cycle.location || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filterStatus !== "all") {
      filtered = filtered.filter((cycle) => cycle.status === filterStatus);
    }
    setFilteredCycles(filtered);
  }, [cycles, searchTerm, filterStatus]);

  const columns = [
    {
      key: "cycleNumber",
      header: "Cycle number",
      sortable: true,
      render: (value) => <span className="entity-id">{value}</span>,
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (value) => (
        <span className={`status-badge status-${value}`}>
          {value ? value.charAt(0).toUpperCase() + value.slice(1) : "Unknown"}
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
      render: (value) => (
        <span className="count-badge rental-count">{value || 0}</span>
      ),
    },
    {
      key: "currentRental",
      header: "Currently rented to",
      sortable: true,
      render: (value) => (value ? value : "N/A"),
    },
    {
      key: "averageRating",
      header: "Rating",
      sortable: true,
      render: (value) => (value ? value : "N/A"),
    },
    {
      key: "total_maintenanceCount",
      header: "Total Maintenances",
      sortable: true,
      render: (value) => (value ? value : "N/A"),
    },
    {
      key: "createdAt",
      header: "Join Date",
      sortable: true,
      render: (value) => (value ? new Date(value).toLocaleDateString() : "N/A"),
    },
    {
      key: "actions",
      header: "Actions",
      render: (_, cycle) => (
        <div className="action-buttons">
          <button
            className="action-btn edit-btn"
            onClick={() => handleEditCycle(cycle)}
            title="Edit Cycle"
          >
            <FaEdit />
          </button>
          <button
            className="action-btn maintenance-btn"
            onClick={() => handleMaintenanceToggle(cycle)}
            title={
              cycle.status === "maintenance"
                ? "Mark as Available"
                : "Mark for Maintenance"
            }
          >
            <FaTools />
          </button>
          <button
            className="action-btn delete-btn"
            onClick={() => handleDeleteCycle(cycle)}
            title="Delete Cycle"
          >
            <FaTrash />
          </button>
        </div>
      ),
    },
  ];

  const handleEditCycle = (cycle) => {
    setSelectingCycle(cycle);
    setShowAddEditModal(true);
  };

  const handleDeleteCycle = async (cycle) => {
    if (
      window.confirm(
        `Are you sure you want to delete cycle ${cycle.cycleNumber}?`
      )
    ) {
      try {
        await cycleService.deleteCycle(cycle._id || cycle.id);
        fetchCycles();
      } catch (error) {
        console.error("Error deleting cycle:", error);
        alert("Failed to delete cycle. Please try again.");
      }
    }
  };

  const handleMaintenanceToggle = async (cycle) => {
    const newStatus =
      cycle.status === "under_maintenance" ? "available" : "under_maintenance";
    try {
      await cycleService.updateCycleStatus(cycle._id || cycle.id, newStatus);
      setCycles((prev) =>
        prev.map((c) =>
          (c._id || c.id) === (cycle._id || cycle.id)
            ? { ...c, status: newStatus }
            : c
        )
      );
      setFilteredCycles((prev) =>
        prev.map((c) =>
          (c._id || c.id) === (cycle._id || cycle.id)
            ? { ...c, status: newStatus }
            : c
        )
      );
    } catch (error) {
      console.error("Error updating cycle status:", error);
      alert("Failed to update cycle status. Please try again.");
    }
  };

  const handleUpdateCycle = async (cycleData) => {
    try {
      if (selectedCycle) {
        // Update existing cycle
        await cycleService.updateCycle(selectedCycle._id, cycleData);
      } else {
        // Create new cycle
        await cycleService.createCycle(cycleData);
      }
      setShowAddEditModal(false);
      setSelectingCycle(null);
      fetchCycles();
    } catch (error) {
      console.error("Error saving cycle:", error);
      alert("Failed to save cycle. Please try again.");
    }
  };

  const exportCycles = () => {
    const csvContent = [
      [
        "Cycle ID",
        "Status",
        "Location",
        "Rentals",
        "Condition",
        "Last Updated",
      ],
      ...filteredCycles.map((cycle) => [
        cycle.cycleNumber,
        cycle.status,
        cycle.location,
        cycle.totalRentCount,
        cycle.condition,
        new Date(cycle.updatedAt).toLocaleDateString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cycles.csv";
    a.click();
    window.URL.revokeObjectURL(url);
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
    <div className="screen-container">
      <div className="screen-header">
        <div className="header-content">
          <h1>
            <FaBicycle className="header-icon" />
            Cycles Management
          </h1>
          <p className="header-subtitle">
            Manage bicycle inventory, status, and maintenance
          </p>
        </div>
        <div className="header-actions">
          <button
            className="primary-btn"
            onClick={() => setShowAddEditModal(true)}
          >
            <FaPlus /> Add Cycle
          </button>
          <button className="secondary-btn" onClick={exportCycles}>
            <FaDownload /> Export CSV
          </button>
        </div>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by cycle ID or location..."
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
            <option value="available">Available</option>
            <option value="rented">Rented</option>
            <option value="maintenance">Maintenance</option>
            <option value="out-of-service">Out of Service</option>
          </select>
        </div>
      </div>

      <div className="stats-container">
        <div className="stat-card total">
          <h3>Total Cycles</h3>
          <p className="stat-number">{cycles.length}</p>
        </div>
        <div className="stat-card active">
          <h3>Available</h3>
          <p className="stat-number">
            {cycles.filter((c) => c.status === "available").length}
          </p>
        </div>
        <div className="stat-card suspended">
          <h3>Rented</h3>
          <p className="stat-number">
            {cycles.filter((c) => c.status === "rented").length}
          </p>
        </div>
        <div className="stat-card suspended">
          <h3>Maintenance</h3>
          <p className="stat-number">
            {cycles.filter((c) => c.status === "under_maintenance").length}
          </p>
        </div>
      </div>

      <div className="table-container">
        <DataTable
          data={filteredCycles}
          columns={columns}
          searchable={false}
          sortable={true}
          paginated={true}
          pageSize={10}
        />
      </div>

      <AddEditCycleModal
        cycle={selectedCycle}
        isOpen={showAddEditModal}
        onClose={() => setShowAddEditModal(false)}
        onUpdate={handleUpdateCycle}
      />
    </div>
  );
};

export default CyclesScreen;
