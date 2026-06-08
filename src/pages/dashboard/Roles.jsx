import React, { useState } from 'react';
import { 
    ShieldCheck, Plus, Save, Key, Settings, Layers 
} from 'lucide-react';
import { rolesList, permissionModules } from '../../data/mockData';
import Header from '../../components/layout/Header';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const Toggle = ({ active, onClick }) => (
    <div 
        onClick={onClick}
        className={`w-12 h-6 rounded-full flex items-center p-1 transition-colors cursor-pointer shadow-inner ${active ? 'bg-[#6F4BFF]' : 'bg-gray-200'}`}
    >
        <div className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform ${active ? 'translate-x-6' : 'translate-x-0'}`}></div>
    </div>
);

const Roles = () => {
    const [activeRole, setActiveRole] = useState('Sales Officer');
    const [permissions, setPermissions] = useState(permissionModules);

    const handleToggle = (index, field) => {
        console.log(`Toggling ${field} for module ${index}`);
        const newPermissions = [...permissions];
        newPermissions[index] = {
            ...newPermissions[index],
            [field]: !newPermissions[index][field]
        };
        setPermissions(newPermissions);
    };

    const handleRoleChange = (role) => {
        console.log(`Changing role to: ${role}`);
        setActiveRole(role);
    };

    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden relative bg-[#F5F6FA] font-sans text-gray-900 selection:bg-[#6F4BFF]/20 selection:text-[#6F4BFF]">
            {/* Background ambient glow */}
            <div className="absolute top-0 right-0 w-[800px] h-[500px] bg-purple-400/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[400px] bg-blue-400/5 rounded-full blur-[100px] pointer-events-none -z-10"></div>

            <Header title="Roles & Access Control" />

            <main className="flex-1 overflow-y-auto p-6 md:p-8 h-full scroll-smooth">
                <div className="max-w-[1600px] mx-auto h-full flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Roles & Access Control</h2>
                        <p className="text-gray-500 mt-1 font-medium text-sm">Define granular permissions for what different team members can view, edit, or delete.</p>
                    </div>
                    
                    <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
                        {/* Left Sidebar for Roles */}
                        <Card noPadding className="w-full lg:w-64 shrink-0 flex flex-col border-gray-200 shadow-md">
                            <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                                <h3 className="font-bold text-gray-800 uppercase tracking-widest text-xs">Defined Roles</h3>
                            </div>
                            <div className="p-2 space-y-1">
                                {rolesList.map(role => (
                                    <button
                                        key={role}
                                        onClick={() => handleRoleChange(role)}
                                        className={`w-full text-left px-4 py-3 rounded-lg font-bold text-sm transition-all ${activeRole === role ? 'bg-[#6F4BFF] text-white shadow-md shadow-[#6F4BFF]/30' : 'text-gray-600 hover:bg-gray-100'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            {role}
                                            {role === 'Super Admin' && <ShieldCheck className={`w-4 h-4 ${activeRole === role ? 'text-white' : 'text-[#6F4BFF]'}`} />}
                                        </div>
                                    </button>
                                ))}
                            </div>
                            <div className="p-4 mt-auto border-t border-gray-100">
                                <Button variant="secondary" className="w-full font-bold text-xs shadow-sm" icon={Plus}>Create Custom Role</Button>
                            </div>
                        </Card>

                        {/* Right Area: Permission Matrix */}
                        <Card noPadding className="flex-1 flex flex-col border-gray-200 shadow-lg">
                            <div className="p-6 border-b border-gray-100 bg-white flex justify-between items-center shrink-0">
                                <div>
                                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">{activeRole} Permissions</h3>
                                    <p className="text-sm font-medium text-gray-500 mt-1 flex items-center gap-2">
                                        <ShieldCheck className="w-4 h-4 text-emerald-500" /> Inherits base system access.
                                    </p>
                                </div>
                                <Button 
                                    icon={Save} 
                                    className="px-8 py-3 shadow-md shadow-[#6F4BFF]/20 text-base font-bold"
                                    onClick={() => console.log("Save Policy clicked")}
                                >
                                    Save Policy
                                </Button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
                                {activeRole === 'Super Admin' ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 p-10">
                                        <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center shadow-xl mb-6">
                                            <Key className="w-10 h-10 text-amber-400" />
                                        </div>
                                        <h3 className="text-2xl font-black text-gray-900 mb-2">Absolute Power</h3>
                                        <p className="text-gray-500 font-medium max-w-md">The Super Admin role has unrestricted access to all modules, settings, and destructive actions. Permissions cannot be modified.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start gap-4">
                                            <div className="p-2 bg-blue-100 rounded-lg text-blue-600 shrink-0"><Settings className="w-5 h-5" /></div>
                                            <div>
                                                <h4 className="font-bold text-blue-900">Module Access Configuration</h4>
                                                <p className="text-sm text-blue-700 font-medium mt-1">Enable or disable specific read, write, and delete capabilities for the <span className="font-bold">{activeRole}</span> role.</p>
                                            </div>
                                        </div>

                                        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                                            <table className="w-full text-left border-collapse">
                                                <thead>
                                                    <tr className="bg-gray-50/80 border-b border-gray-200">
                                                        <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest w-1/3">System Module</th>
                                                        <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest text-center">View (Read)</th>
                                                        <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest text-center">Create/Edit (Write)</th>
                                                        <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest text-center">Delete (Destructive)</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100">
                                                    {permissions.map((mod, i) => (
                                                        <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                                                            <td className="px-6 py-5 font-bold text-gray-800 text-sm flex items-center gap-3">
                                                                <Layers className="w-4 h-4 text-gray-400" /> {mod.name}
                                                            </td>
                                                            <td className="px-6 py-5">
                                                                <div className="flex justify-center">
                                                                    <Toggle active={mod.read} onClick={() => handleToggle(i, 'read')} />
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-5">
                                                                <div className="flex justify-center">
                                                                    <Toggle active={mod.write} onClick={() => handleToggle(i, 'write')} />
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-5">
                                                                <div className="flex justify-center">
                                                                    <Toggle active={mod.delete} onClick={() => handleToggle(i, 'delete')} />
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Roles;
