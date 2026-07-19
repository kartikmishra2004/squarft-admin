import { apiRequest } from '../config/api';

const ROLE_ACCESS_ENDPOINTS = {
  CONTEXT: '/api/admin/role-access/context',
  BRANCHES: '/api/admin/role-access/branches',
  ROLES: '/api/admin/role-access/roles',
  ROLE_DETAIL: (roleId) => `/api/admin/role-access/roles/${roleId}`,
  ROLE_PERMISSIONS: (roleId) => `/api/admin/role-access/roles/${roleId}/permissions`,
  ROLE_STATUS: (roleId) => `/api/admin/role-access/roles/${roleId}/status`,
  MY_ACCESS: '/api/admin/role-access/me',
  ACTIVITY_LOGS: '/api/admin/role-access/activity-logs',
};

const unwrapData = (response) => response?.data ?? response;

const normalizeBranch = (branch) => {
  if (!branch) return branch;

  return {
    ...branch,
    type: branch.type || branch.city || branch.branchCode || 'Branch',
    head: branch.head || branch.state || branch.city || branch.branchCode || 'Workspace',
    status: branch.status === 'ACTIVE' ? 'Active' : branch.status,
  };
};

const normalizeRoleAccessData = (data) => {
  if (!data) return data;

  if (Array.isArray(data)) return data;

  return {
    ...data,
    branch: normalizeBranch(data.branch),
    branches: Array.isArray(data.branches) ? data.branches.map(normalizeBranch) : data.branches,
    assignedBranch: normalizeBranch(data.assignedBranch),
    defaultBranch: normalizeBranch(data.defaultBranch),
    selectedBranch: normalizeBranch(data.selectedBranch),
  };
};

const clientError = (message, errors = []) => ({
  status: 400,
  message,
  errors,
});

const buildQueryString = (params = {}) => {
  const queryParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, value);
    }
  });

  const queryString = queryParams.toString();
  return queryString ? `?${queryString}` : '';
};

const getRequest = async (endpoint, params) => {
  const response = await apiRequest(`${endpoint}${buildQueryString(params)}`, {
    method: 'GET',
  });

  return normalizeRoleAccessData(unwrapData(response));
};

export const fetchRoleAccessContext = async () =>
  getRequest(ROLE_ACCESS_ENDPOINTS.CONTEXT);

export const fetchAccessibleBranches = async (params = {}) =>
  getRequest(ROLE_ACCESS_ENDPOINTS.BRANCHES, {
    page: params.page,
    limit: params.limit,
    search: params.search,
    status: params.status,
  });

export const fetchOperatingRoles = async (branchId = null) =>
  getRequest(ROLE_ACCESS_ENDPOINTS.ROLES, { branchId });

export const fetchRoleDetail = async (roleId, branchId = null) => {
  if (!roleId) {
    throw clientError('Role ID is required', [
      { field: 'roleId', message: 'roleId is required' },
    ]);
  }

  return getRequest(ROLE_ACCESS_ENDPOINTS.ROLE_DETAIL(roleId), { branchId });
};

export const createBranchRole = async (roleData = {}) => {
  const name = roleData.name || roleData.roleName;

  if (!roleData.branchId || !name?.trim()) {
    throw clientError('Branch ID and role name are required', [
      !roleData.branchId && { field: 'branchId', message: 'branchId is required' },
      !name?.trim() && { field: 'name', message: 'name is required' },
    ].filter(Boolean));
  }

  const body = {
    branchId: roleData.branchId,
    name: name.trim(),
    description: roleData.description?.trim() || '',
  };

  if (roleData.phone && roleData.password) {
    body.phone = roleData.phone.trim();
    body.password = roleData.password;
    body.fullName = roleData.fullName?.trim() || '';
    body.email = roleData.email?.trim() || undefined;
  }

  const response = await apiRequest(ROLE_ACCESS_ENDPOINTS.ROLES, {
    method: 'POST',
    body: JSON.stringify(body),
  });

  return normalizeRoleAccessData(unwrapData(response));
};

export const updateRolePermissions = async (roleId, permissionsData = {}) => {
  const permissions = permissionsData.permissions;
  const tabAccess = permissionsData.tabAccess || permissionsData.tabs || [];
  const usingPermissions = Array.isArray(permissions);

  if (!roleId || !permissionsData.branchId || (!usingPermissions && !Array.isArray(tabAccess))) {
    throw clientError('Role ID, branch ID, and tab access are required', [
      !roleId && { field: 'roleId', message: 'roleId is required' },
      !permissionsData.branchId && { field: 'branchId', message: 'branchId is required' },
      !usingPermissions && !Array.isArray(tabAccess) && { field: 'tabAccess', message: 'tabAccess must be an array' },
    ].filter(Boolean));
  }

  const body = { branchId: permissionsData.branchId };
  if (usingPermissions) {
    body.permissions = permissions;
  } else {
    body.tabAccess = tabAccess;
  }

  const response = await apiRequest(ROLE_ACCESS_ENDPOINTS.ROLE_PERMISSIONS(roleId), {
    method: 'PATCH',
    body: JSON.stringify(body),
  });

  return normalizeRoleAccessData(unwrapData(response));
};

export const updateRoleStatus = async (roleId, statusData = {}) => {
  if (!roleId || !statusData.branchId || !statusData.status) {
    throw clientError('Role ID, branch ID, and status are required', [
      !roleId && { field: 'roleId', message: 'roleId is required' },
      !statusData.branchId && { field: 'branchId', message: 'branchId is required' },
      !statusData.status && { field: 'status', message: 'status is required' },
    ].filter(Boolean));
  }

  const response = await apiRequest(ROLE_ACCESS_ENDPOINTS.ROLE_STATUS(roleId), {
    method: 'PATCH',
    body: JSON.stringify({
      branchId: statusData.branchId,
      status: statusData.status,
    }),
  });

  return normalizeRoleAccessData(unwrapData(response));
};

export const fetchMyEffectiveAccess = async () =>
  getRequest(ROLE_ACCESS_ENDPOINTS.MY_ACCESS);

export const fetchRoleAccessActivityLogs = async (params = {}) =>
  getRequest(ROLE_ACCESS_ENDPOINTS.ACTIVITY_LOGS, {
    page: params.page,
    limit: params.limit,
    branchId: params.branchId,
    roleId: params.roleId,
    action: params.action,
    fromDate: params.fromDate,
    toDate: params.toDate,
  });
