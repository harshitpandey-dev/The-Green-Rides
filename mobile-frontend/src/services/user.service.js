import { apiUtils } from '../utils/api.util.js';

export async function createUser(props) {
  return await apiUtils.post('/auth/register', {
    name: props.name,
    email: props.email,
    role: props.role,
    password: props.password,
  });
}

export async function getAllUsers() {
  return await apiUtils.get('/users');
}

export async function getUserById(id) {
  return await apiUtils.get(`/users/${id}`);
}

export async function updateUser(id, props) {
  return await apiUtils.put(`/users/${id}`, props);
}
