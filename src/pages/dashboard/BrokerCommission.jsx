import { useMemo, useState } from 'react';
import {
    Banknote,
    Building2,
    CheckCircle2,
    ChevronRight,
    ClipboardList,
    Clock3,
    CreditCard,
    FileText,
    MapPin,
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
    const [activePageTab, setActivePageTab] = useState('brokerCommission');
    const [selectedBrokerId, setSelectedBrokerId] = useState(brokerCommissionData[0].id);
    const [search, setSearch] = useState('');
    const [propertyFilter, setPropertyFilter] = useState('All');
    const [withdrawalActions, setWithdrawalActions] = useState({});
    const [brokerDirectoryView, setBrokerDirectoryView] = useState('list');
    const [brokerDirectoryTab, setBrokerDirectoryTab] = useState('properties');
    const [selectedPropertyDetails, setSelectedPropertyDetails] = useState(null);
    const [selectedTransactionId, setSelectedTransactionId] = useState(null);

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
    const selectedTransaction = selectedBroker.transactions.find((transaction) => transaction.id === selectedTransactionId) || selectedBroker.transactions[0];
    const getTransactionStatus = (transaction) => withdrawalActions[transaction.id]?.status || transaction.status;
    const getTransactionUtr = (transaction) => withdrawalActions[transaction.id]?.utr || transaction.utr || 'Not assigned';
    const getTransactionLabel = (transaction) => {
        if (!transaction) return 'Wallet transaction';
        if (transaction.type === 'debit') return 'Wallet withdrawal';
        return 'Wallet credit';
    };

    const totals = brokerCommissionData.reduce((summary, broker) => ({
        brokers: summary.brokers + 1,
        balance: summary.balance + broker.wallet.balance,
        pendingPayout: summary.pendingPayout + broker.wallet.withdrawalPending,
    }), { brokers: 0, balance: 0, pendingPayout: 0 });

    const approveTransaction = (transactionId) => {
        setWithdrawalActions((current) => ({
            ...current,
            [transactionId]: {
                ...(current[transactionId] || {}),
                status: 'Approved',
                utr: current[transactionId]?.utr || `UTR-${transactionId.replace(/\D/g, '') || '0000'}-ADMIN`,
            },
        }));
    };

    const confirmTransaction = (transactionId) => {
        setWithdrawalActions((current) => ({
            ...current,
            [transactionId]: {
                ...(current[transactionId] || {}),
                status: 'Confirmed',
            },
        }));
    };



    return (
        <div className="flex h-full flex-1 flex-col bg-[#F5F6FA] text-[#15121F]">
            <Header title="Broker" />

            <main className="flex-1 overflow-y-auto overflow-x-hidden p-4">
                <div className="mx-auto max-w-[1600px] min-w-0 space-y-4">
                    <div className="flex flex-wrap gap-2 rounded-[8px] border border-[#D8D2EB] bg-white p-2 shadow-[0_1px_0_rgba(33,24,88,0.03)]">
                        {[
                            { id: 'broker', label: 'Broker' },
                            { id: 'brokerCommission', label: 'Wallet withdraw' },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActivePageTab(tab.id)}
                                className={`h-9 rounded-[6px] px-4 text-xs font-black uppercase tracking-[0.1em] transition-all ${
                                    activePageTab === tab.id
                                        ? 'bg-[#2717D7] text-white shadow-sm'
                                        : 'text-[#615C71] hover:bg-[#F4F1FF] hover:text-[#2717D7]'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {activePageTab === 'broker' ? (
                        <section className="rounded-[8px] border border-[#D8D2EB] bg-white p-4 shadow-[0_1px_0_rgba(33,24,88,0.03)]">
                            {brokerDirectoryView === 'list' ? (
                                <>
                                    <div className="flex flex-col gap-1 border-b border-[#E1DDF0] pb-3 sm:flex-row sm:items-end sm:justify-between">
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#2717D7]">Broker directory</p>
                                            <h2 className="mt-1 text-lg font-black text-[#171327]">Broker basic details</h2>
                                        </div>
                                        <p className="text-xs font-bold text-[#615C71]">Minimal operational list with onboarded properties and payment totals.</p>
                                    </div>

                                    <div className="mt-4 space-y-2">
                                        {brokerCommissionData.map((broker) => {
                                            const paidCommission = broker.commissions
                                                .filter((commission) => commission.status === 'Paid')
                                                .reduce((sum, commission) => sum + commission.amount, 0);
                                            const pendingCommission = broker.commissions
                                                .filter((commission) => commission.status !== 'Paid')
                                                .reduce((sum, commission) => sum + commission.amount, 0);

                                            return (
                                                <button
                                                    key={broker.id}
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedBrokerId(broker.id);
                                                        setBrokerDirectoryView('detail');
                                                        setBrokerDirectoryTab('properties');
                                                        setPropertyFilter('All');
                                                    }}
                                                    className="flex w-full flex-col gap-3 rounded-[8px] border border-[#E1DDF0] bg-[#FCFBFF] p-3 text-left transition-all hover:border-[#2717D7] hover:bg-[#F4F1FF] lg:flex-row lg:items-center lg:justify-between"
                                                >
                                                    <div className="flex min-w-0 items-start justify-between gap-3 lg:w-[260px]">
                                                        <div className="min-w-0">
                                                            <p className="truncate text-sm font-black text-[#171327]">{broker.name}</p>
                                                            <p className="mt-0.5 truncate text-[10px] font-bold text-[#615C71]">{broker.agency}</p>
                                                            <p className="mt-1 text-[9px] font-bold text-[#615C71]">{broker.mobile}</p>
                                                        </div>
                                                        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[8px] font-black uppercase tracking-wider ${getStatusClass(broker.brokerStatus)}`}>
                                                            {broker.brokerStatus}
                                                        </span>
                                                    </div>
                                                    <div className="grid flex-1 grid-cols-2 gap-2 md:grid-cols-4">
                                                        <MiniStat label="Properties onboarded" value={broker.stats.total_properties} />
                                                        <MiniStat label="Sales" value={broker.stats.sales} />
                                                        <MiniStat label="Wallet" value={formatCurrency(broker.wallet.balance)} />
                                                        <MiniStat label="Payment pending" value={formatCurrency(pendingCommission + broker.wallet.withdrawalPending)} />
                                                    </div>
                                                    <div className="flex shrink-0 items-center justify-between gap-3 border-t border-[#E1DDF0] pt-2 lg:w-[150px] lg:border-l lg:border-t-0 lg:pl-3 lg:pt-0">
                                                        <div>
                                                            <p className="text-[8px] font-black uppercase tracking-wider text-[#8B8498]">Paid</p>
                                                            <p className="mt-0.5 text-[10px] font-black text-[#0C6B39]">{formatCurrency(paidCommission)}</p>
                                                        </div>
                                                        <ChevronRight className="h-4 w-4 text-[#7B7486]" />
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex flex-col gap-3 border-b border-[#E1DDF0] pb-3 lg:flex-row lg:items-center lg:justify-between">
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#2717D7]">Broker directory</p>
                                            <h2 className="mt-1 text-lg font-black text-[#171327]">{selectedBroker.name}</h2>
                                            <p className="mt-0.5 text-xs font-bold text-[#615C71]">{selectedBroker.agency} &bull; {selectedBroker.mobile}</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setBrokerDirectoryView('list')}
                                            className="h-9 rounded-[6px] border border-[#D8D2EB] bg-[#FCFBFF] px-3 text-[10px] font-black uppercase tracking-[0.1em] text-[#514B63] transition-colors hover:border-[#2717D7] hover:text-[#2717D7]"
                                        >
                                            Back to broker list
                                        </button>
                                    </div>

                                    <div className="flex gap-4 border-b border-[#D8D2EB]">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setBrokerDirectoryTab('properties');
                                                setPropertyFilter('All');
                                            }}
                                            className={`pb-2 text-xs font-black uppercase tracking-wider border-b-2 transition-all ${brokerDirectoryTab === 'properties' ? 'border-[#2717D7] text-[#2717D7]' : 'border-transparent text-[#615C71] hover:text-[#2717D7]'}`}
                                        >
                                            Properties Onboarded ({selectedBroker.uploadedProperties.length})
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setBrokerDirectoryTab('clients')}
                                            className={`pb-2 text-xs font-black uppercase tracking-wider border-b-2 transition-all ${brokerDirectoryTab === 'clients' ? 'border-[#2717D7] text-[#2717D7]' : 'border-transparent text-[#615C71] hover:text-[#2717D7]'}`}
                                        >
                                            Clients Onboarded ({selectedBroker.clients?.length || 0})
                                        </button>
                                    </div>

                                    {brokerDirectoryTab === 'properties' && (
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
                                            <div className="mt-3 grid grid-cols-1 gap-2.5 md:grid-cols-2 xl:grid-cols-3">
                                                {selectedProperties.map((property) => {
                                                    const commission = selectedBroker.commissions.find((item) => item.propertyName === property.name);
                                                    return (
                                                        <div key={property.id} className="flex flex-col justify-between rounded-[8px] border border-[#E1DDF0] bg-[#FCFBFF] p-3">
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

                                                            <div className="mt-3 border-t border-dashed border-[#E1DDF0] pt-2.5">
                                                                {commission ? (
                                                                    <div className="flex items-center justify-between text-[10px]">
                                                                        <div>
                                                                            <p className="text-[8px] font-black uppercase tracking-wider text-[#8B8498]">Commission ({commission.rate}%)</p>
                                                                            <p className="mt-0.5 font-black text-[#0C6B39]">{formatCurrency(commission.amount)}</p>
                                                                        </div>
                                                                        <div className="text-right">
                                                                            <p className="text-[8px] font-black uppercase tracking-wider text-[#8B8498]">Payout Status</p>
                                                                            <div className="mt-0.5">
                                                                                <StatusPill status={commission.status} />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <div className="py-1 text-center">
                                                                        <p className="text-[9px] font-bold text-[#8B8498]">No commission recorded</p>
                                                                    </div>
                                                                )}
                                                                <div className="mt-2.5 flex items-center justify-between border-t border-dashed border-[#E1DDF0]/50 pt-2">
                                                                    <p className="text-[8px] font-bold uppercase tracking-[0.1em] text-[#8B8498]">Uploaded {property.uploadedOn}</p>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setSelectedPropertyDetails(property)}
                                                                        className="rounded bg-[#2717D7] px-2 py-1 text-[9px] font-black uppercase tracking-wider text-white transition-colors hover:bg-[#1f11ab]"
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

                                    {brokerDirectoryTab === 'clients' && (
                                        <div className="rounded-[8px] border border-[#D8D2EB] bg-white p-4">
                                            <div className="flex items-start justify-between border-b border-[#E1DDF0] pb-2.5">
                                                <div>
                                                    <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[#5E5A71]">Onboarded Clients</p>
                                                    <p className="mt-0.5 text-xs font-medium text-[#615C71]">Clients referred/onboarded by this broker.</p>
                                                </div>
                                            </div>
                                            <div className="mt-3 grid grid-cols-1 gap-2.5 md:grid-cols-2 xl:grid-cols-3">
                                                {selectedBroker.clients && selectedBroker.clients.length ? (
                                                    selectedBroker.clients.map((client) => (
                                                        <div key={client.id} className="flex flex-col justify-between rounded-[8px] border border-[#E1DDF0] bg-[#FCFBFF] p-3">
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
                                                            <div className="mt-3 flex items-center justify-between border-t border-dashed border-[#E1DDF0] pt-2">
                                                                <p className="text-[8px] font-bold uppercase tracking-[0.1em] text-[#8B8498]">Onboarded {client.onboardedOn}</p>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => navigate('/dashboard/clients', { state: { selectedClientId: client.id } })}
                                                                    className="rounded bg-[#2717D7] px-2 py-1 text-[9px] font-black uppercase tracking-wider text-white transition-colors hover:bg-[#1f11ab]"
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
                                </div>
                            )}
                        </section>
                    ) : (
                        <>
                            <section className="rounded-[8px] border border-[#D8D2EB] bg-white p-4 shadow-[0_1px_0_rgba(33,24,88,0.03)]">
                                <div className="flex flex-col gap-3.5 xl:flex-row xl:items-center xl:justify-between">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#2717D7]">Wallet withdraw panel</p>
                                        <h2 className="mt-1 text-lg font-black text-[#171327]">Broker wallet balance and transactions</h2>
                                        <p className="mt-0.5 max-w-2xl text-xs font-medium leading-normal text-[#615C71]">
                                            Select a broker, review wallet movement, then approve and confirm transaction payouts.
                                        </p>
                                    </div>
                                    <div className="grid w-full gap-2 sm:grid-cols-3 xl:w-auto">
                                        <MetricTile icon={UserRound} label="Brokers" value={totals.brokers} />
                                        <MetricTile icon={Banknote} label="Total balance" value={formatCurrency(totals.balance)} />
                                        <MetricTile icon={Clock3} label="Pending withdraw" value={formatCurrency(totals.pendingPayout)} />
                                    </div>
                                </div>
                            </section>

                            <div className="grid min-w-0 gap-4 xl:grid-cols-[170px_minmax(0,1fr)]">
                                <aside className="min-w-0 space-y-4">
                                    <section className="rounded-[8px] border border-[#D8D2EB] bg-white p-3">
                                        <div className="flex items-center gap-2 rounded-[6px] border border-[#D8D2EB] bg-[#FCFBFF] px-2">
                                            <Search size={14} className="text-[#7B7486]" />
                                            <input
                                                value={search}
                                                onChange={(event) => setSearch(event.target.value)}
                                                placeholder="Search"
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
                                                        onClick={() => {
                                                            setSelectedBrokerId(broker.id);
                                                            setSelectedTransactionId(null);
                                                        }}
                                                        className={`flex min-h-10 w-full items-center rounded-[8px] border px-2.5 text-left transition-all ${selected ? 'border-[#2717D7] bg-[#F4F1FF]' : 'border-[#E1DDF0] bg-white hover:border-[#2717D7]'}`}
                                                    >
                                                        <div className="min-w-0">
                                                            <p className="truncate text-xs font-black text-[#171327]">{broker.name}</p>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </section>
                                </aside>

                                <section className="grid min-w-0 gap-4 2xl:grid-cols-[minmax(0,1fr)_320px]">
                                    <div className="min-w-0 space-y-4">
                                        <div className="rounded-[8px] border border-[#D8D2EB] bg-white p-4">
                                            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                                <div className="flex min-w-0 items-center gap-2.5">
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F0EDFF] text-[#2717D7]">
                                                        <UserRound size={20} />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <h3 className="truncate text-sm font-black text-[#171327]">{selectedBroker.name}</h3>
                                                            <span className="rounded-full bg-[#F4F1FF] px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider text-[#2717D7]">
                                                                {selectedBroker.id}
                                                            </span>
                                                            <StatusPill status={selectedBroker.kycStatus} />
                                                        </div>
                                                        <p className="mt-0.5 truncate text-xs font-bold text-[#615C71]">{selectedBroker.mobile} &bull; {selectedBroker.email}</p>
                                                    </div>
                                                </div>

                                                <div className="grid min-w-0 gap-2 sm:grid-cols-3 lg:w-[480px]">
                                                    <div className="rounded-[6px] border border-[#E1DDF0] bg-[#FCFBFF] p-2">
                                                        <p className="text-[8px] font-black uppercase tracking-wider text-[#8B8498]">Total balance</p>
                                                        <p className="mt-1 text-sm font-black text-[#2717D7]">{formatCurrency(selectedBroker.wallet.balance)}</p>
                                                    </div>
                                                    <div className="rounded-[6px] border border-[#E1DDF0] bg-[#FCFBFF] p-2">
                                                        <p className="text-[8px] font-black uppercase tracking-wider text-[#8B8498]">Earned</p>
                                                        <p className="mt-1 text-sm font-black text-[#0C6B39]">{formatCurrency(selectedBroker.wallet.totalEarned)}</p>
                                                    </div>
                                                    <div className="rounded-[6px] border border-[#E1DDF0] bg-[#FCFBFF] p-2">
                                                        <p className="text-[8px] font-black uppercase tracking-wider text-[#8B8498]">Withdrawn</p>
                                                        <p className="mt-1 text-sm font-black text-[#B42318]">{formatCurrency(selectedBroker.wallet.totalWithdrawn)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="rounded-[8px] border border-[#D8D2EB] bg-white p-4">
                                            <div className="flex items-center justify-between border-b border-[#E1DDF0] pb-2.5">
                                                <div className="flex items-center gap-2">
                                                    <CreditCard size={14} className="text-[#2717D7]" />
                                                    <p className="text-[10px] font-black uppercase tracking-wider text-[#171327]">Transactions</p>
                                                </div>
                                                <span className="text-[10px] font-bold text-[#615C71]">{selectedBroker.transactions.length} records</span>
                                            </div>

                                            <div className="mt-3 divide-y divide-[#E1DDF0]">
                                                {selectedBroker.transactions.map((transaction) => {
                                                    const status = getTransactionStatus(transaction);
                                                    const selected = selectedTransaction?.id === transaction.id;
                                                    return (
                                                        <button
                                                            key={transaction.id}
                                                            type="button"
                                                            onClick={() => setSelectedTransactionId(transaction.id)}
                                                            className={`grid min-w-0 w-full gap-3 px-2 py-3 text-left transition-colors md:grid-cols-[minmax(0,1fr)_120px_105px] md:items-center ${selected ? 'bg-[#F4F1FF]' : 'hover:bg-[#FCFBFF]'}`}
                                                        >
                                                            <div className="min-w-0">
                                                                <p className="text-xs font-black text-[#171327]">{getTransactionLabel(transaction)}</p>
                                                                <p className="mt-0.5 text-[9px] font-bold text-[#615C71]">{transaction.id} &bull; {transaction.created_at}</p>
                                                                <p className="mt-1 truncate text-[10px] font-bold text-[#514B63]">{transaction.bank_name}</p>
                                                            </div>
                                                            <div className="flex items-center justify-between gap-2 md:justify-end">
                                                                <span className={transaction.type === 'credit' ? 'truncate text-xs font-black text-[#0C6B39]' : 'truncate text-xs font-black text-[#B42318]'}>
                                                                    {transaction.type === 'credit' ? '+' : '-'} {formatCurrency(transaction.amount)}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center justify-start md:justify-end">
                                                                <StatusPill status={status} />
                                                            </div>
                                                        </button>
                                                    );
                                                })}
                                                {selectedBroker.transactions.length === 0 && (
                                                    <p className="py-6 text-center text-[10px] font-bold text-[#615C71]">No transactions found.</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <aside className="min-w-0 rounded-[8px] border border-[#D8D2EB] bg-white p-4 2xl:sticky 2xl:top-4 2xl:self-start">
                                        {selectedTransaction ? (
                                            <div className="space-y-4">
                                                <div className="border-b border-[#E1DDF0] pb-3">
                                                    <p className="text-[10px] font-black uppercase tracking-wider text-[#2717D7]">Selected transaction</p>
                                                    <h3 className="mt-1 text-sm font-black text-[#171327]">{getTransactionLabel(selectedTransaction)}</h3>
                                                    <p className="mt-0.5 text-[10px] font-bold text-[#615C71]">{selectedTransaction.id}</p>
                                                </div>

                                                <div className="rounded-[8px] bg-[#FCFBFF] p-3 text-center ring-1 ring-[#E1DDF0]">
                                                    <p className={selectedTransaction.type === 'credit' ? 'text-xl font-black text-[#0C6B39]' : 'text-xl font-black text-[#B42318]'}>
                                                        {selectedTransaction.type === 'credit' ? '+' : '-'} {formatCurrency(selectedTransaction.amount)}
                                                    </p>
                                                    <div className="mt-2 flex justify-center">
                                                        <StatusPill status={getTransactionStatus(selectedTransaction)} />
                                                    </div>
                                                </div>

                                                <div className="space-y-2 text-xs">
                                                    <div className="rounded-[6px] border border-[#E1DDF0] p-2.5">
                                                        <p className="text-[8px] font-black uppercase tracking-wider text-[#8B8498]">Bank</p>
                                                        <p className="mt-0.5 break-words font-bold text-[#171327]">{selectedTransaction.bank_name}</p>
                                                    </div>
                                                    <div className="rounded-[6px] border border-[#E1DDF0] p-2.5">
                                                        <p className="text-[8px] font-black uppercase tracking-wider text-[#8B8498]">Date</p>
                                                        <p className="mt-0.5 font-bold text-[#171327]">{selectedTransaction.created_at}</p>
                                                    </div>
                                                    <div className="rounded-[6px] border border-[#E1DDF0] p-2.5">
                                                        <p className="text-[8px] font-black uppercase tracking-wider text-[#8B8498]">UTR</p>
                                                        <p className="mt-0.5 break-all font-bold text-[#171327]">{getTransactionUtr(selectedTransaction)}</p>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col gap-2 border-t border-[#E1DDF0] pt-3">
                                                    <button
                                                        type="button"
                                                        onClick={() => approveTransaction(selectedTransaction.id)}
                                                        disabled={getTransactionStatus(selectedTransaction) === 'Approved' || getTransactionStatus(selectedTransaction) === 'Confirmed'}
                                                        className="min-h-9 rounded-[6px] bg-[#2717D7] px-3 text-[10px] font-black uppercase tracking-[0.1em] text-white transition-colors hover:bg-[#1f11ab] disabled:cursor-not-allowed disabled:bg-[#C5BEDD]"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => confirmTransaction(selectedTransaction.id)}
                                                        disabled={getTransactionStatus(selectedTransaction) !== 'Approved'}
                                                        className="inline-flex min-h-9 items-center justify-center gap-1 rounded-[6px] border border-[#B7E5C8] bg-[#E8F9EE] px-3 text-[10px] font-black uppercase tracking-[0.1em] text-[#0C6B39] transition-colors hover:bg-[#DDF4E7] disabled:cursor-not-allowed disabled:border-[#E1DDF0] disabled:bg-white disabled:text-[#A9A2B5]"
                                                    >
                                                        <CheckCircle2 size={12} /> Confirm
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="py-8 text-center">
                                                <CreditCard className="mx-auto h-6 w-6 text-[#A9A2B5]" />
                                                <p className="mt-2 text-xs font-black text-[#171327]">No transaction selected</p>
                                                <p className="mt-1 text-[10px] font-bold text-[#615C71]">Choose a transaction to review it.</p>
                                            </div>
                                        )}
                                    </aside>
                                </section>
                            </div>
                        </>
                    )}
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
