import type { AxiosInstance } from "axios";

import apiClient from "../axios/axios";

import type { Doctor, DoctorsResponse, DeleteDoctorResponse } from "../types";

export class DoctorService {
  private readonly axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = apiClient;
  }

  /**
   * Get all doctors with pagination
   */
  async getDoctors(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<DoctorsResponse> {
    const params: any = { page, limit };

    if (search) {
      params.search = search;
    }

    const response = await this.axiosInstance.get("/doctors", { params });
    return response.data;
  }

  /**
   * Get doctor by ID
   */
  async getDoctorById(
    doctorId: string
  ): Promise<{ success: boolean; doctor: Doctor }> {
    const response = await this.axiosInstance.get(`/doctors/${doctorId}`);
    return response.data;
  }

  /**
   * Delete a doctor by ID
   */
  async deleteDoctor(doctorId: string): Promise<DeleteDoctorResponse> {
    const response = await this.axiosInstance.delete(`/doctors/${doctorId}`);
    return response.data;
  }

  /**
   * Search doctors by name or email
   */
  async searchDoctors(
    query: string,
    page: number = 1,
    limit: number = 10
  ): Promise<DoctorsResponse> {
    const response = await this.axiosInstance.get("/doctors/search", {
      params: { query, page, limit },
    });
    return response.data;
  }

  /**
   * Get doctors statistics
   */
  async getDoctorsStats(): Promise<{
    success: boolean;
    stats: {
      totalDoctors: number;
      recentDoctors: Doctor[];
    };
  }> {
    const response = await this.axiosInstance.get("/doctors/stats");
    return response.data;
  }

  /**
   * Get all medical staff (doctors, nurses, admins)
   */
  async getAllMedicalStaff(
    page: number = 1,
    limit: number = 50,
    role?: string
  ): Promise<DoctorsResponse> {
    const params: any = { page, limit };

    if (role && role !== "all") {
      params.role = role;
    }

    const response = await this.axiosInstance.get("/staff", { params });
    return response.data;
  }
}

// Export singleton instance
export const doctorService = new DoctorService();
