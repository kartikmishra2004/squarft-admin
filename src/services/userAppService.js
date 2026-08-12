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

// TODO(backend): No backend endpoint exists yet for "Request Document From User"
// (QA spec Part F, item 6: /dashboard/teams -> Request Document -> User App -> upload -> Super Admin).
// This POST targets a route that has not been built. It needs:
//   1. A route + controller, e.g. POST /api/admin/app-users/:userId/document-requests
//      that creates a document-request row (user_id, document_type, note, requested_by, status, created_at).
//   2. Storage for pending requests (new table, e.g. document_requests).
//   3. A User App endpoint/screen so the user can see pending requests and upload against them
//      (which should then flow back into the existing verification/document tables admins already see).
// Until backend work lands, calling this will fail (404/network error) — that failure is expected
// and should be surfaced to the admin as a real error, not swallowed or faked as success.
export const requestUserDocument = async (userId, documentType, note = '') => {
  return apiRequest(`${BASE}/${userId}/document-requests`, {
    method: 'POST',
    body: JSON.stringify({ document_type: documentType, note }),
  });
};
