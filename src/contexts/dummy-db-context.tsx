"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

// Types
export type ComplaintCategory =
  | "noise"
  | "sanitation"
  | "public_safety"
  | "traffic"
  | "infrastructure"
  | "water_electricity"
  | "domestic"
  | "environment"
  | "others";

export type ComplaintStatus =
  | "submitted"
  | "under_review"
  | "scheduled"
  | "in_progress"
  | "resolved"
  | "dismissed";

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  likes?: string[];
  dislikes?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  status: ComplaintStatus;
  complainantName: string;
  complainantId: string;
  location: {
    latitude: number;
    longitude: number;
  };
  images?: { uri: string }[];
  likes?: string[];
  dislikes?: string[];
  comments?: Comment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateComplaintInput {
  title: string;
  description: string;
  category: ComplaintCategory;
  location: {
    latitude: number;
    longitude: number;
  };
  images?: { uri: string }[];
}

export interface UpdateComplaintInput {
  title?: string;
  description?: string;
  category?: ComplaintCategory;
  location?: {
    latitude: number;
    longitude: number;
  };
  images?: { uri: string }[];
}

export type ProjectCategory =
  | "infrastructure"
  | "health"
  | "education"
  | "environment"
  | "livelihood"
  | "disaster_preparedness"
  | "social_services"
  | "sports_culture"
  | "others";

export type ProjectStatus =
  | "planned"
  | "approved"
  | "ongoing"
  | "on_hold"
  | "completed"
  | "cancelled";

export interface ProjectLocation {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category: ProjectCategory;
  status: ProjectStatus;
  startDate: Date;
  endDate?: Date;
  budget?: number;
  contractor?: string;
  sourceOfFunds?: string;
  location?: ProjectLocation;
  images?: { uri: string }[];
  likes?: string[];
  dislikes?: string[];
  comments?: Comment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProjectInput {
  title: string;
  description: string;
  category: ProjectCategory;
  status: ProjectStatus;
  startDate: Date;
  endDate?: Date;
  budget?: number;
  contractor?: string;
  sourceOfFunds?: string;
  location?: ProjectLocation;
  images?: { uri: string }[];
}

export interface UpdateProjectInput {
  title?: string;
  description?: string;
  category?: ProjectCategory;
  status?: ProjectStatus;
  startDate?: Date;
  endDate?: Date;
  budget?: number;
  contractor?: string;
  sourceOfFunds?: string;
  location?: ProjectLocation;
  images?: { uri: string }[];
}

// Context types
interface DummyDbContextType {
  // Complaint state
  complaints: Complaint[];
  
  // Complaint CRUD operations
  getComplaints: () => Complaint[];
  getComplaintById: (id: string) => Complaint | undefined;
  createComplaint: (
    input: CreateComplaintInput,
    complainantName: string,
    complainantId: string
  ) => Complaint;
  updateComplaint: (id: string, input: UpdateComplaintInput) => Complaint | null;
  deleteComplaint: (id: string) => boolean;
  updateComplaintStatus: (id: string, status: ComplaintStatus) => Complaint | null;
  
  // Complaint interaction operations
  likeComplaint: (complaintId: string, userId: string) => boolean;
  dislikeComplaint: (complaintId: string, userId: string) => boolean;
  addComplaintComment: (
    complaintId: string,
    userId: string,
    userName: string,
    content: string
  ) => Comment | null;
  updateComplaintComment: (
    complaintId: string,
    commentId: string,
    content: string
  ) => Comment | null;
  deleteComplaintComment: (complaintId: string, commentId: string) => boolean;
  likeComplaintComment: (
    complaintId: string,
    commentId: string,
    userId: string
  ) => boolean;
  dislikeComplaintComment: (
    complaintId: string,
    commentId: string,
    userId: string
  ) => boolean;

  // Project state
  projects: Project[];
  
  // Project CRUD operations
  getProjects: () => Project[];
  getProjectById: (id: string) => Project | undefined;
  createProject: (input: CreateProjectInput) => Project;
  updateProject: (id: string, input: UpdateProjectInput) => Project | null;
  deleteProject: (id: string) => boolean;
  
