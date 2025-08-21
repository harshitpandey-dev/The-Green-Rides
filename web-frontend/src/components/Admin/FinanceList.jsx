import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaMoneyBillWave,
  FaEye,
  FaCheck,
  FaFilter,
  FaDownload,
} from "react-icons/fa";
import DataTable from "../common/DataTable";
import { financeService } from "../../services/finance.service";
import "./FinanceList.css";

const FinanceList = ({ onDataUpdate }) => {
  const [fines, setFines] = useState([]);
  const [filteredFines, setFilteredFines] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedFine, setSelectedFine] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [quickSearchRoll, setQuickSearchRoll] = useState("");
  const [quickSearchResult, setQuickSearchResult] = useState(null);

  // Load fines data from API
  useEffect(() => {
    fetchFines();
  }, []);

  const fetchFines = async () => {
    try {
      setLoading(true);
      const finesData = await financeService.getAllFines();

      // Transform API response to match component format
      const transformedFines = finesData.map((fine) => ({
        id: fine._id,
        roll_no: fine.rollNumber || fine.rollNo || fine.student?.rollNumber,
        student_name: fine.studentName || fine.student?.name || "Unknown",
        fine_amount: fine.amount || fine.fineAmount || 0,
        reason: fine.reason || "Late Return",
        fine_date: fine.createdAt || fine.fineDate || "2024-01-10",
        due_date: fine.dueDate || "2024-01-20",
        status: fine.status || "pending",
        rental_id: fine.rentalId || fine.rental?._id,
        cycle_id: fine.cycleId || fine.cycle?.cycleId,
        fine_type: fine.fineType || fine.type || "late_return",
        days_overdue: fine.daysOverdue || 0,
      }));

      setFines(transformedFines);
      setFilteredFines(transformedFines);
    } catch (error) {
      console.error("Error fetching fines:", error);
      // Fallback to empty array on error
      setFines([]);
      setFilteredFines([]);
    } finally {
      setLoading(false);
    }
  };

  // Search and filter logic
  useEffect(() => {
    let filtered = fines.filter(
      (fine) =>
        fine.roll_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fine.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fine.reason.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filterStatus !== "all") {
      filtered = filtered.filter((fine) => fine.status === filterStatus);
    }

    setFilteredFines(filtered);
  }, [fines, searchTerm, filterStatus]);

  const columns = [
    {
      key: "roll_no",
      header: "Roll Number",
      sortable: true,
      render: (value) => <span className="roll-number">{value}</span>,
    },
    {
      key: "student_name",
      header: "Student Name",
      sortable: true,
      render: (value) => <span className="student-name">{value}</span>,
    },
    {
      key: "fine_amount",
      header: "Fine Amount",
      sortable: true,
      render: (value) => (
        <span className="fine-amount">₹{value.toFixed(2)}</span>
      ),
    },
    {
      key: "reason",
      header: "Reason",
      sortable: true,
      render: (value) => <span className="fine-reason">{value}</span>,
    },
    {
      key: "fine_date",
      header: "Fine Date",
      sortable: true,
      render: (value) => (
        <span className="fine-date">
          {new Date(value).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "due_date",
      header: "Due Date",
      sortable: true,
      render: (value) => (
        <span className="due-date">{new Date(value).toLocaleDateString()}</span>
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
      sortable: false,
      render: (_, row) => (
        <div className="action-buttons">
          <button
            className="action-btn view"
            onClick={() => handleView(row)}
            title="View Details"
          >
            <FaEye />
          </button>
          {row.status === "pending" && (
            <button
              className="action-btn approve"
              onClick={() => handlePayment(row)}
              title="Mark as Paid"
            >
              <FaCheck />
            </button>
          )}
        </div>
      ),
    },
  ];

  const handleView = (fine) => {
    setSelectedFine(fine);
    setShowModal(true);
  };

  const handlePayment = async (fine) => {
    try {
      await financeService.markFinePaid(fine.id);
      // Refresh data after successful payment
      fetchFines();
      if (onDataUpdate) onDataUpdate(); // Update parent component data
    } catch (error) {
      console.error("Error marking fine as paid:", error);
      alert("Failed to mark fine as paid. Please try again.");
    }
  };

  const handleQuickSearch = async () => {
    if (!quickSearchRoll.trim()) {
      setQuickSearchResult(null);
      return;
    }

    try {
      const result = await financeService.getStudentFines(quickSearchRoll);
      setQuickSearchResult(result);
    } catch (error) {
      console.error("Error searching student fines:", error);
      setQuickSearchResult({ error: "Student not found or no fines" });
    }
  };

  const getTotalPendingFines = () => {
    return filteredFines
      .filter((fine) => fine.status === "pending")
      .reduce((total, fine) => total + fine.fine_amount, 0);
  };

  const getTotalCollectedFines = () => {
    return filteredFines
      .filter((fine) => fine.status === "paid")
      .reduce((total, fine) => total + fine.fine_amount, 0);
  };

  return (
    <div className="finance-list">
      <div className="finance-header">
        <div className="finance-title">
          <h2>
            <FaMoneyBillWave /> Finance Management
          </h2>
          <p>Track fines, payments, and financial transactions</p>
        </div>

        <div className="finance-stats">
          <div className="stat-card pending">
            <h4>Pending Fines</h4>
            <span>₹{getTotalPendingFines().toFixed(2)}</span>
          </div>
          <div className="stat-card collected">
            <h4>Collected Fines</h4>
            <span>₹{getTotalCollectedFines().toFixed(2)}</span>
          </div>
          <div className="stat-card total">
            <h4>Total Fines</h4>
            <span>{filteredFines.length}</span>
          </div>
        </div>
      </div>

      <div className="finance-controls">
        <div className="search-section">
          <div className="search-input">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by roll number, name, or reason..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-section">
            <FaFilter className="filter-icon" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
        </div>

        <div className="quick-search">
          <input
            type="text"
            placeholder="Quick search by roll number"
            value={quickSearchRoll}
            onChange={(e) => setQuickSearchRoll(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleQuickSearch()}
          />
          <button onClick={handleQuickSearch}>Search</button>
        </div>
      </div>

      {quickSearchResult && (
        <div className="quick-search-result">
          {quickSearchResult.error ? (
            <p className="error">{quickSearchResult.error}</p>
          ) : (
            <div className="student-fine-summary">
              <h4>Student Fine Summary</h4>
              <p>
                Total Fines: ₹
                {quickSearchResult.totalFines?.toFixed(2) || "0.00"}
              </p>
              <p>
                Pending Fines: ₹
                {quickSearchResult.pendingFines?.toFixed(2) || "0.00"}
              </p>
            </div>
          )}
        </div>
      )}

      <div className="finance-content">
        <DataTable
          data={filteredFines}
          columns={columns}
          loading={loading}
          emptyMessage="No fines found"
        />
      </div>

      {showModal && selectedFine && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Fine Details</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="fine-details">
                <div className="detail-row">
                  <strong>Roll Number:</strong>
                  <span>{selectedFine.roll_no}</span>
                </div>
                <div className="detail-row">
                  <strong>Student Name:</strong>
                  <span>{selectedFine.student_name}</span>
                </div>
                <div className="detail-row">
                  <strong>Fine Amount:</strong>
                  <span>₹{selectedFine.fine_amount.toFixed(2)}</span>
                </div>
                <div className="detail-row">
                  <strong>Reason:</strong>
                  <span>{selectedFine.reason}</span>
                </div>
                <div className="detail-row">
                  <strong>Fine Date:</strong>
                  <span>
                    {new Date(selectedFine.fine_date).toLocaleDateString()}
                  </span>
                </div>
                <div className="detail-row">
                  <strong>Due Date:</strong>
                  <span>
                    {new Date(selectedFine.due_date).toLocaleDateString()}
                  </span>
                </div>
                <div className="detail-row">
                  <strong>Status:</strong>
                  <span
                    className={`status-badge status-${selectedFine.status}`}
                  >
                    {selectedFine.status.charAt(0).toUpperCase() +
                      selectedFine.status.slice(1)}
                  </span>
                </div>
                {selectedFine.rental_id && (
                  <div className="detail-row">
                    <strong>Rental ID:</strong>
                    <span>{selectedFine.rental_id}</span>
                  </div>
                )}
                {selectedFine.cycle_id && (
                  <div className="detail-row">
                    <strong>Cycle ID:</strong>
                    <span>{selectedFine.cycle_id}</span>
                  </div>
                )}
                {selectedFine.days_overdue > 0 && (
                  <div className="detail-row">
                    <strong>Days Overdue:</strong>
                    <span>{selectedFine.days_overdue}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-actions">
              {selectedFine.status === "pending" && (
                <button
                  className="btn-primary"
                  onClick={() => {
                    handlePayment(selectedFine);
                    setShowModal(false);
                  }}
                >
                  <FaCheck /> Mark as Paid
                </button>
              )}
              <button
                className="btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinanceList;
