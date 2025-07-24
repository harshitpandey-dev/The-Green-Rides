const Rental = require("../models/Rental");

exports.getAllRentals = async () => {
  return await Rental.find().populate("user cycle");
};

exports.createRental = async (userId, cycleId) => {
  const rental = new Rental({ user: userId, cycle: cycleId });
  await rental.save();
  return rental;
};

exports.completeRental = async (userId, cycleId) => {
  const rental = Rental.findOne({ user: userId, cycle: cycleId });
  rental.endTime = new Date();
  await rental.save();
  return rental;
};
