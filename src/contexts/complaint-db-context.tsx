"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import type {
  Image,
  ResolutionDetail,
  ComplaintCategory,
  ComplaintStatus,
  Reply,
  Comment,
  ComplaintAiAnalysis,
  CommunitySentiment,
  Complaint,
  CreateComplaintInput,
  UpdateComplaintInput,
} from "@/types/complaint";

// Re-export types for backward compatibility
export type {
  Image,
  ResolutionDetail,
  ComplaintCategory,
  ComplaintStatus,
  Reply,
  Comment,
  ComplaintAiAnalysis,
  CommunitySentiment,
  Complaint,
  CreateComplaintInput,
  UpdateComplaintInput,
};

// Context types
interface ComplaintDbContextType {
  complaints: Complaint[];
  getComplaints: () => Complaint[];
  getComplaintById: (id: string) => Complaint | undefined;
  createComplaint: (
    input: CreateComplaintInput,
    complainantName: string,
    complainantId: string
  ) => Complaint;
  updateComplaint: (
    id: string,
    input: UpdateComplaintInput
  ) => Complaint | null;
  deleteComplaint: (id: string) => boolean;
  updateComplaintStatus: (
    id: string,
    status: ComplaintStatus
  ) => Complaint | null;
  likeComplaint: (complaintId: string, userId: string) => boolean;
  dislikeComplaint: (complaintId: string, userId: string) => boolean;
  addComplaintComment: (
    complaintId: string,
    userId: string,
    userName: string,
    content: string,
    isAdmin?: boolean
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
  addReply: (
    complaintId: string,
    commentId: string,
    userId: string,
    userName: string,
    content: string,
    isAdmin?: boolean
  ) => Reply | null;
  updateReply: (
    complaintId: string,
    commentId: string,
    replyId: string,
    content: string
  ) => Reply | null;
  deleteReply: (
    complaintId: string,
    commentId: string,
    replyId: string
  ) => boolean;
  likeReply: (
    complaintId: string,
    commentId: string,
    replyId: string,
    userId: string
  ) => boolean;
  dislikeReply: (
    complaintId: string,
    commentId: string,
    replyId: string,
    userId: string
  ) => boolean;
  generateAIAnalysis: (complaintId: string) => Promise<ComplaintAiAnalysis>;
  generateCommunitySentiment: (complaintId: string) => Promise<CommunitySentiment>;
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
    priority: "high",
    complainantName: "Juan Dela Cruz",
    complainantId: "user1",
    location: {
      latitude: 14.5995,
      longitude: 120.9842,
      address: "Corner Main Road, Barangay San Isidro, Manila, Metro Manila",
    },
    images: [
      { uri: `https://picsum.photos/seed/${Math.random()}/1280/720` },
      { uri: `https://picsum.photos/seed/${Math.random()}/1280/720` },
      { uri: `https://picsum.photos/seed/${Math.random()}/1280/720` },
    ],
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
        replies: [
          {
            id: "reply1",
            userId: "admin1",
            userName: "Admin Staff",
            content: "Thank you for your feedback. We've scheduled an inspection for this week.",
            isAdmin: true,
            likes: ["user1", "user2"],
            dislikes: [],
            createdAt: new Date("2025-12-20T14:15:00"),
            updatedAt: new Date("2025-12-20T14:15:00"),
          },
        ],
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
    priority: "medium",
    complainantName: "Maria Santos",
    complainantId: "user2",
    location: {
      latitude: 14.6091,
      longitude: 120.9896,
      address: "Residential Area, Barangay Sta. Cruz, Manila, Metro Manila",
    },
    images: [{ uri: `https://picsum.photos/seed/${Math.random()}/400/250` }],
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
    priority: "urgent",
    complainantName: "Pedro Reyes",
    complainantId: "user3",
    location: {
      latitude: 14.5876,
      longitude: 120.9793,
      address: "Corner Rizal Street, Barangay Tondo, Manila, Metro Manila",
    },
    images: [
      { uri: `https://picsum.photos/seed/${Math.random()}/1280/720` },
      { uri: `https://picsum.photos/seed/${Math.random()}/1280/720` },
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
        replies: [
          {
            id: "reply2",
            userId: "admin1",
            userName: "Admin Staff",
            content: "We understand your concern. Our team is currently working on this issue.",
            isAdmin: true,
            likes: ["user4"],
            dislikes: [],
            createdAt: new Date("2025-12-21T09:00:00"),
            updatedAt: new Date("2025-12-21T09:00:00"),
          },
          {
            id: "reply3",
            userId: "user6",
            userName: "Rosa Cruz",
            content: "How long will it take to resolve this?",
            likes: [],
            dislikes: [],
            createdAt: new Date("2025-12-21T10:30:00"),
            updatedAt: new Date("2025-12-21T10:30:00"),
          },
        ],
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
        replies: [],
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
    priority: "urgent",
    complainantName: "Rosa Martinez",
    complainantId: "user4",
    location: {
      latitude: 14.5945,
      longitude: 120.9912,
      address: "Bonifacio Avenue, Barangay Ermita, Manila, Metro Manila",
    },
    images: [{ uri: `https://picsum.photos/seed/${Math.random()}/1280/720` }],
    resolutionDetails: {
      description:
        "Replaced the damaged section of the main water pipe. Repairs completed successfully.",
      budget: 15000,
      images: [{ uri: `https://picsum.photos/seed/${Math.random()}/1280/720` }],
    },
    resolvedAt: new Date("2025-12-23T16:30:00"),
    likes: ["user1", "user2"],
    dislikes: [],
    comments: [
      {
        id: "comment4",
        userId: "admin1",
        userName: "Admin Staff",
        content: "This has been fixed. Thank you for reporting!",
        isAdmin: true,
        likes: ["user4", "user1", "user2"],
        dislikes: [],
        replies: [],
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
    priority: "high",
    complainantName: "Luis Fernandez",
    complainantId: "user5",
    location: {
      latitude: 14.6125,
      longitude: 120.9756,
      address: "Highway Entrance, Barangay Sampaloc, Manila, Metro Manila",
    },
    images: [{ uri: `https://picsum.photos/seed/${Math.random()}/1280/720` }],
    likes: ["user1", "user3", "user6"],
    dislikes: [],
    comments: [],
    createdAt: new Date("2025-12-22T13:45:00"),
    updatedAt: new Date("2025-12-22T13:45:00"),
  },
];

// Create Context
const ComplaintDbContext = createContext<ComplaintDbContextType | undefined>(
  undefined
);

// Provider Component
export function ComplaintDbProvider({ children }: { children: ReactNode }) {
  const [complaints, setComplaints] = useState<Complaint[]>(initialComplaints);

  // Helper function to generate unique IDs
  const generateId = (prefix: string): string => {
    return `${prefix}${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
  };

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
      priority: "medium",
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
    const complaint = complaints.find(c => c.id === id);
    if (!complaint) return null;

    const updateData: any = { status };
    
    // Set resolvedAt timestamp when marking as resolved
    if (status === "resolved") {
      updateData.resolvedAt = new Date();
    } else if (complaint.status === "resolved") {
      // Clear resolvedAt if changing from resolved to another status
      updateData.resolvedAt = undefined;
    }
    
    // Set scheduledAt timestamp when marking as scheduled
    if (status === "scheduled") {
      updateData.scheduledAt = new Date();
    } else if (complaint.status === "scheduled" && 
               (status === "submitted" || status === "under_review" || status === "dismissed")) {
      // Clear scheduledAt only when changing to submitted, under_review, or dismissed
      updateData.scheduledAt = undefined;
    }
    
    return updateComplaint(id, updateData);
  };

  const likeComplaint = (complaintId: string, userId: string): boolean => {
    let success = false;

    setComplaints((prev) =>
      prev.map((complaint) => {
        if (complaint.id === complaintId) {
          const likes = complaint.likes || [];
          const dislikes = complaint.dislikes || [];

          const newDislikes = dislikes.filter((id) => id !== userId);
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

          const newLikes = likes.filter((id) => id !== userId);
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
    content: string,
    isAdmin?: boolean
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
            isAdmin,
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
          success =
            filteredComments.length !== (complaint.comments || []).length;

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

  const addReply = (
    complaintId: string,
    commentId: string,
    userId: string,
    userName: string,
    content: string,
    isAdmin?: boolean
  ): Reply | null => {
    let newReply: Reply | null = null;

    setComplaints((prev) =>
      prev.map((complaint) => {
        if (complaint.id === complaintId) {
          const updatedComments = (complaint.comments || []).map((comment) => {
            if (comment.id === commentId) {
              newReply = {
                id: generateId("reply"),
                userId,
                userName,
                content,
                isAdmin,
                likes: [],
                dislikes: [],
                createdAt: new Date(),
                updatedAt: new Date(),
              };

              return {
                ...comment,
                replies: [...(comment.replies || []), newReply],
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

    return newReply;
  };

  const updateReply = (
    complaintId: string,
    commentId: string,
    replyId: string,
    content: string
  ): Reply | null => {
    let updatedReply: Reply | null = null;

    setComplaints((prev) =>
      prev.map((complaint) => {
        if (complaint.id === complaintId) {
          const updatedComments = (complaint.comments || []).map((comment) => {
            if (comment.id === commentId) {
              const updatedReplies = (comment.replies || []).map((reply) => {
                if (reply.id === replyId) {
                  updatedReply = {
                    ...reply,
                    content,
                    updatedAt: new Date(),
                  };
                  return updatedReply;
                }
                return reply;
              });

              return {
                ...comment,
                replies: updatedReplies,
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

    return updatedReply;
  };

  const deleteReply = (
    complaintId: string,
    commentId: string,
    replyId: string
  ): boolean => {
    let success = false;

    setComplaints((prev) =>
      prev.map((complaint) => {
        if (complaint.id === complaintId) {
          const updatedComments = (complaint.comments || []).map((comment) => {
            if (comment.id === commentId) {
              const filteredReplies = (comment.replies || []).filter(
                (reply) => reply.id !== replyId
              );
              success = filteredReplies.length !== (comment.replies || []).length;

              return {
                ...comment,
                replies: filteredReplies,
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

  const likeReply = (
    complaintId: string,
    commentId: string,
    replyId: string,
    userId: string
  ): boolean => {
    let success = false;

    setComplaints((prev) =>
      prev.map((complaint) => {
        if (complaint.id === complaintId) {
          const updatedComments = (complaint.comments || []).map((comment) => {
            if (comment.id === commentId) {
              const updatedReplies = (comment.replies || []).map((reply) => {
                if (reply.id === replyId) {
                  const likes = reply.likes || [];
                  const dislikes = reply.dislikes || [];

                  const newDislikes = dislikes.filter((id) => id !== userId);
                  const newLikes = likes.includes(userId)
                    ? likes.filter((id) => id !== userId)
                    : [...likes, userId];

                  success = true;
                  return {
                    ...reply,
                    likes: newLikes,
                    dislikes: newDislikes,
                    updatedAt: new Date(),
                  };
                }
                return reply;
              });

              return {
                ...comment,
                replies: updatedReplies,
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

  const dislikeReply = (
    complaintId: string,
    commentId: string,
    replyId: string,
    userId: string
  ): boolean => {
    let success = false;

    setComplaints((prev) =>
      prev.map((complaint) => {
        if (complaint.id === complaintId) {
          const updatedComments = (complaint.comments || []).map((comment) => {
            if (comment.id === commentId) {
              const updatedReplies = (comment.replies || []).map((reply) => {
                if (reply.id === replyId) {
                  const likes = reply.likes || [];
                  const dislikes = reply.dislikes || [];

                  const newLikes = likes.filter((id) => id !== userId);
                  const newDislikes = dislikes.includes(userId)
                    ? dislikes.filter((id) => id !== userId)
                    : [...dislikes, userId];

                  success = true;
                  return {
                    ...reply,
                    likes: newLikes,
                    dislikes: newDislikes,
                    updatedAt: new Date(),
                  };
                }
                return reply;
              });

              return {
                ...comment,
                replies: updatedReplies,
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

  const generateAIAnalysis = async (complaintId: string): Promise<ComplaintAiAnalysis> => {
    const complaint = complaints.find((c) => c.id === complaintId);
    
    if (!complaint) {
      throw new Error("Complaint not found");
    }

    // Simulate AI analysis generation with delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const getCategoryLabel = (category: ComplaintCategory) => {
      const labels: Record<ComplaintCategory, string> = {
        noise: "Noise",
        sanitation: "Sanitation",
        public_safety: "Public Safety",
        traffic: "Traffic",
        infrastructure: "Infrastructure",
        water_electricity: "Water/Electricity",
        domestic: "Domestic",
        environment: "Environment",
        others: "Others",
      };
      return labels[category];
    };

    // Generate structured AI analysis
    const aiAnalysis: ComplaintAiAnalysis = {
      summary: `This ${getCategoryLabel(complaint.category).toLowerCase()} complaint titled "${complaint.title}" requires ${complaint.priority === 'urgent' || complaint.priority === 'high' ? 'immediate' : 'standard'} attention. ${complaint.description.substring(0, 100)}...`,
      
      suggestedSolution: complaint.category === 'infrastructure' 
        ? '1. Conduct site inspection\n2. Assess damage extent\n3. Prepare materials and equipment\n4. Execute repairs with proper safety measures\n5. Test and verify functionality\n6. Clean up site and document completion'
        : complaint.category === 'sanitation'
        ? '1. Deploy sanitation team immediately\n2. Clear and clean affected area\n3. Sanitize and disinfect the location\n4. Schedule regular maintenance\n5. Monitor for recurrence\n6. Educate residents on proper waste disposal'
        : complaint.category === 'noise'
        ? '1. Verify noise complaint with site visit\n2. Check permits and regulations\n3. Meet with complainant and source\n4. Establish acceptable noise hours\n5. Issue warnings if necessary\n6. Follow up to ensure compliance'
        : '1. Investigate the reported issue\n2. Document findings and evidence\n3. Consult with relevant authorities\n4. Develop action plan\n5. Implement solution\n6. Follow up with complainant',
      
      requiredResources: complaint.category === 'infrastructure'
        ? ['Tools and equipment', 'Replacement parts', 'Safety gear', 'Transport vehicle']
        : complaint.category === 'sanitation'
        ? ['Cleaning supplies', 'Disinfectants', 'Protective equipment', 'Garbage bags', 'Collection truck']
        : complaint.category === 'water_electricity'
        ? ['Technical tools', 'Replacement components', 'Testing equipment', 'Safety gear']
        : ['Basic tools', 'Documentation materials', 'Communication devices'],
      
      estimatedManpower: complaint.priority === 'urgent'
        ? '4-6 personnel (emergency response team)'
        : complaint.priority === 'high'
        ? '3-4 personnel (priority team)'
        : '2-3 personnel (standard team)',
      
      estimatedTimeframe: complaint.priority === 'urgent'
        ? '24-48 hours (immediate response required)'
        : complaint.priority === 'high'
        ? '3-5 days (expedited timeline)'
        : complaint.priority === 'medium'
        ? '1-2 weeks (standard processing)'
        : '2-4 weeks (routine maintenance)',
      
      departmentRouting: complaint.category === 'infrastructure'
        ? 'Public Works & Infrastructure Committee'
        : complaint.category === 'sanitation'
        ? 'Health & Sanitation Committee'
        : complaint.category === 'public_safety'
        ? 'Peace & Order Committee'
        : complaint.category === 'traffic'
        ? 'Traffic Management Committee'
        : complaint.category === 'water_electricity'
        ? 'Utilities & Services Committee'
        : complaint.category === 'environment'
        ? 'Environmental Protection Committee'
        : 'General Services Committee',
      
      budgetEstimate: complaint.priority === 'urgent'
        ? '₱15,000 - ₱50,000'
        : complaint.priority === 'high'
        ? '₱10,000 - ₱30,000'
        : '₱5,000 - ₱20,000',
      
      publicSafetyRisk: complaint.category === 'public_safety'
        ? 'High - Immediate safety concerns for residents'
        : complaint.category === 'infrastructure'
        ? 'Medium - Potential for accidents or injuries'
        : complaint.category === 'water_electricity'
        ? 'Medium - Risk of service disruption or hazards'
        : complaint.priority === 'urgent'
        ? 'Medium - Requires prompt attention'
        : 'Low - No immediate safety threats',
      
      preventionAdvice: complaint.category === 'infrastructure'
        ? 'Implement regular maintenance schedule and quarterly infrastructure inspections. Establish early warning system for deteriorating facilities.'
        : complaint.category === 'sanitation'
        ? 'Increase collection frequency in high-traffic areas. Conduct community education programs on proper waste disposal. Install additional bins where needed.'
        : complaint.category === 'noise'
        ? 'Enforce community noise ordinances. Establish clear guidelines for construction hours. Create community awareness programs.'
        : complaint.category === 'public_safety'
        ? 'Enhance barangay patrol schedules. Improve lighting in vulnerable areas. Establish community watch programs.'
        : 'Conduct regular monitoring and preventive maintenance. Establish community feedback channels for early issue detection.',
    };

    // Update the complaint with the generated AI analysis
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === complaintId) {
          return {
            ...c,
            aiAnalysis,
            updatedAt: new Date(),
          };
        }
        return c;
      })
    );

    return aiAnalysis;
  };

  const generateCommunitySentiment = async (complaintId: string): Promise<CommunitySentiment> => {
    const complaint = complaints.find((c) => c.id === complaintId);
    
    if (!complaint) {
      throw new Error("Complaint not found");
    }

    // Simulate AI sentiment analysis generation with delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const comments = complaint.comments || [];
    let sentiment: 'supportive' | 'positive' | 'negative' | 'neutral';
    let summary: string;

    if (comments.length === 0) {
      sentiment = 'neutral';
      summary = 'No community comments yet on this complaint.';
    } else {
      // Analyze sentiment based on likes and dislikes
      const totalLikes = comments.reduce((sum, c) => sum + (c.likes?.length || 0), 0);
      const totalDislikes = comments.reduce((sum, c) => sum + (c.dislikes?.length || 0), 0);
      const avgLikes = totalLikes / comments.length;
      const avgDislikes = totalDislikes / comments.length;
      
      if (avgLikes >= 3 && avgDislikes < 1) {
        sentiment = 'supportive';
      } else if (avgLikes >= 1 && avgDislikes < avgLikes) {
        sentiment = 'positive';
      } else if (avgDislikes > avgLikes) {
        sentiment = 'negative';
      } else {
        sentiment = 'neutral';
      }
      
      summary = `${comments.length} resident${comments.length > 1 ? 's have' : ' has'} commented on this issue. Community engagement is ${sentiment}.`;
    }

    const communitySentiment: CommunitySentiment = {
      sentiment,
      summary
    };

    // Update the complaint with the generated community sentiment
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === complaintId) {
          return {
            ...c,
            communitySentiment,
            updatedAt: new Date(),
          };
        }
        return c;
      })
    );

    return communitySentiment;
  };

  const value: ComplaintDbContextType = {
    complaints,
    getComplaints,
    getComplaintById,
    createComplaint,
    updateComplaint,
    deleteComplaint,
    updateComplaintStatus,
    likeComplaint,
    dislikeComplaint,
    addComplaintComment,
    updateComplaintComment,
    deleteComplaintComment,
    likeComplaintComment,
    dislikeComplaintComment,
    addReply,
    updateReply,
    deleteReply,
    likeReply,
    dislikeReply,
    generateAIAnalysis,
    generateCommunitySentiment,
  };

  return (
    <ComplaintDbContext.Provider value={value}>
      {children}
    </ComplaintDbContext.Provider>
  );
}

// Custom hook to use the context
export function useComplaintDb() {
  const context = useContext(ComplaintDbContext);
  if (context === undefined) {
    throw new Error("useComplaintDb must be used within a ComplaintDbProvider");
  }
  return context;
}
