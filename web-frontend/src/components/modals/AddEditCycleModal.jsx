const AddEditCycleModal = ({ cycle, isOpen, onClose, onUpdate }) => {
  if (!isOpen || !cycle) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const cycleData = {
      cycleNumber: formData.get("cycleNumber"),
      location: formData.get("location"),
      status: formData.get("status"),
    };
    onUpdate(cycleData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Edit Cycle</h3>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Cycle number:</label>
              <input
                type="text"
                name="cycleNumber"
                defaultValue={cycle?.cycleNumber}
                required
              />
            </div>
            <div className="form-group">
              <label>Location:</label>
              <input
                type="text"
                name="location"
                defaultValue={cycle?.location}
                required
              />
            </div>
            <div className="form-group">
              <label>Status:</label>
              <select name="status" defaultValue={cycle?.status}>
                <option value="available">Available</option>
                <option value="rented">Rented</option>
                <option value="maintenance">Maintenance</option>
                <option value="out-of-service">Out of Service</option>
              </select>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-primary">
                Update Cycle
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

export default AddEditCycleModal;
