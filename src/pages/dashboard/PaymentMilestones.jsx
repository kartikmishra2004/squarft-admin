import { useMemo, useState } from 'react';
import {
    BadgeCheck,
    Banknote,
    BellRing,
    Bot,
    CalendarClock,
    CheckCircle2,
    CircleDollarSign,
    CreditCard,
    FileText,
    Home,
    IndianRupee,
    ListChecks,
    Mail,
    MessageSquareText,
    Phone,
    ReceiptText,
    Search,
    Send,
    ShieldAlert,
    Smartphone,
    UserRound,
} from 'lucide-react';
import Header from '../../components/layout/Header';

const paymentDeals = [
    {
        id: 'INV-DEAL-1007',
        dealCode: 'D0007',
        project: 'Skyline Residency',
        builder: 'Apex Buildcon',
        unit: 'Tower A / Flat 402',
        propertyType: 'Apartment',
        customer: 'Geheve Sharma',
        customerPhone: '+91 91659 93939',
        customerEmail: 'geheve@example.com',
        salesOfficer: 'Sales Officer',
        broker: 'Anil Nahar',
        status: 'Payment Schedule',
        createdOn: '07 Mar 2026',
        dealValue: 5250000,
        collected: 1515000,
        paymentSchedule: [
            { id: 'MIL-001', title: 'Token', milestone_title: 'Token', total_amount: 100000, collected_amount: 100000, due_date: '2026-03-08', mode: 'UPI', status: 'Paid', receipt_no: 'RCT-2026-1007-01', collected_on: '2026-03-08' },
            { id: 'MIL-002', title: 'Booking Amount', milestone_title: 'Booking Amount', total_amount: 650000, collected_amount: 650000, due_date: '2026-03-15', mode: 'Bank Transfer', status: 'Paid', receipt_no: 'RCT-2026-1007-02', collected_on: '2026-03-15' },
            { id: 'MIL-003', title: 'Agreement', milestone_title: 'Agreement', total_amount: 765000, collected_amount: 765000, due_date: '2026-04-10', mode: 'Cheque', status: 'Paid', receipt_no: 'RCT-2026-1007-03', collected_on: '2026-04-11' },
            { id: 'MIL-004', title: 'Plinth Completion', milestone_title: 'Plinth Completion', total_amount: 1250000, collected_amount: 0, due_date: '2026-06-10', mode: 'Pending', status: 'Overdue', receipt_no: '', collected_on: '' },
            { id: 'MIL-005', title: 'Registry', milestone_title: 'Registry', total_amount: 2485000, collected_amount: 0, due_date: '2026-08-20', mode: 'Pending', status: 'Upcoming', receipt_no: '', collected_on: '' },
        ],
        transactions: [
            { id: 'TXN-77101', milestone: 'Token', amount: 100000, mode: 'UPI', collectedOn: '08 Mar 2026', receipt: 'RCT-2026-1007-01', collector: 'Project panel' },
            { id: 'TXN-77102', milestone: 'Booking Amount', amount: 650000, mode: 'Bank Transfer', collectedOn: '15 Mar 2026', receipt: 'RCT-2026-1007-02', collector: 'Project panel' },
            { id: 'TXN-77103', milestone: 'Agreement', amount: 765000, mode: 'Cheque', collectedOn: '11 Apr 2026', receipt: 'RCT-2026-1007-03', collector: 'Admin desk' },
        ],
        reminders: [
            { id: 'REM-001', channel: 'WhatsApp', sentAt: '09 Jun 2026, 11:20 AM', message: 'Plinth Completion payment due tomorrow.', status: 'Delivered' },
            { id: 'REM-002', channel: 'Push', sentAt: '10 Jun 2026, 09:00 AM', message: 'Payment milestone is due today.', status: 'Opened' },
        ],
    },
    {
        id: 'INV-DEAL-1003',
        dealCode: 'D0003',
        project: 'Green Valley Phase 2',
        builder: 'EcoHomes Channel',
        unit: 'Villa Plot / B-17',
        propertyType: 'Villa Plot',
        customer: 'Anil Nahar',
        customerPhone: '+91 98765 43210',
        customerEmail: 'anil@example.com',
        salesOfficer: 'Sales Officer',
        broker: 'Anil',
        status: 'Deal In Process',
        createdOn: '09 Feb 2026',
        dealValue: 2400000,
        collected: 250000,
        paymentSchedule: [
            { id: 'MIL-011', title: 'Token', milestone_title: 'Token', total_amount: 50000, collected_amount: 50000, due_date: '2026-02-10', mode: 'Cash', status: 'Paid', receipt_no: 'RCT-2026-1003-01', collected_on: '2026-02-10' },
            { id: 'MIL-012', title: 'Booking Amount', milestone_title: 'Booking Amount', total_amount: 200000, collected_amount: 200000, due_date: '2026-03-15', mode: 'Bank Transfer', status: 'Paid', receipt_no: 'RCT-2026-1003-02', collected_on: '2026-03-01' },
            { id: 'MIL-013', title: 'Agreement', milestone_title: 'Agreement', total_amount: 350000, collected_amount: 0, due_date: '2026-04-05', mode: 'Pending', status: 'Overdue', receipt_no: '', collected_on: '' },
            { id: 'MIL-014', title: 'Registry', milestone_title: 'Registry', total_amount: 1800000, collected_amount: 0, due_date: '2026-07-25', mode: 'Pending', status: 'Upcoming', receipt_no: '', collected_on: '' },
        ],
        transactions: [
            { id: 'TXN-66101', milestone: 'Token', amount: 50000, mode: 'Cash', collectedOn: '10 Feb 2026', receipt: 'RCT-2026-1003-01', collector: 'Sales Officer' },
            { id: 'TXN-66102', milestone: 'Booking Amount', amount: 200000, mode: 'Bank Transfer', collectedOn: '01 Mar 2026', receipt: 'RCT-2026-1003-02', collector: 'Admin desk' },
        ],
        reminders: [
            { id: 'REM-011', channel: 'SMS', sentAt: '04 Apr 2026, 05:00 PM', message: 'Agreement amount due tomorrow.', status: 'Sent' },
        ],
    },
    {
        id: 'INV-DEAL-1001',
        dealCode: 'D0001',
        project: 'Metro Heights',
        builder: 'Cityscape Developers',
        unit: 'Tower B / Unit 1102',
        propertyType: 'Apartment',
        customer: 'Meera Kapoor',
        customerPhone: '+91 99000 99000',
        customerEmail: 'meera@example.com',
        salesOfficer: 'Sneha P.',
        broker: 'EcoHomes Channel',
        status: 'Deal Completed',
        createdOn: '01 Feb 2026',
        dealValue: 14850000,
        collected: 14850000,
        paymentSchedule: [
            { id: 'MIL-021', title: 'Token', milestone_title: 'Token', total_amount: 250000, collected_amount: 250000, due_date: '2026-02-02', mode: 'UPI', status: 'Paid', receipt_no: 'RCT-2026-1001-01', collected_on: '2026-02-02' },
            { id: 'MIL-022', title: 'Booking Amount', milestone_title: 'Booking Amount', total_amount: 1250000, collected_amount: 1250000, due_date: '2026-02-05', mode: 'RTGS', status: 'Paid', receipt_no: 'RCT-2026-1001-02', collected_on: '2026-02-05' },
            { id: 'MIL-023', title: 'Agreement', milestone_title: 'Agreement', total_amount: 3350000, collected_amount: 3350000, due_date: '2026-02-20', mode: 'RTGS', status: 'Paid', receipt_no: 'RCT-2026-1001-03', collected_on: '2026-02-20' },
            { id: 'MIL-024', title: 'Registry', milestone_title: 'Registry', total_amount: 10000000, collected_amount: 10000000, due_date: '2026-03-18', mode: 'RTGS', status: 'Paid', receipt_no: 'RCT-2026-1001-04', collected_on: '2026-03-18' },
        ],
        transactions: [
            { id: 'TXN-44101', milestone: 'Full Settlement', amount: 14850000, mode: 'RTGS', collectedOn: '18 Mar 2026', receipt: 'RCT-2026-1001-04', collector: 'Project panel' },
        ],
        reminders: [],
    },
];

