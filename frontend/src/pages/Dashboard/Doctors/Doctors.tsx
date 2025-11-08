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
} from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";

interface MedicalStaff {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "doctor" | "nurse";
  createdAt: string;
  lastActive?: string;
  patientCount?: number;
}

const Doctors: React.FC = () => {
  const [staff, setStaff] = useState<MedicalStaff[]>([]);
  const [filteredStaff, setFilteredStaff] = useState<MedicalStaff[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const { user } = useAuth();

  // Mock data - replace with actual API call to get users
  useEffect(() => {
    const fetchMedicalStaff = async () => {
      setIsLoading(true);
      // Simulate API call - replace with: const response = await usersAPI.getAll();
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockStaff: MedicalStaff[] = [
        {
          _id: "1",
          name: "Dr. Sarah Chen",
          email: "sarah.chen@medicalcenter.com",
          role: "doctor",
          createdAt: "2022-03-15T00:00:00.000Z",
          lastActive: "2024-01-15T08:30:00.000Z",
          patientCount: 1247,
        },
        {
          _id: "2",
          name: "Dr. Michael Rodriguez",
          email: "m.rodriguez@medicalcenter.com",
          role: "doctor",
          createdAt: "2021-07-22T00:00:00.000Z",
          lastActive: "2024-01-15T09:15:00.000Z",
          patientCount: 892,
        },
        {
          _id: "3",
          name: "Emily Watson, RN",
          email: "e.watson@medicalcenter.com",
          role: "nurse",
          createdAt: "2020-11-08T00:00:00.000Z",
          lastActive: "2024-01-14T16:45:00.000Z",
          patientCount: 345,
        },
        {
          _id: "4",
          name: "Dr. James Kim",
          email: "j.kim@medicalcenter.com",
          role: "doctor",
          createdAt: "2023-01-30T00:00:00.000Z",
          lastActive: "2024-01-15T10:00:00.000Z",
          patientCount: 567,
        },
        {
          _id: "5",
          name: "Lisa Thompson, RN",
          email: "l.thompson@medicalcenter.com",
          role: "nurse",
          createdAt: "2022-09-14T00:00:00.000Z",
          lastActive: "2024-01-15T07:30:00.000Z",
          patientCount: 289,
        },
        {
          _id: "6",
          name: "Admin User",
          email: "admin@medicalcenter.com",
          role: "admin",
          createdAt: "2020-05-10T00:00:00.000Z",
          lastActive: "2024-01-15T08:00:00.000Z",
        },
        {
          _id: "7",
          name: "Dr. Robert Johnson",
          email: "r.johnson@medicalcenter.com",
          role: "doctor",
          createdAt: "2021-12-01T00:00:00.000Z",
          lastActive: "2024-01-14T17:20:00.000Z",
          patientCount: 1023,
        },
        {
          _id: "8",
          name: "Maria Garcia, RN",
          email: "m.garcia@medicalcenter.com",
          role: "nurse",
          createdAt: "2023-03-20T00:00:00.000Z",
          lastActive: "2024-01-15T11:45:00.000Z",
          patientCount: 178,
        },
      ];

      setStaff(mockStaff);
      setFilteredStaff(mockStaff);
      setIsLoading(false);
    };

    fetchMedicalStaff();
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

  if (isLoading) {
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
                  <h1 className="text-3xl font-bold text-gray-900">
                    Medical Staff
                  </h1>
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
                          const lastActive = new Date(
                            s.lastActive || s.createdAt
                          );
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
                    <option value="admin">Administrators</option>
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
                        <User className="w-6 h-6 text-white" />
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
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </button>
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

                    {person.lastActive && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>Active {getTimeAgo(person.lastActive)}</span>
                      </div>
                    )}

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
                      <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      {user?.role === "admin" && (
                        <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <button className="flex items-center px-3 py-1.5 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                      <Mail className="w-3 h-3 mr-1" />
                      Contact
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredStaff.length === 0 && (
              <div className="text-center py-12">
                <UserX className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No staff members found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search criteria or filters.
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
