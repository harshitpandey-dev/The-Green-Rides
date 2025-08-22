const Cycle = require("../models/Cycle");
const User = require("../models/User");

// Get cycles (with location filtering for guards)
exports.getCycles = async ({ location, status, needsMaintenance } = {}) => {
  const query = {};

  if (location) query.location = location;
  if (status) query.status = status;
  if (needsMaintenance !== undefined) query.needsMaintenance = needsMaintenance;

  const cycles = await Cycle.find(query)
    .populate("addedBy", "name role")
    .populate("currentRental")
    .sort({ cycleNumber: 1 });

  return cycles;
};

exports.addCycle = async ({ cycleNumber, location, status }, addedBy) => {
  const existingCycle = await Cycle.findOne({ cycleNumber });
  if (existingCycle) {
    throw new Error("Cycle number already exists");
  }

  const cycle = new Cycle({
    cycleNumber,
    location,
    status,
    addedBy,
  });

  await cycle.save();
  return await Cycle.findById(cycle._id).populate("addedBy", "name role");
};

// Get available cycles for specific location
exports.getAvailableCycles = async ({ location }) => {
  const cycles = await Cycle.find({
    location,
    status: "available",
    needsMaintenance: false,
  })
    .select("cycleNumber cycleId location totalRentCount averageRating")
    .sort({ cycleNumber: 1 });

  return cycles;
};

// Legacy methods for backward compatibility
exports.getAllCycles = async () => {
  return await this.getCycles();
};

exports.updateCycle = async (id, data) => {
  const cycle = await Cycle.findByIdAndUpdate(id, data, { new: true });
  if (!cycle) throw new Error("Cycle not found");
  return cycle;
};

exports.deleteCycle = async (id) => {
  const cycle = await Cycle.findByIdAndDelete(id);
  if (!cycle) throw new Error("Cycle not found");
  return { message: "Cycle deleted" };
};

exports.getCycleByCycleId = async (cycleId) => {
  const cycle = await Cycle.findOne({ cycleId });
  if (!cycle) throw new Error("Cycle not found");
  return cycle;
};

// Get cycle statistics
exports.getCycleStats = async ({ cycleId }) => {
  const Rental = require("../models/Rental");

  const cycle = await Cycle.findById(cycleId);
  if (!cycle) {
    throw new Error("Cycle not found");
  }

  // Get rental statistics
  const rentalStats = await Rental.aggregate([
    { $match: { cycle: cycle._id } },
    {
      $group: {
        _id: null,
        totalRentals: { $sum: 1 },
        totalDuration: { $sum: "$actualDuration" },
        totalFines: { $sum: "$fine" },
        averageRating: { $avg: "$rating" },
      },
    },
  ]);

  const stats = rentalStats[0] || {
    totalRentals: 0,
    totalDuration: 0,
    totalFines: 0,
    averageRating: 0,
  };

  return {
    cycle: cycle.toObject(),
    stats,
  };
};

// Get cycles needing maintenance
exports.getMaintenanceCycles = async () => {
  const cycles = await Cycle.find({
    needsMaintenance: true,
  })
    .populate("addedBy", "name role")
    .sort({ updatedAt: -1 });

  return cycles;
};

// Mark cycle for maintenance
exports.markForMaintenance = async ({ cycleId, reason, markedBy }) => {
  const cycle = await Cycle.findById(cycleId);
  if (!cycle) {
    throw new Error("Cycle not found");
  }

  if (cycle.currentRental) {
    throw new Error("Cannot mark rented cycle for maintenance");
  }

  cycle.needsMaintenance = true;
  cycle.maintenanceReason = reason || "manual";
  cycle.status = "under_maintenance";
  cycle.updatedBy = markedBy;

  await cycle.save();
  return cycle;
};

// Complete maintenance
exports.completeMaintenance = async ({ cycleId, completedBy }) => {
  const cycle = await Cycle.findById(cycleId);
  if (!cycle) {
    throw new Error("Cycle not found");
  }

  cycle.needsMaintenance = false;
  cycle.maintenanceReason = undefined;
  cycle.status = "available";
  cycle.lastMaintenanceAt = new Date();
  cycle.updatedBy = completedBy;

  await cycle.save();
  return cycle;
};

exports.getCycleById = async (id) => {
  const cycle = await Cycle.findById(id).populate("addedBy", "name role");
  if (!cycle) throw new Error("Cycle not found");
  return cycle;
};

exports.getCycleStats = async (id) => {
  const cycle = await Cycle.findById(id);
  if (!cycle) throw new Error("Cycle not found");

  // Get rental statistics for this specific cycle
  const Rental = require("../models/Rental");
  const stats = await Rental.aggregate([
    { $match: { cycle: cycle._id } },
    {
      $group: {
        _id: null,
        totalRentals: { $sum: 1 },
        totalDuration: { $sum: "$duration" },
        averageRating: { $avg: "$rating" },
      },
    },
  ]);

  return {
    cycle,
    stats: stats[0] || { totalRentals: 0, totalDuration: 0, averageRating: 0 },
  };
};

exports.updateCycleStatus = async (id, status) => {
  const cycle = await Cycle.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true }
  );
  if (!cycle) throw new Error("Cycle not found");
  return cycle;
};

exports.getDashboardStats = async () => {
  const total = await Cycle.countDocuments();
  const available = await Cycle.countDocuments({ status: "available" });
  const rented = await Cycle.countDocuments({ status: "rented" });
  const maintenance = await Cycle.countDocuments({ needsMaintenance: true });

  // Get today's rentals count
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const Rental = require("../models/Rental");
  const todayRentals = await Rental.countDocuments({
    createdAt: { $gte: today, $lt: tomorrow },
  });

  return {
    total,
    available,
    rented,
    maintenance,
    todayRentals,
  };
};
