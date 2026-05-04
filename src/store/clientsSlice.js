import { createSlice } from '@reduxjs/toolkit';
import { mockClients } from '../data/mockData';

const initialState = {
  clients: mockClients,
  filteredClients: mockClients,
  selectedClient: null,
  loading: false,
  error: null,
  filters: {
    search: '',
    status: 'All',
  }
};

const clientsSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    addClient: (state, action) => {
      state.clients.unshift(action.payload);
      state.filteredClients = state.clients;
    },
    setSelectedClient: (state, action) => {
      state.selectedClient = action.payload;
    },
    updateClientStatus: (state, action) => {
      const { id, status } = action.payload;
      const client = state.clients.find(c => c.id === id);
      if (client) {
        client.status = status;
      }
      state.filteredClients = state.clients;
      if (state.selectedClient?.id === id) {
        state.selectedClient.status = status;
      }
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      const { search, status } = state.filters;
      
      state.filteredClients = state.clients.filter(client => {
        const matchesSearch = client.name.toLowerCase().includes(search.toLowerCase()) || 
                             client.phone.includes(search);
        const matchesStatus = status === 'All' || client.status === status;
        return matchesSearch && matchesStatus;
      });
    },
    qualifyLeadToClient: (state, action) => {
      const lead = action.payload;
      const newClient = {
        id: lead.id.replace('L', 'C'),
        name: lead.name,
        phone: lead.phone,
        budget: lead.budget,
        req: {
          type: lead.req.split(',')[0].trim(),
          bhk: [lead.req.split(',')[1]?.trim() || '3BHK'],
          loc: [lead.location],
          timeline: '30 Days'
        },
        status: 'Active',
        officer: lead.officer,
        propertyPipeline: [],
        timeline: [{ title: 'Qualified from Lead', details: 'Client created from leads pipeline', date: new Date().toLocaleDateString(), time: new Date().toLocaleTimeString() }],
      };
      state.clients.unshift(newClient);
      state.filteredClients = state.clients;
    }
  },
});

export const { addClient, setSelectedClient, updateClientStatus, setFilters, qualifyLeadToClient } = clientsSlice.actions;
export default clientsSlice.reducer;
