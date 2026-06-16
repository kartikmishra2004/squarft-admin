import { createSlice } from '@reduxjs/toolkit';
import { mockProjects } from '../data/mockData';

const initialState = {
  projects: mockProjects,
  filteredProjects: mockProjects,
  selectedProject: null,
  selectedBuilder: null, // New: for builder view
  viewMode: 'projects', // 'projects' or 'builders' or 'builderProjects'
  loading: false,
  error: null,
  filters: {
    search: '',
    status: 'All',
    propertySource: 'all', // 'all', 'builder', 'broker'
    priceRange: 'all', // 'all', 'under-1cr', '1cr-2cr', '2cr-5cr', '5cr-plus'
    location: 'all', // 'all', or specific city names
  }
};

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    setProjects: (state, action) => {
      state.projects = action.payload;
      state.filteredProjects = action.payload;
    },
    setSelectedProject: (state, action) => {
      state.selectedProject = action.payload;
    },
    setSelectedBuilder: (state, action) => {
      state.selectedBuilder = action.payload;
    },
    setViewMode: (state, action) => {
      state.viewMode = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      const { search, status, propertySource, priceRange, location } = state.filters;
      
      state.filteredProjects = state.projects.filter(project => {
        // Search filter
        const matchesSearch = project.name.toLowerCase().includes(search.toLowerCase()) || 
                             project.builder.toLowerCase().includes(search.toLowerCase()) ||
                             project.location.toLowerCase().includes(search.toLowerCase());
        
        // Status filter
        const matchesStatus = status === 'All' || project.status === status;
        
        // Property source filter
        const matchesSource = propertySource === 'all' || project.addedBy === propertySource;
        
        // Price range filter
        let matchesPriceRange = true;
        if (priceRange !== 'all') {
          // Extract minimum price from priceRange string (e.g., "1.2 Cr - 2.5 Cr" or "85 L - 1.5 Cr")
          const priceStr = project.priceRange.toLowerCase();
          let minPrice = 0;
          
          // Parse the minimum price
          if (priceStr.includes('cr')) {
            const match = priceStr.match(/(\d+\.?\d*)\s*cr/i);
            if (match) minPrice = parseFloat(match[1]) * 100; // Convert Cr to Lacs
          } else if (priceStr.includes('l')) {
            const match = priceStr.match(/(\d+)\s*l/i);
            if (match) minPrice = parseFloat(match[1]);
          }
          
          // Apply price range filter
          switch(priceRange) {
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
        if (location !== 'all') {
          matchesLocation = project.location.toLowerCase().includes(location.toLowerCase());
        }
        
        return matchesSearch && matchesStatus && matchesSource && matchesPriceRange && matchesLocation;
      });
    },
    updateProjectStatus: (state, action) => {
      const { id, status } = action.payload;
      const project = state.projects.find(p => p.id === id);
      if (project) {
        project.status = status;
      }
      state.filteredProjects = state.projects;
    },
  },
});

export const { setProjects, setSelectedProject, setSelectedBuilder, setViewMode, setFilters, updateProjectStatus } = inventorySlice.actions;
export default inventorySlice.reducer;
