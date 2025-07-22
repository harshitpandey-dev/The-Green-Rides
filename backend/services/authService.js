const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.register = async ({ name, email, rollNo, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error("Email already in use");
  const user = new User({ name, email, rollNo, password });
  await user.save();
  return user;
};

exports.login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid credentials");
  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new Error("Invalid credentials");
  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
  return {
    user: {
      id: user._id,
      name: user?.name,
      email: user?.email,
      rollNo: user?.rollNo,
      role: user.role,
    },
    token,
  };
};

exports.changePassword = async ({ email, oldPassword, newPassword }) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  const isMatch = await user.comparePassword(oldPassword);
  if (!isMatch) throw new Error("Incorrect old password");

  user.password = newPassword;
  await user.save();

  return { message: "Password updated successfully" };
};
