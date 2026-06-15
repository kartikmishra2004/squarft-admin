import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as roleAccessService from '../services/roleAccessService';

/**
 * Async thunk to fetch role access context
 */
export const getRoleAccessContext = createAsyncThunk(
  'roleAccess/getContext',
  async (_, { rejectWithValue }) => {
    console.group('🔄 [REDUX THUNK] Get Role Access Context');
    console.log('⏱️ Dispatch Time:', new Date().toISOString());
    try {
      const result = await roleAccessService.fetchRoleAccessContext();
      console.log('✅ Thunk Success:', result);
      console.groupEnd();
      return result;
    } catch (error) {
      console.error('❌ Thunk Failed:', error);
      console.error('📛 Will reject with:', error);
      console.groupEnd();
      return rejectWithValue(error);
    }
  }
);

/**
 * Async thunk to fetch accessible branches
 */
export const getAccessibleBranches = createAsyncThunk(
  'roleAccess/getBranches',
  async (params = {}, { rejectWithValue }) => {
    console.group('🔄 [REDUX THUNK] Get Accessible Branches');
    console.log('⏱️ Dispatch Time:', new Date().toISOString());
    console.log('📥 Params:', params);
    try {
      const result = await roleAccessService.fetchAccessibleBranches(params);
      console.log('✅ Thunk Success:', result);
      console.groupEnd();
      return result;
    } catch (error) {
      console.error('❌ Thunk Failed:', error);
      console.error('📛 Will reject with:', error);
      console.groupEnd();
      return rejectWithValue(error);
    }
  }
);

/**
 * Async thunk to fetch operating roles
 */
export const getOperatingRoles = createAsyncThunk(
  'roleAccess/getRoles',
  async (branchId = null, { rejectWithValue }) => {
    console.group('🔄 [REDUX THUNK] Get Operating Roles');
    console.log('⏱️ Dispatch Time:', new Date().toISOString());
    console.log('📥 Branch ID:', branchId);
    try {
      const result = await roleAccessService.fetchOperatingRoles(branchId);
      console.log('✅ Thunk Success:', result);
      console.groupEnd();
      return result;
    } catch (error) {
      console.error('❌ Thunk Failed:', error);
      console.error('📛 Will reject with:', error);
      console.groupEnd();
      return rejectWithValue(error);
    }
  }
);

/**
 * Async thunk to fetch role detail
 */
export const getRoleDetail = createAsyncThunk(
  'roleAccess/getRoleDetail',
  async ({ roleId, branchId = null }, { rejectWithValue }) => {
    console.group('🔄 [REDUX THUNK] Get Role Detail');
    console.log('⏱️ Dispatch Time:', new Date().toISOString());
    console.log('📥 Role ID:', roleId);
    console.log('📥 Branch ID:', branchId);
    try {
      const result = await roleAccessService.fetchRoleDetail(roleId, branchId);
      console.log('✅ Thunk Success:', result);
      console.groupEnd();
      return result;
    } catch (error) {
      console.error('❌ Thunk Failed:', error);
      console.error('📛 Will reject with:', error);
      console.groupEnd();
      return rejectWithValue(error);
    }
  }
);

/**
 * Async thunk to create branch role
 */
export const createNewBranchRole = createAsyncThunk(
  'roleAccess/createRole',
  async (roleData, { rejectWithValue }) => {
    console.group('🔄 [REDUX THUNK] Create New Branch Role');
    console.log('⏱️ Dispatch Time:', new Date().toISOString());
    console.log('📥 Role Data:', roleData);
    try {
      const result = await roleAccessService.createBranchRole(roleData);
      console.log('✅ Thunk Success:', result);
      console.groupEnd();
      return result;
    } catch (error) {
      console.error('❌ Thunk Failed:', error);
      console.error('📛 Will reject with:', error);
      console.groupEnd();
      return rejectWithValue(error);
    }
  }
);

/**
 * Async thunk to update role permissions
 */
export const updatePermissions = createAsyncThunk(
  'roleAccess/updatePermissions',
  async ({ roleId, permissionsData }, { rejectWithValue }) => {
    console.group('🔄 [REDUX THUNK] Update Permissions');
    console.log('⏱️ Dispatch Time:', new Date().toISOString());
    console.log('📥 Role ID:', roleId);
    console.log('📥 Permissions Data:', permissionsData);
    try {
      const result = await roleAccessService.updateRolePermissions(roleId, permissionsData);
      console.log('✅ Thunk Success:', result);
      console.groupEnd();
      return result;
    } catch (error) {
      console.error('❌ Thunk Failed:', error);
      console.error('📛 Will reject with:', error);
      console.groupEnd();
      return rejectWithValue(error);
    }
  }
);

/**
 * Async thunk to fetch my effective access
 */
