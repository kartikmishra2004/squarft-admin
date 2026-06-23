import { apiRequest } from '../config/api';
import { fetchProjects } from './inventoryService';

const PM_BASE = '/api/project-developer/inventory-deals';
const MILESTONE_BASE = '/api/project-developer/inventory-deal-milestones';
const PD_PROJECTS_BASE = '/api/project-developer/projects';

const unwrap = (response) => response?.data ?? response;

const formatDate = (value) => {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : date.toISOString().slice(0, 10);
};

const asNum = (value) => Number(value || 0);

// Normalize a milestone row from backend to frontend shape
export const normalizeMilestone = (milestone = {}) => ({
  id: milestone.id,
  title: milestone.title || milestone.milestone_title || '',
  milestone_title: milestone.title || milestone.milestone_title || '',
  total_amount: asNum(milestone.milestone_amount ?? milestone.total_amount ?? milestone.amount),
  collected_amount: asNum(milestone.collected_amount ?? milestone.paid_amount ?? milestone.received_amount),
  remaining_amount: asNum(milestone.remaining_amount),
  due_date: formatDate(milestone.due_date),
  status: milestone.status || 'upcoming',
  mode: milestone.payment_mode || milestone.mode || 'Pending',
  receipt_no: milestone.receipt_no || '',
  collected_on: formatDate(milestone.paid_at || milestone.collected_on),
});

// Normalize a payment transaction row
export const normalizeTransaction = (txn = {}) => ({
  id: txn.id,
  milestone: txn.milestone_title || txn.milestone || '',
  amount: asNum(txn.amount),
  mode: txn.payment_mode || txn.mode || '',
  collectedOn: formatDate(txn.payment_date || txn.collected_on),
  receipt: txn.receipt_no || '',
  referenceNo: txn.reference_no || txn.referenceNo || '',
  collectedBy: txn.collected_by || txn.collectedBy || '',
  receiptPdfUrl: txn.receiptPdfUrl || '/documents/sample-payment-receipt.pdf',
});

// GET /api/project-developer/inventory-deals/:dealId/payment-schedule
export const fetchPaymentSchedule = async (dealId) => {
  if (!dealId) throw { status: 400, message: 'dealId is required', errors: [] };

  const data = unwrap(await apiRequest(`${PM_BASE}/${dealId}/payment-schedule`, { method: 'GET' }));

  const milestones = Array.isArray(data?.milestones ?? data)
    ? (data?.milestones ?? data).map(normalizeMilestone)
    : [];

  const transactions = Array.isArray(data?.transactions)
    ? data.transactions.map(normalizeTransaction)
    : [];

  return { milestones, transactions, raw: data };
};

// POST /api/project-developer/inventory-deals/:dealId/milestones
export const createMilestone = async (dealId, payload = {}) => {
  if (!dealId) throw { status: 400, message: 'dealId is required', errors: [] };

  const data = unwrap(
    await apiRequest(`${PM_BASE}/${dealId}/milestones`, {
      method: 'POST',
      body: JSON.stringify({
        title: payload.title,
        milestone_amount: Number(payload.amount ?? payload.milestone_amount),
        due_date: formatDate(payload.due_date ?? payload.dueDate),
        status: payload.status ?? 'upcoming',
      }),
    }),
  );

  return normalizeMilestone(data?.milestone ?? data);
};

// PUT /api/project-developer/inventory-deal-milestones/:milestoneId
export const updateMilestone = async (milestoneId, payload = {}) => {
  if (!milestoneId) throw { status: 400, message: 'milestoneId is required', errors: [] };

  const data = unwrap(
    await apiRequest(`${MILESTONE_BASE}/${milestoneId}`, {
      method: 'PUT',
      body: JSON.stringify({
        title: payload.title,
        milestone_amount: payload.amount !== undefined ? Number(payload.amount) : undefined,
        due_date: payload.due_date ? formatDate(payload.due_date) : undefined,
        status: payload.status,
      }),
    }),
  );

  return normalizeMilestone(data?.milestone ?? data);
};

