import { apiRequest } from '../config/api';

/**
 * Admin Management API Service (super_admin only)
 * List and create admin accounts — email+password is set at creation time.
 */

const ADMIN_ENDPOINTS = {
  LIST: '/api/v1/auth/admin/list',
  CREATE: '/api/v1/auth/admin/register',
};

/**
 * Fetch all admin accounts.
 * @returns {Promise<Array>} List of admin accounts
 */
export const fetchAdmins = async () => {
  try {
    const response = await apiRequest(ADMIN_ENDPOINTS.LIST, { method: 'GET' });
    return response.admins || [];
  } catch (error) {
    console.error('Fetch admins error:', error);
    throw error;
  }
};

/**
 * Create a new admin account.
 * @param {Object} payload
 * @param {string} payload.full_name
 * @param {string} payload.email
 * @param {string} payload.phone
 * @param {string} payload.password
 * @param {string} [payload.branch_id]
 * @returns {Promise<Object>} Created admin user
 */
export const createAdmin = async ({ full_name, email, phone, password, branch_id }) => {
  try {
    if (!full_name || !email || !phone || !password) {
      throw { status: 400, message: 'Full name, email, phone, and password are required', errors: [] };
    }

    const response = await apiRequest(ADMIN_ENDPOINTS.CREATE, {
      method: 'POST',
      body: JSON.stringify({ full_name, email, phone, password, branch_id: branch_id || null }),
    });

    return response.user;
  } catch (error) {
    console.error('Create admin error:', error);
    throw error;
  }
};
