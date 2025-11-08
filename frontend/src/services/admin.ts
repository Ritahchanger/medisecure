import apiClient from "../axios/axios";

import type {
  AdminsResponse,
  AdminResponse,
  AdminStatsResponse,
  CreateAdminData,
  UpdateAdminData,
  AdminFilters,
  ErrorResponse,
} from "../types";

// Type guard to check if response is an error
const isErrorResponse = (response: any): response is ErrorResponse => {
  return response.success === false;
};

// Admin API endpoints
export const adminApi = {
  // Get all admins
  getAllAdmins: async (): Promise<AdminsResponse> => {
    const response = await apiClient.get<AdminsResponse | ErrorResponse>(
      "/admins"
    );

    if (isErrorResponse(response.data)) {
      throw new Error(response.data.message);
    }

    return response.data;
  },

  // Get admin by ID
  getAdminById: async (adminId: string): Promise<AdminResponse> => {
    const response = await apiClient.get<AdminResponse | ErrorResponse>(
      `/admins/${adminId}`
    );

    if (isErrorResponse(response.data)) {
      throw new Error(response.data.message);
    }

    return response.data;
  },

  // Get admin statistics
  getAdminStats: async (): Promise<AdminStatsResponse> => {
    const response = await apiClient.get<AdminStatsResponse | ErrorResponse>(
      "/admins/stats"
    );

    if (isErrorResponse(response.data)) {
      throw new Error(response.data.message);
    }

    return response.data;
  },

  // Search admins
  searchAdmins: async (query: string): Promise<AdminsResponse> => {
    const response = await apiClient.get<AdminsResponse | ErrorResponse>(
      `/admins/search?q=${query}`
    );

    if (isErrorResponse(response.data)) {
      throw new Error(response.data.message);
    }

    return response.data;
  },

  // Filter admins
  filterAdmins: async (filters: AdminFilters): Promise<AdminsResponse> => {
    const response = await apiClient.get<AdminsResponse | ErrorResponse>(
      "/admins/filter",
      {
        params: filters,
      }
    );

    if (isErrorResponse(response.data)) {
      throw new Error(response.data.message);
    }

    return response.data;
  },

  // Create new admin
  createAdmin: async (adminData: CreateAdminData): Promise<AdminResponse> => {
    const response = await apiClient.post<AdminResponse | ErrorResponse>(
      "/admins",
      adminData
    );

    if (isErrorResponse(response.data)) {
      throw new Error(response.data.message);
    }

    return response.data;
  },

  // Update admin
  updateAdmin: async (
    adminId: string,
    updateData: UpdateAdminData
  ): Promise<AdminResponse> => {
    const response = await apiClient.put<AdminResponse | ErrorResponse>(
      `/admins/${adminId}`,
      updateData
    );

    if (isErrorResponse(response.data)) {
      throw new Error(response.data.message);
    }

    return response.data;
  },

  // Delete admin
  deleteAdmin: async (
    adminId: string
  ): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete<
      { success: boolean; message: string } | ErrorResponse
    >(`/admins/${adminId}`);

    if (isErrorResponse(response.data)) {
      throw new Error(response.data.message);
    }

    return response.data;
  },
};

export default adminApi;
