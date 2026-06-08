import { useState } from 'react';
import {
    Building2, Calendar, CheckCircle2, Clock, FileText,
    HardHat, PhoneCall, TrendingUp, User, XCircle
} from 'lucide-react';
import { sample2Visits } from '../../data/mockData';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Header from '../../components/layout/Header';

const getStatusBadge = (status) => {
    if (status === 'Scheduled') return <Badge variant="purple">{status}</Badge>;
    if (status === 'Completed') return <Badge variant="green">{status}</Badge>;
    if (status === 'Cancelled') return <Badge variant="red">{status}</Badge>;
    return <Badge variant="gray">{status}</Badge>;
};

const Visits = () => {
    const [localVisits, setLocalVisits] = useState(sample2Visits);
    const [selectedVisit, setSelectedVisit] = useState(sample2Visits[0]);
    const [filter, setFilter] = useState('All');
    const [newNote, setNewNote] = useState('');

    const filteredVisits = localVisits.filter((visit) => {
        if (filter === 'All') return true;
        return visit.status === filter;
    });

    const handleUpdateStatus = (id, newStatus) => {
        setLocalVisits((current) => current.map((visit) => visit.id === id ? { ...visit, status: newStatus } : visit));
        if (selectedVisit.id === id) {
            setSelectedVisit({ ...selectedVisit, status: newStatus });
        }
    };

    const handleAddNote = () => {
        if (!newNote.trim()) return;
        const updatedVisit = {
            ...selectedVisit,
            notes: `${selectedVisit.notes}\n\n[Updated]: ${newNote}`,
        };
        setLocalVisits((current) => current.map((visit) => visit.id === selectedVisit.id ? updatedVisit : visit));
        setSelectedVisit(updatedVisit);
        setNewNote('');
    };

    return (
        <div className="flex-1 flex flex-col h-full relative bg-[#F5F6FA] font-sans text-gray-900">
            <Header title="Upcoming Visits" />

            <main className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth">
                <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row h-full gap-6 animate-in fade-in duration-300 min-h-[80vh]">
                    <Card noPadding className="w-full lg:w-1/3 flex flex-col h-[80vh] border-gray-200 shadow-md shrink-0">
                        <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-[#6F4BFF]" /> Visits Schedule
                            </h2>
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
                                    <div key={visit.id} onClick={() => setSelectedVisit(visit)} className={`bg-white border-y border-r border-l-4 rounded-lg p-4 cursor-pointer transition-all ${statusBorder} ${isSelected ? 'ring-2 ring-[#6F4BFF]/20 shadow-md bg-purple-50/10' : 'border-gray-200 hover:shadow-sm'}`}>
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
                                        {selectedVisit.status === 'Scheduled' && (
                                            <>
                                                <Button variant="success" icon={CheckCircle2} onClick={() => handleUpdateStatus(selectedVisit.id, 'Completed')} className="shadow-sm">Complete</Button>
                                                <Button variant="secondary" icon={Clock} className="shadow-sm border-gray-300 hover:bg-gray-100 text-gray-700">Reschedule</Button>
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
                                            <FileText className="w-5 h-5 text-gray-400" /> Visit Notes & Follow-up
                                        </h3>
                                        <div className="bg-amber-50/50 border border-amber-100 p-4 rounded-lg mb-6">
                                            <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedVisit.notes}</p>
                                        </div>
                                        {selectedVisit.status !== 'Cancelled' && (
                                            <div className="flex gap-3 items-end border-t border-gray-100 pt-6">
                                                <div className="flex-1">
                                                    <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Add internal update</label>
                                                    <textarea value={newNote} onChange={(event) => setNewNote(event.target.value)} rows="2" className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 text-sm font-medium"></textarea>
                                                </div>
                                                <Button onClick={handleAddNote} className="h-full px-6 shadow-sm">Save Note</Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

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
