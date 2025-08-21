import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaEdit,
  FaTrash,
  FaEye,
  FaFilter,
  FaDownload,
  FaUsers,
} from "react-icons/fa";
import DataTable from "../common/DataTable";
import { userService } from "../../services/user.service";
import "../admin/adminList.css";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load students data from API
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const studentsData = await userService.getAllUsersByRole("student");
      setStudents(studentsData);
      setFilteredStudents(studentsData);
    } catch (error) {
      console.error("Error fetching students:", error);
      setStudents([]);
      setFilteredStudents([]);
    } finally {
      setLoading(false);
    }
  };

  // Search and filter logic
  useEffect(() => {
    let filtered = students.filter(
      (student) =>
        (student.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student.rollNo || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (student.email || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filterStatus !== "all") {
      filtered = filtered.filter((student) => student.status === filterStatus);
    }

    setFilteredStudents(filtered);
  }, [students, searchTerm, filterStatus]);

  const columns = [
    {
      key: "rollNo",
      header: "Roll Number",
      sortable: true,
      render: (value) => <span className="roll-number">{value || "N/A"}</span>,
    },
    {
      key: "name",
      header: "Name",
      sortable: true,
      render: (value) => <span className="student-name">{value || "N/A"}</span>,
    },
    {
      key: "email",
      header: "Email",
      sortable: true,
      render: (value) => <span className="email">{value || "N/A"}</span>,
    },
    {
      key: "fine",
      header: "Total Fine",
      sortable: true,
      render: (value) => (
        <span
          className={`fine-amount ${(value || 0) > 0 ? "has-fine" : "no-fine"}`}
        >
          ₹{value || 0}
        </span>
      ),
    },
    {
      key: "totalTimesRented",
      header: "Rentals",
      sortable: true,
      render: (value) => <span className="rental-count">{value || 0}</span>,
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
      key: "actions",
      header: "Actions",
      render: (_, student) => (
        <div className="action-buttons">
          <button
            className="action-btn edit-btn"
            onClick={() => handleEditStudent(student)}
            title="Edit Student"
            disabled={loading}
          >
            <FaEdit />
          </button>
          <button
            className={`action-btn status-btn ${
              student.status === "active" ? "disable-btn" : "enable-btn"
            }`}
            onClick={() =>
              handleStatusChange(
                student._id || student.id,
                student.status === "active" ? "suspended" : "active"
              )
            }
            title={
              student.status === "active"
                ? "Suspend Student"
                : "Activate Student"
            }
            disabled={loading}
          >
            {student.status === "active" ? "🔒" : "🔓"}
          </button>
          <button
            className="action-btn delete-btn"
            onClick={() => handleDeleteStudent(student)}
            title="Delete Student"
            disabled={loading}
          >
            <FaTrash />
          </button>
        </div>
      ),
    },
  ];

  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setShowModal(true);
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setShowEditModal(true);
  };

  const handleDeleteStudent = async (student) => {
    if (
      window.confirm(`Are you sure you want to delete student ${student.name}?`)
    ) {
      try {
        await userService.deleteUser(student._id || student.id);
        // Refresh the list after deletion
        fetchStudents();
      } catch (error) {
        console.error("Error deleting student:", error);
        alert("Failed to delete student. Please try again.");
      }
    }
  };

  const handleStatusChange = async (studentId, newStatus) => {
    try {
      await userService.updateUserStatus(studentId, newStatus);
      // Update local state
      setStudents((prev) =>
        prev.map((student) =>
          (student._id || student.id) === studentId
            ? { ...student, status: newStatus }
            : student
        )
      );
      setSelectedStudent((prev) => ({
        ...prev,
        status: newStatus,
      }));

      setFilteredStudents((prev) =>
        prev.map((student) =>
          (student._id || student.id) === studentId
            ? { ...student, status: newStatus }
            : student
        )
      );
    } catch (error) {
      console.error("Error updating student status:", error);
      alert("Failed to update student status. Please try again.");
    }
  };

  const handleUpdateStudent = async (studentData) => {
    try {
      await userService.updateUser(editingStudent._id, studentData);
      setShowEditModal(false);
      setEditingStudent(null);
      // Refresh the list after update
      fetchStudents();
    } catch (error) {
      console.error("Error updating student:", error);
      alert("Failed to update student. Please try again.");
    }
  };

  const exportStudents = () => {
    const csvContent = [
      [
        "Roll No",
        "Name",
        "Email",
        "Phone",
        "Total Fine",
        "Total Rentals",
        "Status",
        "Join Date",
      ],
      ...filteredStudents.map((student) => [
        student.rollNo,
        student.name,
        student.email,
        student.phone,
        student.fine,
        student.totalTimesRented,
        student.status,
        new Date(student.joinDate).toLocaleDateString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "students.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading students...</p>
      </div>
    );
  }

  return (
    <div className="admin-list-container">
      <div className="list-header">
        <div className="header-content">
          <h2>
            <FaUsers />
            Student Management
          </h2>
          <p>Manage student accounts and track rental activity</p>
        </div>
        <div className="header-actions">
          <button className="export-btn" onClick={exportStudents}>
            <FaDownload /> Export CSV
          </button>
        </div>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by name, roll number, or email..."
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
            <option value="blocked">Blocked</option>
          </select>
        </div>
      </div>

      <div className="stats-cards">
        <div className="stat-card">
          <h3>Total Students</h3>
          <p className="stat-number">{students.length}</p>
        </div>
        <div className="stat-card">
          <h3>Active Students</h3>
          <p className="stat-number">
            {students.filter((s) => s.status === "active").length}
          </p>
        </div>
        <div className="stat-card">
          <h3>Students with Fines</h3>
          <p className="stat-number">
            {students.filter((s) => s.fine > 0).length}
          </p>
        </div>
        <div className="stat-card">
          <h3>Suspended Students</h3>
          <p className="stat-number">
            {students.filter((s) => s.status === "suspended").length}
          </p>
        </div>
      </div>

      <div className="table-container">
        <DataTable
          data={filteredStudents}
          columns={columns}
          searchable={false}
          sortable={true}
          paginated={true}
          pageSize={10}
        />
      </div>

      {showModal && selectedStudent && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Student Details</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="student-details">
                <div className="detail-row">
                  <span className="label">Roll Number:</span>
                  <span className="value">{selectedStudent.rollNo}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Name:</span>
                  <span className="value">{selectedStudent.name}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Email:</span>
                  <span className="value">{selectedStudent.email}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Phone:</span>
                  <span className="value">{selectedStudent.phone}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Total Fine:</span>
                  <span
                    className={`value ${
                      selectedStudent.fine > 0 ? "has-fine" : "no-fine"
                    }`}
                  >
                    ₹{selectedStudent.fine}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="label">Total Rentals:</span>
                  <span className="value">
                    {selectedStudent.totalTimesRented}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="label">Status:</span>
                  <div className="status-controls">
                    <span
                      className={`status-badge status-${selectedStudent.status}`}
                    >
                      {selectedStudent.status &&
                      typeof selectedStudent.status === "string"
                        ? selectedStudent.status.charAt(0).toUpperCase() +
                          selectedStudent.status.slice(1)
                        : "Unknown"}
                    </span>
                    <select
                      value={selectedStudent.status}
                      onChange={(e) =>
                        handleStatusChange(selectedStudent._id, e.target.value)
                      }
                    >
                      <option value="active">Active</option>
                      <option value="disabled">Disabled</option>
                    </select>
                  </div>
                </div>
                <div className="detail-row">
                  <span className="label">Join Date:</span>
                  <span className="value">
                    {new Date(selectedStudent.joinDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEditModal && editingStudent && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Student</h3>
              <button
                className="close-btn"
                onClick={() => setShowEditModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  const studentData = {
                    name: formData.get("name"),
                    email: formData.get("email"),
                    phone: formData.get("phone"),
                    status: formData.get("status"),
                  };
                  handleUpdateStudent(studentData);
                }}
              >
                <div className="form-group">
                  <label>Roll Number:</label>
                  <input
                    type="text"
                    value={editingStudent.rollNo}
                    disabled
                    className="readonly"
                  />
                </div>
                <div className="form-group">
                  <label>Name:</label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={editingStudent.name}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email:</label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={editingStudent.email}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone:</label>
                  <input
                    type="tel"
                    name="phone"
                    defaultValue={editingStudent.phone}
                  />
                </div>
                <div className="form-group">
                  <label>Status:</label>
                  <select name="status" defaultValue={editingStudent.status}>
                    <option value="active">Active</option>
                    <option value="disabled">Disabled</option>
                  </select>
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn-primary">
                    Update Student
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setShowEditModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentList;
