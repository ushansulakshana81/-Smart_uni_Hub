import axiosInstance from './axiosInstance';

const AUTH_API = '/auth';
const USERS_API = '/users';
const ADMIN_API = '/admin';
const CATALOG_API = '/catalog';

export const authService = {
  register: (data) => axiosInstance.post(`${AUTH_API}/register`, data),
  login: (data) => axiosInstance.post(`${AUTH_API}/login`, data),
  googleLogin: (googleEmail, googleId, firstName, lastName, nic) =>
    axiosInstance.post(`${AUTH_API}/google-login`, null, {
      params: { googleEmail, googleId, firstName, lastName, nic },
    }),
  forgotPassword: (data) => axiosInstance.post(`${AUTH_API}/forgot-password`, data),
  resetPassword: (data) => axiosInstance.post(`${AUTH_API}/reset-password`, data),
  verifyOtp: (data) => axiosInstance.post(`${AUTH_API}/verify-otp`, data),
};

export const userService = {
  getUserById: (id) => axiosInstance.get(`${USERS_API}/${id}`),
  getUserByEmail: (email) => axiosInstance.get(`${USERS_API}/email/${email}`),
  getMyProfile: () => axiosInstance.get(`${USERS_API}/profile/me`),
  updateProfile: (id, data) => axiosInstance.put(`${USERS_API}/${id}`, data),
};

export const adminService = {
  getAllUsers: () => axiosInstance.get(`${ADMIN_API}/users`),
  suspendUser: (userId) => axiosInstance.post(`${ADMIN_API}/users/${userId}/suspend`),
  unsuspendUser: (userId) => axiosInstance.post(`${ADMIN_API}/users/${userId}/unsuspend`),
  deleteUser: (userId) => axiosInstance.delete(`${ADMIN_API}/users/${userId}`),
  getAllAdmins: () => axiosInstance.get(`${ADMIN_API}/users/role/admin`),

  getFacilities: () => axiosInstance.get(`${ADMIN_API}/facilities`),
  createFacility: (data) => axiosInstance.post(`${ADMIN_API}/facilities`, data),
  updateFacility: (id, data) => axiosInstance.put(`${ADMIN_API}/facilities/${id}`, data),
  deleteFacility: (id) => axiosInstance.delete(`${ADMIN_API}/facilities/${id}`),

  getAssets: () => axiosInstance.get(`${ADMIN_API}/assets`),
  createAsset: (data) => axiosInstance.post(`${ADMIN_API}/assets`, data),
  updateAsset: (id, data) => axiosInstance.put(`${ADMIN_API}/assets/${id}`, data),
  deleteAsset: (id) => axiosInstance.delete(`${ADMIN_API}/assets/${id}`),

  getResourceRequests: () => axiosInstance.get(`${ADMIN_API}/resource-requests`),
  createResourceRequest: (data) => axiosInstance.post(`${ADMIN_API}/resource-requests`, data),
  updateResourceRequest: (id, data) => axiosInstance.put(`${ADMIN_API}/resource-requests/${id}`, data),
  deleteResourceRequest: (id) => axiosInstance.delete(`${ADMIN_API}/resource-requests/${id}`),
};

export const catalogService = {
  getFacilities: () => axiosInstance.get(`${CATALOG_API}/facilities`),
  getAssets: () => axiosInstance.get(`${CATALOG_API}/assets`),
};
