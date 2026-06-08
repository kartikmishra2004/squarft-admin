import { useMemo, useState } from 'react';
import {
    Briefcase, Edit2, Globe, Mail, Phone, Plus,
    Save, Sparkles, User, Users
} from 'lucide-react';
import { mockBranches } from '../../data/mockData';
import Header from '../../components/layout/Header';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';

const initialFormState = {
    name: '',
    type: 'Regional Branch',
    head: '',
    status: 'Active',
    activeDeals: '0',
    revenue: '0',
    target: '0',
    address: '',
};

const branchTeams = {
    B01: [
        { name: 'Manas Gangrade', role: 'Branch Manager', phone: '7691962521', email: 'manas@squarft.com', activeDeals: 42 },
        { name: 'Rizwan Khan', role: 'Sales Officer', phone: '9424654160', email: 'rizwan@squarft.com', activeDeals: 31 },
        { name: 'Rajesh Gurjar', role: 'Field Officer', phone: '8224004000', email: 'rajesh@squarft.com', activeDeals: 18 },
    ],
    B02: [
        { name: 'Rahul M.', role: 'Branch Manager', phone: '9876543210', email: 'rahul@squarft.com', activeDeals: 36 },
        { name: 'Neha K.', role: 'Sales Officer', phone: '9876543211', email: 'neha@squarft.com', activeDeals: 24 },
        { name: 'Anil Broker', role: 'Broker Partner', phone: '9165993939', email: 'anil@squarft.com', activeDeals: 12 },
    ],
    B03: [
        { name: 'Sneha P.', role: 'Branch Manager', phone: '9876543212', email: 'sneha@squarft.com', activeDeals: 22 },
        { name: 'Ravi T.', role: 'Sales Officer', phone: '9876543213', email: 'ravi@squarft.com', activeDeals: 15 },
    ],
};

const getDefaultTeam = (branch) => [
    {
        name: branch.head && branch.head !== '-' ? branch.head : 'Unassigned Manager',
        role: 'Branch Manager',
        phone: 'Not assigned',
        email: 'Not assigned',
        activeDeals: branch.activeDeals || 0,
    },
];

