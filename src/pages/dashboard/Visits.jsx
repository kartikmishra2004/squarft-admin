import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Building2, Calendar, CalendarCheck, CheckCircle2, ChevronRight, Clock, Edit2, FileText,
    HardHat, KeyRound, LoaderCircle, MapPin, PhoneCall, Plus, Save,
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

const getVisitSources = (visit) => visit.sources || visit.source || ['Mobile', 'App'];

const getVisitPropertyCount = (visit) => visit.propertyCount || visit.properties?.length || (visit.property ? 1 : 0);

const normalizeText = (value = '') => String(value).trim().toLowerCase();

const getVisitProperties = (visit) => (
    Array.isArray(visit.properties) && visit.properties.length
        ? visit.properties
        : visit.property
            ? [visit.property]
            : []
);

const getVisitPhotos = (visit) => (
    visit?.propertyPhotos
    || visit?.uploadedPhotos
    || (visit?.status === 'Completed'
        ? [
            { url: '/inventory-images/project-main.png', label: 'Uploaded site photo' },
            { url: '/inventory-images/project-main.png', label: 'Property view' },
        ]
        : [])
);

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
    const [selectedClientKey, setSelectedClientKey] = useState(null);
    const [selectedVisitRowId, setSelectedVisitRowId] = useState(null);
    const [filter, setFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [newNote, setNewNote] = useState('');
    const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
    const [editingVisitId, setEditingVisitId] = useState(null);
    const [visitForm, setVisitForm] = useState(visitFormInitialState);

    const filteredVisits = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        return visits.filter((visit) => {
            const visitProperties = getVisitProperties(visit);
            const matchesStatus = filter === 'All' || visit.status === filter;
            const matchesQuery = !query || [
                visit.customerName,
                visit.customerPhone,
                visit.officerName,
                visit.property?.name,
                visit.property?.address,
                ...visitProperties.flatMap((property) => [property.name, property.config, property.address, property.type]),
                visit.purpose,
            ].filter(Boolean).some((value) => String(value).toLowerCase().includes(query));
            return matchesStatus && matchesQuery;
        });
    }, [filter, searchQuery, visits]);

    const clientCards = useMemo(() => {
        const grouped = filteredVisits.reduce((acc, visit) => {
            const key = `${normalizeText(visit.customerName)}-${normalizeText(visit.customerPhone)}`;
            if (!acc[key]) {
                acc[key] = {
                    key,
                    name: visit.customerName,
                    phone: visit.customerPhone,
                    visits: [],
                    propertyRows: [],
                };
            }

            const properties = getVisitProperties(visit);
            acc[key].visits.push(visit);
            properties.forEach((property, index) => {
                acc[key].propertyRows.push({
                    id: `${visit.id}-${index}`,
                    visit,
                    property,
                });
            });

            return acc;
        }, {});

        return Object.values(grouped).map((client) => ({
            ...client,
            activeVisits: client.visits.filter((visit) => !['Completed', 'Cancelled'].includes(visit.status)),
            visited: client.visits.filter((visit) => visit.status === 'Completed'),
        }));
    }, [filteredVisits]);

    const selectedClient = clientCards.find((client) => client.key === selectedClientKey) || clientCards[0] || null;
    const selectedPropertyRows = selectedClient?.propertyRows || [];
    const selectedPropertyRow = selectedPropertyRows.find((row) => row.id === selectedVisitRowId) || selectedPropertyRows[0] || null;
    const selectedVisit = selectedPropertyRow?.visit || null;
    const selectedProperty = selectedPropertyRow?.property || selectedVisit?.property || null;

    const handleClientSelect = (clientKey) => {
        const nextClient = clientCards.find((client) => client.key === clientKey);
        setSelectedClientKey(clientKey);
        setSelectedVisitRowId(nextClient?.propertyRows?.[0]?.id || null);
    };

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
            setSelectedVisitRowId((current) => current || `${editingVisitId}-0`);
        } else {
            dispatch(addVisit(payload));
        }
        closeVisitModal();
    };

    const handleUpdateStatus = (id, status) => {
        dispatch(updateVisitStatus({ id, status }));
        setSelectedVisitRowId((current) => current || `${id}-0`);
    };

    const handleAddNote = () => {
        if (!selectedVisit || !newNote.trim()) return;
        dispatch(addVisitNote({ id: selectedVisit.id, note: newNote.trim() }));
        setNewNote('');
    };

    return (
        <div className="flex-1 flex flex-col h-full relative bg-[#F5F6FA] font-sans text-gray-900">
            <Header title="Upcoming Visits" />

            <main className="flex-1 overflow-y-auto p-3 md:p-5 scroll-smooth">
                <div className="max-w-[1600px] mx-auto space-y-4 animate-in fade-in duration-300">
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">
                        {visitMetrics.map((metric) => (
                            <div key={metric.title} className={`relative overflow-hidden rounded-lg border bg-white p-3 min-h-[94px] shadow-sm transition-all ${metric.active ? 'border-[#3024E8] shadow-[#3024E8]/10' : 'border-violet-100'}`}>
                                {metric.active && <div className="absolute left-0 top-0 h-full w-1.5 bg-[#3024E8]" />}
                                <div className="flex h-full flex-col justify-between">
                                    <div className="flex items-start justify-between gap-2">
                                        <p className="text-[11px] font-semibold uppercase text-slate-800">
                                            {metric.title}
                                        </p>
                                        <metric.icon className={`mt-0.5 h-4 w-4 shrink-0 ${metric.iconClass}`} />
                                    </div>
                                    <div className="mt-2 flex items-center gap-2">
                                        <p className={`text-xl font-black tracking-tight ${metric.accent}`}>
                                            {String(metric.value).padStart(metric.title === 'In Progress' && metric.value < 10 ? 2 : 1, '0')}
                                        </p>
                                        {metric.pill && (
                                            <span className={`rounded-full px-2 py-0.5 text-[9px] font-black ${metric.pillClass}`}>
                                                {metric.pill}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                        {operationalSlots.map((slot) => (
                            <button
                                key={slot.id}
                                type="button"
                                onClick={() => {
                                    const slotVisit = visits.find((visit) => visit.id === slot.id);
                                    if (!slotVisit) return;
                                    const clientKey = `${normalizeText(slotVisit.customerName)}-${normalizeText(slotVisit.customerPhone)}`;
                                    setSelectedClientKey(clientKey);
                                    setSelectedVisitRowId(`${slotVisit.id}-0`);
                                }}
                                className={`min-h-[96px] rounded-lg border bg-white p-3 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${
                                    slot.isActive ? 'border-[#3024E8] ring-1 ring-[#3024E8]/20' : slot.muted ? 'border-gray-200 opacity-60' : 'border-violet-100'
                                }`}
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <span className={`rounded px-2 py-1 text-[10px] font-black ${slot.isActive ? 'bg-[#3024E8] text-white' : 'bg-[#3024E8]/10 text-[#3024E8]'}`}>
                                        {slot.time}
                                    </span>
                                    {slot.isDone ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <Clock className="h-4 w-4 text-slate-400" />}
                                </div>
                                <p className="mt-2 text-xs font-black text-slate-950 break-words">{slot.customerName}</p>
                                <p className="mt-1 text-xs font-bold text-slate-500 break-words">Officer: {slot.officerName}</p>
                                <div className="mt-2 h-1 rounded-full bg-gray-200">
                                    <div className={`h-full rounded-full ${slot.isDone ? 'bg-emerald-500' : slot.isActive ? 'bg-[#3024E8]' : 'bg-gray-300'}`} style={{ width: `${slot.progress}%` }} />
                                </div>
                            </button>
                        ))}
                    </div>

                    <Card noPadding className="overflow-hidden border-gray-200 shadow-sm">
                        <div className="space-y-3 border-b border-gray-100 bg-white p-3">
                            <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                                <div>
                                    <h2 className="flex items-center gap-2 text-lg font-black text-gray-950">
                                        <Building2 className="h-4 w-4 text-[#3024E8]" /> Property visits
                                    </h2>
                                    <p className="mt-0.5 text-xs font-semibold text-gray-500">Select a client, review their properties to visit, then inspect visit result.</p>
                                </div>
                                <Button icon={Plus} className="w-full justify-center px-2.5 py-1.5 text-xs sm:w-auto" onClick={openCreateModal}>New Visit</Button>
                            </div>
                            <div className="grid gap-2 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <input
                                        value={searchQuery}
                                        onChange={(event) => setSearchQuery(event.target.value)}
                                        className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-xs font-semibold outline-none focus:ring-2 focus:ring-[#6F4BFF]/30"
                                        placeholder="Search client, property, officer, location..."
                                    />
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                    {['All', 'Scheduled', 'In Progress', 'Completed', 'Cancelled'].map((item) => (
                                        <button key={item} onClick={() => setFilter(item)} className={`min-h-8 rounded-md px-2.5 py-1.5 text-[11px] font-bold transition-all ${filter === item ? 'bg-[#3024E8] text-white shadow-sm' : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'}`}>
                                            {item}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-3 p-3 xl:grid-cols-[260px_minmax(0,1fr)_360px]">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between gap-2">
                                    <h3 className="text-xs font-black uppercase text-gray-500">Clients</h3>
                                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-black text-gray-600">{clientCards.length}</span>
                                </div>
                                {clientCards.length === 0 ? (
                                    <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 p-4 text-center text-xs font-semibold text-gray-500">No matching clients found.</div>
                                ) : clientCards.map((client) => {
                                    const isSelected = selectedClient?.key === client.key;
                                    return (
                                        <button
                                            key={client.key}
                                            type="button"
                                            onClick={() => handleClientSelect(client.key)}
                                            className={`w-full rounded-lg border p-3 text-left transition-all ${isSelected ? 'border-[#3024E8] bg-[#F7F5FF] shadow-sm ring-1 ring-[#3024E8]/15' : 'border-gray-200 bg-white hover:border-[#3024E8]/40 hover:bg-gray-50'}`}
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="min-w-0">
                                                    <p className="text-sm font-black leading-tight text-gray-950 break-words">{client.name}</p>
                                                    <p className="mt-1 text-xs font-semibold text-gray-500 break-words">{client.phone}</p>
                                                </div>
                                                <ChevronRight className={`mt-1 h-4 w-4 shrink-0 ${isSelected ? 'text-[#3024E8]' : 'text-gray-400'}`} />
                                            </div>
                                            <div className="mt-3 grid grid-cols-3 gap-1.5 text-center">
                                                <MiniCount label="Visits" value={client.visits.length} />
                                                <MiniCount label="Active" value={client.activeVisits.length} />
                                                <MiniCount label="Visited" value={client.visited.length} />
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="min-w-0 space-y-3">
                                {selectedClient ? (
                                    <>
                                        <div className="rounded-lg border border-gray-200 bg-white p-3">
                                            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                                                <div className="min-w-0">
                                                    <p className="text-[10px] font-black uppercase text-[#3024E8]">Selected client</p>
                                                    <h3 className="mt-0.5 text-lg font-black tracking-tight text-gray-950 break-words">{selectedClient.name}</h3>
                                                    <p className="mt-1 flex items-start gap-1.5 text-xs font-semibold text-gray-500">
                                                        <PhoneCall className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-400" />
                                                        <span className="break-words">{selectedClient.phone}</span>
                                                    </p>
                                                </div>
                                                <div className="grid grid-cols-3 gap-1.5 lg:w-[240px] lg:shrink-0">
                                                    <MiniCount label="Visits" value={selectedClient.visits.length} />
                                                    <MiniCount label="Active" value={selectedClient.activeVisits.length} />
                                                    <MiniCount label="Visited" value={selectedClient.visited.length} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between gap-2">
                                                <h3 className="text-xs font-black uppercase text-gray-500">Properties they are about to visit</h3>
                                                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-black text-gray-600">{selectedPropertyRows.length} items</span>
                                            </div>
                                            {selectedPropertyRows.length === 0 ? (
                                                <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 p-4 text-center text-xs font-semibold text-gray-500">No property visits for this client.</div>
                                            ) : selectedPropertyRows.map(({ visit, property, id }) => {
                                                const isSelected = selectedPropertyRow?.id === id;
                                                return (
                                                    <button
                                                        key={id}
                                                        type="button"
                                                        onClick={() => setSelectedVisitRowId(id)}
                                                        className={`w-full rounded-lg border bg-white p-3 text-left shadow-sm transition-all ${isSelected ? 'border-[#3024E8] ring-1 ring-[#3024E8]/15' : 'border-gray-200 hover:border-[#3024E8]/40'}`}
                                                    >
                                                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                                            <div className="min-w-0">
                                                                <p className="text-sm font-black text-gray-950 break-words">{property.name}</p>
                                                                <p className="mt-1 text-xs font-semibold text-gray-500 break-words">{property.config || property.type}</p>
                                                            </div>
                                                            {getStatusBadge(visit.status)}
                                                        </div>
                                                        <div className="mt-3 grid gap-2 sm:grid-cols-3">
                                                            <DetailChip label="Slot" value={`${visit.date} - ${visit.time}`} />
                                                            <DetailChip label="Officer" value={visit.officerName || 'Unassigned'} />
                                                            <DetailChip label="Price" value={property.price || 'Price on request'} />
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </>
                                ) : (
                                    <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 p-4 text-center text-xs font-semibold text-gray-500">Select a client to see property visits.</div>
                                )}
                            </div>

                            <div className="min-w-0">
                                {!selectedVisit ? (
                                    <Card className="flex min-h-[260px] flex-col items-center justify-center border-2 border-dashed border-gray-200 bg-gray-50 text-center">
                                        <Calendar className="mb-2 h-9 w-9 text-gray-300" />
                                        <h3 className="text-sm font-black text-gray-700">No visit selected</h3>
                                        <p className="mt-1 max-w-sm text-xs font-semibold text-gray-500">Select a property visit to see the result.</p>
                                    </Card>
                                ) : (
                                    <Card noPadding className="overflow-hidden border-gray-200 shadow-sm">
                                        <div className="border-b border-gray-100 bg-white p-3">
                                            <div className="flex flex-wrap items-center gap-1.5">
                                                <h2 className="text-lg font-black text-gray-950 break-words">{selectedProperty?.name || 'Property visit'}</h2>
                                                {getStatusBadge(selectedVisit.status)}
                                            </div>
                                            <p className="mt-1 flex flex-wrap items-center gap-2 text-xs font-semibold text-gray-500">
                                                <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5 text-gray-400" /> {selectedVisit.date}</span>
                                                <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-gray-400" /> {selectedVisit.time}</span>
                                            </p>
                                        </div>

                                        <div className="space-y-3 bg-gray-50/50 p-3">
                                            <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
                                                <div className="grid gap-2 text-xs font-bold text-gray-700">
                                                    <DetailBlock label="Client" value={selectedVisit.customerName} />
                                                    <DetailBlock label="Configuration" value={selectedProperty?.config || selectedProperty?.type} />
                                                    <DetailBlock label="Address" value={selectedProperty?.address} wide />
                                                </div>
                                            </div>

                                            {selectedVisit.status !== 'Completed' ? (
                                                <div className="rounded-lg border border-dashed border-gray-200 bg-white p-5 text-center">
                                                    <Clock className="mx-auto mb-2 h-8 w-8 text-gray-300" />
                                                    <p className="text-sm font-black text-gray-900">Not visited yet</p>
                                                    <p className="mt-1 text-xs font-semibold text-gray-500">Review and uploaded photos will appear after the visit is completed.</p>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
                                                        <h3 className="mb-2 text-sm font-black text-gray-800">Client review</h3>
                                                        {selectedVisit.userRating && (
                                                            <div className="mb-2 flex gap-0.5">
                                                                {[0, 1, 2, 3, 4].map((index) => (
                                                                    <span key={index} className={`text-sm ${index < selectedVisit.userRating ? 'text-amber-400' : 'text-gray-200'}`}>★</span>
                                                                ))}
                                                            </div>
                                                        )}
                                                        <p className="text-xs font-semibold leading-5 text-gray-700">{selectedVisit.userReview || selectedVisit.notes || 'Visit completed. Review not added yet.'}</p>
                                                    </div>

                                                    <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
                                                        <h3 className="mb-3 text-sm font-black text-gray-800">Uploaded property photos</h3>
                                                        <div className="grid grid-cols-2 gap-2">
                                                            {getVisitPhotos(selectedVisit).map((image, index) => (
                                                                <div key={`${image.url}-${index}`} className="overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
                                                                    <img src={image.url} alt={image.label} className="h-24 w-full object-cover" />
                                                                    <p className="truncate px-2 py-1 text-[10px] font-bold text-gray-500">{image.label}</p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <Button variant="primary" icon={TrendingUp} className="w-full justify-center px-2.5 py-2 text-xs bg-emerald-600 hover:bg-emerald-700 shadow-md">Convert to Deal</Button>
                                                </>
                                            )}
                                        </div>
                                    </Card>
                                )}
                            </div>
                        </div>
                    </Card>
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

const MiniCount = ({ label, value }) => (
    <div className="rounded-md border border-gray-100 bg-white px-2 py-1.5">
        <p className="text-sm font-black leading-none text-gray-950">{value ?? 0}</p>
        <p className="mt-0.5 text-[9px] font-black uppercase text-gray-400">{label}</p>
    </div>
);

const DetailChip = ({ label, value }) => (
    <div className="rounded-md border border-gray-100 bg-gray-50 px-2 py-1.5">
        <p className="text-[9px] font-black uppercase text-gray-400">{label}</p>
        <p className="mt-0.5 text-[11px] font-black text-gray-800 break-words">{value || '-'}</p>
    </div>
);

const DetailBlock = ({ label, value, wide = false }) => (
    <div className={wide ? 'sm:col-span-2' : ''}>
        <span className="block text-[9px] font-black uppercase text-gray-400">{label}</span>
        <p className="mt-0.5 break-words text-xs font-bold text-gray-700">{value || '-'}</p>
    </div>
);

const InfoCard = ({ title, name, phone, icon: Icon, color }) => {
    const colorClass = color === 'blue' ? 'bg-blue-100 border-blue-200 text-blue-600' : 'bg-purple-100 border-purple-200 text-purple-600';

    return (
        <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm relative overflow-hidden group">
            <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center border ${colorClass}`}>
                        <Icon className="w-4 h-4" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-0.5">{title}</p>
                        <h4 className="text-sm font-bold text-gray-900 break-words">{name}</h4>
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                <p className="text-xs font-semibold text-gray-700 flex items-center gap-1.5 break-words"><PhoneCall className="w-3.5 h-3.5 text-gray-400" /> {phone}</p>
            </div>
        </div>
    );
};

export default Visits;
