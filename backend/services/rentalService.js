const Rental = require("../models/Rental");
const Cycle = require("../models/Cycle");
const User = require("../models/User");

exports.getAllRentals = async () => {
  return await Rental.find().populate("student cycle guard");
};

exports.createRental = async (userId, cycleId) => {
  const cycle = await getCycleByCycleId(cycleId);
  const rental = new Rental({ user: userId, cycle: cycle._id });
  await rental.save();
  return rental;
};

exports.completeRental = async (cycleId) => {
  const cycle = await getCycleByCycleId(cycleId);
  const rental = await Rental.findOne({ cycle: cycle._id });
  if (!rental) throw new Error("Cycle not rented");
  if (rental.endTime) throw new Error("Cycle already returned");
  rental.endTime = new Date();
  await rental.save();
  return rental;
};

exports.getRentalByUserId = async (userId) => {
  return Rental.findOne({
    student: userId,
    isActive: true,
    status: "active",
  }).populate(["cycle", "guard"]);
};

// Get rental history for a student or filtered by location (for guards)
exports.getRentalHistory = async (filters = {}) => {
  const { page = 1, limit = 10, userId, location, status } = filters;
  const skip = (page - 1) * limit;

  let query = {};

  // Add user filter if provided
  if (userId) {
    query.student = userId;
  }

  // Add status filter if provided
  if (status) {
    query.status = status;
  }

  let rentals;
  let total;

  if (location && !userId) {
    // For location-based filtering (guards), we need to populate and filter
    rentals = await Rental.find(query)
      .populate([
        {
          path: "cycle",
          match: { location },
          select: "cycleNumber averageRating location",
        },
        { path: "guard", select: "name" },
        { path: "student", select: "name rollNo phone" },
      ])
      .sort({ rentedAt: -1 })
      .skip(skip)
      .limit(limit);

    // Filter out rentals where cycle doesn't match location
    rentals = rentals.filter((rental) => rental.cycle !== null);

    // Get total count for location (approximate)
    const allLocationRentals = await Rental.find(query).populate({
      path: "cycle",
      match: { location },
      select: "_id",
    });
    total = allLocationRentals.filter((rental) => rental.cycle !== null).length;
  } else {
    // Regular filtering for students or admins
    rentals = await Rental.find(query)
      .populate([
        { path: "cycle", select: "cycleNumber averageRating location" },
        { path: "guard", select: "name" },
        { path: "student", select: "name rollNo phone" },
      ])
      .sort({ rentedAt: -1 })
      .skip(skip)
      .limit(limit);

    total = await Rental.countDocuments(query);
  }

  return {
    rentals,
    pagination: {
      current: page,
      pages: Math.ceil(total / limit),
      total,
    },
  };
};

// Add rating to a completed rental
exports.addRating = async (rentalId, studentId, rating, comment) => {
  const rental = await Rental.findOne({
    _id: rentalId,
    student: studentId,
    status: "returned",
  }).populate("cycle");

  if (!rental) {
    throw new Error("Rental not found or not completed");
  }

  if (rental.rating) {
    throw new Error("Rating already provided for this rental");
  }

  // Update rental with rating
  rental.rating = rating;
  rental.comment = comment || "";
  rental.ratedAt = new Date();
  await rental.save();

  // Update cycle average rating
  const cycle = rental.cycle;
  cycle.updateRating(rating);
  await cycle.save();

  return rental;
};

// Get student dashboard stats
exports.getStudentStats = async (studentId) => {
  const student = await User.findById(studentId);

  const stats = await Rental.aggregate([
    { $match: { student: student._id } },
    {
      $group: {
        _id: null,
        totalRentals: { $sum: 1 },
        totalFine: { $sum: "$fine" },
        totalDuration: { $sum: "$actualDuration" },
        completedRentals: {
          $sum: { $cond: [{ $eq: ["$status", "returned"] }, 1, 0] },
        },
      },
    },
  ]);

  const result = stats[0] || {
    totalRentals: 0,
    totalFine: 0,
    totalDuration: 0,
    completedRentals: 0,
  };

  return {
    ...result,
    currentFine: student.fine,
    canRent: student.fine <= 500,
  };
};

// Get active rentals (for guards and admins)
exports.getActiveRentals = async (filters = {}) => {
  const query = { status: "active", isActive: true };

  // Add location filter if provided
  if (filters.location) {
    // We need to populate cycle first to filter by location
    const activeRentals = await Rental.find(query)
      .populate([
        {
          path: "cycle",
          match: { location: filters.location },
          select: "cycleNumber location status",
        },
        { path: "student", select: "name rollNo phone" },
        { path: "guard", select: "name" },
      ])
      .sort({ startTime: -1 });

    // Filter out rentals where cycle doesn't match location
    return activeRentals.filter((rental) => rental.cycle !== null);
  }

  // Add user filter for students
  if (filters.userId) {
    query.student = filters.userId;
  }

  return await Rental.find(query)
    .populate([
      { path: "cycle", select: "cycleNumber location status" },
      { path: "student", select: "name rollNo phone" },
      { path: "guard", select: "name" },
    ])
    .sort({ startTime: -1 });
};
