import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
    Calendar, Plus, Search, MapPin, User, Clock, 
    MoreVertical, CheckCircle2, XCircle, Filter, 
    ArrowRight, Building2, Phone, MessageSquare
} from 'lucide-react';
import { addVisit, updateVisitStatus } from '../../store/visitsSlice';
import { mockClients, mockProjects } from '../../data/mockData';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Header from '../../components/layout/Header';
import Modal from '../../components/ui/Modal';
import Table from '../../components/ui/Table';

const Visits = () => {
    const dispatch = useDispatch();
    const { visits } = useSelector((state) => state.visits);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredVisits = visits.filter(v => 
        v.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.officerName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleScheduleVisit = (newVisit) => {
        dispatch(addVisit(newVisit));
        setIsModalOpen(false);
    };

    return (
        <div className="flex-1 flex flex-col h-full relative bg-[#F5F6FA] font-sans text-gray-900">
            <Header title="Upcoming Visits" />

            <main className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth">
                <div className="max-w-[1600px] mx-auto space-y-6">
                    
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div>
                            <h2 className="text-2xl font-black text-gray-800 tracking-tight uppercase">Site Visit Pipeline</h2>
                            <p className="text-sm text-gray-500 mt-1 font-medium italic">Track and manage property tours with high-intent clients.</p>
                        </div>
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <div className="relative flex-1 sm:w-80">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by client, project, or officer..."
                                    className="pl-9 pr-4 py-2.5 w-full bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6F4BFF]/20 focus:border-[#6F4BFF] transition-all shadow-sm"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Button icon={Calendar} onClick={() => setIsModalOpen(true)} className="font-black uppercase tracking-widest text-xs">Schedule Visit</Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                        <div className="xl:col-span-3">
                            <Card noPadding className="overflow-hidden border-gray-100 shadow-xl shadow-gray-200/50">
                                <Table
                                    headers={['CLIENT & CONTACT', 'TARGET PROPERTY', 'SCHEDULED FOR', 'ASSIGNED OFFICER', 'STATUS', 'ACTION']}
                                    data={filteredVisits}
                                    renderRow={(row, i) => (
                                        <tr key={i} className="hover:bg-gray-50/80 transition-all border-b border-gray-100 last:border-0">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-[#6F4BFF]/10 text-[#6F4BFF] flex items-center justify-center font-black text-xs border border-[#6F4BFF]/20 shadow-inner">
                                                        {row.customerName.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-gray-900 tracking-tight">{row.customerName}</p>
                                                        <p className="text-[10px] text-gray-400 font-bold flex items-center gap-1 uppercase">
                                                            <Phone className="w-3 h-3" /> {row.customerPhone}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-[#6F4BFF] transition-colors">
                                                        <Building2 className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-gray-800 text-sm tracking-tight">{row.property.name}</p>
                                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{row.property.config}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col">
                                                    <span className="font-black text-gray-800 text-sm">{row.date}</span>
                                                    <span className="text-[10px] font-bold text-[#6F4BFF] flex items-center gap-1 uppercase tracking-widest">
                                                        <Clock className="w-3 h-3" /> {row.time}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                                                        <User className="w-3.5 h-3.5" />
                                                    </div>
                                                    <span className="text-sm font-black text-gray-700">{row.officerName}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <Badge variant={row.status === 'Completed' ? 'green' : row.status === 'Scheduled' ? 'purple' : 'red'}>
                                                    {row.status}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-2">
                                                    <button className="p-2 hover:bg-[#6F4BFF]/10 rounded-lg text-[#6F4BFF] transition-all" title="Message Client">
                                                        <MessageSquare className="w-4 h-4" />
                                                    </button>
                                                    <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 transition-all">
                                                        <MoreVertical className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                />
                            </Card>
                        </div>

                        <div className="space-y-6">
                            <Card className="p-6 bg-linear-to-br from-[#6F4BFF] to-[#9D84FF] text-white border-0 shadow-xl shadow-[#6F4BFF]/20">
                                <p className="text-[10px] font-black uppercase tracking-widest mb-4 opacity-80">Daily Intelligence</p>
                                <h3 className="text-2xl font-black mb-1">4 Visits Today</h3>
                                <p className="text-xs font-bold opacity-70 leading-relaxed mb-6">You have 4 scheduled property tours for today. Ensure all sales officers are briefed.</p>
                                <Button variant="secondary" className="w-full bg-white/20 hover:bg-white/30 border-0 text-white font-black uppercase tracking-widest text-xs" icon={ArrowRight}>View Today's Map</Button>
                            </Card>

                            <Card className="p-6">
                                <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest mb-6 border-b border-gray-100 pb-4">Visit Overview</h3>
                                <div className="space-y-4">
                                    {[
                                        { label: 'Scheduled', count: 12, color: 'bg-purple-500' },
                                        { label: 'Completed', count: 48, color: 'bg-emerald-500' },
                                        { label: 'Cancelled', count: 3, color: 'bg-rose-500' },
                                    ].map((stat, i) => (
                                        <div key={i}>
                                            <div className="flex justify-between text-xs font-black mb-1.5 uppercase tracking-widest">
                                                <span className="text-gray-500">{stat.label}</span>
                                                <span className="text-gray-900">{stat.count}</span>
                                            </div>
                                            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                <div className={`h-full ${stat.color} rounded-full`} style={{ width: `${(stat.count / 63) * 100}%` }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>

            <ScheduleVisitModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSchedule={handleScheduleVisit} 
            />
        </div>
    );
};

const ScheduleVisitModal = ({ isOpen, onClose, onSchedule }) => {
    const [formData, setFormData] = useState({
        customerId: '',
        projectId: '',
        date: '',
        time: '',
        officerName: 'Rahul M.',
        notes: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const client = mockClients.find(c => c.id === formData.customerId);
        const project = mockProjects.find(p => p.id === formData.projectId);
        
        if (!client || !project) return;

        onSchedule({
            customerName: client.name,
            customerPhone: client.phone,
            officerName: formData.officerName,
            officerPhone: '9424654160',
            purpose: 'BUY',
            date: formData.date,
            time: formData.time,
            property: {
                name: project.name,
                type: 'APARTMENT/FLATS',
                config: project.configs[0],
                address: project.location,
                price: project.priceRange.split('-')[0].trim()
            },
            notes: formData.notes
        });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Schedule New Site Visit">
            <form onSubmit={handleSubmit} className="space-y-5 p-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1.5 block">Select Client</label>
                        <div className="relative">
                            <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <select 
                                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#6F4BFF]/20 focus:border-[#6F4BFF] appearance-none"
                                value={formData.customerId}
                                onChange={(e) => setFormData({...formData, customerId: e.target.value})}
                                required
                            >
                                <option value="">Choose Client</option>
                                {mockClients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1.5 block">Target Property</label>
                        <div className="relative">
                            <Building2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <select 
                                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#6F4BFF]/20 focus:border-[#6F4BFF] appearance-none"
                                value={formData.projectId}
                                onChange={(e) => setFormData({...formData, projectId: e.target.value})}
                                required
                            >
                                <option value="">Choose Property</option>
                                {mockProjects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1.5 block">Visit Date</label>
                        <div className="relative">
                            <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input 
                                type="date" 
                                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#6F4BFF]/20 focus:border-[#6F4BFF]"
                                value={formData.date}
                                onChange={(e) => setFormData({...formData, date: e.target.value})}
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1.5 block">Preferred Time</label>
                        <div className="relative">
                            <Clock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input 
                                type="time" 
                                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#6F4BFF]/20 focus:border-[#6F4BFF]"
                                value={formData.time}
                                onChange={(e) => setFormData({...formData, time: e.target.value})}
                                required
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1.5 block">Special Instructions / Notes</label>
                    <textarea 
                        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#6F4BFF]/20 focus:border-[#6F4BFF] placeholder:text-gray-400"
                        rows="3"
                        placeholder="e.g. Client needs pick-up, showing 3BHK model flat..."
                        value={formData.notes}
                        onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    ></textarea>
                </div>

                <div className="flex gap-3 pt-4">
                    <Button variant="secondary" onClick={onClose} className="flex-1 font-black uppercase tracking-widest text-xs">Cancel</Button>
                    <Button type="submit" variant="primary" className="flex-1 font-black uppercase tracking-widest text-xs" icon={CheckCircle2}>Confirm Schedule</Button>
                </div>
            </form>
        </Modal>
    );
};

export default Visits;
