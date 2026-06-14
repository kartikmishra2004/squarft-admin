import {
  Activity,
  BellRing,
  BadgeIndianRupee,
  Briefcase,
  Building2,
  CalendarDays,
  CreditCard,
  Filter,
  GitBranch,
  Headphones,
  LayoutDashboard,
  PanelsTopLeft,
  ShieldCheck,
  UserCheck,
  UserPlus,
} from 'lucide-react';

export const superAdminLinks = [
  { icon: LayoutDashboard, label: 'Super Admin Dashboard', path: '/dashboard' },
  { icon: GitBranch, label: 'Branch management', path: '/dashboard/branches' },
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
  { icon: Activity, label: 'User app activities', path: '/dashboard/user-app-activities' },
  { icon: PanelsTopLeft, label: 'Panel Overview', path: '/dashboard/panel-overview' },
  { icon: BadgeIndianRupee, label: 'Broker Commission', path: '/dashboard/broker-commission' },
  { icon: BellRing, label: 'Custom Notifications', path: '/dashboard/notifications' },
  { icon: Headphones, label: 'Support Center', path: '/dashboard/support' },
];

export const dashboardAccessTabs = [
  ...superAdminLinks,
  { ...adminLinks[0], label: 'Admin Dashboard', path: '/dashboard/admin' },
  ...adminLinks.slice(1),
];
