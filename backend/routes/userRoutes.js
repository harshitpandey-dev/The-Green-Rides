const express = require("express");
const auth = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");
const userController = require("../controllers/userController");

const router = express.Router();

// Public/basic endpoints
router.get("/me", auth, userController.getCurrentUser);
router.post("/", userController.addUser);

router.get("/", auth, roleCheck(["super_admin"]), userController.getAllUsers);

router.get(
  "/role/:role",
  auth,
  roleCheck(["super_admin"]),
  userController.getAllUsersByRole
);

router.get(
  "/rollno/:rollNumber",
  auth,
  roleCheck(["super_admin", "finance_admin"]),
  userController.getUserByRollNumber
);

router.get(
  "/:id",
  auth,
  roleCheck(["super_admin"]),
  userController.getUserById
);
router.put("/:id", auth, roleCheck(["super_admin"]), userController.updateUser);
router.delete(
  "/:id",
  auth,
  roleCheck(["super_admin"]),
  userController.deleteUser
);
router.put(
  "/:id/status",
  auth,
  roleCheck(["super_admin"]),
  userController.updateUserStatus
);
router.get(
  "/statistics",
  auth,
  roleCheck(["super_admin"]),
  userController.getUserStatistics
);

router.post(
  "/:studentId/clear-fine",
  auth,
  roleCheck(["finance_admin", "super_admin"]),
  userController.clearStudentFine
);

module.exports = router;
