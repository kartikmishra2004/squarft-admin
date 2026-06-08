import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    AlertCircle, ArrowRight, ArrowUpRight, Calendar, ClipboardCheck,
    Clock, MapPin, PhoneCall, Plus, Save, Search, ThumbsDown, ThumbsUp, UserCheck, X, Zap
} from 'lucide-react';
import {
    addClient,
    addClientMeeting,
    addClientNote,
    logClientFeedback,
    updateClient,
} from '../../store/clientsSlice';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Header from '../../components/layout/Header';

const clientFormInitialState = {
    name: '',
    phone: '',
    budget: '',
    listingType: 'Buy',
    listingKind: 'Residential',
    propType: 'APARTMENT/FLATS',
    bhk: '3BHK',
    location: '',
    officer: 'Neha K.',
    status: 'Active',
    score: 'Warm',
    nextFollowUp: '',
    latestNote: '',
};

const meetingInitialState = {
    date: '',
    time: '',
    remarks: '',
};

const getStatusBadge = (status) => {
    if (['Active', 'Completed'].includes(status)) return <Badge variant="green">{status}</Badge>;
    if (['Negotiating', 'Pending'].includes(status)) return <Badge variant="yellow">{status}</Badge>;
    if (status === 'Suspended') return <Badge variant="gray">{status}</Badge>;
    return <Badge variant="purple">{status}</Badge>;
};

const getNowStamp = () => ({
    date: new Date().toLocaleDateString('en-IN'),
    time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
});

