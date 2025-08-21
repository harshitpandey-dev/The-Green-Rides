import React, { useState, useContext } from "react";
import { FaSearch, FaMoneyBillWave, FaUser } from "react-icons/fa";
import { AuthContext } from "../../contexts/authContext";
import { userService } from "../../services/user.service";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import "./FinanceAdminScreen.css";

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
    <div className="finance-admin-screen">
      <div className="screen-header">
        <div className="header-content">
          <h1>
            <FaMoneyBillWave className="header-icon" />
            Finance Administration
          </h1>
          <p>Search students by roll number and manage their fines</p>
        </div>
        <div className="admin-info">
          <span>Welcome, {currentUser?.name}</span>
        </div>
      </div>

      <div className="search-section">
        <div className="search-card">
          <h2>Student Fine Management</h2>

          <form onSubmit={handleSearch} className="search-form">
            <div className="form-group">
              <label htmlFor="rollNumber">Student Roll Number</label>
              <div className="search-input-group">
                <input
                  type="text"
                  id="rollNumber"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  placeholder="Enter student roll number (e.g., 2021001)"
                  className="search-input"
                  disabled={loading}
                />
                <button
                  type="submit"
                  className="search-btn"
                  disabled={loading || !rollNumber.trim()}
                >
                  <FaSearch />
                  Search
                </button>
              </div>
            </div>
          </form>

          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}

          {message && (
            <div className="success-message">
              <p>{message}</p>
            </div>
          )}
        </div>
      </div>

      {student && (
        <div className="student-details-section">
          <div className="student-card">
            <div className="card-header">
              <h3>
                <FaUser />
                Student Details
              </h3>
              <button onClick={resetSearch} className="reset-btn">
                New Search
              </button>
            </div>

            <div className="student-info">
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
                  <span className={`status-badge status-${student.status}`}>
                    {student.status}
                  </span>
                </div>
                <div className="info-item">
                  <label>Total Rentals:</label>
                  <span>{student.totalTimesRented || 0}</span>
                </div>
              </div>

              <div className="fine-section">
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
                    <div className="fine-actions">
                      <button
                        onClick={handleClearFine}
                        className="clear-fine-btn"
                        disabled={clearing}
                      >
                        {clearing ? (
                          <>
                            <LoadingSpinner size="small" />
                            Clearing...
                          </>
                        ) : (
                          <>
                            <FaUser />
                            Clear Fine (₹{student.fine})
                          </>
                        )}
                      </button>
                      <p className="fine-note">
                        Only clear the fine after the student has physically
                        submitted the payment.
                      </p>
                    </div>
                  )}

                  {student.fine === 0 && (
                    <div className="no-fine-message">
                      <p>✅ This student has no outstanding fines.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {!student && !error && rollNumber && (
        <div className="no-search-message">
          <p>Enter a roll number and click search to find a student.</p>
        </div>
      )}
    </div>
  );
};

export default FinanceAdminScreen;
