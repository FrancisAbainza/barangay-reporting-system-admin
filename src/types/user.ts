export type AdminRole = "super_admin" | "regular_admin";
export type UserRole = "admin" | "user";
export type UserStatus = "active" | "banned" | "suspended";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  lastLoginAt?: Date;
  complaintsCount?: number;
}

export interface Admin {
  id: string;
  employeeId: string;
  name: string;
  role: AdminRole;
  createdAt: Date;
  lastLoginAt?: Date;
}

export interface CreateAdminRequest {
  employeeId: string;
  password: string;
  name: string;
  role: AdminRole;
}

export interface BanUserRequest {
  userId: string;
  reason?: string;
}

export interface UserStats {
  totalUsers: number;
  totalAdmins: number;
}
