import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Filter, Plus, Search, UserPlus } from 'lucide-react';
import { addLead, setFilters } from '../../store/leadsSlice';
import { qualifyLeadToClient } from '../../store/clientsSlice';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Header from '../../components/layout/Header';

const Leads = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { filteredLeads, filters } = useSelector((state) => state.leads);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newLead, setNewLead] = useState({
        name: '',
        phone: '',
        budget: '',
        req: '',
        location: '',
        status: 'New',
        officer: 'Unassigned',
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
    });

    const handleAddLead = (e) => {
        e.preventDefault();
        const id = `L${Math.floor(Math.random() * 1000)}`;
        dispatch(addLead({ ...newLead, id }));
        setIsAddModalOpen(false);
        setNewLead({
            name: '',
            phone: '',
            budget: '',
            req: '',
            location: '',
            status: 'New',
            officer: 'Unassigned',
            date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
        });
    };

    const handleFilterChange = (status) => {
        dispatch(setFilters({ status }));
    };

    const handleSearch = (e) => {
        dispatch(setFilters({ search: e.target.value }));
    };

    return (
        <div className="flex-1 flex flex-col h-full relative bg-[#F5F6FA] font-sans text-gray-900">
            <Header title="Leads Pipeline" />

            <main className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth">
                <div className="max-w-[1600px] mx-auto flex flex-col gap-6">
                    
                    <Card noPadding className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white">
                            <div>
                                <h2 className="text-xl font-black text-gray-800 tracking-tight">Raw Leads</h2>
                                <p className="text-sm text-gray-500 mt-1 font-medium">Unqualified inquiries waiting to be mapped to clients.</p>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                                <div className="relative flex-1 md:w-64">
                                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search leads..."
                                        className="pl-9 pr-4 py-2 w-full bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6F4BFF]/20 focus:border-[#6F4BFF] transition-all"
                                        value={filters.search}
                                        onChange={handleSearch}
                                    />
                                </div>
                                
                                <div className="flex items-center gap-2">
                                    <select 
                                        className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm font-bold text-gray-700 outline-none cursor-pointer hover:bg-gray-50 transition-colors shadow-sm"
                                        value={filters.status}
                                        onChange={(e) => handleFilterChange(e.target.value)}
                                    >
                                        <option value="All">All Status</option>
                                        <option value="New">New</option>
                                        <option value="Contacted">Contacted</option>
                                        <option value="Follow Up">Follow Up</option>
                                    </select>
                                    
                                    <Button icon={Plus} onClick={() => setIsAddModalOpen(true)}>Add Lead</Button>
                                </div>
                            </div>
                        </div>

                        <Table
                            headers={['Lead Name', 'Contact', 'Budget', 'Requirement', 'Status', 'Assigned', 'Action']}
                            data={filteredLeads}
                            renderRow={(row, i) => (
                                <tr key={row.id} className="hover:bg-[#6F4BFF]/5 transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="font-bold text-gray-900 group-hover:text-[#6F4BFF] transition-colors">{row.name}</div>
                                        <div className="text-[11px] font-bold text-gray-400 mt-0.5 uppercase tracking-wider">{row.date}</div>
                                    </td>
                                    <td className="px-6 py-5 text-sm font-bold text-gray-600">{row.phone}</td>
                                    <td className="px-6 py-5">
                                        <div className="text-sm font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg inline-block">{row.budget}</div>
                                    </td>
                                    <td className="px-6 py-5 text-sm text-gray-600">
                                        <div className="font-bold text-gray-800">{row.req}</div>
                                        <div className="text-xs text-gray-400 font-medium">{row.location}</div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <Badge variant={row.status === 'New' ? 'purple' : row.status === 'Contacted' ? 'blue' : 'gray'}>
                                            {row.status}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-600 border border-gray-200">
                                                {row.officer?.charAt(0)}
                                            </div>
                                            <span className="text-sm font-bold text-gray-700">{row.officer}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <Button 
                                            variant="secondary" 
                                            className="text-xs py-1.5 px-3 hover:border-[#6F4BFF] hover:text-[#6F4BFF] group/btn" 
                                            onClick={() => {
                                                dispatch(qualifyLeadToClient(row));
                                                navigate('/dashboard/clients');
                                            }}
                                        >
                                            Qualify Client
                                        </Button>
                                    </td>
                                </tr>
                            )}
                        />
                        
                        {filteredLeads.length === 0 && (
                            <div className="p-20 text-center flex flex-col items-center gap-4">
                                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 shadow-inner">
                                    <Search className="w-8 h-8 text-gray-300" />
                                </div>
                                <div>
                                    <p className="text-lg font-black text-gray-800">No leads found</p>
                                    <p className="text-sm text-gray-500 font-medium">Try adjusting your search or filters.</p>
                                </div>
                            </div>
                        )}
                    </Card>
                </div>
            </main>

            {/* ADD LEAD MODAL */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Create New Lead"
            >
                <form onSubmit={handleAddLead} className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Lead Name</label>
                            <input
                                required
                                type="text"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6F4BFF]/20 focus:border-[#6F4BFF] transition-all font-bold"
                                placeholder="Enter full name"
                                value={newLead.name}
                                onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Phone Number</label>
                            <input
                                required
                                type="tel"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6F4BFF]/20 focus:border-[#6F4BFF] transition-all font-bold"
                                placeholder="+91"
                                value={newLead.phone}
                                onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Budget Range</label>
                            <input
                                required
                                type="text"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6F4BFF]/20 focus:border-[#6F4BFF] transition-all font-bold"
                                placeholder="e.g. 1 Cr - 2 Cr"
                                value={newLead.budget}
                                onChange={(e) => setNewLead({ ...newLead, budget: e.target.value })}
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Requirement Details</label>
                            <input
                                required
                                type="text"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6F4BFF]/20 focus:border-[#6F4BFF] transition-all font-bold"
                                placeholder="e.g. 3BHK Apartment, Sea facing"
                                value={newLead.req}
                                onChange={(e) => setNewLead({ ...newLead, req: e.target.value })}
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Location Preference</label>
                            <input
                                required
                                type="text"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6F4BFF]/20 focus:border-[#6F4BFF] transition-all font-bold"
                                placeholder="e.g. Andheri West, Mumbai"
                                value={newLead.location}
                                onChange={(e) => setNewLead({ ...newLead, location: e.target.value })}
                            />
                        </div>
                    </div>
                    
                    <div className="pt-4 flex gap-3">
                        <Button variant="secondary" className="flex-1" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                        <Button type="submit" className="flex-1">Create Lead</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Leads;
