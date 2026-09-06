import { useEffect, useState } from 'react';
import { Activity, CalendarDays, Clock, CreditCard, Eye, Heart, PhoneCall, RefreshCw, Search, Users } from 'lucide-react';
import Header from '../../components/layout/Header';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { fetchAppUserActivityBundle, fetchAppUserMetrics, fetchAppUsers, fetchProjectPanelUsers } from '../../services/appUserActivityService';

const tabs = [
  ['savedProperties', 'Saved', Heart], ['seenProperties', 'Viewed', Eye],
  ['contactedProperties', 'Contacted', PhoneCall], ['bookedVisits', 'Visits', CalendarDays],
  ['recentSearches', 'Searches', Search], ['screenEvents', 'Activity log', Activity], ['deals', 'Deals', CreditCard],
];
const date = value => {
  if (!value || Number.isNaN(new Date(value).getTime())) return 'Not recorded';
  return new Date(value).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
};
const money = value => value == null ? 'Not recorded' : new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(value));
const duration = value => value == null ? 'Not recorded' : value > 0 && value < 1 ? '<1m' : `${Math.floor(value / 60)}h ${Math.floor(value % 60)}m`;
const humanize = value => String(value || 'Not recorded').replace(/[_/()-]+/g, ' ').trim();
const variant = status => ['Online', 'active', 'completed', 'closed', 'COMPLETED'].includes(status) ? 'green' : status === 'Idle' ? 'yellow' : 'gray';
function ErrorNotice({ message, retry }) {
  return <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
    {message} <button type="button" className="ml-2 font-semibold underline" onClick={retry}>Retry</button>
  </div>;
}
function Detail({ label, children }) {
  return <div className="min-w-0"><dt className="text-xs text-gray-500">{label}</dt><dd className="mt-1 break-words text-sm font-semibold text-gray-900">{children || 'Not provided'}</dd></div>;
}
function ActivityRows({ tab, user }) {
  const items = user[tab] || [];
  if (!items.length) return <p className="py-12 text-center text-sm text-gray-500">No {tabs.find(([key]) => key === tab)?.[1].toLowerCase()} recorded for this user.</p>;
  if (tab === 'deals') return <div className="space-y-4">{items.map(deal => (
    <details key={deal.id} className="rounded-xl border border-gray-200 p-4">
      <summary className="cursor-pointer space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2"><span className="font-semibold">{deal.property_title || 'Property unavailable'}</span><Badge variant={variant(deal.status)}>{humanize(deal.status)}</Badge></div>
        <p className="break-all text-xs text-gray-500">Deal {deal.id}</p>
        <div className="flex flex-wrap gap-4 text-sm"><span>Value: {money(deal.total_value)}</span><span>Received: {money(deal.paid_so_far)}</span>
          {deal.total_value != null && deal.paid_so_far != null && <span>Balance: {money(deal.total_value - deal.paid_so_far)}</span>}</div>
      </summary>
      <div className="mt-4 overflow-x-auto">
        {deal.payments.length ? <table className="w-full text-left text-sm"><thead><tr className="border-b text-gray-500"><th className="py-2">Payment</th><th>Amount</th><th>Due</th><th>Status</th></tr></thead>
          <tbody>{deal.payments.map(payment => <tr key={payment.id} className="border-b border-gray-100"><td className="py-3">{payment.title || 'Payment'}</td><td>{money(payment.amount)}</td><td>{date(payment.due_date)}</td><td>{humanize(payment.status)}</td></tr>)}</tbody></table>
          : <p className="text-sm text-gray-500">No payment schedule recorded.</p>}
      </div>
    </details>
  ))}</div>;
  return <div className="divide-y divide-gray-100">{items.map((item, index) => (
    <div key={`${item.itemType || tab}-${item.id || index}`} className="flex flex-wrap justify-between gap-3 py-4">
      <div className="min-w-0 flex-1">
        <p className="break-words font-semibold text-gray-900">{tab === 'screenEvents' ? humanize(item.screen) : tab === 'recentSearches' ? item.query || 'Filtered search' : item.title || 'Listing unavailable'}</p>
        {item.projectName && <p className="text-sm text-gray-500">{item.projectName}</p>}
        {item.location && <p className="text-sm text-gray-500">{item.location}</p>}
        {item.itemType && <p className="text-xs capitalize text-gray-500">{item.itemType}</p>}
        {tab === 'savedProperties' && item.price != null && <p className="mt-1 text-sm">{money(item.price)}</p>}
        {tab === 'seenProperties' && <p className="text-xs text-gray-500">{item.views} recorded views</p>}
        {tab === 'contactedProperties' && <p className="text-xs text-gray-500">{humanize(item.channel)}</p>}
        {tab === 'screenEvents' && <p className="text-sm text-gray-500">{humanize(item.action)}</p>}
        {tab === 'recentSearches' && <>
          {item.resultCount != null && <p className="text-xs text-gray-500">{item.resultCount} results</p>}
          {item.filters && Object.keys(item.filters).length > 0 && <p className="mt-1 break-words text-xs text-gray-500">{Object.entries(item.filters).filter(([, value]) => value != null && value !== '').map(([key, value]) => `${humanize(key)}: ${typeof value === 'object' ? JSON.stringify(value) : value}`).join(' · ')}</p>}
        </>}
        {tab === 'bookedVisits' && <>
          <p className="mt-1 break-all text-xs text-gray-500">Booking {item.bookingId}</p>
          {item.officerName && <p className="text-xs text-gray-500">Officer: {item.officerName}</p>}
          {item.cancellationReason && <p className="text-xs text-gray-500">{item.cancellationReason}</p>}
        </>}
      </div>
      <div className="text-right text-xs text-gray-500">
        {item.status && <div className="mb-2"><Badge variant={variant(item.status)}>{humanize(item.status)}</Badge></div>}
        {date(item.savedAt || item.seenAt || item.contactedAt || item.dateFull || item.time || item.searchedAt)}
      </div>
    </div>
  ))}</div>;
}

