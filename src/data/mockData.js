import { Zap, IndianRupee, Globe, Users } from 'lucide-react';

export const mockProjects = [
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
];

export const mockLeads = [
    {
        id: 'L001', name: 'Karan Malhotra', phone: '+91 9876543210', email: 'karan.m@gmail.com', budget: '1.5 Cr - 2 Cr', req: 'Residential, 3BHK', location: 'Mumbai', status: 'Follow Up', officer: 'Neha K.', date: '12 Apr', score: 'Hot',
        timeline: [{ type: 'Call', date: '12 Apr, 10:30 AM', note: 'Initial inquiry call.', agent: 'Neha K.' }],
        nextAction: 'Confirm site visit timing', nextActionDate: '15 Apr 2026'
    },
    {
        id: 'L002', name: 'Swati Jain', phone: '+91 9876543211', email: 'swati.jain99@yahoo.com', budget: '50 L - 90 L', req: 'Plot / Villa', location: 'Bangalore', status: 'New', officer: 'Ravi T.', date: '11 Apr', score: 'Warm',
        timeline: [{ type: 'System', date: '11 Apr, 09:15 AM', note: 'Lead captured via Ad.', agent: 'System' }],
        nextAction: 'First Contact Call', nextActionDate: 'Today'
    },
];

export const mockClients = [
    {
        id: 'C001', name: 'Vikash Singh', phone: '+91 9876543212', budget: '3 Cr - 5 Cr',
        listingType: 'Buy', listingKind: 'Residential', propType: 'APARTMENT/FLATS', date: '10/04/26', time: '11:00 - 12:00 PM',
        req: { type: 'Residential', bhk: ['3BHK', '4BHK'], loc: ['Chennai', 'ECR'], timeline: '30 Days' },
        status: 'Active', officer: 'Neha K.',
        propertyPipeline: [
            { projectId: 'P004', status: 'Shortlisted', units: ['4BHK'], visitedOn: '10 Apr', notes: 'Loved the sea view.' },
            { projectId: 'P001', status: 'Shown', units: ['3BHK', '4BHK'], visitedOn: null, notes: 'Sent brochure via WhatsApp' }
        ],
        timeline: [{ title: 'Client Qualified', details: 'Moved from Lead to Active Client', date: '08/04/2026', time: '04:30 PM' }],
        notes: [], meetings: []
    }
];

export const mockDeals = [
    {
        dealCode: 'D0007', customer: 'Geheve', property: 'Testing', city: 'Indore', salesOfficer: 'Sales Officer', broker: 'Anil', status: 'FINALIZED', createdOn: '07/03/26',
        customerPhone: '9165993939', brokerMobile: '9165993939', salesOfficerMobile: '9302569085',
        prefLocation: 'Harda, Madhya Pradesh, India', propType: 'APARTMENT/FLATS', address: 'Indore, Madhya Pradesh', khasra: '', expectPrice: 1000000, negotiationPrice: 2000000, remainingBalance: 984900,
        payments: [{ id: 1, milestone: 'Booking', amount: 10000, dueDate: '2026-03-09', mode: 'Cash', updated: '-', status: 'COMPLETED', date: '2026-03-09', time: '01:39 PM', remarks: 'Milestone Completed' }],
        timeline: [], notes: [], meetings: [], documents: []
    },
];

export const mockRequirements = [
    { id: 'CR1', name: 'Mango', phone: '8225000092', budget: '1 L - 3 Cr', date: '05/04/26', time: '10:00 - 11:00', propAvailable: 2, listingType: 'Buy', listingKind: 'Residential', propType: 'APARTMENT/FLATS' },
];

export const mockUsers = [
    { id: 'U001', name: 'Rizwan Khan', type: 'Sales_officer', phone: '9424654160', docStatus: 'Approved' },
    { id: 'U002', name: 'SquarFT106', type: 'Field_officer', phone: '8224000106', docStatus: 'Pending' },
];

export const mockVisits = [
    { id: 'V001', officerName: 'Manas', officerPhone: '7691962521', customerName: 'Vikash Singh', customerPhone: '8225000092', purpose: 'BUY', date: '05/04/26', time: '10:00 - 11:00 AM', status: 'Scheduled', property: { name: 'Skyline Residency', type: 'APARTMENT/FLATS', config: '3BHK Premium', address: 'Andheri West, Mumbai', price: '₹ 1.85 Cr' }, notes: 'Client highly interested.' },
];

export const mockBranches = [
    { id: 'B01', name: 'Indore Headquarters', head: 'Manas Gangrade', type: 'Head Office', activeDeals: 142, revenue: '12.4 Cr', status: 'Active', target: 85 },
    { id: 'B02', name: 'Mumbai MMR Hub', head: 'Rahul M.', type: 'Regional Branch', activeDeals: 86, revenue: '8.2 Cr', status: 'Active', target: 60 },
    { id: 'B03', name: 'Bangalore Tech Park', head: 'Sneha P.', type: 'Satellite Office', activeDeals: 45, revenue: '3.1 Cr', status: 'Active', target: 45 },
    { id: 'B04', name: 'Pune Setup', head: '-', type: 'Satellite Office', activeDeals: 0, revenue: '0', status: 'Setup Pending', target: 0 },
];