const reminderChannels = ['WhatsApp', 'SMS', 'Push', 'Email'];
const filterOptions = ['All', 'Overdue', 'Upcoming', 'Paid'];

const formatCurrency = (amount) => `Rs ${Number(amount || 0).toLocaleString('en-IN')}`;
const formatCompactCurrency = (amount) => {
    const value = Number(amount || 0);
    if (Math.abs(value) >= 10000000) return `Rs ${(value / 10000000).toFixed(value % 10000000 === 0 ? 0 : 2)} Cr`;
    if (Math.abs(value) >= 100000) return `Rs ${(value / 100000).toFixed(value % 100000 === 0 ? 0 : 2)} L`;
    return formatCurrency(value);
};

const getMilestoneAmount = (milestone) => Number(milestone.total_amount || milestone.totalAmount || milestone.amount || milestone.milestone_amount || 0);
const getCollectedAmount = (milestone) => Number(milestone.collected_amount || milestone.collectedAmount || milestone.paid_amount || milestone.received_amount || 0);
const getRemainingAmount = (milestone) => Math.max(getMilestoneAmount(milestone) - getCollectedAmount(milestone), 0);

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

const PaymentMilestones = () => {
    const [selectedDealId, setSelectedDealId] = useState(paymentDeals[0].id);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [channel, setChannel] = useState('WhatsApp');
    const [tone, setTone] = useState('Firm');

    const enrichedDeals = useMemo(() => paymentDeals.map((deal) => {
        const total = deal.paymentSchedule.reduce((sum, item) => sum + getMilestoneAmount(item), 0) || deal.dealValue;
        const collected = deal.paymentSchedule.reduce((sum, item) => sum + getCollectedAmount(item), 0);
        const pending = Math.max(total - collected, 0);
        const nextMilestone = deal.paymentSchedule.find((item) => getRemainingAmount(item) > 0);
        const progress = total > 0 ? Math.round((collected / total) * 100) : 0;

        return { ...deal, total, collected, pending, nextMilestone, progress };
    }), []);

    const filteredDeals = useMemo(() => {
        const query = search.trim().toLowerCase();
        return enrichedDeals.filter((deal) => {
            const matchesSearch = !query
                || deal.customer.toLowerCase().includes(query)
                || deal.dealCode.toLowerCase().includes(query)
                || deal.project.toLowerCase().includes(query)
                || deal.unit.toLowerCase().includes(query);
            const matchesFilter = statusFilter === 'All' || deal.paymentSchedule.some((item) => item.status === statusFilter);
            return matchesSearch && matchesFilter;
        });
    }, [enrichedDeals, search, statusFilter]);

    const selectedDeal = enrichedDeals.find((deal) => deal.id === selectedDealId) || filteredDeals[0] || enrichedDeals[0];
    const visibleSchedule = selectedDeal.paymentSchedule.filter((item) => statusFilter === 'All' || item.status === statusFilter);
    const reminderTarget = selectedDeal.nextMilestone || selectedDeal.paymentSchedule[selectedDeal.paymentSchedule.length - 1];
    const reminderMessage = `${tone} reminder: Dear ${selectedDeal.customer}, ${reminderTarget?.title || 'payment'} for ${selectedDeal.project} ${selectedDeal.unit} has ${reminderTarget?.status === 'Overdue' ? 'crossed the due date' : 'an upcoming due date'} of ${reminderTarget?.due_date || 'the scheduled date'}. Pending amount is ${formatCurrency(getRemainingAmount(reminderTarget || {}))}. Please complete payment or contact SquarFT support.`;

    const portfolio = enrichedDeals.reduce((summary, deal) => ({
        deals: summary.deals + 1,
        collected: summary.collected + deal.collected,
        pending: summary.pending + deal.pending,
        overdue: summary.overdue + deal.paymentSchedule.filter((item) => item.status === 'Overdue').length,
    }), { deals: 0, collected: 0, pending: 0, overdue: 0 });

    return (
        <div className="flex h-full flex-1 flex-col bg-[#F5F6FA] text-[#15121F]">
            <Header title="Payment Milestones" />

            <main className="flex-1 overflow-y-auto p-6 md:p-8">
                <div className="mx-auto max-w-[1600px] space-y-5">
                    <section className="rounded-[10px] border border-[#D8D2EB] bg-white p-5 shadow-[0_1px_0_rgba(33,24,88,0.03)]">
                        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="rounded-full bg-[#E8E4FF] px-3 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-[#2717D7]">Project panel aligned</span>
                                    <span className="rounded-full bg-[#E9F8EF] px-3 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-[#04622E]">Collection + reminder control</span>
                                </div>
                                <h2 className="mt-3 text-2xl font-black text-[#171327]">Payment schedule and milestone collection</h2>
                                <p className="mt-1 max-w-3xl text-sm font-medium leading-6 text-[#615C71]">
                                    Track deal-wise payment schedules, milestone due dates, collection progress, receipts, transactions, and AI-assisted payment reminders.
                                </p>
                            </div>
                            <div className="grid gap-3 sm:grid-cols-2 xl:min-w-[560px] xl:grid-cols-4">
                                <MetricTile icon={ListChecks} label="Deals" value={portfolio.deals} />
                                <MetricTile icon={BadgeCheck} label="Collected" value={formatCurrency(portfolio.collected)} />
                                <MetricTile icon={ShieldAlert} label="Pending" value={formatCurrency(portfolio.pending)} />
                                <MetricTile icon={CalendarClock} label="Overdue" value={portfolio.overdue} />
                            </div>
                        </div>
                    </section>

                    <div className="grid gap-5 xl:grid-cols-[380px_1fr]">
                        <aside className="space-y-5">
                            <section className="rounded-[10px] border border-[#D8D2EB] bg-white p-4">
                                <div className="flex items-center gap-2 rounded-[8px] border border-[#D8D2EB] bg-[#FCFBFF] px-3">
                                    <Search size={16} className="text-[#7B7486]" />
                                    <input
                                        value={search}
                                        onChange={(event) => setSearch(event.target.value)}
                                        placeholder="Search deal, customer, project"
                                        className="h-11 min-w-0 flex-1 bg-transparent text-sm font-medium outline-none"
                                    />
                                </div>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {filterOptions.map((option) => (
                                        <button
                                            key={option}
                                            type="button"
                                            onClick={() => setStatusFilter(option)}
                                            className={`rounded-[8px] border px-3 py-2 text-[10px] font-black uppercase tracking-[0.1em] ${statusFilter === option ? 'border-[#2717D7] bg-[#2717D7] text-white' : 'border-[#D8D2EB] bg-[#FCFBFF] text-[#514B63]'}`}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>

                                <div className="mt-4 space-y-3">
                                    {filteredDeals.map((deal) => {
                                        const selected = selectedDeal.id === deal.id;
                                        return (
                                            <button
                                                key={deal.id}
                                                type="button"
                                                onClick={() => setSelectedDealId(deal.id)}
                                                className={`w-full rounded-[10px] border p-4 text-left transition-all ${selected ? 'border-[#2717D7] bg-[#F4F1FF]' : 'border-[#E1DDF0] bg-white hover:border-[#2717D7]'}`}
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="min-w-0">
                                                        <p className="truncate text-sm font-black text-[#171327]">{deal.dealCode} / {deal.customer}</p>
                                                        <p className="mt-1 truncate text-xs font-bold text-[#615C71]">{deal.project} / {deal.unit}</p>
                                                    </div>
                                                    <StatusPill status={deal.nextMilestone?.status || 'Paid'} />
                                                </div>
                                                <div className="mt-4 h-2 rounded-full bg-[#E4E0F2]">
                                                    <div className="h-2 rounded-full bg-[#2717D7]" style={{ width: `${deal.progress}%` }} />
                                                </div>
                                                <div className="mt-3 grid grid-cols-3 gap-2">
                                                    <MiniStat label="Paid" value={`${deal.progress}%`} />
                                                    <MiniStat label="Pending" value={formatCurrency(deal.pending)} />
                                                    <MiniStat label="Next" value={deal.nextMilestone?.title || 'Clear'} />
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </section>
                        </aside>

                        <section className="space-y-5">
                            <div className="grid gap-5 lg:grid-cols-[1fr_420px]">
                                <div className="rounded-[10px] border border-[#D8D2EB] bg-white p-5">
                                    <SectionHeader icon={Home} title="Deal payment details" helper="Deal summary mirrors the project-panel payment schedule modal." />
                                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                                        <DetailItem icon={UserRound} label="Customer" value={selectedDeal.customer} helper={selectedDeal.customerPhone} />
                                        <DetailItem icon={Home} label="Project unit" value={selectedDeal.project} helper={selectedDeal.unit} />
                                        <DetailItem icon={FileText} label="Deal" value={selectedDeal.dealCode} helper={`${selectedDeal.status} / ${selectedDeal.createdOn}`} />
                                        <DetailItem icon={Phone} label="Owner team" value={selectedDeal.salesOfficer} helper={`Broker: ${selectedDeal.broker}`} />
                                    </div>
                                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                        <MetricTile icon={IndianRupee} label="Deal value" value={formatCompactCurrency(selectedDeal.dealValue)} />
                                        <MetricTile icon={CheckCircle2} label="Collected" value={formatCompactCurrency(selectedDeal.collected)} />
                                        <MetricTile icon={CircleDollarSign} label="Pending" value={formatCompactCurrency(selectedDeal.pending)} />
                                        <MetricTile icon={CalendarClock} label="Progress" value={`${selectedDeal.progress}%`} />
                                    </div>
                                </div>

                                <div className="rounded-[10px] border border-[#D8D2EB] bg-white p-5">
                                    <SectionHeader icon={Bot} title="AI payment reminder" helper="Draft reminder copy for overdue or upcoming milestones." />
                                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                        <SelectField label="Channel" value={channel} onChange={setChannel} options={reminderChannels} />
                                        <SelectField label="Tone" value={tone} onChange={setTone} options={['Firm', 'Friendly', 'Final notice']} />
                                    </div>
                                    <div className="mt-4 rounded-[10px] border border-[#E1DDF0] bg-[#FCFBFF] p-4">
                                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.12em] text-[#2717D7]">
                                            {channel === 'WhatsApp' && <MessageSquareText size={15} />}
                                            {channel === 'SMS' && <Smartphone size={15} />}
                                            {channel === 'Push' && <BellRing size={15} />}
                                            {channel === 'Email' && <Mail size={15} />}
                                            {channel} preview
                                        </div>
                                        <p className="mt-3 text-sm font-bold leading-6 text-[#2A2535]">{reminderMessage}</p>
                                    </div>
                                    <button
                                        type="button"
                                        className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-[8px] bg-[#2717D7] px-4 text-xs font-black uppercase tracking-[0.12em] text-white"
                                    >
                                        <Send size={16} /> Queue reminder
                                    </button>
                                </div>
                            </div>

                            <div className="rounded-[10px] border border-[#D8D2EB] bg-white p-5">
                                <SectionHeader icon={CreditCard} title="Milestone schedule" helper="Normalized from project-panel fields: payment_schedule, milestone_title, due_date, collected_amount, and receipt details." />
                                <div className="mt-4 grid gap-3 xl:grid-cols-2">
                                    {visibleSchedule.map((milestone, index) => {
                                        const total = getMilestoneAmount(milestone);
                                        const collected = getCollectedAmount(milestone);
                                        const remaining = getRemainingAmount(milestone);
                                        const percent = total > 0 ? Math.round((collected / total) * 100) : 0;
                                        return (
                                            <div key={milestone.id} className="rounded-[10px] border border-[#E1DDF0] bg-[#FCFBFF] p-4">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div>
                                                        <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#8B8498]">Milestone {index + 1}</p>
                                                        <p className="mt-1 text-base font-black text-[#171327]">{milestone.milestone_title || milestone.title}</p>
                                                    </div>
                                                    <StatusPill status={milestone.status} />
                                                </div>
                                                <div className="mt-4 h-2 rounded-full bg-[#E4E0F2]">
                                                    <div className="h-2 rounded-full bg-[#0C6B39]" style={{ width: `${percent}%` }} />
                                                </div>
                                                <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4">
                                                    <MiniStat label="Total" value={formatCurrency(total)} />
                                                    <MiniStat label="Collected" value={formatCurrency(collected)} />
                                                    <MiniStat label="Remaining" value={formatCurrency(remaining)} />
                                                    <MiniStat label="Due" value={milestone.due_date} />
                                                </div>
                                                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#E1DDF0] pt-3">
                                                    <p className="text-xs font-bold text-[#615C71]">Mode: {milestone.mode} / Receipt: {milestone.receipt_no || 'Not generated'}</p>
                                                    <button
                                                        type="button"
                                                        disabled={remaining === 0}
                                                        className="inline-flex h-9 items-center gap-2 rounded-[8px] bg-[#2717D7] px-3 text-[10px] font-black uppercase tracking-[0.1em] text-white disabled:cursor-not-allowed disabled:bg-[#C8C2E8]"
                                                    >
                                                        <Banknote size={14} /> Collect
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="grid gap-5 xl:grid-cols-2">
                                <DataTable
                                    icon={ReceiptText}
                                    title="Payment collection history"
                                    helper="Collected milestone transactions and receipt trail."
                                    columns={['Milestone', 'Amount', 'Mode', 'Receipt']}
                                    rows={selectedDeal.transactions.map((transaction) => [
                                        <div key="milestone">
                                            <p className="font-black text-[#171327]">{transaction.milestone}</p>
                                            <p className="mt-1 text-[10px] font-bold text-[#615C71]">{transaction.id} / {transaction.collectedOn}</p>
                                        </div>,
                                        <span key="amount" className="font-black text-[#0C6B39]">{formatCurrency(transaction.amount)}</span>,
                                        transaction.mode,
                                        <div key="receipt">
                                            <p className="font-black text-[#171327]">{transaction.receipt}</p>
                                            <p className="mt-1 text-[10px] font-bold text-[#615C71]">{transaction.collector}</p>
                                        </div>,
                                    ])}
                                />

                                <DataTable
                                    icon={BellRing}
                                    title="Reminder history"
                                    helper="Customer reminder attempts for due payment milestones."
                                    columns={['Channel', 'Message', 'Sent at', 'Status']}
                                    rows={(selectedDeal.reminders.length ? selectedDeal.reminders : [{ id: 'NO-REM', channel: 'None', message: 'No reminders sent for this deal yet.', sentAt: '-', status: 'Clear' }]).map((reminder) => [
                                        reminder.channel,
                                        reminder.message,
                                        reminder.sentAt,
                                        <StatusPill key="status" status={reminder.status} />,
                                    ])}
                                />
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
};

const MetricTile = ({ icon: Icon, label, value }) => (
    <div className="min-w-0 rounded-[10px] border border-[#D8D2EB] bg-[#FCFBFF] p-3">
        <Icon className="h-4 w-4 text-[#2717D7]" />
        <p className="mt-2 text-[9px] font-black uppercase tracking-[0.12em] text-[#7B7486]">{label}</p>
        <p className="mt-1 break-words text-base font-black leading-5 text-[#171327] xl:text-lg">{value}</p>
    </div>
);

const MiniStat = ({ label, value }) => (
    <div className="min-w-0 rounded-[7px] bg-white p-2 ring-1 ring-[#E1DDF0]">
        <p className="text-[8px] font-black uppercase text-[#8B8498]">{label}</p>
        <p className="mt-1 truncate text-[10px] font-black text-[#171327]">{value}</p>
    </div>
);

const SectionHeader = ({ icon: Icon, title, helper }) => (
    <div className="flex items-start justify-between gap-4 border-b border-[#E1DDF0] pb-4">
        <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#5E5A71]">{title}</p>
            <p className="mt-1 text-sm font-medium text-[#615C71]">{helper}</p>
        </div>
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-[8px] bg-[#F0EDFF] text-[#2717D7]">
            <Icon size={19} />
        </div>
    </div>
);

const DetailItem = ({ icon: Icon, label, value, helper }) => (
    <div className="min-w-0 rounded-[10px] border border-[#E1DDF0] bg-[#FCFBFF] p-4">
        <div className="flex items-start gap-3">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-[8px] bg-[#F0EDFF] text-[#2717D7]">
                <Icon className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-[9px] font-black uppercase tracking-[0.12em] text-[#8B8498]">{label}</p>
                <p className="mt-1 break-words text-sm font-black leading-5 text-[#171327]">{value}</p>
                <p className="mt-1 break-words text-[11px] font-bold leading-4 text-[#615C71]">{helper}</p>
            </div>
        </div>
    </div>
);

const StatusPill = ({ status }) => (
    <span className={`inline-flex rounded-full px-2 py-1 text-[9px] font-black uppercase ${getStatusClass(status)}`}>
        {status}
    </span>
);

const SelectField = ({ label, value, onChange, options }) => (
    <label className="block">
        <span className="text-[10px] font-black uppercase tracking-[0.12em] text-[#6B657A]">{label}</span>
        <select
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className="mt-1 h-11 w-full rounded-[8px] border border-[#D8D2EB] bg-[#FCFBFF] px-3 text-sm font-black outline-none focus:ring-2 focus:ring-[#2717D7]/20"
        >
            {options.map((option) => (
                <option key={option} value={option}>{option}</option>
            ))}
        </select>
    </label>
);

const DataTable = ({ icon: Icon, title, helper, columns, rows }) => (
    <div className="rounded-[10px] border border-[#D8D2EB] bg-white p-5">
        <SectionHeader icon={Icon} title={title} helper={helper} />
        <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[620px] text-left">
                <thead className="bg-[#F4F1FF] text-[10px] font-black uppercase tracking-[0.12em] text-[#2A2535]">
                    <tr>
                        {columns.map((column) => (
                            <th key={column} className="px-4 py-3">{column}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, rowIndex) => (
                        <tr key={rowIndex} className="border-t border-[#E1DDF0] text-xs font-bold text-[#514B63]">
                            {row.map((cell, cellIndex) => (
                                <td key={cellIndex} className="px-4 py-4 align-top">{cell}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

export default PaymentMilestones;
