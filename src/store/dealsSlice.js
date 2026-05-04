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
    },
  },
});

export const { setSelectedDeal, deleteDeal, updateDealStatus } = dealsSlice.actions;
export default dealsSlice.reducer;
