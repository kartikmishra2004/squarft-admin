import { apiRequest } from '../config/api';

/**
 * Auth API Service
 * Handles authentication-related API calls
 *
 * Note: There is no registration form. Admin/super_admin accounts are created
 * by an existing super_admin (see adminService.js). Login is email+password only.
 */

const AUTH_ENDPOINTS = {
  ADMIN_LOGIN_PASSWORD: '/api/v1/auth/admin/login-password',
  SUPER_ADMIN_LOGIN_PASSWORD: '/api/v1/auth/super-admin/login-password',
};

const storeAuthSession = ({ token, user }, role) => {
  if (!token || !user) {
    throw {
      status: 500,
      message: 'Login response did not include a valid session',
      errors: [],
    };
  }

  const normalizedUser = {
    ...user,
    branchId: user.branchId || user.branch_id || null,
    role: user.role || role,
  };

  localStorage.setItem('authToken', token);
  localStorage.setItem('userRole', normalizedUser.role);
  localStorage.setItem('userData', JSON.stringify(normalizedUser));

  return {
    token,
    user: normalizedUser,
  };
};

/**
 * Email+password login (admin or super_admin).
 * @param {Object} payload
 * @param {string} payload.email
 * @param {string} payload.password
 * @param {'admin'|'super_admin'} payload.role
 * @returns {Promise<Object>} Login response with token and user data
 */
export const loginWithPassword = async ({ email, password, role }) => {
  try {
    if (!email || !password) {
      throw { status: 400, message: 'Email and password are required', errors: [] };
    }

    const endpoint = role === 'super_admin'
      ? AUTH_ENDPOINTS.SUPER_ADMIN_LOGIN_PASSWORD
      : AUTH_ENDPOINTS.ADMIN_LOGIN_PASSWORD;

    const response = await apiRequest(endpoint, {
      method: 'POST',
      skipAuth: true,
      body: JSON.stringify({ email, password }),
    });

    return storeAuthSession(response, role);
  } catch (error) {
    console.error('Password login error:', error);
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
