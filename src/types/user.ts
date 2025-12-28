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
  projectsCount?: number;
}

export interface CreateAdminRequest {
  email: string;
  password: string;
  name: string;
  role: UserRole;
}

export interface BanUserRequest {
  userId: string;
  reason?: string;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  totalAdmins: number;
  bannedUsers: number;
}
