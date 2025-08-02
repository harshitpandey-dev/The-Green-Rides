import { apiUtils } from "../utils/api.util.js";

export async function rentCycle(props) {
  await apiUtils.post("/rentals", { cycleId: props.cycleId });
  return "Cycle Rented";
}

export async function returnCycle(props) {
  return await apiUtils.put("/rentals", { cycleId: props.cycleId });
}

export async function getRentedCycleByUserId() {
  return await apiUtils.get("/rentals/getByUser");
}
