import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    AlertCircle, Briefcase, Edit2, Globe, Loader2, Mail, Phone, Plus,
    Save, Sparkles, User, Users
} from 'lucide-react';
import Header from '../../components/layout/Header';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import {
    getBranches,
    createNewBranch,
    updateExistingBranch,
    getBranchTeam,
    clearError,
    clearSuccess,
    clearBranchTeam,
} from '../../store/branchesSlice';

const initialFormState = {
    name: '',
    type: 'Regional Branch',
    head: '',
    status: 'Active',
    city: '',
    state: '',
    address: '',
    activeDeals: '0',
    revenue: '0',
    target: '0',
};

const Branches = () => {
    const dispatch = useDispatch();
    const { branches, loading, error, successMessage, branchTeam } = useSelector((state) => state.branches);
    
    const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
    const [editingBranchId, setEditingBranchId] = useState(null);
    const [formState, setFormState] = useState(initialFormState);
    const [selectedTeamBranch, setSelectedTeamBranch] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingTeam, setIsLoadingTeam] = useState(false);

    // Fetch branches on mount
    useEffect(() => {
        dispatch(getBranches());
    }, [dispatch]);

    // Clear success message after 3 seconds
    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                dispatch(clearSuccess());
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage, dispatch]);

    // Clear error message after 5 seconds
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                dispatch(clearError());
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [error, dispatch]);

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
        
        // Map backend values back to frontend display values
        const typeDisplayMap = {
            'REGIONAL_BRANCH': 'Regional Branch',
            'SATELLITE_OFFICE': 'Satellite Office',
            'HEAD_OFFICE': 'Head Office',
            'Regional Branch': 'Regional Branch',
            'Satellite Office': 'Satellite Office',
            'Head Office': 'Head Office'
        };

        const statusDisplayMap = {
            'ACTIVE': 'Active',
            'SETUP_PENDING': 'Setup Pending',
            'INACTIVE': 'Inactive',
            'Active': 'Active',
            'Setup Pending': 'Setup Pending',
            'Inactive': 'Inactive'
        };

        setFormState({
            name: branch.name,
            type: typeDisplayMap[branch.typeValue || branch.type] || 'Regional Branch',
            head: (branch.head === '-' || !branch.head) ? '' : branch.head,
            status: statusDisplayMap[branch.statusValue || branch.status] || 'Active',
            city: branch.city || '',
            state: branch.state || '',
            address: branch.address || '',
            activeDeals: String(branch.activeDeals ?? 0),
            revenue: String(branch.revenueValue ?? 0),
            target: String(branch.target ?? 0),
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

    const handleBranchSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);

        try {
            const cleanName = formState.name.trim();
            const cleanCity = formState.city.trim();
            const cleanState = formState.state.trim();
            const cleanAddress = formState.address.trim();

            console.log('=== BRANCH SUBMIT DEBUG ===');
            console.log('Form State:', formState);
            console.log('Form Type:', formState.type);
            console.log('Form Status:', formState.status);

            // Map frontend display values to backend constants
            const typeMap = {
                'Regional Branch': 'REGIONAL_BRANCH',
                'Satellite Office': 'SATELLITE_OFFICE',
                'Head Office': 'HEAD_OFFICE'
            };

            const statusMap = {
                'Active': 'ACTIVE',
                'Setup Pending': 'SETUP_PENDING',
                'Inactive': 'INACTIVE'
            };

            const mappedType = typeMap[formState.type] || 'REGIONAL_BRANCH';
            const mappedStatus = statusMap[formState.status] || 'ACTIVE';

            console.log('Mapped Type:', mappedType);
            console.log('Mapped Status:', mappedStatus);

            const branchData = {
                name: cleanName,
                type: mappedType,
                status: mappedStatus,
                city: cleanCity,
                activeDeals: Math.max(0, Number(formState.activeDeals) || 0),
                revenue: Math.max(0, Number(formState.revenue) || 0),
                target: Math.min(100, Math.max(0, Number(formState.target) || 0)),
            };

            // Add optional fields
            if (cleanState) {
                branchData.state = cleanState;
            }

            if (cleanAddress) {
                branchData.address = cleanAddress;
            }

            console.log('Branch Data to send:', JSON.stringify(branchData, null, 2));

            if (editingBranchId) {
                console.log('UPDATE branch with ID:', editingBranchId);
                await dispatch(updateExistingBranch({ branchId: editingBranchId, branchData })).unwrap();
            } else {
                console.log('CREATE new branch');
                await dispatch(createNewBranch(branchData)).unwrap();
            }

            closeBranchModal();
            dispatch(getBranches());
        } catch (error) {
            console.error('Branch submission error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleViewTeam = async (branch) => {
        setSelectedTeamBranch(branch);
        setIsLoadingTeam(true);
        
        try {
            await dispatch(getBranchTeam(branch.id)).unwrap();
        } catch (error) {
            console.error('Error fetching branch team:', error);
        } finally {
            setIsLoadingTeam(false);
        }
    };

    const closeTeamModal = () => {
        setSelectedTeamBranch(null);
        dispatch(clearBranchTeam());
    };

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
                        <Button 
                            icon={Plus} 
                            onClick={openCreateBranch} 
                            className="px-6 py-3 font-bold text-base shadow-lg shadow-[#6F4BFF]/30"
                            disabled={loading}
                        >
                            Open New Branch
                        </Button>
                    </div>

                    {/* Success Message */}
                    {successMessage && (
                        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <p className="font-bold text-emerald-900">{successMessage}</p>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                            <p className="font-bold text-red-900">{error}</p>
                        </div>
                    )}

                    {/* Loading State */}
                    {loading && branches.length === 0 && (
                        <div className="flex items-center justify-center py-20">
                            <div className="flex flex-col items-center gap-4">
                                <Loader2 className="w-10 h-10 text-[#6F4BFF] animate-spin" />
                                <p className="text-gray-500 font-medium">Loading branches...</p>
                            </div>
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && branches.length === 0 && (
                        <div className="flex items-center justify-center py-20">
                            <div className="text-center max-w-md">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Globe className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-xl font-black text-gray-900 mb-2">No branches yet</h3>
                                <p className="text-gray-500 mb-6">Get started by opening your first branch.</p>
                                <Button icon={Plus} onClick={openCreateBranch}>
                                    Open New Branch
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Branches Grid */}
                    {!loading && branches.length > 0 && (
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
                                        <Button variant="secondary" className="flex-1 font-bold text-xs" icon={Users} onClick={() => handleViewTeam(branch)}>View Team</Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Create/Edit Branch Modal */}
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
                            disabled={isSubmitting}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">City <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                required
                                value={formState.city}
                                onChange={(event) => handleChange('city', event.target.value)}
                                className="w-full mt-2 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 font-bold"
                                placeholder="e.g. Mumbai"
                                disabled={isSubmitting}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">State</label>
                            <input
                                type="text"
                                value={formState.state}
                                onChange={(event) => handleChange('state', event.target.value)}
                                className="w-full mt-2 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 font-bold"
                                placeholder="e.g. Maharashtra"
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Branch Type</label>
                            <select 
                                value={formState.type} 
                                onChange={(event) => handleChange('type', event.target.value)} 
                                className="w-full mt-2 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 font-bold bg-white"
                                disabled={isSubmitting}
                            >
                                <option>Regional Branch</option>
                                <option>Satellite Office</option>
                                <option>Head Office</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Status</label>
                            <select 
                                value={formState.status} 
                                onChange={(event) => handleChange('status', event.target.value)} 
                                className="w-full mt-2 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 font-bold bg-white"
                                disabled={isSubmitting}
                            >
                                <option>Active</option>
                                <option>Setup Pending</option>
                                <option>Inactive</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Assign Manager (Optional)</label>
                        <select 
                            value={formState.head} 
                            onChange={(event) => handleChange('head', event.target.value)} 
                            className="w-full mt-2 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 font-bold bg-white"
                            disabled={isSubmitting}
                        >
                            <option value="">No Manager Assigned</option>
                            <option>Manas Gangrade</option>
                            <option>Rahul M.</option>
                            <option>Sneha P.</option>
                            <option>Ravi T.</option>
                            <option>Rajesh Gurjar</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-1">Manager assignment requires backend user UUID integration</p>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Active Deals</label>
                            <input
                                type="number"
                                min="0"
                                value={formState.activeDeals}
                                onChange={(event) => handleChange('activeDeals', event.target.value)}
                                className="w-full mt-2 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 font-bold"
                                disabled={isSubmitting}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Revenue (₹)</label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={formState.revenue}
                                onChange={(event) => handleChange('revenue', event.target.value)}
                                className="w-full mt-2 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 font-bold"
                                placeholder="0"
                                disabled={isSubmitting}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Target %</label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                value={formState.target}
                                onChange={(event) => handleChange('target', event.target.value)}
                                className="w-full mt-2 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 font-bold"
                                placeholder="0-100"
                                disabled={isSubmitting}
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
                            disabled={isSubmitting}
                        ></textarea>
                    </div>
                    <div className="pt-4 flex justify-end gap-3 mt-6 border-t border-gray-100">
                        <Button variant="secondary" onClick={closeBranchModal} disabled={isSubmitting}>Cancel</Button>
                        <Button type="submit" icon={isSubmitting ? Loader2 : Save} disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : (editingBranch ? 'Save Changes' : 'Create Branch')}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* View Team Modal */}
            <Modal isOpen={!!selectedTeamBranch} onClose={closeTeamModal} title={selectedTeamBranch ? `${selectedTeamBranch.name} Team` : 'Branch Team'}>
                {selectedTeamBranch && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-xl p-4">
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Branch Manager</p>
                                <p className="text-lg font-black text-gray-900">{selectedTeamBranch.head}</p>
                            </div>
                            <Badge variant={selectedTeamBranch.status === 'Active' ? 'green' : 'yellow'}>{selectedTeamBranch.status}</Badge>
                        </div>

                        {/* Loading State */}
                        {isLoadingTeam && (
                            <div className="flex items-center justify-center py-10">
                                <Loader2 className="w-8 h-8 text-[#6F4BFF] animate-spin" />
                            </div>
                        )}

                        {/* Team Members */}
                        {!isLoadingTeam && branchTeam.length > 0 && branchTeam.map((member, index) => (
                            <div key={`${selectedTeamBranch.id}-${member.name}-${index}`} className="border border-gray-100 rounded-xl p-4 bg-white hover:border-[#6F4BFF]/30 transition-colors">
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
                                        <p className="text-xl font-black text-blue-600">{member.activeDeals || 0}</p>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Deals</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-100 text-sm font-bold text-gray-600">
                                    <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400" /> {member.phone || 'Not assigned'}</p>
                                    <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-gray-400" /> {member.email || 'Not assigned'}</p>
                                </div>
                            </div>
                        ))}

                        {/* Empty Team State */}
                        {!isLoadingTeam && branchTeam.length === 0 && (
                            <div className="text-center py-8">
                                <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500 font-medium">No team members assigned yet</p>
                            </div>
                        )}

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