// PUT /api/project-developer/inventory-deals/:dealId/payment-schedule (replace full schedule)
export const replacePaymentSchedule = async (dealId, milestones = []) => {
  if (!dealId) throw { status: 400, message: 'dealId is required', errors: [] };

  const data = unwrap(
    await apiRequest(`${PM_BASE}/${dealId}/payment-schedule`, {
      method: 'PUT',
      body: JSON.stringify({
        milestones: milestones.map((m) => ({
          title: m.title,
          milestone_amount: Number(m.amount ?? m.milestone_amount),
          due_date: formatDate(m.due_date ?? m.dueDate),
          status: m.status ?? 'upcoming',
        })),
      }),
    }),
  );

  const list = Array.isArray(data?.milestones ?? data) ? (data?.milestones ?? data) : [];
  return list.map(normalizeMilestone);
};

// POST /api/project-developer/inventory-deal-milestones/:milestoneId/collect
export const collectMilestonePayment = async (milestoneId, payload = {}) => {
  if (!milestoneId) throw { status: 400, message: 'milestoneId is required', errors: [] };

  const data = unwrap(
    await apiRequest(`${MILESTONE_BASE}/${milestoneId}/collect`, {
      method: 'POST',
      body: JSON.stringify({
        amount: Number(payload.amount),
        payment_mode: payload.paymentMode ?? payload.payment_mode ?? 'Cash',
        payment_date: formatDate(payload.paymentDate ?? payload.payment_date ?? new Date()),
        reference_no: payload.referenceNo ?? payload.reference_no ?? undefined,
        receipt_no: payload.receiptNo ?? payload.receipt_no ?? undefined,
        collected_by: payload.collectedBy ?? payload.collected_by ?? undefined,
      }),
    }),
  );

  return {
    milestone: data?.milestone ? normalizeMilestone(data.milestone) : null,
    transaction: data?.payment ? normalizeTransaction(data.payment) : null,
    raw: data,
  };
};

// Normalize a deal row from getProjectDeals response to PaymentMilestones shape
export const normalizeInventoryDeal = (deal = {}) => ({
  id: deal.deal_id || deal.id,
  dealCode: deal.unit_code || deal.deal_id || '-',
  customer: deal.booked_by_name || deal.bookedByName || '-',
  customerPhone: deal.booked_by_mobile || deal.bookedByMobile || '-',
  customerEmail: '',
  property: deal.unit_title || deal.display_title || '-',
  project: deal.project_name || deal.unit_title || '-',
  unit: [deal.tower_name, deal.floor_name, deal.unit_code].filter(Boolean).join(' / ') || deal.unit_title || '-',
  salesOfficer: '-',
  broker: '-',
  status: deal.deal_status || deal.deal_status_label || '-',
  createdOn: deal.booking_date || deal.created_at || '',
  negotiationPrice: asNum(deal.deal_value),
  dealValue: asNum(deal.deal_value),
  remainingBalance: asNum(deal.pending_amount),
  inventoryUnitId: deal.inventory_unit_id,
  projectId: deal.project_id,
});

// GET all inventory deals across all projects
// Strategy: fetch all projects from /api/admin/inventory, then fetch deals per project in parallel
export const fetchAllInventoryDeals = async () => {
  // Step 1: get all projects
  const projectsResponse = await fetchProjects({ limit: 200, offset: 0 });
  const projects = Array.isArray(projectsResponse?.projects ?? projectsResponse)
    ? (projectsResponse?.projects ?? projectsResponse)
    : [];

  if (!projects.length) return [];

  // Step 2: fetch deals for each project in parallel
  const results = await Promise.allSettled(
    projects.map((project) =>
      apiRequest(`${PD_PROJECTS_BASE}/${project.id}/deals`, { method: 'GET' })
        .then((res) => {
          const data = res?.data ?? res;
          return Array.isArray(data) ? data : [];
        })
        .catch(() => []),
    ),
  );

  // Step 3: flatten and normalize
  const allDeals = results.flatMap((result) =>
    result.status === 'fulfilled' ? result.value : [],
  );

  return allDeals.map(normalizeInventoryDeal);
};
