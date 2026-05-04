import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
    Plus, Search, ChevronRight, ArrowRight, Sparkles, 
    Navigation, Eye, Heart, MapPin, TrendingUp, ThumbsDown 
} from 'lucide-react';
import { setSelectedClient, setFilters } from '../../store/clientsSlice';
import { mockProjects } from '../../data/mockData';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Header from '../../components/layout/Header';

const Clients = () => {
    const dispatch = useDispatch();
    const { filteredClients, selectedClient, filters } = useSelector((state) => state.clients);

    const handleSearch = (e) => {
        dispatch(setFilters({ search: e.target.value }));
    };

    const handleClientClick = (client) => {
        dispatch(setSelectedClient(client));
    };

    const handleBack = () => {
        dispatch(setSelectedClient(null));
    };

    if (selectedClient) {
        return <ClientProfileView client={selectedClient} onBack={handleBack} projects={mockProjects} />;
    }

    return (
        <div className="flex-1 flex flex-col h-full relative bg-[#F5F6FA] font-sans text-gray-900">
            <Header title="Clients Hub" />

            <main className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth">
                <div className="max-w-[1600px] mx-auto flex flex-col gap-6">
                    
                    <Card noPadding className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white">
                            <div>
                                <h2 className="text-xl font-black text-gray-800 tracking-tight">Active Clients</h2>
                                <p className="text-sm text-gray-500 mt-1 font-medium">Qualified buyers actively evaluating multiple projects.</p>
                            </div>
                            <div className="flex items-center gap-3 w-full md:w-auto">
                                <div className="relative flex-1 md:w-80">
                                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search clients, phone numbers..."
                                        className="pl-9 pr-4 py-2.5 w-full bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6F4BFF]/20 focus:border-[#6F4BFF] transition-all"
                                        value={filters.search}
                                        onChange={handleSearch}
                                    />
                                </div>
                                <Button icon={Plus}>New Client</Button>
                            </div>
                        </div>

                        <Table
                            headers={['Client Info', 'Requirement', 'Pipeline Status', 'Assigned To', '']}
                            data={filteredClients}
                            renderRow={(row, i) => (
                                <tr
                                    key={row.id}
                                    onClick={() => handleClientClick(row)}
                                    className="hover:bg-[#6F4BFF]/5 transition-colors cursor-pointer group"
                                >
                                    <td className="px-6 py-5">
                                        <div className="font-bold text-gray-900 group-hover:text-[#6F4BFF] transition-colors">{row.name}</div>
                                        <div className="text-xs text-gray-500 font-medium">{row.phone}</div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="text-sm font-black text-gray-700">{row.budget}</div>
                                        <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">
                                            {row.req.type} • {row.req.loc.join(', ')}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex gap-1.5 mb-1.5">
                                            {row.propertyPipeline.slice(0, 3).map((p, idx) => {
                                                let v = 'gray';
                                                if (p.status === 'Shortlisted') v = 'purple';
                                                if (p.status === 'Visited') v = 'blue';
                                                if (p.status === 'Negotiating') v = 'amber';
                                                return <div key={idx} className={`w-3 h-3 rounded-full bg-${v}-400 shadow-sm`} title={`${p.projectId}: ${p.status}`}></div>
                                            })}
                                            {!row.propertyPipeline.length && <div className="text-[10px] text-gray-400 font-bold italic">No active pipeline</div>}
                                        </div>
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                            {row.propertyPipeline.length} properties in pipeline
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-600 border border-gray-200">
                                                {row.officer?.charAt(0)}
                                            </div>
                                            <span className="text-sm font-bold text-gray-700">{row.officer}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-[#6F4BFF] group-hover:text-white transition-all">
                                            <ChevronRight className="w-5 h-5" />
                                        </div>
                                    </td>
                                </tr>
                            )}
                        />
                        
                        {filteredClients.length === 0 && (
                            <div className="p-20 text-center flex flex-col items-center gap-4">
                                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 shadow-inner">
                                    <Search className="w-8 h-8 text-gray-300" />
                                </div>
                                <div>
                                    <p className="text-lg font-black text-gray-800">No clients found</p>
                                    <p className="text-sm text-gray-500 font-medium">Try adjusting your search query.</p>
                                </div>
                            </div>
                        )}
                    </Card>
                </div>
            </main>
        </div>
    );
};

const ClientProfileView = ({ client, projects, onBack }) => {
    const getProject = (id) => projects.find(p => p.id === id);

    return (
        <div className="flex-1 flex flex-col h-full relative bg-[#F5F6FA] font-sans text-gray-900">
            <Header title="Client Profile" showBack onBack={onBack} />

            <main className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth">
                <div className="max-w-[1600px] mx-auto space-y-6">

                    {/* CLIENT HEADER */}
                    <Card noPadding className="bg-linear-to-r from-white to-[#6F4BFF]/5 relative overflow-hidden animate-in fade-in duration-500">
                        <div className="p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                            <div className="flex gap-6">
                                <div className="w-20 h-20 rounded-2xl bg-[#6F4BFF] text-white flex items-center justify-center text-3xl font-black shadow-xl shadow-[#6F4BFF]/20 relative">
                                    {client.name.charAt(0)}
                                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 border-4 border-white rounded-full"></div>
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-1.5">
                                        <h2 className="text-3xl font-black text-gray-900 tracking-tight">{client.name}</h2>
                                        <Badge variant={client.status === 'Negotiating' ? 'yellow' : 'green'}>{client.status}</Badge>
                                    </div>
                                    <p className="text-gray-500 font-bold">{client.phone} • Added on 10 Apr 2026</p>
                                    <div className="flex flex-wrap gap-2 mt-4">
                                        <Badge variant="gray" className="bg-white border border-gray-100 shadow-sm font-bold uppercase tracking-wider">{client.req.type}</Badge>
                                        {client.req.bhk.map(b => (
                                            <Badge key={b} variant="gray" className="bg-white border border-gray-100 shadow-sm font-bold uppercase tracking-wider">{b}</Badge>
                                        ))}
                                        <Badge variant="purple" className="flex items-center gap-1.5 font-bold uppercase tracking-wider shadow-sm">
                                            <Sparkles className="w-3 h-3" /> AI Matching Enabled
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                            <div className="text-left md:text-right p-6 bg-white/40 backdrop-blur-md rounded-2xl border border-white/60 shadow-sm">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Approved Budget</p>
                                <p className="text-4xl font-black text-emerald-600 tracking-tighter">{client.budget}</p>
                                <p className="text-xs text-gray-500 mt-2 font-bold flex items-center md:justify-end gap-1.5">
                                    Assigned to: <span className="text-gray-900 bg-gray-100 px-2 py-0.5 rounded-lg">{client.officer}</span>
                                </p>
                            </div>
                        </div>
                    </Card>

                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                        {/* LEFT COLUMN */}
                        <div className="space-y-6 xl:col-span-1">
                            <Card className="p-6">
                                <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                                    <h3 className="text-lg font-black text-gray-800 flex items-center gap-2 tracking-tight">
                                        <Search className="w-5 h-5 text-[#6F4BFF]" /> Requirement Profile
                                    </h3>
                                    <Button variant="ghost" className="text-xs h-8 font-black uppercase tracking-widest">Edit</Button>
                                </div>
                                <div className="space-y-5">
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Preferred Locations</p>
                                        <p className="font-bold text-gray-800">{client.req.loc.join(' • ')}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Property Configuration</p>
                                        <p className="font-bold text-gray-800">{client.req.type} ({client.req.bhk.join(', ')})</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Decision Timeline</p>
                                        <p className="font-bold text-gray-800">{client.req.timeline}</p>
                                    </div>
                                </div>
                            </Card>

                            <Card className="p-6 bg-[#6F4BFF]/[0.02] border-[#6F4BFF]/10 relative overflow-hidden group">
                                <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#6F4BFF]/5 rounded-full blur-2xl group-hover:bg-[#6F4BFF]/10 transition-colors"></div>
                                <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#6F4BFF]/10">
                                    <h3 className="text-lg font-black text-gray-800 flex items-center gap-2 tracking-tight">
                                        <Sparkles className="w-5 h-5 text-[#6F4BFF]" /> Recommended Matches
                                    </h3>
                                </div>
                                <div className="space-y-4">
                                    {projects.filter(p => !client.propertyPipeline.find(cp => cp.projectId === p.id)).slice(0, 2).map(project => (
                                        <div key={project.id} className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm hover:shadow-md transition-all group/item">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-black text-gray-900 text-sm group-hover/item:text-[#6F4BFF] transition-colors">{project.name}</h4>
                                                <Badge variant="green" className="text-[9px]">98% Match</Badge>
                                            </div>
                                            <p className="text-xs text-gray-500 font-medium mb-3">{project.location}</p>
                                            <p className="text-sm font-black text-emerald-600 mb-4">{project.priceRange}</p>
                                            <Button variant="secondary" className="w-full text-[11px] py-1.5 h-auto uppercase tracking-widest font-black" icon={Plus}>
                                                Add to Pipeline
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>

                        {/* RIGHT COLUMN */}
                        <div className="xl:col-span-2">
                            <Card noPadding className="h-full flex flex-col">
                                <div className="p-6 border-b border-gray-100 bg-white flex justify-between items-center shrink-0">
                                    <div>
                                        <h3 className="text-lg font-black text-gray-800 flex items-center gap-2 tracking-tight">
                                            <Navigation className="w-5 h-5 text-[#6F4BFF]" /> Property Pipeline
                                        </h3>
                                        <p className="text-xs text-gray-500 mt-1 font-bold">Comprehensive tracking of all shown projects.</p>
                                    </div>
                                    <Button icon={Plus} variant="primary" className="text-xs uppercase tracking-widest font-black">Add Project</Button>
                                </div>

                                <div className="flex-1 p-6 bg-gray-50/50 space-y-4 overflow-y-auto custom-scrollbar">
                                    {client.propertyPipeline.map((item, i) => {
                                        const project = getProject(item.projectId);
                                        if (!project) return null;

                                        const meta = {
                                            Shortlisted: { bg: 'bg-purple-100 text-[#6F4BFF]', icon: Heart, border: 'border-purple-200 ring-1 ring-purple-100' },
                                            Visited: { bg: 'bg-blue-100 text-blue-700', icon: MapPin, border: 'border-blue-200 ring-1 ring-blue-100' },
                                            Negotiating: { bg: 'bg-amber-100 text-amber-700', icon: TrendingUp, border: 'border-amber-200 shadow-md ring-1 ring-amber-100' },
                                            'Not Interested': { bg: 'bg-gray-100 text-gray-500', icon: ThumbsDown, border: 'border-gray-200 opacity-60' },
                                            Shown: { bg: 'bg-gray-100 text-gray-600', icon: Eye, border: 'border-gray-200' },
                                        }[item.status] || { bg: 'bg-gray-100 text-gray-600', icon: Eye, border: 'border-gray-200' };

                                        const Icon = meta.icon;

                                        return (
                                            <div key={i} className={`bg-white rounded-2xl border p-5 transition-all animate-in fade-in slide-in-from-right-4 duration-300 delay-[${i*100}ms] ${meta.border}`}>
                                                <div className="flex flex-col md:flex-row items-start justify-between gap-4 mb-5">
                                                    <div className="flex gap-4">
                                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${meta.bg}`}>
                                                            <Icon className="w-6 h-6" />
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-3 mb-1">
                                                                <h4 className="text-xl font-black text-gray-900 tracking-tight">{project.name}</h4>
                                                                <span className={`px-2 py-0.5 text-[9px] font-black rounded-lg uppercase tracking-widest ${meta.bg}`}>
                                                                    {item.status}
                                                                </span>
                                                            </div>
                                                            <p className="text-sm text-gray-500 font-bold">{project.location} • {project.builder}</p>
                                                        </div>
                                                    </div>

                                                    <select className="w-full md:w-auto text-xs font-black uppercase tracking-widest bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#6F4BFF]/20 focus:border-[#6F4BFF] outline-none cursor-pointer shadow-sm transition-all">
                                                        {['Shown', 'Shortlisted', 'Visited', 'Negotiating', 'Final Deal', 'Not Interested'].map(opt => (
                                                            <option key={opt} selected={item.status === opt}>{opt}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100">
                                                    <div>
                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Target Units</p>
                                                        <p className="font-black text-gray-800 text-sm">{item.units.length ? item.units.join(' • ') : 'TBD'}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Project Price</p>
                                                        <p className="font-black text-emerald-600 text-sm">{project.priceRange}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Site Visit</p>
                                                        <p className="font-black text-gray-800 text-sm">{item.visitedOn || 'Not yet'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    
                                    {!client.propertyPipeline.length && (
                                        <div className="h-full flex flex-col items-center justify-center py-20 text-center opacity-40">
                                            <Navigation className="w-16 h-16 text-gray-300 mb-4" />
                                            <p className="text-lg font-black text-gray-900">Pipeline is empty</p>
                                            <p className="text-sm font-bold text-gray-500">Start adding projects to track progress.</p>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Clients;
