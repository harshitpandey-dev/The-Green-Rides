import { apiUtils } from '../utils/api.util.js';

export async function rentCycle(props) {
  const response = await apiUtils.post('/rentals', { cycleId: props.cycleId });
  return response;
}

export async function returnCycle(props) {
  return await apiUtils.put('/rentals', { cycleId: props.cycleId });
}

export async function getRentals() {
  return await apiUtils.get('/rentals/getByUser');
}
