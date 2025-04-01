// frontend/src/services/authService.js
import api from './api';

export const authService = {
  // User login
  login: async (credentials) => {
    try {
      const response = await api.post('/login', credentials, { withCredentials: true });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Admin login
  adminLogin: async (credentials) => {
    try {
      const response = await api.post('/admin/login', credentials, { withCredentials: true });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // User registration
  register: async (userData) => {
    try {
      const response = await api.post('/register', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Admin registration
  adminRegister: async (userData) => {
    try {
      const response = await api.post('/admin/register', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};