const express = require("express");
const auth = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");
const userController = require("../controllers/userController");

const router = express.Router();

// Public/basic endpoints
router.get("/me", auth, userController.getCurrentUser);
router.post("/", userController.addUser);

// General admin endpoints (super_admin, finance_admin can view students)
router.get("/", auth, roleCheck(["super_admin"]), userController.getAllUsers);
router.get(
  "/students",
  auth,
  roleCheck(["super_admin", "finance_admin"]),
  userController.getAllStudents
);
router.get(
  "/guards",
  auth,
  roleCheck(["super_admin"]),
  userController.getAllGuards
);
router.get(
  "/finance-admins",
  auth,
  roleCheck(["super_admin"]),
  userController.getAllFinanceAdmins
);

// Student lookup by roll number (finance_admin and super_admin)
router.get(
  "/rollno/:rollNumber",
  auth,
  roleCheck(["super_admin", "finance_admin"]),
  userController.getUserByRollNumber
);

// User management (super_admin only)
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

// Finance admin specific endpoints
router.post(
  "/:studentId/clear-fine",
  auth,
  roleCheck(["finance_admin", "super_admin"]),
  userController.clearStudentFine
);

// Super admin only endpoints
router.post(
  "/finance-admin",
  auth,
  roleCheck(["super_admin"]),
  userController.createFinanceAdmin
);

module.exports = router;