  // Project interaction operations
  likeProject: (projectId: string, userId: string) => boolean;
  dislikeProject: (projectId: string, userId: string) => boolean;
  addProjectComment: (
    projectId: string,
    userId: string,
    userName: string,
    content: string
  ) => Comment | null;
  updateProjectComment: (
    projectId: string,
    commentId: string,
    content: string
  ) => Comment | null;
  deleteProjectComment: (projectId: string, commentId: string) => boolean;
  likeProjectComment: (
    projectId: string,
    commentId: string,
    userId: string
  ) => boolean;
  dislikeProjectComment: (
    projectId: string,
    commentId: string,
    userId: string
  ) => boolean;
}

// Initial dummy data
const initialComplaints: Complaint[] = [
  {
    id: "c1",
    title: "Broken Street Light on Main Road",
    description:
      "The street light near the corner of Main Road has been broken for two weeks. It's causing safety concerns for pedestrians at night.",
    category: "infrastructure",
    status: "under_review",
    complainantName: "Juan Dela Cruz",
    complainantId: "user1",
    location: {
      latitude: 14.5995,
      longitude: 120.9842,
    },
    images: [{ uri: "https://example.com/streetlight.jpg" }],
    likes: ["user2", "user3"],
    dislikes: [],
    comments: [
      {
        id: "comment1",
        userId: "user2",
        userName: "Maria Santos",
        content: "I noticed this too! It's really dark at night.",
        likes: ["user1"],
        dislikes: [],
        createdAt: new Date("2025-12-20T10:30:00"),
        updatedAt: new Date("2025-12-20T10:30:00"),
      },
    ],
    createdAt: new Date("2025-12-18T14:20:00"),
    updatedAt: new Date("2025-12-19T09:15:00"),
  },
  {
    id: "c2",
    title: "Noise Complaint from Construction Site",
    description:
      "Construction work starting at 6 AM is causing excessive noise disturbance in the residential area.",
    category: "noise",
    status: "scheduled",
    complainantName: "Maria Santos",
    complainantId: "user2",
    location: {
      latitude: 14.6091,
      longitude: 120.9896,
    },
    images: [],
    likes: ["user1", "user4", "user5"],
    dislikes: [],
    comments: [],
    createdAt: new Date("2025-12-19T07:15:00"),
    updatedAt: new Date("2025-12-20T11:00:00"),
  },
  {
    id: "c3",
    title: "Overflowing Garbage Bins",
    description:
      "The garbage bins at the corner of Rizal Street have been overflowing for three days. This is attracting pests and creating unsanitary conditions.",
    category: "sanitation",
    status: "in_progress",
    complainantName: "Pedro Reyes",
    complainantId: "user3",
    location: {
      latitude: 14.5876,
      longitude: 120.9793,
    },
    images: [
      { uri: "https://example.com/garbage1.jpg" },
      { uri: "https://example.com/garbage2.jpg" },
    ],
    likes: ["user1", "user2", "user4"],
    dislikes: ["user6"],
    comments: [
      {
        id: "comment2",
        userId: "user4",
        userName: "Ana Lopez",
        content: "This is a health hazard. Needs immediate attention!",
        likes: ["user1", "user2", "user3"],
        dislikes: [],
        createdAt: new Date("2025-12-20T15:45:00"),
        updatedAt: new Date("2025-12-20T15:45:00"),
      },
      {
        id: "comment3",
        userId: "user5",
        userName: "Carlos Gomez",
        content: "The smell is unbearable.",
        likes: ["user3"],
        dislikes: [],
        createdAt: new Date("2025-12-21T08:20:00"),
        updatedAt: new Date("2025-12-21T08:20:00"),
      },
    ],
    createdAt: new Date("2025-12-17T09:30:00"),
    updatedAt: new Date("2025-12-22T14:10:00"),
  },
  {
    id: "c4",
    title: "Water Leak on Bonifacio Avenue",
    description:
      "There's a significant water leak from the main pipe on Bonifacio Avenue. Water is flooding the street.",
    category: "water_electricity",
    status: "resolved",
    complainantName: "Rosa Martinez",
    complainantId: "user4",
    location: {
      latitude: 14.5945,
      longitude: 120.9912,
    },
    images: [{ uri: "https://example.com/waterleak.jpg" }],
    likes: ["user1", "user2"],
    dislikes: [],
    comments: [
      {
        id: "comment4",
        userId: "admin1",
        userName: "Admin Staff",
        content: "This has been fixed. Thank you for reporting!",
        likes: ["user4", "user1", "user2"],
        dislikes: [],
        createdAt: new Date("2025-12-23T16:00:00"),
        updatedAt: new Date("2025-12-23T16:00:00"),
      },
    ],
    createdAt: new Date("2025-12-21T11:20:00"),
    updatedAt: new Date("2025-12-23T16:30:00"),
  },
  {
    id: "c5",
    title: "Dangerous Pothole on Highway",
    description:
      "Large pothole on the highway entrance is causing accidents and vehicle damage.",
    category: "public_safety",
    status: "submitted",
    complainantName: "Luis Fernandez",
    complainantId: "user5",
    location: {
      latitude: 14.6125,
      longitude: 120.9756,
    },
    images: [{ uri: "https://example.com/pothole.jpg" }],
    likes: ["user1", "user3", "user6"],
    dislikes: [],
    comments: [],
    createdAt: new Date("2025-12-22T13:45:00"),
    updatedAt: new Date("2025-12-22T13:45:00"),
  },
];

const initialProjects: Project[] = [
  {
    id: "p1",
    title: "Community Health Center Renovation",
    description:
      "Complete renovation of the barangay health center including new equipment, upgraded facilities, and improved waiting areas.",
    category: "health",
    status: "ongoing",
    startDate: new Date("2025-11-01"),
    endDate: new Date("2026-02-28"),
    budget: 2500000,
    contractor: "ABC Construction Corp.",
    sourceOfFunds: "Municipal Budget 2025",
    location: {
      latitude: 14.5989,
      longitude: 120.9845,
      address: "123 Health Street, Barangay Central",
    },
    images: [
      { uri: "https://example.com/healthcenter1.jpg" },
      { uri: "https://example.com/healthcenter2.jpg" },
    ],
    likes: ["user1", "user2", "user3", "user4"],
    dislikes: [],
    comments: [
      {
        id: "pcomment1",
        userId: "user1",
        userName: "Juan Dela Cruz",
        content: "Great initiative! Looking forward to the completion.",
        likes: ["user2", "user3"],
        dislikes: [],
        createdAt: new Date("2025-11-05T10:00:00"),
        updatedAt: new Date("2025-11-05T10:00:00"),
      },
    ],
    createdAt: new Date("2025-10-15T09:00:00"),
    updatedAt: new Date("2025-12-20T14:30:00"),
  },
  {
    id: "p2",
    title: "Street Lighting Installation Project",
    description:
      "Installation of 50 new LED street lights across major roads and alleys to improve nighttime safety and security.",
    category: "infrastructure",
    status: "approved",
    startDate: new Date("2026-01-15"),
    endDate: new Date("2026-03-31"),
    budget: 1800000,
    contractor: "LightWorks Inc.",
    sourceOfFunds: "DILG Grant",
    location: {
      latitude: 14.5995,
      longitude: 120.9842,
      address: "Various locations across the barangay",
    },
    images: [],
    likes: ["user1", "user2", "user5"],
    dislikes: [],
    comments: [],
    createdAt: new Date("2025-12-01T08:30:00"),
    updatedAt: new Date("2025-12-15T11:20:00"),
  },
  {
    id: "p3",
    title: "Waste Management and Recycling Program",
    description:
      "Implementation of a comprehensive waste segregation and recycling program including distribution of color-coded bins and weekly collection schedules.",
    category: "environment",
    status: "ongoing",
    startDate: new Date("2025-10-01"),
    endDate: new Date("2026-12-31"),
    budget: 850000,
    contractor: "GreenEarth Solutions",
    sourceOfFunds: "Environmental Fund",
    location: {
      latitude: 14.5932,
      longitude: 120.9801,
      address: "Barangay-wide implementation",
    },
    images: [{ uri: "https://example.com/recycling.jpg" }],
    likes: ["user2", "user3", "user4", "user5", "user6"],
    dislikes: [],
    comments: [
      {
        id: "pcomment2",
        userId: "user3",
        userName: "Pedro Reyes",
        content: "This is exactly what we need! Great job!",
        likes: ["user1", "user2", "user4"],
        dislikes: [],
        createdAt: new Date("2025-10-10T14:20:00"),
        updatedAt: new Date("2025-10-10T14:20:00"),
      },
      {
        id: "pcomment3",
        userId: "user4",
        userName: "Ana Lopez",
        content: "When will we receive the bins in our area?",
        likes: ["user5"],
        dislikes: [],
        createdAt: new Date("2025-10-15T09:30:00"),
        updatedAt: new Date("2025-10-15T09:30:00"),
      },
    ],
    createdAt: new Date("2025-09-20T10:00:00"),
    updatedAt: new Date("2025-12-18T16:45:00"),
  },
  {
    id: "p4",
    title: "Multipurpose Sports Complex",
    description:
      "Construction of a new multipurpose sports complex with basketball and volleyball courts, covered stage, and community hall.",
    category: "sports_culture",
    status: "planned",
    startDate: new Date("2026-06-01"),
    budget: 5000000,
    sourceOfFunds: "Provincial Development Fund",
    location: {
      latitude: 14.6012,
      longitude: 120.9778,
      address: "Corner of Sports Ave and Recreation St.",
    },
    images: [{ uri: "https://example.com/sports-plan.jpg" }],
    likes: ["user1", "user3", "user5"],
    dislikes: [],
    comments: [],
    createdAt: new Date("2025-12-10T11:00:00"),
    updatedAt: new Date("2025-12-10T11:00:00"),
  },
  {
    id: "p5",
    title: "Scholarship Program for Youth",
    description:
      "Educational assistance program providing scholarships to 100 deserving students from low-income families.",
    category: "education",
    status: "ongoing",
    startDate: new Date("2025-06-01"),
    endDate: new Date("2026-05-31"),
    budget: 1200000,
    sourceOfFunds: "Barangay Development Fund",
    images: [],
    likes: ["user1", "user2", "user3", "user4", "user5", "user6"],
    dislikes: [],
    comments: [
      {
        id: "pcomment4",
        userId: "user2",
        userName: "Maria Santos",
        content: "This will help so many families. Thank you!",
        likes: ["user1", "user3", "user4", "user5"],
        dislikes: [],
        createdAt: new Date("2025-06-15T13:00:00"),
        updatedAt: new Date("2025-06-15T13:00:00"),
      },
    ],
    createdAt: new Date("2025-05-01T09:00:00"),
    updatedAt: new Date("2025-12-20T10:30:00"),
  },
  {
    id: "p6",
    title: "Flood Control and Drainage System",
    description:
      "Improvement of drainage systems and construction of flood control infrastructure in flood-prone areas.",
    category: "disaster_preparedness",
    status: "completed",
    startDate: new Date("2025-03-01"),
    endDate: new Date("2025-10-31"),
    budget: 3200000,
    contractor: "FloodSafe Engineering",
    sourceOfFunds: "Disaster Risk Reduction Fund",
    location: {
      latitude: 14.5856,
      longitude: 120.9823,
      address: "Low-lying areas, Zone 3 and 4",
    },
    images: [
      { uri: "https://example.com/drainage1.jpg" },
      { uri: "https://example.com/drainage2.jpg" },
      { uri: "https://example.com/drainage3.jpg" },
    ],
    likes: ["user1", "user2", "user3"],
    dislikes: [],
    comments: [
      {
        id: "pcomment5",
        userId: "user6",
        userName: "Linda Torres",
        content: "The flooding has significantly reduced! Great work!",
        likes: ["user1", "user2", "user3", "user4", "user5"],
        dislikes: [],
        createdAt: new Date("2025-11-15T16:30:00"),
        updatedAt: new Date("2025-11-15T16:30:00"),
      },
    ],
    createdAt: new Date("2025-02-01T08:00:00"),
    updatedAt: new Date("2025-11-01T17:00:00"),
  },
];

// Create Context
const DummyDbContext = createContext<DummyDbContextType | undefined>(undefined);

// Provider Component
export function DummyDbProvider({ children }: { children: ReactNode }) {
  const [complaints, setComplaints] = useState<Complaint[]>(initialComplaints);
  const [projects, setProjects] = useState<Project[]>(initialProjects);

  // Helper function to generate unique IDs
  const generateId = (prefix: string): string => {
    return `${prefix}${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
  };

  // ========== COMPLAINT CRUD OPERATIONS ==========

  const getComplaints = (): Complaint[] => {
    return complaints;
  };

  const getComplaintById = (id: string): Complaint | undefined => {
    return complaints.find((complaint) => complaint.id === id);
  };

  const createComplaint = (
    input: CreateComplaintInput,
    complainantName: string,
    complainantId: string
  ): Complaint => {
    const newComplaint: Complaint = {
      id: generateId("c"),
      ...input,
      complainantName,
      complainantId,
      status: "submitted",
      likes: [],
      dislikes: [],
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setComplaints((prev) => [...prev, newComplaint]);
    return newComplaint;
  };

  const updateComplaint = (
    id: string,
    input: UpdateComplaintInput
  ): Complaint | null => {
    let updatedComplaint: Complaint | null = null;

    setComplaints((prev) =>
      prev.map((complaint) => {
        if (complaint.id === id) {
          updatedComplaint = {
            ...complaint,
            ...input,
            updatedAt: new Date(),
          };
          return updatedComplaint;
        }
        return complaint;
      })
    );

    return updatedComplaint;
  };

  const deleteComplaint = (id: string): boolean => {
    const initialLength = complaints.length;
    setComplaints((prev) => prev.filter((complaint) => complaint.id !== id));
    return complaints.length !== initialLength;
  };

  const updateComplaintStatus = (
    id: string,
    status: ComplaintStatus
  ): Complaint | null => {
    return updateComplaint(id, { status } as UpdateComplaintInput);
  };

  // ========== COMPLAINT INTERACTION OPERATIONS ==========

  const likeComplaint = (complaintId: string, userId: string): boolean => {
    let success = false;

    setComplaints((prev) =>
      prev.map((complaint) => {
        if (complaint.id === complaintId) {
          const likes = complaint.likes || [];
          const dislikes = complaint.dislikes || [];

          // Remove from dislikes if present
          const newDislikes = dislikes.filter((id) => id !== userId);

          // Toggle like
          const newLikes = likes.includes(userId)
            ? likes.filter((id) => id !== userId)
            : [...likes, userId];

          success = true;
          return {
            ...complaint,
            likes: newLikes,
            dislikes: newDislikes,
            updatedAt: new Date(),
          };
        }
        return complaint;
      })
    );

    return success;
  };

  const dislikeComplaint = (complaintId: string, userId: string): boolean => {
    let success = false;

    setComplaints((prev) =>
      prev.map((complaint) => {
        if (complaint.id === complaintId) {
          const likes = complaint.likes || [];
          const dislikes = complaint.dislikes || [];

          // Remove from likes if present
          const newLikes = likes.filter((id) => id !== userId);

          // Toggle dislike
          const newDislikes = dislikes.includes(userId)
            ? dislikes.filter((id) => id !== userId)
            : [...dislikes, userId];

          success = true;
          return {
            ...complaint,
            likes: newLikes,
            dislikes: newDislikes,
            updatedAt: new Date(),
          };
        }
        return complaint;
      })
    );

    return success;
  };

  const addComplaintComment = (
    complaintId: string,
    userId: string,
    userName: string,
    content: string
  ): Comment | null => {
    let newComment: Comment | null = null;

    setComplaints((prev) =>
      prev.map((complaint) => {
        if (complaint.id === complaintId) {
          newComment = {
            id: generateId("comment"),
            userId,
            userName,
            content,
            likes: [],
            dislikes: [],
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          return {
            ...complaint,
            comments: [...(complaint.comments || []), newComment],
            updatedAt: new Date(),
          };
        }
        return complaint;
      })
    );

    return newComment;
  };

  const updateComplaintComment = (
    complaintId: string,
    commentId: string,
    content: string
  ): Comment | null => {
    let updatedComment: Comment | null = null;

    setComplaints((prev) =>
      prev.map((complaint) => {
        if (complaint.id === complaintId) {
          const updatedComments = (complaint.comments || []).map((comment) => {
            if (comment.id === commentId) {
              updatedComment = {
                ...comment,
                content,
                updatedAt: new Date(),
              };
              return updatedComment;
            }
            return comment;
          });

          return {
            ...complaint,
            comments: updatedComments,
            updatedAt: new Date(),
          };
        }
        return complaint;
      })
    );

    return updatedComment;
  };

  const deleteComplaintComment = (
    complaintId: string,
    commentId: string
  ): boolean => {
    let success = false;

    setComplaints((prev) =>
      prev.map((complaint) => {
        if (complaint.id === complaintId) {
          const filteredComments = (complaint.comments || []).filter(
            (comment) => comment.id !== commentId
          );
          success = filteredComments.length !== (complaint.comments || []).length;

          return {
            ...complaint,
            comments: filteredComments,
            updatedAt: new Date(),
          };
        }
        return complaint;
      })
    );

    return success;
  };

  const likeComplaintComment = (
    complaintId: string,
    commentId: string,
    userId: string
  ): boolean => {
    let success = false;

    setComplaints((prev) =>
      prev.map((complaint) => {
        if (complaint.id === complaintId) {
          const updatedComments = (complaint.comments || []).map((comment) => {
            if (comment.id === commentId) {
              const likes = comment.likes || [];
              const dislikes = comment.dislikes || [];

              const newDislikes = dislikes.filter((id) => id !== userId);
              const newLikes = likes.includes(userId)
                ? likes.filter((id) => id !== userId)
                : [...likes, userId];

              success = true;
              return {
                ...comment,
                likes: newLikes,
                dislikes: newDislikes,
                updatedAt: new Date(),
              };
            }
            return comment;
          });

          return {
            ...complaint,
            comments: updatedComments,
            updatedAt: new Date(),
          };
        }
        return complaint;
      })
    );

    return success;
  };

  const dislikeComplaintComment = (
    complaintId: string,
    commentId: string,
    userId: string
  ): boolean => {
    let success = false;

    setComplaints((prev) =>
      prev.map((complaint) => {
        if (complaint.id === complaintId) {
          const updatedComments = (complaint.comments || []).map((comment) => {
            if (comment.id === commentId) {
              const likes = comment.likes || [];
              const dislikes = comment.dislikes || [];

              const newLikes = likes.filter((id) => id !== userId);
              const newDislikes = dislikes.includes(userId)
                ? dislikes.filter((id) => id !== userId)
                : [...dislikes, userId];

              success = true;
              return {
                ...comment,
                likes: newLikes,
                dislikes: newDislikes,
                updatedAt: new Date(),
              };
            }
            return comment;
          });

          return {
            ...complaint,
            comments: updatedComments,
            updatedAt: new Date(),
          };
        }
        return complaint;
      })
    );

    return success;
  };

  // ========== PROJECT CRUD OPERATIONS ==========

  const getProjects = (): Project[] => {
    return projects;
  };

  const getProjectById = (id: string): Project | undefined => {
    return projects.find((project) => project.id === id);
  };

  const createProject = (input: CreateProjectInput): Project => {
    const newProject: Project = {
      id: generateId("p"),
      ...input,
      likes: [],
      dislikes: [],
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setProjects((prev) => [...prev, newProject]);
    return newProject;
  };

  const updateProject = (
    id: string,
    input: UpdateProjectInput
  ): Project | null => {
    let updatedProject: Project | null = null;

    setProjects((prev) =>
      prev.map((project) => {
        if (project.id === id) {
          updatedProject = {
            ...project,
            ...input,
            updatedAt: new Date(),
          };
          return updatedProject;
        }
        return project;
      })
    );

    return updatedProject;
  };

  const deleteProject = (id: string): boolean => {
    const initialLength = projects.length;
    setProjects((prev) => prev.filter((project) => project.id !== id));
    return projects.length !== initialLength;
  };

  // ========== PROJECT INTERACTION OPERATIONS ==========

  const likeProject = (projectId: string, userId: string): boolean => {
    let success = false;

    setProjects((prev) =>
      prev.map((project) => {
        if (project.id === projectId) {
          const likes = project.likes || [];
          const dislikes = project.dislikes || [];

          const newDislikes = dislikes.filter((id) => id !== userId);
          const newLikes = likes.includes(userId)
            ? likes.filter((id) => id !== userId)
            : [...likes, userId];

          success = true;
          return {
            ...project,
            likes: newLikes,
            dislikes: newDislikes,
            updatedAt: new Date(),
          };
        }
        return project;
      })
    );

    return success;
  };

  const dislikeProject = (projectId: string, userId: string): boolean => {
    let success = false;

    setProjects((prev) =>
      prev.map((project) => {
        if (project.id === projectId) {
          const likes = project.likes || [];
          const dislikes = project.dislikes || [];

          const newLikes = likes.filter((id) => id !== userId);
          const newDislikes = dislikes.includes(userId)
            ? dislikes.filter((id) => id !== userId)
            : [...dislikes, userId];

          success = true;
          return {
            ...project,
            likes: newLikes,
            dislikes: newDislikes,
            updatedAt: new Date(),
          };
        }
        return project;
      })
    );

    return success;
  };

  const addProjectComment = (
    projectId: string,
    userId: string,
    userName: string,
    content: string
  ): Comment | null => {
    let newComment: Comment | null = null;

    setProjects((prev) =>
      prev.map((project) => {
        if (project.id === projectId) {
          newComment = {
            id: generateId("pcomment"),
            userId,
            userName,
            content,
            likes: [],
            dislikes: [],
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          return {
            ...project,
            comments: [...(project.comments || []), newComment],
            updatedAt: new Date(),
          };
        }
        return project;
      })
    );

    return newComment;
  };

  const updateProjectComment = (
    projectId: string,
    commentId: string,
    content: string
  ): Comment | null => {
    let updatedComment: Comment | null = null;

    setProjects((prev) =>
      prev.map((project) => {
        if (project.id === projectId) {
          const updatedComments = (project.comments || []).map((comment) => {
            if (comment.id === commentId) {
              updatedComment = {
                ...comment,
                content,
                updatedAt: new Date(),
              };
              return updatedComment;
            }
            return comment;
          });

          return {
            ...project,
            comments: updatedComments,
            updatedAt: new Date(),
          };
        }
        return project;
      })
    );

    return updatedComment;
  };

  const deleteProjectComment = (
    projectId: string,
    commentId: string
  ): boolean => {
    let success = false;

    setProjects((prev) =>
      prev.map((project) => {
        if (project.id === projectId) {
          const filteredComments = (project.comments || []).filter(
            (comment) => comment.id !== commentId
          );
          success = filteredComments.length !== (project.comments || []).length;

          return {
            ...project,
            comments: filteredComments,
            updatedAt: new Date(),
          };
        }
        return project;
      })
    );

    return success;
  };

  const likeProjectComment = (
    projectId: string,
    commentId: string,
    userId: string
  ): boolean => {
    let success = false;

    setProjects((prev) =>
      prev.map((project) => {
        if (project.id === projectId) {
          const updatedComments = (project.comments || []).map((comment) => {
            if (comment.id === commentId) {
              const likes = comment.likes || [];
              const dislikes = comment.dislikes || [];

              const newDislikes = dislikes.filter((id) => id !== userId);
              const newLikes = likes.includes(userId)
                ? likes.filter((id) => id !== userId)
                : [...likes, userId];

              success = true;
              return {
                ...comment,
                likes: newLikes,
                dislikes: newDislikes,
                updatedAt: new Date(),
              };
            }
            return comment;
          });

          return {
            ...project,
            comments: updatedComments,
            updatedAt: new Date(),
          };
        }
        return project;
      })
    );

    return success;
  };

  const dislikeProjectComment = (
    projectId: string,
    commentId: string,
    userId: string
  ): boolean => {
    let success = false;

    setProjects((prev) =>
      prev.map((project) => {
        if (project.id === projectId) {
          const updatedComments = (project.comments || []).map((comment) => {
            if (comment.id === commentId) {
              const likes = comment.likes || [];
              const dislikes = comment.dislikes || [];

              const newLikes = likes.filter((id) => id !== userId);
              const newDislikes = dislikes.includes(userId)
                ? dislikes.filter((id) => id !== userId)
                : [...dislikes, userId];

              success = true;
              return {
                ...comment,
                likes: newLikes,
                dislikes: newDislikes,
                updatedAt: new Date(),
              };
            }
            return comment;
          });

          return {
            ...project,
            comments: updatedComments,
            updatedAt: new Date(),
          };
        }
        return project;
      })
    );

    return success;
  };

  const value: DummyDbContextType = {
    // Complaint state
    complaints,
    
    // Complaint CRUD operations
    getComplaints,
    getComplaintById,
    createComplaint,
    updateComplaint,
    deleteComplaint,
    updateComplaintStatus,
    
    // Complaint interaction operations
    likeComplaint,
    dislikeComplaint,
    addComplaintComment,
    updateComplaintComment,
    deleteComplaintComment,
    likeComplaintComment,
    dislikeComplaintComment,

    // Project state
    projects,
    
    // Project CRUD operations
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    
    // Project interaction operations
    likeProject,
    dislikeProject,
    addProjectComment,
    updateProjectComment,
    deleteProjectComment,
    likeProjectComment,
    dislikeProjectComment,
  };

  return (
    <DummyDbContext.Provider value={value}>{children}</DummyDbContext.Provider>
  );
}

// Custom hook to use the context
export function useDummyDb() {
  const context = useContext(DummyDbContext);
  if (context === undefined) {
    throw new Error("useDummyDb must be used within a DummyDbProvider");
  }
  return context;
}
