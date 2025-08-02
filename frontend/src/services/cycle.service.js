import { apiUtils } from "../utils/api.util.js";

// ADD CYCLE
export async function addCycle(props) {
  return await apiUtils.post("/cycles", props);
}

// DELETE CYCLE
export async function deleteCycle(cycleId) {
  await apiUtils.delete(`/cycles/${cycleId}`);
  return "Cycle Deleted";
}

// GET ALL CYCLES
export async function getCycles() {
  return await apiUtils.get("/cycles");
}
