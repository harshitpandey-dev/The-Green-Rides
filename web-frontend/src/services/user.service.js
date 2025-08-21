import { apiUtils } from "../utils/api.util.js";

export const userService = {
  // Create new user
  createUser: async (props) => {
    return await apiUtils.post("/users", {
      name: props.name,
      email: props.email,
      role: props.role,
      password: props.password,
      rollNo: props.role === "student" ? props.rollNo : undefined,
    });
  },

  getAllUsers: async () => {
    return await apiUtils.get("/users");
  },

  getAllUsersByRole: async (role) => {
    return await apiUtils.get(`/users/role/${role}`);
  },

  getStudentByRollNumber: async (rollNumber) => {
    return await apiUtils.get(`/users/rollno/${rollNumber}`);
  },

  getUserById: async (userId) => {
    return await apiUtils.get(`/users/${userId}`);
  },

  // Update user
  updateUser: async (userId, userData) => {
    return await apiUtils.put(`/users/${userId}`, userData);
  },

  // Delete user
  deleteUser: async (userId) => {
    return await apiUtils.delete(`/users/${userId}`);
  },

  // Update user status
  updateUserStatus: async (userId, status) => {
    return await apiUtils.put(`/users/${userId}/status`, { status });
  },

  // Current user
  getCurrentUser: async () => {
    return await apiUtils.get("/users/me");
  },

  clearStudentFine: async (studentId) => {
    return await apiUtils.post(`/users/${studentId}/clear-fine`);
  },
};

// For backward compatibility
export async function createUser(props) {
  return userService.createUser(props);
}
