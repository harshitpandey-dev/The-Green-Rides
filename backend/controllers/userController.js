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

exports.getAllStudents = async (req, res) => {
  try {
    const students = await userService.getUsersByRole("student");
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllGuards = async (req, res) => {
  try {
    const guards = await userService.getUsersByRole("guard");
    res.json(guards);
  } catch (err) {
    res.status(500).json({ message: err.message });
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

exports.addGuard = async (req, res) => {
  try {
    const guard = await userService.addGuard(req.body);
    res.json(guard);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.resetGuardPassword = async (req, res) => {
  try {
    await userService.resetGuardPassword(req.params.id);
    res.json({ message: "Password reset successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getUserFines = async (req, res) => {
  try {
    const fines = await userService.getUserFines(req.params.id);
    res.json(fines);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUserByRollNumber = async (req, res) => {
  try {
    const user = await userService.getUserByRollNumber(req.params.rollNumber);
    res.json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
