import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Building2, Calendar, CalendarCheck, CheckCircle2, ChevronRight, Clock, Edit2, FileText,
    HardHat, KeyRound, LoaderCircle, MapPin, PhoneCall, Plus, Save,
    Search, ShieldCheck, TrendingUp, User, XCircle
} from 'lucide-react';
import { addVisit, addVisitNote, updateVisit, updateVisitStatus } from '../../store/visitsSlice';
import { mockProjects } from '../../data/mockData';
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

const getVisitProjectName = (visit) => (
    visit.projectName
    || visit.project?.name
    || visit.project?.projectName
    || visit.property?.projectName
    || visit.property?.name
    || ''
);

const getVisitProperties = (visit) => (
    Array.isArray(visit.properties) && visit.properties.length
        ? visit.properties
        : visit.property
            ? [visit.property]
            : []
);

const getProjectProperties = (project) => (
    project.inventory?.map((item, index) => ({
        id: `${project.id}-${index}`,
        name: item.type,
        type: project.specs || project.configs?.join(', ') || 'Property',
        config: item.type,
        address: project.location,
        price: item.basePrice,
        size: item.size,
        availableUnits: item.availableUnits,
    })) || []
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
    const [selectedProjectId, setSelectedProjectId] = useState(mockProjects[0]?.id || null);
    const [selectedVisitId, setSelectedVisitId] = useState(visits[0]?.id || null);
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

    const projectCards = useMemo(() => mockProjects.map((project) => {
        const projectName = normalizeText(project.name);
        const allProjectVisits = visits.filter((visit) => normalizeText(getVisitProjectName(visit)) === projectName);
        const visibleVisits = filteredVisits.filter((visit) => normalizeText(getVisitProjectName(visit)) === projectName);
        const activeVisits = allProjectVisits.filter((visit) => !['Completed', 'Cancelled'].includes(visit.status));
        const projectProperties = getProjectProperties(project);

        return {
            ...project,
            visits: visibleVisits,
            allVisits: allProjectVisits,
            activeVisits,
            properties: projectProperties,
            propertyTotal: Math.max(
                projectProperties.length,
                allProjectVisits.reduce((total, visit) => total + getVisitPropertyCount(visit), 0),
            ),
        };
    }).filter((project) => (
        project.visits.length > 0
        || !searchQuery.trim()
        || [
            project.name,
            project.builder,
            project.location,
            project.specs,
            ...(project.configs || []),
        ].filter(Boolean).some((value) => normalizeText(value).includes(normalizeText(searchQuery)))
    )), [filteredVisits, searchQuery, visits]);

    const selectedProject = projectCards.find((project) => project.id === selectedProjectId) || projectCards[0] || null;
    const selectedProjectVisits = selectedProject?.visits || [];
    const selectedVisit = selectedProjectVisits.find((visit) => visit.id === selectedVisitId) || selectedProjectVisits[0] || null;
    const selectedProjectPropertyRows = selectedProjectVisits.length
        ? selectedProjectVisits.flatMap((visit) => getVisitProperties(visit).map((property, index) => ({ visit, property, id: `${visit.id}-${index}` })))
        : (selectedProject?.properties || []).map((property) => ({ visit: null, property, id: property.id }));

    const handleProjectSelect = (projectId) => {
        const nextProject = projectCards.find((project) => project.id === projectId);
        setSelectedProjectId(projectId);
        setSelectedVisitId(nextProject?.visits?.[0]?.id || null);
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
                                    const project = mockProjects.find((item) => normalizeText(item.name) === normalizeText(getVisitProjectName(slotVisit || {})));
                                    if (project) handleProjectSelect(project.id);
                                    setSelectedVisitId(slot.id);
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
                                        <Building2 className="h-4 w-4 text-[#3024E8]" /> Project Visits
                                    </h2>
                                    <p className="mt-0.5 text-xs font-semibold text-gray-500">Select a project first, then review each property visit inside it.</p>
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
                                        placeholder="Search projects, customer, officer, location..."
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

                        <div className="grid gap-3 p-3 xl:grid-cols-[320px_minmax(0,1fr)]">
                            <div className="space-y-2">
                                {projectCards.length === 0 ? (
                                    <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 p-4 text-center text-xs font-semibold text-gray-500">No matching projects found.</div>
                                ) : projectCards.map((project) => {
                                    const isSelected = selectedProject?.id === project.id;
                                    return (
                                        <button
                                            key={project.id}
                                            type="button"
                                            onClick={() => handleProjectSelect(project.id)}
                                            className={`w-full rounded-lg border p-3 text-left transition-all ${isSelected ? 'border-[#3024E8] bg-[#F7F5FF] shadow-sm ring-1 ring-[#3024E8]/15' : 'border-gray-200 bg-white hover:border-[#3024E8]/40 hover:bg-gray-50'}`}
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="min-w-0">
                                                    <p className="text-sm font-black leading-tight text-gray-950 break-words">{project.name}</p>
                                                    <p className="mt-1 text-xs font-semibold text-gray-500 break-words">{project.builder} - {project.location}</p>
                                                </div>
                                                <ChevronRight className={`mt-1 h-4 w-4 shrink-0 ${isSelected ? 'text-[#3024E8]' : 'text-gray-400'}`} />
                                            </div>
                                            <div className="mt-3 grid grid-cols-3 gap-1.5 text-center">
                                                <MiniCount label="Visits" value={project.allVisits.length} />
                                                <MiniCount label="Active" value={project.activeVisits.length} />
                                                <MiniCount label="Props" value={project.propertyTotal} />
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="min-w-0 space-y-3">
                                {selectedProject ? (
                                    <>
                                        <div className="rounded-lg border border-gray-200 bg-white p-3">
                                            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                                                <div className="min-w-0">
                                                    <p className="text-[10px] font-black uppercase text-[#3024E8]">Selected project</p>
                                                    <h3 className="mt-0.5 text-lg font-black tracking-tight text-gray-950 break-words">{selectedProject.name}</h3>
                                                    <p className="mt-1 flex items-start gap-1.5 text-xs font-semibold text-gray-500">
                                                        <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-400" />
                                                        <span className="break-words">{selectedProject.location}</span>
                                                    </p>
                                                </div>
                                                <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4 lg:w-[320px] lg:shrink-0">
                                                    <MiniCount label="Units" value={selectedProject.units} />
                                                    <MiniCount label="Available" value={selectedProject.available} />
                                                    <MiniCount label="Visits" value={selectedProject.allVisits.length} />
                                                    <MiniCount label="Properties" value={selectedProject.propertyTotal} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(300px,0.82fr)]">
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between gap-2">
                                                    <h3 className="text-xs font-black uppercase text-gray-500">Property visits</h3>
                                                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-black text-gray-600">{selectedProjectPropertyRows.length} items</span>
                                                </div>
                                                {selectedProjectPropertyRows.length === 0 ? (
                                                    <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 p-4 text-center text-xs font-semibold text-gray-500">No properties available for this project.</div>
                                                ) : selectedProjectPropertyRows.map(({ visit, property, id }) => {
                                                    const isSelected = selectedVisit?.id === visit?.id;
                                                    const sources = visit ? getVisitSources(visit) : [];
                                                    return (
                                                        <button
                                                            key={id}
                                                            type="button"
                                                            onClick={() => visit && setSelectedVisitId(visit.id)}
                                                            className={`w-full rounded-lg border bg-white p-3 text-left shadow-sm transition-all ${isSelected ? 'border-[#3024E8] ring-1 ring-[#3024E8]/15' : 'border-gray-200 hover:border-[#3024E8]/40'} ${!visit ? 'cursor-default' : ''}`}
                                                        >
                                                            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                                                <div className="min-w-0">
                                                                    <p className="text-sm font-black text-gray-950 break-words">{property.name || selectedProject.name}</p>
                                                                    <p className="mt-1 text-xs font-semibold text-gray-500 break-words">{property.config || property.type || selectedProject.specs}</p>
                                                                </div>
                                                                {visit ? getStatusBadge(visit.status) : <Badge variant="gray">No visit</Badge>}
                                                            </div>
                                                            <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                                                                <DetailChip label="Customer" value={visit?.customerName || 'Not scheduled'} />
                                                                <DetailChip label="Slot" value={visit ? `${visit.date} - ${visit.time}` : 'No slot'} />
                                                                <DetailChip label="Officer" value={visit?.officerName || 'Unassigned'} />
                                                                <DetailChip label="Price" value={property.price || 'Price on request'} />
                                                            </div>
                                                            {visit && (
                                                                <div className="mt-3 flex flex-wrap gap-1.5">
                                                                    {(Array.isArray(sources) ? sources : [sources]).map((source) => (
                                                                        <span key={source} className="rounded bg-blue-50 px-1.5 py-0.5 text-[9px] font-black uppercase text-[#3024E8]">{source}</span>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </button>
                                                    );
                                                })}
                                            </div>

                                            <div className="min-w-0 space-y-3">
                                                {!selectedVisit ? (
                                                    <Card className="flex min-h-[220px] flex-col items-center justify-center border-2 border-dashed border-gray-200 bg-gray-50 text-center">
                                                        <Calendar className="mb-2 h-9 w-9 text-gray-300" />
                                                        <h3 className="text-sm font-black text-gray-700">No visit selected</h3>
                                                        <p className="mt-1 max-w-sm text-xs font-semibold text-gray-500">This project has inventory, but no matching property visit for the current filters.</p>
                                                    </Card>
                                                ) : (
                                                    <Card noPadding className="overflow-hidden border-gray-200 shadow-sm">
                                                        <div className="border-b border-gray-100 bg-white p-3">
                                                            <div className="flex flex-col gap-2">
                                                                <div>
                                                                    <div className="flex flex-wrap items-center gap-1.5">
                                                                        <h2 className="text-lg font-black text-gray-950 break-words">Visit #{selectedVisit.id}</h2>
                                                                        {getStatusBadge(selectedVisit.status)}
                                                                    </div>
                                                                    <p className="mt-1 flex flex-wrap items-center gap-2 text-xs font-semibold text-gray-500">
                                                                        <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5 text-gray-400" /> {selectedVisit.date}</span>
                                                                        <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-gray-400" /> {selectedVisit.time}</span>
                                                                    </p>
                                                                </div>
                                                                <div className="flex flex-wrap gap-1.5">
                                                                    <Button variant="secondary" icon={Edit2} onClick={() => openEditModal(selectedVisit)} className="px-2.5 py-1.5 text-xs shadow-sm border-gray-300 hover:bg-gray-100 text-gray-700">Edit</Button>
                                                                    {selectedVisit.status === 'Scheduled' && (
                                                                        <>
                                                                            <Button variant="success" icon={CheckCircle2} onClick={() => handleUpdateStatus(selectedVisit.id, 'Completed')} className="px-2.5 py-1.5 text-xs shadow-sm">Complete</Button>
                                                                            <Button variant="secondary" icon={Clock} onClick={() => openEditModal(selectedVisit)} className="px-2.5 py-1.5 text-xs shadow-sm border-gray-300 hover:bg-gray-100 text-gray-700">Reschedule</Button>
                                                                            <Button variant="danger" icon={XCircle} onClick={() => handleUpdateStatus(selectedVisit.id, 'Cancelled')} className="px-2.5 py-1.5 text-xs shadow-sm">Cancel</Button>
                                                                        </>
                                                                    )}
                                                                    {selectedVisit.status === 'Completed' && (
                                                                        <Button variant="primary" icon={TrendingUp} className="px-2.5 py-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 shadow-md">Convert to Deal</Button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="space-y-3 bg-gray-50/50 p-3">
                                                            <div className="grid gap-2 sm:grid-cols-2">
                                                                <InfoCard title="Customer" name={selectedVisit.customerName} phone={selectedVisit.customerPhone} icon={User} color="blue" />
                                                                <InfoCard title="Assigned Officer" name={selectedVisit.officerName} phone={selectedVisit.officerPhone} icon={HardHat} color="purple" />
                                                            </div>

                                                            <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
                                                                <h3 className="mb-3 flex items-center gap-2 text-sm font-black text-gray-800">
                                                                    <Building2 className="h-4 w-4 text-gray-400" /> Property details
                                                                </h3>
                                                                <div className="grid gap-2 text-xs font-bold text-gray-700 sm:grid-cols-2">
                                                                    <DetailBlock label="Property" value={selectedVisit.property?.name} />
                                                                    <DetailBlock label="Configuration" value={selectedVisit.property?.config} />
                                                                    <DetailBlock label="Type" value={selectedVisit.property?.type} />
                                                                    <DetailBlock label="Price" value={selectedVisit.property?.price} />
                                                                    <DetailBlock label="Address" value={selectedVisit.property?.address} wide />
                                                                </div>
                                                            </div>

                                                            <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
                                                                <h3 className="mb-3 flex items-center gap-2 text-sm font-black text-gray-800">
                                                                    <FileText className="h-4 w-4 text-gray-400" /> Visit notes and follow-up
                                                                </h3>
                                                                <div className="mb-3 rounded-md border border-amber-100 bg-amber-50/50 p-3">
                                                                    <p className="whitespace-pre-wrap break-words text-xs text-gray-700">{selectedVisit.notes || 'No notes yet.'}</p>
                                                                </div>
                                                                {selectedVisit.status !== 'Cancelled' && (
                                                                    <div className="flex flex-col gap-2 border-t border-gray-100 pt-3">
                                                                        <label className="text-[10px] font-bold uppercase text-gray-500">Add internal update</label>
                                                                        <textarea value={newNote} onChange={(event) => setNewNote(event.target.value)} rows="2" className="w-full rounded-md border border-gray-300 p-2 text-xs font-medium outline-none focus:ring-2 focus:ring-[#6F4BFF]/50" />
                                                                        <Button onClick={handleAddNote} icon={Save} className="w-full justify-center px-2.5 py-1.5 text-xs shadow-sm sm:w-fit">Save Note</Button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </Card>
                                                )}

                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 p-4 text-center text-xs font-semibold text-gray-500">Select a project to see property visits.</div>
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
