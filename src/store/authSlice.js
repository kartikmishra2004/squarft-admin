import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as authService from '../services/authService';

/**
 * Authentication Redux Slice
 *
 * Note: No registration form. Admin/super_admin accounts are created by an
 * existing super_admin. Login is email+password only, one step.
 */

/**
 * Async thunk - email+password login (admin or super_admin), one step.
 */
export const loginWithPassword = createAsyncThunk(
  'auth/loginWithPassword',
  async ({ email, password, role }, { rejectWithValue }) => {
    try {
      const response = await authService.loginWithPassword({ email, password, role });
      return {
        token: response.token,
        user: response.user,
        role,
      };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const storedUser = authService.getUserData();
const storedToken = authService.getAuthToken();
const storedRole = authService.getUserRole() || storedUser?.role || null;

const initialState = {
  user: storedUser,
  token: storedToken,
  role: storedRole,
  isAuthenticated: Boolean(storedToken),
  loading: false,
  error: null,
  successMessage: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.successMessage = null;
    },
    logout: (state) => {
      authService.logout();
      state.user = null;
      state.token = null;
      state.role = null;
      state.isAuthenticated = false;
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Email+password login
      .addCase(loginWithPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.role = action.payload.user?.role || action.payload.role;
        state.successMessage = 'Login successful';
      })
      .addCase(loginWithPassword.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload?.message || 'Login failed';
      });
  },
});

export const {
  clearError,
  clearSuccess,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
