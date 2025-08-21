const express = require("express");
const auth = require("../middleware/auth");
const cycleController = require("../controllers/cycleController");

const router = express.Router();

// Existing routes
router.get("/", cycleController.getAllCycles);
router.post("/", auth, cycleController.createCycle);
router.put("/:id", auth, cycleController.updateCycle);
router.delete("/:id", auth, cycleController.deleteCycle);

// Admin-specific routes
router.get("/:id", auth, cycleController.getCycleById);
router.get("/:id/stats", auth, cycleController.getCycleStats);
router.put("/:id/status", auth, cycleController.updateCycleStatus);
router.put("/:id/maintenance", auth, cycleController.markForMaintenance);
router.get("/stats/dashboard", auth, cycleController.getDashboardStats);

module.exports = router;
