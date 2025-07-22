const User = require("../models/User");

exports.getCurrentUser = async (userId) => {
  const user = await User.findById(userId).select("-password");
  if (!user) throw new Error("User not found");
  return user;
};
