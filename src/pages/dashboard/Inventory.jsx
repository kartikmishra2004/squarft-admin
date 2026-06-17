import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
    Plus, Search, Building2, MapPin, ArrowRight, FileText, 
    Layers, Settings, Calendar, X, Maximize, Edit2, Save,
    IndianRupee, Zap, Sparkles, Check, XCircle, CheckCircle2,
    Trash2, Users, FileIcon, UserPlus, Filter, ChevronDown, Briefcase
} from 'lucide-react';
import { setSelectedProject, setSelectedBuilder, setSelectedBroker, setViewMode, setFilters } from '../../store/inventorySlice';
import { mockProjects } from '../../data/mockData';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Header from '../../components/layout/Header';

const getStatusBadge = (status) => {
    if (!status) return null;
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
            return <Badge variant="gradient">{status}</Badge>;
        default:
            return <Badge variant="gray">{status}</Badge>;
    }
};

const getMinimumPriceInLacs = (priceRange = '') => {
    const priceStr = priceRange.toLowerCase();
    const match = priceStr.match(/(\d+\.?\d*)\s*(cr|l|lacs?)/i);

    if (!match) return 0;

    const value = parseFloat(match[1]);
    const unit = match[2].toLowerCase();

    return unit === 'cr' ? value * 100 : value;
};

const matchesProjectFilters = (project, filters) => {
    const search = filters.search?.toLowerCase() || '';
    const matchesSearch = search === '' ||
        project.name.toLowerCase().includes(search) ||
        project.builder.toLowerCase().includes(search) ||
        project.location.toLowerCase().includes(search);

    const minPrice = getMinimumPriceInLacs(project.priceRange);
    let matchesPriceRange = true;

    switch (filters.priceRange) {
        case 'under-1cr':
            matchesPriceRange = minPrice < 100;
            break;
        case '1cr-2cr':
            matchesPriceRange = minPrice >= 100 && minPrice < 200;
            break;
        case '2cr-5cr':
            matchesPriceRange = minPrice >= 200 && minPrice < 500;
            break;
        case '5cr-plus':
            matchesPriceRange = minPrice >= 500;
            break;
        default:
            matchesPriceRange = true;
    }

    const matchesLocation = filters.location === 'all' ||
        project.location.toLowerCase().includes(filters.location.toLowerCase());

    return matchesSearch && matchesPriceRange && matchesLocation;
};

const DEFAULT_PROJECT_IMAGE = '/inventory-images/project-main.png';
const DEFAULT_FLOOR_PLAN_IMAGE = '/floor-plans/building-naksha.png';

const PROPERTY_TYPE_HIERARCHY = [
    { mainType: 'Residential', subTypes: ['Plot', 'Villa', 'Apartment', 'Rowhouse'] },
    { mainType: 'Commercial', subTypes: ['Shop', 'Showroom', 'Office'] },
];

const normalizeText = (value = '') => String(value).toLowerCase().replace(/[^a-z0-9+]+/g, ' ').trim();

const canonicalPropertyTypes = PROPERTY_TYPE_HIERARCHY.flatMap((group) => (
    group.subTypes.map((subType) => ({ mainType: group.mainType, subType }))
));

const findCanonicalPropertyType = (value = '') => {
    const normalized = normalizeText(value);
    if (!normalized) return null;

    if (normalized.includes('plot')) return { mainType: 'Residential', subType: 'Plot' };
    if (normalized.includes('villa')) return { mainType: 'Residential', subType: 'Villa' };
    if (normalized.includes('rowhouse') || normalized.includes('row house')) return { mainType: 'Residential', subType: 'Rowhouse' };
    if (normalized.includes('apartment') || normalized.includes('flat') || normalized.includes('bhk') || normalized.includes('penthouse')) {
        return { mainType: 'Residential', subType: 'Apartment' };
    }
    if (normalized.includes('showroom')) return { mainType: 'Commercial', subType: 'Showroom' };
    if (normalized.includes('shop') || normalized.includes('retail')) return { mainType: 'Commercial', subType: 'Shop' };
    if (normalized.includes('office') || normalized.includes('co working') || normalized.includes('coworking') || normalized.includes('bare shell')) {
        return { mainType: 'Commercial', subType: 'Office' };
    }

    return canonicalPropertyTypes.find((type) => normalized.includes(normalizeText(type.subType))) || null;
};

const inferInventoryHierarchy = (project, row) => {
    const explicit = row.propertyHierarchy || row.propertyType || row.property_type || {};
    const explicitMainType = row.mainType || row.main_type || explicit.mainType || explicit.main_type || project.mainType || project.propertyType;
    const explicitSubType = row.subType || row.sub_type || row.propertySubType || row.property_subtype || explicit.subType || explicit.sub_type || project.subType || project.propertySubType;
    const inferred = findCanonicalPropertyType([
        explicitSubType,
        row.type,
        row.configuration,
        ...(project.configs || []),
        project.specs,
        project.projectType,
        project.name,
    ].filter(Boolean).join(' '));
    const mainType = explicitMainType || inferred?.mainType || (normalizeText(project.specs).includes('commercial') ? 'Commercial' : normalizeText(project.specs).includes('residential') ? 'Residential' : '');
    const subType = explicitSubType || inferred?.subType || '';
    const configuration = row.configuration || row.variant || row.type || '';
    const missing = [];

    if (!explicitMainType && !inferred?.mainType) missing.push('Property main type');
    if (!explicitSubType && !inferred?.subType) missing.push('Property type');
    if (!configuration) missing.push('Configuration');
    if (!row.size && !row.area) missing.push('Area / size');
    if (!row.basePrice && !row.price) missing.push('Base price');
    if (row.totalUnits === undefined && !row.unitsList?.length) missing.push('Total units');
    if (row.availableUnits === undefined && !row.unitsList?.some((unit) => unit.status === 'Available')) missing.push('Available units');
    if (!row.floorPlan && !row.floorPlanUrl) missing.push('Uploaded floor plan');

    return {
        mainType: mainType || 'Missing',
        subType: subType || 'Missing',
        configuration: configuration || 'Missing',
        missing,
    };
};

const getInventoryCounts = (project) => {
    const total = project.units || (project.inventory || []).reduce((sum, item) => sum + (item.totalUnits || 0), 0);
    const available = project.available || (project.inventory || []).reduce((sum, item) => sum + (item.availableUnits || 0), 0);
    const sold = Math.max(total - available, 0);
    const booked = project.booked || Math.max(Math.round(sold * 0.25), 0);

    return { total, available, sold, booked };
};

const getProjectMeta = (project) => {
    const builderProfile = project.builderProfile || {};
    const brokerProfile = project.brokerProfile || {};
    const reraNumber = builderProfile.reraNumber || brokerProfile.reraNumber || project.reraNumber || 'RERA pending';
    const possession = project.possession || (project.status === 'Active' || project.status === 'Approved' ? 'Ready / Near possession' : 'Timeline pending');
    const avgPrice = project.avgPrice || project.avg_price_per_sqft || 'Price on request';
    const amenities = project.amenities || [
        project.specs,
        project.configs?.[0],
        'Verified documents',
        'Brochure available',
    ].filter(Boolean).slice(0, 4);
    const images = project.projectImages?.length ? project.projectImages : [DEFAULT_PROJECT_IMAGE];

    return { reraNumber, possession, avgPrice, amenities, images };
};

const ProjectImageStrip = ({ project, className = 'h-44' }) => {
    const { images } = getProjectMeta(project);
    const heroImage = images[0] || DEFAULT_PROJECT_IMAGE;
    const thumbImage = images[1] || heroImage;

    return (
        <div className={`${className} relative overflow-hidden bg-gray-100`}>
            <div className="grid grid-cols-[1.4fr_0.8fr] h-full gap-0.5">
                <img src={heroImage} alt={`${project.name} project view`} className="h-full w-full object-cover" />
                <div className="relative">
                    <img src={thumbImage} alt={`${project.name} gallery preview`} className="h-full w-full object-cover" />
                    <div className="absolute bottom-3 right-3 rounded-md bg-black/55 px-2 py-1 text-[10px] font-black text-white">
                        1/{images.length}
                    </div>
                </div>
            </div>
            <div className="absolute top-3 left-3 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-[#2512D9] shadow-sm">
                SquarFT Verified
            </div>
            <div className="absolute top-3 right-3">
                {getStatusBadge(project.status)}
            </div>
        </div>
    );
};

