import { apiRequest } from '../config/api';

/**
 * Auth API Service
 * Handles authentication-related API calls
 * 
 * Note: There is no registration form. Users are manually created in the database.
 * This service only handles login functionality.
 */

const AUTH_ENDPOINTS = {
  ADMIN_LOGIN: '/api/v1/auth/admin/login',
  SUPER_ADMIN_LOGIN: '/api/v1/auth/super-admin/login',
};

/**
 * Admin login
 * @param {Object} credentials - Login credentials
 * @param {string} credentials.phone - Phone number
 * @param {string} credentials.password - Password
 * @returns {Promise<Object>} Login response with token and user data
 */
export const loginAdmin = async (credentials) => {
  try {
    const { phone, password } = credentials;

    if (!phone || !password) {
      throw {
        status: 400,
        message: 'Phone and password are required',
        errors: [],
      };
    }

  const response = await apiRequest(AUTH_ENDPOINTS.ADMIN_LOGIN, {
      method: 'POST',
      body: JSON.stringify({ phone, password, role: 'admin' }), 
    });

    // Store token and user data in localStorage
    if (response.token) {
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('userRole', 'admin');
      localStorage.setItem('userData', JSON.stringify(response.user));
    }

    return response;
  } catch (error) {
    console.error('Admin login error:', error);
    throw error;
  }
};

/**
 * Super Admin login
 * @param {Object} credentials - Login credentials
 * @param {string} credentials.phone - Phone number
 * @param {string} credentials.password - Password
 * @returns {Promise<Object>} Login response with token and user data
 */
export const loginSuperAdmin = async (credentials) => {
  try {
    const { phone, password } = credentials;

    if (!phone || !password) {
      throw {
        status: 400,
        message: 'Phone and password are required',
        errors: [],
      };
    }

   const response = await apiRequest(AUTH_ENDPOINTS.SUPER_ADMIN_LOGIN, {
      method: 'POST',
      body: JSON.stringify({ phone, password, role: 'super_admin' }), 
    });

    // Store token and user data in localStorage
    if (response.token) {
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('userRole', 'super_admin');
      localStorage.setItem('userData', JSON.stringify(response.user));
    }

    return response;
  } catch (error) {
    console.error('Super Admin login error:', error);
    throw error;
  }
};

/**
 * Logout user
 * Clears auth token from localStorage
 */
export const logout = () => {
  try {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userData');
    return true;
  } catch (error) {
    console.error('Logout error:', error);
    return false;
  }
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if user has auth token
 */
export const isAuthenticated = () => {
  try {
    const token = localStorage.getItem('authToken');
    return !!token;
  } catch (error) {
    console.error('Authentication check error:', error);
    return false;
  }
};

/**
 * Get stored auth token
 * @returns {string|null} Auth token or null
 */
export const getAuthToken = () => {
  try {
    return localStorage.getItem('authToken');
  } catch (error) {
    console.error('Get token error:', error);
    return null;
  }
};

/**
 * Get stored user data
 * @returns {Object|null} User data or null
 */
export const getUserData = () => {
  try {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Get user data error:', error);
    return null;
  }
};

/**
 * Get stored user role
 * @returns {string|null} User role or null
 */
export const getUserRole = () => {
  try {
    return localStorage.getItem('userRole');
  } catch (error) {
    console.error('Get user role error:', error);
    return null;
  }
};
