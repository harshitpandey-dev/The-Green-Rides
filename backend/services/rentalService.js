const Rental = require("../models/Rental");
const { getCycleByCycleId } = require("./cycleService");

exports.getAllRentals = async () => {
  return await Rental.find().populate("user cycle");
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
  return Rental.findOne({ user: userId, status: "active", endTime: undefined });
};