const ProjectInventoryCard = ({ project, onOpen }) => {
    const meta = getProjectMeta(project);
    const counts = getInventoryCounts(project);

    return (
        <Card noPadding className="group hover:border-[#6F4BFF]/40 hover:shadow-xl transition-all flex flex-col h-full overflow-hidden border-gray-100">
            <button type="button" onClick={() => onOpen(project)} className="text-left w-full">
                <ProjectImageStrip project={project} />
            </button>
            <div className="p-5 flex-1 flex flex-col">
                <button type="button" onClick={() => onOpen(project)} className="text-left">
                    <h3 className="text-xl font-black text-gray-900 mb-1 group-hover:text-[#6F4BFF] transition-colors tracking-tight">
                        {project.name}
                    </h3>
                </button>
                <p className="text-sm text-gray-500 font-bold flex items-center gap-1.5 mb-3">
                    <MapPin className="w-4 h-4 text-gray-400 shrink-0" /> {project.location}
                </p>

                <div className="flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">
                    <span>Possession: <b className="text-gray-700">{meta.possession}</b></span>
                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                    <span>Avg: <b className="text-gray-700">{meta.avgPrice}</b></span>
                </div>

                <div className="grid grid-cols-4 gap-2 mb-4">
                    {[
                        ['Total', counts.total],
                        ['Avail', counts.available],
                        ['Sold', counts.sold],
                        ['Booked', counts.booked],
                    ].map(([label, value]) => (
                        <div key={label} className="rounded-lg border border-gray-100 bg-gray-50 px-2 py-2 text-center">
                            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">{label}</p>
                            <p className="text-sm font-black text-gray-900">{value}</p>
                        </div>
                    ))}
                </div>

                <div className="space-y-2 mb-5">
                    {(project.inventory || []).slice(0, 2).map((item) => (
                        <div key={`${project.id}-${item.type}`} className="rounded-xl border border-gray-100 bg-white px-3 py-2">
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <p className="text-xs font-black text-gray-900 truncate">{item.type}</p>
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{item.size}</p>
                                </div>
                                <p className="text-xs font-black text-[#6F4BFF] whitespace-nowrap">{item.basePrice}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between gap-4">
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Base Pricing</p>
                        <p className="font-black text-gray-900 text-lg tracking-tight">{project.priceRange}</p>
                    </div>
                    <div className="flex gap-1.5 flex-wrap justify-end">
                        {project.configs.map(c => (
                            <span key={c} className="text-[10px] font-black bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg uppercase tracking-wider">
                                {c}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </Card>
    );
};

const Inventory = () => {
    const dispatch = useDispatch();
    const { filteredProjects, selectedProject, selectedBuilder, selectedBroker, viewMode, filters } = useSelector((state) => state.inventory);
    const [showPriceDropdown, setShowPriceDropdown] = useState(false);
    const [showLocationDropdown, setShowLocationDropdown] = useState(false);

    // Get unique locations from projects
    const uniqueLocations = [...new Set(mockProjects.map(p => p.location.split(',').pop().trim()))];

    // Get unique builders from projects that were added by builders
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

    console.log('🏗️ [INVENTORY] Unique Builders Generated:', uniqueBuilders);
    console.log('🏗️ [INVENTORY] Builder Count:', uniqueBuilders.length);
    uniqueBuilders.forEach((builder, idx) => {
        console.log(`🏗️ [INVENTORY] Builder ${idx + 1}:`, builder.companyName, 'Projects:', builder.projects?.length);
    });

    const filteredBuilders = uniqueBuilders
        .map((builder) => {
            const builderMatchesSearch = !filters.search ||
                builder.companyName.toLowerCase().includes(filters.search.toLowerCase()) ||
                builder.fullName.toLowerCase().includes(filters.search.toLowerCase()) ||
                builder.location.toLowerCase().includes(filters.search.toLowerCase());
            const visibleProjects = (builder.projects || []).filter((project) =>
                matchesProjectFilters(project, filters) || builderMatchesSearch
            );

            return { ...builder, visibleProjects };
        })
        .filter((builder) => builder.visibleProjects.length > 0);

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

    const filteredBrokers = uniqueBrokers
        .map((broker) => {
            const brokerMatchesSearch = !filters.search ||
                broker.agencyName.toLowerCase().includes(filters.search.toLowerCase()) ||
                broker.fullName.toLowerCase().includes(filters.search.toLowerCase()) ||
                broker.location.toLowerCase().includes(filters.search.toLowerCase()) ||
                broker.coverage.toLowerCase().includes(filters.search.toLowerCase());
            const visibleProjects = (broker.projects || []).filter((project) =>
                matchesProjectFilters(project, filters) || brokerMatchesSearch
            );

            return { ...broker, visibleProjects };
        })
        .filter((broker) => broker.visibleProjects.length > 0);

    const handleSearch = (e) => {
        dispatch(setFilters({ search: e.target.value }));
    };

    const handlePropertySourceFilter = (source) => {
        dispatch(setFilters({ propertySource: source }));
        dispatch(setViewMode('projects')); // Reset view mode when changing source
        dispatch(setSelectedBuilder(null));
        dispatch(setSelectedBroker(null));
    };

    const handlePriceRangeFilter = (range) => {
        dispatch(setFilters({ priceRange: range }));
        setShowPriceDropdown(false);
    };

    const handleLocationFilter = (location) => {
        dispatch(setFilters({ location: location }));
        setShowLocationDropdown(false);
    };

    const handleProjectClick = (project) => {
        dispatch(setSelectedProject(project));
    };

    const handleBuilderClick = (builder) => {
        console.log('🏗️ [INVENTORY] Builder Card Clicked');
        console.log('📊 Builder Object:', builder);
        console.log('📊 Builder Company Name:', builder.companyName);
        console.log('📊 Builder Project Count:', builder.projectCount);
        console.log('📊 Builder Projects Array:', builder.projects);
        console.log('📊 Projects Length:', builder.projects?.length);
        
        dispatch(setSelectedBuilder(builder));
        dispatch(setViewMode('builderProjects'));
        
        console.log('✅ Dispatched setSelectedBuilder and setViewMode("builderProjects")');
    };

    const handleBrokerClick = (broker) => {
        dispatch(setSelectedBroker(broker));
        dispatch(setViewMode('brokerProjects'));
    };

    const handleBack = () => {
        if (viewMode === 'builderProjects' || viewMode === 'brokerProjects') {
            dispatch(setViewMode('projects'));
            dispatch(setSelectedBuilder(null));
            dispatch(setSelectedBroker(null));
        } else {
            dispatch(setSelectedProject(null));
        }
    };

    // Get display label for price range
    const getPriceRangeLabel = () => {
        switch(filters.priceRange) {
            case 'under-1cr': return 'Under 1 Cr';
            case '1cr-2cr': return '1-2 Cr';
            case '2cr-5cr': return '2-5 Cr';
            case '5cr-plus': return '5 Cr+';
            default: return 'All Prices';
        }
    };

    // Get display label for location
    const getLocationLabel = () => {
        return filters.location === 'all' ? 'All Locations' : filters.location;
    };

    // Show builder projects view
    console.log('🔍 [INVENTORY] Checking View Mode:', viewMode);
    console.log('🔍 [INVENTORY] Selected Builder:', selectedBuilder);
    console.log('🔍 [INVENTORY] Should Show BuilderProjectsView:', viewMode === 'builderProjects' && selectedBuilder);
    
    if (viewMode === 'builderProjects' && selectedBuilder) {
        console.log('✅ [INVENTORY] Rendering BuilderProjectsView');
        return <BuilderProjectsView builder={selectedBuilder} onBack={handleBack} />;
    }

    if (viewMode === 'brokerProjects' && selectedBroker) {
        return <BuilderProjectsView builder={selectedBroker} onBack={handleBack} profileType="broker" />;
    }

    // Show project detail view
    if (selectedProject) {
        return <ProjectDetailView project={selectedProject} onBack={handleBack} />;
    }

    // Determine what to show: grouped profiles or flat projects
    const showBuilders = filters.propertySource === 'builder';
    const showBrokers = filters.propertySource === 'broker';

    return (
        <div className="flex-1 flex flex-col h-full relative bg-[#F5F6FA] font-sans text-gray-900">
            <Header title="Project Inventory" />

            <main className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth">
                <div className="max-w-[1600px] mx-auto flex flex-col gap-6">
                    
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Project Inventory</h2>
                            <p className="text-sm text-gray-500 mt-1 font-medium">Manage builders, projects, and unit configurations.</p>
                        </div>
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <div className="relative flex-1 sm:w-80">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search projects, builders, locations..."
                                    className="pl-9 pr-4 py-2.5 w-full bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6F4BFF]/20 focus:border-[#6F4BFF] transition-all shadow-sm"
                                    value={filters.search}
                                    onChange={handleSearch}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Property Source Filter */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="flex items-center gap-2 text-sm text-gray-600 font-bold shrink-0">
                            <Filter className="w-4 h-4" />
                            <span>Filter by Source:</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => handlePropertySourceFilter('all')}
                                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                                    filters.propertySource === 'all'
                                        ? 'bg-[#6F4BFF] text-white shadow-lg shadow-[#6F4BFF]/20'
                                        : 'bg-white text-gray-600 border border-gray-200 hover:border-[#6F4BFF]/40'
                                }`}
                            >
                                All Properties
                            </button>
                            <button
                                onClick={() => handlePropertySourceFilter('builder')}
                                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                                    filters.propertySource === 'builder'
                                        ? 'bg-[#6F4BFF] text-white shadow-lg shadow-[#6F4BFF]/20'
                                        : 'bg-white text-gray-600 border border-gray-200 hover:border-[#6F4BFF]/40'
                                }`}
                            >
                                Added by Builder
                            </button>
                            <button
                                onClick={() => handlePropertySourceFilter('broker')}
                                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                                    filters.propertySource === 'broker'
                                        ? 'bg-[#6F4BFF] text-white shadow-lg shadow-[#6F4BFF]/20'
                                        : 'bg-white text-gray-600 border border-gray-200 hover:border-[#6F4BFF]/40'
                                }`}
                            >
                                Added by Broker
                            </button>
                        </div>
                    </div>

                    {/* Additional Filters: Price Range & Location */}
                    {!showBuilders && !showBrokers && (
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-500">
                            <div className="flex items-center gap-2 text-sm text-gray-600 font-bold shrink-0">
                                <Filter className="w-4 h-4" />
                                <span>More Filters:</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                            {/* Price Range Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => {
                                        setShowPriceDropdown(!showPriceDropdown);
                                        setShowLocationDropdown(false);
                                    }}
                                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                                        filters.priceRange !== 'all'
                                            ? 'bg-[#6F4BFF] text-white shadow-lg shadow-[#6F4BFF]/20'
                                            : 'bg-white text-gray-600 border border-gray-200 hover:border-[#6F4BFF]/40'
                                    }`}
                                >
                                    <IndianRupee className="w-3 h-3" />
                                    {getPriceRangeLabel()}
                                    <ChevronDown className="w-3 h-3" />
                                </button>
                                {showPriceDropdown && (
                                    <div className="absolute top-full mt-2 left-0 bg-white border border-gray-200 rounded-xl shadow-xl z-50 min-w-[200px] overflow-hidden">
                                        <button
                                            onClick={() => handlePriceRangeFilter('all')}
                                            className="w-full px-4 py-2.5 text-left text-xs font-bold hover:bg-gray-50 transition-colors"
                                        >
                                            All Prices
                                        </button>
                                        <button
                                            onClick={() => handlePriceRangeFilter('under-1cr')}
                                            className="w-full px-4 py-2.5 text-left text-xs font-bold hover:bg-gray-50 transition-colors border-t border-gray-100"
                                        >
                                            Under 1 Cr
                                        </button>
                                        <button
                                            onClick={() => handlePriceRangeFilter('1cr-2cr')}
                                            className="w-full px-4 py-2.5 text-left text-xs font-bold hover:bg-gray-50 transition-colors border-t border-gray-100"
                                        >
                                            1 Cr - 2 Cr
                                        </button>
                                        <button
                                            onClick={() => handlePriceRangeFilter('2cr-5cr')}
                                            className="w-full px-4 py-2.5 text-left text-xs font-bold hover:bg-gray-50 transition-colors border-t border-gray-100"
                                        >
                                            2 Cr - 5 Cr
                                        </button>
                                        <button
                                            onClick={() => handlePriceRangeFilter('5cr-plus')}
                                            className="w-full px-4 py-2.5 text-left text-xs font-bold hover:bg-gray-50 transition-colors border-t border-gray-100"
                                        >
                                            5 Cr & Above
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Location Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => {
                                        setShowLocationDropdown(!showLocationDropdown);
                                        setShowPriceDropdown(false);
                                    }}
                                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                                        filters.location !== 'all'
                                            ? 'bg-[#6F4BFF] text-white shadow-lg shadow-[#6F4BFF]/20'
                                            : 'bg-white text-gray-600 border border-gray-200 hover:border-[#6F4BFF]/40'
                                    }`}
                                >
                                    <MapPin className="w-3 h-3" />
                                    {getLocationLabel()}
                                    <ChevronDown className="w-3 h-3" />
                                </button>
                                {showLocationDropdown && (
                                    <div className="absolute top-full mt-2 left-0 bg-white border border-gray-200 rounded-xl shadow-xl z-50 min-w-[200px] max-h-[300px] overflow-y-auto">
                                        <button
                                            onClick={() => handleLocationFilter('all')}
                                            className="w-full px-4 py-2.5 text-left text-xs font-bold hover:bg-gray-50 transition-colors"
                                        >
                                            All Locations
                                        </button>
                                        {uniqueLocations.map((loc, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handleLocationFilter(loc)}
                                                className="w-full px-4 py-2.5 text-left text-xs font-bold hover:bg-gray-50 transition-colors border-t border-gray-100"
                                            >
                                                {loc}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Clear All Filters Button */}
                            {(filters.propertySource !== 'all' || filters.priceRange !== 'all' || filters.location !== 'all' || filters.search !== '') && (
                                <button
                                    onClick={() => dispatch(setFilters({ propertySource: 'all', priceRange: 'all', location: 'all', search: '' }))}
                                    className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                                >
                                    <X className="w-3 h-3 inline mr-1" />
                                    Clear All
                                </button>
                            )}
                            </div>
                    </div>
                    )}

                    {/* Builder Profile List - Show when "Added by Builder" is selected */}
                    {showBuilders && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            {filteredBuilders.map((builder) => (
                                <section key={builder.companyName} className="rounded-2xl border border-gray-100 bg-white p-5 md:p-6 shadow-sm">
                                    <div className="flex flex-col lg:flex-row lg:items-center gap-5 mb-6">
                                        <div className="flex items-start gap-4 flex-1">
                                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center shrink-0">
                                                <Users className="w-8 h-8 text-[#6F4BFF]" />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                                    <h3 className="text-xl font-black text-gray-900 tracking-tight">{builder.companyName}</h3>
                                                    <Badge variant="purple">{builder.builderType}</Badge>
                                                </div>
                                                <p className="text-sm text-gray-600 line-clamp-2">{builder.about}</p>
                                                <div className="mt-3 flex flex-wrap gap-3 text-xs font-bold text-gray-500">
                                                    <span className="inline-flex items-center gap-1.5"><UserPlus className="w-3.5 h-3.5" />{builder.fullName}</span>
                                                    <span className="inline-flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{builder.location}</span>
                                                    <span className="inline-flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" />RERA: {builder.reraNumber}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 lg:text-right">
                                            <div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Visible Inventory</p>
                                                <p className="text-2xl font-black text-gray-900">{builder.visibleProjects.length}</p>
                                            </div>
                                            <Button variant="secondary" size="sm" className="font-black uppercase tracking-widest text-xs" onClick={() => handleBuilderClick(builder)}>
                                                View Projects
                                                <ArrowRight className="w-4 h-4 ml-2" />
                                            </Button>
                                        </div>
                                    </div>
                                </section>
                            ))}
                        </div>
                    )}

                    {/* Broker Profile Sections - Show when "Added by Broker" is selected */}
                    {showBrokers && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            {filteredBrokers.map((broker) => (
                                <section key={broker.agencyName} className="rounded-2xl border border-gray-100 bg-white p-5 md:p-6 shadow-sm">
                                    <div className="flex flex-col lg:flex-row lg:items-center gap-5 mb-6">
                                        <div className="flex items-start gap-4 flex-1">
                                            <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center shrink-0">
                                                <Briefcase className="w-8 h-8 text-amber-600" />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                                    <h3 className="text-xl font-black text-gray-900 tracking-tight">{broker.agencyName}</h3>
                                                    <Badge variant="yellow">{broker.brokerType}</Badge>
                                                </div>
                                                <p className="text-sm text-gray-600 line-clamp-2">{broker.about}</p>
                                                <div className="mt-3 flex flex-wrap gap-3 text-xs font-bold text-gray-500">
                                                    <span className="inline-flex items-center gap-1.5"><UserPlus className="w-3.5 h-3.5" />{broker.fullName}</span>
                                                    <span className="inline-flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{broker.coverage}</span>
                                                    <span className="inline-flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" />RERA: {broker.reraNumber}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-5 lg:text-right">
                                            <div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Visible Inventory</p>
                                                <p className="text-2xl font-black text-gray-900">{broker.visibleProjects.length}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</p>
                                                <p className="text-xs font-black text-emerald-600">{broker.verifiedAt}</p>
                                            </div>
                                            <Button variant="secondary" size="sm" className="font-black uppercase tracking-widest text-xs" onClick={() => handleBrokerClick(broker)}>
                                                View Projects
                                                <ArrowRight className="w-4 h-4 ml-2" />
                                            </Button>
                                        </div>
                                    </div>
                                </section>
                            ))}
                        </div>
                    )}

                    {/* Project Cards Grid - Show when "All Properties" is selected */}
                    {!showBuilders && !showBrokers && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            {filteredProjects.map((p, i) => (
                                <ProjectInventoryCard key={p.id} project={p} onOpen={handleProjectClick} />
                            ))}
                        </div>
                    )}
                    
                    {filteredProjects.length === 0 && !showBuilders && !showBrokers && (
                        <Card className="p-20 text-center flex flex-col items-center gap-4">
                            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 shadow-inner">
                                <Search className="w-8 h-8 text-gray-300" />
                            </div>
                            <div>
                                <p className="text-lg font-black text-gray-800">No projects found</p>
                                <p className="text-sm text-gray-500 font-medium">Try adjusting your search query.</p>
                            </div>
                        </Card>
                    )}

                    {filteredBuilders.length === 0 && showBuilders && (
                        <Card className="p-20 text-center flex flex-col items-center gap-4">
                            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 shadow-inner">
                                <Users className="w-8 h-8 text-gray-300" />
                            </div>
                            <div>
                                <p className="text-lg font-black text-gray-800">No builders found</p>
                                <p className="text-sm text-gray-500 font-medium">No builder profiles available.</p>
                            </div>
                        </Card>
                    )}

                    {filteredBrokers.length === 0 && showBrokers && (
                        <Card className="p-20 text-center flex flex-col items-center gap-4">
                            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 shadow-inner">
                                <Briefcase className="w-8 h-8 text-gray-300" />
                            </div>
                            <div>
                                <p className="text-lg font-black text-gray-800">No brokers found</p>
                                <p className="text-sm text-gray-500 font-medium">No broker-added inventory matches your filters.</p>
                            </div>
                        </Card>
                    )}
                </div>
            </main>
        </div>
    );
};

const ProjectDetailView = ({ project, onBack }) => {
    const [activeTab, setActiveTab] = useState('inventory');
    const [expandedConfigIndex, setExpandedConfigIndex] = useState(null);
    const [editingUnit, setEditingUnit] = useState(null);
    const [localProjectData, setLocalProjectData] = useState(null);
    const [floorPlanModal, setFloorPlanModal] = useState(null);

    useEffect(() => {
        const cloned = JSON.parse(JSON.stringify(project));
        cloned.inventory.forEach(config => {
            const units = [];
            const displayUnits = Math.min(config.totalUnits, 24);
            for (let i = 1; i <= displayUnits; i++) {
                const floor = Math.ceil(i / 4);
                const num = `${floor}${i % 4 === 0 ? '04' : `0${i % 4}`}`;
                const isAvailable = i <= Math.ceil((config.availableUnits / config.totalUnits) * displayUnits);
                const soldByUs = !isAvailable && i % 3 === 0;
                units.push({
                    id: `U${num}`,
                    number: num,
                    floor: floor,
                    status: isAvailable ? 'Available' : 'Sold',
                    facing: i % 2 === 0 ? 'East Facing' : 'West Facing',
                    price: config.basePrice,
                    notes: '',
                    paymentPlan: 'Standard (Construction Linked)',
                    soldBy: isAvailable ? null : soldByUs ? 'us' : 'project',
                    soldByLabel: isAvailable ? null : soldByUs ? 'Sold by us' : 'Sold by project',
                    soldDate: isAvailable ? null : soldByUs ? '14 Jun 2026' : '08 Jun 2026',
                    soldValue: isAvailable ? null : config.basePrice,
                    soldByUser: isAvailable ? null : soldByUs ? 'SquarFT Sales Desk' : project.builder,
                    customer: soldByUs ? {
                        name: 'Amit Sharma',
                        phone: '+91 98765 22310',
                        email: 'amit.sharma@example.com',
                        leadSource: 'SquarFT App',
                        bookingId: `SQ-${project.id}-${num}`,
                    } : null,
                });
            }
            config.unitsList = units;
        });
        setLocalProjectData(cloned);
        setExpandedConfigIndex(null);
        setEditingUnit(null);
        setFloorPlanModal(null);
    }, [project]);

    if (!localProjectData) return null;

    const projectMeta = getProjectMeta(localProjectData);
    const inventoryCounts = getInventoryCounts(localProjectData);
    const soldPercent = inventoryCounts.total
        ? Math.round((inventoryCounts.sold / inventoryCounts.total) * 100)
        : 0;

    const handleUnitClick = (unit) => {
        setEditingUnit({ ...unit });
    };

    const handleUpdateUnit = () => {
        if (!editingUnit || expandedConfigIndex === null) return;
        const updatedProject = { ...localProjectData };
        const config = updatedProject.inventory[expandedConfigIndex];
        const unitIndex = config.unitsList.findIndex(u => u.id === editingUnit.id);
        if (unitIndex !== -1) {
            config.unitsList[unitIndex] = editingUnit;
            setLocalProjectData(updatedProject);
        }
        setEditingUnit(null);
    };

    return (
        <div className="flex-1 flex flex-col h-full relative bg-[#F5F6FA] font-sans text-gray-900">
            <Header title="Project Details" showBack onBack={onBack} />

            <main className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth">
                <div className="max-w-[1600px] mx-auto space-y-6">
                    
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-[#6F4BFF] text-white flex items-center justify-center text-2xl font-black shadow-xl shadow-[#6F4BFF]/20">
                                <Building2 className="w-8 h-8" />
                            </div>
                            <div>
                                <div className="flex items-center gap-3">
                                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">{localProjectData.name}</h2>
                                    {getStatusBadge(localProjectData.status)}
                                </div>
                                <p className="text-sm text-gray-500 mt-1.5 font-bold flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-gray-400" /> {localProjectData.location} <span className="text-gray-300">|</span> By <span className="font-black text-[#6F4BFF]">{localProjectData.builder}</span>
                                </p>
                            </div>
                        </div>
                        <a
                            href="/documents/dummy-brochure.pdf"
                            download={`${localProjectData.name.replace(/\s+/g, '-').toLowerCase()}-brochure.pdf`}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 focus:ring-gray-200 shadow-sm font-black uppercase tracking-widest text-xs"
                        >
                            <FileText className="w-4 h-4" />
                            Brochure
                        </a>
                    </div>

                    <div className="flex gap-2 border-b border-gray-200">
                        {[
                            { id: 'inventory', label: 'Inventory & Pricing', icon: Layers },
                            { id: 'admin', label: 'Admin & Operations', icon: Settings },
                            { id: 'documents', label: 'Documents', icon: FileText },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => { setActiveTab(tab.id); setExpandedConfigIndex(null); }}
                                className={`flex items-center gap-2 px-6 py-4 font-black text-[11px] uppercase tracking-widest transition-all border-b-2 ${activeTab === tab.id ? 'border-[#6F4BFF] text-[#6F4BFF] bg-[#6F4BFF]/5' : 'border-transparent text-gray-400 hover:text-gray-800 hover:border-gray-300'}`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {activeTab === 'inventory' && (
                        <div className="space-y-6 animate-in fade-in duration-500">
                            <Card noPadding className="overflow-hidden border-gray-100 shadow-xl shadow-gray-200/50">
                                <div className="grid grid-cols-1 xl:grid-cols-[0.95fr_1.4fr]">
                                    <ProjectImageStrip project={localProjectData} className="h-72 xl:h-full min-h-[280px]" />
                                    <div className="p-6 md:p-7">
                                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
                                            <div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Inventory Snapshot</p>
                                                <h3 className="text-2xl font-black text-gray-900 tracking-tight">{localProjectData.priceRange}</h3>
                                                <p className="text-xs text-gray-500 mt-2 font-bold">{projectMeta.reraNumber}</p>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {projectMeta.amenities.map((item) => (
                                                    <span key={item} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-gray-500">
                                                        {item}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                                            {[
                                                ['Total Units', inventoryCounts.total],
                                                ['Available', inventoryCounts.available],
                                                ['Sold', inventoryCounts.sold],
                                                ['Booked', inventoryCounts.booked],
                                            ].map(([label, value]) => (
                                                <div key={label} className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
                                                    <p className="mt-1 text-2xl font-black text-gray-900 tracking-tight">{value}</p>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                            <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 px-4 py-3">
                                                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Possession</p>
                                                <p className="mt-1 text-sm font-black text-gray-900">{projectMeta.possession}</p>
                                            </div>
                                            <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 px-4 py-3">
                                                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Avg Price</p>
                                                <p className="mt-1 text-sm font-black text-gray-900">{projectMeta.avgPrice}</p>
                                            </div>
                                            <div className="rounded-xl border border-gray-100 bg-white px-4 py-3">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sold Out</p>
                                                <div className="mt-2 h-2 rounded-full bg-gray-100 overflow-hidden">
                                                    <div className="h-full rounded-full bg-[#6F4BFF]" style={{ width: `${soldPercent}%` }}></div>
                                                </div>
                                                <p className="mt-2 text-xs font-black text-gray-600">{soldPercent}% sold</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            <Card noPadding className="overflow-hidden border-gray-100 shadow-xl shadow-gray-200/50">
                                <div className="p-6 border-b border-gray-100 bg-white">
                                    <h3 className="text-lg font-black text-gray-800 tracking-tight">Inventory Configurations</h3>
                                    <p className="text-xs text-gray-500 mt-1 font-bold">Compact view of property hierarchy, unit configuration, area, price, and live availability.</p>
                                    <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                                        {PROPERTY_TYPE_HIERARCHY.map((group) => (
                                            <div key={group.mainType} className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                                                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Property Main Type</p>
                                                <p className="mt-1 text-sm font-black text-gray-900">{group.mainType}</p>
                                                <div className="mt-2 flex flex-wrap gap-1.5">
                                                    {group.subTypes.map((subType) => (
                                                        <span key={subType} className="rounded-lg border border-gray-100 bg-white px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-gray-500">
                                                            {subType}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    {localProjectData.inventory.map((row, i) => {
                                        const hierarchy = inferInventoryHierarchy(localProjectData, row);
                                        const availableCount = row.unitsList.filter(u => u.status === 'Available').length;
                                        const percentAvailable = row.unitsList.length ? (availableCount / row.unitsList.length) * 100 : 0;
                                        const statusColor = percentAvailable > 50 ? 'bg-emerald-500' : percentAvailable > 20 ? 'bg-amber-500' : 'bg-rose-500';
                                        const isExpanded = expandedConfigIndex === i;

                                        return (
                                            <div key={i} className={`rounded-2xl border transition-all ${isExpanded ? 'border-[#6F4BFF]/30 bg-[#6F4BFF]/5 shadow-lg shadow-[#6F4BFF]/10 lg:col-span-2' : 'border-gray-100 bg-white'}`}>
                                                <div className="p-5">
                                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                                        <div>
                                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Property Hierarchy</p>
                                                            <div className="flex flex-wrap items-center gap-1.5">
                                                                <span className="rounded-lg bg-[#EEF2FF] px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-[#4A43EC]">
                                                                    {hierarchy.mainType}
                                                                </span>
                                                                <ChevronDown className="-rotate-90 h-3.5 w-3.5 text-gray-300" />
                                                                <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-700">
                                                                    {hierarchy.subType}
                                                                </span>
                                                            </div>
                                                            <div className="mt-3">
                                                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Configuration / Variant</p>
                                                                <h4 className="mt-1 text-lg font-black text-gray-900 tracking-tight">{hierarchy.configuration}</h4>
                                                                <p className="mt-1 text-sm font-bold text-gray-500">{row.size || row.area || 'Area / size missing'}</p>
                                                            </div>
                                                        </div>
                                                        <div className="sm:text-right">
                                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Base Price</p>
                                                            <p className="text-xl font-black text-[#6F4BFF] tracking-tight">{row.basePrice || row.price || 'Missing'}</p>
                                                        </div>
                                                    </div>

                                                    {hierarchy.missing.length > 0 && (
                                                        <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50 px-3 py-2">
                                                            <p className="text-[8px] font-black uppercase tracking-widest text-amber-700">Missing property data</p>
                                                            <div className="mt-2 flex flex-wrap gap-1.5">
                                                                {hierarchy.missing.map((item) => (
                                                                    <span key={item} className="rounded-md border border-amber-200 bg-white px-2 py-0.5 text-[8px] font-black uppercase tracking-wider text-amber-700">
                                                                        {item}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
                                                        <div className="rounded-xl bg-gray-50 border border-gray-100 px-3 py-2">
                                                            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Available</p>
                                                            <p className="text-lg font-black text-gray-900">{availableCount}</p>
                                                        </div>
                                                        <div className="rounded-xl bg-gray-50 border border-gray-100 px-3 py-2">
                                                            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Total</p>
                                                            <p className="text-lg font-black text-gray-900">{row.unitsList.length}</p>
                                                        </div>
                                                        <div className="rounded-xl bg-gray-50 border border-gray-100 px-3 py-2 col-span-2 sm:col-span-1">
                                                            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Availability</p>
                                                            <p className="text-lg font-black text-gray-900">{Math.round(percentAvailable)}%</p>
                                                        </div>
                                                    </div>

                                                    <div className="mt-4">
                                                        <div className="flex justify-between text-[10px] font-black mb-1.5 uppercase tracking-widest">
                                                            <span className={percentAvailable <= 20 ? 'text-rose-600' : 'text-gray-500'}>{availableCount} units open</span>
                                                            <span className="text-gray-400">{row.unitsList.length - availableCount} sold</span>
                                                        </div>
                                                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden border border-gray-100">
                                                            <div className={`h-full ${statusColor} rounded-full`} style={{ width: `${percentAvailable}%` }}></div>
                                                        </div>
                                                    </div>

                                                    <div className="mt-5 flex justify-end">
                                                        <Button
                                                            variant={isExpanded ? 'primary' : 'secondary'}
                                                            className="text-[10px] py-1.5 px-4 font-black uppercase tracking-widest h-9"
                                                            icon={isExpanded ? X : Maximize}
                                                            onClick={() => setExpandedConfigIndex(isExpanded ? null : i)}
                                                        >
                                                            {isExpanded ? 'Hide Floor Plan' : 'Floor Plan'}
                                                        </Button>
                                                    </div>
                                                </div>

                                                {isExpanded && (
                                                    <div className="border-t border-[#6F4BFF]/10 bg-white/70 p-5 md:p-6 animate-in slide-in-from-top-2 duration-300">
                                                        <div className="grid grid-cols-1 xl:grid-cols-[0.95fr_1.25fr] gap-6">
                                                            <div className="rounded-2xl overflow-hidden bg-[#F8FAFC] border border-[#E0E8FF]">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setFloorPlanModal({ row, project: localProjectData })}
                                                                    className="relative w-full min-h-[260px] flex items-center justify-center p-6 bg-white"
                                                                >
                                                                    <img
                                                                        src={DEFAULT_FLOOR_PLAN_IMAGE}
                                                                        alt={`${row.type} floor plan`}
                                                                        className="w-full max-w-[420px] h-[220px] object-contain"
                                                                    />
                                                                    <span className="absolute bottom-4 right-4 inline-flex items-center gap-1 rounded-md bg-black/55 px-2.5 py-1.5 text-[9px] font-black uppercase tracking-widest text-white">
                                                                        <Maximize className="w-3 h-3" /> Full Screen
                                                                    </span>
                                                                </button>
                                                                <div className="px-5 py-4 border-t border-[#E0E8FF] flex items-center justify-between gap-4">
                                                                    <div>
                                                                        <p className="text-sm font-black text-gray-900">Floor Plan</p>
                                                                        <p className="text-xs font-bold text-gray-500 mt-0.5">{hierarchy.mainType} / {hierarchy.subType} / {hierarchy.configuration}</p>
                                                                    </div>
                                                                    <div className="w-9 h-9 rounded-full bg-[#F1F3FF] text-[#4A43EC] flex items-center justify-center">
                                                                        <Layers className="w-4 h-4" />
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div>
                                                                <h4 className="text-sm font-black text-gray-800 uppercase tracking-widest mb-5 flex items-center gap-2">
                                                                    <Layers className="w-4 h-4 text-[#6F4BFF]" /> Unit Availability
                                                                </h4>
                                                            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3">
                                                                {row.unitsList.map((unit) => (
                                                                    <button
                                                                        key={unit.id}
                                                                        onClick={() => handleUnitClick(unit)}
                                                                        className={`h-12 rounded-xl border flex flex-col items-center justify-center transition-all ${
                                                                            unit.status === 'Available' ? 'bg-white border-gray-200 hover:border-[#6F4BFF] hover:shadow-md' :
                                                                            unit.status === 'Sold' ? 'bg-rose-50 border-rose-100 text-rose-300' :
                                                                            'bg-amber-50 border-amber-100 text-amber-500'
                                                                        } ${editingUnit?.id === unit.id ? 'ring-2 ring-[#6F4BFF] shadow-lg shadow-[#6F4BFF]/20 scale-105 z-10' : ''}`}
                                                                    >
                                                                        <span className="text-xs font-black">{unit.number}</span>
                                                                        <span className="text-[8px] font-bold uppercase tracking-tighter opacity-60">{unit.status}</span>
                                                                    </button>
                                                                ))}
                                                            </div>
                                                            </div>
                                                        </div>

                                                        <div className="mt-6">
                                                            {editingUnit ? (
                                                                <div className="rounded-2xl border border-[#6F4BFF]/20 bg-white p-6 shadow-xl shadow-[#6F4BFF]/10 animate-in zoom-in-95 duration-200">
                                                                    <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                                                                        <h4 className="font-black text-gray-900 tracking-tight">Unit {editingUnit.number} Details</h4>
                                                                        <button onClick={() => setEditingUnit(null)} className="p-1 hover:bg-gray-100 rounded-lg text-gray-400"><X className="w-4 h-4" /></button>
                                                                    </div>
                                                                    <div className="space-y-5">
                                                                        <div className="grid grid-cols-2 gap-4">
                                                                            <div>
                                                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Status</p>
                                                                                <Badge variant={editingUnit.status === 'Available' ? 'green' : editingUnit.status === 'Sold' ? 'red' : 'yellow'}>{editingUnit.status}</Badge>
                                                                            </div>
                                                                            <div>
                                                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Floor</p>
                                                                                <p className="font-black text-gray-800">{editingUnit.floor}th Floor</p>
                                                                            </div>
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Facing</p>
                                                                            <p className="font-black text-gray-800">{editingUnit.facing}</p>
                                                                        </div>
                                                                        {editingUnit.status === 'Sold' && (
                                                                            <div className="rounded-2xl border border-rose-100 bg-rose-50/60 p-4">
                                                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                                                                                    <div>
                                                                                        <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-1">Sale Source</p>
                                                                                        <p className="text-base font-black text-gray-900">{editingUnit.soldByLabel}</p>
                                                                                    </div>
                                                                                    <Badge variant={editingUnit.soldBy === 'us' ? 'green' : 'gray'}>
                                                                                        {editingUnit.soldBy === 'us' ? 'SquarFT Sale' : 'Project Sale'}
                                                                                    </Badge>
                                                                                </div>

                                                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                                                    <div className="rounded-xl bg-white/80 border border-rose-100 px-3 py-2">
                                                                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Sold Date</p>
                                                                                        <p className="text-sm font-black text-gray-900 mt-1">{editingUnit.soldDate}</p>
                                                                                    </div>
                                                                                    <div className="rounded-xl bg-white/80 border border-rose-100 px-3 py-2">
                                                                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Sold Value</p>
                                                                                        <p className="text-sm font-black text-gray-900 mt-1">{editingUnit.soldValue}</p>
                                                                                    </div>
                                                                                    <div className="rounded-xl bg-white/80 border border-rose-100 px-3 py-2">
                                                                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Handled By</p>
                                                                                        <p className="text-sm font-black text-gray-900 mt-1">{editingUnit.soldByUser}</p>
                                                                                    </div>
                                                                                </div>

                                                                                {editingUnit.soldBy === 'us' && editingUnit.customer && (
                                                                                    <div className="mt-4 border-t border-rose-100 pt-4">
                                                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Customer Details</p>
                                                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                                                            <div>
                                                                                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Name</p>
                                                                                                <p className="text-sm font-black text-gray-900">{editingUnit.customer.name}</p>
                                                                                            </div>
                                                                                            <div>
                                                                                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Phone</p>
                                                                                                <p className="text-sm font-black text-gray-900">{editingUnit.customer.phone}</p>
                                                                                            </div>
                                                                                            <div>
                                                                                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Email</p>
                                                                                                <p className="text-sm font-black text-gray-900 break-all">{editingUnit.customer.email}</p>
                                                                                            </div>
                                                                                            <div>
                                                                                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Booking ID</p>
                                                                                                <p className="text-sm font-black text-gray-900">{editingUnit.customer.bookingId}</p>
                                                                                            </div>
                                                                                            <div className="md:col-span-2">
                                                                                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Lead Source</p>
                                                                                                <p className="text-sm font-black text-gray-900">{editingUnit.customer.leadSource}</p>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        )}
                                                                        <div>
                                                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Unit Price (Base)</p>
                                                                            <div className="relative">
                                                                                <IndianRupee className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                                                <input 
                                                                                    type="text" 
                                                                                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-black focus:outline-none focus:ring-2 focus:ring-[#6F4BFF]/20 focus:border-[#6F4BFF]" 
                                                                                    value={editingUnit.price}
                                                                                    onChange={(e) => setEditingUnit({...editingUnit, price: e.target.value})}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="pt-4 flex gap-2">
                                                                            <Button className="flex-1 text-[10px] font-black uppercase tracking-widest" icon={Save} onClick={handleUpdateUnit}>Update Unit</Button>
                                                                            <Button variant="secondary" className="text-[10px] font-black uppercase tracking-widest" icon={Zap}>Hold Unit</Button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className="h-full min-h-[260px] flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-gray-200 rounded-2xl opacity-60 bg-gray-50/50">
                                                                    <Edit2 className="w-10 h-10 text-gray-300 mb-4" />
                                                                    <p className="text-sm font-black text-gray-900 uppercase tracking-widest">No Unit Selected</p>
                                                                    <p className="text-xs font-bold text-gray-500 mt-1">Select any unit to manage price and availability.</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </Card>
                        </div>
                    )}

                    {activeTab === 'admin' && (
                        <div className="space-y-6 animate-in fade-in duration-500">
                            <Card className="p-8 border-gray-100 shadow-xl shadow-gray-200/50">
                                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-8">Project Onboarding Status</h3>
                                <div className="flex items-center justify-between relative px-4">
                                    <div className="absolute left-0 top-4 -translate-y-1/2 w-full h-1 bg-gray-100 -z-10"></div>
                                    <div className="absolute left-0 top-4 -translate-y-1/2 h-1 bg-linear-to-r from-[#6F4BFF] to-[#9D84FF] transition-all -z-10" style={{ width: `${localProjectData.progress}%` }}></div>

                                    {['Basic Info', 'Legal Docs', 'Verification', 'Live Approval'].map((step, i) => {
                                        const isCompleted = localProjectData.progress >= (i + 1) * 25;
                                        const isCurrent = localProjectData.progress >= i * 25 && localProjectData.progress < (i + 1) * 25;
                                        return (
                                            <div key={i} className="flex flex-col items-center gap-3 bg-white px-2">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm border-2 transition-all ${isCompleted ? 'bg-[#6F4BFF] border-[#6F4BFF] text-white shadow-lg shadow-[#6F4BFF]/20' : isCurrent ? 'border-[#6F4BFF] text-[#6F4BFF] bg-white ring-4 ring-[#6F4BFF]/10' : 'border-gray-200 text-gray-400 bg-white'}`}>
                                                    {isCompleted ? <Check className="w-5 h-5" /> : i + 1}
                                                </div>
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-400'}`}>{step}</span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </Card>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <Card className="p-6 border-gray-100">
                                    <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest mb-4 border-b border-gray-100 pb-3 flex items-center gap-2">
                                        <Zap className="w-4 h-4 text-amber-500" /> Internal Verification Notes
                                    </h3>
                                    <div className="bg-amber-50/50 p-5 rounded-2xl border border-amber-100 text-sm text-amber-900 font-bold leading-relaxed">
                                        <p>Site location verified on satellite mapping. Builder credentials reviewed. RERA certificate is active but awaiting the latest compliance report for Q2. Physical site audit scheduled for next week.</p>
                                        <div className="mt-5 flex items-center gap-2">
                                            <Badge variant="yellow" className="text-[10px] font-black uppercase tracking-widest bg-amber-200/50 border-amber-200">Pending Site Audit</Badge>
                                            <span className="text-[10px] text-amber-600 font-black uppercase">Verified by: {localProjectData.officer}</span>
                                        </div>
                                    </div>
                                </Card>

                                <Card className="p-6 border-gray-100">
                                    <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest mb-4 border-b border-gray-100 pb-3">Admin Actions & Controls</h3>
                                    <div className="space-y-4">
                                        <textarea
                                            className="w-full text-sm font-bold border border-gray-200 rounded-2xl p-4 focus:ring-2 focus:ring-[#6F4BFF]/20 focus:border-[#6F4BFF] outline-none transition-all bg-gray-50 placeholder:text-gray-400"
                                            rows="3"
                                            placeholder="Enter approval notes or reasons for hold..."
                                        ></textarea>
                                        <div className="flex gap-3">
                                            <Button variant="danger" className="flex-1 font-black uppercase tracking-widest text-xs" icon={XCircle}>Hold Project</Button>
                                            <Button variant="success" className="flex-1 font-black uppercase tracking-widest text-xs" icon={CheckCircle2}>Approve for Launch</Button>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    )}

                    {activeTab === 'documents' && (
                        <Card className="p-8 border-gray-100 shadow-xl shadow-gray-200/50 animate-in fade-in duration-500">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 border-b border-gray-100 pb-6">
                                <div>
                                    <h3 className="text-lg font-black text-gray-800 tracking-tight">Project Collaterals & Legal Vault</h3>
                                    <p className="text-xs text-gray-500 mt-1 font-bold">Secure access to brochures, floor plans, and RERA certifications.</p>
                                </div>
                                <a
                                    href="/documents/dummy-brochure.pdf"
                                    download="uploaded-project-document.pdf"
                                    className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 focus:ring-gray-200 shadow-sm font-black uppercase tracking-widest text-xs"
                                >
                                    <Plus className="w-4 h-4" />
                                    Upload Document
                                </a>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                {['RERA_Certificate.pdf', 'Master_Brochure_2026.pdf', 'Site_Plan_Layout.dwg', 'Builder_ID_Proof.jpg', 'Pricing_Sheet_Q2.xlsx', 'NOC_Fire_Safety.pdf'].map((doc, i) => (
                                    <a
                                        key={i}
                                        href="/documents/dummy-brochure.pdf"
                                        download={`${doc.replace(/\.[^.]+$/, '')}.pdf`}
                                        className="flex items-center p-5 border border-gray-100 rounded-2xl hover:bg-[#6F4BFF]/5 hover:border-[#6F4BFF]/30 cursor-pointer transition-all group relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 w-16 h-16 bg-[#6F4BFF]/5 rounded-full -mr-8 -mt-8 group-hover:bg-[#6F4BFF]/10 transition-all"></div>
                                        <div className="bg-purple-50 p-3 rounded-xl mr-5 group-hover:bg-[#6F4BFF] transition-colors shadow-sm">
                                            <FileIcon className="w-6 h-6 text-[#6F4BFF] group-hover:text-white transition-colors" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-black text-gray-900 truncate tracking-tight">{doc}</p>
                                            <p className="text-[10px] text-gray-400 mt-1 font-black uppercase tracking-widest flex items-center gap-2">
                                                {doc.split('.').pop().toUpperCase()} • 2.4 MB 
                                                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                                {localProjectData.updated}
                                            </p>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </Card>
                    )}
                </div>
            </main>
            {floorPlanModal && (
                <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="w-full max-w-5xl rounded-2xl bg-white shadow-2xl overflow-hidden">
                        <div className="flex items-center justify-between gap-4 border-b border-gray-100 px-5 py-4">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-[#6F4BFF]">Floor Plan</p>
                                <h3 className="text-lg font-black text-gray-900 tracking-tight">{floorPlanModal.row.type}</h3>
                                <p className="text-xs font-bold text-gray-500 mt-0.5">{floorPlanModal.project.name} | {floorPlanModal.row.size}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setFloorPlanModal(null)}
                                className="w-10 h-10 rounded-xl border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-50 flex items-center justify-center transition-colors"
                                aria-label="Close floor plan"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="bg-[#F8FAFC] p-5 md:p-8 flex items-center justify-center min-h-[360px]">
                            <img
                                src={DEFAULT_FLOOR_PLAN_IMAGE}
                                alt={`${floorPlanModal.row.type} full floor plan`}
                                className="max-h-[70vh] w-full object-contain"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Profile Projects View Component - Shows all properties from a specific builder or broker
const BuilderProjectsView = ({ builder, onBack, profileType = 'builder' }) => {
    const dispatch = useDispatch();
    const selectedProject = useSelector((state) => state.inventory.selectedProject);
    const [showPriceDropdown, setShowPriceDropdown] = useState(false);
    const [showLocationDropdown, setShowLocationDropdown] = useState(false);
    const [localFilters, setLocalFilters] = useState({
        priceRange: 'all',
        location: 'all',
        search: ''
    });

    // Debug: Log builder data
    console.log('🏗️ BuilderProjectsView - Builder:', builder);
    console.log('🏗️ BuilderProjectsView - Projects:', builder.projects);
    console.log('🏗️ BuilderProjectsView - Project Count:', builder.projectCount);

    const isBrokerProfile = profileType === 'broker';
    const profileName = isBrokerProfile ? builder.agencyName : builder.companyName;
    const profileTypeLabel = isBrokerProfile ? builder.brokerType : builder.builderType;
    const profileCount = isBrokerProfile ? builder.inventoryCount : builder.projectCount;
    const profileLocation = isBrokerProfile ? builder.coverage : builder.location;
    const profileAccent = isBrokerProfile ? 'bg-amber-50' : 'bg-gradient-to-br from-indigo-100 to-purple-100';
    const profileIcon = isBrokerProfile ? Briefcase : Users;
    const profileIconClass = isBrokerProfile ? 'text-amber-600' : 'text-[#6F4BFF]';

    // Get unique locations from this profile's projects
    const uniqueLocations = [...new Set((builder.projects || []).map(p => p.location.split(',').pop().trim()))];

    // Filter projects based on local filters
    const filteredBuilderProjects = (builder.projects || []).filter(project => {
        // Search filter
        const matchesSearch = localFilters.search === '' || 
                             project.name.toLowerCase().includes(localFilters.search.toLowerCase()) || 
                             project.location.toLowerCase().includes(localFilters.search.toLowerCase());
        
        // Price range filter
        let matchesPriceRange = true;
        if (localFilters.priceRange !== 'all') {
            const priceStr = project.priceRange.toLowerCase();
            let minPrice = 0;
            
            if (priceStr.includes('cr')) {
                const match = priceStr.match(/(\d+\.?\d*)\s*cr/i);
                if (match) minPrice = parseFloat(match[1]) * 100;
            } else if (priceStr.includes('l')) {
                const match = priceStr.match(/(\d+)\s*l/i);
                if (match) minPrice = parseFloat(match[1]);
            }
            
            switch(localFilters.priceRange) {
                case 'under-1cr':
                    matchesPriceRange = minPrice < 100;
                    break;
                case '1cr-2cr':
                    matchesPriceRange = minPrice >= 100 && minPrice < 200;
                    break;
                case '2cr-5cr':
                    matchesPriceRange = minPrice >= 200 && minPrice < 500;
                    break;
                case '5cr-plus':
                    matchesPriceRange = minPrice >= 500;
                    break;
            }
        }
        
        // Location filter
        let matchesLocation = true;
        if (localFilters.location !== 'all') {
            matchesLocation = project.location.toLowerCase().includes(localFilters.location.toLowerCase());
        }
        
        return matchesSearch && matchesPriceRange && matchesLocation;
    });

    const handleProjectClick = (project) => {
        dispatch(setSelectedProject(project));
    };

    const handleProjectBack = () => {
        dispatch(setSelectedProject(null));
    };

    const handlePriceRangeFilter = (range) => {
        setLocalFilters({ ...localFilters, priceRange: range });
        setShowPriceDropdown(false);
    };

    const handleLocationFilter = (location) => {
        setLocalFilters({ ...localFilters, location: location });
        setShowLocationDropdown(false);
    };

    const handleSearchChange = (e) => {
        setLocalFilters({ ...localFilters, search: e.target.value });
    };

    const getPriceRangeLabel = () => {
        switch(localFilters.priceRange) {
            case 'under-1cr': return 'Under 1 Cr';
            case '1cr-2cr': return '1-2 Cr';
            case '2cr-5cr': return '2-5 Cr';
            case '5cr-plus': return '5 Cr+';
            default: return 'All Prices';
        }
    };

    const getLocationLabel = () => {
        return localFilters.location === 'all' ? 'All Locations' : localFilters.location;
    };

    if (selectedProject) {
        return <ProjectDetailView project={selectedProject} onBack={handleProjectBack} />;
    }

    return (
        <div className="flex-1 flex flex-col h-full relative bg-[#F5F6FA] font-sans text-gray-900">
            <Header title={isBrokerProfile ? 'Broker Inventory' : 'Builder Properties'} showBack onBack={onBack} />

            <main className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth">
                <div className="max-w-[1600px] mx-auto space-y-6">
                    
                    {/* Profile Header */}
                    <Card className="p-8 border-gray-100 shadow-xl shadow-gray-200/50 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                            <div className={`w-20 h-20 rounded-2xl ${profileAccent} flex items-center justify-center`}>
                                {React.createElement(profileIcon, { className: `w-10 h-10 ${profileIconClass}` })}
                            </div>
                            <div className="flex-1">
                                <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">{profileName}</h2>
                                <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mb-4">{profileTypeLabel}</p>
                                <p className="text-sm text-gray-600 leading-relaxed max-w-3xl">{builder.about}</p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Badge variant="gradient" className="font-black uppercase tracking-widest text-xs">
                                    {profileCount} {profileCount === 1 ? 'Property' : 'Properties'}
                                </Badge>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-8 border-t border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                                    <UserPlus className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Contact Person</p>
                                    <p className="text-sm font-bold text-gray-900">{builder.fullName}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                                    <MapPin className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isBrokerProfile ? 'Coverage' : 'Location'}</p>
                                    <p className="text-sm font-bold text-gray-900">{profileLocation}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                                    <FileText className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">RERA Number</p>
                                    <p className="text-sm font-bold text-gray-900">{builder.reraNumber}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                                    <Briefcase className="w-5 h-5 text-amber-600" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isBrokerProfile ? 'Status' : 'Brand Name'}</p>
                                    <p className="text-sm font-bold text-gray-900">{isBrokerProfile ? builder.verifiedAt : (builder.brandName || builder.companyName)}</p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Search and Filters for Profile Properties */}
                    <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                        {/* Search Bar */}
                        <div className="relative flex-1">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search properties..."
                                className="pl-9 pr-4 py-2.5 w-full bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6F4BFF]/20 focus:border-[#6F4BFF] transition-all shadow-sm"
                                value={localFilters.search}
                                onChange={handleSearchChange}
                            />
                        </div>

                        {/* Price Range Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => {
                                    setShowPriceDropdown(!showPriceDropdown);
                                    setShowLocationDropdown(false);
                                }}
                                className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap ${
                                    localFilters.priceRange !== 'all'
                                        ? 'bg-[#6F4BFF] text-white shadow-lg shadow-[#6F4BFF]/20'
                                        : 'bg-white text-gray-600 border border-gray-200 hover:border-[#6F4BFF]/40'
                                }`}
                            >
                                <IndianRupee className="w-3 h-3" />
                                {getPriceRangeLabel()}
                                <ChevronDown className="w-3 h-3" />
                            </button>
                            {showPriceDropdown && (
                                <div className="absolute top-full mt-2 left-0 bg-white border border-gray-200 rounded-xl shadow-xl z-50 min-w-[200px] overflow-hidden">
                                    <button onClick={() => handlePriceRangeFilter('all')} className="w-full px-4 py-2.5 text-left text-xs font-bold hover:bg-gray-50 transition-colors">All Prices</button>
                                    <button onClick={() => handlePriceRangeFilter('under-1cr')} className="w-full px-4 py-2.5 text-left text-xs font-bold hover:bg-gray-50 transition-colors border-t border-gray-100">Under 1 Cr</button>
                                    <button onClick={() => handlePriceRangeFilter('1cr-2cr')} className="w-full px-4 py-2.5 text-left text-xs font-bold hover:bg-gray-50 transition-colors border-t border-gray-100">1 Cr - 2 Cr</button>
                                    <button onClick={() => handlePriceRangeFilter('2cr-5cr')} className="w-full px-4 py-2.5 text-left text-xs font-bold hover:bg-gray-50 transition-colors border-t border-gray-100">2 Cr - 5 Cr</button>
                                    <button onClick={() => handlePriceRangeFilter('5cr-plus')} className="w-full px-4 py-2.5 text-left text-xs font-bold hover:bg-gray-50 transition-colors border-t border-gray-100">5 Cr & Above</button>
                                </div>
                            )}
                        </div>

                        {/* Location Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => {
                                    setShowLocationDropdown(!showLocationDropdown);
                                    setShowPriceDropdown(false);
                                }}
                                className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap ${
                                    localFilters.location !== 'all'
                                        ? 'bg-[#6F4BFF] text-white shadow-lg shadow-[#6F4BFF]/20'
                                        : 'bg-white text-gray-600 border border-gray-200 hover:border-[#6F4BFF]/40'
                                }`}
                            >
                                <MapPin className="w-3 h-3" />
                                {getLocationLabel()}
                                <ChevronDown className="w-3 h-3" />
                            </button>
                            {showLocationDropdown && (
                                <div className="absolute top-full mt-2 left-0 bg-white border border-gray-200 rounded-xl shadow-xl z-50 min-w-[200px] max-h-[300px] overflow-y-auto">
                                    <button onClick={() => handleLocationFilter('all')} className="w-full px-4 py-2.5 text-left text-xs font-bold hover:bg-gray-50 transition-colors">All Locations</button>
                                    {uniqueLocations.map((loc, index) => (
                                        <button key={index} onClick={() => handleLocationFilter(loc)} className="w-full px-4 py-2.5 text-left text-xs font-bold hover:bg-gray-50 transition-colors border-t border-gray-100">
                                            {loc}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Clear Filters Button */}
                        {(localFilters.priceRange !== 'all' || localFilters.location !== 'all' || localFilters.search !== '') && (
                            <button
                                onClick={() => setLocalFilters({ priceRange: 'all', location: 'all', search: '' })}
                                className="px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 whitespace-nowrap"
                            >
                                <X className="w-3 h-3 inline mr-1" />
                                Clear
                            </button>
                        )}
                    </div>

                    {/* Properties Section */}
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-xl font-black text-gray-900">Properties by {profileName}</h3>
                                <p className="text-sm text-gray-500 mt-1 font-medium">
                                    Showing {filteredBuilderProjects.length} of {profileCount} {profileCount === 1 ? 'property' : 'properties'}
                                </p>
                            </div>
                        </div>

                        {/* Project Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            {filteredBuilderProjects.map((p, i) => (
                                <ProjectInventoryCard key={p.id} project={p} onOpen={handleProjectClick} />
                            ))}
                        </div>

                        {filteredBuilderProjects.length === 0 && (
                            <Card className="p-20 text-center flex flex-col items-center gap-4">
                                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 shadow-inner">
                                    <Building2 className="w-8 h-8 text-gray-300" />
                                </div>
                                <div>
                                    <p className="text-lg font-black text-gray-800">No properties found</p>
                                    <p className="text-sm text-gray-500 font-medium">
                                        {(localFilters.priceRange !== 'all' || localFilters.location !== 'all' || localFilters.search !== '') 
                                            ? 'Try adjusting your filters.' 
                                            : 'This builder has no properties listed yet.'}
                                    </p>
                                </div>
                            </Card>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Inventory;
