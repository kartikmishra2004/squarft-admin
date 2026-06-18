import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    BadgeCheck,
    BellRing,
    Bot,
    CalendarClock,
    CreditCard,
    ListChecks,
    Mail,
    MessageSquareText,
    Search,
    Send,
    ShieldAlert,
    Smartphone,
    X,
} from 'lucide-react';
import Header from '../../components/layout/Header';

const DEALS_PER_PAGE = 5;

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
            { id: 'TXN-77101', milestone: 'Token', amount: 100000, mode: 'UPI', collectedOn: '08 Mar 2026', receipt: 'RCT-2026-1007-01', receiptPdfUrl: '/documents/sample-payment-receipt.pdf', collector: 'Project panel' },
            { id: 'TXN-77102', milestone: 'Booking Amount', amount: 650000, mode: 'Bank Transfer', collectedOn: '15 Mar 2026', receipt: 'RCT-2026-1007-02', receiptPdfUrl: '/documents/sample-payment-receipt.pdf', collector: 'Project panel' },
            { id: 'TXN-77103', milestone: 'Agreement', amount: 765000, mode: 'Cheque', collectedOn: '11 Apr 2026', receipt: 'RCT-2026-1007-03', receiptPdfUrl: '/documents/sample-payment-receipt.pdf', collector: 'Admin desk' },
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
            { id: 'TXN-66101', milestone: 'Token', amount: 50000, mode: 'Cash', collectedOn: '10 Feb 2026', receipt: 'RCT-2026-1003-01', receiptPdfUrl: '/documents/sample-payment-receipt.pdf', collector: 'Sales Officer' },
            { id: 'TXN-66102', milestone: 'Booking Amount', amount: 200000, mode: 'Bank Transfer', collectedOn: '01 Mar 2026', receipt: 'RCT-2026-1003-02', receiptPdfUrl: '/documents/sample-payment-receipt.pdf', collector: 'Admin desk' },
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
            { id: 'TXN-44101', milestone: 'Full Settlement', amount: 14850000, mode: 'RTGS', collectedOn: '18 Mar 2026', receipt: 'RCT-2026-1001-04', receiptPdfUrl: '/documents/sample-payment-receipt.pdf', collector: 'Project panel' },
        ],
        reminders: [],
    },
    {
        id: 'INV-DEAL-1002',
        dealCode: 'D0002',
        project: 'Grand Orchards',
        builder: 'Signature Group',
        unit: 'Tower C / Flat 1205',
        propertyType: 'Apartment',
        customer: 'Vikram Aditya',
        customerPhone: '+91 98765 00112',
        customerEmail: 'vikram@example.com',
        salesOfficer: 'Sneha P.',
        broker: 'Nitin Shah',
        status: 'Payment Schedule',
        createdOn: '15 Jan 2026',
        dealValue: 8500000,
        collected: 8500000,
        paymentSchedule: [
            { id: 'MIL-031', title: 'Token', milestone_title: 'Token', total_amount: 500000, collected_amount: 500000, due_date: '2026-01-16', mode: 'UPI', status: 'Paid', receipt_no: 'RCT-2026-1002-01', collected_on: '2026-01-16' },
            { id: 'MIL-032', title: 'Booking Amount', milestone_title: 'Booking Amount', total_amount: 1500000, collected_amount: 1500000, due_date: '2026-02-01', mode: 'RTGS', status: 'Paid', receipt_no: 'RCT-2026-1002-02', collected_on: '2026-01-30' },
            { id: 'MIL-033', title: 'Registry', milestone_title: 'Registry', total_amount: 6500000, collected_amount: 6500000, due_date: '2026-03-01', mode: 'RTGS', status: 'Paid', receipt_no: 'RCT-2026-1002-03', collected_on: '2026-03-01' },
        ],
        transactions: [
            { id: 'TXN-55101', milestone: 'Token', amount: 500000, mode: 'UPI', collectedOn: '16 Jan 2026', receipt: 'RCT-2026-1002-01', receiptPdfUrl: '/documents/sample-payment-receipt.pdf', collector: 'Sneha P.' },
            { id: 'TXN-55102', milestone: 'Booking Amount', amount: 1500000, mode: 'RTGS', collectedOn: '30 Jan 2026', receipt: 'RCT-2026-1002-02', receiptPdfUrl: '/documents/sample-payment-receipt.pdf', collector: 'Sneha P.' },
            { id: 'TXN-55103', milestone: 'Registry', amount: 6500000, mode: 'RTGS', collectedOn: '01 Mar 2026', receipt: 'RCT-2026-1002-03', receiptPdfUrl: '/documents/sample-payment-receipt.pdf', collector: 'Admin desk' },
        ],
        reminders: [],
    },
    {
        id: 'INV-DEAL-1004',
        dealCode: 'D0004',
        project: 'Serene Meadows',
        builder: 'Green Field Estates',
        unit: 'Plot No. 42',
        propertyType: 'Villa Plot',
        customer: 'Rohan Deshmukh',
        customerPhone: '+91 99887 76655',
        customerEmail: 'rohan.d@example.com',
        salesOfficer: 'Project Panel',
        broker: 'Self',
        status: 'Deal In Process',
        createdOn: '12 Apr 2026',
        dealValue: 4000000,
        collected: 1000000,
        paymentSchedule: [
            { id: 'MIL-041', title: 'Token', milestone_title: 'Token', total_amount: 200000, collected_amount: 200000, due_date: '2026-04-15', mode: 'UPI', status: 'Paid', receipt_no: 'RCT-2026-1004-01', collected_on: '2026-04-15' },
            { id: 'MIL-042', title: 'Booking Amount', milestone_title: 'Booking Amount', total_amount: 800000, collected_amount: 800000, due_date: '2026-05-01', mode: 'RTGS', status: 'Paid', receipt_no: 'RCT-2026-1004-02', collected_on: '2026-04-28' },
            { id: 'MIL-043', title: 'Agreement', milestone_title: 'Agreement', total_amount: 1000000, collected_amount: 0, due_date: '2026-07-15', mode: 'Pending', status: 'Upcoming', receipt_no: '', collected_on: '' },
            { id: 'MIL-044', title: 'Registry', milestone_title: 'Registry', total_amount: 2000000, collected_amount: 0, due_date: '2026-12-10', mode: 'Pending', status: 'Upcoming', receipt_no: '', collected_on: '' },
        ],
        transactions: [
            { id: 'TXN-88101', milestone: 'Token', amount: 200000, mode: 'UPI', collectedOn: '15 Apr 2026', receipt: 'RCT-2026-1004-01', receiptPdfUrl: '/documents/sample-payment-receipt.pdf', collector: 'Project Panel' },
            { id: 'TXN-88102', milestone: 'Booking Amount', amount: 800000, mode: 'RTGS', collectedOn: '28 Apr 2026', receipt: 'RCT-2026-1004-02', receiptPdfUrl: '/documents/sample-payment-receipt.pdf', collector: 'Project Panel' },
        ],
        reminders: [
            { id: 'REM-041', channel: 'WhatsApp', sentAt: '15 May 2026, 10:00 AM', message: 'Upcoming payment schedule initialized.', status: 'Delivered' },
        ],
    },
    {
        id: 'INV-DEAL-1005',
        dealCode: 'D0005',
        project: 'Skyline Residency',
        builder: 'Apex Buildcon',
        unit: 'Tower B / Flat 1008',
        propertyType: 'Apartment',
        customer: 'Priya Nair',
        customerPhone: '+91 91234 56789',
        customerEmail: 'priya.nair@example.com',
        salesOfficer: 'Sales Officer',
        broker: 'Anil Nahar',
        status: 'Payment Schedule',
        createdOn: '01 May 2026',
        dealValue: 6500000,
        collected: 500000,
        paymentSchedule: [
            { id: 'MIL-051', title: 'Token', milestone_title: 'Token', total_amount: 500000, collected_amount: 500000, due_date: '2026-05-05', mode: 'UPI', status: 'Paid', receipt_no: 'RCT-2026-1005-01', collected_on: '2026-05-05' },
            { id: 'MIL-052', title: 'Booking Amount', milestone_title: 'Booking Amount', total_amount: 1500000, collected_amount: 0, due_date: '2026-06-05', mode: 'Pending', status: 'Overdue', receipt_no: '', collected_on: '' },
            { id: 'MIL-053', title: 'Registry', milestone_title: 'Registry', total_amount: 4500000, collected_amount: 0, due_date: '2026-08-05', mode: 'Pending', status: 'Upcoming', receipt_no: '', collected_on: '' },
        ],
        transactions: [
            { id: 'TXN-99101', milestone: 'Token', amount: 500000, mode: 'UPI', collectedOn: '05 May 2026', receipt: 'RCT-2026-1005-01', receiptPdfUrl: '/documents/sample-payment-receipt.pdf', collector: 'Sales Officer' },
        ],
        reminders: [
            { id: 'REM-051', channel: 'SMS', sentAt: '06 Jun 2026, 11:00 AM', message: 'Booking amount is overdue by 1 day.', status: 'Sent' },
        ],
    },
    {
        id: 'INV-DEAL-1006',
        dealCode: 'D0006',
        project: 'Metro Heights',
        builder: 'Cityscape Developers',
        unit: 'Tower A / Unit 503',
        propertyType: 'Apartment',
        customer: 'Amit Verma',
        customerPhone: '+91 98989 89898',
        customerEmail: 'amit.verma@example.com',
        salesOfficer: 'Sneha P.',
        broker: 'EcoHomes Channel',
        status: 'Deal In Process',
        createdOn: '10 May 2026',
        dealValue: 5000000,
        collected: 500000,
        paymentSchedule: [
            { id: 'MIL-061', title: 'Token', milestone_title: 'Token', total_amount: 500000, collected_amount: 500000, due_date: '2026-05-12', mode: 'UPI', status: 'Paid', receipt_no: 'RCT-2026-1006-01', collected_on: '2026-05-12' },
            { id: 'MIL-062', title: 'Booking Amount', milestone_title: 'Booking Amount', total_amount: 1500000, collected_amount: 0, due_date: '2026-07-01', mode: 'Pending', status: 'Upcoming', receipt_no: '', collected_on: '' },
            { id: 'MIL-063', title: 'Registry', milestone_title: 'Registry', total_amount: 3000000, collected_amount: 0, due_date: '2026-09-01', mode: 'Pending', status: 'Upcoming', receipt_no: '', collected_on: '' },
        ],
        transactions: [
            { id: 'TXN-33101', milestone: 'Token', amount: 500000, mode: 'UPI', collectedOn: '12 May 2026', receipt: 'RCT-2026-1006-01', receiptPdfUrl: '/documents/sample-payment-receipt.pdf', collector: 'Sneha P.' },
        ],
        reminders: [],
    },
];

