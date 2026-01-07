import { ImageType, CommentType, CommunitySentimentType } from './shared';

export type ProjectCategoryType =
  | "infrastructure"
  | "health"
  | "education"
  | "environment"
  | "livelihood"
  | "disaster_preparedness"
  | "social_services"
  | "sports_culture"
  | "others";

export type ProjectStatusType =
  | "planned"
  | "approved"
  | "ongoing"
  | "on_hold"
  | "completed"
  | "cancelled";

export interface ProjectLocationType {
  latitude: number;
  longitude: number;
  address: string;
}

export interface ProgressUpdateType {
  description: string;
  image?: { uri: string };
  createdAt: Date;
}

export interface ProjectType {
  id: string;
  title: string;
  description: string;
  category: ProjectCategoryType;
  status: ProjectStatusType;
  startDate: Date;
  expectedCompletionDate?: Date;
  actualCompletionDate?: Date;
  budget?: number;
  contractor?: string;
  sourceOfFunds?: string;
  location?: ProjectLocationType;
  images?: ImageType[];
  progressPercentage: number;
  progressUpdates?: ProgressUpdateType[];
  likes?: string[];
  dislikes?: string[];
  comments?: CommentType[];
  communitySentiment?: CommunitySentimentType;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProjectInputType {
  title: string;
  description: string;
  category: ProjectCategoryType;
  status: ProjectStatusType;
  startDate: Date;
  expectedCompletionDate?: Date;
  actualCompletionDate?: Date;
  budget?: number;
  contractor?: string;
  sourceOfFunds?: string;
  location?: ProjectLocationType;
  images?: ImageType[];
  progressPercentage: number;
  progressUpdates?: ProgressUpdateType[];
}

export interface UpdateProjectInputType {
  title?: string;
  description?: string;
  category?: ProjectCategoryType;
  status?: ProjectStatusType;
  startDate?: Date;
  expectedCompletionDate?: Date;
  actualCompletionDate?: Date;
  budget?: number;
  contractor?: string;
  sourceOfFunds?: string;
  location?: ProjectLocationType;
  images?: ImageType[];
  progressPercentage?: number;
  progressUpdates?: ProgressUpdateType[];
}
