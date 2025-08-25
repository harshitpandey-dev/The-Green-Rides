const express = require("express");
const auth = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");
const rentalController = require("../controllers/rentalController");

const router = express.Router();

router.get(
  "/",
  auth,
  roleCheck(["super_admin"]),
  rentalController.getAllRentals
);
router.get(
  "/active",
  auth,
  roleCheck(["guard", "super_admin"]),
  rentalController.getActiveRentals
);
router.post("/", auth, roleCheck(["student"]), rentalController.createRental);
router.put(
  "/",
  auth,
  roleCheck(["student", "guard"]),
  rentalController.completeRental
);
router.get("/getByUser", auth, rentalController.getRentalByUserId);
router.get("/history", auth, rentalController.getRentalHistory);
router.post(
  "/rating",
  auth,
  roleCheck(["student"]),
  rentalController.addRating
);
router.get(
  "/stats",
  auth,
  roleCheck(["student"]),
  rentalController.getStudentStats
);

module.exports = router;
