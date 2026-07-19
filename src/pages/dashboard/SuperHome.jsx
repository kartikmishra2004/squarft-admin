import { useEffect, useState } from 'react';
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
import { fetchSuperDashboardOverview } from '../../services/dashboardService';

const cityOptions = ['All Cities', 'Indore', 'Bhopal'];

const formatMoney = (amount) => {
    if (!amount) return '0';
    if (amount >= 10000000) return `${(amount / 10000000).toFixed(amount >= 100000000 ? 1 : 2)} Cr`;
    if (amount >= 100000) return `${(amount / 100000).toFixed(1)} L`;
    return amount.toLocaleString('en-IN');
};

const formatDateTime = (value) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
};

const formatRelativeTime = (value) => {
    if (!value) return '';
    const diffMs = Date.now() - new Date(value).getTime();
    if (Number.isNaN(diffMs)) return '';
    const minutes = Math.round(diffMs / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min${minutes === 1 ? '' : 's'} ago`;
    const hours = Math.round(minutes / 60);
    if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    const days = Math.round(hours / 24);
    return `${days} day${days === 1 ? '' : 's'} ago`;
};

const cityToApiValue = (city) => (city === 'All Cities' ? '' : city);

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
    return <span className={`rounded-[4px] px-3 py-1 text-[11px] font-bold ${styles[tone] || styles.neutral}`}>{children}</span>;
};

const OfficerBar = ({ name, initials, meta, value, max, color = '#2512D9', accent = 'bg-[#12313A]' }) => (
    <div className="grid grid-cols-[48px_1fr] items-center gap-4">
        <div className={`grid h-11 w-11 place-items-center rounded-full text-xs font-black text-white shadow-inner ${accent}`}>
            {initials}
        </div>
        <div className="min-w-0">
            <div className="mb-2 flex items-center justify-between gap-3">
                <p className="truncate text-sm font-bold text-[#17121F]">{name}</p>
                <p className="shrink-0 text-xs font-extrabold text-[#1F12C9]">{meta}</p>
            </div>
            <div className="h-2 rounded-full bg-[#F0EDFA]">
                <div className="h-full rounded-full" style={{ width: `${Math.min(100, max ? (value / max) * 100 : 0)}%`, background: color }} />
            </div>
        </div>
    </div>
);

const STATUS_TONE_BY_VALUE = {
    scheduled: 'confirmed',
    confirmed: 'confirmed',
    in_progress: 'route',
    'in progress': 'route',
};

const SuperHome = () => {
    const [activeCity, setActiveCity] = useState('All Cities');
    const [overview, setOverview] = useState(null);
    const [pageLoading, setPageLoading] = useState(true);
    const [pageError, setPageError] = useState('');

    useEffect(() => {
        let active = true;

        const loadOverview = async () => {
            setPageLoading(true);
            setPageError('');

            try {
                const data = await fetchSuperDashboardOverview({ city: cityToApiValue(activeCity) });
                if (!active) return;
                setOverview(data);
            } catch (error) {
                console.error('Failed to load super dashboard overview:', error);
                if (active) setPageError(error?.message || 'Failed to load dashboard data.');
            } finally {
                if (active) setPageLoading(false);
            }
        };

        loadOverview();

        return () => { active = false; };
    }, [activeCity]);

    const overviewDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).format(new Date());

    if (pageLoading && !overview) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#FBF8FF]">
                <p className="text-sm font-bold text-[#211B31]">Loading dashboard...</p>
            </div>
        );
    }

    const metrics = overview?.metrics || {
        projects: { total: 0, pending: 0, live: 0, growthPercent: 0 },
        inventory: { total: 0, available: 0, sold: 0, reserved: 0 },
        activity: { total: 0, newLeads: 0, visitsToday: 0, trafficLabel: 'Normal Traffic' },
        financials: { revenue: 0, commissionPayable: 0, pendingPaymentCount: 0 },
    };
    const pendingApprovals = overview?.pendingApprovals || { urgentCount: 0, items: [] };
    const funnel = overview?.funnel || { targetConversionPercent: 15, stages: [] };
    const scheduledVisits = overview?.scheduledVisits || [];
    const operationalAlerts = overview?.operationalAlerts || [];
    const liveActivity = overview?.liveActivity || [];
    const officerLeaderboards = overview?.officerLeaderboards || { salesOfficers: [], fieldOfficers: [] };

    const stageByKey = Object.fromEntries(funnel.stages.map((stage) => [stage.key, stage]));
    const closedStage = stageByKey.dealClosed || { value: 0, rate: 0 };

    const approvalIconByType = {
        project_approval: Building2,
        broker_kyc: ClipboardCheck,
        payment_clearance: IndianRupee,
    };
    const approvalToneByType = {
        project_approval: { bg: 'bg-[#EDE9FF]', text: 'text-[#2512D9]' },
        broker_kyc: { bg: 'bg-[#F0F1FF]', text: 'text-[#24308F]' },
        payment_clearance: { bg: 'bg-[#FFF0EC]', text: 'text-[#A93516]' },
    };

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
                        {overview?.sync?.label || 'Real-time Sync Active'}
                    </div>
                </div>

                {pageError && (
                    <div className="mb-6 rounded-[8px] border border-[#F5C2C2] bg-[#FFF4F4] px-4 py-3 text-xs font-bold text-[#B42318]">
                        {pageError}
                    </div>
                )}

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                    <MetricCard icon={BriefcaseBusiness} label="Projects" value={metrics.projects.total} tone={{ bg: 'bg-[#ECE8FF]', text: 'text-[#2512D9]' }}>
                        <div className="grid grid-cols-3 items-end gap-3 text-xs">
                            <div><p className="text-[#342E45]">Pending</p><p className="text-base font-black text-[#C11111]">{metrics.projects.pending}</p></div>
                            <div><p className="text-[#342E45]">Live</p><p className="text-base font-black text-[#2512D9]">{metrics.projects.live}</p></div>
                            <div className="text-right font-bold text-[#171327]">{metrics.projects.growthPercent >= 0 ? '+' : ''}{metrics.projects.growthPercent}%</div>
                        </div>
                    </MetricCard>
                    <MetricCard icon={Building2} label="Inventory" value={metrics.inventory.total} tone={{ bg: 'bg-[#F0EDFF]', text: 'text-[#2512D9]' }}>
                        <div className="grid grid-cols-3 divide-x divide-[#D8D3E6] text-center text-xs">
                            <div><p>Avail</p><b className="text-base text-[#2512D9]">{metrics.inventory.available}</b></div>
                            <div><p>Sold</p><b className="text-base">{metrics.inventory.sold}</b></div>
                            <div><p>Reserved</p><b className="text-base text-[#A90F0F]">{metrics.inventory.reserved}</b></div>
                        </div>
                    </MetricCard>
                    <MetricCard icon={ClipboardCheck} label="Activity" value={metrics.activity.total} tone={{ bg: 'bg-[#FFF0EC]', text: 'text-[#A93516]' }}>
                        <div className="flex items-end justify-between text-xs">
                            <div><p>New Leads</p><b className="text-base">{metrics.activity.newLeads}</b></div>
                            <div><p>Visits</p><b className="text-base">{metrics.activity.visitsToday} Today</b></div>
                            <StatusPill>{metrics.activity.trafficLabel}</StatusPill>
                        </div>
                    </MetricCard>
                    <MetricCard icon={IndianRupee} label="Financials" value={`₹${formatMoney(metrics.financials.revenue)}`} tone={{ bg: 'bg-[#FFF0F0]', text: 'text-[#B41212]', value: 'text-[#B41212]' }}>
                        <div className="flex items-center justify-between border-t border-[#D8D3E6] pt-3 text-xs">
                            <span>Comm. Payable</span>
                            <b className="text-base">₹{formatMoney(metrics.financials.commissionPayable)}</b>
                        </div>
                    </MetricCard>
                </div>

                <div className="mt-8 grid gap-6 xl:grid-cols-[0.94fr_1.96fr]">
                    <Panel>
                        <div className="flex items-center justify-between p-6">
                            <h2 className="max-w-[210px] text-2xl font-bold leading-tight">Pending Approval Center</h2>
                            <span className="rounded-full border border-[#8F0808] bg-[#C11111] px-3 py-2 text-center text-[10px] font-black leading-none text-white">{pendingApprovals.urgentCount}<br />URGENT</span>
                        </div>
                        {pendingApprovals.items.length === 0 ? (
                            <p className="border-t border-[#D8D3E6] px-5 py-6 text-center text-xs font-bold text-[#615C71]">No pending approvals.</p>
                        ) : (
                            pendingApprovals.items.map((item) => (
                                <ApprovalRow
                                    key={item.id}
                                    icon={approvalIconByType[item.type] || ClipboardCheck}
                                    tone={approvalToneByType[item.type] || { bg: 'bg-[#F0F1FF]', text: 'text-[#24308F]' }}
                                    title={item.title}
                                    detail={item.detail}
                                    primary={item.primaryAction}
                                    secondary={item.secondaryAction}
                                />
                            ))
                        )}
                    </Panel>

                    <Panel className="p-6">
                        <div className="mb-7 flex items-start justify-between gap-4">
                            <h2 className="text-2xl font-bold">Sales Workflow Funnel</h2>
                            <div className="flex items-center gap-2 text-xs text-[#211B31]"><span className="h-2 w-2 rounded-full bg-[#2512D9]" /> Target: {funnel.targetConversionPercent}% Conv.</div>
                        </div>
                        {funnel.stages.slice(0, 3).map((stage, index) => (
                            <FunnelBar
                                key={stage.key}
                                label={stage.label}
                                value={stage.value}
                                width={index === 0 ? '100%' : `${Math.max(36, stage.rate)}%`}
                                note={index === 0 ? undefined : `${stage.rate}% Rate`}
                                intensity={index === 1 ? 'bg-[#5A4BE1]' : index === 2 ? 'bg-[#7E70E3]' : 'bg-[#2F1CD9]'}
                            />
                        ))}
                        <div className="relative h-[58px] overflow-hidden rounded-[8px] bg-[#F1EEFB]">
                            <div className="flex h-full items-center px-7 text-sm font-extrabold text-white bg-[#CFC9F2]" style={{ width: `${Math.max(22, closedStage.rate)}%` }}>Deal Closed: {closedStage.value}</div>
                            <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-black text-[#211B31]">{closedStage.rate}% Final Conv.</span>
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
                                    {scheduledVisits.map((visit) => (
                                        <tr key={visit.id} className="align-top">
                                            <td className="px-6 py-5 text-sm font-medium">{visit.customerName}</td>
                                            <td className="px-6 py-5 text-sm">{visit.projectName}</td>
                                            <td className="whitespace-pre-line px-6 py-5 text-sm">{formatDateTime(visit.slotStart)}{visit.slotEnd ? ` - ${formatDateTime(visit.slotEnd)}` : ''}</td>
                                            <td className="px-6 py-5 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <span className="grid h-6 w-6 place-items-center rounded-full bg-[#E8E3FF] text-[10px] font-bold text-[#2512D9]">{visit.officerInitials}</span>
                                                    {visit.officerName}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5"><StatusPill tone={STATUS_TONE_BY_VALUE[String(visit.statusValue).toLowerCase()] || 'pending'}>{visit.status}</StatusPill></td>
                                        </tr>
                                    ))}
                                    {scheduledVisits.length === 0 && (
                                        <tr><td colSpan={5} className="px-6 py-8 text-center text-xs font-bold text-[#615C71]">No visits scheduled for today.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="h-12" />
                    </Panel>

                    <div className="grid gap-6">
                        <Panel className="p-6">
                            <div className="mb-4 flex items-center gap-3 text-[#C11111]">
                                <AlertTriangle size={20} />
                                <h2 className="text-sm font-black uppercase tracking-[0.12em]">Urgent Operational Alerts</h2>
                            </div>
                            <div className="space-y-4">
                                {operationalAlerts.map((alert) => (
                                    <div key={alert.key} className="border-l-4 border-[#C11111] bg-[#FFF4F4] p-4">
                                        <p className="font-black text-[#C11111]">{alert.title}</p>
                                        <p className="text-xs text-[#4B2630]">{alert.detail}</p>
                                    </div>
                                ))}
                                {operationalAlerts.length === 0 && (
                                    <p className="text-xs font-bold text-[#615C71]">No urgent alerts.</p>
                                )}
                            </div>
                        </Panel>

                        <Panel className="p-6">
                            <h2 className="mb-6 text-2xl font-bold">Live Activity Feed</h2>
                            <div className="space-y-5">
                                {liveActivity.slice(0, 4).map((item, index) => (
                                    <div key={item.id} className="grid grid-cols-[20px_1fr] gap-3">
                                        <div className="relative grid h-5 w-5 place-items-center rounded-full border border-[#BDB5FF]">
                                            <span className={`h-2 w-2 rounded-full ${index === 2 ? 'bg-[#8A2D13]' : 'bg-[#2512D9]'}`} />
                                            {index < 3 && <span className="absolute top-5 h-8 w-px bg-[#D8D3E6]" />}
                                        </div>
                                        <div>
                                            <p className="text-sm text-[#17121F]"><b>{item.action}</b> {item.detail}</p>
                                            <p className="text-xs text-[#17121F]">{formatRelativeTime(item.time)}</p>
                                        </div>
                                    </div>
                                ))}
                                {liveActivity.length === 0 && (
                                    <p className="text-xs font-bold text-[#615C71]">No recent activity.</p>
                                )}
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
                            {officerLeaderboards.salesOfficers.map((officer, index) => (
                                <OfficerBar key={officer.id} name={officer.name} initials={officer.initials} meta={`${officer.deals} Deals`} value={officer.deals} max={Math.max(1, ...officerLeaderboards.salesOfficers.map((o) => o.deals))} accent={index === 0 ? 'bg-[#15353D]' : 'bg-[#C28E7F]'} />
                            ))}
                            {officerLeaderboards.salesOfficers.length === 0 && (
                                <p className="text-xs font-bold text-[#615C71]">No sales officers found.</p>
                            )}
                        </div>
                    </Panel>

                    <Panel className="p-6">
                        <div className="mb-6 flex items-start justify-between">
                            <div><h2 className="text-2xl font-bold">Field Officers</h2><p className="text-xs">On-ground Visits &amp; Reports</p></div>
                            <CalendarDays className="text-[#24308F]" size={22} />
                        </div>
                        <div className="space-y-5">
                            {officerLeaderboards.fieldOfficers.map((officer, index) => (
                                <OfficerBar key={officer.id} name={officer.name} initials={officer.initials} meta={`${officer.visitsDone} Visits Done`} value={officer.visitsDone} max={Math.max(1, ...officerLeaderboards.fieldOfficers.map((o) => o.visitsDone))} color="#6B679E" accent={index === 0 ? 'bg-[#12313A]' : 'bg-[#6B3C51]'} />
                            ))}
                            {officerLeaderboards.fieldOfficers.length === 0 && (
                                <p className="text-xs font-bold text-[#615C71]">No field officers found.</p>
                            )}
                        </div>
                    </Panel>
                </div>
            </main>
        </div>
    );
};

export default SuperHome;
