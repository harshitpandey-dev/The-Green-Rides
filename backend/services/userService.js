const User = require("../models/User");
const Rental = require("../models/Rental");
const Cycle = require("../models/Cycle");

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

// Search students by roll number or name (for guards)
exports.getByRollNo = async (rollNo) => {
  const student = await User.findOne({
    rollNo: rollNo.trim(),
    role: "student",
  }).select("-password -resetPasswordOTP -emailVerificationToken");
  if (!student) throw new Error("Student not found");

  return student;
};

// Finance admin: Clear student fine
exports.clearStudentFine = async (studentId, clearedBy) => {
  const student = await User.findById(studentId);
  if (!student) {
    throw new Error("Student not found");
  }

  if (student.role !== "student") {
    throw new Error("Only student fines can be cleared");
  }

  const previousFine = student.fine || 0;

  // Update student fine to 0
  student.fine = 0;
  student.updatedBy = clearedBy;
  student.updatedAt = new Date();

  await student.save();

  return {
    message: "Student fine cleared successfully",
    student: {
      id: student._id,
      name: student.name,
      rollNo: student.rollNo,
      previousFine,
      currentFine: 0,
      clearedAt: new Date(),
    },
  };
};

// Student profile update (limited fields)
exports.updateStudentProfile = async (studentId, { phone, profilePicture }) => {
  const student = await User.findById(studentId);
  if (!student || student.role !== "student") {
    throw new Error("Student not found");
  }

  // Only allow updating specific fields
  const updates = {};
  if (phone !== undefined) updates.phone = phone;
  if (profilePicture !== undefined) updates.profilePicture = profilePicture;

  Object.assign(student, updates);
  await student.save();

  return await User.findById(studentId).select(
    "-password -resetPasswordOTP -emailVerificationToken"
  );
};

exports.getUserById = async (userId) => {
  const user = await User.findById(userId)
    .select("-password -resetPasswordOTP -emailVerificationToken")
    .populate("createdBy", "name role");
  if (!user) throw new Error("User not found");
  return user;
};

// Get dashboard statistics (admin only)
exports.getUsersStatistics = async () => {
  // Get today's date range for rental stats
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  const [
    userStats,
    cycleStats,
    rentalStats,
    todayRentalsCount,
    overdueRentals,
  ] = await Promise.all([
    // User statistics by role and status
    User.aggregate([
      {
        $group: {
          _id: { role: "$role", status: "$status" },
          count: { $sum: 1 },
        },
      },
    ]),

    // Cycle statistics by status
    Cycle.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]),

    // Active rental count
    Rental.countDocuments({ isActive: true }),

    // Today's rentals count
    Rental.countDocuments({
      rentedAt: { $gte: startOfDay, $lte: endOfDay },
    }),

    // Overdue rentals count (rentals that are active and past their duration)
    Rental.countDocuments({
      isActive: true,
      $expr: {
        $gt: [
          { $divide: [{ $subtract: [new Date(), "$rentedAt"] }, 60000] }, // minutes elapsed
          "$duration",
        ],
      },
    }),
  ]);

  // Process user statistics
  const students = { total: 0, active: 0, suspended: 0 };
  const guards = { total: 0, active: 0 };

  userStats.forEach((stat) => {
    if (stat._id.role === "student") {
      students.total += stat.count;
      if (stat._id.status === "active") students.active += stat.count;
      if (stat._id.status === "disabled") students.suspended += stat.count;
    } else if (stat._id.role === "guard") {
      guards.total += stat.count;
      if (stat._id.status === "active") guards.active += stat.count;
    }
  });

  // Process cycle statistics
  const cycles = { total: 0, available: 0, rented: 0, maintenance: 0 };

  cycleStats.forEach((stat) => {
    cycles.total += stat.count;
    if (stat._id === "available") cycles.available = stat.count;
    if (stat._id === "rented") cycles.rented = stat.count;
    if (stat._id === "under_maintenance") cycles.maintenance = stat.count;
  });

  // Process rental statistics
  const rentals = {
    activeRentals: rentalStats,
    overdueRentals: overdueRentals,
    totalToday: todayRentalsCount,
  };

  return {
    students,
    guards,
    cycles,
    rentals,
  };
};

// Guard-specific methods
exports.getGuardDashboard = async (guardId) => {
  const guard = await User.findById(guardId);
  if (!guard || guard.role !== "guard") {
    throw new Error("Guard not found");
  }

  // Get rentals processed by this guard
  const totalRentals = await Rental.countDocuments({ processedBy: guardId });

  // Get current active rentals in guard's location
  const currentActiveRentals = await Rental.countDocuments({
    "cycle.location": guard.location,
    status: "active",
  });

  // Calculate total hours managed (sum of all rental durations by this guard)
  const managedRentals = await Rental.find({ processedBy: guardId })
    .select("startTime endTime plannedEndTime")
    .exec();

  let totalHoursManaged = 0;
  managedRentals.forEach((rental) => {
    if (rental.endTime) {
      const duration =
        (new Date(rental.endTime) - new Date(rental.startTime)) /
        (1000 * 60 * 60);
      totalHoursManaged += duration;
    } else if (rental.plannedEndTime) {
      const now = new Date();
      const elapsed = (now - new Date(rental.startTime)) / (1000 * 60 * 60);
      totalHoursManaged += elapsed;
    }
  });

  // Calculate days on duty (days since guard was created)
  const daysOnDuty = Math.floor(
    (new Date() - new Date(guard.createdAt)) / (1000 * 60 * 60 * 24)
  );

  return {
    totalRentals,
    currentActiveRentals,
    totalHoursManaged: Math.round(totalHoursManaged * 100) / 100, // Round to 2 decimal places
    daysOnDuty,
    guardInfo: {
      name: guard.name,
      location: guard.location,
      email: guard.email,
      phone: guard.phone,
    },
  };
};

exports.updateGuardProfile = async (guardId, updateData) => {
  const guard = await User.findById(guardId);
  if (!guard || guard.role !== "guard") {
    throw new Error("Guard not found");
  }

  // Only allow certain fields to be updated
  const allowedFields = ["name", "phone", "email", "profileImage"];
  const filteredData = {};

  allowedFields.forEach((field) => {
    if (updateData[field] !== undefined) {
      filteredData[field] = updateData[field];
    }
  });

  Object.assign(guard, filteredData);
  await guard.save();

  return await User.findById(guardId).select(
    "-password -resetPasswordOTP -emailVerificationToken"
  );
};

exports.changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  // Verify current password
  const isCurrentPasswordValid = await user.comparePassword(currentPassword);
  if (!isCurrentPasswordValid) {
    throw new Error("Current password is incorrect");
  }

  // Update password
  user.password = newPassword;
  await user.save();

  return { message: "Password changed successfully" };
};
