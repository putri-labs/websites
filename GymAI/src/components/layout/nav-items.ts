import type { UserRole } from "@/stores/auth-store";

export interface NavItem {
  label: string;
  href: string;
  icon: string; // Lucide icon name — resolved in Sidebar component
}

const ADMIN_NAV: NavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: "LayoutDashboard" },
  { label: "Register Member", href: "/admin/members/new", icon: "UserPlus" },
  { label: "Members", href: "/admin/members", icon: "Users" },
  { label: "Plans", href: "/admin/plans", icon: "BookOpen" },
  { label: "Payments", href: "/admin/payments", icon: "CreditCard" },
  { label: "Collect Payment", href: "/admin/payments/new", icon: "CreditCard" },
  { label: "Invoices", href: "/admin/invoices", icon: "BookOpen" },
  { label: "Visitors", href: "/admin/visitors", icon: "ClipboardList" },
  { label: "Discounts", href: "/admin/discounts", icon: "Tag" },
  { label: "Expiring Soon", href: "/admin/members/expiring", icon: "AlertTriangle" },
  { label: "Live Feed", href: "/admin/checkins", icon: "Radio" },
  { label: "Manual Check-In", href: "/admin/checkins/manual", icon: "ScanLine" },
  { label: "Analytics", href: "/admin/analytics", icon: "BarChart3" },
  { label: "Revenue Charts", href: "/admin/analytics/revenue", icon: "TrendingUp" },
  { label: "Attendance Heatmap", href: "/admin/analytics/attendance", icon: "Grid3x3" },
  { label: "Reports", href: "/admin/reports", icon: "FileText" },
  { label: "Tasks", href: "/admin/tasks", icon: "CheckSquare" },
  { label: "Staff", href: "/admin/staff", icon: "UserCog" },
  { label: "Devices", href: "/admin/devices", icon: "Fingerprint" },
  { label: "Branches", href: "/admin/branches", icon: "Building2" },
  { label: "Settings", href: "/admin/settings", icon: "Settings" },
];

const MANAGER_NAV: NavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: "LayoutDashboard" },
  { label: "Register Member", href: "/admin/members/new", icon: "UserPlus" },
  { label: "Members", href: "/admin/members", icon: "Users" },
  { label: "Plans", href: "/admin/plans", icon: "BookOpen" },
  { label: "Payments", href: "/admin/payments", icon: "CreditCard" },
  { label: "Expiring Soon", href: "/admin/members/expiring", icon: "AlertTriangle" },
  { label: "Live Feed", href: "/admin/checkins", icon: "Radio" },
  { label: "Manual Check-In", href: "/admin/checkins/manual", icon: "ScanLine" },
  { label: "Tasks", href: "/admin/tasks", icon: "CheckSquare" },
  { label: "Analytics", href: "/admin/analytics", icon: "BarChart3" },
  { label: "Revenue Charts", href: "/admin/analytics/revenue", icon: "TrendingUp" },
  { label: "Attendance Heatmap", href: "/admin/analytics/attendance", icon: "Grid3x3" },
  { label: "Reports", href: "/admin/reports", icon: "FileText" },
];

const TRAINER_NAV: NavItem[] = [
  { label: "Dashboard", href: "/trainer/dashboard", icon: "LayoutDashboard" },
  { label: "Clients", href: "/trainer/clients", icon: "Users" },
  { label: "Workouts", href: "/trainer/workouts", icon: "Dumbbell" },
  { label: "Diet Plans", href: "/trainer/diet", icon: "Apple" },
  { label: "Classes", href: "/trainer/classes", icon: "Calendar" },
];

const STAFF_NAV: NavItem[] = [
  { label: "Dashboard", href: "/staff/dashboard", icon: "LayoutDashboard" },
  { label: "Check-ins", href: "/staff/checkins", icon: "ScanLine" },
  { label: "Members", href: "/staff/members", icon: "Users" },
  { label: "Tasks", href: "/staff/tasks", icon: "CheckSquare" },
  { label: "Visitors", href: "/staff/visitors", icon: "UserPlus" },
];

const RECEPTIONIST_NAV: NavItem[] = [
  { label: "Dashboard", href: "/receptionist/dashboard", icon: "LayoutDashboard" },
  { label: "Register Member", href: "/receptionist/register", icon: "UserPlus" },
  { label: "Members", href: "/receptionist/members", icon: "Users" },
  { label: "Payments", href: "/receptionist/payments", icon: "CreditCard" },
  { label: "Visitor Log", href: "/receptionist/visitors", icon: "ClipboardList" },
];

const SUPER_ADMIN_NAV: NavItem[] = [
  { label: "Clients", href: "/admin/clients", icon: "Building2" },
  { label: "System", href: "/admin/system", icon: "Server" },
];

export const NAV_BY_ROLE: Record<UserRole, NavItem[]> = {
  super_admin: SUPER_ADMIN_NAV,
  admin: ADMIN_NAV,
  manager: MANAGER_NAV,
  trainer: TRAINER_NAV,
  staff: STAFF_NAV,
  receptionist: RECEPTIONIST_NAV,
};