const Clients = () => {
    const dispatch = useDispatch();
    const { clients } = useSelector((state) => state.clients);
    const [isAddClientOpen, setIsAddClientOpen] = useState(false);
    const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
    const [selectedActionClientId, setSelectedActionClientId] = useState(null);
    const [selectedClientId, setSelectedClientId] = useState(null);
    const [activeTab, setActiveTab] = useState('All');
    const [dateFilter, setDateFilter] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [feedbackState, setFeedbackState] = useState({ interest: 'Interested', notes: '' });
    const [clientForm, setClientForm] = useState(clientFormInitialState);
    const [profileNote, setProfileNote] = useState('');
    const [meetingForm, setMeetingForm] = useState(meetingInitialState);

    const selectedClient = clients.find((client) => client.id === selectedClientId);
    const selectedActionClient = clients.find((client) => client.id === selectedActionClientId);

    const officers = useMemo(() => (
        Array.from(new Set([...clients.map((client) => client.officer), 'Neha K.', 'Ravi T.', 'Rahul M.', 'Sneha P.'].filter(Boolean)))
    ), [clients]);

    const filteredClients = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        return clients.filter((client) => {
            const matchTab = activeTab === 'All' ||
                (activeTab === 'Hot' && client.score === 'Hot') ||
                (activeTab === 'Cold' && client.score === 'Cold') ||
                (activeTab === 'Suspended' && client.status === 'Suspended');
            const matchDate = dateFilter ? client.nextFollowUp === dateFilter : true;
            const matchSearch = !query || [client.name, client.phone, client.budget, client.propType, client.latestNote, client.officer]
                .filter(Boolean)
                .some((value) => String(value).toLowerCase().includes(query));

            return matchTab && matchDate && matchSearch;
        });
    }, [activeTab, clients, dateFilter, searchQuery]);

    const todaysVisits = clients.filter((client) => client.visitToday);
    const actionRequiredClients = clients.filter((client) => client.actionRequired);

    const createClientId = () => {
        const nextNumber = clients.reduce((max, client) => {
            const clientNumber = Number(String(client.id).replace(/\D/g, '')) || 0;
            return Math.max(max, clientNumber);
        }, 0) + 1;
        return `C${String(nextNumber).padStart(3, '0')}`;
    };

    const updateClientForm = (field, value) => {
        setClientForm((current) => ({ ...current, [field]: value }));
    };

    const handleRegisterClient = (event) => {
        event.preventDefault();
        const now = getNowStamp();
        const newClient = {
            id: createClientId(),
            name: clientForm.name.trim(),
            phone: clientForm.phone.trim(),
            budget: clientForm.budget.trim(),
            listingType: clientForm.listingType,
            listingKind: clientForm.listingKind,
            propType: clientForm.propType,
            date: now.date,
            time: now.time,
            req: {
                type: clientForm.listingKind,
                bhk: [clientForm.bhk],
                loc: [clientForm.location || 'Location pending'],
                timeline: '30 Days',
            },
            status: clientForm.status,
            officer: clientForm.officer,
            score: clientForm.score,
            visitToday: false,
            nextFollowUp: clientForm.nextFollowUp,
            latestNote: clientForm.latestNote || 'Client registered from Clients Hub.',
            actionRequired: false,
            propertyPipeline: [],
            timeline: [{ title: 'Client Registered', details: 'Client created from Clients Hub', date: now.date, time: now.time }],
            notes: clientForm.latestNote ? [{ text: clientForm.latestNote, date: now.date, time: now.time }] : [],
            meetings: [],
        };

        dispatch(addClient(newClient));
        setClientForm(clientFormInitialState);
        setIsAddClientOpen(false);
    };

    const handleLogFeedback = (client, event) => {
        event.stopPropagation();
        setSelectedActionClientId(client.id);
        setFeedbackState({ interest: 'Interested', notes: '' });
        setFeedbackModalOpen(true);
    };

    const handleFeedbackSubmit = (event) => {
        event.preventDefault();
        if (!selectedActionClient || !feedbackState.notes.trim()) return;

        dispatch(logClientFeedback({
            id: selectedActionClient.id,
            interest: feedbackState.interest,
            notes: feedbackState.notes.trim(),
        }));
        setFeedbackModalOpen(false);
        setSelectedActionClientId(null);
        setFeedbackState({ interest: 'Interested', notes: '' });
    };

    const handleProfileChange = (field, value) => {
        if (!selectedClient) return;
        dispatch(updateClient({ id: selectedClient.id, changes: { [field]: value } }));
    };

    const handleAddProfileNote = (event) => {
        event.preventDefault();
        if (!selectedClient || !profileNote.trim()) return;
        dispatch(addClientNote({
            id: selectedClient.id,
            note: { text: profileNote.trim(), ...getNowStamp() },
        }));
        setProfileNote('');
    };

    const handleScheduleMeeting = (event) => {
        event.preventDefault();
        if (!selectedClient || !meetingForm.date || !meetingForm.time) return;
        dispatch(addClientMeeting({
            id: selectedClient.id,
            meeting: {
                date: meetingForm.date,
                time: meetingForm.time,
                remarks: meetingForm.remarks || 'Client follow-up scheduled.',
            },
        }));
        setMeetingForm(meetingInitialState);
    };

    if (selectedClient) {
        return (
            <div className="flex-1 flex flex-col h-full relative bg-[#F5F6FA] font-sans text-gray-900">
                <Header title="Client Profile" showBack onBack={() => setSelectedClientId(null)} />
                <main className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth">
                    <div className="max-w-[1600px] mx-auto space-y-6">
                        <Card noPadding className="bg-linear-to-r from-white to-[#6F4BFF]/5 relative overflow-hidden animate-in fade-in duration-300">
                            <div className="p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                                <div className="flex gap-6">
                                    <div className="w-20 h-20 rounded-2xl bg-[#6F4BFF] text-white flex items-center justify-center text-3xl font-black shadow-xl shadow-[#6F4BFF]/20">
                                        {selectedClient.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="flex flex-wrap items-center gap-3 mb-1.5">
                                            <h2 className="text-3xl font-black text-gray-900 tracking-tight">{selectedClient.name}</h2>
                                            {getStatusBadge(selectedClient.status)}
                                            <Badge variant={selectedClient.score === 'Hot' ? 'red' : selectedClient.score === 'Cold' ? 'blue' : 'purple'}>{selectedClient.score}</Badge>
                                        </div>
                                        <p className="text-gray-500 font-bold">{selectedClient.phone} - Added on {selectedClient.date}</p>
                                        <div className="flex flex-wrap gap-2 mt-4">
                                            <Badge variant="gray" className="bg-white border border-gray-100 shadow-sm font-bold uppercase tracking-wider">{selectedClient.req.type}</Badge>
                                            {(selectedClient.req.bhk || []).map((bhk) => (
                                                <Badge key={bhk} variant="gray" className="bg-white border border-gray-100 shadow-sm font-bold uppercase tracking-wider">{bhk}</Badge>
                                            ))}
                                            <Badge variant="purple" className="font-bold uppercase tracking-wider shadow-sm">AI Matching Enabled</Badge>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-left md:text-right p-6 bg-white/40 backdrop-blur-md rounded-2xl border border-white/60 shadow-sm">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Approved Budget</p>
                                    <p className="text-4xl font-black text-emerald-600 tracking-tighter">{selectedClient.budget}</p>
                                    <p className="text-xs text-gray-500 mt-2 font-bold">Assigned to: <span className="text-gray-900 bg-gray-100 px-2 py-0.5 rounded-lg">{selectedClient.officer}</span></p>
                                </div>
                            </div>
                        </Card>

                        <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6">
                            <div className="space-y-6">
                                <Card>
                                    <h3 className="text-lg font-black text-gray-900 mb-4">Client Controls</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Status</label>
                                            <select value={selectedClient.status} onChange={(event) => handleProfileChange('status', event.target.value)} className="w-full mt-2 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 font-bold bg-white">
                                                <option>Active</option>
                                                <option>Negotiating</option>
                                                <option>Pending</option>
                                                <option>Completed</option>
                                                <option>Suspended</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Score</label>
                                            <select value={selectedClient.score} onChange={(event) => handleProfileChange('score', event.target.value)} className="w-full mt-2 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 font-bold bg-white">
                                                <option>Hot</option>
                                                <option>Warm</option>
                                                <option>Cold</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Officer</label>
                                            <select value={selectedClient.officer} onChange={(event) => handleProfileChange('officer', event.target.value)} className="w-full mt-2 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 font-bold bg-white">
                                                {officers.map((officer) => <option key={officer}>{officer}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </Card>

                                <Card>
                                    <h3 className="text-lg font-black text-gray-900 mb-4">Notes & Follow-up</h3>
                                    <form onSubmit={handleAddProfileNote} className="space-y-3">
                                        <textarea rows="3" value={profileNote} onChange={(event) => setProfileNote(event.target.value)} className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 text-sm font-medium" placeholder="Add a client note..." />
                                        <div className="flex justify-end">
                                            <Button type="submit" icon={Save}>Save Note</Button>
                                        </div>
                                    </form>
                                    <div className="mt-5 space-y-3">
                                        {(selectedClient.notes || []).map((note, index) => (
                                            <div key={`${note.date}-${note.time}-${index}`} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                                                <p className="text-sm font-bold text-gray-800">{note.text}</p>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">{note.date} - {note.time}</p>
                                            </div>
                                        ))}
                                    </div>
                                </Card>

                                <Card>
                                    <h3 className="text-lg font-black text-gray-900 mb-4">Activity Timeline</h3>
                                    <div className="space-y-3">
                                        {(selectedClient.timeline || []).map((item, index) => (
                                            <div key={`${item.title}-${index}`} className="rounded-xl border border-gray-100 p-4 bg-white">
                                                <div className="flex items-center justify-between gap-3">
                                                    <p className="font-black text-gray-900">{item.title}</p>
                                                    <span className="text-xs font-bold text-gray-400">{item.date} {item.time}</span>
                                                </div>
                                                <p className="text-sm font-medium text-gray-600 mt-1">{item.details}</p>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            </div>

                            <div className="space-y-6">
                                <Card>
                                    <h3 className="text-lg font-black text-gray-900 mb-4">Schedule Follow-up</h3>
                                    <form onSubmit={handleScheduleMeeting} className="space-y-4">
                                        <input type="date" required value={meetingForm.date} onChange={(event) => setMeetingForm({ ...meetingForm, date: event.target.value })} className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 font-bold" />
                                        <input type="time" required value={meetingForm.time} onChange={(event) => setMeetingForm({ ...meetingForm, time: event.target.value })} className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 font-bold" />
                                        <textarea rows="3" value={meetingForm.remarks} onChange={(event) => setMeetingForm({ ...meetingForm, remarks: event.target.value })} className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 text-sm font-medium" placeholder="Meeting remarks" />
                                        <Button type="submit" icon={Calendar} className="w-full">Schedule</Button>
                                    </form>
                                </Card>

                                <Card>
                                    <h3 className="text-lg font-black text-gray-900 mb-4">Meetings</h3>
                                    <div className="space-y-3">
                                        {(selectedClient.meetings || []).length === 0 && <p className="text-sm font-bold text-gray-400">No meetings scheduled.</p>}
                                        {(selectedClient.meetings || []).map((meeting, index) => (
                                            <div key={`${meeting.date}-${meeting.time}-${index}`} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                                                <p className="font-black text-gray-900">{meeting.date} at {meeting.time}</p>
                                                <p className="text-sm font-medium text-gray-600 mt-1">{meeting.remarks}</p>
                                            </div>
                                        ))}
                                    </div>
                                </Card>

                                <Card>
                                    <h3 className="text-lg font-black text-gray-900 mb-4">Property Pipeline</h3>
                                    <div className="space-y-3">
                                        {(selectedClient.propertyPipeline || []).length === 0 && <p className="text-sm font-bold text-gray-400">No properties assigned yet.</p>}
                                        {(selectedClient.propertyPipeline || []).map((property, index) => (
                                            <div key={`${property.projectId}-${index}`} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                                                <p className="font-black text-gray-900">{property.projectId}</p>
                                                <p className="text-sm font-bold text-[#6F4BFF] mt-1">{property.status}</p>
                                                <p className="text-xs font-medium text-gray-600 mt-1">{property.notes}</p>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-full relative bg-[#F5F6FA] font-sans text-gray-900">
            <Header title="Clients Hub" />

            <main className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth">
                <div className="max-w-[1600px] mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    {actionRequiredClients.length > 0 && (
                        <Card className="border-l-4 border-l-amber-500 bg-linear-to-r from-amber-50 to-white shadow-md">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-amber-100 rounded-lg text-amber-600"><AlertCircle className="w-6 h-6" /></div>
                                <div>
                                    <h3 className="text-lg font-black text-gray-900 tracking-tight">Action Required: Post-Visit Feedback</h3>
                                    <p className="text-xs font-bold text-gray-500 uppercase">Site visits are complete. Log feedback to process them to the next stage.</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                {actionRequiredClients.map((client) => (
                                    <div key={client.id} className="bg-white p-5 rounded-xl border border-amber-200 shadow-sm flex flex-col justify-between">
                                        <div>
                                            <h4 className="font-bold text-gray-900 flex items-center gap-2 mb-2">{client.name} <Badge variant="yellow">Pending Processing</Badge></h4>
                                            <p className="text-sm font-medium text-gray-600 mb-4">{client.actionDetails}</p>
                                        </div>
                                        <Button variant="primary" className="w-full bg-amber-500 hover:bg-amber-600 shadow-amber-500/30" icon={ClipboardCheck} onClick={(event) => handleLogFeedback(client, event)}>
                                            Log Client Feedback
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}

                    {todaysVisits.length > 0 && (
                        <Card className="border-l-4 border-l-emerald-500 bg-linear-to-r from-emerald-50 to-white">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600"><MapPin className="w-5 h-5" /></div>
                                <div>
                                    <h3 className="text-lg font-black text-gray-900 tracking-tight">Today's Site Visits</h3>
                                    <p className="text-xs font-bold text-gray-500 uppercase">Clients scheduled for viewing today</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                {todaysVisits.map((visit) => (
                                    <div key={visit.id} onClick={() => setSelectedClientId(visit.id)} className="bg-white p-4 rounded-xl border border-emerald-100 shadow-sm cursor-pointer hover:shadow-md hover:border-emerald-300 transition-all group">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h4 className="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors flex items-center gap-2">{visit.name} <Badge variant="green"># {visit.id}</Badge></h4>
                                                <p className="text-xs font-medium text-gray-500 flex items-center gap-1 mt-1"><PhoneCall className="w-3 h-3" /> {visit.phone}</p>
                                            </div>
                                            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                                <ArrowUpRight className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                            </div>
                                        </div>
                                        <div className="mt-3 pt-3 border-t border-gray-50 text-xs font-medium text-gray-600 line-clamp-2">
                                            <span className="font-bold text-gray-800">Note:</span> {visit.latestNote}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}

                    <Card noPadding>
                        <div className="p-6 border-b border-gray-100 bg-white space-y-5">
                            <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Active Clients Hub</h2>
                                    <p className="text-sm font-medium text-gray-500 mt-1">Manage pipeline and track follow-ups for your assigned clients.</p>
                                </div>
                                <div className="flex flex-col gap-3 sm:flex-row">
                                    <div className="relative">
                                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                        <input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} className="w-full sm:w-72 pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-[#6F4BFF]/30" placeholder="Search clients..." />
                                    </div>
                                    <Button icon={Plus} onClick={() => setIsAddClientOpen(true)} className="shadow-md shadow-[#6F4BFF]/20">Register New Client</Button>
                                </div>
                            </div>

                            <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 bg-gray-50/80 p-2.5 rounded-xl border border-gray-200">
                                <div className="flex gap-2 overflow-x-auto hide-scrollbar">
                                    {['All', 'Hot', 'Cold', 'Suspended'].map((tab) => {
                                        const selected = activeTab === tab;
                                        const activeClass = tab === 'Hot' ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30 border-transparent' :
                                            tab === 'Cold' ? 'bg-blue-500 text-white shadow-md shadow-blue-500/30 border-transparent' :
                                                tab === 'Suspended' ? 'bg-gray-800 text-white shadow-md shadow-gray-800/30 border-transparent' :
                                                    'bg-[#6F4BFF] text-white shadow-md shadow-[#6F4BFF]/30 border-transparent';
                                        return (
                                            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-5 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${selected ? activeClass : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}>
                                                {tab === 'Hot' && selected && <Zap className="w-4 h-4 inline mr-1.5" />}
                                                {tab} Clients
                                            </button>
                                        );
                                    })}
                                </div>

                                <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm shrink-0">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                                        <Calendar className="w-3.5 h-3.5" /> Follow-up Date:
                                    </label>
                                    <input type="date" value={dateFilter} onChange={(event) => setDateFilter(event.target.value)} className="border-none bg-transparent text-sm font-bold text-gray-800 outline-none cursor-pointer" />
                                    {dateFilter && (
                                        <button onClick={() => setDateFilter('')} className="p-1 hover:bg-rose-50 rounded-md text-rose-500 transition-colors ml-1">
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto min-h-[400px]">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-white border-b border-gray-100">
                                        {['CLIENT NO. & INFO', 'REQUIREMENT', 'CURRENT STATUS & NOTES', 'NEXT FOLLOW-UP', 'ACTION'].map((header) => (
                                            <th key={header} className={`px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest ${header === 'ACTION' ? 'text-center' : ''}`}>{header}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredClients.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-16 text-center">
                                                <Search className="w-12 h-12 text-gray-200 mb-3 mx-auto" />
                                                <p className="text-gray-500 font-bold text-lg">No clients found</p>
                                                <p className="text-gray-400 text-sm mt-1">Try adjusting your filters or date selection.</p>
                                            </td>
                                        </tr>
                                    ) : filteredClients.map((row) => (
                                        <tr key={row.id} onClick={() => setSelectedClientId(row.id)} className="hover:bg-[#6F4BFF]/5 transition-colors cursor-pointer group bg-white">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500 border border-gray-200 shrink-0">{row.name.charAt(0)}</div>
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="font-bold text-gray-900 text-base group-hover:text-[#6F4BFF] transition-colors">{row.name}</span>
                                                            <Badge variant="gray" className="text-[10px]">#{row.id}</Badge>
                                                            {row.score === 'Hot' && <Badge variant="red" className="shadow-sm">Hot</Badge>}
                                                            {row.score === 'Cold' && <Badge variant="blue" className="shadow-sm">Cold</Badge>}
                                                        </div>
                                                        <div className="text-xs font-medium text-gray-500 flex items-center gap-1.5"><PhoneCall className="w-3 h-3" /> {row.phone}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <p className="text-sm font-bold text-gray-800">{row.budget}</p>
                                                <p className="text-xs text-gray-500 mt-0.5">{row.propType}</p>
                                            </td>
                                            <td className="px-6 py-5 max-w-xs">
                                                <div className="mb-2">{getStatusBadge(row.status)}</div>
                                                <p className="text-xs font-medium text-gray-600 line-clamp-2" title={row.latestNote}>
                                                    <span className="font-bold text-gray-800">Latest Note:</span> {row.latestNote || 'No recent notes.'}
                                                </p>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-2 text-sm font-bold text-gray-800">
                                                    <Calendar className="w-4 h-4 text-[#6F4BFF]" />
                                                    {row.nextFollowUp || 'Not Scheduled'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <button className="w-8 h-8 rounded-lg bg-gray-100 text-gray-500 inline-flex items-center justify-center group-hover:bg-[#6F4BFF] group-hover:text-white transition-all shadow-sm">
                                                    <ArrowRight className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            </main>

            <Modal isOpen={isAddClientOpen} onClose={() => setIsAddClientOpen(false)} title="Register New Client">
                <form onSubmit={handleRegisterClient} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Client Name</label>
                            <input required value={clientForm.name} onChange={(event) => updateClientForm('name', event.target.value)} className="w-full mt-2 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 font-bold" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Phone</label>
                            <input required value={clientForm.phone} onChange={(event) => updateClientForm('phone', event.target.value)} className="w-full mt-2 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 font-bold" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Budget</label>
                            <input required value={clientForm.budget} onChange={(event) => updateClientForm('budget', event.target.value)} className="w-full mt-2 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 font-bold" placeholder="1 Cr - 2 Cr" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Location</label>
                            <input value={clientForm.location} onChange={(event) => updateClientForm('location', event.target.value)} className="w-full mt-2 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 font-bold" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Property Type</label>
                            <select value={clientForm.propType} onChange={(event) => updateClientForm('propType', event.target.value)} className="w-full mt-2 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 font-bold bg-white">
                                <option>APARTMENT/FLATS</option>
                                <option>VILLA PLOTS</option>
                                <option>COMMERCIAL</option>
                                <option>PLOT</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">BHK</label>
                            <input value={clientForm.bhk} onChange={(event) => updateClientForm('bhk', event.target.value)} className="w-full mt-2 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 font-bold" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Officer</label>
                            <select value={clientForm.officer} onChange={(event) => updateClientForm('officer', event.target.value)} className="w-full mt-2 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 font-bold bg-white">
                                {officers.map((officer) => <option key={officer}>{officer}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Status</label>
                            <select value={clientForm.status} onChange={(event) => updateClientForm('status', event.target.value)} className="w-full mt-2 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 font-bold bg-white">
                                <option>Active</option>
                                <option>Negotiating</option>
                                <option>Pending</option>
                                <option>Suspended</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Score</label>
                            <select value={clientForm.score} onChange={(event) => updateClientForm('score', event.target.value)} className="w-full mt-2 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 font-bold bg-white">
                                <option>Hot</option>
                                <option>Warm</option>
                                <option>Cold</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Follow-up</label>
                            <input type="date" value={clientForm.nextFollowUp} onChange={(event) => updateClientForm('nextFollowUp', event.target.value)} className="w-full mt-2 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 font-bold" />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Initial Note</label>
                        <textarea rows="3" value={clientForm.latestNote} onChange={(event) => updateClientForm('latestNote', event.target.value)} className="w-full mt-2 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 text-sm font-medium" />
                    </div>
                    <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                        <Button variant="secondary" onClick={() => setIsAddClientOpen(false)}>Cancel</Button>
                        <Button type="submit" icon={UserCheck}>Create Client</Button>
                    </div>
                </form>
            </Modal>

            <Modal isOpen={feedbackModalOpen} onClose={() => setFeedbackModalOpen(false)} title="Log Post-Visit Feedback & Process">
                {selectedActionClient && (
                    <form className="space-y-5" onSubmit={handleFeedbackSubmit}>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
                            <p className="text-sm font-bold text-gray-900">{selectedActionClient.name}</p>
                            <p className="text-xs font-medium text-gray-600 mt-1">{selectedActionClient.actionDetails}</p>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Client Interest Level</label>
                            <div className="grid grid-cols-3 gap-3 mt-2">
                                {[
                                    { value: 'Interested', icon: ThumbsUp, text: 'Interested' },
                                    { value: 'Needs Time', icon: Clock, text: 'Needs Time' },
                                    { value: 'Not Interested', icon: ThumbsDown, text: 'Not Interested' },
                                ].map(({ value, icon: Icon, text }) => (
                                    <button key={value} type="button" onClick={() => setFeedbackState({ ...feedbackState, interest: value })} className={`p-4 border rounded-xl flex flex-col items-center justify-center gap-2 transition-all shadow-sm ${feedbackState.interest === value ? 'border-[#6F4BFF] bg-[#6F4BFF]/10 text-[#6F4BFF] ring-2 ring-[#6F4BFF]/20' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                                        <Icon className="w-6 h-6" /> <span className="text-xs font-bold text-center leading-tight">{text}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Follow-up Notes & Insights</label>
                            <textarea rows="4" value={feedbackState.notes} onChange={(event) => setFeedbackState({ ...feedbackState, notes: event.target.value })} className="w-full mt-2 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 text-sm font-medium" required></textarea>
                        </div>
                        <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                            <Button variant="secondary" onClick={() => setFeedbackModalOpen(false)}>Cancel</Button>
                            <Button type="submit" icon={ClipboardCheck} className="shadow-md">Update Pipeline</Button>
                        </div>
                    </form>
                )}
            </Modal>
        </div>
    );
};

export default Clients;
