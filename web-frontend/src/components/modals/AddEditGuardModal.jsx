const AddEditGuardModal = ({ guard, isOpen, onClose, onUpdate }) => {
  if (!isOpen) return null;

  const isEditMode = !!guard;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const guardData = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      status: formData.get("status"),
      guardShift: formData.get("guardShift"),
      location: formData.get("location"),
    };

    if (!isEditMode) {
      guardData.password = formData.get("password");
    }

    onUpdate(guardData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{isEditMode ? "Edit" : "Add"} Guard</h3>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                name="name"
                defaultValue={guard?.name}
                required
              />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                defaultValue={guard?.email}
                required
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
              <input type="tel" name="phone" defaultValue={guard?.phone} />
            </div>

            <div className="form-group">
              <label>Shift:</label>
              <select name="guardShift" defaultValue={guard?.guardShift}>
                <option value="morning">Morning</option>
                <option value="evening">Evening</option>
              </select>
            </div>

            <div className="form-group">
              <label>Which campus:</label>
              <select name="location" defaultValue={guard?.guardShift}>
                <option value="east_campus">East Campus</option>
                <option value="west_campus">West Campus</option>
              </select>
            </div>
            <div className="form-group">
              <label>Status:</label>
              <select name="status" defaultValue={guard?.status}>
                <option value="active">Active</option>
                <option value="disabled">Disabled</option>
              </select>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {isEditMode ? "Update" : "Add"} Guard
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

export default AddEditGuardModal;
