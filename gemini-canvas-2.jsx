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
    Trash2, Image as ImageIcon, UploadCloud, ListChecks
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
    {
        id: 'L001', name: 'Karan Malhotra', phone: '+91 9876543210', email: 'karan.m@gmail.com', budget: '1.5 Cr - 2 Cr', req: 'Residential, 3BHK', location: 'Mumbai', status: 'Follow Up', officer: 'Neha K.', date: '12 Apr', score: 'Hot',
        timeline: [
            { type: 'Call', date: '12 Apr, 10:30 AM', note: 'Initial inquiry call. Looking for ready-to-move 3BHK in Andheri.', agent: 'Neha K.' },
            { type: 'WhatsApp', date: '12 Apr, 11:00 AM', note: 'Sent Skyline Residency brochure.', agent: 'Neha K.' },
            { type: 'FollowUp', date: '14 Apr, 02:00 PM', note: 'Scheduled site visit for next weekend.', agent: 'Neha K.' }
        ],
        nextAction: 'Confirm site visit timing', nextActionDate: '15 Apr 2026'
    },
    {
        id: 'L002', name: 'Swati Jain', phone: '+91 9876543211', email: 'swati.jain99@yahoo.com', budget: '50 L - 90 L', req: 'Plot / Villa', location: 'Bangalore', status: 'New', officer: 'Ravi T.', date: '11 Apr', score: 'Warm',
        timeline: [
            { type: 'System', date: '11 Apr, 09:15 AM', note: 'Lead captured via Facebook Ad Campaign.', agent: 'System' }
        ],
        nextAction: 'First Contact Call', nextActionDate: 'Today'
    },
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
        ],
        timeline: [
            { title: 'Properties Assigned', details: 'Assigned Skyline Residency and Ocean View Luxury', date: '10/04/2026', time: '11:00 AM' },
            { title: 'Client Qualified', details: 'Moved from Lead to Active Client', date: '08/04/2026', time: '04:30 PM' }
        ],
        notes: [
            { text: 'Client is extremely particular about Vastu. Only east-facing units to be pitched.', date: '10/04/2026', time: '11:15 AM' }
        ],
        meetings: [
            { date: '2026-04-12', time: '14:00', remarks: 'Office meeting to finalize preferred properties.' }
        ]
    },
    {
        id: 'C002', name: 'Ankit Sharma', phone: '+91 9876543213', budget: '1 Cr - 2 Cr',
        req: { type: 'Residential', bhk: ['2BHK'], loc: ['Mumbai', 'Andheri'], timeline: '60 Days' },
        status: 'Negotiating', officer: 'Rahul M.',
        propertyPipeline: [
            { projectId: 'P001', status: 'Negotiating', units: ['2BHK - Flat 402'], visitedOn: '08 Apr', notes: 'Asking for 5% discount' },
            { projectId: 'P005', status: 'Visited', units: ['2BHK'], visitedOn: '05 Apr', notes: 'Liked the amenities, but prefers Skyline' }
        ],
        timeline: [
            { title: 'Negotiation Started', details: 'Offered 1.15 Cr for Skyline Residency Unit 402', date: '08/04/2026', time: '05:00 PM' }
        ],
        notes: [],
        meetings: []
    }
];

const mockDeals = [
    {
        dealCode: 'D0007', customer: 'Geheve', property: 'Testing', city: 'Indore', salesOfficer: 'Sales Officer', broker: 'Anil', status: 'FINALIZED', createdOn: '07/03/26',
        customerPhone: '9165993939', brokerMobile: '9165993939', salesOfficerMobile: '9302569085',
        prefLocation: 'Harda, Madhya Pradesh, India',
        propType: 'APARTMENT/FLATS', address: 'VIRTUAL COWORKS, 41,42 PU 4 Scheme NO.54, VIRTUAL COWORKS, Malviya Nagar, Indore, Madhya Pradesh, 452010',
        khasra: '', expectPrice: 1000000, negotiationPrice: 2000000, remainingBalance: 984900,
        payments: [
            { id: 1, milestone: 'Guyigtyu', amount: 10000, dueDate: '2026-03-09', mode: 'Cash', updated: '-', status: 'COMPLETED', date: '2026-03-09', time: '01:39 PM', remarks: 'Milestone Completed: Guyigtyu' },
            { id: 2, milestone: 'Guyigtyu 1', amount: 5000, dueDate: '2026-03-07', mode: 'Upi', updated: '-', status: 'COMPLETED', date: '2026-03-07', time: '01:14 PM', remarks: 'Milestone Completed: Guyigtyu 1' },
            { id: 3, milestone: 'Booking', amount: 100, dueDate: '2026-03-10', mode: 'Upi', updated: '-', status: 'COMPLETED', date: '2026-03-10', time: '01:36 PM', remarks: 'Milestone Completed: Booking' }
        ],
        timeline: [
            { title: 'Deal Finalized', details: 'Deal No: D0007', date: '09/03/2026', time: '16:56:00' },
            { title: 'Payment Milestone Completed', details: 'Guyigtyu - ₹10000 (cash)', date: '09/03/2026', time: '13:39:33' },
            { title: 'Payment Milestone Completed', details: 'Booking - ₹100 (upi)', date: '09/03/2026', time: '13:36:56' },
            { title: 'Deal Created', details: 'Deal No: D0007', date: '07/03/2026', time: '13:12:08' }
        ],
        notes: [], meetings: [], documents: []
    },
    { dealCode: 'D0006', customer: 'Durgesh', property: 'Sapana', city: 'Indore', salesOfficer: 'Rizwan Khan', broker: 'SquarFT 92', status: 'FINALIZED', createdOn: '28/02/26', customerPhone: '9876543210', brokerMobile: '-', salesOfficerMobile: '-', prefLocation: '-', propType: 'PLOT', address: '-', khasra: '-', expectPrice: 500000, negotiationPrice: 500000, remainingBalance: 500000, payments: [], timeline: [], notes: [], meetings: [], documents: [] },
    { dealCode: 'D0005', customer: 'Swapnil', property: 'Sindh Palace', city: 'Indore', salesOfficer: 'Manas', broker: 'Manas Gangrade', status: 'FINALIZED', createdOn: '24/02/26', customerPhone: '9876543210', brokerMobile: '-', salesOfficerMobile: '-', prefLocation: '-', propType: 'COMMERCIAL', address: '-', khasra: '-', expectPrice: 1500000, negotiationPrice: 1450000, remainingBalance: 1450000, payments: [], timeline: [], notes: [], meetings: [], documents: [] },
];

const mockVisits = [
    { id: 'V001', officerName: 'Manas', officerPhone: '7691962521', customerName: 'Vikash Singh', customerPhone: '8225000092', purpose: 'BUY', date: '05/04/26', time: '10:00 - 11:00 AM', status: 'Scheduled', property: { name: 'Skyline Residency', type: 'APARTMENT/FLATS', config: '3BHK Premium', address: 'Andheri West, Mumbai', price: '₹ 1.85 Cr' }, notes: 'Client highly interested in park facing units.' },
    { id: 'V002', officerName: 'Manas', officerPhone: '7691962521', customerName: 'Ankit Sharma', customerPhone: '8224004000', purpose: 'BUY', date: '09/03/26', time: '10:00 - 11:00 AM', status: 'Completed', property: { name: 'Green Valley Phase 2', type: 'VILLA PLOTS', config: '40x60 Plot', address: 'HSR Layout, Bangalore', price: '₹ 1.50 Cr' }, notes: 'Showed corner plots. Client will discuss with family.' },
    { id: 'V003', officerName: 'Rajesh Gurjar', officerPhone: '8224004000', customerName: 'Pawan Sharma', customerPhone: '8224004000', purpose: 'RENT', date: '28/02/26', time: '11:00 - 12:00 PM', status: 'Cancelled', property: { name: 'Metro Heights', type: 'COMMERCIAL', config: 'Retail Shop', address: 'Connaught Place, Delhi', price: '₹ 2.5 L / month' }, notes: 'Client cancelled due to emergency.' },
];

