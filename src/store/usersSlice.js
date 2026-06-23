import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchAppUsers,
  fetchUserVerificationDetails,
  updateUserVerification as apiUpdateUserVerification,
  createAppUser as apiCreateAppUser,
  deleteAppUser as apiDeleteAppUser,
} from '../services/userAppService';

// ─── Thunks ───────────────────────────────────────────────────────────────────

export const loadAppUsers = createAsyncThunk(
  'users/loadAppUsers',
  async (params, { rejectWithValue }) => {
    try {
      return await fetchAppUsers(params);
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch users');
    }
  }
);

export const loadUserDetails = createAsyncThunk(
  'users/loadUserDetails',
  async (userId, { rejectWithValue }) => {
    try {
      return await fetchUserVerificationDetails(userId);
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch user details');
    }
  }
);

export const saveUserVerification = createAsyncThunk(
  'users/saveUserVerification',
  async ({ userId, body }, { rejectWithValue }) => {
    try {
      await apiUpdateUserVerification(userId, body);
      return { userId, body };
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to update user');
    }
  }
);

export const addAppUser = createAsyncThunk(
  'users/addAppUser',
  async (body, { rejectWithValue }) => {
    try {
      return await apiCreateAppUser(body);
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to create user');
    }
  }
);

export const removeAppUser = createAsyncThunk(
  'users/removeAppUser',
  async (userId, { rejectWithValue }) => {
    try {
      await apiDeleteAppUser(userId);
      return userId;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to delete user');
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const initialState = {
  users: [],
  selectedUser: null,
  selectedUserDetails: null,
  pagination: null,
  loading: false,
  detailLoading: false,
  saving: false,
  error: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
      state.selectedUserDetails = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    // update a single document url in selectedUserDetails after upload
    updateUserDocument: (state, action) => {
      const { docKey, url } = action.payload;
      if (state.selectedUserDetails) {
        state.selectedUserDetails.documents = {
          ...(state.selectedUserDetails.documents || {}),
          [docKey]: url,   // API returns url string, not an object
        };
      }
    },
  },
  extraReducers: (builder) => {
    // loadAppUsers
    builder
      .addCase(loadAppUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadAppUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
        state.pagination = action.payload.pagination;
      })
      .addCase(loadAppUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // loadUserDetails
    builder
      .addCase(loadUserDetails.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
      })
      .addCase(loadUserDetails.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.selectedUserDetails = action.payload;
      })
      .addCase(loadUserDetails.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.payload;
      });

    // saveUserVerification
    builder
      .addCase(saveUserVerification.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(saveUserVerification.fulfilled, (state, action) => {
        state.saving = false;
        // reflect document_status change in the list
        const { userId, body } = action.payload;
        const idx = state.users.findIndex((u) => u.id === userId);
        if (idx !== -1 && body.document_status) {
          state.users[idx] = {
            ...state.users[idx],
            document_status: body.document_status.charAt(0).toUpperCase() + body.document_status.slice(1),
          };
        }
      })
      .addCase(saveUserVerification.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      });

    // addAppUser
    builder
      .addCase(addAppUser.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(addAppUser.fulfilled, (state, action) => {
        state.saving = false;
        if (action.payload) {
          state.users.unshift(action.payload);
        }
      })
      .addCase(addAppUser.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      });

    // removeAppUser
    builder
      .addCase(removeAppUser.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u.id !== action.payload);
        if (state.selectedUser?.id === action.payload) {
          state.selectedUser = null;
        }
      })
      .addCase(removeAppUser.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { setSelectedUser, clearError, updateUserDocument } = usersSlice.actions;
export default usersSlice.reducer;
