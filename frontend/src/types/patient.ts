export interface PatientData {
  name: string;
  dob: string;
  conditions: string[];
  symptoms: string[];
  treatments: string[];
  files: FileResponse[];
}

export interface PatientResponse {
  _id: string;
  name: string;
  dob: string;
  createdBy: string;
  createdAt: string;
  files: FileResponse[];
  stats: PatientStats;
  data: PatientData;
}

export interface PatientStats {
  conditions: string[];
  symptoms: string[];
  treatments: string[];
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
