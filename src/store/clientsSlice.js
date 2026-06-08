import { createSlice } from '@reduxjs/toolkit';
import { sample2Clients } from '../data/mockData';

const initialState = {
  clients: sample2Clients,
  filteredClients: sample2Clients,
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
    updateClient: (state, action) => {
      const { id, changes } = action.payload;
      const client = state.clients.find(c => c.id === id);
      if (client) {
        Object.assign(client, changes);
      }
      state.filteredClients = state.clients;
      if (state.selectedClient?.id === id) {
        state.selectedClient = { ...state.selectedClient, ...changes };
      }
    },
    addClientNote: (state, action) => {
      const { id, note } = action.payload;
      const client = state.clients.find(c => c.id === id);
      if (client) {
        client.notes = [note, ...(client.notes || [])];
        client.latestNote = note.text;
      }
      state.filteredClients = state.clients;
      if (state.selectedClient?.id === id) {
        state.selectedClient.notes = [note, ...(state.selectedClient.notes || [])];
        state.selectedClient.latestNote = note.text;
      }
    },
    addClientMeeting: (state, action) => {
      const { id, meeting } = action.payload;
      const client = state.clients.find(c => c.id === id);
      if (client) {
        client.meetings = [meeting, ...(client.meetings || [])];
        client.nextFollowUp = meeting.date;
      }
      state.filteredClients = state.clients;
      if (state.selectedClient?.id === id) {
        state.selectedClient.meetings = [meeting, ...(state.selectedClient.meetings || [])];
        state.selectedClient.nextFollowUp = meeting.date;
      }
    },
    logClientFeedback: (state, action) => {
      const { id, interest, notes } = action.payload;
      const client = state.clients.find(c => c.id === id);
      if (client) {
        const now = new Date();
        const nextStatus = interest === 'Not Interested' ? 'Suspended' : interest === 'Needs Time' ? 'Pending' : 'Negotiating';
        client.status = nextStatus;
        client.score = interest === 'Not Interested' ? 'Cold' : client.score;
        client.actionRequired = false;
        client.latestNote = notes;
        client.notes = [
          {
            text: notes,
            date: now.toLocaleDateString('en-IN'),
            time: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
          },
          ...(client.notes || []),
        ];
        client.timeline = [
          {
            title: 'Post-Visit Feedback Logged',
            details: `${interest}: ${notes}`,
            date: now.toLocaleDateString('en-IN'),
            time: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
          },
          ...(client.timeline || []),
        ];
      }
      state.filteredClients = state.clients;
      if (state.selectedClient?.id === id) {
        state.selectedClient = state.clients.find(c => c.id === id);
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
      const alreadyExists = state.clients.some(client => client.sourceLeadId === lead.id || client.id === lead.id.replace('L', 'C'));
      if (alreadyExists) {
        state.filteredClients = state.clients;
        return;
      }
      const now = new Date();
      const reqParts = String(lead.req || 'Residential, 3BHK').split(',').map(part => part.trim()).filter(Boolean);
      const newClient = {
        id: lead.id.replace('L', 'C'),
        sourceLeadId: lead.id,
        name: lead.name,
        phone: lead.phone,
        email: lead.email,
        budget: lead.budget,
        listingType: 'Buy',
        listingKind: reqParts[0] || 'Residential',
        propType: reqParts.slice(1).join(', ') || 'APARTMENT/FLATS',
        date: now.toLocaleDateString('en-IN'),
        time: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        req: {
          type: reqParts[0] || 'Residential',
          bhk: [reqParts[1] || '3BHK'],
          loc: [lead.location || 'Location pending'],
          timeline: '30 Days'
        },
        status: 'Active',
        officer: lead.officer,
        score: lead.score || 'Warm',
        visitToday: false,
        nextFollowUp: lead.nextActionDate || 'Today',
        latestNote: `Qualified from lead pipeline. Next action: ${lead.nextAction || 'Client follow-up'}.`,
        actionRequired: false,
        propertyPipeline: [],
        timeline: [
          {
            title: 'Qualified from Lead',
            details: 'Client created from leads pipeline',
            date: now.toLocaleDateString('en-IN'),
            time: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
          }
        ],
        notes: [],
        meetings: [],
      };
      state.clients.unshift(newClient);
      state.filteredClients = state.clients;
    }
  },
});

export const {
  addClient,
  setSelectedClient,
  updateClientStatus,
  updateClient,
  addClientNote,
  addClientMeeting,
  logClientFeedback,
  setFilters,
  qualifyLeadToClient
} = clientsSlice.actions;
export default clientsSlice.reducer;