export default function UserAppActivities() {
  const [app, setApp] = useState('user');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [revision, setRevision] = useState(0);
  const [list, setList] = useState({ items: [], pagination: null, loading: true, error: '' });
  const [metrics, setMetrics] = useState({ data: null, loading: true, error: '' });
  const [selectedId, setSelectedId] = useState(null);
  const [detail, setDetail] = useState({ user: null, loading: false, error: '' });
  const [tab, setTab] = useState('savedProperties');
  const refresh = () => setRevision(value => value + 1);

  useEffect(() => {
    let active = true;
    const timer = setTimeout(async () => {
      setList(previous => ({ ...previous, loading: true, error: '' }));
      try {
        const result = await (app === 'user' ? fetchAppUsers : fetchProjectPanelUsers)({ search: search.trim(), status, page, limit: 20 });
        if (!active) return;
        setList({ ...result, loading: false, error: '' });
        setSelectedId(previous => result.items.some(user => user.id === previous) ? previous : result.items[0]?.id || null);
      } catch (error) {
        if (active) setList({ items: [], pagination: null, loading: false, error: error.message || 'Unable to load accounts.' });
      }
    }, 250);
    return () => { active = false; clearTimeout(timer); };
  }, [app, search, status, page, revision]);

  useEffect(() => {
    let active = true;
    if (app !== 'user') return undefined;
    fetchAppUserMetrics({ range: 'today' }).then(data => {
      if (active) setMetrics({ data, loading: false, error: '' });
    }).catch(error => {
      if (active) setMetrics({ data: null, loading: false, error: error.message || 'Unable to load totals.' });
    });
    return () => { active = false; };
  }, [app, revision]);

  useEffect(() => {
    if (app !== 'user' || !selectedId) return undefined;
    let active = true;
    fetchAppUserActivityBundle(selectedId).then(user => {
      if (active) setDetail({ user, loading: false, error: '' });
    }).catch(error => {
      if (active) setDetail({ user: null, loading: false, error: error.message || 'Unable to load user activity.' });
    });
    return () => { active = false; };
  }, [app, selectedId, revision]);

  const select = id => { if (id === selectedId) return; setSelectedId(id); setDetail({ user: null, loading: true, error: '' }); };
  const selected = detail.user?.id === selectedId ? detail.user : null;
  const summary = list.items.find(user => user.id === selectedId);
  const retryDetails = () => { setDetail({ user: null, loading: true, error: '' }); refresh(); };
  const cards = metrics.data ? [
    ['Users', metrics.data.totalUsers, Users], ['Online now', metrics.data.onlineUsers, Activity],
    ['Active time today', duration(metrics.data.activeMinutes), Clock], ['Saved today', metrics.data.saved, Heart],
    ['Contacted today', metrics.data.contacted, PhoneCall], ['Visits booked today', metrics.data.visits, CalendarDays],
  ] : [];

  return <div className="min-h-screen bg-gray-50">
    <Header title="App activity" rightContent={<button type="button" onClick={retryDetails} className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm"><RefreshCw size={16} />Refresh</button>} />
    <main className="space-y-6 p-4 md:p-8">
      <div className="flex flex-wrap gap-2">{[['user', 'User App'], ['project', 'Project Panel']].map(([key, label]) => <button key={key} type="button" onClick={() => { setApp(key); setPage(1); setSelectedId(null); setDetail({ user: null, loading: false, error: '' }); setList({ items: [], pagination: null, loading: true, error: '' }); }} className={`rounded-xl px-5 py-3 text-sm font-semibold ${app === key ? 'bg-[#6F4BFF] text-white' : 'border border-gray-200 bg-white text-gray-600'}`}>{label}</button>)}</div>
      {app === 'user' && <>
        <p className="text-xs text-gray-500">Totals cover users in your permitted branches. Today uses India Standard Time; timestamps use your browser’s time zone.</p>
        {metrics.error ? <ErrorNotice message={metrics.error} retry={refresh} /> : metrics.loading ? <p role="status">Loading totals…</p> : <div className="grid grid-cols-2 gap-3 lg:grid-cols-6">{cards.map(([label, value, Icon]) => <Card key={label}><Icon size={18} className="mb-3 text-[#6F4BFF]" /><p className="text-xl font-bold">{value ?? 'Not available'}</p><p className="mt-1 text-xs text-gray-500">{label}</p></Card>)}</div>}
      </>}
      <div className="flex flex-wrap gap-3">
        <label className="flex min-w-64 flex-1 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4"><Search size={18} className="text-gray-400" /><input aria-label="Search accounts" placeholder="Search name, phone, email or branch" value={search} onChange={event => { setSearch(event.target.value); setPage(1); }} className="w-full bg-transparent py-3 text-sm outline-none" /></label>
        <select aria-label="Presence status" value={status} onChange={event => { setStatus(event.target.value); setPage(1); }} className="rounded-xl border border-gray-200 bg-white px-4 text-sm"><option value="">All presence statuses</option>{['Online', 'Idle', 'Offline'].map(value => <option key={value}>{value}</option>)}</select>
      </div>
      {list.error ? <ErrorNotice message={list.error} retry={refresh} /> : list.loading ? <p role="status" className="py-12 text-center">Loading accounts…</p> : !list.items.length ? <Card><p className="py-8 text-center text-gray-500">No accounts match these filters.</p></Card> : <>
        <div className={app === 'user' ? 'grid items-start gap-6 xl:grid-cols-[320px_minmax(0,1fr)]' : ''}>
          <Card noPadding>
            <div className="border-b border-gray-100 px-4 py-3 text-sm font-semibold">{list.pagination?.total ?? list.items.length} accounts</div>
            <div className="divide-y divide-gray-100">{list.items.map(user => app === 'user' ? <button type="button" key={user.id} onClick={() => select(user.id)} aria-pressed={selectedId === user.id} className={`w-full p-4 text-left ${selectedId === user.id ? 'bg-violet-50' : 'hover:bg-gray-50'}`}>
              <div className="flex items-center justify-between gap-2"><p className="break-words font-semibold">{user.name}</p><Badge variant={variant(user.status)}>{user.status}</Badge></div>
              <p className="mt-1 text-sm text-gray-500">{user.phone || 'Phone not provided'}</p><p className="mt-1 text-xs text-gray-500">{user.branchName || 'No branch assigned'}</p>
            </button> : <div key={user.id} className="p-5"><div className="flex flex-wrap justify-between gap-2"><h2 className="font-semibold">{user.companyName || user.name}</h2><Badge variant={variant(user.status)}>{user.status}</Badge></div><dl className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4"><Detail label="Contact person">{user.name}</Detail><Detail label="Phone">{user.phone}</Detail><Detail label="Email">{user.email}</Detail><Detail label="Branch">{user.branchName}</Detail><Detail label="RERA number">{user.reraNumber}</Detail><Detail label="Last active">{date(user.lastActive)}</Detail><Detail label="Active today">{user.hasActivity ? duration(user.activeMinutesToday) : 'Not tracked yet'}</Detail><Detail label="Sessions today">{user.sessionsToday ?? 'Not tracked yet'}</Detail></dl></div>)}</div>
          </Card>
          {app === 'user' && summary && <Card>
            {detail.error ? <ErrorNotice message={detail.error} retry={retryDetails} /> : !selected ? <p role="status" className="py-16 text-center">Loading user activity…</p> : <>
              <div className="flex flex-wrap items-center justify-between gap-2"><h2 className="text-xl font-bold">{selected.name}</h2><Badge variant={variant(selected.status)}>{selected.status}</Badge></div>
              <dl className="mt-5 grid grid-cols-2 gap-5 md:grid-cols-3"><Detail label="Phone">{selected.phone}</Detail><Detail label="Email">{selected.email}</Detail><Detail label="Branch">{[selected.branchName, selected.branchCity].filter(Boolean).join(' — ') || 'Not assigned'}</Detail><Detail label="Account status">{humanize(selected.accountStatus)}</Detail><Detail label="Joined">{date(selected.joinedDate)}</Detail><Detail label="Last active">{date(selected.lastActive)}</Detail><Detail label="Active today">{selected.hasActivity ? duration(selected.activeMinutesToday) : 'Not tracked yet'}</Detail><Detail label="Total active time">{selected.hasActivity ? duration(selected.totalActiveMinutes) : 'Not tracked yet'}</Detail><Detail label="Sessions today">{selected.hasActivity ? String(selected.sessionsToday ?? 0) : 'Not tracked yet'}</Detail></dl>
              <p className="mt-4 break-all text-xs text-gray-400">User ID: {selected.id}</p>
              <div className="my-5 flex flex-wrap gap-2 border-t border-gray-100 pt-5">{tabs.map(([key, label, Icon]) => <button type="button" key={key} onClick={() => setTab(key)} aria-pressed={key === tab} className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold ${key === tab ? 'bg-[#6F4BFF] text-white' : 'bg-gray-100 text-gray-600'}`}><Icon size={14} />{label}<span>{selected.errors[key] ? '!' : selected[key]?.length ?? 0}</span></button>)}</div>
              {tab === 'screenEvents' && <p className="mb-3 text-xs text-gray-500">Latest 200 recorded events. Tracking starts with the updated app.</p>}
              {tab === 'recentSearches' && <p className="mb-3 text-xs text-gray-500">Latest 50 searches.</p>}
              {selected.errors[tab] ? <ErrorNotice message={selected.errors[tab]} retry={retryDetails} /> : <ActivityRows tab={tab} user={selected} />}
            </>}
          </Card>}
        </div>
        <div className="flex items-center justify-between text-sm"><button type="button" disabled={page <= 1} onClick={() => setPage(value => value - 1)} className="rounded-lg border border-gray-200 bg-white px-4 py-2 disabled:opacity-40">Previous</button><span>Page {page} of {Math.max(list.pagination?.totalPages || 1, 1)}</span><button type="button" disabled={page >= (list.pagination?.totalPages || 1)} onClick={() => setPage(value => value + 1)} className="rounded-lg border border-gray-200 bg-white px-4 py-2 disabled:opacity-40">Next</button></div>
      </>}
    </main>
  </div>;
}
