const qrTokenService = require("../services/qrTokenService");

// Guard creates rental QR for student
exports.createRentalQR = async (req, res) => {
  try {
    const result = await qrTokenService.createRentalToken({
      guardId: req.user.userId,
      ...req.body,
    });
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Student scans rental QR
exports.scanRentalQR = async (req, res) => {
  try {
    const result = await qrTokenService.processRentalQR({
      studentId: req.user.userId,
      ...req.body,
    });
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Student creates return QR
exports.createReturnQR = async (req, res) => {
  try {
    const result = await qrTokenService.createReturnToken({
      studentId: req.user.userId,
    });
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Guard scans return QR
exports.scanReturnQR = async (req, res) => {
  try {
    const result = await qrTokenService.processReturnQR({
      guardId: req.user.userId,
      ...req.body,
    });
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get active rentals (for guards)
exports.getActiveRentals = async (req, res) => {
  try {
    const result = await qrTokenService.getActiveRentals({
      guardId: req.user.userId,
      location: req.query.location,
    });
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = exports;
