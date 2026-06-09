import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Activity,
    ArrowRight,
    ArrowUpRight,
    Building2,
    Calendar,
    CheckCircle2,
    Eye,
    FileText,
    Heart,
    IndianRupee,
    Layers,
    MapPin,
    MessageSquare,
    Navigation,
    PhoneCall,
    Plus,
    Search,
    Sparkles,
    ThumbsDown,
    TrendingUp,
    User,
    UserCheck,
    Users,
    X,
    Zap
} from 'lucide-react';
import {
    addClient,
    addClientMeeting,
    addClientNote,
    updateClient,
} from '../../store/clientsSlice';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Header from '../../components/layout/Header';
import Table from '../../components/ui/Table';
import { mockProjects, sample2Visits } from '../../data/mockData';
import propertyHeroImage from '../../assets/login-bg.png';

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
    mode: 'Office Meeting',
    location: '',
    status: 'Scheduled',
    agenda: '',
    remarks: '',
};

const requirementInitialState = {
    status: 'Buy',
    propertyCategory: 'Residential',
    propertyType: 'Plot',
    configuration: 'N/A',
    minArea: '',
    maxArea: '',
    unit: 'Square Feet (Sq. ft)',
    customerName: '',
    contactNumber: '',
    location: '',
    budgetMin: '100000',
    budgetMax: '10000000',
    notes: '',
    otp: '',
    contactVerified: false,
};

const requirementTypes = ['Buy', 'Rent/Lease', 'Paying Guest'];
const propertyCategories = ['Residential', 'Commercial'];
const propertyTypesByCategory = {
    Residential: ['Plot', 'Villa', 'Apartment', 'Rowhouse'],
    Commercial: ['Shop', 'Showroom', 'Office'],
};
const configurationOptions = {
    Rowhouse: ['1bhk', '2bhk', '3bhk', '4bhk', '5+bhk'],
    Apartment: ['1bhk', '2bhk', '3bhk', '4bhk', '5+bhk'],
    Office: ['Ready to move', 'Co-working', 'Bare shell'],
};
const areaUnits = ['Square Feet (Sq. ft)', 'Square Meter (Sq. m)', 'Square Yard (Sq. yd)', 'Acre', 'Hectare', 'Bigha'];