const mockRequirements = [
    { id: 'CR1', name: 'Mango', phone: '8225000092', budget: '100000 - 382523500', date: '05/04/26', time: '10:00 - 11:00', propAvailable: 2, listingType: 'Buy', listingKind: 'Residential', propType: 'APARTMENT/FLATS' },
    { id: 'CR2', name: 'Manas Sir', phone: '8120180101', budget: '100000 - 1000000', date: '09/03/26', time: '17:00 - 18:00', propAvailable: 4, listingType: 'Buy', listingKind: 'Residential', propType: 'APARTMENT/FLATS' },
    { id: 'CR3', name: 'Dr Kashyap Ji', phone: '8224004000', budget: '100000 - 201600000', date: '09/03/26', time: '10:00 - 11:00', propAvailable: 1, listingType: 'Buy', listingKind: 'Residential', propType: 'APARTMENT/FLATS' }
];

const mockBuilders = [
    { id: 1, name: 'Apex Buildcon', projects: 12, city: 'Mumbai', contact: '+91 9876543210', status: 'Active' },
    { id: 2, name: 'EcoHomes Ltd', projects: 8, city: 'Bangalore', contact: '+91 9876543211', status: 'Active' },
    { id: 3, name: 'CityScape Developers', projects: 4, city: 'Delhi', contact: '+91 9876543212', status: 'Onboarding' },
];

const mockPayments = [
    { id: 'PAY-101', deal: 'D0007', amount: '10,000', status: 'Received', date: '09 Mar 2026' },
    { id: 'PAY-102', deal: 'D0007', amount: '5,000', status: 'Received', date: '07 Mar 2026' },
];

const mockUsers = [
    { id: 'U001', name: 'Rizwan Khan', type: 'Sales_officer', phone: '9424654160', docStatus: 'Approved' },
    { id: 'U002', name: 'SquarFT106', type: 'Field_officer', phone: '8224000106', docStatus: 'Pending' },
    { id: 'U003', name: 'Sales Officer', type: 'Sales_officer', phone: '9302569085', docStatus: 'Approved' },
    { id: 'U004', name: 'Anil', type: 'Broker', phone: '9165993939', docStatus: 'Rejected' },
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
        gradient: 'bg-gradient-to-r from-purple-500 to-amber-500 text-white shadow-sm border-none',
    };
    return (
        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${variants[variant]} ${className}`}>
            {children}
        </span>
    );
};

const Button = ({ children, variant = 'primary', icon: Icon, onClick, className = '', type = "button", disabled = false }) => {
    const base = "inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
    const variants = {
        primary: "bg-[#6F4BFF] hover:bg-[#5936eb] text-white shadow-sm focus:ring-[#6F4BFF]",
        secondary: "bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 focus:ring-gray-200",
        ghost: "bg-transparent hover:bg-gray-100 text-gray-600",
        danger: "bg-rose-50 hover:bg-rose-100 text-rose-700 focus:ring-rose-500",
        success: "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 focus:ring-emerald-500",
        blue: "bg-[#2196F3] hover:bg-[#1E88E5] text-white shadow-sm focus:ring-[#2196F3]",
    };
    return (
        <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]} ${className}`}>
            {Icon && <Icon className="w-4 h-4" />}
            {children}
        </button>
    );
};

