export type AdminRoleType = "super_admin" | "regular_admin";

export interface AdminType {
  id: string;
  employeeId: string;
  name: string;
  role: AdminRoleType;
  createdAt: Date;
  lastLoginAt?: Date;
}
