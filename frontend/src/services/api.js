import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
  createStaff: (userData) => api.post('/auth/admin/create-staff', userData),
};

export const tenantAPI = {
  getActive: () => api.get('/tenants/active'),
  getAll: () => api.get('/tenants'),
  create: (data) => api.post('/tenants', data),
};

export const complaintAPI = {
  create: (data) => api.post('/complaints', data),
  getAll: () => api.get('/complaints'),
  getByConsumerId: (id) => api.get(`/complaints/consumer/${id}`),
  getById: (id) => api.get(`/complaints/${id}`),
  getByTenantId: (id) => api.get(`/complaints/tenant/${id}`),
  assign: (id, assigned_to) => api.patch(`/complaints/${id}/assign`, { assigned_to }),
  updateStatus: (id, status, note) => api.patch(`/complaints/${id}/status`, { status, note }),
  addUpdate: (id, note) => api.post(`/complaints/${id}/updates`, { note }),
  confirm: (id, feedback) => api.post(`/complaints/${id}/confirm`, { feedback }),
};

export const userAPI = {
  getAll: () => api.get('/users'),
  getByTenant: (tenantId) => api.get(`/users/tenant/${tenantId}`),
};

export default api;