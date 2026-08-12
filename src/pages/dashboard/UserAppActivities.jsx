import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Activity,
    CalendarDays,
    Clock,
    CreditCard,
    Eye,
    Heart,
    PhoneCall,
    Search,
    ShieldAlert,
    Smartphone,
    User,
    Zap,
} from 'lucide-react';
import { mockProjects } from '../../data/mockData';
import { setSelectedBuilder, setSelectedBroker, setViewMode } from '../../store/inventorySlice';
import Header from '../../components/layout/Header';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import {
    fetchAppUserActivityBundle,
    fetchAppUserMetrics,
    fetchAppUsers,
} from '../../services/appUserActivityService';

const tabs = [
    { id: 'savedProperties', label: 'Saved Properties', icon: Heart },
    { id: 'contactedProperties', label: 'Contacted', icon: PhoneCall },
    { id: 'bookedVisits', label: 'Visits', icon: CalendarDays },
    { id: 'screenEvents', label: 'Activity Log', icon: Activity },
    { id: 'userComplaints', label: 'Complaints', icon: ShieldAlert },
    { id: 'dealManagement', label: 'Deal Manager', icon: CreditCard },
];

const projectPanelAccounts = [
    {
        id: 'PP-B-001',
        type: 'builders',
        name: 'Apex Buildcon',
        contactPerson: 'Arjun Mehra',
        phone: '+91 98231 44001',
        email: 'arjun@apexbuildcon.in',
        city: 'Mumbai',
        status: 'Online',
        activeMinutesToday: 138,
        totalActiveMinutes: 2480,
        sessionsToday: 8,
        lastActive: '4 min ago',
    },
    {
        id: 'PP-B-002',
        type: 'builders',
        name: 'CityScape Developers',
        contactPerson: 'Raghav Bansal',
        phone: '+91 98111 55220',
        email: 'raghav@cityscape.in',
        city: 'Delhi NCR',
        status: 'Idle',
        activeMinutesToday: 64,
        totalActiveMinutes: 1210,
        sessionsToday: 4,
        lastActive: '22 min ago',
    },
    {
        id: 'PP-B-003',
        type: 'builders',
        name: 'GreenLeaf Developers',
        contactPerson: 'Priya Nair',
        phone: '+91 99801 33445',
        email: 'priya@greenleaf.in',
        city: 'Bangalore',
        status: 'Offline',
        activeMinutesToday: 0,
        totalActiveMinutes: 980,
        sessionsToday: 0,
        lastActive: 'Yesterday',
    },
    {
        id: 'PP-M-001',
        type: 'marketingCompanies',
        name: 'MarketLane Realty',
        contactPerson: 'Sahil Verma',
        phone: '+91 98770 11223',
        email: 'ops@marketlane.in',
        city: 'Indore',
        status: 'Online',
        activeMinutesToday: 92,
        totalActiveMinutes: 1835,
        sessionsToday: 6,
        lastActive: '9 min ago',
    },
    {
        id: 'PP-M-002',
        type: 'marketingCompanies',
        name: 'UrbanReach Media',
        contactPerson: 'Kavya Sethi',
        phone: '+91 99002 44556',
        email: 'kavya@urbanreach.in',
        city: 'Pune',
        status: 'Idle',
        activeMinutesToday: 41,
        totalActiveMinutes: 890,
        sessionsToday: 3,
        lastActive: '38 min ago',
    },
];

const appTabs = [
    { id: 'userApp', label: 'User App' },
    { id: 'projectPanel', label: 'Project Panel' },
];

const projectPanelTabs = [
    { id: 'builders', label: 'Builders' },
    { id: 'marketingCompanies', label: 'Marketing Companies' },
];

