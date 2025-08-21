import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaEdit,
  FaTrash,
  FaFilter,
  FaDownload,
  FaUsers,
} from "react-icons/fa";
import DataTable from "../../components/common/DataTable";
import EditStudentModal from "../../components/modals/EditStudentModal";
import { userService } from "../../services/user.service";
import "../../styles/screens/studentsScreen.css";
import "../../styles/components/modals.css";

const StudentsScreen = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
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
      render: (value) => <span className="entity-id">{value || "N/A"}</span>,
    },
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
      key: "fine",
      header: "Total Fine",
      sortable: true,
      render: (value) => (
        <span
          className={`count-badge fine-amount ${
            (value || 0) > 0 ? "has-fine" : "no-fine"
          }`}
        >
          ₹{value || 0}
        </span>
      ),
    },
    {
      key: "totalTimesRented",
      header: "Rentals",
      sortable: true,
      render: (value) => (
        <span className="count-badge rental-count">{value || 0}</span>
      ),
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
            onClick={() => handleToggleStatus(student)}
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
        fetchStudents();
      } catch (error) {
        console.error("Error deleting student:", error);
        alert("Failed to delete student. Please try again.");
      }
    }
  };

  const handleToggleStatus = async (student) => {
    const newStatus = student.status === "active" ? "disabled" : "active";
    try {
      await userService.updateUserStatus(student._id || student.id, newStatus);
      setStudents((prev) =>
        prev.map((g) =>
          (g._id || g.id) === (student._id || student.id)
            ? { ...g, status: newStatus }
            : g
        )
      );
      setFilteredStudents((prev) =>
        prev.map((g) =>
          (g._id || g.id) === (student._id || student.id)
            ? { ...g, status: newStatus }
            : g
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
    <div className="dashboard-container">
      <div className="dashboard-content">
        <div className="screen-container">
          <div className="screen-header">
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

          <div className="stats-container">
            <div className="stat-card total">
              <h3>Total Students</h3>
              <p className="stat-number">{students.length}</p>
            </div>
            <div className="stat-card active">
              <h3>Active Students</h3>
              <p className="stat-number">
                {students.filter((s) => s.status === "active").length}
              </p>
            </div>
            <div className="stat-card suspended">
              <h3>Students with Fines</h3>
              <p className="stat-number">
                {students.filter((s) => s.fine > 0).length}
              </p>
            </div>
            <div className="stat-card suspended">
              <h3>Disabled Students</h3>
              <p className="stat-number">
                {students.filter((s) => s.status === "disabled").length}
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

          <EditStudentModal
            student={editingStudent}
            isOpen={showEditModal}
            onClose={() => setShowEditModal(false)}
            onUpdate={handleUpdateStudent}
          />
        </div>
      </div>
    </div>
  );
};

export default StudentsScreen;
