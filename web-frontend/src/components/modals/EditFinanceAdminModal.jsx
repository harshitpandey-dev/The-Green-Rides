import React from "react";

const EditFinanceAdminModal = ({ financeAdmin, isOpen, onClose, onUpdate }) => {
  if (!isOpen || !financeAdmin) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const adminData = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      status: formData.get("status"),
      permissions: Array.from(formData.getAll("permissions")),
    };
    onUpdate(adminData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Edit Finance Admin</h3>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Admin ID:</label>
              <input
                type="text"
                value={financeAdmin.adminId || financeAdmin.id}
                disabled
                className="readonly"
              />
            </div>
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                name="name"
                defaultValue={financeAdmin.name}
                required
              />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                defaultValue={financeAdmin.email}
                required
              />
            </div>
            <div className="form-group">
              <label>Phone:</label>
              <input
                type="tel"
                name="phone"
                defaultValue={financeAdmin.phone}
              />
            </div>
            <div className="form-group">
              <label>Status:</label>
              <select name="status" defaultValue={financeAdmin.status}>
                <option value="active">Active</option>
                <option value="disabled">Disabled</option>
              </select>
            </div>
            <div className="form-group">
              <label>Permissions:</label>
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="permissions"
                    value="view_transactions"
                    defaultChecked={financeAdmin.permissions?.includes(
                      "view_transactions"
                    )}
                  />
                  View Transactions
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="permissions"
                    value="manage_fines"
                    defaultChecked={financeAdmin.permissions?.includes(
                      "manage_fines"
                    )}
                  />
                  Manage Fines
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="permissions"
                    value="generate_reports"
                    defaultChecked={financeAdmin.permissions?.includes(
                      "generate_reports"
                    )}
                  />
                  Generate Reports
                </label>
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-primary">
                Update Finance Admin
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

export default EditFinanceAdminModal;
