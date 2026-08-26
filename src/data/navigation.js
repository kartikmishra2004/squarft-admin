import {
  Activity,
  BellRing,
  BadgeIndianRupee,
  Briefcase,
  Building2,
  CalendarDays,
  ClipboardList,
  CreditCard,
  Filter,
  FileCheck,
  GitBranch,
  Headphones,
  LayoutDashboard,
  PanelsTopLeft,
  ShieldCheck,
  UserCheck,
  UserCog,
  UserPlus,
} from 'lucide-react';

export const superAdminLinks = [
  { icon: LayoutDashboard, label: 'Super Admin Dashboard', path: '/dashboard' },
  { icon: GitBranch, label: 'Branch management', path: '/dashboard/branches' },
  { icon: UserCog, label: 'Admins', path: '/dashboard/admins' },
  { icon: ClipboardList, label: 'Audit Log', path: '/dashboard/audit-log' },
];

export const adminLinks = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: ShieldCheck, label: 'Role and Access', path: '/dashboard/roles' },
  { icon: Filter, label: 'Leads Pipeline', path: '/dashboard/leads' },
  { icon: UserCheck, label: 'Clients Hub', path: '/dashboard/clients' },
  { icon: Building2, label: 'Project Inventory', path: '/dashboard/inventory' },
  { icon: CalendarDays, label: 'Upcoming Visits', path: '/dashboard/visits' },
  { icon: Briefcase, label: 'Deal Management', path: '/dashboard/deals' },
  { icon: CreditCard, label: 'Payment Milestones', path: '/dashboard/payment-milestones' },
  { icon: UserPlus, label: 'App user list', path: '/dashboard/users' },
  { icon: FileCheck, label: 'Consumer ID Verification', path: '/dashboard/user-verification' },
  { icon: Activity, label: 'App activity', path: '/dashboard/user-app-activities' },
  { icon: PanelsTopLeft, label: 'Panel Overview', path: '/dashboard/panel-overview' },
  { icon: BadgeIndianRupee, label: 'Broker', path: '/dashboard/broker-commission' },
  { icon: BellRing, label: 'Custom Notifications', path: '/dashboard/notifications' },
  { icon: Headphones, label: 'Support Center', path: '/dashboard/support' },
];

export const dashboardAccessTabs = [
  ...superAdminLinks,
  { ...adminLinks[0], label: 'Admin Dashboard', path: '/dashboard/admin' },
  ...adminLinks.slice(1),
];

// Paths the backend Roles & Access module actually knows about (see
// squarFT_backend/src/constants/roleAccessConstants.js DASHBOARD_TABS).
// dashboardAccessTabs above also includes app pages (Payment Milestones,
// Consumer ID Verification, Broker, Custom Notifications, Admins, Audit
// Log) the backend has no permission_code for yet - toggling those does
// nothing server-side, so they're excluded from the Roles & Access grid.
export const ROLE_ACCESS_CATALOG_PATHS = new Set([
  '/dashboard',
  '/dashboard/branches',
  '/dashboard/admin',
  '/dashboard/roles',
  '/dashboard/leads',
  '/dashboard/clients',
  '/dashboard/inventory',
  '/dashboard/visits',
  '/dashboard/deals',
  '/dashboard/users',
  '/dashboard/user-app-activities',
  '/dashboard/panel-overview',
  '/dashboard/support',
]);

// Never shown as a toggle in the Roles & Access grid:
// - Branch Management is Super Admin-only. A branch's Admin/Manager role
//   can never be granted it (the backend rejects it outright for any
//   branch-scoped role), and branch admins can't create further branches,
//   so it never belongs in a branch-level permission grid.
// - Roles & Access is always granted in full to a branch's designated
//   Admin/Manager role and is never grantable to any other branch role
//   (see roleAccessService.applyRolePermissionEntries on the backend) - it
//   isn't a toggle, it's a fixed capability of that one role.
const ROLE_ACCESS_NON_TOGGLEABLE_PATHS = new Set(['/dashboard/branches', '/dashboard/roles']);

export const roleAccessToggleTabs = dashboardAccessTabs.filter(
  (tab) => ROLE_ACCESS_CATALOG_PATHS.has(tab.path) && !ROLE_ACCESS_NON_TOGGLEABLE_PATHS.has(tab.path)
);
