export interface Doctor {
    _id: string;
    name: string;
    email: string;
    role: "doctor" | "nurse" | "admin";
    createdAt: string;
    updatedAt: string;
    __v?: number;
    lastActive?: string;
    patientCount?: number;
  }
  
  export interface DoctorsResponse {
    success: boolean;
    doctors: Doctor[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalDoctors: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }
  
  export interface DeleteDoctorResponse {
    success: boolean;
    message: string;
    deletedDoctor?: Doctor;
  }