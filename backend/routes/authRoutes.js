const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const auth = require("../middleware/auth");

// Public routes
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/google-auth", authController.googleAuth);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

// Protected routes
router.post("/change-password", auth, authController.changePassword);
router.put("/update-profile", auth, authController.updateProfile);

module.exports = router;
