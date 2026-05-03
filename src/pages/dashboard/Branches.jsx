import React, { useState } from 'react';
import { 
    Plus, Globe, Sparkles, User, Edit2, Users, Save 
} from 'lucide-react';
import { mockBranches } from '../../data/mockData';
import Header from '../../components/layout/Header';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';

const Branches = () => {
    const [isAddBranchOpen, setIsAddBranchOpen] = useState(false);
    const [branches, setBranches] = useState(mockBranches);

    const handleAddBranch = (e) => {
        e.preventDefault();
        console.log("Branch created successfully");
        setIsAddBranchOpen(false);
    };

    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden relative bg-[#F5F6FA] font-sans text-gray-900 selection:bg-[#6F4BFF]/20 selection:text-[#6F4BFF]">
            {/* Background ambient glow */}
            <div className="absolute top-0 right-0 w-[800px] h-[500px] bg-purple-400/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[400px] bg-blue-400/5 rounded-full blur-[100px] pointer-events-none -z-10"></div>

            <Header title="Branch & Region Management" />

            <main className="flex-1 overflow-y-auto p-6 md:p-8 h-full scroll-smooth">
                <div className="max-w-[1600px] mx-auto h-full flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    
                    <div className="flex items-center justify-between shrink-0">
                        <div>
                            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Branches Overview</h2>
                            <p className="text-gray-500 mt-1 font-medium text-sm">Control multi-city operations and track regional performance.</p>
                        </div>
                        <Button 
                            icon={Plus} 
                            onClick={() => setIsAddBranchOpen(true)} 
                            className="px-6 py-3 font-bold text-base shadow-lg shadow-[#6F4BFF]/30"
                        >
                            Open New Branch
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-10">
                        {branches.map((branch, i) => (
                            <Card key={i} noPadding className="flex flex-col hover:shadow-xl hover:border-[#6F4BFF]/30 transition-all duration-300 group overflow-visible">
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
                                <div className="p-6 flex-1 grid grid-cols-2 gap-8">
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Branch Manager</p>
                                        <p className="font-bold text-gray-800 flex items-center gap-2 italic"><User className="w-4 h-4 text-gray-400" /> {branch.head}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Branch Type</p>
                                        <p className="font-bold text-gray-800">{branch.type}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Active Deals</p>
                                        <p className="font-black text-xl text-[#6F4BFF]">{branch.activeDeals}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Revenue</p>
                                        <p className="font-black text-xl text-emerald-600">{branch.revenue}</p>
                                    </div>
                                </div>
                                <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-3">
                                    <Button variant="secondary" className="flex-1 font-bold text-xs" icon={Edit2} onClick={() => console.log(`Edit ${branch.name} clicked`)}>Edit Branch</Button>
                                    <Button variant="secondary" className="flex-1 font-bold text-xs" icon={Users} onClick={() => console.log(`View team for ${branch.name} clicked`)}>View Team</Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </main>

            <Modal isOpen={isAddBranchOpen} onClose={() => setIsAddBranchOpen(false)} title="Setup New Branch">
                <form onSubmit={handleAddBranch} className="space-y-6">
                    <div>
                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Branch Name</label>
                        <input 
                            type="text" 
                            required
                            className="w-full mt-2 border border-gray-200 rounded-xl p-4 outline-none focus:ring-2 focus:ring-[#6F4BFF]/20 focus:border-[#6F4BFF] font-bold transition-all bg-gray-50/50" 
                            placeholder="e.g. Pune Regional Office" 
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Branch Type</label>
                            <select className="w-full mt-2 border border-gray-200 rounded-xl p-4 outline-none focus:ring-2 focus:ring-[#6F4BFF]/20 focus:border-[#6F4BFF] font-bold transition-all bg-white shadow-sm">
                                <option>Regional Branch</option>
                                <option>Satellite Office</option>
                                <option>Shared Workspace</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Assign Manager</label>
                            <select className="w-full mt-2 border border-gray-200 rounded-xl p-4 outline-none focus:ring-2 focus:ring-[#6F4BFF]/20 focus:border-[#6F4BFF] font-bold transition-all bg-white shadow-sm">
                                <option>Select User...</option>
                                <option>Rahul M.</option>
                                <option>Sneha P.</option>
                                <option>Amit S.</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Complete Address</label>
                        <textarea 
                            rows="3" 
                            className="w-full mt-2 border border-gray-200 rounded-xl p-4 outline-none focus:ring-2 focus:ring-[#6F4BFF]/20 focus:border-[#6F4BFF] font-bold transition-all bg-gray-50/50"
                            placeholder="Enter the full official address..."
                        ></textarea>
                    </div>
                    <div className="pt-6 flex justify-end gap-3 mt-4 border-t border-gray-100">
                        <Button variant="secondary" className="px-6" onClick={() => setIsAddBranchOpen(false)}>Cancel</Button>
                        <Button type="submit" icon={Save} className="px-8">Create Branch</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Branches;