const getStatusBadge = (status) => {
    if (!status) return <Badge variant="gray">UNKNOWN</Badge>;
    switch (status.toUpperCase()) {
        case 'APPROVED': case 'ACTIVE': case 'CLEARED': case 'RECEIVED': case 'CLOSURE': case 'COMPLETED':
            return <Badge variant="green">{status}</Badge>;
        case 'IN REVIEW': case 'PENDING': case 'CONTACTED': case 'VISIT': case 'DEAL': case 'NEGOTIATING': case 'FOLLOW UP': case 'SCHEDULED':
            return <Badge variant="yellow">{status}</Badge>;
        case 'REJECTED': case 'LOST': case 'CANCELLED': case 'NOT INTERESTED':
            return <Badge variant="red">{status}</Badge>;
        case 'NEW': case 'LEAD': case 'SHORTLISTED':
            return <Badge variant="purple">{status}</Badge>;
        case 'SHOWN':
            return <Badge variant="blue">{status}</Badge>;
        case 'FINALIZED':
            return <Badge variant="gradient">{status}</Badge>;
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

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center p-5 border-b border-gray-100">
                    <h3 className="font-bold text-lg text-gray-900">{title}</h3>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-md text-gray-500 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-6 max-h-[80vh] overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    )
}

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
        { name: 'Clients Hub', icon: Users }, // Renamed for emphasis
        { name: 'Customer Requirements', icon: ClipboardList },
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
                        <div className="w-8 h-8 bg-[#6F4BFF] rounded-lg flex items-center justify-center shadow-sm">
                            <Building2 className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">SquarFT</span>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5 scrollbar-hide">
                    <p className="px-3 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 mt-2">Core Operations</p>
                    {menuItems.slice(0, 7).map((item) => {
                        const isActive = currentView === item.name;
                        return (
                            <button
                                key={item.name}
                                onClick={() => navigateTo(item.name)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive ? 'bg-[#6F4BFF]/10 text-[#6F4BFF]' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                <item.icon className={`w-5 h-5 ${isActive ? 'text-[#6F4BFF]' : 'text-gray-400'}`} />
                                {item.name}
                            </button>
                        )
                    })}

                    <div className="my-4 border-t border-gray-100 mx-2"></div>
                    <p className="px-3 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Admin & Tools</p>

                    {menuItems.slice(7).map((item) => {
                        const isActive = currentView === item.name;
                        return (
                            <button
                                key={item.name}
                                onClick={() => navigateTo(item.name)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive ? 'bg-[#6F4BFF]/10 text-[#6F4BFF]' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
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
                        <h1 className="text-xl font-bold text-gray-800 capitalize">
                            {currentView}
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
                <div className="flex-1 overflow-y-auto p-6 md:p-8 h-full">
                    <div className="max-w-[1600px] mx-auto h-full flex flex-col">

                        {/* Core Routing Logic */}
                        {currentView === 'Dashboard' && <DashboardView />}

                        {currentView === 'Leads Pipeline' && !selectedItem && <LeadsView navigateTo={navigateTo} />}
                        {currentView === 'Leads Pipeline' && selectedItem && <LeadFollowUpView lead={selectedItem} onBack={() => navigateTo('Leads Pipeline')} />}

                        {/* CLIENTS HUB ROUTING UPDATE */}
                        {currentView === 'Clients Hub' && !selectedItem && <ClientsView navigateTo={navigateTo} />}
                        {currentView === 'Clients Hub' && selectedItem && <ClientProfileView client={selectedItem} projects={mockProjects} onBack={() => navigateTo('Clients Hub')} />}

                        {currentView === 'Customer Requirements' && (!selectedItem || selectedItem.mode === 'LIST') && <CustomerRequirementsView navigateTo={navigateTo} />}
                        {currentView === 'Customer Requirements' && selectedItem?.mode === 'ADD_EDIT' && <RequirementFormView req={selectedItem.data} onBack={() => navigateTo('Customer Requirements')} />}
                        {currentView === 'Customer Requirements' && selectedItem?.mode === 'ASSIGN' && <AssignPropertyView req={selectedItem.data} onBack={() => navigateTo('Customer Requirements')} />}

                        {currentView === 'Projects Inventory' && !selectedItem && <ProjectsView navigateTo={navigateTo} />}
                        {currentView === 'Projects Inventory' && selectedItem && <ProjectDetailView project={selectedItem} onBack={() => navigateTo('Projects Inventory')} />}

                        {currentView === 'Recommendations' && <RecommendationsView />}

                        {currentView === 'Upcoming Visits' && <EnhancedVisitsView />}

                        {currentView === 'Deal Management' && !selectedItem && <DealsPipelineView navigateTo={navigateTo} />}
                        {currentView === 'Deal Management' && selectedItem && <DealDetailView deal={selectedItem} onBack={() => navigateTo('Deal Management')} />}

                        {currentView === 'Payments' && <PaymentsView />}

                        {currentView === 'Builders List' && <BuildersView />}

                        {currentView === 'Sales Officers' && <OfficersView type="Sales" />}

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

function DashboardView() {
    const metrics = [
        { title: 'Active Leads Pipeline', value: '1,248', trend: '+12.5%', isUp: true, icon: Zap, color: 'text-[#6F4BFF]', bg: 'bg-[#6F4BFF]/10', chartColor: '#6F4BFF', svgPath: 'M0,20 Q10,15 20,25 T40,10 T60,20 T80,5 T100,15 L100,30 L0,30 Z' },
        { title: 'Qualified Clients', value: '342', trend: '+8.2%', isUp: true, icon: Target, color: 'text-blue-500', bg: 'bg-blue-50', chartColor: '#3B82F6', svgPath: 'M0,25 Q15,5 30,15 T60,10 T80,20 T100,5 L100,30 L0,30 Z' },
        { title: 'Ongoing Negotiations', value: '84', trend: '-2.4%', isUp: false, icon: Briefcase, color: 'text-amber-500', bg: 'bg-amber-50', chartColor: '#F59E0B', svgPath: 'M0,10 Q20,15 40,5 T70,25 T100,15 L100,30 L0,30 Z' },
        { title: 'Realized Revenue', value: '₹4.2 Cr', trend: '+24.8%', isUp: true, icon: IndianRupee, color: 'text-emerald-500', bg: 'bg-emerald-50', chartColor: '#10B981', svgPath: 'M0,25 Q20,20 30,10 T60,15 T80,5 T100,0 L100,30 L0,30 Z' },
    ];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">System Intelligence Overview</h2>
                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Live data sync enabled
                    </p>
                </div>
                <div className="flex items-center gap-3 bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
                    {['24h', '7d', '30d', '1y'].map((range, i) => (
                        <button key={range} className={`px-4 py-1.5 text-xs font-bold rounded-md transition-colors ${i === 2 ? 'bg-[#6F4BFF] text-white shadow-sm' : 'text-gray-500 hover:bg-gray-100'}`}>{range}</button>
                    ))}
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {metrics.map((m, i) => (
                    <Card key={i} noPadding className="group cursor-pointer hover:border-[#6F4BFF]/40 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
                        <div className="p-5 relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-2.5 rounded-xl ${m.bg} ${m.color} shadow-sm`}><m.icon className="w-5 h-5" /></div>
                                <Badge variant={m.isUp ? 'green' : 'red'} className="flex items-center gap-1">
                                    {m.isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />} {m.trend}
                                </Badge>
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900 mb-1">{m.value}</h3>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{m.title}</p>
                        </div>
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
        </div>
    );
}

function LeadsView({ navigateTo }) {
    const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
    return (
        <>
            <Card noPadding>
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Raw Leads Pipeline</h2>
                        <p className="text-sm text-gray-500 mt-1">Manage and nurture inquiries until they become qualified clients.</p>
                    </div>
                    <div className="flex gap-3">
                        <Button icon={Filter} variant="secondary">Filter</Button>
                        <Button icon={Plus} onClick={() => setIsAddLeadOpen(true)}>Add New Lead</Button>
                    </div>
                </div>
                <Table
                    headers={['Lead Name', 'Contact', 'Budget', 'Requirement', 'Status', 'Assigned', 'Action']}
                    data={mockLeads}
                    renderRow={(row, i) => (
                        <tr key={i} className="hover:bg-gray-50/80 transition-colors group cursor-pointer" onClick={() => navigateTo('Leads Pipeline', row)}>
                            <td className="px-6 py-4">
                                <div className="font-bold text-gray-900 flex items-center gap-2">{row.name}{row.score === 'Hot' && <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" title="Hot Lead"></span>}</div>
                                <div className="text-xs text-gray-500 mt-0.5">Added: {row.date}</div>
                            </td>
                            <td className="px-6 py-4"><div className="text-sm font-medium text-gray-800">{row.phone}</div><div className="text-xs text-gray-500">{row.email}</div></td>
                            <td className="px-6 py-4"><div className="text-sm font-bold text-gray-800">{row.budget}</div><div className="text-xs text-gray-600">{row.req}</div></td>
                            <td className="px-6 py-4">{getStatusBadge(row.status)}</td>
                            <td className="px-6 py-4 text-sm text-gray-700 font-medium flex items-center gap-2 mt-2">
                                <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-[10px] font-bold text-[#6F4BFF]">{row.officer.charAt(0)}</div>{row.officer}
                            </td>
                            <td className="px-6 py-4">
                                <Button variant="secondary" className="text-xs py-1.5 px-3 hover:border-[#6F4BFF] hover:text-[#6F4BFF]" onClick={(e) => { e.stopPropagation(); navigateTo('Clients Hub'); }}>Qualify</Button>
                            </td>
                        </tr>
                    )}
                />
            </Card>
            <Modal isOpen={isAddLeadOpen} onClose={() => setIsAddLeadOpen(false)} title="Add New Lead">
                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setIsAddLeadOpen(false); }}>
                    <div className="pt-4 border-t border-gray-100 flex justify-end gap-3 mt-6">
                        <Button variant="secondary" onClick={() => setIsAddLeadOpen(false)}>Cancel</Button>
                        <Button type="submit" icon={Save}>Save Lead</Button>
                    </div>
                </form>
            </Modal>
        </>
    );
}

function LeadFollowUpView({ lead, onBack }) {
    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <Card noPadding className="bg-white">
                <div className="p-6 flex items-start justify-between border-b border-gray-100">
                    <div className="flex items-center gap-5">
                        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors border border-gray-200 mr-2">
                            <ArrowRight className="w-5 h-5 rotate-180" />
                        </button>
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#6F4BFF] to-purple-400 text-white flex items-center justify-center text-xl font-bold shadow-md">{lead.name.charAt(0)}</div>
                        <div>
                            <div className="flex items-center gap-3"><h2 className="text-2xl font-bold text-gray-900">{lead.name}</h2><Badge variant={lead.score === 'Hot' ? 'red' : 'purple'}>{lead.score} Lead</Badge>{getStatusBadge(lead.status)}</div>
                            <div className="flex gap-4 mt-2 text-sm text-gray-600 font-medium"><span className="flex items-center gap-1.5"><PhoneCall className="w-4 h-4 text-gray-400" /> {lead.phone}</span></div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    )
}

function ClientsView({ navigateTo }) {
    const [isAddClientOpen, setIsAddClientOpen] = useState(false);
    return (
        <>
            <Card noPadding>
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
                    <div><h2 className="text-xl font-bold text-gray-800">Active Clients Hub</h2></div>
                    <Button icon={Plus} onClick={() => setIsAddClientOpen(true)}>New Client</Button>
                </div>
                <Table
                    headers={['Client Info', 'Requirement', 'Pipeline Status', 'Assigned To', '']}
                    data={mockClients}
                    renderRow={(row, i) => (
                        <tr key={i} onClick={() => navigateTo('Clients Hub', row)} className="hover:bg-[#6F4BFF]/5 transition-colors cursor-pointer group">
                            <td className="px-6 py-4">
                                <div className="font-bold text-gray-900 group-hover:text-[#6F4BFF] transition-colors">{row.name}</div>
                                <div className="text-xs text-gray-500">{row.phone}</div>
                            </td>
                            <td className="px-6 py-4"><div className="text-sm font-bold text-gray-700">{row.budget}</div></td>
                            <td className="px-6 py-4">
                                <div className="flex gap-1.5">
                                    {row.propertyPipeline.map((p, idx) => {
                                        let v = 'gray';
                                        if (p.status === 'Shortlisted') v = 'purple';
                                        if (p.status === 'Visited') v = 'blue';
                                        if (p.status === 'Negotiating') v = 'amber';
                                        return <div key={idx} className={`w-3 h-3 rounded-full bg-${v}-400 shadow-sm`} title={`${p.projectId}: ${p.status}`}></div>
                                    })}
                                </div>
                                <span className="text-xs text-gray-500 mt-1 block">{row.propertyPipeline.length} properties</span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700">{row.officer}</td>
                            <td className="px-6 py-4 text-right"><ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#6F4BFF]" /></td>
                        </tr>
                    )}
                />
            </Card>
            <Modal isOpen={isAddClientOpen} onClose={() => setIsAddClientOpen(false)} title="Register New Client">
                <form onSubmit={(e) => { e.preventDefault(); setIsAddClientOpen(false); }}>
                    <div className="pt-4 flex justify-end gap-3"><Button type="submit">Create</Button></div>
                </form>
            </Modal>
        </>
    );
}

// -----------------------------------------------------
// NEW UNIFIED CLIENT PROFILE HUB
// -----------------------------------------------------
function ClientProfileView({ client, projects, onBack }) {
    const [activeTab, setActiveTab] = useState('Overview & Pipeline');

    const [localClient, setLocalClient] = useState({
        ...client,
        timeline: client.timeline || [],
        notes: client.notes || [],
        meetings: client.meetings || []
    });

    const [newNote, setNewNote] = useState('');
    const [meetingForm, setMeetingForm] = useState({ date: '', time: '', remarks: '' });
    const [assignedOfficer, setAssignedOfficer] = useState('');
    const [selectedProps, setSelectedProps] = useState([]);
    const [assignmentSuccess, setAssignmentSuccess] = useState(false);

    const getProject = (id) => projects.find(p => p.id === id);
    const clientVisits = mockVisits.filter(v => v.customerName === client.name);

    const getNowStrings = () => {
        const now = new Date();
        const dateStr = now.toLocaleDateString('en-GB');
        const timeStr = now.toLocaleTimeString('en-US', { hour12: false });
        const shortTimeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        return { dateStr, timeStr, shortTimeStr };
    };

    const handleAddNote = () => {
        if (!newNote) return;
        const { dateStr, shortTimeStr } = getNowStrings();
        const note = { text: newNote, date: dateStr, time: shortTimeStr };
        const timelineEvent = { title: 'Internal Note Added', details: newNote.substring(0, 30) + '...', date: dateStr, time: shortTimeStr };
        setLocalClient(prev => ({ ...prev, notes: [note, ...prev.notes], timeline: [timelineEvent, ...prev.timeline] }));
        setNewNote('');
    };

    const handleSaveMeeting = () => {
        if (!meetingForm.date) return;
        const { dateStr, shortTimeStr } = getNowStrings();
        const timelineEvent = { title: 'Meeting Scheduled', details: `For ${meetingForm.date} at ${meetingForm.time}`, date: dateStr, time: shortTimeStr };
        setLocalClient(prev => ({ ...prev, meetings: [meetingForm, ...prev.meetings], timeline: [timelineEvent, ...prev.timeline] }));
        setMeetingForm({ date: '', time: '', remarks: '' });
    };

    const toggleProperty = (id) => {
        if (selectedProps.includes(id)) setSelectedProps(selectedProps.filter(pid => pid !== id));
        else setSelectedProps([...selectedProps, id]);
    };

    const handleAssignSubmit = () => {
        if (!assignedOfficer || selectedProps.length === 0) return;
        setAssignmentSuccess(true);

        // Simulate updating pipeline
        const newPipelineItems = selectedProps.map(pid => ({ projectId: pid, status: 'Shown', units: [], visitedOn: null, notes: 'Newly assigned' }));
        const { dateStr, shortTimeStr } = getNowStrings();
        const timelineEvent = { title: 'Properties Assigned', details: `${selectedProps.length} properties assigned to ${assignedOfficer}`, date: dateStr, time: shortTimeStr };

        setTimeout(() => {
            setLocalClient(prev => ({
                ...prev,
                propertyPipeline: [...newPipelineItems, ...prev.propertyPipeline],
                timeline: [timelineEvent, ...prev.timeline]
            }));
            setAssignmentSuccess(false);
            setSelectedProps([]);
            setAssignedOfficer('');
            setActiveTab('Overview & Pipeline');
        }, 1500);
    };

    const tabs = ['Overview & Pipeline', 'Assign Properties', 'Follow-up & Notes', 'Site Visits', 'Meetings'];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">

            {/* CLIENT HEADER */}
            <Card noPadding className="bg-gradient-to-r from-white to-[#6F4BFF]/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                    <button onClick={onBack} className="p-2 hover:bg-white/60 rounded-lg text-gray-500 transition-colors backdrop-blur-sm border border-gray-200">
                        <ArrowRight className="w-5 h-5 rotate-180" />
                    </button>
                </div>
                <div className="p-8 flex items-start justify-between">
                    <div className="flex gap-5">
                        <div className="w-16 h-16 rounded-2xl bg-[#6F4BFF] text-white flex items-center justify-center text-2xl font-bold shadow-lg shadow-[#6F4BFF]/20">
                            {localClient.name.charAt(0)}
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h2 className="text-2xl font-bold text-gray-900">{localClient.name}</h2>
                                <Badge variant={localClient.status === 'Negotiating' ? 'yellow' : 'green'}>{localClient.status}</Badge>
                            </div>
                            <p className="text-gray-500 font-medium flex items-center gap-3">
                                <span className="flex items-center gap-1"><PhoneCall className="w-3.5 h-3.5" /> {localClient.phone}</span>
                                <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> Officer: {localClient.officer}</span>
                            </p>
                            <div className="flex gap-2 mt-3">
                                <Badge variant="gray">{localClient.req.type}</Badge>
                                {localClient.req.bhk.map(b => <Badge key={b} variant="gray">{b}</Badge>)}
                            </div>
                        </div>
                    </div>
                    <div className="text-right mt-6 mr-10">
                        <p className="text-sm text-gray-500 font-semibold mb-1">Approved Budget</p>
                        <p className="text-3xl font-bold text-emerald-600">{localClient.budget}</p>
                    </div>
                </div>
            </Card>

            {/* HUB TABS */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex overflow-x-auto border-b border-gray-200 hide-scrollbar bg-gray-50/50">
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`whitespace-nowrap px-6 py-4 font-bold text-sm transition-colors border-b-2 ${activeTab === tab ? 'border-[#6F4BFF] text-[#6F4BFF] bg-white' : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="p-6 md:p-8 bg-gray-50/30 min-h-[500px]">

                    {/* 1. OVERVIEW & PIPELINE */}
                    {activeTab === 'Overview & Pipeline' && (
                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 animate-in fade-in">
                            <div className="space-y-6 xl:col-span-1">
                                <Card className="p-6">
                                    <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
                                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2"><Search className="w-5 h-5 text-[#6F4BFF]" /> Requirement Profile</h3>
                                        <Button variant="ghost" className="text-xs px-2 py-1 h-auto text-gray-400">Edit</Button>
                                    </div>
                                    <div className="space-y-4">
                                        <div><p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Preferred Locations</p><p className="font-semibold text-gray-800">{localClient.req.loc.join(' • ')}</p></div>
                                        <div><p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Property Type</p><p className="font-semibold text-gray-800">{localClient.req.type} ({localClient.req.bhk.join(', ')})</p></div>
                                        <div><p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Timeline</p><p className="font-semibold text-gray-800">{localClient.req.timeline}</p></div>
                                    </div>
                                </Card>
                            </div>

                            <div className="xl:col-span-2">
                                <Card noPadding className="h-full flex flex-col">
                                    <div className="p-6 border-b border-gray-100 bg-white flex justify-between items-center">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2"><Navigation className="w-5 h-5 text-[#6F4BFF]" /> Client Property Pipeline</h3>
                                            <p className="text-sm text-gray-500 mt-1">Track all projects assigned and their current status.</p>
                                        </div>
                                        <Button icon={Plus} onClick={() => setActiveTab('Assign Properties')}>Assign More</Button>
                                    </div>
                                    <div className="flex-1 p-6 bg-gray-50/50">
                                        <div className="space-y-4">
                                            {localClient.propertyPipeline.map((pipelineItem, i) => {
                                                const project = getProject(pipelineItem.projectId);
                                                if (!project) return null;
                                                let statusBg = 'bg-gray-100 text-gray-600';
                                                let borderClass = 'border-gray-200';
                                                let StatusIcon = Eye;
                                                switch (pipelineItem.status) {
                                                    case 'Shortlisted': borderClass = 'border-purple-200 shadow-sm'; statusBg = 'bg-purple-100 text-[#6F4BFF]'; StatusIcon = Heart; break;
                                                    case 'Visited': borderClass = 'border-blue-200 shadow-sm'; statusBg = 'bg-blue-100 text-blue-700'; StatusIcon = MapPin; break;
                                                    case 'Negotiating': borderClass = 'border-amber-200 shadow-sm'; statusBg = 'bg-amber-100 text-amber-700'; StatusIcon = TrendingUp; break;
                                                    case 'Not Interested': borderClass = 'border-gray-200 opacity-60'; statusBg = 'bg-gray-100 text-gray-500'; StatusIcon = ThumbsDown; break;
                                                    default: break;
                                                }
                                                return (
                                                    <div key={i} className={`bg-white rounded-xl border p-5 transition-all ${borderClass}`}>
                                                        <div className="flex items-start justify-between mb-4">
                                                            <div className="flex gap-4">
                                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${statusBg}`}><StatusIcon className="w-5 h-5" /></div>
                                                                <div>
                                                                    <div className="flex items-center gap-2 mb-1">
                                                                        <h4 className="text-lg font-bold text-gray-900">{project.name}</h4>
                                                                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider ${statusBg}`}>{pipelineItem.status}</span>
                                                                    </div>
                                                                    <p className="text-sm text-gray-500">{project.location}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                                                            <div><p className="text-xs font-bold text-gray-400 uppercase mb-1">Target Units</p><p className="font-semibold text-gray-800 text-sm">{pipelineItem.units.length ? pipelineItem.units.join(', ') : 'Not specified'}</p></div>
                                                            <div><p className="text-xs font-bold text-gray-400 uppercase mb-1">Project Price</p><p className="font-semibold text-gray-800 text-sm">{project.priceRange}</p></div>
                                                            <div><p className="text-xs font-bold text-gray-400 uppercase mb-1">Latest Update</p><p className="font-semibold text-gray-800 text-sm line-clamp-1">{pipelineItem.notes}</p></div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                            {localClient.propertyPipeline.length === 0 && <p className="text-center text-gray-500 py-10 font-medium">No properties assigned yet.</p>}
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    )}

                    {/* 2. ASSIGN PROPERTIES (Customer Requirement Integrated) */}
                    {activeTab === 'Assign Properties' && (
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
                                    Properties successfully assigned to {assignedOfficer || localClient.officer} and sent to the client's app! Updating pipeline...
                                </div>
                            )}

                            <Card className="p-6 mb-8 border-t-4 border-t-[#6F4BFF]">
                                <div className="flex items-end justify-between gap-6">
                                    <div className="flex-1 max-w-md">
                                        <label className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2 block">Assign To Sales Officer</label>
                                        <select
                                            value={assignedOfficer}
                                            onChange={(e) => setAssignedOfficer(e.target.value)}
                                            className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 font-medium text-gray-900 bg-white"
                                        >
                                            <option value="">Select Officer (Default: {localClient.officer})</option>
                                            <option value="Neha K.">Neha K.</option>
                                            <option value="Rahul M.">Rahul M.</option>
                                            <option value="Manas Gangrade">Manas Gangrade</option>
                                        </select>
                                    </div>
                                    <button
                                        onClick={handleAssignSubmit}
                                        disabled={selectedProps.length === 0}
                                        className="bg-[#6F4BFF] hover:bg-[#5936eb] text-white px-8 py-3 rounded-lg font-bold shadow-md disabled:opacity-50 transition-all flex items-center gap-2"
                                    >
                                        <Navigation className="w-4 h-4" /> Dispatch to App
                                    </button>
                                </div>
                            </Card>

                            <div className="flex justify-between items-end mb-4">
                                <h4 className="text-lg font-bold text-gray-900">Available Properties</h4>
                                <span className="text-sm font-bold text-gray-600 bg-white px-3 py-1 rounded-lg border border-gray-200 shadow-sm">Selected: <span className="text-[#6F4BFF] text-lg ml-1">{selectedProps.length}</span></span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {projects.map(p => {
                                    const isSelected = selectedProps.includes(p.id);
                                    // Highlight recommended
                                    const isRecommended = p.priceRange.includes('Cr') && localClient.budget.includes('Cr');

                                    return (
                                        <Card key={p.id} noPadding className={`relative border-2 transition-all cursor-pointer ${isSelected ? 'border-[#6F4BFF] shadow-md ring-2 ring-[#6F4BFF]/20 bg-purple-50/10' : 'border-gray-200 hover:border-[#6F4BFF]/50'}`}>
                                            <div className="absolute top-4 right-4 z-20" onClick={() => toggleProperty(p.id)}>
                                                <div className={`w-6 h-6 rounded flex items-center justify-center border-2 transition-colors ${isSelected ? 'bg-[#6F4BFF] border-[#6F4BFF] text-white' : 'bg-white border-gray-300'}`}>
                                                    {isSelected && <Check className="w-4 h-4" />}
                                                </div>
                                            </div>
                                            {isRecommended && <div className="absolute top-4 left-4 z-20"><Badge variant="green">98% Match</Badge></div>}

                                            <div className="flex gap-4 p-4 pt-12 items-start" onClick={() => toggleProperty(p.id)}>
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-gray-900 text-base capitalize mb-1">{p.name}</h4>
                                                    <p className="text-[11px] text-gray-500 font-medium flex items-start gap-1 mb-2"><MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" /> {p.location}</p>
                                                    <p className="text-sm font-bold text-gray-800">{p.priceRange}</p>
                                                </div>
                                            </div>
                                        </Card>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {/* 3. FOLLOW-UPS & NOTES */}
                    {activeTab === 'Follow-up & Notes' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in">
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-6"><MessageSquare className="w-5 h-5 text-[#6F4BFF]" /> Notes & Communication</h3>
                                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm mb-6 relative">
                                    <textarea rows="4" value={newNote} onChange={e => setNewNote(e.target.value)} placeholder="Log a call summary or add an internal note..." className="w-full border-none outline-none resize-none text-gray-800 font-medium"></textarea>
                                    <div className="flex justify-end mt-2 border-t border-gray-100 pt-3">
                                        <button onClick={handleAddNote} className="bg-[#6F4BFF] hover:bg-[#5936eb] text-white px-6 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm flex items-center gap-2"><Plus className="w-4 h-4" /> Add Note</button>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    {localClient.notes.map((n, i) => (
                                        <div key={i} className="bg-amber-50/80 border border-amber-200 p-4 rounded-xl shadow-sm">
                                            <p className="text-gray-800 font-medium text-sm">{n.text}</p>
                                            <p className="text-xs text-gray-500 mt-3 font-bold flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {n.date} at {n.time}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-6"><Activity className="w-5 h-5 text-emerald-500" /> Complete Timeline</h3>
                                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden p-2">
                                    {localClient.timeline.map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors rounded-lg">
                                            <div>
                                                <h4 className="font-bold text-gray-900 text-sm">{item.title}</h4>
                                                <p className="text-xs font-medium text-gray-500 mt-1">{item.details}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded">{item.date} {item.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                    {localClient.timeline.length === 0 && <p className="text-center text-gray-400 p-6 text-sm font-medium">No timeline events yet.</p>}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 4. SITE VISITS */}
                    {activeTab === 'Site Visits' && (
                        <div className="animate-in fade-in">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2"><MapPin className="w-5 h-5 text-rose-500" /> Property Site Visits</h3>
                                <Button icon={Calendar}>Schedule New Visit</Button>
                            </div>
                            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                                <Table
                                    headers={['Property', 'Date & Time', 'Officer', 'Status', 'Notes']}
                                    data={clientVisits}
                                    renderRow={(row, i) => (
                                        <tr key={i} className="hover:bg-gray-50">
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
                        </div>
                    )}

                    {/* 5. MEETINGS */}
                    {activeTab === 'Meetings' && (
                        <div className="animate-in fade-in max-w-4xl">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-6">
                                <Users className="w-5 h-5 text-blue-600" /> Meetings Log
                            </h3>
                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div><label className="text-xs font-bold text-gray-700">Meeting Date</label><input type="date" value={meetingForm.date} onChange={e => setMeetingForm({ ...meetingForm, date: e.target.value })} className="w-full mt-2 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 bg-white" /></div>
                                    <div><label className="text-xs font-bold text-gray-700">Meeting Time</label><input type="time" value={meetingForm.time} onChange={e => setMeetingForm({ ...meetingForm, time: e.target.value })} className="w-full mt-2 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 bg-white" /></div>
                                </div>
                                <div className="mb-6"><label className="text-xs font-bold text-gray-700">Meeting Remarks</label><textarea rows="3" value={meetingForm.remarks} onChange={e => setMeetingForm({ ...meetingForm, remarks: e.target.value })} className="w-full mt-2 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 bg-white"></textarea></div>
                                <div className="flex justify-end"><Button onClick={handleSaveMeeting} className="bg-[#6F4BFF] hover:bg-[#5936eb] text-white">Save Meeting</Button></div>
                            </div>

                            <div className="space-y-3">
                                <h4 className="font-bold text-gray-800 mb-4">Past & Upcoming Meetings</h4>
                                {localClient.meetings.map((m, i) => (
                                    <div key={i} className="bg-white p-5 border border-gray-200 rounded-xl flex justify-between items-center shadow-sm">
                                        <div>
                                            <p className="font-bold text-gray-900 text-lg flex items-center gap-2"><Calendar className="w-4 h-4 text-gray-400" /> {m.date} <span className="text-gray-400 text-sm font-medium ml-2">{m.time}</span></p>
                                            <p className="text-sm text-gray-600 mt-2 font-medium bg-gray-50 p-2 rounded-lg border border-gray-100">{m.remarks || 'No remarks added.'}</p>
                                        </div>
                                    </div>
                                ))}
                                {localClient.meetings.length === 0 && <p className="text-gray-500 font-medium">No meetings scheduled.</p>}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}

function CustomerRequirementsView({ navigateTo }) {
    const [localReqs, setLocalReqs] = useState(mockRequirements);

    const handleDelete = (id) => {
        setLocalReqs(localReqs.filter(r => r.id !== id));
    };

    return (
        <Card noPadding className="animate-in fade-in duration-300">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Customer Requirement List</h2>
                    <p className="text-sm text-gray-500 mt-1">Manage leads requirements and assign matched properties.</p>
                </div>
                <Button
                    className="bg-[#4CAF50] hover:bg-[#43A047] text-white shadow-sm font-bold"
                    onClick={() => navigateTo('Customer Requirements', { mode: 'ADD_EDIT', data: null })}
                >
                    Add Customer Requirement
                </Button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/80 border-b border-gray-100">
                            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">S NO</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">LISTING TYPE</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">LISTING KIND TYPE</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">PROPERTY TYPE</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">CUSTOMER NAME</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">CONTACT NUMBER</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">BUDGET</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">DATE</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">TIME SLOT</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">PROPERTY AVAILABLE</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">ACTION</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {localReqs.map((req, i) => (
                            <tr key={req.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4 text-sm font-medium text-gray-600 text-center">{i + 1}</td>
                                <td className="px-6 py-4 text-sm font-semibold text-gray-800">{req.listingType}</td>
                                <td className="px-6 py-4 text-sm font-medium text-gray-600">{req.listingKind}</td>
                                <td className="px-6 py-4 text-sm font-semibold text-gray-800">{req.propType}</td>
                                <td className="px-6 py-4 text-sm font-bold text-gray-800">{req.name}</td>
                                <td className="px-6 py-4 text-sm font-medium text-gray-600">{req.phone}</td>
                                <td className="px-6 py-4 text-sm font-medium text-gray-600">{req.budget}</td>
                                <td className="px-6 py-4 text-sm font-medium text-gray-600">{req.date}</td>
                                <td className="px-6 py-4 text-sm font-medium text-gray-600">{req.time}</td>
                                <td className="px-6 py-4 text-sm font-bold text-center text-gray-800">{req.propAvailable}</td>
                                <td className="px-6 py-4">
                                    <div className="flex justify-center items-center gap-2">
                                        <button
                                            onClick={() => navigateTo('Customer Requirements', { mode: 'ADD_EDIT', data: req })}
                                            className="w-8 h-8 rounded bg-[#03A9F4] text-white flex items-center justify-center hover:bg-[#039BE5] transition-colors shadow-sm"
                                            title="Edit"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(req.id)}
                                            className="w-8 h-8 rounded bg-[#F44336] text-white flex items-center justify-center hover:bg-[#E53935] transition-colors shadow-sm"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => navigateTo('Customer Requirements', { mode: 'ASSIGN', data: req })}
                                            className="px-3 py-1.5 rounded bg-[#03A9F4] text-white text-[11px] font-bold hover:bg-[#039BE5] transition-colors shadow-sm whitespace-nowrap"
                                        >
                                            Assign Property
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

function RequirementFormView({ req, onBack }) {
    const isEdit = !!req;

    return (
        <div className="space-y-6 animate-in fade-in duration-300 max-w-5xl mx-auto">
            <div className="flex items-center gap-4">
                <button onClick={onBack} className="p-2 bg-white hover:bg-gray-50 rounded-lg text-gray-600 transition-colors shadow-sm border border-gray-200">
                    <ArrowRight className="w-5 h-5 rotate-180" />
                </button>
                <h2 className="text-2xl font-bold text-gray-900">
                    {isEdit ? 'Edit Customer Requirement' : 'Add Customer Requirement'}
                </h2>
            </div>

            <Card className="p-8">
                <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onBack(); }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="text-xs font-bold text-gray-800 tracking-wider">Listing Type</label>
                            <select className="w-full mt-2 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 font-medium text-gray-900 bg-white">
                                <option value="Buy">Buy</option>
                                <option value="Rent">Rent</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-800 tracking-wider">Listing Kind Type</label>
                            <select className="w-full mt-2 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 font-medium text-gray-900 bg-white">
                                <option value="Residential">Residential</option>
                                <option value="Commercial">Commercial</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-800 tracking-wider">Property Type</label>
                            <select className="w-full mt-2 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 font-medium text-gray-900 bg-white">
                                <option value="APARTMENT/FLATS">APARTMENT/FLATS</option>
                                <option value="VILLA">VILLA / HOUSE</option>
                                <option value="PLOT">PLOT</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-800 tracking-wider">Property Sub Type</label>
                            <select className="w-full mt-2 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 font-medium text-gray-900 bg-white">
                                <option value="">Select Property Sub Type</option>
                                <option value="1BHK">1 BHK</option>
                                <option value="2BHK">2 BHK</option>
                                <option value="3BHK">3 BHK</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-800 tracking-wider">Customer Name</label>
                            <input type="text" defaultValue={req?.name || ''} className="w-full mt-2 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 font-medium text-gray-900" placeholder="e.g. mango" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-800 tracking-wider">Contact Number</label>
                            <input type="text" defaultValue={req?.phone || ''} className="w-full mt-2 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 font-medium text-gray-900" placeholder="e.g. 8225000092" />
                        </div>

                        <div className="md:col-span-2">
                            <label className="text-xs font-bold text-gray-800 tracking-wider mb-4 block">Budget Range</label>
                            <div className="px-2">
                                <div className="h-2 bg-gray-200 rounded-full relative w-full mb-3">
                                    <div className="absolute top-0 left-0 h-full bg-[#6F4BFF] rounded-full w-[60%]"></div>
                                    <div className="absolute top-1/2 -translate-y-1/2 left-[60%] w-4 h-4 bg-white border-2 border-[#6F4BFF] rounded-full shadow-sm cursor-pointer"></div>
                                </div>
                                <div className="flex justify-between items-center text-sm font-bold text-[#6F4BFF]">
                                    <span>₹ 1 L</span>
                                    <span className="text-[#4CAF50]">₹ 38.25 Cr</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-800 tracking-wider">Min Area (Optional)</label>
                            <input type="text" className="w-full mt-2 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 font-medium text-gray-900" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-800 tracking-wider">Max Area (Optional)</label>
                            <input type="text" className="w-full mt-2 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 font-medium text-gray-900" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="text-xs font-bold text-gray-800 tracking-wider">Area Unit (Optional)</label>
                            <select className="w-full md:w-1/2 mt-2 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 font-medium text-gray-900 bg-white">
                                <option value="sqft">Square Feet (Sq. ft)</option>
                                <option value="sqm">Square Meter (Sq. m)</option>
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <label className="text-xs font-bold text-gray-800 tracking-wider">Details (Optional)</label>
                            <textarea rows="3" className="w-full mt-2 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 font-medium text-gray-900"></textarea>
                        </div>

                        <div className="md:col-span-2 border-t border-gray-100 pt-6">
                            <label className="text-xs font-bold text-gray-800 tracking-wider mb-4 block">Locations</label>
                            <div className="flex flex-col md:flex-row gap-4 items-center">
                                <input type="text" defaultValue="687, Indore, Madhya Pradesh, 452001" className="flex-[2] w-full border border-gray-300 rounded-lg p-3 outline-none text-sm font-medium" />
                                <input type="text" defaultValue="22.7020963" className="flex-1 w-full border border-gray-300 rounded-lg p-3 outline-none text-sm font-medium" placeholder="Latitude" />
                                <input type="text" defaultValue="75.8651963" className="flex-1 w-full border border-gray-300 rounded-lg p-3 outline-none text-sm font-medium" placeholder="Longitude" />
                                <button type="button" className="px-4 py-3 bg-white border border-[#6F4BFF] text-[#6F4BFF] font-bold rounded-lg text-sm whitespace-nowrap hover:bg-purple-50">Open Map</button>
                            </div>
                            <button type="button" className="mt-4 px-4 py-2 border border-[#6F4BFF] text-[#6F4BFF] font-bold rounded-lg text-sm bg-white hover:bg-purple-50">
                                + Add More Location
                            </button>
                        </div>

                    </div>

                    <div className="pt-6 border-t border-gray-100 flex justify-end">
                        <Button type="submit" className="px-8 py-3 shadow-md" icon={Save}>Save Requirement</Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}

function AssignPropertyView({ req, onBack }) {
    const [assignedOfficer, setAssignedOfficer] = useState('');
    const [selectedProps, setSelectedProps] = useState([]);
    const [assignmentSuccess, setAssignmentSuccess] = useState(false);

    const toggleProperty = (id) => {
        if (selectedProps.includes(id)) {
            setSelectedProps(selectedProps.filter(pid => pid !== id));
        } else {
            setSelectedProps([...selectedProps, id]);
        }
    };

    const handleAssignSubmit = () => {
        if (!assignedOfficer) return;
        setAssignmentSuccess(true);
        setTimeout(() => {
            onBack();
        }, 2000);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center gap-4">
                <button onClick={onBack} className="p-2 bg-white hover:bg-gray-50 rounded-lg text-gray-600 transition-colors shadow-sm border border-gray-200">
                    <ArrowRight className="w-5 h-5 rotate-180" />
                </button>
                <h2 className="text-2xl font-bold text-gray-900">Assign Properties to Client & Officer</h2>
            </div>

            {assignmentSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-lg flex items-center gap-3 font-bold animate-in zoom-in-95 duration-200">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    Properties successfully assigned to {assignedOfficer} and sent to the client's app! Redirecting...
                </div>
            )}

            <Card className="p-6">
                <div className="flex justify-between items-start mb-6 border-b border-gray-100 pb-4">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Customer Requirement</h3>
                        <p className="text-base font-bold text-gray-800 mt-2">{req.name}</p>
                        <p className="text-sm font-medium text-gray-500 flex items-center gap-1.5 mt-1"><PhoneCall className="w-4 h-4" /> {req.phone}</p>
                    </div>
                    <div className="flex gap-3">
                        <span className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-bold uppercase">Listing Type: {req.listingType}</span>
                        <span className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-bold uppercase">Budget: {req.budget}</span>
                    </div>
                </div>

                <div className="flex items-end justify-between gap-6">
                    <div className="flex-1 max-w-md">
                        <label className="text-xs font-bold text-rose-500 uppercase tracking-wider mb-2 block">Assign Sales Man *</label>
                        <select
                            value={assignedOfficer}
                            onChange={(e) => setAssignedOfficer(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 font-medium text-gray-900 bg-white"
                        >
                            <option value="">Select Sales Officer</option>
                            <option value="manas (sales_officer)">manas (sales_officer)</option>
                            <option value="neha (sales_officer)">neha (sales_officer)</option>
                            <option value="rahul (sales_officer)">rahul (sales_officer)</option>
                        </select>
                    </div>
                    <button
                        onClick={handleAssignSubmit}
                        disabled={!assignedOfficer || selectedProps.length === 0}
                        className="bg-[#6F4BFF] hover:bg-[#5936eb] text-white px-8 py-3 rounded-lg font-bold shadow-md disabled:opacity-50 transition-all flex items-center gap-2"
                    >
                        <Navigation className="w-4 h-4" /> Dispatch to App
                    </button>
                </div>
            </Card>

            <div className="flex justify-between items-end mb-2">
                <h3 className="text-xl font-bold text-gray-900">Property List</h3>
                <span className="text-sm font-bold text-gray-600">Selected: <span className="text-[#6F4BFF] text-lg">{selectedProps.length}</span></span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockProjects.map(p => {
                    const isSelected = selectedProps.includes(p.id);
                    return (
                        <Card key={p.id} noPadding className={`relative border-2 transition-all cursor-pointer ${isSelected ? 'border-[#6F4BFF] shadow-md ring-2 ring-[#6F4BFF]/20' : 'border-gray-200 hover:border-[#6F4BFF]/50'}`}>
                            <div className="absolute top-4 right-4 z-20" onClick={() => toggleProperty(p.id)}>
                                <div className={`w-6 h-6 rounded flex items-center justify-center border-2 transition-colors ${isSelected ? 'bg-gray-900 border-gray-900 text-white' : 'bg-white border-gray-300'}`}>
                                    {isSelected && <Check className="w-4 h-4" />}
                                </div>
                            </div>

                            <div className="flex gap-4 p-4 items-start" onClick={() => toggleProperty(p.id)}>
                                <div className="w-20 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg shrink-0 flex items-center justify-center overflow-hidden relative">
                                    <ImageIcon className="w-6 h-6 text-gray-400" />
                                </div>

                                <div className="flex-1 pr-6">
                                    <h4 className="font-bold text-gray-900 text-base capitalize">{p.name}</h4>
                                    <p className="text-xs text-gray-500 mt-1 mb-2 line-clamp-1">{p.specs || 'No description available.'}</p>
                                    <p className="text-[11px] text-gray-500 font-medium flex items-start gap-1">
                                        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                                        <span className="line-clamp-2">{p.location}</span>
                                    </p>

                                    <div className="mt-3">
                                        <button className="text-[#6F4BFF] border border-[#6F4BFF] bg-white hover:bg-purple-50 px-4 py-1.5 rounded-lg text-xs font-bold transition-colors">
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}

function ProjectsView({ navigateTo }) {
    // Existing ProjectsView (unchanged)
    const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);

    return (
        <>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Project Inventory</h2>
                        <p className="text-gray-500 mt-1">Manage builders, projects, and unit configurations.</p>
                    </div>
                    <Button icon={Plus} onClick={() => setIsAddProjectOpen(true)}>Add Project</Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mockProjects.map((p, i) => (
                        <Card key={i} noPadding className="group cursor-pointer hover:border-[#6F4BFF]/40 hover:shadow-lg transition-all flex flex-col" >
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

            <Modal isOpen={isAddProjectOpen} onClose={() => setIsAddProjectOpen(false)} title="Onboard New Project">
                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setIsAddProjectOpen(false); }}>
                    {/* Form simplified for brevity in this iteration */}
                    <div className="pt-4 border-t border-gray-100 flex justify-end gap-3 mt-6">
                        <Button variant="secondary" onClick={() => setIsAddProjectOpen(false)}>Cancel</Button>
                        <Button type="submit" icon={Building2}>Submit to Admin Review</Button>
                    </div>
                </form>
            </Modal>
        </>
    )
}

function ProjectDetailView({ project, onBack }) {
    // Existing ProjectDetailView (unchanged)
    const [activeTab, setActiveTab] = useState('inventory');
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 hover:bg-white rounded-lg text-gray-500 transition-colors shadow-sm bg-white/50">
                        <ArrowRight className="w-5 h-5 rotate-180" />
                    </button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl font-bold text-gray-900">{project.name}</h2>
                            {getStatusBadge(project.status)}
                        </div>
                    </div>
                </div>
            </div>
            <Card className="p-6"><h3 className="text-lg font-bold">Project configurations and data loaded successfully.</h3></Card>
        </div>
    );
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

function EnhancedVisitsView() {
    const [localVisits, setLocalVisits] = useState(mockVisits);
    const [selectedVisit, setSelectedVisit] = useState(mockVisits[0]);
    const [filter, setFilter] = useState('All');
    const [newNote, setNewNote] = useState('');

    const filteredVisits = localVisits.filter(v => {
        if (filter === 'All') return true;
        return v.status === filter;
    });

    const handleUpdateStatus = (id, newStatus) => {
        setLocalVisits(prev => prev.map(v => v.id === id ? { ...v, status: newStatus } : v));
        if (selectedVisit.id === id) {
            setSelectedVisit({ ...selectedVisit, status: newStatus });
        }
    };

    const handleAddNote = () => {
        if (!newNote.trim()) return;
        const updatedVisit = {
            ...selectedVisit,
            notes: selectedVisit.notes + `\n\n[Updated]: ${newNote}`
        };
        setLocalVisits(prev => prev.map(v => v.id === selectedVisit.id ? updatedVisit : v));
        setSelectedVisit(updatedVisit);
        setNewNote('');
    };

    return (
        <div className="flex flex-col lg:flex-row h-full gap-6 animate-in fade-in duration-300 min-h-[80vh]">
            <Card noPadding className="w-full lg:w-1/3 flex flex-col h-[80vh] border-gray-200 shadow-md shrink-0">
                <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-[#6F4BFF]" /> Visits Schedule
                    </h2>
                    <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
                        {['All', 'Scheduled', 'Completed', 'Cancelled'].map(f => (
                            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${filter === f ? 'bg-[#6F4BFF] text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{f}</button>
                        ))}
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50/30">
                    {filteredVisits.length === 0 ? (
                        <p className="text-center text-gray-400 text-sm font-medium mt-10">No visits found.</p>
                    ) : (
                        filteredVisits.map((visit) => {
                            const isSelected = selectedVisit?.id === visit.id;
                            let statusBorder = 'border-l-gray-300';
                            if (visit.status === 'Scheduled') statusBorder = 'border-l-purple-500';
                            if (visit.status === 'Completed') statusBorder = 'border-l-emerald-500';
                            if (visit.status === 'Cancelled') statusBorder = 'border-l-rose-500';
                            return (
                                <div key={visit.id} onClick={() => setSelectedVisit(visit)} className={`bg-white border-y border-r border-l-4 rounded-lg p-4 cursor-pointer transition-all ${statusBorder} ${isSelected ? 'ring-2 ring-[#6F4BFF]/20 shadow-md bg-purple-50/10' : 'border-gray-200 hover:shadow-sm'}`}>
                                    <div className="flex justify-between items-start mb-2"><p className="text-sm font-bold text-gray-900">{visit.customerName}</p><span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{visit.time}</span></div>
                                    <p className="text-xs text-gray-500 flex items-center gap-1.5 mb-2 font-medium"><Building2 className="w-3.5 h-3.5" /> {visit.property.name}</p>
                                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-50">
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-600"><div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[8px] uppercase">{visit.officerName.charAt(0)}</div>{visit.officerName}</div>
                                        {getStatusBadge(visit.status)}
                                    </div>
                                </div>
                            )
                        })
                    )}
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
                                <div className="flex items-center gap-3 mb-1"><h2 className="text-2xl font-bold text-gray-900">Visit #{selectedVisit.id}</h2>{getStatusBadge(selectedVisit.status)}</div>
                                <p className="text-sm font-medium text-gray-500 flex items-center gap-1.5"><Calendar className="w-4 h-4 text-gray-400" /> {selectedVisit.date} | <Clock className="w-4 h-4 text-gray-400 ml-2" /> {selectedVisit.time}</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {selectedVisit.status === 'Scheduled' && (
                                    <><Button variant="success" icon={CheckCircle2} onClick={() => handleUpdateStatus(selectedVisit.id, 'Completed')} className="shadow-sm">Complete</Button><Button variant="secondary" icon={Clock} className="shadow-sm border-gray-300 hover:bg-gray-100 text-gray-700">Reschedule</Button><Button variant="danger" icon={XCircle} onClick={() => handleUpdateStatus(selectedVisit.id, 'Cancelled')} className="shadow-sm">Cancel</Button></>
                                )}
                                {selectedVisit.status === 'Completed' && (<Button variant="primary" icon={TrendingUp} className="bg-emerald-600 hover:bg-emerald-700 shadow-md">Convert to Deal</Button>)}
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50 space-y-6">
                            {/* Detailed view elements mapping to selectedVisit */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm relative overflow-hidden group">
                                    <div className="flex items-start justify-between mb-4"><div className="flex items-center gap-3"><div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200 text-blue-600"><User className="w-6 h-6" /></div><div><p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Customer</p><h4 className="text-lg font-bold text-gray-900">{selectedVisit.customerName}</h4></div></div></div>
                                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100"><p className="font-semibold text-gray-700 flex items-center gap-2"><PhoneCall className="w-4 h-4 text-gray-400" /> {selectedVisit.customerPhone}</p></div>
                                </div>
                                <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm relative overflow-hidden group">
                                    <div className="flex items-start justify-between mb-4"><div className="flex items-center gap-3"><div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center border border-purple-200 text-purple-600"><HardHat className="w-6 h-6" /></div><div><p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Assigned Officer</p><h4 className="text-lg font-bold text-gray-900">{selectedVisit.officerName}</h4></div></div></div>
                                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100"><p className="font-semibold text-gray-700 flex items-center gap-2"><PhoneCall className="w-4 h-4 text-gray-400" /> {selectedVisit.officerPhone}</p></div>
                                </div>
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
                                        <div className="flex-1"><label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Add internal update</label><textarea value={newNote} onChange={(e) => setNewNote(e.target.value)} rows="2" className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 text-sm font-medium"></textarea></div>
                                        <Button onClick={handleAddNote} className="h-full px-6 shadow-sm">Save Note</Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
}

function DealsPipelineView({ navigateTo }) {
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
    // Same code for DealDetailView which works perfectly
    return (
        <Card className="p-6"><h2 className="text-2xl font-bold">Deal Data: {deal.dealCode}</h2><p className="mt-4">Click "Back" to return to Customer List.</p></Card>
    )
}

function PaymentsView() {
    return (
        <Card noPadding>
            <div className="p-6 border-b border-gray-100 bg-white">
                <h2 className="text-xl font-bold text-gray-800">Payment Tracking</h2>
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

function BuildersView() {
    return (
        <Card noPadding>
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Managed Builders</h2>
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

function OfficersView({ type }) {
    const data = [
        { name: 'Neha K.', city: 'Mumbai', count: 42, perf: 85 },
        { name: 'Ravi T.', city: 'Bangalore', count: 28, perf: 92 },
    ];

    return (
        <Card noPadding>
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">{type} Officers Directory</h2>
                </div>
                <Button icon={Plus}>Add Officer</Button>
            </div>
            <Table
                headers={['Name', 'City', 'Deals Handled', 'Performance', 'Profile']}
                data={data}
                renderRow={(row, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                        <td className="px-6 py-4 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center"><User className="w-4 h-4 text-[#6F4BFF]" /></div>
                            <span className="font-bold text-gray-900">{row.name}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{row.city}</td>
                        <td className="px-6 py-4 text-sm font-bold text-gray-700">{row.count}</td>
                        <td className="px-6 py-4 w-48">
                            <div className="flex items-center gap-2">
                                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div className={`h-full ${row.perf > 80 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${row.perf}%` }}></div>
                                </div>
                                <span className="text-xs font-bold text-gray-600">{row.perf}%</span>
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            <button className="text-sm text-[#6F4BFF] font-medium hover:underline">View Profile</button>
                        </td>
                    </tr>
                )}
            />
        </Card>
    )
}

function TasksView() {
    const tasks = [
        { id: 'T-1', title: 'Collect RERA docs from Apex Buildcon', assignee: 'Rahul M.', due: 'Today', status: 'Pending' },
    ];
    return (
        <Card noPadding>
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Task Management</h2>
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
        <div className="space-y-6 animate-in fade-in">
            <div className="grid grid-cols-2 gap-6">
                <Card className="p-6 h-80 flex flex-col">
                    <h3 className="text-lg font-bold text-gray-800 mb-6">Revenue Trends</h3>
                </Card>
            </div>
        </div>
    )
}

function SettingsView() {
    return (
        <div className="max-w-3xl animate-in fade-in">
            <Card className="p-0 overflow-hidden divide-y divide-gray-100">
                <div className="p-6 bg-gray-50/50">
                    <h3 className="text-lg font-bold text-gray-800">Platform Settings</h3>
                </div>
            </Card>
        </div>
    )
}

function UserListView({ navigateTo }) {
    const [localUsers, setLocalUsers] = useState(mockUsers);

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
                            </div>
                        </td>
                    </tr>
                )}
            />
        </Card>
    )
}

function UserEditView({ user, onBack }) {
    const [docStatus, setDocStatus] = useState(user.docStatus);

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
            <div className="aspect-[4/3] bg-gray-100 relative group flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 opacity-50"></div>
                <ImageIcon className="w-12 h-12 text-gray-400 z-10" />
            </div>
        </div>
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
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