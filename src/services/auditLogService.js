import { apiRequest } from '../config/api';

const unwrap = (response) => response?.data ?? response;

const buildQueryString = (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') query.append(key, value);
  });
  const queryString = query.toString();
  return queryString ? `?${queryString}` : '';
};

// GET /api/admin/audit-log — super_admin only.
// filters: entityType, entityId, actorId, action, branchId, fromDate, toDate, search, page, limit
export const fetchAuditLog = async (filters = {}) =>
  unwrap(await apiRequest(`/api/admin/audit-log${buildQueryString(filters)}`, { method: 'GET' }));
