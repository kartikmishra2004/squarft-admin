import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AppLayout from '../layouts/AppLayout';
import Login from '../pages/auth/Login';
import Home from '../pages/dashboard/Home';
import SuperHome from '../pages/dashboard/SuperHome';
import Roles from '../pages/dashboard/Roles';
import Branches from '../pages/dashboard/Branches';
import Leads from '../pages/dashboard/Leads';
import Clients from '../pages/dashboard/Clients';
import Inventory from '../pages/dashboard/Inventory';
import Visits from '../pages/dashboard/Visits';
import Deals from '../pages/dashboard/Deals';
import UserList from '../pages/dashboard/UserList';
import Tasks from '../pages/dashboard/Tasks';
import Requirements from '../pages/dashboard/Requirements';
import SettingsPage from '../pages/dashboard/Settings';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  if (!isAuthenticated) return <Navigate to="/auth/login" replace />;
  
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

const DashboardRedirect = () => {
  const { user } = useSelector((state) => state.auth);
  
  if (user?.role === 'super_admin') {
    return <SuperHome />;
  }
  
  return <Home />;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/auth">
        <Route 
          path="login" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />
        <Route path="" element={<Navigate to="login" replace />} />
      </Route>

      {/* Protected Dashboard Routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardRedirect />} />
        
        {/* Shared Pages */}
        <Route path="roles" element={<Roles />} />
        <Route path="settings" element={<SettingsPage />} />

        {/* Super Admin Specific */}
        <Route path="branches" element={
          <ProtectedRoute allowedRoles={['super_admin']}>
            <Branches />
          </ProtectedRoute>
        } />

        {/* Admin Specific */}
        <Route path="leads" element={<Leads />} />
        <Route path="clients" element={<Clients />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="visits" element={<Visits />} />
        <Route path="deals" element={<Deals />} />
        <Route path="users" element={<UserList />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="requirements" element={<Requirements />} />
      </Route>

      {/* Default Redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
