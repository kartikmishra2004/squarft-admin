import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    ArrowLeft,
    Calendar,
    Filter,
    Mail,
    MapPin,
    PhoneCall,
    Plus,
    Save,
    Search,
    UserCheck,
} from 'lucide-react';
import { addLead, updateLead as updateLeadRecord } from '../../store/leadsSlice';
import { qualifyLeadToClient } from '../../store/clientsSlice';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Header from '../../components/layout/Header';

const leadFormInitialState = {
    name: '',
    phone: '',
    email: '',
    budget: '',
    req: '',
    location: '',
    status: 'New',
    officer: 'Neha K.',
    score: 'Warm',
    nextAction: 'First Contact Call',
    nextActionDate: 'Today',
};

const filterInitialState = {
    query: '',
    status: 'All',
    score: 'All',
    officer: 'All',
};

const getStatusBadge = (status) => {
    if (status === 'New') return <Badge variant="purple">{status}</Badge>;
    if (status === 'Follow Up') return <Badge variant="yellow">{status}</Badge>;
    if (status === 'Contacted') return <Badge variant="blue">{status}</Badge>;
    if (status === 'Qualified') return <Badge variant="green">{status}</Badge>;
    return <Badge variant="gray">{status}</Badge>;
};

const formatLeadDate = () => {
    const today = new Date();
    return today.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
};

