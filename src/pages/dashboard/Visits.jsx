import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Building2, Calendar, CalendarCheck, CheckCircle2, Clock, Edit2, FileText,
    Grid3X3, HardHat, KeyRound, LoaderCircle, MapPin, PhoneCall, Plus, Save,
    Search, ShieldCheck, TrendingUp, User, XCircle
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
    if (status === 'In Progress') return <Badge variant="yellow">{status}</Badge>;
    return <Badge variant="gray">{status}</Badge>;
};

const isTodayVisit = (date = '') => {
    const normalized = String(date).trim().toLowerCase();
    if (normalized === 'today') return true;

    const today = new Date();
    const [day, month, year] = String(date).split(/[/-]/).map((part) => part.trim());
    if (!day || !month || !year) return false;

    const fullYear = year.length === 2 ? Number(`20${year}`) : Number(year);
    return Number(day) === today.getDate() && Number(month) === today.getMonth() + 1 && fullYear === today.getFullYear();
};

const availabilitySlots = ['10:00 - 12:00', '12:30 - 02:30', '03:00 - 05:00'];

const officerInitials = (name = '') => name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'SO';

const getVisitSlot = (time = '') => {
    const normalized = String(time).toLowerCase();
    if (normalized.includes('10:') || normalized.includes('11:') || normalized.includes('morning')) return availabilitySlots[0];
    if (normalized.includes('12:') || normalized.includes('01:') || normalized.includes('1:') || normalized.includes('02:') || normalized.includes('2:')) return availabilitySlots[1];
    return availabilitySlots[2];
};

const getVisitSources = (visit) => visit.sources || visit.source || ['Mobile', 'App'];

