import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import {
    AlertCircle,
    ArrowUpRight,
    Building2,
    CheckCircle2,
    Clock3,
    FileText,
    Headphones,
    Mail,
    MessageSquare,
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

const supportApps = [
    { name: 'Customer App', key: 'squarft-user', users: '18.4k', open: 38, today: 126, resolution: 72, health: 'Stable', tone: 'bg-[#EAF7F0] text-[#0C6B39]' },
    { name: 'Sales Officer', key: 'sales_officer', users: '164', open: 11, today: 34, resolution: 64, health: 'Watch', tone: 'bg-[#FFF7E6] text-[#A15A00]' },
    { name: 'Broker App', key: 'squarft-broker', users: '2.1k', open: 17, today: 58, resolution: 69, health: 'Stable', tone: 'bg-[#EAF7F0] text-[#0C6B39]' },
    { name: 'Project Panel', key: 'squarft-project-panel', users: '82', open: 9, today: 21, resolution: 58, health: 'Priority', tone: 'bg-[#FFF0F0] text-[#B41212]' },
    { name: 'Field Officer', key: 'squarft-field-officer', users: '96', open: 14, today: 29, resolution: 61, health: 'Watch', tone: 'bg-[#FFF7E6] text-[#A15A00]' },
];

const supportTickets = [
    {
        id: 'SUP-2048',
        customer: 'Riya Mehta',
        app: 'Customer App',
        topic: 'Visit reschedule payment hold',
        status: 'Urgent',
        owner: 'Manual team',
        priority: 'P1',
        channel: 'Chat',
        age: '12m',
        sentiment: 'Frustrated',
        summary: 'Customer rescheduled a site visit and sees a duplicate hold on booking amount.',
    },
    {
        id: 'SUP-2047',
        customer: 'Elite Realty',
        app: 'Broker App',
        topic: 'KYC document rejected',
        status: 'Open',
        owner: 'KYC Desk',
        priority: 'P2',
        channel: 'Email',
        age: '28m',
        sentiment: 'Neutral',
        summary: 'Broker uploaded GST and RERA certificate. Needs exact rejection reason and next action.',
    },
    {
        id: 'SUP-2046',
        customer: 'Amit Sharma',
        app: 'Sales Officer',
        topic: 'Lead assignment mismatch',
        status: 'Open',
        owner: 'Nisha Rao',
        priority: 'P2',
        channel: 'Call',
        age: '41m',
        sentiment: 'Confused',
        summary: 'Sales officer sees a lead in notifications but not in todays assigned list.',
    },
    {
        id: 'SUP-2045',
        customer: 'North Zone Team',
        app: 'Project Panel',
        topic: 'Inventory CSV upload failed',
        status: 'Escalated',
        owner: 'Tech queue',
        priority: 'P1',
        channel: 'Chat',
        age: '1h 08m',
        sentiment: 'Blocked',
        summary: 'CSV import stops after variant mapping. Team needs admin override before launch.',
    },
    {
        id: 'SUP-2044',
        customer: 'Rahul Jain',
        app: 'Field Officer',
        topic: 'Voice note not saving',
        status: 'AI handled',
        owner: 'Front Desk',
        priority: 'P3',
        channel: 'Chat',
        age: '2h 14m',
        sentiment: 'Calm',
        summary: 'Field officer had missing audio permission. AI shared reset steps and captured logs.',
    },
];

const userSupportRequests = [
    {
        id: 'USR-8812',
        requester: 'Riya Mehta',
        role: 'Customer',
        app: 'Customer App',
        request: 'Refund hold after visit reschedule',
        category: 'Payments',
        contact: '+91 99887 76655',
        channel: 'Chat',
        device: 'Android 14',
        owner: 'Front Desk',
        sla: '12m left',
        status: 'Urgent',
    },
    {
        id: 'USR-8811',
        requester: 'Elite Realty',
        role: 'Broker',
        app: 'Broker App',
        request: 'KYC rejection reason needed',
        category: 'Verification',
        contact: 'broker@squarft.com',
        channel: 'Email',
        device: 'iPhone 15',
        owner: 'KYC Desk',
        sla: '42m left',
        status: 'Open',
    },
    {
        id: 'USR-8810',
        requester: 'Amit Sharma',
        role: 'Sales Officer',
        app: 'Sales Officer',
        request: 'Assigned lead missing from today list',
        category: 'Lead Flow',
        contact: '+91 77889 96655',
        channel: 'Call',
        device: 'Android 13',
        owner: 'Nisha Rao',
        sla: '1h left',
        status: 'Open',
    },
    {
        id: 'USR-8809',
        requester: 'North Zone Team',
        role: 'Project Admin',
        app: 'Project Panel',
        request: 'Inventory CSV upload stuck at variant mapping',
        category: 'Inventory',
        contact: 'northzone@squarft.com',
        channel: 'Form',
        device: 'Chrome Windows',
        owner: 'Technical Queue',
        sla: 'Overdue',
        status: 'Escalated',
    },
    {
        id: 'USR-8808',
        requester: 'Rahul Jain',
        role: 'Field Officer',
        app: 'Field Officer',
        request: 'Voice note not saving after project visit',
        category: 'Media Upload',
        contact: '+91 88776 65544',
        channel: 'Chat',
        device: 'Android 12',
        owner: 'Technical Queue',
        sla: '2h left',
        status: 'Open',
    },
    {
        id: 'USR-8807',
        requester: 'Priya Nair',
        role: 'Customer',
        app: 'Customer App',
        request: 'Cannot download booking receipt',
        category: 'Documents',
        contact: 'priya@example.com',
        channel: 'Email',
        device: 'Safari iOS',
        owner: 'Front Desk',
        sla: '3h left',
        status: 'Open',
    },
];

const channels = [
    { label: 'Chat', value: '94', icon: MessageSquare, detail: 'Live conversations' },
    { label: 'Calls', value: '26', icon: PhoneCall, detail: 'Manual callbacks' },
    { label: 'Email', value: '41', icon: Mail, detail: 'SLA monitored' },
    { label: 'Forms', value: '19', icon: FileText, detail: 'In-app requests' },
];

const manualTeams = [
    { name: 'Front Desk', load: 68, available: 5, color: '#2512D9' },
    { name: 'KYC Desk', load: 54, available: 3, color: '#6B679E' },
    { name: 'Technical Queue', load: 82, available: 2, color: '#B41212' },
];

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

const Support = () => {
    const { user } = useSelector((state) => state.auth);
    const users = useSelector((state) => state.users.users);
    const clients = useSelector((state) => state.clients.clients);
    const visits = useSelector((state) => state.visits.visits);
    const deals = useSelector((state) => state.deals.deals);
    const [selectedTicketId, setSelectedTicketId] = useState(supportTickets[0].id);
    const [activeQueue, setActiveQueue] = useState('All');
    const [selectedApp, setSelectedApp] = useState('All Apps');

    const visibleTickets = supportTickets.filter((ticket) => {
        const queueMatch = activeQueue === 'All' || ticket.status === activeQueue || ticket.channel === activeQueue;
        const appMatch = selectedApp === 'All Apps' || ticket.app === selectedApp;
        return queueMatch && appMatch;
    });
    const visibleRequests = userSupportRequests.filter((request) => selectedApp === 'All Apps' || request.app === selectedApp);

    const supportMetrics = useMemo(() => {
        const totalOpen = supportApps.reduce((sum, app) => sum + app.open, 0);
        const requestsToday = supportApps.reduce((sum, app) => sum + app.today, 0);
        const manualTickets = supportTickets.filter((ticket) => ticket.status !== 'AI handled').length;
        const urgentTickets = supportTickets.filter((ticket) => ticket.priority === 'P1').length;
        const ecosystemUsers = users.length + clients.length + visits.length + deals.length;

        return {
            totalOpen,
            requestsToday,
            manualTickets,
            urgentTickets,
            ecosystemUsers,
        };
    }, [clients.length, deals.length, users.length, visits.length]);

    const roleLabel = user?.role === 'super_admin' ? 'Super Admin' : 'Admin';

    return (
        <div className="min-h-screen bg-[#FBF8FF] text-[#15111F]">
            <header className="sticky top-0 z-10 border-b border-[#D7D0EA] bg-[#F9F6FF]/95 px-4 py-4 backdrop-blur sm:px-6">
                <div className="mx-auto flex max-w-[1480px] flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                    <div>
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                            <StatusPill tone="open">{roleLabel} Access</StatusPill>
                            <StatusPill tone="resolved">Manual Support Desk</StatusPill>
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
                        <button className="flex h-11 items-center justify-center gap-2 rounded-[8px] bg-[#2F1CD9] px-4 text-xs font-black text-white shadow-[0_4px_12px_rgba(47,28,217,0.25)]">
                            <Plus size={16} /> New Case
                        </button>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-[1480px] px-4 py-8 sm:px-6">
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
                    <MetricTile icon={Headphones} label="Open Cases" value={supportMetrics.totalOpen} detail="Across all product apps" />
                    <MetricTile icon={MessageSquare} label="Requests Today" value={supportMetrics.requestsToday} detail="New user support requests" tone="bg-[#EAF7F0] text-[#0C6B39]" />
                    <MetricTile icon={UserRoundCheck} label="Manual Queue" value={supportMetrics.manualTickets} detail="Needs human owner" tone="bg-[#FFF7E6] text-[#A15A00]" />
                    <MetricTile icon={AlertCircle} label="P1 Urgent" value={supportMetrics.urgentTickets} detail="Escalate inside 15 min" tone="bg-[#FFF0F0] text-[#B41212]" />
                    <MetricTile icon={UsersRound} label="Context Links" value={supportMetrics.ecosystemUsers} detail="Users, visits, deals, clients" tone="bg-[#EEF6FF] text-[#155E9D]" />
                </div>

                <div className="mt-7 grid gap-6 xl:grid-cols-[1.28fr_0.72fr]">
                    <Panel className="overflow-hidden">
                        <div className="flex flex-col gap-4 border-b border-[#D8D3E6] p-5 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <h2 className="text-2xl font-black">Unified Ticket Queue</h2>
                                <p className="mt-1 text-xs font-bold text-[#6F687F]">Live cases from customer, broker, sales, project, and field apps</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {['All', 'Urgent', 'Escalated', 'Chat', 'Email', 'Call'].map((queue) => (
                                    <button
                                        key={queue}
                                        onClick={() => setActiveQueue(queue)}
                                        className={`h-9 rounded-[6px] px-4 text-xs font-black transition ${
                                            activeQueue === queue ? 'bg-[#2512D9] text-white' : 'bg-[#F0EDFA] text-[#211B31] hover:text-[#2512D9]'
                                        }`}
                                    >
                                        {queue}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[860px] text-left">
                                <thead className="bg-[#F2EEFA] text-[11px] uppercase tracking-[0.14em] text-[#171327]">
                                    <tr>
                                        <th className="px-5 py-4 font-black">Case</th>
                                        <th className="px-5 py-4 font-black">App</th>
                                        <th className="px-5 py-4 font-black">Priority</th>
                                        <th className="px-5 py-4 font-black">Owner</th>
                                        <th className="px-5 py-4 font-black">Age</th>
                                        <th className="px-5 py-4 font-black">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#D8D3E6]">
                                    {visibleTickets.map((ticket) => {
                                        const tone = ticket.status === 'Urgent'
                                            ? 'urgent'
                                            : ticket.status === 'Escalated'
                                                ? 'escalated'
                                                    : ticket.status === 'AI handled'
                                                        ? 'resolved'
                                                        : 'open';

                                        return (
                                            <tr
                                                key={ticket.id}
                                                onClick={() => setSelectedTicketId(ticket.id)}
                                                className={`cursor-pointer align-top transition hover:bg-[#FBFAFF] ${
                                                    selectedTicketId === ticket.id ? 'bg-[#F8F5FF]' : 'bg-white'
                                                }`}
                                            >
                                                <td className="px-5 py-5">
                                                    <p className="text-sm font-black text-[#15111F]">{ticket.topic}</p>
                                                    <p className="mt-1 text-xs font-bold text-[#6F687F]">{ticket.id} . {ticket.customer}</p>
                                                </td>
                                                <td className="px-5 py-5 text-sm font-bold">{ticket.app}</td>
                                                <td className="px-5 py-5">
                                                    <div className="flex items-center gap-2">
                                                        <StatusPill tone={tone}>{ticket.status}</StatusPill>
                                                        <span className="text-xs font-black">{ticket.priority}</span>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-5 text-sm font-bold">{ticket.owner}</td>
                                                <td className="px-5 py-5 text-sm font-black text-[#B41212]">{ticket.age}</td>
                                                <td className="px-5 py-5">
                                                    <button className="grid h-9 w-9 place-items-center rounded-[8px] bg-[#F0EDFA] text-[#2512D9]" aria-label={`Open ${ticket.id}`}>
                                                        <ArrowUpRight size={17} />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </Panel>

                    <Panel className="p-5">
                        <div className="mb-5 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-black">App Coverage</h2>
                                <p className="mt-1 text-xs font-bold text-[#6F687F]">Support load by product surface</p>
                            </div>
                            <button className="grid h-10 w-10 place-items-center rounded-[8px] bg-[#F0EDFA] text-[#2512D9]" aria-label="Refresh support health">
                                <RefreshCw size={18} />
                            </button>
                        </div>

                        <div className="space-y-3">
                            {supportApps.map((app) => (
                                <button
                                    key={app.key}
                                    onClick={() => setSelectedApp(selectedApp === app.name ? 'All Apps' : app.name)}
                                    className={`grid w-full gap-4 rounded-[8px] border p-4 text-left transition sm:grid-cols-[42px_1fr_auto] sm:items-center ${
                                        selectedApp === app.name ? 'border-[#2512D9] bg-[#F8F5FF]' : 'border-[#D8D3E6] bg-white hover:bg-[#FBFAFF]'
                                    }`}
                                >
                                    <div className="grid h-10 w-10 place-items-center rounded-[8px] bg-[#F0EDFF] text-[#2512D9]">
                                        {app.name.includes('Project') ? <Building2 size={20} /> : app.name.includes('Customer') ? <Smartphone size={20} /> : <ShieldCheck size={20} />}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-black">{app.name}</p>
                                        <p className="text-xs font-bold text-[#6F687F]">{app.key} . {app.users} users . {app.today} today</p>
                                        <div className="mt-3 h-2 rounded-full bg-[#F0EDFA]">
                                            <div className="h-full rounded-full bg-[#2512D9]" style={{ width: `${app.resolution}%` }} />
                                        </div>
                                    </div>
                                    <div className="sm:text-right">
                                        <StatusPill tone="neutral">{app.open} open</StatusPill>
                                        <p className={`mt-2 inline-block rounded-[4px] px-2 py-1 text-[11px] font-black ${app.tone}`}>{app.health}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </Panel>
                </div>

                <div className="mt-7 grid gap-6 xl:grid-cols-[0.86fr_1.14fr]">
                    <Panel className="p-5">
                        <div className="mb-5 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-black">App Coverage</h2>
                                <p className="mt-1 text-xs font-bold text-[#6F687F]">Support health by product surface</p>
                            </div>
                            <button className="grid h-10 w-10 place-items-center rounded-[8px] bg-[#F0EDFA] text-[#2512D9]" aria-label="Refresh support health">
                                <RefreshCw size={18} />
                            </button>
                        </div>

                        <div className="space-y-3">
                            {supportApps.map((app) => (
                                <button
                                    key={app.key}
                                    onClick={() => setSelectedApp(selectedApp === app.name ? 'All Apps' : app.name)}
                                    className={`grid w-full gap-4 rounded-[8px] border p-4 text-left transition sm:grid-cols-[42px_1fr_auto] sm:items-center ${
                                        selectedApp === app.name ? 'border-[#2512D9] bg-[#F8F5FF]' : 'border-[#D8D3E6] bg-white hover:bg-[#FBFAFF]'
                                    }`}
                                >
                                    <div className="grid h-10 w-10 place-items-center rounded-[8px] bg-[#F0EDFF] text-[#2512D9]">
                                        {app.name.includes('Project') ? <Building2 size={20} /> : app.name.includes('Customer') ? <Smartphone size={20} /> : <ShieldCheck size={20} />}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-black">{app.name}</p>
                                        <p className="text-xs font-bold text-[#6F687F]">{app.key} . {app.users} users</p>
                                        <div className="mt-3 h-2 rounded-full bg-[#F0EDFA]">
                                            <div className="h-full rounded-full bg-[#2512D9]" style={{ width: `${app.aiRate}%` }} />
                                        </div>
                                    </div>
                                    <div className="sm:text-right">
                                        <StatusPill tone="neutral">{app.open} open</StatusPill>
                                        <p className={`mt-2 inline-block rounded-[4px] px-2 py-1 text-[11px] font-black ${app.tone}`}>{app.health}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </Panel>

                    <div className="grid gap-6">
                        <Panel className="p-5">
                            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h2 className="text-2xl font-black">Manual Support Desk</h2>
                                    <p className="mt-1 text-xs font-bold text-[#6F687F]">Agent load, ownership, and callback readiness</p>
                                </div>
                                <button className="flex h-10 items-center justify-center gap-2 rounded-[8px] bg-[#2512D9] px-4 text-xs font-black text-white">
                                    <UserRoundCheck size={16} /> Assign Agent
                                </button>
                            </div>

                            <div className="grid gap-4 md:grid-cols-3">
                                {manualTeams.map((team) => (
                                    <div key={team.name} className="rounded-[8px] border border-[#D8D3E6] p-4">
                                        <div className="mb-4 flex items-center justify-between">
                                            <p className="font-black">{team.name}</p>
                                            <span className="text-xs font-black text-[#2512D9]">{team.available} online</span>
                                        </div>
                                        <div className="h-2 rounded-full bg-[#F0EDFA]">
                                            <div className="h-full rounded-full" style={{ width: `${team.load}%`, backgroundColor: team.color }} />
                                        </div>
                                        <p className="mt-3 text-xs font-bold text-[#6F687F]">{team.load}% queue load</p>
                                    </div>
                                ))}
                            </div>
                        </Panel>

                        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                            <Panel className="p-5">
                                <h2 className="mb-5 text-2xl font-black">Channels</h2>
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
                                <h2 className="mb-5 text-2xl font-black">SLA Timeline</h2>
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
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Support;
