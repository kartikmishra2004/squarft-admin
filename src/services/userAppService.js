import { apiRequest } from '../config/api';

const BASE = '/api/admin/app-users';

const buildQueryString = (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.append(key, value);
    }
  });
  const qs = query.toString();
  return qs ? `?${qs}` : '';
};

export const fetchAppUsers = async (params = {}) => {
  const response = await apiRequest(`${BASE}/list${buildQueryString(params)}`, { method: 'GET' });
  return {
    users: response?.data || [],
    pagination: response?.pagination || null,
  };
};

export const fetchUserVerificationDetails = async (userId) => {
  const response = await apiRequest(`${BASE}/${userId}/verification`, { method: 'GET' });
  return response?.data || null;
};

export const updateUserVerification = async (userId, body) => {
  return apiRequest(`${BASE}/${userId}/verification`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
};

export const createAppUser = async (body) => {
  const response = await apiRequest(`${BASE}/add`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
  return response?.data || null;
};

export const deleteAppUser = async (userId) => {
  return apiRequest(`${BASE}/${userId}`, { method: 'DELETE' });
};
