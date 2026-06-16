import { useMemo, useState } from 'react';
import {
    Banknote,
    Building2,
    CheckCircle2,
    ClipboardList,
    Clock3,
    CreditCard,
    FileText,
    Home,
    Landmark,
    ListFilter,
    MapPin,
    Phone,
    Search,
    UserRound,
} from 'lucide-react';
import Header from '../../components/layout/Header';
import { useNavigate } from 'react-router-dom';
import Modal from '../../components/ui/Modal';
import samplePropertyImage from '../../assets/login-bg.png';

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
        clients: [
            { id: 'CL-101', name: 'Suresh Kumar', phone: '+91 98987 88776', budget: '2 Cr - 3 Cr', interest: 'Sunset Villa', status: 'Interested', onboardedOn: '08 Jun 2026' },
            { id: 'CL-102', name: 'Pooja Hegde', phone: '+91 99887 77665', budget: '80 L - 1.2 Cr', interest: 'Fully Furnished 1 BHK Flat', status: 'Active', onboardedOn: '10 Jun 2026' },
            { id: 'CL-103', name: 'Rajesh Patel', phone: '+91 98221 33221', budget: '4 Cr - 6 Cr', interest: 'Sunset Villa', status: 'Deal Closed', onboardedOn: '12 Jun 2026' }
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
        clients: [
            { id: 'CL-201', name: 'Neha Sharma', phone: '+91 91122 33445', budget: '1.5 Cr - 2.5 Cr', interest: 'Lake View Apartment', status: 'Active', onboardedOn: '11 Jun 2026' },
            { id: 'CL-202', name: 'Devendra Jha', phone: '+91 98888 77777', budget: '3 Cr - 4 Cr', interest: 'Green Field Plot', status: 'Interested', onboardedOn: '13 Jun 2026' }
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
        clients: [
            { id: 'CL-301', name: 'Vikram Malhotra', phone: '+91 95555 44444', budget: '15 Cr - 20 Cr', interest: 'Skyline Residency', status: 'Deal Closed', onboardedOn: '05 Jun 2026' },
            { id: 'CL-302', name: 'Rohan Mehra', phone: '+91 96666 55555', budget: '6 Cr - 10 Cr', interest: 'The Pinnacle Penthouse', status: 'Active', onboardedOn: '09 Jun 2026' }
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
    const navigate = useNavigate();
    const [selectedBrokerId, setSelectedBrokerId] = useState(brokerCommissionData[0].id);
    const [search, setSearch] = useState('');
    const [propertyFilter, setPropertyFilter] = useState('All');
    const [withdrawalActions, setWithdrawalActions] = useState({});
    const [activeTab, setActiveTab] = useState('properties');
    const [selectedPropertyDetails, setSelectedPropertyDetails] = useState(null);

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
    const getWithdrawalStatus = (withdrawal) => withdrawalActions[withdrawal.id]?.status || withdrawal.status;

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



    return (
        <div className="flex h-full flex-1 flex-col bg-[#F5F6FA] text-[#15121F]">
            <Header title="Broker Commission" />

            <main className="flex-1 overflow-y-auto p-4">
                <div className="mx-auto max-w-[1600px] space-y-4">
                    <section className="rounded-[8px] border border-[#D8D2EB] bg-white p-4 shadow-[0_1px_0_rgba(33,24,88,0.03)]">
                        <div className="flex flex-col gap-3.5 xl:flex-row xl:items-center xl:justify-between">
                            <div>
                                <div className="flex flex-wrap items-center gap-2.5">
                                    <span className="rounded-full bg-[#E8E4FF] px-2 py-0.5 text-[8px] font-black uppercase tracking-[0.12em] text-[#2717D7]">Broker app aligned</span>
                                    <span className="rounded-full bg-[#E9F8EF] px-2 py-0.5 text-[8px] font-black uppercase tracking-[0.12em] text-[#04622E]">Withdraw + commission control</span>
                                </div>
                                <h2 className="mt-2 text-lg font-black text-[#171327]">Broker commission and withdrawal supervision</h2>
                                <p className="mt-0.5 max-w-3xl text-xs font-medium leading-normal text-[#615C71]">
                                    Review broker details, uploaded properties, property-wise commissions, bank transfer targets, transactions, and withdrawal requests in one admin view.
                                </p>
                            </div>
                            <div className="grid w-full gap-2 sm:grid-cols-2 xl:w-auto xl:grid-cols-4">
                                <MetricTile icon={UserRound} label="Brokers" value={totals.brokers} />
                                <MetricTile icon={Home} label="Properties" value={totals.properties} />
                                <MetricTile icon={Banknote} label="Available" value={formatCurrency(totals.balance)} />
                                <MetricTile icon={Clock3} label="Pending payout" value={formatCurrency(totals.pendingPayout)} />
                            </div>
                        </div>
                    </section>

                    <div className="grid gap-4 xl:grid-cols-[290px_1fr]">
                        <aside className="space-y-5">
                            <section className="rounded-[8px] border border-[#D8D2EB] bg-white p-3">
                                <div className="flex items-center gap-2 rounded-[6px] border border-[#D8D2EB] bg-[#FCFBFF] px-2.5">
                                    <Search size={14} className="text-[#7B7486]" />
                                    <input
                                        value={search}
                                        onChange={(event) => setSearch(event.target.value)}
                                        placeholder="Search broker, agency, city"
                                        className="h-9 min-w-0 flex-1 bg-transparent text-xs font-medium outline-none"
                                    />
                                </div>

                                <div className="mt-3 space-y-2">
                                    {filteredBrokers.map((broker) => {
                                        const selected = broker.id === selectedBroker.id;
                                        return (
                                            <button
                                                key={broker.id}
                                                type="button"
                                                onClick={() => setSelectedBrokerId(broker.id)}
                                                className={`w-full rounded-[8px] border p-2.5 text-left transition-all ${selected ? 'border-[#2717D7] bg-[#F4F1FF]' : 'border-[#E1DDF0] bg-white hover:border-[#2717D7]'}`}
                                            >
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="min-w-0">
                                                        <p className="truncate text-xs font-black text-[#171327]">{broker.name}</p>
                                                        <p className="mt-0.5 truncate text-[10px] font-bold text-[#615C71]">{broker.agency}</p>
                                                    </div>
                                                    <span className={`rounded-full px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider ${getStatusClass(broker.brokerStatus)}`}>
                                                        {broker.brokerStatus}
                                                    </span>
                                                </div>
                                                <div className="mt-2 grid grid-cols-3 gap-1.5">
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

                        <section className="space-y-4">
                            {/* Consolidated Broker Profile & Wallet Header */}
                            <div className="rounded-[8px] border border-[#D8D2EB] bg-white p-4">
                                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                    {/* Left Side: Profile & Details */}
                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-center gap-2.5">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F0EDFF] text-[#2717D7]">
                                                <UserRound size={20} />
                                            </div>
                                            <div>
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h3 className="text-sm font-black text-[#171327]">{selectedBroker.name}</h3>
                                                    <span className={`rounded-full px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider ${getStatusClass(selectedBroker.kycStatus)}`}>
                                                        KYC: {selectedBroker.kycStatus}
                                                    </span>
                                                    <span className="rounded-full bg-[#F4F1FF] px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider text-[#2717D7]">
                                                        ID: {selectedBroker.id}
                                                    </span>
                                                </div>
                                                <p className="text-xs font-bold text-[#615C71]">{selectedBroker.agency} &bull; Joined {selectedBroker.joinedOn}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 text-xs text-[#514B63]">
                                            <div className="flex items-center gap-2 font-medium">
                                                <Phone size={13} className="text-[#7B7486]" />
                                                <span>{selectedBroker.mobile} &bull; {selectedBroker.email}</span>
                                            </div>
                                            <div className="flex items-center gap-2 font-medium">
                                                <MapPin size={13} className="text-[#7B7486]" />
                                                <span>{selectedBroker.area}, {selectedBroker.city}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Middle Side: Wallet Stats */}
                                    <div className="flex flex-wrap gap-2 sm:flex-nowrap lg:w-auto">
                                        <div className="min-w-[110px] flex-1 sm:flex-none rounded-[6px] bg-[#FCFBFF] p-2 border border-[#E1DDF0]">
                                            <p className="text-[8px] font-black uppercase tracking-wider text-[#8B8498]">Wallet Balance</p>
                                            <p className="mt-1 text-sm font-black text-[#2717D7]">{formatCurrency(selectedBroker.wallet.balance)}</p>
                                            <p className="mt-0.5 text-[9px] font-bold text-[#615C71]">Available payout</p>
                                        </div>
                                        <div className="min-w-[110px] flex-1 sm:flex-none rounded-[6px] bg-[#FCFBFF] p-2 border border-[#E1DDF0]">
                                            <p className="text-[8px] font-black uppercase tracking-wider text-[#8B8498]">Total Earned</p>
                                            <p className="mt-1 text-sm font-black text-[#0C6B39]">{formatCurrency(selectedBroker.wallet.totalEarned)}</p>
                                            <p className="mt-0.5 text-[9px] font-bold text-[#615C71]">Paid: {formatCurrency(selectedBroker.wallet.totalWithdrawn)}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Active Withdrawal Request Banner inside Header */}
                                {selectedWithdrawals.length > 0 && (
                                    <div className="mt-4 border-t border-[#E1DDF0] pt-4">
                                        <p className="text-[9px] font-black uppercase tracking-wider text-[#5E5A71] mb-2 flex items-center gap-1">
                                            <Landmark size={12} className="text-[#2717D7]" /> Active Payout Request
                                        </p>
                                        <div className="space-y-2">
                                            {selectedWithdrawals.map((withdrawal) => {
                                                const status = getWithdrawalStatus(withdrawal);
                                                const canSendPayment = status.toLowerCase().includes('pending');
                                                const canConfirm = status === 'Payment sent';
                                                return (
                                                    <div key={withdrawal.id} className="flex flex-col md:flex-row md:items-center justify-between gap-3 rounded-[8px] border border-[#E1DDF0] bg-[#FCFBFF] p-2.5">
                                                        <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 flex-1 text-xs">
                                                            <div>
                                                                <p className="text-[8px] font-black uppercase text-[#8B8498]">Amount & Status</p>
                                                                <div className="flex items-center gap-1.5 mt-0.5">
                                                                    <span className="text-xs font-black text-[#171327]">{formatCurrency(withdrawal.requestedAmount)}</span>
                                                                    <StatusPill status={status} />
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <p className="text-[8px] font-black uppercase text-[#8B8498]">Bank Target</p>
                                                                <p className="mt-0.5 text-[10px] font-bold text-[#171327]">{withdrawal.bankName} - {withdrawal.accountNumberMasked}</p>
                                                                <p className="text-[9px] text-[#615C71]">IFSC: {withdrawal.ifsc}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-[8px] font-black uppercase text-[#8B8498]">Request & UTR</p>
                                                                <p className="mt-0.5 text-[10px] font-bold text-[#171327]">{withdrawal.id} ({withdrawal.requestedAt})</p>
                                                                <p className="text-[9px] text-[#615C71]">UTR: {withdrawalActions[withdrawal.id]?.utr || withdrawal.utr}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2 shrink-0">
                                                            <button
                                                                type="button"
                                                                onClick={() => markPaymentSent(withdrawal.id)}
                                                                disabled={!canSendPayment}
                                                                className="min-h-8 rounded-[6px] bg-[#2717D7] px-3 text-[10px] font-black text-white disabled:cursor-not-allowed disabled:bg-[#C5BEDD] disabled:text-white/80 transition-colors"
                                                            >
                                                                Approve payment
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => confirmPayment(withdrawal.id)}
                                                                disabled={!canConfirm}
                                                                className="min-h-8 inline-flex items-center gap-1 rounded-[6px] border border-[#B7E5C8] bg-[#E8F9EE] px-3 text-[10px] font-black text-[#0C6B39] disabled:cursor-not-allowed disabled:border-[#E1DDF0] disabled:bg-white disabled:text-[#A9A2B5] transition-colors"
                                                            >
                                                                <CheckCircle2 size={11} /> Confirm
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Core Tabs Switcher */}
                            <div className="flex border-b border-[#D8D2EB] gap-4">
                                <button
                                    onClick={() => {
                                        setActiveTab('properties');
                                        setPropertyFilter('All');
                                    }}
                                    className={`pb-2 text-xs font-black uppercase tracking-wider border-b-2 transition-all ${activeTab === 'properties' ? 'border-[#2717D7] text-[#2717D7]' : 'border-transparent text-[#615C71] hover:text-[#2717D7]'}`}
                                >
                                    Properties Onboarded ({selectedBroker.uploadedProperties.length})
                                </button>
                                <button
                                    onClick={() => setActiveTab('clients')}
                                    className={`pb-2 text-xs font-black uppercase tracking-wider border-b-2 transition-all ${activeTab === 'clients' ? 'border-[#2717D7] text-[#2717D7]' : 'border-transparent text-[#615C71] hover:text-[#2717D7]'}`}
                                >
                                    Clients Onboarded ({selectedBroker.clients?.length || 0})
                                </button>
                            </div>

                            {/* Tab Contents */}
                            {activeTab === 'properties' && (
                                <div className="rounded-[8px] border border-[#D8D2EB] bg-white p-4">
                                    <div className="flex flex-col gap-3 border-b border-[#E1DDF0] pb-2.5 lg:flex-row lg:items-center lg:justify-between">
                                        <SectionHeader icon={Building2} title="Uploaded properties" helper="Review properties uploaded by this broker." compact />
                                        <div className="flex flex-wrap gap-1.5">
                                            {propertyFilters.map((filter) => (
                                                <button
                                                    key={filter}
                                                    type="button"
                                                    onClick={() => setPropertyFilter(filter)}
                                                    className={`rounded-[6px] border px-2.5 py-1.5 text-[9px] font-black uppercase tracking-[0.1em] ${propertyFilter === filter ? 'border-[#2717D7] bg-[#2717D7] text-white' : 'border-[#D8D2EB] bg-[#FCFBFF] text-[#514B63]'}`}
                                                >
                                                    {filter}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="mt-3 grid gap-2.5 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                                        {selectedProperties.map((property) => {
                                            // Find associated property commission
                                            const commission = selectedBroker.commissions.find(c => c.propertyName === property.name);
                                            return (
                                                <div key={property.id} className="rounded-[8px] border border-[#E1DDF0] bg-[#FCFBFF] p-3 flex flex-col justify-between">
                                                    <div>
                                                        <div className="flex items-start justify-between gap-2.5">
                                                            <div className="min-w-0">
                                                                <p className="truncate text-xs font-black text-[#171327]">{property.name}</p>
                                                                <p className="mt-0.5 text-[10px] font-bold text-[#615C71]">{property.type} / {property.category}</p>
                                                            </div>
                                                            <span className={`rounded-full px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider ${getStatusClass(property.status)}`}>{property.status}</span>
                                                        </div>
                                                        <p className="mt-2 flex items-center gap-1.5 text-[10px] font-bold text-[#615C71]"><MapPin size={12} /> {property.location}</p>
                                                        <div className="mt-3 grid grid-cols-3 gap-1.5">
                                                            <MiniStat label="Price" value={formatCurrency(property.price)} />
                                                            <MiniStat label="Photos" value={property.photos} />
                                                            <MiniStat label="Docs" value={property.documents} />
                                                        </div>
                                                    </div>

                                                    {/* Contextual Commission Details inside Card */}
                                                    <div className="mt-3 border-t border-dashed border-[#E1DDF0] pt-2.5">
                                                        {commission ? (
                                                            <div className="flex items-center justify-between text-[10px]">
                                                                <div>
                                                                    <p className="text-[8px] font-black uppercase tracking-wider text-[#8B8498]">Commission ({commission.rate}%)</p>
                                                                    <p className="font-black text-[#0C6B39] mt-0.5">{formatCurrency(commission.amount)}</p>
                                                                </div>
                                                                <div className="text-right">
                                                                    <p className="text-[8px] font-black uppercase tracking-wider text-[#8B8498]">Payout Status</p>
                                                                    <div className="mt-0.5">
                                                                        <StatusPill status={commission.status} />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="text-center py-1">
                                                                <p className="text-[9px] font-bold text-[#8B8498]">No commission recorded</p>
                                                            </div>
                                                        )}
                                                        <div className="mt-2.5 border-t border-dashed border-[#E1DDF0]/50 pt-2 flex items-center justify-between">
                                                            <p className="text-[8px] font-bold uppercase tracking-[0.1em] text-[#8B8498]">Uploaded {property.uploadedOn}</p>
                                                            <button
                                                                type="button"
                                                                onClick={() => setSelectedPropertyDetails(property)}
                                                                className="rounded bg-[#2717D7] px-2 py-1 text-[9px] font-black uppercase tracking-wider text-white hover:bg-[#1f11ab] transition-colors"
                                                            >
                                                                View Details
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        {selectedProperties.length === 0 && (
                                            <div className="col-span-full rounded-[8px] border border-dashed border-[#D8D2EB] bg-[#FCFBFF] p-6 text-center">
                                                <p className="text-xs font-black text-[#171327]">No properties found</p>
                                                <p className="mt-0.5 text-[10px] font-bold text-[#615C71]">No properties matching standard status filter.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'clients' && (
                                <div className="rounded-[8px] border border-[#D8D2EB] bg-white p-4">
                                    <div className="flex items-start justify-between border-b border-[#E1DDF0] pb-2.5">
                                        <div>
                                            <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[#5E5A71]">Onboarded Clients</p>
                                            <p className="mt-0.5 text-xs font-medium text-[#615C71]">Clients referred/onboarded by this broker.</p>
                                        </div>
                                    </div>
                                    <div className="mt-3 grid gap-2.5 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                                        {selectedBroker.clients && selectedBroker.clients.length ? (
                                            selectedBroker.clients.map((client) => (
                                                <div key={client.id} className="rounded-[8px] border border-[#E1DDF0] bg-[#FCFBFF] p-3 flex flex-col justify-between">
                                                    <div>
                                                        <div className="flex items-start justify-between gap-2.5">
                                                            <div className="min-w-0">
                                                                <p className="truncate text-xs font-black text-[#171327]">{client.name}</p>
                                                                <p className="mt-0.5 text-[10px] font-bold text-[#615C71]">{client.phone}</p>
                                                            </div>
                                                            <span className={`rounded-full px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider ${getStatusClass(client.status)}`}>
                                                                {client.status}
                                                            </span>
                                                        </div>
                                                        <div className="mt-2.5 grid grid-cols-2 gap-1.5">
                                                            <MiniStat label="Budget" value={client.budget} />
                                                            <MiniStat label="Interest" value={client.interest} />
                                                        </div>
                                                    </div>
                                                    <div className="mt-3 border-t border-dashed border-[#E1DDF0] pt-2 flex items-center justify-between">
                                                        <p className="text-[8px] font-bold uppercase tracking-[0.1em] text-[#8B8498]">Onboarded {client.onboardedOn}</p>
                                                        <button
                                                            type="button"
                                                            onClick={() => navigate('/dashboard/clients', { state: { selectedClientId: client.id } })}
                                                            className="rounded bg-[#2717D7] px-2 py-1 text-[9px] font-black uppercase tracking-wider text-white hover:bg-[#1f11ab] transition-colors"
                                                        >
                                                            View Details
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="col-span-full rounded-[8px] border border-dashed border-[#D8D2EB] bg-[#FCFBFF] p-4 text-center">
                                                <p className="text-xs font-black text-[#171327]">No clients onboarded</p>
                                                <p className="mt-0.5 text-[10px] font-bold text-[#615C71]">Clients referred in the app will show here.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Collapsible Wallet Transaction History Audit Log */}
                            <div className="rounded-[8px] border border-[#D8D2EB] bg-white p-4">
                                <details className="group" open>
                                    <summary className="flex cursor-pointer items-center justify-between font-black text-[#171327] outline-none select-none">
                                        <div className="flex items-center gap-2">
                                            <CreditCard size={14} className="text-[#2717D7]" />
                                            <span className="text-[10px] font-black uppercase tracking-wider">Wallet Transaction & Payout Log</span>
                                        </div>
                                        <span className="text-[10px] font-bold text-[#7B7486] group-open:rotate-180 transition-transform">&#9662;</span>
                                    </summary>
                                    <div className="mt-3 border-t border-[#E1DDF0] pt-3">
                                        <div className="space-y-1.5">
                                            {selectedBroker.transactions.map((transaction) => (
                                                <div key={transaction.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-[8px] border border-[#E1DDF0] bg-[#FCFBFF] p-2 text-xs">
                                                    <div className="min-w-0">
                                                        <p className="font-black text-[#171327] text-[11px]">{transaction.property_name || 'Commission adjustment'}</p>
                                                        <p className="text-[9px] font-bold text-[#615C71]">ID: {transaction.id} &bull; {transaction.created_at}</p>
                                                    </div>
                                                    <div className="flex items-center gap-3 justify-between sm:justify-end">
                                                        <span className="text-[9px] font-bold text-[#615C71]">{transaction.bank_name}</span>
                                                        <span className={transaction.type === 'credit' ? 'font-black text-[#0C6B39] text-[11px]' : 'font-black text-[#B42318] text-[11px]'}>
                                                            {transaction.type === 'credit' ? '+' : '-'} {formatCurrency(transaction.amount)}
                                                        </span>
                                                        <StatusPill status={transaction.status} />
                                                    </div>
                                                </div>
                                            ))}
                                            {selectedBroker.transactions.length === 0 && (
                                                <p className="text-center py-2 text-[10px] font-bold text-[#615C71]">No transactions logged.</p>
                                            )}
                                        </div>
                                    </div>
                                </details>
                            </div>
                        </section>
                    </div>
                </div>
            </main>

            <BrokerPropertyDetailsModal
                property={selectedPropertyDetails}
                selectedBroker={selectedBroker}
                isOpen={!!selectedPropertyDetails}
                onClose={() => setSelectedPropertyDetails(null)}
            />
        </div>
    );
};

const MetricTile = ({ icon: Icon, label, value }) => (
    <div className="rounded-[8px] border border-[#D8D2EB] bg-[#FCFBFF] p-2">
        <Icon className="h-3.5 w-3.5 text-[#2717D7]" />
        <p className="mt-1.5 text-[8px] font-black uppercase tracking-[0.12em] text-[#7B7486]">{label}</p>
        <p className="mt-0.5 truncate text-sm font-black text-[#171327]">{value}</p>
    </div>
);

const MiniStat = ({ label, value }) => (
    <div className="min-w-0 rounded-[6px] bg-white p-1.5 ring-1 ring-[#E1DDF0]">
        <p className="text-[8px] font-black uppercase text-[#8B8498]">{label}</p>
        <p className="mt-0.5 truncate text-[9px] font-black text-[#171327]">{value}</p>
    </div>
);

const SectionHeader = ({ icon: Icon, title, helper, compact = false }) => (
    <div className={`flex items-start justify-between gap-3 ${compact ? '' : 'border-b border-[#E1DDF0] pb-2.5'}`}>
        <div>
            <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[#5E5A71]">{title}</p>
            <p className="mt-0.5 text-xs font-medium text-[#615C71]">{helper}</p>
        </div>
        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-[6px] bg-[#F0EDFF] text-[#2717D7]">
            <Icon size={15} />
        </div>
    </div>
);

const StatusPill = ({ status }) => (
    <span className={`inline-flex rounded-full px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider ${getStatusClass(status)}`}>
        {status}
    </span>
);

const BrokerPropertyDetailsModal = ({ property, selectedBroker, isOpen, onClose }) => {
    if (!property) return null;

    const projectDetails = {
        id: property.id,
        name: property.name,
        builder: selectedBroker.agency || 'Aarambh Realty',
        location: property.location,
        priceRange: formatCurrency(property.price),
        specs: `${property.category} - ${property.type}`,
        status: property.status,
        units: 1,
        available: property.status === 'Approved' ? 1 : 0,
        progress: property.status === 'Approved' ? 100 : 50,
        officer: 'Operations Desk',
        updated: property.uploadedOn,
        inventory: [
            {
                type: property.type,
                size: 'Onboarded Unit',
                basePrice: formatCurrency(property.price),
                totalUnits: 1,
                availableUnits: property.status === 'Approved' ? 1 : 0,
            }
        ],
    };

    const buildInventoryWithUnits = (project) => (project.inventory || []).map((config, configIndex) => {
        const displayUnits = 6;
        return {
            ...config,
            unitsList: Array.from({ length: displayUnits }, (_, index) => {
                return {
                    id: `${project.id}-${configIndex}-${index}`,
                    number: `${index + 1}`.padStart(3, '0'),
                    status: index === 0 && property.status === 'Approved' ? 'Available' : 'Sold',
                };
            }),
        };
    });

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`${projectDetails.name} - Full Property Details`} size="xl">
            <div className="space-y-6">
                {/* Property Image Gallery */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="md:col-span-2 relative h-52 rounded-2xl overflow-hidden border border-[#E1DDF0]">
                        <img 
                            src={samplePropertyImage} 
                            alt={projectDetails.name} 
                            className="w-full h-full object-cover" 
                        />
                        <div className="absolute bottom-3 left-3 rounded-lg bg-black/60 backdrop-blur-xs px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-white">
                            Referred Property Hero View
                        </div>
                    </div>
                    <div className="grid grid-rows-2 gap-3">
                        <div className="relative h-[100px] rounded-xl overflow-hidden border border-[#E1DDF0]">
                            <img 
                                src={samplePropertyImage} 
                                alt="Interior View" 
                                className="w-full h-full object-cover brightness-95" 
                            />
                            <div className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-0.5 text-[8px] font-bold text-white">
                                Layout Plan
                            </div>
                        </div>
                        <div className="relative h-[100px] rounded-xl overflow-hidden border border-[#E1DDF0]">
                            <img 
                                src={samplePropertyImage} 
                                alt="Elevation View" 
                                className="w-full h-full object-cover brightness-90" 
                            />
                            <div className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-0.5 text-[8px] font-bold text-white">
                                Elevation View
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6">
                    <div className="rounded-2xl border border-gray-100 bg-gradient-to-br from-[#2717D7]/10 to-white p-6">
                        <div className="flex items-start gap-4">
                            <div className="h-14 w-14 rounded-2xl bg-[#2717D7] text-white flex items-center justify-center shadow-lg shadow-[#2717D7]/20">
                                <Building2 className="h-7 w-7" />
                            </div>
                            <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                    <h3 className="text-2xl font-black text-[#171327] tracking-tight">{projectDetails.name}</h3>
                                    <span className={`rounded-full px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider ${getStatusClass(projectDetails.status)}`}>
                                        {projectDetails.status}
                                    </span>
                                </div>
                                <p className="mt-2 text-sm font-bold text-gray-600 flex items-center gap-1.5">
                                    <MapPin className="h-4 w-4 text-rose-500" /> {projectDetails.location}
                                </p>
                                <p className="mt-3 text-sm font-semibold text-gray-600">
                                    Premium property referred by <span className="text-[#2717D7] font-black">{selectedBroker.name} ({selectedBroker.agency})</span> with ID <span className="font-black text-gray-900">{property.id}</span>.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {[
                            ['Property No.', property.id],
                            ['Price', projectDetails.priceRange],
                            ['Specifications', projectDetails.specs],
                            ['Uploaded', projectDetails.updated],
                        ].map(([label, value]) => (
                            <div key={label} className="rounded-xl border border-[#E1DDF0] bg-white p-4 shadow-sm">
                                <p className="text-[10px] font-black uppercase tracking-widest text-[#8B8498]">{label}</p>
                                <p className="mt-2 text-sm font-black text-[#171327]">{value}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="rounded-xl border border-[#E1DDF0] bg-[#FCFBFF] p-4">
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#8B8498]">Agency & Verification</p>
                        <div className="mt-3 space-y-2 text-sm font-bold text-[#514B63]">
                            <p>Broker: <span className="text-gray-950">{selectedBroker.name}</span></p>
                            <p>Agency: <span className="text-gray-950">{selectedBroker.agency}</span></p>
                            <p>KYC: <span className="text-gray-950">{selectedBroker.kycStatus}</span></p>
                        </div>
                    </div>
                    <div className="rounded-xl border border-[#E1DDF0] bg-[#FCFBFF] p-4">
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#8B8498]">Commission Summary</p>
                        <div className="mt-3 space-y-2 text-sm font-bold text-[#514B63]">
                            <p>Price: <span className="text-indigo-600">{formatCurrency(property.price)}</span></p>
                            <p>Photos Count: <span className="text-gray-950">{property.photos}</span></p>
                            <p>Docs Count: <span className="text-gray-950">{property.documents}</span></p>
                        </div>
                    </div>
                    <div className="rounded-xl border border-[#E1DDF0] bg-[#FCFBFF] p-4">
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#8B8498]">Registration Details</p>
                        <div className="mt-3 space-y-2 text-sm font-bold text-[#514B63]">
                            <p>Status: <span className="text-gray-950">{property.status}</span></p>
                            <p>RERA Status: <span className="text-gray-950">{property.status === 'Approved' ? 'Verified' : 'Pending Review'}</span></p>
                            <p>Referral Code: <span className="text-gray-950">{selectedBroker.id}</span></p>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-[#E1DDF0] bg-white overflow-hidden">
                    <div className="border-b border-[#E1DDF0] p-5">
                        <h4 className="text-sm font-black uppercase tracking-widest text-[#171327] flex items-center gap-2">
                            <ClipboardList className="h-4 w-4 text-[#2717D7]" /> Configuration, Pricing & Unit Plan
                        </h4>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#FCFBFF]">
                                    {['Configuration', 'Area', 'Base Price', 'Available', 'Property No. / Sample Units'].map((header) => (
                                        <th key={header} className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-[#8B8498]">{header}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E1DDF0]">
                                {buildInventoryWithUnits(projectDetails).map((config) => (
                                    <tr key={config.type}>
                                        <td className="px-5 py-4 text-sm font-black text-[#171327]">{config.type}</td>
                                        <td className="px-5 py-4 text-sm font-bold text-gray-600">{config.size}</td>
                                        <td className="px-5 py-4 text-sm font-black text-[#171327]">{config.basePrice}</td>
                                        <td className="px-5 py-4 text-sm font-bold text-emerald-600">{config.availableUnits} / {config.totalUnits}</td>
                                        <td className="px-5 py-4">
                                            <div className="flex flex-wrap gap-1.5">
                                                <span className="rounded-md border border-[#2717D7]/20 bg-[#2717D7]/10 px-2 py-1 text-[10px] font-black text-[#2717D7]">
                                                    {property.id}
                                                </span>
                                                {config.unitsList.slice(0, 6).map((unit) => (
                                                    <span key={unit.id} className={`rounded-md border px-2 py-1 text-[10px] font-black ${unit.status === 'Available' ? 'border-emerald-100 bg-emerald-50 text-emerald-700' : 'border-rose-100 bg-rose-50 text-rose-400'}`}>
                                                        {unit.number}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="rounded-2xl border border-[#E1DDF0] bg-white p-5">
                    <h4 className="text-sm font-black uppercase tracking-widest text-[#171327] flex items-center gap-2 mb-4">
                        <FileText className="h-4 w-4 text-[#2717D7]" /> Document Vault
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {['RERA Certificate', 'Master Brochure', 'Floor Plans', 'Pricing Sheet', 'Builder KYC', 'Site Layout'].map((doc) => (
                            <div key={doc} className="rounded-xl border border-[#E1DDF0] bg-[#FCFBFF] p-3">
                                <p className="text-sm font-black text-[#171327]">{doc}</p>
                                <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-[#8B8498]">Available - Updated {projectDetails.updated}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default BrokerCommission;
