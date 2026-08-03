// Shared building blocks for the admin Home dashboard and the super_admin SuperHome dashboard.
// Home and SuperHome are intentionally different layouts (different KPIs, branch scoping, etc.),
// but a few metrics genuinely overlap (org-wide/branch-wide Human Capital, Sales Velocity, and
// money formatting). Those pieces live here once so both pages render identical data/markup for
// the shared metrics instead of maintaining two copies that can drift apart.
import { TrendingUp, UsersRound } from 'lucide-react';

export const formatMoney = (amount) => {
    if (!amount) return '0';
    if (amount >= 10000000) return `${(amount / 10000000).toFixed(amount >= 100000000 ? 1 : 2)} Cr`;
    if (amount >= 100000) return `${(amount / 100000).toFixed(1)} L`;
    return amount.toLocaleString('en-IN');
};

export const formatPercent = (value) => `${value > 0 ? '+' : ''}${value}%`;

export const formatRelativeTime = (value) => {
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

export const Panel = ({ children, className = '' }) => (
    <section className={`rounded-[12px] border border-[#C9C4E6] bg-white shadow-[0_1px_0_rgba(33,24,88,0.03)] ${className}`}>
        {children}
    </section>
);

export const MetricPanel = ({ title, icon: Icon, children, className = '' }) => (
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

const DEFAULT_HUMAN_CAPITAL = { total: 0, brokers: 0, salesOfficers: 0, fieldOfficers: 0, growthPercent: 0 };

// Used by both Home (org-wide) and SuperHome (branch-scoped via the same backend query) so the
// "Human Capital" metric always renders identically wherever it appears.
export const HumanCapitalCard = ({ humanCapital = DEFAULT_HUMAN_CAPITAL, className = 'min-h-[420px]' }) => (
    <MetricPanel title="Human Capital" icon={UsersRound} className={className}>
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
);

const DEFAULT_SALES_VELOCITY = { series: [], projectedQ3GrowthPercent: 0 };

// Used by both Home and SuperHome so the monthly sales-velocity bar chart is a single
// implementation fed by (org-wide or branch-scoped) data from the same backend helper.
export const SalesVelocityCard = ({ salesVelocity = DEFAULT_SALES_VELOCITY, className = '' }) => {
    const maxVelocityValue = Math.max(1, ...salesVelocity.series.map((item) => item.value));

    return (
        <Panel className={`p-7 ${className}`}>
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
    );
};
