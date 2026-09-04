import { apiRequest } from '../config/api';

const BASE = '/api/admin/field-officer-tasks';

const withQuery = (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') query.set(key, value);
  });
  const suffix = query.toString();
  return suffix ? `?${suffix}` : '';
};

export const fetchAssignableFieldOfficers = (params = {}) =>
  apiRequest(`${BASE}/field-officers${withQuery({ limit: 50, ...params })}`);

export const fetchFieldOfficerTasks = (params = {}) =>
  apiRequest(`${BASE}${withQuery({ limit: 50, ...params })}`);

export const assignFieldOfficerTask = (body) =>
  apiRequest(BASE, { method: 'POST', body: JSON.stringify(body) });

export const updateFieldOfficerTask = (taskId, body) =>
  apiRequest(`${BASE}/${taskId}`, { method: 'PATCH', body: JSON.stringify(body) });
