import { useMemo, useState } from 'react';
import {
    BadgeIndianRupee,
    Banknote,
    BriefcaseBusiness,
    Building2,
    CheckCircle2,
    Clock3,
    CreditCard,
    FileCheck2,
    Home,
    Landmark,
    ListFilter,
    MapPin,
    Phone,
    Search,
    Send,
    ShieldCheck,
    UserRound,
} from 'lucide-react';
import Header from '../../components/layout/Header';

const brokerCommissionData = [
    {
        id: 'BRK-1024',
        name: 'Anil Nahar',
        agency: 'Aarambh Realty',
        mobile: '+91 91659 93939',
        email: 'anil@squarftbroker.in',
        city: 'Indore',
        area: 'Mahalakshmi Nagar',
        kycStatus: 'Approved',
        brokerStatus: 'Active',
        joinedOn: '05 Mar 2026',
        stats: { total_properties: 12, sales: 7, pending: 3, rejected: 2 },
        wallet: {
            balance: 1423534,
            totalEarned: 5280000,
            totalWithdrawn: 3856466,
            lockedAmount: 185000,
            withdrawalPending: 250000,
        },
        bankAccounts: [
            { id: 'BANK-01', bankName: 'Bank of India', accountNumberMasked: 'xxxxxxxx6789', ifsc: 'BKID0008891', primary: true, status: 'Verified' },
            { id: 'BANK-02', bankName: 'HDFC Bank', accountNumberMasked: 'xxxxxxxx1234', ifsc: 'HDFC0002401', primary: false, status: 'Review' },
        ],
        uploadedProperties: [
            { id: 'PROP-001', name: 'Sunset Villa', category: 'Residential', type: 'Villa', location: 'Mahalakshmi Nagar, Indore', price: 2510000, status: 'Approved', photos: 8, documents: 3, uploadedOn: '12 Jun 2026' },
            { id: 'PROP-002', name: 'Fully Furnished 1 BHK Flat', category: 'Residential', type: 'Apartment', location: 'Vijay Nagar, Indore', price: 3050000, status: 'Pending', photos: 6, documents: 2, uploadedOn: '13 Jun 2026' },
            { id: 'PROP-003', name: 'City Center Office Space', category: 'Commercial', type: 'Office', location: 'MG Road, Indore', price: 9500000, status: 'Rejected', photos: 5, documents: 1, uploadedOn: '10 Jun 2026' },
        ],
        commissions: [
            { id: 'COM-001', propertyName: 'Sunset Villa', location: 'Mahalakshmi Nagar, Indore', saleValue: 2510000, rate: 5, amount: 125000, status: 'Paid', createdAt: '15 Mar 2026', transactionId: '23010412432431' },
            { id: 'COM-002', propertyName: 'Fully Furnished 1 BHK Flat', location: 'Mahalakshmi Nagar, Indore', saleValue: 3050000, rate: 5, amount: 325000, status: 'Paid', createdAt: '15 Mar 2026', transactionId: '23010412432432' },
            { id: 'COM-003', propertyName: '2 BHK Apartment', location: 'Vijay Nagar, Indore', saleValue: 4500000, rate: 3, amount: 135000, status: 'Pending', createdAt: '02 Apr 2026', transactionId: 'Awaiting payout' },
        ],
        transactions: [
            { id: 'TXN-7182', property_name: 'Sunset Villa', type: 'credit', amount: 125000, bank_name: 'Bank of India - xxxxxxxx6789', created_at: '2026-06-14', status: 'success' },
            { id: 'TXN-7183', property_name: 'Withdrawal to bank', type: 'debit', amount: 250000, bank_name: 'Bank of India - xxxxxxxx6789', created_at: '2026-06-13', status: 'processing' },
        ],
        withdrawals: [
            {
                id: 'WDR-1091',
                requestedAmount: 250000,
                bankName: 'Bank of India',
                accountNumberMasked: 'xxxxxxxx6789',
                ifsc: 'BKID0008891',
                accountHolder: 'Anil Nahar',
                requestedAt: '14 Jun 2026, 10:45 AM',
                source: 'Broker app wallet',
                status: 'Pending payout',
                utr: 'Awaiting payment',
            },
        ],
    },
    {
        id: 'BRK-1032',
        name: 'Manas Gangrade',
        agency: 'Prime Square Brokers',
        mobile: '+91 98765 43210',
        email: 'manas@squarftbroker.in',
        city: 'Indore',
        area: 'Vijay Nagar',
        kycStatus: 'Approved',
        brokerStatus: 'Active',
        joinedOn: '11 Feb 2026',
        stats: { total_properties: 9, sales: 4, pending: 4, rejected: 1 },
        wallet: {
            balance: 682000,
            totalEarned: 2460000,
            totalWithdrawn: 1778000,
            lockedAmount: 72000,
            withdrawalPending: 0,
        },
        bankAccounts: [
            { id: 'BANK-11', bankName: 'ICICI Bank', accountNumberMasked: 'xxxxxxxx5566', ifsc: 'ICIC0001212', primary: true, status: 'Verified' },
        ],
        uploadedProperties: [
            { id: 'PROP-011', name: 'Lake View Apartment', category: 'Residential', type: 'Apartment', location: 'Pipliyapala, Indore', price: 5800000, status: 'Approved', photos: 9, documents: 3, uploadedOn: '09 Jun 2026' },
            { id: 'PROP-012', name: 'Green Field Plot', category: 'Residential', type: 'Plot', location: 'Super Corridor, Indore', price: 3000000, status: 'Pending', photos: 5, documents: 2, uploadedOn: '12 Jun 2026' },
            { id: 'PROP-013', name: 'Silver Oak Studio', category: 'Commercial', type: 'Shop', location: 'Old Palasia, Indore', price: 6500000, status: 'Pending', photos: 6, documents: 2, uploadedOn: '13 Jun 2026' },
        ],
        commissions: [
            { id: 'COM-011', propertyName: 'Lake View Apartment', location: 'Pipliyapala, Indore', saleValue: 5800000, rate: 4, amount: 232000, status: 'Paid', createdAt: '20 May 2026', transactionId: '23010412432512' },
            { id: 'COM-012', propertyName: 'Green Field Plot', location: 'Super Corridor, Indore', saleValue: 3000000, rate: 3, amount: 90000, status: 'Pending', createdAt: '04 Jun 2026', transactionId: 'Awaiting payout' },
        ],
        transactions: [
            { id: 'TXN-8210', property_name: 'Lake View Apartment', type: 'credit', amount: 232000, bank_name: 'ICICI Bank - xxxxxxxx5566', created_at: '2026-05-21', status: 'success' },
            { id: 'TXN-8211', property_name: 'Commission adjustment', type: 'credit', amount: 45000, bank_name: 'Wallet balance', created_at: '2026-06-03', status: 'success' },
        ],
        withdrawals: [
            {
                id: 'WDR-1164',
                requestedAmount: 180000,
                bankName: 'ICICI Bank',
                accountNumberMasked: 'xxxxxxxx5566',
                ifsc: 'ICIC0001212',
                accountHolder: 'Manas Gangrade',
                requestedAt: '13 Jun 2026, 04:15 PM',
                source: 'Broker app wallet',
                status: 'Pending payout',
                utr: 'Awaiting payment',
            },
        ],
    },
    {
        id: 'BRK-1041',
        name: 'Apex Realty',
        agency: 'Apex Realty Channel',
        mobile: '+91 98100 12300',
        email: 'ops@apexrealty.in',
        city: 'Mumbai',
        area: 'Andheri West',
        kycStatus: 'Under review',
        brokerStatus: 'Watchlist',
        joinedOn: '18 Jan 2026',
        stats: { total_properties: 16, sales: 5, pending: 8, rejected: 3 },
        wallet: {
            balance: 940000,
            totalEarned: 3115000,
            totalWithdrawn: 2175000,
            lockedAmount: 420000,
            withdrawalPending: 500000,
        },
        bankAccounts: [
            { id: 'BANK-21', bankName: 'Axis Bank', accountNumberMasked: 'xxxxxxxx9988', ifsc: 'UTIB0000711', primary: true, status: 'Verified' },
            { id: 'BANK-22', bankName: 'Kotak Bank', accountNumberMasked: 'xxxxxxxx7722', ifsc: 'KKBK0005888', primary: false, status: 'Blocked' },
        ],
        uploadedProperties: [
            { id: 'PROP-021', name: 'Skyline Residency', category: 'Residential', type: 'Apartment', location: 'Andheri West, Mumbai', price: 18500000, status: 'Approved', photos: 11, documents: 4, uploadedOn: '08 Jun 2026' },
            { id: 'PROP-022', name: 'The Pinnacle Penthouse', category: 'Residential', type: 'Apartment', location: 'New Palasia, Indore', price: 8500000, status: 'Pending', photos: 7, documents: 2, uploadedOn: '13 Jun 2026' },
            { id: 'PROP-023', name: 'Riverside Bungalow', category: 'Residential', type: 'Rowhouse', location: 'Khandwa Road, Indore', price: 5200000, status: 'Rejected', photos: 4, documents: 1, uploadedOn: '11 Jun 2026' },
        ],
        commissions: [
            { id: 'COM-021', propertyName: 'Skyline Residency', location: 'Andheri West, Mumbai', saleValue: 17600000, rate: 2.5, amount: 440000, status: 'Paid', createdAt: '01 Jun 2026', transactionId: '23010412432671' },
            { id: 'COM-022', propertyName: 'The Pinnacle Penthouse', location: 'New Palasia, Indore', saleValue: 8500000, rate: 4, amount: 340000, status: 'Hold', createdAt: '08 Jun 2026', transactionId: 'KYC hold' },
        ],
        transactions: [
            { id: 'TXN-9312', property_name: 'Skyline Residency', type: 'credit', amount: 440000, bank_name: 'Axis Bank - xxxxxxxx9988', created_at: '2026-06-01', status: 'success' },
            { id: 'TXN-9313', property_name: 'Withdrawal to bank', type: 'debit', amount: 500000, bank_name: 'Axis Bank - xxxxxxxx9988', created_at: '2026-06-12', status: 'pending' },
        ],
        withdrawals: [
            {
                id: 'WDR-1187',
                requestedAmount: 500000,
                bankName: 'Axis Bank',
                accountNumberMasked: 'xxxxxxxx9988',
                ifsc: 'UTIB0000711',
                accountHolder: 'Apex Realty',
                requestedAt: '12 Jun 2026, 05:20 PM',
                source: 'Broker app wallet',
                status: 'Compliance hold',
                utr: 'KYC review pending',
            },
        ],
    },
];

