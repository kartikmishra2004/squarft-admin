import { apiRequest } from '../config/api';

const buildQuery = (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '' && value !== 'all') query.set(key, value);
  });
  const value = query.toString();
  return value ? `?${value}` : '';
};

export const fetchProjectLeads = async (params = {}) => {
  const response = await apiRequest(`/api/admin/builder-leads${buildQuery(params)}`, { method: 'GET' });
  const data = response?.data ?? response;
  return { leads: data?.leads || [], count: data?.count || 0 };
};
