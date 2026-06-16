import { Zap, IndianRupee, Globe, Users, Briefcase } from 'lucide-react';

export const mockProjects = [
    {
        id: 'P001', name: 'Skyline Residency', builder: 'Apex Buildcon', location: 'Andheri West, Mumbai', priceRange: '1.2 Cr - 2.5 Cr', configs: ['2BHK', '3BHK', '4BHK'], status: 'Active', units: 120, available: 45, progress: 100, officer: 'Rahul M.', updated: '2 hours ago', specs: 'Premium Residential', docs: 4, addedBy: 'builder',
        builderProfile: {
            fullName: 'Arjun Mehra',
            phone: '+91 98231 44001',
            location: 'Mumbai, Maharashtra',
            companyName: 'Apex Buildcon',
            companyType: 'Builder',
            reraNumber: 'MHRERA-P51800044791',
            builderType: 'Developer Company',
            brandName: 'Apex Living',
            gstNumber: '27AAGCA4455K1ZQ',
            panNumber: 'AAGCA4455K',
            establishedYear: '2012',
            about: 'Premium residential developer focused on mid-to-luxury apartment communities across Mumbai.',
        },
        inventory: [
            { type: '2BHK Classic', size: '1,100 Sq.Ft', basePrice: '1.20 Cr', totalUnits: 60, availableUnits: 12 },
            { type: '3BHK Premium', size: '1,550 Sq.Ft', basePrice: '1.85 Cr', totalUnits: 40, availableUnits: 25 },
            { type: '4BHK Luxury', size: '2,100 Sq.Ft', basePrice: '2.50 Cr', totalUnits: 20, availableUnits: 8 }
        ]
    },
    {
        id: 'P002', name: 'Green Valley Phase 2', builder: 'EcoHomes Ltd', location: 'HSR Layout, Bangalore', priceRange: '85 L - 1.5 Cr', configs: ['Villa Plots', '3BHK'], status: 'Active', units: 80, available: 12, progress: 100, officer: 'Sneha P.', updated: '1 day ago', specs: 'Villa Plots & Open Spaces', docs: 8, addedBy: 'broker',
        brokerProfile: {
            fullName: 'Karan Malhotra',
            phone: '+91 98765 44012',
            location: 'Bangalore, Karnataka',
            agencyName: 'Aarambh Realty',
            brokerType: 'Channel Partner',
            reraNumber: 'KA/RERA/AG/2024/01129',
            coverage: 'Bangalore, Chennai',
            verifiedAt: 'Verified 4 days ago',
            about: 'Broker partner handling plotted communities, villas, and luxury residential inventory across South India.',
        },
        inventory: [
            { type: '30x40 Plot', size: '1,200 Sq.Ft', basePrice: '85 Lacs', totalUnits: 50, availableUnits: 5 },
            { type: '40x60 Plot', size: '2,400 Sq.Ft', basePrice: '1.50 Cr', totalUnits: 30, availableUnits: 7 }
        ]
    },
    {
        id: 'P003', name: 'Metro Heights', builder: 'CityScape', location: 'Connaught Place, Delhi', priceRange: '3.5 Cr - 8 Cr', configs: ['Office Space', 'Retail'], status: 'In Review', units: 50, available: 5, progress: 60, officer: 'Rahul M.', updated: '3 days ago', specs: 'Premium Commercial', docs: 2, addedBy: 'builder',
        builderProfile: {
            fullName: 'Raghav Bansal',
            phone: '+91 98111 55220',
            location: 'Delhi NCR',
            companyName: 'CityScape',
            companyType: 'Builder',
            reraNumber: 'DLRERA2024P0058',
            builderType: 'Developer Company',
            brandName: 'CityScape Commercial',
            gstNumber: '07AAHCC2210Q1Z8',
            panNumber: 'AAHCC2210Q',
            establishedYear: '2009',
            about: 'Commercial real estate operator with retail and office assets in Delhi NCR.',
        },
        inventory: [
            { type: 'Retail Shop', size: '800 Sq.Ft', basePrice: '3.50 Cr', totalUnits: 20, availableUnits: 2 },
            { type: 'Office Space', size: '2,000 Sq.Ft', basePrice: '8.00 Cr', totalUnits: 30, availableUnits: 3 }
        ]
    },
    {
        id: 'P004', name: 'Ocean View Luxury', builder: 'Coastal Reality', location: 'ECR, Chennai', priceRange: '4.2 Cr - 6 Cr', configs: ['4BHK', 'Penthouse'], status: 'Approved', units: 30, available: 8, progress: 100, officer: 'Vikram S.', updated: '1 week ago', specs: 'Ultra Luxury Sea-facing', docs: 6, addedBy: 'broker',
        brokerProfile: {
            fullName: 'Karan Malhotra',
            phone: '+91 98765 44012',
            location: 'Bangalore, Karnataka',
            agencyName: 'Aarambh Realty',
            brokerType: 'Channel Partner',
            reraNumber: 'KA/RERA/AG/2024/01129',
            coverage: 'Bangalore, Chennai',
            verifiedAt: 'Verified 4 days ago',
            about: 'Broker partner handling plotted communities, villas, and luxury residential inventory across South India.',
        },
        inventory: [
            { type: '4BHK Seaview', size: '3,200 Sq.Ft', basePrice: '4.20 Cr', totalUnits: 25, availableUnits: 7 },
            { type: 'Penthouse', size: '5,500 Sq.Ft', basePrice: '6.00 Cr', totalUnits: 5, availableUnits: 1 }
        ]
    },
    {
        id: 'P005', name: 'Parkside Avenues', builder: 'Apex Buildcon', location: 'Andheri East, Mumbai', priceRange: '90 L - 1.8 Cr', configs: ['1BHK', '2BHK'], status: 'Pending', units: 200, available: 89, progress: 25, officer: 'Neha K.', updated: '5 hours ago', specs: 'Compact Modern Living', docs: 1, addedBy: 'builder',
        builderProfile: {
            fullName: 'Nisha Sethi',
            phone: '+91 98109 88210',
            location: 'Mumbai, Maharashtra',
            companyName: 'Apex Buildcon',
            companyType: 'Builder',
            reraNumber: 'MHRERA-P51800051342',
            builderType: 'Developer Company',
            brandName: 'Apex Smart Homes',
            gstNumber: '27AAGCA4455K1ZQ',
            panNumber: 'AAGCA4455K',
            establishedYear: '2012',
            about: 'Affordable compact living project under Apex Buildcon with shared compliance credentials.',
        },
        inventory: [
            { type: '1BHK Smart', size: '650 Sq.Ft', basePrice: '90 Lacs', totalUnits: 120, availableUnits: 40 },
            { type: '2BHK Classic', size: '950 Sq.Ft', basePrice: '1.45 Cr', totalUnits: 80, availableUnits: 49 }
        ]
    },
    // Additional properties for Apex Buildcon
    {
        id: 'P006', name: 'Sunrise Heights', builder: 'Apex Buildcon', location: 'Powai, Mumbai', priceRange: '1.8 Cr - 3.2 Cr', configs: ['2BHK', '3BHK'], status: 'Active', units: 150, available: 65, progress: 100, officer: 'Rahul M.', updated: '3 days ago', specs: 'Lake View Apartments', docs: 5, addedBy: 'builder',
        builderProfile: {
            fullName: 'Arjun Mehra',
            phone: '+91 98231 44001',
            location: 'Mumbai, Maharashtra',
            companyName: 'Apex Buildcon',
            companyType: 'Builder',
            reraNumber: 'MHRERA-P51800044791',
            builderType: 'Developer Company',
            brandName: 'Apex Living',
            gstNumber: '27AAGCA4455K1ZQ',
            panNumber: 'AAGCA4455K',
            establishedYear: '2012',
            about: 'Premium residential developer focused on mid-to-luxury apartment communities across Mumbai.',
        },
        inventory: [
            { type: '2BHK Lake View', size: '1,250 Sq.Ft', basePrice: '1.80 Cr', totalUnits: 90, availableUnits: 35 },
            { type: '3BHK Luxury', size: '1,750 Sq.Ft', basePrice: '2.65 Cr', totalUnits: 60, availableUnits: 30 }
        ]
    },
    {
        id: 'P007', name: 'Crystal Palace', builder: 'Apex Buildcon', location: 'Bandra West, Mumbai', priceRange: '2.5 Cr - 5 Cr', configs: ['3BHK', '4BHK', 'Penthouse'], status: 'Active', units: 80, available: 22, progress: 100, officer: 'Neha K.', updated: '1 day ago', specs: 'Ultra Luxury Apartments', docs: 7, addedBy: 'builder',
        builderProfile: {
            fullName: 'Arjun Mehra',
            phone: '+91 98231 44001',
            location: 'Mumbai, Maharashtra',
            companyName: 'Apex Buildcon',
            companyType: 'Builder',
            reraNumber: 'MHRERA-P51800044791',
            builderType: 'Developer Company',
            brandName: 'Apex Living',
            gstNumber: '27AAGCA4455K1ZQ',
            panNumber: 'AAGCA4455K',
            establishedYear: '2012',
            about: 'Premium residential developer focused on mid-to-luxury apartment communities across Mumbai.',
        },
        inventory: [
            { type: '3BHK Sea View', size: '1,950 Sq.Ft', basePrice: '2.80 Cr', totalUnits: 40, availableUnits: 12 },
            { type: '4BHK Premium', size: '2,800 Sq.Ft', basePrice: '4.20 Cr', totalUnits: 30, availableUnits: 8 },
            { type: 'Penthouse', size: '4,500 Sq.Ft', basePrice: '6.50 Cr', totalUnits: 10, availableUnits: 2 }
        ]
    },
    // Additional properties for CityScape
    {
        id: 'P008', name: 'Capital Square', builder: 'CityScape', location: 'Nehru Place, Delhi', priceRange: '2.5 Cr - 6 Cr', configs: ['Office Space', 'Retail'], status: 'Active', units: 75, available: 18, progress: 100, officer: 'Rahul M.', updated: '2 days ago', specs: 'Commercial Complex', docs: 6, addedBy: 'builder',
        builderProfile: {
            fullName: 'Raghav Bansal',
            phone: '+91 98111 55220',
            location: 'Delhi NCR',
            companyName: 'CityScape',
            companyType: 'Builder',
            reraNumber: 'DLRERA2024P0058',
            builderType: 'Developer Company',
            brandName: 'CityScape Commercial',
            gstNumber: '07AAHCC2210Q1Z8',
            panNumber: 'AAHCC2210Q',
            establishedYear: '2009',
            about: 'Commercial real estate operator with retail and office assets in Delhi NCR.',
        },
        inventory: [
            { type: 'Retail Shop', size: '600 Sq.Ft', basePrice: '2.50 Cr', totalUnits: 35, availableUnits: 8 },
            { type: 'Office Space', size: '1,500 Sq.Ft', basePrice: '5.50 Cr', totalUnits: 40, availableUnits: 10 }
        ]
    },
    {
        id: 'P009', name: 'Tech Hub Plaza', builder: 'CityScape', location: 'Cyber City, Gurgaon', priceRange: '4 Cr - 10 Cr', configs: ['Office Space'], status: 'Active', units: 60, available: 15, progress: 100, officer: 'Vikram S.', updated: '4 days ago', specs: 'Premium Office Spaces', docs: 8, addedBy: 'builder',
        builderProfile: {
            fullName: 'Raghav Bansal',
            phone: '+91 98111 55220',
            location: 'Delhi NCR',
            companyName: 'CityScape',
            companyType: 'Builder',
            reraNumber: 'DLRERA2024P0058',
            builderType: 'Developer Company',
            brandName: 'CityScape Commercial',
            gstNumber: '07AAHCC2210Q1Z8',
            panNumber: 'AAHCC2210Q',
            establishedYear: '2009',
            about: 'Commercial real estate operator with retail and office assets in Delhi NCR.',
        },
        inventory: [
            { type: 'Office Space Small', size: '1,200 Sq.Ft', basePrice: '4.00 Cr', totalUnits: 30, availableUnits: 8 },
            { type: 'Office Space Large', size: '2,500 Sq.Ft', basePrice: '9.50 Cr', totalUnits: 30, availableUnits: 7 }
        ]
    },
    // New Builder: GreenLeaf Developers
    {
        id: 'P010', name: 'Emerald Gardens', builder: 'GreenLeaf Developers', location: 'Whitefield, Bangalore', priceRange: '75 L - 1.2 Cr', configs: ['2BHK', '3BHK'], status: 'Active', units: 180, available: 92, progress: 100, officer: 'Sneha P.', updated: '1 day ago', specs: 'Eco-Friendly Apartments', docs: 6, addedBy: 'builder',
        builderProfile: {
            fullName: 'Priya Nair',
            phone: '+91 99801 33445',
            location: 'Bangalore, Karnataka',
            companyName: 'GreenLeaf Developers',
            companyType: 'Builder',
            reraNumber: 'PRM/KA/RERA/1251/309/PR/230526/006890',
            builderType: 'Developer Company',
            brandName: 'GreenLeaf',
            gstNumber: '29AAGCG5512P1Z9',
            panNumber: 'AAGCG5512P',
            establishedYear: '2015',
            about: 'Eco-friendly residential developer specializing in sustainable living communities across Bangalore.',
        },
        inventory: [
            { type: '2BHK Green', size: '1,050 Sq.Ft', basePrice: '75 Lacs', totalUnits: 100, availableUnits: 52 },
            { type: '3BHK Eco', size: '1,450 Sq.Ft', basePrice: '1.10 Cr', totalUnits: 80, availableUnits: 40 }
        ]
    },
    {
        id: 'P011', name: 'Nature View Villas', builder: 'GreenLeaf Developers', location: 'Sarjapur Road, Bangalore', priceRange: '1.5 Cr - 2.8 Cr', configs: ['Villa'], status: 'Active', units: 50, available: 18, progress: 100, officer: 'Amit K.', updated: '2 days ago', specs: 'Premium Eco Villas', docs: 5, addedBy: 'builder',
        builderProfile: {
            fullName: 'Priya Nair',
            phone: '+91 99801 33445',
            location: 'Bangalore, Karnataka',
            companyName: 'GreenLeaf Developers',
            companyType: 'Builder',
            reraNumber: 'PRM/KA/RERA/1251/309/PR/230526/006890',
            builderType: 'Developer Company',
            brandName: 'GreenLeaf',
            gstNumber: '29AAGCG5512P1Z9',
            panNumber: 'AAGCG5512P',
            establishedYear: '2015',
            about: 'Eco-friendly residential developer specializing in sustainable living communities across Bangalore.',
        },
        inventory: [
            { type: '3BHK Villa', size: '2,200 Sq.Ft', basePrice: '1.75 Cr', totalUnits: 30, availableUnits: 10 },
            { type: '4BHK Villa', size: '3,000 Sq.Ft', basePrice: '2.50 Cr', totalUnits: 20, availableUnits: 8 }
        ]
    },
];

