"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

// Types
export interface Image {
  uri: string;
}

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

export interface ProgressUpdate {
  description: string;
  image?: { uri: string };
  createdAt: Date;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category: ProjectCategory;
  status: ProjectStatus;
  startDate: Date;
  expectedCompletionDate?: Date;
  actualCompletionDate?: Date;
  budget?: number;
  contractor?: string;
  sourceOfFunds?: string;
  location?: ProjectLocation;
  images?: Image[];
  progressPercentage: number;
  progressUpdates?: ProgressUpdate[];
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
  expectedCompletionDate?: Date;
  actualCompletionDate?: Date;
  budget?: number;
  contractor?: string;
  sourceOfFunds?: string;
  location?: ProjectLocation;
  images?: Image[];
  progressPercentage: number;
  progressUpdates?: ProgressUpdate[];
}

export interface UpdateProjectInput {
  title?: string;
  description?: string;
  category?: ProjectCategory;
  status?: ProjectStatus;
  startDate?: Date;
  expectedCompletionDate?: Date;
  actualCompletionDate?: Date;
  budget?: number;
  contractor?: string;
  sourceOfFunds?: string;
  location?: ProjectLocation;
  images?: Image[];
  progressPercentage?: number;
  progressUpdates?: ProgressUpdate[];
}

// Context types
interface ProjectDbContextType {
  projects: Project[];
  getProjects: () => Project[];
  getProjectById: (id: string) => Project | undefined;
  createProject: (input: CreateProjectInput) => Project;
  updateProject: (id: string, input: UpdateProjectInput) => Project | null;
  deleteProject: (id: string) => boolean;
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
const initialProjects: Project[] = [
  {
    id: "p1",
    title: "Community Health Center Renovation",
    description:
      "Complete renovation of the barangay health center including new equipment, upgraded facilities, and improved waiting areas.",
    category: "health",
    status: "ongoing",
    startDate: new Date("2025-11-01"),
    expectedCompletionDate: new Date("2026-02-28"),
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
    progressPercentage: 65,
    progressUpdates: [
      {
        description: "Foundation work completed. Starting wall construction.",
        image: { uri: "https://example.com/progress1.jpg" },
        createdAt: new Date("2025-11-15T10:00:00"),
      },
      {
        description: "Electrical and plumbing installations in progress.",
        image: { uri: "https://example.com/progress2.jpg" },
        createdAt: new Date("2025-12-10T14:30:00"),
      },
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
    expectedCompletionDate: new Date("2026-03-31"),
    budget: 1800000,
    contractor: "LightWorks Inc.",
    sourceOfFunds: "DILG Grant",
    location: {
      latitude: 14.5995,
      longitude: 120.9842,
      address: "Various locations across the barangay",
    },
    images: [],
    progressPercentage: 0,
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
    expectedCompletionDate: new Date("2026-12-31"),
    budget: 850000,
    contractor: "GreenEarth Solutions",
    sourceOfFunds: "Environmental Fund",
    location: {
      latitude: 14.5932,
      longitude: 120.9801,
      address: "Barangay-wide implementation",
    },
    images: [{ uri: "https://example.com/recycling.jpg" }],
    progressPercentage: 40,
    progressUpdates: [
      {
        description: "Distributed color-coded bins to Zone 1 and Zone 2.",
        image: { uri: "https://example.com/bins-distribution.jpg" },
        createdAt: new Date("2025-10-20T09:00:00"),
      },
    ],
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
    expectedCompletionDate: new Date("2027-03-31"),
    budget: 5000000,
    sourceOfFunds: "Provincial Development Fund",
    location: {
      latitude: 14.6012,
      longitude: 120.9778,
      address: "Corner of Sports Ave and Recreation St.",
    },
    images: [{ uri: "https://example.com/sports-plan.jpg" }],
    progressPercentage: 0,
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
    expectedCompletionDate: new Date("2026-05-31"),
    budget: 1200000,
    sourceOfFunds: "Barangay Development Fund",
    images: [],
    progressPercentage: 80,
    progressUpdates: [
      {
        description:
          "Scholarship applications reviewed. 100 students selected and receiving assistance.",
        createdAt: new Date("2025-06-20T11:00:00"),
      },
    ],
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
    expectedCompletionDate: new Date("2025-10-31"),
    actualCompletionDate: new Date("2025-10-28"),
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
    progressPercentage: 100,
    progressUpdates: [
      {
        description:
          "Excavation and drainage pipe installation in Zone 3 completed.",
        image: { uri: "https://example.com/zone3-progress.jpg" },
        createdAt: new Date("2025-05-15T13:00:00"),
      },
      {
        description:
          "Zone 4 flood control infrastructure completed. Final testing in progress.",
        image: { uri: "https://example.com/zone4-progress.jpg" },
        createdAt: new Date("2025-09-20T10:30:00"),
      },
      {
        description: "All work completed successfully. System operational.",
        image: { uri: "https://example.com/completed-system.jpg" },
        createdAt: new Date("2025-10-28T16:00:00"),
      },
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
const ProjectDbContext = createContext<ProjectDbContextType | undefined>(
  undefined
);

// Provider Component
export function ProjectDbProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);

  // Helper function to generate unique IDs
  const generateId = (prefix: string): string => {
    return `${prefix}${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
  };

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
      progressPercentage: input.progressPercentage ?? 0,
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

  const value: ProjectDbContextType = {
    projects,
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    likeProject,
    dislikeProject,
    addProjectComment,
    updateProjectComment,
    deleteProjectComment,
    likeProjectComment,
    dislikeProjectComment,
  };

  return (
    <ProjectDbContext.Provider value={value}>
      {children}
    </ProjectDbContext.Provider>
  );
}

// Custom hook to use the context
export function useProjectDb() {
  const context = useContext(ProjectDbContext);
  if (context === undefined) {
    throw new Error("useProjectDb must be used within a ProjectDbProvider");
  }
  return context;
}
