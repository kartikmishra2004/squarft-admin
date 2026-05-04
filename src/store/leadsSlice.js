import { createSlice } from '@reduxjs/toolkit';
import { mockLeads } from '../data/mockData';

const initialState = {
  leads: mockLeads,
  filteredLeads: mockLeads,
  loading: false,
  error: null,
  filters: {
    search: '',
    status: 'All',
  }
};

const leadsSlice = createSlice({
  name: 'leads',
  initialState,
  reducers: {
    addLead: (state, action) => {
      state.leads.unshift(action.payload);
      state.filteredLeads = state.leads;
    },
    setLeads: (state, action) => {
      state.leads = action.payload;
      state.filteredLeads = action.payload;
    },
    updateLeadStatus: (state, action) => {
      const { id, status } = action.payload;
      const lead = state.leads.find(l => l.id === id);
      if (lead) {
        lead.status = status;
      }
      state.filteredLeads = state.leads;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      const { search, status } = state.filters;
      
      state.filteredLeads = state.leads.filter(lead => {
        const matchesSearch = lead.name.toLowerCase().includes(search.toLowerCase()) || 
                             lead.phone.includes(search);
        const matchesStatus = status === 'All' || lead.status === status;
        return matchesSearch && matchesStatus;
      });
    },
  },
});

export const { addLead, setLeads, updateLeadStatus, setFilters } = leadsSlice.actions;
export default leadsSlice.reducer;
