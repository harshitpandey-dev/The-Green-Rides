const express = require("express");
const auth = require("../middleware/auth");
const cycleController = require("../controllers/cycleController");

const router = express.Router();

router.get("/", cycleController.getAllCycles);
router.post("/", auth, cycleController.createCycle);
router.put("/:id", auth, cycleController.updateCycle);
router.delete("/:id", auth, cycleController.deleteCycle);
router.put("/:id/status", auth, cycleController.updateCycleStatus);
router.get("/:id", auth, cycleController.getCycleById);
router.get("/:id/stats", auth, cycleController.getCycleStats);
router.put("/:id/maintenance", auth, cycleController.markForMaintenance);

module.exports = router;
