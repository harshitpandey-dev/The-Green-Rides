const url = "http://localhost:5000/api";

export async function registerUser(props) {
  let response = await fetch(`${url}/auth/register`, {
    method: "POST",
    body: JSON.stringify(props.student),
    headers: {
      "Content-Type": "application/json",
    },
  });
  let data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Could not Add Student.");
  }
  return "Student Added";
}

export async function loginUser(props) {
  const response = await fetch(`${url}/auth/login`, {
    method: "POST",
    body: JSON.stringify({
      email: props.email,
      password: props.password,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Could not login.");
  }
  return data;
}

// DELETE USER (not implemented in backend, placeholder)
export async function deleteUser(props) {
  throw new Error("Delete student API not implemented in backend");
}
