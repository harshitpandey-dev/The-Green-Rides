import { apiUtils } from '../utils/api.util.js';

export async function registerUser(props) {
  return await apiUtils.post('/auth/register', props);
}

export async function loginUser(props) {
  return await apiUtils.post('/auth/login', {
    email: props.email,
    password: props.password,
  });
}

// DELETE USER (not implemented in backend, placeholder)
export async function deleteUser(props) {
  throw new Error('Delete student API not implemented in backend');
}

export async function changePassword(props) {
  return await apiUtils.put('/auth/change-password', {
    email: props?.email,
    oldPassword: props?.oldPassword,
    newPassword: props?.newPassword,
  });
}
