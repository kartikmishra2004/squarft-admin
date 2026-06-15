import { configureStore } from '@reduxjs/toolkit'
import { appReducer } from './appSlice'
import authReducer from './authSlice'
import dashboardReducer from './dashboardSlice'
import leadsReducer from './leadsSlice'
import clientsReducer from './clientsSlice'
import inventoryReducer from './inventorySlice'
import visitsReducer from './visitsSlice'
import dealsReducer from './dealsSlice'
import usersReducer from './usersSlice'
import tasksReducer from './tasksSlice'
import rolesReducer from './rolesSlice'
import branchesReducer from './branchesSlice'
import roleAccessReducer from './roleAccessSlice'

export const store = configureStore({
  reducer: {
    app: appReducer,
    auth: authReducer,
    dashboard: dashboardReducer,
    leads: leadsReducer,
    clients: clientsReducer,
    inventory: inventoryReducer,
    visits: visitsReducer,
    deals: dealsReducer,
    users: usersReducer,
    tasks: tasksReducer,
    roles: rolesReducer,
    branches: branchesReducer,
    roleAccess: roleAccessReducer,
  },
})
