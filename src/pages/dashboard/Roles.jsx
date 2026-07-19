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
    User,
    AlertCircle,
    Trash2,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import Header from '../../components/layout/Header';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { dashboardAccessTabs } from '../../data/navigation';
import {
    getRoleAccessContext,
    getAccessibleBranches,
    getOperatingRoles,
    getRoleDetail,
    createNewBranchRole,
    updatePermissions,
    updateRoleStatus,
    clearError,
    clearSuccess,
    clearSelectedRole
} from '../../store/roleAccessSlice';

const TAB_ACTIONS = [
    { key: 'view', label: 'View' },
    { key: 'add', label: 'Add' },
    { key: 'edit', label: 'Edit' },
    { key: 'delete', label: 'Delete' },
];

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

const findTabEntry = (tabs, tabPath) => (tabs || []).find((t) => {
    const path = typeof t === 'string' ? t : t.path;
    return path === tabPath;
});

const tabActions = (tabEntry) => {
    if (!tabEntry) return [];
    if (typeof tabEntry === 'string') return ['view'];
    return Array.isArray(tabEntry.actions) ? tabEntry.actions : (tabEntry.enabled ? ['view'] : []);
};

const Roles = () => {
    const dispatch = useDispatch();

    const { user, role: userRole } = useSelector((state) => state.auth);
    const {
        context,
        accessibleBranches,
        operatingRoles,
        selectedRole,
        loading,
        error,
        successMessage
    } = useSelector((state) => state.roleAccess);

    const isSuperAdmin = context?.mode === 'SUPER_ADMIN' || userRole === 'super_admin' || user?.role === 'super_admin';

    const [selectedBranchId, setSelectedBranchId] = useState(null);
    const [activeRoleId, setActiveRoleId] = useState(null);
    const [roleName, setRoleName] = useState('');
    const [roleDescription, setRoleDescription] = useState('');
    const [showLoginFields, setShowLoginFields] = useState(false);
    const [loginPhone, setLoginPhone] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginFullName, setLoginFullName] = useState('');
    const [loginEmail, setLoginEmail] = useState('');
    const [saveFeedback, setSaveFeedback] = useState(false);
    const [pendingDeleteRoleId, setPendingDeleteRoleId] = useState(null);

    const rolesList = useMemo(() => {
        if (!operatingRoles) return [];
        if (Array.isArray(operatingRoles)) return operatingRoles;
        if (operatingRoles.roles && Array.isArray(operatingRoles.roles)) return operatingRoles.roles;
        if (operatingRoles.data && Array.isArray(operatingRoles.data)) return operatingRoles.data;
        return [];
    }, [operatingRoles]);

    useEffect(() => {
        dispatch(getRoleAccessContext());
    }, [dispatch]);

    const effectiveBranchId = selectedBranchId || context?.assignedBranch?.id || context?.defaultBranch?.id || user?.branchId;

    useEffect(() => {
        if (isSuperAdmin) {
            dispatch(getAccessibleBranches({ limit: 50 }));
        } else if (user?.branchId) {
            setSelectedBranchId(user.branchId);
        }
    }, [isSuperAdmin, dispatch, user]);

    useEffect(() => {
        const branches = accessibleBranches?.data || accessibleBranches || [];
        const branchesArray = Array.isArray(branches) ? branches : [];
        if (isSuperAdmin && branchesArray.length > 0 && !selectedBranchId) {
            setSelectedBranchId(branchesArray[0].id);
        }
    }, [accessibleBranches, selectedBranchId, isSuperAdmin]);

    useEffect(() => {
        if (effectiveBranchId) {
            dispatch(getOperatingRoles(effectiveBranchId));
        }
    }, [effectiveBranchId, dispatch]);

    useEffect(() => {
        if (rolesList.length > 0 && (!activeRoleId || !rolesList.some((role) => role.id === activeRoleId))) {
            setActiveRoleId(rolesList[0].id);
        } else if (rolesList.length === 0) {
            setActiveRoleId(null);
            dispatch(clearSelectedRole());
        }
    }, [rolesList, activeRoleId, dispatch]);

    useEffect(() => {
        if (activeRoleId && effectiveBranchId) {
            dispatch(getRoleDetail({ roleId: activeRoleId, branchId: effectiveBranchId }));
        }
    }, [activeRoleId, effectiveBranchId, dispatch]);

    useEffect(() => {
        if (successMessage) {
            setSaveFeedback(true);
            const timer = setTimeout(() => {
                setSaveFeedback(false);
                dispatch(clearSuccess());
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage, dispatch]);

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                dispatch(clearError());
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [error, dispatch]);

    const activeRole = selectedRole || { id: '', name: '', tabs: [], locked: false };

    const branchesNormalized = useMemo(() => {
        const branches = Array.isArray(accessibleBranches)
            ? [...accessibleBranches]
            : [...(accessibleBranches?.data || [])];

        [context?.assignedBranch, context?.defaultBranch, context?.selectedBranch].forEach((branch) => {
            if (branch?.id && !branches.some((item) => item.id === branch.id)) {
                branches.push(branch);
            }
        });

        return branches;
    }, [accessibleBranches, context]);

    const activeBranch = branchesNormalized.find(b => b.id === effectiveBranchId) || {};

    const resetCreateForm = () => {
        setRoleName('');
        setRoleDescription('');
        setShowLoginFields(false);
        setLoginPhone('');
        setLoginPassword('');
        setLoginFullName('');
        setLoginEmail('');
    };

    const handleCreateRole = async (event) => {
        event.preventDefault();

        const trimmedName = roleName.trim();
        if (!trimmedName || !effectiveBranchId) return;

        try {
            await dispatch(createNewBranchRole({
                branchId: effectiveBranchId,
                roleName: trimmedName,
                description: roleDescription,
                ...(showLoginFields && loginPhone && loginPassword
                    ? { phone: loginPhone, password: loginPassword, fullName: loginFullName, email: loginEmail }
                    : {}),
            })).unwrap();

            resetCreateForm();
            dispatch(getOperatingRoles(effectiveBranchId));
        } catch {
            // error surfaced via redux state
        }
    };

    const buildPermissionsPayload = () => {
        const backendTabs = activeRole.tabs || [];
        return backendTabs
            .map((t) => ({
                path: typeof t === 'string' ? t : t.path,
                actions: tabActions(t),
                disabled: typeof t === 'object' ? Boolean(t.disabled) : false,
            }))
            .filter((entry) => !entry.disabled && entry.actions.length > 0)
            .map(({ path, actions }) => ({ path, actions }));
    };

    const handleToggleAction = (tabPath, actionKey) => {
        if (activeRole.locked) return;

        const backendTab = findTabEntry(activeRole.tabs, tabPath);
        if (!backendTab || (typeof backendTab === 'object' && backendTab.disabled)) return;

        const currentActions = new Set(tabActions(backendTab));

        if (actionKey === 'view') {
            // Toggling view off clears the whole tab; toggling on grants view only.
            if (currentActions.has('view')) {
                currentActions.clear();
            } else {
                currentActions.add('view');
            }
        } else if (currentActions.has(actionKey)) {
            currentActions.delete(actionKey);
        } else {
            currentActions.add(actionKey);
            currentActions.add('view');
        }

        const permissions = buildPermissionsPayload()
            .filter((entry) => entry.path !== tabPath);

        if (currentActions.size > 0) {
            permissions.push({ path: tabPath, actions: [...currentActions] });
        }

        handleSavePermissions(permissions);
    };

    const handleSavePermissions = async (permissionsOverride = null) => {
        if (activeRole.locked || !activeRoleId || !effectiveBranchId) return;

        const permissions = permissionsOverride || buildPermissionsPayload();

        try {
            await dispatch(updatePermissions({
                roleId: activeRoleId,
                permissionsData: {
                    branchId: effectiveBranchId,
                    permissions,
                }
            })).unwrap();
            dispatch(getRoleDetail({ roleId: activeRoleId, branchId: effectiveBranchId }));
        } catch {
            // error surfaced via redux state
        }
    };

    const handleDeleteRole = async (roleId) => {
        if (pendingDeleteRoleId !== roleId) {
            setPendingDeleteRoleId(roleId);
            return;
        }

        setPendingDeleteRoleId(null);
        try {
            await dispatch(updateRoleStatus({
                roleId,
                statusData: { branchId: effectiveBranchId, status: 'INACTIVE' },
            })).unwrap();
        } catch {
            // error surfaced via redux state
        }
    };

    const hasTabAction = (tabPath, actionKey) => {
        if (activeRole.locked) return true;
        const backendTab = findTabEntry(activeRole.tabs, tabPath);
        return tabActions(backendTab).includes(actionKey);
    };

    const allowedCount = activeRole.locked
        ? dashboardAccessTabs.length
        : (activeRole.enabledTabsCount !== undefined
            ? activeRole.enabledTabsCount
            : (activeRole.tabs || []).filter(t => tabActions(t).includes('view')).length
          );

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

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 shrink-0">
                            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                            <p className="font-bold text-red-900">{error}</p>
                        </div>
                    )}

                    {/* Success Message */}
                    {successMessage && (
                        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 shrink-0">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                            <p className="font-bold text-emerald-900">{successMessage}</p>
                        </div>
                    )}

                    {/* Super Admin Branch Switcher */}
                    {isSuperAdmin && (
                        <div className="space-y-3 shrink-0">
                            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Select Operating Branch</h3>
                            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin shrink-0">
                                {branchesNormalized.map((branch) => {
                                    const isSelected = branch.id === effectiveBranchId;
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

                    {!isSuperAdmin && activeBranch && (
                        <div className="bg-linear-to-r from-[#6F4BFF]/5 to-indigo-50/50 border border-[#6F4BFF]/10 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shrink-0 shadow-xs">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white text-[#6F4BFF] rounded-xl flex items-center justify-center shadow-sm border border-gray-100">
                                    <Building2 className="w-6 h-6 animate-pulse" />
                                </div>
                                <div>
                                    <span className="text-[10px] font-black text-[#6F4BFF] uppercase tracking-widest">Assigned Workspace Branch</span>
                                    <h3 className="text-xl font-black text-gray-900 tracking-tight mt-0.5">{activeBranch.name || 'Current Branch'}</h3>
                                    <p className="text-xs text-gray-500 font-medium mt-0.5">
                                        Manage roles and permissions for your assigned branch
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Layout Workspace Grid */}
                    <div className="flex flex-col xl:flex-row gap-6 flex-1 min-h-0 relative">
                        {loading && rolesList.length === 0 ? (
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
                                            Create & edit roles for your branch
                                        </p>
                                    </div>
                                    <div className="h-10 w-10 rounded-xl bg-[#6F4BFF]/10 text-[#6F4BFF] flex items-center justify-center">
                                        <ShieldCheck className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>

                            <div className="p-3 space-y-2 overflow-y-auto flex-1 max-h-[350px] xl:max-h-none">
                                {rolesList.map((role) => (
                                    <div
                                        key={role.id}
                                        className={`w-full rounded-xl transition-all border overflow-hidden ${
                                            activeRoleId === role.id
                                                ? 'bg-[#6F4BFF] text-white border-[#6F4BFF] shadow-md shadow-[#6F4BFF]/25'
                                                : 'bg-white text-gray-700 border-gray-100 hover:border-[#6F4BFF]/30 hover:bg-[#6F4BFF]/5'
                                        }`}
                                    >
                                        <button
                                            onClick={() => setActiveRoleId(role.id)}
                                            className="w-full text-left p-3"
                                        >
                                            <div className="flex items-center justify-between gap-3">
                                                <div className="min-w-0">
                                                    <p className="font-black text-sm truncate">{role.name}</p>
                                                    <p className={`text-xs font-semibold mt-0.5 ${activeRoleId === role.id ? 'text-white/75' : 'text-gray-400'}`}>
                                                        {role.locked ? 'All tabs enabled' : `${role.enabledTabsCount || 0} tabs enabled`}
                                                    </p>
                                                </div>
                                                {role.locked ? (
                                                    <Key className={`w-4 h-4 shrink-0 ${activeRoleId === role.id ? 'text-amber-200' : 'text-[#6F4BFF]'}`} />
                                                ) : (
                                                    <Layers className={`w-4 h-4 shrink-0 ${activeRoleId === role.id ? 'text-white/80' : 'text-gray-400'}`} />
                                                )}
                                            </div>
                                        </button>
                                        {!role.locked && !role.systemRole && (
                                            <button
                                                type="button"
                                                onClick={(e) => { e.stopPropagation(); handleDeleteRole(role.id); }}
                                                onBlur={() => setPendingDeleteRoleId((current) => (current === role.id ? null : current))}
                                                className={`w-full flex items-center justify-center gap-1.5 text-[11px] font-bold py-1.5 border-t transition-colors ${
                                                    activeRoleId === role.id
                                                        ? 'border-white/20 text-white/80 hover:bg-red-500/80 hover:text-white'
                                                        : 'border-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-600'
                                                } ${pendingDeleteRoleId === role.id ? 'bg-red-600 text-white' : ''}`}
                                            >
                                                <Trash2 className="w-3 h-3" />
                                                {pendingDeleteRoleId === role.id ? 'Confirm Delete?' : 'Delete Role'}
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Create Custom Role form - Available for All Admins */}
                            <form onSubmit={handleCreateRole} className="p-4 mt-auto border-t border-gray-100 bg-gray-50/60 space-y-3">
                                <label htmlFor="role-name" className="block text-xs font-black uppercase tracking-widest text-gray-500">
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
                                <input
                                    value={roleDescription}
                                    onChange={(event) => setRoleDescription(event.target.value)}
                                    placeholder="Description (optional)"
                                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 outline-none transition-all focus:border-[#6F4BFF] focus:ring-2 focus:ring-[#6F4BFF]/15"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowLoginFields((v) => !v)}
                                    className="flex items-center gap-1 text-[11px] font-bold text-[#6F4BFF]"
                                >
                                    {showLoginFields ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                    Create a login for this role (optional)
                                </button>
                                {showLoginFields && (
                                    <div className="space-y-2 pt-1">
                                        <input
                                            value={loginFullName}
                                            onChange={(event) => setLoginFullName(event.target.value)}
                                            placeholder="Full name"
                                            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 outline-none focus:border-[#6F4BFF] focus:ring-2 focus:ring-[#6F4BFF]/15"
                                        />
                                        <input
                                            value={loginPhone}
                                            onChange={(event) => setLoginPhone(event.target.value)}
                                            placeholder="Mobile number"
                                            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 outline-none focus:border-[#6F4BFF] focus:ring-2 focus:ring-[#6F4BFF]/15"
                                        />
                                        <input
                                            value={loginEmail}
                                            onChange={(event) => setLoginEmail(event.target.value)}
                                            placeholder="Email (optional)"
                                            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 outline-none focus:border-[#6F4BFF] focus:ring-2 focus:ring-[#6F4BFF]/15"
                                        />
                                        <input
                                            type="password"
                                            value={loginPassword}
                                            onChange={(event) => setLoginPassword(event.target.value)}
                                            placeholder="Password (min 8 chars)"
                                            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 outline-none focus:border-[#6F4BFF] focus:ring-2 focus:ring-[#6F4BFF]/15"
                                        />
                                    </div>
                                )}
                            </form>
                        </Card>

                        {/* Access Grid Controls */}
                        <Card noPadding className="flex-1 flex flex-col border-gray-200 shadow-lg min-h-[500px]">
                            <div className="p-5 md:p-6 border-b border-gray-100 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-2xl font-black text-gray-900 tracking-tight">{activeRole.name || 'Select a Role'}</h3>
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
                                    disabled={loading || !activeRoleId || activeRole.locked}
                                    className="px-6 py-3 shadow-md shadow-[#6F4BFF]/10 text-sm font-bold transition-all shrink-0"
                                    onClick={() => handleSavePermissions()}
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
                                            Grant view access plus granular add/edit/delete actions for each tab.
                                            {activeRole.locked ? ' Super Admin retains permission to view and manage all workspace modules.' : ' Toggling off "View" clears all actions for that tab.'}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {dashboardAccessTabs.map((tab) => {
                                        const Icon = tab.icon;
                                        const hasView = hasTabAction(tab.path, 'view');

                                        const backendTab = findTabEntry(activeRole.tabs, tab.path);
                                        const isDisabledByBackend = backendTab && typeof backendTab === 'object' && backendTab.disabled === true;

                                        return (
                                            <div
                                                key={`${tab.label}-${tab.path}`}
                                                className={`rounded-xl border p-4 bg-white transition-all ${
                                                    hasView ? 'border-[#6F4BFF]/20 shadow-xs' : 'border-gray-100 opacity-80 hover:opacity-100'
                                                } ${isDisabledByBackend ? 'opacity-50' : ''}`}
                                            >
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex items-start gap-3 min-w-0">
                                                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                                                            hasView ? 'bg-[#6F4BFF]/10 text-[#6F4BFF]' : 'bg-gray-100 text-gray-400'
                                                        }`}>
                                                            <Icon className="w-5 h-5" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-black text-gray-900 truncate">{tab.label}</p>
                                                            <p className="text-xs font-semibold text-gray-400 mt-1 truncate">{tab.path}</p>
                                                        </div>
                                                    </div>
                                                    <Toggle
                                                        active={hasView}
                                                        disabled={activeRole.locked || isDisabledByBackend}
                                                        onClick={() => !isDisabledByBackend && handleToggleAction(tab.path, 'view')}
                                                    />
                                                </div>

                                                {hasView && (
                                                    <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-2">
                                                        {TAB_ACTIONS.filter((a) => a.key !== 'view').map((action) => {
                                                            const active = hasTabAction(tab.path, action.key);
                                                            return (
                                                                <button
                                                                    key={action.key}
                                                                    type="button"
                                                                    disabled={activeRole.locked || isDisabledByBackend}
                                                                    onClick={() => handleToggleAction(tab.path, action.key)}
                                                                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all disabled:cursor-not-allowed ${
                                                                        active
                                                                            ? 'bg-[#6F4BFF] text-white border-[#6F4BFF]'
                                                                            : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-[#6F4BFF]/40'
                                                                    }`}
                                                                >
                                                                    {action.label}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                )}
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
