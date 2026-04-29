import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// Mock API call
const mockFetchStats = () => new Promise((resolve) => {
  setTimeout(() => {
    resolve({
      revenue: '$128,430',
      properties: '432',
      customers: '2,845',
      growth: '24.8%'
    })
  }, 1000)
})

export const fetchStats = createAsyncThunk(
  'dashboard/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const data = await mockFetchStats()
      return data
    } catch (error) {
      return rejectWithValue('Failed to fetch dashboard stats')
    }
  }
)

const initialState = {
  stats: {
    revenue: '$0',
    properties: '0',
    customers: '0',
    growth: '0%'
  },
  loading: false,
  error: null,
}

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStats.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.loading = false
        state.stats = action.payload
      })
      .addCase(fetchStats.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export default dashboardSlice.reducer
