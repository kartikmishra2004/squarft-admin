import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
    Search, Plus, Edit2, Trash2, Eye, ArrowRight, 
    CheckCircle2, XCircle, Image as ImageIcon, Save,
    MoreVertical, Shield, Smartphone, FileCheck
} from 'lucide-react';
import { setSelectedUser, deleteUser, updateUser, updateUserDocStatus } from '../../store/usersSlice';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Header from '../../components/layout/Header';
import Table from '../../components/ui/Table';

const UserList = () => {
    const dispatch = useDispatch();
    const { users, selectedUser } = useSelector((state) => state.users);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('All Users');

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            user.phone.includes(searchTerm);
        const matchesFilter = filterType === 'All Users' || 
                            user.type.toLowerCase() === filterType.toLowerCase().replace(' ', '_');
        return matchesSearch && matchesFilter;
    });

    const handleViewUser = (user) => {
        dispatch(setSelectedUser(user));
    };

    const handleDeleteUser = (id) => {
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            dispatch(deleteUser(id));
        }
    };

    const handleBack = () => {
        dispatch(setSelectedUser(null));
    };

    if (selectedUser) {
        return <UserEditView user={selectedUser} onBack={handleBack} />;
    }

    return (
        <div className="flex-1 flex flex-col h-full relative bg-[#F5F6FA] font-sans text-gray-900">
            <Header title="User List" />

            <main className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth">
                <div className="max-w-[1600px] mx-auto space-y-6">
                    
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">User List</h2>
                            <p className="text-sm text-gray-500 mt-1">Manage Sales, Broker, and Field Officer app registrations.</p>
                        </div>
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <div className="relative flex-1 sm:w-80">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by name or mobile..."
                                    className="pl-9 pr-4 py-2.5 w-full bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6F4BFF]/20 focus:border-[#6F4BFF] transition-all shadow-sm"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <select 
                                className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-black bg-white focus:ring-2 focus:ring-[#6F4BFF]/20 outline-none shadow-sm cursor-pointer"
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                            >
                                <option>All Users</option>
                                <option>Sales Officer</option>
                                <option>Field Officer</option>
                                <option>Broker</option>
                            </select>
                        </div>
                    </div>

                    <Card noPadding className="overflow-hidden border-gray-100 shadow-xl shadow-gray-200/50">
                        <Table
                            headers={['NAME', 'USER TYPE', 'MOBILE', 'DOCUMENT STATUS', 'ACTION']}
                            data={filteredUsers}
                            renderRow={(row, i) => (
                                <tr key={i} className="hover:bg-gray-50/80 transition-all border-b border-gray-100 last:border-0">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-linear-to-br from-gray-100 to-gray-200 border border-gray-200 flex items-center justify-center shrink-0 shadow-inner">
                                                <span className="font-black text-gray-400 text-sm uppercase">{row.name.charAt(0)}</span>
                                            </div>
                                            <span className="font-black text-gray-900 tracking-tight">{row.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <Shield className="w-3.5 h-3.5 text-[#6F4BFF]" />
                                            <span className="text-[11px] font-black text-gray-500 uppercase tracking-widest">{row.type.replace('_', ' ')}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <Smartphone className="w-3.5 h-3.5 text-gray-400" />
                                            <span className="text-sm font-black text-gray-700">{row.phone}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <Badge variant={row.docStatus === 'Approved' ? 'green' : row.docStatus === 'Pending' ? 'yellow' : 'red'}>
                                            {row.docStatus}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => handleViewUser(row)}
                                                className="w-9 h-9 rounded-xl bg-[#6F4BFF] text-white flex items-center justify-center hover:bg-[#5D3FE0] transition-all shadow-lg shadow-[#6F4BFF]/20"
                                                title="Edit & Verify"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteUser(row.id)}
                                                className="w-9 h-9 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all border border-rose-100" 
                                                title="Delete User"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleViewUser(row)}
                                                className="w-9 h-9 rounded-xl bg-gray-50 text-gray-400 flex items-center justify-center hover:bg-gray-100 hover:text-gray-900 transition-all border border-gray-100"
                                                title="View Profile"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        />
                    </Card>
                </div>
            </main>
        </div>
    );
};

