import {
  type DashboardStats,
  type RecentActivity,
  type QuickAction,
} from "../../schemas/dashboard";

import { useRoleAccess } from "../../hooks/useRoleAccess";

export const mockStats: DashboardStats = {
  totalPatients: 1247,
  recentPatients: 23,
  activeStaff: 42,
  criticalCases: 8,
};

export const mockRecentActivity: RecentActivity[] = [
  {
    id: "1",
    action: "New patient registered",
    user: "Dr. Sarah Wilson",
    patient: "John Doe",
    timestamp: "2 minutes ago",
    type: "success",
  },
  {
    id: "2",
    action: "Medical record updated",
    user: "Dr. Michael Chen",
    patient: "Emma Johnson",
    timestamp: "15 minutes ago",
    type: "info",
  },
  {
    id: "3",
    action: "Critical case flagged",
    user: "Nurse Emily Davis",
    patient: "Robert Brown",
    timestamp: "1 hour ago",
    type: "warning",
  },
  {
    id: "4",
    action: "Access denied - Unauthorized",
    user: "Unknown User",
    patient: "N/A",
    timestamp: "2 hours ago",
    type: "error",
  },
];

export const quickActions: QuickAction[] = [
  {
    id: "1",
    title: "Add Patient",
    description: "Register new patient",
    icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z",
    path: "/add-patient",
    color: "blue",
    allowedRoles: ["admin", "doctor"], // ✅ Admin & Doctor
  },
  {
    id: "2",
    title: "View Patients",
    description: "Browse all patients",
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
    path: "/patients",
    color: "green",
    allowedRoles: ["admin", "doctor", "nurse"], // ✅ Everyone
  },
  {
    id: "3",
    title: "Manage Doctors",
    description: "View, add, and manage all registered doctors",
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
    path: "/doctors",
    color: "green",
    allowedRoles: ["admin"], // ✅ Admin only
  },
  {
    id: "4",
    title: "Audit Logs",
    description: "View access history",
    icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    path: "/audit-logs",
    color: "purple",
    allowedRoles: ["admin"], // ✅ Admin only
  },
  {
    id: "5",
    title: "Reports",
    description: "Generate reports",
    icon: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    path: "/reports",
    color: "orange",
    allowedRoles: ["admin"], // ✅ Admin only
  },
];

const { hasAnyRole } = useRoleAccess();

export const visibleActions = quickActions.filter((action) =>
  hasAnyRole(action.allowedRoles as any)
);
