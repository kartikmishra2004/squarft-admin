import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
    Filter, Eye, Trash2, ArrowRight, PhoneCall, Check, X, 
    FileText, MoreVertical, Building2, MapPin, CreditCard, 
    History, MessageSquare, Calendar, User, ClipboardList,
    Settings, Search, IndianRupee, Briefcase, Clock,
    Edit2, CheckCircle2
} from 'lucide-react';
import { setSelectedDeal, deleteDeal, updateDealStatus } from '../../store/dealsSlice';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Header from '../../components/layout/Header';
import Table from '../../components/ui/Table';

const getStatusBadge = (status) => {
    if (!status) return null;
    switch (status.toUpperCase()) {
        case 'APPROVED': case 'ACTIVE': case 'CLEARED': case 'RECEIVED': case 'CLOSURE': case 'COMPLETED':
            return <Badge variant="green">{status}</Badge>;
        case 'IN REVIEW': case 'PENDING': case 'CONTACTED': case 'VISIT': case 'DEAL': case 'NEGOTIATING':
            return <Badge variant="yellow">{status}</Badge>;
        case 'REJECTED': case 'LOST':
            return <Badge variant="red">{status}</Badge>;
        case 'NEW': case 'LEAD':
            return <Badge variant="purple">{status}</Badge>;
        case 'FINALIZED':
            return <Badge variant="gradient">{status}</Badge>;
        default:
            return <Badge variant="gray">{status}</Badge>;
    }
};

