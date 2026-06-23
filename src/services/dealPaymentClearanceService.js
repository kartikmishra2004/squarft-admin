import { apiRequest } from '../config/api';

const DEALS_BASE = '/api/admin/deals';

const unwrapData = (response) => response?.data ?? response;

const formatDate = (value) => {
  if (!value) return new Date().toISOString().split('T')[0];
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date().toISOString().split('T')[0] : date.toISOString().split('T')[0];
};

export const formatPayment = (payment = {}) => ({
  id: payment.id,
  milestoneId: payment.milestoneId || payment.milestone_id,
  dealId: payment.dealId || payment.deal_id,
  amount: Number(payment.amount || 0),
  paymentMode: payment.paymentMode || payment.payment_mode || null,
  paymentDate: payment.paymentDate || payment.payment_date || null,
  referenceNo: payment.referenceNo || payment.reference_no || null,
  receiptNo: payment.receiptNo || payment.receipt_no || null,
  note: payment.note || null,
  collectedBy: payment.collectedBy || payment.collected_by || null,
  createdAt: payment.createdAt || payment.created_at || null,
});

export const formatClearanceDeal = (deal = {}) => ({
  id: deal.id,
  inventoryUnitId: deal.inventoryUnitId || deal.inventory_unit_id,
  status: deal.status,
  bookedByName: deal.bookedByName || deal.booked_by_name || null,
  bookedByMobile: deal.bookedByMobile || deal.booked_by_mobile || null,
  dealValue: Number(deal.dealValue || deal.deal_value || 0),
  receivedAmount: Number(deal.receivedAmount || deal.received_amount || 0),
  pendingAmount: Number(deal.pendingAmount || deal.pending_amount || 0),
  nextDueLabel: deal.nextDueLabel || deal.next_due_label || null,
  nextDueDate: deal.nextDueDate || deal.next_due_date || null,
  updatedAt: deal.updatedAt || deal.updated_at || null,
});

// PATCH /api/admin/deals/:dealId/payment-clearance
export const clearDealPayment = async (dealId, payload = {}) => {
  if (!dealId) throw { status: 400, message: 'dealId is required', errors: [] };

  const data = unwrapData(
    await apiRequest(`${DEALS_BASE}/${dealId}/payment-clearance`, {
      method: 'PATCH',
      body: JSON.stringify({
        amount: payload.amount,
        paymentMode: payload.paymentMode ?? payload.payment_mode,
        paymentDate: formatDate(payload.paymentDate ?? payload.payment_date),
        referenceNo: payload.referenceNo ?? payload.reference_no ?? undefined,
        receiptNo: payload.receiptNo ?? payload.receipt_no ?? undefined,
        note: payload.note ?? undefined,
      }),
    }),
  );

  return {
    deal: data?.deal ? formatClearanceDeal(data.deal) : null,
    clearedAmount: Number(data?.clearedAmount || 0),
    payments: Array.isArray(data?.payments) ? data.payments.map(formatPayment) : [],
  };
};
