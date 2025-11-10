import axios from "axios";

import type { LoginFormData } from "../schemas/auth";

import type {
  AuthResponse,
  RegisterResponse,
  RegisterFormData,
} from "../types";
// In your auth.ts service file

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Create axios instance for auth
const authClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const authAPI = {
  login: async (credentials: LoginFormData): Promise<AuthResponse> => {
    const response = await authClient.post("/auth/login", credentials);
    return response.data;
  },

  register: async (userData: RegisterFormData): Promise<RegisterResponse> => {
    const response = await authClient.post("/auth/register", userData);
    return response.data;
  },

  getProfile: async (token: string) => {
    const response = await authClient.get("/auth/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  checkEmail: async (email: string): Promise<{ available: boolean }> => {
    const response = await authClient.get(`/auth/check-email/${email}`);
    return response.data;
  },

  refreshToken: async (token: string) => {
    const response = await authClient.post("/auth/refresh-token", { token });
    return response.data;
  },

  logOut: async (): Promise<any> => {
    const response = await authClient.post("/auth/logout");
    return response.data;
  },
};