const Leads = () => {
    const dispatch = useDispatch();
    const { leads } = useSelector((state) => state.leads);
    const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [leadForm, setLeadForm] = useState(leadFormInitialState);
    const [filters, setFilters] = useState(filterInitialState);
    const [selectedLead, setSelectedLead] = useState(null);
    const [followUpNote, setFollowUpNote] = useState('');

    const officers = useMemo(() => (
        Array.from(new Set([...leads.map((lead) => lead.officer), 'Neha K.', 'Ravi T.', 'Rahul M.', 'Sneha P.']))
    ), [leads]);

    const visibleLeads = useMemo(() => {
        const query = filters.query.trim().toLowerCase();

        return leads.filter((lead) => {
            const matchesQuery = !query || [lead.name, lead.phone, lead.email, lead.budget, lead.req, lead.location]
                .filter(Boolean)
                .some((value) => String(value).toLowerCase().includes(query));
            const matchesStatus = filters.status === 'All' || lead.status === filters.status;
            const matchesScore = filters.score === 'All' || lead.score === filters.score;
            const matchesOfficer = filters.officer === 'All' || lead.officer === filters.officer;

            return matchesQuery && matchesStatus && matchesScore && matchesOfficer;
        });
    }, [filters, leads]);

    const updateLeadForm = (field, value) => {
        setLeadForm((current) => ({ ...current, [field]: value }));
    };

    const updateFilters = (field, value) => {
        setFilters((current) => ({ ...current, [field]: value }));
    };

    const createLeadId = () => {
        const nextNumber = leads.reduce((max, lead) => {
            const leadNumber = Number(String(lead.id).replace(/\D/g, '')) || 0;
            return Math.max(max, leadNumber);
        }, 0) + 1;
        return `L${String(nextNumber).padStart(3, '0')}`;
    };

    const handleAddLead = (event) => {
        event.preventDefault();

        const newLead = {
            ...leadForm,
            id: createLeadId(),
            name: leadForm.name.trim(),
            phone: leadForm.phone.trim(),
            email: leadForm.email.trim(),
            budget: leadForm.budget.trim(),
            req: leadForm.req.trim(),
            location: leadForm.location.trim(),
            date: formatLeadDate(),
            timeline: [
                {
                    type: 'System',
                    date: `${formatLeadDate()}, ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`,
                    note: 'Lead manually added from admin pipeline.',
                    agent: leadForm.officer,
                },
            ],
        };

        dispatch(addLead(newLead));
        setLeadForm(leadFormInitialState);
        setIsAddLeadOpen(false);
    };

    const updateLead = (leadId, updater) => {
        const existingLead = leads.find((lead) => lead.id === leadId) || selectedLead;
        if (!existingLead) return;

        const nextLead = typeof updater === 'function' ? updater(existingLead) : { ...existingLead, ...updater };
        dispatch(updateLeadRecord({ id: leadId, changes: nextLead }));
        if (selectedLead?.id === leadId) {
            setSelectedLead(nextLead);
        }
    };

    const createTimelineEntry = (lead, type, note) => ({
        type,
        date: `${formatLeadDate()}, ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`,
        note,
        agent: lead.officer,
    });

    const handleStatusChange = (lead, status) => {
        updateLead(lead.id, {
            status,
            timeline: [
                createTimelineEntry(lead, status, `Lead marked as ${status}.`),
                ...(lead.timeline || []),
            ],
        });
    };

    const handleQualifyLead = (lead) => {
        dispatch(qualifyLeadToClient(lead));
        updateLead(lead.id, {
            status: 'Qualified',
            nextAction: 'Move to client requirement',
            nextActionDate: 'Today',
            timeline: [
                createTimelineEntry(lead, 'Qualified', 'Lead qualified and added to Client Hub.'),
                ...(lead.timeline || []),
            ],
        });
    };

    const handleAssignOfficer = (leadId, officer) => {
        const lead = leads.find((item) => item.id === leadId) || selectedLead;
        if (!lead) return;
        updateLead(leadId, {
            officer,
            timeline: [
                createTimelineEntry({ ...lead, officer }, 'Assigned', `Lead assigned to ${officer}.`),
                ...(lead.timeline || []),
            ],
        });
    };

    const handleAddFollowUpNote = (event) => {
        event.preventDefault();
        if (!selectedLead || !followUpNote.trim()) return;

        updateLead(selectedLead.id, {
            status: 'Follow Up',
            nextAction: followUpNote.trim(),
            nextActionDate: 'Today',
            timeline: [
                createTimelineEntry(selectedLead, 'FollowUp', followUpNote.trim()),
                ...(selectedLead.timeline || []),
            ],
        });
        setFollowUpNote('');
    };

    return (
        <div className="flex-1 flex flex-col h-full relative bg-[#F5F6FA] font-sans text-gray-900">
            <Header title="Leads Pipeline" />

            <main className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth">
                <div className="max-w-[1600px] mx-auto space-y-5">
                    <Card noPadding className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="p-6 border-b border-gray-100 flex flex-col gap-4 bg-white lg:flex-row lg:justify-between lg:items-center">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">Raw Leads Pipeline</h2>
                                <p className="text-sm text-gray-500 mt-1">Manage and nurture inquiries until they become qualified clients.</p>
                            </div>
                            <div className="flex flex-col gap-3 sm:flex-row">
                                <div className="relative">
                                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input
                                        value={filters.query}
                                        onChange={(event) => updateFilters('query', event.target.value)}
                                        className="w-full sm:w-72 pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-[#6F4BFF]/30"
                                        placeholder="Search leads..."
                                    />
                                </div>
                                <Button icon={Filter} variant="secondary" onClick={() => setIsFilterOpen((open) => !open)}>Filter</Button>
                                <Button icon={Plus} onClick={() => setIsAddLeadOpen(true)}>Add New Lead</Button>
                            </div>
                        </div>

                        {isFilterOpen && (
                            <div className="p-5 border-b border-gray-100 bg-gray-50/70 grid grid-cols-1 gap-4 md:grid-cols-4">
                                <select value={filters.status} onChange={(event) => updateFilters('status', event.target.value)} className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-bold outline-none focus:ring-2 focus:ring-[#6F4BFF]/30">
                                    <option>All</option>
                                    <option>New</option>
                                    <option>Contacted</option>
                                    <option>Follow Up</option>
                                    <option>Qualified</option>
                                </select>
                                <select value={filters.score} onChange={(event) => updateFilters('score', event.target.value)} className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-bold outline-none focus:ring-2 focus:ring-[#6F4BFF]/30">
                                    <option>All</option>
                                    <option>Hot</option>
                                    <option>Warm</option>
                                    <option>Cold</option>
                                </select>
                                <select value={filters.officer} onChange={(event) => updateFilters('officer', event.target.value)} className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-bold outline-none focus:ring-2 focus:ring-[#6F4BFF]/30">
                                    <option>All</option>
                                    {officers.map((officer) => <option key={officer}>{officer}</option>)}
                                </select>
                                <Button variant="secondary" onClick={() => setFilters(filterInitialState)}>Clear Filters</Button>
                            </div>
                        )}

                        <Table
                            headers={['Lead Name', 'Contact', 'Budget', 'Status', 'Assigned', 'Action']}
                            data={visibleLeads}
                            renderRow={(row) => (
                                <tr key={row.id} className="hover:bg-gray-50/80 transition-colors group cursor-pointer" onClick={() => setSelectedLead(row)}>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-gray-900 flex items-center gap-2">
                                            {row.name}
                                            {row.score === 'Hot' && <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" title="Hot Lead"></span>}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-0.5">Added: {row.date}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-800">{row.phone}</div>
                                        <div className="text-xs text-gray-500">{row.email}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-bold text-gray-800">{row.budget}</div>
                                        <div className="text-xs text-gray-600">{row.req}</div>
                                    </td>
                                    <td className="px-6 py-4">{getStatusBadge(row.status)}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-[10px] font-bold text-[#6F4BFF]">
                                                {row.officer.charAt(0)}
                                            </div>
                                            {row.officer}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <Button
                                                variant="secondary"
                                                className="text-xs py-1.5 px-3 hover:border-[#6F4BFF] hover:text-[#6F4BFF]"
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    setSelectedLead(row);
                                                }}
                                            >
                                                View
                                            </Button>
                                            <Button
                                                variant="success"
                                                className="text-xs py-1.5 px-3"
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    handleQualifyLead(row);
                                                }}
                                                disabled={row.status === 'Qualified'}
                                            >
                                                Qualify
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        />

                        {visibleLeads.length === 0 && (
                            <div className="p-12 text-center text-sm font-bold text-gray-400">No leads match the selected filters.</div>
                        )}
                    </Card>
                </div>
            </main>

            <Modal isOpen={isAddLeadOpen} onClose={() => setIsAddLeadOpen(false)} title="Add New Lead">
                <form className="space-y-4" onSubmit={handleAddLead}>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Lead Name</label>
                        <input required value={leadForm.name} onChange={(event) => updateLeadForm('name', event.target.value)} className="w-full mt-2 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 font-bold" placeholder="Customer name" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Phone</label>
                            <input required value={leadForm.phone} onChange={(event) => updateLeadForm('phone', event.target.value)} className="w-full mt-2 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 font-bold" placeholder="+91..." />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email</label>
                            <input type="email" value={leadForm.email} onChange={(event) => updateLeadForm('email', event.target.value)} className="w-full mt-2 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 font-bold" placeholder="lead@email.com" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Budget</label>
                            <input required value={leadForm.budget} onChange={(event) => updateLeadForm('budget', event.target.value)} className="w-full mt-2 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 font-bold" placeholder="1 Cr - 2 Cr" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Location</label>
                            <input value={leadForm.location} onChange={(event) => updateLeadForm('location', event.target.value)} className="w-full mt-2 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 font-bold" placeholder="City / locality" />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Requirement</label>
                        <input required value={leadForm.req} onChange={(event) => updateLeadForm('req', event.target.value)} className="w-full mt-2 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 font-bold" placeholder="Residential, 3BHK" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Status</label>
                            <select value={leadForm.status} onChange={(event) => updateLeadForm('status', event.target.value)} className="w-full mt-2 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 font-bold bg-white">
                                <option>New</option>
                                <option>Contacted</option>
                                <option>Follow Up</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Score</label>
                            <select value={leadForm.score} onChange={(event) => updateLeadForm('score', event.target.value)} className="w-full mt-2 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 font-bold bg-white">
                                <option>Hot</option>
                                <option>Warm</option>
                                <option>Cold</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Officer</label>
                            <select value={leadForm.officer} onChange={(event) => updateLeadForm('officer', event.target.value)} className="w-full mt-2 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 font-bold bg-white">
                                {officers.map((officer) => <option key={officer}>{officer}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="pt-4 border-t border-gray-100 flex justify-end gap-3 mt-6">
                        <Button variant="secondary" onClick={() => setIsAddLeadOpen(false)}>Cancel</Button>
                        <Button type="submit" icon={Save}>Save Lead</Button>
                    </div>
                </form>
            </Modal>

            <Modal isOpen={!!selectedLead} onClose={() => { setSelectedLead(null); setFollowUpNote(''); }} title={selectedLead ? `${selectedLead.name} Follow-up` : 'Lead Follow-up'}>
                {selectedLead && (
                    <div className="space-y-5">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-4">
                                <button onClick={() => setSelectedLead(null)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors border border-gray-200">
                                    <ArrowLeft className="w-5 h-5" />
                                </button>
                                <div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h3 className="text-2xl font-black text-gray-900">{selectedLead.name}</h3>
                                        <Badge variant={selectedLead.score === 'Hot' ? 'red' : 'purple'}>{selectedLead.score} Lead</Badge>
                                        {getStatusBadge(selectedLead.status)}
                                    </div>
                                    <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600 font-medium">
                                        <span className="flex items-center gap-1.5"><PhoneCall className="w-4 h-4 text-gray-400" /> {selectedLead.phone}</span>
                                        <span className="flex items-center gap-1.5"><Mail className="w-4 h-4 text-gray-400" /> {selectedLead.email || 'No email'}</span>
                                        <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-gray-400" /> {selectedLead.location || 'Location pending'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Requirement</p>
                                <p className="mt-1 font-black text-gray-900">{selectedLead.req}</p>
                                <p className="text-sm font-bold text-emerald-600 mt-1">{selectedLead.budget}</p>
                            </div>
                            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Next Action</p>
                                <p className="mt-1 font-black text-gray-900">{selectedLead.nextAction}</p>
                                <p className="text-sm font-bold text-[#6F4BFF] mt-1 flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {selectedLead.nextActionDate}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Assigned Officer</label>
                                <select value={selectedLead.officer} onChange={(event) => handleAssignOfficer(selectedLead.id, event.target.value)} className="w-full mt-2 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 font-bold bg-white">
                                    {officers.map((officer) => <option key={officer}>{officer}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Status</label>
                                <select value={selectedLead.status} onChange={(event) => handleStatusChange(selectedLead, event.target.value)} className="w-full mt-2 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 font-bold bg-white">
                                    <option>New</option>
                                    <option>Contacted</option>
                                    <option>Follow Up</option>
                                    <option>Qualified</option>
                                </select>
                            </div>
                        </div>

                        <form onSubmit={handleAddFollowUpNote} className="space-y-3">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Add Follow-up Note</label>
                            <textarea
                                rows="3"
                                value={followUpNote}
                                onChange={(event) => setFollowUpNote(event.target.value)}
                                className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 font-bold"
                                placeholder="Write call notes, follow-up plan, or client preference..."
                            />
                            <div className="flex justify-end gap-3">
                                <Button variant="secondary" type="button" onClick={() => handleStatusChange(selectedLead, 'Contacted')}>Mark Contacted</Button>
                                <Button variant="success" type="button" icon={UserCheck} onClick={() => handleQualifyLead(selectedLead)} disabled={selectedLead.status === 'Qualified'}>Qualify</Button>
                                <Button type="submit" icon={Save}>Save Note</Button>
                            </div>
                        </form>

                        <div className="space-y-3">
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Activity Timeline</p>
                            {(selectedLead.timeline || []).map((item, index) => (
                                <div key={`${item.date}-${index}`} className="border border-gray-100 rounded-xl p-4 bg-white">
                                    <div className="flex items-center justify-between gap-3">
                                        <p className="font-black text-gray-900">{item.type}</p>
                                        <span className="text-xs font-bold text-gray-400">{item.date}</span>
                                    </div>
                                    <p className="mt-1 text-sm font-medium text-gray-600">{item.note}</p>
                                    <p className="mt-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">By {item.agent}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Leads;
