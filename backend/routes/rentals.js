const express = require("express");
const auth = require("../middleware/auth");
const rentalController = require("../controllers/rentalController");

const router = express.Router();

router.get("/", rentalController.getAllRentals);
router.post("/", auth, rentalController.createRental);

module.exports = router;
