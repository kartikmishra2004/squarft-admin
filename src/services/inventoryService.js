import API_BASE_URL, { apiRequest, getAuthToken, handleApiError } from '../config/api';

const INVENTORY_BASE = '/api/admin/inventory';

const unwrapData = (response) => response?.data ?? response;

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

// GET /api/admin/inventory
export const fetchProjects = async (params = {}) =>
  unwrapData(await apiRequest(`${INVENTORY_BASE}${buildQueryString(params)}`, { method: 'GET' }));

// GET /api/admin/inventory/source-profiles
export const fetchSourceProfiles = async (params = {}) =>
  unwrapData(await apiRequest(`${INVENTORY_BASE}/source-profiles${buildQueryString(params)}`, { method: 'GET' }));

// GET /api/admin/inventory/:projectId
export const fetchProjectById = async (projectId) =>
  unwrapData(await apiRequest(`${INVENTORY_BASE}/${projectId}`, { method: 'GET' }));

// PATCH /api/admin/inventory/:projectId/featured
export const updateProjectFeatured = async (projectId, isFeatured) =>
  unwrapData(await apiRequest(`${INVENTORY_BASE}/${projectId}/featured`, {
    method: 'PATCH',
    body: JSON.stringify({ isFeatured }),
  }));

// GET /api/admin/inventory/:projectId/configurations/:configurationId/units
export const fetchConfigurationUnits = async (projectId, configurationId) =>
  unwrapData(
    await apiRequest(
      `${INVENTORY_BASE}/${projectId}/configurations/${configurationId}/units`,
      { method: 'GET' }
    )
  );

// GET /api/admin/inventory/:projectId/documents
export const fetchProjectDocuments = async (projectId) =>
  unwrapData(await apiRequest(`${INVENTORY_BASE}/${projectId}/documents`, { method: 'GET' }));

// POST /api/admin/inventory/:projectId/documents (multipart upload)
export const uploadProjectDocument = async (projectId, { file, label, mediaType, sortOrder = 0 }) => {
  const token = getAuthToken();
  const formData = new FormData();
  formData.append('document', file);
  if (label) formData.append('label', label);
  if (mediaType) formData.append('mediaType', mediaType);
  formData.append('sortOrder', String(sortOrder));

  const response = await fetch(`${API_BASE_URL}${INVENTORY_BASE}/${projectId}/documents`, {
    method: 'POST',
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: formData,
  });

  if (!response.ok) {
    throw await handleApiError(response);
  }

  const data = await response.json();
  return unwrapData(data);
};

// GET /api/admin/inventory/:projectId/brochure/download
export const fetchProjectBrochureDownloadUrl = async (projectId, params = {}) =>
  unwrapData(
    await apiRequest(
      `${INVENTORY_BASE}/${projectId}/brochure/download${buildQueryString(params)}`,
      { method: 'GET' }
    )
  );

// GET /api/admin/inventory/:projectId/documents/:documentId/download
export const fetchProjectDocumentDownloadUrl = async (projectId, documentId, params = {}) =>
  unwrapData(
    await apiRequest(
      `${INVENTORY_BASE}/${projectId}/documents/${documentId}/download${buildQueryString(params)}`,
      { method: 'GET' }
    )
  );
