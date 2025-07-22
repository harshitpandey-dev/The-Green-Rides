export async function registerUser(props) {
  let response = await fetch(
    `${process.env.REACT_APP_API_ENDPOINT}/auth/register`,
    {
      method: "POST",
      body: JSON.stringify(props),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  let data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Could not Add Student.");
  }
  return data;
}

export async function loginUser(props) {
  const response = await fetch(
    `${process.env.REACT_APP_API_ENDPOINT}/auth/login`,
    {
      method: "POST",
      body: JSON.stringify({
        email: props.email,
        password: props.password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
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

export async function changePassword(props) {
  const response = await fetch(
    `${process.env.REACT_APP_API_ENDPOINT}/auth/change-password`,
    {
      method: "PUT",
      body: JSON.stringify({
        email: props?.email,
        oldPassword: props?.oldPassword,
        newPassword: props?.newPassword,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Could not change password.");
  }
  return data;
}