const Deals = () => {
    const dispatch = useDispatch();
    const { deals, selectedDeal } = useSelector((state) => state.deals);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredDeals = deals.filter(deal => 
        deal.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deal.dealCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deal.property.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleViewDeal = (deal) => {
        dispatch(setSelectedDeal(deal));
    };

    const handleDeleteDeal = (dealCode) => {
        if (window.confirm(`Are you sure you want to delete deal ${dealCode}?`)) {
            dispatch(deleteDeal(dealCode));
        }
    };

    const handleBack = () => {
        dispatch(setSelectedDeal(null));
    };

    if (selectedDeal) {
        return <DealDetailView deal={selectedDeal} onBack={handleBack} />;
    }

    return (
        <div className="flex-1 flex flex-col h-full relative bg-[#F5F6FA] font-sans text-gray-900">
            <Header title="Deal Management" />

            <main className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth">
                <div className="max-w-[1600px] mx-auto space-y-6">
                    
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div>
                            <h2 className="text-2xl font-black text-gray-800 tracking-tight uppercase">Customer List</h2>
                            <p className="text-sm text-gray-500 mt-1 font-medium italic">Manage and track all finalized deals and property owners.</p>
                        </div>
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <div className="relative flex-1 sm:w-80">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by customer, deal code, property..."
                                    className="pl-9 pr-4 py-2.5 w-full bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6F4BFF]/20 focus:border-[#6F4BFF] transition-all shadow-sm"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Button icon={Filter} variant="secondary" className="font-black uppercase tracking-widest text-xs">Filter</Button>
                        </div>
                    </div>

                    <Card noPadding className="overflow-hidden border-gray-100 shadow-xl shadow-gray-200/50">
                        <Table
                            headers={['DEAL CODE', 'CUSTOMER', 'PROPERTY', 'CITY', 'SALES OFFICER', 'BROKER', 'STATUS', 'CREATED ON', 'ACTION']}
                            data={filteredDeals}
                            renderRow={(deal, i) => (
                                <tr key={i} className="hover:bg-gray-50/80 transition-all border-b border-gray-100 last:border-0">
                                    <td className="px-6 py-5 font-black text-gray-700">{deal.dealCode}</td>
                                    <td className="px-6 py-5">
                                        <div className="font-black text-gray-900">{deal.customer}</div>
                                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{deal.customerPhone}</div>
                                    </td>
                                    <td className="px-6 py-5 font-black text-gray-800">{deal.property}</td>
                                    <td className="px-6 py-5 font-bold text-gray-600">{deal.city}</td>
                                    <td className="px-6 py-5">
                                        <div className="font-black text-gray-700">{deal.salesOfficer}</div>
                                        <div className="text-[10px] text-gray-400 font-bold uppercase">{deal.salesOfficerMobile}</div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="font-black text-gray-700">{deal.broker}</div>
                                        <div className="text-[10px] text-gray-400 font-bold uppercase">{deal.brokerMobile}</div>
                                    </td>
                                    <td className="px-6 py-5">
                                        {getStatusBadge(deal.status)}
                                    </td>
                                    <td className="px-6 py-5 font-bold text-gray-500">{deal.createdOn}</td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={() => handleViewDeal(deal)}
                                                className="w-9 h-9 rounded-xl bg-gray-900 text-white flex items-center justify-center hover:bg-black transition-all shadow-lg shadow-gray-900/10" 
                                                title="View Deal"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteDeal(deal.dealCode)}
                                                className="w-9 h-9 rounded-xl bg-rose-500 text-white flex items-center justify-center hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/10" 
                                                title="Delete Deal"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        />
                    </Card>
                </div>
            </main>
        </div>
    );
};

const DealDetailView = ({ deal, onBack }) => {
    const [activeTab, setActiveTab] = useState('Payment Schedule');
    const tabs = ['Meeting', 'Negotiation', 'Notes', 'Timeline', 'Collect Token Money', 'Payment Schedule', 'Payment History', 'Document'];

    return (
        <div className="flex-1 flex flex-col h-full relative bg-[#F5F6FA] font-sans text-gray-900">
            <Header title="Deal Management" showBack onBack={onBack} />

            <main className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth">
                <div className="max-w-[1600px] mx-auto space-y-6">
                    
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/50 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="flex items-start gap-6">
                            <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shadow-inner">
                                <User className="w-8 h-8" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase">{deal.customer}</h2>
                                <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-1.5 font-bold uppercase tracking-widest">
                                    <PhoneCall className="w-4 h-4 text-[#6F4BFF]" /> {deal.customerPhone}
                                </p>
                                <div className="mt-4 inline-block bg-linear-to-r from-[#6F4BFF] to-[#9D84FF] text-white text-[10px] font-black px-4 py-1.5 rounded-lg tracking-widest uppercase shadow-lg shadow-[#6F4BFF]/20">PROPERTY OWNER</div>
                            </div>
                        </div>
                        <div className="flex gap-3 w-full md:w-auto">
                            <Button variant="success" icon={Check} className="flex-1 md:flex-none bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 font-black uppercase tracking-widest text-xs h-11">Finalize Deal</Button>
                            <Button variant="danger" icon={X} className="flex-1 md:flex-none bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/20 font-black uppercase tracking-widest text-xs h-11">Mark as Lost</Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="p-6 border-gray-100">
                            <div className="flex justify-between items-start mb-6 border-b border-gray-50 pb-4">
                                <h3 className="font-black text-gray-400 uppercase tracking-widest text-[10px]">DEAL OVERVIEW</h3>
                                {getStatusBadge(deal.status)}
                            </div>
                            <div className="space-y-4 text-sm">
                                <div className="flex justify-between items-center"><span className="text-gray-400 font-bold uppercase text-[10px]">Created On:</span> <span className="font-black text-gray-800">{deal.createdOn}</span></div>
                                <div className="flex justify-between items-center"><span className="text-gray-400 font-bold uppercase text-[10px]">Broker:</span> <span className="font-black text-gray-800">{deal.broker}</span></div>
                                <div className="flex justify-between items-center"><span className="text-gray-400 font-bold uppercase text-[10px]">Broker Mobile:</span> <span className="font-black text-gray-800">{deal.brokerMobile}</span></div>
                                <div className="flex justify-between items-center"><span className="text-gray-400 font-bold uppercase text-[10px]">Sales Officer:</span> <span className="font-black text-gray-800">{deal.salesOfficer}</span></div>
                                <div className="flex justify-between items-center"><span className="text-gray-400 font-bold uppercase text-[10px]">Sales Officer Mobile:</span> <span className="font-black text-gray-800">{deal.salesOfficerMobile}</span></div>
                            </div>
                        </Card>

                        <Card className="p-6 border-gray-100">
                            <h3 className="font-black text-gray-400 uppercase tracking-widest text-[10px] mb-6 border-b border-gray-50 pb-4">LOCATION PREFERENCES</h3>
                            <div className="space-y-4">
                                <p className="font-black text-gray-800 text-lg leading-tight tracking-tight uppercase">{deal.customer}</p>
                                <p className="text-gray-500 font-bold text-sm flex items-center gap-2"><PhoneCall className="w-4 h-4" /> {deal.customerPhone}</p>
                                <div className="pt-4 border-t border-gray-50 mt-4">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Preferred Location</p>
                                    <p className="font-black text-[#6F4BFF] text-sm uppercase">{deal.prefLocation}</p>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6 border-gray-100">
                            <h3 className="font-black text-gray-400 uppercase tracking-widest text-[10px] mb-6 border-b border-gray-50 pb-4">PROPERTY DETAILS</h3>
                            <div className="space-y-3.5 text-sm">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="p-1.5 rounded-lg bg-gray-50 border border-gray-100"><Building2 className="w-4 h-4 text-gray-400" /></div>
                                    <p className="font-black text-gray-700 uppercase tracking-widest text-xs">{deal.propType}</p>
                                </div>
                                <p className="text-gray-600 font-bold leading-relaxed mb-4 text-xs"><span className="text-gray-400 uppercase text-[10px] block mb-1">Address</span> {deal.address}</p>
                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50">
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Khasra</p>
                                        <p className="font-black text-gray-800">{deal.khasra || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Expected</p>
                                        <p className="font-black text-emerald-600">₹ {deal.expectPrice.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Negotiated</p>
                                        <p className="font-black text-indigo-600">₹ {deal.negotiationPrice.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Balance</p>
                                        <p className="font-black text-rose-500">₹ {deal.remainingBalance.toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden animate-in fade-in duration-500">
                        <div className="flex overflow-x-auto border-b border-gray-100 bg-gray-50/50 scrollbar-hide">
                            {tabs.map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`whitespace-nowrap px-8 py-5 font-black text-[11px] uppercase tracking-widest transition-all border-b-2 ${activeTab === tab ? 'border-[#6F4BFF] text-[#6F4BFF] bg-white' : 'border-transparent text-gray-400 hover:text-gray-800 hover:bg-white/50'}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        <div className="p-8">
                            {activeTab === 'Meeting' && (
                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <h3 className="text-lg font-black text-gray-800 flex items-center gap-2.5 mb-8 uppercase tracking-tight">
                                        <Calendar className="w-5 h-5 text-[#6F4BFF]" /> Meeting Schedule
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                        <div>
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Meeting Date</label>
                                            <div className="relative">
                                                <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                <input type="date" className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#6F4BFF]/20 focus:border-[#6F4BFF] bg-gray-50 font-black text-sm" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Meeting Time</label>
                                            <div className="relative">
                                                <Clock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                <input type="time" className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#6F4BFF]/20 focus:border-[#6F4BFF] bg-gray-50 font-black text-sm" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mb-8">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Meeting Remarks & Discussion Points</label>
                                        <textarea rows="4" placeholder="Enter key highlights from the discussion..." className="w-full border border-gray-200 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-[#6F4BFF]/20 focus:border-[#6F4BFF] bg-gray-50 font-bold text-sm placeholder:text-gray-300"></textarea>
                                    </div>
                                    <div className="flex justify-end">
                                        <Button className="bg-[#6F4BFF] hover:bg-[#5D3FE0] text-white font-black uppercase tracking-widest text-xs px-8 h-11">Save Meeting Log</Button>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'Payment Schedule' && (
                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <h3 className="text-lg font-black text-gray-800 flex items-center gap-2.5 mb-8 uppercase tracking-tight">
                                        <CreditCard className="w-5 h-5 text-[#6F4BFF]" /> Payment Milestone Manager
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end mb-12 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                                        <div className="md:col-span-2 w-full">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Milestone Name</label>
                                            <input type="text" placeholder="e.g. Booking / Agreement" className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/20 focus:border-[#6F4BFF] bg-white font-bold text-sm" />
                                        </div>
                                        <div className="w-full">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Amount (₹)</label>
                                            <input type="number" placeholder="0.00" className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/20 focus:border-[#6F4BFF] bg-white font-bold text-sm" />
                                        </div>
                                        <div className="w-full">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Due Date</label>
                                            <input type="date" className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/20 focus:border-[#6F4BFF] bg-white font-bold text-sm" />
                                        </div>
                                        <div className="w-full">
                                            <Button className="w-full bg-[#6F4BFF] hover:bg-[#5D3FE0] text-white font-black uppercase tracking-widest text-[10px] h-12 shadow-lg shadow-[#6F4BFF]/10">Add Milestone</Button>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-sm font-black text-gray-800 flex items-center gap-2 uppercase tracking-widest">
                                            <ClipboardList className="w-4 h-4 text-emerald-500" /> Payment Schedule Details
                                        </h3>
                                        <Badge variant="green" className="font-black">₹ {deal.negotiationPrice.toLocaleString()} Total</Badge>
                                    </div>
                                    
                                    <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                                        <Table
                                            headers={['#', 'MILESTONE', 'AMOUNT (₹)', 'DUE DATE', 'MODE', 'STATUS', 'ACTIONS']}
                                            data={deal.payments || []}
                                            renderRow={(payment, i) => (
                                                <tr key={i} className="hover:bg-gray-50/80 transition-all border-b border-gray-100 last:border-0">
                                                    <td className="px-6 py-4 text-xs font-black text-gray-400">{payment.id}</td>
                                                    <td className="px-6 py-4 text-sm font-black text-gray-800 uppercase tracking-tight">{payment.milestone}</td>
                                                    <td className="px-6 py-4 text-sm font-black text-gray-900 tracking-tighter">₹ {payment.amount.toLocaleString()}</td>
                                                    <td className="px-6 py-4 text-xs font-bold text-gray-600">{payment.dueDate}</td>
                                                    <td className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">{payment.mode}</td>
                                                    <td className="px-6 py-4">
                                                        <Badge variant={payment.status === 'COMPLETED' ? 'green' : 'yellow'}>{payment.status}</Badge>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <button className="p-2 hover:bg-[#6F4BFF]/10 rounded-lg text-[#6F4BFF] transition-all"><Edit2 className="w-3.5 h-3.5" /></button>
                                                            <button className="p-2 hover:bg-emerald-50 rounded-lg text-emerald-500 transition-all"><CheckCircle2 className="w-3.5 h-3.5" /></button>
                                                            <button className="p-2 hover:bg-rose-50 rounded-lg text-rose-500 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        />
                                        {(!deal.payments || deal.payments.length === 0) && (
                                            <div className="p-12 text-center bg-white">
                                                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                                                    <CreditCard className="w-6 h-6 text-gray-300" />
                                                </div>
                                                <p className="text-sm font-black text-gray-400 uppercase tracking-widest">No payment milestones defined.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeTab !== 'Meeting' && activeTab !== 'Payment Schedule' && (
                                <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-3xl bg-gray-50/50 animate-in fade-in duration-300">
                                    <div className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100 mb-4">
                                        <Settings className="w-8 h-8 text-gray-300 animate-spin-slow" />
                                    </div>
                                    <p className="text-gray-400 font-black text-[11px] uppercase tracking-widest">
                                        Content for <span className="text-[#6F4BFF]">{activeTab}</span> is coming soon.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Deals;
