import { createSlice } from '@reduxjs/toolkit';
import { dashboardAccessTabs } from '../data/navigation';

const STORAGE_KEY = 'squarft-role-access-policies';
const SUPER_ADMIN_ID = 'super_admin';

const getAllTabPaths = () => dashboardAccessTabs.map((tab) => tab.path);

const createDefaultRolesForBranch = () => [
    {
        id: SUPER_ADMIN_ID,
        name: 'Super Admin',
        description: 'Full platform owner access',
        tabAccess: getAllTabPaths(),
        locked: true,
    },
    {
        id: 'branch_manager',
        name: 'Branch Manager',
        description: 'Manage operations for this branch',
        tabAccess: [
            '/dashboard',
            '/dashboard/roles',
            '/dashboard/leads',
            '/dashboard/clients',
            '/dashboard/inventory',
            '/dashboard/visits',
            '/dashboard/deals',
            '/dashboard/users',
            '/dashboard/support',
            '/dashboard/panel-overview'
        ],
        locked: false,
    },
    {
        id: 'sales_officer',
        name: 'Sales Officer',
        description: 'Manage leads, clients and deals within the branch',
        tabAccess: [
            '/dashboard',
            '/dashboard/leads',
            '/dashboard/clients',
            '/dashboard/inventory',
            '/dashboard/visits',
            '/dashboard/deals'
        ],
        locked: false,
    },
    {
        id: 'broker',
        name: 'Broker',
        description: 'View property inventory and refer new clients',
        tabAccess: [
            '/dashboard',
            '/dashboard/inventory',
            '/dashboard/leads'
        ],
        locked: false,
    },
    {
        id: 'field_officer',
        name: 'Field Officer',
        description: 'Conduct site visits and field task verification',
        tabAccess: [
            '/dashboard/visits',
            '/dashboard/inventory'
        ],
        locked: false,
    }
];

const initialState = {
    roles: [],
    loading: false,
    error: null,
    saveSuccess: false,
};

const rolesSlice = createSlice({
    name: 'roles',
    initialState,
    reducers: {
        fetchRolesStart: (state) => {
            state.loading = true;
            state.error = null;
            state.saveSuccess = false;
        },
        fetchRolesSuccess: (state, action) => {
            state.loading = false;
            state.roles = action.payload;
        },
        fetchRolesFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        saveRolesStart: (state) => {
            state.loading = true;
            state.saveSuccess = false;
        },
        saveRolesSuccess: (state, action) => {
            state.loading = false;
            state.saveSuccess = true;
            state.roles = action.payload;
        },
        saveRolesFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        clearSaveSuccess: (state) => {
            state.saveSuccess = false;
        }
    }
});

export const {
    fetchRolesStart,
    fetchRolesSuccess,
    fetchRolesFailure,
    saveRolesStart,
    saveRolesSuccess,
    saveRolesFailure,
    clearSaveSuccess
} = rolesSlice.actions;

// Simulated async thunks - API Integration points
export const fetchRoles = (branchId) => (dispatch) => {
    dispatch(fetchRolesStart());
    try {
        const saved = JSON.parse(localStorage.getItem(`${STORAGE_KEY}-${branchId}`));
        let branchRoles;
        if (!Array.isArray(saved) || saved.length === 0) {
            branchRoles = createDefaultRolesForBranch();
        } else {
            const hasSuperAdmin = saved.some(role => role.id === SUPER_ADMIN_ID);
            branchRoles = hasSuperAdmin ? saved : [createDefaultRolesForBranch()[0], ...saved];
        }
        // Simulating immediate response, can be turned into fetch/axios easily
        dispatch(fetchRolesSuccess(branchRoles));
    } catch (err) {
        dispatch(fetchRolesFailure(err.message || 'Failed to fetch roles'));
    }
};

export const saveRoles = (branchId, roles) => (dispatch) => {
    dispatch(saveRolesStart());
    try {
        localStorage.setItem(`${STORAGE_KEY}-${branchId}`, JSON.stringify(roles));
        dispatch(saveRolesSuccess(roles));
    } catch (err) {
        dispatch(saveRolesFailure(err.message || 'Failed to save roles'));
    }
};

export default rolesSlice.reducer;
