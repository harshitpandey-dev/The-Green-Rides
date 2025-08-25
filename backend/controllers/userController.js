const userService = require("../services/userService");

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await userService.getCurrentUser(req.user.userId);
    res.json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

exports.addUser = async (req, res) => {
  try {
    const user = await userService.addUser(req.body);
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Admin user management
exports.getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllUsersByRole = async (req, res) => {
  try {
    console.log("Fetching users by role:", req.params.role);
    const users = await userService.getUsersByRole(req.params.role);
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Student profile update (limited fields only)
exports.updateStudentProfile = async (req, res) => {
  try {
    const { phone, profilePicture } = req.body;
    const user = await userService.updateStudentProfile(req.user.userId, {
      phone,
      profilePicture,
    });
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await userService.deleteUser(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const user = await userService.updateUserStatus(
      req.params.id,
      req.body.status
    );
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getUserByRollNumber = async (req, res) => {
  try {
    const user = await userService.getByRollNo(req.params.rollNumber);
    res.json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// Finance admin endpoint to clear student fines
exports.clearStudentFine = async (req, res) => {
  try {
    const { studentId } = req.params;
    const clearedBy = req.user.userId;

    const result = await userService.clearStudentFine(studentId, clearedBy);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getUserStatistics = async (req, res) => {
  try {
    const statistics = await userService.getUsersStatistics();
    res.json(statistics);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Guard-specific methods
exports.getGuardDashboard = async (req, res) => {
  try {
    const { guardId } = req.params;
    // Check if the guard is requesting their own dashboard or if admin
    if (req.user.role !== "super_admin" && req.user.userId !== guardId) {
      return res.status(403).json({ message: "Access denied" });
    }

    const dashboardData = await userService.getGuardDashboard(guardId);
    res.json(dashboardData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateGuardProfile = async (req, res) => {
  try {
    const { name, phone, email, profileImage } = req.body;
    const user = await userService.updateGuardProfile(req.user.userId, {
      name,
      phone,
      email,
      profileImage,
    });
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const result = await userService.changePassword(
      req.user.userId,
      currentPassword,
      newPassword
    );
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
