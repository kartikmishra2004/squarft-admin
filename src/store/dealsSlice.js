import { createSlice } from '@reduxjs/toolkit';
import { mockDeals } from '../data/mockData';

const initialState = {
  deals: mockDeals,
  selectedDeal: null,
  loading: false,
  error: null,
};

const dealsSlice = createSlice({
  name: 'deals',
  initialState,
  reducers: {
    setSelectedDeal: (state, action) => {
      state.selectedDeal = action.payload;
    },
    deleteDeal: (state, action) => {
      state.deals = state.deals.filter(deal => deal.dealCode !== action.payload);
    },
    updateDealStatus: (state, action) => {
      const { dealCode, status } = action.payload;
      const deal = state.deals.find(d => d.dealCode === dealCode);
      if (deal) {
        deal.status = status;
      }
      if (state.selectedDeal?.dealCode === dealCode) {
        state.selectedDeal = { ...state.selectedDeal, status };
      }
    },
    updateDealDetails: (state, action) => {
      const { dealCode, changes } = action.payload;
      const deal = state.deals.find(d => d.dealCode === dealCode);
      if (deal) {
        Object.assign(deal, changes);
      }
      if (state.selectedDeal?.dealCode === dealCode) {
        state.selectedDeal = { ...state.selectedDeal, ...changes };
      }
    },
  },
});

export const { setSelectedDeal, deleteDeal, updateDealStatus, updateDealDetails } = dealsSlice.actions;
export default dealsSlice.reducer;