const propertyFilters = ['All', 'Approved', 'Pending', 'Rejected'];

const formatCurrency = (amount) => `Rs ${Number(amount || 0).toLocaleString('en-IN')}`;

const getStatusClass = (status) => {
    const normalized = String(status).toLowerCase();
    if (normalized.includes('paid') || normalized.includes('approved') || normalized.includes('verified') || normalized.includes('success')) {
        return 'bg-[#E8F9EE] text-[#0C6B39]';
    }
    if (normalized.includes('reject') || normalized.includes('blocked') || normalized.includes('hold') || normalized.includes('watch')) {
        return 'bg-[#FDECEC] text-[#B42318]';
    }
    return 'bg-[#FFF7E6] text-[#A15A00]';
};

const BrokerCommission = () => {
    const [selectedBrokerId, setSelectedBrokerId] = useState(brokerCommissionData[0].id);
    const [search, setSearch] = useState('');
    const [propertyFilter, setPropertyFilter] = useState('All');
    const [withdrawalActions, setWithdrawalActions] = useState({});
    const [selectedWithdrawalIds, setSelectedWithdrawalIds] = useState([]);

    const filteredBrokers = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) return brokerCommissionData;

        return brokerCommissionData.filter((broker) => (
            broker.name.toLowerCase().includes(query)
            || broker.agency.toLowerCase().includes(query)
            || broker.mobile.toLowerCase().includes(query)
            || broker.city.toLowerCase().includes(query)
        ));
    }, [search]);

    const selectedBroker = brokerCommissionData.find((broker) => broker.id === selectedBrokerId) || filteredBrokers[0] || brokerCommissionData[0];
    const selectedProperties = selectedBroker.uploadedProperties.filter((property) => propertyFilter === 'All' || property.status === propertyFilter);
    const selectedWithdrawals = selectedBroker.withdrawals;
    const brokerWithdrawalQueue = brokerCommissionData.flatMap((broker) => (
        broker.withdrawals.map((withdrawal) => ({
            ...withdrawal,
            brokerId: broker.id,
            brokerName: broker.name,
            brokerAgency: broker.agency,
            walletBalance: broker.wallet.balance,
        }))
    ));
    const getWithdrawalStatus = (withdrawal) => withdrawalActions[withdrawal.id]?.status || withdrawal.status;

    const managedWithdrawalQueue = brokerWithdrawalQueue.map((withdrawal) => ({
        ...withdrawal,
        currentStatus: getWithdrawalStatus(withdrawal),
        currentUtr: withdrawalActions[withdrawal.id]?.utr || withdrawal.utr,
    }));

    const selectedWithdrawalRows = managedWithdrawalQueue.filter((withdrawal) => selectedWithdrawalIds.includes(withdrawal.id));
    const selectedPayableRows = selectedWithdrawalRows.filter((withdrawal) => withdrawal.currentStatus.toLowerCase().includes('pending'));
    const selectedConfirmableRows = selectedWithdrawalRows.filter((withdrawal) => withdrawal.currentStatus === 'Payment sent');
    const selectedRequestTotal = selectedWithdrawalRows.reduce((total, withdrawal) => total + withdrawal.requestedAmount, 0);

    const totals = brokerCommissionData.reduce((summary, broker) => ({
        brokers: summary.brokers + 1,
        properties: summary.properties + broker.stats.total_properties,
        balance: summary.balance + broker.wallet.balance,
        pendingPayout: summary.pendingPayout + broker.wallet.withdrawalPending,
    }), { brokers: 0, properties: 0, balance: 0, pendingPayout: 0 });

    const markPaymentSent = (withdrawalId) => {
        setWithdrawalActions((current) => ({
            ...current,
            [withdrawalId]: {
                status: 'Payment sent',
                utr: `UTR-${withdrawalId.replace(/\D/g, '') || '0000'}-ADMIN`,
            },
        }));
    };

    const confirmPayment = (withdrawalId) => {
        setWithdrawalActions((current) => ({
            ...current,
            [withdrawalId]: {
                ...(current[withdrawalId] || {}),
                status: 'Payment confirmed',
            },
        }));
    };

    const toggleWithdrawalSelection = (withdrawalId) => {
        setSelectedWithdrawalIds((current) => (
            current.includes(withdrawalId)
                ? current.filter((id) => id !== withdrawalId)
                : [...current, withdrawalId]
        ));
    };

    const toggleAllWithdrawals = () => {
        setSelectedWithdrawalIds((current) => (
            current.length === managedWithdrawalQueue.length
                ? []
                : managedWithdrawalQueue.map((withdrawal) => withdrawal.id)
        ));
    };

    const markSelectedPaymentsSent = () => {
        setWithdrawalActions((current) => {
            const next = { ...current };
            selectedPayableRows.forEach((withdrawal) => {
                next[withdrawal.id] = {
                    status: 'Payment sent',
                    utr: `UTR-${withdrawal.id.replace(/\D/g, '') || '0000'}-ADMIN`,
                };
            });
            return next;
        });
    };

    const confirmSelectedPayments = () => {
        setWithdrawalActions((current) => {
            const next = { ...current };
            selectedConfirmableRows.forEach((withdrawal) => {
                next[withdrawal.id] = {
                    ...(next[withdrawal.id] || {}),
                    status: 'Payment confirmed',
                };
            });
            return next;
        });
    };

    return (
        <div className="flex h-full flex-1 flex-col bg-[#F5F6FA] text-[#15121F]">
            <Header title="Broker Commission" />

            <main className="flex-1 overflow-y-auto p-6 md:p-8">
                <div className="mx-auto max-w-[1600px] space-y-5">
                    <section className="rounded-[10px] border border-[#D8D2EB] bg-white p-5 shadow-[0_1px_0_rgba(33,24,88,0.03)]">
                        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="rounded-full bg-[#E8E4FF] px-3 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-[#2717D7]">Broker app aligned</span>
                                    <span className="rounded-full bg-[#E9F8EF] px-3 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-[#04622E]">Withdraw + commission control</span>
                                </div>
                                <h2 className="mt-3 text-2xl font-black text-[#171327]">Broker commission and withdrawal supervision</h2>
                                <p className="mt-1 max-w-3xl text-sm font-medium leading-6 text-[#615C71]">
                                    Review broker details, uploaded properties, property-wise commissions, bank transfer targets, transactions, and withdrawal requests in one admin view.
                                </p>
                            </div>
                            <div className="grid w-full gap-3 sm:grid-cols-2 xl:w-auto xl:grid-cols-4">
                                <MetricTile icon={UserRound} label="Brokers" value={totals.brokers} />
                                <MetricTile icon={Home} label="Properties" value={totals.properties} />
                                <MetricTile icon={Banknote} label="Available" value={formatCurrency(totals.balance)} />
                                <MetricTile icon={Clock3} label="Pending payout" value={formatCurrency(totals.pendingPayout)} />
                            </div>
                        </div>
                    </section>

                    <div className="grid gap-5 xl:grid-cols-[360px_1fr]">
                        <aside className="space-y-5">
                            <section className="rounded-[10px] border border-[#D8D2EB] bg-white p-4">
                                <div className="flex items-center gap-2 rounded-[8px] border border-[#D8D2EB] bg-[#FCFBFF] px-3">
                                    <Search size={16} className="text-[#7B7486]" />
                                    <input
                                        value={search}
                                        onChange={(event) => setSearch(event.target.value)}
                                        placeholder="Search broker, agency, city"
                                        className="h-11 min-w-0 flex-1 bg-transparent text-sm font-medium outline-none"
                                    />
                                </div>

                                <div className="mt-4 space-y-3">
                                    {filteredBrokers.map((broker) => {
                                        const selected = broker.id === selectedBroker.id;
                                        return (
                                            <button
                                                key={broker.id}
                                                type="button"
                                                onClick={() => setSelectedBrokerId(broker.id)}
                                                className={`w-full rounded-[10px] border p-4 text-left transition-all ${selected ? 'border-[#2717D7] bg-[#F4F1FF]' : 'border-[#E1DDF0] bg-white hover:border-[#2717D7]'}`}
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="min-w-0">
                                                        <p className="truncate text-sm font-black text-[#171327]">{broker.name}</p>
                                                        <p className="mt-1 truncate text-xs font-bold text-[#615C71]">{broker.agency}</p>
                                                    </div>
                                                    <span className={`rounded-full px-2 py-1 text-[9px] font-black uppercase ${getStatusClass(broker.brokerStatus)}`}>
                                                        {broker.brokerStatus}
                                                    </span>
                                                </div>
                                                <div className="mt-3 grid grid-cols-3 gap-2">
                                                    <MiniStat label="Total" value={broker.stats.total_properties} />
                                                    <MiniStat label="Sales" value={broker.stats.sales} />
                                                    <MiniStat label="Wallet" value={formatCurrency(broker.wallet.balance)} />
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </section>
                        </aside>

                        <section className="space-y-5">
                            <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
                                <div className="rounded-[10px] border border-[#D8D2EB] bg-white p-5">
                                    <SectionHeader icon={BriefcaseBusiness} title="Broker details" helper="Same broker-facing identity and stats, expanded for admin review." />
                                    <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                                        <DetailItem icon={UserRound} label="Broker" value={selectedBroker.name} helper={selectedBroker.agency} />
                                        <DetailItem icon={Phone} label="Mobile" value={selectedBroker.mobile} helper={selectedBroker.email} />
                                        <DetailItem icon={MapPin} label="Market" value={`${selectedBroker.area}, ${selectedBroker.city}`} helper={`Joined ${selectedBroker.joinedOn}`} />
                                        <DetailItem icon={ShieldCheck} label="KYC" value={selectedBroker.kycStatus} helper={selectedBroker.id} badgeClass={getStatusClass(selectedBroker.kycStatus)} />
                                    </div>
                                    <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                                        <MetricTile icon={Home} label="Total properties" value={selectedBroker.stats.total_properties} />
                                        <MetricTile icon={CheckCircle2} label="Total sale" value={selectedBroker.stats.sales} />
                                        <MetricTile icon={Clock3} label="Pending" value={selectedBroker.stats.pending} />
                                        <MetricTile icon={ListFilter} label="Rejected" value={selectedBroker.stats.rejected} />
                                    </div>
                                </div>

                                <div className="rounded-[10px] border border-[#D8D2EB] bg-white p-5">
                                    <SectionHeader icon={Landmark} title="Broker withdraw management" helper="Requests submitted from the broker app wallet screen." />
                                    <div className="mt-4 grid grid-cols-2 gap-3">
                                        <MiniStat label="Available" value={formatCurrency(selectedBroker.wallet.balance)} />
                                        <MiniStat label="Pending" value={formatCurrency(selectedBroker.wallet.withdrawalPending)} />
                                    </div>

                                    <div className="mt-4 space-y-3">
                                        {selectedWithdrawals.length ? selectedWithdrawals.map((withdrawal) => {
                                            const status = getWithdrawalStatus(withdrawal);
                                            const canSendPayment = status.toLowerCase().includes('pending');
                                            const canConfirm = status === 'Payment sent';
                                            return (
                                                <div key={withdrawal.id} className="rounded-[10px] border border-[#E1DDF0] bg-[#FCFBFF] p-4">
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-black text-[#171327]">{formatCurrency(withdrawal.requestedAmount)}</p>
                                                            <p className="mt-1 truncate text-xs font-bold text-[#615C71]">{withdrawal.bankName} / {withdrawal.accountNumberMasked}</p>
                                                        </div>
                                                        <StatusPill status={status} />
                                                    </div>
                                                    <div className="mt-3 grid gap-2 text-[10px] font-bold text-[#615C71]">
                                                        <p>IFSC: <span className="font-black text-[#171327]">{withdrawal.ifsc}</span></p>
                                                        <p>Holder: <span className="font-black text-[#171327]">{withdrawal.accountHolder}</span></p>
                                                        <p>Request: <span className="font-black text-[#171327]">{withdrawal.id}</span> / {withdrawal.requestedAt}</p>
                                                        <p>UTR: <span className="font-black text-[#171327]">{withdrawalActions[withdrawal.id]?.utr || withdrawal.utr}</span></p>
                                                    </div>
                                                    <div className="mt-4 grid gap-2 sm:grid-cols-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => markPaymentSent(withdrawal.id)}
                                                            disabled={!canSendPayment}
                                                            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[8px] bg-[#2717D7] px-3 text-xs font-black text-white disabled:cursor-not-allowed disabled:bg-[#C5BEDD] disabled:text-white/80"
                                                        >
                                                            <Send size={14} /> Send payment
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => confirmPayment(withdrawal.id)}
                                                            disabled={!canConfirm}
                                                            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[8px] border border-[#B7E5C8] bg-[#E8F9EE] px-3 text-xs font-black text-[#0C6B39] disabled:cursor-not-allowed disabled:border-[#E1DDF0] disabled:bg-white disabled:text-[#A9A2B5]"
                                                        >
                                                            <CheckCircle2 size={14} /> Confirm
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        }) : (
                                            <div className="rounded-[10px] border border-dashed border-[#D8D2EB] bg-[#FCFBFF] p-5 text-center">
                                                <p className="text-sm font-black text-[#171327]">No active withdrawal request</p>
                                                <p className="mt-1 text-xs font-bold text-[#615C71]">Requests will appear here after the broker taps Withdraw Now in the app.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-[10px] border border-[#D8D2EB] bg-white p-5">
                                <div className="flex flex-col gap-4 border-b border-[#E1DDF0] pb-4 lg:flex-row lg:items-center lg:justify-between">
                                    <SectionHeader icon={Building2} title="Uploaded properties" helper="Property upload data follows the broker app add-project flow." compact />
                                    <div className="flex flex-wrap gap-2">
                                        {propertyFilters.map((filter) => (
                                            <button
                                                key={filter}
                                                type="button"
                                                onClick={() => setPropertyFilter(filter)}
                                                className={`rounded-[8px] border px-3 py-2 text-[10px] font-black uppercase tracking-[0.1em] ${propertyFilter === filter ? 'border-[#2717D7] bg-[#2717D7] text-white' : 'border-[#D8D2EB] bg-[#FCFBFF] text-[#514B63]'}`}
                                            >
                                                {filter}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="mt-4 grid gap-3 xl:grid-cols-3">
                                    {selectedProperties.map((property) => (
                                        <div key={property.id} className="rounded-[10px] border border-[#E1DDF0] bg-[#FCFBFF] p-4">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-black text-[#171327]">{property.name}</p>
                                                    <p className="mt-1 text-xs font-bold text-[#615C71]">{property.type} / {property.category}</p>
                                                </div>
                                                <span className={`rounded-full px-2 py-1 text-[9px] font-black uppercase ${getStatusClass(property.status)}`}>{property.status}</span>
                                            </div>
                                            <p className="mt-3 flex items-center gap-2 text-xs font-bold text-[#615C71]"><MapPin size={14} /> {property.location}</p>
                                            <div className="mt-4 grid grid-cols-3 gap-2">
                                                <MiniStat label="Price" value={formatCurrency(property.price)} />
                                                <MiniStat label="Photos" value={property.photos} />
                                                <MiniStat label="Docs" value={property.documents} />
                                            </div>
                                            <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.1em] text-[#8B8498]">Uploaded {property.uploadedOn}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="grid gap-5 xl:grid-cols-2">
                                <DataTable
                                    icon={BadgeIndianRupee}
                                    title="Property-wise commission"
                                    helper="Matches broker commission history: property, amount, rate, status, and transaction reference."
                                    columns={['Property', 'Sale value', 'Commission', 'Status']}
                                    rows={selectedBroker.commissions.map((commission) => [
                                        <div key="property">
                                            <p className="font-black text-[#171327]">{commission.propertyName}</p>
                                            <p className="mt-1 text-[10px] font-bold text-[#615C71]">{commission.location} / {commission.createdAt}</p>
                                        </div>,
                                        formatCurrency(commission.saleValue),
                                        <div key="commission">
                                            <p className="font-black text-[#0C6B39]">{formatCurrency(commission.amount)}</p>
                                            <p className="mt-1 text-[10px] font-bold text-[#615C71]">{commission.rate}% / {commission.transactionId}</p>
                                        </div>,
                                        <StatusPill key="status" status={commission.status} />,
                                    ])}
                                />

                                <DataTable
                                    icon={CreditCard}
                                    title="Wallet transactions"
                                    helper="Credits and debits use broker app transaction labels."
                                    columns={['Transaction', 'Amount', 'Transfer', 'Status']}
                                    rows={selectedBroker.transactions.map((transaction) => [
                                        <div key="transaction">
                                            <p className="font-black text-[#171327]">{transaction.property_name || 'Commission'}</p>
                                            <p className="mt-1 text-[10px] font-bold text-[#615C71]">{transaction.id} / {transaction.created_at}</p>
                                        </div>,
                                        <span key="amount" className={transaction.type === 'credit' ? 'font-black text-[#0C6B39]' : 'font-black text-[#B42318]'}>
                                            {transaction.type === 'credit' ? '+' : '-'} {formatCurrency(transaction.amount)}
                                        </span>,
                                        transaction.bank_name,
                                        <StatusPill key="status" status={transaction.status} />,
                                    ])}
                                />
                            </div>

                            <div className="rounded-[10px] border border-[#D8D2EB] bg-white p-5">
                                <div className="flex flex-col gap-4 border-b border-[#E1DDF0] pb-4 xl:flex-row xl:items-center xl:justify-between">
                                    <SectionHeader icon={Landmark} title="Multiple brokers payment request management" helper="Select many broker wallet withdrawal requests, send payouts, and confirm completed payments." compact />
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            type="button"
                                            onClick={toggleAllWithdrawals}
                                            className="min-h-11 rounded-[8px] border border-[#D8D2EB] bg-[#FCFBFF] px-3 text-[10px] font-black uppercase text-[#514B63]"
                                        >
                                            {selectedWithdrawalIds.length === managedWithdrawalQueue.length ? 'Clear selected' : 'Select all'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={markSelectedPaymentsSent}
                                            disabled={selectedPayableRows.length === 0}
                                            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[8px] bg-[#2717D7] px-3 text-[10px] font-black uppercase text-white disabled:cursor-not-allowed disabled:bg-[#C5BEDD]"
                                        >
                                            <Send size={14} /> Send selected
                                        </button>
                                        <button
                                            type="button"
                                            onClick={confirmSelectedPayments}
                                            disabled={selectedConfirmableRows.length === 0}
                                            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[8px] bg-[#E8F9EE] px-3 text-[10px] font-black uppercase text-[#0C6B39] disabled:cursor-not-allowed disabled:bg-[#ECE9F5] disabled:text-[#8B8498]"
                                        >
                                            <CheckCircle2 size={14} /> Confirm selected
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                                    <MetricTile icon={FileCheck2} label="Selected requests" value={selectedWithdrawalIds.length} />
                                    <MetricTile icon={Banknote} label="Selected amount" value={formatCurrency(selectedRequestTotal)} />
                                    <MetricTile icon={Send} label="Ready to send" value={selectedPayableRows.length} />
                                    <MetricTile icon={CheckCircle2} label="Ready to confirm" value={selectedConfirmableRows.length} />
                                </div>

                                <div className="mt-4 space-y-3">
                                    {managedWithdrawalQueue.map((withdrawal) => {
                                        const canSendPayment = withdrawal.currentStatus.toLowerCase().includes('pending');
                                        const canConfirm = withdrawal.currentStatus === 'Payment sent';
                                        return (
                                            <div key={withdrawal.id} className="rounded-[10px] border border-[#E1DDF0] bg-[#FCFBFF] p-4">
                                                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                                    <label className="flex min-w-0 flex-1 items-start gap-3">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedWithdrawalIds.includes(withdrawal.id)}
                                                            onChange={() => toggleWithdrawalSelection(withdrawal.id)}
                                                            className="mt-1 h-4 w-4 shrink-0 accent-[#2717D7]"
                                                            aria-label={`Select withdrawal request ${withdrawal.id}`}
                                                        />
                                                        <div className="min-w-0">
                                                            <p className="break-words text-sm font-black text-[#171327]">{withdrawal.brokerName}</p>
                                                            <p className="mt-1 break-words text-[10px] font-bold text-[#615C71]">{withdrawal.brokerAgency} / {withdrawal.id}</p>
                                                            <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.1em] text-[#8B8498]">{withdrawal.source}</p>
                                                        </div>
                                                    </label>
                                                    <div className="flex shrink-0 flex-wrap gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => setSelectedBrokerId(withdrawal.brokerId)}
                                                            className="min-h-10 rounded-[8px] border border-[#D8D2EB] bg-white px-3 text-[10px] font-black uppercase text-[#514B63]"
                                                        >
                                                            Open
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => markPaymentSent(withdrawal.id)}
                                                            disabled={!canSendPayment}
                                                            className="min-h-10 rounded-[8px] bg-[#2717D7] px-3 text-[10px] font-black uppercase text-white disabled:cursor-not-allowed disabled:bg-[#C5BEDD]"
                                                        >
                                                            Send
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => confirmPayment(withdrawal.id)}
                                                            disabled={!canConfirm}
                                                            className="min-h-10 rounded-[8px] bg-[#E8F9EE] px-3 text-[10px] font-black uppercase text-[#0C6B39] disabled:cursor-not-allowed disabled:bg-[#ECE9F5] disabled:text-[#8B8498]"
                                                        >
                                                            Confirm
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                                                    <InfoBlock label="Bank transfer" value={withdrawal.bankName} helper={`${withdrawal.accountNumberMasked} / ${withdrawal.ifsc}`} />
                                                    <InfoBlock label="Account holder" value={withdrawal.accountHolder} helper={withdrawal.requestedAt} />
                                                    <InfoBlock label="Amount" value={formatCurrency(withdrawal.requestedAmount)} helper={`Available ${formatCurrency(withdrawal.walletBalance)}`} accent />
                                                    <div className="min-w-0 rounded-[8px] bg-white p-3 ring-1 ring-[#E1DDF0]">
                                                        <p className="text-[9px] font-black uppercase text-[#8B8498]">Status</p>
                                                        <div className="mt-2"><StatusPill status={withdrawal.currentStatus} /></div>
                                                        <p className="mt-2 break-words text-[10px] font-bold text-[#615C71]">UTR: {withdrawal.currentUtr}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
};

const MetricTile = ({ icon: Icon, label, value }) => (
    <div className="rounded-[10px] border border-[#D8D2EB] bg-[#FCFBFF] p-3">
        <Icon className="h-4 w-4 text-[#2717D7]" />
        <p className="mt-2 text-[9px] font-black uppercase tracking-[0.12em] text-[#7B7486]">{label}</p>
        <p className="mt-1 truncate text-lg font-black text-[#171327]">{value}</p>
    </div>
);

const MiniStat = ({ label, value }) => (
    <div className="min-w-0 rounded-[7px] bg-white p-2 ring-1 ring-[#E1DDF0]">
        <p className="text-[8px] font-black uppercase text-[#8B8498]">{label}</p>
        <p className="mt-1 truncate text-[10px] font-black text-[#171327]">{value}</p>
    </div>
);

const InfoBlock = ({ label, value, helper, accent = false }) => (
    <div className="min-w-0 rounded-[8px] bg-white p-3 ring-1 ring-[#E1DDF0]">
        <p className="text-[9px] font-black uppercase text-[#8B8498]">{label}</p>
        <p className={`mt-1 break-words text-xs font-black ${accent ? 'text-[#2717D7]' : 'text-[#171327]'}`}>{value}</p>
        <p className="mt-1 break-words text-[10px] font-bold text-[#615C71]">{helper}</p>
    </div>
);

const SectionHeader = ({ icon: Icon, title, helper, compact = false }) => (
    <div className={`flex items-start justify-between gap-4 ${compact ? '' : 'border-b border-[#E1DDF0] pb-4'}`}>
        <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#5E5A71]">{title}</p>
            <p className="mt-1 text-sm font-medium text-[#615C71]">{helper}</p>
        </div>
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-[8px] bg-[#F0EDFF] text-[#2717D7]">
            <Icon size={19} />
        </div>
    </div>
);

const DetailItem = ({ icon: Icon, label, value, helper, badgeClass }) => (
    <div className="rounded-[10px] border border-[#E1DDF0] bg-[#FCFBFF] p-4">
        <Icon className="h-4 w-4 text-[#2717D7]" />
        <p className="mt-3 text-[9px] font-black uppercase tracking-[0.12em] text-[#8B8498]">{label}</p>
        {badgeClass ? (
            <span className={`mt-2 inline-flex rounded-full px-2 py-1 text-[9px] font-black uppercase ${badgeClass}`}>{value}</span>
        ) : (
            <p className="mt-1 truncate text-sm font-black text-[#171327]">{value}</p>
        )}
        <p className="mt-1 truncate text-[10px] font-bold text-[#615C71]">{helper}</p>
    </div>
);

const StatusPill = ({ status }) => (
    <span className={`inline-flex rounded-full px-2 py-1 text-[9px] font-black uppercase ${getStatusClass(status)}`}>
        {status}
    </span>
);

const DataTable = ({ icon: Icon, title, helper, columns, rows }) => (
    <div className="rounded-[10px] border border-[#D8D2EB] bg-white p-5">
        <SectionHeader icon={Icon} title={title} helper={helper} />
        <div className="mt-4 space-y-3">
            {rows.map((row, rowIndex) => (
                <div key={rowIndex} className="grid gap-3 rounded-[10px] border border-[#E1DDF0] bg-[#FCFBFF] p-4 sm:grid-cols-2 xl:grid-cols-4">
                    {row.map((cell, cellIndex) => (
                        <div key={cellIndex} className="min-w-0">
                            <p className="text-[9px] font-black uppercase text-[#8B8498]">{columns[cellIndex]}</p>
                            <div className="mt-2 break-words text-xs font-bold text-[#514B63]">{cell}</div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    </div>
);

export default BrokerCommission;
