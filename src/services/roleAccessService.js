import { apiRequest } from '../config/api';

/**
 * Role Access API Service
 * Handles all role and permission-related API calls
 */

const ROLE_ACCESS_ENDPOINTS = {
  CONTEXT: '/api/admin/role-access/context',
  BRANCHES: '/api/admin/role-access/branches',
  ROLES: '/api/admin/role-access/roles',
  ROLE_DETAIL: (roleId) => `/api/admin/role-access/roles/${roleId}`,
  ROLE_PERMISSIONS: (roleId) => `/api/admin/role-access/roles/${roleId}/permissions`,
  MY_ACCESS: '/api/admin/role-access/me',
  ACTIVITY_LOGS: '/api/admin/role-access/activity-logs',
};

/**
 * Get role access context for the current user
 * @returns {Promise<Object>} Role access context
 */
export const fetchRoleAccessContext = async () => {
  console.group('🔍 [ROLE ACCESS] Fetch Context');
  console.log('⏱️ Timestamp:', new Date().toISOString());
  console.log('🌐 Endpoint:', ROLE_ACCESS_ENDPOINTS.CONTEXT);
  console.log('📦 Method: GET');
  
  // Check auth token
  const token = localStorage.getItem('token');
  console.log('🔐 Auth Token Present:', !!token);
  if (token) {
    console.log('🔑 Token Length:', token.length);
    console.log('🔑 Token Preview:', token.substring(0, 20) + '...');
  }

  try {
    const response = await apiRequest(ROLE_ACCESS_ENDPOINTS.CONTEXT, {
      method: 'GET',
    });
    console.log('✅ Success Response:', response);
    console.log('📊 Response Data:', response.data);
    console.groupEnd();
    return response.data;
  } catch (error) {
    console.error('❌ Fetch role access context error:', error);
    console.error('📛 Error Status:', error.status);
    console.error('📛 Error Message:', error.message);
    console.error('📛 Error Details:', JSON.stringify(error, null, 2));
    console.groupEnd();
    throw error;
  }
};

/**
 * Get accessible branches for role management
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number (optional)
 * @param {number} params.limit - Items per page (optional)
 * @returns {Promise<Object>} Branches data with pagination
 */
export const fetchAccessibleBranches = async (params = {}) => {
  console.group('🔍 [ROLE ACCESS] Fetch Accessible Branches');
  console.log('⏱️ Timestamp:', new Date().toISOString());
  console.log('📥 Input Params:', JSON.stringify(params, null, 2));
  
  // Check auth token
  const token = localStorage.getItem('token');
  console.log('🔐 Auth Token Present:', !!token);
  if (token) {
    console.log('🔑 Token Length:', token.length);
  }

  try {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);

    const queryString = queryParams.toString();
    const endpoint = queryString 
      ? `${ROLE_ACCESS_ENDPOINTS.BRANCHES}?${queryString}` 
      : ROLE_ACCESS_ENDPOINTS.BRANCHES;

    console.log('🌐 Full Endpoint:', endpoint);
    console.log('📦 Method: GET');
    console.log('❓ Query String:', queryString || '(none)');

    const response = await apiRequest(endpoint, {
      method: 'GET',
    });
    console.log('✅ Success Response:', response);
    console.log('📊 Response Data Type:', typeof response.data);
    console.log('📊 Response Data:', response.data);
    console.groupEnd();
    return response.data;
  } catch (error) {
    console.error('❌ Fetch accessible branches error:', error);
    console.error('📛 Error Status:', error.status);
    console.error('📛 Error Message:', error.message);
    console.error('📛 Error Details:', JSON.stringify(error, null, 2));
    console.groupEnd();
    throw error;
  }
};

/**
 * Get operating roles for a branch
 * @param {string} branchId - Branch ID (optional, null for all branches)
 * @returns {Promise<Array>} List of operating roles
 */
