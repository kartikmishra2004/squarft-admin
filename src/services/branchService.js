import { apiRequest, getAuthHeaders } from '../config/api';

/**
 * Branch API Service
 * Handles all branch-related API calls
 */

const BRANCH_ENDPOINTS = {
  BASE: '/api/admin/branches',
  BY_ID: (branchId) => `/api/admin/branches/${branchId}`,
  STATUS: (branchId) => `/api/admin/branches/${branchId}/status`,
  TEAM: (branchId) => `/api/admin/branches/${branchId}/team`,
};

/**
 * Fetch all branches with optional pagination
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number (optional)
 * @param {number} params.limit - Items per page (optional)
 * @returns {Promise<Object>} Branches data with pagination info
 */
export const fetchBranches = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);

    const queryString = queryParams.toString();
    const endpoint = queryString 
      ? `${BRANCH_ENDPOINTS.BASE}?${queryString}` 
      : BRANCH_ENDPOINTS.BASE;

    const response = await apiRequest(endpoint, {
      method: 'GET',
    });

    return response.data;
  } catch (error) {
    console.error('Fetch branches error:', error);
    throw error;
  }
};

/**
 * Fetch single branch by ID
 * @param {string} branchId - Branch ID
 * @returns {Promise<Object>} Branch details
 */
export const fetchBranchById = async (branchId) => {
  try {
    if (!branchId) {
      throw {
        status: 400,
        message: 'Branch ID is required',
        errors: [],
      };
    }

    const response = await apiRequest(BRANCH_ENDPOINTS.BY_ID(branchId), {
      method: 'GET',
    });

    return response.data;
  } catch (error) {
    console.error('Fetch branch by ID error:', error);
    throw error;
  }
};

/**
 * Create a new branch
 * @param {Object} branchData - Branch data
 * @param {string} branchData.name - Branch name
 * @param {string} branchData.type - Branch type
 * @param {string} branchData.head - Branch manager
 * @param {string} branchData.status - Branch status
 * @param {string} branchData.address - Branch address
 * @returns {Promise<Object>} Created branch data
 */
export const createBranch = async (branchData) => {
  try {
    if (!branchData.name) {
      throw {
        status: 400,
        message: 'Branch name is required',
        errors: [],
      };
    }

    const response = await apiRequest(BRANCH_ENDPOINTS.BASE, {
      method: 'POST',
      body: JSON.stringify(branchData),
    });

    return response.data;
  } catch (error) {
    console.error('Create branch error:', error);
    throw error;
  }
};

/**
 * Update branch details
 * @param {string} branchId - Branch ID
 * @param {Object} branchData - Updated branch data
 * @returns {Promise<Object>} Updated branch data
 */
export const updateBranch = async (branchId, branchData) => {
  try {
    if (!branchId) {
      throw {
        status: 400,
        message: 'Branch ID is required',
        errors: [],
      };
    }

    console.log('=== BRANCH SERVICE UPDATE ===');
    console.log('Branch ID:', branchId);
    console.log('Branch Data:', JSON.stringify(branchData, null, 2));

    const response = await apiRequest(BRANCH_ENDPOINTS.BY_ID(branchId), {
      method: 'PATCH',
      body: JSON.stringify(branchData),
    });

    console.log('Update response:', response);
    return response.data;
  } catch (error) {
    console.error('Update branch error:', error);
    throw error;
  }
};

/**
 * Update branch status
 * @param {string} branchId - Branch ID
 * @param {string} status - New status
 * @returns {Promise<Object>} Updated branch data
 */
export const updateBranchStatus = async (branchId, status) => {
  try {
    if (!branchId) {
      throw {
        status: 400,
        message: 'Branch ID is required',
        errors: [],
      };
    }

    if (!status) {
      throw {
        status: 400,
        message: 'Status is required',
        errors: [],
      };
    }

    const response = await apiRequest(BRANCH_ENDPOINTS.STATUS(branchId), {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });

    return response.data;
  } catch (error) {
    console.error('Update branch status error:', error);
    throw error;
  }
};

/**
 * Fetch branch team members
 * @param {string} branchId - Branch ID
 * @returns {Promise<Array>} Team members list
 */
export const fetchBranchTeam = async (branchId) => {
  try {
    if (!branchId) {
      throw {
        status: 400,
        message: 'Branch ID is required',
        errors: [],
      };
    }

    const response = await apiRequest(BRANCH_ENDPOINTS.TEAM(branchId), {
      method: 'GET',
    });

    return response.data;
  } catch (error) {
    console.error('Fetch branch team error:', error);
    throw error;
  }
};
