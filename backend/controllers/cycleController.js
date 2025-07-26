const cycleService = require("../services/cycleService");

exports.getAllCycles = async (req, res) => {
  try {
    const cycles = await cycleService.getAllCycles();
    res.json(cycles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createCycle = async (req, res) => {
  try {
    const cycle = await cycleService.createCycle(req.body);
    res.status(201).json(cycle);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateCycle = async (req, res) => {
  try {
    const cycle = await cycleService.updateCycle(req.params.id, req.body);
    res.json(cycle);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

exports.deleteCycle = async (req, res) => {
  try {
    const result = await cycleService.deleteCycle(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
