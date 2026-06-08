import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Building2, Calendar, CheckCircle2, Clock, Edit2, FileText,
    HardHat, PhoneCall, Plus, Save, Search, TrendingUp, User, XCircle
} from 'lucide-react';
import { addVisit, addVisitNote, updateVisit, updateVisitStatus } from '../../store/visitsSlice';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Header from '../../components/layout/Header';

const visitFormInitialState = {
    officerName: '',
    officerPhone: '',
    customerName: '',
    customerPhone: '',
    purpose: 'BUY',
    date: '',
    time: '',
    status: 'Scheduled',
    propertyName: '',
    propertyType: 'APARTMENT/FLATS',
    propertyConfig: '',
    propertyAddress: '',
    propertyPrice: '',
    notes: '',
};

const getStatusBadge = (status) => {
    if (status === 'Scheduled') return <Badge variant="purple">{status}</Badge>;
    if (status === 'Completed') return <Badge variant="green">{status}</Badge>;
    if (status === 'Cancelled') return <Badge variant="red">{status}</Badge>;
    return <Badge variant="gray">{status}</Badge>;
};

const mapVisitToForm = (visit) => ({
    officerName: visit.officerName || '',
    officerPhone: visit.officerPhone || '',
    customerName: visit.customerName || '',
    customerPhone: visit.customerPhone || '',
    purpose: visit.purpose || 'BUY',
    date: visit.date || '',
    time: visit.time || '',
    status: visit.status || 'Scheduled',
    propertyName: visit.property?.name || '',
    propertyType: visit.property?.type || 'APARTMENT/FLATS',
    propertyConfig: visit.property?.config || '',
    propertyAddress: visit.property?.address || '',
    propertyPrice: visit.property?.price || '',
    notes: visit.notes || '',
});

const buildVisitPayload = (formState) => ({
    officerName: formState.officerName.trim(),
    officerPhone: formState.officerPhone.trim(),
    customerName: formState.customerName.trim(),
    customerPhone: formState.customerPhone.trim(),
    purpose: formState.purpose,
    date: formState.date,
    time: formState.time,
    status: formState.status,
    property: {
        name: formState.propertyName.trim(),
        type: formState.propertyType,
        config: formState.propertyConfig.trim(),
        address: formState.propertyAddress.trim(),
        price: formState.propertyPrice.trim(),
    },
    notes: formState.notes.trim(),
});

