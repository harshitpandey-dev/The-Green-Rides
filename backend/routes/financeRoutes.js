const express = require("express");
const auth = require("../middleware/auth");
const financeController = require("../controllers/financeController");

const router = express.Router();

// Finance management routes
router.get("/fines", auth, financeController.getAllFines);
router.get("/fines/:id", auth, financeController.getFineById);
router.post("/fines", auth, financeController.createFine);
router.put("/fines/:id", auth, financeController.updateFine);
router.put("/fines/:id/collect", auth, financeController.collectFine);
router.get(
  "/fines/student/:rollNumber",
  auth,
  financeController.getFinesByRollNumber
);

// Dashboard stats
router.get("/dashboard", auth, financeController.getFinanceDashboard);
router.get("/summary", auth, financeController.getFinancialSummary);

// Additional routes for frontend
router.put("/fines/:id/mark-paid", auth, financeController.markFinePaid);
router.get(
  "/student/:rollNumber/fines",
  auth,
  financeController.getStudentFines
);

module.exports = router;
