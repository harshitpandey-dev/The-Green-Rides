const url = "http://localhost:5000/api";

// RENT CYCLE (now handled as a rental)
export async function rentCycle(props) {
  // Create rental
  let response = await fetch(`${url}/rentals`, {
    method: "POST",
    body: JSON.stringify({ cycleId: props.cycleid }),
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + props.token,
    },
  });
  let data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Could not Rent Cycle");
  }
  return "Cycle Rented";
}

// ADD CYCLE
export async function addCycle(props) {
  let response = await fetch(`${url}/cycles`, {
    method: "POST",
    body: JSON.stringify(props.cycle),
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + props.token,
    },
  });
  let data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Could not Add Cycle.");
  }
  return "Cycle Added";
}

// DELETE CYCLE
export async function deleteCycle(props) {
  let response = await fetch(`${url}/cycles/${props.cycleid}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + props.token,
    },
  });
  let data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Could not Delete Cycle");
  }
  return "Cycle Deleted";
}

// LOGIN

// GET ALL CYCLES
export async function getCycles(props) {
  let response = await fetch(`${url}/cycles`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + props.token,
    },
  });
  let data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Could not fetch Cycles.");
  }
  return data;
}
