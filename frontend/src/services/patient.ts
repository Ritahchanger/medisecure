import apiClient from "../axios/axios";

import type { PatientFormData } from "../schemas/patient";

import type { CreatePatientResponse,PatientResponse,SimilarPatient,FileResponse } from "../types";

import type { GlobalStats } from "../types";


export const patientsAPI = {
  /**
   * Create a new patient with optional file uploads
   */
  create: async (
    patientData: PatientFormData,
    files: File[] = []
  ): Promise<CreatePatientResponse> => {
    const formData = new FormData();

    // Append patient data as JSON
    formData.append("patientData", JSON.stringify(patientData));

    // Append files
    files.forEach((file) => {
      formData.append("files", file);
    });

    const response = await apiClient.post("/patients", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },

  /**
   * Get all patients (decrypted)
   */
  getAll: async (): Promise<PatientResponse[]> => {
    const response = await apiClient.get("/patients");
    return response.data;
  },

  /**
   * Get patient by ID (decrypted)
   */
  getById: async (id: string): Promise<PatientResponse> => {
    const response = await apiClient.get(`/patients/${id}`);
    return response.data;
  },

  /**
   * Find similar patients based on conditions
   */
  findSimilar: async (patientId: string): Promise<SimilarPatient[]> => {
    const response = await apiClient.get(`/patients/${patientId}/similar`);
    return response.data;
  },

  /**
   * Get global statistics about conditions
   */
  getStats: async (): Promise<GlobalStats[]> => {
    const response = await apiClient.get("/patients/stats/global");
    return response.data;
  },

  /**
   * Upload files to an existing patient
   */
  uploadFiles: async (
    patientId: string,
    files: File[]
  ): Promise<FileResponse[]> => {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("files", file);
    });

    const response = await apiClient.post(
      `/patients/${patientId}/files`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  },

  /**
   * Get signed URL for file download
   */
  getFileDownloadUrl: async (fileUrl: string): Promise<string> => {
    const response = await apiClient.post("/patients/files/download-url", {
      fileUrl,
    });
    return response.data.downloadUrl;
  },

  /**
   * Delete a patient
   */
  delete: async (patientId: string): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/patients/${patientId}`);
    return response.data;
  },

  /**
   * Update patient information
   */
  update: async (
    patientId: string,
    patientData: Partial<PatientFormData>
  ): Promise<PatientResponse> => {
    const response = await apiClient.put(`/patients/${patientId}`, patientData);
    return response.data;
  },
};
