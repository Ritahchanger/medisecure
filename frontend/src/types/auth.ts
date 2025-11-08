export interface LoginFormData {
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;

  role?: UserRole;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  role?: string; // Change from specific roles to string
}

export interface AuthResponse {
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  token: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      name: string;
      email: string;
      role: "admin" | "doctor" | "nurse";
      createdAt: string;
      updatedAt: string;
    };
    token: string;
  };
}

export type UserRole = "admin" | "doctor" | "nurse" | "staff";
