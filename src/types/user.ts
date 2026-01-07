export type UserStatusType = "active" | "banned";

export interface UserType {
  id: string;
  email: string;
  avatarUrl?: string;
  name: string;
  status: UserStatusType;
  complaintsCount?: number;
  lastLoginAt?: Date;
  createdAt: Date;
}