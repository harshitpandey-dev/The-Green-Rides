import { apiUtils } from "../utils/api.util.js";

export const cycleService = {
  getAllCycles: async () => {
    return await apiUtils.get("/cycles");
  },

  updateCycle: async (cycleId, cycleData) => {
    return await apiUtils.put(`/cycles/${cycleId}`, cycleData);
  },

  // ADD CYCLE
  createCycle: async (props) => {
    return await apiUtils.post("/cycles", props);
  },

  // DELETE CYCLE
  deleteCycle: async (cycleId) => {
    await apiUtils.delete(`/cycles/${cycleId}`);
    return "Cycle Deleted";
  },

  updateCycleStatus: async (cycleId, status) => {
    return await apiUtils.put(`/cycles/${cycleId}/status`, { status });
  },
};
