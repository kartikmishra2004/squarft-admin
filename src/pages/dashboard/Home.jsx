import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
    ArrowRight,
    Bell,
    BriefcaseBusiness,
    Building2,
    Check,
    CircleUserRound,
    Download,
    LayoutDashboard,
    Search,
    ShieldAlert,
    TrendingUp,
    Upload,
    UsersRound,
    WalletCards,
} from 'lucide-react';
import {
    downloadAdminDashboardExport,
    dismissAdminDashboardActivity,
    fetchAdminDashboardActivityFeed,
    fetchAdminDashboardSummary,
} from '../../services/dashboardService';

const formatMoney = (amount) => {
    if (!amount) return '0';
    if (amount >= 10000000) return `${(amount / 10000000).toFixed(amount >= 100000000 ? 1 : 2)} Cr`;
    if (amount >= 100000) return `${(amount / 100000).toFixed(1)} L`;
    return amount.toLocaleString('en-IN');
};

const formatPercent = (value) => `${value > 0 ? '+' : ''}${value}%`;

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

const ACTIVITY_ICON_BY_TYPE = {
    broker_kyc: ShieldAlert,
    project_submission: Upload,
    payment_delay: WalletCards,
};

const ACTIVITY_TONE_BY_SEVERITY = {
    warning: { bg: 'bg-[#FFF1C9]', text: 'text-[#F59E0B]' },
    info: { bg: 'bg-[#DDEEFF]', text: 'text-[#2563EB]' },
    critical: { bg: 'bg-[#FFE2E2]', text: 'text-[#D71920]' },
};

const Panel = ({ children, className = '' }) => (
    <section className={`rounded-[12px] border border-[#C9C4E6] bg-white shadow-[0_1px_0_rgba(33,24,88,0.03)] ${className}`}>
        {children}
    </section>
);

