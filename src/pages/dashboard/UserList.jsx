import { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    Search, Plus, Edit2, Trash2, Eye, CheckCircle2, XCircle,
    Image as ImageIcon, Save, Shield, Smartphone, FileCheck, Upload, UserPlus,
    ChevronLeft, ChevronRight, Loader2, Send, MessageSquarePlus
} from 'lucide-react';
import {
    setSelectedUser,
    loadAppUsers,
    loadUserDetails,
    saveUserVerification,
    addAppUser,
    removeAppUser,
    updateUserDocument,
    clearError,
} from '../../store/usersSlice';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Header from '../../components/layout/Header';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import { useDialog } from '../../components/ui/Dialog';
import { uploadCommonFile } from '../../services/commonService';
import { requestUserDocument } from '../../services/userAppService';

const emptyUserForm = {
    full_name: '',
    user_type: 'Sales Officer',
    mobile_number: '',
    document_status: 'Pending',
};

const documentFields = [
    { key: 'aadhaar_front', title: 'Aadhaar Card (Front)' },
    { key: 'pan_card', title: 'PAN Card' },
    { key: 'profile_photo', title: 'Profile Photo / Selfie' },
];

// Reuses the same KYC document-type vocabulary as the Consumer ID
// Verification screen (documentTypeLabels in UserVerification.jsx), so the
// "Request Document" type dropdown stays consistent with what the app
// already recognizes elsewhere.
const requestableDocumentTypes = [
    { value: 'aadhaar_front', label: 'Aadhaar Card (Front)' },
    { value: 'aadhaar_back', label: 'Aadhaar Card (Back)' },
    { value: 'pan_card', label: 'PAN Card' },
    { value: 'driving_license_front', label: 'Driving License (Front)' },
    { value: 'driving_license_back', label: 'Driving License (Back)' },
    { value: 'passport', label: 'Passport' },
    { value: 'profile_photo', label: 'Profile Photo' },
];

const getDocBadgeVariant = (status) => {
    if (!status) return 'yellow';
    const s = status.toLowerCase();
    if (s === 'approved' || s === 'verified') return 'green';
    if (s === 'pending') return 'yellow';
    return 'red';
};

// ─── Main List View ────────────────────────────────────────────────────────────

