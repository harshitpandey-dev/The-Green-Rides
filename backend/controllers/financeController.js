const financeService = require("../services/financeService");

exports.getAllFines = async (req, res) => {
  try {
    const fines = await financeService.getAllFines();
    res.json(fines);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getFineById = async (req, res) => {
  try {
    const fine = await financeService.getFineById(req.params.id);
    res.json(fine);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

exports.createFine = async (req, res) => {
  try {
    const fine = await financeService.createFine(req.body);
    res.status(201).json(fine);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateFine = async (req, res) => {
  try {
    const fine = await financeService.updateFine(req.params.id, req.body);
    res.json(fine);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.collectFine = async (req, res) => {
  try {
    const fine = await financeService.collectFine(req.params.id, req.body);
    res.json(fine);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getFinesByRollNumber = async (req, res) => {
  try {
    const fines = await financeService.getFinesByRollNumber(
      req.params.rollNumber
    );
    res.json(fines);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

exports.getFinanceDashboard = async (req, res) => {
  try {
    const dashboard = await financeService.getFinanceDashboard();
    res.json(dashboard);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getFinancialSummary = async (req, res) => {
  try {
    const summary = await financeService.getFinancialSummary();
    res.json(summary);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.markFinePaid = async (req, res) => {
  try {
    const fine = await financeService.markFinePaid(req.params.id);
    res.json(fine);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getStudentFines = async (req, res) => {
  try {
    const fines = await financeService.getStudentFines(req.params.rollNumber);
    res.json(fines);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
