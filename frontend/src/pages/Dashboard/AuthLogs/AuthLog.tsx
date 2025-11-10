import React, { useState, useEffect } from "react";

import { authLogService } from "../../../services/authLogService";

import type { AuthLog as AuthLogType, PaginationInfo } from "../../../types";

const AuthLog: React.FC = () => {
  const [logs, setLogs] = useState<AuthLogType[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const limit = 10;

  const fetchLogs = async (page: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authLogService.getAuthLogs(page, limit);
      setLogs(response.logs);
      setPagination(response.pagination);
    } catch (err) {
      setError("Failed to fetch authentication logs");
      console.error("Error fetching logs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (action: string) => {
    switch (action) {
      case "login_success":
        return "bg-green-100 text-green-800 border-green-200";
      case "login_failed":
        return "bg-red-100 text-red-800 border-red-200";
      case "logout":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  const getActionDisplay = (action: string) => {
    const actionMap: { [key: string]: string } = {
      login_success: "Login Success",
      login_failed: "Login Failed",
      logout: "Logout",
      password_change: "Password Changed",
      account_locked: "Account Locked",
    };
    return actionMap[action] || action.replace("_", " ");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">{error}</h3>
            <button
              onClick={() => fetchLogs(currentPage)}
              className="mt-2 text-sm text-red-700 hover:text-red-600 underline"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-neutral-300 rounded-lg overflow-hidden mt-[1rem]">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Authentication Logs
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Monitor user authentication activities
            </p>
          </div>
          {pagination && (
            <div className="text-sm text-gray-500">
              Total: {pagination.totalLogs} logs
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto ">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action & IP
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Device & Browser
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Timestamp
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {logs?.map((log) => (
              <tr
                key={log._id}
                className="hover:bg-gray-50 transition-colors duration-150"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-sm">
                      <span className="text-white font-medium text-sm">
                        {log?.userId?.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {log?.userId?.name}
                      </div>
                      <div className="text-sm text-gray-500">{log.email}</div>
                      <div className="text-xs text-gray-400 capitalize">
                        {log?.userId?.role}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {getActionDisplay(log.action)}
                  </div>
                  <div className="text-sm text-gray-500 font-mono">
                    {log.ipAddress}
                  </div>
                  {log.failureReason !== "none" && (
                    <div className="text-xs text-red-600 mt-1">
                      {log.failureReason}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 font-medium">
                    {log.deviceInfo.browser}
                  </div>
                  <div className="text-sm text-gray-500">
                    {log.deviceInfo.os} • {log.deviceInfo.device}
                  </div>
                  {log.deviceInfo.isMobile && (
                    <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-purple-100 text-purple-800 rounded-full">
                      Mobile
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {formatDate(log.timestamp)}
                  </div>
                  <div className="text-xs text-gray-400">
                    Created: {formatDate(log.createdAt)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(
                      log.action
                    )}`}
                  >
                    {getActionDisplay(log.action)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Page{" "}
              <span className="font-semibold">{pagination.currentPage}</span> of{" "}
              <span className="font-semibold">{pagination.totalPages}</span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPrev}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  pagination.hasPrev
                    ? "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 shadow-sm"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                }`}
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNext}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  pagination.hasNext
                    ? "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 shadow-sm"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {logs.length === 0 && !loading && (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-16 w-16 text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No authentication logs
          </h3>
          <p className="text-gray-500 max-w-sm mx-auto">
            There are no authentication logs to display at the moment. Logs will
            appear here as users authenticate with the system.
          </p>
        </div>
      )}
    </div>
  );
};

export default AuthLog;
