import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "../../../components/Layout/Layout/Layout";
import {
  Search,
  Filter,
  Plus,
  Mail,
  Clock,
  Calendar,
  MoreVertical,
  Eye,
  Edit,
  User,
  Stethoscope,
  Shield,
  Users,
  UserPlus,
  UserCheck,
  UserX,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";

import type { Doctor } from "../../../types";

import { doctorService } from "../../../services/doctor";

const Doctors: React.FC = () => {
  const [staff, setStaff] = useState<Doctor[]>([]);
  const [filteredStaff, setFilteredStaff] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const { user } = useAuth();

  // Fetch doctors from API
  const fetchDoctors = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      const response = await doctorService.getDoctors(1, 100); // Get all doctors

      if (response.success) {
        setStaff(response.doctors);
      } else {
        throw new Error("Failed to fetch doctors");
      }
    } catch (err: any) {
      console.error("Error fetching doctors:", err);
      setError(err.response?.data?.message || "Failed to load medical staff");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  // Filter staff based on search and role
  useEffect(() => {
    let filtered = staff;

    if (searchTerm) {
      filtered = filtered.filter(
        (person) =>
          person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          person.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedRole !== "all") {
      filtered = filtered.filter((person) => person.role === selectedRole);
    }

    setFilteredStaff(filtered);
  }, [searchTerm, selectedRole, staff]);

  const handleRefresh = () => {
    fetchDoctors(true);
  };

  const handleDeleteDoctor = async (doctorId: string) => {
    if (!window.confirm("Are you sure you want to delete this staff member?")) {
      return;
    }

    try {
      await doctorService.deleteDoctor(doctorId);
      // Remove from local state
      setStaff((prev) => prev.filter((doctor) => doctor._id !== doctorId));
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete staff member");
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "doctor":
        return <Stethoscope className="w-4 h-4" />;
      case "nurse":
        return <UserCheck className="w-4 h-4" />;
      case "admin":
        return <Shield className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "doctor":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "nurse":
        return "bg-green-100 text-green-800 border-green-200";
      case "admin":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "doctor":
        return "Doctor";
      case "nurse":
        return "Nurse";
      case "admin":
        return "Administrator";
      default:
        return "Staff";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getTimeAgo = (dateString: string) => {
    if (!dateString) return "Never";

    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return formatDate(dateString);
  };

  if (isLoading && !isRefreshing) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading medical staff...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
        <div className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-9xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-4">
                    <h1 className="text-3xl font-bold text-gray-900">
                      Medical Staff
                    </h1>
                    <button
                      onClick={handleRefresh}
                      disabled={isRefreshing}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors disabled:opacity-50"
                      title="Refresh data"
                    >
                      <RefreshCw
                        className={`w-5 h-5 ${
                          isRefreshing ? "animate-spin" : ""
                        }`}
                      />
                    </button>
                  </div>
                  <p className="text-gray-600 mt-2">
                    Manage and view all healthcare professionals
                  </p>
                </div>
                {user?.role === "admin" && (
                  <Link
                    to="/staff/add"
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Staff Member
                  </Link>
                )}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
                  <span className="text-red-800">{error}</span>
                  <button
                    onClick={handleRefresh}
                    className="ml-auto text-sm text-red-800 hover:text-red-900 underline"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Staff
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {staff.length}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Doctors</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {staff.filter((s) => s.role === "doctor").length}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <Stethoscope className="w-5 h-5 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Nurses</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {staff.filter((s) => s.role === "nurse").length}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                    <UserCheck className="w-5 h-5 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Active Today
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {
                        staff.filter((s) => {
                          const lastActive = new Date(s.createdAt); // Using createdAt as fallback
                          const today = new Date();
                          return (
                            lastActive.toDateString() === today.toDateString()
                          );
                        }).length
                      }
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                    <UserPlus className="w-5 h-5 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex-1 w-full sm:max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="flex gap-4 w-full sm:w-auto">
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Roles</option>
                    <option value="doctor">Doctors</option>
                    <option value="nurse">Nurses</option>
              
                  </select>

                  <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Filter className="w-4 h-4 mr-2" />
                    More Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Staff Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStaff.map((person) => (
                <div
                  key={person._id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {person.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {person.name}
                        </h3>
                        <div
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getRoleColor(
                            person.role
                          )} mt-1`}
                        >
                          {getRoleIcon(person.role)}
                          <span className="ml-1">
                            {getRoleBadge(person.role)}
                          </span>
                        </div>
                      </div>
                    </div>
                    {user?.role === "admin" && (
                      <div className="relative">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <MoreVertical className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="w-4 h-4 mr-2" />
                      <span className="truncate">{person.email}</span>
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>Joined {formatDate(person.createdAt)}</span>
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>Active {getTimeAgo(person.createdAt)}</span>
                    </div>

                    {person.patientCount !== undefined && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="w-4 h-4 mr-2" />
                        <span>
                          {person.patientCount.toLocaleString()} patients
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex space-x-2">
                      <Link
                        to={`/staff/${person._id}`}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      {user?.role === "admin" && (
                        <>
                          <Link
                            to={`/staff/edit/${person._id}`}
                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDeleteDoctor(person._id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <UserX className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                    <a
                      href={`mailto:${person.email}`}
                      className="flex items-center px-3 py-1.5 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <Mail className="w-3 h-3 mr-1" />
                      Contact
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {filteredStaff.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <UserX className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {staff.length === 0
                    ? "No staff members yet"
                    : "No staff members found"}
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || selectedRole !== "all"
                    ? "Try adjusting your search criteria or filters."
                    : "Get started by adding your first staff member."}
                </p>
                {user?.role === "admin" && (
                  <Link
                    to="/staff/add"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Staff Member
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Doctors;
