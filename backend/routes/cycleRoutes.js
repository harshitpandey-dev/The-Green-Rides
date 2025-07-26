const express = require("express");
const auth = require("../middleware/auth");
const cycleController = require("../controllers/cycleController");

const router = express.Router();

router.get("/", cycleController.getAllCycles);
router.post("/", auth, cycleController.createCycle);
router.put("/:id", auth, cycleController.updateCycle);
router.delete("/:id", auth, cycleController.deleteCycle);

module.exports = router;
