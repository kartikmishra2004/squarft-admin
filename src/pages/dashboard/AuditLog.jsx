import { useEffect, useState, useCallback } from 'react';
import {
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    ClipboardList,
    Loader2,
    RefreshCw,
    Search,
    X,
} from 'lucide-react';
import Header from '../../components/layout/Header';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { fetchAuditLog } from '../../services/auditLogService';

const ACTION_BADGE_VARIANT = {
    'kyc.verified': 'green',
    'kyc.rejected': 'red',
    'deal.status_changed': 'blue',
};

const badgeVariantForAction = (action) => ACTION_BADGE_VARIANT[action] || 'purple';

const formatDateTime = (value) => {
    if (!value) return '-';
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

const formatEntityType = (entityType) => String(entityType || '')
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

const formatAction = (action) => String(action || '')
    .split('.')
    .join(' — ')
    .split('_')
    .join(' ');

const initialFilters = {
    entityType: '',
    entityId: '',
    actorId: '',
    action: '',
    fromDate: '',
    toDate: '',
    search: '',
};

const DiffValue = ({ state }) => {
    if (!state || (typeof state === 'object' && Object.keys(state).length === 0)) {
        return <span className="text-gray-400 italic">—</span>;
    }
    return (
        <pre className="whitespace-pre-wrap break-all font-mono text-[11px] leading-relaxed text-gray-700">
            {JSON.stringify(state, null, 2)}
        </pre>
    );
};

const AuditLogRow = ({ log, isExpanded, onToggle }) => (
    <>
        <tr
            className="align-top border-t border-gray-100 hover:bg-gray-50/60 cursor-pointer transition-colors"
            onClick={() => onToggle(log.id)}
        >
            <td className="px-5 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                {formatDateTime(log.createdAt)}
            </td>
            <td className="px-5 py-4">
                <p className="text-sm font-bold text-gray-900">{formatEntityType(log.entityType)}</p>
                <p className="text-xs text-gray-400 font-mono truncate max-w-[180px]">{log.entityId}</p>
            </td>
            <td className="px-5 py-4">
                <Badge variant={badgeVariantForAction(log.action)}>{formatAction(log.action)}</Badge>
            </td>
            <td className="px-5 py-4">
                <p className="text-sm font-semibold text-gray-800">{log.actor?.name || 'System'}</p>
                {log.actor?.role && (
                    <p className="text-xs text-gray-400 uppercase tracking-wide">{log.actor.role}</p>
                )}
            </td>
            <td className="px-5 py-4 text-sm text-gray-600">
                {log.branch?.name || <span className="text-gray-400">—</span>}
            </td>
            <td className="px-5 py-4 text-right">
                <button className="text-xs font-bold text-[#6F4BFF]">
                    {isExpanded ? 'Hide diff' : 'View diff'}
                </button>
            </td>
        </tr>
        {isExpanded && (
            <tr className="border-t border-gray-100 bg-gray-50/40">
                <td colSpan={6} className="px-5 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="rounded-lg border border-rose-100 bg-rose-50/40 p-3">
                            <p className="text-[10px] font-black uppercase tracking-widest text-rose-500 mb-2">Before</p>
                            <DiffValue state={log.beforeState} />
                        </div>
                        <div className="rounded-lg border border-emerald-100 bg-emerald-50/40 p-3">
                            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-2">After</p>
                            <DiffValue state={log.afterState} />
                        </div>
                    </div>
                </td>
            </tr>
        )}
    </>
);

const AuditLog = () => {
    const [filters, setFilters] = useState(initialFilters);
    const [appliedFilters, setAppliedFilters] = useState(initialFilters);
    const [logs, setLogs] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, limit: 25, total: 0, totalPages: 1 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [expandedId, setExpandedId] = useState(null);

    const loadLogs = useCallback(async (page = 1) => {
        setLoading(true);
        setError('');
        try {
            const data = await fetchAuditLog({ ...appliedFilters, page, limit: pagination.limit });
            setLogs(data?.logs || []);
            setPagination(data?.pagination || { page, limit: 25, total: 0, totalPages: 1 });
        } catch (err) {
            console.error('Failed to load audit log:', err);
            setError(err?.message || 'Failed to load audit log.');
        } finally {
            setLoading(false);
        }
    }, [appliedFilters, pagination.limit]);

    useEffect(() => {
        loadLogs(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [appliedFilters]);

    const handleFilterChange = (field, value) => {
        setFilters((current) => ({ ...current, [field]: value }));
    };

    const handleApplyFilters = (event) => {
        event.preventDefault();
        setAppliedFilters(filters);
    };

    const handleClearFilters = () => {
        setFilters(initialFilters);
        setAppliedFilters(initialFilters);
    };

    const hasActiveFilters = Object.values(appliedFilters).some((value) => value);

    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden relative bg-[#F5F6FA] font-sans text-gray-900">
            <Header title="Audit & Exception Control" />

            <main className="flex-1 overflow-y-auto p-6 md:p-8 h-full scroll-smooth">
                <div className="max-w-[1600px] mx-auto flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Audit Log</h2>
                            <p className="text-gray-500 mt-1 font-medium text-sm">
                                Centralized, append-only trail of state-changing actions across the platform — KYC decisions, deal status changes, and role/permission updates.
                            </p>
                        </div>
                        <Button icon={loading ? Loader2 : RefreshCw} variant="secondary" onClick={() => loadLogs(pagination.page)} disabled={loading}>
                            Refresh
                        </Button>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                            <p className="font-bold text-red-900">{error}</p>
                        </div>
                    )}

                    <Card className="shrink-0">
                        <form onSubmit={handleApplyFilters} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            <div className="lg:col-span-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Search</label>
                                <label className="mt-2 flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2.5 focus-within:ring-2 focus-within:ring-[#6F4BFF]/40">
                                    <Search className="w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        value={filters.search}
                                        onChange={(event) => handleFilterChange('search', event.target.value)}
                                        placeholder="Entity type, entity id, or action"
                                        className="w-full outline-none text-sm font-medium"
                                    />
                                </label>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Entity Type</label>
                                <input
                                    type="text"
                                    value={filters.entityType}
                                    onChange={(event) => handleFilterChange('entityType', event.target.value)}
                                    placeholder="e.g. deal"
                                    className="w-full mt-2 border border-gray-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-[#6F4BFF]/40 text-sm font-medium"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Entity ID</label>
                                <input
                                    type="text"
                                    value={filters.entityId}
                                    onChange={(event) => handleFilterChange('entityId', event.target.value)}
                                    placeholder="UUID"
                                    className="w-full mt-2 border border-gray-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-[#6F4BFF]/40 text-sm font-medium"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">From Date</label>
                                <input
                                    type="date"
                                    value={filters.fromDate}
                                    onChange={(event) => handleFilterChange('fromDate', event.target.value)}
                                    className="w-full mt-2 border border-gray-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-[#6F4BFF]/40 text-sm font-medium"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">To Date</label>
                                <input
                                    type="date"
                                    value={filters.toDate}
                                    onChange={(event) => handleFilterChange('toDate', event.target.value)}
                                    className="w-full mt-2 border border-gray-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-[#6F4BFF]/40 text-sm font-medium"
                                />
                            </div>
                            <div className="lg:col-span-6 flex items-center gap-3 justify-end">
                                {hasActiveFilters && (
                                    <Button type="button" variant="ghost" icon={X} onClick={handleClearFilters}>
                                        Clear filters
                                    </Button>
                                )}
                                <Button type="submit" icon={Search}>
                                    Apply Filters
                                </Button>
                            </div>
                        </form>
                    </Card>

                    <Card noPadding className="border-gray-200 shadow-md">
                        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-[#6F4BFF]/10 text-[#6F4BFF] flex items-center justify-center">
                                    <ClipboardList className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-black text-gray-900">Timeline</h3>
                                    <p className="text-xs text-gray-500 font-semibold">{pagination.total} record{pagination.total === 1 ? '' : 's'} found</p>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[900px] text-left">
                                <thead className="bg-gray-50 text-[11px] uppercase tracking-[0.12em] text-gray-500">
                                    <tr>
                                        <th className="px-5 py-3 font-bold">Timestamp</th>
                                        <th className="px-5 py-3 font-bold">Entity</th>
                                        <th className="px-5 py-3 font-bold">Action</th>
                                        <th className="px-5 py-3 font-bold">Actor</th>
                                        <th className="px-5 py-3 font-bold">Branch</th>
                                        <th className="px-5 py-3 font-bold text-right">Diff</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading && logs.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="px-5 py-16 text-center">
                                                <Loader2 className="w-8 h-8 text-[#6F4BFF] animate-spin mx-auto mb-3" />
                                                <p className="text-sm font-bold text-gray-500">Loading audit trail...</p>
                                            </td>
                                        </tr>
                                    )}
                                    {!loading && logs.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="px-5 py-16 text-center">
                                                <ClipboardList className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                                                <p className="text-sm font-bold text-gray-500">No audit records match these filters.</p>
                                            </td>
                                        </tr>
                                    )}
                                    {logs.map((log) => (
                                        <AuditLogRow
                                            key={log.id}
                                            log={log}
                                            isExpanded={expandedId === log.id}
                                            onToggle={(id) => setExpandedId((current) => (current === id ? null : id))}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                            <p className="text-xs font-semibold text-gray-500">
                                Page {pagination.page} of {Math.max(1, pagination.totalPages)}
                            </p>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="secondary"
                                    icon={ChevronLeft}
                                    disabled={loading || pagination.page <= 1}
                                    onClick={() => loadLogs(pagination.page - 1)}
                                >
                                    Prev
                                </Button>
                                <Button
                                    variant="secondary"
                                    icon={ChevronRight}
                                    disabled={loading || pagination.page >= pagination.totalPages}
                                    onClick={() => loadLogs(pagination.page + 1)}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </main>
        </div>
    );
};

export default AuditLog;
