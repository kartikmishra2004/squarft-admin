import { createSlice } from '@reduxjs/toolkit';
import { sample2Visits } from '../data/mockData';

const initialState = {
  visits: sample2Visits,
  loading: false,
  error: null,
};

const visitsSlice = createSlice({
  name: 'visits',
  initialState,
  reducers: {
    addVisit: (state, action) => {
      const nextNumber = state.visits.reduce((max, visit) => {
        const visitNumber = Number(String(visit.id).replace(/\D/g, '')) || 0;
        return Math.max(max, visitNumber);
      }, 0) + 1;
      state.visits.unshift({ id: `V${String(nextNumber).padStart(3, '0')}`, ...action.payload });
    },
    updateVisitStatus: (state, action) => {
      const { id, status } = action.payload;
      const visit = state.visits.find(v => v.id === id);
      if (visit) {
        visit.status = status;
      }
    },
    updateVisit: (state, action) => {
      const { id, changes } = action.payload;
      const visit = state.visits.find(v => v.id === id);
      if (visit) {
        Object.assign(visit, changes);
      }
    },
    addVisitNote: (state, action) => {
      const { id, note } = action.payload;
      const visit = state.visits.find(v => v.id === id);
      if (visit) {
        visit.notes = `${visit.notes || ''}\n\n[Updated]: ${note}`.trim();
      }
    },
  },
});

export const { addVisit, updateVisitStatus, updateVisit, addVisitNote } = visitsSlice.actions;
export default visitsSlice.reducer;
