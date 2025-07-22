const express = require("express");
const auth = require("../middleware/auth");
const userController = require("../controllers/userController");

const router = express.Router();

router.get("/me", auth, userController.getCurrentUser);

module.exports = router;
