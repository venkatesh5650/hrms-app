import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:4000/api',
});

// Attach JWT token automatically
API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if(token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const signup = (data) => API.post('/auth/signup', data);
export const login = (data) => API.post('/auth/login', data);
export const getProfile = () => API.get('/auth/profile');

export const getTasks = (query = '', status = '') =>
  API.get(`/tasks?q=${query}&status=${status}`);
export const createTask = (data) => API.post('/tasks', data);
export const updateTask = (id, data) => API.put(`/tasks/${id}`, data);
export const deleteTask = (id) => API.delete(`/tasks/${id}`);

export default API;
