import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
    ArrowRight,
    Bell,
    BriefcaseBusiness,
    Building2,
    Check,
    CircleUserRound,
    Download,
    FileCheck2,
    Filter,
    LayoutDashboard,
    ListChecks,
    Plus,
    Search,
    ShieldAlert,
    TrendingUp,
    Upload,
    UserRoundPlus,
    UsersRound,
    WalletCards,
} from 'lucide-react';

const formatMoney = (amount) => {
    if (!amount) return '0';
    if (amount >= 10000000) return `${(amount / 10000000).toFixed(amount >= 100000000 ? 1 : 2)} Cr`;
    if (amount >= 100000) return `${(amount / 100000).toFixed(1)} L`;
    return amount.toLocaleString('en-IN');
};

const percent = (part, total) => (total ? Math.round((part / total) * 100) : 0);

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
                        <p className="text-sm font-black text-[#171327]">{user?.name || 'Alex Rivera'}</p>
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#605A70]">Admin</p>
                    </div>
                    <div className="grid h-12 w-12 place-items-center rounded-full bg-[#DCE9F4] text-sm font-black text-[#173141] ring-4 ring-[#EDEAF8]">
                        {(user?.name || 'Alex Rivera').split(' ').map((part) => part[0]).slice(0, 2).join('')}
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

const ActivityItem = ({ icon: Icon, tone, title, detail, action, time }) => (
    <div className="grid grid-cols-[48px_1fr_auto] gap-5 border-t border-[#DAD6E9] px-7 py-7">
        <div className={`grid h-12 w-12 place-items-center rounded-full ${tone.bg} ${tone.text}`}>
            <Icon size={22} />
        </div>
        <div>
            <p className="text-lg font-black text-[#15121F]">{title}</p>
            <p className="mt-1 max-w-[720px] text-sm leading-6 text-[#2B2637]">{detail}</p>
            {action && (
                <div className="mt-4 flex flex-wrap gap-4">
                    <button className="h-8 rounded-[8px] border border-[#C7C1E5] px-5 text-xs font-black text-[#2110CF]">{action}</button>
                    <button className="h-8 px-3 text-xs font-bold text-[#201B2A]">Dismiss</button>
                </div>
            )}
        </div>
        <p className="hidden text-xs font-medium text-[#2A2535] sm:block">{time}</p>
    </div>
);

