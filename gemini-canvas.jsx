import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard, Building2, HardHat, Users, Briefcase,
    CreditCard, ClipboardList, LineChart, Settings, Search,
    Bell, ChevronRight, Filter, Plus, CheckCircle2, XCircle,
    MoreVertical, FileText, MapPin, Calendar, IndianRupee,
    ArrowRight, Check, User, UserPlus, Eye, Heart, Sparkles,
    Navigation, ThumbsDown, TrendingUp, Key, Layers,
    Maximize, X, Save, Edit2, Activity, Globe, Zap, Target,
    ArrowUpRight, ArrowDownRight, Clock, PhoneCall, Mail, MessageSquare,
    Trash2, Image as ImageIcon, UploadCloud
} from 'lucide-react';

// --- UNIFIED COMPLEX MOCK DATA ---
const mockProjects = [
    {
        id: 'P001', name: 'Skyline Residency', builder: 'Apex Buildcon', location: 'Andheri West, Mumbai', priceRange: '1.2 Cr - 2.5 Cr', configs: ['2BHK', '3BHK', '4BHK'], status: 'Active', units: 120, available: 45, progress: 100, officer: 'Rahul M.', updated: '2 hours ago', specs: 'Premium Residential', docs: 4,
        inventory: [
            { type: '2BHK Classic', size: '1,100 Sq.Ft', basePrice: '1.20 Cr', totalUnits: 60, availableUnits: 12 },
            { type: '3BHK Premium', size: '1,550 Sq.Ft', basePrice: '1.85 Cr', totalUnits: 40, availableUnits: 25 },
            { type: '4BHK Luxury', size: '2,100 Sq.Ft', basePrice: '2.50 Cr', totalUnits: 20, availableUnits: 8 }
        ]
    },
    {
        id: 'P002', name: 'Green Valley Phase 2', builder: 'EcoHomes Ltd', location: 'HSR Layout, Bangalore', priceRange: '85 L - 1.5 Cr', configs: ['Villa Plots', '3BHK'], status: 'Active', units: 80, available: 12, progress: 100, officer: 'Sneha P.', updated: '1 day ago', specs: 'Villa Plots & Open Spaces', docs: 8,
        inventory: [
            { type: '30x40 Plot', size: '1,200 Sq.Ft', basePrice: '85 Lacs', totalUnits: 50, availableUnits: 5 },
            { type: '40x60 Plot', size: '2,400 Sq.Ft', basePrice: '1.50 Cr', totalUnits: 30, availableUnits: 7 }
        ]
    },
    {
        id: 'P003', name: 'Metro Heights', builder: 'CityScape', location: 'Connaught Place, Delhi', priceRange: '3.5 Cr - 8 Cr', configs: ['Office Space', 'Retail'], status: 'In Review', units: 50, available: 5, progress: 60, officer: 'Rahul M.', updated: '3 days ago', specs: 'Premium Commercial', docs: 2,
        inventory: [
            { type: 'Retail Shop', size: '800 Sq.Ft', basePrice: '3.50 Cr', totalUnits: 20, availableUnits: 2 },
            { type: 'Office Space', size: '2,000 Sq.Ft', basePrice: '8.00 Cr', totalUnits: 30, availableUnits: 3 }
        ]
    },
    {
        id: 'P004', name: 'Ocean View Luxury', builder: 'Coastal Reality', location: 'ECR, Chennai', priceRange: '4.2 Cr - 6 Cr', configs: ['4BHK', 'Penthouse'], status: 'Approved', units: 30, available: 8, progress: 100, officer: 'Vikram S.', updated: '1 week ago', specs: 'Ultra Luxury Sea-facing', docs: 6,
        inventory: [
            { type: '4BHK Seaview', size: '3,200 Sq.Ft', basePrice: '4.20 Cr', totalUnits: 25, availableUnits: 7 },
            { type: 'Penthouse', size: '5,500 Sq.Ft', basePrice: '6.00 Cr', totalUnits: 5, availableUnits: 1 }
        ]
    },
    {
        id: 'P005', name: 'Parkside Avenues', builder: 'Apex Buildcon', location: 'Andheri East, Mumbai', priceRange: '90 L - 1.8 Cr', configs: ['1BHK', '2BHK'], status: 'Pending', units: 200, available: 89, progress: 25, officer: 'Neha K.', updated: '5 hours ago', specs: 'Compact Modern Living', docs: 1,
        inventory: [
            { type: '1BHK Smart', size: '650 Sq.Ft', basePrice: '90 Lacs', totalUnits: 120, availableUnits: 40 },
            { type: '2BHK Classic', size: '950 Sq.Ft', basePrice: '1.45 Cr', totalUnits: 80, availableUnits: 49 }
        ]
    },
];

const mockLeads = [
    { id: 'L001', name: 'Karan Malhotra', phone: '+91 9876543210', budget: '1.5 Cr - 2 Cr', req: 'Residential, 3BHK', location: 'Mumbai', status: 'New', officer: 'Neha K.', date: '12 Apr' },
    { id: 'L002', name: 'Swati Jain', phone: '+91 9876543211', budget: '50 L - 90 L', req: 'Plot / Villa', location: 'Bangalore', status: 'Contacted', officer: 'Ravi T.', date: '11 Apr' },
];

const mockClients = [
    {
        id: 'C001', name: 'Vikash Singh', phone: '+91 9876543212', budget: '3 Cr - 5 Cr',
        req: { type: 'Residential', bhk: ['3BHK', '4BHK'], loc: ['Chennai', 'ECR'], timeline: '30 Days' },
        status: 'Active', officer: 'Neha K.',
        propertyPipeline: [
            { projectId: 'P004', status: 'Shortlisted', units: ['4BHK'], visitedOn: '10 Apr', notes: 'Loved the sea view.' },
            { projectId: 'P001', status: 'Shown', units: ['3BHK', '4BHK'], visitedOn: null, notes: 'Sent brochure via WhatsApp' },
            { projectId: 'P002', status: 'Not Interested', units: [], visitedOn: null, notes: 'Too far from office' }
        ]
    },
    {
        id: 'C002', name: 'Ankit Sharma', phone: '+91 9876543213', budget: '1 Cr - 2 Cr',
        req: { type: 'Residential', bhk: ['2BHK'], loc: ['Mumbai', 'Andheri'], timeline: '60 Days' },
        status: 'Negotiating', officer: 'Rahul M.',
        propertyPipeline: [
            { projectId: 'P001', status: 'Negotiating', units: ['2BHK - Flat 402'], visitedOn: '08 Apr', notes: 'Asking for 5% discount' },
            { projectId: 'P005', status: 'Visited', units: ['2BHK'], visitedOn: '05 Apr', notes: 'Liked the amenities, but prefers Skyline' }
        ]
    }
];

// NAYA MOCK DATA DEAL MANAGEMENT KE LIYE (Based on Screenshot 1 & 2)
const mockDeals = [
    {
        dealCode: 'D0007', customer: 'Geheve', property: 'Testing', city: 'Indore', salesOfficer: 'Sales Officer', broker: 'Anil', status: 'FINALIZED', createdOn: '07/03/26',
        customerPhone: '9165993939', brokerMobile: '9165993939', salesOfficerMobile: '9302569085',
        prefLocation: 'Harda, Madhya Pradesh, India',
        propType: 'APARTMENT/FLATS', address: 'VIRTUAL COWORKS, 41,42 PU 4 Scheme NO.54, VIRTUAL COWORKS, Malviya Nagar, Indore, Indore Division, Madhya Pradesh, 452010, India',
        khasra: '', expectPrice: 1000000, negotiationPrice: 2000000, remainingBalance: 984900,
        payments: [
            { id: 1, milestone: 'Guyigtyu', amount: 10000, dueDate: '2026-03-09', mode: 'Cash', updated: '-', status: 'COMPLETED' },
            { id: 2, milestone: 'Guyigtyu 1', amount: 5000, dueDate: '2026-03-07', mode: 'Upi', updated: '-', status: 'COMPLETED' },
            { id: 3, milestone: 'Booking', amount: 100, dueDate: '2026-03-10', mode: 'Upi', updated: '-', status: 'COMPLETED' }
        ]
    },
    { dealCode: 'D0006', customer: 'Durgesh', property: 'Sapana', city: 'Indore', salesOfficer: 'Rizwan Khan', broker: 'SquarFT 92', status: 'FINALIZED', createdOn: '28/02/26', customerPhone: '9876543210', brokerMobile: '-', salesOfficerMobile: '-', prefLocation: '-', propType: 'PLOT', address: '-', khasra: '-', expectPrice: 500000, negotiationPrice: 500000, remainingBalance: 0, payments: [] },
    { dealCode: 'D0005', customer: 'Swapnil', property: 'Sindh Palace', city: 'Indore', salesOfficer: 'Manas', broker: 'Manas Gangrade', status: 'FINALIZED', createdOn: '24/02/26', customerPhone: '9876543210', brokerMobile: '-', salesOfficerMobile: '-', prefLocation: '-', propType: 'COMMERCIAL', address: '-', khasra: '-', expectPrice: 1500000, negotiationPrice: 1450000, remainingBalance: 0, payments: [] },
    { dealCode: 'D0004', customer: 'Anil Nahar', property: 'Sai Shyam', city: 'Indore', salesOfficer: 'Sales Officer', broker: 'Manas', status: 'FINALIZED', createdOn: '10/02/26', customerPhone: '9876543210', brokerMobile: '-', salesOfficerMobile: '-', prefLocation: '-', propType: 'APARTMENT/FLATS', address: '-', khasra: '-', expectPrice: 2000000, negotiationPrice: 1900000, remainingBalance: 0, payments: [] },
    { dealCode: 'D0003', customer: 'Anil Nahar', property: 'Anil Property', city: 'Indore', salesOfficer: 'Sales Officer', broker: 'Anil', status: 'FINALIZED', createdOn: '09/02/26', customerPhone: '9876543210', brokerMobile: '-', salesOfficerMobile: '-', prefLocation: '-', propType: 'APARTMENT/FLATS', address: '-', khasra: '-', expectPrice: 2500000, negotiationPrice: 2400000, remainingBalance: 0, payments: [] },
];

const mockVisits = [
    { id: 'V001', client: 'Vikash Singh', project: 'Ocean View Luxury', date: '14 Apr 2026, 10:00 AM', status: 'Scheduled', officer: 'Neha K.' },
    { id: 'V002', client: 'Ankit Sharma', project: 'Skyline Residency', date: '08 Apr 2026, 04:00 PM', status: 'Completed', officer: 'Rahul M.' },
];

const mockBuilders = [
    { id: 1, name: 'Apex Buildcon', projects: 12, city: 'Mumbai', contact: '+91 9876543210', status: 'Active' },
    { id: 2, name: 'EcoHomes Ltd', projects: 8, city: 'Bangalore', contact: '+91 9876543211', status: 'Active' },
    { id: 3, name: 'CityScape Developers', projects: 4, city: 'Delhi', contact: '+91 9876543212', status: 'Onboarding' },
];

const mockPayments = [
    { id: 'PAY-101', deal: 'D0007', amount: '10,000', status: 'Received', date: '09 Mar 2026' },
    { id: 'PAY-102', deal: 'D0007', amount: '5,000', status: 'Received', date: '07 Mar 2026' },
    { id: 'PAY-103', deal: 'D0007', amount: '100', status: 'Received', date: '10 Mar 2026' },
];

// Naye users ka data jo apps se sign up kar rahe hain
const mockUsers = [
    { id: 'U001', name: 'Rizwan Khan', type: 'Sales_officer', phone: '9424654160', docStatus: 'Approved' },
    { id: 'U002', name: 'SquarFT106', type: 'Field_officer', phone: '8224000106', docStatus: 'Pending' },
    { id: 'U003', name: 'Sales Officer', type: 'Sales_officer', phone: '9302569085', docStatus: 'Approved' },
    { id: 'U004', name: 'Anil', type: 'Broker', phone: '9165993939', docStatus: 'Rejected' },
    { id: 'U005', name: 'Fff', type: 'Sales_officer', phone: '8889998258', docStatus: 'Approved' },
    { id: 'U006', name: 'Rajesh Gurjar', type: 'Sales_officer', phone: '8224004000', docStatus: 'Pending' },
];