const formatCurrency = (val) => {
    const num = Number(val);
    if (!num) return '₹0';
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(0)} L`;
    return `₹${num.toLocaleString('en-IN')}`;
};

const getStatusVariant = (status) => {
    if (status === 'Online') return 'green';
    if (status === 'Idle') return 'yellow';
    return 'gray';
};

const formatActiveTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (!hours) return `${mins}m`;
    return `${hours}h ${mins}m`;
};

// App-open/session-duration tracking for the User App has not been built on
// the backend yet: `active_minutes_today` / `total_active_minutes` /
// `sessions_today` columns exist (migrations/043_add_app_user_admin_activity.js)
// and are read by GET /api/v1/app-users (appUserController.js), but nothing in
// the codebase ever writes to them — there is no session-start/session-end/
// heartbeat endpoint the User App or Broker App call. So every account reads
// 0m, which looks like "confirmed zero usage" but is really "never measured".
// Until that tracking pipeline is built, show an honest "Not tracked yet"
// label instead of a misleading 0m/0 for these specific real-data fields.
// TODO(backend): build App Open -> Session Start -> Activity Tracking ->
// Session Duration -> Backend -> DB write path (QA spec Part F item 12).
const formatTrackedActiveTime = (minutes) => (
    minutes > 0 ? formatActiveTime(minutes) : 'Not tracked yet'
);

const formatTrackedSessions = (sessions) => (
    sessions > 0 ? sessions : 'Not tracked yet'
);

const UserAppActivities = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [activeApp, setActiveApp] = useState('userApp');
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [appUsers, setAppUsers] = useState([]);
    const [selectedUserDetails, setSelectedUserDetails] = useState(null);
    const [appMetrics, setAppMetrics] = useState(null);
    const [isLoadingUsers, setIsLoadingUsers] = useState(false);
    const [isLoadingUserDetails, setIsLoadingUserDetails] = useState(false);
    const [pageError, setPageError] = useState('');
    const [activeTab, setActiveTab] = useState('savedProperties');
    const [projectPanelTab, setProjectPanelTab] = useState('builders');
    const [expandedDealId, setExpandedDealId] = useState(null);

    const handleViewAccount = (account) => {
        if (account.type === 'builders') {
            const uniqueBuilders = mockProjects
                .filter(p => p.addedBy === 'builder' && p.builderProfile)
                .reduce((acc, project) => {
                    const existing = acc.find(b => b.companyName === project.builder);
                    if (!existing) {
                        acc.push({
                            ...project.builderProfile,
                            projectCount: 1,
                            projects: [project]
                        });
                    } else {
                        existing.projectCount++;
                        existing.projects.push(project);
                    }
                    return acc;
                }, []);

            let matchingBuilder = uniqueBuilders.find(b => 
                b.companyName.toLowerCase() === account.name.toLowerCase() ||
                b.companyName.toLowerCase().includes(account.name.toLowerCase()) ||
                account.name.toLowerCase().includes(b.companyName.toLowerCase()) ||
                b.fullName.toLowerCase() === account.contactPerson.toLowerCase()
            );

            if (!matchingBuilder) {
                matchingBuilder = {
                    companyName: account.name,
                    fullName: account.contactPerson,
                    phone: account.phone,
                    location: account.city,
                    builderType: 'Developer Company',
                    brandName: account.name,
                    reraNumber: 'RERA pending',
                    about: `Developer company operating in ${account.city}.`,
                    projectCount: 0,
                    projects: []
                };
            }

            dispatch(setSelectedBuilder(matchingBuilder));
            dispatch(setViewMode('builderProjects'));
            navigate('/dashboard/inventory');
        } else {
            const uniqueBrokers = mockProjects
                .filter(p => p.addedBy === 'broker')
                .reduce((acc, project) => {
                    const fallbackProfile = {
                        fullName: project.officer || 'Broker Partner',
                        phone: 'Contact pending',
                        location: project.location.split(',').pop().trim(),
                        agencyName: `${project.officer || project.builder} Realty`,
                        brokerType: 'Broker Partner',
                        reraNumber: 'RERA pending',
                        coverage: project.location.split(',').pop().trim(),
                        verifiedAt: project.updated,
                        about: `Broker-added inventory for ${project.builder} in ${project.location}.`,
                    };
                    const profile = project.brokerProfile || fallbackProfile;
                    const existing = acc.find(b => b.agencyName === profile.agencyName);

                    if (!existing) {
                        acc.push({
                            ...profile,
                            inventoryCount: 1,
                            projects: [project],
                        });
                    } else {
                        existing.inventoryCount++;
                        existing.projects.push(project);
                    }
                    return acc;
                }, []);

            let matchingBroker = uniqueBrokers.find(b => 
                b.agencyName.toLowerCase() === account.name.toLowerCase() ||
                b.agencyName.toLowerCase().includes(account.name.toLowerCase()) ||
                account.name.toLowerCase().includes(b.agencyName.toLowerCase()) ||
                b.fullName.toLowerCase() === account.contactPerson.toLowerCase()
            );

            if (!matchingBroker) {
                matchingBroker = {
                    agencyName: account.name,
                    fullName: account.contactPerson,
                    phone: account.phone,
                    coverage: account.city,
                    brokerType: 'Marketing Partner',
                    reraNumber: 'RERA pending',
                    verifiedAt: 'Verified today',
                    about: `Marketing company handling active operations in ${account.city}.`,
                    inventoryCount: 0,
                    projects: []
                };
            }

            dispatch(setSelectedBroker(matchingBroker));
            dispatch(setViewMode('brokerProjects'));
            navigate('/dashboard/inventory');
        }
    };

    const [complaints, setComplaints] = useState([
        { id: 'COMP-001', userId: 'UA001', category: 'Billing', description: 'Double charged for the site visit booking fee.', status: 'Pending', date: '12 Jun 2026' },
        { id: 'COMP-002', userId: 'UA001', category: 'App Issue', description: 'Unable to load the floor plans for Serenity Reserve flat options.', status: 'Pending', date: '14 Jun 2026' },
        { id: 'COMP-003', userId: 'UA002', category: 'Property Listing', description: 'Listed price for Ocean View Luxury seems incorrect relative to market.', status: 'Pending', date: '10 Jun 2026' },
        { id: 'COMP-004', userId: 'UA003', category: 'Account', description: 'Profile changes are not saving when updated in mobile app.', status: 'Resolved', date: '08 Jun 2026', resolvedDate: '09 Jun 2026' }
    ]);

    const handleResolveComplaint = (complaintId) => {
        setComplaints(prev => prev.map(c => 
            c.id === complaintId 
                ? { ...c, status: 'Resolved', resolvedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) } 
                : c
        ));
    };

    const userDealsData = useMemo(() => ({
        UA001: [
            {
                id: 'DEAL-991',
                dealId: '#SQ-88291',
                property_title: 'Serenity Reserve 3B',
                city: 'Indore',
                area: 'Scheme No 140',
                status: 'active',
                total_value: 30000000,
                paid_so_far: 12000000,
                current_stage_index: 3,
                total_stages: 8,
                payments: [
                    { id: '1', amount: 3000000, title: 'Booking Amount', due_date: '2026-03-01', status: 'paid' },
                    { id: '2', amount: 6000000, title: 'Allotment Charge', due_date: '2026-04-15', status: 'paid' },
                    { id: '3', amount: 3000000, title: 'Foundation Charge', due_date: '2026-05-20', status: 'paid' },
                    { id: '4', amount: 4800000, title: 'Plinth Completion', due_date: '2026-06-30', status: 'due_soon' },
                    { id: '5', amount: 4800000, title: 'Slab 1 Completion', due_date: '2026-08-15', status: 'upcoming' },
                    { id: '6', amount: 8400000, title: 'Registry', due_date: '2026-10-10', status: 'upcoming' },
                ]
            },
            {
                id: 'DEAL-992',
                dealId: '#SQ-88292',
                property_title: 'Sumeru Sky Flat',
                city: 'Indore',
                area: 'Bypass Road',
                status: 'pending',
                total_value: 12000000,
                paid_so_far: 2400000,
                current_stage_index: 1,
                total_stages: 8,
                payments: [
                    { id: '1', amount: 2400000, title: 'Booking Amount', due_date: '2026-05-10', status: 'paid' },
                    { id: '2', amount: 3600000, title: 'Agreement', due_date: '2026-07-15', status: 'upcoming' },
                ]
            }
        ],
        UA002: [
            {
                id: 'DEAL-993',
                dealId: '#SQ-77104',
                property_title: 'Ocean View Penthouse',
                city: 'Chennai',
                area: 'ECR',
                status: 'active',
                total_value: 48000000,
                paid_so_far: 14400000,
                current_stage_index: 2,
                total_stages: 8,
                payments: [
                    { id: '1', amount: 4800000, title: 'Booking Amount', due_date: '2026-04-01', status: 'paid' },
                    { id: '2', amount: 9600000, title: 'Agreement', due_date: '2026-05-01', status: 'paid' },
                    { id: '3', amount: 14400000, title: 'Foundation', due_date: '2026-07-20', status: 'due_soon' },
                ]
            }
        ],
        UA003: [
            {
                id: 'DEAL-994',
                dealId: '#SQ-11029',
                property_title: 'Green Valley Villa Plot',
                city: 'Bangalore',
                area: 'HSR Layout',
                status: 'completed',
                total_value: 15000000,
                paid_so_far: 15000000,
                current_stage_index: 8,
                total_stages: 8,
                payments: [
                    { id: '1', amount: 15000000, title: 'Full Settlement', due_date: '2026-03-09', status: 'paid' },
                ]
            }
        ]
    }), []);

    const loadAppUsers = useCallback(async () => {
        if (activeApp !== 'userApp') return;

        setIsLoadingUsers(true);
        setPageError('');

        try {
            const [metrics, usersResult] = await Promise.all([
                fetchAppUserMetrics({ range: 'today' }),
                fetchAppUsers({
                    search: searchQuery.trim(),
                    status: statusFilter === 'All' ? '' : statusFilter,
                    page: 1,
                    limit: 50,
                }),
            ]);

            setAppMetrics(metrics);
            setAppUsers(usersResult.items);
            setSelectedUserId((current) => {
                if (current && usersResult.items.some((user) => user.id === current)) return current;
                return usersResult.items[0]?.id || null;
            });
        } catch (error) {
            console.error('Failed to load app activity users:', error);
            setPageError(error.message || 'Failed to load app activity users.');
            setAppUsers([]);
            setSelectedUserId(null);
            setSelectedUserDetails(null);
        } finally {
            setIsLoadingUsers(false);
        }
    }, [activeApp, searchQuery, statusFilter]);

    useEffect(() => {
        const timeout = window.setTimeout(() => {
            loadAppUsers();
        }, 250);

        return () => window.clearTimeout(timeout);
    }, [loadAppUsers]);

    const selectedUserSummary = appUsers.find((user) => user.id === selectedUserId);

    const loadSelectedUser = useCallback(async () => {
        if (activeApp !== 'userApp' || !selectedUserId) {
            setSelectedUserDetails(null);
            return;
        }

        setIsLoadingUserDetails(true);
        setPageError('');

        try {
            const user = await fetchAppUserActivityBundle(selectedUserId, selectedUserSummary);
            setSelectedUserDetails(user);
        } catch (error) {
            console.error('Failed to load app user profile:', error);
            setPageError(error.message || 'Failed to load app user activity.');
            setSelectedUserDetails(selectedUserSummary || null);
        } finally {
            setIsLoadingUserDetails(false);
        }
    }, [activeApp, selectedUserId, selectedUserSummary]);

    useEffect(() => {
        const timeout = window.setTimeout(() => {
            loadSelectedUser();
        }, 0);

        return () => window.clearTimeout(timeout);
    }, [loadSelectedUser]);

    const filteredUsers = appUsers;

    const selectedUser = selectedUserDetails?.id === selectedUserId
        ? selectedUserDetails
        : selectedUserSummary || appUsers[0] || null;

    const filteredProjectPanelAccounts = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        return projectPanelAccounts.filter((account) => {
            const matchesType = account.type === projectPanelTab;
            const matchesSearch = !query || [account.name, account.contactPerson, account.phone, account.email, account.city]
                .filter(Boolean)
                .some((value) => String(value).toLowerCase().includes(query));
            const matchesStatus = statusFilter === 'All' || account.status === statusFilter;
            return matchesType && matchesSearch && matchesStatus;
        });
    }, [projectPanelTab, searchQuery, statusFilter]);

    const summary = useMemo(() => {
        if (activeApp === 'projectPanel') {
            const visibleAccounts = projectPanelAccounts.filter((account) => {
                const query = searchQuery.trim().toLowerCase();
                const matchesSearch = !query || [account.name, account.contactPerson, account.phone, account.email, account.city]
                    .filter(Boolean)
                    .some((value) => String(value).toLowerCase().includes(query));
                const matchesStatus = statusFilter === 'All' || account.status === statusFilter;
                return matchesSearch && matchesStatus;
            });
            const totalActiveMinutes = visibleAccounts.reduce((sum, account) => sum + account.activeMinutesToday, 0);
            const sessionsToday = visibleAccounts.reduce((sum, account) => sum + account.sessionsToday, 0);

            return [
                { title: 'Total Users', value: projectPanelAccounts.length, icon: User, color: 'text-[#2717D7]', bg: 'bg-[#2717D7]/10' },
                { title: 'Active Users', value: projectPanelAccounts.filter((account) => account.status === 'Online').length, icon: Zap, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { title: 'Active Time Today', value: formatActiveTime(totalActiveMinutes), icon: Clock, color: 'text-[#6F4BFF]', bg: 'bg-[#6F4BFF]/10' },
                { title: 'Sessions Today', value: sessionsToday, icon: Smartphone, color: 'text-blue-600', bg: 'bg-blue-50' },
            ];
        }

        const totalUsers = filteredUsers.length;
        const activeUsers = filteredUsers.filter((user) => user.status === 'Online').length;
        const totalActiveMinutes = appMetrics?.activeMinutes
            ?? filteredUsers.reduce((sum, user) => sum + user.activeMinutesToday, 0);
        const savedCount = appMetrics?.saved ?? filteredUsers.reduce((sum, user) => sum + user.savedProperties.length, 0);
        const contactedCount = appMetrics?.contacted ?? filteredUsers.reduce((sum, user) => sum + user.contactedProperties.length, 0);
        const visitCount = appMetrics?.visits ?? filteredUsers.reduce((sum, user) => sum + user.bookedVisits.length, 0);

        return [
            { title: 'Total Users', value: totalUsers, icon: User, color: 'text-[#2717D7]', bg: 'bg-[#2717D7]/10' },
            { title: 'Active Users', value: activeUsers, icon: Zap, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { title: 'Active Time Today', value: formatTrackedActiveTime(totalActiveMinutes), icon: Clock, color: 'text-[#6F4BFF]', bg: 'bg-[#6F4BFF]/10' },
            { title: 'Saved Properties', value: savedCount, icon: Heart, color: 'text-rose-500', bg: 'bg-rose-50' },
            { title: 'Contacted Properties', value: contactedCount, icon: PhoneCall, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { title: 'Booked Visits', value: visitCount, icon: CalendarDays, color: 'text-blue-600', bg: 'bg-blue-50' },
        ];
    }, [activeApp, appMetrics, filteredUsers, searchQuery, statusFilter]);

    const renderProjectPanelContent = () => (
        <Card noPadding className="overflow-hidden">
            <div className="border-b border-gray-100 bg-white p-4">
                <div className="flex flex-wrap gap-2">
                    {projectPanelTabs.map((tab) => {
                        const count = projectPanelAccounts.filter((account) => account.type === tab.id).length;
                        const isActive = projectPanelTab === tab.id;

                        return (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setProjectPanelTab(tab.id)}
                                className={`rounded-xl px-4 py-2 text-[11px] font-black uppercase tracking-widest transition-all ${
                                    isActive
                                        ? 'bg-[#6F4BFF] text-white shadow-md shadow-[#6F4BFF]/20'
                                        : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                                }`}
                            >
                                {tab.label}
                                <span className={`ml-2 rounded-lg px-2 py-0.5 ${isActive ? 'bg-white/20' : 'bg-white border border-gray-100'}`}>
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="divide-y divide-gray-100">
                {filteredProjectPanelAccounts.map((account) => (
                    <div key={account.id} className="flex flex-col gap-4 bg-white p-5 transition-colors hover:bg-gray-50/70 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex min-w-0 gap-3">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#6F4BFF]/10 text-lg font-black text-[#6F4BFF]">
                                {account.name.charAt(0)}
                            </div>
                            <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                    <h3 className="truncate text-base font-black text-gray-900">{account.name}</h3>
                                    <Badge variant={getStatusVariant(account.status)}>{account.status}</Badge>
                                </div>
                                <p className="mt-1 text-xs font-bold text-gray-500">{account.contactPerson} - {account.city}</p>
                                <p className="mt-1 text-xs font-bold text-gray-400">{account.phone} - {account.email}</p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-4 lg:w-[480px] w-full shrink-0">
                            <div className="grid grid-cols-3 gap-2 flex-1 w-full">
                                <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                                    <p className="text-sm font-black text-gray-900">{formatActiveTime(account.activeMinutesToday)}</p>
                                    <p className="mt-0.5 text-[9px] font-black uppercase tracking-widest text-gray-400">Active Today</p>
                                </div>
                                <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                                    <p className="text-sm font-black text-gray-900">{account.sessionsToday}</p>
                                    <p className="mt-0.5 text-[9px] font-black uppercase tracking-widest text-gray-400">Sessions</p>
                                </div>
                                <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                                    <p className="truncate text-sm font-black text-gray-900">{account.lastActive}</p>
                                    <p className="mt-0.5 text-[9px] font-black uppercase tracking-widest text-gray-400">Last Active</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => handleViewAccount(account)}
                                className="w-full sm:w-auto h-12 sm:h-11 rounded-xl bg-[#6F4BFF]/10 text-[#6F4BFF] hover:bg-[#6F4BFF] hover:text-white transition-all px-5 flex items-center justify-center gap-1.5 text-[11px] font-black uppercase tracking-widest shrink-0 border border-[#6F4BFF]/20"
                            >
                                <Eye className="w-4 h-4" />
                                <span>View</span>
                            </button>
                        </div>
                    </div>
                ))}

                {filteredProjectPanelAccounts.length === 0 && (
                    <div className="py-16 text-center">
                        <Activity className="mx-auto mb-3 h-12 w-12 text-gray-200" />
                        <p className="font-bold text-gray-500">No Project Panel accounts found.</p>
                    </div>
                )}
            </div>
        </Card>
    );

    const renderTabContent = () => {
        if (activeTab === 'userComplaints') {
            const userComplaintsList = complaints.filter((c) => c.userId === selectedUser?.id);
            if (!userComplaintsList.length) {
                return (
                    <div className="py-16 text-center">
                        <ShieldAlert className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                        <p className="text-gray-500 font-bold">No complaints logged for this user.</p>
                    </div>
                );
            }
            return (
                <div className="space-y-4">
                    {userComplaintsList.map((complaint) => (
                        <div key={complaint.id} className="p-5 rounded-2xl border border-gray-100 bg-gray-50 flex flex-col gap-4">
                            <div className="flex items-start justify-between gap-4 flex-wrap">
                                <div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-xs font-black text-gray-900 bg-white border border-gray-100 rounded-lg px-2.5 py-1">{complaint.id}</span>
                                        <Badge variant={complaint.status === 'Resolved' ? 'green' : 'yellow'}>{complaint.status}</Badge>
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{complaint.date}</span>
                                    </div>
                                    <p className="text-sm font-black text-gray-900 mt-2">Category: {complaint.category}</p>
                                </div>
                                {complaint.status === 'Pending' && (
                                    <button
                                        type="button"
                                        onClick={() => handleResolveComplaint(complaint.id)}
                                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-widest transition-colors shadow-sm"
                                    >
                                        Resolve
                                    </button>
                                )}
                            </div>
                            <p className="text-sm text-gray-700 font-medium leading-relaxed bg-white p-3 rounded-xl border border-gray-100/50">
                                {complaint.description}
                            </p>
                            {complaint.status === 'Resolved' && (
                                <p className="text-xs font-bold text-emerald-600 flex items-center gap-1.5 mt-0.5">
                                    ✓ Resolved on {complaint.resolvedDate}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            );
        }

        if (activeTab === 'dealManagement') {
            const userDeals = (selectedUser?.deals && selectedUser.deals.length > 0) ? selectedUser.deals : (userDealsData[selectedUser?.id] || []);
            if (!userDeals.length) {
                return (
                    <div className="py-16 text-center">
                        <CreditCard className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                        <p className="text-gray-500 font-bold">No active deals found for this user.</p>
                    </div>
                );
            }

            const activeCount = userDeals.filter(d => d.status === 'active').length;
            const pendingCount = userDeals.filter(d => d.status === 'pending').length;
            const totalVal = userDeals.reduce((sum, d) => sum + d.total_value, 0);

            return (
                <div className="space-y-6">
                    <div className="grid grid-cols-3 gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        <div className="text-center">
                            <p className="text-xl font-black text-gray-900">{activeCount}</p>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">Active</p>
                        </div>
                        <div className="text-center border-x border-gray-200/60">
                            <p className="text-xl font-black text-gray-900">{pendingCount}</p>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">Pending</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xl font-black text-gray-900">{formatCurrency(totalVal)}</p>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">Total Value</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {userDeals.map((deal) => {
                            const isExpanded = expandedDealId === deal.id;
                            const paidPct = Math.round((deal.paid_so_far / deal.total_value) * 100);
                            return (
                                <div key={deal.id} className={`rounded-2xl border transition-all ${isExpanded ? 'border-[#6F4BFF] bg-white shadow-md' : 'border-gray-100 bg-gray-50/50 hover:border-[#6F4BFF]/30'}`}>
                                    <button
                                        type="button"
                                        onClick={() => setExpandedDealId(isExpanded ? null : deal.id)}
                                        className="w-full p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-left"
                                    >
                                        <div className="min-w-0">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h4 className="text-base font-black text-gray-900">{deal.property_title}</h4>
                                                <span className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${deal.status === 'active' ? 'bg-[#EAF8EE] text-[#22A559]' : deal.status === 'completed' ? 'bg-[#EBF5FF] text-[#2B87E3]' : 'bg-[#FFF8E6] text-[#F59E0B]'}`}>
                                                    {deal.status}
                                                </span>
                                            </div>
                                            <p className="text-xs font-bold text-gray-500 mt-1">📍 {deal.city}, {deal.area} · ID: {deal.dealId}</p>
                                        </div>
                                        <div className="flex items-center gap-4 shrink-0">
                                            <div className="text-right hidden sm:block">
                                                <p className="text-xs font-black text-[#6F4BFF]">Stage {deal.current_stage_index}/{deal.total_stages}</p>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">{paidPct}% Paid</p>
                                            </div>
                                            <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-[#6F4BFF] font-black">
                                                {isExpanded ? '−' : '+'}
                                            </div>
                                        </div>
                                    </button>

                                    <div className="px-4 pb-4">
                                        <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-[#6F4BFF] rounded-full" style={{ width: `${paidPct}%` }} />
                                        </div>
                                    </div>

                                    {isExpanded && (
                                        <div className="border-t border-gray-100 p-4 space-y-5 bg-white rounded-b-2xl">
                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Total Value</p>
                                                    <p className="text-sm font-black text-gray-900 mt-0.5">{formatCurrency(deal.total_value)}</p>
                                                </div>
                                                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Paid So Far</p>
                                                    <p className="text-sm font-black text-gray-900 mt-0.5">{formatCurrency(deal.paid_so_far)}</p>
                                                </div>
                                                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Remaining</p>
                                                    <p className="text-sm font-black text-gray-900 mt-0.5">{formatCurrency(deal.total_value - deal.paid_so_far)}</p>
                                                </div>
                                                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Timeline Stage</p>
                                                    <p className="text-sm font-black text-gray-900 mt-0.5">{deal.current_stage_index} of {deal.total_stages}</p>
                                                </div>
                                            </div>

                                            <div>
                                                <h5 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                                                    💳 Payment Milestones
                                                </h5>
                                                <div className="space-y-2.5">
                                                    {deal.payments.map((payment, idx) => (
                                                        <div key={payment.id} className="p-3 bg-gray-50/50 border border-gray-100 rounded-xl flex items-center justify-between gap-3">
                                                            <div className="min-w-0 flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center font-black text-xs text-[#6F4BFF]">
                                                                    {String(idx + 1).padStart(2, '0')}
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <p className="text-xs font-black text-gray-900 truncate">{payment.title}</p>
                                                                    <p className="text-[10px] font-bold text-gray-400 mt-0.5">Due: {payment.due_date}</p>
                                                                </div>
                                                            </div>
                                                            <div className="text-right shrink-0">
                                                                <p className="text-xs font-black text-gray-900">{formatCurrency(payment.amount)}</p>
                                                                <span className={`inline-block rounded-full px-2 py-0.5 text-[8px] font-black uppercase mt-1 ${payment.status === 'paid' ? 'bg-[#E6F6ED] text-[#22A559]' : payment.status === 'due_soon' ? 'bg-[#FFF8E6] text-[#F59E0B]' : 'bg-[#F3F4F6] text-[#6B7280]'}`}>
                                                                    {payment.status === 'due_soon' ? 'Due Soon' : payment.status}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            );
        }

        const items = selectedUser?.[activeTab] || [];

        if (!items.length) {
            return (
                <div className="py-16 text-center">
                    <Activity className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-500 font-bold">No activity found for this section.</p>
                </div>
            );
        }

        if (activeTab === 'screenEvents') {
            return (
                <div className="space-y-3">
                    {items.map((event, index) => (
                        <div key={`${event.time}-${index}`} className="p-4 rounded-xl border border-gray-100 bg-gray-50 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div className="min-w-0">
                                <p className="font-black text-gray-900 break-words">{event.action}</p>
                                <p className="text-xs font-bold text-gray-500 mt-1 uppercase tracking-widest">{event.screen}</p>
                            </div>
                            <span className="w-fit text-xs font-black text-[#6F4BFF] bg-white border border-gray-100 rounded-lg px-3 py-1">{event.time}</span>
                        </div>
                    ))}
                </div>
            );
        }

        if (activeTab === 'bookedVisits') {
            return (
                <div className="space-y-3">
                    {items.map((visit) => (
                        <div key={visit.id} className="p-4 rounded-xl border border-gray-100 bg-gray-50 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="min-w-0">
                                <p className="font-black text-gray-900 break-words">{visit.title}</p>
                                <p className="text-sm font-bold text-gray-500 mt-1">{visit.dateFull}</p>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{visit.bookingId}</p>
                            </div>
                            <Badge variant={visit.status === 'COMPLETED' ? 'green' : visit.status === 'CONFIRMED' ? 'blue' : 'yellow'}>{visit.status}</Badge>
                        </div>
                    ))}
                </div>
            );
        }

        return (
            <div className="space-y-3">
                {items.map((property) => (
                    <div key={`${property.id}-${property.title}`} className="p-4 rounded-xl border border-gray-100 bg-gray-50 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0">
                            <p className="font-black text-gray-900 break-words">{property.title}</p>
                            <p className="text-sm font-bold text-gray-500 mt-1 break-words">{property.location || property.channel || property.seenAt}</p>
                            {property.price && <p className="text-xs font-black text-emerald-600 mt-1">{property.price}</p>}
                        </div>
                        <span className="w-fit text-xs font-black text-gray-500 bg-white border border-gray-100 rounded-lg px-3 py-1">
                            {property.savedAt || property.seenAt || property.contactedAt}
                        </span>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="flex-1 flex flex-col h-full relative bg-[#F5F6FA] font-sans text-gray-900">
            <Header title="App activity" />

            <main className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth">
                <div className="max-w-[1600px] mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    {pageError && (
                        <Card className="border-l-4 border-l-rose-500 bg-rose-50">
                            <p className="text-sm font-bold text-rose-700">{pageError}</p>
                        </Card>
                    )}

                    {activeApp === 'userApp' && (
                        <Card className="border-l-4 border-l-amber-400 bg-amber-50">
                            <p className="text-sm font-bold text-amber-800">
                                Session duration tracking is not implemented on the backend yet — "Not tracked yet" means usage
                                time was never measured for that user, not that they had zero activity. See TODO(backend) in
                                UserAppActivities.jsx / appUserController.js for the pipeline that still needs to be built.
                            </p>
                        </Card>
                    )}

                    <div className="flex flex-wrap gap-2 rounded-2xl border border-gray-100 bg-white p-2 shadow-sm">
                        {appTabs.map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => {
                                    setActiveApp(tab.id);
                                    setSearchQuery('');
                                    setStatusFilter('All');
                                }}
                                className={`h-10 rounded-xl px-5 text-xs font-black uppercase tracking-widest transition-all ${
                                    activeApp === tab.id
                                        ? 'bg-[#6F4BFF] text-white shadow-md shadow-[#6F4BFF]/20'
                                        : 'text-gray-500 hover:bg-gray-50 hover:text-[#6F4BFF]'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                        <div>
                            <h2 className="text-3xl font-black text-gray-900 tracking-tight">App activity</h2>
                            <p className="text-sm text-gray-500 mt-1 font-medium">
                                {activeApp === 'userApp'
                                    ? 'Track app sessions, saved properties, contacted properties, searches, and visit activity from the user app.'
                                    : 'Track Project Panel usage for builders and marketing companies with basic account activity.'}
                            </p>
                        </div>
                        <div className="flex flex-col gap-3 sm:flex-row">
                            <div className="relative">
                                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    value={searchQuery}
                                    onChange={(event) => setSearchQuery(event.target.value)}
                                    placeholder={activeApp === 'userApp' ? 'Search users...' : 'Search builders or companies...'}
                                    className="w-full sm:w-80 pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-bold outline-none focus:ring-2 focus:ring-[#6F4BFF]/30"
                                />
                            </div>
                            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-black outline-none focus:ring-2 focus:ring-[#6F4BFF]/30">
                                <option>All</option>
                                <option>Online</option>
                                <option>Idle</option>
                                <option>Offline</option>
                            </select>
                        </div>
                    </div>

                    <div className={`grid grid-cols-1 gap-5 sm:grid-cols-2 ${activeApp === 'userApp' ? 'xl:grid-cols-6' : 'xl:grid-cols-4'}`}>
                        {summary.map((metric) => {
                            const Icon = metric.icon;
                            return (
                                <Card key={metric.title} className="relative overflow-hidden">
                                    <div className={`w-12 h-12 rounded-2xl ${metric.bg} ${metric.color} flex items-center justify-center mb-5`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <p className="text-3xl font-black text-gray-900 tracking-tight">{metric.value}</p>
                                    <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mt-1">{metric.title}</p>
                                </Card>
                            );
                        })}
                    </div>

                    {activeApp === 'projectPanel' ? (
                        renderProjectPanelContent()
                    ) : (
                    <div className="grid grid-cols-1 xl:grid-cols-[minmax(260px,360px)_minmax(0,1fr)] gap-6 min-w-0">
                        <Card noPadding className="overflow-hidden">
                            <div className="p-5 border-b border-gray-100 bg-white">
                                <h3 className="text-lg font-black text-gray-900">App Users</h3>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
                                    {isLoadingUsers ? 'Loading users...' : `${filteredUsers.length} users in current view`}
                                </p>
                            </div>
                            <div className="max-h-[680px] overflow-y-auto p-3 space-y-3 bg-gray-50/50">
                                {!isLoadingUsers && filteredUsers.map((user) => {
                                    const isSelected = selectedUser?.id === user.id;
                                    return (
                                        <button
                                            key={user.id}
                                            onClick={() => setSelectedUserId(user.id)}
                                            className={`w-full text-left bg-white border rounded-2xl p-4 transition-all ${isSelected ? 'border-[#6F4BFF] ring-2 ring-[#6F4BFF]/10 shadow-md' : 'border-gray-100 hover:border-[#6F4BFF]/30 hover:shadow-sm'}`}
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex gap-3">
                                                    <div className="w-11 h-11 rounded-xl bg-[#6F4BFF]/10 text-[#6F4BFF] flex items-center justify-center font-black">
                                                        {user.name.charAt(0)}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-black text-gray-900 truncate">{user.name}</p>
                                                        <p className="text-xs font-bold text-gray-500 mt-1 truncate">{user.phone}</p>
                                                    </div>
                                                </div>
                                                <Badge variant={getStatusVariant(user.status)}>{user.status}</Badge>
                                            </div>
                                            <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-gray-100">
                                                <MiniStat label="Deals" value={user.dealsCount || 0} />
                                                <MiniStat label="Visits" value={user.visitsCount || user.bookedVisits.length} />
                                                <MiniStat label="Contacted" value={user.contactedCount || user.contactedProperties.length} />
                                            </div>
                                        </button>
                                    );
                                })}
                                {!isLoadingUsers && filteredUsers.length === 0 && (
                                    <div className="py-16 text-center">
                                        <User className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                                        <p className="text-gray-500 font-bold">No app users found.</p>
                                    </div>
                                )}
                                {isLoadingUsers && (
                                    <div className="py-16 text-center">
                                        <Activity className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                                        <p className="text-gray-500 font-bold">Loading app users...</p>
                                    </div>
                                )}
                            </div>
                        </Card>

                        {selectedUser && (
                            <div className="space-y-6 min-w-0">
                                {isLoadingUserDetails && (
                                    <Card className="border-l-4 border-l-[#6F4BFF] bg-[#6F4BFF]/5">
                                        <p className="text-xs font-black uppercase tracking-widest text-[#6F4BFF]">Refreshing selected user activity...</p>
                                    </Card>
                                )}

                                <Card noPadding className="overflow-hidden">
                                    <div className="p-6 bg-linear-to-r from-white to-[#6F4BFF]/5 border-b border-gray-100 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                                        <div className="flex gap-5 min-w-0">
                                            <div className="w-16 h-16 rounded-2xl bg-[#6F4BFF] text-white flex items-center justify-center text-2xl font-black shadow-xl shadow-[#6F4BFF]/20">
                                                {selectedUser.name.charAt(0)}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h3 className="text-2xl font-black text-gray-900">{selectedUser.name}</h3>
                                                    <Badge variant={getStatusVariant(selectedUser.status)}>{selectedUser.status}</Badge>
                                                </div>
                                                <p className="text-xs font-black text-[#6F4BFF] uppercase tracking-widest mt-1">{selectedUser.userId}</p>
                                                <p className="text-sm font-bold text-gray-500 mt-1 break-words">{selectedUser.email} - {selectedUser.city}</p>
                                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mt-2">Last active: {selectedUser.lastActive}</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-auto">
                                            <ProfileMetric icon={Clock} label="Today" value={formatTrackedActiveTime(selectedUser.activeMinutesToday)} />
                                            <ProfileMetric icon={Smartphone} label="Sessions" value={formatTrackedSessions(selectedUser.sessionsToday)} />
                                            <ProfileMetric icon={Zap} label="Total" value={formatTrackedActiveTime(selectedUser.totalActiveMinutes)} />
                                        </div>
                                    </div>

                                    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <ActivityCard label="Deals" value={selectedUser.dealsCount || 0} icon={CreditCard} />
                                        <ActivityCard label="Visits" value={selectedUser.visitsCount || selectedUser.bookedVisits.length} icon={CalendarDays} />
                                        <ActivityCard label="Contacted" value={selectedUser.contactedCount || selectedUser.contactedProperties.length} icon={PhoneCall} />
                                    </div>
                                </Card>

                                <Card noPadding>
                                    <div className="p-4 border-b border-gray-100 flex flex-wrap gap-2 bg-white">
                                        {tabs.map((tab) => {
                                            const Icon = tab.icon;
                                            const isActive = activeTab === tab.id;
                                            const count = tab.id === 'userComplaints'
                                                ? complaints.filter((c) => c.userId === selectedUser?.id).length
                                                : tab.id === 'dealManagement'
                                                ? (selectedUser.dealsCount || userDealsData[selectedUser?.id]?.length || 0)
                                                : selectedUser[tab.id]?.length || 0;
                                            return (
                                                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-3 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${isActive ? 'bg-[#6F4BFF] text-white shadow-md shadow-[#6F4BFF]/20' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}>
                                                    <Icon className="w-4 h-4" />
                                                    <span className="leading-tight">{tab.label}</span>
                                                    <span className={`px-2 py-0.5 rounded-lg ${isActive ? 'bg-white/20' : 'bg-white border border-gray-100'}`}>{count}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <div className="p-6">
                                        {renderTabContent()}
                                    </div>
                                </Card>

                                <Card>
                                    <div className="flex items-center justify-between gap-4 mb-4">
                                        <div>
                                            <h3 className="text-lg font-black text-gray-900">Recent Searches</h3>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">From user app search and listing filters</p>
                                        </div>
                                        <User className="w-5 h-5 text-gray-300" />
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedUser.recentSearches.map((search) => (
                                            <span key={search} className="px-3 py-2 rounded-xl bg-gray-50 border border-gray-100 text-xs font-black text-gray-600">
                                                {search}
                                            </span>
                                        ))}
                                    </div>
                                </Card>
                            </div>
                        )}
                    </div>
                    )}
                </div>
            </main>
        </div>
    );
};

const MiniStat = ({ label, value }) => (
    <div>
        <p className="text-sm font-black text-gray-900">{value}</p>
        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
    </div>
);

const ProfileMetric = ({ icon: Icon, label, value }) => (
    <div className="bg-white/70 border border-white rounded-2xl p-4 shadow-sm min-w-0">
        <Icon className="w-4 h-4 text-[#6F4BFF] mb-2" />
        <p className="text-lg font-black text-gray-900 truncate">{value}</p>
        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
    </div>
);

const ActivityCard = ({ label, value, icon: Icon }) => (
    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
        <div className="w-10 h-10 rounded-xl bg-white text-[#6F4BFF] flex items-center justify-center mb-4 shadow-sm">
            <Icon className="w-5 h-5" />
        </div>
        <p className="text-3xl font-black text-gray-900">{value}</p>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{label}</p>
    </div>
);

export default UserAppActivities;
