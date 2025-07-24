const rentalService = require("../services/rentalService");

exports.getAllRentals = async (req, res) => {
  try {
    const rentals = await rentalService.getAllRentals();
    res.json(rentals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createRental = async (req, res) => {
  try {
    const { cycleId } = req.body;
    const rental = await rentalService.createRental(req.user.userId, cycleId);
    res.status(201).json(rental);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.completeRental = async (req, res) => {
  try {
    const { cycleId } = req.body;
    const rental = await rentalService.completeRental(req.user.userId, cycleId);
    res.status(201).json(rental);
  } catch (error) {
    res.status(500).json({ message: err.message });
  }
};
