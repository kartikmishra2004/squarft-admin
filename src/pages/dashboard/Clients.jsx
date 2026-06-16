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
    
    IndianRupee,
    Layers,
    MapPin,
    MessageSquare,
    Navigation,
    PhoneCall,
    Plus,
    Search,
    Sparkles,
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
import { addVisit } from '../../store/visitsSlice';
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
    source: '',
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

const requirementTypes = ['Buy', 'Rent/Lease'];
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

const ClientProfileView = ({ client, projects, visits, officers, onBack, onUpdateClient, onAddNote, onAddMeeting, onScheduleVisit }) => {
    const [activeProfileTab, setActiveProfileTab] = useState('Selected Properties');
    const [newNote, setNewNote] = useState('');
    const [isEditingProperty, setIsEditingProperty] = useState(false);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [profileEditForm, setProfileEditForm] = useState({
        name: client.name || '',
        phone: client.phone || '',
        budget: client.budget || '',
        status: client.status || 'Active',
        score: client.score || 'Warm',
        officer: client.officer || '',
        location: client.req?.loc?.[0] || '',
        timeline: client.req?.timeline || '30 Days',
        nextFollowUp: client.nextFollowUp || '',
    });
    const [propertyTypeEdit, setPropertyTypeEdit] = useState({
        category: client.listingKind || 'Residential',
        bhkOptions: client.req?.bhk || ['3BHK'],
    });
    const [followUpForm, setFollowUpForm] = useState({
        type: 'Call Note',
        nextFollowUp: client.nextFollowUp || '',
        status: client.status || 'Active',
    });
    const [meetingForm, setMeetingForm] = useState(meetingInitialState);
    const [editingMeetingIndex, setEditingMeetingIndex] = useState(null);
    const [assignedOfficer, setAssignedOfficer] = useState('');
    const [isChangingOfficer, setIsChangingOfficer] = useState(false);
    const [selectedProps, setSelectedProps] = useState([]);
    const [assignmentSuccess, setAssignmentSuccess] = useState(false);
    const [pendingDealIndex, setPendingDealIndex] = useState(null);
    const [selectedSiteVisitId, setSelectedSiteVisitId] = useState(null);
    const [expandedProjectId, setExpandedProjectId] = useState(null);
    const [expandedConfigByProject, setExpandedConfigByProject] = useState({});
    const [projectDetails, setProjectDetails] = useState(null);
    const [isScheduleVisitOpen, setIsScheduleVisitOpen] = useState(false);
    const [visitForm, setVisitForm] = useState({
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
    });
    const [requirementForm, setRequirementForm] = useState({
        ...requirementInitialState,
        customerName: client.name || '',
        contactNumber: client.phone || '',
        propertyCategory: client.req?.type || client.listingKind || 'Residential',
        propertyType: client.propType || 'Plot',
        configuration: client.req?.bhk?.[0] || 'N/A',
        location: client.req?.loc?.[0] || '',
    });
    const [isEditingRequirement, setIsEditingRequirement] = useState(false);
    const [editRequirementForm, setEditRequirementForm] = useState(null);

    const tabs = ['Selected Properties', 'Follow-up & Notes', 'Site Visits', 'Meetings'];
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

    const handleSavePropertyType = () => {
        onUpdateClient({
            listingKind: propertyTypeEdit.category,
            req: {
                ...client.req,
                type: propertyTypeEdit.category,
                bhk: propertyTypeEdit.bhkOptions,
            },
        });
        setIsEditingProperty(false);
    };

    const openEditRequirement = () => {
        const latest = (client.customerRequirements || [])[0];
        setEditRequirementForm(latest ? {
            status: latest.requirement_type || 'Buy',
            propertyCategory: latest.property_category || 'Residential',
            propertyType: latest.property_type || 'Plot',
            configuration: latest.configuration || 'N/A',
            minArea: latest.min_area || '',
            maxArea: latest.max_area || '',
            unit: latest.area_unit || 'Square Feet (Sq. ft)',
            customerName: latest.customer_name || '',
            contactNumber: latest.contact_number || '',
            location: latest.preferred_locations?.[0] || '',
            budgetMin: String(latest.budget_min || '100000'),
            budgetMax: String(latest.budget_max || '10000000'),
            notes: latest.notes || '',
            otp: '',
            contactVerified: latest.contact_verified || false,
            _id: latest.id,
        } : {
            ...requirementInitialState,
            customerName: client.name || '',
            contactNumber: client.phone || '',
            propertyCategory: client.req?.type || client.listingKind || 'Residential',
            propertyType: client.propType || 'Plot',
            location: client.req?.loc?.[0] || '',
        });
        setIsEditingRequirement(true);
    };

    const updateEditRequirementForm = (field, value) => {
        setEditRequirementForm((current) => {
            if (field === 'propertyCategory') {
                const nextPropertyType = propertyTypesByCategory[value]?.[0] || 'Plot';
                return { ...current, propertyCategory: value, propertyType: nextPropertyType, configuration: 'N/A' };
            }
            if (field === 'propertyType') return { ...current, propertyType: value, configuration: 'N/A' };
            if (field === 'otp') return { ...current, otp: value, contactVerified: value.length === 4 };
            if (field === 'contactNumber') return { ...current, contactNumber: value, contactVerified: false, otp: '' };
            return { ...current, [field]: value };
        });
    };

    const handleSaveEditRequirement = () => {
        if (!editRequirementForm?.customerName?.trim() || !editRequirementForm?.contactNumber?.trim()) return;
        const now = getNowStamp();
        const updated = {
            id: editRequirementForm._id || `REQ-${Date.now()}`,
            customer_name: editRequirementForm.customerName.trim(),
            contact_number: editRequirementForm.contactNumber.trim(),
            requirement_type: editRequirementForm.status,
            property_category: editRequirementForm.propertyCategory,
            property_type: editRequirementForm.propertyType,
            configuration: editRequirementForm.configuration,
            min_area: editRequirementForm.minArea,
            max_area: editRequirementForm.maxArea,
            area_unit: editRequirementForm.unit,
            budget_min: Number(editRequirementForm.budgetMin || 0),
            budget_max: Number(editRequirementForm.budgetMax || 0),
            preferred_locations: editRequirementForm.location.trim() ? [editRequirementForm.location.trim()] : [],
            notes: editRequirementForm.notes.trim(),
            contact_verified: editRequirementForm.contactVerified,
            created_at: `${now.date} ${now.time}`,
        };
        const existing = client.customerRequirements || [];
        const nextRequirements = editRequirementForm._id
            ? existing.map((r) => r.id === editRequirementForm._id ? updated : r)
            : [updated, ...existing];
        onUpdateClient({
            customerRequirements: nextRequirements,
            req: {
                type: updated.property_category,
                bhk: updated.configuration !== 'N/A' ? [updated.configuration] : [updated.property_type],
                loc: updated.preferred_locations.length ? updated.preferred_locations : ['Location pending'],
                timeline: client.req?.timeline || '30 Days',
            },
            timeline: [
                createTimelineEvent('Customer Requirement Updated', `${updated.requirement_type} - ${updated.property_type}`),
                ...((client.timeline || [])),
            ],
        });
        setIsEditingRequirement(false);
    };

    const bhkOptions = ['1BHK', '2BHK', '3BHK', '4BHK', '5+BHK'];
    const commercialOptions = ['Shop', 'Office', 'Showroom'];
    const propertyTypeOptions = propertyTypeEdit.category === 'Residential' ? bhkOptions : commercialOptions;

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

    const [pendingVisitDeal, setPendingVisitDeal] = useState(null);

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

    const handleConfirmVisitDeal = () => {
        if (!pendingVisitDeal) return;
        const visit = pendingVisitDeal;
        const alreadyInPipeline = (client.propertyPipeline || []).some(
            (item) => item.visitId === visit.id
        );
        if (!alreadyInPipeline) {
            onUpdateClient({
                status: 'Negotiating',
                propertyPipeline: [
                    {
                        visitId: visit.id,
                        projectId: visit.property?.name,
                        status: 'Continued to Deal',
                        continuedToDeal: true,
                        units: [visit.property?.config || visit.property?.type || ''],
                        notes: `Continued to deal from site visit on ${visit.date}.`,
                    },
                    ...(client.propertyPipeline || []),
                ],
                timeline: [
                    createTimelineEvent('Continued to Deal', `${visit.property?.name} moved from site visit to deal.`),
                    ...(client.timeline || []),
                ],
            });
        }
        setPendingVisitDeal(null);
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
                <div className="absolute top-0 right-0 p-4 flex items-center gap-2">
                    <button onClick={openEditRequirement} className="px-3 py-1.5 rounded-lg border border-[#6F4BFF]/30 bg-[#6F4BFF]/5 text-xs font-bold text-[#6F4BFF] hover:bg-[#6F4BFF]/10 transition-all flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5" /> Edit Customer Requirement
                    </button>
                    <button onClick={() => setIsEditingProfile(true)} className="p-2 hover:bg-white/60 rounded-lg text-gray-500 transition-colors backdrop-blur-sm border border-gray-200">
                        <MessageSquare className="w-4 h-4" />
                    </button>
                    <button onClick={onBack} className="p-2 hover:bg-white/60 rounded-lg text-gray-500 transition-colors backdrop-blur-sm border border-gray-200">
                        <ArrowRight className="w-5 h-5 rotate-180" />
                    </button>
                </div>
                <div className="p-8 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex gap-5 flex-1">
                        <div className="w-16 h-16 rounded-2xl bg-[#6F4BFF] text-white flex items-center justify-center text-2xl font-bold shadow-lg shadow-[#6F4BFF]/20">
                            {client.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-3 mb-1">
                                <h2 className="text-2xl font-bold text-gray-900">{client.name}</h2>
                                {getStatusBadge(client.status)}
                            </div>
                            <p className="text-gray-500 font-medium flex flex-wrap items-center gap-3 mb-3">
                                <span className="flex items-center gap-1"><PhoneCall className="w-3.5 h-3.5" /> {client.phone}</span>
                                <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> Officer: {client.officer}</span>
                            </p>
                            <div className="flex flex-wrap gap-2 items-center">
                                <Badge variant={propertyTypeEdit.category === 'Residential' ? 'purple' : 'yellow'}>{propertyTypeEdit.category}</Badge>
                                {propertyTypeEdit.bhkOptions.map((bhk) => <Badge key={bhk} variant="gray">{bhk}</Badge>)}
                            </div>
                        </div>
                    </div>
                    <div className="text-left lg:text-right lg:mt-6 lg:mr-10">
                        <p className="text-sm text-gray-500 font-semibold mb-1">Approved Budget</p>
                        <p className="text-3xl font-bold text-emerald-600">{client.budget}</p>
                    </div>
                </div>
            </Card>

            {/* Edit Customer Requirement Modal */}
            {isEditingRequirement && editRequirementForm && (
                <Modal isOpen={isEditingRequirement} onClose={() => setIsEditingRequirement(false)} title="Edit Customer Requirement" size="lg">
                    <div className="space-y-5">
                        <div>
                            <label className="mb-2 block text-xs font-black text-gray-700">Property Category</label>
                            <div className="grid grid-cols-2 gap-3">
                                {propertyCategories.map((item) => (
                                    <button key={item} type="button" onClick={() => updateEditRequirementForm('propertyCategory', item)} className={`rounded-xl border p-4 text-left text-sm font-black ${editRequirementForm.propertyCategory === item ? 'border-[#4A43EC] bg-[#EEEDFD] text-[#4A43EC]' : 'border-gray-200 bg-white text-gray-700'}`}>
                                        {item}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-xs font-black text-gray-700">Property Type</label>
                            <div className="grid grid-cols-4 gap-2">
                                {(propertyTypesByCategory[editRequirementForm.propertyCategory] || []).map((item) => (
                                    <button key={item} type="button" onClick={() => updateEditRequirementForm('propertyType', item)} className={`rounded-lg border px-3 py-3 text-xs font-black ${editRequirementForm.propertyType === item ? 'border-[#4A43EC] bg-[#EEEDFD] text-[#4A43EC]' : 'border-gray-200 bg-white text-gray-600'}`}>
                                        {item}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {configurationOptions[editRequirementForm.propertyType] && (
                            <div>
                                <label className="mb-2 block text-xs font-black text-gray-700">Configuration / Status</label>
                                <select value={editRequirementForm.configuration} onChange={(e) => updateEditRequirementForm('configuration', e.target.value)} className="w-full rounded-xl border border-gray-300 bg-white p-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-[#6F4BFF]/30">
                                    <option value="N/A">Select option</option>
                                    {configurationOptions[editRequirementForm.propertyType].map((item) => <option key={item}>{item}</option>)}
                                </select>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="mb-2 block text-xs font-black text-gray-700">Min Area</label>
                                <input type="number" value={editRequirementForm.minArea} onChange={(e) => updateEditRequirementForm('minArea', e.target.value)} placeholder="Optional" className="w-full rounded-lg border border-gray-300 p-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-[#6F4BFF]/30" />
                            </div>
                            <div>
                                <label className="mb-2 block text-xs font-black text-gray-700">Max Area</label>
                                <input type="number" value={editRequirementForm.maxArea} onChange={(e) => updateEditRequirementForm('maxArea', e.target.value)} placeholder="2000" className="w-full rounded-lg border border-gray-300 p-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-[#6F4BFF]/30" />
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-xs font-black text-gray-700">Unit</label>
                            <select value={editRequirementForm.unit} onChange={(e) => updateEditRequirementForm('unit', e.target.value)} className="w-full rounded-lg border border-gray-300 bg-white p-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-[#6F4BFF]/30">
                                {areaUnits.map((item) => <option key={item}>{item}</option>)}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="mb-2 block text-xs font-black text-gray-700">Customer Name</label>
                                <input value={editRequirementForm.customerName} onChange={(e) => updateEditRequirementForm('customerName', e.target.value)} className="w-full rounded-lg border border-gray-300 p-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-[#6F4BFF]/30" />
                            </div>
                            <div>
                                <label className="mb-2 block text-xs font-black text-gray-700">Contact Number</label>
                                <input value={editRequirementForm.contactNumber} onChange={(e) => updateEditRequirementForm('contactNumber', e.target.value)} className="w-full rounded-lg border border-gray-300 p-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-[#6F4BFF]/30" />
                            </div>
                        </div>

                        {!editRequirementForm.contactVerified && editRequirementForm.contactNumber.length >= 10 && (
                            <div>
                                <label className="mb-2 block text-xs font-black text-gray-700">OTP Verification</label>
                                <input maxLength={4} value={editRequirementForm.otp} onChange={(e) => updateEditRequirementForm('otp', e.target.value.replace(/\D/g, ''))} placeholder="Enter 4 digit OTP" className="w-full rounded-lg border border-gray-300 p-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-[#6F4BFF]/30" />
                                <p className="mt-1 text-[10px] font-bold text-gray-400">Any 4 digit OTP marks contact verified.</p>
                            </div>
                        )}

                        <div>
                            <label className="mb-2 block text-xs font-black text-gray-700">Preferred Location</label>
                            <input value={editRequirementForm.location} onChange={(e) => updateEditRequirementForm('location', e.target.value)} placeholder="Enter preferred location" className="w-full rounded-lg border border-gray-300 p-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-[#6F4BFF]/30" />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="mb-2 block text-xs font-black text-gray-700">Budget Min</label>
                                <input type="number" value={editRequirementForm.budgetMin} onChange={(e) => updateEditRequirementForm('budgetMin', e.target.value)} className="w-full rounded-lg border border-gray-300 p-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-[#6F4BFF]/30" />
                            </div>
                            <div>
                                <label className="mb-2 block text-xs font-black text-gray-700">Budget Max</label>
                                <input type="number" value={editRequirementForm.budgetMax} onChange={(e) => updateEditRequirementForm('budgetMax', e.target.value)} className="w-full rounded-lg border border-gray-300 p-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-[#6F4BFF]/30" />
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-xs font-black text-gray-700">Details</label>
                            <textarea rows="3" value={editRequirementForm.notes} onChange={(e) => updateEditRequirementForm('notes', e.target.value)} placeholder="Requirement notes..." className="w-full rounded-lg border border-gray-300 p-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-[#6F4BFF]/30" />
                        </div>

                        <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
                            <button onClick={() => setIsEditingRequirement(false)} className="px-5 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 font-bold hover:bg-gray-50">
                                Cancel
                            </button>
                            <button onClick={handleSaveEditRequirement} className="px-5 py-2 rounded-lg bg-[#4A43EC] text-white font-bold hover:bg-[#3932d5] transition-colors">
                                Save Changes
                            </button>
                        </div>
                    </div>
                </Modal>
            )}

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
                    {activeProfileTab === 'Selected Properties' && (
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
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-bold text-gray-800 uppercase tracking-wider">Assign To Sales Officer</label>
                                        {assignedSalesOfficer && !isChangingOfficer && (
                                            <button type="button" onClick={() => setIsChangingOfficer(true)}
                                                className="px-3 py-1.5 rounded-lg border border-[#6F4BFF]/30 bg-[#6F4BFF]/5 text-xs font-black text-[#6F4BFF] hover:bg-[#6F4BFF] hover:text-white transition-all">
                                                Reassign Sales Officer
                                            </button>
                                        )}
                                        {isChangingOfficer && (
                                            <button type="button" onClick={() => { setIsChangingOfficer(false); setAssignedOfficer(''); }}
                                                className="text-xs font-bold text-gray-400 hover:text-gray-700 flex items-center gap-1">
                                                <X className="w-3 h-3" /> Cancel
                                            </button>
                                        )}
                                    </div>

                                    {assignedSalesOfficer && !isChangingOfficer ? (
                                        <div className="rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3 flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-emerald-200 flex items-center justify-center text-emerald-800 font-black text-sm shrink-0">
                                                {assignedSalesOfficer.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Assigned Officer</p>
                                                <p className="text-sm font-black text-gray-900">{assignedSalesOfficer}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                                            {officers.map((officer) => {
                                                const officerVisits = visits.filter((v) => v.officerName === officer && v.status !== 'Cancelled' && v.status !== 'Completed');
                                                const slots = ['10:00-11:00', '12:00-13:00', '15:00-16:00', '17:00-18:00'];
                                                const busySlots = officerVisits.map((v) => {
                                                    const t = (v.time || '').toLowerCase();
                                                    if (t.includes('10')) return '10:00-11:00';
                                                    if (t.includes('12')) return '12:00-13:00';
                                                    if (t.includes('15') || t.includes('3:')) return '15:00-16:00';
                                                    if (t.includes('17') || t.includes('5:')) return '17:00-18:00';
                                                    return null;
                                                }).filter(Boolean);
                                                const isSelected = (assignedOfficer || assignedSalesOfficer) === officer;
                                                const freeCount = slots.filter((s) => !busySlots.includes(s)).length;

                                                return (
                                                    <button key={officer} type="button"
                                                        onClick={() => {
                                                            setAssignedOfficer(officer);
                                                            setIsChangingOfficer(false);
                                                            if (assignedSalesOfficer) onUpdateClient({ officer });
                                                        }}
                                                        className={`rounded-xl border p-3 text-left transition-all ${isSelected ? 'border-[#6F4BFF] bg-[#6F4BFF]/5 ring-2 ring-[#6F4BFF]/20' : 'border-gray-200 bg-white hover:border-[#6F4BFF]/40'}`}
                                                    >
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${isSelected ? 'bg-[#6F4BFF] text-white' : 'bg-gray-100 text-gray-600'}`}>
                                                                {officer.charAt(0)}
                                                            </div>
                                                            <p className="text-xs font-black text-gray-900 truncate">{officer}</p>
                                                        </div>
                                                        <div className="space-y-1">
                                                            {slots.map((slot) => {
                                                                const busy = busySlots.includes(slot);
                                                                return (
                                                                    <div key={slot} className={`flex items-center gap-1.5 rounded px-1.5 py-0.5 ${busy ? 'bg-rose-50' : 'bg-emerald-50'}`}>
                                                                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${busy ? 'bg-rose-400' : 'bg-emerald-400'}`} />
                                                                        <span className={`text-[9px] font-black ${busy ? 'text-rose-600' : 'text-emerald-600'}`}>{slot}</span>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                        <p className={`mt-2 text-[10px] font-black ${freeCount > 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                                                            {freeCount} slot{freeCount !== 1 ? 's' : ''} free
                                                        </p>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </Card>

                            {(client.propertyPipeline || []).length > 0 && (
                                <>
                                    <div className="mb-3">
                                        <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest">Already Assigned</h4>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                                        {(client.propertyPipeline || []).map((pipelineItem, index) => {
                                            const project = getProject(pipelineItem.projectId);
                                            if (!project) return null;
                                            const continuedToDeal = Boolean(pipelineItem.continuedToDeal);
                                            const isExpanded = expandedProjectId === project.id;
                                            return (
                                                <Card key={`${pipelineItem.projectId}-assigned-${index}`} noPadding className={`relative border-2 transition-all ${isExpanded ? 'border-purple-400 shadow-lg ring-2 ring-[#6F4BFF]/10 bg-purple-50/10' : continuedToDeal ? 'border-emerald-200 bg-emerald-50/40' : 'border-gray-200 hover:border-[#6F4BFF]/50'}`}>
                                                    {continuedToDeal && <div className="absolute top-3 left-3 z-20"><Badge variant="green">Continued to Deal</Badge></div>}
                                                    <button type="button" className={`w-full text-left flex gap-4 p-4 items-start ${continuedToDeal ? 'pt-10' : ''}`} onClick={() => openProjectFloorPlan(project)}>
                                                        <div className="flex-1">
                                                            <h4 className="font-bold text-gray-900 text-sm capitalize mb-1">{project.name}</h4>
                                                            <p className="text-[11px] text-gray-500 flex items-start gap-1 mb-1"><MapPin className="w-3 h-3 text-rose-500 shrink-0" /> {project.location}</p>
                                                            <p className="text-[11px] text-gray-400 mb-1">by {project.builder}</p>
                                                            <p className="text-xs font-bold text-gray-800">{project.priceRange}</p>
                                                            <span className="mt-2 inline-block rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-black text-gray-600">{pipelineItem.status}</span>
                                                        </div>
                                                        <span className={`rounded-lg border px-2.5 py-1 text-[10px] font-black uppercase shrink-0 ${isExpanded ? 'border-[#6F4BFF] bg-[#6F4BFF] text-white' : 'border-gray-200 bg-white text-gray-500'}`}>
                                                            Open Plan
                                                        </span>
                                                    </button>
                                                    <div className="px-4 pb-3 flex gap-2">
                                                        <button type="button" disabled={continuedToDeal}
                                                            onClick={(e) => { e.stopPropagation(); setPendingDealIndex(index); }}
                                                            className="flex-1 rounded-lg bg-[#6F4BFF] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#5936eb] disabled:bg-emerald-100 disabled:text-emerald-700">
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
                                <div className="space-y-4">
                                    {projects.map((project) => {
                                        const isRecommended = project.priceRange.includes('Cr') && client.budget.includes('Cr');
                                        const isExpanded = expandedProjectId === project.id;
                                        const selectedProjectUnits = selectedProps.filter((assignment) => assignment.projectId === project.id);
                                        return (
                                            <Card key={project.id} noPadding className={`relative border-2 transition-all ${isExpanded ? 'border-purple-400 shadow-lg ring-2 ring-[#6F4BFF]/10 bg-purple-50/10' : 'border-gray-200 hover:border-[#6F4BFF]/50'}`}>
                                                <button type="button" className="w-full text-left flex gap-4 p-4 items-start" onClick={() => openProjectFloorPlan(project)}>
                                                    <div className="flex-1">
                                                        {isRecommended && <div className="mb-1"><Badge variant="green">98% Match</Badge></div>}
                                                        <h4 className="font-bold text-gray-900 text-base capitalize mb-1">{project.name}</h4>
                                                        <p className="text-[11px] text-gray-500 font-medium flex items-start gap-1 mb-1"><MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" /> {project.location}</p>
                                                        <p className="text-[11px] text-gray-400 font-medium mb-2">by {project.builder} · {project.specs}</p>
                                                        <p className="text-sm font-bold text-gray-800">{project.priceRange}</p>
                                                        <p className="text-[11px] text-gray-400 mt-1">{project.available} units available of {project.units}</p>
                                                        {selectedProjectUnits.length > 0 && (
                                                            <div className="mt-3 flex flex-wrap gap-1.5">
                                                                {selectedProjectUnits.map((assignment) => (
                                                                    <span key={assignment.key} className="rounded-md bg-[#6F4BFF]/10 px-2 py-1 text-[10px] font-black text-[#6F4BFF]">Unit {assignment.unitNumber}</span>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col items-end gap-2 mt-1 shrink-0">
                                                        {project.source === 'Broker' && (
                                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black tracking-wide bg-amber-50 text-amber-600 border border-amber-200">
                                                                <span className="w-1.5 h-1.5 rounded-full inline-block bg-current opacity-70" /> via Broker
                                                            </span>
                                                        )}
                                                        <span className={`rounded-lg border px-3 py-1.5 text-[10px] font-black uppercase tracking-widest ${isExpanded ? 'border-[#6F4BFF] bg-[#6F4BFF] text-white' : 'border-gray-200 bg-white text-gray-500'}`}>
                                                            Open Plan
                                                        </span>
                                                    </div>
                                                </button>
                                                <div className="px-4 pb-4">
                                                    <Button variant="secondary" icon={Eye} className="w-full text-[10px] py-2 font-black uppercase tracking-widest" onClick={() => setProjectDetails(project)}>
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
                                                {/* Property Image */}
                                                <div className="relative h-48 overflow-hidden">
                                                    <img
                                                        src={propertyHeroImage}
                                                        alt={activeFloorPlanProject.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                                                    <div className="absolute bottom-3 left-4">
                                                        <p className="text-white font-black text-base leading-tight">{activeFloorPlanProject.name}</p>
                                                        <p className="text-white/75 text-xs font-medium flex items-center gap-1 mt-0.5">
                                                            <MapPin className="w-3 h-3 text-rose-400" /> {activeFloorPlanProject.location}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="border-b border-gray-100 bg-white p-4">
                                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                                        <p className="text-[10px] font-black text-[#6F4BFF] uppercase tracking-widest">Floor Plan Workspace</p>
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

                                                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
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
                                                        <div className="rounded-xl border border-gray-100 bg-white p-3">
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Location</p>
                                                            <p className="mt-1 text-sm font-black text-gray-900">{activeFloorPlanProject.location}</p>
                                                        </div>
                                                        <div className="rounded-xl border border-gray-100 bg-white p-3">
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Builder</p>
                                                            <p className="mt-1 text-sm font-black text-gray-900">{activeFloorPlanProject.builder}</p>
                                                        </div>
                                                        <div className="rounded-xl border border-gray-100 bg-white p-3">
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Type</p>
                                                            <p className="mt-1 text-sm font-black text-gray-900">{activeFloorPlanProject.specs}</p>
                                                        </div>
                                                        <div className="rounded-xl border border-gray-100 bg-white p-3">
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Available Units</p>
                                                            <p className="mt-1 text-sm font-black text-emerald-600">{activeFloorPlanConfig.availableUnits} / {activeFloorPlanConfig.totalUnits}</p>
                                                        </div>
                                                        <div className="rounded-xl border border-gray-100 bg-white p-3">
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Status</p>
                                                            <p className="mt-1 text-sm font-black text-gray-900">{activeFloorPlanProject.status}</p>
                                                        </div>
                                                        <div className="rounded-xl border border-gray-100 bg-white p-3">
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Price Range</p>
                                                            <p className="mt-1 text-sm font-black text-gray-900">{activeFloorPlanProject.priceRange}</p>
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
                                <Button icon={Calendar} onClick={() => {
                                        setVisitForm((f) => ({ ...f, customerName: client.name, customerPhone: client.phone, officerName: client.officer || '' }));
                                        setIsScheduleVisitOpen(true);
                                    }}>Schedule New Visit</Button>
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
                                                className={`cursor-pointer transition-colors focus:outline-none focus:bg-[#fbf8ff] ${selectedSiteVisitId === row.id ? 'bg-[#fbf8ff]' : 'hover:bg-gray-50'}`}
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

                                        {/* Completed-only: Arrival time + Review + Photos */}
                                        {selectedSiteVisit.status === 'Completed' && (
                                            <>
                                                {selectedSiteVisit.arrivalTime && (
                                                    <div className="mt-4 flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2">
                                                        <Activity className="w-4 h-4 text-blue-500 shrink-0" />
                                                        <p className="text-xs font-black text-blue-700">
                                                            Timing of Reaching: <span className="text-blue-900">{selectedSiteVisit.arrivalTime}</span>
                                                        </p>
                                                    </div>
                                                )}

                                                {selectedSiteVisit.userReview && (
                                                    <div className="mt-3 rounded-xl border border-white bg-white/80 p-3">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Review from Client</p>
                                                            {selectedSiteVisit.userRating && (
                                                                <div className="flex gap-0.5">
                                                                    {Array.from({ length: 5 }, (_, i) => (
                                                                        <span key={i} className={`text-sm ${i < selectedSiteVisit.userRating ? 'text-amber-400' : 'text-gray-200'}`}>★</span>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <p className="text-sm font-semibold text-gray-700 leading-relaxed">{selectedSiteVisit.userReview}</p>
                                                    </div>
                                                )}

                                                <div className="mt-3">
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Client & Officer Together</p>
                                                    <div className="relative rounded-xl overflow-hidden border-2 border-emerald-200 shadow-sm">
                                                        <img src={propertyHeroImage} alt="Client and officer at site" className="w-full h-36 object-cover" />
                                                        <div className="absolute bottom-2 right-2">
                                                            <span className="inline-flex items-center gap-1 bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow">
                                                                <CheckCircle2 className="w-3 h-3" /> Verified
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        <div className="mt-4 grid grid-cols-3 gap-3">
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

                                        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                                            {[
                                                ['Price', selectedSiteVisit.property.price],
                                                ['Config', selectedSiteVisit.property.config],
                                                ['Type', selectedSiteVisit.property.type],
                                                ['Size', selectedSiteVisit.property.size],
                                                ['Builder', selectedSiteVisit.property.builder],
                                                ['Possession', selectedSiteVisit.property.possession],
                                                ['Total Units', selectedSiteVisit.property.totalUnits],
                                                ['Available', selectedSiteVisit.property.availableUnits],
                                                ['RERA', selectedSiteVisit.property.rera],
                                                ['Officer', selectedSiteVisit.officerName],
                                                ['Visit Date', selectedSiteVisit.date],
                                                ['Purpose', selectedSiteVisit.purpose],
                                            ].filter(([, val]) => val).map(([label, value]) => (
                                                <div key={label} className="rounded-xl border border-white bg-white/80 p-3">
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{label}</p>
                                                    <p className="mt-0.5 font-black text-gray-900 text-xs">{value}</p>
                                                </div>
                                            ))}
                                        </div>

                                        {selectedSiteVisit.property.amenities && (
                                            <div className="mt-2 rounded-xl border border-white bg-white/80 p-3">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Amenities</p>
                                                <p className="mt-0.5 text-xs font-semibold text-gray-700">{selectedSiteVisit.property.amenities}</p>
                                            </div>
                                        )}

                                        <div className="mt-2 rounded-xl border border-white bg-white/80 p-3">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Visit Notes</p>
                                            <p className="mt-1 text-sm font-semibold text-gray-700">{selectedSiteVisit.notes}</p>
                                        </div>

                                        {selectedSiteVisit.status === 'Completed' && (
                                            <button
                                                type="button"
                                                onClick={() => setPendingVisitDeal(selectedSiteVisit)}
                                                className="mt-4 w-full rounded-lg bg-[#6F4BFF] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#5936eb]"
                                            >
                                                Continue to Deal
                                            </button>
                                        )}
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

            <Modal isOpen={pendingVisitDeal !== null} onClose={() => setPendingVisitDeal(null)} title="Continue to Deal?">
                <div className="space-y-5">
                    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                        <p className="text-sm font-bold text-gray-900">{pendingVisitDeal?.property?.name}</p>
                        <p className="text-xs font-medium text-gray-500 mt-1">{pendingVisitDeal?.property?.address}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-600">
                        Are you sure you want to continue this site visit to deal?
                    </p>
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                        <Button variant="secondary" onClick={() => setPendingVisitDeal(null)}>No</Button>
                        <Button onClick={handleConfirmVisitDeal}>Yes, Continue</Button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={isScheduleVisitOpen} onClose={() => setIsScheduleVisitOpen(false)} title="Schedule New Visit" size="lg">
                <form onSubmit={(event) => {
                    event.preventDefault();
                    onScheduleVisit({
                        officerName: visitForm.officerName.trim(),
                        officerPhone: visitForm.officerPhone.trim(),
                        customerName: visitForm.customerName.trim(),
                        customerPhone: visitForm.customerPhone.trim(),
                        purpose: visitForm.purpose,
                        date: visitForm.date,
                        time: visitForm.time,
                        status: 'Scheduled',
                        property: {
                            name: visitForm.propertyName.trim(),
                            type: visitForm.propertyType,
                            config: visitForm.propertyConfig.trim(),
                            address: visitForm.propertyAddress.trim(),
                            price: visitForm.propertyPrice.trim(),
                        },
                        notes: visitForm.notes.trim(),
                    });
                    setIsScheduleVisitOpen(false);
                }} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Customer Name</label>
                            <input required value={visitForm.customerName} onChange={(e) => setVisitForm((f) => ({ ...f, customerName: e.target.value }))} className="w-full mt-2 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 font-bold bg-gray-50" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Customer Phone</label>
                            <input required value={visitForm.customerPhone} onChange={(e) => setVisitForm((f) => ({ ...f, customerPhone: e.target.value }))} className="w-full mt-2 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 font-bold" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Officer Name</label>
                            <input required value={visitForm.officerName} onChange={(e) => setVisitForm((f) => ({ ...f, officerName: e.target.value }))} className="w-full mt-2 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 font-bold" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Officer Phone</label>
                            <input value={visitForm.officerPhone} onChange={(e) => setVisitForm((f) => ({ ...f, officerPhone: e.target.value }))} className="w-full mt-2 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 font-bold" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Purpose</label>
                            <select value={visitForm.purpose} onChange={(e) => setVisitForm((f) => ({ ...f, purpose: e.target.value }))} className="w-full mt-2 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 font-bold bg-white">
                                <option>BUY</option><option>RENT</option><option>SELL</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Date</label>
                            <input required type="date" value={visitForm.date} onChange={(e) => setVisitForm((f) => ({ ...f, date: e.target.value }))} className="w-full mt-2 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 font-bold" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Time Slot</label>
                            <input required value={visitForm.time} onChange={(e) => setVisitForm((f) => ({ ...f, time: e.target.value }))} placeholder="10:00 - 11:00 AM" className="w-full mt-2 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 font-bold" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Property Name</label>
                            <input required value={visitForm.propertyName} onChange={(e) => setVisitForm((f) => ({ ...f, propertyName: e.target.value }))} className="w-full mt-2 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 font-bold" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Property Type</label>
                            <select value={visitForm.propertyType} onChange={(e) => setVisitForm((f) => ({ ...f, propertyType: e.target.value }))} className="w-full mt-2 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 font-bold bg-white">
                                <option>APARTMENT/FLATS</option><option>VILLA PLOTS</option><option>COMMERCIAL</option><option>PLOT</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Configuration</label>
                            <input value={visitForm.propertyConfig} onChange={(e) => setVisitForm((f) => ({ ...f, propertyConfig: e.target.value }))} placeholder="3BHK Premium" className="w-full mt-2 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 font-bold" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Price</label>
                            <input value={visitForm.propertyPrice} onChange={(e) => setVisitForm((f) => ({ ...f, propertyPrice: e.target.value }))} placeholder="1.85 Cr" className="w-full mt-2 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 font-bold" />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Property Address</label>
                        <input value={visitForm.propertyAddress} onChange={(e) => setVisitForm((f) => ({ ...f, propertyAddress: e.target.value }))} className="w-full mt-2 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 font-bold" />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Notes</label>
                        <textarea rows="3" value={visitForm.notes} onChange={(e) => setVisitForm((f) => ({ ...f, notes: e.target.value }))} className="w-full mt-2 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 text-sm font-medium" />
                    </div>
                    <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                        <Button variant="secondary" type="button" onClick={() => setIsScheduleVisitOpen(false)}>Cancel</Button>
                        <Button type="submit" icon={Calendar}>Schedule Visit</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

const Clients = () => {
    const dispatch = useDispatch();
    const { clients } = useSelector((state) => state.clients);
    const { visits: allVisits } = useSelector((state) => state.visits);
    const [isAddClientOpen, setIsAddClientOpen] = useState(false);
    const [selectedClientId, setSelectedClientId] = useState(null);
    const [activeTab, setActiveTab] = useState('All');
    const [dateFilter, setDateFilter] = useState('');
    const [sourceFilter, setSourceFilter] = useState('All');
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
            const matchSource = sourceFilter === 'All' || client.source === sourceFilter;
            const matchSearch = !query || [client.name, client.phone, client.budget, client.propType, client.latestNote, client.officer]
                .filter(Boolean)
                .some((value) => String(value).toLowerCase().includes(query));

            return matchTab && matchDate && matchSource && matchSearch;
        });
    }, [activeTab, clients, dateFilter, sourceFilter, searchQuery]);

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
            source: clientForm.source || '',
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
                        visits={allVisits}
                        officers={officers}
                        onBack={() => setSelectedClientId(null)}
                        onUpdateClient={(changes) => dispatch(updateClient({ id: selectedClient.id, changes }))}
                        onAddNote={(note) => dispatch(addClientNote({ id: selectedClient.id, note }))}
                        onAddMeeting={(meeting) => dispatch(addClientMeeting({ id: selectedClient.id, meeting }))}
                        onScheduleVisit={(visit) => dispatch(addVisit(visit))}
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

                            <div className="space-y-3">
                                {/* Row 1 — Score tabs + Date filter */}
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-gray-50/80 px-2.5 py-2.5 rounded-xl border border-gray-200">
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
                                    <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm self-start sm:self-auto shrink-0">
                                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Follow-up:</span>
                                        <input type="date" value={dateFilter} onChange={(event) => setDateFilter(event.target.value)} className="border-none bg-transparent text-sm font-bold text-gray-800 outline-none cursor-pointer" />
                                        {dateFilter && (
                                            <button onClick={() => setDateFilter('')} className="p-0.5 hover:bg-rose-50 rounded text-rose-400 transition-colors">
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Row 2 — Source filter chips */}
                                <div className="flex flex-wrap items-center gap-2 px-1">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1 mr-1">
                                        <User className="w-3 h-3" /> Via:
                                    </span>
                                    {[
                                        { label: 'All', color: 'bg-gray-800 text-white border-transparent shadow-gray-800/20' },
                                        { label: 'Broker', color: 'bg-amber-500 text-white border-transparent shadow-amber-500/20' },
                                        { label: 'User', color: 'bg-gray-500 text-white border-transparent shadow-gray-500/20' },
                                        { label: 'Sales Officer', color: 'bg-[#6F4BFF] text-white border-transparent shadow-[#6F4BFF]/20' },
                                        { label: 'Meta Ads', color: 'bg-blue-500 text-white border-transparent shadow-blue-500/20' },
                                        { label: 'Website', color: 'bg-emerald-500 text-white border-transparent shadow-emerald-500/20' },
                                    ].map(({ label, color }) => (
                                        <button
                                            key={label}
                                            onClick={() => setSourceFilter(label)}
                                            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap border shadow-sm ${
                                                sourceFilter === label
                                                    ? `${color} shadow-md scale-105`
                                                    : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-700'
                                            }`}
                                        >
                                            {label}
                                        </button>
                                    ))}
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
                                                        {row.source && (
                                                            <div className="mt-1.5">
                                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black tracking-wide ${
                                                                    row.source === 'Broker' ? 'bg-amber-50 text-amber-600' :
                                                                    row.source === 'Meta Ads' ? 'bg-blue-50 text-blue-600' :
                                                                    row.source === 'Website' ? 'bg-emerald-50 text-emerald-600' :
                                                                    row.source === 'Sales Officer' ? 'bg-purple-50 text-purple-600' :
                                                                    'bg-gray-100 text-gray-500'
                                                                }`}>
                                                                    <span className="w-1.5 h-1.5 rounded-full inline-block bg-current opacity-70" />
                                                                    {row.source}
                                                                </span>
                                                            </div>
                                                        )}
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
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Source (Client aaya kahan se?)</label>
                        <select value={clientForm.source} onChange={(event) => updateClientForm('source', event.target.value)} className="w-full mt-2 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 font-bold bg-white">
                            <option value="">-- Select Source --</option>
                            <option value="Broker">Broker</option>
                            <option value="User">User</option>
                            <option value="Sales Officer">Sales Officer</option>
                            <option value="Meta Ads">Meta Ads</option>
                            <option value="Website">Website</option>
                        </select>
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
