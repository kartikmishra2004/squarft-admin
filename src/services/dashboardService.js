import API_BASE_URL, { apiRequest, getAuthHeaders } from '../config/api';

const unwrap = (response) => response?.data ?? response;

const buildQueryString = (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') query.append(key, value);
  });
  const queryString = query.toString();
  return queryString ? `?${queryString}` : '';
};

// GET /api/admin/dashboard/summary
export const fetchAdminDashboardSummary = async (params = {}) =>
  unwrap(await apiRequest(`/api/admin/dashboard/summary${buildQueryString(params)}`, { method: 'GET' }));

// GET /api/admin/dashboard/activity-feed
export const fetchAdminDashboardActivityFeed = async (params = {}) =>
  unwrap(await apiRequest(`/api/admin/dashboard/activity-feed${buildQueryString(params)}`, { method: 'GET' }));

// PATCH /api/admin/dashboard/activity-feed/:activityId/dismiss
export const dismissAdminDashboardActivity = async (activityId, body = {}) =>
  unwrap(await apiRequest(`/api/admin/dashboard/activity-feed/${activityId}/dismiss`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  }));

// GET /api/admin/super-dashboard/overview
export const fetchSuperDashboardOverview = async (params = {}) =>
  unwrap(await apiRequest(`/api/admin/super-dashboard/overview${buildQueryString(params)}`, { method: 'GET' }));

// GET /api/admin/dashboard/export?format=csv|json — downloads the file via a real fetch (needs auth header, so a plain <a href> won't work)
export const downloadAdminDashboardExport = async (params = {}) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/dashboard/export${buildQueryString(params)}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    let message = 'Failed to export dashboard report.';
    try {
      const errorBody = await response.json();
      message = errorBody?.message || message;
    } catch {
      // response wasn't JSON, keep default message
    }
    throw { status: response.status, message, errors: [] };
  }

  const disposition = response.headers.get('content-disposition') || '';
  const filenameMatch = disposition.match(/filename="?([^"]+)"?/);
  const filename = filenameMatch?.[1] || `admin-dashboard-report.${params.format || 'csv'}`;
  const blob = await response.blob();

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