export const projectPanelProjects = [
    {
        id: 'PP-001',
        statusBucket: 'draft',
        projectName: 'Skyline Residency',
        projectType: 'Apartment / Flats',
        projectLocation: 'Andheri West, Mumbai',
        submittedAt: 'Today, 11:20 AM',
        progress: 36,
        kycStatus: 'Pending',
        builder: {
            fullName: 'Arjun Mehra',
            phone: '+91 98231 44001',
            location: 'Mumbai, Maharashtra',
            companyName: 'Apex Buildcon',
            companyType: 'Builder',
            reraNumber: 'MHRERA-P51800044791',
            builderType: 'Developer Company',
            brandName: 'Apex Living',
            gstNumber: '27AAGCA4455K1ZQ',
            panNumber: 'AAGCA4455K',
            establishedYear: '2012',
            website: 'https://apexbuildcon.example',
            relationshipManager: 'Rahul Sharma',
            salesManager: 'Vikram Mehta',
            onboardingSource: 'Direct Sales',
            about: 'Premium residential developer focused on mid-to-luxury apartment communities across Mumbai.',
        },
        documents: {
            companyLogo: { fileName: 'apex-buildcon-logo.png', status: 'Uploaded', uploadedAt: '14 Jun, 10:44 AM' },
            reraCertificate: { fileName: 'skyline-rera-certificate.pdf', status: 'Uploaded', uploadedAt: '14 Jun, 10:48 AM' },
            gstPan: { fileName: 'apex-gst-pan-combined.pdf', status: 'Uploaded', uploadedAt: '14 Jun, 10:52 AM' },
        },
        checklist: [
            { label: 'Register form data captured', done: true },
            { label: 'Builder corporate identity uploaded', done: true },
            { label: 'RERA certificate pending approval', done: false },
        ],
    },
    {
        id: 'PP-002',
        statusBucket: 'draft',
        projectName: 'Parkside Avenues',
        projectType: 'Compact Residential',
        projectLocation: 'Andheri East, Mumbai',
        submittedAt: 'Yesterday, 04:35 PM',
        progress: 28,
        kycStatus: 'Pending',
        builder: {
            fullName: 'Nisha Sethi',
            phone: '+91 98109 88210',
            location: 'Mumbai, Maharashtra',
            companyName: 'Apex Buildcon',
            companyType: 'Builder',
            reraNumber: 'MHRERA-P51800051342',
            builderType: 'Developer Company',
            brandName: 'Apex Smart Homes',
            gstNumber: '27AAGCA4455K1ZQ',
            panNumber: 'AAGCA4455K',
            establishedYear: '2012',
            website: 'https://apexbuildcon.example',
            relationshipManager: 'Priya Singh',
            salesManager: 'Neha Gupta',
            onboardingSource: 'Referral',
            about: 'Affordable compact living project under Apex Buildcon with shared compliance credentials.',
        },
        documents: {
            companyLogo: { fileName: 'apex-smart-logo.png', status: 'Uploaded', uploadedAt: '13 Jun, 05:02 PM' },
            reraCertificate: { fileName: 'parkside-rera-draft.pdf', status: 'Uploaded', uploadedAt: '13 Jun, 05:04 PM' },
            gstPan: null,
        },
        checklist: [
            { label: 'Register form data captured', done: true },
            { label: 'GST and PAN document missing', done: false },
            { label: 'RERA certificate pending approval', done: false },
        ],
    },
    {
        id: 'PP-003',
        statusBucket: 'submitted',
        projectName: 'Green Valley Phase 2',
        projectType: 'Villa Plots',
        projectLocation: 'HSR Layout, Bangalore',
        submittedAt: '12 Jun, 09:10 AM',
        progress: 72,
        kycStatus: 'Submitted',
        builder: {
            fullName: 'Meera Nair',
            phone: '+91 99002 77118',
            location: 'Bangalore, Karnataka',
            companyName: 'EcoHomes Ltd',
            companyType: 'Builder',
            reraNumber: 'PRM/KA/RERA/1251/310/PR/240526/006921',
            builderType: 'Land Owner + Developer',
            brandName: 'EcoHomes',
            gstNumber: '29AAECE8302L1Z5',
            panNumber: 'AAECE8302L',
            establishedYear: '2016',
            website: 'https://ecohomes.example',
            relationshipManager: 'Amit Kumar',
            salesManager: 'Neha Gupta',
            onboardingSource: 'Website Lead',
            about: 'Plotted and low-density residential developer with green community positioning.',
        },
        documents: {
            companyLogo: { fileName: 'ecohomes-logo.png', status: 'Approved', uploadedAt: '12 Jun, 09:18 AM', approvedAt: '12 Jun, 03:30 PM' },
            reraCertificate: { fileName: 'green-valley-rera.pdf', status: 'Uploaded', uploadedAt: '12 Jun, 09:19 AM' },
            gstPan: { fileName: 'ecohomes-gst-pan.pdf', status: 'Uploaded', uploadedAt: '12 Jun, 09:20 AM' },
        },
        checklist: [
            { label: 'Register form data captured', done: true },
            { label: 'Builder profile submitted', done: true },
            { label: 'Two documents awaiting approval', done: false },
        ],
    },
    {
        id: 'PP-004',
        statusBucket: 'adminApproved',
        projectName: 'Metro Heights',
        projectType: 'Commercial',
        projectLocation: 'Connaught Place, Delhi',
        submittedAt: '10 Jun, 02:15 PM',
        progress: 91,
        kycStatus: 'Approved',
        builder: {
            fullName: 'Raghav Bansal',
            phone: '+91 98111 55220',
            location: 'Delhi NCR',
            companyName: 'CityScape',
            companyType: 'Builder',
            reraNumber: 'DLRERA2024P0058',
            builderType: 'Developer Company',
            brandName: 'CityScape Commercial',
            gstNumber: '07AAHCC2210Q1Z8',
            panNumber: 'AAHCC2210Q',
            establishedYear: '2009',
            website: 'https://cityscape.example',
            relationshipManager: 'Rahul Sharma',
            salesManager: 'Vikram Mehta',
            onboardingSource: 'Event',
            about: 'Commercial real estate operator with retail and office assets in Delhi NCR.',
        },
        documents: {
            companyLogo: { fileName: 'cityscape-logo.png', status: 'Approved', uploadedAt: '10 Jun, 02:21 PM', approvedAt: '10 Jun, 05:10 PM' },
            reraCertificate: { fileName: 'metro-heights-rera.pdf', status: 'Approved', uploadedAt: '10 Jun, 02:22 PM', approvedAt: '10 Jun, 05:12 PM' },
            gstPan: { fileName: 'cityscape-gst-pan.pdf', status: 'Approved', uploadedAt: '10 Jun, 02:25 PM', approvedAt: '10 Jun, 05:14 PM' },
        },
        checklist: [
            { label: 'Register form data captured', done: true },
            { label: 'All KYC documents approved', done: true },
            { label: 'Builder account cleared by admin', done: true },
        ],
    },
    {
        id: 'PP-005',
        statusBucket: 'live',
        projectName: 'Ocean View Luxury',
        projectType: 'Luxury Residential',
        projectLocation: 'ECR, Chennai',
        submittedAt: '07 Jun, 01:45 PM',
        progress: 100,
        kycStatus: 'Approved',
        builder: {
            fullName: 'Karthik Raman',
            phone: '+91 98400 61712',
            location: 'Chennai, Tamil Nadu',
            companyName: 'Coastal Reality',
            companyType: 'Builder',
            reraNumber: 'TN/29/Building/0184/2025',
            builderType: 'Individual Builder',
            brandName: 'Coastal Luxury',
            gstNumber: '33AAHFC4400P1ZX',
            panNumber: 'AAHFC4400P',
            establishedYear: '2018',
            website: 'https://coastalreality.example',
            relationshipManager: 'Priya Singh',
            salesManager: 'Vikram Mehta',
            onboardingSource: 'Direct Sales',
            about: 'Boutique luxury builder specializing in sea-facing apartments and penthouses.',
        },
        documents: {
            companyLogo: { fileName: 'coastal-luxury-logo.png', status: 'Approved', uploadedAt: '07 Jun, 02:02 PM', approvedAt: '07 Jun, 05:40 PM' },
            reraCertificate: { fileName: 'ocean-view-rera.pdf', status: 'Approved', uploadedAt: '07 Jun, 02:05 PM', approvedAt: '07 Jun, 05:42 PM' },
            gstPan: { fileName: 'coastal-gst-pan.pdf', status: 'Approved', uploadedAt: '07 Jun, 02:07 PM', approvedAt: '07 Jun, 05:44 PM' },
        },
        checklist: [
            { label: 'Register form data captured', done: true },
            { label: 'All KYC documents approved', done: true },
            { label: 'Project visible in live inventory', done: true },
        ],
    },
    {
        id: 'PP-006',
        statusBucket: 'submitted',
        projectName: 'Central Square Arcade',
        projectType: 'Retail Shops',
        projectLocation: 'MG Road, Pune',
        submittedAt: '11 Jun, 12:05 PM',
        progress: 68,
        kycStatus: 'Submitted',
        builder: {
            fullName: 'Dev Malhotra',
            phone: '+91 97654 22880',
            location: 'Pune, Maharashtra',
            companyName: 'UrbanAxis Realty',
            companyType: 'Builder',
            reraNumber: 'MHRERA-P52100066218',
            builderType: 'Developer Company',
            brandName: 'UrbanAxis',
            gstNumber: '27AAFCU8721N1ZP',
            panNumber: 'AAFCU8721N',
            establishedYear: '2015',
            website: 'https://urbanaxis.example',
            relationshipManager: 'Priya Singh',
            salesManager: 'Vikram Mehta',
            onboardingSource: 'Event',
            about: 'Mixed commercial developer focused on compact retail and main-road storefront assets.',
        },
        documents: {
            companyLogo: { fileName: 'urbanaxis-logo.png', status: 'Uploaded', uploadedAt: '11 Jun, 12:12 PM' },
            reraCertificate: { fileName: 'central-square-rera.pdf', status: 'Uploaded', uploadedAt: '11 Jun, 12:14 PM' },
            gstPan: { fileName: 'urbanaxis-gst-pan.pdf', status: 'Uploaded', uploadedAt: '11 Jun, 12:16 PM' },
        },
        checklist: [
            { label: 'Register form data captured', done: true },
            { label: 'Retail inventory submitted', done: true },
            { label: 'Documents awaiting KYC desk review', done: false },
        ],
    },
    {
        id: 'PP-007',
        statusBucket: 'submitted',
        projectName: 'Lakefront Villas',
        projectType: 'Villa Community',
        projectLocation: 'Kokapet, Hyderabad',
        submittedAt: '10 Jun, 06:40 PM',
        progress: 76,
        kycStatus: 'Submitted',
        builder: {
            fullName: 'Ishaan Reddy',
            phone: '+91 90008 44119',
            location: 'Hyderabad, Telangana',
            companyName: 'BlueLake Estates',
            companyType: 'Builder',
            reraNumber: 'P02400008731',
            builderType: 'Land Owner + Developer',
            brandName: 'BlueLake',
            gstNumber: '36AAGCB7120R1ZS',
            panNumber: 'AAGCB7120R',
            establishedYear: '2014',
            website: 'https://bluelake.example',
            relationshipManager: 'Amit Kumar',
            salesManager: 'Neha Gupta',
            onboardingSource: 'Referral',
            about: 'Villa and plotted-community developer with lake-facing residential inventory.',
        },
        documents: {
            companyLogo: { fileName: 'bluelake-logo.png', status: 'Approved', uploadedAt: '10 Jun, 06:46 PM', approvedAt: '11 Jun, 10:10 AM' },
            reraCertificate: { fileName: 'lakefront-rera.pdf', status: 'Uploaded', uploadedAt: '10 Jun, 06:47 PM' },
            gstPan: { fileName: 'bluelake-gst-pan.pdf', status: 'Uploaded', uploadedAt: '10 Jun, 06:48 PM' },
        },
        checklist: [
            { label: 'Register form data captured', done: true },
            { label: 'Villa layout submitted', done: true },
            { label: 'RERA certificate pending approval', done: false },
        ],
    },
    {
        id: 'PP-008',
        statusBucket: 'adminApproved',
        projectName: 'Tech Park Offices',
        projectType: 'Office Spaces',
        projectLocation: 'Whitefield, Bangalore',
        submittedAt: '09 Jun, 10:30 AM',
        progress: 94,
        kycStatus: 'Approved',
        builder: {
            fullName: 'Ananya Rao',
            phone: '+91 99861 55201',
            location: 'Bangalore, Karnataka',
            companyName: 'NorthGrid Developers',
            companyType: 'Builder',
            reraNumber: 'PRM/KA/RERA/1251/446/PR/260526/007110',
            builderType: 'Developer Company',
            brandName: 'NorthGrid Offices',
            gstNumber: '29AAHCN9410P1Z4',
            panNumber: 'AAHCN9410P',
            establishedYear: '2011',
            website: 'https://northgrid.example',
            relationshipManager: 'Rahul Sharma',
            salesManager: 'Vikram Mehta',
            onboardingSource: 'Direct Sales',
            about: 'Commercial workplace developer with ready-to-move and bare-shell office inventory.',
        },
        documents: {
            companyLogo: { fileName: 'northgrid-logo.png', status: 'Approved', uploadedAt: '09 Jun, 10:36 AM', approvedAt: '09 Jun, 03:20 PM' },
            reraCertificate: { fileName: 'tech-park-rera.pdf', status: 'Approved', uploadedAt: '09 Jun, 10:38 AM', approvedAt: '09 Jun, 03:22 PM' },
            gstPan: { fileName: 'northgrid-gst-pan.pdf', status: 'Approved', uploadedAt: '09 Jun, 10:39 AM', approvedAt: '09 Jun, 03:24 PM' },
        },
        checklist: [
            { label: 'Register form data captured', done: true },
            { label: 'All KYC documents approved', done: true },
            { label: 'Office inventory ready for live review', done: true },
        ],
    },
    {
        id: 'PP-009',
        statusBucket: 'adminApproved',
        projectName: 'Sunrise Rowhomes',
        projectType: 'Rowhouse',
        projectLocation: 'Rau, Indore',
        submittedAt: '08 Jun, 01:55 PM',
        progress: 88,
        kycStatus: 'Approved',
        builder: {
            fullName: 'Kabir Joshi',
            phone: '+91 98260 11559',
            location: 'Indore, Madhya Pradesh',
            companyName: 'Sunrise Habitat',
            companyType: 'Builder',
            reraNumber: 'P-IND-2026-00422',
            builderType: 'Individual Builder',
            brandName: 'Sunrise Homes',
            gstNumber: '23AAKFS2214M1Z2',
            panNumber: 'AAKFS2214M',
            establishedYear: '2019',
            website: 'https://sunrisehabitat.example',
            relationshipManager: 'Amit Kumar',
            salesManager: 'Neha Gupta',
            onboardingSource: 'Website Lead',
            about: 'Low-rise residential developer specializing in rowhouses and compact gated communities.',
        },
        documents: {
            companyLogo: { fileName: 'sunrise-logo.png', status: 'Approved', uploadedAt: '08 Jun, 02:01 PM', approvedAt: '08 Jun, 05:30 PM' },
            reraCertificate: { fileName: 'sunrise-rowhomes-rera.pdf', status: 'Approved', uploadedAt: '08 Jun, 02:04 PM', approvedAt: '08 Jun, 05:32 PM' },
            gstPan: { fileName: 'sunrise-gst-pan.pdf', status: 'Approved', uploadedAt: '08 Jun, 02:05 PM', approvedAt: '08 Jun, 05:34 PM' },
        },
        checklist: [
            { label: 'Register form data captured', done: true },
            { label: 'Rowhouse pricing verified', done: true },
            { label: 'Admin KYC cleared', done: true },
        ],
    },
    {
        id: 'PP-010',
        statusBucket: 'live',
        projectName: 'Capital Business Plaza',
        projectType: 'Showrooms',
        projectLocation: 'Vijay Nagar, Indore',
        submittedAt: '05 Jun, 09:25 AM',
        progress: 100,
        kycStatus: 'Approved',
        builder: {
            fullName: 'Pooja Batra',
            phone: '+91 98270 44029',
            location: 'Indore, Madhya Pradesh',
            companyName: 'Capital Buildspace',
            companyType: 'Builder',
            reraNumber: 'P-IND-2025-00908',
            builderType: 'Developer Company',
            brandName: 'Capital Plaza',
            gstNumber: '23AAHCC5531L1Z1',
            panNumber: 'AAHCC5531L',
            establishedYear: '2010',
            website: 'https://capitalbuildspace.example',
            relationshipManager: 'Priya Singh',
            salesManager: 'Vikram Mehta',
            onboardingSource: 'Direct Sales',
            about: 'Commercial frontage developer with showroom and high-street retail assets.',
        },
        documents: {
            companyLogo: { fileName: 'capital-plaza-logo.png', status: 'Approved', uploadedAt: '05 Jun, 09:30 AM', approvedAt: '05 Jun, 12:40 PM' },
            reraCertificate: { fileName: 'capital-business-rera.pdf', status: 'Approved', uploadedAt: '05 Jun, 09:32 AM', approvedAt: '05 Jun, 12:42 PM' },
            gstPan: { fileName: 'capital-gst-pan.pdf', status: 'Approved', uploadedAt: '05 Jun, 09:34 AM', approvedAt: '05 Jun, 12:44 PM' },
        },
        checklist: [
            { label: 'Register form data captured', done: true },
            { label: 'All KYC documents approved', done: true },
            { label: 'Commercial property live', done: true },
        ],
    },
    {
        id: 'PP-011',
        statusBucket: 'live',
        projectName: 'Cedar Grove Plots',
        projectType: 'Residential Plots',
        projectLocation: 'Sarjapur Road, Bangalore',
        submittedAt: '03 Jun, 04:10 PM',
        progress: 100,
        kycStatus: 'Approved',
        builder: {
            fullName: 'Ritika Shenoy',
            phone: '+91 98803 80112',
            location: 'Bangalore, Karnataka',
            companyName: 'Cedar Grove Infra',
            companyType: 'Builder',
            reraNumber: 'PRM/KA/RERA/1251/308/PR/220526/006884',
            builderType: 'Land Owner + Developer',
            brandName: 'Cedar Grove',
            gstNumber: '29AACCC9911N1ZH',
            panNumber: 'AACCC9911N',
            establishedYear: '2017',
            website: 'https://cedargrove.example',
            relationshipManager: 'Amit Kumar',
            salesManager: 'Neha Gupta',
            onboardingSource: 'Referral',
            about: 'Plotted development operator focused on gated residential land communities.',
        },
        documents: {
            companyLogo: { fileName: 'cedar-logo.png', status: 'Approved', uploadedAt: '03 Jun, 04:15 PM', approvedAt: '03 Jun, 07:20 PM' },
            reraCertificate: { fileName: 'cedar-grove-rera.pdf', status: 'Approved', uploadedAt: '03 Jun, 04:17 PM', approvedAt: '03 Jun, 07:22 PM' },
            gstPan: { fileName: 'cedar-gst-pan.pdf', status: 'Approved', uploadedAt: '03 Jun, 04:18 PM', approvedAt: '03 Jun, 07:24 PM' },
        },
        checklist: [
            { label: 'Register form data captured', done: true },
            { label: 'Plot inventory live', done: true },
            { label: 'Builder account verified', done: true },
        ],
    },
];

