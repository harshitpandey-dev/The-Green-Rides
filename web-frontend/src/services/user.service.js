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

  // Current user
  getCurrentUser: async () => {
    return await apiUtils.get("/users/me");
  },

  // Get student by roll number (finance_admin, super_admin)
  getStudentByRollNumber: async (rollNumber) => {
    return await apiUtils.get(`/users/rollno/${rollNumber}`);
  },

  // Clear student fine (finance_admin, super_admin)
  clearStudentFine: async (studentId) => {
    return await apiUtils.post(`/users/${studentId}/clear-fine`);
  },

  // Get all finance admins (super_admin only)
  getAllFinanceAdmins: async () => {
    return await apiUtils.get("/users/finance-admins");
  },

  // Create finance admin (super_admin only)
  createFinanceAdmin: async (adminData) => {
    return await apiUtils.post("/users/finance-admin", adminData);
  },
};

// For backward compatibility
export async function createUser(props) {
  return userService.createUser(props);
}