export const dashboardMetrics = [
    { 
        title: 'Global Active Leads', 
        value: '3,450', 
        trend: '+18.5%', 
        isUp: true, 
        icon: Zap, 
        color: 'text-[#6F4BFF]', 
        bg: 'bg-[#6F4BFF]/10', 
        chartColor: '#6F4BFF', 
        svgPath: 'M0,20 Q10,15 20,25 T40,10 T60,20 T80,5 T100,15 L100,30 L0,30 Z' 
    },
    { 
        title: 'Total Realized Revenue', 
        value: '₹24.8 Cr', 
        trend: '+32.4%', 
        isUp: true, 
        icon: IndianRupee, 
        color: 'text-emerald-500', 
        bg: 'bg-emerald-50', 
        chartColor: '#10B981', 
        svgPath: 'M0,25 Q20,20 30,10 T60,15 T80,5 T100,0 L100,30 L0,30 Z' 
    },
    { 
        title: 'Active Branches', 
        value: '4', 
        trend: 'Expanding', 
        isUp: true, 
        icon: Globe, 
        color: 'text-blue-500', 
        bg: 'bg-blue-50', 
        chartColor: '#3B82F6', 
        svgPath: 'M0,25 Q15,5 30,15 T60,10 T80,20 T100,5 L100,30 L0,30 Z' 
    },
    { 
        title: 'Registered Users', 
        value: '142', 
        trend: '+12', 
        isUp: true, 
        icon: Users, 
        color: 'text-amber-500', 
        bg: 'bg-amber-50', 
        chartColor: '#F59E0B', 
        svgPath: 'M0,10 Q20,15 40,5 T70,25 T100,15 L100,30 L0,30 Z' 
    },
];

export const roleDistribution = [
    { role: 'Sales Officers', count: 85, color: 'bg-[#6F4BFF]' },
    { role: 'Field Officers', count: 32, color: 'bg-blue-500' },
    { role: 'Registered Brokers', count: 20, color: 'bg-amber-500' },
    { role: 'Branch Managers', count: 4, color: 'bg-rose-500' },
    { role: 'Super Admins', count: 1, color: 'bg-gray-800' }
];

export const adminMetrics = [
    { 
        title: 'Active Leads', 
        value: '1,240', 
        trend: '+12.5%', 
        isUp: true, 
        icon: Zap, 
        color: 'text-[#6F4BFF]', 
        bg: 'bg-[#6F4BFF]/10', 
        chartColor: '#6F4BFF', 
        svgPath: 'M0,20 Q10,15 20,25 T40,10 T60,20 T80,5 T100,15 L100,30 L0,30 Z' 
    },
    { 
        title: 'Total Revenue', 
        value: '₹8.4 Cr', 
        trend: '+15.4%', 
        isUp: true, 
        icon: IndianRupee, 
        color: 'text-emerald-500', 
        bg: 'bg-emerald-50', 
        chartColor: '#10B981', 
        svgPath: 'M0,25 Q20,20 30,10 T60,15 T80,5 T100,0 L100,30 L0,30 Z' 
    },
    { 
        title: 'Assigned Branches', 
        value: '2', 
        trend: 'Stable', 
        isUp: true, 
        icon: Globe, 
        color: 'text-blue-500', 
        bg: 'bg-blue-50', 
        chartColor: '#3B82F6', 
        svgPath: 'M0,25 Q15,5 30,15 T60,10 T80,20 T100,5 L100,30 L0,30 Z' 
    },
    { 
        title: 'Team Members', 
        value: '24', 
        trend: '+2', 
        isUp: true, 
        icon: Users, 
        color: 'text-amber-500', 
        bg: 'bg-amber-50', 
        chartColor: '#F59E0B', 
        svgPath: 'M0,10 Q20,15 40,5 T70,25 T100,15 L100,30 L0,30 Z' 
    },
];

export const adminRoleDistribution = [
    { role: 'Sales Officers', count: 18, color: 'bg-[#6F4BFF]' },
    { role: 'Field Officers', count: 6, color: 'bg-blue-500' },
];

export const rolesList = ['Super Admin', 'Branch Manager', 'Sales Officer', 'Field Officer', 'Broker'];

export const permissionModules = [
    { name: 'Lead Pipeline', read: true, write: true, delete: false },
    { name: 'Client Profiles', read: true, write: true, delete: false },
    { name: 'Property Inventory', read: true, write: false, delete: false },
    { name: 'Deal Management', read: true, write: true, delete: false },
    { name: 'Payment Approvals', read: false, write: false, delete: false },
    { name: 'User Management', read: false, write: false, delete: false },
];

