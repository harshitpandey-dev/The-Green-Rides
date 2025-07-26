const url = process.env.REACT_APP_API_ENDPOINT;

const getBearerToken = () => {
  const authKey = localStorage.getItem("GR_TOKEN");
  return `Bearer ${authKey}`;
};

export async function createUser(props) {
  let response = await fetch(`${url}/users`, {
    method: "POST",
    body: JSON.stringify({
      name: props.name,
      email: props.email,
      role: props.role,
      password: props.password,
      rollNo: props.role === "student" ? props.rollNo : undefined,
    }),
    headers: {
      "Content-Type": "application/json",
      Authorization: getBearerToken(),
    },
  });
  let data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Could not create user");
  }
  return data;
}
