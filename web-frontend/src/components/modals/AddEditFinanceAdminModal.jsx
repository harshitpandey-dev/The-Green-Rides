const AddEditFinanceAdminModal = ({
  financeAdmin,
  isOpen,
  onClose,
  onUpdate,
}) => {
  if (!isOpen) return null;

  const isEditMode = !!financeAdmin;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const adminData = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      status: formData.get("status"),
    };

    if (!isEditMode) {
      adminData.password = formData.get("password");
    }

    onUpdate(adminData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{isEditMode ? "Edit" : "Add"} Finance Admin</h3>
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
                defaultValue={financeAdmin?.name}
                required
              />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                defaultValue={financeAdmin?.email}
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
              <input
                type="tel"
                name="phone"
                defaultValue={financeAdmin?.phone}
              />
            </div>
            <div className="form-group">
              <label>Status:</label>
              <select name="status" defaultValue={financeAdmin?.status}>
                <option value="active">Active</option>
                <option value="disabled">Disabled</option>
              </select>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {isEditMode ? "Update" : "Add"} Finance Admin
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

export default AddEditFinanceAdminModal;
