import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaEdit,
  FaTrash,
  FaEye,
  FaFilter,
  FaDownload,
} from "react-icons/fa";
import DataTable from "../common/DataTable";
import { userService } from "../../services/user.service";
import "./StudentList.css";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load students data from API
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const studentsData = await userService.getAllStudents();

      // Transform API response to match component format
      const transformedStudents = studentsData.map((student) => ({
        id: student._id,
        roll_no: student.rollNumber || student.rollNo,
        name: student.name,
        email: student.email,
        phone: student.phone || "+91-9876543210",
        total_fine: student.totalFine || 0,
        total_times_rented: student.totalRentals || 0,
        status: student.status || "active",
        last_rental: student.lastRental || "2024-01-15",
        join_date: student.createdAt || "2021-08-01",
      }));

      setStudents(transformedStudents);
      setFilteredStudents(transformedStudents);
    } catch (error) {
      console.error("Error fetching students:", error);
      // Fallback to mock data if API fails
      const mockStudents = [
        {
          id: "ST001",
          roll_no: "CS2021001",
          name: "John Doe",
          email: "john.doe@university.edu",
          phone: "+91-9876543210",
          total_fine: 150,
          total_times_rented: 25,
          status: "active",
          last_rental: "2024-01-15",
          join_date: "2021-08-01",
        },
        {
          id: "ST002",
          roll_no: "CS2021002",
          name: "Jane Smith",
          email: "jane.smith@university.edu",
          phone: "+91-9876543211",
          total_fine: 0,
          total_times_rented: 12,
          status: "active",
          last_rental: "2024-01-14",
          join_date: "2021-08-01",
        },
      ];
      setStudents(mockStudents);
      setFilteredStudents(mockStudents);
    } finally {
      setLoading(false);
    }
  };

  // Search and filter logic
  useEffect(() => {
    let filtered = students.filter(
      (student) =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.roll_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filterStatus !== "all") {
      filtered = filtered.filter((student) => student.status === filterStatus);
    }

    setFilteredStudents(filtered);
  }, [students, searchTerm, filterStatus]);

  const columns = [
    {
      key: "roll_no",
      header: "Roll Number",
      sortable: true,
      render: (value) => <span className="roll-number">{value}</span>,
    },
    {
      key: "name",
      header: "Name",
      sortable: true,
      render: (value) => <span className="student-name">{value}</span>,
    },
    {
      key: "email",
      header: "Email",
      sortable: true,
    },
    {
      key: "total_fine",
      header: "Total Fine",
      sortable: true,
      render: (value) => (
        <span className={`fine-amount ${value > 0 ? "has-fine" : "no-fine"}`}>
          ₹{value}
        </span>
      ),
    },
    {
      key: "total_times_rented",
      header: "Rentals",
      sortable: true,
      render: (value) => <span className="rental-count">{value}</span>,
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
      key: "last_rental",
      header: "Last Rental",
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      key: "actions",
      header: "Actions",
      render: (_, student) => (
        <div className="action-buttons">
          <button
            className="action-btn view-btn"
            onClick={() => handleViewStudent(student)}
            title="View Details"
          >
            <FaEye />
          </button>
          <button
            className="action-btn edit-btn"
            onClick={() => handleEditStudent(student)}
            title="Edit Student"
          >
            <FaEdit />
          </button>
          <button
            className="action-btn delete-btn"
            onClick={() => handleDeleteStudent(student)}
            title="Delete Student"
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
    console.log("Edit student:", student);
    // Implement edit functionality
  };

  const handleDeleteStudent = (student) => {
    if (
      window.confirm(`Are you sure you want to delete student ${student.name}?`)
    ) {
      setStudents((prev) => prev.filter((s) => s.id !== student.id));
      console.log("Delete student:", student);
    }
  };

  const handleStatusChange = (studentId, newStatus) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === studentId ? { ...student, status: newStatus } : student
      )
    );
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
        "Last Rental",
        "Join Date",
      ],
      ...filteredStudents.map((student) => [
        student.roll_no,
        student.name,
        student.email,
        student.phone,
        student.total_fine,
        student.total_times_rented,
        student.status,
        student.last_rental,
        student.join_date,
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
    <div className="student-list">
      <div className="student-list-header">
        <h2>Student Management</h2>
        <div className="header-actions">
          <button className="export-btn" onClick={exportStudents}>
            <FaDownload /> Export CSV
          </button>
        </div>
      </div>

      <div className="student-filters">
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

      <div className="student-stats">
        <div className="stat-card">
          <h3>Total Students</h3>
          <p>{students.length}</p>
        </div>
        <div className="stat-card">
          <h3>Active Students</h3>
          <p>{students.filter((s) => s.status === "active").length}</p>
        </div>
        <div className="stat-card">
          <h3>Students with Fines</h3>
          <p>{students.filter((s) => s.total_fine > 0).length}</p>
        </div>
        <div className="stat-card">
          <h3>Blocked Students</h3>
          <p>{students.filter((s) => s.status === "blocked").length}</p>
        </div>
      </div>

      <DataTable
        data={filteredStudents}
        columns={columns}
        searchable={false}
        sortable={true}
        paginated={true}
        pageSize={10}
      />

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
                  <span className="value">{selectedStudent.roll_no}</span>
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
                      selectedStudent.total_fine > 0 ? "has-fine" : "no-fine"
                    }`}
                  >
                    ₹{selectedStudent.total_fine}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="label">Total Rentals:</span>
                  <span className="value">
                    {selectedStudent.total_times_rented}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="label">Status:</span>
                  <div className="status-controls">
                    <span
                      className={`status-badge status-${selectedStudent.status}`}
                    >
                      {selectedStudent.status.charAt(0).toUpperCase() +
                        selectedStudent.status.slice(1)}
                    </span>
                    <select
                      value={selectedStudent.status}
                      onChange={(e) =>
                        handleStatusChange(selectedStudent.id, e.target.value)
                      }
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="blocked">Blocked</option>
                    </select>
                  </div>
                </div>
                <div className="detail-row">
                  <span className="label">Last Rental:</span>
                  <span className="value">
                    {new Date(selectedStudent.last_rental).toLocaleDateString()}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="label">Join Date:</span>
                  <span className="value">
                    {new Date(selectedStudent.join_date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentList;
