import { apiUtils } from "../utils/api.util.js";

export async function registerUser(props) {
  try {
    const data = await apiUtils.post("/auth/register", props);
    return { success: true, data };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function loginUser(props) {
  try {
    const data = await apiUtils.post("/auth/login", {
      email: props.email,
      password: props.password,
    });
    return { success: true, data };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function changePassword(props) {
  try {
    const data = await apiUtils.put("/auth/change-password", {
      email: props?.email,
      oldPassword: props?.oldPassword,
      newPassword: props?.newPassword,
    });
    return { success: true, data };
  } catch (error) {
    return { success: false, message: error.message };
  }
}
