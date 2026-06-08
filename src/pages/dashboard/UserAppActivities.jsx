import { useMemo, useState } from 'react';
import {
    Activity,
    CalendarDays,
    Clock,
    Eye,
    Heart,
    PhoneCall,
    Search,
    Smartphone,
    User,
    Zap,
} from 'lucide-react';
import { userAppActivities } from '../../data/mockData';
import Header from '../../components/layout/Header';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

const tabs = [
    { id: 'savedProperties', label: 'Saved Properties', icon: Heart },
    { id: 'seenProperties', label: 'Seen', icon: Eye },
    { id: 'contactedProperties', label: 'Contacted', icon: PhoneCall },
    { id: 'bookedVisits', label: 'Visits', icon: CalendarDays },
    { id: 'screenEvents', label: 'Activity Log', icon: Activity },
];

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

const UserAppActivities = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [selectedUserId, setSelectedUserId] = useState(userAppActivities[0]?.id);
    const [activeTab, setActiveTab] = useState('savedProperties');

    const filteredUsers = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        return userAppActivities.filter((user) => {
            const matchesSearch = !query || [user.name, user.phone, user.email, user.city]
                .filter(Boolean)
                .some((value) => String(value).toLowerCase().includes(query));
            const matchesStatus = statusFilter === 'All' || user.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [searchQuery, statusFilter]);

    const selectedUser = userAppActivities.find((user) => user.id === selectedUserId) || filteredUsers[0] || userAppActivities[0];

    const summary = useMemo(() => {
        const totalActiveMinutes = filteredUsers.reduce((sum, user) => sum + user.activeMinutesToday, 0);
        const savedCount = filteredUsers.reduce((sum, user) => sum + user.savedProperties.length, 0);
        const contactedCount = filteredUsers.reduce((sum, user) => sum + user.contactedProperties.length, 0);
        const visitCount = filteredUsers.reduce((sum, user) => sum + user.bookedVisits.length, 0);

        return [
            { title: 'Active Time Today', value: formatActiveTime(totalActiveMinutes), icon: Clock, color: 'text-[#6F4BFF]', bg: 'bg-[#6F4BFF]/10' },
            { title: 'Saved Properties', value: savedCount, icon: Heart, color: 'text-rose-500', bg: 'bg-rose-50' },
            { title: 'Contacted Properties', value: contactedCount, icon: PhoneCall, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { title: 'Booked Visits', value: visitCount, icon: CalendarDays, color: 'text-blue-600', bg: 'bg-blue-50' },
        ];
    }, [filteredUsers]);

    const renderTabContent = () => {
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
                        <div key={`${event.time}-${index}`} className="p-4 rounded-xl border border-gray-100 bg-gray-50 flex items-start justify-between gap-4">
                            <div>
                                <p className="font-black text-gray-900">{event.action}</p>
                                <p className="text-xs font-bold text-gray-500 mt-1 uppercase tracking-widest">{event.screen}</p>
                            </div>
                            <span className="text-xs font-black text-[#6F4BFF] bg-white border border-gray-100 rounded-lg px-3 py-1">{event.time}</span>
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
                            <div>
                                <p className="font-black text-gray-900">{visit.title}</p>
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
                        <div>
                            <p className="font-black text-gray-900">{property.title}</p>
                            <p className="text-sm font-bold text-gray-500 mt-1">{property.location || property.channel || property.seenAt}</p>
                            {property.price && <p className="text-xs font-black text-emerald-600 mt-1">{property.price}</p>}
                        </div>
                        <span className="text-xs font-black text-gray-500 bg-white border border-gray-100 rounded-lg px-3 py-1">
                            {property.savedAt || property.seenAt || property.contactedAt}
                        </span>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="flex-1 flex flex-col h-full relative bg-[#F5F6FA] font-sans text-gray-900">
            <Header title="User App Activities" />

            <main className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth">
                <div className="max-w-[1600px] mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                        <div>
                            <h2 className="text-3xl font-black text-gray-900 tracking-tight">User App Activities</h2>
                            <p className="text-sm text-gray-500 mt-1 font-medium">Track app sessions, saved properties, contacted properties, searches, and visit activity from the user app.</p>
                        </div>
                        <div className="flex flex-col gap-3 sm:flex-row">
                            <div className="relative">
                                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    value={searchQuery}
                                    onChange={(event) => setSearchQuery(event.target.value)}
                                    placeholder="Search users..."
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
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

                    <div className="grid grid-cols-1 xl:grid-cols-[420px_1fr] gap-6">
                        <Card noPadding className="overflow-hidden">
                            <div className="p-5 border-b border-gray-100 bg-white">
                                <h3 className="text-lg font-black text-gray-900">App Users</h3>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">{filteredUsers.length} users in current view</p>
                            </div>
                            <div className="max-h-[680px] overflow-y-auto p-3 space-y-3 bg-gray-50/50">
                                {filteredUsers.map((user) => {
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
                                                    <div>
                                                        <p className="font-black text-gray-900">{user.name}</p>
                                                        <p className="text-xs font-bold text-gray-500 mt-1">{user.phone}</p>
                                                    </div>
                                                </div>
                                                <Badge variant={getStatusVariant(user.status)}>{user.status}</Badge>
                                            </div>
                                            <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-gray-100">
                                                <MiniStat label="Active" value={formatActiveTime(user.activeMinutesToday)} />
                                                <MiniStat label="Saved" value={user.savedProperties.length} />
                                                <MiniStat label="Visits" value={user.bookedVisits.length} />
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </Card>

                        {selectedUser && (
                            <div className="space-y-6">
                                <Card noPadding className="overflow-hidden">
                                    <div className="p-6 bg-linear-to-r from-white to-[#6F4BFF]/5 border-b border-gray-100 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                                        <div className="flex gap-5">
                                            <div className="w-16 h-16 rounded-2xl bg-[#6F4BFF] text-white flex items-center justify-center text-2xl font-black shadow-xl shadow-[#6F4BFF]/20">
                                                {selectedUser.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h3 className="text-2xl font-black text-gray-900">{selectedUser.name}</h3>
                                                    <Badge variant={getStatusVariant(selectedUser.status)}>{selectedUser.status}</Badge>
                                                </div>
                                                <p className="text-sm font-bold text-gray-500 mt-1">{selectedUser.email} - {selectedUser.city}</p>
                                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mt-2">Last active: {selectedUser.lastActive}</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-3">
                                            <ProfileMetric icon={Clock} label="Today" value={formatActiveTime(selectedUser.activeMinutesToday)} />
                                            <ProfileMetric icon={Smartphone} label="Sessions" value={selectedUser.sessionsToday} />
                                            <ProfileMetric icon={Zap} label="Total" value={formatActiveTime(selectedUser.totalActiveMinutes)} />
                                        </div>
                                    </div>

                                    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <ActivityCard label="Saved" value={selectedUser.savedProperties.length} icon={Heart} />
                                        <ActivityCard label="Seen" value={selectedUser.seenProperties.length} icon={Eye} />
                                        <ActivityCard label="Contacted" value={selectedUser.contactedProperties.length} icon={PhoneCall} />
                                    </div>
                                </Card>

                                <Card noPadding>
                                    <div className="p-4 border-b border-gray-100 flex gap-2 overflow-x-auto bg-white">
                                        {tabs.map((tab) => {
                                            const Icon = tab.icon;
                                            const isActive = activeTab === tab.id;
                                            const count = selectedUser[tab.id]?.length || 0;
                                            return (
                                                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap ${isActive ? 'bg-[#6F4BFF] text-white shadow-md shadow-[#6F4BFF]/20' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}>
                                                    <Icon className="w-4 h-4" />
                                                    {tab.label}
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
    <div className="bg-white/70 border border-white rounded-2xl p-4 min-w-24 shadow-sm">
        <Icon className="w-4 h-4 text-[#6F4BFF] mb-2" />
        <p className="text-lg font-black text-gray-900">{value}</p>
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
