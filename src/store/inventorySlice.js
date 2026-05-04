import { createSlice } from '@reduxjs/toolkit';
import { mockProjects } from '../data/mockData';

const initialState = {
  projects: mockProjects,
  filteredProjects: mockProjects,
  selectedProject: null,
  loading: false,
  error: null,
  filters: {
    search: '',
    status: 'All',
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
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      const { search, status } = state.filters;
      
      state.filteredProjects = state.projects.filter(project => {
        const matchesSearch = project.name.toLowerCase().includes(search.toLowerCase()) || 
                             project.builder.toLowerCase().includes(search.toLowerCase()) ||
                             project.location.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = status === 'All' || project.status === status;
        return matchesSearch && matchesStatus;
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

export const { setProjects, setSelectedProject, setFilters, updateProjectStatus } = inventorySlice.actions;
export default inventorySlice.reducer;
