import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    AlertCircle, Briefcase, Edit2, Globe, Loader2, Mail, Phone, Plus,
    Save, Search, ShieldCheck, Sparkles, User, UserCog, Users
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
    getBranchAdmin,
    replaceBranchAdmin,
    clearError,
    clearSuccess,
    clearBranchTeam,
    clearBranchAdmin,
} from '../../store/branchesSlice';
import { fetchCities, fetchCommonUsers, fetchMasterOptions } from '../../services/commonService';

const fallbackBranchTypes = [
    { label: 'Regional Branch', value: 'REGIONAL_BRANCH' },
    { label: 'Satellite Office', value: 'SATELLITE_OFFICE' },
    { label: 'Head Office', value: 'HEAD_OFFICE' },
];

const fallbackBranchStatuses = [
    { label: 'Active', value: 'ACTIVE' },
    { label: 'Setup Pending', value: 'SETUP_PENDING' },
    { label: 'Inactive', value: 'INACTIVE' },
];

const normalizeOptionLabel = (value) => String(value || '').trim();

const findOptionLabel = (options, value, fallback) => {
    const normalized = normalizeOptionLabel(value).toLowerCase();
    const match = options.find((option) => (
        normalizeOptionLabel(option.value).toLowerCase() === normalized
        || normalizeOptionLabel(option.label).toLowerCase() === normalized
    ));

    return match?.label || fallback;
};

const initialFormState = {
    name: '',
    type: 'Regional Branch',
    head: '',
    status: 'Active',
    city: '',
    state: '',
    address: '',
    latitude: '',
    longitude: '',
    activeDeals: '0',
    revenue: '0',
    target: '0',
};