const formatRequirementAmount = (value) => {
    const amount = Number(value || 0);
    if (amount >= 10000000) return `Rs. ${(amount / 10000000).toFixed(amount % 10000000 === 0 ? 0 : 1)} Cr`;
    if (amount >= 100000) return `Rs. ${(amount / 100000).toFixed(amount % 100000 === 0 ? 0 : 1)} L`;
    return `Rs. ${amount.toLocaleString('en-IN')}`;
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

const buildInventoryWithUnits = (project) => (project.inventory || []).map((config, configIndex) => {
    const displayUnits = Math.min(config.totalUnits || 0, 24);
    const availableUnits = Math.max(0, config.availableUnits || 0);
    const availableDisplayCount = Math.ceil((availableUnits / Math.max(config.totalUnits || 1, 1)) * displayUnits);

    return {
        ...config,
        unitsList: Array.from({ length: displayUnits }, (_, index) => {
            const floor = Math.ceil((index + 1) / 4);
            const unitNumber = `${floor}${(index % 4) + 1}`.padStart(3, '0');

            return {
                id: `${project.id}-${configIndex}-${unitNumber}`,
                number: unitNumber,
                floor,
                status: index < availableDisplayCount ? 'Available' : 'Sold',
                facing: index % 2 === 0 ? 'East Facing' : 'West Facing',
                price: config.basePrice,
                configType: config.type,
                size: config.size,
            };
        }),
    };
});

const getSelectedUnitLabel = (assignment) => `${assignment.configType} - Unit ${assignment.unitNumber}`;

const ClientProfileView = ({ client, projects, visits, officers, onBack, onUpdateClient, onAddNote, onAddMeeting }) => {
    const [activeProfileTab, setActiveProfileTab] = useState('Overview & Pipeline');
    const [newNote, setNewNote] = useState('');
    const [followUpForm, setFollowUpForm] = useState({
        type: 'Call Note',
        nextFollowUp: client.nextFollowUp || '',
        status: client.status || 'Active',
    });
    const [meetingForm, setMeetingForm] = useState(meetingInitialState);
    const [editingMeetingIndex, setEditingMeetingIndex] = useState(null);
    const [assignedOfficer, setAssignedOfficer] = useState('');
    const [selectedProps, setSelectedProps] = useState([]);
    const [assignmentSuccess, setAssignmentSuccess] = useState(false);
    const [pendingDealIndex, setPendingDealIndex] = useState(null);
    const [selectedSiteVisitId, setSelectedSiteVisitId] = useState(null);
    const [expandedProjectId, setExpandedProjectId] = useState(null);
    const [expandedConfigByProject, setExpandedConfigByProject] = useState({});
    const [projectDetails, setProjectDetails] = useState(null);
    const [requirementForm, setRequirementForm] = useState({
        ...requirementInitialState,
        customerName: client.name || '',
        contactNumber: client.phone || '',
        propertyCategory: client.req?.type || client.listingKind || 'Residential',
        propertyType: client.propType || 'Plot',
        configuration: client.req?.bhk?.[0] || 'N/A',
        location: client.req?.loc?.[0] || '',
    });

    const tabs = ['Overview & Pipeline', 'Assign Properties', 'Customer Requirement', 'Follow-up & Notes', 'Site Visits', 'Meetings'];
    const clientVisits = visits.filter((visit) => visit.customerName === client.name);
    const selectedSiteVisit = clientVisits.find((visit) => visit.id === selectedSiteVisitId);
    const assignedSalesOfficer = client.officer?.trim();
    const selectedSalesOfficer = assignedSalesOfficer || assignedOfficer;

    const getProject = (id) => projects.find((project) => project.id === id);

    const createTimelineEvent = (title, details) => ({
        title,
        details,
        ...getNowStamp(),
    });

    const handleAddNote = () => {
        const text = newNote.trim();
        if (!text) return;

        const now = getNowStamp();
        const note = {
            text,
            type: followUpForm.type,
            nextFollowUp: followUpForm.nextFollowUp,
            status: followUpForm.status,
            ...now,
        };

        onAddNote(note);
        onUpdateClient({
            status: followUpForm.status,
            nextFollowUp: followUpForm.nextFollowUp,
            latestNote: text,
            timeline: [
                createTimelineEvent(followUpForm.type, `${text.slice(0, 60)}${text.length > 60 ? '...' : ''}`),
                ...(client.timeline || []),
            ],
        });
        setNewNote('');
    };

    const handleSaveMeeting = () => {
        if (!meetingForm.date || !meetingForm.time) return;

        const meeting = {
            id: editingMeetingIndex === null ? `M-${Date.now()}` : client.meetings?.[editingMeetingIndex]?.id || `M-${Date.now()}`,
            date: meetingForm.date,
            time: meetingForm.time,
            mode: meetingForm.mode,
            location: meetingForm.location || 'Sales office',
            status: meetingForm.status,
            agenda: meetingForm.agenda || 'Client discussion',
            remarks: meetingForm.remarks || 'Client meeting scheduled.',
        };

        if (editingMeetingIndex === null) {
            onAddMeeting(meeting);
            onUpdateClient({
                timeline: [
                    createTimelineEvent('Meeting Scheduled', `For ${meeting.date} at ${meeting.time}`),
                    ...(client.timeline || []),
                ],
            });
        } else {
            const nextMeetings = (client.meetings || []).map((item, index) => (
                index === editingMeetingIndex ? meeting : item
            ));
            onUpdateClient({
                meetings: nextMeetings,
                nextFollowUp: meeting.date,
                timeline: [
                    createTimelineEvent('Meeting Updated', `${meeting.mode} updated for ${meeting.date} at ${meeting.time}`),
                    ...(client.timeline || []),
                ],
            });
        }

        setMeetingForm(meetingInitialState);
        setEditingMeetingIndex(null);
    };

    const handleEditMeeting = (meeting, index) => {
        setEditingMeetingIndex(index);
        setMeetingForm({
            date: meeting.date || '',
            time: meeting.time || '',
            mode: meeting.mode || 'Office Meeting',
            location: meeting.location || '',
            status: meeting.status || 'Scheduled',
            agenda: meeting.agenda || '',
            remarks: meeting.remarks || '',
        });
    };

    const handleCancelMeetingEdit = () => {
        setEditingMeetingIndex(null);
        setMeetingForm(meetingInitialState);
    };

    const handleMeetingStatusChange = (meeting, index, status) => {
        const nextMeetings = (client.meetings || []).map((item, itemIndex) => (
            itemIndex === index ? { ...item, status } : item
        ));
        onUpdateClient({
            meetings: nextMeetings,
            timeline: [
                createTimelineEvent(`Meeting ${status}`, `${meeting.mode || 'Meeting'} on ${meeting.date} marked ${status.toLowerCase()}.`),
                ...(client.timeline || []),
            ],
        });
    };

    const handleDeleteMeeting = (meeting, index) => {
        const nextMeetings = (client.meetings || []).filter((_, itemIndex) => itemIndex !== index);
        onUpdateClient({
            meetings: nextMeetings,
            timeline: [
                createTimelineEvent('Meeting Removed', `${meeting.mode || 'Meeting'} on ${meeting.date} removed.`),
                ...(client.timeline || []),
            ],
        });
        if (editingMeetingIndex === index) {
            handleCancelMeetingEdit();
        }
    };

    const getMeetingStatusClass = (status = 'Scheduled') => {
        if (status === 'Completed') return 'bg-emerald-50 text-emerald-700 border-emerald-100';
        if (status === 'Cancelled') return 'bg-gray-100 text-gray-500 border-gray-200';
        return 'bg-blue-50 text-blue-700 border-blue-100';
    };

    const updateRequirementForm = (field, value) => {
        setRequirementForm((current) => {
            if (field === 'propertyCategory') {
                const nextPropertyType = propertyTypesByCategory[value]?.[0] || 'Plot';
                return { ...current, propertyCategory: value, propertyType: nextPropertyType, configuration: 'N/A' };
            }
            if (field === 'propertyType') {
                return { ...current, propertyType: value, configuration: 'N/A' };
            }
            if (field === 'otp') {
                return { ...current, otp: value, contactVerified: value.length === 4 };
            }
            if (field === 'contactNumber') {
                return { ...current, contactNumber: value, contactVerified: false, otp: '' };
            }
            return { ...current, [field]: value };
        });
    };

    const handleAddRequirement = (event) => {
        event.preventDefault();
        if (!requirementForm.customerName.trim() || !requirementForm.contactNumber.trim()) return;

        const now = getNowStamp();
        const requirement = {
            id: `REQ-${Date.now()}`,
            customer_name: requirementForm.customerName.trim(),
            contact_number: requirementForm.contactNumber.trim(),
            requirement_type: requirementForm.status,
            property_category: requirementForm.propertyCategory,
            property_type: requirementForm.propertyType,
            configuration: requirementForm.configuration,
            min_area: requirementForm.minArea,
            max_area: requirementForm.maxArea,
            area_unit: requirementForm.unit,
            budget_min: Number(requirementForm.budgetMin || 0),
            budget_max: Number(requirementForm.budgetMax || 0),
            preferred_locations: requirementForm.location.trim() ? [requirementForm.location.trim()] : [],
            notes: requirementForm.notes.trim(),
            contact_verified: requirementForm.contactVerified,
            created_at: `${now.date} ${now.time}`,
        };

        onUpdateClient({
            customerRequirements: [requirement, ...(client.customerRequirements || [])],
            req: {
                type: requirement.property_category,
                bhk: requirement.configuration !== 'N/A' ? [requirement.configuration] : [requirement.property_type],
                loc: requirement.preferred_locations.length ? requirement.preferred_locations : ['Location pending'],
                timeline: client.req?.timeline || '30 Days',
            },
            latestNote: requirement.notes || `Requirement added for ${requirement.property_type}.`,
            timeline: [
                createTimelineEvent('Customer Requirement Added', `${requirement.requirement_type} - ${requirement.property_type} in ${requirement.preferred_locations[0] || 'location pending'}`),
                ...(client.timeline || []),
            ],
        });

        setRequirementForm({
            ...requirementInitialState,
            customerName: client.name || '',
            contactNumber: client.phone || '',
            propertyCategory: client.req?.type || client.listingKind || 'Residential',
            propertyType: client.propType || 'Plot',
            location: client.req?.loc?.[0] || '',
        });
    };

    const openProjectFloorPlan = (project) => {
        setExpandedProjectId((current) => (current === project.id ? null : project.id));
        setExpandedConfigByProject((current) => ({
            ...current,
            [project.id]: current[project.id] ?? 0,
        }));
    };

    const selectProjectConfig = (projectId, configIndex) => {
        setExpandedConfigByProject((current) => ({ ...current, [projectId]: configIndex }));
    };

    const toggleUnitAssignment = (project, config, unit) => {
        if (unit.status !== 'Available') return;

        const key = unit.id;
        setSelectedProps((current) => {
            if (current.some((assignment) => assignment.key === key)) {
                return current.filter((assignment) => assignment.key !== key);
            }

            return [
                ...current,
                {
                    key,
                    projectId: project.id,
                    projectName: project.name,
                    configType: config.type,
                    size: config.size,
                    unitNumber: unit.number,
                    floor: unit.floor,
                    facing: unit.facing,
                    price: unit.price,
                },
            ];
        });
    };

    const handleAssignSubmit = () => {
        if (!selectedSalesOfficer || selectedProps.length === 0) return;

        const pipelineItems = selectedProps.map((assignment) => ({
            projectId: assignment.projectId,
            status: 'Shown',
            units: [getSelectedUnitLabel(assignment)],
            selectedUnit: assignment,
            visitedOn: null,
            notes: 'Newly assigned',
        }));
        const timelineEvent = createTimelineEvent('Properties Assigned', `${selectedProps.length} unit${selectedProps.length === 1 ? '' : 's'} assigned to ${selectedSalesOfficer}`);

        setAssignmentSuccess(true);
        onUpdateClient({
            officer: selectedSalesOfficer,
            propertyPipeline: [...pipelineItems, ...(client.propertyPipeline || [])],
            timeline: [timelineEvent, ...(client.timeline || [])],
        });

        window.setTimeout(() => {
            setAssignmentSuccess(false);
            setSelectedProps([]);
            setAssignedOfficer('');
        }, 900);
    };

    const pendingDealItem = pendingDealIndex !== null ? client.propertyPipeline?.[pendingDealIndex] : null;
    const pendingDealProject = pendingDealItem ? getProject(pendingDealItem.projectId) : null;

    const handleConfirmContinueToDeal = () => {
        if (pendingDealIndex === null || !pendingDealItem || !pendingDealProject) return;

        const nextPipeline = (client.propertyPipeline || []).map((item, index) => (
            index === pendingDealIndex
                ? {
                    ...item,
                    status: 'Continued to Deal',
                    continuedToDeal: true,
                    notes: 'Continued to deal from assigned property.',
                }
                : item
        ));

        onUpdateClient({
            status: 'Negotiating',
            propertyPipeline: nextPipeline,
            timeline: [
                createTimelineEvent('Continued to Deal', `${pendingDealProject.name} moved from assigned property to deal.`),
                ...(client.timeline || []),
            ],
        });
        setPendingDealIndex(null);
    };

    const getCheckInTime = (timeRange) => {
        if (!timeRange) return '12:45 PM';
        return timeRange.split('-')[0].trim();
    };

    const getVisitBadgeClass = (status) => {
        if (status === 'Completed') return 'bg-emerald-50 text-emerald-700';
        if (status === 'Cancelled') return 'bg-gray-100 text-gray-500';
        return 'bg-rose-50 text-rose-600';
    };

    const propertyImages = [
        { id: 'front', position: 'center', label: 'Exterior' },
        { id: 'tower', position: 'right center', label: 'Tower' },
        { id: 'view', position: 'left center', label: 'View' },
    ];
    const activeFloorPlanProject = expandedProjectId ? getProject(expandedProjectId) : null;
    const activeFloorPlanInventory = activeFloorPlanProject ? buildInventoryWithUnits(activeFloorPlanProject) : [];
    const activeFloorPlanConfigIndex = activeFloorPlanProject ? (expandedConfigByProject[activeFloorPlanProject.id] ?? 0) : 0;
    const activeFloorPlanConfig = activeFloorPlanInventory[activeFloorPlanConfigIndex] || activeFloorPlanInventory[0];

    return (
        <div className="max-w-[1600px] mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <Card noPadding className="bg-linear-to-r from-white to-[#6F4BFF]/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                    <button onClick={onBack} className="p-2 hover:bg-white/60 rounded-lg text-gray-500 transition-colors backdrop-blur-sm border border-gray-200">
                        <ArrowRight className="w-5 h-5 rotate-180" />
                    </button>
                </div>
                <div className="p-8 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex gap-5">
                        <div className="w-16 h-16 rounded-2xl bg-[#6F4BFF] text-white flex items-center justify-center text-2xl font-bold shadow-lg shadow-[#6F4BFF]/20">
                            {client.name.charAt(0)}
                        </div>
                        <div>
                            <div className="flex flex-wrap items-center gap-3 mb-1">
                                <h2 className="text-2xl font-bold text-gray-900">{client.name}</h2>
                                {getStatusBadge(client.status)}
                            </div>
                            <p className="text-gray-500 font-medium flex flex-wrap items-center gap-3">
                                <span className="flex items-center gap-1"><PhoneCall className="w-3.5 h-3.5" /> {client.phone}</span>
                                <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> Officer: {client.officer}</span>
                            </p>
                            <div className="flex flex-wrap gap-2 mt-3">
                                <Badge variant="gray">{client.req?.type || client.listingKind}</Badge>
                                {(client.req?.bhk || []).map((bhk) => <Badge key={bhk} variant="gray">{bhk}</Badge>)}
                            </div>
                        </div>
                    </div>
                    <div className="text-left lg:text-right lg:mt-6 lg:mr-10">
                        <p className="text-sm text-gray-500 font-semibold mb-1">Approved Budget</p>
                        <p className="text-3xl font-bold text-emerald-600">{client.budget}</p>
                    </div>
                </div>
            </Card>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex overflow-x-auto border-b border-gray-200 hide-scrollbar bg-gray-50/50">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveProfileTab(tab)}
                            className={`whitespace-nowrap px-6 py-4 font-bold text-sm transition-colors border-b-2 ${
                                activeProfileTab === tab
                                    ? 'border-[#6F4BFF] text-[#6F4BFF] bg-white'
                                    : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="p-6 md:p-8 bg-gray-50/30 min-h-[500px]">
                    {activeProfileTab === 'Overview & Pipeline' && (
                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 animate-in fade-in">
                            <div className="space-y-6 xl:col-span-1">
                                <Card>
                                    <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
                                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2"><Search className="w-5 h-5 text-[#6F4BFF]" /> Requirement Profile</h3>
                                        <Button variant="ghost" className="text-xs px-2 py-1 h-auto text-gray-400">Edit</Button>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Preferred Locations</p>
                                            <p className="font-semibold text-gray-800">{(client.req?.loc || ['Location pending']).join(' / ')}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Property Type</p>
                                            <p className="font-semibold text-gray-800">{client.req?.type || client.listingKind} ({(client.req?.bhk || []).join(', ') || client.propType})</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Timeline</p>
                                            <p className="font-semibold text-gray-800">{client.req?.timeline || '30 Days'}</p>
                                        </div>
                                    </div>
                                </Card>
                            </div>

                            <div className="xl:col-span-2">
                                <Card noPadding className="h-full flex flex-col">
                                    <div className="p-6 border-b border-gray-100 bg-white flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2"><Navigation className="w-5 h-5 text-[#6F4BFF]" /> Client Property Pipeline</h3>
                                            <p className="text-sm text-gray-500 mt-1">Track all projects assigned and their current status.</p>
                                        </div>
                                        <Button icon={Plus} onClick={() => setActiveProfileTab('Assign Properties')}>Assign More</Button>
                                    </div>
                                    <div className="flex-1 p-6 bg-gray-50/50">
                                        <div className="space-y-4">
                                            {(client.propertyPipeline || []).map((pipelineItem, index) => {
                                                const project = getProject(pipelineItem.projectId);
                                                if (!project) return null;
                                                let statusBg = 'bg-gray-100 text-gray-600';
                                                let borderClass = 'border-gray-200';
                                                let StatusIcon = Eye;
                                                if (pipelineItem.status === 'Shortlisted') {
                                                    borderClass = 'border-purple-200 shadow-sm';
                                                    statusBg = 'bg-purple-100 text-[#6F4BFF]';
                                                    StatusIcon = Heart;
                                                } else if (pipelineItem.status === 'Visited') {
                                                    borderClass = 'border-blue-200 shadow-sm';
                                                    statusBg = 'bg-blue-100 text-blue-700';
                                                    StatusIcon = MapPin;
                                                } else if (pipelineItem.status === 'Negotiating') {
                                                    borderClass = 'border-amber-200 shadow-sm';
                                                    statusBg = 'bg-amber-100 text-amber-700';
                                                    StatusIcon = TrendingUp;
                                                } else if (pipelineItem.status === 'Not Interested') {
                                                    borderClass = 'border-gray-200 opacity-60';
                                                    statusBg = 'bg-gray-100 text-gray-500';
                                                    StatusIcon = ThumbsDown;
                                                }

                                                return (
                                                    <div key={`${pipelineItem.projectId}-${index}`} className={`bg-white rounded-xl border p-5 transition-all ${borderClass}`}>
                                                        <div className="flex items-start justify-between mb-4">
                                                            <div className="flex gap-4">
                                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${statusBg}`}><StatusIcon className="w-5 h-5" /></div>
                                                                <div>
                                                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                                                        <h4 className="text-lg font-bold text-gray-900">{project.name}</h4>
                                                                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider ${statusBg}`}>{pipelineItem.status}</span>
                                                                    </div>
                                                                    <p className="text-sm text-gray-500">{project.location}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                                                            <div><p className="text-xs font-bold text-gray-400 uppercase mb-1">Target Units</p><p className="font-semibold text-gray-800 text-sm">{pipelineItem.units?.length ? pipelineItem.units.join(', ') : 'Not specified'}</p></div>
                                                            <div><p className="text-xs font-bold text-gray-400 uppercase mb-1">Project Price</p><p className="font-semibold text-gray-800 text-sm">{project.priceRange}</p></div>
                                                            <div><p className="text-xs font-bold text-gray-400 uppercase mb-1">Latest Update</p><p className="font-semibold text-gray-800 text-sm line-clamp-1">{pipelineItem.notes}</p></div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                            {(client.propertyPipeline || []).length === 0 && <p className="text-center text-gray-500 py-10 font-medium">No properties assigned yet.</p>}
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    )}

                    {activeProfileTab === 'Assign Properties' && (
                        <div className="animate-in fade-in">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2"><Sparkles className="w-5 h-5 text-[#6F4BFF]" /> Recommended Matches & Assignment</h3>
                                    <p className="text-sm text-gray-500 mt-1">Select properties below to assign to the client and notify the sales officer.</p>
                                </div>
                            </div>

                            {assignmentSuccess && (
                                <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-lg flex items-center gap-3 font-bold animate-in zoom-in-95 duration-200">
                                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                                    Properties successfully assigned to {selectedSalesOfficer} and sent to the client's app.
                                </div>
                            )}

                            <Card className="mb-8 border-t-4 border-t-[#6F4BFF]">
                                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                                    <div className="flex-1 max-w-md">
                                        <label className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2 block">Assign To Sales Officer</label>
                                        {assignedSalesOfficer ? (
                                            <div className="rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3">
                                                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Assigned Sales Officer</p>
                                                <p className="mt-1 text-sm font-black text-gray-900">{assignedSalesOfficer}</p>
                                            </div>
                                        ) : (
                                            <select value={assignedOfficer} onChange={(event) => setAssignedOfficer(event.target.value)} className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 font-medium text-gray-900 bg-white">
                                                <option value="">Select Officer</option>
                                                {officers.map((officer) => <option key={officer} value={officer}>{officer}</option>)}
                                            </select>
                                        )}
                                    </div>
                                    <div className="rounded-xl border border-[#6F4BFF]/10 bg-[#6F4BFF]/5 px-4 py-3 text-sm font-bold text-[#6F4BFF]">
                                        Select unit numbers in the floor plan, then assign from the workspace.
                                    </div>
                                </div>
                            </Card>

                            {(client.propertyPipeline || []).length > 0 && (
                                <>
                                    <div className="flex justify-between items-end mb-4">
                                        <div>
                                            <h4 className="text-lg font-bold text-gray-900">Already Assigned Properties</h4>
                                            <p className="text-sm font-medium text-gray-500 mt-1">Continue an assigned property into deal when the client is ready.</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                        {(client.propertyPipeline || []).map((pipelineItem, index) => {
                                            const project = getProject(pipelineItem.projectId);
                                            if (!project) return null;
                                            const continuedToDeal = Boolean(pipelineItem.continuedToDeal);

                                            return (
                                                <Card key={`${pipelineItem.projectId}-assigned-${index}`} noPadding className={`relative border-2 transition-all ${continuedToDeal ? 'border-emerald-200 bg-emerald-50/40' : 'border-gray-200 bg-white'}`}>
                                                    {continuedToDeal && (
                                                        <div className="absolute top-4 left-4 z-20">
                                                            <Badge variant="green">Continued to Deal</Badge>
                                                        </div>
                                                    )}
                                                    <div className="p-4 pt-12">
                                                        <div className="mb-4">
                                                            <h4 className="font-bold text-gray-900 text-base capitalize mb-1">{project.name}</h4>
                                                            <p className="text-[11px] text-gray-500 font-medium flex items-start gap-1 mb-2">
                                                                <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" /> {project.location}
                                                            </p>
                                                            <p className="text-sm font-bold text-gray-800">{project.priceRange}</p>
                                                        </div>
                                                        <div className="rounded-lg border border-gray-100 bg-gray-50 p-3 mb-4">
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Assignment Status</p>
                                                            <p className="text-sm font-bold text-gray-800 mt-1">{pipelineItem.status}</p>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            disabled={continuedToDeal}
                                                            onClick={() => setPendingDealIndex(index)}
                                                            className="w-full rounded-lg bg-[#6F4BFF] px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-[#6F4BFF]/20 transition hover:bg-[#5936eb] disabled:bg-emerald-100 disabled:text-emerald-700 disabled:shadow-none"
                                                        >
                                                            {continuedToDeal ? 'Continued to Deal' : 'Continue to Deal'}
                                                        </button>
                                                    </div>
                                                </Card>
                                            );
                                        })}
                                    </div>
                                </>
                            )}

                            <div className="flex justify-between items-end mb-4">
                                <h4 className="text-lg font-bold text-gray-900">Available Properties</h4>
                                <span className="text-sm font-bold text-gray-600 bg-white px-3 py-1 rounded-lg border border-gray-200 shadow-sm">Selected Units: <span className="text-[#6F4BFF] text-lg ml-1">{selectedProps.length}</span></span>
                            </div>

                            <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,0.9fr)_minmax(520px,1.1fr)] gap-6 items-start">
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-5">
                                    {projects.map((project) => {
                                        const isRecommended = project.priceRange.includes('Cr') && client.budget.includes('Cr');
                                        const isExpanded = expandedProjectId === project.id;
                                        const selectedProjectUnits = selectedProps.filter((assignment) => assignment.projectId === project.id);

                                        return (
                                            <Card key={project.id} noPadding className={`relative border-2 transition-all ${isExpanded ? 'border-[#6F4BFF] shadow-lg ring-2 ring-[#6F4BFF]/10 bg-purple-50/10' : 'border-gray-200 hover:border-[#6F4BFF]/50'}`}>
                                                {isRecommended && <div className="absolute top-4 left-4 z-20"><Badge variant="green">98% Match</Badge></div>}
                                                <button type="button" className="w-full text-left flex gap-4 p-4 pt-12 items-start" onClick={() => openProjectFloorPlan(project)}>
                                                    <div className="flex-1">
                                                        <h4 className="font-bold text-gray-900 text-base capitalize mb-1">{project.name}</h4>
                                                        <p className="text-[11px] text-gray-500 font-medium flex items-start gap-1 mb-2"><MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" /> {project.location}</p>
                                                        <p className="text-sm font-bold text-gray-800">{project.priceRange}</p>
                                                        {selectedProjectUnits.length > 0 && (
                                                            <div className="mt-3 flex flex-wrap gap-1.5">
                                                                {selectedProjectUnits.map((assignment) => (
                                                                    <span key={assignment.key} className="rounded-md bg-[#6F4BFF]/10 px-2 py-1 text-[10px] font-black text-[#6F4BFF]">
                                                                        Unit {assignment.unitNumber}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <span className={`mt-1 rounded-lg border px-3 py-1.5 text-[10px] font-black uppercase tracking-widest ${isExpanded ? 'border-[#6F4BFF] bg-[#6F4BFF] text-white' : 'border-gray-200 bg-white text-gray-500'}`}>
                                                        Open Plan
                                                    </span>
                                                </button>
                                                <div className="px-4 pb-4 flex gap-2">
                                                    <Button
                                                        variant="secondary"
                                                        icon={Eye}
                                                        className="flex-1 text-[10px] py-2 font-black uppercase tracking-widest"
                                                        onClick={() => setProjectDetails(project)}
                                                    >
                                                        View Full Project
                                                    </Button>
                                                </div>
                                            </Card>
                                        );
                                    })}
                                </div>

                                <div className="xl:sticky xl:top-6">
                                    <Card noPadding className="overflow-hidden border-[#ded8ff] shadow-xl shadow-[#6F4BFF]/10">
                                        {activeFloorPlanProject && activeFloorPlanConfig ? (
                                            <div className="bg-gray-50/80 animate-in fade-in slide-in-from-right-3 duration-200">
                                                <div className="border-b border-gray-100 bg-white p-5">
                                                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                                        <div>
                                                            <p className="text-[10px] font-black text-[#6F4BFF] uppercase tracking-widest">Floor Plan Workspace</p>
                                                            <h5 className="mt-1 text-xl font-black text-gray-900 tracking-tight">{activeFloorPlanProject.name}</h5>
                                                            <p className="mt-1 text-xs font-bold text-gray-500 flex items-center gap-1.5">
                                                                <MapPin className="w-3.5 h-3.5 text-rose-500" /> {activeFloorPlanProject.location}
                                                            </p>
                                                        </div>
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <Badge variant="gray">{activeFloorPlanConfig.availableUnits} Available</Badge>
                                                            <Badge variant="purple">{selectedProps.filter((assignment) => assignment.projectId === activeFloorPlanProject.id).length} Selected</Badge>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="p-5">
                                                    <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-5">
                                                        {activeFloorPlanInventory.map((config, configIndex) => (
                                                            <button
                                                                key={`${activeFloorPlanProject.id}-${config.type}`}
                                                                type="button"
                                                                onClick={() => selectProjectConfig(activeFloorPlanProject.id, configIndex)}
                                                                className={`shrink-0 rounded-xl border px-4 py-3 text-left transition-all ${activeFloorPlanConfigIndex === configIndex ? 'border-[#6F4BFF] bg-white shadow-md text-[#6F4BFF]' : 'border-gray-200 bg-white/70 text-gray-600 hover:border-[#6F4BFF]/40'}`}
                                                            >
                                                                <span className="block text-[10px] font-black uppercase tracking-widest">{config.type}</span>
                                                                <span className="block text-[10px] font-bold mt-1">{config.size} - {config.basePrice}</span>
                                                            </button>
                                                        ))}
                                                    </div>

                                                    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-inner">
                                                        <div className="mb-5 flex items-center justify-between gap-3">
                                                            <h5 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                                                                <Layers className="w-4 h-4 text-[#6F4BFF]" /> Interactive Unit Grid
                                                            </h5>
                                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{activeFloorPlanConfig.type}</span>
                                                        </div>
                                                        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3">
                                                            {activeFloorPlanConfig.unitsList.map((unit) => {
                                                                const isUnitSelected = selectedProps.some((assignment) => assignment.key === unit.id);
                                                                return (
                                                                    <button
                                                                        key={unit.id}
                                                                        type="button"
                                                                        disabled={unit.status !== 'Available'}
                                                                        onClick={() => toggleUnitAssignment(activeFloorPlanProject, activeFloorPlanConfig, unit)}
                                                                        className={`h-14 rounded-xl border flex flex-col items-center justify-center transition-all ${
                                                                            unit.status === 'Available' ? 'bg-white border-gray-200 hover:border-[#6F4BFF] hover:shadow-md' : 'bg-rose-50 border-rose-100 text-rose-300 cursor-not-allowed'
                                                                        } ${isUnitSelected ? 'ring-2 ring-[#6F4BFF] border-[#6F4BFF] shadow-lg shadow-[#6F4BFF]/20 scale-105 z-10 text-[#6F4BFF]' : ''}`}
                                                                    >
                                                                        <span className="text-sm font-black">{unit.number}</span>
                                                                        <span className="text-[8px] font-bold uppercase tracking-tighter opacity-60">{isUnitSelected ? 'Selected' : unit.status}</span>
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>

                                                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                        <div className="rounded-xl border border-gray-100 bg-white p-3">
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Configuration</p>
                                                            <p className="mt-1 text-sm font-black text-gray-900">{activeFloorPlanConfig.type}</p>
                                                        </div>
                                                        <div className="rounded-xl border border-gray-100 bg-white p-3">
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Area</p>
                                                            <p className="mt-1 text-sm font-black text-gray-900">{activeFloorPlanConfig.size}</p>
                                                        </div>
                                                        <div className="rounded-xl border border-gray-100 bg-white p-3">
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Base Price</p>
                                                            <p className="mt-1 text-sm font-black text-gray-900">{activeFloorPlanConfig.basePrice}</p>
                                                        </div>
                                                    </div>

                                                    <p className="mt-4 text-[11px] font-bold text-gray-500">Choose the exact unit number to assign. Sold units are locked.</p>

                                                    <div className="mt-4 rounded-2xl border border-[#6F4BFF]/15 bg-white p-4 shadow-sm">
                                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                                            <div>
                                                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Ready to Assign</p>
                                                                <p className="mt-1 text-sm font-black text-gray-900">
                                                                    {selectedProps.length} selected unit{selectedProps.length === 1 ? '' : 's'}
                                                                    {selectedSalesOfficer ? ` for ${selectedSalesOfficer}` : ' - select a sales officer first'}
                                                                </p>
                                                            </div>
                                                            <button
                                                                onClick={handleAssignSubmit}
                                                                disabled={selectedProps.length === 0 || !selectedSalesOfficer}
                                                                className="min-w-40 rounded-xl bg-[#6F4BFF] px-6 py-3 text-sm font-black text-white shadow-md shadow-[#6F4BFF]/20 transition-all hover:bg-[#5936eb] disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500 disabled:shadow-none flex items-center justify-center gap-2"
                                                            >
                                                                <Navigation className="w-4 h-4" /> Assign
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex min-h-[520px] flex-col items-center justify-center bg-gray-50/70 p-10 text-center">
                                                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#6F4BFF]/10 text-[#6F4BFF]">
                                                    <Layers className="h-7 w-7" />
                                                </div>
                                                <p className="text-sm font-black uppercase tracking-widest text-gray-900">Select a Property</p>
                                                <p className="mt-2 max-w-sm text-sm font-semibold text-gray-500">Click Open Plan on any available property to view the larger floor plan and assign a specific unit number.</p>
                                            </div>
                                        )}
                                    </Card>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeProfileTab === 'Customer Requirement' && (
                        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px] animate-in fade-in">
                            <div className="space-y-4">
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                                            <FileText className="w-5 h-5 text-[#6F4BFF]" /> Customer Requirement
                                        </h3>
                                        <p className="text-sm text-gray-500 mt-1">Requirements added for this customer from broker-style intake.</p>
                                    </div>
                                    <Badge variant="purple">{(client.customerRequirements || []).length} Requirement{(client.customerRequirements || []).length === 1 ? '' : 's'}</Badge>
                                </div>

                                {(client.customerRequirements || []).length === 0 ? (
                                    <Card className="border-dashed border-2 border-gray-200 bg-white text-center py-12">
                                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#6F4BFF]/10 text-[#6F4BFF]">
                                            <FileText className="h-8 w-8" />
                                        </div>
                                        <h4 className="text-xl font-black text-gray-900">No Requirements Found</h4>
                                        <p className="mt-2 text-sm font-semibold text-gray-400">Add a customer requirement using the form on the right.</p>
                                    </Card>
                                ) : (
                                    <div className="grid gap-4">
                                        {(client.customerRequirements || []).map((requirement) => (
                                            <div key={requirement.id} className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                                                <div className="flex items-center justify-between gap-3 bg-linear-to-r from-[#4A43EC] to-[#C4C1FF] px-5 py-4 text-white">
                                                    <div className="min-w-0">
                                                        <p className="truncate text-base font-black">{requirement.customer_name}</p>
                                                        <p className="text-xs font-semibold text-white/80">{requirement.contact_number}</p>
                                                    </div>
                                                    <span className="rounded-full bg-white px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#4A43EC]">
                                                        {requirement.requirement_type}
                                                    </span>
                                                </div>
                                                <div className="p-5">
                                                    <div className="mb-4 flex flex-wrap gap-2">
                                                        <span className="rounded-lg bg-[#6F4BFF]/10 px-3 py-1 text-[10px] font-black uppercase text-[#6F4BFF]">{requirement.property_category}</span>
                                                        <span className="rounded-lg bg-[#6F4BFF]/10 px-3 py-1 text-[10px] font-black uppercase text-[#6F4BFF]">{requirement.property_type}</span>
                                                        {requirement.configuration !== 'N/A' && <span className="rounded-lg bg-gray-100 px-3 py-1 text-[10px] font-black uppercase text-gray-600">{requirement.configuration}</span>}
                                                        {requirement.contact_verified && <span className="rounded-lg bg-emerald-50 px-3 py-1 text-[10px] font-black uppercase text-emerald-600">Verified</span>}
                                                    </div>
                                                    <div className="grid gap-3 sm:grid-cols-2">
                                                        <div className="rounded-xl bg-[#F8F9FE] p-4">
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Budget Range</p>
                                                            <p className="mt-1 flex items-center gap-1 text-sm font-black text-gray-950">
                                                                <IndianRupee className="h-4 w-4 text-[#6F4BFF]" /> {formatRequirementAmount(requirement.budget_min)} - {formatRequirementAmount(requirement.budget_max)}
                                                            </p>
                                                        </div>
                                                        <div className="rounded-xl bg-[#F8F9FE] p-4">
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Area Requirement</p>
                                                            <p className="mt-1 text-sm font-black text-gray-950">
                                                                {requirement.min_area || '-'} - {requirement.max_area || '-'} {requirement.area_unit}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <p className="mt-4 text-sm font-semibold text-gray-600">
                                                        <span className="font-black text-gray-900">Location:</span> {requirement.preferred_locations?.[0] || 'N/A'}
                                                    </p>
                                                    {requirement.notes && <p className="mt-2 text-sm font-medium text-gray-500">{requirement.notes}</p>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <Card className="h-fit border-gray-200 shadow-sm">
                                <div className="mb-5">
                                    <h4 className="text-lg font-black text-gray-900">Add Customer Requirement</h4>
                                    <p className="mt-1 text-xs font-semibold text-gray-500">Same intake structure as the broker app.</p>
                                </div>
                                <form onSubmit={handleAddRequirement} className="space-y-5">
                                    <div>
                                        <label className="mb-2 block text-xs font-black text-gray-700">Property Requirements</label>
                                        <div className="flex flex-wrap gap-2">
                                            {requirementTypes.map((item) => (
                                                <button key={item} type="button" onClick={() => updateRequirementForm('status', item)} className={`rounded-full border px-4 py-2 text-xs font-black ${requirementForm.status === item ? 'border-[#4A43EC] bg-[#EEEDFD] text-[#4A43EC]' : 'border-gray-200 bg-white text-gray-500'}`}>
                                                    {item}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-xs font-black text-gray-700">Property Category</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {propertyCategories.map((item) => (
                                                <button key={item} type="button" onClick={() => updateRequirementForm('propertyCategory', item)} className={`rounded-xl border p-4 text-left text-sm font-black ${requirementForm.propertyCategory === item ? 'border-[#4A43EC] bg-[#EEEDFD] text-[#4A43EC]' : 'border-gray-200 bg-white text-gray-700'}`}>
                                                    {item}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-xs font-black text-gray-700">Property Type</label>
                                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-2">
                                            {(propertyTypesByCategory[requirementForm.propertyCategory] || []).map((item) => (
                                                <button key={item} type="button" onClick={() => updateRequirementForm('propertyType', item)} className={`rounded-lg border px-3 py-3 text-xs font-black ${requirementForm.propertyType === item ? 'border-[#4A43EC] bg-[#EEEDFD] text-[#4A43EC]' : 'border-gray-200 bg-white text-gray-600'}`}>
                                                    {item}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {configurationOptions[requirementForm.propertyType] && (
                                        <div>
                                            <label className="mb-2 block text-xs font-black text-gray-700">Configuration / Status</label>
                                            <select value={requirementForm.configuration} onChange={(event) => updateRequirementForm('configuration', event.target.value)} className="w-full rounded-xl border border-gray-300 bg-white p-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-[#6F4BFF]/30">
                                                <option value="N/A">Select option</option>
                                                {configurationOptions[requirementForm.propertyType].map((item) => <option key={item}>{item}</option>)}
                                            </select>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="mb-2 block text-xs font-black text-gray-700">Min Area</label>
                                            <input type="number" value={requirementForm.minArea} onChange={(event) => updateRequirementForm('minArea', event.target.value)} placeholder="Optional" className="w-full rounded-lg border border-gray-300 p-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-[#6F4BFF]/30" />
                                        </div>
                                        <div>
                                            <label className="mb-2 block text-xs font-black text-gray-700">Max Area</label>
                                            <input type="number" value={requirementForm.maxArea} onChange={(event) => updateRequirementForm('maxArea', event.target.value)} placeholder="2000" className="w-full rounded-lg border border-gray-300 p-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-[#6F4BFF]/30" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-xs font-black text-gray-700">Unit</label>
                                        <select value={requirementForm.unit} onChange={(event) => updateRequirementForm('unit', event.target.value)} className="w-full rounded-lg border border-gray-300 bg-white p-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-[#6F4BFF]/30">
                                            {areaUnits.map((item) => <option key={item}>{item}</option>)}
                                        </select>
                                    </div>

                                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                                        <div>
                                            <label className="mb-2 block text-xs font-black text-gray-700">Customer Name</label>
                                            <input value={requirementForm.customerName} onChange={(event) => updateRequirementForm('customerName', event.target.value)} className="w-full rounded-lg border border-gray-300 p-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-[#6F4BFF]/30" />
                                        </div>
                                        <div>
                                            <label className="mb-2 block text-xs font-black text-gray-700">Contact Number</label>
                                            <input value={requirementForm.contactNumber} onChange={(event) => updateRequirementForm('contactNumber', event.target.value)} className="w-full rounded-lg border border-gray-300 p-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-[#6F4BFF]/30" />
                                        </div>
                                    </div>

                                    {!requirementForm.contactVerified && requirementForm.contactNumber.length >= 10 && (
                                        <div>
                                            <label className="mb-2 block text-xs font-black text-gray-700">OTP Verification</label>
                                            <input maxLength={4} value={requirementForm.otp} onChange={(event) => updateRequirementForm('otp', event.target.value.replace(/\D/g, ''))} placeholder="Enter 4 digit OTP" className="w-full rounded-lg border border-gray-300 p-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-[#6F4BFF]/30" />
                                            <p className="mt-1 text-[10px] font-bold text-gray-400">Any 4 digit OTP marks contact verified.</p>
                                        </div>
                                    )}

                                    <div>
                                        <label className="mb-2 block text-xs font-black text-gray-700">Preferred Location</label>
                                        <input value={requirementForm.location} onChange={(event) => updateRequirementForm('location', event.target.value)} placeholder="Enter preferred location" className="w-full rounded-lg border border-gray-300 p-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-[#6F4BFF]/30" />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="mb-2 block text-xs font-black text-gray-700">Budget Min</label>
                                            <input type="number" value={requirementForm.budgetMin} onChange={(event) => updateRequirementForm('budgetMin', event.target.value)} className="w-full rounded-lg border border-gray-300 p-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-[#6F4BFF]/30" />
                                        </div>
                                        <div>
                                            <label className="mb-2 block text-xs font-black text-gray-700">Budget Max</label>
                                            <input type="number" value={requirementForm.budgetMax} onChange={(event) => updateRequirementForm('budgetMax', event.target.value)} className="w-full rounded-lg border border-gray-300 p-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-[#6F4BFF]/30" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-xs font-black text-gray-700">Details</label>
                                        <textarea rows="4" value={requirementForm.notes} onChange={(event) => updateRequirementForm('notes', event.target.value)} placeholder="Requirement notes..." className="w-full rounded-lg border border-gray-300 p-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-[#6F4BFF]/30" />
                                    </div>

                                    <Button type="submit" icon={Plus} className="w-full bg-[#4A43EC] hover:bg-[#3932d5] text-white font-black">
                                        Add Requirement
                                    </Button>
                                </form>
                            </Card>
                        </div>
                    )}

                    {activeProfileTab === 'Follow-up & Notes' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in">
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-6"><MessageSquare className="w-5 h-5 text-[#6F4BFF]" /> Notes & Communication</h3>
                                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm mb-6 relative">
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                                        <div>
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Note Type</label>
                                            <select
                                                value={followUpForm.type}
                                                onChange={(event) => setFollowUpForm({ ...followUpForm, type: event.target.value })}
                                                className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-[#6F4BFF]/30 bg-white"
                                            >
                                                <option>Call Note</option>
                                                <option>Follow-up Note</option>
                                                <option>Meeting Note</option>
                                                <option>Requirement Update</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Next Follow-up</label>
                                            <input
                                                type="date"
                                                value={followUpForm.nextFollowUp}
                                                onChange={(event) => setFollowUpForm({ ...followUpForm, nextFollowUp: event.target.value })}
                                                className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-[#6F4BFF]/30 bg-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Client Status</label>
                                            <select
                                                value={followUpForm.status}
                                                onChange={(event) => setFollowUpForm({ ...followUpForm, status: event.target.value })}
                                                className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-[#6F4BFF]/30 bg-white"
                                            >
                                                <option>Active</option>
                                                <option>Negotiating</option>
                                                <option>Pending</option>
                                                <option>Completed</option>
                                                <option>Suspended</option>
                                            </select>
                                        </div>
                                    </div>
                                    <textarea rows="4" value={newNote} onChange={(event) => setNewNote(event.target.value)} placeholder="Log a call summary or add an internal note..." className="w-full border border-gray-100 rounded-lg p-3 outline-none resize-none text-gray-800 font-medium focus:ring-2 focus:ring-[#6F4BFF]/30"></textarea>
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-3 border-t border-gray-100 pt-3">
                                        <p className="text-xs font-bold text-gray-400">{newNote.trim().length} characters</p>
                                        <button disabled={!newNote.trim()} onClick={handleAddNote} className="bg-[#6F4BFF] hover:bg-[#5936eb] text-white px-6 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"><Plus className="w-4 h-4" /> Save Follow-up</button>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    {(client.notes || []).map((note, index) => (
                                        <div key={`${note.date}-${note.time}-${index}`} className="bg-amber-50/80 border border-amber-200 p-4 rounded-xl shadow-sm">
                                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                                <Badge variant="yellow">{note.type || 'Note'}</Badge>
                                                {note.nextFollowUp && <span className="text-[10px] font-black text-[#6F4BFF] bg-white border border-amber-100 rounded-lg px-2 py-1">Next: {note.nextFollowUp}</span>}
                                                {note.status && <span className="text-[10px] font-black text-gray-500 bg-white border border-amber-100 rounded-lg px-2 py-1">{note.status}</span>}
                                            </div>
                                            <p className="text-gray-800 font-medium text-sm">{note.text}</p>
                                            <p className="text-xs text-gray-500 mt-3 font-bold flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {note.date} at {note.time}</p>
                                        </div>
                                    ))}
                                    {(client.notes || []).length === 0 && <p className="text-gray-500 font-medium">No notes added yet.</p>}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-6"><Activity className="w-5 h-5 text-emerald-500" /> Complete Timeline</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                                    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Current Status</p>
                                        <div className="mt-2">{getStatusBadge(client.status)}</div>
                                    </div>
                                    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Next Follow-up</p>
                                        <p className="mt-2 text-sm font-black text-gray-900">{client.nextFollowUp || 'Not Scheduled'}</p>
                                    </div>
                                </div>
                                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden p-2">
                                    {(client.timeline || []).map((item, index) => (
                                        <div key={`${item.title}-${index}`} className="flex justify-between items-center p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors rounded-lg">
                                            <div>
                                                <h4 className="font-bold text-gray-900 text-sm">{item.title}</h4>
                                                <p className="text-xs font-medium text-gray-500 mt-1">{item.details}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded">{item.date} {item.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                    {(client.timeline || []).length === 0 && <p className="text-center text-gray-400 p-6 text-sm font-medium">No timeline events yet.</p>}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeProfileTab === 'Site Visits' && (
                        <div className="animate-in fade-in">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2"><MapPin className="w-5 h-5 text-rose-500" /> Property Site Visits</h3>
                                <Button icon={Calendar}>Schedule New Visit</Button>
                            </div>
                            <div className={`grid gap-6 ${selectedSiteVisit ? 'xl:grid-cols-[minmax(0,1fr)_360px]' : 'grid-cols-1'}`}>
                                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden min-w-0">
                                    <Table
                                        headers={['Property', 'Date & Time', 'Officer', 'Status', 'Notes']}
                                        data={clientVisits}
                                        renderRow={(row, index) => (
                                            <tr
                                                key={`${row.id}-${index}`}
                                                onClick={() => setSelectedSiteVisitId(row.id)}
                                                onKeyDown={(event) => {
                                                    if (event.key === 'Enter' || event.key === ' ') {
                                                        event.preventDefault();
                                                        setSelectedSiteVisitId(row.id);
                                                    }
                                                }}
                                                tabIndex={0}
                                                aria-selected={selectedSiteVisitId === row.id}
                                                className={`cursor-pointer transition-colors focus:outline-none focus:bg-rose-50 ${selectedSiteVisitId === row.id ? 'bg-rose-50' : 'hover:bg-gray-50'}`}
                                            >
                                                <td className="px-6 py-4 font-bold text-gray-900">{row.property.name}</td>
                                                <td className="px-6 py-4 text-sm font-medium text-gray-600">{row.date} <span className="text-gray-400 text-xs ml-1">{row.time}</span></td>
                                                <td className="px-6 py-4 text-sm font-medium text-gray-800">{row.officerName}</td>
                                                <td className="px-6 py-4">{getStatusBadge(row.status)}</td>
                                                <td className="px-6 py-4 text-xs font-medium text-gray-500 max-w-[200px] truncate">{row.notes}</td>
                                            </tr>
                                        )}
                                    />
                                    {clientVisits.length === 0 && <p className="text-center text-gray-500 py-10 font-medium">No site visits found for this client.</p>}
                                </div>

                                {selectedSiteVisit && (
                                    <aside className="rounded-2xl border border-[#d9d2ef] bg-[#fbf8ff] p-5 shadow-sm animate-in slide-in-from-right-4 fade-in duration-200">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h4 className="text-lg font-black text-[#151034] leading-tight">
                                                        {selectedSiteVisit.property.name} - {selectedSiteVisit.property.config?.split(' ')[0] || selectedSiteVisit.property.type}
                                                    </h4>
                                                    <span className={`rounded-md px-2.5 py-1 text-xs font-black uppercase ${getVisitBadgeClass(selectedSiteVisit.status)}`}>
                                                        {selectedSiteVisit.status === 'Completed' ? 'HOT' : selectedSiteVisit.status}
                                                    </span>
                                                </div>
                                                <p className="mt-1 text-sm font-medium text-gray-600">{selectedSiteVisit.property.address}</p>
                                            </div>
                                        </div>

                                        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                                            <div className="inline-flex items-center gap-2 rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2 font-black text-emerald-600">
                                                <MapPin className="h-4 w-4" />
                                                Checked In: {getCheckInTime(selectedSiteVisit.time)}
                                            </div>
                                            <span className="text-xs font-bold text-gray-400">Geo-Verified</span>
                                        </div>

                                        <div className="mt-5 grid grid-cols-3 gap-3">
                                            {propertyImages.map((image) => (
                                                <div key={image.id} className="aspect-square overflow-hidden rounded-lg border border-white bg-white shadow-sm">
                                                    <img
                                                        src={propertyHeroImage}
                                                        alt={`${selectedSiteVisit.property.name} ${image.label}`}
                                                        className="h-full w-full object-cover"
                                                        style={{ objectPosition: image.position }}
                                                    />
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                                            <div className="rounded-xl border border-white bg-white/80 p-3">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Price</p>
                                                <p className="mt-1 font-black text-gray-900">{selectedSiteVisit.property.price}</p>
                                            </div>
                                            <div className="rounded-xl border border-white bg-white/80 p-3">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Type</p>
                                                <p className="mt-1 font-black text-gray-900">{selectedSiteVisit.property.type}</p>
                                            </div>
                                            <div className="rounded-xl border border-white bg-white/80 p-3">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Officer</p>
                                                <p className="mt-1 font-black text-gray-900">{selectedSiteVisit.officerName}</p>
                                            </div>
                                            <div className="rounded-xl border border-white bg-white/80 p-3">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Visit Date</p>
                                                <p className="mt-1 font-black text-gray-900">{selectedSiteVisit.date}</p>
                                            </div>
                                        </div>

                                        <div className="mt-3 rounded-xl border border-white bg-white/80 p-3">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Visit Notes</p>
                                            <p className="mt-1 text-sm font-semibold text-gray-700">{selectedSiteVisit.notes}</p>
                                        </div>
                                    </aside>
                                )}
                            </div>
                        </div>
                    )}

                    {activeProfileTab === 'Meetings' && (
                        <div className="animate-in fade-in">
                            <div className="flex flex-col gap-2 mb-6 sm:flex-row sm:items-center sm:justify-between">
                                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                    <Users className="w-5 h-5 text-blue-600" /> Meetings Log
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    <Badge variant="purple">{(client.meetings || []).filter((meeting) => (meeting.status || 'Scheduled') === 'Scheduled').length} Scheduled</Badge>
                                    <Badge variant="green">{(client.meetings || []).filter((meeting) => meeting.status === 'Completed').length} Completed</Badge>
                                </div>
                            </div>

                            <div className="grid gap-6 xl:grid-cols-[minmax(320px,420px)_minmax(0,1fr)]">
                                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit">
                                    <div className="flex items-center justify-between mb-5">
                                        <div>
                                            <h4 className="font-black text-gray-900">{editingMeetingIndex === null ? 'Schedule Meeting' : 'Edit Meeting'}</h4>
                                            <p className="text-xs font-semibold text-gray-500 mt-1">Date and time are required.</p>
                                        </div>
                                        {editingMeetingIndex !== null && (
                                            <button onClick={handleCancelMeetingEdit} className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50">
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>

                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs font-bold text-gray-700">Meeting Date</label>
                                                <input type="date" value={meetingForm.date} onChange={(event) => setMeetingForm({ ...meetingForm, date: event.target.value })} className="w-full mt-2 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 bg-white" />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-gray-700">Meeting Time</label>
                                                <input type="time" value={meetingForm.time} onChange={(event) => setMeetingForm({ ...meetingForm, time: event.target.value })} className="w-full mt-2 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 bg-white" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs font-bold text-gray-700">Meeting Type</label>
                                                <select value={meetingForm.mode} onChange={(event) => setMeetingForm({ ...meetingForm, mode: event.target.value })} className="w-full mt-2 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 bg-white">
                                                    <option>Office Meeting</option>
                                                    <option>Site Meeting</option>
                                                    <option>Video Call</option>
                                                    <option>Phone Call</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-gray-700">Status</label>
                                                <select value={meetingForm.status} onChange={(event) => setMeetingForm({ ...meetingForm, status: event.target.value })} className="w-full mt-2 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 bg-white">
                                                    <option>Scheduled</option>
                                                    <option>Completed</option>
                                                    <option>Cancelled</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-xs font-bold text-gray-700">Location</label>
                                            <input value={meetingForm.location} onChange={(event) => setMeetingForm({ ...meetingForm, location: event.target.value })} placeholder="Sales office, site address, or video link" className="w-full mt-2 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 bg-white" />
                                        </div>

                                        <div>
                                            <label className="text-xs font-bold text-gray-700">Agenda</label>
                                            <input value={meetingForm.agenda} onChange={(event) => setMeetingForm({ ...meetingForm, agenda: event.target.value })} placeholder="Pricing discussion, documents, site feedback..." className="w-full mt-2 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 bg-white" />
                                        </div>

                                        <div>
                                            <label className="text-xs font-bold text-gray-700">Meeting Remarks</label>
                                            <textarea rows="4" value={meetingForm.remarks} onChange={(event) => setMeetingForm({ ...meetingForm, remarks: event.target.value })} className="w-full mt-2 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 bg-white"></textarea>
                                        </div>

                                        <Button onClick={handleSaveMeeting} disabled={!meetingForm.date || !meetingForm.time} className="w-full bg-[#6F4BFF] hover:bg-[#5936eb] text-white disabled:opacity-50 disabled:cursor-not-allowed">
                                            {editingMeetingIndex === null ? 'Save Meeting' : 'Update Meeting'}
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-3 min-w-0">
                                    {(client.meetings || []).map((meeting, index) => {
                                        const status = meeting.status || 'Scheduled';
                                        return (
                                            <div key={meeting.id || `${meeting.date}-${meeting.time}-${index}`} className="bg-white p-5 border border-gray-200 rounded-xl shadow-sm">
                                                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                                    <div className="min-w-0">
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <p className="font-black text-gray-900 text-lg flex items-center gap-2">
                                                                <Calendar className="w-4 h-4 text-gray-400" /> {meeting.date}
                                                                <span className="text-gray-400 text-sm font-bold">{meeting.time}</span>
                                                            </p>
                                                            <span className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-wide ${getMeetingStatusClass(status)}`}>
                                                                {status}
                                                            </span>
                                                        </div>
                                                        <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                                                            <p className="font-semibold text-gray-700"><span className="text-gray-400 font-black uppercase text-[10px] block">Type</span>{meeting.mode || 'Office Meeting'}</p>
                                                            <p className="font-semibold text-gray-700"><span className="text-gray-400 font-black uppercase text-[10px] block">Location</span>{meeting.location || 'Sales office'}</p>
                                                            <p className="font-semibold text-gray-700 sm:col-span-2"><span className="text-gray-400 font-black uppercase text-[10px] block">Agenda</span>{meeting.agenda || 'Client discussion'}</p>
                                                        </div>
                                                        <p className="text-sm text-gray-600 mt-3 font-medium bg-gray-50 p-3 rounded-lg border border-gray-100">{meeting.remarks || 'No remarks added.'}</p>
                                                    </div>

                                                    <div className="flex flex-wrap gap-2 lg:justify-end">
                                                        {status !== 'Completed' && (
                                                            <button onClick={() => handleMeetingStatusChange(meeting, index, 'Completed')} className="inline-flex items-center gap-1 rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs font-black text-emerald-700 hover:bg-emerald-100">
                                                                <CheckCircle2 className="w-3.5 h-3.5" /> Complete
                                                            </button>
                                                        )}
                                                        {status !== 'Cancelled' && (
                                                            <button onClick={() => handleMeetingStatusChange(meeting, index, 'Cancelled')} className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-black text-gray-600 hover:bg-gray-100">
                                                                <X className="w-3.5 h-3.5" /> Cancel
                                                            </button>
                                                        )}
                                                        <button onClick={() => handleEditMeeting(meeting, index)} className="rounded-lg border border-[#6F4BFF]/20 bg-[#6F4BFF]/5 px-3 py-2 text-xs font-black text-[#6F4BFF] hover:bg-[#6F4BFF]/10">
                                                            Edit
                                                        </button>
                                                        <button onClick={() => handleDeleteMeeting(meeting, index)} className="rounded-lg border border-rose-100 bg-rose-50 px-3 py-2 text-xs font-black text-rose-600 hover:bg-rose-100">
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {(client.meetings || []).length === 0 && (
                                        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
                                            <Calendar className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                                            <p className="text-gray-500 font-bold">No meetings scheduled.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <Modal isOpen={Boolean(projectDetails)} onClose={() => setProjectDetails(null)} title={projectDetails ? `${projectDetails.name} - Full Project Details` : 'Project Details'} size="xl">
                {projectDetails && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6">
                            <div className="rounded-2xl border border-gray-100 bg-linear-to-br from-[#6F4BFF]/10 to-white p-6">
                                <div className="flex items-start gap-4">
                                    <div className="h-14 w-14 rounded-2xl bg-[#6F4BFF] text-white flex items-center justify-center shadow-lg shadow-[#6F4BFF]/20">
                                        <Building2 className="h-7 w-7" />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h3 className="text-2xl font-black text-gray-900 tracking-tight">{projectDetails.name}</h3>
                                            {getStatusBadge(projectDetails.status)}
                                        </div>
                                        <p className="mt-2 text-sm font-bold text-gray-600 flex items-center gap-1.5">
                                            <MapPin className="h-4 w-4 text-rose-500" /> {projectDetails.location}
                                        </p>
                                        <p className="mt-3 text-sm font-semibold text-gray-600">
                                            Premium project by <span className="text-[#6F4BFF] font-black">{projectDetails.builder}</span> with {projectDetails.units} total units and {projectDetails.available} currently available.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    ['Price Range', projectDetails.priceRange],
                                    ['Specifications', projectDetails.specs],
                                    ['Progress', `${projectDetails.progress}%`],
                                    ['Updated', projectDetails.updated],
                                ].map(([label, value]) => (
                                    <div key={label} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{label}</p>
                                        <p className="mt-2 text-sm font-black text-gray-900">{value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Builder & Operations</p>
                                <div className="mt-3 space-y-2 text-sm font-bold text-gray-700">
                                    <p>Builder: <span className="text-gray-950">{projectDetails.builder}</span></p>
                                    <p>Inventory Officer: <span className="text-gray-950">{projectDetails.officer}</span></p>
                                    <p>Documents: <span className="text-gray-950">{projectDetails.docs} files in vault</span></p>
                                </div>
                            </div>
                            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Sales Snapshot</p>
                                <div className="mt-3 space-y-2 text-sm font-bold text-gray-700">
                                    <p>Total Units: <span className="text-gray-950">{projectDetails.units}</span></p>
                                    <p>Available Units: <span className="text-emerald-600">{projectDetails.available}</span></p>
                                    <p>Sold Out: <span className="text-gray-950">{Math.round(((projectDetails.units - projectDetails.available) / projectDetails.units) * 100)}%</span></p>
                                </div>
                            </div>
                            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Approval Summary</p>
                                <div className="mt-3 space-y-2 text-sm font-bold text-gray-700">
                                    <p>Status: <span className="text-gray-950">{projectDetails.status}</span></p>
                                    <p>Possession: <span className="text-gray-950">Dec 2027</span></p>
                                    <p>RERA: <span className="text-gray-950">{projectDetails.id}-RERA-2026</span></p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden">
                            <div className="border-b border-gray-100 p-5">
                                <h4 className="text-sm font-black uppercase tracking-widest text-gray-900 flex items-center gap-2">
                                    <Layers className="h-4 w-4 text-[#6F4BFF]" /> Configuration, Pricing & Unit Plan
                                </h4>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            {['Configuration', 'Area', 'Base Price', 'Available', 'Sample Units'].map((header) => (
                                                <th key={header} className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400">{header}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {buildInventoryWithUnits(projectDetails).map((config) => (
                                            <tr key={config.type}>
                                                <td className="px-5 py-4 text-sm font-black text-gray-900">{config.type}</td>
                                                <td className="px-5 py-4 text-sm font-bold text-gray-600">{config.size}</td>
                                                <td className="px-5 py-4 text-sm font-black text-gray-900">{config.basePrice}</td>
                                                <td className="px-5 py-4 text-sm font-bold text-emerald-600">{config.availableUnits} / {config.totalUnits}</td>
                                                <td className="px-5 py-4">
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {config.unitsList.slice(0, 8).map((unit) => (
                                                            <span key={unit.id} className={`rounded-md border px-2 py-1 text-[10px] font-black ${unit.status === 'Available' ? 'border-emerald-100 bg-emerald-50 text-emerald-700' : 'border-rose-100 bg-rose-50 text-rose-400'}`}>
                                                                {unit.number}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-gray-100 bg-white p-5">
                            <h4 className="text-sm font-black uppercase tracking-widest text-gray-900 flex items-center gap-2 mb-4">
                                <FileText className="h-4 w-4 text-[#6F4BFF]" /> Document Vault
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {['RERA Certificate', 'Master Brochure', 'Floor Plans', 'Pricing Sheet', 'Builder KYC', 'Site Layout'].map((doc) => (
                                    <div key={doc} className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                                        <p className="text-sm font-black text-gray-900">{doc}</p>
                                        <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">Available - Updated {projectDetails.updated}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

            <Modal isOpen={pendingDealIndex !== null} onClose={() => setPendingDealIndex(null)} title="Continue to Deal?">
                <div className="space-y-5">
                    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                        <p className="text-sm font-bold text-gray-900">{pendingDealProject?.name}</p>
                        <p className="text-xs font-medium text-gray-500 mt-1">{pendingDealProject?.location}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-600">
                        Are you sure you want to continue this assigned property to deal?
                    </p>
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                        <Button variant="secondary" onClick={() => setPendingDealIndex(null)}>No</Button>
                        <Button onClick={handleConfirmContinueToDeal}>Yes, Continue</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

const Clients = () => {
    const dispatch = useDispatch();
    const { clients } = useSelector((state) => state.clients);
    const [isAddClientOpen, setIsAddClientOpen] = useState(false);
    const [selectedClientId, setSelectedClientId] = useState(null);
    const [activeTab, setActiveTab] = useState('All');
    const [dateFilter, setDateFilter] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [clientForm, setClientForm] = useState(clientFormInitialState);

    const selectedClient = clients.find((client) => client.id === selectedClientId);

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

    if (selectedClient) {
        return (
            <div className="flex-1 flex flex-col h-full relative bg-[#F5F6FA] font-sans text-gray-900">
                <Header title="Clients Hub" showBack onBack={() => setSelectedClientId(null)} />
                <main className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth">
                    <ClientProfileView
                        key={selectedClient.id}
                        client={selectedClient}
                        projects={mockProjects}
                        visits={sample2Visits}
                        officers={officers}
                        onBack={() => setSelectedClientId(null)}
                        onUpdateClient={(changes) => dispatch(updateClient({ id: selectedClient.id, changes }))}
                        onAddNote={(note) => dispatch(addClientNote({ id: selectedClient.id, note }))}
                        onAddMeeting={(meeting) => dispatch(addClientMeeting({ id: selectedClient.id, meeting }))}
                    />
                </main>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-full relative bg-[#F5F6FA] font-sans text-gray-900">
            <Header title="Clients Hub" />

            <main className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth">
                <div className="max-w-[1600px] mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
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

        </div>
    );
};

export default Clients;
