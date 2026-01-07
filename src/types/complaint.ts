import { ImageType, CommentType, CommunitySentimentType } from './shared';

export interface ResolutionDetailType {
  description: string;
  budget?: number;
  images?: ImageType[];
}

export type ComplaintCategoryType =
  | "noise"
  | "sanitation"
  | "public_safety"
  | "traffic"
  | "infrastructure"
  | "water_electricity"
  | "domestic"
  | "environment"
  | "others";

export type ComplaintStatusType =
  | "submitted"
  | "under_review"
  | "scheduled"
  | "in_progress"
  | "resolved"
  | "dismissed";

export interface ComplaintAiAnalysisType {
  // --- Existing Logic ---
  summary: string;

  // --- Solution & Action Plan ---
  suggestedSolution: string;        // Step-by-step fix for the problem
  requiredResources: string[];     // Tools or materials needed (e.g., "Cere-mix", "Backhoe")
  estimatedManpower: string;       // e.g., "2 maintenance staff", "Barangay Tanods"
  estimatedTimeframe: string;      // AI's guess on how long the fix takes

  // --- Barangay Context & Governance ---
  departmentRouting: string;       // Which committee handles this (e.g., "Health & Sanitation")
  budgetEstimate?: string;         // e.g., "₱1,000 - ₱5,000"

  // --- Risk & Prevention ---
  publicSafetyRisk: string;        // Immediate dangers (e.g., "Risk of electrocution")
  preventionAdvice: string;        // How the Barangay can prevent this from happening again
}

export interface ComplaintLocationType {
  latitude: number;
  longitude: number;
  address: string;
}

export interface ComplaintType {
  id: string;
  title: string;
  description: string;
  category: ComplaintCategoryType;
  status: ComplaintStatusType;
  priority: "low" | "medium" | "high" | "urgent";
  complainantName: string;
  complainantId: string;
  location: ComplaintLocationType;
  images?: ImageType[];
  resolutionDetails?: ResolutionDetailType;
  resolvedAt?: Date;
  scheduledAt?: Date;
  likes?: string[];
  dislikes?: string[];
  comments?: CommentType[];
  aiAnalysis?: ComplaintAiAnalysisType;
  communitySentiment?: CommunitySentimentType;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateComplaintInputType {
  title: string;
  description: string;
  location: ComplaintLocationType;
  images?: ImageType[];
}

export interface UpdateComplaintInputType {
  title?: string;
  description?: string;
  category?: ComplaintCategoryType;
  status?: ComplaintStatusType;
  location?: ComplaintLocationType;
  images?: ImageType[];
  resolutionDetails?: ResolutionDetailType;
  resolvedAt?: Date;
  scheduledAt?: Date;
}
