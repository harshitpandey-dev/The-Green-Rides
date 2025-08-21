const express = require("express");
const auth = require("../middleware/auth");
const userController = require("../controllers/userController");

const router = express.Router();

// Existing routes
router.get("/me", auth, userController.getCurrentUser);
router.post("/", userController.addUser);

// Admin routes for user management
router.get("/", auth, userController.getAllUsers);
router.get("/students", auth, userController.getAllStudents);
router.get("/guards", auth, userController.getAllGuards);
router.get("/:id", auth, userController.getUserById);
router.put("/:id", auth, userController.updateUser);
router.delete("/:id", auth, userController.deleteUser);
router.put("/:id/status", auth, userController.updateUserStatus);
router.post("/guards", auth, userController.addGuard);
router.put(
  "/guards/:id/reset-password",
  auth,
  userController.resetGuardPassword
);

// Finance-specific routes
router.get("/:id/fines", auth, userController.getUserFines);
router.get("/roll/:rollNumber", auth, userController.getUserByRollNumber);

module.exports = router;
