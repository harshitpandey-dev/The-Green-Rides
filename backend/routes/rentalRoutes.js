const express = require("express");
const auth = require("../middleware/auth");
const rentalController = require("../controllers/rentalController");

const router = express.Router();

router.get("/", rentalController.getAllRentals);
router.post("/", rentalController.createRental);
router.put("/", rentalController.completeRental);
router.get("/getByUser", rentalController.getRentalByUserId);

module.exports = router;