export const projectPanelFormSubmissionSample = {
    projectId: 'FORM-PP-ALL-001',
    submittedBy: 'Arjun Mehra',
    submittedAt: '14 Jun, 11:58 AM',
    reviewStatus: 'Ready for admin review',
    basicDetails: {
        projectName: 'SquarFT Universal Property Hub',
        location: 'Ring Road Extension, Near Super Corridor',
        city: 'Indore',
        state: 'Madhya Pradesh',
        pincode: '452010',
        salesOfficerName: 'Manas Gangrade',
        salesOfficerContact: '8120180101',
        responsiblePersonName: 'Arjun Mehra',
        responsiblePersonContact: '9823144001',
    },
    propertyTypes: [
        { id: 'res-plot', mainType: 'Residential', subType: 'Plot', units: 48, sections: 3, uploadMode: 'Visual Builder' },
        { id: 'res-villa', mainType: 'Residential', subType: 'Villa', units: 24, sections: 2, uploadMode: 'Visual Builder' },
        { id: 'res-apartment', mainType: 'Residential', subType: 'Apartment', units: 192, sections: 2, uploadMode: 'Visual Builder' },
        { id: 'res-rowhouse', mainType: 'Residential', subType: 'Rowhouse', units: 36, sections: 3, uploadMode: 'Bulk CSV' },
        { id: 'com-shop', mainType: 'Commercial', subType: 'Shop', units: 64, sections: 2, uploadMode: 'Visual Builder' },
        { id: 'com-showroom', mainType: 'Commercial', subType: 'Showroom', units: 18, sections: 1, uploadMode: 'Manual Entry' },
        { id: 'com-office', mainType: 'Commercial', subType: 'Office', units: 72, sections: 3, uploadMode: 'Visual Builder' },
    ],
    propertyDetails: [
        {
            typeId: 'res-plot',
            title: 'Residential Plot',
            layout: 'Block A, B, C',
            configurations: [
                { name: '30x40 Standard Plot', area: '1,200 Sq-ft', price: '48,00,000', amenities: ['Internal roads', 'Street lights', 'Water line'], mappedUnits: 30 },
                { name: '40x60 Corner Plot', area: '2,400 Sq-ft', price: '92,00,000', amenities: ['Corner facing', 'Garden view', 'Drainage'], mappedUnits: 18 },
            ],
            sampleUnits: [
                { propertyNumber: 'A-1', section: 'A', row: '1', area: '1,200 Sq-ft', price: '48,00,000' },
                { propertyNumber: 'B-7', section: 'B', row: '2', area: '2,400 Sq-ft', price: '92,00,000' },
            ],
        },
        {
            typeId: 'res-villa',
            title: 'Villa',
            layout: 'Lane 1 and Lane 2',
            configurations: [
                { name: '3 BHK Courtyard Villa', area: '2,150 Sq-ft', price: '1,65,00,000', amenities: ['Private garden', 'Two parking', 'Club access'], mappedUnits: 14 },
                { name: '4 BHK Premium Villa', area: '3,100 Sq-ft', price: '2,35,00,000', amenities: ['Terrace deck', 'Private lawn', 'Smart lock'], mappedUnits: 10 },
            ],
            sampleUnits: [
                { propertyNumber: 'V-101', section: 'Lane 1', row: '1', area: '2,150 Sq-ft', price: '1,65,00,000' },
                { propertyNumber: 'V-208', section: 'Lane 2', row: '2', area: '3,100 Sq-ft', price: '2,35,00,000' },
            ],
        },
        {
            typeId: 'res-apartment',
            title: 'Apartment',
            layout: 'Tower A and Tower B',
            configurations: [
                { name: '2 BHK Classic', area: '1,120 Sq-ft', price: '74,00,000', amenities: ['Balcony', 'Modular kitchen', 'Covered parking'], mappedUnits: 96 },
                { name: '3 BHK Premium', area: '1,580 Sq-ft', price: '1,08,00,000', amenities: ['Corner balcony', 'Utility area', 'Club view'], mappedUnits: 72 },
                { name: '4 BHK Sky Residence', area: '2,250 Sq-ft', price: '1,82,00,000', amenities: ['Private lobby', 'Servant room', 'Two parking'], mappedUnits: 24 },
            ],
            sampleUnits: [
                { propertyNumber: 'A-1204', section: 'Tower A', floor: '12', area: '1,580 Sq-ft', price: '1,08,00,000' },
                { propertyNumber: 'B-1801', section: 'Tower B', floor: '18', area: '2,250 Sq-ft', price: '1,82,00,000' },
            ],
        },
        {
            typeId: 'res-rowhouse',
            title: 'Rowhouse',
            layout: 'Row A, B, C',
            configurations: [
                { name: '3 BHK Rowhouse', area: '1,850 Sq-ft', price: '1,22,00,000', amenities: ['Front porch', 'Dedicated parking', 'Rear utility'], mappedUnits: 24 },
                { name: '4 BHK Rowhouse', area: '2,450 Sq-ft', price: '1,74,00,000', amenities: ['Terrace room', 'Garden strip', 'Two parking'], mappedUnits: 12 },
            ],
            sampleUnits: [
                { propertyNumber: 'RH-A-05', section: 'A', row: '1', area: '1,850 Sq-ft', price: '1,22,00,000' },
                { propertyNumber: 'RH-C-11', section: 'C', row: '3', area: '2,450 Sq-ft', price: '1,74,00,000' },
            ],
        },
        {
            typeId: 'com-shop',
            title: 'Shop',
            layout: 'Retail Arcade Ground + First',
            configurations: [
                { name: 'Ground Floor Shop', area: '420 Sq-ft', price: '78,00,000', amenities: ['Main road frontage', 'High ceiling', 'Signage zone'], mappedUnits: 40 },
                { name: 'First Floor Shop', area: '380 Sq-ft', price: '54,00,000', amenities: ['Escalator access', 'Common washroom', 'Atrium view'], mappedUnits: 24 },
            ],
            sampleUnits: [
                { propertyNumber: 'S-G-12', section: 'Ground', floor: '0', area: '420 Sq-ft', price: '78,00,000' },
                { propertyNumber: 'S-F-18', section: 'First', floor: '1', area: '380 Sq-ft', price: '54,00,000' },
            ],
        },
        {
            typeId: 'com-showroom',
            title: 'Showroom',
            layout: 'Main Road Showroom Belt',
            configurations: [
                { name: 'Double Height Showroom', area: '2,800 Sq-ft', price: '4,60,00,000', amenities: ['Double height', 'Road frontage', 'Private entry'], mappedUnits: 8 },
                { name: 'Anchor Showroom', area: '5,200 Sq-ft', price: '8,40,00,000', amenities: ['Corner frontage', 'Service access', 'Dedicated parking'], mappedUnits: 10 },
            ],
            sampleUnits: [
                { propertyNumber: 'SH-03', section: 'Main Road', floor: '0', area: '2,800 Sq-ft', price: '4,60,00,000' },
                { propertyNumber: 'SH-11', section: 'Main Road', floor: '0', area: '5,200 Sq-ft', price: '8,40,00,000' },
            ],
        },
        {
            typeId: 'com-office',
            title: 'Office',
            layout: 'Business Tower C',
            configurations: [
                { name: 'Co-working Office', area: '750 Sq-ft', price: '82,00,000', amenities: ['Shared reception', 'Meeting room access', 'Managed internet'], mappedUnits: 36 },
                { name: 'Bare Shell Office', area: '1,450 Sq-ft', price: '1,58,00,000', amenities: ['Independent HVAC', 'Pantry point', 'Lift lobby'], mappedUnits: 24 },
                { name: 'Ready to Move Office', area: '2,200 Sq-ft', price: '2,65,00,000', amenities: ['Finished flooring', 'Cabins', 'Server room'], mappedUnits: 12 },
            ],
            sampleUnits: [
                { propertyNumber: 'OF-C-601', section: 'Tower C', floor: '6', area: '1,450 Sq-ft', price: '1,58,00,000' },
                { propertyNumber: 'OF-C-1002', section: 'Tower C', floor: '10', area: '2,200 Sq-ft', price: '2,65,00,000' },
            ],
        },
    ],
    approvals: {
        possessionStatus: 'Possession Pending',
        expectedPossessionDate: '2027-12-31',
        possessionRemarks: 'Phase-wise handover planned after tower and retail arcade completion.',
        projectLaunchStatus: 'Upcoming Launch',
        expectedLaunchDate: '2026-08-15',
        developmentCompletionPercentage: '42',
        currentDevelopmentStage: ['Road work completed', 'Boundary wall completed', 'Work in progress'],
        overallApprovalStatus: 'Some approvals pending',
        items: [
            { title: 'Diversion Approval', status: 'Yes', reference: 'DIV/IND/2026/4482', date: '2026-04-18', documents: 2 },
            { title: 'TNCP Approval', status: 'Yes', reference: 'TNCP/MP/2026/1170', date: '2026-05-02', documents: 1 },
            { title: 'Development Permission', status: 'No', expectedTime: '6 months', documents: 0 },
            { title: 'RERA Approval', status: 'Yes', reference: 'P-IND-2026-00941', date: '2026-05-20', documents: 1 },
            { title: 'Building Permission', status: 'No', expectedTime: '3 months', documents: 0 },
        ],
    },
    finance: {
        guidelineValueAmount: '3,500',
        guidelineValueUnit: 'Per Sq. Ft.',
        propertyJurisdictionArea: 'Indore Municipal Corporation',
        guidelineYear: '2026',
        registryChargesAvailable: 'Yes',
        registryChargesMaleBuyer: '7.5%',
        registryChargesFemaleBuyer: '6.5%',
        otherGovernmentCharges: 'Mutation and documentation charges extra',
        loanAvailable: 'Yes',
        bankTieUpAvailable: 'Yes',
        tieUpBankName: 'HDFC Bank, SBI, ICICI Bank',
        loanApprovalStatus: 'Pre-approved project file',
        maximumLoanPercentage: '80%',
        requiredLoanDocuments: 'PAN, Aadhaar, income proof, bank statement, booking form',
        ownershipType: 'Joint Venture Project',
        jvLandOwnerName: 'Sharma Land Holdings',
        jvDeveloperBuilderName: 'Apex Buildcon',
        jvAgreementAvailable: 'Yes',
        jvRevenueAreaSharingDetails: '62% developer share and 38% land owner share.',
        titleVerificationStatus: 'Under Process',
        titleExpectedCompletionDate: '2026-07-10',
        financialOwnershipRemarks: 'Loan approvals active for residential inventory; commercial underwriting in progress.',
        documents: [
            'guideline-value-2026.pdf',
            'jv-agreement-signed.pdf',
            'title-search-draft.pdf',
        ],
    },
    mediaAndPrice: {
        images: ['main-elevation.jpg', 'clubhouse.jpg', 'retail-arcade.jpg', 'sample-apartment.jpg', 'plot-layout.jpg'],
        videos: ['site-walkthrough.mp4', 'apartment-sample-tour.mp4'],
        documents: ['master-brochure.pdf', 'payment-plan.pdf', 'price-sheet.xlsx', 'layout-plan.pdf'],
        agreed: true,
    },
};