const reminderChannels = ['WhatsApp', 'SMS', 'Push', 'Email'];
const filterOptions = ['All', 'Overdue', 'Upcoming', 'Paid'];

const formatCurrency = (amount) => `Rs ${Number(amount || 0).toLocaleString('en-IN')}`;

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
    const [selectedDealId, setSelectedDealId] = useState(paymentDeals[0].id);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [dateFilter, setDateFilter] = useState('');
    const [channel, setChannel] = useState('WhatsApp');
    const [tone, setTone] = useState('Firm');
    const [page, setPage] = useState(1);
    const [viewMode, setViewMode] = useState('list');
    const [scheduleFilter, setScheduleFilter] = useState('All');

    const enrichedDeals = useMemo(() => paymentDeals.map((deal) => {
        const total = deal.paymentSchedule.reduce((sum, item) => sum + getMilestoneAmount(item), 0) || deal.dealValue;
        const collected = deal.paymentSchedule.reduce((sum, item) => sum + getCollectedAmount(item), 0);
        const pending = Math.max(total - collected, 0);
        const nextMilestone = deal.paymentSchedule.find((item) => getRemainingAmount(item) > 0);
        const progress = total > 0 ? Math.round((collected / total) * 100) : 0;
        const dealStatus = nextMilestone ? nextMilestone.status : 'Paid';

        return { ...deal, total, collected, pending, nextMilestone, progress, dealStatus };
    }), []);

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
    const totalPages = Math.max(1, Math.ceil(filteredDeals.length / DEALS_PER_PAGE));
    const currentPage = Math.min(page, totalPages);
    const paginatedDeals = filteredDeals.slice((currentPage - 1) * DEALS_PER_PAGE, currentPage * DEALS_PER_PAGE);
    const visibleSchedule = selectedDeal.paymentSchedule.filter((item) => {
        if (scheduleFilter === 'Pending') return getRemainingAmount(item) > 0;
        if (scheduleFilter === 'Complete') return getRemainingAmount(item) === 0;
        return true;
    });
    const reminderTarget = selectedDeal.nextMilestone || selectedDeal.paymentSchedule[selectedDeal.paymentSchedule.length - 1];
    const reminderMessage = `${tone} reminder: Dear ${selectedDeal.customer}, ${reminderTarget?.title || 'payment'} for ${selectedDeal.project} ${selectedDeal.unit} has ${reminderTarget?.status === 'Overdue' ? 'crossed the due date' : 'an upcoming due date'} of ${reminderTarget?.due_date || 'the scheduled date'}. Pending amount is ${formatCurrency(getRemainingAmount(reminderTarget || {}))}. Please complete payment or contact SquarFT support.`;

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
                    tone,
                },
            },
        });
    };

    const portfolio = enrichedDeals.reduce((summary, deal) => ({
        deals: summary.deals + 1,
        collected: summary.collected + deal.collected,
        pending: summary.pending + deal.pending,
        overdue: summary.overdue + deal.paymentSchedule.filter((item) => item.status === 'Overdue').length,
    }), { deals: 0, collected: 0, pending: 0, overdue: 0 });

    return (
        <div className="flex h-full flex-1 flex-col bg-[#F5F6FA] text-[#15121F]">
            <Header title="Payment Milestones" />

            <main className="flex-1 overflow-y-auto p-3 md:p-4">
                <div className="mx-auto max-w-[1600px] space-y-3">
                    <section className="rounded-[8px] border border-[#D8D2EB] bg-white p-3 shadow-[0_1px_0_rgba(33,24,88,0.03)]">
                        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                            <div>
                                <div className="flex flex-wrap items-center gap-1.5">
                                    <span className="rounded-full bg-[#E8E4FF] px-2 py-0.5 text-[8px] font-black uppercase tracking-[0.1em] text-[#2717D7]">Project panel aligned</span>
                                    <span className="rounded-full bg-[#E9F8EF] px-2 py-0.5 text-[8px] font-black uppercase tracking-[0.1em] text-[#04622E]">Collection + reminder control</span>
                                </div>
                                <h2 className="mt-2 text-lg font-black text-[#171327]">Payment schedule and milestone collection</h2>
                                <p className="mt-1 max-w-3xl text-xs font-medium leading-5 text-[#615C71]">
                                    Track deal-wise payment schedules, milestone due dates, collection progress, receipts, transactions, and AI-assisted payment reminders.
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

                    {viewMode === 'detail' && (
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
                                    <SectionHeader icon={CreditCard} title="Payment Milestone Manager" helper="Deal-manager style schedule view without add or edit controls." />
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
                                        </div>
                                    </div>

                                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                                        <h3 className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.1em] text-[#171327]">
                                            <ListChecks className="h-3.5 w-3.5 text-emerald-500" /> Payment Schedule Details
                                        </h3>
                                        <div className="flex flex-wrap items-center gap-1.5">
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
                                            <table className="w-full min-w-[680px] text-left">
                                                <thead className="bg-[#F8F9FF] text-[9px] font-black uppercase tracking-[0.1em] text-[#7B7486]">
                                                    <tr>
                                                        <th className="px-3 py-2">#</th>
                                                        <th className="px-3 py-2">Milestone</th>
                                                        <th className="px-3 py-2">Amount</th>
                                                        <th className="px-3 py-2">Due Date</th>
                                                        <th className="px-3 py-2">Mode</th>
                                                        <th className="px-3 py-2">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-[#EFEAF8] bg-white">
                                                    {visibleSchedule.map((milestone, index) => (
                                                        <tr key={milestone.id} className="hover:bg-[#FCFBFF]">
                                                            <td className="px-3 py-3 text-[10px] font-black text-[#8B8498]">{index + 1}</td>
                                                            <td className="px-3 py-3 text-xs font-black uppercase tracking-tight text-[#171327]">{milestone.milestone_title || milestone.title}</td>
                                                            <td className="px-3 py-3 text-xs font-black text-[#171327]">{formatCurrency(getMilestoneAmount(milestone))}</td>
                                                            <td className="px-3 py-3 text-[10px] font-bold text-[#615C71]">{milestone.due_date}</td>
                                                            <td className="px-3 py-3 text-[9px] font-black uppercase tracking-wider text-[#8B8498]">{milestone.mode}</td>
                                                            <td className="px-3 py-3"><StatusPill status={milestone.status} /></td>
                                                        </tr>
                                                    ))}
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
                                    <SectionHeader icon={Bot} title="AI payment reminder" helper="Draft reminder copy for overdue or upcoming milestones." />
                                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                                        <SelectField label="Channel" value={channel} onChange={setChannel} options={reminderChannels} />
                                        <SelectField label="Tone" value={tone} onChange={setTone} options={['Firm', 'Friendly', 'Final notice']} />
                                    </div>
                                    <div className="mt-3 rounded-[8px] border border-[#E1DDF0] bg-[#FCFBFF] p-3">
                                        <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.1em] text-[#2717D7]">
                                            {channel === 'WhatsApp' && <MessageSquareText size={13} />}
                                            {channel === 'SMS' && <Smartphone size={13} />}
                                            {channel === 'Push' && <BellRing size={13} />}
                                            {channel === 'Email' && <Mail size={13} />}
                                            {channel} preview
                                        </div>
                                        <p className="mt-2 text-xs font-bold leading-5 text-[#2A2535]">{reminderMessage}</p>
                                    </div>
                                    <button
                                        type="button"
                                        className="mt-3 inline-flex h-9 w-full items-center justify-center gap-2 rounded-[7px] bg-[#2717D7] px-3 text-[10px] font-black uppercase tracking-[0.1em] text-white"
                                    >
                                        <Send size={14} /> Queue reminder
                                    </button>
                                </div>
                            </div>

                            <div className="grid gap-3">
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
                    )}
                </div>
            </main>
        </div>
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

const SelectField = ({ label, value, onChange, options }) => (
    <label className="block">
        <span className="text-[9px] font-black uppercase tracking-[0.1em] text-[#6B657A]">{label}</span>
        <select
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className="mt-1 h-9 w-full rounded-[7px] border border-[#D8D2EB] bg-[#FCFBFF] px-2.5 text-xs font-black outline-none focus:ring-2 focus:ring-[#2717D7]/20"
        >
            {options.map((option) => (
                <option key={option} value={option}>{option}</option>
            ))}
        </select>
    </label>
);

const DataTable = ({ icon: Icon, title, helper, columns, rows }) => (
    <div className="rounded-[8px] border border-[#D8D2EB] bg-white p-3">
        <SectionHeader icon={Icon} title={title} helper={helper} />
        <div className="mt-3 grid gap-2">
            {rows.map((row, rowIndex) => (
                <div key={rowIndex} className="grid gap-2 rounded-[8px] border border-[#E1DDF0] bg-[#FCFBFF] p-2.5 sm:grid-cols-2">
                    {row.map((cell, cellIndex) => (
                        <div key={cellIndex} className="min-w-0">
                            <p className="text-[8px] font-black uppercase tracking-[0.1em] text-[#8B8498]">{columns[cellIndex]}</p>
                            <div className="mt-1 break-words text-[11px] font-bold text-[#514B63]">{cell}</div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    </div>
);

export default PaymentMilestones;
