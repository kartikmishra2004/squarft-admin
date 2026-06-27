import { useEffect, useMemo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    BadgeCheck,
    BellRing,
    CalendarClock,
    CreditCard,
    FileText,
    IndianRupee,
    ListChecks,
    Pencil,
    Plus,
    RefreshCw,
    Search,
    ShieldAlert,
    X,
} from 'lucide-react';
import Header from '../../components/layout/Header';
import { clearDealPayment, fetchDealReceipt } from '../../services/dealPaymentClearanceService';
import {
    collectMilestonePayment,
    createMilestone,
    fetchAllInventoryDeals,
    fetchPaymentSchedule,
    updateMilestone,
} from '../../services/paymentMilestoneService';

const DEALS_PER_PAGE = 5;

const filterOptions = ['All', 'Overdue', 'Upcoming', 'Paid'];
const manualMilestoneStatuses = ['upcoming', 'overdue', 'cancelled'];

const formatCurrency = (amount) => `Rs ${Number(amount || 0).toLocaleString('en-IN')}`;

const getMilestoneAmount = (milestone) => Number(milestone.total_amount || milestone.totalAmount || milestone.amount || milestone.milestone_amount || 0);
const getCollectedAmount = (milestone) => Number(milestone.collected_amount || milestone.collectedAmount || milestone.paid_amount || milestone.received_amount || 0);
const getRemainingAmount = (milestone) => Math.max(getMilestoneAmount(milestone) - getCollectedAmount(milestone), 0);

const getMilestoneStatusOptions = (milestone) => {
    const currentStatus = String(milestone?.status || '').toLowerCase();
    if (['partial', 'paid'].includes(currentStatus)) {
        return [currentStatus, ...manualMilestoneStatuses];
    }
    return manualMilestoneStatuses;
};

const getStatusClass = (status) => {
    const normalized = String(status).toLowerCase();
    if (normalized.includes('paid') || normalized.includes('completed') || normalized.includes('collected') || normalized.includes('delivered') || normalized.includes('opened')) {
        return 'bg-[#E8F9EE] text-[#0C6B39]';
    }
    if (normalized.includes('overdue') || normalized.includes('hold') || normalized.includes('failed')) {
        return 'bg-[#FDECEC] text-[#B42318]';
    }
    return 'bg-[#FFF7E6] text-[#A15A00]';
};

const parseDealDate = (dateStr) => {
    if (!dateStr) return '';
    const parts = dateStr.split(' ');
    if (parts.length !== 3) return '';
    const day = parts[0].padStart(2, '0');
    const months = {
        Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
        Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12'
    };
    const month = months[parts[1]];
    const year = parts[2];
    if (!month) return '';
    return `${year}-${month}-${day}`;
};

