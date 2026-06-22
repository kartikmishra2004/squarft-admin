import API_BASE_URL, { apiRequest, getAuthToken, handleApiError } from '../config/api';

const LEADS_BASE = '/api/admin/leads';

const unwrapData = (response) => response?.data ?? response;

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

// ─── Normalize ────────────────────────────────────────────────────────────────

export const normalizeLead = (lead = {}) => ({
  id: lead.id,
  leadCode: lead.leadCode || lead.lead_code || lead.id,
  name: lead.name || '',
  phone: lead.phone || '',
  email: lead.email || '',
  sourceType: lead.sourceType || lead.source_type || '',
  sourceLabel: lead.sourceLabel || lead.source_label || '',
  brokerId: lead.brokerId || lead.broker_id || null,
  broker: lead.broker || null,
  category: lead.category || '',
  propertyType: lead.propertyType || lead.property_type || '',
  configuration: lead.configuration || '',
  budgetMin: lead.budgetMin ?? lead.budget_min ?? null,
  budgetMax: lead.budgetMax ?? lead.budget_max ?? null,
  timelineLabel: typeof lead.timeline === 'string' ? lead.timeline : '',
  preferredLocations: Array.isArray(lead.preferredLocations) ? lead.preferredLocations : [],
  requirementSummary: lead.requirementSummary || lead.requirement_summary || '',
  temperature: lead.temperature || 'COLD',
  score: Number(lead.score || 0),
  pipelineStatus: lead.pipelineStatus || lead.pipeline_status || 'NEW',
  manualCallStatus: lead.manualCallStatus || lead.manual_call_status || 'NOT_SCHEDULED',
  attributionStatus: lead.attributionStatus || lead.attribution_status || '',
  assignedOfficerId: lead.assignedOfficerId || lead.assigned_officer_id || null,
  assignedOfficer: lead.assignedOfficer || null,
  branchId: lead.branchId || lead.branch_id || null,
  branch: lead.branch || null,
  manualSummary: lead.manualSummary || lead.manual_summary || null,
  aiSummary: lead.aiSummary || lead.ai_summary || null,
  aiCallStatus: lead.aiCallStatus || lead.ai_call_status || null,
  convertedClientId: lead.convertedClientId || lead.converted_client_id || null,
  manualSummaries: Array.isArray(lead.manualSummaries) ? lead.manualSummaries : [],
  callLogs: Array.isArray(lead.callLogs) ? lead.callLogs : [],
  timelineEvents: Array.isArray(lead.timeline) ? lead.timeline : [],
  latestTimeline: lead.latestTimeline || null,
  createdAt: lead.createdAt || lead.created_at || '',
  updatedAt: lead.updatedAt || lead.updated_at || '',
});

// ─── Summary / List ───────────────────────────────────────────────────────────

export const fetchLeadSummary = async (params = {}) =>
  unwrapData(await apiRequest(`${LEADS_BASE}/summary${buildQueryString(params)}`, { method: 'GET' }));

export const fetchLeads = async (params = {}) => {
  const data = unwrapData(await apiRequest(`${LEADS_BASE}${buildQueryString(params)}`, { method: 'GET' }));
  return {
    leads: (data?.leads || []).map(normalizeLead),
    pagination: data?.pagination || null,
  };
};

export const fetchLeadById = async (leadId) =>
  normalizeLead(unwrapData(await apiRequest(`${LEADS_BASE}/${leadId}`, { method: 'GET' })));

// ─── CSV Export ───────────────────────────────────────────────────────────────

export const exportLeadsCsv = async (params = {}) => {
  const token = getAuthToken();
  const response = await fetch(
    `${API_BASE_URL}${LEADS_BASE}/export${buildQueryString(params)}`,
    { method: 'GET', headers: { ...(token && { Authorization: `Bearer ${token}` }) } },
  );
  if (!response.ok) throw await handleApiError(response);
  return response.blob();
};

// ─── Create / Update ─────────────────────────────────────────────────────────

export const createLead = async (body) =>
  normalizeLead(unwrapData(await apiRequest(LEADS_BASE, {
    method: 'POST',
    body: JSON.stringify(body),
  })));

export const updateLead = async (leadId, body) =>
  normalizeLead(unwrapData(await apiRequest(`${LEADS_BASE}/${leadId}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  })));

// ─── Pipeline / Temperature ───────────────────────────────────────────────────

export const updatePipelineStatus = async (leadId, pipelineStatus, reason) =>
  normalizeLead(unwrapData(await apiRequest(`${LEADS_BASE}/${leadId}/pipeline-status`, {
    method: 'PATCH',
    body: JSON.stringify({ pipelineStatus, reason }),
  })));

export const updateTemperatureScore = async (leadId, temperature, score, reason) =>
  normalizeLead(unwrapData(await apiRequest(`${LEADS_BASE}/${leadId}/temperature-score`, {
    method: 'PATCH',
    body: JSON.stringify({ temperature, score, reason }),
  })));

// ─── Assignment ───────────────────────────────────────────────────────────────

export const assignLeadOfficer = async (leadId, assignedOfficerId) =>
  normalizeLead(unwrapData(await apiRequest(`${LEADS_BASE}/${leadId}/assign`, {
    method: 'PATCH',
    body: JSON.stringify({ assignedOfficerId }),
  })));

// ─── Manual Calls ─────────────────────────────────────────────────────────────

export const initiateManualCall = async (leadId, callMedium, note) => {
  const data = unwrapData(await apiRequest(`${LEADS_BASE}/${leadId}/manual-call/initiate`, {
    method: 'POST',
    body: JSON.stringify({ callMedium, note }),
  }));
  return {
    callLogId: data?.callLogId,
    phone: data?.phone,
    lead: data?.lead ? normalizeLead(data.lead) : null,
  };
};

export const logManualCall = async (leadId, payload) =>
  normalizeLead(unwrapData(await apiRequest(`${LEADS_BASE}/${leadId}/manual-call/logs`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })));

// ─── Manual Summary ───────────────────────────────────────────────────────────

export const addManualSummary = async (leadId, summary) =>
  normalizeLead(unwrapData(await apiRequest(`${LEADS_BASE}/${leadId}/manual-summaries`, {
    method: 'POST',
    body: JSON.stringify({ summary }),
  })));

// ─── Retry / Attribution / Qualify ───────────────────────────────────────────

export const scheduleLeadRetry = async (leadId, retryAt, reason) =>
  normalizeLead(unwrapData(await apiRequest(`${LEADS_BASE}/${leadId}/retry-schedule`, {
    method: 'PATCH',
    body: JSON.stringify({ retryAt, reason }),
  })));

export const updateBrokerAttribution = async (leadId, attributionStatus, brokerId, reason) =>
  normalizeLead(unwrapData(await apiRequest(`${LEADS_BASE}/${leadId}/broker-attribution`, {
    method: 'PATCH',
    body: JSON.stringify({ attributionStatus, brokerId, reason }),
  })));

export const markLeadQualified = async (leadId, payload = {}) => {
  const data = unwrapData(await apiRequest(`${LEADS_BASE}/${leadId}/mark-qualified`, {
    method: 'POST',
    body: JSON.stringify(payload),
  }));
  return {
    clientId: data?.clientId,
    lead: data?.lead ? normalizeLead(data.lead) : null,
  };
};

// ─── Timeline ─────────────────────────────────────────────────────────────────

export const fetchLeadTimeline = async (leadId, params = {}) =>
  unwrapData(await apiRequest(`${LEADS_BASE}/${leadId}/timeline${buildQueryString(params)}`, { method: 'GET' }));