const QuickAction = ({ icon: Icon, label }) => (
    <button className="grid min-h-[148px] place-items-center rounded-[12px] border border-[#C9C4E6] bg-white p-5 text-center transition hover:border-[#2E1DDC] hover:shadow-[0_8px_28px_rgba(46,29,220,0.10)]">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-[#F2EEF9] text-[#15121F]">
            <Icon size={23} />
        </span>
        <span className="mt-4 max-w-24 text-sm font-black leading-5 text-[#15121F]">{label}</span>
    </button>
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

const Home = () => {
    const { user } = useSelector((state) => state.auth);
    const users = useSelector((state) => state.users.users);
    const projects = useSelector((state) => state.inventory.projects);
    const leads = useSelector((state) => state.leads.leads);
    const clients = useSelector((state) => state.clients.clients);
    const visits = useSelector((state) => state.visits.visits);
    const deals = useSelector((state) => state.deals.deals);

    const metrics = useMemo(() => {
        const brokers = users.filter((item) => item.type === 'Broker').length;
        const salesOfficers = users.filter((item) => item.type === 'Sales_officer').length;
        const fieldOfficers = users.filter((item) => item.type === 'Field_officer').length;
        const verifiedProjects = projects.filter((item) => item.status === 'Active' || item.status === 'Approved').length;
        const pendingProjects = projects.filter((item) => item.status === 'Pending' || item.status === 'In Review').length;
        const totalUnits = projects.reduce((sum, project) => sum + (project.units || 0), 0);
        const liveUnits = projects.reduce((sum, project) => sum + ((project.units || 0) - (project.available || 0)), 0);
        const draftUnits = Math.round(totalUnits * 0.2);
        const reviewUnits = Math.max(0, totalUnits - liveUnits - draftUnits);
        const inProgressDeals = deals.filter((deal) => deal.status !== 'DEAL COMPLETED');
        const inProgressValue = inProgressDeals.reduce((sum, deal) => sum + (deal.negotiationPrice || deal.expectPrice || 0), 0);
        const closedDeals = deals.filter((deal) => deal.status === 'DEAL COMPLETED');
        const closedUnits = closedDeals.length;
        const payable = deals.reduce((sum, deal) => sum + (deal.remainingBalance || 0), 0);
        const contacted = clients.length + leads.filter((lead) => lead.status !== 'New').length;
        const siteVisits = visits.filter((visit) => visit.status !== 'Cancelled').length;

        return {
            brokers,
            salesOfficers,
            fieldOfficers,
            verifiedProjects,
            pendingProjects,
            totalUnits,
            liveUnits,
            draftUnits,
            reviewUnits,
            inProgressDeals,
            inProgressValue,
            closedUnits,
            payable,
            contacted,
            siteVisits,
            leadTotal: leads.length + clients.length,
        };
    }, [clients, deals, leads, projects, users, visits]);

    const approved = metrics.verifiedProjects;
    const review = metrics.pendingProjects;
    const rejected = projects.filter((project) => project.status === 'Rejected').length || Math.max(1, Math.round(projects.length * 0.05));
    const draft = Math.max(1, projects.length - approved - review);
    const velocity = [38, 58, 51, 82, 66, 45];
    const overviewDate = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date());

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
                        <button className="flex h-16 items-center gap-3 rounded-[12px] border border-[#C9C4E6] bg-white px-8 text-sm font-black">
                            <Filter size={17} /> Filter View
                        </button>
                        <button className="flex h-16 items-center gap-3 rounded-[12px] border border-[#C9C4E6] bg-white px-8 text-sm font-black">
                            <Download size={17} /> Export Report
                        </button>
                    </div>
                </div>

                <div className="grid gap-7 xl:grid-cols-[1.08fr_1.08fr_1.08fr]">
                    <MetricPanel title="Human Capital" icon={UsersRound} className="min-h-[420px]">
                        <div className="mt-12 flex items-end gap-4">
                            <p className="text-6xl font-black leading-none">{users.length}</p>
                            <div className="pb-2">
                                <p className="text-3xl font-bold">{metrics.brokers}</p>
                                <p className="text-sm text-[#353040]">Brokers</p>
                            </div>
                        </div>
                        <p className="mt-3 text-base text-[#353040]">Total Users</p>
                        <p className="mt-2 text-xs font-black text-[#059447]">↗ +12%</p>
                        <div className="mt-16 grid grid-cols-2 gap-8">
                            <div><p className="text-3xl font-black">{metrics.salesOfficers}</p><p className="text-sm">Sales Officers</p></div>
                            <div><p className="text-3xl font-black">{metrics.fieldOfficers}</p><p className="text-sm">Field Officers</p></div>
                        </div>
                    </MetricPanel>

                    <div className="grid gap-5">
                        <MetricPanel title="Projects" icon={Building2}>
                            <p className="text-4xl font-black">{projects.length}</p>
                            <div className="mt-6 grid grid-cols-2 gap-4">
                                <div className="rounded-[10px] bg-[#EBFAF0] p-4 text-xs text-[#04622E]"><b className="block text-sm">{metrics.verifiedProjects}</b>Verified</div>
                                <div className="rounded-[10px] bg-[#FFF8E6] p-4 text-xs text-[#AE3B00]"><b className="block text-sm">{metrics.pendingProjects}</b>Pending</div>
                            </div>
                        </MetricPanel>
                        <MetricPanel title="Property Units" icon={BriefcaseBusiness}>
                            <p className="text-4xl font-black">{metrics.totalUnits.toLocaleString('en-IN')}</p>
                            <div className="mt-7 flex h-2 overflow-hidden rounded-full bg-[#C9C4D8]">
                                <div className="bg-[#22C55E]" style={{ width: `${percent(metrics.liveUnits, metrics.totalUnits)}%` }} />
                                <div className="bg-[#F59E0B]" style={{ width: `${percent(metrics.draftUnits, metrics.totalUnits)}%` }} />
                                <div className="bg-[#B9B3CC]" style={{ width: `${percent(metrics.reviewUnits, metrics.totalUnits)}%` }} />
                            </div>
                            <div className="mt-3 flex justify-between text-[10px] font-black uppercase">
                                <span>Live ({percent(metrics.liveUnits, metrics.totalUnits)}%)</span>
                                <span>Draft ({percent(metrics.draftUnits, metrics.totalUnits)}%)</span>
                                <span>Review ({percent(metrics.reviewUnits, metrics.totalUnits)}%)</span>
                            </div>
                        </MetricPanel>
                    </div>

                    <div className="grid gap-5">
                        <Panel className="min-h-[240px] bg-[#4B3BF1] p-7 text-white shadow-[0_12px_24px_rgba(75,59,241,0.18)]">
                            <div className="mb-12 flex items-center justify-between">
                                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#DCD8FF]">Deals In Progress</p>
                                <LayoutDashboard size={22} />
                            </div>
                            <p className="text-6xl font-black leading-none">₹{formatMoney(metrics.inProgressValue)}</p>
                            <div className="mt-10 flex items-center gap-5">
                                <div className="h-1 flex-1 rounded-full bg-white/25"><div className="h-full w-[64%] rounded-full bg-white" /></div>
                                <p className="text-xs font-black">{metrics.inProgressDeals.length} Deals</p>
                            </div>
                        </Panel>
                        <Panel className="flex min-h-[160px] items-center gap-7 p-7">
                            <div className="grid h-14 w-14 place-items-center rounded-full bg-[#DDFBE7] text-[#038743]">
                                <Check size={24} />
                            </div>
                            <div>
                                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#888390]">Closed Deals (MoM)</p>
                                <p className="text-3xl font-black">{metrics.closedUnits} Units</p>
                                <p className="text-xs font-black text-[#059447]">+8.4% vs last month</p>
                            </div>
                        </Panel>
                    </div>
                </div>

                <div className="mt-9 grid gap-7 xl:grid-cols-[2fr_0.96fr]">
                    <Panel className="overflow-hidden">
                        <div className="flex items-center justify-between p-7">
                            <h2 className="text-2xl font-black">Operational Activity Feed</h2>
                            <div className="flex gap-3">
                                <button className="rounded-full bg-[#F0EDFF] px-5 py-2 text-[11px] font-black uppercase text-[#2110CF]">All Activities</button>
                                <button className="rounded-full bg-[#F0EDFF] px-5 py-2 text-[11px] font-black uppercase">Alerts Only</button>
                            </div>
                        </div>
                        <ActivityItem
                            icon={ShieldAlert}
                            tone={{ bg: 'bg-[#FFF1C9]', text: 'text-[#F59E0B]' }}
                            title={`KYC Request: ${users.find((item) => item.docStatus === 'Pending')?.name || 'Green Valley Realty'}`}
                            detail="Pending verification for broker license BR-9921-X. All documents uploaded."
                            action="Review KYC"
                            time="2 mins ago"
                        />
                        <ActivityItem
                            icon={Upload}
                            tone={{ bg: 'bg-[#DDEEFF]', text: 'text-[#2563EB]' }}
                            title={`New Project Submission: ${projects.find((item) => item.status === 'Pending' || item.status === 'In Review')?.name || 'Azure Heights'}`}
                            detail={`Submitted by Sr. Field Officer. ${metrics.totalUnits.toLocaleString('en-IN')} units currently tracked in inventory.`}
                            action="Approve Project"
                            time="45 mins ago"
                        />
                        <ActivityItem
                            icon={WalletCards}
                            tone={{ bg: 'bg-[#FFE2E2]', text: 'text-[#D71920]' }}
                            title={`Payment Delay: Transaction #${deals.find((deal) => deal.remainingBalance > 0)?.dealCode || 'TR-882'}`}
                            detail="Commission payout failed due to bank verification error."
                            time="2 hours ago"
                        />
                    </Panel>

                    <div className="grid gap-7">
                        <div className="grid grid-cols-2 gap-7">
                            <QuickAction icon={Plus} label="Upload Project" />
                            <QuickAction icon={ListChecks} label="Approve Project" />
                            <QuickAction icon={UserRoundPlus} label="Assign Lead" />
                            <QuickAction icon={FileCheck2} label="Create Task" />
                        </div>
                        <Panel className="min-h-[220px] bg-[#FFD8CA] p-7">
                            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#563024]">Financials</p>
                            <div className="mt-5 flex items-center justify-between">
                                <div>
                                    <p className="text-2xl font-black leading-tight">Commission<br />Payable</p>
                                    <p className="mt-5 text-6xl font-black text-[#4B1609]">₹{formatMoney(metrics.payable)}</p>
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
                            <ProgressLine color="bg-[#2E1DDC]" width="100%" label={`New Leads (${metrics.leadTotal.toLocaleString('en-IN')})`} />
                            <ProgressLine color="bg-[#655D98]" width={`${Math.max(10, percent(metrics.contacted, metrics.leadTotal))}%`} label={`Contacted (${metrics.contacted.toLocaleString('en-IN')})`} value={`${percent(metrics.contacted, metrics.leadTotal)}%`} />
                            <ProgressLine color="bg-[#F59E0B]" width={`${Math.max(10, percent(metrics.siteVisits, metrics.leadTotal))}%`} label={`Site Visits (${metrics.siteVisits.toLocaleString('en-IN')})`} value={`${percent(metrics.siteVisits, metrics.leadTotal)}%`} />
                            <ProgressLine color="bg-[#22C55E]" width={`${Math.max(10, percent(metrics.closedUnits, metrics.leadTotal))}%`} label={`Closed (${metrics.closedUnits})`} value={`${percent(metrics.closedUnits, metrics.leadTotal)}%`} />
                        </div>
                    </Panel>

                    <Panel className="p-7">
                        <h2 className="mb-8 text-2xl font-black">Project Approval Status</h2>
                        <Donut approved={approved} review={review} rejected={rejected} draft={draft} />
                        <div className="mt-7 grid grid-cols-2 gap-5 text-sm font-black">
                            <p><span className="mr-3 inline-block h-3 w-3 rounded-full bg-[#2E1DDC]" />Approved ({approved})</p>
                            <p><span className="mr-3 inline-block h-3 w-3 rounded-full bg-[#F59E0B]" />Review ({review})</p>
                            <p><span className="mr-3 inline-block h-3 w-3 rounded-full bg-[#D71920]" />Rejected ({rejected})</p>
                            <p><span className="mr-3 inline-block h-3 w-3 rounded-full bg-[#C9C4D8]" />Draft ({draft})</p>
                        </div>
                    </Panel>

                    <Panel className="p-7">
                        <div className="mb-9 flex items-center justify-between">
                            <h2 className="text-2xl font-black">Sales Velocity</h2>
                            <span className="rounded-full bg-[#F0EDFA] px-5 py-2 text-xs font-black">Monthly</span>
                        </div>
                        <div className="flex h-56 items-end gap-4 border-b border-[#DAD6E9] px-4">
                            {velocity.map((value, index) => (
                                <div key={value + index} className="flex flex-1 flex-col items-center gap-3">
                                    <div
                                        className={`w-full rounded-t-[8px] ${index === 3 ? 'bg-[#2E1DDC]' : index % 2 ? 'bg-[#9E98EF]' : 'bg-[#CDC9F6]'}`}
                                        style={{ height: `${value}%` }}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 grid grid-cols-6 px-4 text-center text-[10px] font-black uppercase">
                            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month) => <span key={month}>{month}</span>)}
                        </div>
                        <div className="mt-10 flex items-center justify-between rounded-[12px] bg-[#F3EEFF] p-5">
                            <div className="grid h-11 w-11 place-items-center rounded-[8px] bg-[#DDFBE7] text-[#059447]">
                                <TrendingUp size={20} />
                            </div>
                            <p className="text-base font-black">Projected Q3<br />Growth</p>
                            <p className="text-2xl font-black text-[#059447]">+18%</p>
                        </div>
                    </Panel>
                </div>
            </main>
        </div>
    );
};

export default Home;