// --- SHARED UI COMPONENTS ---
const Card = ({ children, className = '', noPadding = false }) => (
    <div className={`bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden ${className}`}>
        {noPadding ? children : <div className="p-6">{children}</div>}
    </div>
);

const Badge = ({ children, variant = 'gray', className = '' }) => {
    const variants = {
        gray: 'bg-gray-100 text-gray-700',
        purple: 'bg-[#6F4BFF]/10 text-[#6F4BFF] border border-[#6F4BFF]/20',
        green: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
        yellow: 'bg-amber-50 text-amber-700 border border-amber-100',
        red: 'bg-rose-50 text-rose-700 border border-rose-100',
        blue: 'bg-blue-50 text-blue-700 border border-blue-100',
        // Naya badge screenshot ke hisab se (Finalized Deal Code)
        gradient: 'bg-gradient-to-r from-purple-500 to-amber-500 text-white shadow-sm border-none',
    };
    return (
        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${variants[variant]} ${className}`}>
            {children}
        </span>
    );
};

const Button = ({ children, variant = 'primary', icon: Icon, onClick, className = '' }) => {
    const base = "inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
    const variants = {
        primary: "bg-[#6F4BFF] hover:bg-[#5936eb] text-white shadow-sm focus:ring-[#6F4BFF]",
        secondary: "bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 focus:ring-gray-200",
        ghost: "bg-transparent hover:bg-gray-100 text-gray-600",
        danger: "bg-rose-50 hover:bg-rose-100 text-rose-700 focus:ring-rose-500",
        success: "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 focus:ring-emerald-500",
        blue: "bg-[#2196F3] hover:bg-[#1E88E5] text-white shadow-sm focus:ring-[#2196F3]", // Blue button
    };
    return (
        <button onClick={onClick} className={`${base} ${variants[variant]} ${className}`}>
            {Icon && <Icon className="w-4 h-4" />}
            {children}
        </button>
    );
};

const getStatusBadge = (status) => {
    switch (status.toUpperCase()) {
        case 'APPROVED': case 'ACTIVE': case 'CLEARED': case 'RECEIVED': case 'CLOSURE':
            return <Badge variant="green">{status}</Badge>;
        case 'IN REVIEW': case 'PENDING': case 'CONTACTED': case 'VISIT': case 'DEAL': case 'NEGOTIATING':
            return <Badge variant="yellow">{status}</Badge>;
        case 'REJECTED': case 'LOST':
            return <Badge variant="red">{status}</Badge>;
        case 'NEW': case 'LEAD':
            return <Badge variant="purple">{status}</Badge>;
        case 'FINALIZED':
            return <Badge variant="gradient">{status}</Badge>; // Naya Finalized badge
        default:
            return <Badge variant="gray">{status}</Badge>;
    }
};

const Table = ({ headers, data, renderRow }) => (
    <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
            <thead>
                <tr className="bg-gray-50/80 border-y border-gray-100">
                    {headers.map((h, i) => (
                        <th key={i} className={`px-6 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider ${h.includes('ACTION') || h.includes('STATUS') ? 'text-center' : ''}`}>{h}</th>
                    ))}
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {data.map((row, i) => renderRow(row, i))}
            </tbody>
        </table>
    </div>
);

// --- MAIN APP COMPONENT ---
export default function App() {
    const [currentView, setCurrentView] = useState('Dashboard');
    const [selectedItem, setSelectedItem] = useState(null);

    const navigateTo = (view, item = null) => {
        setCurrentView(view);
        setSelectedItem(item);
    };

    const menuItems = [
        { name: 'Dashboard', icon: LayoutDashboard },
        { name: 'Leads Pipeline', icon: UserPlus },
        { name: 'Clients', icon: Users },
        { name: 'Projects Inventory', icon: Building2 },
        { name: 'Upcoming Visits', icon: Calendar },
        { name: 'Deal Management', icon: Briefcase },
        { name: 'Recommendations', icon: Sparkles },
        { name: 'Payments', icon: IndianRupee },
        { name: 'Builders List', icon: HardHat },
        { name: 'User List', icon: Users },
        { name: 'Tasks', icon: ClipboardList },
        { name: 'Analytics', icon: LineChart },
        { name: 'Settings', icon: Settings },
    ];

    return (
        <div className="flex h-screen bg-[#F5F6FA] font-sans text-gray-900 overflow-hidden">
            {/* SIDEBAR */}
            <aside className="w-64 bg-white border-r border-gray-100 flex flex-col hidden md:flex z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
                <div className="h-16 flex items-center px-6 border-b border-gray-100 shrink-0">
                    <div className="flex items-center gap-2.5 text-[#6F4BFF]">
                        <div className="w-8 h-8 bg-[#6F4BFF] rounded-lg flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">SquarFT</span>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5 scrollbar-hide">
                    {menuItems.map((item) => {
                        const isActive = currentView === item.name;
                        return (
                            <button
                                key={item.name}
                                onClick={() => navigateTo(item.name)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive
                                    ? 'bg-[#6F4BFF]/10 text-[#6F4BFF]'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                <item.icon className={`w-5 h-5 ${isActive ? 'text-[#6F4BFF]' : 'text-gray-400'}`} />
                                {item.name}
                            </button>
                        )
                    })}
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* TOP HEADER */}
                <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 shrink-0 z-10">
                    <div className="flex items-center gap-4">
                        {selectedItem && (
                            <button onClick={() => navigateTo(currentView)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors">
                                <ArrowRight className="w-5 h-5 rotate-180" />
                            </button>
                        )}
                        <h1 className="text-xl font-bold text-gray-800">
                            {selectedItem ? (currentView === 'Clients' ? selectedItem.name : `${currentView} Details`) : currentView}
                        </h1>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="relative hidden lg:block">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search leads, clients, projects..."
                                className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6F4BFF]/20 focus:border-[#6F4BFF] w-72 transition-all placeholder-gray-400"
                            />
                        </div>

                        <button className="relative text-gray-400 hover:text-gray-600 transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                        </button>

                        <div className="flex items-center gap-3 pl-6 border-l border-gray-100 cursor-pointer">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#6F4BFF] to-[#9D84FF] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                                A
                            </div>
                            <div className="text-sm hidden sm:block">
                                <p className="font-bold text-gray-700">Admin User</p>
                                <p className="text-xs text-gray-500 font-medium">System Admin</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* SCROLLABLE VIEW AREA */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8">
                    <div className="max-w-[1600px] mx-auto">
                        {currentView === 'Dashboard' && <DashboardView navigateTo={navigateTo} />}
                        {currentView === 'Leads Pipeline' && <LeadsView navigateTo={navigateTo} />}
                        {currentView === 'Clients' && !selectedItem && <ClientsView navigateTo={navigateTo} />}
                        {currentView === 'Clients' && selectedItem && <ClientProfileView client={selectedItem} projects={mockProjects} onBack={() => navigateTo('Clients')} />}

                        {/* Project Routing */}
                        {currentView === 'Projects Inventory' && !selectedItem && <ProjectsView navigateTo={navigateTo} />}
                        {currentView === 'Projects Inventory' && selectedItem && <ProjectDetailView project={selectedItem} onBack={() => navigateTo('Projects Inventory')} />}

                        {currentView === 'Recommendations' && <RecommendationsView />}
                        {currentView === 'Upcoming Visits' && <VisitsView />}

                        {/* NEW DEALS ROUTING (Based on Screenshot) */}
                        {currentView === 'Deal Management' && !selectedItem && <DealsPipelineView navigateTo={navigateTo} />}
                        {currentView === 'Deal Management' && selectedItem && <DealDetailView deal={selectedItem} onBack={() => navigateTo('Deal Management')} />}

                        {/* Admin Modules */}
                        {currentView === 'Recommendations' && <RecommendationsView />}
                        {currentView === 'Payments' && <PaymentsView />}
                        {currentView === 'Builders List' && <BuildersView />}

                        {/* Naya User Management System Routing */}
                        {currentView === 'User List' && !selectedItem && <UserListView navigateTo={navigateTo} />}
                        {currentView === 'User List' && selectedItem && <UserEditView user={selectedItem} onBack={() => navigateTo('User List')} />}

                        {currentView === 'Tasks' && <TasksView />}
                        {currentView === 'Analytics' && <AnalyticsView />}
                        {currentView === 'Settings' && <SettingsView />}
                    </div>
                </div>
            </main>
        </div>
    );
}

// ==========================================
// VIEWS
// ==========================================

function DashboardView({ navigateTo }) {
    const metrics = [
        {
            title: 'Active Leads Pipeline', value: '1,248', trend: '+12.5%', isUp: true, icon: Zap,
            color: 'text-[#6F4BFF]', bg: 'bg-[#6F4BFF]/10', chartColor: '#6F4BFF',
            svgPath: 'M0,20 Q10,15 20,25 T40,10 T60,20 T80,5 T100,15 L100,30 L0,30 Z'
        },
        {
            title: 'Qualified Clients', value: '342', trend: '+8.2%', isUp: true, icon: Target,
            color: 'text-blue-500', bg: 'bg-blue-50', chartColor: '#3B82F6',
            svgPath: 'M0,25 Q15,5 30,15 T60,10 T80,20 T100,5 L100,30 L0,30 Z'
        },
        {
            title: 'Ongoing Negotiations', value: '84', trend: '-2.4%', isUp: false, icon: Briefcase,
            color: 'text-amber-500', bg: 'bg-amber-50', chartColor: '#F59E0B',
            svgPath: 'M0,10 Q20,15 40,5 T70,25 T100,15 L100,30 L0,30 Z'
        },
        {
            title: 'Realized Revenue', value: '₹4.2 Cr', trend: '+24.8%', isUp: true, icon: IndianRupee,
            color: 'text-emerald-500', bg: 'bg-emerald-50', chartColor: '#10B981',
            svgPath: 'M0,25 Q20,20 30,10 T60,15 T80,5 T100,0 L100,30 L0,30 Z'
        },
    ];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* HEADER SECTION */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">System Intelligence Overview</h2>
                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Live data sync enabled
                    </p>
                </div>
                <div className="flex items-center gap-3 bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
                    {['24h', '7d', '30d', '1y'].map((range, i) => (
                        <button key={range} className={`px-4 py-1.5 text-xs font-bold rounded-md transition-colors ${i === 2 ? 'bg-[#6F4BFF] text-white shadow-sm' : 'text-gray-500 hover:bg-gray-100'}`}>
                            {range}
                        </button>
                    ))}
                </div>
            </div>

            {/* METRICS ROW WITH SPARKLINES */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {metrics.map((m, i) => (
                    <Card key={i} noPadding className="group cursor-pointer hover:border-[#6F4BFF]/40 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
                        <div className="p-5 relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-2.5 rounded-xl ${m.bg} ${m.color} shadow-sm`}>
                                    <m.icon className="w-5 h-5" />
                                </div>
                                <Badge variant={m.isUp ? 'green' : 'red'} className="flex items-center gap-1">
                                    {m.isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                    {m.trend}
                                </Badge>
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900 mb-1">{m.value}</h3>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{m.title}</p>
                        </div>
                        {/* SVG Sparkline Background */}
                        <div className="absolute bottom-0 left-0 w-full h-16 opacity-40 group-hover:opacity-100 transition-opacity duration-300">
                            <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="w-full h-full">
                                <defs>
                                    <linearGradient id={`grad-${i}`} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor={m.chartColor} stopOpacity="0.4" />
                                        <stop offset="100%" stopColor={m.chartColor} stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                                <path d={m.svgPath} fill={`url(#grad-${i})`} />
                                <path d={m.svgPath.replace('L100,30 L0,30 Z', '')} fill="none" stroke={m.chartColor} strokeWidth="2" vectorEffect="non-scaling-stroke" />
                            </svg>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* MAIN AREA CHART: REVENUE & VOLUME */}
                <Card className="lg:col-span-2 p-6 flex flex-col relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-32 bg-[#6F4BFF]/5 rounded-full blur-3xl -z-10"></div>

                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Revenue Trajectory</h3>
                            <p className="text-xs text-gray-500 font-medium">Actuals vs Projected (Last 6 Months)</p>
                        </div>
                        <div className="flex gap-4 text-xs font-bold">
                            <span className="flex items-center gap-1.5 text-gray-600"><span className="w-2.5 h-2.5 rounded-sm bg-[#6F4BFF]"></span> Revenue (Cr)</span>
                            <span className="flex items-center gap-1.5 text-gray-600"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-400"></span> Deals Volume</span>
                        </div>
                    </div>

                    <div className="flex-1 relative w-full h-64 border-l border-b border-gray-100">
                        {/* Y-Axis Guides */}
                        <div className="absolute inset-0 flex flex-col justify-between z-0">
                            {[4, 3, 2, 1, 0].map(val => (
                                <div key={val} className="w-full border-t border-gray-100/60 relative">
                                    <span className="absolute -left-6 -top-2.5 text-[10px] font-bold text-gray-400">{val}C</span>
                                </div>
                            ))}
                        </div>

                        {/* X-Axis Guides */}
                        <div className="absolute bottom-0 w-full flex justify-between px-6 translate-y-6 z-0">
                            {['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'].map(month => (
                                <span key={month} className="text-[10px] font-bold text-gray-400">{month}</span>
                            ))}
                        </div>

                        {/* Custom SVG Chart */}
                        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full absolute inset-0 z-10 p-2 overflow-visible">
                            <defs>
                                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#6F4BFF" stopOpacity="0.3" />
                                    <stop offset="100%" stopColor="#6F4BFF" stopOpacity="0.0" />
                                </linearGradient>
                            </defs>

                            {/* Revenue Area */}
                            <path d="M0,80 C20,70 40,85 60,40 C80,20 100,10 100,10 L100,100 L0,100 Z" fill="url(#areaGrad)" />
                            <path d="M0,80 C20,70 40,85 60,40 C80,20 100,10 100,10" fill="none" stroke="#6F4BFF" strokeWidth="3" vectorEffect="non-scaling-stroke" className="drop-shadow-md" />

                            {/* Data Points Revenue */}
                            <circle cx="60" cy="40" r="1.5" fill="#fff" stroke="#6F4BFF" strokeWidth="1" />
                            <circle cx="100" cy="10" r="1.5" fill="#fff" stroke="#6F4BFF" strokeWidth="1" />

                            {/* Deal Volume Line (Secondary) */}
                            <path d="M0,90 C20,80 40,90 60,60 C80,50 100,40 100,40" fill="none" stroke="#34D399" strokeWidth="2" strokeDasharray="4 2" vectorEffect="non-scaling-stroke" />
                        </svg>
                    </div>
                </Card>

                {/* LIVE ACTIVITY TICKER */}
                <Card className="p-6 h-[400px] flex flex-col relative">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-rose-500 animate-pulse" /> Live Activity Feed
                        </h3>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                        {[
                            { time: 'Just now', action: 'Payment Received', detail: '₹ 5.0L for Flat 402, Skyline', icon: IndianRupee, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                            { time: '12 mins ago', action: 'Status Changed', detail: 'Vikash S. shortlisted Ocean View', icon: Heart, color: 'text-purple-500', bg: 'bg-purple-50' },
                            { time: '45 mins ago', action: 'New Lead Auto-Assigned', detail: 'Ravi T. assigned to Swati Jain', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
                            { time: '2 hours ago', action: 'Site Visit Completed', detail: 'Neha K. at Parkside Avenues', icon: MapPin, color: 'text-amber-500', bg: 'bg-amber-50' },
                            { time: '3 hours ago', action: 'Agreement Uploaded', detail: 'Deal D003 - Green Valley', icon: FileText, color: 'text-gray-600', bg: 'bg-gray-100' },
                        ].map((feed, i) => (
                            <div key={i} className="flex gap-4 relative">
                                {/* Connecting Line */}
                                {i !== 4 && <div className="absolute left-4 top-8 w-0.5 h-8 bg-gray-100"></div>}

                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${feed.bg}`}>
                                    <feed.icon className={`w-4 h-4 ${feed.color}`} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-800">{feed.action}</p>
                                    <p className="text-xs text-gray-500 font-medium mb-1">{feed.detail}</p>
                                    <p className="text-[10px] font-bold text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" /> {feed.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* FUTURISTIC FUNNEL */}
                <Card className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">AI Predicted Pipeline Velocity</h3>
                    <div className="space-y-3">
                        {[
                            { label: 'Raw Leads', val: '1,248', width: '100%', color: 'from-gray-200 to-gray-300' },
                            { label: 'Qualified (Budget Matched)', val: '342', width: '85%', color: 'from-blue-300 to-blue-400' },
                            { label: 'Site Visited', val: '185', width: '60%', color: 'from-indigo-400 to-purple-400' },
                            { label: 'Active Negotiation', val: '84', width: '40%', color: 'from-[#6F4BFF] to-[#9D84FF]' },
                            { label: 'Closed Deals', val: '42', width: '25%', color: 'from-emerald-400 to-emerald-500' },
                        ].map((f, i) => (
                            <div key={i} className="relative">
                                <div className="flex justify-between text-xs font-bold mb-1.5 px-1">
                                    <span className="text-gray-600">{f.label}</span>
                                    <span className="text-gray-900">{f.val}</span>
                                </div>
                                <div className="w-full h-6 bg-gray-50 rounded-md border border-gray-100 p-0.5 relative overflow-hidden flex justify-center">
                                    {/* The bar fills from center for a funnel effect */}
                                    <div className={`h-full rounded-sm bg-gradient-to-r ${f.color} transition-all duration-1000 shadow-sm relative overflow-hidden`} style={{ width: f.width }}>
                                        {/* Glossy overlay effect */}
                                        <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* GEO METRICS */}
                <Card className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <Globe className="w-5 h-5 text-blue-500" /> Geographic Performance
                        </h3>
                        <Button variant="ghost" className="text-xs">View Map</Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { city: 'Mumbai MMR', leads: '450', closed: 24, progress: 80, color: 'bg-[#6F4BFF]' },
                            { city: 'Bangalore', leads: '320', closed: 18, progress: 65, color: 'bg-blue-500' },
                            { city: 'Delhi NCR', leads: '210', closed: 8, progress: 40, color: 'bg-amber-500' },
                            { city: 'Chennai', leads: '140', closed: 12, progress: 55, color: 'bg-emerald-500' },
                        ].map((c, i) => (
                            <div key={i} className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="font-bold text-gray-800 text-sm">{c.city}</h4>
                                    <span className="text-[10px] font-bold text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-200">{c.closed} Deals</span>
                                </div>
                                <div className="flex items-baseline gap-1.5 mb-2">
                                    <span className="text-xl font-bold text-gray-900">{c.leads}</span>
                                    <span className="text-xs font-bold text-gray-400 uppercase">Active Leads</span>
                                </div>
                                <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                    <div className={`h-full ${c.color} rounded-full`} style={{ width: `${c.progress}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
}

function LeadsView({ navigateTo }) {
    return (
        <Card noPadding>
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Raw Leads</h2>
                    <p className="text-sm text-gray-500 mt-1">Unqualified inquiries waiting to be mapped to clients.</p>
                </div>
                <div className="flex gap-3">
                    <Button icon={Filter} variant="secondary">Filter</Button>
                    <Button icon={Plus}>Add Lead</Button>
                </div>
            </div>
            <Table
                headers={['Lead Name', 'Contact', 'Budget', 'Requirement', 'Status', 'Assigned', 'Action']}
                data={mockLeads}
                renderRow={(row, i) => (
                    <tr key={i} className="hover:bg-gray-50/80 transition-colors group">
                        <td className="px-6 py-4">
                            <div className="font-bold text-gray-900">{row.name}</div>
                            <div className="text-xs text-gray-500">{row.date}</div>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-600">{row.phone}</td>
                        <td className="px-6 py-4 text-sm font-bold text-gray-700">{row.budget}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                            {row.req}<br />
                            <span className="text-xs text-gray-400">{row.location}</span>
                        </td>
                        <td className="px-6 py-4">
                            <Badge variant={row.status === 'New' ? 'purple' : 'gray'}>{row.status}</Badge>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">{row.officer}</td>
                        <td className="px-6 py-4">
                            <Button variant="secondary" className="text-xs py-1.5 px-3 hover:border-[#6F4BFF] hover:text-[#6F4BFF]" onClick={() => navigateTo('Clients')}>
                                Qualify Client
                            </Button>
                        </td>
                    </tr>
                )}
            />
        </Card>
    );
}

function ClientsView({ navigateTo }) {
    return (
        <Card noPadding>
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Active Clients</h2>
                    <p className="text-sm text-gray-500 mt-1">Qualified buyers actively evaluating multiple projects.</p>
                </div>
                <Button icon={Plus}>New Client</Button>
            </div>
            <Table
                headers={['Client Info', 'Requirement', 'Pipeline Status', 'Assigned To', '']}
                data={mockClients}
                renderRow={(row, i) => (
                    <tr
                        key={i}
                        onClick={() => navigateTo('Clients', row)}
                        className="hover:bg-[#6F4BFF]/5 transition-colors cursor-pointer group"
                    >
                        <td className="px-6 py-4">
                            <div className="font-bold text-gray-900 group-hover:text-[#6F4BFF] transition-colors">{row.name}</div>
                            <div className="text-xs text-gray-500">{row.phone}</div>
                        </td>
                        <td className="px-6 py-4">
                            <div className="text-sm font-bold text-gray-700">{row.budget}</div>
                            <div className="text-xs text-gray-500">{row.req.type} • {row.req.loc.join(', ')}</div>
                        </td>
                        <td className="px-6 py-4">
                            <div className="flex gap-1.5">
                                {row.propertyPipeline.slice(0, 3).map((p, idx) => {
                                    let v = 'gray';
                                    if (p.status === 'Shortlisted') v = 'purple';
                                    if (p.status === 'Visited') v = 'blue';
                                    if (p.status === 'Negotiating') v = 'amber';
                                    return <div key={idx} className={`w-3 h-3 rounded-full bg-${v}-400 shadow-sm`} title={`${p.projectId}: ${p.status}`}></div>
                                })}
                            </div>
                            <span className="text-xs text-gray-500 mt-1 block">{row.propertyPipeline.length} properties in pipeline</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">{row.officer}</td>
                        <td className="px-6 py-4 text-right">
                            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#6F4BFF]" />
                        </td>
                    </tr>
                )}
            />
        </Card>
    );
}

function ClientProfileView({ client, projects, onBack }) {
    const getProject = (id) => projects.find(p => p.id === id);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">

            {/* CLIENT HEADER */}
            <Card noPadding className="bg-gradient-to-r from-white to-[#6F4BFF]/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                    <button onClick={onBack} className="p-2 hover:bg-white/60 rounded-lg text-gray-500 transition-colors backdrop-blur-sm">
                        <ArrowRight className="w-5 h-5 rotate-180" />
                    </button>
                </div>
                <div className="p-8 flex items-start justify-between">
                    <div className="flex gap-5">
                        <div className="w-16 h-16 rounded-2xl bg-[#6F4BFF] text-white flex items-center justify-center text-2xl font-bold shadow-lg shadow-[#6F4BFF]/20">
                            {client.name.charAt(0)}
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h2 className="text-2xl font-bold text-gray-900">{client.name}</h2>
                                <Badge variant={client.status === 'Negotiating' ? 'yellow' : 'green'}>{client.status}</Badge>
                            </div>
                            <p className="text-gray-500 font-medium">{client.phone} • Added on 10 Apr 2026</p>
                            <div className="flex gap-2 mt-3">
                                <Badge variant="gray">{client.req.type}</Badge>
                                {client.req.bhk.map(b => <Badge key={b} variant="gray">{b}</Badge>)}
                                <Badge variant="purple" className="flex items-center gap-1">
                                    <Sparkles className="w-3 h-3" /> Auto-Matching Enabled
                                </Badge>
                            </div>
                        </div>
                    </div>
                    <div className="text-right mt-6 mr-10">
                        <p className="text-sm text-gray-500 font-semibold mb-1">Approved Budget</p>
                        <p className="text-3xl font-bold text-emerald-600">{client.budget}</p>
                        <p className="text-sm text-gray-500 mt-2">Assigned to: <span className="font-bold text-gray-800">{client.officer}</span></p>
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                {/* LEFT COLUMN: Requirements & Recommendations */}
                <div className="space-y-6 xl:col-span-1">
                    {/* Requirement Profile */}
                    <Card className="p-6">
                        <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <Search className="w-5 h-5 text-[#6F4BFF]" /> Requirement Profile
                            </h3>
                            <Button variant="ghost" className="text-xs px-2 py-1 h-auto text-gray-400">Edit</Button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Preferred Locations</p>
                                <p className="font-semibold text-gray-800">{client.req.loc.join(' • ')}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Property Type</p>
                                <p className="font-semibold text-gray-800">{client.req.type} ({client.req.bhk.join(', ')})</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Timeline</p>
                                <p className="font-semibold text-gray-800">{client.req.timeline}</p>
                            </div>
                        </div>
                    </Card>

                    {/* AI Recommended Projects */}
                    <Card className="p-6 bg-[#6F4BFF]/[0.02] border-[#6F4BFF]/10">
                        <div className="flex justify-between items-center mb-4 pb-3 border-b border-[#6F4BFF]/10">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-[#6F4BFF]" /> Recommended Matches
                            </h3>
                        </div>
                        <div className="space-y-3">
                            {projects.filter(p => !client.propertyPipeline.find(cp => cp.projectId === p.id)).slice(0, 2).map(project => (
                                <div key={project.id} className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm hover:shadow-md transition-all">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-gray-900">{project.name}</h4>
                                        <Badge variant="green">98% Match</Badge>
                                    </div>
                                    <p className="text-xs text-gray-500 mb-3">{project.location}</p>
                                    <p className="text-sm font-bold text-gray-800 mb-3">{project.priceRange}</p>
                                    <Button variant="secondary" className="w-full text-xs py-1.5" icon={Plus}>
                                        Add to Shown Projects
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* RIGHT COLUMN: The Multi-Property Pipeline */}
                <div className="xl:col-span-2">
                    <Card noPadding className="h-full flex flex-col">
                        <div className="p-6 border-b border-gray-100 bg-white flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                    <Navigation className="w-5 h-5 text-[#6F4BFF]" /> Client Property Pipeline
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">Track all projects shown and their current status.</p>
                            </div>
                            <Button icon={Plus}>Add Project</Button>
                        </div>

                        <div className="flex-1 p-6 bg-gray-50/50">
                            <div className="space-y-4">
                                {client.propertyPipeline.map((pipelineItem, i) => {
                                    const project = getProject(pipelineItem.projectId);
                                    if (!project) return null;

                                    let borderClass = 'border-gray-200';
                                    let statusBg = 'bg-gray-100 text-gray-600';
                                    let StatusIcon = Eye;

                                    switch (pipelineItem.status) {
                                        case 'Shortlisted':
                                            borderClass = 'border-purple-200 shadow-sm ring-1 ring-purple-100';
                                            statusBg = 'bg-purple-100 text-[#6F4BFF]';
                                            StatusIcon = Heart;
                                            break;
                                        case 'Visited':
                                            borderClass = 'border-blue-200 shadow-sm ring-1 ring-blue-100';
                                            statusBg = 'bg-blue-100 text-blue-700';
                                            StatusIcon = MapPin;
                                            break;
                                        case 'Negotiating':
                                            borderClass = 'border-amber-200 shadow-md ring-1 ring-amber-100';
                                            statusBg = 'bg-amber-100 text-amber-700';
                                            StatusIcon = TrendingUp;
                                            break;
                                        case 'Not Interested':
                                            borderClass = 'border-gray-200 opacity-60';
                                            statusBg = 'bg-gray-100 text-gray-500';
                                            StatusIcon = ThumbsDown;
                                            break;
                                        default:
                                            break;
                                    }

                                    return (
                                        <div key={i} className={`bg-white rounded-xl border p-5 transition-all ${borderClass}`}>
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex gap-4">
                                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${statusBg}`}>
                                                        <StatusIcon className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h4 className="text-lg font-bold text-gray-900">{project.name}</h4>
                                                            <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider ${statusBg}`}>
                                                                {pipelineItem.status}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-500">{project.location} • {project.builder}</p>
                                                    </div>
                                                </div>

                                                <select className="text-sm font-medium bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 focus:ring-[#6F4BFF] outline-none cursor-pointer">
                                                    {['Shown', 'Shortlisted', 'Visited', 'Negotiating', 'Final Deal', 'Not Interested'].map(opt => (
                                                        <option key={opt} selected={pipelineItem.status === opt}>{opt}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                                                <div>
                                                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">Target Units</p>
                                                    <p className="font-semibold text-gray-800 text-sm">{pipelineItem.units.length ? pipelineItem.units.join(', ') : 'Not specified'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">Project Price</p>
                                                    <p className="font-semibold text-gray-800 text-sm">{project.priceRange}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">Latest Update</p>
                                                    <p className="font-semibold text-gray-800 text-sm">{pipelineItem.notes}</p>
                                                </div>
                                            </div>

                                            <div className="mt-4 flex gap-3 justify-end border-t border-gray-100 pt-4">
                                                {pipelineItem.status !== 'Not Interested' && (
                                                    <Button variant="ghost" className="text-xs py-1.5 px-3">Add Note</Button>
                                                )}
                                                {pipelineItem.status === 'Shown' && (
                                                    <>
                                                        <Button variant="secondary" className="text-xs py-1.5 px-3">Log Visit</Button>
                                                        <Button variant="primary" className="text-xs py-1.5 px-3 bg-purple-100 text-[#6F4BFF] hover:bg-purple-200 border-none shadow-none">Mark Shortlisted</Button>
                                                    </>
                                                )}
                                                {pipelineItem.status === 'Shortlisted' && (
                                                    <Button variant="primary" icon={Calendar} className="text-xs py-1.5 px-3">Schedule Visit</Button>
                                                )}
                                                {(pipelineItem.status === 'Visited' || pipelineItem.status === 'Negotiating') && (
                                                    <Button variant="success" icon={CheckCircle2} className="text-xs py-1.5 px-3 shadow-sm">Convert to Deal</Button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function ProjectsView({ navigateTo }) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Project Inventory</h2>
                    <p className="text-gray-500 mt-1">Manage builders, projects, and unit configurations.</p>
                </div>
                <Button icon={Plus}>Add Project</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockProjects.map((p, i) => (
                    <Card key={i} noPadding className="group cursor-pointer hover:border-[#6F4BFF]/40 hover:shadow-lg transition-all flex flex-col" >
                        {/* Using a rich gradient instead of image placeholder */}
                        <div className="h-36 relative overflow-hidden bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-50" onClick={() => navigateTo('Projects Inventory', p)}>
                            <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px]"></div>
                            <Building2 className="absolute -bottom-6 -right-6 w-32 h-32 text-[#6F4BFF]/10 rotate-12" />
                            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-bold text-gray-800 shadow-sm">
                                {p.builder}
                            </div>
                            <div className="absolute top-3 right-3">
                                {getStatusBadge(p.status)}
                            </div>
                            <div className="absolute bottom-3 right-3 bg-emerald-500 text-white px-2.5 py-1 rounded-md text-xs font-bold shadow-sm">
                                {p.available} Units Left
                            </div>
                        </div>
                        <div className="p-5 flex-1 flex flex-col">
                            <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-[#6F4BFF] transition-colors" onClick={() => navigateTo('Projects Inventory', p)}>{p.name}</h3>
                            <p className="text-sm text-gray-500 flex items-center gap-1.5 mb-4">
                                <MapPin className="w-3.5 h-3.5" /> {p.location}
                            </p>

                            <div className="mt-auto pt-4 border-t border-gray-100 flex items-end justify-between">
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">Pricing</p>
                                    <p className="font-bold text-gray-800">{p.priceRange}</p>
                                </div>
                                <div className="flex gap-1.5">
                                    {p.configs.map(c => <span key={c} className="text-[10px] font-bold bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md">{c}</span>)}
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    )
}

function ProjectDetailView({ project, onBack }) {
    const [activeTab, setActiveTab] = useState('inventory');
    const [expandedConfigIndex, setExpandedConfigIndex] = useState(null);
    const [editingUnit, setEditingUnit] = useState(null);

    // Localized state to manage grid updates dynamically
    const [localProjectData, setLocalProjectData] = useState(null);

    // Initialize the stateful project data & units list once per project loaded
    useEffect(() => {
        const cloned = JSON.parse(JSON.stringify(project));
        cloned.inventory.forEach(config => {
            const units = [];
            const displayUnits = Math.min(config.totalUnits, 24);
            for (let i = 1; i <= displayUnits; i++) {
                const floor = Math.ceil(i / 4);
                const num = `${floor}${i % 4 === 0 ? '04' : `0${i % 4}`}`;
                const isAvailable = i <= Math.ceil((config.availableUnits / config.totalUnits) * displayUnits);
                units.push({
                    id: `U${num}`,
                    number: num,
                    floor: floor,
                    status: isAvailable ? 'Available' : 'Sold',
                    facing: i % 2 === 0 ? 'East Facing' : 'West Facing',
                    price: config.basePrice,
                    notes: '',
                    paymentPlan: 'Standard (Construction Linked)'
                });
            }
            config.unitsList = units;
        });
        setLocalProjectData(cloned);
        setExpandedConfigIndex(null);
        setEditingUnit(null);
    }, [project]);

    if (!localProjectData) return null;

    const handleUnitClick = (unit) => {
        setEditingUnit({ ...unit });
    };

    const handleUpdateUnit = () => {
        if (!editingUnit || expandedConfigIndex === null) return;

        // Update local state instantly so UI turns colors properly
        const updatedProject = { ...localProjectData };
        const config = updatedProject.inventory[expandedConfigIndex];
        const unitIndex = config.unitsList.findIndex(u => u.id === editingUnit.id);

        if (unitIndex !== -1) {
            config.unitsList[unitIndex] = editingUnit;
            setLocalProjectData(updatedProject);
        }
        setEditingUnit(null); // Close the edit pane
    };

    const handleBlockUnit = () => {
        if (!editingUnit || expandedConfigIndex === null) return;

        const blockedUnit = { ...editingUnit, status: 'Blocked' };
        const updatedProject = { ...localProjectData };
        const config = updatedProject.inventory[expandedConfigIndex];
        const unitIndex = config.unitsList.findIndex(u => u.id === blockedUnit.id);

        if (unitIndex !== -1) {
            config.unitsList[unitIndex] = blockedUnit;
            setLocalProjectData(updatedProject);
        }
        setEditingUnit(null); // Close the edit pane
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 hover:bg-white rounded-lg text-gray-500 transition-colors shadow-sm bg-white/50">
                        <ArrowRight className="w-5 h-5 rotate-180" />
                    </button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl font-bold text-gray-900">{localProjectData.name}</h2>
                            {getStatusBadge(localProjectData.status)}
                        </div>
                        <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5" /> {localProjectData.location} • By <span className="font-semibold text-gray-700">{localProjectData.builder}</span>
                        </p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="secondary" icon={FileText}>Brochure</Button>
                    <Button variant="primary" icon={Plus}>Log Visit</Button>
                </div>
            </div>

            {/* TABS FOR BETTER ORGANIZATION */}
            <div className="flex gap-2 border-b border-gray-200">
                {[
                    { id: 'inventory', label: 'Inventory & Pricing', icon: Layers },
                    { id: 'admin', label: 'Admin & Operations', icon: Settings },
                    { id: 'documents', label: 'Documents', icon: FileText },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => { setActiveTab(tab.id); setExpandedConfigIndex(null); }}
                        className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-colors border-b-2 ${activeTab === tab.id ? 'border-[#6F4BFF] text-[#6F4BFF]' : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'}`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* --- TAB CONTENT: INVENTORY & PRICING --- */}
            {activeTab === 'inventory' && (
                <div className="space-y-6 animate-in fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="p-6 bg-gradient-to-br from-indigo-50 to-white border-indigo-100">
                            <p className="text-sm font-bold text-gray-500 mb-1">Total Available Inventory</p>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-4xl font-bold text-[#6F4BFF]">{localProjectData.available}</h3>
                                <span className="text-gray-500 font-medium">/ {localProjectData.units} Units</span>
                            </div>
                            <div className="mt-4 w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-[#6F4BFF]" style={{ width: `${((localProjectData.units - localProjectData.available) / localProjectData.units) * 100}%` }}></div>
                            </div>
                            <p className="text-xs text-gray-500 mt-2 font-medium">{Math.round(((localProjectData.units - localProjectData.available) / localProjectData.units) * 100)}% Sold Out</p>
                        </Card>

                        <Card className="p-6">
                            <p className="text-sm font-bold text-gray-500 mb-1">Base Price Range</p>
                            <h3 className="text-2xl font-bold text-gray-900">{localProjectData.priceRange}</h3>
                            <p className="text-xs text-emerald-600 font-medium mt-2 bg-emerald-50 inline-block px-2 py-1 rounded">Prices subject to floor rise & PLC</p>
                        </Card>

                        <Card className="p-6">
                            <p className="text-sm font-bold text-gray-500 mb-1">Project Status</p>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Under Construction</h3>
                            <p className="text-sm text-gray-600 flex items-center gap-2">
                                <Calendar className="w-4 h-4" /> Possession: Dec 2027
                            </p>
                        </Card>
                    </div>

                    <Card noPadding>
                        <div className="p-6 border-b border-gray-100 bg-white">
                            <h3 className="text-lg font-bold text-gray-800">Unit Configurations & Availability Workspace</h3>
                            <p className="text-sm text-gray-500 mt-1">Click on a configuration to view the floor plan, track individual unit status, and update specific prices.</p>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/80 border-b border-gray-100">
                                        <th className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Configuration Type</th>
                                        <th className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Carpet Area</th>
                                        <th className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Base Price</th>
                                        <th className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Inventory Status</th>
                                        <th className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {localProjectData.inventory.map((row, i) => {
                                        // Calculate real-time stats based on stateful units
                                        const availableUnitsCount = row.unitsList.filter(u => u.status === 'Available').length;
                                        const soldUnitsCount = row.unitsList.filter(u => u.status === 'Sold').length;

                                        const percentAvailable = (availableUnitsCount / row.unitsList.length) * 100;
                                        let statusColor = percentAvailable > 50 ? 'bg-emerald-500' : percentAvailable > 20 ? 'bg-amber-500' : 'bg-rose-500';
                                        const isExpanded = expandedConfigIndex === i;

                                        return (
                                            <React.Fragment key={i}>
                                                <tr className={`hover:bg-gray-50 transition-colors ${isExpanded ? 'bg-purple-50/30' : ''}`}>
                                                    <td className="px-6 py-4">
                                                        <p className="font-bold text-gray-900 flex items-center gap-2">
                                                            {row.type}
                                                            {isExpanded && <span className="w-2 h-2 rounded-full bg-[#6F4BFF]"></span>}
                                                        </p>
                                                    </td>
                                                    <td className="px-6 py-4 font-medium text-gray-600">{row.size}</td>
                                                    <td className="px-6 py-4 font-bold text-gray-800 text-lg">{row.basePrice}</td>
                                                    <td className="px-6 py-4 w-64">
                                                        <div className="flex justify-between text-xs font-bold mb-1">
                                                            <span className={percentAvailable <= 20 ? 'text-rose-600' : 'text-gray-600'}>
                                                                {availableUnitsCount} Available
                                                            </span>
                                                            <span className="text-gray-400">Total: {row.unitsList.length}</span>
                                                        </div>
                                                        <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                                                            <div className={`h-full ${statusColor} rounded-full`} style={{ width: `${percentAvailable}%` }}></div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <Button
                                                            variant={isExpanded ? 'primary' : 'secondary'}
                                                            className="text-xs py-1.5 shadow-sm"
                                                            icon={isExpanded ? X : Maximize}
                                                            onClick={() => {
                                                                setExpandedConfigIndex(isExpanded ? null : i);
                                                                setEditingUnit(null);
                                                            }}
                                                        >
                                                            {isExpanded ? 'Close Plan' : 'View Floor Plan'}
                                                        </Button>
                                                    </td>
                                                </tr>

                                                {/* --- EXPANDED WORKSPACE --- */}
                                                {isExpanded && (
                                                    <tr className="bg-gray-50/50 border-b-2 border-gray-200 shadow-inner">
                                                        <td colSpan="5" className="p-0">
                                                            <div className="p-6 grid grid-cols-1 xl:grid-cols-3 gap-6 animate-in slide-in-from-top-2 duration-200">

                                                                {/* Left Side: Floor Plan Visual */}
                                                                <div className="col-span-1 border border-gray-200 rounded-xl bg-white p-5 shadow-sm">
                                                                    <div className="flex items-center justify-between mb-4">
                                                                        <h4 className="font-bold text-gray-800">Master Floor Plan</h4>
                                                                        <Badge variant="purple">{row.type}</Badge>
                                                                    </div>

                                                                    {/* Blueprint Placeholder */}
                                                                    <div className="w-full aspect-[4/3] bg-blue-50 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-blue-200 relative overflow-hidden group cursor-pointer">
                                                                        <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                                        <Layers className="w-10 h-10 text-blue-300 mb-2" />
                                                                        <span className="text-sm font-bold text-blue-600">Click to Enlarge Blueprint</span>
                                                                        <div className="mt-4 flex gap-2">
                                                                            <span className="px-2 py-1 bg-white border border-blue-100 rounded text-[10px] font-bold text-gray-500">Balcony: Yes</span>
                                                                            <span className="px-2 py-1 bg-white border border-blue-100 rounded text-[10px] font-bold text-gray-500">Vastu Compliant</span>
                                                                        </div>
                                                                    </div>

                                                                    <div className="mt-5 space-y-3">
                                                                        <div className="flex justify-between border-b border-gray-100 pb-2">
                                                                            <span className="text-xs font-bold text-gray-400">CARPET AREA</span>
                                                                            <span className="text-sm font-bold text-gray-800">{row.size}</span>
                                                                        </div>
                                                                        <div className="flex justify-between border-b border-gray-100 pb-2">
                                                                            <span className="text-xs font-bold text-gray-400">BASE PRICE</span>
                                                                            <span className="text-sm font-bold text-emerald-600">{row.basePrice}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {/* Right Side: Units Grid & Edit Panel */}
                                                                <div className="col-span-1 xl:col-span-2 border border-gray-200 rounded-xl bg-white p-5 shadow-sm flex flex-col">
                                                                    <div className="flex flex-wrap gap-4 items-center justify-between mb-6 pb-4 border-b border-gray-100">
                                                                        <div>
                                                                            <h4 className="font-bold text-gray-800 text-lg">Unit Selection Matrix</h4>
                                                                            <p className="text-xs text-gray-500 mt-0.5">Click any unit to edit pricing & status</p>
                                                                        </div>
                                                                        <div className="flex flex-wrap gap-3 text-xs font-bold">
                                                                            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-100">
                                                                                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div> Available ({availableUnitsCount})
                                                                            </span>
                                                                            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-rose-50 text-rose-700 rounded-md border border-rose-100">
                                                                                <div className="w-2 h-2 bg-rose-500 rounded-full"></div> Sold ({soldUnitsCount})
                                                                            </span>
                                                                            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-700 rounded-md border border-amber-100">
                                                                                <div className="w-2 h-2 bg-amber-500 rounded-full"></div> On Hold
                                                                            </span>
                                                                            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md border border-gray-200">
                                                                                <div className="w-2 h-2 bg-gray-400 rounded-full"></div> Blocked
                                                                            </span>
                                                                        </div>
                                                                    </div>

                                                                    <div className="flex-1 flex gap-6">
                                                                        {/* Grid Matrix mapped directly from local state */}
                                                                        <div className={`grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3 content-start transition-all ${editingUnit ? 'w-1/2' : 'w-full'}`}>
                                                                            {row.unitsList.map((unit) => {
                                                                                const isSelected = editingUnit?.id === unit.id;

                                                                                // Dynamic Colors based on State
                                                                                let bgClass = '';
                                                                                if (unit.status === 'Available') bgClass = 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300';
                                                                                else if (unit.status === 'Sold') bgClass = 'bg-rose-50 text-rose-700 border-rose-200 opacity-80 hover:opacity-100';
                                                                                else if (unit.status === 'Hold') bgClass = 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 hover:border-amber-300';
                                                                                else if (unit.status === 'Blocked') bgClass = 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200';

                                                                                return (
                                                                                    <button
                                                                                        key={unit.id}
                                                                                        onClick={() => handleUnitClick(unit)}
                                                                                        className={`
                                              relative p-2 rounded-lg text-sm font-bold border-2 transition-all flex flex-col items-center justify-center min-h-[60px]
                                              ${isSelected ? 'ring-4 ring-[#6F4BFF]/20 border-[#6F4BFF] scale-105 z-10 shadow-md' : ''}
                                              ${bgClass}
                                            `}
                                                                                    >
                                                                                        {unit.number}
                                                                                        <span className="text-[9px] font-medium uppercase mt-0.5 opacity-70">FL {unit.floor}</span>
                                                                                    </button>
                                                                                )
                                                                            })}
                                                                        </div>

                                                                        {/* Edit Panel (Slides in when a unit is clicked) */}
                                                                        {editingUnit && (
                                                                            <div className="w-1/2 bg-gray-50 border border-gray-200 rounded-xl p-5 animate-in slide-in-from-right-4 duration-200 flex flex-col max-h-[550px]">
                                                                                <div className="flex items-center justify-between mb-4 shrink-0">
                                                                                    <h4 className="font-bold text-gray-900 flex items-center gap-2">
                                                                                        <Building2 className="w-4 h-4 text-[#6F4BFF]" /> Unit #{editingUnit.number} Hub
                                                                                    </h4>
                                                                                    <button onClick={() => setEditingUnit(null)} className="text-gray-400 hover:text-gray-600 bg-white rounded-md p-1 shadow-sm border border-gray-200">
                                                                                        <X className="w-4 h-4" />
                                                                                    </button>
                                                                                </div>

                                                                                <div className="overflow-y-auto pr-2 space-y-6 flex-1 pb-4">
                                                                                    {/* Section 1: Basic Configuration */}
                                                                                    <div className="space-y-4">
                                                                                        <div className="grid grid-cols-2 gap-3">
                                                                                            <div>
                                                                                                <label className="text-xs font-bold text-gray-500 uppercase">Availability Status</label>
                                                                                                <select
                                                                                                    value={editingUnit.status}
                                                                                                    onChange={(e) => setEditingUnit({ ...editingUnit, status: e.target.value })}
                                                                                                    className="w-full mt-1 text-sm border border-gray-300 rounded-lg p-2 focus:ring-[#6F4BFF] outline-none font-medium bg-white"
                                                                                                >
                                                                                                    <option value="Available">Available</option>
                                                                                                    <option value="Sold">Sold Out</option>
                                                                                                    <option value="Hold">On Hold / Reserved</option>
                                                                                                    <option value="Blocked">Blocked by Management</option>
                                                                                                </select>
                                                                                            </div>
                                                                                            <div>
                                                                                                <label className="text-xs font-bold text-gray-500 uppercase">Payment Plan</label>
                                                                                                <select
                                                                                                    value={editingUnit.paymentPlan}
                                                                                                    onChange={(e) => setEditingUnit({ ...editingUnit, paymentPlan: e.target.value })}
                                                                                                    className="w-full mt-1 text-sm border border-gray-300 rounded-lg p-2 focus:ring-[#6F4BFF] outline-none font-medium bg-white"
                                                                                                >
                                                                                                    <option value="Standard">Standard (Construction Linked)</option>
                                                                                                    <option value="Down Payment">Down Payment (10% Discount)</option>
                                                                                                    <option value="Subvention">Subvention (10:80:10)</option>
                                                                                                </select>
                                                                                            </div>
                                                                                        </div>

                                                                                        <div className="grid grid-cols-2 gap-3">
                                                                                            <div>
                                                                                                <label className="text-xs font-bold text-gray-500 uppercase">Unit Price</label>
                                                                                                <div className="relative mt-1">
                                                                                                    <IndianRupee className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                                                                                    <input
                                                                                                        type="text"
                                                                                                        value={editingUnit.price}
                                                                                                        onChange={(e) => setEditingUnit({ ...editingUnit, price: e.target.value })}
                                                                                                        className="w-full text-sm font-bold border border-gray-300 rounded-lg py-2 pl-7 pr-2 focus:ring-[#6F4BFF] outline-none"
                                                                                                    />
                                                                                                </div>
                                                                                            </div>
                                                                                            <div>
                                                                                                <label className="text-xs font-bold text-gray-500 uppercase">Facing & Premium</label>
                                                                                                <input
                                                                                                    type="text"
                                                                                                    value={editingUnit.facing}
                                                                                                    onChange={(e) => setEditingUnit({ ...editingUnit, facing: e.target.value })}
                                                                                                    className="w-full mt-1 text-sm border border-gray-300 rounded-lg p-2 focus:ring-[#6F4BFF] outline-none bg-white font-medium"
                                                                                                />
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>

                                                                                    {/* Section 2: Pipeline Activity & Interest */}
                                                                                    <div className="border-t border-gray-200 pt-5">
                                                                                        <h5 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                                                                                            <Users className="w-4 h-4 text-purple-500" /> Pipeline & Lead Activity
                                                                                        </h5>

                                                                                        {editingUnit.status === 'Sold' ? (
                                                                                            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 shadow-sm">
                                                                                                <div className="flex items-center gap-2 mb-2">
                                                                                                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                                                                                    <p className="text-xs text-emerald-800 font-bold uppercase tracking-wider">Deal Successfully Closed</p>
                                                                                                </div>
                                                                                                <div className="flex justify-between items-center text-sm mb-1">
                                                                                                    <span className="font-semibold text-gray-800">Ankit Sharma</span>
                                                                                                    <span className="font-bold text-emerald-700">₹ {editingUnit.price}</span>
                                                                                                </div>
                                                                                                <p className="text-[11px] text-gray-500 font-medium flex justify-between mt-1">
                                                                                                    <span>Channel Partner: Direct Walk-in</span>
                                                                                                    <button className="text-emerald-700 hover:underline">View Deal Profile</button>
                                                                                                </p>
                                                                                            </div>
                                                                                        ) : editingUnit.number.includes('4') || editingUnit.number.includes('8') ? (
                                                                                            // Mocking some interest based on unit number for visual demo
                                                                                            <div className="space-y-2.5">
                                                                                                <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:border-[#6F4BFF]/30 transition-colors">
                                                                                                    <div className="flex justify-between mb-1.5 items-center">
                                                                                                        <span className="text-sm font-bold text-gray-800 flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-gray-400" /> Vikash Singh</span>
                                                                                                        <Badge variant="blue" className="text-[10px]">Site Visited</Badge>
                                                                                                    </div>
                                                                                                    <p className="text-xs text-gray-500 font-medium">Visited on 10 Apr. Showing high intent for this floor.</p>
                                                                                                </div>
                                                                                                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 shadow-sm ring-1 ring-amber-100/50">
                                                                                                    <div className="flex justify-between mb-1.5 items-center">
                                                                                                        <span className="text-sm font-bold text-gray-800">Rahul Gupta</span>
                                                                                                        <Badge variant="yellow" className="text-[10px]">Negotiating</Badge>
                                                                                                    </div>
                                                                                                    <p className="text-xs text-gray-600 font-medium flex justify-between items-center mt-1">
                                                                                                        <span>Current Offer: ₹ 1.15 Cr</span>
                                                                                                        <button className="text-[#6F4BFF] hover:underline font-bold">Review Lead</button>
                                                                                                    </p>
                                                                                                </div>
                                                                                            </div>
                                                                                        ) : (
                                                                                            <div className="text-center py-5 bg-gray-100/50 rounded-lg border border-dashed border-gray-300">
                                                                                                <p className="text-xs text-gray-500 font-medium">No active leads mapped to this unit currently.</p>
                                                                                            </div>
                                                                                        )}
                                                                                    </div>

                                                                                    {/* Section 3: Upcoming Site Visits */}
                                                                                    {editingUnit.status !== 'Sold' && (
                                                                                        <div className="border-t border-gray-200 pt-5">
                                                                                            <h5 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                                                                                                <Calendar className="w-4 h-4 text-blue-500" /> Scheduled Site Visits
                                                                                            </h5>
                                                                                            {editingUnit.number.includes('1') ? (
                                                                                                <div className="flex items-center gap-3 bg-white p-2.5 border border-gray-200 rounded-lg shadow-sm">
                                                                                                    <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100">
                                                                                                        <Calendar className="w-4 h-4 text-blue-600" />
                                                                                                    </div>
                                                                                                    <div className="flex-1">
                                                                                                        <p className="text-sm font-bold text-gray-800 flex justify-between">
                                                                                                            Priya Desai
                                                                                                            <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded font-bold">Upcoming</span>
                                                                                                        </p>
                                                                                                        <p className="text-xs text-gray-500 font-medium mt-0.5">Tomorrow, 04:00 PM • Assigned to: Neha K.</p>
                                                                                                    </div>
                                                                                                </div>
                                                                                            ) : (
                                                                                                <p className="text-xs text-gray-500 font-medium italic">No upcoming visits scheduled for this unit.</p>
                                                                                            )}
                                                                                        </div>
                                                                                    )}

                                                                                    {/* Section 4: Operational Notes */}
                                                                                    <div className="border-t border-gray-200 pt-5">
                                                                                        <label className="text-xs font-bold text-gray-500 uppercase">Operational Notes & Approvals</label>
                                                                                        <textarea
                                                                                            rows="2"
                                                                                            value={editingUnit.notes}
                                                                                            onChange={(e) => setEditingUnit({ ...editingUnit, notes: e.target.value })}
                                                                                            placeholder="e.g. Premium added for park facing view. Awaiting manager approval on discount..."
                                                                                            className="w-full mt-1.5 text-sm border border-gray-300 rounded-lg p-2.5 focus:ring-[#6F4BFF] outline-none bg-white font-medium text-gray-700"
                                                                                        ></textarea>
                                                                                    </div>
                                                                                </div>

                                                                                {/* Action Handlers bound to UI triggers */}
                                                                                <div className="pt-4 mt-2 border-t border-gray-200 shrink-0 flex gap-3">
                                                                                    <Button className="flex-1" icon={Save} onClick={handleUpdateUnit}>Update Unit</Button>
                                                                                    {editingUnit.status !== 'Sold' && editingUnit.status !== 'Blocked' && (
                                                                                        <Button variant="secondary" className="flex-1" icon={UserPlus} onClick={handleBlockUnit}>Block Unit</Button>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            )}

            {/* --- TAB CONTENT: ADMIN & OPERATIONS --- */}
            {activeTab === 'admin' && (
                <div className="space-y-6 animate-in fade-in">
                    <Card className="p-6">
                        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-6">Onboarding & Approval Progress</h3>
                        <div className="flex items-center justify-between relative">
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-100 -z-10"></div>
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#6F4BFF] transition-all -z-10" style={{ width: `${localProjectData.progress}%` }}></div>

                            {['Basic Info', 'Documents', 'Verification', 'Approval'].map((step, i) => {
                                const isCompleted = localProjectData.progress >= (i + 1) * 25;
                                const isCurrent = localProjectData.progress >= i * 25 && localProjectData.progress < (i + 1) * 25;
                                return (
                                    <div key={i} className="flex flex-col items-center gap-2 bg-white px-2">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-colors ${isCompleted ? 'bg-[#6F4BFF] border-[#6F4BFF] text-white' : isCurrent ? 'border-[#6F4BFF] text-[#6F4BFF] bg-white' : 'border-gray-200 text-gray-400 bg-white'}`}>
                                            {isCompleted ? <Check className="w-4 h-4" /> : i + 1}
                                        </div>
                                        <span className={`text-xs font-medium ${isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-400'}`}>{step}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </Card>

                    <div className="grid grid-cols-2 gap-6">
                        <Card className="p-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">Officer Verification Notes</h3>
                            <div className="bg-amber-50 p-4 rounded-lg border border-amber-100 text-sm text-amber-900">
                                <p>Site location verified on mapping system. Builder is requesting faster approval to start pre-sales. RERA documentation check is pending.</p>
                                <p className="mt-3 text-xs font-bold text-amber-700 bg-amber-200/50 inline-block px-2 py-1 rounded">Assigned to: {localProjectData.officer}</p>
                            </div>
                        </Card>

                        <Card className="p-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">Admin Actions</h3>
                            <div className="space-y-3">
                                <textarea
                                    className="w-full text-sm border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-[#6F4BFF]/20 focus:border-[#6F4BFF] outline-none transition-all"
                                    rows="3"
                                    placeholder="Add comments or reasons for rejection..."
                                ></textarea>
                                <div className="flex gap-3">
                                    <Button variant="danger" className="flex-1" icon={XCircle}>Reject</Button>
                                    <Button variant="success" className="flex-1" icon={CheckCircle2}>Approve Project</Button>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            )}

            {/* --- TAB CONTENT: DOCUMENTS --- */}
            {activeTab === 'documents' && (
                <Card className="p-6 animate-in fade-in">
                    <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800">Uploaded Documents & Collaterals</h3>
                            <p className="text-sm text-gray-500">Legal docs, brochures, and floor plans.</p>
                        </div>
                        <Button icon={Plus} variant="secondary">Upload Doc</Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {['RERA_Certificate.pdf', 'Master_Brochure_2026.pdf', 'Site_Plan_Layout.dwg', 'Builder_ID_Proof.jpg', 'Pricing_Sheet_Q2.xlsx'].map((doc, i) => (
                            <div key={i} className="flex items-center p-4 border border-gray-100 rounded-xl hover:bg-[#6F4BFF]/5 hover:border-[#6F4BFF]/30 cursor-pointer transition-all group">
                                <div className="bg-purple-50 p-2.5 rounded-lg mr-4 group-hover:bg-[#6F4BFF] transition-colors">
                                    <FileText className="w-6 h-6 text-[#6F4BFF] group-hover:text-white transition-colors" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-gray-900 truncate">{doc}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">2.4 MB • Updated {localProjectData.updated}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            )}

        </div>
    );
}

// -----------------------------------------------------
// NEW DEAL MANAGEMENT VIEWS (From Screenshots 1, 2, 3)
// -----------------------------------------------------

function DealsPipelineView({ navigateTo }) {
    // Replaced Kanban Board with the Customer List Table from Screenshot 1
    return (
        <Card noPadding>
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Customer List</h2>
                    <p className="text-sm text-gray-500 mt-1">Manage and track all finalized deals and property owners.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="secondary" icon={Filter}>Filter</Button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">DEAL CODE</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">CUSTOMER</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">PROPERTY</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">CITY</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">SALES OFFICER</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">BROKER/FIELD OFFICER</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">STATUS</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">CREATED ON</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">ACTION</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {mockDeals.map((deal, i) => (
                            <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4 text-sm font-bold text-gray-700 text-center">{deal.dealCode}</td>
                                <td className="px-6 py-4 text-sm font-semibold text-gray-800 text-center">{deal.customer}</td>
                                <td className="px-6 py-4 text-sm font-semibold text-gray-800 text-center">{deal.property}</td>
                                <td className="px-6 py-4 text-sm font-medium text-gray-600 text-center">{deal.city}</td>
                                <td className="px-6 py-4 text-sm font-medium text-gray-600 text-center">{deal.salesOfficer}</td>
                                <td className="px-6 py-4 text-sm font-medium text-gray-600 text-center">{deal.broker}</td>
                                <td className="px-6 py-4 text-center">{getStatusBadge(deal.status)}</td>
                                <td className="px-6 py-4 text-sm font-medium text-gray-600 text-center">{deal.createdOn}</td>
                                <td className="px-6 py-4">
                                    <div className="flex justify-center items-center gap-2">
                                        <button
                                            onClick={() => navigateTo('Deal Management', deal)}
                                            className="w-8 h-8 rounded bg-[#212121] text-white flex items-center justify-center hover:bg-black transition-colors shadow-sm"
                                            title="View Deal"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button className="w-8 h-8 rounded bg-[#F44336] text-white flex items-center justify-center hover:bg-[#E53935] transition-colors shadow-sm" title="Delete Deal">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}

function DealDetailView({ deal, onBack }) {
    const [activeTab, setActiveTab] = useState('Payment Schedule');
    const tabs = ['Meeting', 'Negotiation', 'Notes', 'Timeline', 'Collect Token Money', 'Payment Schedule', 'Payment History', 'Document'];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">

            {/* TOP HEADER SECTION (Screenshot 2) */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-start gap-4">
                    <button onClick={onBack} className="p-2 mt-1 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors border border-gray-200">
                        <ArrowRight className="w-5 h-5 rotate-180" />
                    </button>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{deal.broker.toLowerCase()}</h2>
                        <p className="text-gray-600 flex items-center gap-1.5 mt-1 font-medium"><PhoneCall className="w-4 h-4" /> {deal.brokerMobile}</p>
                        <div className="mt-3 inline-block bg-[#6F4BFF] text-white text-xs font-bold px-3 py-1 rounded tracking-wide uppercase">PROPERTY OWNER</div>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="success" icon={Check} className="bg-[#4CAF50] hover:bg-[#43A047] shadow-sm font-bold">Finalize Deal</Button>
                    <Button variant="danger" icon={X} className="bg-[#F44336] hover:bg-[#E53935] text-white shadow-sm font-bold">Mark as Lost</Button>
                </div>
            </div>

            {/* THREE INFO CARDS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6">
                    <div className="flex justify-between items-start mb-6">
                        <h3 className="font-bold text-gray-800 uppercase tracking-wider text-sm">DEAL</h3>
                        {getStatusBadge(deal.status)}
                    </div>
                    <div className="space-y-2.5 text-sm">
                        <p className="flex justify-between"><span className="text-gray-500 font-bold">Created On:</span> <span className="font-semibold text-gray-900">{deal.createdOn}</span></p>
                        <p className="flex justify-between"><span className="text-gray-500 font-bold">Broker:</span> <span className="font-semibold text-gray-900">{deal.broker}</span></p>
                        <p className="flex justify-between"><span className="text-gray-500 font-bold">Broker Mobile:</span> <span className="font-semibold text-gray-900">{deal.brokerMobile}</span></p>
                        <p className="flex justify-between"><span className="text-gray-500 font-bold">Sales Officer:</span> <span className="font-semibold text-gray-900">{deal.salesOfficer}</span></p>
                        <p className="flex justify-between"><span className="text-gray-500 font-bold">Sales Officer Mobile:</span> <span className="font-semibold text-gray-900">{deal.salesOfficerMobile}</span></p>
                    </div>
                </Card>

                <Card className="p-6">
                    <h3 className="font-bold text-gray-800 mb-6">Customer Information</h3>
                    <div className="space-y-2.5 text-sm">
                        <p className="font-bold text-gray-900 text-lg mb-1">{deal.customer}</p>
                        <p className="text-gray-600 font-medium mb-4">{deal.customerPhone}</p>
                        <p className="text-gray-500 font-bold">Preferred Location: <span className="font-medium text-gray-800 ml-1">{deal.prefLocation}</span></p>
                    </div>
                </Card>

                <Card className="p-6">
                    <h3 className="font-bold text-gray-800 mb-4">Property Information</h3>
                    <div className="space-y-2 text-sm">
                        <p className="font-bold text-gray-700 uppercase">{deal.propType}</p>
                        <p className="text-gray-600 font-medium leading-relaxed mb-3"><span className="font-bold text-gray-800">Address:</span> {deal.address}</p>
                        <p className="flex justify-between"><span className="font-bold text-gray-800">Khasra Number:</span> <span className="font-medium text-gray-600">{deal.khasra}</span></p>
                        <p className="flex justify-between"><span className="font-bold text-gray-800">Expect Price:</span> <span className="font-medium text-gray-600">₹ {deal.expectPrice}</span></p>
                        <p className="flex justify-between"><span className="font-bold text-gray-800">Negotiation Price:</span> <span className="font-medium text-gray-600">₹ {deal.negotiationPrice}</span></p>
                        <p className="flex justify-between"><span className="font-bold text-gray-800">Remaining Balance:</span> <span className="font-medium text-gray-600">₹ {deal.remainingBalance}</span></p>
                    </div>
                </Card>
            </div>

            {/* TAB NAVIGATION */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex overflow-x-auto border-b border-gray-200 hide-scrollbar">
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`whitespace-nowrap px-6 py-4 font-bold text-sm transition-colors border-b-2 ${activeTab === tab ? 'border-[#6F4BFF] text-[#6F4BFF]' : 'border-transparent text-[#6F4BFF] hover:bg-purple-50/50'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* TAB CONTENT */}
                <div className="p-6 md:p-8 bg-gray-50/30">

                    {/* MEETING TAB CONTENT (Screenshot 2) */}
                    {activeTab === 'Meeting' && (
                        <div className="animate-in fade-in">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-6">
                                <Calendar className="w-5 h-5 text-gray-600" /> Meeting Schedule
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="text-xs font-bold text-gray-700">Meeting Date</label>
                                    <input type="date" className="w-full mt-2 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 bg-white" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-700">Meeting Time</label>
                                    <input type="time" className="w-full mt-2 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 bg-white" />
                                </div>
                            </div>
                            <div className="mb-6">
                                <label className="text-xs font-bold text-gray-700">Meeting Remarks</label>
                                <textarea rows="4" className="w-full mt-2 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 bg-white"></textarea>
                            </div>
                            <div className="flex justify-end">
                                <Button className="bg-[#03A9F4] hover:bg-[#039BE5] text-white">Save Meeting</Button>
                            </div>
                        </div>
                    )}

                    {/* PAYMENT SCHEDULE TAB CONTENT (Screenshot 3) */}
                    {activeTab === 'Payment Schedule' && (
                        <div className="animate-in fade-in">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-6">
                                <CreditCard className="w-5 h-5 text-gray-600" /> Payment Schedule
                            </h3>

                            {/* Add Payment Form */}
                            <div className="flex flex-col md:flex-row gap-4 items-end mb-10">
                                <div className="flex-1 w-full">
                                    <label className="text-xs font-bold text-gray-700">Milestone Name</label>
                                    <input type="text" placeholder="e.g. Booking / Agreement / Handover" className="w-full mt-2 border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 bg-white" />
                                </div>
                                <div className="flex-1 w-full">
                                    <label className="text-xs font-bold text-gray-700">Amount (₹)</label>
                                    <input type="number" placeholder="Enter amount" className="w-full mt-2 border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 bg-white" />
                                </div>
                                <div className="flex-1 w-full">
                                    <label className="text-xs font-bold text-gray-700">Due Date</label>
                                    <input type="date" className="w-full mt-2 border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 bg-white" />
                                </div>
                                <div className="flex-1 w-full">
                                    <label className="text-xs font-bold text-gray-700">Mode</label>
                                    <select className="w-full mt-2 border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 bg-white">
                                        <option>Select</option>
                                        <option>Cash</option>
                                        <option>Upi</option>
                                        <option>Bank Transfer</option>
                                    </select>
                                </div>
                                <div className="w-full md:w-auto">
                                    <Button className="w-full bg-[#03A9F4] hover:bg-[#039BE5] text-white">Add Payment</Button>
                                </div>
                            </div>

                            {/* Payment Schedule Details Table */}
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
                                <ClipboardList className="w-5 h-5 text-gray-600" /> Payment Schedule Details
                            </h3>
                            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-gray-200 bg-gray-50/50">
                                                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">#</th>
                                                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">MILESTONE</th>
                                                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">AMOUNT (₹)</th>
                                                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">DUE DATE</th>
                                                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">MODE</th>
                                                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">DUE DATE UPDATED AT</th>
                                                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">STATUS</th>
                                                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-center">ACTIONS</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {deal.payments && deal.payments.length > 0 ? deal.payments.map((payment, i) => (
                                                <tr key={i} className="hover:bg-gray-50/50">
                                                    <td className="px-6 py-4 text-sm font-medium text-gray-600">{payment.id}</td>
                                                    <td className="px-6 py-4 text-sm font-semibold text-gray-800">{payment.milestone}</td>
                                                    <td className="px-6 py-4 text-sm font-bold text-gray-800">{payment.amount}</td>
                                                    <td className="px-6 py-4 text-sm font-medium text-gray-600">{payment.dueDate}</td>
                                                    <td className="px-6 py-4 text-sm font-medium text-gray-600 capitalize">{payment.mode}</td>
                                                    <td className="px-6 py-4 text-sm font-medium text-gray-600">{payment.updated}</td>
                                                    <td className="px-6 py-4">
                                                        <span className="bg-[#4CAF50] text-white px-3 py-1 rounded text-[10px] font-bold tracking-wider shadow-sm">{payment.status}</span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex justify-center items-center gap-2">
                                                            <button className="w-8 h-8 rounded bg-[#03A9F4] text-white flex items-center justify-center hover:bg-[#039BE5] transition-colors shadow-sm" title="Edit">
                                                                <Edit2 className="w-4 h-4" />
                                                            </button>
                                                            <button className="w-8 h-8 rounded bg-[#4CAF50] text-white flex items-center justify-center hover:bg-[#43A047] transition-colors shadow-sm" title="Complete">
                                                                <Check className="w-4 h-4" />
                                                            </button>
                                                            <button className="w-8 h-8 rounded bg-[#F44336] text-white flex items-center justify-center hover:bg-[#E53935] transition-colors shadow-sm" title="Delete">
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan="8" className="px-6 py-8 text-center text-sm text-gray-500 font-medium">No payment schedules added yet.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Placeholder for other tabs */}
                    {activeTab !== 'Meeting' && activeTab !== 'Payment Schedule' && (
                        <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-xl bg-white">
                            <p className="text-gray-400 font-medium text-sm flex items-center gap-2">
                                <Settings className="w-4 h-4" /> Content for {activeTab} will appear here.
                            </p>
                        </div>
                    )}

                </div>
            </div>
        </div>
    )
}

function RecommendationsView() {
    return (
        <Card className="flex flex-col items-center justify-center h-[60vh] text-center max-w-3xl mx-auto p-10">
            <div className="w-16 h-16 bg-[#6F4BFF]/10 text-[#6F4BFF] rounded-2xl flex items-center justify-center mb-6">
                <Sparkles className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Project Recommendation Engine</h2>
            <p className="text-gray-500 mb-8 max-w-md">Input a client's specific requirements, budget constraints, and location preferences to instantly generate a curated list of matching inventory.</p>
            <div className="w-full bg-gray-50 border border-gray-100 rounded-xl p-2 flex">
                <input type="text" placeholder="e.g. 3BHK in Andheri under 2.5 Cr ready to move" className="flex-1 bg-transparent px-4 outline-none text-gray-800" />
                <Button variant="primary">Generate Matches</Button>
            </div>
        </Card>
    )
}

function VisitsView() {
    return (
        <Card noPadding>
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Site Visits</h2>
                    <p className="text-sm text-gray-500 mt-1">Track physical and virtual property tours.</p>
                </div>
                <Button icon={Calendar}>Schedule Visit</Button>
            </div>
            <Table
                headers={['Client', 'Target Project', 'Date & Time', 'Assigned Officer', 'Status', '']}
                data={mockVisits}
                renderRow={(row, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-bold text-gray-900">{row.client}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-700">{row.project}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{row.date}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{row.officer}</td>
                        <td className="px-6 py-4">
                            <Badge variant={row.status === 'Scheduled' ? 'purple' : 'green'}>{row.status}</Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                            <button className="text-sm font-bold text-[#6F4BFF] hover:underline">Update</button>
                        </td>
                    </tr>
                )}
            />
        </Card>
    )
}

function BuildersView() {
    return (
        <Card noPadding>
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Managed Builders</h2>
                    <p className="text-sm text-gray-500 mt-1">Directory of builders operating on platform.</p>
                </div>
                <Button icon={Plus}>Add Builder</Button>
            </div>
            <Table
                headers={['Builder Name', 'City', 'Projects', 'Contact', 'Status', '']}
                data={mockBuilders}
                renderRow={(row, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-bold text-gray-900">{row.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{row.city}</td>
                        <td className="px-6 py-4 text-sm text-gray-900 font-bold">{row.projects}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{row.contact}</td>
                        <td className="px-6 py-4">{getStatusBadge(row.status)}</td>
                        <td className="px-6 py-4 text-right">
                            <button className="text-gray-400 hover:text-[#6F4BFF]"><MoreVertical className="w-5 h-5" /></button>
                        </td>
                    </tr>
                )}
            />
        </Card>
    )
}

function PaymentsView() {
    return (
        <Card noPadding>
            <div className="p-6 border-b border-gray-100 bg-white">
                <h2 className="text-xl font-bold text-gray-800">Payment Tracking</h2>
                <p className="text-sm text-gray-500 mt-1">Monitor deal milestones and received capital.</p>
            </div>
            <Table
                headers={['Payment ID', 'Deal Reference', 'Date', 'Amount', 'Status', 'Action']}
                data={mockPayments}
                renderRow={(row, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-bold text-[#6F4BFF]">{row.id}</td>
                        <td className="px-6 py-4 text-sm text-gray-800 font-medium">{row.deal}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{row.date}</td>
                        <td className="px-6 py-4 text-sm font-bold text-emerald-600">₹ {row.amount}</td>
                        <td className="px-6 py-4">{getStatusBadge(row.status)}</td>
                        <td className="px-6 py-4">
                            <button className="text-sm font-medium text-gray-600 hover:text-[#6F4BFF]">View Receipt</button>
                        </td>
                    </tr>
                )}
            />
        </Card>
    )
}

// Naya User List component jo screenshot se match karta hai
function UserListView({ navigateTo }) {
    const [localUsers, setLocalUsers] = useState(mockUsers);

    // Document status badge specific to User List (Green, Amber, Red)
    const getDocBadge = (status) => {
        if (status === 'Approved') return <span className="bg-[#4CAF50] text-white px-4 py-1.5 rounded-md text-xs font-bold tracking-wide shadow-sm">Approved</span>;
        if (status === 'Pending') return <span className="bg-[#FF9800] text-white px-4 py-1.5 rounded-md text-xs font-bold tracking-wide shadow-sm">Pending</span>;
        return <span className="bg-[#F44336] text-white px-4 py-1.5 rounded-md text-xs font-bold tracking-wide shadow-sm">Rejected</span>;
    };

    return (
        <Card noPadding className="animate-in fade-in duration-300">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">User List</h2>
                    <p className="text-sm text-gray-500 mt-1">Manage Sales, Broker, and Field Officer app registrations.</p>
                </div>
                <select className="border border-gray-300 rounded-lg p-2.5 outline-none text-sm font-medium bg-white w-48">
                    <option>All Users</option>
                    <option>Sales Officers</option>
                    <option>Field Officers</option>
                    <option>Brokers</option>
                </select>
            </div>
            <Table
                headers={['NAME', 'USER TYPE', 'MOBILE', 'DOCUMENT STATUS', 'ACTION']}
                data={localUsers}
                renderRow={(row, i) => (
                    <tr key={i} className="hover:bg-gray-50/80 transition-colors">
                        <td className="px-6 py-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border border-gray-300 flex items-center justify-center shrink-0">
                                <span className="font-bold text-gray-500">{row.name.charAt(0)}</span>
                            </div>
                            <span className="font-bold text-gray-900">{row.name}</span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-600 capitalize">{row.type.replace('_', ' ')}</td>
                        <td className="px-6 py-4 text-sm font-bold text-gray-700">{row.phone}</td>
                        <td className="px-6 py-4">
                            {getDocBadge(row.docStatus)}
                        </td>
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => navigateTo('User List', row)}
                                    className="w-8 h-8 rounded bg-[#03A9F4] text-white flex items-center justify-center hover:bg-[#039BE5] transition-colors shadow-sm"
                                    title="Edit & Verify"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button className="w-8 h-8 rounded bg-[#F44336] text-white flex items-center justify-center hover:bg-[#E53935] transition-colors shadow-sm" title="Delete User">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => navigateTo('User List', row)}
                                    className="w-8 h-8 rounded bg-[#03A9F4] text-white flex items-center justify-center hover:bg-[#039BE5] transition-colors shadow-sm"
                                    title="View Profile"
                                >
                                    <Eye className="w-4 h-4" />
                                </button>
                            </div>
                        </td>
                    </tr>
                )}
            />
        </Card>
    )
}

// Naya User Edit / Document Approval View
function UserEditView({ user, onBack }) {
    const [docStatus, setDocStatus] = useState(user.docStatus);

    // Helper for rendering document cards
    const DocCard = ({ title, showCancel = true }) => (
        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm flex flex-col">
            <div className="flex justify-between items-center p-3 border-b border-gray-100 bg-gray-50">
                <h4 className="font-bold text-gray-800 text-sm">{title}</h4>
                {showCancel && (
                    <button className="w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center hover:bg-rose-600 transition-colors">
                        <X className="w-3 h-3" />
                    </button>
                )}
            </div>

            {/* Image Preview Area */}
            <div className="aspect-[4/3] bg-gray-100 relative group flex items-center justify-center overflow-hidden">
                {/* Mocking uploaded image layout. In real app, render actual img tag here */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 opacity-50"></div>
                <ImageIcon className="w-12 h-12 text-gray-400 z-10" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20 cursor-pointer">
                    <span className="text-white font-bold text-sm flex items-center gap-2"><Eye className="w-4 h-4" /> Preview Full</span>
                </div>
            </div>

            <div className="p-3 border-t border-gray-100 flex items-center gap-2">
                <button className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-bold rounded hover:bg-gray-200 transition-colors border border-gray-200">
                    Choose file
                </button>
                <span className="text-xs text-gray-400 font-medium truncate">No file chosen</span>
            </div>
        </div>
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* Header and Back Action */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 bg-white hover:bg-gray-50 rounded-lg text-gray-600 transition-colors shadow-sm border border-gray-200">
                        <ArrowRight className="w-5 h-5 rotate-180" />
                    </button>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">User Setup & Verification</h2>
                        <p className="text-sm text-gray-500 mt-0.5">Verify KYC documents before granting app access.</p>
                    </div>
                </div>

                {/* Verification Actions */}
                <div className="flex gap-3 bg-white p-2 rounded-xl shadow-sm border border-gray-100">
                    {docStatus !== 'Approved' && (
                        <Button variant="success" icon={CheckCircle2} onClick={() => setDocStatus('Approved')}>Approve Account</Button>
                    )}
                    {docStatus !== 'Rejected' && (
                        <Button variant="danger" icon={XCircle} onClick={() => setDocStatus('Rejected')}>Reject Details</Button>
                    )}
                    {docStatus === 'Approved' && (
                        <span className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 font-bold rounded-lg border border-emerald-200">
                            <CheckCircle2 className="w-5 h-5" /> Account is Active
                        </span>
                    )}
                </div>
            </div>

            <Card className="p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                    <div>
                        <label className="text-sm font-bold text-gray-800 uppercase tracking-wider">Full Name</label>
                        <input type="text" defaultValue={user.name} className="w-full mt-2 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 font-medium text-gray-900" />
                    </div>
                    <div>
                        <label className="text-sm font-bold text-gray-800 uppercase tracking-wider">Mobile Number</label>
                        <input type="text" defaultValue={user.phone} className="w-full mt-2 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 font-medium text-gray-900" />
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Document Information</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <DocCard title="Aadhaar Card (Front)" />
                        <DocCard title="Aadhaar Card (Back)" />
                        <DocCard title="PAN Card" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                        <DocCard title="Selfie Image" />
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                    <Button icon={Save} className="px-8 py-3">Save Updates</Button>
                </div>
            </Card>
        </div>
    )
}

function TasksView() {
    const tasks = [
        { id: 'T-1', title: 'Collect RERA docs from Apex Buildcon', assignee: 'Rahul M.', due: 'Today', status: 'Pending' },
        { id: 'T-2', title: 'Site visit with Ankit Sharma', assignee: 'Neha K.', due: 'Tomorrow', status: 'Scheduled' },
        { id: 'T-3', title: 'Verify plot dimensions at Green Valley', assignee: 'Sneha P.', due: '14 Apr', status: 'New' },
    ];
    return (
        <Card noPadding>
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Task Management</h2>
                    <p className="text-sm text-gray-500 mt-1">Cross-team operational tasks.</p>
                </div>
                <Button icon={Plus}>Assign Task</Button>
            </div>
            <Table
                headers={['Task', 'Assignee', 'Due Date', 'Status', '']}
                data={tasks}
                renderRow={(row, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-bold text-gray-900">{row.title}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{row.assignee}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{row.due}</td>
                        <td className="px-6 py-4">{getStatusBadge(row.status)}</td>
                        <td className="px-6 py-4 text-right">
                            <button className="text-sm font-medium text-gray-400 hover:text-[#6F4BFF]">Edit</button>
                        </td>
                    </tr>
                )}
            />
        </Card>
    )
}

function AnalyticsView() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
                <Card className="p-6 h-80 flex flex-col">
                    <h3 className="text-lg font-bold text-gray-800 mb-6">Revenue Trends (Last 6 Months)</h3>
                    <div className="flex-1 flex items-end justify-between gap-4 px-4 pb-4">
                        {[30, 50, 40, 70, 60, 90].map((h, i) => (
                            <div key={i} className="w-full bg-emerald-50 rounded-t flex flex-col justify-end group cursor-pointer h-full relative">
                                <div className="w-full bg-emerald-400 rounded-t transition-all duration-300 group-hover:bg-emerald-500" style={{ height: `${h}%` }}></div>
                                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-gray-400 font-medium">M{i + 1}</span>
                            </div>
                        ))}
                    </div>
                </Card>
                <Card className="p-6 h-80 flex flex-col">
                    <h3 className="text-lg font-bold text-gray-800 mb-6">City-wise Conversion Rate</h3>
                    <div className="flex-1 space-y-4">
                        {[
                            { city: 'Mumbai', val: 65, color: 'bg-blue-500' },
                            { city: 'Bangalore', val: 82, color: 'bg-purple-500' },
                            { city: 'Delhi', val: 45, color: 'bg-amber-500' },
                            { city: 'Chennai', val: 70, color: 'bg-rose-500' },
                        ].map((c, i) => (
                            <div key={i}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium text-gray-700">{c.city}</span>
                                    <span className="font-bold text-gray-900">{c.val}%</span>
                                </div>
                                <div className="h-2 bg-gray-100 rounded-full mt-1">
                                    <div className={`h-full rounded-full ${c.color}`} style={{ width: `${c.val}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    )
}

function SettingsView() {
    return (
        <div className="max-w-3xl">
            <Card className="p-0 overflow-hidden divide-y divide-gray-100">
                <div className="p-6 bg-gray-50/50">
                    <h3 className="text-lg font-bold text-gray-800">Platform Settings</h3>
                    <p className="text-sm text-gray-500">Manage your administrative preferences.</p>
                </div>

                <div className="p-6 flex items-center justify-between hover:bg-gray-50 cursor-pointer transition-colors">
                    <div>
                        <h4 className="font-medium text-gray-900">Roles & Permissions</h4>
                        <p className="text-sm text-gray-500 mt-1">Manage access for Field and Sales Officers.</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>

                <div className="p-6 flex items-center justify-between hover:bg-gray-50 cursor-pointer transition-colors">
                    <div>
                        <h4 className="font-medium text-gray-900">Payment Configurations</h4>
                        <p className="text-sm text-gray-500 mt-1">Set up Razorpay/bank integrations and milestones.</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>

                <div className="p-6 flex items-center justify-between hover:bg-gray-50 cursor-pointer transition-colors">
                    <div>
                        <h4 className="font-medium text-gray-900">Notification Preferences</h4>
                        <p className="text-sm text-gray-500 mt-1">Email and SMS alerts for deal updates.</p>
                    </div>
                    <div className="w-11 h-6 bg-[#6F4BFF] rounded-full relative cursor-pointer">
                        <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1 shadow-sm"></div>
                    </div>
                </div>
            </Card>
        </div>
    )
}