import { useMemo, useState } from 'react';
import {
    CheckCircle2,
    Key,
    Layers,
    Plus,
    Save,
    ShieldCheck,
    Sparkles,
} from 'lucide-react';
import Header from '../../components/layout/Header';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { dashboardAccessTabs } from '../../data/navigation';

const STORAGE_KEY = 'squarft-role-access-policies';
const SUPER_ADMIN_ID = 'super_admin';

const makeRoleId = (name) => name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');

const getAllTabPaths = () => dashboardAccessTabs.map((tab) => tab.path);

const createSuperAdminRole = () => ({
    id: SUPER_ADMIN_ID,
    name: 'Super Admin',
    description: 'Full platform owner access',
    tabAccess: getAllTabPaths(),
    locked: true,
});

const loadStoredRoles = () => {
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
        if (!Array.isArray(saved)) return [createSuperAdminRole()];

        const customRoles = saved.filter((role) => role.id !== SUPER_ADMIN_ID);
        return [createSuperAdminRole(), ...customRoles];
    } catch {
        return [createSuperAdminRole()];
    }
};

const persistRoles = (roles) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(roles));
};

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
    const [roles, setRoles] = useState(loadStoredRoles);
    const [activeRoleId, setActiveRoleId] = useState(SUPER_ADMIN_ID);
    const [roleName, setRoleName] = useState('');

    const activeRole = useMemo(
        () => roles.find((role) => role.id === activeRoleId) || roles[0],
        [activeRoleId, roles]
    );

    const allowedCount = activeRole.locked ? dashboardAccessTabs.length : activeRole.tabAccess.length;

    const updateRoles = (nextRoles) => {
        setRoles(nextRoles);
        persistRoles(nextRoles);
    };

    const handleCreateRole = (event) => {
        event.preventDefault();

        const trimmedName = roleName.trim();
        if (!trimmedName) return;

        const baseId = makeRoleId(trimmedName);
        const roleId = baseId || `role_${Date.now()}`;
        const uniqueId = roles.some((role) => role.id === roleId) ? `${roleId}_${Date.now()}` : roleId;
        const newRole = {
            id: uniqueId,
            name: trimmedName,
            description: 'Custom access role',
            tabAccess: [],
            locked: false,
        };

        updateRoles([...roles, newRole]);
        setActiveRoleId(uniqueId);
        setRoleName('');
    };

    const handleToggleTab = (path) => {
        if (activeRole.locked) return;

        const nextRoles = roles.map((role) => {
            if (role.id !== activeRole.id) return role;

            const hasAccess = role.tabAccess.includes(path);
            return {
                ...role,
                tabAccess: hasAccess
                    ? role.tabAccess.filter((tabPath) => tabPath !== path)
                    : [...role.tabAccess, path],
            };
        });

        updateRoles(nextRoles);
    };

    const handleSave = () => {
        persistRoles(roles);
    };

    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden relative bg-[#F5F6FA] font-sans text-gray-900 selection:bg-[#6F4BFF]/20 selection:text-[#6F4BFF]">
            <Header title="Roles & Access Control" />

            <main className="flex-1 overflow-y-auto p-6 md:p-8 h-full scroll-smooth">
                <div className="max-w-[1600px] mx-auto h-full flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Roles & Access Control</h2>
                        <p className="text-gray-500 mt-1 font-medium text-sm">
                            Super Admin creates roles and grants the dashboard tabs each role can see.
                        </p>
                    </div>

                    <div className="flex flex-col xl:flex-row gap-6 flex-1 min-h-0">
                        <Card noPadding className="w-full xl:w-80 shrink-0 flex flex-col border-gray-200 shadow-md">
                            <div className="p-5 border-b border-gray-100 bg-gray-50/60">
                                <div className="flex items-center justify-between gap-3">
                                    <div>
                                        <h3 className="font-black text-gray-900 tracking-tight">Roles</h3>
                                        <p className="text-xs text-gray-500 font-semibold mt-1">Only Super Admin is fixed.</p>
                                    </div>
                                    <div className="h-10 w-10 rounded-xl bg-[#6F4BFF]/10 text-[#6F4BFF] flex items-center justify-center">
                                        <ShieldCheck className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>

                            <div className="p-3 space-y-2">
                                {roles.map((role) => (
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
                                                    {role.locked ? 'All tabs enabled' : `${role.tabAccess.length} tabs enabled`}
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

                            <form onSubmit={handleCreateRole} className="p-4 mt-auto border-t border-gray-100 bg-gray-50/60">
                                <label htmlFor="role-name" className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">
                                    Create Role
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

                        <Card noPadding className="flex-1 flex flex-col border-gray-200 shadow-lg min-h-[640px]">
                            <div className="p-5 md:p-6 border-b border-gray-100 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
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
                                    icon={Save}
                                    className="px-6 py-3 shadow-md shadow-[#6F4BFF]/20 text-sm font-bold"
                                    onClick={handleSave}
                                >
                                    Save Access
                                </Button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-5 md:p-6 bg-gray-50/40">
                                <div className="mb-5 rounded-xl border border-blue-100 bg-blue-50 p-4 flex items-start gap-4">
                                    <div className="p-2 bg-white rounded-lg text-blue-600 shrink-0 shadow-sm">
                                        <Sparkles className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-blue-950">Tab access</h4>
                                        <p className="text-sm text-blue-700 font-medium mt-1">
                                            Turn on the tabs this role should see in the dashboard sidebar. Super Admin always keeps access to every tab.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-3">
                                    {dashboardAccessTabs.map((tab) => {
                                        const Icon = tab.icon;
                                        const hasAccess = activeRole.locked || activeRole.tabAccess.includes(tab.path);

                                        return (
                                            <div
                                                key={`${tab.label}-${tab.path}`}
                                                className={`rounded-xl border p-4 bg-white transition-all ${
                                                    hasAccess ? 'border-[#6F4BFF]/20 shadow-sm' : 'border-gray-100'
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