const UserList = () => {
    const dispatch = useDispatch();
    const { users, selectedUser, pagination, loading, error } = useSelector((s) => s.users);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('All Users');
    const [filterDocStatus, setFilterDocStatus] = useState('All Status');
    const [page, setPage] = useState(1);
    const [isAddUserOpen, setIsAddUserOpen] = useState(false);
    const [newUserForm, setNewUserForm] = useState(emptyUserForm);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [formError, setFormError] = useState('');
    const [saving, setSaving] = useState(false);

    const fetchUsers = useCallback(() => {
        const params = { page, limit: 10 };
        if (searchTerm.trim()) params.search = searchTerm.trim();
        if (filterType !== 'All Users') params.role = filterType;
        if (filterDocStatus !== 'All Status') params.status = filterDocStatus;
        dispatch(loadAppUsers(params));
    }, [dispatch, page, searchTerm, filterType, filterDocStatus]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // reset to page 1 when filters change
    useEffect(() => {
        setPage(1);
    }, [searchTerm, filterType, filterDocStatus]);

    const handleCreateUser = async (e) => {
        e.preventDefault();
        setFormError('');
        setSaving(true);
        try {
            await dispatch(addAppUser(newUserForm)).unwrap();
            setNewUserForm(emptyUserForm);
            setIsAddUserOpen(false);
            fetchUsers();
        } catch (err) {
            setFormError(err || 'Failed to create user.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        await dispatch(removeAppUser(deleteTarget.id));
        setDeleteTarget(null);
        fetchUsers();
    };

    const handleOpenEdit = (row) => {
        dispatch(setSelectedUser(row));
        dispatch(loadUserDetails(row.id));
    };

    if (selectedUser) {
        return <UserEditView onBack={() => { dispatch(setSelectedUser(null)); fetchUsers(); }} />;
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
                            <select
                                className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-black bg-white focus:ring-2 focus:ring-[#6F4BFF]/20 outline-none shadow-sm cursor-pointer"
                                value={filterDocStatus}
                                onChange={(e) => setFilterDocStatus(e.target.value)}
                            >
                                <option>All Status</option>
                                <option>Approved</option>
                                <option>Pending</option>
                                <option>Rejected</option>
                            </select>
                            <Button icon={Plus} onClick={() => { setFormError(''); setIsAddUserOpen(true); }} className="shadow-md shadow-[#6F4BFF]/20">Add User</Button>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm font-bold px-4 py-3 rounded-xl flex justify-between items-center">
                            {error}
                            <button onClick={() => dispatch(clearError())}><XCircle className="w-4 h-4" /></button>
                        </div>
                    )}

                    <Card noPadding className="overflow-hidden border-gray-100 shadow-xl shadow-gray-200/50">
                        {loading ? (
                            <div className="flex items-center justify-center py-20 gap-3 text-gray-400">
                                <Loader2 className="w-6 h-6 animate-spin" />
                                <span className="font-bold text-sm">Loading users...</span>
                            </div>
                        ) : (
                            <Table
                                headers={['NAME', 'USER TYPE', 'MOBILE', 'DOCUMENT STATUS', 'ACTION']}
                                data={users}
                                renderRow={(row) => (
                                    <tr key={row.id} className="hover:bg-gray-50/80 transition-all border-b border-gray-100 last:border-0">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-linear-to-br from-gray-100 to-gray-200 border border-gray-200 flex items-center justify-center shrink-0 shadow-inner">
                                                    <span className="font-black text-gray-400 text-sm uppercase">{(row.name || '?').charAt(0)}</span>
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
                                                <span className="text-[11px] font-black text-gray-500 uppercase tracking-widest">{(row.role || '').replace('_', ' ')}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2">
                                                <Smartphone className="w-3.5 h-3.5 text-gray-400" />
                                                <span className="text-sm font-black text-gray-700">{row.mobile}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <Badge variant={getDocBadgeVariant(row.document_status)}>{row.document_status || 'Pending'}</Badge>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleOpenEdit(row)}
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
                                                    onClick={() => handleOpenEdit(row)}
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
                        )}
                        {!loading && users.length === 0 && (
                            <div className="px-6 py-16 text-center">
                                <Search className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                                <p className="text-gray-500 font-bold text-lg">No users found</p>
                                <p className="text-gray-400 text-sm mt-1">Try changing search or filters.</p>
                            </div>
                        )}
                    </Card>

                    {pagination && pagination.total_pages > 1 && (
                        <div className="flex items-center justify-between px-1">
                            <p className="text-sm text-gray-500 font-bold">
                                Showing {((page - 1) * pagination.limit) + 1}–{Math.min(page * pagination.limit, pagination.total)} of {pagination.total} users
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    disabled={page === 1}
                                    onClick={() => setPage((p) => p - 1)}
                                    className="w-9 h-9 rounded-xl border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <span className="text-sm font-black text-gray-700 px-2">{page} / {pagination.total_pages}</span>
                                <button
                                    disabled={page === pagination.total_pages}
                                    onClick={() => setPage((p) => p + 1)}
                                    className="w-9 h-9 rounded-xl border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Add User Modal */}
            <Modal isOpen={isAddUserOpen} onClose={() => setIsAddUserOpen(false)} title="Add New User">
                <form onSubmit={handleCreateUser} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Full Name</label>
                            <input type="text" required value={newUserForm.full_name}
                                onChange={(e) => setNewUserForm({ ...newUserForm, full_name: e.target.value })}
                                className="w-full border border-gray-200 rounded-xl p-3.5 outline-none focus:ring-2 focus:ring-[#6F4BFF]/20 focus:border-[#6F4BFF] font-black text-gray-900 bg-gray-50" />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Mobile Number</label>
                            <input type="tel" required value={newUserForm.mobile_number}
                                onChange={(e) => setNewUserForm({ ...newUserForm, mobile_number: e.target.value })}
                                className="w-full border border-gray-200 rounded-xl p-3.5 outline-none focus:ring-2 focus:ring-[#6F4BFF]/20 focus:border-[#6F4BFF] font-black text-gray-900 bg-gray-50" />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">User Type</label>
                            <select value={newUserForm.user_type}
                                onChange={(e) => setNewUserForm({ ...newUserForm, user_type: e.target.value })}
                                className="w-full border border-gray-200 rounded-xl p-3.5 outline-none focus:ring-2 focus:ring-[#6F4BFF]/20 focus:border-[#6F4BFF] font-black text-gray-900 bg-gray-50">
                                <option>Sales Officer</option>
                                <option>Field Officer</option>
                                <option>Broker</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Document Status</label>
                            <select value={newUserForm.document_status}
                                onChange={(e) => setNewUserForm({ ...newUserForm, document_status: e.target.value })}
                                className="w-full border border-gray-200 rounded-xl p-3.5 outline-none focus:ring-2 focus:ring-[#6F4BFF]/20 focus:border-[#6F4BFF] font-black text-gray-900 bg-gray-50">
                                <option>Pending</option>
                                <option>Approved</option>
                                <option>Rejected</option>
                            </select>
                        </div>
                    </div>
                    {formError && <p className="text-rose-500 text-sm font-bold">{formError}</p>}
                    <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                        <Button variant="secondary" type="button" onClick={() => setIsAddUserOpen(false)}>Cancel</Button>
                        <Button type="submit" icon={saving ? Loader2 : UserPlus} disabled={saving}>
                            {saving ? 'Creating...' : 'Create User'}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirm Modal */}
            <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete User">
                {deleteTarget && (
                    <div className="space-y-5">
                        <p className="text-sm font-bold text-gray-700">Delete <span className="text-gray-900">{deleteTarget.name}</span>? This action cannot be undone.</p>
                        <div className="flex justify-end gap-3">
                            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>Cancel</Button>
                            <Button variant="danger" icon={Trash2} onClick={handleDelete}>Delete</Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

// ─── Edit / Verify View ───────────────────────────────────────────────────────

const UserEditView = ({ onBack }) => {
    const dispatch = useDispatch();
    const { confirm, alert } = useDialog();
    const { selectedUserDetails, detailLoading, saving } = useSelector((s) => s.users);
    const fileInputRefs = useRef({});
    const [uploadingDocKey, setUploadingDocKey] = useState(null);
    const [uploadError, setUploadError] = useState('');
    const [previewDoc, setPreviewDoc] = useState(null);
    const [saveError, setSaveError] = useState('');

    // Request Document (QA spec Part F, item 6) — see TODO(backend) in
    // services/userAppService.js: the endpoint this calls does not exist yet.
    const [isRequestDocOpen, setIsRequestDocOpen] = useState(false);
    const [requestDocType, setRequestDocType] = useState(requestableDocumentTypes[0].value);
    const [requestDocNote, setRequestDocNote] = useState('');
    const [requestDocSending, setRequestDocSending] = useState(false);
    const [requestDocError, setRequestDocError] = useState('');

    const profile = selectedUserDetails?.profile || {};
    const documents = selectedUserDetails?.documents || {};

    const [formState, setFormState] = useState(null);

    useEffect(() => {
        if (selectedUserDetails) {
            setFormState({
                first_name: profile.first_name || '',
                last_name: profile.last_name || '',
                phone: profile.phone || '',
                role: profile.role || '',
                document_status: profile.document_status || 'pending',
                account_status: profile.account_status || 'active',
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedUserDetails]);

    const handleSave = async () => {
        if (!formState) return;
        setSaveError('');
        try {
            await dispatch(saveUserVerification({
                userId: profile.id,
                body: { ...formState, documents: [] },
            })).unwrap();
            onBack();
        } catch (err) {
            setSaveError(err || 'Failed to save.');
        }
    };

    const handleStatusUpdate = (status) => {
        setFormState((prev) => ({ ...prev, document_status: status.toLowerCase() }));
    };

    const handleDocumentUpload = async (docKey, file) => {
        if (!file) return;
        setUploadingDocKey(docKey);
        setUploadError('');
        try {
            // Step 1: upload file to storage
            const uploadRes = await uploadCommonFile({
                file,
                module: 'users',
                metadata: { userId: profile.id, documentType: docKey },
            });

            // Step 2: extract URL — handle multiple response shapes
            const fileUrl =
                uploadRes?.url ||
                uploadRes?.file_url ||
                uploadRes?.file?.url ||
                uploadRes?.data?.url ||
                uploadRes?.data?.file_url ||
                '';

            if (!fileUrl) {
                setUploadError(`Upload succeeded but no URL returned. Check backend response.`);
                return;
            }

            // Step 3: save doc URL to backend
            await dispatch(saveUserVerification({
                userId: profile.id,
                body: { documents: [{ type: docKey, url: fileUrl }] },
            })).unwrap();

            // Step 4: update Redux state so image shows immediately
            dispatch(updateUserDocument({ docKey, url: fileUrl }));
        } catch (err) {
            const msg = err?.message || err || 'Upload failed. Please try again.';
            setUploadError(msg);
        } finally {
            setUploadingDocKey(null);
            if (fileInputRefs.current[docKey]) fileInputRefs.current[docKey].value = '';
        }
    };

    const openRequestDocModal = () => {
        setRequestDocType(requestableDocumentTypes[0].value);
        setRequestDocNote('');
        setRequestDocError('');
        setIsRequestDocOpen(true);
    };

    const handleSendDocumentRequest = async () => {
        setRequestDocSending(true);
        setRequestDocError('');
        try {
            await requestUserDocument(profile.id, requestDocType, requestDocNote.trim());
            setIsRequestDocOpen(false);
            await alert('Document request sent to the user.', { title: 'Request Sent', variant: 'info' });
        } catch (err) {
            // Do NOT fake success here — the backend endpoint for document
            // requests doesn't exist yet (see TODO(backend) in userAppService.js).
            // Surface the real failure so it's obvious this is pending backend work.
            setRequestDocError(
                err?.message || err || 'Failed to send document request. The backend endpoint for document requests has not been built yet.'
            );
        } finally {
            setRequestDocSending(false);
        }
    };

    if (detailLoading || !formState) {
        return (
            <div className="flex-1 flex flex-col h-full relative bg-[#F5F6FA]">
                <Header title="User Verification" showBack onBack={onBack} />
                <div className="flex-1 flex items-center justify-center gap-3 text-gray-400">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span className="font-bold text-sm">Loading user details...</span>
                </div>
            </div>
        );
    }

    const docStatus = formState.document_status?.toLowerCase();

    // SQF-KYC-023 client-side safeguard: the server now rejects an approval
    // that's missing mandatory documents (400), but this UI used to let the
    // "Approve Account" button be clicked regardless — an admin could get
    // all the way to a failed save with no clue why, or (before the backend
    // fix) have the approval silently go through with docs still showing
    // "No document uploaded". Mirror the same three-document invariant here
    // as a UX safeguard only; the real enforcement is server-side.
    const MANDATORY_DOC_KEYS = ['profile_photo', 'aadhaar_front', 'pan_card'];
    const missingMandatoryDocs = MANDATORY_DOC_KEYS.filter((key) => !documents?.[key]);
    const canApprove = missingMandatoryDocs.length === 0;

    const handleDeleteUser = async () => {
        if (await confirm(`Are you sure you want to delete ${profile.full_name}?`, { title: 'Delete User', confirmText: 'Delete', danger: true })) {
            try {
                await dispatch(removeAppUser(profile.id)).unwrap();
                onBack();
            } catch (err) {
                setSaveError(err || 'Failed to delete user.');
            }
        }
    };

    return (
        <div className="flex-1 flex flex-col h-full relative bg-[#F5F6FA] font-sans text-gray-900">
            <Header title="User Verification" showBack onBack={onBack} />

            <main className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth">
                <div className="max-w-[1200px] mx-auto space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 rounded-2xl bg-[#6F4BFF] text-white flex items-center justify-center text-2xl font-black shadow-xl shadow-[#6F4BFF]/20">
                                {(profile.full_name || '?').charAt(0)}
                            </div>
                            <div>
                                <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase">{profile.full_name}</h2>
                                <p className="text-sm text-gray-500 mt-1 font-bold flex items-center gap-2 uppercase tracking-widest">
                                    <Smartphone className="w-4 h-4 text-[#6F4BFF]" /> {profile.phone} <span className="text-gray-300">|</span> <span className="text-gray-900">{(profile.role || '').replace('_', ' ')}</span>
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3 bg-white p-2 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100">
                            {(docStatus === 'approved' || docStatus === 'verified') ? (
                                <>
                                    <div className="flex items-center gap-2 px-6 py-2 bg-emerald-50 text-emerald-700 font-black text-[10px] uppercase tracking-widest rounded-xl border border-emerald-200">
                                        <CheckCircle2 className="w-4 h-4" /> Verified & Active
                                    </div>
                                    <Button variant="danger" icon={Trash2} onClick={handleDeleteUser} className="font-black uppercase tracking-widest text-[10px] h-11 px-6 bg-rose-500 hover:bg-rose-600 text-white">Delete User</Button>
                                </>
                            ) : (
                                <>
                                    <Button
                                        variant="success"
                                        icon={CheckCircle2}
                                        onClick={() => handleStatusUpdate('approved')}
                                        disabled={!canApprove}
                                        title={canApprove ? undefined : `Missing mandatory document(s): ${missingMandatoryDocs.join(', ')}`}
                                        className={`font-black uppercase tracking-widest text-[10px] h-11 px-6 ${!canApprove ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        Approve Account
                                    </Button>
                                    {docStatus !== 'rejected' && (
                                        <Button variant="danger" icon={XCircle} onClick={() => handleStatusUpdate('rejected')} className="font-black uppercase tracking-widest text-[10px] h-11 px-6 bg-rose-500 hover:bg-rose-600 text-white">Reject Details</Button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                    {!canApprove && docStatus !== 'approved' && docStatus !== 'verified' && (
                        <div className="flex items-center gap-2 px-4 py-3 bg-amber-50 text-amber-800 text-xs font-bold rounded-xl border border-amber-200">
                            <XCircle className="w-4 h-4 shrink-0" />
                            Cannot approve yet — missing mandatory document(s): {missingMandatoryDocs.map((k) => k.replace('_', ' ')).join(', ')}.
                        </div>
                    )}

                    <Card className="p-8 border-gray-100 shadow-xl shadow-gray-200/50">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">First Name</label>
                                <input type="text" value={formState.first_name}
                                    onChange={(e) => setFormState({ ...formState, first_name: e.target.value })}
                                    className="w-full border border-gray-200 rounded-xl p-3.5 outline-none focus:ring-2 focus:ring-[#6F4BFF]/20 focus:border-[#6F4BFF] font-black text-gray-900 bg-gray-50" />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Last Name</label>
                                <input type="text" value={formState.last_name}
                                    onChange={(e) => setFormState({ ...formState, last_name: e.target.value })}
                                    className="w-full border border-gray-200 rounded-xl p-3.5 outline-none focus:ring-2 focus:ring-[#6F4BFF]/20 focus:border-[#6F4BFF] font-black text-gray-900 bg-gray-50" />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Mobile Number</label>
                                <input type="tel" value={formState.phone}
                                    onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                                    className="w-full border border-gray-200 rounded-xl p-3.5 outline-none focus:ring-2 focus:ring-[#6F4BFF]/20 focus:border-[#6F4BFF] font-black text-gray-900 bg-gray-50" />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">User Type</label>
                                <select value={formState.role}
                                    onChange={(e) => setFormState({ ...formState, role: e.target.value })}
                                    className="w-full border border-gray-200 rounded-xl p-3.5 outline-none focus:ring-2 focus:ring-[#6F4BFF]/20 focus:border-[#6F4BFF] font-black text-gray-900 bg-gray-50">
                                    <option value="sales_officer">Sales Officer</option>
                                    <option value="field_officer">Field Officer</option>
                                    <option value="broker">Broker</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Document Status</label>
                                <select value={formState.document_status === 'verified' ? 'approved' : formState.document_status}
                                    onChange={(e) => setFormState({ ...formState, document_status: e.target.value })}
                                    className="w-full border border-gray-200 rounded-xl p-3.5 outline-none focus:ring-2 focus:ring-[#6F4BFF]/20 focus:border-[#6F4BFF] font-black text-gray-900 bg-gray-50">
                                    <option value="pending">Pending</option>
                                    <option value="approved">Approved</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Account Status</label>
                                <select value={formState.account_status}
                                    onChange={(e) => setFormState({ ...formState, account_status: e.target.value })}
                                    className="w-full border border-gray-200 rounded-xl p-3.5 outline-none focus:ring-2 focus:ring-[#6F4BFF]/20 focus:border-[#6F4BFF] font-black text-gray-900 bg-gray-50">
                                    <option value="active">Active</option>
                                    <option value="suspended">Suspended</option>
                                </select>
                            </div>
                        </div>

                        <div className="border-t border-gray-100 pt-10 mt-10">
                            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                                <h3 className="text-lg font-black text-gray-800 uppercase tracking-tight flex items-center gap-3">
                                    <FileCheck className="w-5 h-5 text-[#6F4BFF]" /> KYC Documents & Verification
                                </h3>
                                <Button
                                    variant="secondary"
                                    icon={MessageSquarePlus}
                                    onClick={openRequestDocModal}
                                    className="font-black uppercase tracking-widest text-[10px] h-10 px-5"
                                >
                                    Request Document
                                </Button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {documentFields.map((doc) => {
                                    const fileUrl = documents[doc.key];
                                    return (
                                        <div key={doc.key} className="border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-xl shadow-gray-200/20 flex flex-col group">
                                            <div className="flex justify-between items-center p-4 border-b border-gray-50 bg-gray-50/30">
                                                <h4 className="font-black text-gray-800 text-[10px] uppercase tracking-widest">{doc.title}</h4>
                                            </div>
                                            <div className="aspect-[4/3] bg-gray-50 relative flex items-center justify-center overflow-hidden">
                                                {fileUrl ? (
                                                    <img src={fileUrl} alt={doc.title} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="text-center px-5 z-10">
                                                        <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                                        <p className="text-xs font-black text-gray-400">No document uploaded</p>
                                                    </div>
                                                )}
                                                {fileUrl && (
                                                    <button
                                                        onClick={() => setPreviewDoc({ title: doc.title, url: fileUrl })}
                                                        className="absolute inset-0 bg-gray-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20 cursor-pointer backdrop-blur-[2px]"
                                                    >
                                                        <span className="text-white font-black text-[10px] uppercase tracking-widest flex items-center gap-2 bg-gray-900/60 px-4 py-2 rounded-xl"><Eye className="w-4 h-4" /> Preview</span>
                                                    </button>
                                                )}
                                            </div>
                                            <div className="p-4 border-t border-gray-50">
                                                <input ref={(n) => { fileInputRefs.current[doc.key] = n; }} type="file" className="hidden"
                                                    onChange={(e) => handleDocumentUpload(doc.key, e.target.files?.[0])} />
                                                <button
                                                    onClick={() => fileInputRefs.current[doc.key]?.click()}
                                                    disabled={uploadingDocKey === doc.key}
                                                    className="w-full py-2.5 bg-white text-gray-700 text-[10px] font-black rounded-xl hover:bg-gray-50 transition-colors border border-gray-200 uppercase tracking-widest flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
                                                >
                                                    <Upload className="w-3.5 h-3.5" />
                                                    {uploadingDocKey === doc.key ? 'Uploading...' : fileUrl ? 'Replace' : 'Upload'}
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {saveError && <p className="mt-4 text-rose-500 text-sm font-bold">{saveError}</p>}
                        {uploadError && (
                            <div className="mt-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm font-bold px-4 py-3 rounded-xl flex justify-between items-center">
                                <span>Document upload failed: {uploadError}</span>
                                <button onClick={() => setUploadError('')}><XCircle className="w-4 h-4" /></button>
                            </div>
                        )}

                        <div className="mt-12 pt-8 border-t border-gray-100 flex justify-end gap-3">
                            <Button variant="secondary" onClick={onBack} className="font-black uppercase tracking-widest text-[10px] px-8 h-12">Discard</Button>
                            <Button icon={saving ? Loader2 : Save} onClick={handleSave} disabled={saving} className="px-10 h-12 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-[#6F4BFF]/20">
                                {saving ? 'Saving...' : 'Save Profile Updates'}
                            </Button>
                        </div>
                    </Card>
                </div>
            </main>

            <Modal isOpen={!!previewDoc} onClose={() => setPreviewDoc(null)} title="Document Preview">
                {previewDoc && (
                    <div className="space-y-4">
                        <p className="text-sm font-black text-gray-700">{previewDoc.title}</p>
                        <img src={previewDoc.url} alt={previewDoc.title} className="w-full rounded-xl border border-gray-100" />
                    </div>
                )}
            </Modal>

            {/* Request Document Modal — see TODO(backend) in services/userAppService.js:
                the endpoint this Send button calls has not been built yet. */}
            <Modal isOpen={isRequestDocOpen} onClose={() => setIsRequestDocOpen(false)} title="Request Document">
                <div className="space-y-5">
                    <p className="text-sm font-bold text-gray-700">
                        Ask <span className="text-gray-900">{profile.full_name}</span> to upload a document from their app.
                    </p>
                    <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Document Type</label>
                        <select
                            value={requestDocType}
                            onChange={(e) => setRequestDocType(e.target.value)}
                            className="w-full border border-gray-200 rounded-xl p-3.5 outline-none focus:ring-2 focus:ring-[#6F4BFF]/20 focus:border-[#6F4BFF] font-black text-gray-900 bg-gray-50"
                        >
                            {requestableDocumentTypes.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Note (optional)</label>
                        <textarea
                            rows={3}
                            value={requestDocNote}
                            onChange={(e) => setRequestDocNote(e.target.value)}
                            placeholder="e.g. Please re-upload a clearer photo of your PAN card."
                            className="w-full border border-gray-200 rounded-xl p-3.5 outline-none focus:ring-2 focus:ring-[#6F4BFF]/20 focus:border-[#6F4BFF] font-bold text-gray-900 bg-gray-50 resize-none"
                        />
                    </div>
                    {requestDocError && (
                        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm font-bold px-4 py-3 rounded-xl">
                            {requestDocError}
                        </div>
                    )}
                    <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                        <Button variant="secondary" onClick={() => setIsRequestDocOpen(false)}>Cancel</Button>
                        <Button
                            icon={requestDocSending ? Loader2 : Send}
                            onClick={handleSendDocumentRequest}
                            disabled={requestDocSending}
                        >
                            {requestDocSending ? 'Sending...' : 'Send Request'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default UserList;