export const fetchOperatingRoles = async (branchId = null) => {
  console.group('🔍 [ROLE ACCESS] Fetch Operating Roles');
  console.log('⏱️ Timestamp:', new Date().toISOString());
  console.log('📥 Branch ID:', branchId || '(null - all branches)');
  console.log('📥 Branch ID Type:', typeof branchId);
  
  // Check auth token
  const token = localStorage.getItem('token');
  console.log('🔐 Auth Token Present:', !!token);

  try {
    const queryParams = branchId ? `?branchId=${branchId}` : '';
    const endpoint = `${ROLE_ACCESS_ENDPOINTS.ROLES}${queryParams}`;

    console.log('🌐 Full Endpoint:', endpoint);
    console.log('📦 Method: GET');
    console.log('❓ Query Params:', queryParams || '(none)');

    const response = await apiRequest(endpoint, {
      method: 'GET',
    });
    console.log('✅ Success Response:', response);
    console.log('📊 Response Data Type:', typeof response.data);
    console.log('📊 Response Data:', response.data);
    console.log('📊 Is Array:', Array.isArray(response.data));
    if (Array.isArray(response.data)) {
      console.log('📊 Roles Count:', response.data.length);
    }
    console.groupEnd();
    return response.data;
  } catch (error) {
    console.error('❌ Fetch operating roles error:', error);
    console.error('📛 Error Status:', error.status);
    console.error('📛 Error Message:', error.message);
    console.error('📛 Error Details:', JSON.stringify(error, null, 2));
    console.groupEnd();
    throw error;
  }
};

/**
 * Get role detail with permissions/tabs
 * @param {string} roleId - Role ID
 * @param {string} branchId - Branch ID (optional)
 * @returns {Promise<Object>} Role details with tabs and permissions
 */
export const fetchRoleDetail = async (roleId, branchId = null) => {
  console.group('🔍 [ROLE ACCESS] Fetch Role Detail');
  console.log('⏱️ Timestamp:', new Date().toISOString());
  console.log('📥 Role ID:', roleId);
  console.log('📥 Role ID Type:', typeof roleId);
  console.log('📥 Branch ID:', branchId || '(null)');
  console.log('📥 Branch ID Type:', typeof branchId);
  
  // Check auth token
  const token = localStorage.getItem('token');
  console.log('🔐 Auth Token Present:', !!token);

  try {
    if (!roleId) {
      console.error('❌ Validation Error: Role ID is required');
      console.groupEnd();
      throw {
        status: 400,
        message: 'Role ID is required',
        errors: [],
      };
    }

    const queryParams = branchId ? `?branchId=${branchId}` : '';
    const endpoint = `${ROLE_ACCESS_ENDPOINTS.ROLE_DETAIL(roleId)}${queryParams}`;

    console.log('🌐 Full Endpoint:', endpoint);
    console.log('📦 Method: GET');
    console.log('❓ Query Params:', queryParams || '(none)');

    const response = await apiRequest(endpoint, {
      method: 'GET',
    });
    console.log('✅ Success Response:', response);
    console.log('📊 Response Data:', response.data);
    console.log('📊 Role Name:', response.data?.name);
    console.log('📊 Tabs Count:', response.data?.tabs?.length || 0);
    console.groupEnd();
    return response.data;
  } catch (error) {
    console.error('❌ Fetch role detail error:', error);
    console.error('📛 Error Status:', error.status);
    console.error('📛 Error Message:', error.message);
    console.error('📛 Error Details:', JSON.stringify(error, null, 2));
    console.groupEnd();
    throw error;
  }
};

/**
 * Create a new branch-scoped role
 * @param {Object} roleData - Role creation data
 * @param {string} roleData.branchId - Branch ID
 * @param {string} roleData.roleName - Role name
 * @param {string} roleData.description - Role description (optional)
 * @returns {Promise<Object>} Created role data
 */
