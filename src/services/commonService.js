import API_BASE_URL, { apiRequest, getAuthToken, handleApiError } from '../config/api';

const COMMON_ENDPOINTS = {
  GLOBAL_SEARCH: '/api/admin/common/global-search',
  MASTER_OPTIONS: '/api/admin/common/master-options',
  BRANCHES: '/api/admin/common/branches',
  CITIES: '/api/admin/common/cities',
  USERS: '/api/admin/common/users',
  SALES_OFFICERS: '/api/admin/common/sales-officers',
  FIELD_OFFICERS: '/api/admin/common/field-officers',
  BROKERS: '/api/admin/common/brokers',
  BUILDERS: '/api/admin/common/builders',
  PROJECTS: '/api/admin/common/projects',
  PROPERTIES: '/api/admin/common/properties',
  FILE_UPLOAD: '/api/admin/common/file-upload',
};

const unwrapData = (response) => response?.data ?? response;

const buildQueryString = (params = {}) => {
  const queryParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      if (value.length) queryParams.append(key, value.join(','));
      return;
    }

    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, value);
    }
  });

  const queryString = queryParams.toString();
  return queryString ? `?${queryString}` : '';
};

const getRequest = async (endpoint, params = {}) => {
  const response = await apiRequest(`${endpoint}${buildQueryString(params)}`, {
    method: 'GET',
  });

  return unwrapData(response);
};

export const globalSearch = async (params = {}) =>
  getRequest(COMMON_ENDPOINTS.GLOBAL_SEARCH, {
    q: params.q,
    types: params.types,
    branchId: params.branchId,
    city: params.city,
    limit: params.limit,
  });

export const fetchMasterOptions = async (groups = []) =>
  getRequest(COMMON_ENDPOINTS.MASTER_OPTIONS, { groups });

export const fetchCommonBranches = async (params = {}) =>
  getRequest(COMMON_ENDPOINTS.BRANCHES, {
    search: params.search,
    status: params.status,
    city: params.city,
    state: params.state,
    includeMetrics: params.includeMetrics,
  });

export const fetchCities = async (params = {}) =>
  getRequest(COMMON_ENDPOINTS.CITIES, {
    search: params.search,
    state: params.state,
    status: params.status,
  });

export const fetchCommonUsers = async (params = {}) =>
  getRequest(COMMON_ENDPOINTS.USERS, {
    userType: params.userType,
    roleCode: params.roleCode,
    branchId: params.branchId,
    status: params.status,
    search: params.search,
    page: params.page,
    limit: params.limit,
  });

export const fetchSalesOfficers = async (params = {}) =>
  getRequest(COMMON_ENDPOINTS.SALES_OFFICERS, {
    branchId: params.branchId,
    search: params.search,
    status: params.status,
    availableOnly: params.availableOnly,
    page: params.page,
    limit: params.limit,
  });

export const fetchFieldOfficers = async (params = {}) =>
  getRequest(COMMON_ENDPOINTS.FIELD_OFFICERS, {
    branchId: params.branchId,
    search: params.search,
    status: params.status,
    page: params.page,
    limit: params.limit,
  });

export const fetchBrokers = async (params = {}) =>
  getRequest(COMMON_ENDPOINTS.BROKERS, {
    branchId: params.branchId,
    search: params.search,
    status: params.status,
    page: params.page,
    limit: params.limit,
  });

export const fetchBuilders = async (params = {}) =>
  getRequest(COMMON_ENDPOINTS.BUILDERS, {
    branchId: params.branchId,
    search: params.search,
    status: params.status,
    page: params.page,
    limit: params.limit,
  });

export const fetchProjects = async (params = {}) =>
  getRequest(COMMON_ENDPOINTS.PROJECTS, {
    branchId: params.branchId,
    search: params.search,
    city: params.city,
    state: params.state,
    status: params.status,
    activeOnly: params.activeOnly,
    page: params.page,
    limit: params.limit,
  });

export const fetchProperties = async (params = {}) =>
  getRequest(COMMON_ENDPOINTS.PROPERTIES, {
    branchId: params.branchId,
    projectId: params.projectId,
    propertyId: params.propertyId,
    search: params.search,
    city: params.city,
    status: params.status,
    unitStatus: params.unitStatus,
    includeUnits: params.includeUnits,
    source: params.source,
    page: params.page,
    limit: params.limit,
  });

export const uploadCommonFile = async ({ file, module, folder, metadata } = {}) => {
  if (!file) {
    throw {
      status: 400,
      message: 'File is required',
      errors: [{ field: 'file', message: 'file is required' }],
    };
  }

  const formData = new FormData();
  formData.append('file', file);
  if (module) formData.append('module', module);
  if (folder) formData.append('folder', folder);
  if (metadata) formData.append('metadata', JSON.stringify(metadata));

  const token = getAuthToken();

  try {
    const response = await fetch(`${API_BASE_URL}${COMMON_ENDPOINTS.FILE_UPLOAD}`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      throw await handleApiError(response);
    }

    const contentType = response.headers.get('content-type');
    const data = contentType?.includes('application/json')
      ? await response.json()
      : { success: true };

    return unwrapData(data);
  } catch (error) {
    if (error.status && error.message) throw error;

    throw {
      status: 0,
      message: error.message || 'File upload failed',
      errors: [],
    };
  }
};
