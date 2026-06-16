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
    AlertCircle
} from 'lucide-react';
import Header from '../../components/layout/Header';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { dashboardAccessTabs } from '../../data/navigation';
import {
    getAccessibleBranches,
    getOperatingRoles,
    getRoleDetail,
    createNewBranchRole,
    updatePermissions,
    clearError,
    clearSuccess
} from '../../store/roleAccessSlice';

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

    // Redux selectors
    const { user, role: userRole } = useSelector((state) => state.auth);
    const { 
        accessibleBranches, 
        operatingRoles, 
        selectedRole, 
        loading, 
        error,
        successMessage 
    } = useSelector((state) => state.roleAccess);

    const isSuperAdmin = userRole === 'super_admin' || user?.role === 'super_admin';
    
    const [selectedBranchId, setSelectedBranchId] = useState(null);
    const [activeRoleId, setActiveRoleId] = useState(null);
    const [roleName, setRoleName] = useState('');
    const [saveFeedback, setSaveFeedback] = useState(false);

    // ✅ FIXED: Normalizes operatingRoles safely into a clean array structure
    const rolesList = useMemo(() => {
        if (!operatingRoles) return [];
        if (Array.isArray(operatingRoles)) return operatingRoles;
        if (operatingRoles.roles && Array.isArray(operatingRoles.roles)) return operatingRoles.roles;
        if (operatingRoles.data && Array.isArray(operatingRoles.data)) return operatingRoles.data;
        return [];
    }, [operatingRoles]);

    // Fetch accessible branches on mount for super admin
    useEffect(() => {
        console.group('🔍 [ROLES PAGE] Initial Load - Fetch Branches');
        console.log('⏱️ Mount Time:', new Date().toISOString());
        console.log('👤 Is Super Admin:', isSuperAdmin);
        console.log('👤 User Role:', userRole);
        console.log('👤 User:', user);
        
        if (isSuperAdmin) {
            console.log('✅ Super Admin detected - Dispatching getAccessibleBranches');
            dispatch(getAccessibleBranches());
        } else {
            console.log('ℹ️ Regular Admin - Setting branch from user data');
            // For non-super-admins, set their assigned branch
            if (user?.branchId) {
                console.log('🏢 Setting user branch ID:', user.branchId);
                setSelectedBranchId(user.branchId);
            }
        }
        console.groupEnd();
    }, [isSuperAdmin, dispatch, user]);

    // Set default branch when branches load
    useEffect(() => {
        const branches = accessibleBranches?.data || accessibleBranches || [];
        const branchesArray = Array.isArray(branches) ? branches : [];
        if (isSuperAdmin && branchesArray.length > 0 && !selectedBranchId) {
            setSelectedBranchId(branchesArray[0].id);
        }
    }, [accessibleBranches, selectedBranchId, isSuperAdmin]);

    // Fetch roles when branch changes
    useEffect(() => {
        console.group('🔍 [ROLES PAGE] Branch Changed - Fetch Roles');
        console.log('⏱️ Time:', new Date().toISOString());
        console.log('🏢 Selected Branch ID:', selectedBranchId);
        
        if (selectedBranchId) {
            console.log('✅ Branch ID present - Dispatching getOperatingRoles');
            dispatch(getOperatingRoles(selectedBranchId));
        } else {
            console.log('ℹ️ No Branch ID - Skipping role fetch');
        }
        console.groupEnd();
    }, [selectedBranchId, dispatch]);

    // Set default role when roles load
    useEffect(() => {
        if (rolesList.length > 0 && !activeRoleId) {
            setActiveRoleId(rolesList[0].id);
        }
    }, [rolesList, activeRoleId]);

    // Fetch role detail when active role changes
    useEffect(() => {
        console.group('🔍 [ROLES PAGE] Role Changed - Fetch Detail');
        console.log('⏱️ Time:', new Date().toISOString());
        console.log('🔑 Active Role ID:', activeRoleId);
        console.log('🏢 Selected Branch ID:', selectedBranchId);
        
        if (activeRoleId && selectedBranchId) {
            console.log('✅ Both IDs present - Dispatching getRoleDetail');
            dispatch(getRoleDetail({ roleId: activeRoleId, branchId: selectedBranchId }));
        } else {
            console.log('ℹ️ Missing ID - Role:', activeRoleId, 'Branch:', selectedBranchId);
        }
        console.groupEnd();
    }, [activeRoleId, selectedBranchId, dispatch]);

    // Clear success message after 3 seconds
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

    // Clear error message after 5 seconds
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
        if (!accessibleBranches) return [];
        if (Array.isArray(accessibleBranches)) return accessibleBranches;
        return accessibleBranches.data || [];
    }, [accessibleBranches]);

    const activeBranch = branchesNormalized.find(b => b.id === selectedBranchId) || {};

    const handleCreateRole = async (event) => {
        event.preventDefault();

        console.group('🔍 [ROLES PAGE] Create Role Handler');
        console.log('⏱️ Time:', new Date().toISOString());

        const trimmedName = roleName.trim();
        console.log('📝 Role Name (trimmed):', trimmedName);
        console.log('🏢 Selected Branch ID:', selectedBranchId);
        
        if (!trimmedName || !selectedBranchId) {
            console.warn('⚠️ Validation Failed - Missing required fields');
            console.warn('   Role Name:', !!trimmedName);
            console.warn('   Branch ID:', !!selectedBranchId);
            console.groupEnd();
            return;
        }

        try {
            console.log('✅ Validation passed - Creating role...');
            await dispatch(createNewBranchRole({
                branchId: selectedBranchId,
                roleName: trimmedName,
            })).unwrap();
            
            console.log('✅ Role created successfully');
            setRoleName('');
            console.log('🔄 Refreshing roles list...');
            dispatch(getOperatingRoles(selectedBranchId));
            console.groupEnd();
        } catch (error) {
            console.error('❌ Create role failed:', error);
            console.groupEnd();
        }
    };

    const handleToggleTab = (tabPath) => {
        if (activeRole.locked || !activeRole.tabs) return;

        console.group('🔍 [ROLES PAGE] Toggle Tab');
        console.log('⏱️ Time:', new Date().toISOString());
        console.log('📍 Tab Path:', tabPath);
        console.log('📊 Current tabs structure:', activeRole.tabs);
        console.log('📊 Tabs count:', activeRole.tabs?.length);

        const currentTabs = activeRole.tabs || [];
        
        // Check if this tab is disabled by backend
        const backendTab = currentTabs.find(t => {
            const path = typeof t === 'string' ? t : t.path;
            return path === tabPath;
        });
        
        console.log('🔍 Backend tab found:', backendTab);
        
        if (backendTab && typeof backendTab === 'object' && backendTab.disabled === true) {
            console.warn('⚠️ This tab is disabled by backend - cannot toggle');
            console.groupEnd();
            return;
        }
        
        // Find if tab exists (handle both string and object formats)
        const tabIndex = currentTabs.findIndex(t => {
            const path = typeof t === 'string' ? t : t.path;
            return path === tabPath;
        });
        
        console.log('📊 Tab index in current tabs:', tabIndex);
        
        let updatedTabPaths;
        if (tabIndex >= 0) {
            // Remove tab - extract just the paths where enabled=true or not disabled
            updatedTabPaths = currentTabs
                .filter(t => {
                    const path = typeof t === 'string' ? t : t.path;
                    const disabled = typeof t === 'object' ? t.disabled : false;
                    return path !== tabPath && !disabled;
                })
                .map(t => typeof t === 'string' ? t : t.path);
            console.log('➖ Removing tab');
        } else {
            // Add tab - extract paths (excluding disabled ones) and add new one
            updatedTabPaths = [
                ...currentTabs
                    .filter(t => {
                        const disabled = typeof t === 'object' ? t.disabled : false;
                        return !disabled;
                    })
                    .map(t => typeof t === 'string' ? t : t.path),
                tabPath
            ];
            console.log('➕ Adding tab');
        }

        console.log('📤 Updated tab paths:', updatedTabPaths);
        console.log('📤 Count:', updatedTabPaths.length);
        console.groupEnd();

        handleSavePermissions(updatedTabPaths);
    };

    const handleSavePermissions = async (tabPaths = null) => {
        console.group('🔍 [ROLES PAGE] Save Permissions Handler');
        console.log('⏱️ Time:', new Date().toISOString());
        console.log('🔑 Active Role ID:', activeRoleId);
        console.log('🏢 Selected Branch ID:', selectedBranchId);
        
        if (!activeRoleId || !selectedBranchId) {
            console.warn('⚠️ Cannot save: missing roleId or branchId');
            console.warn('   Role ID:', activeRoleId);
            console.warn('   Branch ID:', selectedBranchId);
            console.groupEnd();
            return;
        }

        // Extract just the paths from tabs array (handle both string and object formats)
        const tabPathsToSend = tabPaths || (activeRole.tabs || []).map(t => {
            return typeof t === 'string' ? t : t.path;
        });
        
        console.log('📤 Tab paths to send:', tabPathsToSend);
        console.log('📤 Tab paths count:', tabPathsToSend.length);

        try {
            console.log('✅ Validation passed - Updating permissions...');
            await dispatch(updatePermissions({
                roleId: activeRoleId,
                permissionsData: {
                    branchId: selectedBranchId,
                    tabs: tabPathsToSend
                }
            })).unwrap();
            console.log('✅ Permissions updated successfully');
            console.groupEnd();
        } catch (error) {
            console.error('❌ Save permissions failed:', error);
            console.groupEnd();
        }
    };

    const hasTabAccess = (tabPath) => {
        if (activeRole.locked) return true;
        
        // tabs can be array of objects with {path, enabled} or {id, path, enabled}
        if (!activeRole.tabs || !Array.isArray(activeRole.tabs)) return false;
        
        return activeRole.tabs.some(t => {
            // Handle both {path: string} and {id: string, path: string, enabled: boolean} formats
            const path = typeof t === 'string' ? t : t.path;
            const enabled = typeof t === 'object' ? (t.enabled !== undefined ? t.enabled : true) : true;
            return path === tabPath && enabled;
        });
    };

    const allowedCount = activeRole.locked 
        ? dashboardAccessTabs.length 
        : (activeRole.enabledTabsCount !== undefined 
            ? activeRole.enabledTabsCount 
            : (activeRole.tabs || []).filter(t => {
                // Handle both string and object formats
                const enabled = typeof t === 'object' ? (t.enabled !== undefined ? t.enabled : true) : true;
                return enabled;
              }).length
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
                                    <button
                                        key={role.id}
                                        onClick={() => setActiveRoleId(role.id)}
                                        className={`w-full text-left p-3 rounded-xl transition-all border ${
                                            activeRoleId === role.id
                                                ? 'bg-[#6F4BFF] text-white border-[#6F4BFF] shadow-md shadow-[#6F4BFF]/25'
                                                : 'bg-white text-gray-700 border-gray-100 hover:border-[#6F4BFF]/30 hover:bg-[#6F4BFF]/5'
                                        }`}
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
                                ))}
                            </div>

                            {/* Create Custom Role form - Available for All Admins */}
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
                                    disabled={loading || !activeRoleId}
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
                                            Turn on the tabs this role should see in the dashboard sidebar. 
                                            {activeRole.locked ? ' Super Admin retains permission to view all workspace modules.' : ' You can configure customizable access bounds for this role.'}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-3">
                                    {dashboardAccessTabs.map((tab) => {
                                        const Icon = tab.icon;
                                        const hasAccess = hasTabAccess(tab.path);
                                        
                                        // Check if this tab exists in backend's tabs list
                                        const backendTab = activeRole.tabs?.find(t => {
                                            const path = typeof t === 'string' ? t : t.path;
                                            return path === tab.path;
                                        });
                                        
                                        // If backend tab has disabled=true, don't allow toggling
                                        const isDisabledByBackend = backendTab && typeof backendTab === 'object' && backendTab.disabled === true;

                                        return (
                                            <div
                                                key={`${tab.label}-${tab.path}`}
                                                className={`rounded-xl border p-4 bg-white transition-all ${
                                                    hasAccess ? 'border-[#6F4BFF]/20 shadow-xs' : 'border-gray-100 opacity-80 hover:opacity-100'
                                                } ${isDisabledByBackend ? 'opacity-50' : ''}`}
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
                                                        disabled={activeRole.locked || isDisabledByBackend}
                                                        onClick={() => !isDisabledByBackend && handleToggleTab(tab.path)}
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