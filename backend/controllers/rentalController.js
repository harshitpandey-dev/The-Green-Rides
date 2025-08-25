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
    const rental = await rentalService.completeRental(cycleId);
    res.status(201).json(rental);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getRentalByUserId = async (req, res) => {
  try {
    const rental = await rentalService.getRentalByUserId(req.user.userId);
    res.status(200).json(rental);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get rental history for student
exports.getRentalHistory = async (req, res) => {
  try {
    const { page = 1, limit = 10, location, status } = req.query;

    // Build filters object
    const filters = {
      page: parseInt(page),
      limit: parseInt(limit),
    };

    // For students, always filter by their own user ID
    if (req.user.role === "student") {
      filters.userId = req.user.userId;
    } else if (req.user.role === "guard" && location) {
      // For guards, filter by location if provided
      filters.location = location;
    }

    // Add status filter if provided
    if (status) {
      filters.status = status;
    }

    const result = await rentalService.getRentalHistory(filters);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add rating to rental
exports.addRating = async (req, res) => {
  try {
    const { rentalId, rating, comment } = req.body;
    const rental = await rentalService.addRating(
      rentalId,
      req.user.userId,
      rating,
      comment
    );
    res.status(200).json(rental);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get student stats
exports.getStudentStats = async (req, res) => {
  try {
    const stats = await rentalService.getStudentStats(req.user.userId);
    res.status(200).json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get active rentals (for guards)
exports.getActiveRentals = async (req, res) => {
  try {
    const { location } = req.query;
    let userId = null;

    // If user is a student, only show their rentals
    if (req.user.role === "student") {
      userId = req.user.userId;
    }
    // If user is a guard, filter by location if provided
    // If user is admin, show all active rentals

    const rentals = await rentalService.getActiveRentals({ location, userId });
    res.status(200).json(rentals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
