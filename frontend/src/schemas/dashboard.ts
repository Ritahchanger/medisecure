import { z } from "zod";

// Dashboard Stats Schema
export const dashboardStatsSchema = z.object({
  totalPatients: z.number().min(0),
  recentPatients: z.number().min(0),
  activeStaff: z.number().min(0),
  criticalCases: z.number().min(0),
});

export type DashboardStats = z.infer<typeof dashboardStatsSchema>;

// Recent Activity Schema
export const recentActivitySchema = z.object({
  id: z.string().uuid(),
  action: z.string().min(1),
  user: z.string().min(1),
  patient: z.string().min(1),
  timestamp: z.string().min(1),
  type: z.enum(["success", "warning", "info", "error"]),
});

export type RecentActivity = z.infer<typeof recentActivitySchema>;

// Dashboard Data Schema
export const dashboardDataSchema = z.object({
  stats: dashboardStatsSchema,
  recentActivity: z.array(recentActivitySchema),
  lastUpdated: z.string().datetime(),
});

export type DashboardData = z.infer<typeof dashboardDataSchema>;

// Quick Action Schema
export const quickActionSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  description: z.string().min(1),
  icon: z.string().min(1),
  path: z.string().min(1),
  color: z.string().min(1),
});

export type QuickAction = z.infer<typeof quickActionSchema>;
