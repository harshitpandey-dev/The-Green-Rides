const User = require("../models/User");
const Rental = require("../models/Rental");

exports.getUsersByRole = async (role) => {
  const users = await User.find({ role })
    .select("-password -resetPasswordOTP -emailVerificationToken")
    .populate("createdBy", "name role")
    .sort({ name: 1 });
  return users;
};

exports.updateUser = async (userId, updateData) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");
  Object.assign(user, updateData);
  await user.save();
  return await User.findById(userId)
    .select("-password -resetPasswordOTP -emailVerificationToken")
    .populate("createdBy", "name role");
};

exports.getCurrentUser = async (userId) => {
  const user = await User.findById(userId).select(
    "-password -resetPasswordOTP -emailVerificationToken"
  );
  if (!user) throw new Error("User not found");
  return user;
};

// Admin-only: Add any type of user
exports.addUser = async ({
  name,
  email,
  role,
  password,
  rollNo,
  phone,
  location,
  createdBy,
}) => {
  // Validate email format based on role
  if (role === "student" && !User.validateHBTUEmail(email)) {
    throw new Error("Students must have @hbtu.ac.in email addresses");
  }

  const existingUser = await User.findOne({
    $or: [{ email }, ...(rollNo ? [{ rollNo }] : [])],
  });

  if (existingUser) {
    if (existingUser.email === email) {
      throw new Error("Email already in use");
    }
    if (rollNo && existingUser.rollNo === rollNo) {
      throw new Error("Roll number already registered");
    }
  }

  const user = new User({
    name,
    email,
    role,
    password,
    rollNo: role === "student" ? rollNo : undefined,
    phone,
    location: location || "east_campus",
    createdBy,
    emailVerified: role !== "student", // Non-students don't need email verification
  });

  await user.save();
  return await User.findById(user._id)
    .select("-password")
    .populate("createdBy", "name role");
};

// Get all students with statistics
exports.getStudents = async () => {
  const students = await User.find({ role: "student" })
    .select("-password -resetPasswordOTP -emailVerificationToken")
    .populate("createdBy", "name role")
    .sort({ rollNo: 1 });

  return students;
};

// Get all guards
exports.getGuards = async () => {
  const guards = await User.find({ role: "guard" })
    .select("-password -resetPasswordOTP -emailVerificationToken")
    .populate("createdBy", "name role")
    .sort({ name: 1 });

  return guards;
};

// Get user statistics (for profile/admin dashboard)
exports.getUserStats = async (userId) => {
  const user = await User.findById(userId).select("-password");
  if (!user) throw new Error("User not found");

  if (user.role === "student") {
    // Get detailed rental statistics
    const rentalStats = await Rental.aggregate([
      { $match: { student: user._id } },
      {
        $group: {
          _id: null,
          totalRentals: { $sum: 1 },
          totalDuration: { $sum: "$actualDuration" },
          totalFines: { $sum: "$fine" },
          averageRating: { $avg: "$rating" },
          activeRentals: {
            $sum: { $cond: [{ $eq: ["$isActive", true] }, 1, 0] },
          },
        },
      },
    ]);

    const stats = rentalStats[0] || {
      totalRentals: 0,
      totalDuration: 0,
      totalFines: 0,
      averageRating: 0,
      activeRentals: 0,
    };

    return {
      user: user.toObject(),
      stats,
    };
  }

  return { user: user.toObject() };
};

exports.updateUserStatus = async (userId, status) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  if (status !== undefined) user.status = status;
  // if (fine !== undefined) user.fine = fine;
  // user.updatedBy = updatedBy;

  await user.save();
  return await User.findById(userId)
    .select("-password")
    .populate("updatedBy", "name role");
};

// Delete user (admin only)
exports.deleteUser = async ({ userId, deletedBy }) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  // Check if user has active rentals
  if (user.role === "student") {
    const activeRental = await Rental.findOne({
      student: userId,
      isActive: true,
    });
    if (activeRental) {
      throw new Error("Cannot delete student with active rental");
    }
  }

  await User.findByIdAndDelete(userId);
  return { message: "User deleted successfully" };
};

// Reset user password (admin only)
exports.resetUserPassword = async ({ userId, newPassword, resetBy }) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  user.password = newPassword;
  user.updatedBy = resetBy;
  await user.save();

  return { message: "Password reset successfully" };
};

// Search students by roll number or name (for guards)
exports.searchStudents = async ({ query }) => {
  const searchRegex = new RegExp(query, "i");

  const students = await User.find({
    role: "student",
    status: "active",
    $or: [
      { rollNo: parseInt(query) || 0 },
      { name: searchRegex },
      { email: searchRegex },
    ],
  })
    .select("name rollNo email fine status totalTimesRented phone")
    .limit(10)
    .sort({ rollNo: 1 });

  return students;
};

// Get dashboard statistics (admin only)
exports.getDashboardStats = async () => {
  const [userStats, rentalStats] = await Promise.all([
    User.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 },
          active: { $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] } },
        },
      },
    ]),
    Rental.aggregate([
      {
        $group: {
          _id: null,
          totalRentals: { $sum: 1 },
          activeRentals: { $sum: { $cond: ["$isActive", 1, 0] } },
          totalRevenue: { $sum: "$fine" },
          averageRating: { $avg: "$rating" },
        },
      },
    ]),
  ]);

  const users = userStats.reduce((acc, stat) => {
    acc[stat._id] = stat;
    return acc;
  }, {});

  const rentals = rentalStats[0] || {
    totalRentals: 0,
    activeRentals: 0,
    totalRevenue: 0,
    averageRating: 0,
  };

  return {
    users,
    rentals,
    summary: {
      totalUsers: userStats.reduce((sum, stat) => sum + stat.count, 0),
      activeUsers: userStats.reduce((sum, stat) => sum + stat.active, 0),
      ...rentals,
    },
  };
};
