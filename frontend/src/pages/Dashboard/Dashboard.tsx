import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  dashboardStatsSchema,
  recentActivitySchema,
  type DashboardStats,
  type RecentActivity,
} from "../../schemas/dashboard";
import { z } from "zod";

import Layout from "../../components/Layout/Layout/Layout";
import {
  Users,
  UserPlus,
  Activity,
  AlertTriangle,
  CheckCircle,
  FileText,
  Stethoscope,
  Calendar,
  BarChart3,
  Clock,
  ArrowUpRight,
  TrendingUp,
  Eye,
  Download,
} from "lucide-react";

import { mockStats, mockRecentActivity, quickActions } from "./data";

import { useAuth } from "../../contexts/AuthContext";

import { useRoleAccess } from "../../hooks/useRoleAccess";

import AuthLog from "./AuthLogs/AuthLog";

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const { hasAnyRole } = useRoleAccess();

  const [visibleActions] = useState(
    quickActions.filter((action) => hasAnyRole(action.allowedRoles))
  );

  const validateData = () => {
    try {
      const validatedStats = dashboardStatsSchema.parse(mockStats);
      const validatedActivity = z
        .array(recentActivitySchema)
        .parse(mockRecentActivity);

      setStats(validatedStats);
      setRecentActivity(validatedActivity);
    } catch (error) {
      console.error("Data validation failed:", error);
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      validateData();
      setIsLoading(false);
    };

    fetchDashboardData();
  }, []);

  const getTypeColor = (type: string) => {
    switch (type) {
      case "success":
        return "text-emerald-600 bg-emerald-50 border-emerald-100";
      case "warning":
        return "text-amber-600 bg-amber-50 border-amber-100";
      case "error":
        return "text-rose-600 bg-rose-50 border-rose-100";
      default:
        return "text-blue-600 bg-blue-50 border-blue-100";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-4 h-4" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4" />;
      case "error":
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case "blue":
        return "bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-blue-200/50";
      case "green":
        return "bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-emerald-200/50";
      case "purple":
        return "bg-gradient-to-br from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 shadow-violet-200/50";
      case "orange":
        return "bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-amber-200/50";
      default:
        return "bg-gradient-to-br from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 shadow-slate-200/50";
    }
  };

  const getRoleBasedGreeting = () => {
    const hour = new Date().getHours();
    let timeGreeting = "Good morning";

    if (hour >= 12 && hour < 17) timeGreeting = "Good afternoon";
    if (hour >= 17) timeGreeting = "Good evening";

    const roleGreeting =
      user?.role === "admin"
        ? "Administrator"
        : user?.role === "doctor"
        ? "Doctor"
        : "Nurse";

    return `${timeGreeting}, ${roleGreeting} ${user?.name?.split(" ")[0]}`;
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
        {/* Main Content */}
        <div className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-9xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {getRoleBasedGreeting()}
                  </h1>
                  <p className="text-gray-600 mt-2">
                    Here's your clinical overview for today
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Download className="w-4 h-4 mr-2" />
                    Export Report
                  </button>
                  <button className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                    <Eye className="w-4 h-4 mr-2" />
                    Quick View
                  </button>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Total Patients Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200 group">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                        Total Patients
                      </p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">
                        {stats.totalPatients.toLocaleString()}
                      </p>
                      <div className="flex items-center mt-3">
                        <TrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
                        <span className="text-sm font-medium text-emerald-600">
                          +12.5%
                        </span>
                        <span className="text-sm text-gray-500 ml-2">
                          from last month
                        </span>
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </div>

                {/* New This Week Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200 group">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                        New Admissions
                      </p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">
                        {stats.recentPatients}
                      </p>
                      <p className="text-sm text-gray-500 mt-3">
                        This week • All departments
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                      <UserPlus className="w-6 h-6 text-emerald-600" />
                    </div>
                  </div>
                </div>

                {/* Active Staff Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200 group">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                        Medical Staff
                      </p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">
                        {stats.activeStaff}
                      </p>
                      <p className="text-sm text-gray-500 mt-3">
                        Active • Across facility
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-violet-50 rounded-xl flex items-center justify-center group-hover:bg-violet-100 transition-colors">
                      <Stethoscope className="w-6 h-6 text-violet-600" />
                    </div>
                  </div>
                </div>

                {/* Critical Cases Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200 group">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                        Critical Care
                      </p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">
                        {stats.criticalCases}
                      </p>
                      <div className="flex items-center mt-3">
                        <AlertTriangle className="w-4 h-4 text-rose-500 mr-1" />
                        <span className="text-sm font-medium text-rose-600">
                          Requires attention
                        </span>
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center group-hover:bg-rose-100 transition-colors">
                      <Activity className="w-6 h-6 text-rose-600" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Quick Actions */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        Clinical Actions
                      </h2>
                      <p className="text-sm text-gray-600 mt-1">
                        Quick access to essential functions
                      </p>
                    </div>
                    <BarChart3 className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {visibleActions.map((action: any) => (
                      <Link
                        key={action.id}
                        to={action.path}
                        className={`p-4 rounded-xl text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] ${getColorClasses(
                          action.color
                        )}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mr-3 backdrop-blur-sm">
                              {action.icon ===
                                "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" && (
                                <UserPlus className="w-5 h-5" />
                              )}
                              {action.icon ===
                                "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" && (
                                <FileText className="w-5 h-5" />
                              )}
                              {action.icon ===
                                "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" && (
                                <Calendar className="w-5 h-5" />
                              )}
                              {action.icon ===
                                "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" && (
                                <BarChart3 className="w-5 h-5" />
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-white">
                                {action.title}
                              </p>
                              <p className="text-sm text-white/90 mt-1">
                                {action.description}
                              </p>
                            </div>
                          </div>
                          <ArrowUpRight className="w-5 h-5 text-white/80" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        Activity Log
                      </h2>
                      <p className="text-sm text-gray-600 mt-1">
                        Recent system activities
                      </p>
                    </div>
                    <Clock className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="space-y-3">
                    {recentActivity.map((activity) => (
                      <div
                        key={activity.id}
                        className={`p-3 rounded-lg border transition-all duration-200 hover:shadow-sm ${getTypeColor(
                          activity.type
                        )}`}
                      >
                        <div className="flex items-start">
                          <div className="mt-0.5 flex-shrink-0">
                            {getTypeIcon(activity.type)}
                          </div>
                          <div className="ml-3 flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {activity.action}
                            </p>
                            <p className="text-xs text-gray-600 mt-1 truncate">
                              {activity.user} • {activity.patient}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {activity.timestamp}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* System Status */}
            {/* <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    System Compliance
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Security and compliance status
                  </p>
                </div>
                <Shield className="w-5 h-5 text-gray-400" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mr-3 flex-shrink-0" />
                  <div>
                    <span className="text-sm font-medium text-emerald-800">
                      Systems Operational
                    </span>
                    <p className="text-xs text-emerald-600 mt-1">
                      All services running
                    </p>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <Shield className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" />
                  <div>
                    <span className="text-sm font-medium text-blue-800">
                      Data Secured
                    </span>
                    <p className="text-xs text-blue-600 mt-1">
                      AES-256 encrypted
                    </p>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mr-3 flex-shrink-0" />
                  <div>
                    <span className="text-sm font-medium text-emerald-800">
                      HIPAA Compliant
                    </span>
                    <p className="text-xs text-emerald-600 mt-1">Audit ready</p>
                  </div>
                </div>
              </div>
            </div> */}

            {hasAnyRole(["admin"]) && (
              <div className="mb-6 mt-[3rem]">
                <h1 className="text-3xl font-bold text-gray-900">
                  Security Dashboard
                </h1>
                <p className="text-gray-600 mt-2">
                  Monitor and review authentication activities
                </p>
                <AuthLog />
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
