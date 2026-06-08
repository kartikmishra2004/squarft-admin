import { useEffect, useMemo, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    Search, Plus, Edit2, Trash2, Eye, CheckCircle2, XCircle,
    Image as ImageIcon, Save, Shield, Smartphone, FileCheck, Upload, UserPlus
} from 'lucide-react';
import {
    addUser,
    setSelectedUser,
    deleteUser,
    updateUser,
    updateUserDocStatus,
    updateUserDocument,
    removeUserDocument,
} from '../../store/usersSlice';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Header from '../../components/layout/Header';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';

const emptyUserForm = {
    name: '',
    type: 'Sales_officer',
    phone: '',
    docStatus: 'Pending',
    status: 'Active',
};

const documentFields = [
    { key: 'aadhaarFront', title: 'Aadhaar Card (Front)' },
    { key: 'aadhaarBack', title: 'Aadhaar Card (Back)' },
    { key: 'panCard', title: 'PAN Card' },
    { key: 'profilePhoto', title: 'Profile Photo / Selfie' },
];

const getDocBadgeVariant = (status) => {
    if (status === 'Approved') return 'green';
    if (status === 'Pending') return 'yellow';
    return 'red';
};

const normalizeType = (type) => type.toLowerCase().replace(/\s+/g, '_');