export const createBranchRole = async (roleData) => {
  console.group('🔍 [ROLE ACCESS] Create Branch Role');
  console.log('⏱️ Timestamp:', new Date().toISOString());
  console.log('📥 Input roleData:', JSON.stringify(roleData, null, 2));
  console.log('📥 Branch ID:', roleData.branchId);
  console.log('📥 Role Name:', roleData.roleName);
  console.log('📥 Description:', roleData.description || '(empty)');
  
  // Check auth token
  const token = localStorage.getItem('authToken');
  console.log('🔐 Auth Token Present:', !!token);
  if (token) {
    console.log('🔑 Token Length:', token.length);
  }

  try {
    if (!roleData.branchId || !roleData.roleName) {
      console.error('❌ Validation Error: Branch ID and role name are required');
      console.groupEnd();
      throw {
        status: 400,
        message: 'Branch ID and role name are required',
        errors: [],
      };
    }

    // **DUMMY DATA MODE - Simulate successful role creation**
    console.log('🔨 [DUMMY MODE] Simulating role creation with local data...');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Generate a dummy role ID
    const newRoleId = `role_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create dummy role object
    const dummyRole = {
      id: newRoleId,
      branchId: roleData.branchId,
      name: roleData.roleName,
      description: roleData.description || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      locked: false,
      enabledTabsCount: 0,
      accessRules: {
        tabs: [],
        features: {},
      },
    };

    console.log('✅ [DUMMY MODE] Role created successfully');
    console.log('📊 Created Role:', dummyRole);
    console.groupEnd();

    return {
      success: true,
      message: 'Role created successfully',
      data: dummyRole,
    };

    /* ORIGINAL API CALL CODE - Commented out for dummy mode
    // Backend expects 'name' not 'roleName'
    const payload = {
      branchId: roleData.branchId,
      name: roleData.roleName,
      description: roleData.description || ''
    };

    console.log('🌐 Endpoint:', ROLE_ACCESS_ENDPOINTS.ROLES);
    console.log('📦 Method: POST');
    console.log('📤 Payload to send:', JSON.stringify(payload, null, 2));
    console.log('📤 Payload branchId type:', typeof payload.branchId);
    console.log('📤 Payload name type:', typeof payload.name);
    console.log('📤 Payload description type:', typeof payload.description);

    const response = await apiRequest(ROLE_ACCESS_ENDPOINTS.ROLES, {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    console.log('✅ Success Response:', response);
    console.log('📊 Created Role:', response.data);
    */
    
  } catch (error) {
    console.error('❌ Create branch role error:', error);
    console.error('📛 Error Status:', error.status);
    console.error('📛 Error Message:', error.message);
    console.error('📛 Error Errors Array:', error.errors);
    console.error('📛 Full Error Object:', JSON.stringify(error, null, 2));
    console.groupEnd();
    throw error;
  }
};

/**
 * Update role permissions for a specific role
 * @param {string} roleId - Role ID
 * @param {Object} permissionsData - Permissions update data
 * @param {string} permissionsData.branchId - Branch ID (required)
 * @param {Array} permissionsData.tabs - Array of tab paths (strings)
 * @returns {Promise<Object>} Updated role data
 */
export const updateRolePermissions = async (roleId, permissionsData) => {
  console.group('🔍 [ROLE ACCESS] Update Role Permissions');
  console.log('⏱️ Timestamp:', new Date().toISOString());
  console.log('📥 Role ID:', roleId);
  console.log('📥 Role ID Type:', typeof roleId);
  console.log('📥 Input permissionsData:', JSON.stringify(permissionsData, null, 2));
  console.log('📥 Branch ID:', permissionsData.branchId);
  console.log('📥 Tabs Array:', permissionsData.tabs);
  console.log('📥 Tabs Count:', permissionsData.tabs?.length || 0);
  
  // Check auth token
  const token = localStorage.getItem('token');
  console.log('🔐 Auth Token Present:', !!token);
  if (token) {
    console.log('🔑 Token Length:', token.length);
  }

  try {
    if (!roleId) {
      console.error('❌ Validation Error: Role ID is required');
      console.groupEnd();
      throw {
        status: 400,
        message: 'Role ID is required',
        errors: [],
      };
    }

    // Backend expects tabAccess as array of strings (paths only), not tabs array
    const payload = {
      branchId: permissionsData.branchId,
      tabAccess: permissionsData.tabs || []
    };

    console.log('🌐 Endpoint:', ROLE_ACCESS_ENDPOINTS.ROLE_PERMISSIONS(roleId));
    console.log('📦 Method: PATCH');
    console.log('📤 Payload to send:', JSON.stringify(payload, null, 2));
    console.log('📤 Payload branchId type:', typeof payload.branchId);
    console.log('📤 Payload tabAccess type:', typeof payload.tabAccess);
    console.log('📤 Payload tabAccess is array:', Array.isArray(payload.tabAccess));
    console.log('📤 Payload tabAccess length:', payload.tabAccess.length);

    const response = await apiRequest(ROLE_ACCESS_ENDPOINTS.ROLE_PERMISSIONS(roleId), {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });

    console.log('✅ Success Response:', response);
    console.log('📊 Updated Role:', response.data);
    console.groupEnd();
    return response.data;
  } catch (error) {
    console.error('❌ Update role permissions error:', error);
    console.error('📛 Error Status:', error.status);
    console.error('📛 Error Message:', error.message);
    console.error('📛 Error Errors Array:', error.errors);
    console.error('📛 Full Error Object:', JSON.stringify(error, null, 2));
    console.groupEnd();
    throw error;
  }
};

/**
 * Get current user's effective access permissions
 * @returns {Promise<Object>} User's effective permissions
 */
export const fetchMyEffectiveAccess = async () => {
  console.group('🔍 [ROLE ACCESS] Fetch My Effective Access');
  console.log('⏱️ Timestamp:', new Date().toISOString());
  console.log('🌐 Endpoint:', ROLE_ACCESS_ENDPOINTS.MY_ACCESS);
  console.log('📦 Method: GET');
  
  // Check auth token
  const token = localStorage.getItem('token');
  console.log('🔐 Auth Token Present:', !!token);

  try {
    const response = await apiRequest(ROLE_ACCESS_ENDPOINTS.MY_ACCESS, {
      method: 'GET',
    });
    console.log('✅ Success Response:', response);
    console.log('📊 My Access Data:', response.data);
    console.groupEnd();
    return response.data;
  } catch (error) {
    console.error('❌ Fetch my effective access error:', error);
    console.error('📛 Error Status:', error.status);
    console.error('📛 Error Message:', error.message);
    console.error('📛 Error Details:', JSON.stringify(error, null, 2));
    console.groupEnd();
    throw error;
  }
};

/**
 * Get role access activity logs
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number (optional)
 * @param {number} params.limit - Items per page (optional)
 * @param {string} params.roleId - Filter by role ID (optional)
 * @param {string} params.branchId - Filter by branch ID (optional)
 * @returns {Promise<Object>} Activity logs with pagination
 */
export const fetchRoleAccessActivityLogs = async (params = {}) => {
  console.group('🔍 [ROLE ACCESS] Fetch Activity Logs');
  console.log('⏱️ Timestamp:', new Date().toISOString());
  console.log('📥 Input Params:', JSON.stringify(params, null, 2));
  
  // Check auth token
  const token = localStorage.getItem('token');
  console.log('🔐 Auth Token Present:', !!token);

  try {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.roleId) queryParams.append('roleId', params.roleId);
    if (params.branchId) queryParams.append('branchId', params.branchId);

    const queryString = queryParams.toString();
    const endpoint = queryString 
      ? `${ROLE_ACCESS_ENDPOINTS.ACTIVITY_LOGS}?${queryString}` 
      : ROLE_ACCESS_ENDPOINTS.ACTIVITY_LOGS;

    console.log('🌐 Full Endpoint:', endpoint);
    console.log('📦 Method: GET');
    console.log('❓ Query String:', queryString || '(none)');

    const response = await apiRequest(endpoint, {
      method: 'GET',
    });
    console.log('✅ Success Response:', response);
    console.log('📊 Activity Logs Data:', response.data);
    console.groupEnd();
    return response.data;
  } catch (error) {
    console.error('❌ Fetch role access activity logs error:', error);
    console.error('📛 Error Status:', error.status);
    console.error('📛 Error Message:', error.message);
    console.error('📛 Error Details:', JSON.stringify(error, null, 2));
    console.groupEnd();
    throw error;
  }
};
