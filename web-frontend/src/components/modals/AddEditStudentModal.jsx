const AddEditStudentModal = ({ student, isOpen, onClose, onUpdate }) => {
  if (!isOpen) return null;

  const isEditMode = !!student;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const studentData = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      status: formData.get("status"),
      rollNo: formData.get("rollNo"),
    };

    if (!isEditMode) {
      studentData.password = formData.get("password");
    }

    onUpdate(studentData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{isEditMode ? "Edit Student" : "Add Student"}</h3>
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
                name="rollNo"
                defaultValue={student?.rollNo || ""}
                required
                placeholder="Enter roll number"
              />
            </div>

            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                name="name"
                defaultValue={student?.name || ""}
                required
                placeholder="Enter full name"
              />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                defaultValue={student?.email || ""}
                required
                placeholder="Enter email address"
              />
            </div>
            {!isEditMode && (
              <div className="form-group">
                <label>Password:</label>
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="Enter password"
                  minLength={6}
                />
              </div>
            )}
            <div className="form-group">
              <label>Phone:</label>
              <input
                type="tel"
                name="phone"
                defaultValue={student?.phone || ""}
                placeholder="Enter phone number"
              />
            </div>
            <div className="form-group">
              <label>Status:</label>
              <select name="status" defaultValue={student?.status || "active"}>
                <option value="active">Active</option>
                <option value="disabled">Disabled</option>
              </select>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {isEditMode ? "Update Student" : "Add Student"}
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

export default AddEditStudentModal;