const TopHeader = ({ user }) => (
    <header className="sticky top-0 z-10 border-b border-[#D6D1EA] bg-[#FAFAFF]/95 px-4 py-4 backdrop-blur sm:px-8">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <label className="flex h-12 min-w-0 flex-1 items-center gap-4 rounded-full border border-[#BFB9DD] bg-[#F7F5FF] px-5 text-[#171327] xl:max-w-[690px]">
                <Search size={22} />
                <input
                    className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-[#696277]"
                    placeholder="Search across properties, leads, or agents..."
                />
            </label>
            <div className="flex items-center justify-between gap-4 xl:justify-end">
                <button className="relative grid h-10 w-10 place-items-center rounded-full hover:bg-[#F0ECFA]" aria-label="Notifications">
                    <Bell size={20} />
                    <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#C40018]" />
                </button>
                <button className="grid h-10 w-10 place-items-center rounded-full hover:bg-[#F0ECFA]" aria-label="Account">
                    <CircleUserRound size={22} />
                </button>
                <div className="hidden h-10 w-px bg-[#BFB9DD] sm:block" />
                <div className="flex items-center gap-3">
                    <div className="text-right">
                        <p className="text-sm font-black text-[#171327]">{user?.name || 'Admin'}</p>
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#605A70]">Admin</p>
                    </div>
                    <div className="grid h-12 w-12 place-items-center rounded-full bg-[#DCE9F4] text-sm font-black text-[#173141] ring-4 ring-[#EDEAF8]">
                        {(user?.name || 'Admin').split(' ').map((part) => part[0]).slice(0, 2).join('')}
                    </div>
                </div>
            </div>
        </div>
    </header>
);

const MetricPanel = ({ title, icon: Icon, children, className = '' }) => (
    <Panel className={`p-7 ${className}`}>
        <div className="mb-7 flex items-center justify-between">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#888390]">{title}</p>
            <div className="grid h-11 w-11 place-items-center rounded-[10px] bg-[#F0EDFF] text-[#2717D7]">
                <Icon size={22} />
            </div>
        </div>
        {children}
    </Panel>
);

const ProgressLine = ({ color, width, label, value }) => (
    <div>
        <div className="mb-2 flex items-center justify-between text-xs font-black uppercase tracking-[0.08em]">
            <span>{label}</span>
            {value && <span className="tracking-normal">{value}</span>}
        </div>
        <div className="h-7 overflow-hidden rounded-[8px] bg-[#EDEAF8]">
            <div className={`h-full rounded-[8px] ${color}`} style={{ width }} />
        </div>
    </div>
);

const ActivityItem = ({ icon: Icon, tone, title, detail, action, time, onAction, onDismiss, dismissLoading }) => (
    <div className="grid grid-cols-[48px_1fr_auto] gap-5 border-t border-[#DAD6E9] px-7 py-7">
        <div className={`grid h-12 w-12 place-items-center rounded-full ${tone.bg} ${tone.text}`}>
            <Icon size={22} />
        </div>
        <div>
            <p className="text-lg font-black text-[#15121F]">{title}</p>
            <p className="mt-1 max-w-[720px] text-sm leading-6 text-[#2B2637]">{detail}</p>
            <div className="mt-4 flex flex-wrap gap-4">
                {action && (
                    <button onClick={onAction} className="h-8 rounded-[8px] border border-[#C7C1E5] px-5 text-xs font-black text-[#2110CF]">{action}</button>
                )}
                <button
                    type="button"
                    onClick={onDismiss}
                    disabled={dismissLoading}
                    className="h-8 px-3 text-xs font-bold text-[#201B2A] disabled:opacity-50"
                >
                    {dismissLoading ? 'Dismissing...' : 'Dismiss'}
                </button>
            </div>
        </div>
        <p className="hidden text-xs font-medium text-[#2A2535] sm:block">{time}</p>
    </div>
);

const Donut = ({ approved, review, rejected, draft }) => {
    const total = approved + review + rejected + draft || 1;
    const approvedDeg = (approved / total) * 360;
    const reviewDeg = approvedDeg + (review / total) * 360;
    const rejectedDeg = reviewDeg + (rejected / total) * 360;

    return (
        <div className="mx-auto grid h-56 w-56 place-items-center rounded-full bg-[#F0EDFA]">
            <div
                className="grid h-48 w-48 place-items-center rounded-full"
                style={{
                    background: `conic-gradient(#2E1DDC 0deg ${approvedDeg}deg, #F59E0B ${approvedDeg}deg ${reviewDeg}deg, #D71920 ${reviewDeg}deg ${rejectedDeg}deg, #C9C4D8 ${rejectedDeg}deg 360deg)`,
                }}
            >
                <div className="grid h-36 w-36 place-items-center rounded-full bg-white text-center">
                    <div>
                        <p className="text-4xl font-black">{total}</p>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#7B7486]">Total</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const REVENUE_RANGES = ['1M', '6M', '1Y'];

const Home = () => {
    const { user } = useSelector((state) => state.auth);
    const [selectedRevenueRange, setSelectedRevenueRange] = useState('6M');
    const [activityFilter, setActivityFilter] = useState('all');
    const [summary, setSummary] = useState(null);
    const [activityFeed, setActivityFeed] = useState({ items: [] });
    const [pageLoading, setPageLoading] = useState(true);
    const [pageError, setPageError] = useState('');
    const [dismissingId, setDismissingId] = useState(null);
    const [exporting, setExporting] = useState(false);

    const loadSummary = useCallback(async (range) => {
        try {
            const data = await fetchAdminDashboardSummary({ range });
            setSummary(data);
        } catch (error) {
            console.error('Failed to load admin dashboard summary:', error);
            setPageError(error?.message || 'Failed to load dashboard summary.');
        }
    }, []);

    const loadActivityFeed = useCallback(async (type) => {
        try {
            const data = await fetchAdminDashboardActivityFeed({ type });
            setActivityFeed(data);
        } catch (error) {
            console.error('Failed to load admin dashboard activity feed:', error);
            setPageError(error?.message || 'Failed to load activity feed.');
        }
    }, []);

    useEffect(() => {
        let active = true;

        const loadDashboard = async () => {
            setPageLoading(true);
            setPageError('');

            try {
                const [summaryData, activityData] = await Promise.all([
                    fetchAdminDashboardSummary({ range: selectedRevenueRange }),
                    fetchAdminDashboardActivityFeed({ type: activityFilter }),
                ]);

                if (!active) return;
                setSummary(summaryData);
                setActivityFeed(activityData);
            } catch (error) {
                console.error('Failed to load admin dashboard:', error);
                if (active) setPageError(error?.message || 'Failed to load dashboard data.');
            } finally {
                if (active) setPageLoading(false);
            }
        };

        loadDashboard();

        return () => { active = false; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleRevenueRangeChange = (range) => {
        setSelectedRevenueRange(range);
        loadSummary(range);
    };

    const handleActivityFilterChange = (type) => {
        setActivityFilter(type);
        loadActivityFeed(type);
    };

    const handleDismissActivity = async (activityId) => {
        setDismissingId(activityId);
        try {
            await dismissAdminDashboardActivity(activityId);
            setActivityFeed((current) => ({
                ...current,
                items: current.items.filter((item) => item.id !== activityId),
                total: Math.max(0, (current.total || current.items.length) - 1),
            }));
        } catch (error) {
            console.error('Failed to dismiss activity:', error);
            setPageError(error?.message || 'Failed to dismiss activity.');
        } finally {
            setDismissingId(null);
        }
    };

    const handleExport = async () => {
        setExporting(true);
        setPageError('');
        try {
            await downloadAdminDashboardExport({ range: selectedRevenueRange, format: 'csv' });
        } catch (error) {
            console.error('Failed to export dashboard report:', error);
            setPageError(error?.message || 'Failed to export dashboard report.');
        } finally {
            setExporting(false);
        }
    };

    const overviewDate = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date());

    if (pageLoading && !summary) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#FAFBFF]">
                <p className="text-sm font-bold text-[#615C71]">Loading dashboard...</p>
            </div>
        );
    }

    const humanCapital = summary?.humanCapital || { total: 0, brokers: 0, salesOfficers: 0, fieldOfficers: 0, growthPercent: 0 };
    const projects = summary?.projects || { total: 0, verified: 0, pending: 0, rejected: 0, draft: 0 };
    const propertyUnits = summary?.propertyUnits || { total: 0, percentages: { live: 0, draft: 0, review: 0 } };
    const deals = summary?.deals || { inProgress: { count: 0, value: 0 }, closedMom: { units: 0, growthPercent: 0 }, financials: { commissionPayable: 0 } };
    const revenueSnapshot = summary?.revenueSnapshot || { revenue: 0, deals: 0 };
    const leadConversion = summary?.leadToVisitConversion || { newLeads: 0, contacted: 0, siteVisits: 0, closed: 0, rates: { contacted: 0, siteVisits: 0, closed: 0 } };
    const approvalStatus = summary?.projectApprovalStatus || { approved: 0, review: 0, rejected: 0, draft: 0 };
    const salesVelocity = summary?.salesVelocity || { series: [], projectedQ3GrowthPercent: 0 };
    const maxVelocityValue = Math.max(1, ...salesVelocity.series.map((item) => item.value));

    return (
        <div className="min-h-screen bg-[#FAFBFF] text-[#15121F]">
            <TopHeader user={user} />

            <main className="mx-auto max-w-[1500px] px-4 py-10 sm:px-8">
                <div className="mb-9 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h1 className="text-[34px] font-black leading-none tracking-normal md:text-[40px]">Operational Overview</h1>
                        <p className="mt-2 text-base text-[#23202F]">Live metrics for Squar FT Ecosystem • {overviewDate}</p>
                    </div>
                    <div className="flex flex-wrap gap-5">
                        <button
                            type="button"
                            onClick={handleExport}
                            disabled={exporting}
                            className="flex h-16 items-center gap-3 rounded-[12px] border border-[#C9C4E6] bg-white px-8 text-sm font-black disabled:opacity-50"
                        >
                            <Download size={17} /> {exporting ? 'Exporting...' : 'Export Report'}
                        </button>
                    </div>
                </div>

                {pageError && (
                    <div className="mb-6 rounded-[10px] border border-[#F5C2C2] bg-[#FFF4F4] px-4 py-3 text-xs font-bold text-[#B42318]">
                        {pageError}
                    </div>
                )}

                <div className="grid gap-7 xl:grid-cols-[1.08fr_1.08fr_1.08fr]">
                    <MetricPanel title="Human Capital" icon={UsersRound} className="min-h-[420px]">
                        <div className="mt-12 flex items-end gap-4">
                            <p className="text-6xl font-black leading-none">{humanCapital.total}</p>
                            <div className="pb-2">
                                <p className="text-3xl font-bold">{humanCapital.brokers}</p>
                                <p className="text-sm text-[#353040]">Brokers</p>
                            </div>
                        </div>
                        <p className="mt-3 text-base text-[#353040]">Total Users</p>
                        <p className="mt-2 text-xs font-black text-[#059447]">{humanCapital.growthPercent >= 0 ? '↗' : '↘'} {formatPercent(humanCapital.growthPercent)}</p>
                        <div className="mt-16 grid grid-cols-2 gap-8">
                            <div><p className="text-3xl font-black">{humanCapital.salesOfficers}</p><p className="text-sm">Sales Officers</p></div>
                            <div><p className="text-3xl font-black">{humanCapital.fieldOfficers}</p><p className="text-sm">Field Officers</p></div>
                        </div>
                    </MetricPanel>

                    <div className="grid gap-5">
                        <MetricPanel title="Projects" icon={Building2}>
                            <p className="text-4xl font-black">{projects.total}</p>
                            <div className="mt-6 grid grid-cols-2 gap-4">
                                <div className="rounded-[10px] bg-[#EBFAF0] p-4 text-xs text-[#04622E]"><b className="block text-sm">{projects.verified}</b>Verified</div>
                                <div className="rounded-[10px] bg-[#FFF8E6] p-4 text-xs text-[#AE3B00]"><b className="block text-sm">{projects.pending}</b>Pending</div>
                            </div>
                        </MetricPanel>
                        <MetricPanel title="Property Units" icon={BriefcaseBusiness}>
                            <p className="text-4xl font-black">{propertyUnits.total.toLocaleString('en-IN')}</p>
                            <div className="mt-7 flex h-2 overflow-hidden rounded-full bg-[#C9C4D8]">
                                <div className="bg-[#22C55E]" style={{ width: `${propertyUnits.percentages.live}%` }} />
                                <div className="bg-[#F59E0B]" style={{ width: `${propertyUnits.percentages.draft}%` }} />
                                <div className="bg-[#B9B3CC]" style={{ width: `${propertyUnits.percentages.review}%` }} />
                            </div>
                            <div className="mt-3 flex justify-between text-[10px] font-black uppercase">
                                <span>Live ({propertyUnits.percentages.live}%)</span>
                                <span>Draft ({propertyUnits.percentages.draft}%)</span>
                                <span>Review ({propertyUnits.percentages.review}%)</span>
                            </div>
                        </MetricPanel>
                    </div>

                    <div className="grid gap-5">
                        <Panel className="min-h-[240px] bg-[#4B3BF1] p-7 text-white shadow-[0_12px_24px_rgba(75,59,241,0.18)]">
                            <div className="mb-12 flex items-center justify-between">
                                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#DCD8FF]">Deals In Progress</p>
                                <LayoutDashboard size={22} />
                            </div>
                            <p className="text-6xl font-black leading-none">₹{formatMoney(deals.inProgress.value)}</p>
                            <div className="mt-10 flex items-center gap-5">
                                <div className="h-1 flex-1 rounded-full bg-white/25"><div className="h-full w-[64%] rounded-full bg-white" /></div>
                                <p className="text-xs font-black">{deals.inProgress.count} Deals</p>
                            </div>
                        </Panel>
                        <Panel className="flex min-h-[160px] items-center gap-7 p-7">
                            <div className="grid h-14 w-14 place-items-center rounded-full bg-[#DDFBE7] text-[#038743]">
                                <Check size={24} />
                            </div>
                            <div>
                                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#888390]">Closed Deals (MoM)</p>
                                <p className="text-3xl font-black">{deals.closedMom.units} Units</p>
                                <p className="text-xs font-black text-[#059447]">{formatPercent(deals.closedMom.growthPercent)} vs last month</p>
                            </div>
                        </Panel>
                    </div>
                </div>

                <div className="mt-9 grid gap-7 xl:grid-cols-[2fr_0.96fr]">
                    <Panel className="overflow-hidden">
                        <div className="flex items-center justify-between p-7">
                            <h2 className="text-2xl font-black">Operational Activity Feed</h2>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => handleActivityFilterChange('all')}
                                    className={`rounded-full px-5 py-2 text-[11px] font-black uppercase ${activityFilter === 'all' ? 'bg-[#F0EDFF] text-[#2110CF]' : 'text-[#615C71]'}`}
                                >
                                    All Activities
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleActivityFilterChange('alerts')}
                                    className={`rounded-full px-5 py-2 text-[11px] font-black uppercase ${activityFilter === 'alerts' ? 'bg-[#F0EDFF] text-[#2110CF]' : 'text-[#615C71]'}`}
                                >
                                    Alerts Only
                                </button>
                            </div>
                        </div>
                        {activityFeed.items.length === 0 ? (
                            <p className="border-t border-[#DAD6E9] px-7 py-10 text-center text-sm font-bold text-[#615C71]">No activity to show.</p>
                        ) : (
                            activityFeed.items.map((item) => (
                                <ActivityItem
                                    key={item.id}
                                    icon={ACTIVITY_ICON_BY_TYPE[item.type] || Bell}
                                    tone={ACTIVITY_TONE_BY_SEVERITY[item.severity] || ACTIVITY_TONE_BY_SEVERITY.info}
                                    title={item.title}
                                    detail={item.detail}
                                    action={item.primaryAction}
                                    time={formatRelativeTime(item.createdAt)}
                                    dismissLoading={dismissingId === item.id}
                                    onDismiss={() => handleDismissActivity(item.id)}
                                />
                            ))
                        )}
                    </Panel>

                    <div className="grid gap-7">
                        <Panel className="p-7">
                            <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <h2 className="text-2xl font-black">Revenue Snapshot</h2>
                                <div className="flex flex-wrap gap-2">
                                    {REVENUE_RANGES.map((range) => (
                                        <button
                                            key={range}
                                            type="button"
                                            onClick={() => handleRevenueRangeChange(range)}
                                            className={`rounded-full px-3 py-2 text-[11px] font-black uppercase ${selectedRevenueRange === range ? 'bg-[#2E1DDC] text-white' : 'bg-[#F0F0FF] text-[#4A4789]'}`}
                                        >
                                            {range}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="rounded-[20px] border border-[#E8E5F3] bg-[#FBFBFF] p-5">
                                    <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#8E89A3]">Revenue</p>
                                    <p className="mt-3 text-4xl font-black">₹{formatMoney(revenueSnapshot.revenue)}</p>
                                    <p className="mt-2 text-xs text-[#6E6B85]">Total value over {selectedRevenueRange}</p>
                                </div>
                                <div className="rounded-[20px] border border-[#E8E5F3] bg-[#FBFBFF] p-5">
                                    <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#8E89A3]">Deals</p>
                                    <p className="mt-3 text-4xl font-black">{revenueSnapshot.deals}</p>
                                    <p className="mt-2 text-xs text-[#6E6B85]">Deals counted in selected range</p>
                                </div>
                            </div>
                        </Panel>
                        <Panel className="min-h-[220px] bg-[#FFD8CA] p-7">
                            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#563024]">Financials</p>
                            <div className="mt-5 flex items-center justify-between">
                                <div>
                                    <p className="text-2xl font-black leading-tight">Commission<br />Payable</p>
                                    <p className="mt-5 text-6xl font-black text-[#4B1609]">₹{formatMoney(deals.financials.commissionPayable)}</p>
                                </div>
                                <button className="grid h-14 w-14 place-items-center rounded-full bg-white text-[#AB3317] shadow-lg" aria-label="Open financials">
                                    <ArrowRight size={25} />
                                </button>
                            </div>
                        </Panel>
                    </div>
                </div>

                <div className="mt-9 grid gap-7 xl:grid-cols-3">
                    <Panel className="p-7">
                        <h2 className="mb-9 text-2xl font-black">Lead to Visit Conversion</h2>
                        <div className="space-y-7">
                            <ProgressLine color="bg-[#2E1DDC]" width="100%" label={`New Leads (${leadConversion.newLeads.toLocaleString('en-IN')})`} />
                            <ProgressLine color="bg-[#655D98]" width={`${Math.max(10, leadConversion.rates.contacted)}%`} label={`Contacted (${leadConversion.contacted.toLocaleString('en-IN')})`} value={`${leadConversion.rates.contacted}%`} />
                            <ProgressLine color="bg-[#F59E0B]" width={`${Math.max(10, leadConversion.rates.siteVisits)}%`} label={`Site Visits (${leadConversion.siteVisits.toLocaleString('en-IN')})`} value={`${leadConversion.rates.siteVisits}%`} />
                            <ProgressLine color="bg-[#22C55E]" width={`${Math.max(10, leadConversion.rates.closed)}%`} label={`Closed (${leadConversion.closed})`} value={`${leadConversion.rates.closed}%`} />
                        </div>
                    </Panel>

                    <Panel className="p-7">
                        <h2 className="mb-8 text-2xl font-black">Project Approval Status</h2>
                        <Donut approved={approvalStatus.approved} review={approvalStatus.review} rejected={approvalStatus.rejected} draft={approvalStatus.draft} />
                        <div className="mt-7 grid grid-cols-2 gap-5 text-sm font-black">
                            <p><span className="mr-3 inline-block h-3 w-3 rounded-full bg-[#2E1DDC]" />Approved ({approvalStatus.approved})</p>
                            <p><span className="mr-3 inline-block h-3 w-3 rounded-full bg-[#F59E0B]" />Review ({approvalStatus.review})</p>
                            <p><span className="mr-3 inline-block h-3 w-3 rounded-full bg-[#D71920]" />Rejected ({approvalStatus.rejected})</p>
                            <p><span className="mr-3 inline-block h-3 w-3 rounded-full bg-[#C9C4D8]" />Draft ({approvalStatus.draft})</p>
                        </div>
                    </Panel>

                    <Panel className="p-7">
                        <div className="mb-9 flex items-center justify-between">
                            <h2 className="text-2xl font-black">Sales Velocity</h2>
                            <span className="rounded-full bg-[#F0EDFA] px-5 py-2 text-xs font-black">Monthly</span>
                        </div>
                        <div className="flex h-56 items-end gap-4 border-b border-[#DAD6E9] px-4">
                            {salesVelocity.series.map((item, index) => (
                                <div key={`${item.month}-${index}`} className="flex flex-1 flex-col items-center gap-3">
                                    <div
                                        className={`w-full rounded-t-[8px] ${index === salesVelocity.series.length - 1 ? 'bg-[#2E1DDC]' : index % 2 ? 'bg-[#9E98EF]' : 'bg-[#CDC9F6]'}`}
                                        style={{ height: `${Math.max(4, Math.round((item.value / maxVelocityValue) * 100))}%` }}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 grid grid-cols-6 px-4 text-center text-[10px] font-black uppercase">
                            {salesVelocity.series.map((item, index) => <span key={`${item.month}-label-${index}`}>{item.month}</span>)}
                        </div>
                        <div className="mt-10 flex items-center justify-between rounded-[12px] bg-[#F3EEFF] p-5">
                            <div className="grid h-11 w-11 place-items-center rounded-[8px] bg-[#DDFBE7] text-[#059447]">
                                <TrendingUp size={20} />
                            </div>
                            <p className="text-base font-black">Projected Q3<br />Growth</p>
                            <p className="text-2xl font-black text-[#059447]">{formatPercent(salesVelocity.projectedQ3GrowthPercent)}</p>
                        </div>
                    </Panel>
                </div>
            </main>
        </div>
    );
};

export default Home;
