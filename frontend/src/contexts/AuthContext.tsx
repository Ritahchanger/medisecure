import React, { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../services/auth";
import type { User, UserRole } from "../types";

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    role?: UserRole
  ) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;

  // RBAC Methods
  hasRole: (roles: UserRole | UserRole[]) => boolean;
  hasPermission: (permission: string) => boolean;
  canAccess: (requiredRole: UserRole, resource?: string) => boolean;
  getUserPermissions: () => string[];
}

const rolePermissions: Record<UserRole, string[]> = {
  admin: [
    "users:create",
    "users:read",
    "users:update",
    "users:delete",
    "patients:create",
    "patients:read",
    "patients:update",
    "patients:delete",
    "doctors:manage",
    "admins:manage",
    "audit:read",
    "reports:generate",
    "system:configure",
  ],
  doctor: [
    "patients:create",
    "patients:read",
    "patients:update",
    "medical_records:create",
    "medical_records:read",
    "medical_records:update",
    "prescriptions:create",
    "reports:generate",
  ],
  nurse: [
    "patients:read",
    "patients:update",
    "medical_records:read",
    "medical_records:update",
    "vitals:record",
    "medications:administer",
  ],
  staff: ["patients:read", "appointments:schedule", "billing:manage"],
};

const roleHierarchy: Record<UserRole, number> = {
  admin: 4,
  doctor: 3,
  nurse: 2,
  staff: 1,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (storedToken && storedUser) {
        const userData = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(userData);
      }
    } catch (error) {
      console.error("Auth initialization error:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await authAPI.login({ email, password });

      if (response.user && response.token) {
        setUser(response.user as any);
        setToken(response.token);

        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || "Login failed";
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role: UserRole = "admin"
  ) => {
    try {
      setIsLoading(true);
      const response = await authAPI.register({ name, email, password, role });

      if (response.data?.user && response.data?.token) {
        setUser(response.data.user);
        setToken(response.data.token);

        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || "Registration failed";
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!user || !user.role) return false;
    
    const rolesToCheck = Array.isArray(roles) ? roles : [roles];
    return rolesToCheck.includes(user.role);
  };

  const hasPermission = (permission: string): boolean => {
    if (!user || !user.role) return false;
    
    const userPermissions = rolePermissions[user.role] || [];
    return userPermissions.includes(permission);
  };

  const canAccess = (requiredRole: UserRole, resource?: string): boolean => {
    if (!user || !user.role) return false;
    
    const userRoleLevel = roleHierarchy[user.role];
    const requiredRoleLevel = roleHierarchy[requiredRole];
    
    return userRoleLevel >= requiredRoleLevel;
  };

  const getUserPermissions = (): string[] => {
    if (!user || !user.role) return [];
    return rolePermissions[user.role] || [];
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    isLoading,
    isAuthenticated: !!user && !!token,
    hasRole,
    hasPermission,
    canAccess,
    getUserPermissions,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};