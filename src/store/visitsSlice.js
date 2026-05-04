import { createSlice } from '@reduxjs/toolkit';
import { mockVisits } from '../data/mockData';

const initialState = {
  visits: mockVisits,
  loading: false,
  error: null,
};

const visitsSlice = createSlice({
  name: 'visits',
  initialState,
  reducers: {
    addVisit: (state, action) => {
      state.visits.unshift({
        id: `V00${state.visits.length + 1}`,
        ...action.payload,
        status: 'Scheduled',
      });
    },
    updateVisitStatus: (state, action) => {
      const { id, status } = action.payload;
      const visit = state.visits.find(v => v.id === id);
      if (visit) {
        visit.status = status;
      }
    },
  },
});

export const { addVisit, updateVisitStatus } = visitsSlice.actions;
export default visitsSlice.reducer;
