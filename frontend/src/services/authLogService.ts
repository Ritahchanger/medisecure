import type { AxiosInstance } from "axios";
import apiClient from "../axios/axios";
import type { AuthLogsResponse } from "../types";

export class AuthLogService {
  private readonly axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = apiClient;
  }

  async getAuthLogs(
    page: number = 1,
    limit: number = 10
  ): Promise<AuthLogsResponse> {
    const response = await this.axiosInstance.get("/auth/admin/auth-logs", {
      params: { page, limit },
    });
    return response.data;
  }

  async getAuthLogsByUser(
    userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<AuthLogsResponse> {
    const response = await this.axiosInstance.get(
      `/auth/admin/auth-logs/user/${userId}`,
      {
        params: { page, limit },
      }
    );
    return response.data;
  }
}

// Export a singleton instance
export const authLogService = new AuthLogService();
