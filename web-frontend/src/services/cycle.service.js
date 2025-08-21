import { apiUtils } from "../utils/api.util.js";

export const cycleService = {
  getAllCycles: async () => {
    return await apiUtils.get("/cycles");
  },

  updateCycle: async (cycleId, cycleData) => {
    return await apiUtils.put(`/cycles/${cycleId}`, cycleData);
  },

  // ADD CYCLE
  addCycle: async (props) => {
    return await apiUtils.post("/cycles", props);
  },

  // DELETE CYCLE
  deleteCycle: async (cycleId) => {
    await apiUtils.delete(`/cycles/${cycleId}`);
    return "Cycle Deleted";
  },
};
