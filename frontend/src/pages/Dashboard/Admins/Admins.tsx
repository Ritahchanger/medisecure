import React, { useEffect, useState, type ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../../../components/Layout/Layout/Layout";
import {
  fetchAdmins,
  fetchAdminStats,
  searchAdmins,
  deleteAdmin,
  clearError,
  clearSuccess,
} from "../../store/slices/adminSlice";

import type { RootState, AppDispatch } from "../../store/store/Store";

import type { Admin } from "../../../types";

import { useNavigate } from "react-router-dom";

const Admins: React.FC = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch<AppDispatch>();
  const { admins, stats, loading, error, success } = useSelector(
    (state: RootState) => state.admins
  );

  const [searchQuery, setSearchQuery] = useState<string>("");
  // Fetch admins and stats on component mount
  useEffect(() => {
    dispatch(fetchAdmins());
    dispatch(fetchAdminStats());
  }, [dispatch]);

  // Clear messages after 3 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        if (error) dispatch(clearError());
        if (success) dispatch(clearSuccess());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, success, dispatch]);

  // Handle search
  const handleSearch = (e: ChangeEvent<HTMLInputElement>): void => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim()) {
      dispatch(searchAdmins(query));
    } else {
      dispatch(fetchAdmins());
    }
  };

  // Handle delete admin
  const handleDeleteAdmin = (adminId: string): void => {
    if (window.confirm("Are you sure you want to delete this admin?")) {
      dispatch(deleteAdmin(adminId));
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Admin Management</h1>
          <button
            onClick={() => {
              navigate("/staff/add");
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            {"Create New Admin"}
          </button>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-700">
                Total Admins
              </h3>
              <p className="text-2xl font-bold text-blue-600">
                {stats.totalAdmins}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-700">
                Active Admins
              </h3>
              <p className="text-2xl font-bold text-green-600">
                {stats.activeAdmins}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-700">
                Recent Admins
              </h3>
              <p className="text-2xl font-bold text-purple-600">
                {stats.recentAdmins}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-700">
                Active Rate
              </h3>
              <p className="text-2xl font-bold text-orange-600">
                {stats.adminPercentage}%
              </p>
            </div>
          </div>
        )}

        {/* Messages */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            Operation completed successfully!
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search admins by name or email..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Admins Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {admins.map((admin: Admin) => (
                  <tr key={admin._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {admin.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{admin.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {admin.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(admin.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleDeleteAdmin(admin._id)}
                        className="text-red-600 hover:text-red-900 ml-4"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {admins.length === 0 && !loading && (
            <div className="text-center py-8 text-gray-500">
              No admin users found.
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mt-4 text-sm text-gray-600">
          Showing {admins.length} admin(s)
        </div>
      </div>
    </Layout>
  );
};

export default Admins;