const PaymentMilestones = () => {
    const navigate = useNavigate();

    // deal list state (fetched from backend)
    const [deals, setDeals] = useState([]);
    const [dealsLoading, setDealsLoading] = useState(true);

    // per-deal schedule state { [dealId]: { milestones, transactions, loading, error } }
    const [scheduleMap, setScheduleMap] = useState({});

    const [selectedDealId, setSelectedDealId] = useState(null);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [dateFilter, setDateFilter] = useState('');
    const [page, setPage] = useState(1);
    const [viewMode, setViewMode] = useState('list');
    const [scheduleFilter, setScheduleFilter] = useState('All');
    const [pageError, setPageError] = useState('');
    const [clearanceModal, setClearanceModal] = useState(false);
    const [clearanceForm, setClearanceForm] = useState({ amount: '', paymentMode: 'Bank Transfer', referenceNo: '', note: '' });
    const [clearanceLoading, setClearanceLoading] = useState(false);
    const [clearanceError, setClearanceError] = useState('');
    const [milestoneModal, setMilestoneModal] = useState(false);
    const [editingMilestone, setEditingMilestone] = useState(null);
    const [milestoneForm, setMilestoneForm] = useState({ title: '', amount: '', dueDate: '', status: 'upcoming' });
    const [milestoneSaving, setMilestoneSaving] = useState(false);
    const [milestoneError, setMilestoneError] = useState('');
    const [receiptModal, setReceiptModal] = useState(false);
    const [receiptData, setReceiptData] = useState(null);
    const [receiptLoading, setReceiptLoading] = useState(false);
    const [receiptError, setReceiptError] = useState('');

    // collect payment modal state
    const [collectModal, setCollectModal] = useState(false);
    const [collectTarget, setCollectTarget] = useState(null); // milestone object
    const [collectForm, setCollectForm] = useState({ amount: '', paymentMode: 'Bank Transfer', referenceNo: '', receiptNo: '' });
    const [collectLoading, setCollectLoading] = useState(false);
    const [collectError, setCollectError] = useState('');

    // load all deals from backend on mount
    useEffect(() => {
        let isMounted = true;
        setDealsLoading(true);

        const load = async () => {
            try {
                setPageError('');
                const items = await fetchAllInventoryDeals();
                if (isMounted) {
                    setDeals(items || []);
                    if (items?.length) setSelectedDealId(items[0].id);
                }
            } catch (error) {
                console.error('Failed to load deals for payment milestones:', error);
                if (isMounted) {
                    setDeals([]);
                    setSelectedDealId(null);
                    setPageError(error?.message || 'Failed to load payment deals from backend.');
                }
            } finally {
                if (isMounted) setDealsLoading(false);
            }
        };

        load();
        return () => { isMounted = false; };
    }, []);

    // load payment schedule for a deal whenever selectedDealId changes
    const loadSchedule = useCallback(async (dealId) => {
        if (!dealId) return;

        setScheduleMap((prev) => ({ ...prev, [dealId]: { ...(prev[dealId] || {}), loading: true, error: null } }));
        try {
            const { milestones, transactions } = await fetchPaymentSchedule(dealId);
            setScheduleMap((prev) => ({ ...prev, [dealId]: { milestones, transactions, loading: false, error: null } }));
        } catch (error) {
            console.error('Failed to load payment schedule:', error);
            setScheduleMap((prev) => ({
                ...prev,
                [dealId]: { milestones: [], transactions: [], loading: false, error: error?.message || 'Failed to load schedule' },
            }));
        }
    }, []);

    useEffect(() => {
        if (selectedDealId) loadSchedule(selectedDealId);
    }, [selectedDealId, loadSchedule]);

    const enrichedDeals = useMemo(() => deals.map((deal) => {
        const schedule = scheduleMap[deal.id];
        const paymentSchedule = schedule?.milestones || [];
        const transactions = schedule?.transactions || [];

        const total = paymentSchedule.reduce((sum, item) => sum + getMilestoneAmount(item), 0) || Number(deal.negotiationPrice || deal.dealValue || 0);
        const collected = paymentSchedule.reduce((sum, item) => sum + getCollectedAmount(item), 0);
        const pending = Math.max(total - collected, 0);
        const nextMilestone = paymentSchedule.find((item) => getRemainingAmount(item) > 0);
        const progress = total > 0 ? Math.round((collected / total) * 100) : 0;
        const dealStatus = nextMilestone ? (nextMilestone.status || 'Upcoming') : 'Paid';

        return {
            ...deal,
            dealCode: deal.dealCode || deal.id,
            customer: deal.customer || deal.bookedByName || '-',
            customerPhone: deal.customerPhone || deal.bookedByMobile || '-',
            project: deal.property || deal.project || '-',
            unit: deal.unit || deal.unitId || '-',
            paymentSchedule,
            transactions,
            dealValue: total,
            total,
            collected,
            pending,
            nextMilestone,
            progress,
            dealStatus,
        };
    }), [deals, scheduleMap]);

    const filteredDeals = useMemo(() => {
        const query = search.trim().toLowerCase();
        return enrichedDeals.filter((deal) => {
            const matchesSearch = !query
                || deal.customer.toLowerCase().includes(query)
                || deal.dealCode.toLowerCase().includes(query)
                || deal.project.toLowerCase().includes(query)
                || deal.unit.toLowerCase().includes(query);
            const matchesFilter = statusFilter === 'All' || deal.dealStatus === statusFilter;
            
            const dealDate = parseDealDate(deal.createdOn);
            const matchesDate = !dateFilter || dealDate === dateFilter;

            return matchesSearch && matchesFilter && matchesDate;
        });
    }, [enrichedDeals, search, statusFilter, dateFilter]);

    const selectedDeal = enrichedDeals.find((deal) => deal.id === selectedDealId) || filteredDeals[0] || enrichedDeals[0];
    const selectedScheduleState = selectedDeal ? scheduleMap[selectedDeal.id] : null;
    const scheduleLoading = selectedScheduleState?.loading ?? false;

    const totalPages = Math.max(1, Math.ceil(filteredDeals.length / DEALS_PER_PAGE));
    const currentPage = Math.min(page, totalPages);
    const paginatedDeals = filteredDeals.slice((currentPage - 1) * DEALS_PER_PAGE, currentPage * DEALS_PER_PAGE);
    const visibleSchedule = (selectedDeal?.paymentSchedule || []).filter((item) => {
        if (scheduleFilter === 'Pending') return getRemainingAmount(item) > 0;
        if (scheduleFilter === 'Complete') return getRemainingAmount(item) === 0;
        return true;
    });
    const reminderTarget = selectedDeal?.nextMilestone || (selectedDeal?.paymentSchedule || []).slice(-1)[0];

    const openPaymentReminderCall = () => {
        if (!selectedDeal?.customerPhone) return;

        navigate('/dashboard/support/voice-agent', {
            state: {
                returnTo: '/dashboard/payment-milestones',
                voiceContext: {
                    source: 'payment_reminder',
                    dealId: selectedDeal.id,
                    dealCode: selectedDeal.dealCode,
                    customerName: selectedDeal.customer,
                    customerPhone: selectedDeal.customerPhone,
                    projectName: selectedDeal.project,
                    unit: selectedDeal.unit,
                    builder: selectedDeal.builder,
                    milestoneTitle: reminderTarget?.milestone_title || reminderTarget?.title || 'Payment milestone',
                    dueDate: reminderTarget?.due_date || '',
                    status: reminderTarget?.status || '',
                    totalAmount: formatCurrency(getMilestoneAmount(reminderTarget || {})),
                    collectedAmount: formatCurrency(getCollectedAmount(reminderTarget || {})),
                    pendingAmount: formatCurrency(getRemainingAmount(reminderTarget || {})),
                    salesOfficer: selectedDeal.salesOfficer,
                    broker: selectedDeal.broker,
                    tone: 'Firm',
                },
            },
        });
    };

    const handleClearPayment = async () => {
        if (!selectedDeal?.id || !clearanceForm.amount) return;
        setClearanceLoading(true);
        setClearanceError('');
        try {
            await clearDealPayment(selectedDeal.id, {
                amount: Number(clearanceForm.amount),
                paymentMode: clearanceForm.paymentMode,
                referenceNo: clearanceForm.referenceNo || undefined,
                note: clearanceForm.note || undefined,
            });
            setClearanceModal(false);
            setClearanceForm({ amount: '', paymentMode: 'Bank Transfer', referenceNo: '', note: '' });
            // refresh schedule after clearance
            loadSchedule(selectedDeal.id);
        } catch (error) {
            console.error('Payment clearance failed:', error);
            setClearanceError(error?.message || 'Failed to clear payment.');
        } finally {
            setClearanceLoading(false);
        }
    };

    const openCollectModal = (milestone) => {
        setCollectTarget(milestone);
        setCollectForm({
            amount: String(getRemainingAmount(milestone)),
            paymentMode: 'Bank Transfer',
            referenceNo: '',
            receiptNo: '',
        });
        setCollectError('');
        setCollectModal(true);
    };

    const openCreateMilestoneModal = () => {
        setEditingMilestone(null);
        setMilestoneForm({ title: '', amount: '', dueDate: '', status: 'upcoming' });
        setMilestoneError('');
        setMilestoneModal(true);
    };

    const openEditMilestoneModal = (milestone) => {
        setEditingMilestone(milestone);
        setMilestoneForm({
            title: milestone.milestone_title || milestone.title || '',
            amount: String(getMilestoneAmount(milestone) || ''),
            dueDate: milestone.due_date || '',
            status: milestone.status || 'upcoming',
        });
        setMilestoneError('');
        setMilestoneModal(true);
    };

    const handleSaveMilestone = async () => {
        if (!selectedDeal?.id || !milestoneForm.title || !milestoneForm.amount || !milestoneForm.dueDate) return;
        const amount = Number(milestoneForm.amount);
        const collectedAmount = editingMilestone ? getCollectedAmount(editingMilestone) : 0;

        if (milestoneForm.status === 'partial' && collectedAmount <= 0) {
            setMilestoneError('Use Collect payment first. Partial status requires a collected amount.');
            return;
        }

        if (milestoneForm.status === 'paid' && collectedAmount < amount) {
            setMilestoneError('Use Collect payment first. Paid status requires full collection.');
            return;
        }

        setMilestoneSaving(true);
        setMilestoneError('');

        try {
            const payload = {
                title: milestoneForm.title.trim(),
                amount,
                due_date: milestoneForm.dueDate,
                status: milestoneForm.status,
            };

            if (editingMilestone?.id) {
                await updateMilestone(editingMilestone.id, payload);
            } else {
                await createMilestone(selectedDeal.id, payload);
            }

            setMilestoneModal(false);
            setEditingMilestone(null);
            setMilestoneForm({ title: '', amount: '', dueDate: '', status: 'upcoming' });
            await loadSchedule(selectedDeal.id);
        } catch (error) {
            console.error('Save milestone failed:', error);
            setMilestoneError(error?.message || 'Failed to save milestone.');
        } finally {
            setMilestoneSaving(false);
        }
    };

    const handleViewReceipt = async (transaction) => {
        if (!selectedDeal?.id) return;
        setReceiptModal(true);
        setReceiptLoading(true);
        setReceiptData(null);
        setReceiptError('');

        try {
            const data = await fetchDealReceipt(selectedDeal.id, {
                paymentId: transaction.id,
                receiptNo: transaction.receipt,
            });
            setReceiptData(data);
        } catch (error) {
            console.error('Fetch receipt failed:', error);
            setReceiptError(error?.message || 'Failed to fetch receipt.');
        } finally {
            setReceiptLoading(false);
        }
    };

    const handleCollectPayment = async () => {
        if (!collectTarget?.id || !collectForm.amount) return;
        setCollectLoading(true);
        setCollectError('');
        try {
            await collectMilestonePayment(collectTarget.id, {
                amount: Number(collectForm.amount),
                paymentMode: collectForm.paymentMode,
                referenceNo: collectForm.referenceNo || undefined,
                receiptNo: collectForm.receiptNo || undefined,
            });
            setCollectModal(false);
            setCollectTarget(null);
            // refresh schedule to show updated collected amounts
            if (selectedDeal?.id) loadSchedule(selectedDeal.id);
        } catch (error) {
            console.error('Collect payment failed:', error);
            setCollectError(error?.message || 'Failed to collect payment. Please try again.');
        } finally {
            setCollectLoading(false);
        }
    };

    const portfolio = enrichedDeals.reduce((summary, deal) => ({
        deals: summary.deals + 1,
        collected: summary.collected + deal.collected,
        pending: summary.pending + deal.pending,
        overdue: summary.overdue + (deal.paymentSchedule || []).filter((item) => String(item.status || '').toLowerCase() === 'overdue').length,
    }), { deals: 0, collected: 0, pending: 0, overdue: 0 });

    return (
        <>
        <div className="flex h-full flex-1 flex-col bg-[#F5F6FA] text-[#15121F]">
            <Header title="Payment Milestones" />

            {dealsLoading && (
                <div className="flex flex-1 items-center justify-center">
                    <RefreshCw className="h-6 w-6 animate-spin text-[#2717D7]" />
                    <span className="ml-2 text-sm font-bold text-[#615C71]">Loading deals…</span>
                </div>
            )}

            {!dealsLoading && (
            <main className="flex-1 overflow-y-auto p-3 md:p-4">
                <div className="mx-auto max-w-[1600px] space-y-3">
                    <section className="rounded-[8px] border border-[#D8D2EB] bg-white p-3 shadow-[0_1px_0_rgba(33,24,88,0.03)]">
                        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                            <div>
                                <div className="flex flex-wrap items-center gap-1.5">
                                    <span className="rounded-full bg-[#E8E4FF] px-2 py-0.5 text-[8px] font-black uppercase tracking-[0.1em] text-[#2717D7]">Project panel aligned</span>
                                    <span className="rounded-full bg-[#E9F8EF] px-2 py-0.5 text-[8px] font-black uppercase tracking-[0.1em] text-[#04622E]">Live backend data</span>
                                </div>
                                <h2 className="mt-2 text-lg font-black text-[#171327]">Payment schedule and milestone collection</h2>
                                <p className="mt-1 max-w-3xl text-xs font-medium leading-5 text-[#615C71]">
                                    Track deal-wise payment schedules, milestone due dates, collection progress, receipts, and transactions from the backend.
                                </p>
                            </div>
                            <div className="flex flex-col gap-2 xl:items-end">
                                <button
                                    type="button"
                                    disabled={!selectedDeal?.customerPhone}
                                    onClick={openPaymentReminderCall}
                                    className="flex min-h-8 items-center justify-center gap-2 rounded-lg bg-[#0C6B39] px-3 py-1.5 text-xs font-black text-white shadow-sm transition hover:bg-[#094d29] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <BellRing className="h-3.5 w-3.5" />
                                    Reminder Call
                                </button>
                                <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                                    <MetricTile icon={ListChecks} label="Deals" value={portfolio.deals} />
                                    <MetricTile icon={BadgeCheck} label="Collected" value={formatCurrency(portfolio.collected)} />
                                    <MetricTile icon={ShieldAlert} label="Pending" value={formatCurrency(portfolio.pending)} />
                                    <MetricTile icon={CalendarClock} label="Overdue" value={portfolio.overdue} />
                                </div>
                            </div>
                        </div>
                    </section>

                    {pageError && (
                        <div className="rounded-[8px] border border-[#F5C2C2] bg-[#FFF4F4] px-3 py-2 text-xs font-bold text-[#B42318]">
                            {pageError}
                        </div>
                    )}

                    {viewMode === 'list' && (
                        <section className="rounded-[8px] border border-[#D8D2EB] bg-white p-3">
                            <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                                <div className="flex min-w-0 flex-1 items-center gap-2 rounded-[7px] border border-[#D8D2EB] bg-[#FCFBFF] px-2.5">
                                    <Search size={14} className="shrink-0 text-[#7B7486]" />
                                    <input
                                        value={search}
                                        onChange={(event) => {
                                            setSearch(event.target.value);
                                            setPage(1);
                                        }}
                                        placeholder="Search deal, customer, project"
                                        className="h-9 min-w-0 flex-1 bg-transparent text-xs font-medium outline-none"
                                    />
                                </div>
                                <div className="flex items-center gap-2 bg-[#FCFBFF] px-2.5 h-9 rounded-[7px] border border-[#D8D2EB] shrink-0">
                                    <label className="text-[9px] font-black text-[#7B7486] uppercase tracking-[0.08em] flex items-center gap-1.5">
                                        <CalendarClock size={13} className="text-[#7B7486]" /> Date:
                                    </label>
                                    <input
                                        type="date"
                                        value={dateFilter}
                                        onChange={(event) => {
                                            setDateFilter(event.target.value);
                                            setPage(1);
                                        }}
                                        className="border-none bg-transparent text-xs font-medium text-[#15121F] outline-none cursor-pointer"
                                    />
                                    {dateFilter && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setDateFilter('');
                                                setPage(1);
                                            }}
                                            className="p-1 hover:bg-[#FDECEC] rounded text-[#B42318] transition-colors"
                                        >
                                            <X size={12} />
                                        </button>
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                    {filterOptions.map((option) => (
                                        <button
                                            key={option}
                                            type="button"
                                            onClick={() => {
                                                setStatusFilter(option);
                                                setPage(1);
                                            }}
                                            className={`rounded-[7px] border px-2 py-1.5 text-[9px] font-black uppercase tracking-[0.08em] ${statusFilter === option ? 'border-[#2717D7] bg-[#2717D7] text-white' : 'border-[#D8D2EB] bg-[#FCFBFF] text-[#514B63]'}`}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-3 flex flex-col gap-3">
                                {paginatedDeals.map((deal) => (
                                    <button
                                        key={deal.id}
                                        type="button"
                                        onClick={() => {
                                            setSelectedDealId(deal.id);
                                            setViewMode('detail');
                                        }}
                                        className="min-w-0 rounded-[8px] border border-[#E1DDF0] bg-white p-3 text-left transition-all hover:border-[#2717D7] hover:bg-[#F4F1FF]"
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="min-w-0">
                                                <p className="break-words text-sm font-black text-[#171327]">{deal.dealCode} / {deal.customer}</p>
                                                <p className="mt-1 break-words text-xs font-bold leading-4 text-[#615C71]">{deal.project} / {deal.unit}</p>
                                                <p className="mt-1 text-[10px] font-bold text-[#8B8498]">Created: {deal.createdOn}</p>
                                            </div>
                                            <StatusPill status={deal.dealStatus} />
                                        </div>
                                        <div className="mt-3 h-1.5 rounded-full bg-[#E4E0F2]">
                                            <div className="h-1.5 rounded-full bg-[#2717D7]" style={{ width: `${deal.progress}%` }} />
                                        </div>
                                        <div className="mt-2 grid grid-cols-3 gap-1.5">
                                            <MiniStat label="Paid" value={`${deal.progress}%`} />
                                            <MiniStat label="Pending" value={formatCurrency(deal.pending)} />
                                            <MiniStat label="Next" value={deal.nextMilestone?.title || 'Clear'} />
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {filteredDeals.length === 0 && (
                                <div className="mt-3 rounded-[8px] border border-dashed border-[#D8D2EB] bg-[#FCFBFF] p-6 text-center">
                                    <p className="text-xs font-black uppercase tracking-[0.1em] text-[#8B8498]">No payment deals found.</p>
                                </div>
                            )}

                            <div className="mt-3 flex flex-col gap-2 border-t border-[#E1DDF0] pt-3 sm:flex-row sm:items-center sm:justify-between">
                                <p className="text-[11px] font-bold text-[#615C71]">
                                    Showing {filteredDeals.length ? ((currentPage - 1) * DEALS_PER_PAGE) + 1 : 0}-{Math.min(currentPage * DEALS_PER_PAGE, filteredDeals.length)} of {filteredDeals.length}
                                </p>
                                <div className="flex flex-wrap items-center gap-1.5">
                                    <button
                                        type="button"
                                        onClick={() => setPage((value) => Math.max(value - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="rounded-[7px] border border-[#D8D2EB] bg-[#FCFBFF] px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.08em] text-[#514B63] disabled:opacity-40"
                                    >
                                        Prev
                                    </button>
                                    {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                                        <button
                                            key={pageNumber}
                                            type="button"
                                            onClick={() => setPage(pageNumber)}
                                            className={`h-7 w-7 rounded-[7px] text-[10px] font-black ${currentPage === pageNumber ? 'bg-[#2717D7] text-white' : 'border border-[#D8D2EB] bg-white text-[#514B63]'}`}
                                        >
                                            {pageNumber}
                                        </button>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => setPage((value) => Math.min(value + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="rounded-[7px] border border-[#D8D2EB] bg-[#FCFBFF] px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.08em] text-[#514B63] disabled:opacity-40"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </section>
                    )}

                    {viewMode === 'detail' && selectedDeal && (
                        <section className="space-y-3">
                            <button
                                type="button"
                                onClick={() => setViewMode('list')}
                                className="inline-flex h-8 items-center gap-2 rounded-[7px] border border-[#D8D2EB] bg-white px-3 text-[10px] font-black uppercase tracking-[0.08em] text-[#2717D7]"
                            >
                                <ArrowLeft size={14} /> Back to payment list
                            </button>
                            <div className="grid gap-3 lg:grid-cols-[1fr_360px]">
                                <div className="rounded-[8px] border border-[#D8D2EB] bg-white p-3">
                                    <SectionHeader icon={CreditCard} title="Payment Milestone Manager" helper="Create, update, and collect deal milestones using backend APIs." />
                                    <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-3">
                                        <div className="rounded-[8px] border border-[#E1DDF0] bg-[#FCFBFF] p-3">
                                            <p className="text-[9px] font-black uppercase tracking-[0.1em] text-[#8B8498]">Final Price Amount</p>
                                            <p className="mt-1 text-lg font-black text-[#171327]">{formatCurrency(selectedDeal.dealValue)}</p>
                                        </div>
                                        <div className="rounded-[8px] border border-emerald-100 bg-emerald-50 p-3">
                                            <p className="text-[9px] font-black uppercase tracking-[0.1em] text-emerald-600">Collected Amount</p>
                                            <p className="mt-1 text-lg font-black text-emerald-700">{formatCurrency(selectedDeal.collected)}</p>
                                        </div>
                                        <div className="rounded-[8px] border border-amber-100 bg-amber-50 p-3">
                                            <p className="text-[9px] font-black uppercase tracking-[0.1em] text-amber-600">Balance Amount</p>
                                            <p className="mt-1 text-lg font-black text-amber-700">{formatCurrency(selectedDeal.pending)}</p>
                                            {selectedDeal.pending > 0 && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setClearanceForm({ amount: String(selectedDeal.pending), paymentMode: 'Bank Transfer', referenceNo: '', note: '' });
                                                        setClearanceModal(true);
                                                    }}
                                                    className="mt-2 inline-flex items-center gap-1 rounded-[6px] bg-amber-600 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-white hover:bg-amber-700"
                                                >
                                                    <IndianRupee size={10} /> Clear Payment
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                                        <h3 className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.1em] text-[#171327]">
                                            <ListChecks className="h-3.5 w-3.5 text-emerald-500" /> Payment Schedule Details
                                        </h3>
                                        <div className="flex flex-wrap items-center gap-1.5">
                                            <button
                                                type="button"
                                                onClick={openCreateMilestoneModal}
                                                className="inline-flex items-center gap-1 rounded-[7px] bg-[#2717D7] px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-white hover:bg-[#1f12a8]"
                                            >
                                                <Plus size={11} /> Add milestone
                                            </button>
                                            {['All', 'Pending', 'Complete'].map((option) => {
                                                const count = selectedDeal.paymentSchedule.filter((item) => {
                                                    if (option === 'Pending') return getRemainingAmount(item) > 0;
                                                    if (option === 'Complete') return getRemainingAmount(item) === 0;
                                                    return true;
                                                }).length;

                                                return (
                                                    <button
                                                        key={option}
                                                        type="button"
                                                        onClick={() => setScheduleFilter(option)}
                                                        className={`rounded-[7px] border px-2.5 py-1 text-[9px] font-black uppercase tracking-wider transition-all ${
                                                            scheduleFilter === option
                                                                ? 'border-[#2717D7] bg-[#2717D7] text-white'
                                                                : 'border-[#D8D2EB] bg-[#FCFBFF] text-[#514B63] hover:border-[#2717D7] hover:text-[#2717D7]'
                                                        }`}
                                                    >
                                                        {option} ({count})
                                                    </button>
                                                );
                                            })}
                                            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-emerald-700 ring-1 ring-emerald-100">
                                                {formatCurrency(selectedDeal.dealValue)} Total
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-3 overflow-hidden rounded-[8px] border border-[#E1DDF0]">
                                        <div className="overflow-x-auto">
                                            <table className="w-full min-w-[780px] text-left">
                                                <thead className="bg-[#F8F9FF] text-[9px] font-black uppercase tracking-[0.1em] text-[#7B7486]">
                                                    <tr>
                                                        <th className="px-3 py-2">#</th>
                                                        <th className="px-3 py-2">Milestone</th>
                                                        <th className="px-3 py-2">Total</th>
                                                        <th className="px-3 py-2">Collected</th>
                                                        <th className="px-3 py-2">Remaining</th>
                                                        <th className="px-3 py-2">Due Date</th>
                                                        <th className="px-3 py-2">Status</th>
                                                        <th className="px-3 py-2">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-[#EFEAF8] bg-white">
                                                    {scheduleLoading ? (
                                                        <tr>
                                                            <td colSpan={8} className="px-3 py-6 text-center">
                                                                <RefreshCw className="mx-auto h-5 w-5 animate-spin text-[#2717D7]" />
                                                            </td>
                                                        </tr>
                                                    ) : visibleSchedule.map((milestone, index) => {
                                                        const remaining = getRemainingAmount(milestone);
                                                        const isPaid = remaining === 0;
                                                        return (
                                                            <tr key={milestone.id} className="hover:bg-[#FCFBFF]">
                                                                <td className="px-3 py-3 text-[10px] font-black text-[#8B8498]">{index + 1}</td>
                                                                <td className="px-3 py-3 text-xs font-black uppercase tracking-tight text-[#171327]">{milestone.milestone_title || milestone.title}</td>
                                                                <td className="px-3 py-3 text-xs font-black text-[#171327]">{formatCurrency(getMilestoneAmount(milestone))}</td>
                                                                <td className="px-3 py-3 text-xs font-bold text-emerald-700">{formatCurrency(getCollectedAmount(milestone))}</td>
                                                                <td className="px-3 py-3 text-xs font-bold text-amber-700">{formatCurrency(remaining)}</td>
                                                                <td className="px-3 py-3 text-[10px] font-bold text-[#615C71]">{milestone.due_date}</td>
                                                                <td className="px-3 py-3"><StatusPill status={milestone.status} /></td>
                                                                <td className="px-3 py-3">
                                                                    <div className="flex flex-wrap gap-1.5">
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => openEditMilestoneModal(milestone)}
                                                                            className="inline-flex items-center gap-1 rounded-[6px] border border-[#D8D2EB] bg-white px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-[#514B63] hover:border-[#2717D7] hover:text-[#2717D7]"
                                                                        >
                                                                            <Pencil size={10} /> Edit
                                                                        </button>
                                                                    {!isPaid && (
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => openCollectModal(milestone)}
                                                                            className="inline-flex items-center gap-1 rounded-[6px] bg-[#2717D7] px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-white hover:bg-[#1f12a8]"
                                                                        >
                                                                            <IndianRupee size={10} /> Collect
                                                                        </button>
                                                                    )}
                                                                    {isPaid && (
                                                                        <span className="text-[9px] font-black uppercase tracking-wider text-emerald-600">Cleared</span>
                                                                    )}
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                        {visibleSchedule.length === 0 && (
                                            <div className="bg-white p-8 text-center">
                                                <CreditCard className="mx-auto h-8 w-8 text-[#B8B1CC]" />
                                                <p className="mt-2 text-xs font-black uppercase tracking-widest text-[#8B8498]">
                                                    No {scheduleFilter.toLowerCase()} payment milestones found.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="rounded-[8px] border border-[#D8D2EB] bg-white p-3">
                                    <SectionHeader icon={FileText} title="Backend Actions" helper="Actions here call live backend routes for this inventory deal." />
                                    <div className="mt-3 grid gap-2">
                                        <button
                                            type="button"
                                            onClick={openCreateMilestoneModal}
                                            className="inline-flex h-9 items-center justify-center gap-2 rounded-[7px] bg-[#2717D7] px-3 text-[10px] font-black uppercase tracking-[0.1em] text-white"
                                        >
                                            <Plus size={14} /> Add milestone
                                        </button>
                                        <button
                                            type="button"
                                            disabled={!selectedDeal?.customerPhone}
                                            onClick={openPaymentReminderCall}
                                            className="inline-flex h-9 items-center justify-center gap-2 rounded-[7px] border border-[#B7E5C8] bg-[#E8F9EE] px-3 text-[10px] font-black uppercase tracking-[0.1em] text-[#0C6B39] disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <BellRing size={14} /> Reminder call
                                        </button>
                                        <div className="rounded-[7px] border border-[#E1DDF0] bg-[#FCFBFF] p-2.5">
                                            <p className="text-[8px] font-black uppercase tracking-[0.1em] text-[#8B8498]">Inventory deal ID</p>
                                            <p className="mt-1 break-all text-[10px] font-bold text-[#514B63]">{selectedDeal.id}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-3">
                                <DataTable
                                    icon={CreditCard}
                                    title="Transaction history"
                                    helper="All payment collections recorded for this deal."
                                    columns={['Milestone', 'Amount', 'Mode', 'Reference', 'Collected On', 'Collected By', 'Receipt']}
                                    emptyMessage="No transactions recorded for this deal yet."
                                    rows={(selectedDeal.transactions || []).map((txn) => [
                                            txn.milestone,
                                            txn.amount ? formatCurrency(txn.amount) : '-',
                                            txn.mode || '-',
                                            txn.referenceNo || txn.receipt || '-',
                                            txn.collectedOn || '-',
                                            txn.collectedBy || '-',
                                            (
                                                <button
                                                    type="button"
                                                    onClick={() => handleViewReceipt(txn)}
                                                    className="rounded-[6px] border border-[#D8D2EB] bg-white px-2 py-1 text-[9px] font-black uppercase tracking-wider text-[#2717D7] hover:bg-[#F4F1FF]"
                                                >
                                                    View
                                                </button>
                                            ),
                                        ])
                                    }
                                />
                            </div>
                        </section>
                    )}
                </div>
            </main>
            )}
        </div>

        {clearanceModal && (            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                <div className="w-full max-w-md rounded-[10px] border border-[#D8D2EB] bg-white p-5 shadow-xl">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-black uppercase tracking-[0.1em] text-[#171327]">Clear Payment</p>
                        <button type="button" onClick={() => setClearanceModal(false)} className="rounded p-1 hover:bg-slate-100">
                            <X size={16} />
                        </button>
                    </div>
                    <p className="mt-1 text-xs font-medium text-[#615C71]">
                        {selectedDeal?.customer} — {selectedDeal?.project} / {selectedDeal?.unit}
                    </p>
                    {clearanceError && (
                        <p className="mt-2 rounded-[6px] bg-[#FDECEC] px-3 py-2 text-[11px] font-bold text-[#B42318]">{clearanceError}</p>
                    )}
                    <div className="mt-4 space-y-3">
                        <label className="block">
                            <span className="text-[9px] font-black uppercase tracking-[0.1em] text-[#6B657A]">Amount (Rs)</span>
                            <input
                                type="number"
                                value={clearanceForm.amount}
                                onChange={(e) => setClearanceForm((f) => ({ ...f, amount: e.target.value }))}
                                className="mt-1 h-9 w-full rounded-[7px] border border-[#D8D2EB] px-3 text-sm font-black outline-none focus:ring-2 focus:ring-[#2717D7]/20"
                                placeholder={`Max: ${formatCurrency(selectedDeal?.pending || 0)}`}
                            />
                        </label>
                        <label className="block">
                            <span className="text-[9px] font-black uppercase tracking-[0.1em] text-[#6B657A]">Payment Mode</span>
                            <select
                                value={clearanceForm.paymentMode}
                                onChange={(e) => setClearanceForm((f) => ({ ...f, paymentMode: e.target.value }))}
                                className="mt-1 h-9 w-full rounded-[7px] border border-[#D8D2EB] bg-white px-3 text-sm font-black outline-none focus:ring-2 focus:ring-[#2717D7]/20"
                            >
                                {['Bank Transfer', 'UPI', 'RTGS', 'NEFT', 'Cheque', 'Cash', 'DD'].map((mode) => (
                                    <option key={mode}>{mode}</option>
                                ))}
                            </select>
                        </label>
                        <label className="block">
                            <span className="text-[9px] font-black uppercase tracking-[0.1em] text-[#6B657A]">Reference No (optional)</span>
                            <input
                                type="text"
                                value={clearanceForm.referenceNo}
                                onChange={(e) => setClearanceForm((f) => ({ ...f, referenceNo: e.target.value }))}
                                className="mt-1 h-9 w-full rounded-[7px] border border-[#D8D2EB] px-3 text-sm font-black outline-none focus:ring-2 focus:ring-[#2717D7]/20"
                                placeholder="UTR / Txn ID"
                            />
                        </label>
                        <label className="block">
                            <span className="text-[9px] font-black uppercase tracking-[0.1em] text-[#6B657A]">Note (optional)</span>
                            <input
                                type="text"
                                value={clearanceForm.note}
                                onChange={(e) => setClearanceForm((f) => ({ ...f, note: e.target.value }))}
                                className="mt-1 h-9 w-full rounded-[7px] border border-[#D8D2EB] px-3 text-sm font-black outline-none focus:ring-2 focus:ring-[#2717D7]/20"
                                placeholder="Internal note"
                            />
                        </label>
                    </div>
                    <div className="mt-5 flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setClearanceModal(false)}
                            className="rounded-[7px] border border-[#D8D2EB] px-4 py-2 text-xs font-black text-[#514B63] hover:bg-slate-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleClearPayment}
                            disabled={!clearanceForm.amount || clearanceLoading}
                            className="rounded-[7px] bg-amber-600 px-4 py-2 text-xs font-black text-white hover:bg-amber-700 disabled:opacity-50"
                        >
                            {clearanceLoading ? 'Processing...' : 'Confirm Clearance'}
                        </button>
                    </div>
                </div>
            </div>
        )}

        {collectModal && collectTarget && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                <div className="w-full max-w-md rounded-[10px] border border-[#D8D2EB] bg-white p-5 shadow-xl">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-black uppercase tracking-[0.1em] text-[#171327]">Collect Payment</p>
                        <button type="button" onClick={() => setCollectModal(false)} className="rounded p-1 hover:bg-slate-100">
                            <X size={16} />
                        </button>
                    </div>
                    <p className="mt-1 text-xs font-medium text-[#615C71]">
                        {collectTarget.milestone_title || collectTarget.title} — Max: {formatCurrency(getRemainingAmount(collectTarget))}
                    </p>
                    {collectError && (
                        <p className="mt-2 rounded-[6px] bg-[#FDECEC] px-3 py-2 text-[11px] font-bold text-[#B42318]">{collectError}</p>
                    )}
                    <div className="mt-4 space-y-3">
                        <label className="block">
                            <span className="text-[9px] font-black uppercase tracking-[0.1em] text-[#6B657A]">Amount (Rs)</span>
                            <input
                                type="number"
                                value={collectForm.amount}
                                onChange={(e) => setCollectForm((f) => ({ ...f, amount: e.target.value }))}
                                max={getRemainingAmount(collectTarget)}
                                className="mt-1 h-9 w-full rounded-[7px] border border-[#D8D2EB] px-3 text-sm font-black outline-none focus:ring-2 focus:ring-[#2717D7]/20"
                            />
                        </label>
                        <label className="block">
                            <span className="text-[9px] font-black uppercase tracking-[0.1em] text-[#6B657A]">Payment Mode</span>
                            <select
                                value={collectForm.paymentMode}
                                onChange={(e) => setCollectForm((f) => ({ ...f, paymentMode: e.target.value }))}
                                className="mt-1 h-9 w-full rounded-[7px] border border-[#D8D2EB] bg-white px-3 text-sm font-black outline-none focus:ring-2 focus:ring-[#2717D7]/20"
                            >
                                {['Bank Transfer', 'UPI', 'RTGS', 'NEFT', 'Cheque', 'Cash', 'DD'].map((mode) => (
                                    <option key={mode}>{mode}</option>
                                ))}
                            </select>
                        </label>
                        <label className="block">
                            <span className="text-[9px] font-black uppercase tracking-[0.1em] text-[#6B657A]">Reference No (optional)</span>
                            <input
                                type="text"
                                value={collectForm.referenceNo}
                                onChange={(e) => setCollectForm((f) => ({ ...f, referenceNo: e.target.value }))}
                                className="mt-1 h-9 w-full rounded-[7px] border border-[#D8D2EB] px-3 text-sm font-black outline-none focus:ring-2 focus:ring-[#2717D7]/20"
                                placeholder="UTR / Txn ID"
                            />
                        </label>
                        <label className="block">
                            <span className="text-[9px] font-black uppercase tracking-[0.1em] text-[#6B657A]">Receipt No (optional)</span>
                            <input
                                type="text"
                                value={collectForm.receiptNo}
                                onChange={(e) => setCollectForm((f) => ({ ...f, receiptNo: e.target.value }))}
                                className="mt-1 h-9 w-full rounded-[7px] border border-[#D8D2EB] px-3 text-sm font-black outline-none focus:ring-2 focus:ring-[#2717D7]/20"
                                placeholder="RCT-XXXX"
                            />
                        </label>
                    </div>
                    <div className="mt-5 flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setCollectModal(false)}
                            className="rounded-[7px] border border-[#D8D2EB] px-4 py-2 text-xs font-black text-[#514B63] hover:bg-slate-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleCollectPayment}
                            disabled={!collectForm.amount || collectLoading}
                            className="rounded-[7px] bg-[#2717D7] px-4 py-2 text-xs font-black text-white hover:bg-[#1f12a8] disabled:opacity-50"
                        >
                            {collectLoading ? 'Processing…' : 'Confirm Collection'}
                        </button>
                    </div>
                </div>
            </div>
        )}

        {milestoneModal && selectedDeal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                <div className="w-full max-w-md rounded-[10px] border border-[#D8D2EB] bg-white p-5 shadow-xl">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-black uppercase tracking-[0.1em] text-[#171327]">
                            {editingMilestone ? 'Edit Milestone' : 'Add Milestone'}
                        </p>
                        <button type="button" onClick={() => setMilestoneModal(false)} className="rounded p-1 hover:bg-slate-100">
                            <X size={16} />
                        </button>
                    </div>
                    <p className="mt-1 text-xs font-medium text-[#615C71]">
                        {selectedDeal.customer} / {selectedDeal.project}
                    </p>
                    {milestoneError && (
                        <p className="mt-2 rounded-[6px] bg-[#FDECEC] px-3 py-2 text-[11px] font-bold text-[#B42318]">{milestoneError}</p>
                    )}
                    <div className="mt-4 space-y-3">
                        <label className="block">
                            <span className="text-[9px] font-black uppercase tracking-[0.1em] text-[#6B657A]">Milestone title</span>
                            <input
                                type="text"
                                value={milestoneForm.title}
                                onChange={(event) => setMilestoneForm((form) => ({ ...form, title: event.target.value }))}
                                className="mt-1 h-9 w-full rounded-[7px] border border-[#D8D2EB] px-3 text-sm font-black outline-none focus:ring-2 focus:ring-[#2717D7]/20"
                            />
                        </label>
                        <label className="block">
                            <span className="text-[9px] font-black uppercase tracking-[0.1em] text-[#6B657A]">Amount (Rs)</span>
                            <input
                                type="number"
                                value={milestoneForm.amount}
                                onChange={(event) => setMilestoneForm((form) => ({ ...form, amount: event.target.value }))}
                                className="mt-1 h-9 w-full rounded-[7px] border border-[#D8D2EB] px-3 text-sm font-black outline-none focus:ring-2 focus:ring-[#2717D7]/20"
                            />
                        </label>
                        <label className="block">
                            <span className="text-[9px] font-black uppercase tracking-[0.1em] text-[#6B657A]">Due date</span>
                            <input
                                type="date"
                                value={milestoneForm.dueDate}
                                onChange={(event) => setMilestoneForm((form) => ({ ...form, dueDate: event.target.value }))}
                                className="mt-1 h-9 w-full rounded-[7px] border border-[#D8D2EB] px-3 text-sm font-black outline-none focus:ring-2 focus:ring-[#2717D7]/20"
                            />
                        </label>
                        <label className="block">
                            <span className="text-[9px] font-black uppercase tracking-[0.1em] text-[#6B657A]">Status</span>
                            <select
                                value={milestoneForm.status}
                                onChange={(event) => setMilestoneForm((form) => ({ ...form, status: event.target.value }))}
                                className="mt-1 h-9 w-full rounded-[7px] border border-[#D8D2EB] bg-white px-3 text-sm font-black outline-none focus:ring-2 focus:ring-[#2717D7]/20"
                            >
                                {getMilestoneStatusOptions(editingMilestone).map((status) => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                        </label>
                    </div>
                    <div className="mt-5 flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setMilestoneModal(false)}
                            className="rounded-[7px] border border-[#D8D2EB] px-4 py-2 text-xs font-black text-[#514B63] hover:bg-slate-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSaveMilestone}
                            disabled={!milestoneForm.title || !milestoneForm.amount || !milestoneForm.dueDate || milestoneSaving}
                            className="rounded-[7px] bg-[#2717D7] px-4 py-2 text-xs font-black text-white hover:bg-[#1f12a8] disabled:opacity-50"
                        >
                            {milestoneSaving ? 'Saving...' : 'Save Milestone'}
                        </button>
                    </div>
                </div>
            </div>
        )}

        {receiptModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                <div className="w-full max-w-lg rounded-[10px] border border-[#D8D2EB] bg-white p-5 shadow-xl">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-black uppercase tracking-[0.1em] text-[#171327]">Payment Receipt</p>
                        <button type="button" onClick={() => setReceiptModal(false)} className="rounded p-1 hover:bg-slate-100">
                            <X size={16} />
                        </button>
                    </div>
                    {receiptLoading ? (
                        <div className="py-8 text-center">
                            <RefreshCw className="mx-auto h-5 w-5 animate-spin text-[#2717D7]" />
                            <p className="mt-2 text-xs font-bold text-[#615C71]">Loading receipt...</p>
                        </div>
                    ) : receiptError ? (
                        <p className="mt-4 rounded-[6px] bg-[#FDECEC] px-3 py-2 text-[11px] font-bold text-[#B42318]">{receiptError}</p>
                    ) : receiptData ? (
                        <div className="mt-4 grid gap-2 sm:grid-cols-2">
                            <ReceiptField label="Receipt no" value={receiptData.receiptNo} />
                            <ReceiptField label="Amount" value={formatCurrency(receiptData.payment?.amount)} />
                            <ReceiptField label="Mode" value={receiptData.payment?.paymentMode} />
                            <ReceiptField label="Reference" value={receiptData.payment?.referenceNo || '-'} />
                            <ReceiptField label="Collected on" value={receiptData.payment?.paymentDate} />
                            <ReceiptField label="Collected by" value={receiptData.payment?.collectedByName || receiptData.payment?.collectedBy || '-'} />
                            <ReceiptField label="Milestone" value={receiptData.milestone?.title} />
                            <ReceiptField label="Project" value={receiptData.project?.name} />
                        </div>
                    ) : null}
                </div>
            </div>
        )}
        </>
    );
};

const MetricTile = ({ icon: Icon, label, value }) => (
    <div className="min-w-0 rounded-[8px] border border-[#D8D2EB] bg-[#FCFBFF] p-2.5">
        <Icon className="h-3.5 w-3.5 text-[#2717D7]" />
        <p className="mt-1.5 text-[8px] font-black uppercase tracking-[0.1em] text-[#7B7486]">{label}</p>
        <p className="mt-0.5 break-words text-sm font-black leading-5 text-[#171327] xl:text-base">{value}</p>
    </div>
);

const MiniStat = ({ label, value }) => (
    <div className="min-w-0 rounded-[6px] bg-white p-1.5 ring-1 ring-[#E1DDF0]">
        <p className="text-[8px] font-black uppercase text-[#8B8498]">{label}</p>
        <p className="mt-0.5 truncate text-[10px] font-black text-[#171327]">{value}</p>
    </div>
);

const SectionHeader = ({ icon: Icon, title, helper }) => (
    <div className="flex items-start justify-between gap-3 border-b border-[#E1DDF0] pb-2.5">
        <div>
            <p className="text-[11px] font-black uppercase tracking-[0.12em] text-[#5E5A71]">{title}</p>
            <p className="mt-0.5 text-xs font-medium leading-5 text-[#615C71]">{helper}</p>
        </div>
        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-[7px] bg-[#F0EDFF] text-[#2717D7]">
            <Icon size={16} />
        </div>
    </div>
);

const StatusPill = ({ status }) => (
    <span className={`inline-flex rounded-full px-1.5 py-0.5 text-[8px] font-black uppercase ${getStatusClass(status)}`}>
        {status}
    </span>
);

const ReceiptField = ({ label, value }) => (
    <div className="rounded-[7px] border border-[#E1DDF0] bg-[#FCFBFF] p-2.5">
        <p className="text-[8px] font-black uppercase tracking-[0.1em] text-[#8B8498]">{label}</p>
        <p className="mt-1 break-words text-xs font-bold text-[#171327]">{value || '-'}</p>
    </div>
);

const DataTable = ({ icon: Icon, title, helper, columns, rows, emptyMessage = 'No records found.' }) => (
    <div className="rounded-[8px] border border-[#D8D2EB] bg-white p-3">
        <SectionHeader icon={Icon} title={title} helper={helper} />
        <div className="mt-3 grid gap-2">
            {rows.length ? rows.map((row, rowIndex) => (
                <div key={rowIndex} className="grid gap-2 rounded-[8px] border border-[#E1DDF0] bg-[#FCFBFF] p-2.5 sm:grid-cols-2">
                    {row.map((cell, cellIndex) => (
                        <div key={cellIndex} className="min-w-0">
                            <p className="text-[8px] font-black uppercase tracking-[0.1em] text-[#8B8498]">{columns[cellIndex]}</p>
                            <div className="mt-1 break-words text-[11px] font-bold text-[#514B63]">{cell}</div>
                        </div>
                    ))}
                </div>
            )) : (
                <div className="rounded-[8px] border border-[#E1DDF0] bg-[#FCFBFF] p-4 text-center text-xs font-bold text-[#8B8498]">
                    {emptyMessage}
                </div>
            )}
        </div>
    </div>
);

export default PaymentMilestones;

