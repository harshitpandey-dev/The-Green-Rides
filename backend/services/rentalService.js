const Rental = require("../models/Rental");

exports.getAllRentals = async () => {
  return await Rental.find().populate("user cycle");
};

exports.createRental = async (userId, cycleId) => {
  const rental = new Rental({ user: userId, cycle: cycleId });
  await rental.save();
  return rental;
};
