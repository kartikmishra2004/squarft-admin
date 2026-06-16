import { useState, useRef, useEffect } from 'react';
import { 
    Calendar, 
    Phone, 
    MapPin, 
    Clock, 
    Compass,
    ChevronLeft,
    ChevronRight,
    Play,
    Pause,
    Download
} from 'lucide-react';
import Header from '../../components/layout/Header';
import { panelOverviewByStatus, fieldOfficerWorkflowData } from '../../data/mockData';

const formatNumber = (value) => {
    if (value < 1000) return String(value).padStart(2, '0');
    return value.toLocaleString('en-IN');
};

const PanelMetricCard = ({ metric }) => (
    <section className="rounded-[8px] border border-[#D8D2EB] bg-white px-5 py-5 shadow-[0_1px_0_rgba(33,24,88,0.03)]">
        <p className="text-[12px] font-medium uppercase tracking-[0.12em] text-[#5E5A71]">{metric.title}</p>
        <div className="mt-2 flex items-center gap-2">
            <p className="text-[21px] font-black leading-none tracking-normal" style={{ color: metric.color }}>
                {formatNumber(metric.value)}
            </p>
            <span className="rounded-full bg-[#F4F1FF] px-2 py-0.5 text-[8px] font-black text-[#6E6790]">
                {metric.change}
            </span>
        </div>
        <div className="mt-4 h-[3px] rounded-full bg-[#EFEAF8]">
            <div
                className="h-full rounded-full"
                style={{ width: `${metric.progress}%`, backgroundColor: metric.color }}
            />
        </div>
    </section>
);

