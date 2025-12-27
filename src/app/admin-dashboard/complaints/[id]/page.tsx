"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useComplaintDb } from "@/contexts/complaint-db-context";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, FileText, MapPin, MessageSquare } from "lucide-react";
import type { Complaint, ComplaintStatus, ComplaintCategory, ComplaintAiAnalysis } from "@/types/complaint";
import { ResolutionDialog } from "../components/resolution-dialog";
import { ScheduledDialog } from "../components/scheduled-dialog";
import { ComplaintHeader } from "./components/complaint-header";
import { ComplaintStatusCard } from "./components/complaint-status-card";
import { ComplaintDetailsTab } from "./components/complaint-details-tab";
import { ComplaintLocationTab } from "./components/complaint-location-tab";
import { ComplaintEngagementTab } from "./components/complaint-engagement-tab";
import { ComplaintAIAnalysisTab } from "./components/complaint-ai-analysis-tab";
import { getStatusBadge, getPriorityBadge, getCategoryLabel, getCategoryBadge } from "@/lib/complaint-helpers";
import { formatDate } from "@/lib/date-formatter";

export default function ComplaintDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const complaintId = params.id as string;
  const { 
    complaints, 
    updateComplaintStatus, 
    deleteComplaint, 
    updateComplaint, 
    addComplaintComment,
    addReply,
    generateAIAnalysis,
    generateCommunitySentiment
  } = useComplaintDb();
  
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [adminComment, setAdminComment] = useState("");
  const [isResolutionDialogOpen, setIsResolutionDialogOpen] = useState(false);
  const [resolutionDescription, setResolutionDescription] = useState("");
  const [resolutionBudget, setResolutionBudget] = useState("");
  const [isScheduledDialogOpen, setIsScheduledDialogOpen] = useState(false);
  const [scheduledDate, setScheduledDate] = useState("");
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [isGeneratingSentiment, setIsGeneratingSentiment] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    const foundComplaint = complaints.find((c) => c.id === complaintId);
    setComplaint(foundComplaint || null);
  }, [complaintId, complaints]);

  if (!complaint) {
    return (
      <div className="container p-6">
        <ComplaintHeader
          title="Complaint Not Found"
          complaintId=""
          onBack={() => router.back()}
          onGenerateAI={() => {}}
          onDelete={() => {}}
          isGeneratingAI={false}
        />
        <p className="text-muted-foreground mt-6">The requested complaint could not be found.</p>
      </div>
    );
  }

  const handleStatusChange = (newStatus: ComplaintStatus) => {
    if (newStatus === "resolved" && !complaint.resolutionDetails) {
      setIsResolutionDialogOpen(true);
    } else if (newStatus === "scheduled" && !complaint.scheduledAt) {
      setIsScheduledDialogOpen(true);
    } else {
      // Remove resolutionDetails when changing away from resolved status
      if (complaint.status === "resolved" && newStatus !== "resolved") {
        updateComplaint(complaint.id, {
          resolutionDetails: undefined,
        });
      }
      
      // Remove scheduledAt when changing to under_review or submitted
      if (newStatus === "under_review" || newStatus === "submitted") {
        updateComplaint(complaint.id, {
          scheduledAt: undefined,
        });
      }
      
      updateComplaintStatus(complaint.id, newStatus);
    }
  };

  const handleResolveComplaint = () => {
    if (!resolutionDescription.trim()) {
      alert("Please provide resolution details");
      return;
    }

    const budget = resolutionBudget ? parseFloat(resolutionBudget) : undefined;
    
    updateComplaint(complaint.id, {
      resolutionDetails: {
        description: resolutionDescription,
        budget,
      },
    });

    updateComplaintStatus(complaint.id, "resolved");
    
    setResolutionDescription("");
    setResolutionBudget("");
    setIsResolutionDialogOpen(false);
  };

  const handleScheduleComplaint = () => {
    if (!scheduledDate) {
      alert("Please select a scheduled date");
      return;
    }

    updateComplaint(complaint.id, {
      scheduledAt: new Date(scheduledDate),
    });

    updateComplaintStatus(complaint.id, "scheduled");
    
    setScheduledDate("");
    setIsScheduledDialogOpen(false);
  };

  const handleAddAdminComment = () => {
    if (!adminComment.trim()) {
      return;
    }

    addComplaintComment(
      complaint.id,
      "admin1",
      "Admin Staff",
      adminComment,
      true
    );

    setAdminComment("");
  };

  const handleAddReply = (commentId: string, content: string) => {
    if (!content.trim()) {
      return;
    }

    addReply(
      complaint.id,
      commentId,
      "admin1",
      "Admin Staff",
      content,
      true
    );
  };

  const handleDeleteComplaint = () => {
    if (confirm("Are you sure you want to delete this complaint?")) {
      deleteComplaint(complaint.id);
      router.push("/admin-dashboard/complaints");
    }
  };

  const handleGenerateAIAnalysis = async () => {
    setIsGeneratingAI(true);
    setActiveTab("ai-analysis");
    
    try {
      await generateAIAnalysis(complaint.id);
      // The complaint will be updated in the context, and useEffect will refresh it
    } catch (error) {
      console.error("Error generating AI analysis:", error);
      alert("Failed to generate AI analysis. Please try again.");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleGenerateCommunitySentiment = async () => {
    setIsGeneratingSentiment(true);
    
    try {
      await generateCommunitySentiment(complaint.id);
      // The complaint will be updated in the context, and useEffect will refresh it
    } catch (error) {
      console.error("Error generating community sentiment:", error);
      alert("Failed to generate community sentiment. Please try again.");
    } finally {
      setIsGeneratingSentiment(false);
    }
  };

  return (
    <div className="container p-6 space-y-6">
      {/* Header with Back Button */}
      <ComplaintHeader
        title={complaint.title}
        complaintId={complaint.id}
        onBack={() => router.back()}
        onGenerateAI={handleGenerateAIAnalysis}
        onDelete={handleDeleteComplaint}
        isGeneratingAI={isGeneratingAI}
      />

      {/* Status Update Section */}
      <ComplaintStatusCard
        status={complaint.status}
        priority={complaint.priority}
        category={complaint.category}
        getStatusBadge={getStatusBadge}
        getPriorityBadge={getPriorityBadge}
        getCategoryLabel={getCategoryLabel}
        getCategoryBadge={getCategoryBadge}
        onStatusChange={handleStatusChange}
      />

      {/* Main Content Tabs */}
      <Card>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="details" className="gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Details</span>
            </TabsTrigger>
            <TabsTrigger value="location" className="gap-2">
              <MapPin className="h-4 w-4" />
              <span className="hidden sm:inline">Location</span>
            </TabsTrigger>
            <TabsTrigger value="engagement" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Engagement</span>
            </TabsTrigger>
            <TabsTrigger value="ai-analysis" className="gap-2">
              <Sparkles className="h-4 w-4" />
              <span className="hidden sm:inline">AI Analysis</span>
            </TabsTrigger>
          </TabsList>

          <ComplaintDetailsTab complaint={complaint} formatDate={formatDate} />
          <ComplaintLocationTab complaint={complaint} />
          <ComplaintEngagementTab
            complaint={complaint}
            adminComment={adminComment}
            onAdminCommentChange={setAdminComment}
            onAddComment={handleAddAdminComment}
            onAddReply={handleAddReply}
            onGenerateCommunitySentiment={handleGenerateCommunitySentiment}
            isGeneratingSentiment={isGeneratingSentiment}
            formatDate={formatDate}
          />
          <ComplaintAIAnalysisTab
            isGenerating={isGeneratingAI}
            analysis={complaint.aiAnalysis || null}
            onGenerate={handleGenerateAIAnalysis}
          />
        </Tabs>
      </Card>

      {/* Resolution Dialog */}
      <ResolutionDialog
        isOpen={isResolutionDialogOpen}
        onOpenChange={setIsResolutionDialogOpen}
        resolutionDescription={resolutionDescription}
        setResolutionDescription={setResolutionDescription}
        resolutionBudget={resolutionBudget}
        setResolutionBudget={setResolutionBudget}
        onSubmit={handleResolveComplaint}
      />

      {/* Scheduled Dialog */}
      <ScheduledDialog
        isOpen={isScheduledDialogOpen}
        onOpenChange={setIsScheduledDialogOpen}
        scheduledDate={scheduledDate}
        setScheduledDate={setScheduledDate}
        onSubmit={handleScheduleComplaint}
      />
    </div>
  );
}
