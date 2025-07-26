const url = process.env.REACT_APP_API_ENDPOINT;

const getBearerToken = () => {
  const authKey = localStorage.getItem("GR_TOKEN");
  return `Bearer ${authKey}`;
};

export async function rentCycle(props) {
  let response = await fetch(`${url}/rentals`, {
    method: "POST",
    body: JSON.stringify({ cycleId: props.cycleId }),
    headers: {
      "Content-Type": "application/json",
      Authorization: getBearerToken(),
    },
  });
  let data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Could not Rent Cycle");
  }
  return "Cycle Rented";
}

export async function returnCycle(props) {
  let response = await fetch(`${url}/rentals`, {
    method: "PUT",
    body: JSON.stringify({ cycleId: props.cycleId }),
    headers: {
      "Content-Type": "application/json",
      Authorization: getBearerToken(),
    },
  });
  let data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Could not Rent Cycle");
  }
  return data;
}

export async function getRentedCycleByUserId() {
  let response = await fetch(`${url}/rentals/getByUser`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: getBearerToken(),
    },
  });
  let data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Could not Rent Cycle");
  }
  return data;
}
