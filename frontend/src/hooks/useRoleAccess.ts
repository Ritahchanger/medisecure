import { useAuth } from "../contexts/AuthContext";

export const useRoleAccess = () => {
  const { user } = useAuth();

  const hasRole = (requiredRole: "admin" | "doctor" | "nurse") => {
    return user?.role === requiredRole;
  };

  const hasAnyRole = (roles: ("admin" | "doctor" | "nurse")[]) => {
    return roles.includes(user?.role as any);
  };

  const isAdmin = user?.role === "admin";
  const isDoctor = user?.role === "doctor";
  const isNurse = user?.role === "nurse";

  return {
    hasRole,
    hasAnyRole,
    isAdmin,
    isDoctor,
    isNurse,
    currentRole: user?.role,
  };
};
