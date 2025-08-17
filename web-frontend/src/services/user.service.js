import { apiUtils } from "../utils/api.util.js";

export async function createUser(props) {
  return await apiUtils.post("/users", {
    name: props.name,
    email: props.email,
    role: props.role,
    password: props.password,
    rollNo: props.role === "student" ? props.rollNo : undefined,
  });
}