export const fieldOfficerWorkflowData = [
    {
        id: 'FO-001',
        name: 'Amit Verma',
        phone: '+91 98765 43010',
        zone: 'Zone C-2',
        area: 'Vijay Nagar / MR-9',
        status: 'Active',
        approved: false,
        projects: [
            {
                id: 'lead-skyline-residency',
                projectName: 'Skyline Residency',
                developerName: 'Shree Developers',
                contactPerson: 'Rohit Sharma',
                phoneNumber: '+91 98765 43210',
                city: 'Indore',
                location: 'Vijay Nagar',
                area: 'Vijay Nagar',
                colony: 'Near MR-9 Flyover',
                fullAddress: 'Plot 24, Scheme 78, Vijay Nagar, Indore',
                category: 'Residential',
                projectType: 'Residential . Apartment . 3BHK',
                type: 'Hot',
                status: 'Meeting Set',
                statusType: 'meeting',
                nextAction: 'Meet at Vijay Nagar for site meeting',
                lastContact: 'Today',
                onboardingProgress: 67,
                stageHistory: [
                    { stage: 'New Lead Added', note: 'Lead added from field app', at: '2026-06-12T09:30:00.000Z' },
                    { stage: 'First Contact', note: 'Phone call completed', at: '2026-06-12T10:00:00.000Z' },
                    { stage: 'Follow-up', note: 'Shared onboarding checklist', at: '2026-06-12T10:15:00.000Z' },
                    { stage: 'Meeting Scheduled', note: 'Site meeting scheduled', at: '2026-06-12T10:30:00.000Z' },
                ],
                followUps: [
                    {
                        id: 'fu-skyline-1',
                        time: '11:00 AM',
                        note: 'Share onboarding checklist and confirm required documents.',
                        status: 'Hot',
                        isDone: false,
                        meta: { followUpType: 'Call', outcome: 'Interested', nextAction: 'Collect RERA and layout plan', nextFollowUpAt: '2026-06-15T05:30:00.000Z' },
                    },
                ],
                meetings: [
                    {
                        id: 'mt-skyline-1',
                        location: 'Vijay Nagar',
                        latitude: 22.7533,
                        longitude: 75.8937,
                        type: 'Site Meeting',
                        time: '12:00 PM',
                        status: 'Scheduled',
                        isDone: false,
                        meta: {
                            scheduledAt: '2026-06-15T06:30:00.000Z',
                            agenda: ['Company Introduction', 'Project Collaboration Discussion'],
                            notes: 'Carry onboarding checklist and pricing discussion points.',
                            reminder: '1 hour before',
                        },
                    },
                ],
                onboardingData: {
                    propertyTypes: [{ id: 'residential-apartment', mainType: 'residential', subType: 'apartment' }],
                    approvals: { overallApprovalStatus: 'Major approvals completed', possessionStatus: 'Under Construction', developmentCompletionPercentage: '65' },
                    finance: { loanAvailable: 'Yes', ownershipType: 'Owned Project' },
                    media: { images: ['skyline-cover.jpg'], documents: ['rera-certificate.pdf'] },
                    completedAt: null,
                },
                tasks: [
                    { id: 'task-skyline-1', title: 'Collect builder KYC originals', due: 'Today', priority: 'High', status: 'Pending', location: 'Vijay Nagar site office' },
                    { id: 'task-skyline-2', title: 'Verify tower location pins', due: 'Tomorrow', priority: 'Medium', status: 'In Progress', location: 'Tower A and B' },
                ],
            },
            {
                id: 'lead-abc-heights',
                projectName: 'ABC Heights',
                developerName: 'Kapoor Builders',
                contactPerson: 'Nitin Kapoor',
                phoneNumber: '+91 98765 43211',
                city: 'Indore',
                location: 'Super Corridor',
                area: 'Super Corridor',
                colony: 'Near TCS Square',
                fullAddress: 'Plot 17, Super Corridor, Indore',
                category: 'Residential',
                projectType: 'Residential . Rowhouse',
                type: 'Warm',
                status: 'Follow up',
                statusType: 'followUp',
                nextAction: 'Builder asked to call after partner meeting',
                lastContact: 'Yesterday',
                onboardingProgress: 44,
                stageHistory: [
                    { stage: 'New Lead Added', note: 'Lead added from home screen', at: '2026-06-11T08:30:00.000Z' },
                    { stage: 'First Contact', note: 'Initial call completed', at: '2026-06-11T10:00:00.000Z' },
                    { stage: 'Follow-up', note: 'Partner discussion pending', at: '2026-06-11T11:10:00.000Z' },
                ],
                followUps: [
                    {
                        id: 'fu-abc-1',
                        time: '10:30 AM',
                        note: 'Builder asked to call after partner meeting.',
                        status: 'Overdue',
                        isDone: false,
                        meta: { followUpType: 'Call', outcome: 'Awaiting Partner', nextAction: 'Discuss collaboration terms', nextFollowUpAt: '2026-06-14T05:00:00.000Z' },
                    },
                ],
                meetings: [],
                onboardingData: null,
                tasks: [
                    { id: 'task-abc-1', title: 'Call builder and record outcome', due: 'Today', priority: 'High', status: 'Pending', location: 'Phone follow-up' },
                ],
            },
        ],
    },
    {
        id: 'FO-002',
        name: 'Sneha Patel',
        phone: '+91 98260 11882',
        zone: 'Zone A-1',
        area: 'Super Corridor / Rau',
        status: 'Active',
        approved: false,
        projects: [
            {
                id: 'lead-royal-greens',
                projectName: 'Royal Greens Township',
                developerName: 'Royal Infra',
                contactPerson: 'Mahesh Jain',
                phoneNumber: '+91 98123 45670',
                city: 'Indore',
                location: 'Rau',
                area: 'Rau',
                colony: 'Bypass Road',
                fullAddress: 'Royal Greens Township, Rau Bypass, Indore',
                category: 'Residential',
                projectType: 'Residential . Plot',
                type: 'Hot',
                status: 'Follow up',
                statusType: 'followUp',
                nextAction: 'Discuss collaboration terms',
                lastContact: 'Today',
                onboardingProgress: 38,
                stageHistory: [
                    { stage: 'New Lead Added', note: 'Lead captured from field visit', at: '2026-06-12T12:00:00.000Z' },
                    { stage: 'First Contact', note: 'Builder answered call', at: '2026-06-12T12:20:00.000Z' },
                    { stage: 'Follow-up', note: 'Commercial terms pending', at: '2026-06-12T12:45:00.000Z' },
                ],
                followUps: [
                    {
                        id: 'fu-royal-1',
                        time: '11:00 AM',
                        note: 'Discuss collaboration terms and commission structure.',
                        status: 'Hot',
                        isDone: false,
                        meta: { followUpType: 'Call', outcome: 'Interested', nextAction: 'Schedule office meeting', nextFollowUpAt: '2026-06-15T05:30:00.000Z' },
                    },
                ],
                meetings: [],
                onboardingData: null,
                tasks: [
                    { id: 'task-royal-1', title: 'Prepare commercial terms sheet', due: 'Today', priority: 'Medium', status: 'In Progress', location: 'Admin office' },
                ],
            },
            {
                id: 'lead-royal-infra',
                projectName: 'Royal Infra',
                developerName: 'Royal Infra',
                contactPerson: 'Ravi Soni',
                phoneNumber: '+91 98123 45671',
                city: 'Indore',
                location: 'Super Corridor',
                area: 'Super Corridor',
                colony: 'Near IT Park',
                fullAddress: 'Royal Infra Sales Office, Super Corridor, Indore',
                category: 'Commercial',
                projectType: 'Commercial . Office',
                type: 'Warm',
                status: 'Meeting Set',
                statusType: 'meeting',
                nextAction: 'Office meet at Super Corridor',
                lastContact: 'Today',
                onboardingProgress: 62,
                stageHistory: [
                    { stage: 'New Lead Added', note: 'Lead imported from field list', at: '2026-06-10T09:00:00.000Z' },
                    { stage: 'First Contact', note: 'Phone call completed', at: '2026-06-10T09:20:00.000Z' },
                    { stage: 'Follow-up', note: 'Sent profile deck', at: '2026-06-10T10:05:00.000Z' },
                    { stage: 'Meeting Scheduled', note: 'Office meeting booked', at: '2026-06-10T11:00:00.000Z' },
                ],
                followUps: [],
                meetings: [
                    {
                        id: 'mt-royal-1',
                        location: 'Super Corridor',
                        latitude: 22.7516,
                        longitude: 75.8017,
                        type: 'Office Meet',
                        time: '1:00 PM',
                        status: 'Scheduled',
                        isDone: false,
                        meta: { scheduledAt: '2026-06-15T07:30:00.000Z', agenda: ['Company Introduction', 'Project Collaboration Discussion'], notes: 'Take rate card.', reminder: '30 minutes before' },
                    },
                ],
                onboardingData: {
                    propertyTypes: [{ id: 'commercial-office', mainType: 'commercial', subType: 'office' }],
                    approvals: { overallApprovalStatus: 'Some approvals pending', possessionStatus: 'Ready to Move', developmentCompletionPercentage: '92' },
                    finance: { loanAvailable: 'No', ownershipType: 'Owned Project' },
                    media: { images: ['royal-office.jpg'], documents: ['layout-plan.pdf'] },
                    completedAt: null,
                },
                tasks: [
                    { id: 'task-royal-infra-1', title: 'Verify office floor inventory', due: 'Tomorrow', priority: 'Medium', status: 'Pending', location: 'Royal Infra office' },
                ],
            },
        ],
    },
    {
        id: 'FO-003',
        name: 'Rahul Mehta',
        phone: '+91 99070 77221',
        zone: 'Zone B-4',
        area: 'MR-9 / Bypass',
        status: 'Active',
        approved: false,
        projects: [
            {
                id: 'lead-sunrise-heights',
                projectName: 'Sunrise Heights',
                developerName: 'SP Group',
                contactPerson: 'Sanjay Porwal',
                phoneNumber: '+91 97654 32100',
                city: 'Indore',
                location: 'MR-9',
                area: 'MR-9',
                colony: 'Scheme 136',
                fullAddress: 'Sunrise Heights, MR-9, Indore',
                category: 'Residential',
                projectType: 'Residential . Apartment . 2BHK',
                type: 'Warm',
                status: 'Onboarding',
                statusType: 'onboarding',
                nextAction: 'Collect RERA and layout plan from builder',
                lastContact: 'Today',
                onboardingProgress: 82,
                stageHistory: [
                    { stage: 'New Lead Added', note: 'Lead added from home screen', at: '2026-06-09T09:30:00.000Z' },
                    { stage: 'First Contact', note: 'Builder call completed', at: '2026-06-09T10:00:00.000Z' },
                    { stage: 'Follow-up', note: 'Docs requested', at: '2026-06-09T10:30:00.000Z' },
                    { stage: 'Meeting Scheduled', note: 'Site visit completed', at: '2026-06-10T11:30:00.000Z' },
                    { stage: 'Interested', note: 'Builder agreed for onboarding', at: '2026-06-10T12:30:00.000Z' },
                ],
                followUps: [
                    { id: 'fu-sunrise-1', time: '4:00 PM', note: 'Collect RERA and layout plan from builder.', status: 'Docs Pending', isDone: false, meta: { followUpType: 'Visit', outcome: 'Docs Pending', nextAction: 'Upload docs in onboarding', nextFollowUpAt: '2026-06-15T10:30:00.000Z' } },
                ],
                meetings: [
                    { id: 'mt-sunrise-1', location: 'MR-9', latitude: 22.758, longitude: 75.9115, type: 'Site Visit', time: '4:00 PM', status: 'Completed', isDone: true, meta: { scheduledAt: '2026-06-10T10:30:00.000Z', agenda: ['Site Verification', 'Document Collection'], notes: 'Builder agreed to share latest RERA copy.', reminder: '1 hour before' } },
                ],
                onboardingData: {
                    propertyTypes: [{ id: 'residential-apartment', mainType: 'residential', subType: 'apartment' }],
                    approvals: { overallApprovalStatus: 'Major approvals completed', possessionStatus: 'Possession Pending', developmentCompletionPercentage: '78' },
                    finance: { loanAvailable: 'Yes', ownershipType: 'Joint Venture Project' },
                    media: { images: ['sunrise-front.jpg', 'tower-a.jpg'], documents: ['layout-plan.pdf', 'draft-rera.pdf'] },
                    completedAt: null,
                },
                tasks: [
                    { id: 'task-sunrise-1', title: 'Upload RERA document to onboarding', due: 'Today', priority: 'High', status: 'Pending', location: 'Builder office' },
                    { id: 'task-sunrise-2', title: 'Complete tower inventory checklist', due: 'This week', priority: 'Medium', status: 'In Progress', location: 'MR-9 site' },
                ],
            },
        ],
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

export const sample2Clients = [
    {
        id: 'C001', name: 'Vikash Singh', phone: '+91 9876543212', budget: '3 Cr - 5 Cr',
        listingType: 'Buy', listingKind: 'Residential', propType: 'APARTMENT/FLATS', date: '10/04/26', time: '11:00 - 12:00 PM',
        req: { type: 'Residential', bhk: ['3BHK', '4BHK'], loc: ['Chennai', 'ECR'], timeline: '30 Days' },
        source: 'Broker',
        status: 'Active', officer: 'Neha K.',
        score: 'Hot', visitToday: true, nextFollowUp: '2026-06-06',
        latestNote: 'Client is highly interested in east-facing units. Scheduled for site visit today at 4 PM.',
        actionRequired: false,
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
        listingType: 'Buy', listingKind: 'Residential', propType: 'APARTMENT/FLATS', date: '08/04/26', time: '04:00 - 05:00 PM',
        req: { type: 'Residential', bhk: ['2BHK'], loc: ['Mumbai', 'Andheri'], timeline: '60 Days' },
        source: 'Meta Ads',
        status: 'Negotiating', officer: 'Rahul M.',
        score: 'Warm', visitToday: false, nextFollowUp: '2026-06-10',
        latestNote: 'Completed site visit for Green Valley. Awaiting feedback.',
        actionRequired: true, actionDetails: 'Site visit completed for Green Valley Phase 2. Please log client feedback to proceed to next steps.',
        propertyPipeline: [
            { projectId: 'P001', status: 'Negotiating', units: ['2BHK - Flat 402'], visitedOn: '08 Apr', notes: 'Asking for 5% discount' },
            { projectId: 'P005', status: 'Visited', units: ['2BHK'], visitedOn: '05 Apr', notes: 'Liked the amenities, but prefers Skyline' }
        ],
        timeline: [
            { title: 'Negotiation Started', details: 'Offered 1.15 Cr for Skyline Residency Unit 402', date: '08/04/2026', time: '05:00 PM' }
        ],
        notes: [],
        meetings: []
    },
    {
        id: 'C003', name: 'Priya Verma', phone: '+91 9876543214', budget: '80 L - 1.2 Cr',
        listingType: 'Buy', listingKind: 'Residential', propType: 'APARTMENT/FLATS', date: '06/06/26', time: '10:00 - 11:00 AM',
        req: { type: 'Residential', bhk: ['2BHK'], loc: ['Bangalore', 'HSR Layout'], timeline: 'Immediate' },
        source: 'Website',
        status: 'Active', officer: 'Sneha P.',
        score: 'Hot', visitToday: true, nextFollowUp: '2026-06-06',
        latestNote: 'Site visit confirmed for Green Valley Phase 2 today morning. Need to show corner plots.',
        actionRequired: false,
        propertyPipeline: [],
        timeline: [],
        notes: [],
        meetings: []
    },
    {
        id: 'C004', name: 'Rohan Mehta', phone: '+91 9876543215', budget: '1.2 Cr - 1.8 Cr',
        listingType: 'Buy', listingKind: 'Residential', propType: 'APARTMENT/FLATS', date: '09/06/26', time: '01:00 - 02:00 PM',
        req: { type: 'Residential', bhk: ['3BHK'], loc: ['Mumbai', 'Andheri East'], timeline: '45 Days' },
        source: 'Sales Officer',
        status: 'Active', officer: '',
        score: 'Warm', visitToday: false, nextFollowUp: '2026-06-12',
        latestNote: 'New client awaiting sales officer assignment before property dispatch.',
        actionRequired: false,
        propertyPipeline: [],
        timeline: [
            { title: 'Client Registered', details: 'Client added without assigned sales officer.', date: '09/06/2026', time: '01:00 PM' }
        ],
        notes: [
            { text: 'Assign a sales officer before dispatching matched properties.', date: '09/06/2026', time: '01:05 PM' }
        ],
        meetings: []
    },
    {
        id: 'CL-101', name: 'Suresh Kumar', phone: '+91 98987 88776', budget: '2 Cr - 3 Cr',
        listingType: 'Buy', listingKind: 'Residential', propType: 'VILLA', date: '08/06/26', time: '12:00 - 01:00 PM',
        req: { type: 'Residential', bhk: ['3BHK', '4BHK'], loc: ['Mahalakshmi Nagar', 'Indore'], timeline: '30 Days' },
        status: 'Active', officer: 'Neha K.',
        score: 'Warm', visitToday: false, nextFollowUp: '2026-06-18',
        latestNote: 'Interested in Sunset Villa. Onboarded by broker Anil Nahar.',
        actionRequired: false,
        propertyPipeline: [
            { projectId: 'P004', status: 'Shortlisted', units: ['4BHK Luxury - Villa 12'], visitedOn: '08 Jun', notes: 'Interested in Sunset Villa' }
        ],
        timeline: [
            { title: 'Client Qualified', details: 'Broker Anil Nahar onboarded client Suresh Kumar', date: '08/06/2026', time: '10:45 AM' }
        ],
        notes: [
            { text: 'Looking for a villa with proper modular kitchen options.', date: '08/06/2026', time: '11:00 AM' }
        ],
        meetings: []
    },
    {
        id: 'CL-102', name: 'Pooja Hegde', phone: '+91 99887 77665', budget: '80 L - 1.2 Cr',
        listingType: 'Buy', listingKind: 'Residential', propType: 'APARTMENT/FLATS', date: '10/06/26', time: '02:00 - 03:00 PM',
        req: { type: 'Residential', bhk: ['1BHK', '2BHK'], loc: ['Vijay Nagar', 'Indore'], timeline: '30 Days' },
        status: 'Active', officer: 'Sneha P.',
        score: 'Hot', visitToday: true, nextFollowUp: '2026-06-16',
        latestNote: 'Scheduled for site visit of Green Valley Phase 2 flat 102. Onboarded by broker Anil Nahar.',
        actionRequired: false,
        propertyPipeline: [
            { projectId: 'P001', status: 'Shortlisted', units: ['2BHK Classic - Flat 102'], visitedOn: '10 Jun', notes: 'Interested in Fully Furnished 1 BHK Flat' }
        ],
        timeline: [
            { title: 'Client Onboarded', details: 'Onboarded by broker Anil Nahar', date: '10/06/2026', time: '02:15 PM' }
        ],
        notes: [],
        meetings: []
    },
    {
        id: 'CL-103', name: 'Rajesh Patel', phone: '+91 98221 33221', budget: '4 Cr - 6 Cr',
        listingType: 'Buy', listingKind: 'Residential', propType: 'VILLA', date: '12/06/26', time: '03:00 - 04:00 PM',
        req: { type: 'Residential', bhk: ['4BHK', '5+BHK'], loc: ['Mahalakshmi Nagar', 'Indore'], timeline: 'Immediate' },
        status: 'Completed', officer: 'Neha K.',
        score: 'Hot', visitToday: false, nextFollowUp: '2026-06-12',
        latestNote: 'Deal closed for Sunset Villa. Documents finalized and sent to registrar. Onboarded by broker Anil Nahar.',
        actionRequired: false,
        propertyPipeline: [
            { projectId: 'P004', status: 'Negotiating', units: ['4BHK Luxury - Villa 15'], visitedOn: '12 Jun', notes: 'Deal Closed.' }
        ],
        timeline: [
            { title: 'Deal Finalized', details: 'Sunset Villa purchase complete', date: '12/06/2026', time: '04:00 PM' }
        ],
        notes: [],
        meetings: []
    },
    {
        id: 'CL-201', name: 'Neha Sharma', phone: '+91 91122 33445', budget: '1.5 Cr - 2.5 Cr',
        listingType: 'Buy', listingKind: 'Residential', propType: 'APARTMENT/FLATS', date: '11/06/26', time: '11:00 - 12:00 PM',
        req: { type: 'Residential', bhk: ['2BHK', '3BHK'], loc: ['Pipliyapala', 'Indore'], timeline: '30 Days' },
        status: 'Active', officer: 'Rahul M.',
        score: 'Warm', visitToday: false, nextFollowUp: '2026-06-17',
        latestNote: 'Showed Lake View Apartment. Awaiting broker feedback. Onboarded by broker Manas Gangrade.',
        actionRequired: false,
        propertyPipeline: [
            { projectId: 'P001', status: 'Visited', units: ['2BHK Classic - Flat 301'], visitedOn: '11 Jun', notes: 'Likes the lake view.' }
        ],
        timeline: [
            { title: 'Client Onboarded', details: 'Referred by broker Manas Gangrade', date: '11/06/2026', time: '11:10 AM' }
        ],
        notes: [],
        meetings: []
    },
    {
        id: 'CL-202', name: 'Devendra Jha', phone: '+91 98888 77777', budget: '3 Cr - 4 Cr',
        listingType: 'Buy', listingKind: 'Residential', propType: 'PLOT', date: '13/06/26', time: '04:00 - 05:00 PM',
        req: { type: 'Residential', bhk: ['N/A'], loc: ['Super Corridor', 'Indore'], timeline: '60 Days' },
        status: 'Active', officer: 'Ravi T.',
        score: 'Warm', visitToday: false, nextFollowUp: '2026-06-19',
        latestNote: 'Interested in green field plot options. Onboarded by broker Manas Gangrade.',
        actionRequired: false,
        propertyPipeline: [
            { projectId: 'P002', status: 'Shortlisted', units: ['40x60 Plot - Plot A7'], visitedOn: '13 Jun', notes: 'Liked the corner plot.' }
        ],
        timeline: [
            { title: 'Client Onboarded', details: 'Referred by broker Manas Gangrade', date: '13/06/2026', time: '04:15 PM' }
        ],
        notes: [],
        meetings: []
    },
    {
        id: 'CL-301', name: 'Vikram Malhotra', phone: '+91 95555 44444', budget: '15 Cr - 20 Cr',
        listingType: 'Buy', listingKind: 'Residential', propType: 'APARTMENT/FLATS', date: '05/06/26', time: '10:00 - 11:00 AM',
        req: { type: 'Residential', bhk: ['4BHK', 'Penthouse'], loc: ['Andheri West', 'Mumbai'], timeline: 'Immediate' },
        status: 'Completed', officer: 'Rahul M.',
        score: 'Hot', visitToday: false, nextFollowUp: '2026-06-05',
        latestNote: 'Skyline Residency penthouse purchased and deal closed. Onboarded by broker Apex Realty.',
        actionRequired: false,
        propertyPipeline: [
            { projectId: 'P001', status: 'Negotiating', units: ['4BHK Luxury - Flat 1002'], visitedOn: '05 Jun', notes: 'Deal Closed.' }
        ],
        timeline: [
            { title: 'Deal Closed', details: 'Penthouse purchase finalized', date: '05/06/2026', time: '04:30 PM' }
        ],
        notes: [],
        meetings: []
    },
    {
        id: 'CL-302', name: 'Rohan Mehra', phone: '+91 96666 55555', budget: '6 Cr - 10 Cr',
        listingType: 'Buy', listingKind: 'Residential', propType: 'APARTMENT/FLATS', date: '09/06/26', time: '01:00 - 02:00 PM',
        req: { type: 'Residential', bhk: ['3BHK', '4BHK'], loc: ['New Palasia', 'Indore'], timeline: '45 Days' },
        status: 'Active', officer: 'Sneha P.',
        score: 'Warm', visitToday: false, nextFollowUp: '2026-06-15',
        latestNote: 'Considering Skyline and Ocean View luxury units. Onboarded by broker Apex Realty.',
        actionRequired: false,
        propertyPipeline: [
            { projectId: 'P001', status: 'Shortlisted', units: ['3BHK Premium - Flat 801'], visitedOn: '09 Jun', notes: 'Considering pricing options.' }
        ],
        timeline: [
            { title: 'Client Onboarded', details: 'Referred by broker Apex Realty', date: '09/06/2026', time: '01:15 PM' }
        ],
        notes: [],
        meetings: []
    }
];

export const mockDeals = [
    {
        dealCode: 'D0007', customer: 'Geheve', property: 'Testing', city: 'Indore', salesOfficer: 'Sales Officer', broker: 'Anil', status: 'PAYMENT SCHEDULE', createdOn: '07/03/26',
        customerPhone: '9165993939', brokerMobile: '9165993939', salesOfficerMobile: '9302569085',
        prefLocation: 'Harda, Madhya Pradesh, India',
        propType: 'APARTMENT/FLATS', address: 'VIRTUAL COWORKS, 41,42 PU 4 Scheme NO.54, VIRTUAL COWORKS, Malviya Nagar, Indore, Indore Division, Madhya Pradesh, 452010, India',
        khasra: '', expectPrice: 1000000, negotiationPrice: 2000000, remainingBalance: 984900,
        payments: [
            { id: 1, milestone: 'Guyigtyu', amount: 10000, dueDate: '2026-03-09', mode: 'Cash', updated: '-', status: 'COMPLETED' },
            { id: 2, milestone: 'Guyigtyu 1', amount: 5000, dueDate: '2026-03-07', mode: 'Upi', updated: '-', status: 'COMPLETED' },
            { id: 3, milestone: 'Booking', amount: 100, dueDate: '2026-03-10', mode: 'Upi', updated: '-', status: 'COMPLETED' }
        ],
        timeline: [], notes: [], meetings: [], documents: []
    },
    { dealCode: 'D0006', customer: 'Durgesh', property: 'Sapana', city: 'Indore', salesOfficer: 'Rizwan Khan', broker: 'SquarFT 92', status: 'DEAL COMPLETED', createdOn: '28/02/26', customerPhone: '9876543210', brokerMobile: '-', salesOfficerMobile: '-', prefLocation: '-', propType: 'PLOT', address: '-', khasra: '-', expectPrice: 500000, negotiationPrice: 500000, remainingBalance: 0, payments: [], timeline: [], notes: [], meetings: [], documents: [] },
    { dealCode: 'D0005', customer: 'Swapnil', property: 'Sindh Palace', city: 'Indore', salesOfficer: 'Manas', broker: 'Manas Gangrade', status: 'DEAL COMPLETED', createdOn: '24/02/26', customerPhone: '9876543210', brokerMobile: '-', salesOfficerMobile: '-', prefLocation: '-', propType: 'COMMERCIAL', address: '-', khasra: '-', expectPrice: 1500000, negotiationPrice: 1450000, remainingBalance: 0, payments: [], timeline: [], notes: [], meetings: [], documents: [] },
    { dealCode: 'D0004', customer: 'Anil Nahar', property: 'Sai Shyam', city: 'Indore', salesOfficer: 'Sales Officer', broker: 'Manas', status: 'DEAL IN PROCESS', createdOn: '10/02/26', customerPhone: '9876543210', brokerMobile: '-', salesOfficerMobile: '-', prefLocation: '-', propType: 'APARTMENT/FLATS', address: '-', khasra: '-', expectPrice: 2000000, negotiationPrice: 1900000, remainingBalance: 100000, payments: [], timeline: [], notes: [], meetings: [], documents: [] },
    { dealCode: 'D0003', customer: 'Anil Nahar', property: 'Anil Property', city: 'Indore', salesOfficer: 'Sales Officer', broker: 'Anil', status: 'PAYMENT SCHEDULE', createdOn: '09/02/26', customerPhone: '9876543210', brokerMobile: '-', salesOfficerMobile: '-', prefLocation: '-', propType: 'APARTMENT/FLATS', address: '-', khasra: '-', expectPrice: 2500000, negotiationPrice: 2400000, remainingBalance: 600000, payments: [{ id: 1, milestone: 'Booking Amount', amount: 250000, dueDate: '2026-03-15', mode: 'Bank Transfer', updated: '2026-03-01', status: 'PENDING' }, { id: 2, milestone: 'Agreement', amount: 350000, dueDate: '2026-04-05', mode: 'Cheque', updated: '-', status: 'PENDING' }], timeline: [], notes: [], meetings: [], documents: [] },
    { dealCode: 'D0002', customer: 'Rohit Sharma', property: 'Skyline Residency', city: 'Mumbai', salesOfficer: 'Neha K.', broker: 'Apex Realty', status: 'DEAL IN PROCESS', createdOn: '04/02/26', customerPhone: '9820012345', brokerMobile: '9810012300', salesOfficerMobile: '9000011111', prefLocation: 'Andheri West, Mumbai', propType: 'APARTMENT/FLATS', address: 'Andheri West, Mumbai', khasra: '-', expectPrice: 18500000, negotiationPrice: 17600000, remainingBalance: 7600000, payments: [], timeline: [], notes: [], meetings: [], documents: [] },
    { dealCode: 'D0001', customer: 'Meera Kapoor', property: 'Green Valley Phase 2', city: 'Bangalore', salesOfficer: 'Sneha P.', broker: 'EcoHomes Channel', status: 'DEAL COMPLETED', createdOn: '01/02/26', customerPhone: '9900099000', brokerMobile: '9888898888', salesOfficerMobile: '9777797777', prefLocation: 'HSR Layout, Bangalore', propType: 'VILLA PLOTS', address: 'HSR Layout, Bangalore', khasra: '-', expectPrice: 15000000, negotiationPrice: 14850000, remainingBalance: 0, payments: [{ id: 1, milestone: 'Full Settlement', amount: 14850000, dueDate: '2026-02-12', mode: 'RTGS', updated: '2026-02-12', status: 'COMPLETED' }], timeline: [], notes: [], meetings: [], documents: [] },
];

export const mockUsers = [
      { id: 'U001', name: 'Rizwan Khan', type: 'Sales_officer', phone: '9424654160', docStatus: 'Approved' },
      { id: 'U002', name: 'Marcus Holloway', type: 'Field_officer', phone: '8224000106', docStatus: 'Approved', area: 'South District', zone: 'Zone A-1', latitude: 22.7196, longitude: 75.8577, speed: 4.2, distanceToday: 24.5, battery: 88, lastSync: '2s ago', score: 98, currentLocation: 'Palasia, Indore' },
      { id: 'U003', name: 'Sales Officer', type: 'Sales_officer', phone: '9302569085', docStatus: 'Approved' },
      { id: 'U004', name: 'Anil', type: 'Broker', phone: '9165993939', docStatus: 'Rejected' },
      { id: 'U005', name: 'Fff', type: 'Sales_officer', phone: '8889998258', docStatus: 'Approved' },
      { id: 'U006', name: 'Rajesh Gurjar', type: 'Sales_officer', phone: '8224004000', docStatus: 'Pending' },
      { id: 'U007', name: 'Sarah Connor', type: 'Field_officer', phone: '8224000107', docStatus: 'Approved', area: 'North Ridge', zone: 'Zone B-4', latitude: 22.7528, longitude: 75.8937, speed: 12.5, distanceToday: 20.9, battery: 24, lastSync: '14m ago', score: 82, currentLocation: 'Rau Road, Indore' },
      { id: 'U008', name: 'Amit Verma', type: 'Field_officer', phone: '8224000108', docStatus: 'Pending', area: 'Central Circle', zone: 'Zone C-2', latitude: 22.6924, longitude: 75.8790, speed: 8.8, distanceToday: 17.3, battery: 76, lastSync: '18m ago', score: 91, currentLocation: 'Vijay Nagar, Indore' },
      { id: 'U009', name: 'Priya Nair', type: 'Field_officer', phone: '8224000109', docStatus: 'Approved', area: 'East Corridor', zone: 'Zone D-3', latitude: 22.7359, longitude: 75.9176, speed: 6.1, distanceToday: 15.8, battery: 63, lastSync: '22m ago', score: 87, currentLocation: 'Bypass Road, Indore' },
      { id: 'U010', name: 'Kabir Mehta', type: 'Field_officer', phone: '8224000110', docStatus: 'Approved', area: 'West Bypass', zone: 'Zone A-1', latitude: 22.6855, longitude: 75.8236, speed: 5.4, distanceToday: 13.6, battery: 71, lastSync: '26m ago', score: 84, currentLocation: 'Rajendra Nagar, Indore' },
      { id: 'U011', name: 'Neha Kulkarni', type: 'Field_officer', phone: '8224000111', docStatus: 'Pending', area: 'Metro Fringe', zone: 'Zone B-4', latitude: 22.7611, longitude: 75.8371, speed: 7.2, distanceToday: 12.1, battery: 57, lastSync: '31m ago', score: 79, currentLocation: 'Choithram Mandi, Indore' },
  ];

export const userAppActivities = [
      {
          id: 'UA001',
          userId: 'APP-U001',
          name: 'Manas Gangrade',
          phone: '+91 98765 43210',
          email: 'manas@squarft.com',
          city: 'Indore, MP',
          status: 'Online',
          joinedDate: '20 Feb 2025',
          lastActive: 'Today, 04:42 PM',
          activeMinutesToday: 128,
          totalActiveMinutes: 1840,
          sessionsToday: 7,
          savedProperties: [
              { id: 'p1', title: 'Serenity Reserve', location: 'Scheme No 140, Indore', type: 'Flat/Apartment', price: 'INR 2.5 Cr - INR 3.5 Cr', savedAt: 'Today, 12:10 PM' },
              { id: 'p2', title: 'Sumeru Sky Heights', location: 'Bypass Road, Indore', type: 'Flat/Apartment', price: 'INR 85 L - INR 1.4 Cr', savedAt: 'Today, 01:18 PM' },
              { id: 'p3', title: 'The Grand Atrium', location: 'Vijay Nagar, Indore', type: 'Commercial', price: 'INR 1.8 Cr', savedAt: 'Yesterday, 06:20 PM' },
          ],
          seenProperties: [
              { id: 'p1', title: 'Serenity Reserve', seenAt: 'Today, 12:04 PM' },
              { id: 'p2', title: 'Sumeru Sky Heights', seenAt: 'Today, 01:12 PM' },
              { id: 'p4', title: 'Lakeview County', seenAt: 'Today, 03:25 PM' },
              { id: 'p5', title: 'Urban Nest', seenAt: 'Yesterday, 08:40 PM' },
          ],
          contactedProperties: [
              { id: 'p1', title: 'Serenity Reserve', contactedAt: 'Today, 12:15 PM', channel: 'Phone Call' },
              { id: 'p2', title: 'Sumeru Sky Heights', contactedAt: 'Today, 01:24 PM', channel: 'WhatsApp' },
          ],
          recentSearches: ['3BHK Indore under 3 Cr', 'Ready to move apartment', 'Scheme No 140 luxury flat'],
          bookedVisits: [
              { id: 'v1', status: 'SCHEDULED', title: 'Serenity Reserve', dateFull: 'Wed, 12th June | 10:30 AM', bookingId: 'SQF-88291' },
              { id: 'v2', status: 'CONFIRMED', title: 'Sumeru Sky Heights', dateFull: 'Fri, 14th June | 04:00 PM', bookingId: 'SQF-44910' },
          ],
          screenEvents: [
              { time: '04:42 PM', screen: 'Project Detail', action: 'Viewed floor plan for Serenity Reserve' },
              { time: '04:21 PM', screen: 'Saved Properties', action: 'Opened saved properties list' },
              { time: '03:58 PM', screen: 'Book Site Visit', action: 'Selected morning visit slot' },
              { time: '03:25 PM', screen: 'Property Listing', action: 'Viewed Lakeview County' },
          ],
      },
      {
          id: 'UA002',
          userId: 'APP-U002',
          name: 'Vikash Singh',
          phone: '+91 9876543212',
          email: 'vikash@squarft.com',
          city: 'Chennai, TN',
          status: 'Idle',
          joinedDate: '08 Apr 2026',
          lastActive: 'Today, 02:18 PM',
          activeMinutesToday: 64,
          totalActiveMinutes: 920,
          sessionsToday: 3,
          savedProperties: [
              { id: 'p4', title: 'Ocean View Luxury', location: 'ECR, Chennai', type: 'Apartment', price: 'INR 3 Cr - INR 5 Cr', savedAt: 'Today, 10:05 AM' },
              { id: 'p1', title: 'Skyline Residency', location: 'Andheri West, Mumbai', type: 'Apartment', price: 'INR 1.85 Cr', savedAt: 'Yesterday, 04:30 PM' },
          ],
          seenProperties: [
              { id: 'p4', title: 'Ocean View Luxury', seenAt: 'Today, 09:54 AM' },
              { id: 'p1', title: 'Skyline Residency', seenAt: 'Yesterday, 04:20 PM' },
          ],
          contactedProperties: [
              { id: 'p4', title: 'Ocean View Luxury', contactedAt: 'Today, 10:12 AM', channel: 'Request Callback' },
          ],
          recentSearches: ['4BHK sea view Chennai', 'ECR apartment', 'Luxury flat immediate possession'],
          bookedVisits: [
              { id: 'v3', status: 'SCHEDULED', title: 'Ocean View Luxury', dateFull: 'Today | 04:00 PM', bookingId: 'SQF-77104' },
          ],
          screenEvents: [
              { time: '02:18 PM', screen: 'My Activity', action: 'Checked contacted properties' },
              { time: '01:44 PM', screen: 'Project Detail', action: 'Saved Ocean View Luxury' },
              { time: '10:12 AM', screen: 'Project Detail', action: 'Requested callback' },
          ],
      },
      {
          id: 'UA003',
          userId: 'APP-U003',
          name: 'Ankit Sharma',
          phone: '+91 9876543213',
          email: 'ankit@squarft.com',
          city: 'Mumbai, MH',
          status: 'Offline',
          joinedDate: '08 Apr 2026',
          lastActive: 'Yesterday, 09:30 PM',
          activeMinutesToday: 0,
          totalActiveMinutes: 710,
          sessionsToday: 0,
          savedProperties: [
              { id: 'p5', title: 'Green Valley Phase 2', location: 'HSR Layout, Bangalore', type: 'Villa Plot', price: 'INR 1.50 Cr', savedAt: 'Yesterday, 09:20 PM' },
          ],
          seenProperties: [
              { id: 'p5', title: 'Green Valley Phase 2', seenAt: 'Yesterday, 09:10 PM' },
              { id: 'p1', title: 'Skyline Residency', seenAt: '08 Apr, 05:14 PM' },
          ],
          contactedProperties: [],
          recentSearches: ['2BHK Andheri', 'Bangalore villa plots'],
          bookedVisits: [
              { id: 'v4', status: 'COMPLETED', title: 'Green Valley Phase 2', dateFull: '09 Mar | 10:00 AM', bookingId: 'SQF-11029' },
          ],
          screenEvents: [
              { time: '09:30 PM', screen: 'Visit', action: 'Opened past visits' },
              { time: '09:20 PM', screen: 'Project Detail', action: 'Saved Green Valley Phase 2' },
              { time: '08:52 PM', screen: 'Property Listing', action: 'Applied BHK filter' },
          ],
      },
  ];

export const panelOverviewByStatus = {
    draft: {
        label: 'Draft',
        metrics: [
            { key: 'pendingKyc', title: 'Pending KYC', value: 24, change: '+3 today', color: '#8D3106', progress: 64 },
            { key: 'activePanelUsers', title: 'Active panel users', value: 1248, change: '98.2%', color: '#2717D7', progress: 92 },
            { key: 'inOnboarding', title: 'In onboarding', value: 42, change: '12 new', color: '#655D98', progress: 46 },
            { key: 'fieldMeetings', title: 'Field meetings', value: 18, change: 'Today', color: '#2A2535', progress: 38 },
        ],
    },
    submitted: {
        label: 'Submitted',
        metrics: [
            { key: 'pendingKyc', title: 'Pending KYC', value: 18, change: '-6', color: '#8D3106', progress: 48 },
            { key: 'activePanelUsers', title: 'Active panel users', value: 1316, change: '96.8%', color: '#2717D7', progress: 88 },
            { key: 'inOnboarding', title: 'In onboarding', value: 57, change: '21 new', color: '#655D98', progress: 58 },
            { key: 'fieldMeetings', title: 'Field meetings', value: 26, change: 'Today', color: '#2A2535', progress: 52 },
        ],
    },
    adminApproved: {
        label: 'Admin approved',
        metrics: [
            { key: 'pendingKyc', title: 'Pending KYC', value: 8, change: 'Urgent', color: '#C40018', progress: 28 },
            { key: 'activePanelUsers', title: 'Active panel users', value: 1184, change: '94.4%', color: '#2717D7', progress: 84 },
            { key: 'inOnboarding', title: 'In onboarding', value: 31, change: '7 new', color: '#655D98', progress: 36 },
            { key: 'fieldMeetings', title: 'Field meetings', value: 21, change: 'Today', color: '#2A2535', progress: 44 },
        ],
    },
    live: {
        label: 'Live',
        metrics: [
            { key: 'pendingKyc', title: 'Pending KYC', value: 5, change: 'Clear', color: '#04622E', progress: 18 },
            { key: 'activePanelUsers', title: 'Active panel users', value: 1420, change: '99.1%', color: '#2717D7', progress: 96 },
            { key: 'inOnboarding', title: 'In onboarding', value: 16, change: '4 new', color: '#655D98', progress: 22 },
            { key: 'fieldMeetings', title: 'Field meetings', value: 34, change: 'Today', color: '#2A2535', progress: 62 },
        ],
    },
};

export const panelWorkflowByStatus = {
    draft: {
        fieldOfficer: {
            label: 'Field officer',
            approveLabel: 'Approve project',
            stages: [
                { title: 'Meeting', count: 14, status: 'Active', note: 'Project intro and site discussion pending' },
                { title: 'Followup', count: 9, status: 'Pending', note: 'Waiting on owner confirmation' },
                { title: 'Onboarding', count: 11, status: 'Draft', note: 'Officer details being collected' },
                { title: 'Task management', count: 7, status: 'Open', note: 'Tasks assigned to field teams' },
                { title: 'Approved', count: 3, status: 'Approved', note: 'Ready for admin handoff' },
            ],
        },
        projectPanel: {
            label: 'Project Panel',
            approveLabel: 'Approve project',
            stages: [
                { title: 'KYC Approved', count: 8, status: 'Pending', note: 'Builder KYC documents under review' },
                {
                    title: 'Onboarding states',
                    count: 22,
                    status: 'In progress',
                    note: 'Project form progress from project panel',
                    subStages: ['Basic Details', 'Property Type', 'Property Detail', 'Approvals', 'Finance', 'Image & Price'],
                },
                { title: 'Approved', count: 4, status: 'Approved', note: 'Approved projects waiting to go live' },
            ],
        },
    },
    submitted: {
        fieldOfficer: {
            label: 'Field officer',
            approveLabel: 'Approve project',
            stages: [
                { title: 'Meeting', count: 21, status: 'Done', note: 'Site meeting records submitted' },
                { title: 'Followup', count: 16, status: 'Active', note: 'Second-level followups in progress' },
                { title: 'Onboarding', count: 19, status: 'Submitted', note: 'Officer onboarding forms submitted' },
                { title: 'Task management', count: 13, status: 'Open', note: 'Tasks pending admin validation' },
                { title: 'Approved', count: 6, status: 'Approved', note: 'Cleared by branch team' },
            ],
        },
        projectPanel: {
            label: 'Project Panel',
            approveLabel: 'Approve project',
            stages: [
                { title: 'KYC Approved', count: 14, status: 'Submitted', note: 'KYC packet sent for admin review' },
                {
                    title: 'Onboarding states',
                    count: 31,
                    status: 'Submitted',
                    note: 'Project details submitted from panel',
                    subStages: ['Basic Details', 'Property Type', 'Property Detail', 'Approvals', 'Finance', 'Image & Price'],
                },
                { title: 'Approved', count: 9, status: 'Approved', note: 'Approved after submission checks' },
            ],
        },
    },
    adminApproved: {
        fieldOfficer: {
            label: 'Field officer',
            approveLabel: 'Approve project',
            stages: [
                { title: 'Meeting', count: 12, status: 'Verified', note: 'Meeting proof verified by admin' },
                { title: 'Followup', count: 8, status: 'Verified', note: 'Followup notes checked' },
                { title: 'Onboarding', count: 15, status: 'Approved', note: 'Officer onboarding approved' },
                { title: 'Task management', count: 10, status: 'Review', note: 'Tasks ready for final closure' },
                { title: 'Approved', count: 11, status: 'Approved', note: 'Admin-approved project handoff' },
            ],
        },
        projectPanel: {
            label: 'Project Panel',
            approveLabel: 'Approve project',
            stages: [
                { title: 'KYC Approved', count: 18, status: 'Approved', note: 'KYC cleared by admin' },
                {
                    title: 'Onboarding states',
                    count: 26,
                    status: 'Admin approved',
                    note: 'All main project form sections reviewed',
                    subStages: ['Basic Details', 'Property Type', 'Property Detail', 'Approvals', 'Finance', 'Image & Price'],
                },
                { title: 'Approved', count: 18, status: 'Approved', note: 'Ready for live publish approval' },
            ],
        },
    },
    live: {
        fieldOfficer: {
            label: 'Field officer',
            approveLabel: 'Approve project',
            stages: [
                { title: 'Meeting', count: 28, status: 'Closed', note: 'Live project meetings completed' },
                { title: 'Followup', count: 19, status: 'Active', note: 'Live lead followups running' },
                { title: 'Onboarding', count: 6, status: 'Closed', note: 'Officer onboarding completed' },
                { title: 'Task management', count: 24, status: 'Live', note: 'Live project task board active' },
                { title: 'Approved', count: 34, status: 'Approved', note: 'Approved and visible in operations' },
            ],
        },
        projectPanel: {
            label: 'Project Panel',
            approveLabel: 'Approve project',
            stages: [
                { title: 'KYC Approved', count: 31, status: 'Approved', note: 'KYC complete for live projects' },
                {
                    title: 'Onboarding states',
                    count: 18,
                    status: 'Live',
                    note: 'Live projects with completed panel onboarding',
                    subStages: ['Basic Details', 'Property Type', 'Property Detail', 'Approvals', 'Finance', 'Image & Price'],
                },
                { title: 'Approved', count: 34, status: 'Live', note: 'Project approved and live' },
            ],
        },
    },
};

export const mockVisits = [
    { id: 'V001', officerName: 'Manas', officerPhone: '7691962521', customerName: 'Vikash Singh', customerPhone: '8225000092', purpose: 'BUY', date: '05/04/26', time: '10:00 - 11:00 AM', status: 'Scheduled', property: { name: 'Skyline Residency', type: 'APARTMENT/FLATS', config: '3BHK Premium', address: 'Andheri West, Mumbai', price: '₹ 1.85 Cr' }, notes: 'Client highly interested.' },
];

export const sample2Visits = [
    { id: 'V001', officerName: 'Manas', officerPhone: '7691962521', customerName: 'Vikash Singh', customerPhone: '8225000092', purpose: 'BUY', date: '05/04/26', time: '10:00 - 11:00 AM', status: 'Scheduled',
        property: {
            name: 'Skyline Residency', type: 'APARTMENT/FLATS', config: '3BHK Premium',
            address: 'Andheri West, Mumbai', price: '₹ 1.85 Cr',
            builder: 'Apex Buildcon', totalUnits: 120, availableUnits: 45,
            size: '1,550 Sq.Ft', possession: 'Dec 2027', rera: 'P001-RERA-2026',
            amenities: 'Swimming Pool, Gym, Clubhouse, Park, 24/7 Security',
        },
        notes: 'Client highly interested in park facing units.',
    },
    { id: 'V006', officerName: 'Neha K.', officerPhone: '9000011111', customerName: 'Vikash Singh', customerPhone: '8225000092', purpose: 'BUY', date: '02/04/26', time: '11:00 AM - 12:00 PM', status: 'Completed',
        arrivalTime: '11:12 AM',
        userReview: 'Property location is excellent. The 3BHK layout was very spacious and the park facing view was exactly what we wanted. Pricing seems a bit high but negotiable.',
        userRating: 4,
        property: {
            name: 'Ocean View Luxury', type: 'APARTMENT/FLATS', config: '4BHK Seaview',
            address: 'ECR, Chennai', price: '₹ 4.20 Cr',
            builder: 'Coastal Reality', totalUnits: 30, availableUnits: 8,
            size: '3,200 Sq.Ft', possession: 'Dec 2027', rera: 'P004-RERA-2026',
            amenities: 'Swimming Pool, Gym, Sea View, Clubhouse',
        },
        notes: 'Client loved the sea view. Likely to close deal soon.',
    },
    { id: 'V002', officerName: 'Manas', officerPhone: '7691962521', customerName: 'Ankit Sharma', customerPhone: '8224004000', purpose: 'BUY', date: '09/03/26', time: '10:00 - 11:00 AM', status: 'Completed', property: { name: 'Green Valley Phase 2', type: 'VILLA PLOTS', config: '40x60 Plot', address: 'HSR Layout, Bangalore', price: '₹ 1.50 Cr' }, notes: 'Showed corner plots. Client will discuss with family.' },
    { id: 'V003', officerName: 'Rajesh Gurjar', officerPhone: '8224004000', customerName: 'Pawan Sharma', customerPhone: '8224004000', purpose: 'RENT', date: '28/02/26', time: '11:00 - 12:00 PM', status: 'Cancelled', property: { name: 'Metro Heights', type: 'COMMERCIAL', config: 'Retail Shop', address: 'Connaught Place, Delhi', price: '₹ 2.5 L / month' }, notes: 'Client cancelled due to emergency.' },
    { id: 'V004', officerName: 'Neha K.', officerPhone: '9000011111', customerName: 'Rohit Sharma', customerPhone: '9820012345', purpose: 'BUY', date: '09/06/26', time: '02:00 - 03:00 PM', status: 'In Progress', otpStatus: 'Verified', sources: ['Mobile', 'App'], propertyCount: 4, property: { name: 'Parkside Avenues', type: 'APARTMENT/FLATS', config: '2BHK Garden View', address: 'Andheri East, Mumbai', price: 'Rs. 1.25 Cr' }, notes: 'Officer has reached the site and customer OTP is verified.' },
    { id: 'V005', officerName: 'Sneha P.', officerPhone: '9777797777', customerName: 'Meera Kapoor', customerPhone: '9900099000', purpose: 'BUY', date: 'Today', time: '05:00 - 06:00 PM', status: 'Scheduled', otpStatus: 'Pending', sources: ['Mobile', 'App'], propertyCount: 4, property: { name: 'Ocean View Luxury', type: 'APARTMENT/FLATS', config: '4BHK Sea View', address: 'ECR, Chennai', price: 'Rs. 4.8 Cr' }, notes: 'OTP pending before site execution.' },
    {
        id: 'V006',
        officerName: 'Rahul M.',
        officerPhone: '9000022222',
        customerName: 'Nidhi Agarwal',
        customerPhone: '9810012300',
        purpose: 'BUY',
        date: 'Today',
        time: '12:30 - 01:30 PM',
        status: 'In Progress',
        otpStatus: 'Verified',
        sources: ['Website', 'App'],
        property: { name: 'Skyline Residency', type: 'APARTMENT/FLATS', config: '4BHK Luxury', address: 'Andheri West, Mumbai', price: 'Rs. 2.50 Cr' },
        properties: [
            { name: 'Skyline Residency', type: 'APARTMENT/FLATS', config: '4BHK Luxury - Tower C', address: 'Andheri West, Mumbai', price: 'Rs. 2.50 Cr' },
            { name: 'Skyline Residency', type: 'APARTMENT/FLATS', config: '3BHK Premium - Higher Floor', address: 'Andheri West, Mumbai', price: 'Rs. 1.95 Cr' },
            { name: 'Skyline Residency', type: 'APARTMENT/FLATS', config: '2BHK Classic - Tower A', address: 'Andheri West, Mumbai', price: 'Rs. 1.20 Cr' },
        ],
        notes: 'OTP verified at lobby. Family wants higher-floor options first.',
    },
    {
        id: 'V007',
        officerName: 'Vikram Singh',
        officerPhone: '9888877777',
        customerName: 'Mehul Iyer',
        customerPhone: '9901122334',
        purpose: 'BUY',
        date: 'Today',
        time: '03:00 - 04:00 PM',
        status: 'Scheduled',
        otpStatus: 'Pending',
        sources: ['Broker', 'App'],
        property: { name: 'Green Valley Phase 2', type: 'VILLA PLOTS', config: '30x40 Plot', address: 'HSR Layout, Bangalore', price: 'Rs. 85 L' },
        properties: [
            { name: 'Green Valley Phase 2', type: 'VILLA PLOTS', config: '30x40 Park Facing Plot', address: 'HSR Layout, Bangalore', price: 'Rs. 88 L' },
            { name: 'Green Valley Phase 2', type: 'VILLA PLOTS', config: '40x60 Main Road Plot', address: 'HSR Layout, Bangalore', price: 'Rs. 1.50 Cr' },
        ],
        notes: 'Broker lead. Client is comparing plot orientation and road width.',
    },
    {
        id: 'V008',
        officerName: 'Anjali Desai',
        officerPhone: '9666655555',
        customerName: 'Karan Mehta',
        customerPhone: '9818811188',
        purpose: 'BUY',
        date: 'Today',
        time: '04:00 - 05:00 PM',
        status: 'Scheduled',
        otpStatus: 'Pending',
        sources: ['Mobile', 'App'],
        property: { name: 'Metro Heights', type: 'COMMERCIAL', config: 'Office Space', address: 'Connaught Place, Delhi', price: 'Rs. 8.00 Cr' },
        properties: [
            { name: 'Metro Heights', type: 'COMMERCIAL', config: 'Office Space - Bare Shell', address: 'Connaught Place, Delhi', price: 'Rs. 8.00 Cr' },
            { name: 'Metro Heights', type: 'COMMERCIAL', config: 'Retail Shop - Frontage Unit', address: 'Connaught Place, Delhi', price: 'Rs. 3.50 Cr' },
        ],
        notes: 'Investor visit for rental-yield comparison.',
    },
    {
        id: 'V009',
        officerName: 'Sneha P.',
        officerPhone: '9777797777',
        customerName: 'Aarav Menon',
        customerPhone: '9840012345',
        purpose: 'BUY',
        date: '12/06/26',
        time: '12:30 - 01:30 PM',
        status: 'Completed',
        otpStatus: 'Verified',
        sources: ['Referral', 'App'],
        property: { name: 'Ocean View Luxury', type: 'PENTHOUSE', config: 'Penthouse', address: 'ECR, Chennai', price: 'Rs. 6.00 Cr' },
        properties: [
            { name: 'Ocean View Luxury', type: 'PENTHOUSE', config: 'Penthouse - East Wing', address: 'ECR, Chennai', price: 'Rs. 6.00 Cr' },
            { name: 'Ocean View Luxury', type: 'APARTMENT/FLATS', config: '4BHK Seaview - Club Facing', address: 'ECR, Chennai', price: 'Rs. 4.65 Cr' },
        ],
        notes: 'Client asked for payment plan and clubhouse completion date.',
    },
    {
        id: 'V010',
        officerName: 'Rahul M.',
        officerPhone: '9000022222',
        customerName: 'Priya Nair',
        customerPhone: '9876501234',
        purpose: 'BUY',
        date: 'Today',
        time: '10:00 - 11:00 AM',
        status: 'Scheduled',
        otpStatus: 'Pending',
        sources: ['Website', 'Mobile'],
        property: { name: 'Parkside Avenues', type: 'APARTMENT/FLATS', config: '1BHK Smart', address: 'Andheri East, Mumbai', price: 'Rs. 90 L' },
        properties: [
            { name: 'Parkside Avenues', type: 'APARTMENT/FLATS', config: '1BHK Smart - Tower A', address: 'Andheri East, Mumbai', price: 'Rs. 90 L' },
            { name: 'Parkside Avenues', type: 'APARTMENT/FLATS', config: '2BHK Classic - Tower B', address: 'Andheri East, Mumbai', price: 'Rs. 1.45 Cr' },
        ],
        notes: 'First-time buyer. Needs compact options near metro access.',
    },
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

export const branchDashboardData = {
    all: {
        label: 'All Branches (Global)',
        metrics: dashboardMetrics,
        branches: mockBranches,
        roleDistribution,
    },
    B01: {
        label: 'Indore Headquarters',
        metrics: [
            { ...dashboardMetrics[0], value: '1,420', trend: '+21.2%' },
            { ...dashboardMetrics[1], value: '₹12.4 Cr', trend: '+35.1%' },
            { ...dashboardMetrics[2], title: 'Managed Branches', value: '1', trend: 'HQ' },
            { ...dashboardMetrics[3], value: '52', trend: '+6' },
        ],
        branches: [mockBranches[0]],
        roleDistribution: [
            { role: 'Sales Officers', count: 34, color: 'bg-[#6F4BFF]' },
            { role: 'Field Officers', count: 12, color: 'bg-blue-500' },
            { role: 'Registered Brokers', count: 5, color: 'bg-amber-500' },
            { role: 'Branch Managers', count: 1, color: 'bg-rose-500' },
            { role: 'Super Admins', count: 1, color: 'bg-gray-800' }
        ],
    },
    B02: {
        label: 'Mumbai MMR Hub',
        metrics: [
            { ...dashboardMetrics[0], value: '930', trend: '+16.8%' },
            { ...dashboardMetrics[1], value: '₹8.2 Cr', trend: '+28.6%' },
            { ...dashboardMetrics[2], title: 'Managed Branches', value: '1', trend: 'Regional' },
            { ...dashboardMetrics[3], value: '38', trend: '+4' },
        ],
        branches: [mockBranches[1]],
        roleDistribution: [
            { role: 'Sales Officers', count: 26, color: 'bg-[#6F4BFF]' },
            { role: 'Field Officers', count: 8, color: 'bg-blue-500' },
            { role: 'Registered Brokers', count: 3, color: 'bg-amber-500' },
            { role: 'Branch Managers', count: 1, color: 'bg-rose-500' },
            { role: 'Super Admins', count: 0, color: 'bg-gray-800' }
        ],
    },
    B03: {
        label: 'Bangalore Tech Park',
        metrics: [
            { ...dashboardMetrics[0], value: '610', trend: '+11.4%' },
            { ...dashboardMetrics[1], value: '₹3.1 Cr', trend: '+19.2%' },
            { ...dashboardMetrics[2], title: 'Managed Branches', value: '1', trend: 'Satellite' },
            { ...dashboardMetrics[3], value: '23', trend: '+2' },
        ],
        branches: [mockBranches[2]],
        roleDistribution: [
            { role: 'Sales Officers', count: 15, color: 'bg-[#6F4BFF]' },
            { role: 'Field Officers', count: 5, color: 'bg-blue-500' },
            { role: 'Registered Brokers', count: 2, color: 'bg-amber-500' },
            { role: 'Branch Managers', count: 1, color: 'bg-rose-500' },
            { role: 'Super Admins', count: 0, color: 'bg-gray-800' }
        ],
    },
    B04: {
        label: 'Pune Setup',
        metrics: [
            { ...dashboardMetrics[0], value: '0', trend: 'Setup', isUp: false },
            { ...dashboardMetrics[1], value: '₹0', trend: 'Pending', isUp: false },
            { ...dashboardMetrics[2], title: 'Managed Branches', value: '1', trend: 'Setup' },
            { ...dashboardMetrics[3], value: '0', trend: 'Hiring', isUp: false },
        ],
        branches: [mockBranches[3]],
        roleDistribution: [
            { role: 'Sales Officers', count: 0, color: 'bg-[#6F4BFF]' },
            { role: 'Field Officers', count: 0, color: 'bg-blue-500' },
            { role: 'Registered Brokers', count: 0, color: 'bg-amber-500' },
            { role: 'Branch Managers', count: 0, color: 'bg-rose-500' },
            { role: 'Super Admins', count: 0, color: 'bg-gray-800' }
        ],
    },
};

export const adminMetrics = [
    { 
        title: 'Active Leads Pipeline', 
        value: '1,248', 
        trend: '+12.5%', 
        isUp: true, 
        icon: Zap, 
        color: 'text-[#6F4BFF]', 
        bg: 'bg-[#6F4BFF]/10', 
        chartColor: '#6F4BFF', 
        svgPath: 'M0,20 Q10,15 20,25 T40,10 T60,20 T80,5 T100,15 L100,30 L0,30 Z' 
    },
    { 
        title: 'Qualified Clients', 
        value: '342', 
        trend: '+8.2%', 
        isUp: true, 
        icon: Users, 
        color: 'text-blue-500', 
        bg: 'bg-blue-50', 
        chartColor: '#3B82F6', 
        svgPath: 'M0,25 Q15,5 30,15 T60,10 T80,20 T100,5 L100,30 L0,30 Z' 
    },
    { 
        title: 'Ongoing Negotiations', 
        value: '84', 
        trend: '-2.4%', 
        isUp: false, 
        icon: Briefcase, 
        color: 'text-amber-500', 
        bg: 'bg-amber-50', 
        chartColor: '#F59E0B', 
        svgPath: 'M0,10 Q20,15 40,5 T70,25 T100,15 L100,30 L0,30 Z' 
    },
    { 
        title: 'Realized Revenue', 
        value: '₹4.2 Cr', 
        trend: '+24.8%', 
        isUp: true, 
        icon: IndianRupee, 
        color: 'text-emerald-500', 
        bg: 'bg-emerald-50', 
        chartColor: '#10B981', 
        svgPath: 'M0,25 Q20,20 30,10 T60,15 T80,5 T100,0 L100,30 L0,30 Z' 
    },
];

export const adminRoleDistribution = [
    { role: 'Sales Officers', count: 18, color: 'bg-[#6F4BFF]' },
    { role: 'Field Officers', count: 6, color: 'bg-blue-500' },
];

export const revenueTrajectory = {
    revenue: [
        { month: 'Nov', val: 1.2 },
        { month: 'Dec', val: 1.8 },
        { month: 'Jan', val: 1.5 },
        { month: 'Feb', val: 2.4 },
        { month: 'Mar', val: 3.2 },
        { month: 'Apr', val: 4.2 },
    ],
    deals: [
        { month: 'Nov', val: 15 },
        { month: 'Dec', val: 22 },
        { month: 'Jan', val: 18 },
        { month: 'Feb', val: 28 },
        { month: 'Mar', val: 35 },
        { month: 'Apr', val: 42 },
    ]
};

export const liveActivity = [
    { time: 'Just now', action: 'Payment Received', detail: '₹ 5.0L for Flat 402, Skyline', type: 'payment' },
    { time: '12 mins ago', action: 'Status Changed', detail: 'Vikash S. shortlisted Ocean View', type: 'status' },
    { time: '45 mins ago', action: 'New Lead Auto-Assigned', detail: 'Ravi T. assigned to Swati Jain', type: 'lead' },
    { time: '2 hours ago', action: 'Site Visit Completed', detail: 'Neha K. at Parkside Avenues', type: 'visit' },
    { time: '3 hours ago', action: 'Agreement Uploaded', detail: 'Deal D003 - Green Valley', type: 'document' },
];

export const pipelineFunnel = [
    { label: 'Raw Leads', val: '1,248', width: '100%', color: 'from-gray-200 to-gray-300' },
    { label: 'Qualified (Budget Matched)', val: '342', width: '85%', color: 'from-blue-300 to-blue-400' },
    { label: 'Site Visited', val: '185', width: '60%', color: 'from-indigo-400 to-purple-400' },
    { label: 'Active Negotiation', val: '84', width: '40%', color: 'from-[#6F4BFF] to-[#9D84FF]' },
    { label: 'Closed Deals', val: '42', width: '25%', color: 'from-emerald-400 to-emerald-500' },
];

export const geoPerformance = [
    { city: 'Mumbai MMR', leads: '450', closed: 24, progress: 80, color: 'bg-[#6F4BFF]' },
    { city: 'Bangalore', leads: '320', closed: 18, progress: 65, color: 'bg-blue-500' },
    { city: 'Delhi NCR', leads: '210', closed: 8, progress: 40, color: 'bg-amber-500' },
    { city: 'Chennai', leads: '140', closed: 12, progress: 55, color: 'bg-emerald-500' },
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

