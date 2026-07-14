import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : 'https://boutique-backend-7con.onrender.com/api',
});

// Request interceptor to attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken') || localStorage.getItem('luxe_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor to handle 401 Unauthorized
api.interceptors.response.use((response) => {
  return response;
}, (error) => {
  if (error.response && error.response.status === 401) {
    const isLoginPage = window.location.pathname === '/login';
    
    // Clear all possible auth tokens
    const authKeys = ['accessToken', 'refreshToken', 'luxe_user', 'luxe_token'];
    authKeys.forEach(key => localStorage.removeItem(key));
    
    // Only redirect if not already on login page to avoid infinite reload loop
    if (!isLoginPage) {
      window.location.href = '/login'; 
    }
  }
  return Promise.reject(error);
});

export default api;