const UserList = () => {
    const dispatch = useDispatch();
    const { users, selectedUser } = useSelector((state) => state.users);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('All Users');
    const [filterDocStatus, setFilterDocStatus] = useState('All Status');
    const [isAddUserOpen, setIsAddUserOpen] = useState(false);
    const [newUserForm, setNewUserForm] = useState(emptyUserForm);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const filteredUsers = useMemo(() => users.filter((user) => {
        const query = searchTerm.trim().toLowerCase();
        const matchesSearch = !query ||
            user.name.toLowerCase().includes(query) ||
            user.phone.includes(query) ||
            user.id.toLowerCase().includes(query);
        const matchesType = filterType === 'All Users' || normalizeType(filterType) === user.type.toLowerCase();
        const matchesDocStatus = filterDocStatus === 'All Status' || user.docStatus === filterDocStatus;
        return matchesSearch && matchesType && matchesDocStatus;
    }), [filterDocStatus, filterType, searchTerm, users]);

    const createUserId = () => {
        const nextNumber = users.reduce((max, user) => {
            const userNumber = Number(String(user.id).replace(/\D/g, '')) || 0;
            return Math.max(max, userNumber);
        }, 0) + 1;
        return `U${String(nextNumber).padStart(3, '0')}`;
    };

    const handleCreateUser = (event) => {
        event.preventDefault();
        dispatch(addUser({
            id: createUserId(),
            ...newUserForm,
            name: newUserForm.name.trim(),
            phone: newUserForm.phone.trim(),
            documents: {},
        }));
        setNewUserForm(emptyUserForm);
        setIsAddUserOpen(false);
    };

    const handleBack = () => {
        dispatch(setSelectedUser(null));
    };

    if (selectedUser) {
        return <UserEditView user={selectedUser} onBack={handleBack} />;
    }

    return (
        <div className="flex-1 flex flex-col h-full relative bg-[#F5F6FA] font-sans text-gray-900">
            <Header title="App user list" />

            <main className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth">
                <div className="max-w-[1600px] mx-auto space-y-6">
                    <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">App user list</h2>
                            <p className="text-sm text-gray-500 mt-1">Manage Sales, Broker, and Field Officer app registrations.</p>
                        </div>
                        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 w-full xl:w-auto">
                            <div className="relative flex-1 md:w-80">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by name, id, or mobile..."
                                    className="pl-9 pr-4 py-2.5 w-full bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6F4BFF]/20 focus:border-[#6F4BFF] transition-all shadow-sm"
                                    value={searchTerm}
                                    onChange={(event) => setSearchTerm(event.target.value)}
                                />
                            </div>
                            <select
                                className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-black bg-white focus:ring-2 focus:ring-[#6F4BFF]/20 outline-none shadow-sm cursor-pointer"
                                value={filterType}
                                onChange={(event) => setFilterType(event.target.value)}
                            >
                                <option>All Users</option>
                                <option>Sales Officer</option>
                                <option>Field Officer</option>
                                <option>Broker</option>
                            </select>
                            <select
                                className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-black bg-white focus:ring-2 focus:ring-[#6F4BFF]/20 outline-none shadow-sm cursor-pointer"
                                value={filterDocStatus}
                                onChange={(event) => setFilterDocStatus(event.target.value)}
                            >
                                <option>All Status</option>
                                <option>Approved</option>
                                <option>Pending</option>
                                <option>Rejected</option>
                            </select>
                            <Button icon={Plus} onClick={() => setIsAddUserOpen(true)} className="shadow-md shadow-[#6F4BFF]/20">Add User</Button>
                        </div>
                    </div>

                    <Card noPadding className="overflow-hidden border-gray-100 shadow-xl shadow-gray-200/50">
                        <Table
                            headers={['NAME', 'USER TYPE', 'MOBILE', 'DOCUMENT STATUS', 'ACTION']}
                            data={filteredUsers}
                            renderRow={(row) => (
                                <tr key={row.id} className="hover:bg-gray-50/80 transition-all border-b border-gray-100 last:border-0">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-linear-to-br from-gray-100 to-gray-200 border border-gray-200 flex items-center justify-center shrink-0 shadow-inner">
                                                <span className="font-black text-gray-400 text-sm uppercase">{row.name.charAt(0)}</span>
                                            </div>
                                            <div>
                                                <span className="font-black text-gray-900 tracking-tight">{row.name}</span>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{row.id}</p>
                                            </div>
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
                                        <Badge variant={getDocBadgeVariant(row.docStatus)}>{row.docStatus}</Badge>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => dispatch(setSelectedUser(row))}
                                                className="w-9 h-9 rounded-xl bg-[#6F4BFF] text-white flex items-center justify-center hover:bg-[#5D3FE0] transition-all shadow-lg shadow-[#6F4BFF]/20"
                                                title="Edit & Verify"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => setDeleteTarget(row)}
                                                className="w-9 h-9 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all border border-rose-100"
                                                title="Delete User"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => dispatch(setSelectedUser(row))}
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
                        {filteredUsers.length === 0 && (
                            <div className="px-6 py-16 text-center">
                                <Search className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                                <p className="text-gray-500 font-bold text-lg">No users found</p>
                                <p className="text-gray-400 text-sm mt-1">Try changing search or filters.</p>
                            </div>
                        )}
                    </Card>
                </div>
            </main>

            <Modal isOpen={isAddUserOpen} onClose={() => setIsAddUserOpen(false)} title="Add New User">
                <form onSubmit={handleCreateUser} className="space-y-4">
                    <UserFormFields formState={newUserForm} setFormState={setNewUserForm} />
                    <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                        <Button variant="secondary" onClick={() => setIsAddUserOpen(false)}>Cancel</Button>
                        <Button type="submit" icon={UserPlus}>Create User</Button>
                    </div>
                </form>
            </Modal>

            <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete User">
                {deleteTarget && (
                    <div className="space-y-5">
                        <p className="text-sm font-bold text-gray-700">Delete {deleteTarget.name}? This removes the user from the current list.</p>
                        <div className="flex justify-end gap-3">
                            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>Cancel</Button>
                            <Button variant="danger" icon={Trash2} onClick={() => { dispatch(deleteUser(deleteTarget.id)); setDeleteTarget(null); }}>Delete</Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

const UserEditView = ({ user, onBack }) => {
    const dispatch = useDispatch();
    const fileInputRefs = useRef({});
    const [formState, setFormState] = useState({ ...emptyUserForm, ...user });
    const [previewDoc, setPreviewDoc] = useState(null);

    useEffect(() => {
        setFormState({ ...emptyUserForm, ...user });
    }, [user]);

    const handleUpdateStatus = (status) => {
        dispatch(updateUserDocStatus({ id: user.id, status }));
        setFormState((current) => ({ ...current, docStatus: status }));
    };

    const handleSave = () => {
        dispatch(updateUser(formState));
        onBack();
    };

    const handleDocumentUpload = (docKey, file) => {
        if (!file) return;
        dispatch(updateUserDocument({
            id: user.id,
            docKey,
            document: {
                fileName: file.name,
                fileType: file.type || 'File',
                size: file.size,
                uploadedAt: new Date().toLocaleString('en-IN'),
                status: 'Uploaded',
            },
        }));
    };

    const handleApproveDocument = (docKey) => {
        const document = documents[docKey];
        if (!document) return;
        dispatch(updateUserDocument({
            id: user.id,
            docKey,
            document: {
                ...document,
                status: 'Approved',
                approvedAt: new Date().toLocaleString('en-IN'),
            },
        }));
    };

    const handleRemoveDocument = (docKey) => {
        dispatch(removeUserDocument({ id: user.id, docKey }));
    };

    const documents = user.documents || {};

    return (
        <div className="flex-1 flex flex-col h-full relative bg-[#F5F6FA] font-sans text-gray-900">
            <Header title="User Verification" showBack onBack={onBack} />

            <main className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth">
                <div className="max-w-[1200px] mx-auto space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 rounded-2xl bg-[#6F4BFF] text-white flex items-center justify-center text-2xl font-black shadow-xl shadow-[#6F4BFF]/20">
                                {formState.name.charAt(0)}
                            </div>
                            <div>
                                <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase">{formState.name}</h2>
                                <p className="text-sm text-gray-500 mt-1 font-bold flex items-center gap-2 uppercase tracking-widest">
                                    <Smartphone className="w-4 h-4 text-[#6F4BFF]" /> {formState.phone} <span className="text-gray-300">|</span> <span className="text-gray-900">{formState.type.replace('_', ' ')}</span>
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3 bg-white p-2 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100">
                            {formState.docStatus !== 'Approved' && (
                                <Button variant="success" icon={CheckCircle2} onClick={() => handleUpdateStatus('Approved')} className="font-black uppercase tracking-widest text-[10px] h-11 px-6">Approve Account</Button>
                            )}
                            {formState.docStatus !== 'Rejected' && (
                                <Button variant="danger" icon={XCircle} onClick={() => handleUpdateStatus('Rejected')} className="font-black uppercase tracking-widest text-[10px] h-11 px-6 bg-rose-500 hover:bg-rose-600 text-white">Reject Details</Button>
                            )}
                            {formState.docStatus === 'Approved' && (
                                <div className="flex items-center gap-2 px-6 py-2 bg-emerald-50 text-emerald-700 font-black text-[10px] uppercase tracking-widest rounded-xl border border-emerald-200">
                                    <CheckCircle2 className="w-4 h-4" /> Verified & Active
                                </div>
                            )}
                        </div>
                    </div>

                    <Card className="p-8 border-gray-100 shadow-xl shadow-gray-200/50">
                        <UserFormFields formState={formState} setFormState={setFormState} includeStatus />

                        <div className="border-t border-gray-100 pt-10 mt-10">
                            <h3 className="text-lg font-black text-gray-800 mb-8 uppercase tracking-tight flex items-center gap-3">
                                <FileCheck className="w-5 h-5 text-[#6F4BFF]" /> KYC Documents & Verification
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {documentFields.map((doc) => {
                                    const document = documents[doc.key];
                                    return (
                                        <div key={doc.key} className="border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-xl shadow-gray-200/20 flex flex-col group">
                                            <div className="flex justify-between items-center p-4 border-b border-gray-50 bg-gray-50/30">
                                                <h4 className="font-black text-gray-800 text-[10px] uppercase tracking-widest">{doc.title}</h4>
                                                {document && (
                                                    <button onClick={() => handleRemoveDocument(doc.key)} className="w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center hover:bg-rose-600 transition-colors shadow-sm shadow-rose-500/20">
                                                        <XCircle className="w-3 h-3" />
                                                    </button>
                                                )}
                                            </div>

                                            <div className="aspect-[4/3] bg-gray-50 relative group flex items-center justify-center overflow-hidden">
                                                <div className="absolute inset-0 bg-linear-to-br from-gray-100 to-gray-200 opacity-50"></div>
                                                <div className="z-10 text-center px-5">
                                                    <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3 transition-transform group-hover:scale-110 duration-500" />
                                                    <p className="text-xs font-black text-gray-700 break-words">{document?.fileName || 'No document uploaded'}</p>
                                                    {document && <p className="text-[10px] font-bold text-gray-400 mt-1">{document.uploadedAt}</p>}
                                                    {document && (
                                                        <Badge variant={document.status === 'Approved' ? 'green' : 'yellow'} className="mt-3 inline-flex">
                                                            {document.status}
                                                        </Badge>
                                                    )}
                                                </div>
                                                {document && (
                                                    <button onClick={() => setPreviewDoc({ ...doc, ...document })} className="absolute inset-0 bg-gray-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20 cursor-pointer backdrop-blur-[2px]">
                                                        <span className="text-white font-black text-[10px] uppercase tracking-widest flex items-center gap-2 bg-gray-900/60 px-4 py-2 rounded-xl"><Eye className="w-4 h-4" /> Preview Details</span>
                                                    </button>
                                                )}
                                            </div>

                                            <div className="p-4 border-t border-gray-50 flex items-center gap-3">
                                                <input
                                                    ref={(node) => { fileInputRefs.current[doc.key] = node; }}
                                                    type="file"
                                                    className="hidden"
                                                    onChange={(event) => handleDocumentUpload(doc.key, event.target.files?.[0])}
                                                />
                                                {document && document.status !== 'Approved' && (
                                                    <button onClick={() => handleApproveDocument(doc.key)} className="py-2.5 px-3 bg-emerald-50 text-emerald-700 text-[10px] font-black rounded-xl hover:bg-emerald-100 transition-colors border border-emerald-100 uppercase tracking-widest flex items-center justify-center gap-2">
                                                        <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                                                    </button>
                                                )}
                                                <button onClick={() => fileInputRefs.current[doc.key]?.click()} className="flex-1 py-2.5 bg-white text-gray-700 text-[10px] font-black rounded-xl hover:bg-gray-50 transition-colors border border-gray-200 uppercase tracking-widest flex items-center justify-center gap-2">
                                                    <Upload className="w-3.5 h-3.5" /> {document ? 'Replace' : 'Upload'}
                                                </button>
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${document ? 'bg-emerald-50 text-emerald-500 border-emerald-100' : 'bg-gray-50 text-gray-300 border-gray-100'}`}>
                                                    <CheckCircle2 className="w-4 h-4" />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="mt-12 pt-8 border-t border-gray-100 flex justify-end gap-3">
                            <Button variant="secondary" onClick={onBack} className="font-black uppercase tracking-widest text-[10px] px-8 h-12">Discard</Button>
                            <Button icon={Save} onClick={handleSave} className="px-10 h-12 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-[#6F4BFF]/20">Save Profile Updates</Button>
                        </div>
                    </Card>
                </div>
            </main>

            <Modal isOpen={!!previewDoc} onClose={() => setPreviewDoc(null)} title="Document Details">
                {previewDoc && (
                    <div className="space-y-4">
                        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Document</p>
                            <p className="text-lg font-black text-gray-900 mt-1">{previewDoc.title}</p>
                        </div>
                        <div className="rounded-xl border border-gray-100 bg-white p-4">
                            <p className="font-black text-gray-900 break-words">{previewDoc.fileName}</p>
                            <p className="text-sm font-bold text-gray-500 mt-2">{previewDoc.fileType} - {Math.ceil((previewDoc.size || 0) / 1024)} KB</p>
                            <p className="text-xs font-bold text-gray-400 mt-2">Uploaded: {previewDoc.uploadedAt}</p>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

const UserFormFields = ({ formState, setFormState, includeStatus = false }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Full Name</label>
            <input
                type="text"
                required
                value={formState.name}
                onChange={(event) => setFormState({ ...formState, name: event.target.value })}
                className="w-full border border-gray-200 rounded-xl p-3.5 outline-none focus:ring-2 focus:ring-[#6F4BFF]/20 focus:border-[#6F4BFF] font-black text-gray-900 bg-gray-50"
            />
        </div>
        <div>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Mobile Number</label>
            <input
                type="tel"
                required
                value={formState.phone}
                onChange={(event) => setFormState({ ...formState, phone: event.target.value })}
                className="w-full border border-gray-200 rounded-xl p-3.5 outline-none focus:ring-2 focus:ring-[#6F4BFF]/20 focus:border-[#6F4BFF] font-black text-gray-900 bg-gray-50"
            />
        </div>
        <div>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">User Type</label>
            <select
                value={formState.type}
                onChange={(event) => setFormState({ ...formState, type: event.target.value })}
                className="w-full border border-gray-200 rounded-xl p-3.5 outline-none focus:ring-2 focus:ring-[#6F4BFF]/20 focus:border-[#6F4BFF] font-black text-gray-900 bg-gray-50"
            >
                <option value="Sales_officer">Sales Officer</option>
                <option value="Field_officer">Field Officer</option>
                <option value="Broker">Broker</option>
            </select>
        </div>
        <div>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Document Status</label>
            <select
                value={formState.docStatus}
                onChange={(event) => setFormState({ ...formState, docStatus: event.target.value })}
                className="w-full border border-gray-200 rounded-xl p-3.5 outline-none focus:ring-2 focus:ring-[#6F4BFF]/20 focus:border-[#6F4BFF] font-black text-gray-900 bg-gray-50"
            >
                <option>Pending</option>
                <option>Approved</option>
                <option>Rejected</option>
            </select>
        </div>
        {includeStatus && (
            <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Account Status</label>
                <select
                    value={formState.status}
                    onChange={(event) => setFormState({ ...formState, status: event.target.value })}
                    className="w-full border border-gray-200 rounded-xl p-3.5 outline-none focus:ring-2 focus:ring-[#6F4BFF]/20 focus:border-[#6F4BFF] font-black text-gray-900 bg-gray-50"
                >
                    <option>Active</option>
                    <option>Suspended</option>
                </select>
            </div>
        )}
    </div>
);

export default UserList;