const Branches = () => {
    const [branches, setBranches] = useState(mockBranches);
    const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
    const [editingBranchId, setEditingBranchId] = useState(null);
    const [formState, setFormState] = useState(initialFormState);
    const [selectedTeamBranch, setSelectedTeamBranch] = useState(null);

    const editingBranch = useMemo(
        () => branches.find((branch) => branch.id === editingBranchId),
        [branches, editingBranchId]
    );

    const openCreateBranch = () => {
        setEditingBranchId(null);
        setFormState(initialFormState);
        setIsBranchModalOpen(true);
    };

    const openEditBranch = (branch) => {
        setEditingBranchId(branch.id);
        setFormState({
            name: branch.name,
            type: branch.type,
            head: branch.head === '-' ? '' : branch.head,
            status: branch.status,
            activeDeals: String(branch.activeDeals ?? 0),
            revenue: branch.revenue || '0',
            target: String(branch.target ?? 0),
            address: branch.address || '',
        });
        setIsBranchModalOpen(true);
    };

    const closeBranchModal = () => {
        setIsBranchModalOpen(false);
        setEditingBranchId(null);
        setFormState(initialFormState);
    };

    const handleChange = (field, value) => {
        setFormState((current) => ({ ...current, [field]: value }));
    };

    const handleBranchSubmit = (event) => {
        event.preventDefault();
        const cleanName = formState.name.trim();
        const cleanHead = formState.head.trim() || '-';
        const cleanAddress = formState.address.trim();
        const cleanRevenue = formState.revenue.trim() || '0';
        const activeDeals = Math.max(0, Number(formState.activeDeals) || 0);
        const target = Math.min(100, Math.max(0, Number(formState.target) || 0));

        if (editingBranchId) {
            setBranches((current) => current.map((branch) => {
                if (branch.id !== editingBranchId) return branch;
                return {
                    ...branch,
                    name: cleanName,
                    type: formState.type,
                    head: cleanHead,
                    status: formState.status,
                    activeDeals,
                    revenue: cleanRevenue,
                    target,
                    address: cleanAddress,
                };
            }));
        } else {
            const nextNumber = branches.reduce((max, branch) => {
                const branchNumber = Number(String(branch.id).replace(/\D/g, '')) || 0;
                return Math.max(max, branchNumber);
            }, 0) + 1;
            const newBranch = {
                id: `B${String(nextNumber).padStart(2, '0')}`,
                name: cleanName,
                head: cleanHead,
                type: formState.type,
                address: cleanAddress,
                activeDeals,
                revenue: cleanRevenue,
                status: formState.status,
                target,
            };
            setBranches((current) => [...current, newBranch]);
        }

        closeBranchModal();
    };

    const getTeamForBranch = (branch) => branchTeams[branch.id] || getDefaultTeam(branch);

    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden relative bg-[#F5F6FA] font-sans text-gray-900 selection:bg-[#6F4BFF]/20 selection:text-[#6F4BFF]">
            <div className="absolute top-0 right-0 w-[800px] h-[500px] bg-purple-400/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[400px] bg-blue-400/5 rounded-full blur-[100px] pointer-events-none -z-10"></div>

            <Header title="Branch & Region Management" />

            <main className="flex-1 overflow-y-auto p-6 md:p-8 h-full scroll-smooth">
                <div className="max-w-[1600px] mx-auto h-full flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="flex items-center justify-between shrink-0">
                        <div>
                            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Branch & Region Management</h2>
                            <p className="text-gray-500 mt-1 font-medium text-sm">Control multi-city operations, assign branch managers, and track regional revenue.</p>
                        </div>
                        <Button icon={Plus} onClick={openCreateBranch} className="px-6 py-3 font-bold text-base shadow-lg shadow-[#6F4BFF]/30">
                            Open New Branch
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-10">
                        {branches.map((branch) => (
                            <Card key={branch.id} noPadding className="flex flex-col hover:shadow-xl hover:border-[#6F4BFF]/30 transition-all duration-300 group overflow-visible">
                                <div className="bg-gray-50/50 p-6 border-b border-gray-100 flex justify-between items-start relative">
                                    {branch.type === 'Head Office' && (
                                        <div className="absolute -top-3 -right-3 bg-linear-to-r from-amber-400 to-amber-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-md flex items-center gap-1 transform rotate-3 z-10">
                                            <Sparkles className="w-3 h-3" /> HQ
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="text-2xl font-black text-gray-900 mb-1 group-hover:text-[#6F4BFF] transition-colors">{branch.name}</h3>
                                        <Badge variant={branch.status === 'Active' ? 'green' : 'yellow'} className="mt-1 shadow-sm">{branch.status}</Badge>
                                    </div>
                                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-200 flex items-center justify-center text-[#6F4BFF]">
                                        <Globe className="w-6 h-6" />
                                    </div>
                                </div>
                                <div className="p-6 flex-1 grid grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Branch Manager</p>
                                        <p className="font-bold text-gray-800 flex items-center gap-2"><User className="w-4 h-4 text-gray-400" /> {branch.head}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Branch Type</p>
                                        <p className="font-bold text-gray-800">{branch.type}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Active Deals</p>
                                        <p className="font-black text-xl text-blue-600">{branch.activeDeals}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Generated Revenue</p>
                                        <p className="font-black text-xl text-emerald-600">{branch.revenue}</p>
                                    </div>
                                </div>
                                <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-3">
                                    <Button variant="secondary" className="flex-1 font-bold text-xs" icon={Edit2} onClick={() => openEditBranch(branch)}>Edit Branch</Button>
                                    <Button variant="secondary" className="flex-1 font-bold text-xs" icon={Users} onClick={() => setSelectedTeamBranch(branch)}>View Team</Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </main>

            <Modal isOpen={isBranchModalOpen} onClose={closeBranchModal} title={editingBranch ? `Edit ${editingBranch.name}` : 'Setup New Branch'}>
                <form onSubmit={handleBranchSubmit} className="space-y-5">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Branch Name</label>
                        <input
                            type="text"
                            required
                            value={formState.name}
                            onChange={(event) => handleChange('name', event.target.value)}
                            className="w-full mt-2 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 font-bold"
                            placeholder="e.g. Pune Regional Office"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Branch Type</label>
                            <select value={formState.type} onChange={(event) => handleChange('type', event.target.value)} className="w-full mt-2 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 font-bold bg-white">
                                <option>Regional Branch</option>
                                <option>Satellite Office</option>
                                <option>Head Office</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Assign Manager</label>
                            <select value={formState.head} onChange={(event) => handleChange('head', event.target.value)} className="w-full mt-2 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 font-bold bg-white">
                                <option value="">Select User...</option>
                                <option>Manas Gangrade</option>
                                <option>Rahul M.</option>
                                <option>Sneha P.</option>
                                <option>Ravi T.</option>
                                <option>Rajesh Gurjar</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Status</label>
                            <select value={formState.status} onChange={(event) => handleChange('status', event.target.value)} className="w-full mt-2 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 font-bold bg-white">
                                <option>Active</option>
                                <option>Setup Pending</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Active Deals</label>
                            <input
                                type="number"
                                min="0"
                                value={formState.activeDeals}
                                onChange={(event) => handleChange('activeDeals', event.target.value)}
                                className="w-full mt-2 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 font-bold"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Generated Revenue</label>
                            <input
                                type="text"
                                value={formState.revenue}
                                onChange={(event) => handleChange('revenue', event.target.value)}
                                className="w-full mt-2 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 font-bold"
                                placeholder="e.g. 3.5 Cr"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Target Progress</label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                value={formState.target}
                                onChange={(event) => handleChange('target', event.target.value)}
                                className="w-full mt-2 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 font-bold"
                                placeholder="0-100"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Complete Address</label>
                        <textarea
                            rows="3"
                            value={formState.address}
                            onChange={(event) => handleChange('address', event.target.value)}
                            className="w-full mt-2 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 font-bold"
                            placeholder="Full branch address"
                        ></textarea>
                    </div>
                    <div className="pt-4 flex justify-end gap-3 mt-6 border-t border-gray-100">
                        <Button variant="secondary" onClick={closeBranchModal}>Cancel</Button>
                        <Button type="submit" icon={Save}>{editingBranch ? 'Save Changes' : 'Create Branch'}</Button>
                    </div>
                </form>
            </Modal>

            <Modal isOpen={!!selectedTeamBranch} onClose={() => setSelectedTeamBranch(null)} title={selectedTeamBranch ? `${selectedTeamBranch.name} Team` : 'Branch Team'}>
                {selectedTeamBranch && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-xl p-4">
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Branch Manager</p>
                                <p className="text-lg font-black text-gray-900">{selectedTeamBranch.head}</p>
                            </div>
                            <Badge variant={selectedTeamBranch.status === 'Active' ? 'green' : 'yellow'}>{selectedTeamBranch.status}</Badge>
                        </div>

                        {getTeamForBranch(selectedTeamBranch).map((member) => (
                            <div key={`${selectedTeamBranch.id}-${member.name}-${member.role}`} className="border border-gray-100 rounded-xl p-4 bg-white hover:border-[#6F4BFF]/30 transition-colors">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-[#6F4BFF]/10 text-[#6F4BFF] flex items-center justify-center font-black">
                                            {member.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-black text-gray-900">{member.name}</p>
                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{member.role}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xl font-black text-blue-600">{member.activeDeals}</p>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Deals</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-100 text-sm font-bold text-gray-600">
                                    <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400" /> {member.phone}</p>
                                    <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-gray-400" /> {member.email}</p>
                                </div>
                            </div>
                        ))}

                        <div className="bg-[#6F4BFF]/5 border border-[#6F4BFF]/10 rounded-xl p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Briefcase className="w-5 h-5 text-[#6F4BFF]" />
                                <span className="text-sm font-black text-gray-800">Total Branch Deals</span>
                            </div>
                            <span className="text-lg font-black text-[#6F4BFF]">{selectedTeamBranch.activeDeals}</span>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Branches;
