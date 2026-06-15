import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as branchService from '../services/branchService';

/**
 * Async thunk to fetch all branches
 */
export const getBranches = createAsyncThunk(
  'branches/getBranches',
  async (params = {}, { rejectWithValue }) => {
    try {
      return await branchService.fetchBranches(params);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

/**
 * Async thunk to fetch branch by ID
 */
export const getBranchById = createAsyncThunk(
  'branches/getBranchById',
  async (branchId, { rejectWithValue }) => {
    try {
      return await branchService.fetchBranchById(branchId);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

/**
 * Async thunk to create a new branch
 */
export const createNewBranch = createAsyncThunk(
  'branches/createBranch',
  async (branchData, { rejectWithValue }) => {
    try {
      return await branchService.createBranch(branchData);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

/**
 * Async thunk to update branch
 */
export const updateExistingBranch = createAsyncThunk(
  'branches/updateBranch',
  async ({ branchId, branchData }, { rejectWithValue }) => {
    try {
      return await branchService.updateBranch(branchId, branchData);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

/**
 * Async thunk to update branch status
 */
export const updateStatus = createAsyncThunk(
  'branches/updateStatus',
  async ({ branchId, status }, { rejectWithValue }) => {
    try {
      return await branchService.updateBranchStatus(branchId, status);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

/**
 * Async thunk to fetch branch team
 */
export const getBranchTeam = createAsyncThunk(
  'branches/getBranchTeam',
  async (branchId, { rejectWithValue }) => {
    try {
      return await branchService.fetchBranchTeam(branchId);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const initialState = {
  branches: [],
  selectedBranch: null,
  branchTeam: [],
  loading: false,
  error: null,
  successMessage: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  },
};

const branchesSlice = createSlice({
  name: 'branches',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.successMessage = null;
    },
    clearSelectedBranch: (state) => {
      state.selectedBranch = null;
    },
    clearBranchTeam: (state) => {
      state.branchTeam = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all branches
      .addCase(getBranches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBranches.fulfilled, (state, action) => {
        state.loading = false;
        // Unwraps nested data envelope if present, otherwise uses fallback payload layout
        const responseData = action.payload?.data || action.payload;
        state.branches = responseData.branches || (Array.isArray(responseData) ? responseData : []);
        
        if (action.payload?.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(getBranches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch branches';
      })

      // Get branch by ID
      .addCase(getBranchById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBranchById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedBranch = action.payload?.data || action.payload;
      })
      .addCase(getBranchById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch branch details';
      })

      // Create branch
      .addCase(createNewBranch.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createNewBranch.fulfilled, (state, action) => {
        state.loading = false;
        const createdBranch = action.payload?.data || action.payload;
        if (createdBranch) {
          state.branches.push(createdBranch);
        }
        state.successMessage = 'Branch created successfully';
      })
      .addCase(createNewBranch.rejected, (state, action) => {
        state.loading = false;
        if (action.payload?.errors && Array.isArray(action.payload.errors)) {
          const errorMessages = action.payload.errors
            .map(err => `${err.field}: ${err.message}`)
            .join(', ');
          state.error = `Validation failed - ${errorMessages}`;
        } else {
          state.error = action.payload?.message || 'Failed to create branch';
        }
      })

      // Update branch
      .addCase(updateExistingBranch.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateExistingBranch.fulfilled, (state, action) => {
        state.loading = false;
        const updatedBranch = action.payload?.data || action.payload;
        
        if (updatedBranch && updatedBranch.id) {
          const index = state.branches.findIndex(
            (branch) => branch.id === updatedBranch.id
          );
          if (index !== -1) {
            state.branches[index] = updatedBranch;
          }
        }
        state.successMessage = 'Branch updated successfully';
      })
      .addCase(updateExistingBranch.rejected, (state, action) => {
        state.loading = false;
        if (action.payload?.errors && Array.isArray(action.payload.errors)) {
          const errorMessages = action.payload.errors
            .map(err => `${err.field}: ${err.message}`)
            .join(', ');
          state.error = `Validation failed - ${errorMessages}`;
        } else {
          state.error = action.payload?.message || 'Failed to update branch';
        }
      })

      // Update branch status
      .addCase(updateStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updatedBranch = action.payload?.data || action.payload;
        
        if (updatedBranch && updatedBranch.id) {
          const index = state.branches.findIndex(
            (branch) => branch.id === updatedBranch.id
          );
          if (index !== -1) {
            state.branches[index] = updatedBranch;
          }
        }
        state.successMessage = 'Branch status updated successfully';
      })
      .addCase(updateStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update branch status';
      })

      // Get branch team
      .addCase(getBranchTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBranchTeam.fulfilled, (state, action) => {
        state.loading = false;
        const responseData = action.payload?.data || action.payload;
        state.branchTeam = responseData.team || responseData;
      })
      .addCase(getBranchTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch branch team';
      });
  },
});

export const { clearError, clearSuccess, clearSelectedBranch, clearBranchTeam } = branchesSlice.actions;
export default branchesSlice.reducer;