import { configureStore } from '@reduxjs/toolkit'
import { appReducer } from './appSlice'
import authReducer from './authSlice'
import dashboardReducer from './dashboardSlice'

export const store = configureStore({
  reducer: {
    app: appReducer,
    auth: authReducer,
    dashboard: dashboardReducer,
  },
})
