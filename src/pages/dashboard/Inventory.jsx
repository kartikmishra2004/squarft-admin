import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
    Plus, Search, Building2, MapPin, ArrowRight, FileText, 
    Layers, Settings, Calendar, X, Maximize, Edit2, Save,
    IndianRupee, Zap, Sparkles, Check, XCircle, CheckCircle2,
    Trash2, Users, FileIcon, UserPlus, Filter, ChevronDown, Briefcase
} from 'lucide-react';
import { setSelectedProject, setSelectedBuilder, setViewMode, setFilters } from '../../store/inventorySlice';
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

const Inventory = () => {
    const dispatch = useDispatch();
    const { filteredProjects, selectedProject, selectedBuilder, viewMode, filters } = useSelector((state) => state.inventory);
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

    const handleSearch = (e) => {
        dispatch(setFilters({ search: e.target.value }));
    };

    const handlePropertySourceFilter = (source) => {
        dispatch(setFilters({ propertySource: source }));
        dispatch(setViewMode('projects')); // Reset view mode when changing source
        dispatch(setSelectedBuilder(null));
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

    const handleBack = () => {
        if (viewMode === 'builderProjects') {
            dispatch(setViewMode('projects'));
            dispatch(setSelectedBuilder(null));
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

    // Show project detail view
    if (selectedProject) {
        return <ProjectDetailView project={selectedProject} onBack={handleBack} />;
    }

    // Determine what to show: builders or projects
    const showBuilders = filters.propertySource === 'builder';

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
                            <Button icon={Plus}>Add Project</Button>
                        </div>
                    </div>

                    {/* Property Source Filter */}
                    <div className="flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="flex items-center gap-2 text-sm text-gray-600 font-bold">
                            <Filter className="w-4 h-4" />
                            <span>Filter by Source:</span>
                        </div>
                        <div className="flex gap-2">
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

                    {/* Additional Filters: Price Range & Location - Only show when NOT viewing builders */}
                    {!showBuilders && (
                        <div className="flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-500">
                            <div className="flex items-center gap-2 text-sm text-gray-600 font-bold">
                                <Filter className="w-4 h-4" />
                                <span>More Filters:</span>
                            </div>
                            <div className="flex gap-2">
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

                    {/* Builder Cards Grid - Show when "Added by Builder" is selected */}
                    {showBuilders && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            {uniqueBuilders.map((builder, i) => (
                                <Card key={i} className="group cursor-pointer hover:border-[#6F4BFF]/40 hover:shadow-xl transition-all" onClick={() => handleBuilderClick(builder)}>
                                    <div className="p-6">
                                        <div className="flex items-start gap-4 mb-4">
                                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                                                <Users className="w-8 h-8 text-[#6F4BFF]" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-xl font-black text-gray-900 mb-1 group-hover:text-[#6F4BFF] transition-colors tracking-tight">
                                                    {builder.companyName}
                                                </h3>
                                                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">
                                                    {builder.builderType}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="space-y-3 mb-4">
                                            <div className="flex items-center gap-2 text-sm">
                                                <UserPlus className="w-4 h-4 text-gray-400" />
                                                <span className="text-gray-600 font-medium">{builder.fullName}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <MapPin className="w-4 h-4 text-gray-400" />
                                                <span className="text-gray-600 font-medium">{builder.location}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <FileText className="w-4 h-4 text-gray-400" />
                                                <span className="text-gray-600 font-medium">RERA: {builder.reraNumber}</span>
                                            </div>
                                        </div>

                                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                            {builder.about}
                                        </p>

                                        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                                            <div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Projects</p>
                                                <p className="font-black text-gray-900 text-2xl">{builder.projectCount}</p>
                                            </div>
                                            <Button variant="secondary" size="sm" className="font-black uppercase tracking-widest text-xs">
                                                View Properties
                                                <ArrowRight className="w-4 h-4 ml-2" />
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}

                    {/* Project Cards Grid - Show when "All Properties" or "Added by Broker" is selected */}
                    {!showBuilders && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            {filteredProjects.map((p, i) => (
                                <Card key={p.id} noPadding className="group cursor-pointer hover:border-[#6F4BFF]/40 hover:shadow-xl transition-all flex flex-col h-full overflow-hidden border-gray-100" >
                                    <div className="h-40 relative overflow-hidden bg-linear-to-br from-indigo-100 via-purple-50 to-pink-50" onClick={() => handleProjectClick(p)}>
                                        <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px]"></div>
                                        <Building2 className="absolute -bottom-6 -right-6 w-32 h-32 text-[#6F4BFF]/10 rotate-12 transition-transform group-hover:scale-110 duration-700" />
                                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-xl text-[10px] font-black text-gray-800 shadow-sm uppercase tracking-widest border border-white">
                                            {p.builder}
                                        </div>
                                        <div className="absolute top-4 right-4">
                                            {getStatusBadge(p.status)}
                                        </div>
                                        <div className="absolute bottom-4 left-4 bg-emerald-500 text-white px-3 py-1.5 rounded-xl text-[10px] font-black shadow-lg shadow-emerald-500/20 uppercase tracking-widest border border-emerald-400">
                                            {p.available} Units Left
                                        </div>
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col">
                                        <h3 className="text-xl font-black text-gray-900 mb-1 group-hover:text-[#6F4BFF] transition-colors tracking-tight" onClick={() => handleProjectClick(p)}>{p.name}</h3>
                                        <p className="text-sm text-gray-500 font-bold flex items-center gap-1.5 mb-6">
                                            <MapPin className="w-4 h-4 text-gray-400" /> {p.location}
                                        </p>

                                        <div className="mt-auto pt-5 border-t border-gray-100 flex items-center justify-between">
                                            <div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Base Pricing</p>
                                                <p className="font-black text-gray-900 text-lg tracking-tight">{p.priceRange}</p>
                                            </div>
                                            <div className="flex gap-1.5">
                                                {p.configs.map(c => (
                                                    <span key={c} className="text-[10px] font-black bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg uppercase tracking-wider">
                                                        {c}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                    
                    {filteredProjects.length === 0 && !showBuilders && (
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

                    {uniqueBuilders.length === 0 && showBuilders && (
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
                                    <MapPin className="w-4 h-4 text-gray-400" /> {localProjectData.location} • By <span className="font-black text-[#6F4BFF]">{localProjectData.builder}</span>
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Button variant="secondary" icon={FileText} className="font-black uppercase tracking-widest text-xs">Brochure</Button>
                            <Button variant="primary" icon={Plus} className="font-black uppercase tracking-widest text-xs">Log Visit</Button>
                        </div>
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
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <Card className="p-6 bg-linear-to-br from-indigo-50 to-white border-indigo-100 shadow-lg shadow-indigo-500/5">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Total Available Inventory</p>
                                    <div className="flex items-baseline gap-2">
                                        <h3 className="text-5xl font-black text-[#6F4BFF] tracking-tighter">{localProjectData.available}</h3>
                                        <span className="text-gray-400 font-black text-sm uppercase">/ {localProjectData.units} Units</span>
                                    </div>
                                    <div className="mt-6 w-full h-2.5 bg-gray-200 rounded-full overflow-hidden border border-gray-100">
                                        <div className="h-full bg-linear-to-r from-[#6F4BFF] to-[#9D84FF]" style={{ width: `${((localProjectData.units - localProjectData.available) / localProjectData.units) * 100}%` }}></div>
                                    </div>
                                    <p className="text-[10px] text-gray-500 mt-3 font-black uppercase tracking-widest">
                                        {Math.round(((localProjectData.units - localProjectData.available) / localProjectData.units) * 100)}% Sold Out
                                    </p>
                                </Card>

                                <Card className="p-6 flex flex-col justify-center">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Base Price Range</p>
                                    <h3 className="text-3xl font-black text-gray-900 tracking-tight">{localProjectData.priceRange}</h3>
                                    <p className="text-[10px] text-emerald-600 font-black mt-3 bg-emerald-50 inline-block px-3 py-1 rounded-lg uppercase tracking-widest border border-emerald-100">
                                        Prices subject to PLC & Floor Rise
                                    </p>
                                </Card>

                                <Card className="p-6 flex flex-col justify-center">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Construction Progress</p>
                                    <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-2">Advanced Stage</h3>
                                    <p className="text-xs text-gray-500 flex items-center gap-2 font-bold">
                                        <Calendar className="w-4 h-4 text-[#6F4BFF]" /> Est. Possession: Dec 2027
                                    </p>
                                </Card>
                            </div>

                            <Card noPadding className="overflow-hidden border-gray-100 shadow-xl shadow-gray-200/50">
                                <div className="p-6 border-b border-gray-100 bg-white flex justify-between items-center">
                                    <div>
                                        <h3 className="text-lg font-black text-gray-800 tracking-tight">Configuration Workspace</h3>
                                        <p className="text-xs text-gray-500 mt-1 font-bold">Manage floor plans and track individual unit availability.</p>
                                    </div>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-gray-50/80 border-b border-gray-100">
                                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Configuration</th>
                                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Area</th>
                                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Pricing</th>
                                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest w-72">Live Inventory</th>
                                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {localProjectData.inventory.map((row, i) => {
                                                const availableCount = row.unitsList.filter(u => u.status === 'Available').length;
                                                const percentAvailable = (availableCount / row.unitsList.length) * 100;
                                                let statusColor = percentAvailable > 50 ? 'bg-emerald-500' : percentAvailable > 20 ? 'bg-amber-500' : 'bg-rose-500';
                                                const isExpanded = expandedConfigIndex === i;

                                                return (
                                                    <React.Fragment key={i}>
                                                        <tr className={`hover:bg-gray-50/80 transition-all ${isExpanded ? 'bg-[#6F4BFF]/5' : ''}`}>
                                                            <td className="px-6 py-5 font-black text-gray-900">{row.type}</td>
                                                            <td className="px-6 py-5 font-bold text-gray-600">{row.size}</td>
                                                            <td className="px-6 py-5 font-black text-gray-800 text-lg tracking-tight">{row.basePrice}</td>
                                                            <td className="px-6 py-5">
                                                                <div className="flex justify-between text-[10px] font-black mb-1.5 uppercase tracking-widest">
                                                                    <span className={percentAvailable <= 20 ? 'text-rose-600' : 'text-gray-500'}>{availableCount} Available</span>
                                                                    <span className="text-gray-400">Total: {row.unitsList.length}</span>
                                                                </div>
                                                                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden border border-gray-100">
                                                                    <div className={`h-full ${statusColor} rounded-full`} style={{ width: `${percentAvailable}%` }}></div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-5 text-right">
                                                                <Button
                                                                    variant={isExpanded ? 'primary' : 'secondary'}
                                                                    className="text-[10px] py-1.5 px-4 font-black uppercase tracking-widest h-9"
                                                                    icon={isExpanded ? X : Maximize}
                                                                    onClick={() => setExpandedConfigIndex(isExpanded ? null : i)}
                                                                >
                                                                    {isExpanded ? 'Close Plan' : 'Floor Plan'}
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                        {isExpanded && (
                                                            <tr className="bg-gray-50/50">
                                                                <td colSpan="5" className="p-0">
                                                                    <div className="p-8 grid grid-cols-1 xl:grid-cols-3 gap-8 animate-in slide-in-from-top-2 duration-300">
                                                                        <div className="xl:col-span-2">
                                                                            <h4 className="text-sm font-black text-gray-800 uppercase tracking-widest mb-6 flex items-center gap-2">
                                                                                <Layers className="w-4 h-4 text-[#6F4BFF]" /> Interactive Unit Grid
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
                                                                                        } ${editingUnit?.id === unit.id ? 'ring-2 ring-[#6F4BFF] shadow-lg shadow-[#6F4BFF]/20 scale-110 z-10' : ''}`}
                                                                                    >
                                                                                        <span className="text-xs font-black">{unit.number}</span>
                                                                                        <span className="text-[8px] font-bold uppercase tracking-tighter opacity-60">{unit.status}</span>
                                                                                    </button>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                        
                                                                        <div className="xl:col-span-1">
                                                                            {editingUnit ? (
                                                                                <Card className="p-6 border-[#6F4BFF]/20 shadow-xl shadow-[#6F4BFF]/10 animate-in zoom-in-95 duration-200">
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
                                                                                </Card>
                                                                            ) : (
                                                                                <div className="h-full flex flex-col items-center justify-center p-10 text-center border-2 border-dashed border-gray-200 rounded-2xl opacity-40 bg-gray-50/50">
                                                                                    <Edit2 className="w-10 h-10 text-gray-300 mb-4" />
                                                                                    <p className="text-sm font-black text-gray-900 uppercase tracking-widest">No Unit Selected</p>
                                                                                    <p className="text-xs font-bold text-gray-500 mt-1">Select a unit from the grid to manage its details and pricing.</p>
                                                                                </div>
                                                                            )}
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
                                <Button icon={Plus} variant="secondary" className="font-black uppercase tracking-widest text-xs">Upload Document</Button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                {['RERA_Certificate.pdf', 'Master_Brochure_2026.pdf', 'Site_Plan_Layout.dwg', 'Builder_ID_Proof.jpg', 'Pricing_Sheet_Q2.xlsx', 'NOC_Fire_Safety.pdf'].map((doc, i) => (
                                    <div key={i} className="flex items-center p-5 border border-gray-100 rounded-2xl hover:bg-[#6F4BFF]/5 hover:border-[#6F4BFF]/30 cursor-pointer transition-all group relative overflow-hidden">
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
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}
                </div>
            </main>
        </div>
    );
};

// Builder Projects View Component - Shows all properties from a specific builder
const BuilderProjectsView = ({ builder, onBack }) => {
    const dispatch = useDispatch();
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

    // Get unique locations from this builder's projects
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

    return (
        <div className="flex-1 flex flex-col h-full relative bg-[#F5F6FA] font-sans text-gray-900">
            <Header title="Builder Properties" showBack onBack={onBack} />

            <main className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth">
                <div className="max-w-[1600px] mx-auto space-y-6">
                    
                    {/* Builder Profile Header */}
                    <Card className="p-8 border-gray-100 shadow-xl shadow-gray-200/50 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                                <Users className="w-10 h-10 text-[#6F4BFF]" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">{builder.companyName}</h2>
                                <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mb-4">{builder.builderType}</p>
                                <p className="text-sm text-gray-600 leading-relaxed max-w-3xl">{builder.about}</p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Badge variant="gradient" className="font-black uppercase tracking-widest text-xs">
                                    {builder.projectCount} {builder.projectCount === 1 ? 'Property' : 'Properties'}
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
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Location</p>
                                    <p className="text-sm font-bold text-gray-900">{builder.location}</p>
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
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Brand Name</p>
                                    <p className="text-sm font-bold text-gray-900">{builder.brandName || builder.companyName}</p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Search and Filters for Builder Properties */}
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
                                <h3 className="text-xl font-black text-gray-900">Properties by {builder.companyName}</h3>
                                <p className="text-sm text-gray-500 mt-1 font-medium">
                                    Showing {filteredBuilderProjects.length} of {builder.projectCount} {builder.projectCount === 1 ? 'property' : 'properties'}
                                </p>
                            </div>
                        </div>

                        {/* Project Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            {filteredBuilderProjects.map((p, i) => (
                                <Card 
                                    key={p.id} 
                                    noPadding 
                                    className="group cursor-pointer hover:border-[#6F4BFF]/40 hover:shadow-xl transition-all flex flex-col h-full overflow-hidden border-gray-100"
                                    onClick={() => handleProjectClick(p)}
                                >
                                    <div className="h-40 relative overflow-hidden bg-linear-to-br from-indigo-100 via-purple-50 to-pink-50">
                                        <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px]"></div>
                                        <Building2 className="absolute -bottom-6 -right-6 w-32 h-32 text-[#6F4BFF]/10 rotate-12 transition-transform group-hover:scale-110 duration-700" />
                                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-xl text-[10px] font-black text-gray-800 shadow-sm uppercase tracking-widest border border-white">
                                            {p.builder}
                                        </div>
                                        <div className="absolute top-4 right-4">
                                            {getStatusBadge(p.status)}
                                        </div>
                                        <div className="absolute bottom-4 left-4 bg-emerald-500 text-white px-3 py-1.5 rounded-xl text-[10px] font-black shadow-lg shadow-emerald-500/20 uppercase tracking-widest border border-emerald-400">
                                            {p.available} Units Left
                                        </div>
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col">
                                        <h3 className="text-xl font-black text-gray-900 mb-1 group-hover:text-[#6F4BFF] transition-colors tracking-tight">
                                            {p.name}
                                        </h3>
                                        <p className="text-sm text-gray-500 font-bold flex items-center gap-1.5 mb-6">
                                            <MapPin className="w-4 h-4 text-gray-400" /> {p.location}
                                        </p>

                                        <div className="mt-auto pt-5 border-t border-gray-100 flex items-center justify-between">
                                            <div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Base Pricing</p>
                                                <p className="font-black text-gray-900 text-lg tracking-tight">{p.priceRange}</p>
                                            </div>
                                            <div className="flex gap-1.5">
                                                {p.configs.map(c => (
                                                    <span key={c} className="text-[10px] font-black bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg uppercase tracking-wider">
                                                        {c}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </Card>
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
