import { Zap, IndianRupee, Globe, Users, Briefcase } from 'lucide-react';

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
    { id: 'V001', officerName: 'Manas', officerPhone: '7691962521', customerName: 'Vikash Singh', customerPhone: '8225000092', purpose: 'BUY', date: '05/04/26', time: '10:00 - 11:00 AM', status: 'Scheduled', property: { name: 'Skyline Residency', type: 'APARTMENT/FLATS', config: '3BHK Premium', address: 'Andheri West, Mumbai', price: '₹ 1.85 Cr' }, notes: 'Client highly interested in park facing units.' },
    { id: 'V002', officerName: 'Manas', officerPhone: '7691962521', customerName: 'Ankit Sharma', customerPhone: '8224004000', purpose: 'BUY', date: '09/03/26', time: '10:00 - 11:00 AM', status: 'Completed', property: { name: 'Green Valley Phase 2', type: 'VILLA PLOTS', config: '40x60 Plot', address: 'HSR Layout, Bangalore', price: '₹ 1.50 Cr' }, notes: 'Showed corner plots. Client will discuss with family.' },
    { id: 'V003', officerName: 'Rajesh Gurjar', officerPhone: '8224004000', customerName: 'Pawan Sharma', customerPhone: '8224004000', purpose: 'RENT', date: '28/02/26', time: '11:00 - 12:00 PM', status: 'Cancelled', property: { name: 'Metro Heights', type: 'COMMERCIAL', config: 'Retail Shop', address: 'Connaught Place, Delhi', price: '₹ 2.5 L / month' }, notes: 'Client cancelled due to emergency.' },
    { id: 'V004', officerName: 'Neha K.', officerPhone: '9000011111', customerName: 'Rohit Sharma', customerPhone: '9820012345', purpose: 'BUY', date: '09/06/26', time: '02:00 - 03:00 PM', status: 'In Progress', otpStatus: 'Verified', sources: ['Mobile', 'App'], propertyCount: 4, property: { name: 'Parkside Avenues', type: 'APARTMENT/FLATS', config: '2BHK Garden View', address: 'Andheri East, Mumbai', price: 'Rs. 1.25 Cr' }, notes: 'Officer has reached the site and customer OTP is verified.' },
    { id: 'V005', officerName: 'Sneha P.', officerPhone: '9777797777', customerName: 'Meera Kapoor', customerPhone: '9900099000', purpose: 'BUY', date: 'Today', time: '05:00 - 06:00 PM', status: 'Scheduled', otpStatus: 'Pending', sources: ['Mobile', 'App'], propertyCount: 4, property: { name: 'Ocean View Luxury', type: 'APARTMENT/FLATS', config: '4BHK Sea View', address: 'ECR, Chennai', price: 'Rs. 4.8 Cr' }, notes: 'OTP pending before site execution.' },
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

