import { apiRequest } from '../config/api';

const BASE = '/api/v1/app-users';
const query = params => {
  const values = new URLSearchParams(Object.entries(params || {}).filter(([, value]) => value !== '' && value != null));
  return values.size ? `?${values}` : '';
};
const get = async path => (await apiRequest(`${BASE}${path}`, { method: 'GET' })).data;
const number = value => value == null || value === '' || !Number.isFinite(Number(value)) ? null : Number(value);

export const normalizeAppUser = (user = {}) => ({
  ...user,
  id: user.id || user.userId,
  name: user.name?.trim() || [user.firstName, user.lastName].filter(Boolean).join(' ') || 'Name not provided',
  phone: user.phone || null,
  email: user.email || null,
  city: user.city || null,
  branchName: user.branchName || null,
  branchCity: user.branchCity || null,
  status: user.status || 'Offline',
  hasActivity: user.hasActivity ?? Boolean(user.lastActive),
  activeMinutesToday: number(user.activeMinutesToday),
  totalActiveMinutes: number(user.totalActiveMinutes),
  sessionsToday: number(user.sessionsToday),
});
export const normalizeProjectPanelUser = user => ({ ...normalizeAppUser(user), companyName: user.companyName || null, reraNumber: user.reraNumber || null });
export const normalizeDeal = (deal = {}) => ({
  ...deal,
  total_value: number(deal.total_value),
  paid_so_far: number(deal.paid_so_far),
  payments: Array.isArray(deal.payments) ? deal.payments : [],
});
export const fetchAppUserMetrics = params => get(`/metrics${query(params)}`);
export const fetchAppUsers = async params => {
  const result = await get(query(params));
  return { ...result, items: (result.items || []).map(normalizeAppUser) };
};
export const fetchProjectPanelUsers = async params => {
  const result = await get(`/project-panel${query(params)}`);
  return { ...result, items: (result.items || []).map(normalizeProjectPanelUser) };
};
export const fetchAppUserActivityBundle = async userId => {
  const profile = normalizeAppUser(await get(`/${encodeURIComponent(userId)}`));
  const endpoints = {
    savedProperties: 'saved', seenProperties: 'seen', contactedProperties: 'contacted',
    bookedVisits: 'visits', screenEvents: 'screen-events', recentSearches: 'searches', deals: 'deals',
  };
  const entries = Object.entries(endpoints);
  const results = await Promise.allSettled(entries.map(([, endpoint]) => get(`/${encodeURIComponent(userId)}/${endpoint}`)));
  const errors = {};
  results.forEach((result, index) => {
    const key = entries[index][0];
    if (result.status === 'fulfilled') {
      profile[key] = key === 'deals' ? result.value.map(normalizeDeal) : result.value;
    } else {
      profile[key] = null;
      errors[key] = result.reason?.message || 'Unable to load this activity.';
    }
  });
  return { ...profile, errors };
};