const PanelOverview = () => {
    // Just display the draft status metrics directly as requested
    const metrics = panelOverviewByStatus.draft.metrics;

    // Main layout tabs
    const [activeTab, setActiveTab] = useState('project'); // 'project' | 'fieldOfficer'
    const [activeProjectSubTab, setActiveProjectSubTab] = useState('approveKyc'); // 'approveKyc' | 'onboardingProgress' | 'live'
    const [activeOfficerSubTab, setActiveOfficerSubTab] = useState('newAquisition'); // 'newAquisition' | 'onboardingProgress' | 'live' | 'tasks'

    // New Acquisition specific state
    const [selectedOfficerId, setSelectedOfficerId] = useState(fieldOfficerWorkflowData[0]?.id || '');
    const selectedOfficer = fieldOfficerWorkflowData.find(o => o.id === selectedOfficerId) || fieldOfficerWorkflowData[0];
    
    const [selectedLeadId, setSelectedLeadId] = useState(selectedOfficer?.projects?.[0]?.id || '');
    const selectedLead = selectedOfficer?.projects?.find(p => p.id === selectedLeadId) || selectedOfficer?.projects?.[0];

    const [activeActivityTab, setActiveActivityTab] = useState('meetings'); // 'meetings' | 'followups'
    
    // Pagination states
    const [meetingPage, setMeetingPage] = useState(1);
    const [followupPage, setFollowupPage] = useState(1);
    
    const ITEMS_PER_PAGE = 5;

    const handleOfficerSelect = (id) => {
        setSelectedOfficerId(id);
        const officer = fieldOfficerWorkflowData.find(o => o.id === id);
        if (officer?.projects?.length) {
            setSelectedLeadId(officer.projects[0].id);
        } else {
            setSelectedLeadId('');
        }
        setMeetingPage(1);
        setFollowupPage(1);
    };

    const handleLeadSelect = (id) => {
        setSelectedLeadId(id);
        setMeetingPage(1);
        setFollowupPage(1);
    };

    const handleActivityTabSelect = (tab) => {
        setActiveActivityTab(tab);
        setMeetingPage(1);
        setFollowupPage(1);
    };

    // Paginated Meetings calculations
    const leadMeetings = selectedLead?.meetings || [];
    const totalMeetingsPages = Math.ceil(leadMeetings.length / ITEMS_PER_PAGE) || 1;
    const paginatedMeetings = leadMeetings.slice(
        (meetingPage - 1) * ITEMS_PER_PAGE,
        meetingPage * ITEMS_PER_PAGE
    );

    // Paginated Followups calculations
    const leadFollowUps = selectedLead?.followUps || [];
    const totalFollowupsPages = Math.ceil(leadFollowUps.length / ITEMS_PER_PAGE) || 1;
    const paginatedFollowups = leadFollowUps.slice(
        (followupPage - 1) * ITEMS_PER_PAGE,
        followupPage * ITEMS_PER_PAGE
    );

    // Audio Playback State & Handlers
    const [playingId, setPlayingId] = useState(null);
    const audioRef = useRef(null);

    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
            }
        };
    }, []);

    const handlePlayPause = (id, url) => {
        if (playingId === id) {
            audioRef.current?.pause();
            setPlayingId(null);
        } else {
            if (audioRef.current) {
                audioRef.current.pause();
            }
            const audio = new Audio(url);
            audioRef.current = audio;
            audio.play().catch(err => {
                console.error("Audio playback failed:", err);
                setPlayingId(null);
            });
            setPlayingId(id);
            audio.onended = () => {
                setPlayingId(null);
            };
        }
    };

    const handleDownload = async (url, filename) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.warn("Direct download failed due to CORS or network error, opening file in new tab:", error);
            window.open(url, '_blank');
        }
    };

    return (
        <div className="flex h-full flex-1 flex-col bg-[#F5F6FA] text-[#15121F]">
            <Header title="Panel Overview" />

            <main className="flex-1 overflow-y-auto p-6 md:p-8">
                <div className="mx-auto max-w-[1600px] space-y-6">
                    {/* Metric Cards Grid */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                        {metrics.map((metric) => (
                            <PanelMetricCard key={metric.key} metric={metric} />
                        ))}
                    </div>

                    {/* Tabs Section */}
                    <div className="space-y-4 rounded-[10px] border border-[#D8D2EB] bg-white p-5 shadow-[0_1px_0_rgba(33,24,88,0.03)]">
                        {/* Main Tabs */}
                        <div className="flex border-b border-[#EFEAF8] pb-1">
                            <div className="flex gap-6">
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('project')}
                                    className={`pb-2 text-sm font-black uppercase tracking-[0.12em] transition-all relative ${
                                        activeTab === 'project'
                                            ? 'text-[#2717D7]'
                                            : 'text-[#5E5A71] hover:text-[#2717D7]'
                                    }`}
                                >
                                    Project
                                    {activeTab === 'project' && (
                                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2717D7] rounded-full" />
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('fieldOfficer')}
                                    className={`pb-2 text-sm font-black uppercase tracking-[0.12em] transition-all relative ${
                                        activeTab === 'fieldOfficer'
                                            ? 'text-[#2717D7]'
                                            : 'text-[#5E5A71] hover:text-[#2717D7]'
                                    }`}
                                >
                                    Field Officer
                                    {activeTab === 'fieldOfficer' && (
                                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2717D7] rounded-full" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Sub Tabs */}
                        <div className="flex flex-wrap gap-2 pt-1">
                            {activeTab === 'project' ? (
                                <>
                                    {[
                                        { id: 'approveKyc', label: 'Approve KYC' },
                                        { id: 'onboardingProgress', label: 'Onboarding progress' },
                                        { id: 'live', label: 'Live' },
                                    ].map((subTab) => {
                                        const isActive = activeProjectSubTab === subTab.id;
                                        return (
                                            <button
                                                key={subTab.id}
                                                type="button"
                                                onClick={() => setActiveProjectSubTab(subTab.id)}
                                                className={`h-9 rounded-[6px] border px-3.5 text-xs font-black uppercase tracking-[0.1em] transition-all ${
                                                    isActive
                                                        ? 'border-[#2717D7] bg-[#2717D7] text-white shadow-sm'
                                                        : 'border-[#D8D2EB] bg-white text-[#5E5A71] hover:border-[#2717D7] hover:text-[#2717D7]'
                                                }`}
                                            >
                                                {subTab.label}
                                            </button>
                                        );
                                    })}
                                </>
                            ) : (
                                <>
                                    {[
                                        { id: 'newAquisition', label: 'New Aquisition' },
                                        { id: 'onboardingProgress', label: 'Onboarding progress' },
                                        { id: 'live', label: 'Live' },
                                        { id: 'tasks', label: 'Tasks' },
                                    ].map((subTab) => {
                                        const isActive = activeOfficerSubTab === subTab.id;
                                        return (
                                            <button
                                                key={subTab.id}
                                                type="button"
                                                onClick={() => setActiveOfficerSubTab(subTab.id)}
                                                className={`h-9 rounded-[6px] border px-3.5 text-xs font-black uppercase tracking-[0.1em] transition-all ${
                                                    isActive
                                                        ? 'border-[#2717D7] bg-[#2717D7] text-white shadow-sm'
                                                        : 'border-[#D8D2EB] bg-white text-[#5E5A71] hover:border-[#2717D7] hover:text-[#2717D7]'
                                                }`}
                                            >
                                                {subTab.label}
                                            </button>
                                        );
                                    })}
                                </>
                            )}
                        </div>

                        {/* Content Area */}
                        <div className="mt-4">
                            {activeTab === 'project' && (
                                <div className="rounded-[8px] border border-dashed border-[#D8D2EB] bg-[#FCFBFF] p-8 text-center">
                                    <p className="text-sm font-black text-[#5E5A71]">
                                        {activeProjectSubTab === 'approveKyc' ? 'Approve KYC Content (Empty)' :
                                         activeProjectSubTab === 'onboardingProgress' ? 'Onboarding Progress Content (Empty)' :
                                         'Live Content (Empty)'}
                                    </p>
                                </div>
                            )}

                            {activeTab === 'fieldOfficer' && activeOfficerSubTab !== 'newAquisition' && (
                                <div className="rounded-[8px] border border-dashed border-[#D8D2EB] bg-[#FCFBFF] p-8 text-center">
                                    <p className="text-sm font-black text-[#5E5A71]">
                                        {activeOfficerSubTab === 'onboardingProgress' ? 'Onboarding Progress Content (Empty)' :
                                         activeOfficerSubTab === 'live' ? 'Live Content (Empty)' :
                                         'Tasks Content (Empty)'}
                                    </p>
                                </div>
                            )}

                            {activeTab === 'fieldOfficer' && activeOfficerSubTab === 'newAquisition' && (
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
                                    
                                    {/* Left Column: Field Officers & Leads */}
                                    <div className="lg:col-span-1 space-y-4">
                                        
                                        {/* Field Officers List */}
                                        <div className="rounded-[10px] border border-[#D8D2EB] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                                            <h3 className="text-xs font-black uppercase tracking-[0.12em] text-[#5E5A71] mb-3">Field Officers</h3>
                                            <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                                                {fieldOfficerWorkflowData.map((officer) => {
                                                    const isSelected = selectedOfficerId === officer.id;
                                                    return (
                                                        <button
                                                            key={officer.id}
                                                            type="button"
                                                            onClick={() => handleOfficerSelect(officer.id)}
                                                            className={`w-full text-left p-3 rounded-[8px] border transition-all ${
                                                                isSelected
                                                                    ? 'border-[#2717D7] bg-[#F4F1FF] text-[#2717D7]'
                                                                    : 'border-[#E1DDF0] bg-white hover:border-[#2717D7]/40 text-[#171327]'
                                                            }`}
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <p className="text-xs font-black">{officer.name}</p>
                                                                <span className="rounded-full bg-white px-2 py-0.5 text-[9px] font-bold text-[#5E5A71] border border-[#E1DDF0]">
                                                                    {officer.projects?.length || 0} Leads
                                                                </span>
                                                            </div>
                                                            <p className="text-[10px] text-[#5E5A71] mt-1">{officer.area} ({officer.zone})</p>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Leads List */}
                                        <div className="rounded-[10px] border border-[#D8D2EB] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                                            <h3 className="text-xs font-black uppercase tracking-[0.12em] text-[#5E5A71] mb-3">
                                                Leads for {selectedOfficer?.name || 'Officer'}
                                            </h3>
                                            {!selectedOfficer?.projects?.length ? (
                                                <div className="text-center py-6 border border-dashed border-[#E1DDF0] rounded-[8px] bg-[#FCFBFF]">
                                                    <p className="text-xs font-bold text-[#5E5A71]">No active leads.</p>
                                                </div>
                                            ) : (
                                                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                                                    {selectedOfficer.projects.map((proj) => {
                                                        const isSelected = selectedLeadId === proj.id;
                                                        return (
                                                            <button
                                                                key={proj.id}
                                                                type="button"
                                                                onClick={() => handleLeadSelect(proj.id)}
                                                                className={`w-full text-left p-3 rounded-[8px] border transition-all ${
                                                                    isSelected
                                                                        ? 'border-[#2717D7] bg-[#F4F1FF] text-[#2717D7]'
                                                                        : 'border-[#E1DDF0] bg-white hover:border-[#2717D7]/40 text-[#171327]'
                                                                }`}
                                                            >
                                                                <div className="flex justify-between items-start gap-1">
                                                                    <p className="text-xs font-black truncate max-w-[120px]">{proj.projectName}</p>
                                                                    <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                                                                        proj.type === 'Hot' ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
                                                                    }`}>
                                                                        {proj.type}
                                                                    </span>
                                                                </div>
                                                                <p className="text-[10px] text-[#5E5A71] mt-1 truncate">{proj.developerName}</p>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>

                                    </div>

                                    {/* Right Column: Leads Activities Details (Table List Form + Pagination) */}
                                    <div className="lg:col-span-2">
                                        {!selectedLead ? (
                                            <div className="h-full flex flex-col items-center justify-center rounded-[10px] border border-[#D8D2EB] bg-white p-8 text-center min-h-[350px] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                                                <Compass className="h-10 w-10 text-[#A49DB8] mb-3" />
                                                <p className="text-sm font-black text-[#171327]">No Lead Selected</p>
                                                <p className="text-xs font-bold text-[#5E5A71] mt-1">Select an officer and lead from the sidebar to inspect meeting & follow-up schedules.</p>
                                            </div>
                                        ) : (
                                            <div className="rounded-[10px] border border-[#D8D2EB] bg-white p-5 space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                                                
                                                {/* Selected Lead Info */}
                                                <div className="border-b border-[#EFEAF8] pb-4">
                                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                                        <div>
                                                            <h3 className="text-base font-black text-[#171327]">{selectedLead.projectName}</h3>
                                                            <p className="text-xs font-semibold text-[#5E5A71] mt-0.5">
                                                                Developer: {selectedLead.developerName} | Location: {selectedLead.location}, {selectedLead.city}
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-xs font-bold text-[#171327]">{selectedLead.contactPerson}</p>
                                                            <p className="text-[10px] text-[#5E5A71] mt-0.5">{selectedLead.phoneNumber}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Nested Activity Sub-tabs Selector */}
                                                <div className="flex border-b border-[#EFEAF8] pb-1">
                                                    <div className="flex gap-4">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleActivityTabSelect('meetings')}
                                                            className={`pb-1.5 text-xs font-black uppercase tracking-[0.1em] transition-all relative ${
                                                                activeActivityTab === 'meetings'
                                                                    ? 'text-[#2717D7]'
                                                                    : 'text-[#5E5A71] hover:text-[#2717D7]'
                                                            }`}
                                                        >
                                                            Meetings ({leadMeetings.length})
                                                            {activeActivityTab === 'meetings' && (
                                                                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2717D7] rounded-full" />
                                                            )}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleActivityTabSelect('followups')}
                                                            className={`pb-1.5 text-xs font-black uppercase tracking-[0.1em] transition-all relative ${
                                                                activeActivityTab === 'followups'
                                                                    ? 'text-[#2717D7]'
                                                                    : 'text-[#5E5A71] hover:text-[#2717D7]'
                                                            }`}
                                                        >
                                                            Followups ({leadFollowUps.length})
                                                            {activeActivityTab === 'followups' && (
                                                                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2717D7] rounded-full" />
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Tab Content in List/Table Form */}
                                                <div className="pt-2 min-h-[300px] flex flex-col justify-between">
                                                    {activeActivityTab === 'meetings' ? (
                                                        <div className="space-y-4">
                                                            {!leadMeetings.length ? (
                                                                <div className="text-center py-10 border border-dashed border-[#E1DDF0] rounded-[8px] bg-[#FCFBFF]">
                                                                    <Calendar className="mx-auto h-8 w-8 text-[#A49DB8]" />
                                                                    <p className="text-xs font-black text-[#171327] mt-3">No scheduled meetings</p>
                                                                    <p className="text-[10px] text-[#5E5A71] mt-1">This lead has no meetings registered by the field officer.</p>
                                                                </div>
                                                            ) : (
                                                                <div className="overflow-x-auto border border-[#E1DDF0] rounded-[8px]">
                                                                    <table className="w-full text-left border-collapse">
                                                                        <thead>
                                                                            <tr className="bg-[#F8F9FF] border-b border-[#E1DDF0] text-[9px] font-black uppercase tracking-[0.1em] text-[#5E5A71]">
                                                                                <th className="px-4 py-3">Type</th>
                                                                                <th className="px-4 py-3">Time</th>
                                                                                <th className="px-4 py-3">Location</th>
                                                                                <th className="px-4 py-3">Agenda / Prep Notes</th>
                                                                                <th className="px-4 py-3">Voice Note</th>
                                                                                <th className="px-4 py-3 text-center">Status</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody className="divide-y divide-[#EFEAF8] text-xs font-bold text-[#171327]">
                                                                            {paginatedMeetings.map((meeting) => (
                                                                                <tr key={meeting.id} className="hover:bg-[#FCFBFF] transition-colors">
                                                                                    <td className="px-4 py-3.5 font-black flex items-center gap-1.5">
                                                                                        <Compass className="h-3.5 w-3.5 text-[#2717D7] shrink-0" />
                                                                                        {meeting.type}
                                                                                    </td>
                                                                                    <td className="px-4 py-3.5 text-[#5E5A71] whitespace-nowrap">
                                                                                        <span className="flex items-center gap-1">
                                                                                            <Clock className="h-3.5 w-3.5 shrink-0" />
                                                                                            {meeting.time}
                                                                                        </span>
                                                                                    </td>
                                                                                    <td className="px-4 py-3.5 max-w-[150px] truncate">
                                                                                        <span className="flex items-center gap-1">
                                                                                            <MapPin className="h-3.5 w-3.5 text-[#2717D7] shrink-0" />
                                                                                            {meeting.location}
                                                                                        </span>
                                                                                    </td>
                                                                                    <td className="px-4 py-3.5 max-w-[200px]">
                                                                                        <div className="space-y-1">
                                                                                            {meeting.meta?.agenda?.length > 0 && (
                                                                                                <div className="flex flex-wrap gap-1">
                                                                                                    {meeting.meta.agenda.map((agenda) => (
                                                                                                        <span key={agenda} className="bg-[#F4F1FF] text-[#2717D7] px-1.5 py-0.5 rounded text-[8px] font-black">
                                                                                                            {agenda}
                                                                                                        </span>
                                                                                                    ))}
                                                                                                </div>
                                                                                            )}
                                                                                            {meeting.meta?.notes && (
                                                                                                <p className="text-[10px] text-[#5E5A71] italic mt-1">"{meeting.meta.notes}"</p>
                                                                                            )}
                                                                                        </div>
                                                                                    </td>
                                                                                    <td className="px-4 py-3.5 whitespace-nowrap">
                                                                                        {meeting.voiceNoteUrl ? (
                                                                                            <div className="flex items-center gap-2">
                                                                                                <button
                                                                                                    type="button"
                                                                                                    onClick={() => handlePlayPause(meeting.id, meeting.voiceNoteUrl)}
                                                                                                    className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F4F1FF] text-[#2717D7] hover:bg-[#2717D7] hover:text-white transition-all shadow-sm cursor-pointer"
                                                                                                    title={playingId === meeting.id ? "Pause" : "Play"}
                                                                                                >
                                                                                                    {playingId === meeting.id ? <Pause size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" className="ml-0.5" />}
                                                                                                </button>
                                                                                                <span className="text-[10px] text-[#5E5A71] font-mono">{meeting.voiceNoteDuration || '0:00'}</span>
                                                                                                <button
                                                                                                    type="button"
                                                                                                    onClick={() => handleDownload(meeting.voiceNoteUrl, `meeting-voice-${meeting.id}.mp3`)}
                                                                                                    className="flex h-7 w-7 items-center justify-center rounded-full border border-[#E1DDF0] bg-white text-[#5E5A71] hover:border-[#2717D7] hover:text-[#2717D7] transition-all shadow-sm cursor-pointer"
                                                                                                    title="Download Audio"
                                                                                                >
                                                                                                    <Download size={12} />
                                                                                                </button>
                                                                                            </div>
                                                                                        ) : (
                                                                                            <span className="text-[#A49DB8] font-normal">-</span>
                                                                                        )}
                                                                                    </td>
                                                                                    <td className="px-4 py-3.5 text-center whitespace-nowrap">
                                                                                        <span className={`text-[8px] px-2 py-0.5 rounded-full font-bold uppercase ${
                                                                                            meeting.status === 'Completed' || meeting.status === 'Done'
                                                                                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                                                                                : 'bg-blue-50 text-blue-600 border border-blue-100'
                                                                                        }`}>
                                                                                            {meeting.status}
                                                                                        </span>
                                                                                    </td>
                                                                                </tr>
                                                                            ))}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className="space-y-4">
                                                            {!leadFollowUps.length ? (
                                                                <div className="text-center py-10 border border-dashed border-[#E1DDF0] rounded-[8px] bg-[#FCFBFF]">
                                                                    <Phone className="mx-auto h-8 w-8 text-[#A49DB8]" />
                                                                    <p className="text-xs font-black text-[#171327] mt-3">No follow-ups recorded</p>
                                                                    <p className="text-[10px] text-[#5E5A71] mt-1">This lead has no follow-ups registered by the field officer.</p>
                                                                </div>
                                                            ) : (
                                                                <div className="overflow-x-auto border border-[#E1DDF0] rounded-[8px]">
                                                                    <table className="w-full text-left border-collapse">
                                                                        <thead>
                                                                            <tr className="bg-[#F8F9FF] border-b border-[#E1DDF0] text-[9px] font-black uppercase tracking-[0.1em] text-[#5E5A71]">
                                                                                <th className="px-4 py-3">Type</th>
                                                                                <th className="px-4 py-3">Scheduled Time</th>
                                                                                <th className="px-4 py-3 text-center">Status</th>
                                                                                <th className="px-4 py-3">Voice Note</th>
                                                                                <th className="px-4 py-3">Remarks / Note</th>
                                                                                <th className="px-4 py-3">Next Action</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody className="divide-y divide-[#EFEAF8] text-xs font-bold text-[#171327]">
                                                                            {paginatedFollowups.map((follow) => (
                                                                                <tr key={follow.id} className="hover:bg-[#FCFBFF] transition-colors">
                                                                                    <td className="px-4 py-3.5 font-black flex items-center gap-1.5">
                                                                                        <Phone className="h-3.5 w-3.5 text-[#2717D7] shrink-0" />
                                                                                        {follow.meta?.followUpType || 'Call'}
                                                                                    </td>
                                                                                    <td className="px-4 py-3.5 text-[#5E5A71] whitespace-nowrap">
                                                                                        <span className="flex items-center gap-1">
                                                                                            <Clock className="h-3.5 w-3.5 shrink-0" />
                                                                                            {follow.time || 'Time pending'}
                                                                                        </span>
                                                                                    </td>
                                                                                    <td className="px-4 py-3.5 text-center whitespace-nowrap">
                                                                                        <span className="text-[8px] px-2 py-0.5 rounded-full font-bold uppercase bg-amber-50 text-amber-600 border border-amber-100">
                                                                                            {follow.status}
                                                                                        </span>
                                                                                    </td>
                                                                                    <td className="px-4 py-3.5 whitespace-nowrap">
                                                                                        {follow.voiceNoteUrl ? (
                                                                                            <div className="flex items-center gap-2">
                                                                                                <button
                                                                                                    type="button"
                                                                                                    onClick={() => handlePlayPause(follow.id, follow.voiceNoteUrl)}
                                                                                                    className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F4F1FF] text-[#2717D7] hover:bg-[#2717D7] hover:text-white transition-all shadow-sm cursor-pointer"
                                                                                                    title={playingId === follow.id ? "Pause" : "Play"}
                                                                                                >
                                                                                                    {playingId === follow.id ? <Pause size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" className="ml-0.5" />}
                                                                                                </button>
                                                                                                <span className="text-[10px] text-[#5E5A71] font-mono">{follow.voiceNoteDuration || '0:00'}</span>
                                                                                                <button
                                                                                                    type="button"
                                                                                                    onClick={() => handleDownload(follow.voiceNoteUrl, `follow-voice-${follow.id}.mp3`)}
                                                                                                    className="flex h-7 w-7 items-center justify-center rounded-full border border-[#E1DDF0] bg-white text-[#5E5A71] hover:border-[#2717D7] hover:text-[#2717D7] transition-all shadow-sm cursor-pointer"
                                                                                                    title="Download Audio"
                                                                                                >
                                                                                                    <Download size={12} />
                                                                                                </button>
                                                                                            </div>
                                                                                        ) : (
                                                                                            <span className="text-[#A49DB8] font-normal">-</span>
                                                                                        )}
                                                                                    </td>
                                                                                    <td className="px-4 py-3.5 max-w-[200px] text-[#5E5A71] italic">
                                                                                        "{follow.note}"
                                                                                    </td>
                                                                                    <td className="px-4 py-3.5 max-w-[150px] text-[#2717D7] truncate">
                                                                                        {follow.meta?.nextAction || '-'}
                                                                                    </td>
                                                                                </tr>
                                                                            ))}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* Pagination Controls */}
                                                    {activeActivityTab === 'meetings' && leadMeetings.length > ITEMS_PER_PAGE && (
                                                        <div className="flex items-center justify-between border-t border-[#EFEAF8] pt-4 mt-4 text-xs font-bold text-[#5E5A71]">
                                                            <span>
                                                                Showing {Math.min((meetingPage - 1) * ITEMS_PER_PAGE + 1, leadMeetings.length)} to {Math.min(meetingPage * ITEMS_PER_PAGE, leadMeetings.length)} of {leadMeetings.length} meetings
                                                            </span>
                                                            <div className="flex items-center gap-2">
                                                                <button
                                                                    type="button"
                                                                    disabled={meetingPage === 1}
                                                                    onClick={() => setMeetingPage(p => p - 1)}
                                                                    className="h-8 w-8 grid place-items-center rounded-md border border-[#D8D2EB] hover:border-[#2717D7] hover:text-[#2717D7] disabled:opacity-45 disabled:pointer-events-none transition-all"
                                                                    aria-label="Previous Page"
                                                                >
                                                                    <ChevronLeft size={16} />
                                                                </button>
                                                                {Array.from({ length: totalMeetingsPages }, (_, i) => i + 1).map((pg) => (
                                                                    <button
                                                                        key={pg}
                                                                        type="button"
                                                                        onClick={() => setMeetingPage(pg)}
                                                                        className={`h-8 w-8 grid place-items-center rounded-md border text-xs ${
                                                                            meetingPage === pg
                                                                                ? 'border-[#2717D7] bg-[#2717D7] text-white'
                                                                                : 'border-[#D8D2EB] hover:border-[#2717D7] hover:text-[#2717D7]'
                                                                        }`}
                                                                    >
                                                                        {pg}
                                                                    </button>
                                                                ))}
                                                                <button
                                                                    type="button"
                                                                    disabled={meetingPage === totalMeetingsPages}
                                                                    onClick={() => setMeetingPage(p => p + 1)}
                                                                    className="h-8 w-8 grid place-items-center rounded-md border border-[#D8D2EB] hover:border-[#2717D7] hover:text-[#2717D7] disabled:opacity-45 disabled:pointer-events-none transition-all"
                                                                    aria-label="Next Page"
                                                                >
                                                                    <ChevronRight size={16} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {activeActivityTab === 'followups' && leadFollowUps.length > ITEMS_PER_PAGE && (
                                                        <div className="flex items-center justify-between border-t border-[#EFEAF8] pt-4 mt-4 text-xs font-bold text-[#5E5A71]">
                                                            <span>
                                                                Showing {Math.min((followupPage - 1) * ITEMS_PER_PAGE + 1, leadFollowUps.length)} to {Math.min(followupPage * ITEMS_PER_PAGE, leadFollowUps.length)} of {leadFollowUps.length} follow-ups
                                                            </span>
                                                            <div className="flex items-center gap-2">
                                                                <button
                                                                    type="button"
                                                                    disabled={followupPage === 1}
                                                                    onClick={() => setFollowupPage(p => p - 1)}
                                                                    className="h-8 w-8 grid place-items-center rounded-md border border-[#D8D2EB] hover:border-[#2717D7] hover:text-[#2717D7] disabled:opacity-45 disabled:pointer-events-none transition-all"
                                                                    aria-label="Previous Page"
                                                                >
                                                                    <ChevronLeft size={16} />
                                                                </button>
                                                                {Array.from({ length: totalFollowupsPages }, (_, i) => i + 1).map((pg) => (
                                                                    <button
                                                                        key={pg}
                                                                        type="button"
                                                                        onClick={() => setFollowupPage(pg)}
                                                                        className={`h-8 w-8 grid place-items-center rounded-md border text-xs ${
                                                                            followupPage === pg
                                                                                ? 'border-[#2717D7] bg-[#2717D7] text-white'
                                                                                : 'border-[#D8D2EB] hover:border-[#2717D7] hover:text-[#2717D7]'
                                                                        }`}
                                                                    >
                                                                        {pg}
                                                                    </button>
                                                                ))}
                                                                <button
                                                                    type="button"
                                                                    disabled={followupPage === totalFollowupsPages}
                                                                    onClick={() => setFollowupPage(p => p + 1)}
                                                                    className="h-8 w-8 grid place-items-center rounded-md border border-[#D8D2EB] hover:border-[#2717D7] hover:text-[#2717D7] disabled:opacity-45 disabled:pointer-events-none transition-all"
                                                                    aria-label="Next Page"
                                                                >
                                                                    <ChevronRight size={16} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                            </div>
                                        )}
                                    </div>

                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PanelOverview;
