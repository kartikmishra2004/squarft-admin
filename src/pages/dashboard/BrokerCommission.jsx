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
    ShieldCheck,
    TrendingUp,
    UserRound,
    WalletCards,
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
            { id: 'WDR-1091', requestedAmount: 250000, bankName: 'Bank of India', requestedAt: '14 Jun 2026, 10:45 AM', status: 'Pending approval' },
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
        withdrawals: [],
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
            { id: 'WDR-1187', requestedAmount: 500000, bankName: 'Axis Bank', requestedAt: '12 Jun 2026, 05:20 PM', status: 'Compliance hold' },
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

    const totals = brokerCommissionData.reduce((summary, broker) => ({
        brokers: summary.brokers + 1,
        properties: summary.properties + broker.stats.total_properties,
        balance: summary.balance + broker.wallet.balance,
        pendingPayout: summary.pendingPayout + broker.wallet.withdrawalPending,
    }), { brokers: 0, properties: 0, balance: 0, pendingPayout: 0 });

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
                                    <span className="rounded-full bg-[#E9F8EF] px-3 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-[#04622E]">Wallet + commission control</span>
                                </div>
                                <h2 className="mt-3 text-2xl font-black text-[#171327]">Broker commission and wallet supervision</h2>
                                <p className="mt-1 max-w-3xl text-sm font-medium leading-6 text-[#615C71]">
                                    Review broker details, uploaded properties, property-wise commissions, wallet balances, bank accounts, transactions, and withdrawal requests in one admin view.
                                </p>
                            </div>
                            <div className="grid gap-3 sm:grid-cols-2 xl:min-w-[560px] xl:grid-cols-4">
                                <MetricTile icon={UserRound} label="Brokers" value={totals.brokers} />
                                <MetricTile icon={Home} label="Properties" value={totals.properties} />
                                <MetricTile icon={WalletCards} label="Wallets" value={formatCurrency(totals.balance)} />
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
                                    <SectionHeader icon={WalletCards} title="Wallet management" helper="Mirrors broker wallet overview and withdraw flow." />
                                    <div className="mt-4 rounded-[10px] bg-[#2717D7] p-4 text-white">
                                        <p className="text-[10px] font-black uppercase tracking-[0.12em] text-white/70">Main balance</p>
                                        <p className="mt-2 text-3xl font-black">{formatCurrency(selectedBroker.wallet.balance)}</p>
                                        <div className="mt-4 grid grid-cols-2 gap-3">
                                            <WalletStat label="Earned" value={formatCurrency(selectedBroker.wallet.totalEarned)} />
                                            <WalletStat label="Withdrawn" value={formatCurrency(selectedBroker.wallet.totalWithdrawn)} />
                                            <WalletStat label="Locked" value={formatCurrency(selectedBroker.wallet.lockedAmount)} />
                                            <WalletStat label="Pending" value={formatCurrency(selectedBroker.wallet.withdrawalPending)} />
                                        </div>
                                    </div>
                                    <div className="mt-4 space-y-2">
                                        {selectedBroker.bankAccounts.map((bank) => (
                                            <div key={bank.id} className="flex items-center justify-between gap-3 rounded-[8px] border border-[#E1DDF0] bg-[#FCFBFF] p-3">
                                                <div className="min-w-0">
                                                    <p className="truncate text-xs font-black text-[#171327]">{bank.bankName}</p>
                                                    <p className="mt-1 text-[10px] font-bold text-[#615C71]">{bank.accountNumberMasked} / {bank.ifsc}</p>
                                                </div>
                                                <span className={`shrink-0 rounded-full px-2 py-1 text-[9px] font-black uppercase ${getStatusClass(bank.status)}`}>{bank.status}</span>
                                            </div>
                                        ))}
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
                                <SectionHeader icon={Landmark} title="Withdrawal approvals" helper="Admin can later approve, reject, or hold broker withdrawal requests from this queue." />
                                <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                                    {(selectedBroker.withdrawals.length ? selectedBroker.withdrawals : [{ id: 'NO-REQUEST', requestedAmount: 0, bankName: 'No active withdrawal request', requestedAt: 'All wallet funds are clear', status: 'Clear' }]).map((withdrawal) => (
                                        <div key={withdrawal.id} className="rounded-[10px] border border-[#E1DDF0] bg-[#FCFBFF] p-4">
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <p className="text-sm font-black text-[#171327]">{withdrawal.id}</p>
                                                    <p className="mt-1 text-xs font-bold text-[#615C71]">{withdrawal.bankName}</p>
                                                </div>
                                                <StatusPill status={withdrawal.status} />
                                            </div>
                                            <p className="mt-4 text-2xl font-black text-[#2717D7]">{formatCurrency(withdrawal.requestedAmount)}</p>
                                            <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.1em] text-[#8B8498]">{withdrawal.requestedAt}</p>
                                        </div>
                                    ))}
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

const WalletStat = ({ label, value }) => (
    <div className="rounded-[8px] bg-white/10 p-3">
        <p className="text-[9px] font-black uppercase tracking-[0.12em] text-white/60">{label}</p>
        <p className="mt-1 truncate text-sm font-black text-white">{value}</p>
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
        <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[640px] text-left">
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

export default BrokerCommission;