const Branches = () => {
    const dispatch = useDispatch();
    const {
        branches, loading, error, successMessage, branchTeam,
        branchAdmin, branchAdminLoading, branchAdminError,
    } = useSelector((state) => state.branches);

    const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
    const [editingBranchId, setEditingBranchId] = useState(null);
    const [formState, setFormState] = useState(initialFormState);
    const [selectedTeamBranch, setSelectedTeamBranch] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingTeam, setIsLoadingTeam] = useState(false);
    const [branchTypeOptions, setBranchTypeOptions] = useState(fallbackBranchTypes);
    const [branchStatusOptions, setBranchStatusOptions] = useState(fallbackBranchStatuses);
    const [cityOptions, setCityOptions] = useState([]);
    const [managerOptions, setManagerOptions] = useState([]);

    // Replace Admin dialog state
    const [selectedAdminBranch, setSelectedAdminBranch] = useState(null);
    const [adminSearch, setAdminSearch] = useState('');
    const [adminCandidates, setAdminCandidates] = useState([]);
    const [isSearchingAdmins, setIsSearchingAdmins] = useState(false);
    const [selectedNewAdminId, setSelectedNewAdminId] = useState('');
    const [isReplacingAdmin, setIsReplacingAdmin] = useState(false);
    const [replaceAdminError, setReplaceAdminError] = useState(null);

    // Fetch branches on mount
    useEffect(() => {
        dispatch(getBranches());
    }, [dispatch]);

    useEffect(() => {
        let isMounted = true;

        const loadCommonOptions = async () => {
            const [masterResult, citiesResult, managersResult] = await Promise.allSettled([
                fetchMasterOptions(['branch_types', 'branch_statuses']),
                fetchCities({ status: 'ACTIVE' }),
                fetchCommonUsers({ userType: 'BRANCH_MANAGER', status: 'ACTIVE', limit: 50 }),
            ]);

            if (!isMounted) return;

            if (masterResult.status === 'fulfilled') {
                if (masterResult.value?.branchTypes?.length) {
                    setBranchTypeOptions(masterResult.value.branchTypes);
                }
                if (masterResult.value?.branchStatuses?.length) {
                    setBranchStatusOptions(masterResult.value.branchStatuses);
                }
            }

            if (citiesResult.status === 'fulfilled' && Array.isArray(citiesResult.value)) {
                setCityOptions(citiesResult.value);
            }

            if (managersResult.status === 'fulfilled') {
                setManagerOptions(managersResult.value?.users || []);
            }
        };

        loadCommonOptions();

        return () => {
            isMounted = false;
        };
    }, []);

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
            type: findOptionLabel(branchTypeOptions, branch.typeValue || branch.type, typeDisplayMap[branch.typeValue || branch.type] || 'Regional Branch'),
            head: branch.managerId || '',
            status: findOptionLabel(branchStatusOptions, branch.statusValue || branch.status, statusDisplayMap[branch.statusValue || branch.status] || 'Active'),
            city: branch.city || '',
            state: branch.state || '',
            address: branch.address || '',
            latitude: branch.latitude !== undefined && branch.latitude !== null ? String(branch.latitude) : '',
            longitude: branch.longitude !== undefined && branch.longitude !== null ? String(branch.longitude) : '',
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
        setFormState((current) => {
            if (field !== 'city') return { ...current, [field]: value };

            const selectedCity = cityOptions.find((city) => city.name === value);
            return {
                ...current,
                city: value,
                state: selectedCity?.state || current.state,
            };
        });
    };

    const handleBranchSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);

        try {
            const cleanName = formState.name.trim();
            const cleanCity = formState.city.trim();
            const cleanState = formState.state.trim();
            const cleanAddress = formState.address.trim();

            // Map frontend display values to backend constants
            const typeMap = Object.fromEntries(branchTypeOptions.map((option) => [option.label, option.value]));
            const statusMap = Object.fromEntries(branchStatusOptions.map((option) => [option.label, option.value]));

            const mappedType = typeMap[formState.type] || 'REGIONAL_BRANCH';
            const mappedStatus = statusMap[formState.status] || 'ACTIVE';

            const branchData = {
                name: cleanName,
                type: mappedType,
                status: mappedStatus,
                city: cleanCity,
                managerId: formState.head || null,
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

            // Latitude/longitude: optional, but clamp to valid geographic ranges when provided
            // (mirrors the Math.max/Math.min clamping pattern used for activeDeals/revenue/target above).
            // NOTE(QA-D7): no Maps API key is configured in this project, so there is no interactive
            // map picker yet — these are plain numeric inputs. See Complete Address / City / State
            // fields nearby for the rest of the location data captured on this form.
            if (formState.latitude !== '' && formState.latitude !== null && formState.latitude !== undefined) {
                const parsedLatitude = Number(formState.latitude);
                if (!Number.isNaN(parsedLatitude)) {
                    branchData.latitude = Math.min(90, Math.max(-90, parsedLatitude));
                }
            }

            if (formState.longitude !== '' && formState.longitude !== null && formState.longitude !== undefined) {
                const parsedLongitude = Number(formState.longitude);
                if (!Number.isNaN(parsedLongitude)) {
                    branchData.longitude = Math.min(180, Math.max(-180, parsedLongitude));
                }
            }

            if (editingBranchId) {
                await dispatch(updateExistingBranch({ branchId: editingBranchId, branchData })).unwrap();
            } else {
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

    const openReplaceAdmin = (branch) => {
        setSelectedAdminBranch(branch);
        setAdminSearch('');
        setAdminCandidates([]);
        setSelectedNewAdminId('');
        setReplaceAdminError(null);
        dispatch(getBranchAdmin(branch.id));
    };

    const closeReplaceAdmin = () => {
        setSelectedAdminBranch(null);
        setAdminSearch('');
        setAdminCandidates([]);
        setSelectedNewAdminId('');
        setReplaceAdminError(null);
        dispatch(clearBranchAdmin());
    };

    // Debounced search for eligible admin-role, active-status users
    useEffect(() => {
        if (!selectedAdminBranch) return;

        let isMounted = true;
        setIsSearchingAdmins(true);

        const timer = setTimeout(async () => {
            try {
                const result = await fetchCommonUsers({
                    userType: 'ADMIN',
                    status: 'ACTIVE',
                    search: adminSearch || undefined,
                    limit: 20,
                });
                if (isMounted) setAdminCandidates(result?.users || []);
            } catch (searchError) {
                console.error('Error searching eligible admins:', searchError);
                if (isMounted) setAdminCandidates([]);
            } finally {
                if (isMounted) setIsSearchingAdmins(false);
            }
        }, 300);

        return () => {
            isMounted = false;
            clearTimeout(timer);
        };
    }, [selectedAdminBranch, adminSearch]);

    const handleConfirmReplaceAdmin = async () => {
        if (!selectedAdminBranch || !selectedNewAdminId) return;

        setIsReplacingAdmin(true);
        setReplaceAdminError(null);

        try {
            await dispatch(replaceBranchAdmin({
                branchId: selectedAdminBranch.id,
                newAdminId: selectedNewAdminId,
            })).unwrap();

            closeReplaceAdmin();
        } catch (replaceError) {
            setReplaceAdminError(replaceError?.message || 'Failed to replace branch admin');
        } finally {
            setIsReplacingAdmin(false);
        }
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
                                        <Button variant="secondary" className="flex-1 font-bold text-xs" icon={UserCog} onClick={() => openReplaceAdmin(branch)}>Replace Admin</Button>
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
                                list="branch-city-options"
                                className="w-full mt-2 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 font-bold"
                                placeholder="e.g. Mumbai"
                                disabled={isSubmitting}
                            />
                            <datalist id="branch-city-options">
                                {cityOptions.map((city) => (
                                    <option key={city.id || `${city.name}-${city.state}`} value={city.name}>
                                        {city.state}
                                    </option>
                                ))}
                            </datalist>
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
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Latitude</label>
                            <input
                                type="number"
                                step="any"
                                min="-90"
                                max="90"
                                value={formState.latitude}
                                onChange={(event) => handleChange('latitude', event.target.value)}
                                className="w-full mt-2 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 font-bold"
                                placeholder="e.g. 22.7196 (range -90 to 90)"
                                disabled={isSubmitting}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Longitude</label>
                            <input
                                type="number"
                                step="any"
                                min="-180"
                                max="180"
                                value={formState.longitude}
                                onChange={(event) => handleChange('longitude', event.target.value)}
                                className="w-full mt-2 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 font-bold"
                                placeholder="e.g. 75.8577 (range -180 to 180)"
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
                                {branchTypeOptions.map((option) => (
                                    <option key={option.value} value={option.label}>{option.label}</option>
                                ))}
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
                                {branchStatusOptions.map((option) => (
                                    <option key={option.value} value={option.label}>{option.label}</option>
                                ))}
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
                            {managerOptions.map((manager) => (
                                <option key={manager.id} value={manager.id}>{manager.name}</option>
                            ))}
                        </select>
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

            {/* Replace Admin Modal */}
            <Modal
                isOpen={!!selectedAdminBranch}
                onClose={closeReplaceAdmin}
                title={selectedAdminBranch ? `Replace Admin - ${selectedAdminBranch.name}` : 'Replace Admin'}
            >
                {selectedAdminBranch && (
                    <div className="space-y-5">
                        {/* Current Admin */}
                        <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Current Admin</p>
                            {branchAdminLoading && !branchAdmin && (
                                <div className="flex items-center gap-2 text-gray-500 font-medium text-sm">
                                    <Loader2 className="w-4 h-4 animate-spin" /> Loading...
                                </div>
                            )}
                            {!branchAdminLoading && branchAdmin && branchAdmin.currentAdmin && (
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-[#6F4BFF]/10 text-[#6F4BFF] flex items-center justify-center font-black shrink-0">
                                        {(branchAdmin.currentAdmin.name || '?').charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-black text-gray-900">{branchAdmin.currentAdmin.name || 'Unnamed Admin'}</p>
                                        <p className="text-xs font-bold text-gray-500 flex items-center gap-3">
                                            {branchAdmin.currentAdmin.email && (
                                                <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {branchAdmin.currentAdmin.email}</span>
                                            )}
                                            {branchAdmin.currentAdmin.phone && (
                                                <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {branchAdmin.currentAdmin.phone}</span>
                                            )}
                                        </p>
                                    </div>
                                </div>
                            )}
                            {!branchAdminLoading && branchAdmin && !branchAdmin.currentAdmin && (
                                <p className="text-gray-500 font-medium text-sm">No admin currently assigned to this branch.</p>
                            )}
                            {!branchAdminLoading && branchAdminError && (
                                <p className="text-red-600 font-medium text-sm">{branchAdminError}</p>
                            )}
                        </div>

                        {/* Pending Workload Summary */}
                        {branchAdmin?.workloadSummary && (
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Pending Workload (Branch-wide)</p>
                                <div className="grid grid-cols-4 gap-3">
                                    <div className="bg-white border border-gray-100 rounded-xl p-3 text-center">
                                        <p className="text-lg font-black text-blue-600">{branchAdmin.workloadSummary.activeDeals}</p>
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Active Deals</p>
                                    </div>
                                    <div className="bg-white border border-gray-100 rounded-xl p-3 text-center">
                                        <p className="text-lg font-black text-amber-600">{branchAdmin.workloadSummary.openLeads}</p>
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Open Leads</p>
                                    </div>
                                    <div className="bg-white border border-gray-100 rounded-xl p-3 text-center">
                                        <p className="text-lg font-black text-purple-600">{branchAdmin.workloadSummary.pendingVisits}</p>
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Pending Visits</p>
                                    </div>
                                    <div className="bg-white border border-gray-100 rounded-xl p-3 text-center">
                                        <p className="text-lg font-black text-emerald-600">{branchAdmin.workloadSummary.activeProjects}</p>
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Active Projects</p>
                                    </div>
                                </div>
                                <p className="text-[11px] text-gray-400 font-medium mt-2">
                                    These figures belong to the branch, not the admin - they carry over automatically and nothing needs to be transferred when the admin changes.
                                </p>
                            </div>
                        )}

                        {/* Search eligible admins */}
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Search Eligible Admins</label>
                            <div className="relative mt-2">
                                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    value={adminSearch}
                                    onChange={(event) => setAdminSearch(event.target.value)}
                                    placeholder="Search by name or email"
                                    className="w-full border border-gray-300 rounded-lg p-3 pl-9 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 font-bold"
                                />
                            </div>
                        </div>

                        <div className="max-h-64 overflow-y-auto space-y-2 custom-scrollbar">
                            {isSearchingAdmins && (
                                <div className="flex items-center justify-center py-6">
                                    <Loader2 className="w-6 h-6 text-[#6F4BFF] animate-spin" />
                                </div>
                            )}
                            {!isSearchingAdmins && adminCandidates.length === 0 && (
                                <p className="text-center text-gray-500 font-medium text-sm py-6">No eligible admin users found.</p>
                            )}
                            {!isSearchingAdmins && adminCandidates.map((candidate) => {
                                const isCurrent = branchAdmin?.currentAdmin?.id === candidate.id;
                                const isSelected = selectedNewAdminId === candidate.id;
                                return (
                                    <button
                                        type="button"
                                        key={candidate.id}
                                        onClick={() => !isCurrent && setSelectedNewAdminId(candidate.id)}
                                        disabled={isCurrent}
                                        className={`w-full text-left border rounded-xl p-3 flex items-center justify-between gap-3 transition-colors ${
                                            isSelected ? 'border-[#6F4BFF] bg-[#6F4BFF]/5' : 'border-gray-100 hover:border-[#6F4BFF]/30'
                                        } ${isCurrent ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        <div>
                                            <p className="font-bold text-gray-900 text-sm">{candidate.name}</p>
                                            <p className="text-xs text-gray-500">{candidate.email || candidate.phone}</p>
                                            {candidate.branchName && (
                                                <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mt-1">
                                                    Currently admin of {candidate.branchName}
                                                </p>
                                            )}
                                        </div>
                                        {isCurrent && <Badge variant="green">Current</Badge>}
                                        {isSelected && !isCurrent && <ShieldCheck className="w-5 h-5 text-[#6F4BFF] shrink-0" />}
                                    </button>
                                );
                            })}
                        </div>

                        {replaceAdminError && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                                <p className="font-bold text-red-900 text-sm">{replaceAdminError}</p>
                            </div>
                        )}

                        <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                            <Button variant="secondary" onClick={closeReplaceAdmin} disabled={isReplacingAdmin}>Cancel</Button>
                            <Button
                                icon={isReplacingAdmin ? Loader2 : ShieldCheck}
                                onClick={handleConfirmReplaceAdmin}
                                disabled={isReplacingAdmin || !selectedNewAdminId}
                            >
                                {isReplacingAdmin ? 'Replacing...' : 'Confirm Replacement'}
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Branches;
