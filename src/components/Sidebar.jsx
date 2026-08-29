import { useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  LogOut,
} from 'lucide-react';
import { logout } from '../store/authSlice';
import logo from '../assets/logo.png';
import { adminLinks, superAdminLinks, ROLE_ACCESS_CATALOG_PATHS } from '../data/navigation';
import Avatar from './ui/Avatar';

const SidebarItem = ({ icon: Icon, label, active = false, onClick }) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl cursor-pointer transition-all ${active
      ? 'bg-brand text-white shadow-md shadow-brand/20'
      : 'text-gray-500 hover:bg-brand/10 hover:text-brand'
      }`}
  >
    <Icon size={19} />
    <span className="font-bold text-[12.5px] whitespace-nowrap">{label}</span>
  </div>
);

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);
  const { myEffectiveAccess } = useSelector((state) => state.roleAccess);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/auth/login');
  };

  const isSuperAdmin = user?.role === 'super_admin';

  // myEffectiveAccess.currentUser (GET /api/admin/role-access/me, fetched
  // once per session below) always reflects the account's current
  // name/email - state.auth.user is only a snapshot taken at login, so it
  // goes stale the moment someone edits their own profile.
  const currentUser = myEffectiveAccess?.currentUser;
  const displayName = currentUser?.name
    || (user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : user?.first_name)
    || user?.name
    || 'User';
  const avatarUrl = currentUser?.avatarUrl || user?.avatar_url || null;

  // Source of truth for what a branch-level admin can see - see
  // docs/frontend-roles-access-handoff.md "Sidebar Mapping". Super Admin
  // always sees the full static list (their access is never restricted).
  // A page whose path isn't in ROLE_ACCESS_CATALOG_PATHS has no permission
  // model yet on the backend, so it stays always-visible rather than being
  // hidden by a check that can never grant it back.
  const allowedPaths = useMemo(() => {
    if (!myEffectiveAccess?.tabAccess) return null;
    return new Set(myEffectiveAccess.tabAccess.map((tab) => tab.path));
  }, [myEffectiveAccess]);

  // QA_REQUIREMENTS_SPEC.md Part F item 1: Super Admin must not access the
  // plain Admin Dashboard (Home.jsx / '/dashboard/admin'). Previously this
  // spread in an "Admin Dashboard" link pointing at that route for
  // super_admin, which the route guard now also blocks (see
  // src/routes/index.jsx) — removed here too so the sidebar doesn't offer a
  // link that leads to Access Denied.
  const links = isSuperAdmin
    ? [...superAdminLinks, ...adminLinks.slice(1)]
    : adminLinks.filter((item) => {
        if (item.path === '/dashboard') return true;
        if (!ROLE_ACCESS_CATALOG_PATHS.has(item.path)) return true;
        // Fail closed while access hasn't loaded yet, rather than flashing
        // every gated link and then hiding most of them a moment later.
        if (!allowedPaths) return false;
        return allowedPaths.has(item.path);
      });

  return (
    <aside className="w-72 bg-white border-r border-gray-100 p-5 flex-col hidden lg:flex fixed h-full z-20 shadow-sm overflow-y-auto custom-scrollbar">
      <div className="flex items-center gap-2.5 mb-10 px-2 shrink-0">
        <img src={logo} alt="Squar Ft" className="h-7 w-auto" />
        <span className="font-bold text-xl tracking-tight text-gray-800 uppercase">Squar Ft</span>
      </div>

      <nav className="space-y-1.5 flex-1">
        {links.map((item) => (
          <SidebarItem
            key={item.path}
            icon={item.icon}
            label={item.label}
            active={location.pathname === item.path}
            onClick={() => navigate(item.path)}
          />
        ))}
      </nav>

      <div className="pt-5 mt-5 border-t border-gray-100 shrink-0">
        <div className="flex items-center gap-2.5 px-3 py-2.5 mb-3 bg-gray-50 rounded-xl border border-gray-100">
          <Avatar
            src={avatarUrl}
            name={displayName}
            className="w-9 h-9 rounded-full bg-brand/10 text-brand font-bold text-sm"
          />
          <div className="flex-1 overflow-hidden">
            <p className="text-[13px] font-bold text-gray-800 truncate">
              {displayName}
            </p>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              {(currentUser?.role || user?.role) === 'super_admin' ? 'Super Admin' : 'Admin'}
            </p>
          </div>
        </div>
        <div
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer text-rose-500 hover:bg-rose-50 transition-all"
        >
          <LogOut size={18} />
          <span className="font-bold text-[13px]">Logout</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
