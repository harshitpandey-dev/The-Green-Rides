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

  // Get all users
  getAllUsers: async () => {
    return await apiUtils.get("/users");
  },

  // Get all students
  getAllStudents: async () => {
    return await apiUtils.get("/users/students");
  },

  // Get all guards
  getAllGuards: async () => {
    return await apiUtils.get("/users/guards");
  },

  // Get user by ID
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

  // Add guard
  addGuard: async (guardData) => {
    return await apiUtils.post("/users/guards", guardData);
  },

  // Reset guard password
  resetGuardPassword: async (guardId) => {
    return await apiUtils.post(`/users/${guardId}/reset-password`);
  },

  // Get user fines
  getUserFines: async (userId) => {
    return await apiUtils.get(`/users/${userId}/fines`);
  },

  // Get user by roll number
  getUserByRollNumber: async (rollNumber) => {
    return await apiUtils.get(`/users/roll/${rollNumber}`);
  },

  // Current user
  getCurrentUser: async () => {
    return await apiUtils.get("/users/me");
  },
};

// For backward compatibility
export async function createUser(props) {
  return userService.createUser(props);
}
