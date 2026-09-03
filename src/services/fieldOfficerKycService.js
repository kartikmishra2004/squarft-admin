import { apiRequest } from '../config/api';

const BASE = '/api/admin/field-officer-kyc';

export const fetchFieldOfficerKycList = async (status = 'under_review') => {
  const response = await apiRequest(`${BASE}?status=${encodeURIComponent(status)}`);
  return response?.data || [];
};

export const fetchFieldOfficerKycDetails = async (kycId) =>
  apiRequest(`${BASE}/${kycId}`);

export const reviewFieldOfficerKyc = async (kycId, payload) =>
  apiRequest(`${BASE}/${kycId}/verify`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
