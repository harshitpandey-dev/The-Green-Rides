const express = require("express");
const auth = require("../middleware/auth");
const rentalController = require("../controllers/rentalController");

const router = express.Router();

router.get("/", rentalController.getAllRentals);
router.post("/", auth, rentalController.createRental);
router.put("/", auth, rentalController.completeRental);

module.exports = router;
