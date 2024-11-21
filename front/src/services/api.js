import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:1337/api'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  login: (credentials) => api.post('/auth/local', credentials),
  me: () => api.get('/users/me')
};

export const productApi = {
  getAll: () => api.get('/products'),
  getOne: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', { data }),
  update: (id, data) => api.put(`/products/${id}`, { data }),
  delete: (id) => api.delete(`/products/${id}`)
};

export const transactionApi = {
  getAll: () => api.get('/transactions'),
  create: (data) => api.post('/transactions', { data }),
  approve: (id) => api.put(`/transactions/${id}`, { 
    data: { status: 'approved' } 
  })
};