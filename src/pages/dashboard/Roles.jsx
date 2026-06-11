import { useMemo, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    CheckCircle2,
    Key,
    Layers,
    Plus,
    Save,
    ShieldCheck,
    Sparkles,
    Building2,
    Check,
    Loader2,
    User
} from 'lucide-react';
import Header from '../../components/layout/Header';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { dashboardAccessTabs } from '../../data/navigation';
import { mockBranches } from '../../data/mockData';
import { fetchRoles, saveRoles, clearSaveSuccess } from '../../store/rolesSlice';

const SUPER_ADMIN_ID = 'super_admin';

const makeRoleId = (name) => name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');

const Toggle = ({ active, disabled, onClick }) => (
    <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-pressed={active}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#6F4BFF] focus:ring-offset-2 disabled:cursor-not-allowed ${
            active ? 'bg-[#6F4BFF]' : 'bg-gray-200'
        } ${disabled ? 'opacity-70' : ''}`}
    >
        <span
            className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                active ? 'translate-x-6' : 'translate-x-1'
            }`}
        />
    </button>
);

const Roles = () => {
    const dispatch = useDispatch();

    // Redux selectors for auth and roles
    const { user } = useSelector((state) => state.auth);
    const { roles, loading, saveSuccess } = useSelector((state) => state.roles);

    const isSuperAdmin = user?.role === 'super_admin';
    const assignedBranchId = user?.branchId || 'B02';
    
    const [selectedBranchId, setSelectedBranchId] = useState('B01');
    const activeBranchId = isSuperAdmin ? selectedBranchId : assignedBranchId;
    
    const activeBranch = useMemo(() => {
        return mockBranches.find(b => b.id === activeBranchId) || mockBranches[0];
    }, [activeBranchId]);

    // Local copy of roles to handle updates before sending back to store/API
    const [localRoles, setLocalRoles] = useState([]);
    const [activeRoleId, setActiveRoleId] = useState(SUPER_ADMIN_ID);
    const [roleName, setRoleName] = useState('');
    const [saveFeedback, setSaveFeedback] = useState(false);

    // Fetch roles when active branch changes
    useEffect(() => {
        dispatch(fetchRoles(activeBranchId));
        
        // Admin only manages sales officer, broker, field officer.
        // Default to sales_officer for admins, and super_admin for super admins.
        const defaultRoleId = isSuperAdmin ? SUPER_ADMIN_ID : 'sales_officer';
        setActiveRoleId(defaultRoleId);
    }, [activeBranchId, isSuperAdmin, dispatch]);

    // Sync local copy when Redux roles load
    useEffect(() => {
        if (roles) {
            setLocalRoles(roles);
        }
    }, [roles]);

    // Show temporary checkmark after successful save
    useEffect(() => {
        if (saveSuccess) {
            setSaveFeedback(true);
            const timer = setTimeout(() => {
                setSaveFeedback(false);
                dispatch(clearSaveSuccess());
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [saveSuccess, dispatch]);

    const activeRole = useMemo(
        () => localRoles.find((role) => role.id === activeRoleId) || localRoles[0] || { id: '', name: '', tabAccess: [], locked: false },
        [activeRoleId, localRoles]
    );

    const displayedRoles = useMemo(() => {
        if (isSuperAdmin) return localRoles;
        return localRoles.filter(role => ['sales_officer', 'broker', 'field_officer'].includes(role.id));
    }, [localRoles, isSuperAdmin]);

    const allowedCount = activeRole.locked ? dashboardAccessTabs.length : (activeRole.tabAccess?.length || 0);

    const handleCreateRole = (event) => {
        event.preventDefault();

        const trimmedName = roleName.trim();
        if (!trimmedName) return;

        const baseId = makeRoleId(trimmedName);
        const roleId = baseId || `role_${Date.now()}`;
        const uniqueId = localRoles.some((role) => role.id === roleId) ? `${roleId}_${Date.now()}` : roleId;
        const newRole = {
            id: uniqueId,
            name: trimmedName,
            description: 'Custom access role',
            tabAccess: [],
            locked: false,
        };

        const updated = [...localRoles, newRole];
        setLocalRoles(updated);
        dispatch(saveRoles(activeBranchId, updated));
        setActiveRoleId(uniqueId);
        setRoleName('');
    };

    const handleToggleTab = (path) => {
        if (activeRole.locked) return;

        const nextRoles = localRoles.map((role) => {
            if (role.id !== activeRole.id) return role;

            const tabAccess = role.tabAccess || [];
            const hasAccess = tabAccess.includes(path);
            return {
                ...role,
                tabAccess: hasAccess
                    ? tabAccess.filter((tabPath) => tabPath !== path)
                    : [...tabAccess, path],
            };
        });

        setLocalRoles(nextRoles);
        dispatch(saveRoles(activeBranchId, nextRoles));
    };

    const handleSave = () => {
        dispatch(saveRoles(activeBranchId, localRoles));
    };

    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden relative bg-[#F5F6FA] font-sans text-gray-900 selection:bg-[#6F4BFF]/20 selection:text-[#6F4BFF]">
            <Header title="Roles & Access Control" />

            <main className="flex-1 overflow-y-auto p-6 md:p-8 h-full scroll-smooth">
                <div className="max-w-[1600px] mx-auto h-full flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    
                    {/* Header Intro */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Roles & Access Control</h2>
                            <p className="text-gray-500 mt-1 font-medium text-sm">
                                {isSuperAdmin 
                                    ? 'Select a branch to customize or create roles and grant dashboard access.' 
                                    : 'Manage access control configurations for active entities in your assigned branch.'}
                            </p>
                        </div>
                    </div>

                    {/* Super Admin Branch Switcher */}
                    {isSuperAdmin && (
                        <div className="space-y-3 shrink-0">
                            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Select Operating Branch</h3>
                            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin shrink-0">
                                {mockBranches.map((branch) => {
                                    const isSelected = branch.id === selectedBranchId;
                                    return (
                                        <button
                                            key={branch.id}
                                            onClick={() => setSelectedBranchId(branch.id)}
                                            className={`text-left min-w-[280px] p-4 rounded-xl border transition-all duration-300 relative overflow-hidden group ${
                                                isSelected
                                                    ? 'bg-white border-[#6F4BFF] shadow-[0_10px_20px_-5px_rgba(111,75,255,0.12)]'
                                                    : 'bg-white/60 border-gray-100 hover:border-[#6F4BFF]/30 hover:bg-white/80 shadow-xs'
                                            }`}
                                        >
                                            {isSelected && (
                                                <div className="absolute top-0 right-0 w-16 h-16 bg-[#6F4BFF]/5 rounded-bl-full flex items-start justify-end p-3.5">
                                                    <Check className="w-4 h-4 text-[#6F4BFF]" />
                                                </div>
                                            )}
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                                                    isSelected ? 'bg-[#6F4BFF] text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-[#6F4BFF]/10 group-hover:text-[#6F4BFF]'
                                                }`}>
                                                    <Building2 className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-900 leading-tight text-sm">{branch.name}</h4>
                                                    <p className="text-[10px] text-gray-400 font-bold mt-0.5">{branch.type}</p>
                                                </div>
                                            </div>
                                            
                                            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] font-bold text-gray-500">
                                                <span className="flex items-center gap-1"><User className="w-3 h-3 text-gray-400" /> {branch.head}</span>
                                                <Badge variant={branch.status === 'Active' ? 'green' : 'yellow'} className="text-[9px] px-1.5 py-0.5">{branch.status}</Badge>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Admin Assigned Branch Banner */}
                    {!isSuperAdmin && (
                        <div className="bg-linear-to-r from-[#6F4BFF]/5 to-indigo-50/50 border border-[#6F4BFF]/10 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shrink-0 shadow-xs">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white text-[#6F4BFF] rounded-xl flex items-center justify-center shadow-sm border border-gray-100">
                                    <Building2 className="w-6 h-6 animate-pulse" />
                                </div>
                                <div>
                                    <span className="text-[10px] font-black text-[#6F4BFF] uppercase tracking-widest">Assigned Workspace Branch</span>
                                    <h3 className="text-xl font-black text-gray-900 tracking-tight mt-0.5">{activeBranch.name}</h3>
                                    <p className="text-xs text-gray-500 font-medium mt-0.5">
                                        Branch Manager: <strong className="text-gray-700 font-bold">{activeBranch.head}</strong> &bull; Region Status: <strong className="text-emerald-600 font-bold">{activeBranch.status}</strong>
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="px-3.5 py-1.5 bg-white rounded-lg border border-gray-100 shadow-2xs text-center min-w-[80px]">
                                    <p className="text-[9px] text-gray-400 font-bold uppercase">Branch Deals</p>
                                    <p className="text-sm font-black text-[#6F4BFF]">{activeBranch.activeDeals}</p>
                                </div>
                                <div className="px-3.5 py-1.5 bg-white rounded-lg border border-gray-100 shadow-2xs text-center min-w-[80px]">
                                    <p className="text-[9px] text-gray-400 font-bold uppercase">Revenue</p>
                                    <p className="text-sm font-black text-emerald-600">{activeBranch.revenue}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Layout Workspace Grid */}
                    <div className="flex flex-col xl:flex-row gap-6 flex-1 min-h-0 relative">
                        {loading && localRoles.length === 0 ? (
                            <div className="absolute inset-0 bg-white/60 backdrop-blur-xs z-50 flex items-center justify-center rounded-2xl">
                                <div className="flex flex-col items-center gap-3">
                                    <Loader2 className="w-10 h-10 text-[#6F4BFF] animate-spin" />
                                    <p className="text-sm font-bold text-gray-500">Loading Roles...</p>
                                </div>
                            </div>
                        ) : null}

                        {/* Sidebar: Role Picker */}
                        <Card noPadding className="w-full xl:w-80 shrink-0 flex flex-col border-gray-200 shadow-md">
                            <div className="p-5 border-b border-gray-100 bg-gray-50/60">
                                <div className="flex items-center justify-between gap-3">
                                    <div>
                                        <h3 className="font-black text-gray-900 tracking-tight">Operating Roles</h3>
                                        <p className="text-xs text-gray-500 font-semibold mt-1">
                                            {isSuperAdmin ? 'Create & edit custom branch roles' : 'Predefined branch entities'}
                                        </p>
                                    </div>
                                    <div className="h-10 w-10 rounded-xl bg-[#6F4BFF]/10 text-[#6F4BFF] flex items-center justify-center">
                                        <ShieldCheck className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>

                            <div className="p-3 space-y-2 overflow-y-auto flex-1 max-h-[350px] xl:max-h-none">
                                {displayedRoles.map((role) => (
                                    <button
                                        key={role.id}
                                        onClick={() => setActiveRoleId(role.id)}
                                        className={`w-full text-left p-3 rounded-xl transition-all border ${
                                            activeRole.id === role.id
                                                ? 'bg-[#6F4BFF] text-white border-[#6F4BFF] shadow-md shadow-[#6F4BFF]/25'
                                                : 'bg-white text-gray-700 border-gray-100 hover:border-[#6F4BFF]/30 hover:bg-[#6F4BFF]/5'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="min-w-0">
                                                <p className="font-black text-sm truncate">{role.name}</p>
                                                <p className={`text-xs font-semibold mt-0.5 ${activeRole.id === role.id ? 'text-white/75' : 'text-gray-400'}`}>
                                                    {role.locked ? 'All tabs enabled' : `${role.tabAccess?.length || 0} tabs enabled`}
                                                </p>
                                            </div>
                                            {role.locked ? (
                                                <Key className={`w-4 h-4 shrink-0 ${activeRole.id === role.id ? 'text-amber-200' : 'text-[#6F4BFF]'}`} />
                                            ) : (
                                                <Layers className={`w-4 h-4 shrink-0 ${activeRole.id === role.id ? 'text-white/80' : 'text-gray-400'}`} />
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {/* Create Custom Role form - Super Admin Only */}
                            {isSuperAdmin && (
                                <form onSubmit={handleCreateRole} className="p-4 mt-auto border-t border-gray-100 bg-gray-50/60">
                                    <label htmlFor="role-name" className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">
                                        Create Branch Role
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            id="role-name"
                                            value={roleName}
                                            onChange={(event) => setRoleName(event.target.value)}
                                            placeholder="Enter role name"
                                            className="min-w-0 flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-bold text-gray-800 outline-none transition-all focus:border-[#6F4BFF] focus:ring-2 focus:ring-[#6F4BFF]/15"
                                        />
                                        <Button type="submit" icon={Plus} className="px-3" disabled={!roleName.trim()}>
                                            Add
                                        </Button>
                                    </div>
                                </form>
                            )}
                        </Card>

                        {/* Access Grid Controls */}
                        <Card noPadding className="flex-1 flex flex-col border-gray-200 shadow-lg min-h-[500px]">
                            <div className="p-5 md:p-6 border-b border-gray-100 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-2xl font-black text-gray-900 tracking-tight">{activeRole.name}</h3>
                                        {activeRole.locked && (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-black uppercase tracking-wider text-amber-700 border border-amber-100">
                                                <Key className="w-3 h-3" /> Locked
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm font-medium text-gray-500 mt-1 flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                        {allowedCount} of {dashboardAccessTabs.length} tabs enabled
                                    </p>
                                </div>
                                <Button
                                    icon={saveFeedback ? CheckCircle2 : (loading ? Loader2 : Save)}
                                    variant={saveFeedback ? 'success' : 'primary'}
                                    disabled={loading}
                                    className="px-6 py-3 shadow-md shadow-[#6F4BFF]/10 text-sm font-bold transition-all shrink-0"
                                    onClick={handleSave}
                                >
                                    {saveFeedback ? 'Saved Successfully' : (loading ? 'Saving...' : 'Save Access')}
                                </Button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-5 md:p-6 bg-gray-50/40">
                                <div className="mb-5 rounded-xl border border-blue-100 bg-blue-50 p-4 flex items-start gap-4">
                                    <div className="p-2 bg-white rounded-lg text-blue-600 shrink-0 shadow-sm">
                                        <Sparkles className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-blue-950">Tab access rules</h4>
                                        <p className="text-sm text-blue-700 font-medium mt-1">
                                            Turn on the tabs this role should see in the dashboard sidebar. 
                                            {activeRole.locked ? ' Super Admin retains permission to view all workspace modules.' : ' You can configure customizable access bounds for this role.'}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-3">
                                    {dashboardAccessTabs.map((tab) => {
                                        const Icon = tab.icon;
                                        const hasAccess = activeRole.locked || (activeRole.tabAccess || []).includes(tab.path);

                                        return (
                                            <div
                                                key={`${tab.label}-${tab.path}`}
                                                className={`rounded-xl border p-4 bg-white transition-all ${
                                                    hasAccess ? 'border-[#6F4BFF]/20 shadow-xs' : 'border-gray-100 opacity-80 hover:opacity-100'
                                                }`}
                                            >
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex items-start gap-3 min-w-0">
                                                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                                                            hasAccess ? 'bg-[#6F4BFF]/10 text-[#6F4BFF]' : 'bg-gray-100 text-gray-400'
                                                        }`}>
                                                            <Icon className="w-5 h-5" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-black text-gray-900 truncate">{tab.label}</p>
                                                            <p className="text-xs font-semibold text-gray-400 mt-1 truncate">{tab.path}</p>
                                                        </div>
                                                    </div>
                                                    <Toggle
                                                        active={hasAccess}
                                                        disabled={activeRole.locked}
                                                        onClick={() => handleToggleTab(tab.path)}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Roles;
