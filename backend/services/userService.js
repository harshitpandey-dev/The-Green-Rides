const User = require("../models/User");

exports.getCurrentUser = async (userId) => {
  const user = await User.findById(userId).select("-password");
  if (!user) throw new Error("User not found");
  return user;
};

exports.addUser = async ({ name, email, role, password, rollNo }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error("Email already in use");
  const user = new User({ name, email, role, password, rollNo });
  await user.save();
  return user;
};
