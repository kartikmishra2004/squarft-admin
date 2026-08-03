import { apiRequest } from '../config/api';

const VERIFICATION_BASE = '/api/v1/admin/verification';

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

// GET /api/v1/admin/verification/pending?page&limit&document_type&sort
// Response data shape: { pending_verifications: [{ user_id, user_name, user_phone,
//   document_id, document_type, file_name, file_url, uploaded_at, days_pending }],
//   pagination: { page, limit, total, total_pages } }
export const getPendingVerifications = async (params = {}) => {
  const query = buildQueryString({
    page: params.page,
    limit: params.limit,
    document_type: params.documentType,
    sort: params.sort,
  });

  const data = unwrapData(await apiRequest(`${VERIFICATION_BASE}/pending${query}`, {
    method: 'GET',
  }));

  return {
    items: data?.pending_verifications || [],
    pagination: data?.pagination || null,
  };
};

// POST /api/v1/admin/verification/approve/:documentId  body: { notes }
export const approveVerificationDocument = async (documentId, notes = null) =>
  unwrapData(await apiRequest(`${VERIFICATION_BASE}/approve/${documentId}`, {
    method: 'POST',
    body: JSON.stringify({ notes }),
  }));

// POST /api/v1/admin/verification/reject/:documentId  body: { rejection_reason, notes }
export const rejectVerificationDocument = async (documentId, reason, notes = null) =>
  unwrapData(await apiRequest(`${VERIFICATION_BASE}/reject/${documentId}`, {
    method: 'POST',
    body: JSON.stringify({ rejection_reason: reason, notes }),
  }));
