import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Crown, Eye, EyeOff, Loader2, Mail, Phone, Plus, ShieldCheck, UserCog } from 'lucide-react';
import Header from '../../components/layout/Header';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { useDialog } from '../../components/ui/Dialog';
import { fetchAdmins, createAdmin } from '../../services/adminService';
import { getBranches } from '../../store/branchesSlice';

const initialForm = {
    full_name: '',
    email: '',
    phone: '',
    password: '',
    branch_id: '',
};

const Admins = () => {
    const dispatch = useDispatch();
    const { alert } = useDialog();
    const branches = useSelector((state) => state.branches.branches);

    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form, setForm] = useState(initialForm);
    // SQF-SEC-020 fix: the password field below used to be `type="text"`
    // with no `name`/`autocomplete`, so it rendered the admin's new password
    // in plain view while typing and gave browsers/password managers no
    // signal about what the field was for. `showPassword` backs a manual
    // show/hide toggle so the field can stay masked by default without
    // losing the "let me check what I typed" convenience.
    const [showPassword, setShowPassword] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const loadAdmins = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await fetchAdmins();
            setAdmins(data);
        } catch (err) {
            setError(err?.message || 'Failed to load admins.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAdmins();
        dispatch(getBranches());
    }, [dispatch]);

    const handleFieldChange = (field, value) => {
        setForm((current) => ({ ...current, [field]: value }));
    };

    const validate = () => {
        const errors = {};
        if (!form.full_name.trim()) errors.full_name = 'Full name is required';
        if (!form.email.trim()) errors.email = 'Email is required';
        if (!/^\d{10}$/.test(form.phone.replace(/\D/g, ''))) errors.phone = 'Enter a valid 10-digit phone number';
        if (form.password.length < 8) errors.password = 'Password must be at least 8 characters';
        if (!form.branch_id) errors.branch_id = 'A branch is required — an admin must belong to exactly one branch';
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleCreate = async (event) => {
        event.preventDefault();
        if (!validate()) return;

        setSubmitting(true);
        try {
            await createAdmin({
                full_name: form.full_name.trim(),
                email: form.email.trim(),
                phone: form.phone.replace(/\D/g, ''),
                password: form.password,
                branch_id: form.branch_id,
            });
            setIsModalOpen(false);
            setForm(initialForm);
            setFormErrors({});
            await loadAdmins();
            await alert('Admin account created. Share the email and password with them directly.', { title: 'Admin Created', variant: 'info' });
        } catch (err) {
            await alert(err?.message || 'Failed to create admin.', { title: 'Creation Failed', variant: 'danger' });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden relative bg-[#F5F6FA] font-sans text-gray-900">
            <Header title="Admin Management" />

            <main className="flex-1 overflow-y-auto p-6 md:p-8 h-full scroll-smooth">
                <div className="max-w-[1400px] mx-auto flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Admins</h2>
                            <p className="text-gray-500 mt-1 font-medium text-sm">
                                Create and manage admin accounts. Each admin logs in with the email and password set here.
                            </p>
                        </div>
                        <Button icon={Plus} onClick={() => setIsModalOpen(true)}>
                            Create Admin
                        </Button>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="font-bold text-red-900 text-sm">{error}</p>
                        </div>
                    )}

                    <Card noPadding className="border-gray-200 shadow-md">
                        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-[#6F4BFF]/10 text-[#6F4BFF] flex items-center justify-center">
                                    <UserCog className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-black text-gray-900">Admin Accounts</h3>
                                    <p className="text-xs text-gray-500 font-semibold">{admins.length} admin{admins.length === 1 ? '' : 's'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[800px] text-left">
                                <thead className="bg-gray-50 text-[11px] uppercase tracking-[0.12em] text-gray-500">
                                    <tr>
                                        <th className="px-5 py-3 font-bold">Name</th>
                                        <th className="px-5 py-3 font-bold">Email</th>
                                        <th className="px-5 py-3 font-bold">Phone</th>
                                        <th className="px-5 py-3 font-bold">Branch</th>
                                        <th className="px-5 py-3 font-bold">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading && (
                                        <tr>
                                            <td colSpan={5} className="px-5 py-16 text-center">
                                                <Loader2 className="w-8 h-8 text-[#6F4BFF] animate-spin mx-auto mb-3" />
                                                <p className="text-sm font-bold text-gray-500">Loading admins...</p>
                                            </td>
                                        </tr>
                                    )}
                                    {!loading && admins.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-5 py-16 text-center">
                                                <ShieldCheck className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                                                <p className="text-sm font-bold text-gray-500">No admin accounts yet.</p>
                                            </td>
                                        </tr>
                                    )}
                                    {admins.map((admin) => {
                                        const isSuperAdmin = admin.role === 'super_admin';
                                        return (
                                            <tr
                                                key={admin.id}
                                                className={isSuperAdmin
                                                    ? 'border-t border-amber-200 bg-linear-to-r from-amber-50 via-amber-50/60 to-transparent hover:from-amber-100/80'
                                                    : 'border-t border-gray-100 hover:bg-gray-50/60'
                                                }
                                            >
                                                <td className="px-5 py-4 text-sm font-bold text-gray-900">
                                                    <span className="inline-flex items-center gap-2">
                                                        {isSuperAdmin && <Crown className="w-4 h-4 text-amber-500 shrink-0" />}
                                                        {admin.first_name} {admin.last_name}
                                                        {isSuperAdmin && (
                                                            <Badge variant="gradient" className="ml-1">Super Admin</Badge>
                                                        )}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4 text-sm text-gray-600">
                                                    <span className="inline-flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-gray-400" />{admin.email || '—'}</span>
                                                </td>
                                                <td className="px-5 py-4 text-sm text-gray-600">
                                                    <span className="inline-flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-gray-400" />{admin.phone || '—'}</span>
                                                </td>
                                                <td className="px-5 py-4 text-sm text-gray-600">
                                                    {isSuperAdmin
                                                        ? <span className="text-[11px] font-black text-amber-600 uppercase tracking-wider">All Branches</span>
                                                        : (admin.branch_name || '—')
                                                    }
                                                </td>
                                                <td className="px-5 py-4">
                                                    <Badge variant={admin.status === 'active' ? 'green' : 'red'}>{admin.status}</Badge>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            </main>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Admin">
                <form onSubmit={handleCreate} className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Full Name</label>
                        <input
                            type="text"
                            value={form.full_name}
                            onChange={(e) => handleFieldChange('full_name', e.target.value)}
                            className="w-full mt-2 border border-gray-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-[#6F4BFF]/40 text-sm font-medium"
                            placeholder="Jane Doe"
                        />
                        {formErrors.full_name && <p className="text-xs text-red-500 mt-1">{formErrors.full_name}</p>}
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email</label>
                        <input
                            type="email"
                            value={form.email}
                            onChange={(e) => handleFieldChange('email', e.target.value)}
                            className="w-full mt-2 border border-gray-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-[#6F4BFF]/40 text-sm font-medium"
                            placeholder="jane@squarft.com"
                        />
                        {formErrors.email && <p className="text-xs text-red-500 mt-1">{formErrors.email}</p>}
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Phone</label>
                        <div className="flex items-center mt-2 border border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#6F4BFF]/40">
                            <span className="px-2.5 py-2.5 text-sm font-bold text-gray-500 bg-gray-50 border-r border-gray-200">+91</span>
                            <input
                                type="text"
                                inputMode="numeric"
                                value={form.phone}
                                onChange={(e) => handleFieldChange('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                                className="w-full p-2.5 outline-none text-sm font-medium"
                                placeholder="10-digit mobile number"
                                maxLength={10}
                            />
                        </div>
                        {formErrors.phone && <p className="text-xs text-red-500 mt-1">{formErrors.phone}</p>}
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Password</label>
                        <div className="relative mt-2">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                autoComplete="new-password"
                                value={form.password}
                                onChange={(e) => handleFieldChange('password', e.target.value)}
                                className="w-full border border-gray-200 rounded-lg p-2.5 pr-10 outline-none focus:ring-2 focus:ring-[#6F4BFF]/40 text-sm font-medium"
                                placeholder="At least 8 characters"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600"
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                                aria-pressed={showPassword}
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                        {formErrors.password && <p className="text-xs text-red-500 mt-1">{formErrors.password}</p>}
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Branch <span className="text-red-500">*</span></label>
                        <select
                            value={form.branch_id}
                            onChange={(e) => handleFieldChange('branch_id', e.target.value)}
                            className="w-full mt-2 border border-gray-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-[#6F4BFF]/40 text-sm font-medium"
                        >
                            <option value="">Select a branch</option>
                            {(branches || []).map((branch) => (
                                <option key={branch.id} value={branch.id}>{branch.name}</option>
                            ))}
                        </select>
                        <p className="text-[11px] text-gray-400 font-medium mt-1.5">
                            This admin will only ever see and manage this branch's data.
                        </p>
                        {formErrors.branch_id && <p className="text-xs text-red-500 mt-1">{formErrors.branch_id}</p>}
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)} disabled={submitting}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={submitting}>
                            {submitting ? 'Creating...' : 'Create Admin'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Admins;
