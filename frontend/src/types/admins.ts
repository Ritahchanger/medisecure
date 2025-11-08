// Base User Interface
export interface BaseUser {
    _id: string;
    name: string;
    email: string;
    role: 'admin' | 'doctor' | 'nurse';
    createdAt: string;
    updatedAt: string;
    __v?: number;
  }
  
  // Admin-specific Interface (extends BaseUser)
  export interface Admin extends BaseUser {
    role: 'admin';
    attributes?: {
      department?: string;
      securityLevel?: number;
      isActive?: boolean;
      location?: string;
      shift?: string;
    };
  }
  
  // Admin Statistics Interface
  export interface AdminStats {
    totalAdmins: number;
    activeAdmins: number;
    inactiveAdmins: number;
    recentAdmins: number;
    adminPercentage: string;
  }
  
  // API Response Interfaces
  export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    count?: number;
    filters?: Record<string, any>;
    searchQuery?: string;
  }
  
  export interface AdminsResponse extends ApiResponse<Admin[]> {
    count: number;
  }
  
  export interface AdminResponse extends ApiResponse<Admin> {}
  
  export interface AdminStatsResponse extends ApiResponse<AdminStats> {}
  
  // Request Payload Interfaces
  export interface CreateAdminData {
    name: string;
    email: string;
    password: string;
    role: 'admin';
    attributes?: {
      department?: string;
      securityLevel?: number;
      isActive?: boolean;
      location?: string;
      shift?: string;
    };
  }
  
  export interface UpdateAdminData {
    name?: string;
    email?: string;
    password?: string;
    attributes?: {
      department?: string;
      securityLevel?: number;
      isActive?: boolean;
      location?: string;
      shift?: string;
    };
  }
  
  // Filter Interface
  export interface AdminFilters {
    department?: string;
    securityLevel?: number;
    isActive?: boolean;
    location?: string;
    shift?: string;
    name?: string;
    email?: string;
  }
  
  // Error Response Interface
  export interface ErrorResponse {
    success: false;
    message: string;
    error?: string;
    details?: string;
  }