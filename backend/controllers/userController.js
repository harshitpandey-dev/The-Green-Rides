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
    res.status(404).json({ message: err.message });
  }
};
