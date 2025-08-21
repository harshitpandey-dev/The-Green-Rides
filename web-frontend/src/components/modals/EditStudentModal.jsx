import React from "react";

const EditStudentModal = ({ student, isOpen, onClose, onUpdate }) => {
  if (!isOpen || !student) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const studentData = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      status: formData.get("status"),
    };
    onUpdate(studentData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Edit Student</h3>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Roll Number:</label>
              <input
                type="text"
                value={student.rollNo}
                disabled
                className="readonly"
              />
            </div>
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                name="name"
                defaultValue={student.name}
                required
              />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                defaultValue={student.email}
                required
              />
            </div>
            <div className="form-group">
              <label>Phone:</label>
              <input type="tel" name="phone" defaultValue={student.phone} />
            </div>
            <div className="form-group">
              <label>Status:</label>
              <select name="status" defaultValue={student.status}>
                <option value="active">Active</option>
                <option value="disabled">Disabled</option>
              </select>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-primary">
                Update Student
              </button>
              <button type="button" className="btn-secondary" onClick={onClose}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditStudentModal;
