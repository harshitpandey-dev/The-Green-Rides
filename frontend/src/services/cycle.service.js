const url = process.env.REACT_APP_API_ENDPOINT;

const getBearerToken = () => {
  const authKey = localStorage.getItem("GR_TOKEN");
  return `Bearer ${authKey}`;
};

// ADD CYCLE
export async function addCycle(props) {
  let response = await fetch(`${url}/cycles`, {
    method: "POST",
    body: JSON.stringify(props),
    headers: {
      "Content-Type": "application/json",
      Authorization: getBearerToken(),
    },
  });
  let data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Could not Add Cycle.");
  }
  return data;
}

// DELETE CYCLE
export async function deleteCycle(cycleId) {
  let response = await fetch(`${url}/cycles/${cycleId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: getBearerToken(),
    },
  });
  let data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Could not Delete Cycle");
  }
  return "Cycle Deleted";
}

// GET ALL CYCLES
export async function getCycles(props) {
  let response = await fetch(`${url}/cycles`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: getBearerToken(),
    },
  });
  let data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Could not fetch Cycles.");
  }
  return data;
}