export const getMyEffectiveAccess = createAsyncThunk(
  'roleAccess/getMyAccess',
  async (_, { rejectWithValue }) => {
    try {
      return await roleAccessService.fetchMyEffectiveAccess();
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

/**
 * Async thunk to fetch activity logs
 */
export const getActivityLogs = createAsyncThunk(
  'roleAccess/getActivityLogs',
  async (params = {}, { rejectWithValue }) => {
    try {
      return await roleAccessService.fetchRoleAccessActivityLogs(params);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const initialState = {
  context: null,
  accessibleBranches: [],
  operatingRoles: [],
  selectedRole: null,
  myEffectiveAccess: null,
  activityLogs: [],
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

const roleAccessSlice = createSlice({
  name: 'roleAccess',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.successMessage = null;
    },
    clearSelectedRole: (state) => {
      state.selectedRole = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get role access context
      .addCase(getRoleAccessContext.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRoleAccessContext.fulfilled, (state, action) => {
        state.loading = false;
        state.context = action.payload;
      })
      .addCase(getRoleAccessContext.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch role access context';
      })

      // Get accessible branches
      .addCase(getAccessibleBranches.pending, (state) => {
        console.log('🔄 [REDUX STATE] getAccessibleBranches.pending');
        state.loading = true;
        state.error = null;
      })
      .addCase(getAccessibleBranches.fulfilled, (state, action) => {
        console.log('✅ [REDUX STATE] getAccessibleBranches.fulfilled');
        console.log('📊 Payload:', action.payload);
        state.loading = false;
        state.accessibleBranches = action.payload.branches || action.payload;
        
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
        console.log('📊 State Updated - Branches Count:', state.accessibleBranches?.length || 0);
      })
      .addCase(getAccessibleBranches.rejected, (state, action) => {
        console.error('❌ [REDUX STATE] getAccessibleBranches.rejected');
        console.error('📛 Error Payload:', action.payload);
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch accessible branches';
      })

      // Get operating roles
      .addCase(getOperatingRoles.pending, (state) => {
        console.log('🔄 [REDUX STATE] getOperatingRoles.pending');
        state.loading = true;
        state.error = null;
      })
      .addCase(getOperatingRoles.fulfilled, (state, action) => {
        console.log('✅ [REDUX STATE] getOperatingRoles.fulfilled');
        console.log('📊 Payload:', action.payload);
        console.log('📊 Payload Type:', typeof action.payload);
        console.log('📊 Is Array:', Array.isArray(action.payload));
        state.loading = false;
        state.operatingRoles = action.payload;
        console.log('📊 State Updated - operatingRoles:', state.operatingRoles);
      })
      .addCase(getOperatingRoles.rejected, (state, action) => {
        console.error('❌ [REDUX STATE] getOperatingRoles.rejected');
        console.error('📛 Error Payload:', action.payload);
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch operating roles';
      })

      // Get role detail
      .addCase(getRoleDetail.pending, (state) => {
        console.log('🔄 [REDUX STATE] getRoleDetail.pending');
        state.loading = true;
        state.error = null;
      })
      .addCase(getRoleDetail.fulfilled, (state, action) => {
        console.log('✅ [REDUX STATE] getRoleDetail.fulfilled');
        console.log('📊 Role Detail:', action.payload);
        state.loading = false;
        state.selectedRole = action.payload;
      })
      .addCase(getRoleDetail.rejected, (state, action) => {
        console.error('❌ [REDUX STATE] getRoleDetail.rejected');
        console.error('📛 Error Payload:', action.payload);
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch role detail';
      })

      // Create branch role
      .addCase(createNewBranchRole.pending, (state) => {
        console.log('🔄 [REDUX STATE] createNewBranchRole.pending');
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createNewBranchRole.fulfilled, (state, action) => {
        console.log('✅ [REDUX STATE] createNewBranchRole.fulfilled');
        console.log('📊 New Role:', action.payload);
        state.loading = false;
        state.operatingRoles.push(action.payload);
        state.successMessage = 'Role created successfully';
        console.log('📊 Roles Count After Add:', state.operatingRoles.length);
      })
      .addCase(createNewBranchRole.rejected, (state, action) => {
        console.error('❌ [REDUX STATE] createNewBranchRole.rejected');
        console.error('📛 Error Payload:', action.payload);
        state.loading = false;
        if (action.payload?.errors && Array.isArray(action.payload.errors)) {
          const errorMessages = action.payload.errors
            .map(err => `${err.field}: ${err.message}`)
            .join(', ');
          state.error = `Validation failed - ${errorMessages}`;
          console.error('📛 Validation Errors:', errorMessages);
        } else {
          state.error = action.payload?.message || 'Failed to create role';
        }
      })

      // Update role permissions
      .addCase(updatePermissions.pending, (state) => {
        console.log('🔄 [REDUX STATE] updatePermissions.pending');
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updatePermissions.fulfilled, (state, action) => {
        console.log('✅ [REDUX STATE] updatePermissions.fulfilled');
        console.log('📊 Updated Role:', action.payload);
        state.loading = false;
        state.selectedRole = action.payload;
        state.successMessage = 'Permissions updated successfully';
      })
      .addCase(updatePermissions.rejected, (state, action) => {
        console.error('❌ [REDUX STATE] updatePermissions.rejected');
        console.error('📛 Error Payload:', action.payload);
        state.loading = false;
        if (action.payload?.errors && Array.isArray(action.payload.errors)) {
          const errorMessages = action.payload.errors
            .map(err => `${err.field}: ${err.message}`)
            .join(', ');
          state.error = `Validation failed - ${errorMessages}`;
          console.error('📛 Validation Errors:', errorMessages);
        } else {
          state.error = action.payload?.message || 'Failed to update permissions';
        }
      })

      // Get my effective access
      .addCase(getMyEffectiveAccess.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyEffectiveAccess.fulfilled, (state, action) => {
        state.loading = false;
        state.myEffectiveAccess = action.payload;
      })
      .addCase(getMyEffectiveAccess.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch effective access';
      })

      // Get activity logs
      .addCase(getActivityLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getActivityLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.activityLogs = action.payload.logs || action.payload;
        
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(getActivityLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch activity logs';
      });
  },
});

export const { clearError, clearSuccess, clearSelectedRole } = roleAccessSlice.actions;
export default roleAccessSlice.reducer;
