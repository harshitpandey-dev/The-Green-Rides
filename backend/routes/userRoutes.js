const express = require("express");
const auth = require("../middleware/auth");
const userController = require("../controllers/userController");

const router = express.Router();

router.get("/me", auth, userController.getCurrentUser);
router.post("/", userController.addUser);
router.get("/", auth, userController.getAllUsers);
router.get("/students", auth, userController.getAllStudents);
router.get("/guards", auth, userController.getAllGuards);
router.get("/:id", auth, userController.getUserById);
router.put("/:id", auth, userController.updateUser);
router.delete("/:id", auth, userController.deleteUser);
router.put("/:id/status", auth, userController.updateUserStatus);

module.exports = router;
