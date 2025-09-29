const QRToken = require("../models/QRToken");
const Rental = require("../models/Rental");
const Cycle = require("../models/Cycle");
const User = require("../models/User");
const crypto = require("crypto");

// Generate secure token
const generateSecureToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

// Create rental QR token (Guard creates for student)
exports.createRentalToken = async ({
  guardId,
  cycleId,
  studentId,
  duration,
  location,
}) => {
  // Validate guard
  const guard = await User.findById(guardId);
  if (!guard || guard.role !== "guard") {
    throw new Error("Invalid guard");
  }

  // Validate student
  const student = await User.findById(studentId);
  if (!student || student.role !== "student") {
    throw new Error("Invalid student");
  }

  // Check student fine limit
  if (student.fine > 500) {
    throw new Error(
      "Student has exceeded fine limit of ₹500. Cannot rent new cycle."
    );
  }

  // Validate cycle
  const cycle = await Cycle.findById(cycleId);
  if (!cycle || cycle.status !== "available") {
    throw new Error("Cycle is not available for rent");
  }

  // Check if student has active rental
  const activeRental = await Rental.findOne({
    student: studentId,
    isActive: true,
  });

  if (activeRental) {
    throw new Error("Student already has an active rental");
  }

  const token = generateSecureToken();
  const expiresAt = new Date(Date.now() + 30 * 1000); // 30 seconds

  const qrToken = new QRToken({
    token,
    type: "rental",
    cycle: cycleId,
    student: studentId,
    guard: guardId,
    duration,
    location,
    expiresAt,
  });

  await qrToken.save();

  return {
    token,
    qrData: {
      token,
      type: "rental",
      cycleId,
      studentId,
      duration,
      location,
      expiresAt,
    },
    expiresAt,
  };
};

// Process rental QR scan (Student scans guard's QR)
exports.processRentalQR = async ({ token, studentId }) => {
  const qrToken = await QRToken.findOne({ token }).populate([
    "cycle",
    "student",
    "guard",
  ]);

  if (!qrToken || !qrToken.isValid()) {
    throw new Error("Invalid or expired QR code");
  }

  if (qrToken.type !== "rental") {
    throw new Error("Invalid QR code type");
  }

  if (qrToken.student._id.toString() !== studentId) {
    throw new Error("QR code is not assigned to this student");
  }

  // Check if cycle is still available
  const cycle = await Cycle.findById(qrToken.cycle._id);
  if (cycle.status !== "available") {
    throw new Error("Cycle is no longer available");
  }

  // Create rental
  const rental = new Rental({
    student: qrToken.student._id,
    cycle: qrToken.cycle._id,
    guard: qrToken.guard._id,
    duration: qrToken.duration,
    rentedLocation: qrToken.location,
    rentedBy: qrToken.guard._id,
    status: "active",
  });

  await rental.save();

  // Update cycle status
  cycle.status = "rented";
  cycle.currentRental = rental._id;
  cycle.totalRentCount += 1;
  cycle.checkUsageMaintenance();
  await cycle.save();

  // Update student stats
  const student = await User.findById(qrToken.student._id);
  student.totalTimesRented += 1;
  await student.save();

  // Mark token as used
  qrToken.markAsUsed();
  await qrToken.save();

  return {
    rental: await Rental.findById(rental._id).populate([
      "cycle",
      "student",
      "guard",
    ]),
    message: "Cycle rented successfully",
  };
};

// Create return QR token (Student creates for guard)
exports.createReturnToken = async ({ studentId }) => {
  // Find active rental
  const rental = await Rental.findOne({
    student: studentId,
    isActive: true,
  }).populate(["cycle", "student", "guard"]);

  if (!rental) {
    throw new Error("No active rental found");
  }

  const token = generateSecureToken();
  const expiresAt = new Date(Date.now() + 30 * 1000); // 30 seconds

  const qrToken = new QRToken({
    token,
    type: "return",
    rental: rental._id,
    guard: rental.guard._id,
    expiresAt,
  });

  await qrToken.save();

  return {
    token,
    qrData: {
      token,
      type: "return",
      rentalId: rental._id,
      cycleNumber: rental.cycle.cycleNumber,
      studentName: rental.student.name,
      studentRollNo: rental.student.rollNo,
      expiresAt,
    },
    expiresAt,
    rental,
  };
};

// Process return QR scan (Guard scans student's QR)
exports.processReturnQR = async ({ token, guardId, location }) => {
  const qrToken = await QRToken.findOne({ token }).populate({
    path: "rental",
    populate: [{ path: "cycle" }, { path: "student" }, { path: "guard" }],
  });

  if (!qrToken || !qrToken.isValid()) {
    throw new Error("Invalid or expired QR code");
  }

  if (qrToken.type !== "return") {
    throw new Error("Invalid QR code type");
  }

  const rental = qrToken.rental;

  if (!rental.isActive) {
    throw new Error("Rental is already completed");
  }

  // Process return
  const fine = rental.processReturn();
  rental.returnedBy = guardId;
  rental.returnedLocation = location;

  await rental.save();

  // Update cycle status
  const cycle = await Cycle.findById(rental.cycle._id);
  cycle.status = "available";
  cycle.currentRental = null;
  await cycle.save();

  // Update student fine and duration
  const student = await User.findById(rental.student._id);
  student.fine += fine;
  student.totalDurationOfRent += rental.actualDuration;
  await student.save();

  // Mark token as used
  qrToken.markAsUsed();
  await qrToken.save();

  return {
    rental: await Rental.findById(rental._id).populate([
      "cycle",
      "student",
      "guard",
    ]),
    fine,
    message:
      fine > 0
        ? `Cycle returned. Fine: ₹${fine}`
        : "Cycle returned successfully",
  };
};

// Get active rentals for guard
exports.getActiveRentals = async ({ guardId, location }) => {
  const query = {
    isActive: true,
    status: "active",
  };

  // Filter by location if guard location is provided
  if (location) {
    query.rentedLocation = location;
  }

  const rentals = await Rental.find(query)
    .populate([
      { path: "student", select: "name rollNo phone" },
      { path: "cycle", select: "cycleNumber" },
      { path: "guard", select: "name" },
    ])
    .sort({ rentedAt: -1 });

  // Calculate time left and fine for each rental
  const rentalsWithStatus = rentals.map((rental) => ({
    ...rental.toObject(),
    timeLeft: rental.timeLeft,
    currentFine: rental.calculateFine,
    isOverdue: rental.timeLeft === 0,
  }));

  return rentalsWithStatus;
};

// Clean up expired tokens (run as cron job)
exports.cleanupExpiredTokens = async () => {
  const result = await QRToken.deleteMany({
    expiresAt: { $lt: new Date() },
  });

  return { deletedCount: result.deletedCount };
};

module.exports = exports;
