import type { User } from "./auth";

export interface DeviceInfo {
  browser: string;
  os: string;
  device: string;
  isMobile: boolean;
}

export interface AuthLog {
  _id: string;
  userId: User;
  email: string;
  action: string;
  ipAddress: string;
  userAgent: string;
  failureReason: string;
  deviceInfo: DeviceInfo;
  timestamp: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalLogs: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface AuthLogsResponse {
  logs: AuthLog[];
  pagination: PaginationInfo;
}
