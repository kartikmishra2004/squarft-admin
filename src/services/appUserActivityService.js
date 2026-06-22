import { apiRequest } from '../config/api';

const APP_USERS_BASE = '/api/v1/app-users';

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

const formatDateTime = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatCurrency = (value) => {
  if (value === null || value === undefined || value === '') return '';
  const amount = Number(value);
  if (!Number.isFinite(amount)) return String(value);
  if (amount >= 10000000) return `INR ${(amount / 10000000).toFixed(2).replace(/\.00$/, '')} Cr`;
  if (amount >= 100000) return `INR ${(amount / 100000).toFixed(0)} L`;
  return `INR ${amount.toLocaleString('en-IN')}`;
};

const normalizeStatus = (status) => {
  const value = String(status || 'Offline').trim();
  if (value.toLowerCase() === 'online') return 'Online';
  if (value.toLowerCase() === 'idle') return 'Idle';
  return value.toLowerCase() === 'offline' ? 'Offline' : value;
};

export const normalizeAppUser = (user = {}) => ({
  id: user.id || user.userId,
  userId: user.userId || user.id || '',
  name: user.name || [user.firstName, user.lastName].filter(Boolean).join(' ') || 'App User',
  phone: user.phone || '',
  email: user.email || '',
  city: user.city || 'Location pending',
  status: normalizeStatus(user.status),
  joinedDate: formatDateTime(user.joinedDate),
  lastActive: formatDateTime(user.lastActive) || 'Not active yet',
  activeMinutesToday: Number(user.activeMinutesToday || 0),
  totalActiveMinutes: Number(user.totalActiveMinutes || 0),
  sessionsToday: Number(user.sessionsToday || 0),
  savedProperties: user.savedProperties || [],
  seenProperties: user.seenProperties || [],
  contactedProperties: user.contactedProperties || [],
  bookedVisits: user.bookedVisits || [],
  screenEvents: user.screenEvents || [],
  recentSearches: user.recentSearches || [],
});

export const normalizeSavedProperty = (property = {}) => ({
  id: property.id,
  title: property.title || 'Property',
  location: property.location || '',
  type: property.type || '',
  price: formatCurrency(property.price),
  savedAt: formatDateTime(property.savedAt),
});

export const normalizeSeenProperty = (property = {}) => ({
  id: property.id,
  title: property.title || 'Property',
  seenAt: formatDateTime(property.seenAt),
});

export const normalizeContactedProperty = (property = {}) => ({
  id: property.id,
  title: property.title || 'Property',
  channel: property.channel || 'Contacted',
  contactedAt: formatDateTime(property.contactedAt),
});

export const normalizeVisit = (visit = {}) => ({
  id: visit.id,
  status: String(visit.status || 'PENDING').toUpperCase(),
  title: visit.title || 'Property visit',
  dateFull: formatDateTime(visit.dateFull),
  bookingId: visit.bookingId || visit.id,
});

export const normalizeScreenEvent = (event = {}) => ({
  time: formatDateTime(event.time),
  screen: event.screen || 'App',
  action: event.action || 'Activity recorded',
});

export const fetchAppUserMetrics = async (params = {}) =>
  unwrapData(await apiRequest(`${APP_USERS_BASE}/metrics${buildQueryString(params)}`, { method: 'GET' }));

export const fetchAppUsers = async (params = {}) => {
  const payload = unwrapData(await apiRequest(`${APP_USERS_BASE}${buildQueryString(params)}`, { method: 'GET' }));
  const items = payload?.items || [];

  return {
    items: items.map(normalizeAppUser),
    pagination: payload?.pagination,
  };
};

export const fetchAppUserProfile = async (userId) =>
  normalizeAppUser(unwrapData(await apiRequest(`${APP_USERS_BASE}/${userId}`, { method: 'GET' })));

export const fetchSavedProperties = async (userId) => {
  const data = unwrapData(await apiRequest(`${APP_USERS_BASE}/${userId}/saved`, { method: 'GET' }));
  return (data || []).map(normalizeSavedProperty);
};

export const fetchSeenProperties = async (userId) => {
  const data = unwrapData(await apiRequest(`${APP_USERS_BASE}/${userId}/seen`, { method: 'GET' }));
  return (data || []).map(normalizeSeenProperty);
};

export const fetchContactedProperties = async (userId) => {
  const data = unwrapData(await apiRequest(`${APP_USERS_BASE}/${userId}/contacted`, { method: 'GET' }));
  return (data || []).map(normalizeContactedProperty);
};

export const fetchAppUserVisits = async (userId) => {
  const data = unwrapData(await apiRequest(`${APP_USERS_BASE}/${userId}/visits`, { method: 'GET' }));
  return (data || []).map(normalizeVisit);
};

export const fetchScreenEvents = async (userId) => {
  const data = unwrapData(await apiRequest(`${APP_USERS_BASE}/${userId}/screen-events`, { method: 'GET' }));
  return (data || []).map(normalizeScreenEvent);
};

export const fetchRecentSearches = async (userId) => {
  const data = unwrapData(await apiRequest(`${APP_USERS_BASE}/${userId}/searches`, { method: 'GET' }));
  return data || [];
};

export const fetchAppUserActivityBundle = async (userId, summary = {}) => {
  const [
    profileResult,
    savedResult,
    seenResult,
    contactedResult,
    visitsResult,
    eventsResult,
    searchesResult,
  ] = await Promise.allSettled([
    fetchAppUserProfile(userId),
    fetchSavedProperties(userId),
    fetchSeenProperties(userId),
    fetchContactedProperties(userId),
    fetchAppUserVisits(userId),
    fetchScreenEvents(userId),
    fetchRecentSearches(userId),
  ]);

  const profile = profileResult.status === 'fulfilled' ? profileResult.value : normalizeAppUser(summary);

  return {
    ...profile,
    savedProperties: savedResult.status === 'fulfilled' ? savedResult.value : [],
    seenProperties: seenResult.status === 'fulfilled' ? seenResult.value : [],
    contactedProperties: contactedResult.status === 'fulfilled' ? contactedResult.value : [],
    bookedVisits: visitsResult.status === 'fulfilled' ? visitsResult.value : [],
    screenEvents: eventsResult.status === 'fulfilled' ? eventsResult.value : [],
    recentSearches: searchesResult.status === 'fulfilled' ? searchesResult.value : profile.recentSearches || [],
  };
};