const Visits = () => {
    const dispatch = useDispatch();
    const { visits } = useSelector((state) => state.visits);
    const [selectedVisitId, setSelectedVisitId] = useState(visits[0]?.id || null);
    const [filter, setFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [newNote, setNewNote] = useState('');
    const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
    const [editingVisitId, setEditingVisitId] = useState(null);
    const [visitForm, setVisitForm] = useState(visitFormInitialState);

    const selectedVisit = visits.find((visit) => visit.id === selectedVisitId) || visits[0] || null;

    const filteredVisits = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        return visits.filter((visit) => {
            const matchesStatus = filter === 'All' || visit.status === filter;
            const matchesQuery = !query || [
                visit.customerName,
                visit.customerPhone,
                visit.officerName,
                visit.property?.name,
                visit.property?.address,
                visit.purpose,
            ].filter(Boolean).some((value) => String(value).toLowerCase().includes(query));
            return matchesStatus && matchesQuery;
        });
    }, [filter, searchQuery, visits]);

    const openCreateModal = () => {
        setEditingVisitId(null);
        setVisitForm(visitFormInitialState);
        setIsVisitModalOpen(true);
    };

    const openEditModal = (visit) => {
        setEditingVisitId(visit.id);
        setVisitForm(mapVisitToForm(visit));
        setIsVisitModalOpen(true);
    };

    const closeVisitModal = () => {
        setIsVisitModalOpen(false);
        setEditingVisitId(null);
        setVisitForm(visitFormInitialState);
    };

    const updateVisitForm = (field, value) => {
        setVisitForm((current) => ({ ...current, [field]: value }));
    };

    const handleSubmitVisit = (event) => {
        event.preventDefault();
        const payload = buildVisitPayload(visitForm);

        if (editingVisitId) {
            dispatch(updateVisit({ id: editingVisitId, changes: payload }));
            setSelectedVisitId(editingVisitId);
        } else {
            dispatch(addVisit(payload));
        }
        closeVisitModal();
    };

    const handleUpdateStatus = (id, status) => {
        dispatch(updateVisitStatus({ id, status }));
        setSelectedVisitId(id);
    };

    const handleAddNote = () => {
        if (!selectedVisit || !newNote.trim()) return;
        dispatch(addVisitNote({ id: selectedVisit.id, note: newNote.trim() }));
        setNewNote('');
    };

    return (
        <div className="flex-1 flex flex-col h-full relative bg-[#F5F6FA] font-sans text-gray-900">
            <Header title="Upcoming Visits" />

            <main className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth">
                <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row h-full gap-6 animate-in fade-in duration-300 min-h-[80vh]">
                    <Card noPadding className="w-full lg:w-1/3 flex flex-col h-[80vh] border-gray-200 shadow-md shrink-0">
                        <div className="p-5 border-b border-gray-100 bg-gray-50/50 space-y-4">
                            <div className="flex items-center justify-between gap-3">
                                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-[#6F4BFF]" /> Visits Schedule
                                </h2>
                                <Button icon={Plus} className="px-3 py-2 text-xs" onClick={openCreateModal}>New</Button>
                            </div>
                            <div className="relative">
                                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    value={searchQuery}
                                    onChange={(event) => setSearchQuery(event.target.value)}
                                    className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm font-semibold outline-none focus:ring-2 focus:ring-[#6F4BFF]/30"
                                    placeholder="Search visits..."
                                />
                            </div>
                            <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
                                {['All', 'Scheduled', 'Completed', 'Cancelled'].map((item) => (
                                    <button key={item} onClick={() => setFilter(item)} className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${filter === item ? 'bg-[#6F4BFF] text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                                        {item}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50/30">
                            {filteredVisits.length === 0 ? (
                                <p className="text-center text-gray-400 text-sm font-medium mt-10">No visits found.</p>
                            ) : filteredVisits.map((visit) => {
                                const isSelected = selectedVisit?.id === visit.id;
                                let statusBorder = 'border-l-gray-300';
                                if (visit.status === 'Scheduled') statusBorder = 'border-l-purple-500';
                                if (visit.status === 'Completed') statusBorder = 'border-l-emerald-500';
                                if (visit.status === 'Cancelled') statusBorder = 'border-l-rose-500';
                                return (
                                    <div key={visit.id} onClick={() => setSelectedVisitId(visit.id)} className={`bg-white border-y border-r border-l-4 rounded-lg p-4 cursor-pointer transition-all ${statusBorder} ${isSelected ? 'ring-2 ring-[#6F4BFF]/20 shadow-md bg-purple-50/10' : 'border-gray-200 hover:shadow-sm'}`}>
                                        <div className="flex justify-between items-start mb-2">
                                            <p className="text-sm font-bold text-gray-900">{visit.customerName}</p>
                                            <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{visit.time}</span>
                                        </div>
                                        <p className="text-xs text-gray-500 flex items-center gap-1.5 mb-2 font-medium">
                                            <Building2 className="w-3.5 h-3.5" /> {visit.property.name}
                                        </p>
                                        <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-50">
                                            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-600">
                                                <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[8px] uppercase">{visit.officerName.charAt(0)}</div>
                                                {visit.officerName}
                                            </div>
                                            {getStatusBadge(visit.status)}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </Card>

                    <div className="w-full lg:w-2/3 h-[80vh] flex flex-col">
                        {!selectedVisit ? (
                            <Card className="flex-1 flex flex-col items-center justify-center text-center bg-gray-50 border-dashed border-2 border-gray-200">
                                <Calendar className="w-16 h-16 text-gray-300 mb-4" />
                                <h3 className="text-xl font-bold text-gray-600">No Visit Selected</h3>
                            </Card>
                        ) : (
                            <Card noPadding className="flex-1 flex flex-col shadow-lg border-gray-200 overflow-hidden relative">
                                <div className="bg-white border-b border-gray-100 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h2 className="text-2xl font-bold text-gray-900">Visit #{selectedVisit.id}</h2>
                                            {getStatusBadge(selectedVisit.status)}
                                        </div>
                                        <p className="text-sm font-medium text-gray-500 flex items-center gap-1.5">
                                            <Calendar className="w-4 h-4 text-gray-400" /> {selectedVisit.date}
                                            <Clock className="w-4 h-4 text-gray-400 ml-2" /> {selectedVisit.time}
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <Button variant="secondary" icon={Edit2} onClick={() => openEditModal(selectedVisit)} className="shadow-sm border-gray-300 hover:bg-gray-100 text-gray-700">Edit</Button>
                                        {selectedVisit.status === 'Scheduled' && (
                                            <>
                                                <Button variant="success" icon={CheckCircle2} onClick={() => handleUpdateStatus(selectedVisit.id, 'Completed')} className="shadow-sm">Complete</Button>
                                                <Button variant="secondary" icon={Clock} onClick={() => openEditModal(selectedVisit)} className="shadow-sm border-gray-300 hover:bg-gray-100 text-gray-700">Reschedule</Button>
                                                <Button variant="danger" icon={XCircle} onClick={() => handleUpdateStatus(selectedVisit.id, 'Cancelled')} className="shadow-sm">Cancel</Button>
                                            </>
                                        )}
                                        {selectedVisit.status === 'Completed' && (
                                            <Button variant="primary" icon={TrendingUp} className="bg-emerald-600 hover:bg-emerald-700 shadow-md">Convert to Deal</Button>
                                        )}
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <InfoCard title="Customer" name={selectedVisit.customerName} phone={selectedVisit.customerPhone} icon={User} color="blue" />
                                        <InfoCard title="Assigned Officer" name={selectedVisit.officerName} phone={selectedVisit.officerPhone} icon={HardHat} color="purple" />
                                    </div>

                                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
                                            <Building2 className="w-5 h-5 text-gray-400" /> Property Details
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-bold text-gray-700">
                                            <p><span className="text-gray-400 uppercase text-[10px] tracking-widest block">Property</span>{selectedVisit.property.name}</p>
                                            <p><span className="text-gray-400 uppercase text-[10px] tracking-widest block">Configuration</span>{selectedVisit.property.config}</p>
                                            <p><span className="text-gray-400 uppercase text-[10px] tracking-widest block">Type</span>{selectedVisit.property.type}</p>
                                            <p><span className="text-gray-400 uppercase text-[10px] tracking-widest block">Price</span>{selectedVisit.property.price}</p>
                                            <p className="md:col-span-2"><span className="text-gray-400 uppercase text-[10px] tracking-widest block">Address</span>{selectedVisit.property.address}</p>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
                                            <FileText className="w-5 h-5 text-gray-400" /> Visit Notes & Follow-up
                                        </h3>
                                        <div className="bg-amber-50/50 border border-amber-100 p-4 rounded-lg mb-6">
                                            <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedVisit.notes || 'No notes yet.'}</p>
                                        </div>
                                        {selectedVisit.status !== 'Cancelled' && (
                                            <div className="flex flex-col gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:items-end">
                                                <div className="flex-1">
                                                    <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Add internal update</label>
                                                    <textarea value={newNote} onChange={(event) => setNewNote(event.target.value)} rows="2" className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 text-sm font-medium"></textarea>
                                                </div>
                                                <Button onClick={handleAddNote} icon={Save} className="px-6 shadow-sm">Save Note</Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        )}
                    </div>
                </div>
            </main>

            <Modal isOpen={isVisitModalOpen} onClose={closeVisitModal} title={editingVisitId ? 'Edit Visit' : 'Schedule New Visit'}>
                <form onSubmit={handleSubmitVisit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="Customer Name" value={visitForm.customerName} onChange={(value) => updateVisitForm('customerName', value)} required />
                        <Field label="Customer Phone" value={visitForm.customerPhone} onChange={(value) => updateVisitForm('customerPhone', value)} required />
                        <Field label="Officer Name" value={visitForm.officerName} onChange={(value) => updateVisitForm('officerName', value)} required />
                        <Field label="Officer Phone" value={visitForm.officerPhone} onChange={(value) => updateVisitForm('officerPhone', value)} required />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <SelectField label="Purpose" value={visitForm.purpose} onChange={(value) => updateVisitForm('purpose', value)} options={['BUY', 'RENT', 'SELL']} />
                        <Field label="Date" type="text" value={visitForm.date} onChange={(value) => updateVisitForm('date', value)} placeholder="05/04/26" required />
                        <Field label="Time" value={visitForm.time} onChange={(value) => updateVisitForm('time', value)} placeholder="10:00 - 11:00 AM" required />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="Property Name" value={visitForm.propertyName} onChange={(value) => updateVisitForm('propertyName', value)} required />
                        <SelectField label="Property Type" value={visitForm.propertyType} onChange={(value) => updateVisitForm('propertyType', value)} options={['APARTMENT/FLATS', 'VILLA PLOTS', 'COMMERCIAL', 'PLOT']} />
                        <Field label="Configuration" value={visitForm.propertyConfig} onChange={(value) => updateVisitForm('propertyConfig', value)} placeholder="3BHK Premium" />
                        <Field label="Price" value={visitForm.propertyPrice} onChange={(value) => updateVisitForm('propertyPrice', value)} placeholder="1.85 Cr" />
                    </div>
                    <Field label="Property Address" value={visitForm.propertyAddress} onChange={(value) => updateVisitForm('propertyAddress', value)} />
                    <SelectField label="Status" value={visitForm.status} onChange={(value) => updateVisitForm('status', value)} options={['Scheduled', 'Completed', 'Cancelled']} />
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Notes</label>
                        <textarea rows="3" value={visitForm.notes} onChange={(event) => updateVisitForm('notes', event.target.value)} className="w-full mt-2 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 text-sm font-medium" />
                    </div>
                    <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                        <Button variant="secondary" onClick={closeVisitModal}>Cancel</Button>
                        <Button type="submit" icon={Save}>{editingVisitId ? 'Save Changes' : 'Schedule Visit'}</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

const Field = ({ label, value, onChange, type = 'text', placeholder = '', required = false }) => (
    <div>
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</label>
        <input
            type={type}
            required={required}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            className="w-full mt-2 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 font-bold"
        />
    </div>
);

const SelectField = ({ label, value, onChange, options }) => (
    <div>
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</label>
        <select value={value} onChange={(event) => onChange(event.target.value)} className="w-full mt-2 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 font-bold bg-white">
            {options.map((option) => <option key={option}>{option}</option>)}
        </select>
    </div>
);

const InfoCard = ({ title, name, phone, icon: Icon, color }) => {
    const colorClass = color === 'blue' ? 'bg-blue-100 border-blue-200 text-blue-600' : 'bg-purple-100 border-purple-200 text-purple-600';

    return (
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm relative overflow-hidden group">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border ${colorClass}`}>
                        <Icon className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">{title}</p>
                        <h4 className="text-lg font-bold text-gray-900">{name}</h4>
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <p className="font-semibold text-gray-700 flex items-center gap-2"><PhoneCall className="w-4 h-4 text-gray-400" /> {phone}</p>
            </div>
        </div>
    );
};

export default Visits;
