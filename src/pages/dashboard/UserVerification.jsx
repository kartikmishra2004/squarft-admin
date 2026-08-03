import { useCallback, useEffect, useState } from 'react';
import {
    Search, Eye, CheckCircle2, XCircle, FileCheck, FileText,
    ChevronLeft, ChevronRight, Loader2, Smartphone, Clock,
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Header from '../../components/layout/Header';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import {
    getPendingVerifications,
    approveVerificationDocument,
    rejectVerificationDocument,
} from '../../services/userVerificationService';

const documentTypeLabels = {
    profile_photo: 'Profile Photo',
    aadhaar_front: 'Aadhaar Card (Front)',
    aadhaar_back: 'Aadhaar Card (Back)',
    pan_card: 'PAN Card',
    driving_license_front: 'Driving License (Front)',
    driving_license_back: 'Driving License (Back)',
    passport: 'Passport',
};

const formatDocType = (type) =>
    documentTypeLabels[type] || String(type || '').replace(/_/g, ' ');

const formatDate = (value) => {
    if (!value) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

const isImageFile = (fileName = '') => /\.(jpe?g|png)$/i.test(fileName);

const UserVerification = () => {
    const [items, setItems] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionLoadingId, setActionLoadingId] = useState(null);

    const [previewDoc, setPreviewDoc] = useState(null);
    const [rejectTarget, setRejectTarget] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [rejectError, setRejectError] = useState('');

    const fetchPending = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const result = await getPendingVerifications({ page, limit: 10, sort: 'oldest_first' });
            setItems(result.items);
            setPagination(result.pagination);
        } catch (err) {
            setError(err?.message || 'Failed to load pending verifications.');
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => {
        fetchPending();
    }, [fetchPending]);

    const handleApprove = async (doc) => {
        setActionLoadingId(doc.document_id);
        setError('');
        try {
            await approveVerificationDocument(doc.document_id);
            await fetchPending();
        } catch (err) {
            setError(err?.message || 'Failed to approve document.');
        } finally {
            setActionLoadingId(null);
        }
    };

    const openRejectModal = (doc) => {
        setRejectTarget(doc);
        setRejectionReason('');
        setRejectError('');
    };

    const handleReject = async () => {
        if (!rejectTarget) return;
        if (!rejectionReason.trim()) {
            setRejectError('Rejection reason is required.');
            return;
        }
        setActionLoadingId(rejectTarget.document_id);
        setRejectError('');
        try {
            await rejectVerificationDocument(rejectTarget.document_id, rejectionReason.trim());
            setRejectTarget(null);
            await fetchPending();
        } catch (err) {
            setRejectError(err?.message || 'Failed to reject document.');
        } finally {
            setActionLoadingId(null);
        }
    };

    return (
        <div className="flex-1 flex flex-col h-full relative bg-[#F5F6FA] font-sans text-gray-900">
            <Header title="Consumer ID Verification" />

            <main className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth">
                <div className="max-w-[1600px] mx-auto space-y-6">
                    <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Consumer ID verification</h2>
                            <p className="text-sm text-gray-500 mt-1">Review identity documents uploaded by consumer app users awaiting KYC approval.</p>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm font-bold px-4 py-3 rounded-xl flex justify-between items-center">
                            {error}
                            <button onClick={() => setError('')}><XCircle className="w-4 h-4" /></button>
                        </div>
                    )}

                    <Card noPadding className="overflow-hidden border-gray-100 shadow-xl shadow-gray-200/50">
                        {loading ? (
                            <div className="flex items-center justify-center py-20 gap-3 text-gray-400">
                                <Loader2 className="w-6 h-6 animate-spin" />
                                <span className="font-bold text-sm">Loading pending verifications...</span>
                            </div>
                        ) : (
                            <Table
                                headers={['USER', 'DOCUMENT TYPE', 'UPLOADED', 'STATUS', 'ACTION']}
                                data={items}
                                renderRow={(row) => {
                                    const isBusy = actionLoadingId === row.document_id;
                                    return (
                                        <tr key={row.document_id} className="hover:bg-gray-50/80 transition-all border-b border-gray-100 last:border-0">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-gray-100 to-gray-200 border border-gray-200 flex items-center justify-center shrink-0 shadow-inner">
                                                        <span className="font-black text-gray-400 text-sm uppercase">{(row.user_name || '?').charAt(0)}</span>
                                                    </div>
                                                    <div>
                                                        <span className="font-black text-gray-900 tracking-tight">{row.user_name || 'Unnamed User'}</span>
                                                        <p className="text-[11px] font-bold text-gray-400 flex items-center gap-1.5 mt-0.5">
                                                            <Smartphone className="w-3 h-3" /> {row.user_phone || '-'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-2">
                                                    <FileText className="w-3.5 h-3.5 text-[#6F4BFF]" />
                                                    <span className="text-[11px] font-black text-gray-600 uppercase tracking-widest">{formatDocType(row.document_type)}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div>
                                                    <span className="text-sm font-bold text-gray-700">{formatDate(row.uploaded_at)}</span>
                                                    <p className="text-[11px] font-bold text-gray-400 flex items-center gap-1 mt-0.5">
                                                        <Clock className="w-3 h-3" /> {row.days_pending === 0 ? 'Today' : `${row.days_pending} day${row.days_pending === 1 ? '' : 's'} pending`}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <Badge variant="yellow">Pending</Badge>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => setPreviewDoc(row)}
                                                        className="w-9 h-9 rounded-xl bg-gray-50 text-gray-400 flex items-center justify-center hover:bg-gray-100 hover:text-gray-900 transition-all border border-gray-100"
                                                        title="Preview document"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleApprove(row)}
                                                        disabled={isBusy}
                                                        className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all border border-emerald-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                                        title="Approve document"
                                                    >
                                                        {isBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                                    </button>
                                                    <button
                                                        onClick={() => openRejectModal(row)}
                                                        disabled={isBusy}
                                                        className="w-9 h-9 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all border border-rose-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                                        title="Reject document"
                                                    >
                                                        <XCircle className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                }}
                            />
                        )}
                        {!loading && items.length === 0 && (
                            <div className="px-6 py-16 text-center">
                                <FileCheck className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                                <p className="text-gray-500 font-bold text-lg">No documents pending review</p>
                                <p className="text-gray-400 text-sm mt-1">All consumer ID documents have been reviewed.</p>
                            </div>
                        )}
                    </Card>

                    {pagination && pagination.total_pages > 1 && (
                        <div className="flex items-center justify-between px-1">
                            <p className="text-sm text-gray-500 font-bold">
                                Showing {((page - 1) * pagination.limit) + 1}–{Math.min(page * pagination.limit, pagination.total)} of {pagination.total} pending documents
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

            {/* Document Preview Modal */}
            <Modal isOpen={!!previewDoc} onClose={() => setPreviewDoc(null)} title="Document Preview" size="lg">
                {previewDoc && (
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm font-black text-gray-700">{formatDocType(previewDoc.document_type)}</p>
                            <p className="text-xs font-bold text-gray-400 mt-1">{previewDoc.user_name} &middot; {previewDoc.user_phone}</p>
                        </div>
                        {isImageFile(previewDoc.file_name) ? (
                            <img src={previewDoc.file_url} alt={previewDoc.document_type} className="w-full rounded-xl border border-gray-100" />
                        ) : (
                            <a
                                href={previewDoc.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 py-10 bg-gray-50 rounded-xl border border-gray-100 text-[#6F4BFF] font-black text-sm hover:bg-gray-100 transition-colors"
                            >
                                <FileText className="w-5 h-5" /> Open document in new tab
                            </a>
                        )}
                        <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                            <Button
                                variant="danger"
                                icon={XCircle}
                                onClick={() => { setPreviewDoc(null); openRejectModal(previewDoc); }}
                            >
                                Reject
                            </Button>
                            <Button
                                variant="success"
                                icon={CheckCircle2}
                                onClick={() => { setPreviewDoc(null); handleApprove(previewDoc); }}
                            >
                                Approve
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Reject Reason Modal */}
            <Modal isOpen={!!rejectTarget} onClose={() => setRejectTarget(null)} title="Reject Document">
                {rejectTarget && (
                    <div className="space-y-5">
                        <p className="text-sm font-bold text-gray-700">
                            Reject <span className="text-gray-900">{formatDocType(rejectTarget.document_type)}</span> for <span className="text-gray-900">{rejectTarget.user_name}</span>?
                        </p>
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Rejection Reason (required)</label>
                            <textarea
                                rows={3}
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                placeholder="e.g. Document image is blurry, please re-upload a clear photo."
                                className="w-full border border-gray-200 rounded-xl p-3.5 outline-none focus:ring-2 focus:ring-[#6F4BFF]/20 focus:border-[#6F4BFF] font-bold text-gray-900 bg-gray-50 resize-none"
                            />
                        </div>
                        {rejectError && <p className="text-rose-500 text-sm font-bold">{rejectError}</p>}
                        <div className="flex justify-end gap-3">
                            <Button variant="secondary" onClick={() => setRejectTarget(null)}>Cancel</Button>
                            <Button
                                variant="danger"
                                icon={actionLoadingId === rejectTarget.document_id ? Loader2 : XCircle}
                                onClick={handleReject}
                                disabled={actionLoadingId === rejectTarget.document_id}
                            >
                                {actionLoadingId === rejectTarget.document_id ? 'Rejecting...' : 'Reject Document'}
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default UserVerification;
