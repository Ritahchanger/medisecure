import type { PatientFormData } from "../schemas/patient";

export interface PatientResponse {
  _id: string;
  name: string;
  dob: string;
  createdBy: string;
  createdAt: string;
  files: FileResponse[];
  stats: {
    conditions: string[];
    symptoms: string[];
    treatments: string[];
  };
  data: PatientFormData;
}

export interface FileResponse {
  fileUrl: string;
  fileDownloadUrl: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface CreatePatientResponse {
  message: string;
  patientId: string;
}

export interface SimilarPatient {
  _id: string;
  name: string;
  similarity: number;
  sharedConditions: string[];
}