const UserEditView = ({ user, onBack }) => {
    const dispatch = useDispatch();
    const [localUser, setLocalUser] = useState({ ...user });

    const handleUpdateStatus = (status) => {
        dispatch(updateUserDocStatus({ id: user.id, status }));
        setLocalUser({ ...localUser, docStatus: status });
    };

    const handleSave = () => {
        dispatch(updateUser(localUser));
        onBack();
    };

    const DocCard = ({ title, showCancel = true }) => (
        <div className="border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-xl shadow-gray-200/20 flex flex-col group">
            <div className="flex justify-between items-center p-4 border-b border-gray-50 bg-gray-50/30">
                <h4 className="font-black text-gray-800 text-[10px] uppercase tracking-widest">{title}</h4>
                {showCancel && (
                    <button className="w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center hover:bg-rose-600 transition-colors shadow-sm shadow-rose-500/20">
                        <XCircle className="w-3 h-3" />
                    </button>
                )}
            </div>

            <div className="aspect-[4/3] bg-gray-50 relative group flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-br from-gray-100 to-gray-200 opacity-50"></div>
                <ImageIcon className="w-12 h-12 text-gray-300 z-10 transition-transform group-hover:scale-110 duration-500" />
                <div className="absolute inset-0 bg-gray-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20 cursor-pointer backdrop-blur-[2px]">
                    <span className="text-white font-black text-[10px] uppercase tracking-widest flex items-center gap-2 bg-gray-900/60 px-4 py-2 rounded-xl"><Eye className="w-4 h-4" /> Preview Full</span>
                </div>
            </div>

            <div className="p-4 border-t border-gray-50 flex items-center gap-3">
                <button className="flex-1 py-2.5 bg-white text-gray-700 text-[10px] font-black rounded-xl hover:bg-gray-50 transition-colors border border-gray-200 uppercase tracking-widest">
                    Replace
                </button>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center border border-emerald-100">
                    <CheckCircle2 className="w-4 h-4" />
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex-1 flex flex-col h-full relative bg-[#F5F6FA] font-sans text-gray-900">
            <Header title="User Verification" showBack onBack={onBack} />

            <main className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth">
                <div className="max-w-[1200px] mx-auto space-y-6">
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 rounded-2xl bg-[#6F4BFF] text-white flex items-center justify-center text-2xl font-black shadow-xl shadow-[#6F4BFF]/20">
                                {localUser.name.charAt(0)}
                            </div>
                            <div>
                                <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase">{localUser.name}</h2>
                                <p className="text-sm text-gray-500 mt-1 font-bold flex items-center gap-2 uppercase tracking-widest">
                                    <Smartphone className="w-4 h-4 text-[#6F4BFF]" /> {localUser.phone} • <span className="text-gray-900">{localUser.type.replace('_', ' ')}</span>
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3 bg-white p-2 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100">
                            {localUser.docStatus !== 'Approved' && (
                                <Button variant="success" icon={CheckCircle2} onClick={() => handleUpdateStatus('Approved')} className="font-black uppercase tracking-widest text-[10px] h-11 px-6">Approve Account</Button>
                            )}
                            {localUser.docStatus !== 'Rejected' && (
                                <Button variant="danger" icon={XCircle} onClick={() => handleUpdateStatus('Rejected')} className="font-black uppercase tracking-widest text-[10px] h-11 px-6 bg-rose-500 hover:bg-rose-600 text-white">Reject Details</Button>
                            )}
                            {localUser.docStatus === 'Approved' && (
                                <div className="flex items-center gap-2 px-6 py-2 bg-emerald-50 text-emerald-700 font-black text-[10px] uppercase tracking-widest rounded-xl border border-emerald-200">
                                    <CheckCircle2 className="w-4 h-4" /> Verified & Active
                                </div>
                            )}
                        </div>
                    </div>

                    <Card className="p-8 border-gray-100 shadow-xl shadow-gray-200/50">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Full Name</label>
                                <input 
                                    type="text" 
                                    value={localUser.name} 
                                    onChange={(e) => setLocalUser({ ...localUser, name: e.target.value })}
                                    className="w-full border border-gray-200 rounded-xl p-3.5 outline-none focus:ring-2 focus:ring-[#6F4BFF]/20 focus:border-[#6F4BFF] font-black text-gray-900 bg-gray-50" 
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Mobile Number</label>
                                <input 
                                    type="text" 
                                    value={localUser.phone} 
                                    onChange={(e) => setLocalUser({ ...localUser, phone: e.target.value })}
                                    className="w-full border border-gray-200 rounded-xl p-3.5 outline-none focus:ring-2 focus:ring-[#6F4BFF]/20 focus:border-[#6F4BFF] font-black text-gray-900 bg-gray-50" 
                                />
                            </div>
                        </div>

                        <div className="border-t border-gray-100 pt-10">
                            <h3 className="text-lg font-black text-gray-800 mb-8 uppercase tracking-tight flex items-center gap-3">
                                <FileCheck className="w-5 h-5 text-[#6F4BFF]" /> KYC Documents & Verification
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                <DocCard title="Aadhaar Card (Front)" />
                                <DocCard title="Aadhaar Card (Back)" />
                                <DocCard title="PAN Card" />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                                <DocCard title="Profile Photo / Selfie" />
                            </div>
                        </div>

                        <div className="mt-12 pt-8 border-t border-gray-100 flex justify-end gap-3">
                            <Button variant="secondary" onClick={onBack} className="font-black uppercase tracking-widest text-[10px] px-8 h-12">Discard</Button>
                            <Button icon={Save} onClick={handleSave} className="px-10 h-12 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-[#6F4BFF]/20">Save Profile Updates</Button>
                        </div>
                    </Card>
                </div>
            </main>
        </div>
    );
};

export default UserList;
