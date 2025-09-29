const express = require("express");
const qrController = require("../controllers/qrController");
const auth = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");

const router = express.Router();

// Rental QR routes (Guard creates, Student scans)
router.post(
  "/rental/create",
  auth,
  roleCheck(["guard"]),
  qrController.createRentalQR
);
router.post(
  "/rental/scan",
  auth,
  roleCheck(["student"]),
  qrController.scanRentalQR
);

// Return QR routes (Student creates, Guard scans)
router.post(
  "/return/create",
  auth,
  roleCheck(["student"]),
  qrController.createReturnQR
);
router.post(
  "/return/scan",
  auth,
  roleCheck(["guard"]),
  qrController.scanReturnQR
);

// Active rentals (for guards)
router.get(
  "/active-rentals",
  auth,
  roleCheck(["guard"]),
  qrController.getActiveRentals
);

module.exports = router;
