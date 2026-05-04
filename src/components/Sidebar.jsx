import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  ShieldCheck,
  GitBranch,
  Filter,
  UserCheck,
  Building2,
  CalendarDays,
  Briefcase,
  UserPlus,
  ClipboardList
} from 'lucide-react';
import { logout } from '../store/authSlice';
import logo from '../assets/logo.png';

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

  const superAdminLinks = [
    { icon: LayoutDashboard, label: 'Super Admin Dashboard', path: '/dashboard' },
    { icon: ShieldCheck, label: 'Role and Access', path: '/dashboard/roles' },
    { icon: GitBranch, label: 'Branch management', path: '/dashboard/branches' },
    { icon: Filter, label: 'Leads Pipeline', path: '/dashboard/leads' },
    { icon: UserCheck, label: 'Clients Hub', path: '/dashboard/clients' },
    { icon: Building2, label: 'Project Inventory', path: '/dashboard/inventory' },
    { icon: CalendarDays, label: 'Upcoming Visits', path: '/dashboard/visits' },
    { icon: Briefcase, label: 'Deal Management', path: '/dashboard/deals' },
    { icon: UserPlus, label: 'User List', path: '/dashboard/users' },
    { icon: ClipboardList, label: 'Task Management', path: '/dashboard/tasks' },
  ];

  const adminLinks = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: ShieldCheck, label: 'Role and Access', path: '/dashboard/roles' },
    { icon: Filter, label: 'Leads Pipeline', path: '/dashboard/leads' },
    { icon: UserCheck, label: 'Clients Hub', path: '/dashboard/clients' },
    { icon: Building2, label: 'Project Inventory', path: '/dashboard/inventory' },
    { icon: CalendarDays, label: 'Upcoming Visits', path: '/dashboard/visits' },
    { icon: Briefcase, label: 'Deal Management', path: '/dashboard/deals' },
    { icon: UserPlus, label: 'User List', path: '/dashboard/users' },
    { icon: ClipboardList, label: 'Task Management', path: '/dashboard/tasks' },
    { icon: ClipboardList, label: 'Customer Requirements', path: '/dashboard/requirements' },
  ];

  const links = user?.role === 'super_admin' ? superAdminLinks : adminLinks;

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
            {user?.name?.charAt(0)}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-[13px] font-bold text-gray-800 truncate">{user?.name}</p>
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
