export type AdminRole = "super_admin" | "regular_admin";

export interface Admin {
  id: string;
  name: string;
  role: AdminRole;
  createdAt: Date;
  updatedAt: Date;
}
