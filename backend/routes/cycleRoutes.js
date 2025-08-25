const express = require("express");
const auth = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");
const cycleController = require("../controllers/cycleController");

const router = express.Router();

router.get("/", cycleController.getAllCycles);
router.get("/available", auth, cycleController.getAvailableCycles);
router.get(
  "/dashboard/stats",
  auth,
  roleCheck(["super_admin", "guard"]),
  cycleController.getDashboardStats
);
router.post("/", auth, roleCheck(["super_admin"]), cycleController.createCycle);
router.put(
  "/:id",
  auth,
  roleCheck(["super_admin", "guard"]),
  cycleController.updateCycle
);
router.delete(
  "/:id",
  auth,
  roleCheck(["super_admin"]),
  cycleController.deleteCycle
);
router.put(
  "/:id/status",
  auth,
  roleCheck(["super_admin", "guard"]),
  cycleController.updateCycleStatus
);
router.get("/:id", auth, cycleController.getCycleById);
router.get("/:id/stats", auth, cycleController.getCycleStats);
router.put(
  "/:id/maintenance",
  auth,
  roleCheck(["super_admin", "guard"]),
  cycleController.markForMaintenance
);

module.exports = router;
