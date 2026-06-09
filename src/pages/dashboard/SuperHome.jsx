import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import {
    AlertTriangle,
    Bell,
    BriefcaseBusiness,
    Building2,
    CalendarDays,
    ChevronDown,
    ClipboardCheck,
    IndianRupee,
    MapPin,
    Plus,
    RefreshCw,
    Search,
    UsersRound,
} from 'lucide-react';
import { liveActivity, mockBranches } from '../../data/mockData';

const cityOptions = ['All Cities', 'Indore', 'Bhopal'];

const normalizeCity = (value = '') => {
    const text = String(value).toLowerCase();
    if (text.includes('indore')) return 'Indore';
    if (text.includes('bhopal')) return 'Bhopal';
    return 'Other';
};

const formatMoney = (amount) => {
    if (!amount) return '0';
    if (amount >= 10000000) return `${(amount / 10000000).toFixed(amount >= 100000000 ? 1 : 2)} Cr`;
    if (amount >= 100000) return `${(amount / 100000).toFixed(1)} L`;
    return amount.toLocaleString('en-IN');
};

const initials = (name = '') => name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || 'SA';

const matchesCity = (item, city) => {
    if (city === 'All Cities') return true;
    const haystack = [
        item.city,
        item.location,
        item.prefLocation,
        item.address,
        item.property?.address,
        item.req?.loc?.join(' '),
    ].filter(Boolean).join(' ');
    return normalizeCity(haystack) === city;
};

const Panel = ({ children, className = '' }) => (
    <section className={`rounded-[8px] border border-[#C8C2DD] bg-white shadow-[0_1px_0_rgba(53,38,110,0.03)] ${className}`}>
        {children}
    </section>
);

