import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as authService from '../services/authService';

/**
 * Authentication Redux Slice
 * 
 * Note: No registration functionality is provided.
 * Users are manually created in the database by administrators.
 * This slice only handles login/logout operations.
 */

/**
 * Async thunk for admin login
 */
export const loginAdmin = createAsyncThunk(
  'auth/loginAdmin',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.loginAdmin(credentials);
      return {
        token: response.token,
        user: response.user,
        role: 'admin',
      };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

/**
 * Async thunk for super admin login
 */
export const loginSuperAdmin = createAsyncThunk(
  'auth/loginSuperAdmin',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.loginSuperAdmin(credentials);
      return {
        token: response.token,
        user: response.user,
        role: 'super_admin',
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
    // Legacy actions for backward compatibility (can be removed if not used elsewhere)
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Admin Login
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.role = action.payload.user?.role || 'admin';
        state.successMessage = 'Admin login successful';
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.role = null;
        state.error = action.payload?.message || 'Admin login failed';
      })

      // Super Admin Login
      .addCase(loginSuperAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(loginSuperAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.role = action.payload.user?.role || 'super_admin';
        state.successMessage = 'Super Admin login successful';
      })
      .addCase(loginSuperAdmin.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.role = null;
        state.error = action.payload?.message || 'Super Admin login failed';
      });
  },
});

export const { 
  clearError, 
  clearSuccess, 
  logout,
  loginStart,
  loginSuccess,
  loginFailure,
} = authSlice.actions;

export default authSlice.reducer;
