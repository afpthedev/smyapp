import axios from 'axios';

// API için temel URL
const API_URL = 'http://localhost:8080/api';

// Axios instance oluşturma
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - her istekte token kontrolü
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - 401 hatası durumunda logout
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth servisleri
export const authService = {
  login: (username: string, password: string) => {
    return api.post('/authenticate', {username, password});
  },
  logout: () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  },
  isAuthenticated: () => {
    return localStorage.getItem('token') !== null;
  }
};

export default api;