const getVisitPropertyCount = (visit) => visit.propertyCount || visit.properties?.length || (visit.property ? 1 : 0);

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
    const [selectedAvailabilityVisitId, setSelectedAvailabilityVisitId] = useState(null);

    const selectedVisit = visits.find((visit) => visit.id === selectedVisitId) || visits[0] || null;
    const selectedAvailabilityVisit = visits.find((visit) => visit.id === selectedAvailabilityVisitId) || visits.find((visit) => visit.status === 'In Progress') || visits[0] || null;

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

    const visitMetrics = useMemo(() => ([
        {
            title: 'Total Visits',
            value: visits.length,
            icon: Calendar,
            accent: 'text-gray-900',
            iconClass: 'text-[#6F4BFF]',
            pill: '+12%',
            pillClass: 'bg-[#6F4BFF]/10 text-[#6F4BFF]',
        },
        {
            title: "Today's Visits",
            value: visits.filter((visit) => isTodayVisit(visit.date)).length,
            icon: CalendarCheck,
            accent: 'text-[#3024E8]',
            iconClass: 'text-[#3024E8]',
            active: true,
        },
        {
            title: 'OTP Pending',
            value: visits.filter((visit) => visit.otpStatus === 'Pending' || visit.status === 'OTP Pending').length,
            icon: KeyRound,
            accent: 'text-red-600',
            iconClass: 'text-red-500',
            pill: 'Priority',
            pillClass: 'bg-rose-50 text-red-600',
        },
        {
            title: 'OTP Verified',
            value: visits.filter((visit) => visit.otpStatus === 'Verified' || visit.status === 'OTP Verified' || visit.status === 'Completed').length,
            icon: ShieldCheck,
            accent: 'text-emerald-600',
            iconClass: 'text-emerald-600',
        },
        {
            title: 'In Progress',
            value: visits.filter((visit) => visit.status === 'In Progress').length,
            icon: LoaderCircle,
            accent: 'text-slate-700',
            iconClass: 'text-indigo-500',
        },
    ]), [visits]);

    const operationalSlots = useMemo(() => {
        const todaysVisits = visits.filter((visit) => isTodayVisit(visit.date));
        const sourceVisits = todaysVisits.length ? todaysVisits : visits.slice(0, 3);

        return sourceVisits.slice(0, 4).map((visit, index) => {
            const isActive = visit.status === 'In Progress' || index === 1;
            const isDone = visit.otpStatus === 'Verified' || visit.status === 'Completed';
            const progress = visit.status === 'Completed' ? 100 : isActive ? 72 : visit.otpStatus === 'Pending' ? 18 : 42;

            return {
                id: visit.id,
                customerName: visit.customerName,
                officerName: visit.officerName,
                time: visit.time || 'Slot pending',
                isActive,
                isDone,
                progress,
                muted: visit.status === 'Cancelled',
            };
        });
    }, [visits]);

    const officerAvailability = useMemo(() => {
        const officerNames = Array.from(new Set([
            ...visits.map((visit) => visit.officerName).filter(Boolean),
            'Vikram Singh',
            'Rajesh Kumar',
            'Anjali Desai',
        ])).slice(0, 6);

        return officerNames.map((officerName) => ({
            officerName,
            slots: availabilitySlots.map((slot) => {
                const assignedVisit = visits.find((visit) => visit.officerName === officerName && getVisitSlot(visit.time) === slot && visit.status !== 'Cancelled');
                return { slot, visit: assignedVisit || null };
            }),
        }));
    }, [visits]);

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
                <div className="max-w-[1600px] mx-auto space-y-6 animate-in fade-in duration-300">
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
                        {visitMetrics.map((metric) => (
                            <div key={metric.title} className={`relative overflow-hidden rounded-xl border bg-white p-5 min-h-[132px] shadow-sm transition-all ${metric.active ? 'border-[#3024E8] shadow-[#3024E8]/10' : 'border-violet-100'}`}>
                                {metric.active && <div className="absolute left-0 top-0 h-full w-1.5 bg-[#3024E8]" />}
                                <div className="flex h-full flex-col justify-between">
                                    <div className="flex items-start justify-between gap-3">
                                        <p className="text-[13px] font-semibold uppercase tracking-[0.16em] leading-7 text-slate-800">
                                            {metric.title}
                                        </p>
                                        <metric.icon className={`mt-1 h-5 w-5 shrink-0 ${metric.iconClass}`} />
                                    </div>
                                    <div className="mt-4 flex items-center gap-2">
                                        <p className={`text-3xl font-black tracking-tight ${metric.accent}`}>
                                            {String(metric.value).padStart(metric.title === 'In Progress' && metric.value < 10 ? 2 : 1, '0')}
                                        </p>
                                        {metric.pill && (
                                            <span className={`rounded-full px-2.5 py-1 text-[10px] font-black ${metric.pillClass}`}>
                                                {metric.pill}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="overflow-hidden rounded-xl border border-violet-100 bg-white shadow-sm">
                        <div className="flex items-center justify-between gap-4 border-b border-violet-100 bg-[#F5F1FF] px-5 py-4">
                            <h2 className="flex items-center gap-2 text-base font-black text-slate-950">
                                <Clock className="h-5 w-5 text-[#3024E8]" /> Today's Operational Slots
                            </h2>
                            <p className="text-sm font-semibold text-slate-700">
                                {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                            </p>
                        </div>
                        <div className="flex gap-4 overflow-x-auto p-5">
                            {operationalSlots.map((slot) => (
                                <div
                                    key={slot.id}
                                    className={`relative min-w-[210px] rounded-lg border p-4 shadow-sm transition-all ${
                                        slot.isActive
                                            ? 'border-[#3024E8] bg-white shadow-[#3024E8]/20 ring-1 ring-[#3024E8]'
                                            : slot.muted
                                                ? 'border-gray-200 bg-gray-50 opacity-60'
                                                : 'border-violet-100 bg-white'
                                    }`}
                                >
                                    {slot.isActive && (
                                        <span className="absolute right-3 top-0 -translate-y-1/2 rounded-full bg-[#3024E8] px-2 py-0.5 text-[9px] font-black text-white">
                                            Active
                                        </span>
                                    )}
                                    <div className="mb-4 flex items-start justify-between gap-3">
                                        <span className={`rounded px-2 py-1 text-[10px] font-black ${slot.isActive ? 'bg-[#3024E8] text-white' : 'bg-[#3024E8]/10 text-[#3024E8]'}`}>
                                            {slot.time}
                                        </span>
                                        {slot.isDone ? (
                                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                        ) : (
                                            <span className="h-3 w-3 rounded-full bg-[#3024E8]/30" />
                                        )}
                                    </div>
                                    <p className="text-sm font-semibold text-slate-800">{slot.customerName}</p>
                                    <p className="mt-1 text-sm font-black text-[#3024E8]">SO: {slot.officerName}</p>
                                    <div className="mt-4 h-1 rounded-full bg-gray-200">
                                        <div
                                            className={`h-full rounded-full ${slot.isDone ? 'bg-emerald-500' : slot.isActive ? 'bg-[#3024E8]' : 'bg-gray-300'}`}
                                            style={{ width: `${slot.progress}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                            {operationalSlots.length === 0 && (
                                <div className="min-h-[110px] w-full rounded-lg border border-dashed border-violet-100 bg-gray-50 p-6 text-center text-sm font-black uppercase tracking-widest text-gray-400">
                                    No operational slots for today.
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_300px] gap-5">
                        <div className="overflow-hidden rounded-xl border border-violet-100 bg-white shadow-sm">
                            <div className="flex flex-col gap-3 border-b border-violet-100 bg-[#F5F1FF] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                                <h2 className="flex items-center gap-2 text-2xl font-semibold text-slate-950">
                                    <Grid3X3 className="h-5 w-5 text-[#3024E8]" /> Officer Availability Grid
                                </h2>
                                <div className="flex items-center gap-4 text-[10px] font-semibold uppercase tracking-wide text-slate-600">
                                    <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#3024E8]" /> Occupied</span>
                                    <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-gray-200" /> Available</span>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <div className="min-w-[760px]">
                                    <div className="grid grid-cols-[200px_repeat(3,1fr)] border-b border-violet-100 bg-white text-sm font-black uppercase tracking-wide text-slate-700">
                                        <div className="border-r border-violet-50 px-6 py-5">Sales Officer</div>
                                        {availabilitySlots.map((slot) => (
                                            <div key={slot} className="px-4 py-5 text-center text-base">{slot}</div>
                                        ))}
                                    </div>
                                    {officerAvailability.map((row) => (
                                        <div key={row.officerName} className="grid grid-cols-[200px_repeat(3,1fr)] border-b border-violet-50 last:border-b-0">
                                            <div className="flex items-center gap-3 border-r border-violet-50 px-6 py-5">
                                                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#3024E8]/10 text-sm font-black text-[#3024E8]">
                                                    {officerInitials(row.officerName)}
                                                </span>
                                                <span className="font-black text-slate-950">{row.officerName}</span>
                                            </div>
                                            {row.slots.map(({ slot, visit }) => (
                                                <div key={slot} className="px-4 py-5">
                                                    {visit ? (
                                                        <button
                                                            type="button"
                                                            onClick={() => setSelectedAvailabilityVisitId(visit.id)}
                                                            className={`w-full rounded-md px-3 py-2 text-left text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${
                                                                selectedAvailabilityVisit?.id === visit.id ? 'bg-[#3024E8] ring-2 ring-[#3024E8]/20' : 'bg-[#5B4BE8]'
                                                            }`}
                                                        >
                                                            <p className="truncate text-[11px] font-black">{visit.customerName}</p>
                                                            <p className="truncate text-[10px] font-semibold text-white/85">{visit.property?.name}</p>
                                                        </button>
                                                    ) : (
                                                        <div className="rounded-md bg-gray-50 px-3 py-3 text-center text-xs font-semibold text-slate-700">
                                                            Available
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {selectedAvailabilityVisit && (
                            <div className="overflow-hidden rounded-lg bg-[#3024E8] text-white shadow-xl shadow-[#3024E8]/20">
                                <div className="p-5">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <h3 className="text-xl font-black leading-tight">Visit ID: #{selectedAvailabilityVisit.id}</h3>
                                            <p className="mt-1 text-sm font-semibold text-white/90">Execution Mode: Live Field Tracking</p>
                                        </div>
                                        <span className="rounded-full bg-white/15 px-3 py-1 text-[10px] font-black uppercase">Live</span>
                                    </div>
                                    <div className="mt-5 rounded-lg bg-white/15 p-4">
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-3">
                                                <div className="h-12 w-12 overflow-hidden rounded-full border-2 border-white/30 bg-white/20">
                                                    <div className="flex h-full w-full items-center justify-center text-sm font-black">{officerInitials(selectedAvailabilityVisit.officerName)}</div>
                                                </div>
                                                <div>
                                                    <p className="font-black">{selectedAvailabilityVisit.officerName}</p>
                                                    <p className="text-xs font-semibold text-white/75">Field Sales Officer - Level 4</p>
                                                </div>
                                            </div>
                                            <button type="button" className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#3024E8]">
                                                <PhoneCall className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-6 bg-white p-5 text-slate-950">
                                    <div>
                                        <p className="mb-3 text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">Verification Status</p>
                                        <div className="flex items-center justify-between rounded-md border border-emerald-100 bg-emerald-50 px-4 py-3">
                                            <span className="flex items-center gap-2 text-sm font-black text-emerald-700">
                                                <ShieldCheck className="h-4 w-4" /> {selectedAvailabilityVisit.otpStatus === 'Verified' ? 'OTP Verified' : 'OTP Pending'}
                                            </span>
                                            <span className="text-[10px] font-semibold text-emerald-700">{selectedAvailabilityVisit.otpStatus === 'Verified' ? '12:34 PM' : 'Pending'}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="mb-3 text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">Field Check-in (GPS)</p>
                                        <div className="relative overflow-hidden rounded-md bg-slate-200 p-5">
                                            <div className="absolute inset-0 bg-linear-to-br from-slate-300 via-slate-100 to-sky-200" />
                                            <div className="relative mx-auto flex w-fit items-center gap-2 rounded-md bg-white px-5 py-3 text-sm font-semibold text-[#3024E8] shadow-lg">
                                                <MapPin className="h-4 w-4" /> Location Verified
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="mb-3 text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">Property Walkthrough Checklist</p>
                                        <div className="rounded-md border border-violet-100 bg-violet-50/40 p-4">
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <p className="text-sm font-black">{selectedAvailabilityVisit.property?.name} - {selectedAvailabilityVisit.property?.config || selectedAvailabilityVisit.property?.type}</p>
                                                    <p className="mt-1 text-xs font-semibold text-slate-600">Unit #{String(selectedAvailabilityVisit.id).replace(/\D/g, '').padStart(3, '0')}, Block C</p>
                                                </div>
                                                <span className="rounded bg-rose-50 px-2 py-1 text-[9px] font-black uppercase text-rose-600">Hot</span>
                                            </div>
                                            <div className="mt-4 flex gap-3">
                                                <div className="flex h-12 w-12 items-center justify-center rounded bg-white text-slate-400">
                                                    <FileText className="h-5 w-5" />
                                                </div>
                                                <div className="h-12 w-16 rounded bg-linear-to-br from-slate-700 to-slate-300 shadow-inner" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col lg:flex-row h-full gap-6 min-h-[80vh]">
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
                                {['All', 'Scheduled', 'In Progress', 'Completed', 'Cancelled'].map((item) => (
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
                                if (visit.status === 'In Progress') statusBorder = 'border-l-amber-500';
                                if (visit.status === 'Completed') statusBorder = 'border-l-emerald-500';
                                if (visit.status === 'Cancelled') statusBorder = 'border-l-rose-500';
                                const sources = getVisitSources(visit);
                                return (
                                    <div key={visit.id} onClick={() => setSelectedVisitId(visit.id)} className={`bg-white border-y border-r border-l-4 rounded-lg cursor-pointer transition-all ${statusBorder} ${isSelected ? 'ring-2 ring-[#6F4BFF]/20 shadow-md bg-purple-50/10' : 'border-gray-200 hover:shadow-sm'}`}>
                                        <div className="grid grid-cols-[76px_1.35fr_86px_76px_90px_64px] gap-3 p-4 items-center min-w-[560px]">
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Visit ID</p>
                                                <p className="text-base font-black text-[#3024E8] leading-tight">#{visit.id.replace(/^V/i, 'SV-')}</p>
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Customer</p>
                                                <p className="text-base font-black text-gray-950 leading-tight break-words">{visit.customerName}</p>
                                                <p className="text-xs font-semibold text-gray-600">{visit.customerPhone}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Source</p>
                                                <div className="flex flex-col items-start gap-1">
                                                    {(Array.isArray(sources) ? sources : [sources]).map((source) => (
                                                        <span key={source} className="rounded bg-blue-50 px-2 py-1 text-[10px] font-black uppercase text-[#3024E8]">{source}</span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Slot</p>
                                                <p className="text-sm font-black text-gray-950 leading-tight">{visit.time}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Officer</p>
                                                <p className="text-sm font-black text-gray-950 leading-tight">{visit.officerName}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Properties</p>
                                                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#3024E8]/10 text-lg font-black text-slate-700">
                                                    {String(getVisitPropertyCount(visit)).padStart(2, '0')}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between gap-3 border-t border-gray-50 px-4 py-3">
                                            <p className="text-xs text-gray-500 flex items-center gap-1.5 font-medium min-w-0">
                                                <Building2 className="w-3.5 h-3.5 shrink-0" /> <span className="truncate">{visit.property.name}</span>
                                            </p>
                                            <div className="shrink-0">
                                                {getStatusBadge(visit.status)}
                                            </div>
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
                    <SelectField label="Status" value={visitForm.status} onChange={(value) => updateVisitForm('status', value)} options={['Scheduled', 'In Progress', 'Completed', 'Cancelled']} />
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
