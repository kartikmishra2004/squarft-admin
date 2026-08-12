import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldAlert } from 'lucide-react';
import Button from '../../components/Button';

/**
 * Rendered by ProtectedRoute (src/routes/index.jsx) instead of a silent
 * redirect when an authenticated user's role is not in a route's
 * `allowedRoles` list — e.g. an `admin` typing the URL for a super-admin-only
 * page (`/dashboard/branches`, `/dashboard/audit-log`, `/dashboard/admins`)
 * or a `super_admin` navigating to the plain admin dashboard
 * (`/dashboard/admin`). See QA_REQUIREMENTS_SPEC.md Part F item 1.
 */
const AccessDenied = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 px-4">
      <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center text-rose-500 mb-4">
        <ShieldAlert size={40} />
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Access Denied</h1>
        <p className="text-gray-500 max-w-sm mx-auto font-medium">
          You don't have permission to view this page with your current role. If you believe this
          is a mistake, contact your Super Admin.
        </p>
      </div>

      <div className="pt-4 flex gap-3">
        <Button variant="outline" icon={ArrowLeft} onClick={() => navigate(-1)}>
          Go Back
        </Button>
        <Button onClick={() => navigate('/dashboard')}>
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default AccessDenied;