const TopBar = ({ activeCity, setActiveCity }) => (
    <div className="sticky top-0 z-10 border-b border-[#D7D0EA] bg-[#F9F6FF]/95 backdrop-blur px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-[1480px] flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <label className="flex h-11 min-w-0 flex-1 items-center gap-3 rounded-[8px] bg-[#F0EDFA] px-4 text-[#8A84A3] lg:max-w-[620px]">
                <Search size={19} />
                <input
                    className="w-full bg-transparent text-sm font-medium text-[#221C34] outline-none placeholder:text-[#756E8B]"
                    placeholder="Global Search (Projects, Leads, Payouts...)"
                />
            </label>

            <div className="flex flex-wrap items-center gap-3">
                <div className="flex h-11 rounded-[8px] bg-[#E8E2F4] p-1">
                    {cityOptions.map((city) => (
                        <button
                            key={city}
                            onClick={() => setActiveCity(city)}
                            className={`min-w-20 rounded-[6px] px-3 text-xs font-bold transition ${
                                activeCity === city ? 'bg-white text-[#2512D9] shadow-sm' : 'text-[#211A32] hover:text-[#2512D9]'
                            }`}
                        >
                            {city}
                        </button>
                    ))}
                </div>
                <button className="relative grid h-10 w-10 place-items-center rounded-[8px] text-[#161022] hover:bg-[#F0EDFA]" aria-label="Notifications">
                    <Bell size={20} />
                    <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#C11111]" />
                </button>
                <button className="grid h-10 w-10 place-items-center rounded-[8px] text-[#161022] hover:bg-[#F0EDFA]" aria-label="Locations">
                    <MapPin size={20} />
                </button>
                <button className="flex h-10 items-center gap-2 rounded-[8px] bg-[#2F1CD9] px-4 text-xs font-extrabold text-white shadow-[0_4px_12px_rgba(47,28,217,0.25)]">
                    <Plus size={16} /> Quick Add
                </button>
            </div>
        </div>
    </div>
);

const MetricCard = ({ icon: Icon, label, value, tone, children }) => (
    <Panel className="min-h-[174px] p-5">
        <div className="mb-8 flex items-start justify-between">
            <div className={`grid h-10 w-10 place-items-center rounded-[8px] ${tone.bg} ${tone.text}`}>
                <Icon size={21} />
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#171327]">{label}</span>
        </div>
        <div className={`text-[42px] font-black leading-none tracking-normal ${tone.value || 'text-[#14111D]'}`}>{value}</div>
        <div className="mt-5">{children}</div>
    </Panel>
);

const ApprovalRow = ({ icon: Icon, tone, title, detail, primary, secondary }) => (
    <div className="grid grid-cols-[42px_1fr] gap-4 border-t border-[#D8D3E6] px-5 py-4">
        <div className={`grid h-10 w-10 place-items-center rounded-[8px] ${tone.bg} ${tone.text}`}>
            <Icon size={20} />
        </div>
        <div className="min-w-0">
            <p className="truncate text-sm font-bold text-[#15111F]">{title}</p>
            <p className="mb-2 truncate text-xs text-[#29243A]">{detail}</p>
            <div className="flex flex-wrap gap-3">
                <button className="h-7 rounded-[4px] bg-[#2D19D8] px-4 text-xs font-bold text-white">{primary}</button>
                <button className="h-7 rounded-[4px] border border-[#C8C2DD] px-4 text-xs font-medium text-[#9D0D0D]">{secondary}</button>
            </div>
        </div>
    </div>
);

const FunnelBar = ({ label, value, width, note, intensity = 'bg-[#2F1CD9]' }) => (
    <div>
        <div className="relative h-[58px] overflow-hidden rounded-[8px] bg-[#F1EEFB]">
            <div className={`flex h-full items-center px-7 text-sm font-extrabold text-white ${intensity}`} style={{ width }}>
                {label}: {value}
            </div>
            {note && <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#211B31]">{note}</span>}
        </div>
        <div className="grid h-8 place-items-center text-[#B6B0CA]">
            <ChevronDown size={18} />
        </div>
    </div>
);

const StatusPill = ({ children, tone = 'neutral' }) => {
    const styles = {
        confirmed: 'bg-[#F2F8EF] text-[#1A4E24]',
        route: 'bg-[#FBEAE5] text-[#A93516]',
        pending: 'bg-[#F0F0F3] text-[#181521]',
        neutral: 'bg-[#F0EDFA] text-[#2512D9]',
    };
    return <span className={`rounded-[4px] px-3 py-1 text-[11px] font-bold ${styles[tone]}`}>{children}</span>;
};

const OfficerBar = ({ name, meta, value, color = '#2512D9', max = 24, accent = 'bg-[#12313A]' }) => (
    <div className="grid grid-cols-[48px_1fr] items-center gap-4">
        <div className={`grid h-11 w-11 place-items-center rounded-full text-xs font-black text-white shadow-inner ${accent}`}>
            {initials(name)}
        </div>
        <div className="min-w-0">
            <div className="mb-2 flex items-center justify-between gap-3">
                <p className="truncate text-sm font-bold text-[#17121F]">{name}</p>
                <p className="shrink-0 text-xs font-extrabold text-[#1F12C9]">{meta}</p>
            </div>
            <div className="h-2 rounded-full bg-[#F0EDFA]">
                <div className="h-full rounded-full" style={{ width: `${Math.min(100, (value / max) * 100)}%`, background: color }} />
            </div>
        </div>
    </div>
);

const SuperHome = () => {
    const [activeCity, setActiveCity] = useState('All Cities');
    const projects = useSelector((state) => state.inventory.projects);
    const leads = useSelector((state) => state.leads.leads);
    const clients = useSelector((state) => state.clients.clients);
    const visits = useSelector((state) => state.visits.visits);
    const deals = useSelector((state) => state.deals.deals);
    const users = useSelector((state) => state.users.users);

    const data = useMemo(() => {
        const scopedProjects = projects.filter((project) => matchesCity(project, activeCity) || activeCity === 'All Cities');
        const scopedLeads = leads.filter((lead) => matchesCity(lead, activeCity));
        const scopedClients = clients.filter((client) => matchesCity(client, activeCity));
        const scopedVisits = visits.filter((visit) => matchesCity(visit, activeCity));
        const scopedDeals = deals.filter((deal) => matchesCity(deal, activeCity));

        const inventoryTotal = scopedProjects.reduce((sum, project) => sum + (project.units || 0), 0);
        const inventoryAvailable = scopedProjects.reduce((sum, project) => sum + (project.available || 0), 0);
        const pendingProjects = scopedProjects.filter((project) => project.status === 'Pending' || project.status === 'In Review');
        const liveProjects = scopedProjects.filter((project) => project.status === 'Active' || project.status === 'Approved');
        const completedDeals = scopedDeals.filter((deal) => deal.status === 'DEAL COMPLETED');
        const payable = scopedDeals.reduce((sum, deal) => sum + (deal.remainingBalance || 0), 0);
        const revenue = completedDeals.reduce((sum, deal) => sum + (deal.negotiationPrice || deal.expectPrice || 0), 0);
        const pendingPayments = scopedDeals.filter((deal) => deal.remainingBalance > 0);
        const visitsToday = scopedVisits.filter((visit) => String(visit.date).toLowerCase().includes('today') || visit.date === '09/06/26');

        const customerAdded = scopedLeads.length + scopedClients.length;
        const qualified = scopedClients.length;
        const visited = scopedVisits.filter((visit) => visit.status !== 'Cancelled').length;
        const closed = completedDeals.length;

        return {
            scopedProjects,
            scopedLeads,
            scopedClients,
            scopedVisits,
            scopedDeals,
            inventoryTotal,
            inventoryAvailable,
            pendingProjects,
            liveProjects,
            payable,
            revenue,
            pendingPayments,
            visitsToday,
            funnel: { customerAdded, qualified, visited, closed },
        };
    }, [activeCity, clients, deals, leads, projects, visits]);

    const visitRows = (data.visitsToday.length ? data.visitsToday : data.scopedVisits).slice(0, 3);
    const salesOfficers = users.filter((user) => user.type === 'Sales_officer').slice(0, 2);
    const fieldOfficers = users.filter((user) => user.type === 'Field_officer').slice(0, 2);
    const urgentCount = data.pendingProjects.length + data.pendingPayments.length + data.scopedClients.filter((client) => !client.officer).length;
    const conversion = data.funnel.customerAdded ? Math.round((data.funnel.closed / data.funnel.customerAdded) * 100) : 0;
    const overviewDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).format(new Date());

    return (
        <div className="min-h-screen bg-[#FBF8FF] text-[#15111F]">
            <TopBar activeCity={activeCity} setActiveCity={setActiveCity} />

            <main className="mx-auto max-w-[1480px] px-4 py-8 sm:px-6">
                <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-[28px] font-black tracking-normal text-black">Welcome back, Super Admin</h1>
                        <p className="mt-1 text-sm font-medium text-[#211B31]">Operational Overview for {overviewDate}</p>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-bold text-[#221C34]">
                        <RefreshCw size={18} className="text-[#2512D9]" />
                        Real-time Sync Active
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                    <MetricCard icon={BriefcaseBusiness} label="Projects" value={data.scopedProjects.length} tone={{ bg: 'bg-[#ECE8FF]', text: 'text-[#2512D9]' }}>
                        <div className="grid grid-cols-3 items-end gap-3 text-xs">
                            <div><p className="text-[#342E45]">Pending</p><p className="text-base font-black text-[#C11111]">{data.pendingProjects.length}</p></div>
                            <div><p className="text-[#342E45]">Live</p><p className="text-base font-black text-[#2512D9]">{data.liveProjects.length}</p></div>
                            <div className="text-right font-bold text-[#171327]">+4.2%</div>
                        </div>
                    </MetricCard>
                    <MetricCard icon={Building2} label="Inventory" value={data.inventoryTotal} tone={{ bg: 'bg-[#F0EDFF]', text: 'text-[#2512D9]' }}>
                        <div className="grid grid-cols-3 divide-x divide-[#D8D3E6] text-center text-xs">
                            <div><p>Avail</p><b className="text-base text-[#2512D9]">{data.inventoryAvailable}</b></div>
                            <div><p>Sold</p><b className="text-base">{Math.max(0, data.inventoryTotal - data.inventoryAvailable)}</b></div>
                            <div><p>Resv</p><b className="text-base text-[#A90F0F]">{data.pendingProjects.length * 5}</b></div>
                        </div>
                    </MetricCard>
                    <MetricCard icon={ClipboardCheck} label="Activity" value={data.scopedLeads.length + data.scopedVisits.length + data.scopedDeals.length} tone={{ bg: 'bg-[#FFF0EC]', text: 'text-[#A93516]' }}>
                        <div className="flex items-end justify-between text-xs">
                            <div><p>New Leads</p><b className="text-base">{data.scopedLeads.length}</b></div>
                            <div><p>Visits</p><b className="text-base">{data.visitsToday.length} Today</b></div>
                            <StatusPill>High Traffic</StatusPill>
                        </div>
                    </MetricCard>
                    <MetricCard icon={IndianRupee} label="Financials" value={`₹${formatMoney(data.revenue || data.payable)}`} tone={{ bg: 'bg-[#FFF0F0]', text: 'text-[#B41212]', value: 'text-[#B41212]' }}>
                        <div className="flex items-center justify-between border-t border-[#D8D3E6] pt-3 text-xs">
                            <span>Comm. Payable</span>
                            <b className="text-base">₹{formatMoney(data.payable)}</b>
                        </div>
                    </MetricCard>
                </div>

                <div className="mt-8 grid gap-6 xl:grid-cols-[0.94fr_1.96fr]">
                    <Panel>
                        <div className="flex items-center justify-between p-6">
                            <h2 className="max-w-[210px] text-2xl font-bold leading-tight">Pending Approval Center</h2>
                            <span className="rounded-full border border-[#8F0808] bg-[#C11111] px-3 py-2 text-center text-[10px] font-black leading-none text-white">{urgentCount}<br />URGENT</span>
                        </div>
                        <ApprovalRow icon={Building2} tone={{ bg: 'bg-[#EDE9FF]', text: 'text-[#2512D9]' }} title={`Project Approval: ${data.pendingProjects[0]?.name || 'Skyline Heights'}`} detail="Submitted by: Indore West Team" primary="Approve" secondary="Reject" />
                        <ApprovalRow icon={ClipboardCheck} tone={{ bg: 'bg-[#F0F1FF]', text: 'text-[#24308F]' }} title={`Broker KYC: ${users.find((user) => user.docStatus === 'Pending')?.name || 'Elite Realty'}`} detail="Documents pending verification" primary="Verify" secondary="View Doc" />
                        <ApprovalRow icon={IndianRupee} tone={{ bg: 'bg-[#FFF0EC]', text: 'text-[#A93516]' }} title={`Payment: Deal #${data.pendingPayments[0]?.dealCode || 'SQ-7721'}`} detail={`₹${formatMoney(data.pendingPayments[0]?.remainingBalance || 1250000)} Clearance`} primary="Confirm" secondary="Receipt" />
                    </Panel>

                    <Panel className="p-6">
                        <div className="mb-7 flex items-start justify-between gap-4">
                            <h2 className="text-2xl font-bold">Sales Workflow Funnel</h2>
                            <div className="flex items-center gap-2 text-xs text-[#211B31]"><span className="h-2 w-2 rounded-full bg-[#2512D9]" /> Target: 15% Conv.</div>
                        </div>
                        <FunnelBar label="Customer Added" value={data.funnel.customerAdded} width="100%" />
                        <FunnelBar label="Lead Qualified" value={data.funnel.qualified} width={`${Math.max(42, data.funnel.customerAdded ? (data.funnel.qualified / data.funnel.customerAdded) * 100 : 42)}%`} note={`${data.funnel.customerAdded ? Math.round((data.funnel.qualified / data.funnel.customerAdded) * 100) : 0}% Rate`} intensity="bg-[#5A4BE1]" />
                        <FunnelBar label="Visit Done" value={data.funnel.visited} width={`${Math.max(36, data.funnel.customerAdded ? (data.funnel.visited / data.funnel.customerAdded) * 100 : 36)}%`} note={`${data.funnel.customerAdded ? Math.round((data.funnel.visited / data.funnel.customerAdded) * 100) : 0}% Rate`} intensity="bg-[#7E70E3]" />
                        <div className="relative h-[58px] overflow-hidden rounded-[8px] bg-[#F1EEFB]">
                            <div className="flex h-full items-center px-7 text-sm font-extrabold text-white bg-[#CFC9F2]" style={{ width: `${Math.max(22, conversion)}%` }}>Deal Closed: {data.funnel.closed}</div>
                            <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-black text-[#211B31]">{conversion}% Final Conv.</span>
                        </div>
                    </Panel>
                </div>

                <div className="mt-8 grid gap-6 xl:grid-cols-[1.77fr_0.85fr]">
                    <Panel className="overflow-hidden">
                        <div className="flex items-center justify-between p-6">
                            <h2 className="text-2xl font-bold">Today's Scheduled Visits</h2>
                            <button className="text-xs font-extrabold text-[#2512D9]">View All Schedule</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[700px] text-left">
                                <thead className="bg-[#F2EEFA] text-[12px] uppercase tracking-[0.14em] text-[#171327]">
                                    <tr>
                                        <th className="px-6 py-4 font-bold">Customer</th>
                                        <th className="px-6 py-4 font-bold">Project</th>
                                        <th className="px-6 py-4 font-bold">Time</th>
                                        <th className="px-6 py-4 font-bold">Assigned Officer</th>
                                        <th className="px-6 py-4 font-bold">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#D8D3E6]">
                                    {visitRows.map((visit) => (
                                        <tr key={visit.id} className="align-top">
                                            <td className="px-6 py-5 text-sm font-medium">{visit.customerName}</td>
                                            <td className="px-6 py-5 text-sm">{visit.property?.name}</td>
                                            <td className="whitespace-pre-line px-6 py-5 text-sm">{String(visit.time).replace(' - ', '\n')}</td>
                                            <td className="px-6 py-5 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <span className="grid h-6 w-6 place-items-center rounded-full bg-[#E8E3FF] text-[10px] font-bold text-[#2512D9]">{initials(visit.officerName)}</span>
                                                    {visit.officerName}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5"><StatusPill tone={visit.status === 'Scheduled' ? 'confirmed' : visit.status === 'In Progress' ? 'route' : 'pending'}>{visit.status}</StatusPill></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="h-48" />
                    </Panel>

                    <div className="grid gap-6">
                        <Panel className="p-6">
                            <div className="mb-4 flex items-center gap-3 text-[#C11111]">
                                <AlertTriangle size={20} />
                                <h2 className="text-sm font-black uppercase tracking-[0.12em]">Urgent Operational Alerts</h2>
                            </div>
                            <div className="space-y-4">
                                <div className="border-l-4 border-[#C11111] bg-[#FFF4F4] p-4">
                                    <p className="font-black text-[#C11111]">Project pending for 3+ days</p>
                                    <p className="text-xs text-[#4B2630]">{data.pendingProjects.length || 2} requires technical clearance.</p>
                                </div>
                                <div className="border-l-4 border-[#A21A0B] bg-[#FFF7F4] p-4">
                                    <p className="font-black text-[#A21A0B]">Lead unassigned for 24h</p>
                                    <p className="text-xs text-[#4B2630]">{data.scopedClients.filter((client) => !client.officer).length || 14} high-intent leads need owner assignment.</p>
                                </div>
                            </div>
                        </Panel>

                        <Panel className="p-6">
                            <h2 className="mb-6 text-2xl font-bold">Live Activity Feed</h2>
                            <div className="space-y-5">
                                {liveActivity.slice(0, 4).map((item, index) => (
                                    <div key={`${item.time}-${item.action}`} className="grid grid-cols-[20px_1fr] gap-3">
                                        <div className="relative grid h-5 w-5 place-items-center rounded-full border border-[#BDB5FF]">
                                            <span className={`h-2 w-2 rounded-full ${index === 2 ? 'bg-[#8A2D13]' : 'bg-[#2512D9]'}`} />
                                            {index < 3 && <span className="absolute top-5 h-8 w-px bg-[#D8D3E6]" />}
                                        </div>
                                        <div>
                                            <p className="text-sm text-[#17121F]"><b>{item.action}</b> {item.detail}</p>
                                            <p className="text-xs text-[#17121F]">{item.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Panel>
                    </div>
                </div>

                <div className="mt-8 grid gap-6 xl:grid-cols-2">
                    <Panel className="p-6">
                        <div className="mb-6 flex items-start justify-between">
                            <div><h2 className="text-2xl font-bold">Sales Officers</h2><p className="text-xs">Direct Client Closures</p></div>
                            <UsersRound className="text-[#2512D9]" size={22} />
                        </div>
                        <div className="space-y-5">
                            {salesOfficers.map((user, index) => (
                                <OfficerBar key={user.id} name={index === 0 ? `${user.name} (Top)` : user.name} meta={`${8 - index * 3} Deals`} value={8 - index * 3} max={10} accent={index === 0 ? 'bg-[#15353D]' : 'bg-[#C28E7F]'} />
                            ))}
                        </div>
                    </Panel>

                    <Panel className="p-6">
                        <div className="mb-6 flex items-start justify-between">
                            <div><h2 className="text-2xl font-bold">Field Officers</h2><p className="text-xs">On-ground Visits & Reports</p></div>
                            <CalendarDays className="text-[#24308F]" size={22} />
                        </div>
                        <div className="space-y-5">
                            {(fieldOfficers.length ? fieldOfficers : mockBranches.slice(0, 2)).map((user, index) => (
                                <OfficerBar key={user.id} name={user.name || user.head} meta={`${24 - index * 5} Visits Done`} value={24 - index * 5} color="#6B679E" accent={index === 0 ? 'bg-[#12313A]' : 'bg-[#6B3C51]'} />
                            ))}
                        </div>
                    </Panel>
                </div>
            </main>
        </div>
    );
};

export default SuperHome;
