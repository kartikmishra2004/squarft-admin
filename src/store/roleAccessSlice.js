import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as roleAccessService from '../services/roleAccessService';

export const getRoleAccessContext = createAsyncThunk(
  'roleAccess/getContext',
  async (_, { rejectWithValue }) => {
    try {
      return await roleAccessService.fetchRoleAccessContext();
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getAccessibleBranches = createAsyncThunk(
  'roleAccess/getBranches',
  async (params = {}, { rejectWithValue }) => {
    try {
      return await roleAccessService.fetchAccessibleBranches(params);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getOperatingRoles = createAsyncThunk(
  'roleAccess/getRoles',
  async (branchId = null, { rejectWithValue }) => {
    try {
      return await roleAccessService.fetchOperatingRoles(branchId);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getRoleDetail = createAsyncThunk(
  'roleAccess/getRoleDetail',
  async ({ roleId, branchId = null }, { rejectWithValue }) => {
    try {
      return await roleAccessService.fetchRoleDetail(roleId, branchId);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createNewBranchRole = createAsyncThunk(
  'roleAccess/createRole',
  async (roleData, { rejectWithValue }) => {
    try {
      return await roleAccessService.createBranchRole(roleData);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updatePermissions = createAsyncThunk(
  'roleAccess/updatePermissions',
  async ({ roleId, permissionsData }, { rejectWithValue }) => {
    try {
      return await roleAccessService.updateRolePermissions(roleId, permissionsData);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateRoleStatus = createAsyncThunk(
  'roleAccess/updateRoleStatus',
  async ({ roleId, statusData }, { rejectWithValue }) => {
    try {
      return await roleAccessService.updateRoleStatus(roleId, statusData);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

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

const validationMessage = (payload, fallback) => {
  if (payload?.errors && Array.isArray(payload.errors)) {
    return `Validation failed - ${payload.errors.map((err) => `${err.field}: ${err.message}`).join(', ')}`;
  }
  return payload?.message || fallback;
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
        state.loading = true;
        state.error = null;
      })
      .addCase(getAccessibleBranches.fulfilled, (state, action) => {
        state.loading = false;
        state.accessibleBranches = action.payload.branches || action.payload;

        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(getAccessibleBranches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch accessible branches';
      })

      // Get operating roles
      .addCase(getOperatingRoles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOperatingRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.operatingRoles = action.payload;
      })
      .addCase(getOperatingRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch operating roles';
      })

      // Get role detail
      .addCase(getRoleDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRoleDetail.fulfilled, (state, action) => {
        state.loading = false;

        // Backend returns {branch, role, tabs}, transform to flat structure
        if (action.payload.role && action.payload.tabs) {
          state.selectedRole = {
            ...action.payload.role,
            tabs: action.payload.tabs,
            locked: action.payload.role.locked || false,
          };
        } else {
          state.selectedRole = action.payload;
        }
      })
      .addCase(getRoleDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch role detail';
      })

      // Create branch role
      .addCase(createNewBranchRole.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createNewBranchRole.fulfilled, (state, action) => {
        state.loading = false;

        // Backend returns {branch, role}, we need to add role to the roles array
        const newRole = action.payload.role || action.payload;

        // operatingRoles can be an object {branch, roles: []} or array
        if (state.operatingRoles && typeof state.operatingRoles === 'object' && state.operatingRoles.roles) {
          state.operatingRoles.roles.push(newRole);
        } else if (Array.isArray(state.operatingRoles)) {
          state.operatingRoles.push(newRole);
        }

        state.successMessage = action.payload.user
          ? 'Role and login created successfully'
          : 'Role created successfully';
      })
      .addCase(createNewBranchRole.rejected, (state, action) => {
        state.loading = false;
        state.error = validationMessage(action.payload, 'Failed to create role');
      })

      // Update role permissions
      .addCase(updatePermissions.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updatePermissions.fulfilled, (state, action) => {
        state.loading = false;

        // Backend returns {branch, role, tabAccess}, transform to match selectedRole structure
        if (action.payload.role && action.payload.tabAccess) {
          const tabs = action.payload.tabAccess.map((path) => ({ path, enabled: true }));
          state.selectedRole = {
            ...action.payload.role,
            tabs,
            locked: action.payload.role.locked || false,
          };
        } else {
          state.selectedRole = action.payload;
        }

        state.successMessage = 'Permissions updated successfully';
      })
      .addCase(updatePermissions.rejected, (state, action) => {
        state.loading = false;
        state.error = validationMessage(action.payload, 'Failed to update permissions');
      })

      // Update role status (activate/deactivate)
      .addCase(updateRoleStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateRoleStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updatedRole = action.payload.role || action.payload;

        const removeIfInactive = (roles) => roles.filter((role) => role.id !== updatedRole.id);

        if (state.operatingRoles && typeof state.operatingRoles === 'object' && state.operatingRoles.roles) {
          state.operatingRoles.roles = removeIfInactive(state.operatingRoles.roles);
        } else if (Array.isArray(state.operatingRoles)) {
          state.operatingRoles = removeIfInactive(state.operatingRoles);
        }

        if (state.selectedRole?.id === updatedRole.id) {
          state.selectedRole = null;
        }

        state.successMessage = 'Role deactivated successfully';
      })
      .addCase(updateRoleStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = validationMessage(action.payload, 'Failed to update role status');
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
