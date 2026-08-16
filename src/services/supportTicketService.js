import { apiRequest } from '../config/api';

const TICKETS_BASE = '/api/admin/support-tickets';

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

export const normalizeTicket = (ticket = {}) => ({
    id: ticket.id,
    ticketCode: ticket.ticketCode || ticket.ticket_code || ticket.id,
    userId: ticket.userId || ticket.user_id || null,
    appKey: ticket.appKey || ticket.app_key || '',
    customerName: ticket.customerName || ticket.customer_name || '',
    customerPhone: ticket.customerPhone || ticket.customer_phone || '',
    subject: ticket.subject || '',
    message: ticket.message || '',
    status: ticket.status || 'open',
    priority: ticket.priority || 'normal',
    assignedTo: ticket.assignedTo || ticket.assigned_to || null,
    assigneeName: ticket.assigneeName || ticket.assignee_name || '',
    resolutionNote: ticket.resolutionNote || ticket.resolution_note || '',
    resolvedAt: ticket.resolvedAt || ticket.resolved_at || null,
    resolvedBy: ticket.resolvedBy || ticket.resolved_by || null,
    resolverName: ticket.resolverName || ticket.resolver_name || '',
    createdAt: ticket.createdAt || ticket.created_at || '',
    updatedAt: ticket.updatedAt || ticket.updated_at || '',
});

// ─── Summary / List ───────────────────────────────────────────────────────────

export const fetchTicketSummary = async () =>
    unwrapData(await apiRequest(`${TICKETS_BASE}/summary`, { method: 'GET' }));

export const fetchTickets = async (params = {}) => {
    const data = unwrapData(await apiRequest(`${TICKETS_BASE}${buildQueryString(params)}`, { method: 'GET' }));
    return {
        tickets: (data?.tickets || []).map(normalizeTicket),
        pagination: data?.pagination || null,
    };
};

// ─── Create / Update ─────────────────────────────────────────────────────────

export const createTicket = async (body) =>
    normalizeTicket(unwrapData(await apiRequest(TICKETS_BASE, {
        method: 'POST',
        body: JSON.stringify(body),
    })));

export const updateTicketStatus = async (ticketId, status, resolutionNote) =>
    normalizeTicket(unwrapData(await apiRequest(`${TICKETS_BASE}/${ticketId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, resolutionNote }),
    })));

export const assignTicket = async (ticketId, assignedTo) =>
    normalizeTicket(unwrapData(await apiRequest(`${TICKETS_BASE}/${ticketId}/assign`, {
        method: 'PATCH',
        body: JSON.stringify({ assignedTo }),
    })));
