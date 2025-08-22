import React, { useState, useContext } from "react";
import { FaSearch, FaMoneyBillWave, FaUser } from "react-icons/fa";
import { AuthContext } from "../../contexts/authContext";
import { userService } from "../../services/user.service";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import "../../styles/screens/financeAdminScreen.css";

const FinanceAdminScreen = () => {
  const { currentUser } = useContext(AuthContext);
  const [rollNumber, setRollNumber] = useState("");
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!rollNumber.trim()) {
      setError("Please enter a roll number");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const studentData = await userService.getStudentByRollNumber(
        rollNumber.trim()
      );
      setStudent(studentData);
    } catch (err) {
      setError(err.message || "Student not found");
      setStudent(null);
    } finally {
      setLoading(false);
    }
  };

  const handleClearFine = async () => {
    if (!student || clearing) return;

    try {
      setClearing(true);
      setError("");

      const result = await userService.clearStudentFine(student._id);

      // Update local student data
      setStudent((prev) => ({ ...prev, fine: 0 }));
      setMessage(
        `Fine cleared successfully! ₹${result.student.previousFine} has been cleared for ${result.student.name}`
      );
    } catch (err) {
      setError(err.message || "Failed to clear fine");
    } finally {
      setClearing(false);
    }
  };

  const resetSearch = () => {
    setRollNumber("");
    setStudent(null);
    setMessage("");
    setError("");
  };

  if (loading) {
    return <LoadingSpinner message="Searching for student..." />;
  }

  return (
    <div className="dashboard-container">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">
            <FaMoneyBillWave className="page-icon" />
            Finance Administration
          </h1>
          <p className="page-subtitle">
            Search students by roll number and manage their fines
          </p>
        </div>
        <div className="header-actions">
          <div className="admin-info">
            <span>Welcome, {currentUser?.name}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="dashboard-content">
        {/* Search Section */}
        <div className="section">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Student Fine Management</h2>
            </div>
            <div className="card-body">
              <form onSubmit={handleSearch} className="search-form">
                <div className="form-group">
                  <label htmlFor="rollNumber" className="form-label">
                    Student Roll Number
                  </label>
                  <div className="input-group">
                    <input
                      type="text"
                      id="rollNumber"
                      value={rollNumber}
                      onChange={(e) => setRollNumber(e.target.value)}
                      placeholder="Enter student roll number (e.g., 2021001)"
                      className="form-input"
                      disabled={loading}
                    />
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading || !rollNumber.trim()}
                    >
                      <FaSearch />
                      Search
                    </button>
                  </div>
                </div>
              </form>

              {error && (
                <div className="alert alert-danger">
                  <p>{error}</p>
                </div>
              )}

              {message && (
                <div className="alert alert-success">
                  <p>{message}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Student Details */}
        {student && (
          <div className="section">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">
                  <FaUser />
                  Student Details
                </h3>
                <button onClick={resetSearch} className="btn btn-secondary">
                  New Search
                </button>
              </div>

              <div className="card-body">
                <div className="info-grid">
                  <div className="info-item">
                    <label>Roll Number:</label>
                    <span>{student.rollNo}</span>
                  </div>
                  <div className="info-item">
                    <label>Name:</label>
                    <span>{student.name}</span>
                  </div>
                  <div className="info-item">
                    <label>Email:</label>
                    <span>{student.email}</span>
                  </div>
                  <div className="info-item">
                    <label>Phone:</label>
                    <span>{student.phone || "N/A"}</span>
                  </div>
                  <div className="info-item">
                    <label>Status:</label>
                    <span className={`badge badge-${student.status}`}>
                      {student.status}
                    </span>
                  </div>
                  <div className="info-item">
                    <label>Total Rentals:</label>
                    <span>{student.totalTimesRented || 0}</span>
                  </div>
                </div>

                <div className="fine-section mt-4">
                  <div className="fine-info">
                    <div className="fine-amount">
                      <label>Current Fine Amount:</label>
                      <span
                        className={`amount ${
                          student.fine > 0 ? "has-fine" : "no-fine"
                        }`}
                      >
                        ₹{student.fine || 0}
                      </span>
                    </div>

                    {student.fine > 0 && (
                      <div className="fine-actions mt-3">
                        <button
                          onClick={handleClearFine}
                          className="btn btn-success"
                          disabled={clearing}
                        >
                          {clearing ? (
                            <>
                              <LoadingSpinner size="small" />
                              Clearing...
                            </>
                          ) : (
                            <>
                              <FaMoneyBillWave />
                              Clear Fine (₹{student.fine})
                            </>
                          )}
                        </button>
                        <p className="help-text mt-2">
                          Only clear the fine after the student has physically
                          submitted the payment.
                        </p>
                      </div>
                    )}

                    {student.fine === 0 && (
                      <div className="alert alert-success mt-3">
                        <p>✅ This student has no outstanding fines.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {!student && !error && !rollNumber && (
          <div className="section">
            <div className="empty-state">
              <FaSearch className="empty-icon" />
              <h3>Search for Students</h3>
              <p>
                Enter a roll number above to find a student and manage their
                fines.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinanceAdminScreen;
