import { apiUtils } from "../utils/api.util.js";

export const cycleService = {
  // ADD CYCLE
  addCycle: async (props) => {
    return await apiUtils.post("/cycles", props);
  },

  // DELETE CYCLE
  deleteCycle: async (cycleId) => {
    await apiUtils.delete(`/cycles/${cycleId}`);
    return "Cycle Deleted";
  },

  // GET ALL CYCLES
  getCycles: async () => {
    return await apiUtils.get("/cycles");
  },
};
