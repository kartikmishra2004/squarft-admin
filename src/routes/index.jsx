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
import UserAppActivities from '../pages/dashboard/UserAppActivities';
import PanelOverview from '../pages/dashboard/PanelOverview';
import Support from '../pages/dashboard/Support';
import SettingsPage from '../pages/dashboard/Settings';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, role } = useSelector((state) => state.auth);
  
  if (!isAuthenticated) return <Navigate to="/auth/login" replace />;
  
  // Use role from auth state (stored separately) instead of user.role
  const userRole = role || user?.role;
  
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

const DashboardRedirect = () => {
  const { user, role } = useSelector((state) => state.auth);
  
  // Use role from auth state (stored separately) instead of user.role
  const userRole = role || user?.role;
  
  if (userRole === 'super_admin') {
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
        <Route path="admin" element={
          <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
            <Home />
          </ProtectedRoute>
        } />
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
        <Route path="user-app-activities" element={<UserAppActivities />} />
        <Route path="panel-overview" element={
          <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
            <PanelOverview />
          </ProtectedRoute>
        } />
        <Route path="support" element={
          <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
            <Support />
          </ProtectedRoute>
        } />
      </Route>

      {/* Default Redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
