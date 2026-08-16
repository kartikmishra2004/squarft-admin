/*
 * ============================================================================
 * PARTIALLY REAL PAGE — read before editing
 * ============================================================================
 * The "Unified Ticket Queue" panel (and its metric tiles for Open/In
 * Progress/Resolved/Urgent/Today) is wired to the real backend:
 *   GET   /api/admin/support-tickets/summary
 *   GET   /api/admin/support-tickets            (status, appKey filters)
 *   POST  /api/admin/support-tickets            ("New Case")
 *   PATCH /api/admin/support-tickets/:id/status ("Resolve" / status changes)
 * See src/services/supportTicketService.js and squarFT_backend
 * src/controllers/admin/supportTicketController.js.
 *
 * Everything else on this page — "App Coverage" health tiles, "Channels"
 * metrics, and the "SLA Timeline" — has NO backing data source yet and is
 * still 100% static fixture data (`supportApps`, `channels`, the SLA list).
 * Those sections carry an explicit "Illustrative — not live data" badge so
 * nobody mistakes them for real numbers. Do not remove that badge without
 * wiring a real endpoint for that section.
 * ============================================================================
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    AlertCircle,
    ArrowRight,
    Bot,
    Building2,
    CheckCircle2,
    Clock3,
    FileText,
    Headphones,
    Loader2,
    Mail,
    MessageSquare,
    Mic2,
    PhoneCall,
    Plus,
    RefreshCw,
    Search,
    ShieldCheck,
    SlidersHorizontal,
    Smartphone,
    UserRoundCheck,
    UsersRound,
} from 'lucide-react';
import Modal from '../../components/ui/Modal';
import {
    createTicket as createTicketRequest,
    fetchTicketSummary,
    fetchTickets,
    updateTicketStatus as updateTicketStatusRequest,
} from '../../services/supportTicketService';

// Illustrative-only fixtures — no backend source exists for these yet. See
// the file header comment above.
const supportApps = [
    { name: 'Customer App', key: 'squarft-user', users: '18.4k', open: 38, today: 126, resolution: 72, health: 'Stable', tone: 'bg-[#EAF7F0] text-[#0C6B39]' },
    { name: 'Sales Officer', key: 'sales_officer', users: '164', open: 11, today: 34, resolution: 64, health: 'Watch', tone: 'bg-[#FFF7E6] text-[#A15A00]' },
    { name: 'Broker App', key: 'squarft-broker', users: '2.1k', open: 17, today: 58, resolution: 69, health: 'Stable', tone: 'bg-[#EAF7F0] text-[#0C6B39]' },
    { name: 'Project Panel', key: 'squarft-project-panel', users: '82', open: 9, today: 21, resolution: 58, health: 'Priority', tone: 'bg-[#FFF0F0] text-[#B41212]' },
    { name: 'Field Officer', key: 'squarft-field-officer', users: '96', open: 14, today: 29, resolution: 61, health: 'Watch', tone: 'bg-[#FFF7E6] text-[#A15A00]' },
];

const channels = [
    { label: 'Chat', value: '94', icon: MessageSquare, detail: 'Live conversations' },
    { label: 'Calls', value: '26', icon: PhoneCall, detail: 'Manual callbacks' },
    { label: 'Email', value: '41', icon: Mail, detail: 'SLA monitored' },
    { label: 'Forms', value: '19', icon: FileText, detail: 'In-app requests' },
];

// Real app keys used by the notification/support backend (see
// notification_targets seed data), offered on the "New Case" form.
const APP_KEY_OPTIONS = [
    { value: '', label: 'Unknown / not app-specific' },
    { value: 'user_app', label: 'Customer App' },
    { value: 'sales_officer_app', label: 'Sales Officer App' },
    { value: 'broker_app', label: 'Broker App' },
    { value: 'project_panel_app', label: 'Project Panel App' },
    { value: 'field_officer_app', label: 'Field Officer App' },
];

const STATUS_FILTERS = [
    { value: 'all', label: 'All' },
    { value: 'open', label: 'Open' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
];

const STATUS_LABEL = {
    open: 'Open',
    in_progress: 'In Progress',
    resolved: 'Resolved',
};

const STATUS_TONE = {
    open: 'open',
    in_progress: 'escalated',
    resolved: 'resolved',
};

const formatRelativeAge = (isoDate) => {
    if (!isoDate) return '—';
    const then = new Date(isoDate).getTime();
    if (Number.isNaN(then)) return '—';
    const diffMs = Date.now() - then;
    const minutes = Math.floor(diffMs / 60000);
    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ${minutes % 60}m ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
};

const MockDataBadge = ({ label = 'Illustrative — not live data' }) => (
    <span className="inline-flex items-center gap-1.5 rounded-[4px] bg-[#FFF0F0] px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-[#B41212]">
        <AlertCircle size={12} /> {label}
    </span>
);

const Panel = ({ children, className = '' }) => (
    <section className={`rounded-[8px] border border-[#C8C2DD] bg-white shadow-[0_1px_0_rgba(53,38,110,0.03)] ${className}`}>
        {children}
    </section>
);

const StatusPill = ({ children, tone = 'neutral' }) => {
    const styles = {
        urgent: 'bg-[#FFF0F0] text-[#B41212]',
        open: 'bg-[#F0EDFF] text-[#2512D9]',
        escalated: 'bg-[#FFF7E6] text-[#A15A00]',
        resolved: 'bg-[#EAF7F0] text-[#0C6B39]',
        neutral: 'bg-[#F2F0F8] text-[#211B31]',
    };

    return <span className={`rounded-[4px] px-3 py-1 text-[11px] font-black ${styles[tone]}`}>{children}</span>;
};

const MetricTile = ({ icon: Icon, label, value, detail, tone = 'bg-[#F0EDFF] text-[#2512D9]' }) => (
    <Panel className="p-5">
        <div className="mb-6 flex items-start justify-between gap-3">
            <div className={`grid h-11 w-11 place-items-center rounded-[8px] ${tone}`}>
                <Icon size={21} />
            </div>
            <p className="text-right text-[10px] font-black uppercase tracking-[0.16em] text-[#6F687F]">{label}</p>
        </div>
        <p className="text-[36px] font-black leading-none text-[#15111F]">{value}</p>
        <p className="mt-3 text-xs font-bold text-[#342E45]">{detail}</p>
    </Panel>
);

const initialNewCaseForm = {
    customerName: '',
    customerPhone: '',
    subject: '',
    message: '',
    priority: 'normal',
    appKey: '',
};

const Support = () => {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const users = useSelector((state) => state.users.users);
    const clients = useSelector((state) => state.clients.clients);
    const visits = useSelector((state) => state.visits.visits);
    const deals = useSelector((state) => state.deals.deals);

    const [tickets, setTickets] = useState([]);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedTicketId, setSelectedTicketId] = useState(null);
    const [resolvingId, setResolvingId] = useState(null);

    const [isNewCaseOpen, setIsNewCaseOpen] = useState(false);
    const [newCaseForm, setNewCaseForm] = useState(initialNewCaseForm);
    const [newCaseSubmitting, setNewCaseSubmitting] = useState(false);
    const [newCaseError, setNewCaseError] = useState('');

    const loadTickets = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const [{ tickets: fetchedTickets }, fetchedSummary] = await Promise.all([
                fetchTickets(statusFilter === 'all' ? {} : { status: statusFilter }),
                fetchTicketSummary(),
            ]);
            setTickets(fetchedTickets);
            setSummary(fetchedSummary);
            setSelectedTicketId((current) => current || fetchedTickets[0]?.id || null);
        } catch (err) {
            console.error('Failed to load support tickets:', err);
            setError(err?.message || 'Failed to load support tickets.');
        } finally {
            setLoading(false);
        }
    }, [statusFilter]);

    useEffect(() => {
        loadTickets();
    }, [loadTickets]);

    const handleResolveTicket = async (ticketId) => {
        setResolvingId(ticketId);
        setError('');
        try {
            await updateTicketStatusRequest(ticketId, 'resolved');
            await loadTickets();
        } catch (err) {
            console.error('Failed to resolve ticket:', err);
            setError(err?.message || 'Failed to resolve ticket.');
        } finally {
            setResolvingId(null);
        }
    };

    const handleNewCaseChange = (field, value) => {
        setNewCaseForm((current) => ({ ...current, [field]: value }));
    };

    const handleNewCaseSubmit = async (event) => {
        event.preventDefault();
        setNewCaseError('');

        if (!newCaseForm.subject.trim() || !newCaseForm.message.trim()) {
            setNewCaseError('Subject and message are required.');
            return;
        }

        setNewCaseSubmitting(true);
        try {
            await createTicketRequest(newCaseForm);
            setIsNewCaseOpen(false);
            setNewCaseForm(initialNewCaseForm);
            await loadTickets();
        } catch (err) {
            console.error('Failed to create support ticket:', err);
            setNewCaseError(err?.message || 'Failed to create ticket.');
        } finally {
            setNewCaseSubmitting(false);
        }
    };

    const ecosystemUsers = useMemo(
        () => users.length + clients.length + visits.length + deals.length,
        [clients.length, deals.length, users.length, visits.length],
    );

    const roleLabel = user?.role === 'super_admin' ? 'Super Admin' : 'Admin';

    return (
        <div className="min-h-screen bg-[#FBF8FF] text-[#15111F]">
            <header className="sticky top-0 z-10 border-b border-[#D7D0EA] bg-[#F9F6FF]/95 px-4 py-4 backdrop-blur sm:px-6">
                <div className="mx-auto flex max-w-[1480px] flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                    <div>
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                            <StatusPill tone="open">{roleLabel} Access</StatusPill>
                        </div>
                        <h1 className="text-[30px] font-black leading-tight tracking-normal text-black md:text-[38px]">Support Center</h1>
                        <p className="mt-1 max-w-[720px] text-sm font-medium text-[#342E45]">
                            One command tab for customer issues across SquarFT apps, with user requests, manual ownership, app health, escalation, and SLA visibility.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <label className="flex h-11 min-w-0 items-center gap-3 rounded-[8px] bg-[#F0EDFA] px-4 text-[#756E8B] sm:w-[320px]">
                            <Search size={19} />
                            <input
                                className="w-full bg-transparent text-sm font-medium text-[#221C34] outline-none placeholder:text-[#756E8B]"
                                placeholder="Search tickets, users, apps..."
                            />
                        </label>
                        <button className="flex h-11 items-center justify-center gap-2 rounded-[8px] border border-[#C8C2DD] bg-white px-4 text-xs font-black text-[#211B31]">
                            <SlidersHorizontal size={16} /> Filters
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsNewCaseOpen(true)}
                            className="flex h-11 items-center justify-center gap-2 rounded-[8px] bg-[#2F1CD9] px-4 text-xs font-black text-white shadow-[0_4px_12px_rgba(47,28,217,0.25)]"
                        >
                            <Plus size={16} /> New Case
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/dashboard/support/voice-agent')}
                            className="flex h-11 items-center justify-center gap-2 rounded-[8px] bg-[#0C6B39] px-4 text-xs font-black text-white shadow-[0_4px_12px_rgba(12,107,57,0.22)]"
                        >
                            <Mic2 size={16} /> Voice Agent
                        </button>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-[1480px] px-4 py-8 sm:px-6">
                {error && (
                    <div className="mb-6 flex items-center gap-3 rounded-[8px] border border-[#F5C2C2] bg-[#FFF0F0] p-4">
                        <AlertCircle className="h-5 w-5 shrink-0 text-[#B41212]" />
                        <p className="text-sm font-bold text-[#B41212]">{error}</p>
                    </div>
                )}

                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
                    <MetricTile icon={Headphones} label="Open Cases" value={summary ? summary.open + summary.in_progress : '—'} detail="Real tickets, not yet resolved" />
                    <MetricTile icon={MessageSquare} label="Requests Today" value={summary ? summary.created_today : '—'} detail="New tickets logged today" tone="bg-[#EAF7F0] text-[#0C6B39]" />
                    <MetricTile icon={UserRoundCheck} label="In Progress" value={summary ? summary.in_progress : '—'} detail="Actively being worked" tone="bg-[#FFF7E6] text-[#A15A00]" />
                    <MetricTile icon={AlertCircle} label="Urgent Open" value={summary ? summary.urgent_open : '—'} detail="Priority = urgent, not resolved" tone="bg-[#FFF0F0] text-[#B41212]" />
                    <MetricTile icon={UsersRound} label="Context Links" value={ecosystemUsers} detail="Users, visits, deals, clients" tone="bg-[#EEF6FF] text-[#155E9D]" />
                </div>

                <Panel className="mt-7 overflow-hidden">
                    <div className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex min-w-0 items-start gap-4">
                            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-[8px] bg-[#EAF7F0] text-[#0C6B39]">
                                <Mic2 size={22} />
                            </div>
                            <div className="min-w-0">
                                <h2 className="text-2xl font-black">AI Voice Agent</h2>
                                <p className="mt-1 max-w-[720px] text-sm font-medium text-[#342E45]">
                                    Start a browser voice call with Shubh for live support triage, customer issue capture, and assisted handoff.
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => navigate('/dashboard/support/voice-agent')}
                            className="flex h-11 items-center justify-center gap-2 rounded-[8px] bg-[#15111F] px-4 text-xs font-black text-white"
                        >
                            Open Voice Call
                            <ArrowRight size={16} />
                        </button>
                    </div>
                </Panel>

                <div className="mt-7 grid gap-6 xl:grid-cols-[1.28fr_0.72fr]">
                    <Panel className="overflow-hidden">
                        <div className="flex flex-col gap-4 border-b border-[#D8D3E6] p-5 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <h2 className="text-2xl font-black">Unified Ticket Queue</h2>
                                <p className="mt-1 text-xs font-bold text-[#6F687F]">Live cases logged through this Support Center — real, persisted data</p>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                {STATUS_FILTERS.map((queue) => (
                                    <button
                                        key={queue.value}
                                        onClick={() => setStatusFilter(queue.value)}
                                        className={`h-9 rounded-[6px] px-4 text-xs font-black transition ${
                                            statusFilter === queue.value ? 'bg-[#2512D9] text-white' : 'bg-[#F0EDFA] text-[#211B31] hover:text-[#2512D9]'
                                        }`}
                                    >
                                        {queue.label}
                                    </button>
                                ))}
                                <button
                                    type="button"
                                    onClick={loadTickets}
                                    disabled={loading}
                                    className="grid h-9 w-9 place-items-center rounded-[6px] bg-[#F0EDFA] text-[#2512D9] disabled:opacity-50"
                                    aria-label="Refresh ticket queue"
                                >
                                    {loading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                                </button>
                            </div>
                        </div>

                        <div className="divide-y divide-[#D8D3E6] max-h-[500px] overflow-y-auto">
                            {loading && tickets.length === 0 && (
                                <div className="flex flex-col items-center justify-center gap-3 p-16 text-center">
                                    <Loader2 className="h-8 w-8 animate-spin text-[#2512D9]" />
                                    <p className="text-sm font-bold text-[#6F687F]">Loading tickets…</p>
                                </div>
                            )}

                            {!loading && tickets.length === 0 && !error && (
                                <div className="flex flex-col items-center justify-center gap-3 p-16 text-center">
                                    <Headphones className="h-10 w-10 text-[#C8C2DD]" />
                                    <p className="text-sm font-bold text-[#6F687F]">No tickets match this filter.</p>
                                </div>
                            )}

                            {tickets.map((ticket) => {
                                const tone = STATUS_TONE[ticket.status] || 'neutral';

                                return (
                                    <div
                                        key={ticket.id}
                                        onClick={() => setSelectedTicketId(ticket.id)}
                                        className={`p-4 transition hover:bg-[#FBFAFF] cursor-pointer flex flex-col gap-2 ${
                                            selectedTicketId === ticket.id ? 'bg-[#F8F5FF]' : 'bg-white'
                                        }`}
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <p className="text-sm font-black text-[#15111F]">{ticket.subject}</p>
                                                <p className="mt-1 text-xs text-[#524B64] font-medium leading-relaxed">{ticket.message}</p>
                                            </div>
                                            <div className="shrink-0 flex items-center gap-2">
                                                {ticket.priority === 'urgent' && <StatusPill tone="urgent">Urgent</StatusPill>}
                                                <StatusPill tone={tone}>{STATUS_LABEL[ticket.status] || ticket.status}</StatusPill>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap items-center justify-between gap-2 mt-1">
                                            <p className="text-[11px] font-bold text-[#6F687F]">
                                                From: <span className="text-[#15111F] font-black">{ticket.customerName || 'Unknown customer'}</span>
                                                {ticket.appKey ? ` (${ticket.appKey})` : ''}
                                            </p>
                                            <div className="flex items-center gap-3">
                                                {ticket.status !== 'resolved' && (
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleResolveTicket(ticket.id);
                                                        }}
                                                        disabled={resolvingId === ticket.id}
                                                        className="px-3 py-1 rounded-[6px] bg-[#0C6B39] hover:bg-[#094d29] text-white text-[10px] font-black uppercase tracking-wider transition shadow-sm disabled:opacity-60"
                                                    >
                                                        {resolvingId === ticket.id ? 'Resolving…' : 'Resolve'}
                                                    </button>
                                                )}
                                                <span className="text-[10px] font-black text-[#6F687F] bg-[#F0EDFA] px-2 py-0.5 rounded">{ticket.ticketCode}</span>
                                                <span className="text-[11px] font-black text-[#B41212]">{formatRelativeAge(ticket.createdAt)}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </Panel>

                    <Panel className="p-5">
                        <div className="mb-5 flex items-center justify-between gap-3">
                            <div>
                                <h2 className="text-2xl font-black">App Coverage</h2>
                                <p className="mt-1 text-xs font-bold text-[#6F687F]">Support load by product surface</p>
                            </div>
                            <MockDataBadge />
                        </div>

                        <div className="space-y-3">
                            {supportApps.map((app) => (
                                <div
                                    key={app.key}
                                    className="w-full flex items-center justify-between p-3.5 rounded-[8px] border border-[#D8D3E6] bg-white text-left"
                                >
                                    <div className="min-w-0 flex items-center gap-3">
                                        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-[8px] bg-[#F0EDFF] text-[#2512D9]">
                                            {app.name.includes('Project') ? <Building2 size={18} /> : app.name.includes('Customer') ? <Smartphone size={18} /> : <ShieldCheck size={18} />}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-black text-sm text-[#15111F]">{app.name}</p>
                                            <p className="text-[11px] font-bold text-[#6F687F] mt-0.5">{app.users} users . {app.today} today</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <StatusPill tone="neutral">{app.open} open</StatusPill>
                                        <span className={`rounded-[4px] px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${app.tone}`}>
                                            {app.health}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Panel>
                </div>

                <div className="mt-7 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                    <Panel className="p-5">
                        <div className="mb-5 flex items-center justify-between gap-3">
                            <h2 className="text-2xl font-black">Channels</h2>
                            <MockDataBadge />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {channels.map(({ label, value, icon: Icon, detail }) => (
                                <div key={label} className="rounded-[8px] border border-[#D8D3E6] p-4">
                                    <div className="mb-5 flex items-center justify-between">
                                        <Icon size={19} className="text-[#2512D9]" />
                                        <p className="text-[28px] font-black leading-none">{value}</p>
                                    </div>
                                    <p className="font-black">{label}</p>
                                    <p className="text-xs font-bold text-[#6F687F]">{detail}</p>
                                </div>
                            ))}
                        </div>
                    </Panel>

                    <Panel className="p-5">
                        <div className="mb-5 flex items-center justify-between gap-3">
                            <h2 className="text-2xl font-black">SLA Timeline</h2>
                            <MockDataBadge />
                        </div>
                        <div className="space-y-5">
                            {[
                                { icon: Clock3, title: 'First response', value: '2m 18s', tone: 'text-[#2512D9]' },
                                { icon: Bot, title: 'AI triage complete', value: '74%', tone: 'text-[#0C6B39]' },
                                { icon: Headphones, title: 'Manual handoff', value: '9m avg', tone: 'text-[#A15A00]' },
                                { icon: CheckCircle2, title: 'Resolved today', value: '126 cases', tone: 'text-[#0C6B39]' },
                            ].map(({ icon: Icon, title, value, tone }, index) => (
                                <div key={title} className="grid grid-cols-[28px_1fr_auto] items-center gap-3">
                                    <div className="relative grid h-7 w-7 place-items-center rounded-full border border-[#BDB5FF]">
                                        <Icon size={15} className={tone} />
                                        {index < 3 && <span className="absolute top-7 h-5 w-px bg-[#D8D3E6]" />}
                                    </div>
                                    <p className="text-sm font-bold text-[#211B31]">{title}</p>
                                    <p className="text-sm font-black">{value}</p>
                                </div>
                            ))}
                        </div>
                    </Panel>
                </div>
            </main>

            <Modal isOpen={isNewCaseOpen} onClose={() => setIsNewCaseOpen(false)} title="Log a New Support Case">
                <form onSubmit={handleNewCaseSubmit} className="flex flex-col gap-4">
                    {newCaseError && (
                        <div className="flex items-center gap-2 rounded-[8px] border border-[#F5C2C2] bg-[#FFF0F0] p-3">
                            <AlertCircle className="h-4 w-4 shrink-0 text-[#B41212]" />
                            <p className="text-xs font-bold text-[#B41212]">{newCaseError}</p>
                        </div>
                    )}

                    <div className="grid gap-4 sm:grid-cols-2">
                        <label className="flex flex-col gap-1.5">
                            <span className="text-xs font-bold uppercase tracking-wider text-[#6F687F]">Customer Name</span>
                            <input
                                type="text"
                                value={newCaseForm.customerName}
                                onChange={(e) => handleNewCaseChange('customerName', e.target.value)}
                                className="rounded-[8px] border border-[#D8D3E6] px-3 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-[#2512D9]/30"
                                placeholder="e.g. Riya Mehta"
                            />
                        </label>
                        <label className="flex flex-col gap-1.5">
                            <span className="text-xs font-bold uppercase tracking-wider text-[#6F687F]">Customer Phone</span>
                            <input
                                type="text"
                                value={newCaseForm.customerPhone}
                                onChange={(e) => handleNewCaseChange('customerPhone', e.target.value)}
                                className="rounded-[8px] border border-[#D8D3E6] px-3 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-[#2512D9]/30"
                                placeholder="+91 ..."
                            />
                        </label>
                    </div>

                    <label className="flex flex-col gap-1.5">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#6F687F]">Subject *</span>
                        <input
                            type="text"
                            required
                            value={newCaseForm.subject}
                            onChange={(e) => handleNewCaseChange('subject', e.target.value)}
                            className="rounded-[8px] border border-[#D8D3E6] px-3 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-[#2512D9]/30"
                            placeholder="Short summary of the issue"
                        />
                    </label>

                    <label className="flex flex-col gap-1.5">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#6F687F]">Message *</span>
                        <textarea
                            required
                            rows={4}
                            value={newCaseForm.message}
                            onChange={(e) => handleNewCaseChange('message', e.target.value)}
                            className="rounded-[8px] border border-[#D8D3E6] px-3 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-[#2512D9]/30"
                            placeholder="Full details of the customer's issue"
                        />
                    </label>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <label className="flex flex-col gap-1.5">
                            <span className="text-xs font-bold uppercase tracking-wider text-[#6F687F]">Priority</span>
                            <select
                                value={newCaseForm.priority}
                                onChange={(e) => handleNewCaseChange('priority', e.target.value)}
                                className="rounded-[8px] border border-[#D8D3E6] px-3 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-[#2512D9]/30"
                            >
                                <option value="low">Low</option>
                                <option value="normal">Normal</option>
                                <option value="high">High</option>
                                <option value="urgent">Urgent</option>
                            </select>
                        </label>
                        <label className="flex flex-col gap-1.5">
                            <span className="text-xs font-bold uppercase tracking-wider text-[#6F687F]">App</span>
                            <select
                                value={newCaseForm.appKey}
                                onChange={(e) => handleNewCaseChange('appKey', e.target.value)}
                                className="rounded-[8px] border border-[#D8D3E6] px-3 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-[#2512D9]/30"
                            >
                                {APP_KEY_OPTIONS.map((option) => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                        </label>
                    </div>

                    <div className="mt-2 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => setIsNewCaseOpen(false)}
                            className="h-11 rounded-[8px] border border-[#C8C2DD] bg-white px-4 text-xs font-black text-[#211B31]"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={newCaseSubmitting}
                            className="flex h-11 items-center justify-center gap-2 rounded-[8px] bg-[#2F1CD9] px-4 text-xs font-black text-white shadow-[0_4px_12px_rgba(47,28,217,0.25)] disabled:opacity-60"
                        >
                            {newCaseSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                            {newCaseSubmitting ? 'Creating…' : 'Create Ticket'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Support;
