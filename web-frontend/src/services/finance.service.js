import { apiUtils } from "../utils/api.util.js";

export const financeService = {
  // Get all fines
  getAllFines: async () => {
    return await apiUtils.get("/finance/fines");
  },

  // Get fine by ID
  getFineById: async (fineId) => {
    return await apiUtils.get(`/finance/fines/${fineId}`);
  },

  // Create new fine
  createFine: async (fineData) => {
    return await apiUtils.post("/finance/fines", fineData);
  },

  // Update fine
  updateFine: async (fineId, fineData) => {
    return await apiUtils.put(`/finance/fines/${fineId}`, fineData);
  },

  // Collect fine (mark as paid)
  collectFine: async (fineId, paymentData = {}) => {
    return await apiUtils.put(`/finance/fines/${fineId}/collect`, {
      paymentMethod: paymentData.paymentMethod || "cash",
      collectedBy: paymentData.collectedBy,
    });
  },

  // Get fines by roll number
  getFinesByRollNumber: async (rollNumber) => {
    return await apiUtils.get(`/finance/fines/student/${rollNumber}`);
  },

  // Get finance dashboard data
  getFinanceDashboard: async () => {
    return await apiUtils.get("/finance/dashboard");
  },

  // Get financial summary
  getFinancialSummary: async () => {
    return await apiUtils.get("/finance/summary");
  },

  // Mark fine as paid
  markFinePaid: async (fineId) => {
    return await apiUtils.put(`/finance/fines/${fineId}/mark-paid`);
  },

  // Get student fines
  getStudentFines: async (rollNumber) => {
    return await apiUtils.get(`/finance/student/${rollNumber}/fines`);
  },
};
