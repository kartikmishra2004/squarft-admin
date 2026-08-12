import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  LogOut,
} from 'lucide-react';
import { logout } from '../store/authSlice';
import logo from '../assets/logo.png';
import { adminLinks, superAdminLinks } from '../data/navigation';

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
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/auth/login');
  };

  // QA_REQUIREMENTS_SPEC.md Part F item 1: Super Admin must not access the
  // plain Admin Dashboard (Home.jsx / '/dashboard/admin'). Previously this
  // spread in an "Admin Dashboard" link pointing at that route for
  // super_admin, which the route guard now also blocks (see
  // src/routes/index.jsx) — removed here too so the sidebar doesn't offer a
  // link that leads to Access Denied.
  const links = user?.role === 'super_admin'
    ? [...superAdminLinks, ...adminLinks.slice(1)]
    : adminLinks;

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
          <div className="w-9 h-9 rounded-lg bg-brand/10 flex items-center justify-center text-brand font-bold text-sm">
            {user?.first_name?.charAt(0) || user?.name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-[13px] font-bold text-gray-800 truncate">
              {user?.first_name && user?.last_name 
                ? `${user.first_name} ${user.last_name}` 
                : user?.name || 'User'}
            </p>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              {user?.role === 'super_admin' ? 'Super Admin' : 'Admin'}
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
