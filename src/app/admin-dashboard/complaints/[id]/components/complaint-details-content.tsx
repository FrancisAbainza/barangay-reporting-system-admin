"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useComplaintDb } from "@/contexts/complaint-db-context";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, FileText, MapPin, MessageSquare } from "lucide-react";
import type { Complaint, ComplaintStatus } from "@/types/complaint";
import { ResolutionDialog } from "../../components/resolution-dialog";
import { ScheduledDialog } from "../../components/scheduled-dialog";
import { ComplaintHeader } from "./complaint-header";
import { ComplaintStatusCard } from "./complaint-status-card";
import { ComplaintDetailsTab } from "./complaint-details-tab";
import { ComplaintLocationTab } from "./complaint-location-tab";
import { ComplaintEngagementTab } from "./complaint-engagement-tab";
import { ComplaintAIAnalysisTab } from "./complaint-ai-analysis-tab";
import { getStatusBadge, getPriorityBadge, getCategoryLabel, getCategoryBadge } from "@/lib/complaint-helpers";

interface ComplaintDetailsContentProps {
  complaint: Complaint | null;
}

export function ComplaintDetailsContent({ complaint }: ComplaintDetailsContentProps) {
  const router = useRouter();
  const { 
    updateComplaintStatus, 
    deleteComplaint, 
    updateComplaint, 
    addComplaintComment,
    addReply,
    generateAIAnalysis,
    generateCommunitySentiment
  } = useComplaintDb();
  
  const [isResolutionDialogOpen, setIsResolutionDialogOpen] = useState(false);
  const [resolutionDescription, setResolutionDescription] = useState("");
  const [resolutionBudget, setResolutionBudget] = useState("");
  const [isScheduledDialogOpen, setIsScheduledDialogOpen] = useState(false);
  const [scheduledDate, setScheduledDate] = useState("");
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [isGeneratingSentiment, setIsGeneratingSentiment] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

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
      if (complaint.status === "resolved" && newStatus !== "resolved") {
        updateComplaint(complaint.id, {
          resolutionDetails: undefined,
        });
      }
      
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

  const handleAddAdminComment = (content: string) => {
    addComplaintComment(
      complaint.id,
      "admin1",
      "Admin Staff",
      content,
      true
    );
  };

  const handleAddReply = (commentId: string, content: string) => {
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
    } catch (error) {
      console.error("Error generating community sentiment:", error);
      alert("Failed to generate community sentiment. Please try again.");
    } finally {
      setIsGeneratingSentiment(false);
    }
  };

  return (
    <div className="container p-6 space-y-6">
      <ComplaintHeader
        title={complaint.title}
        complaintId={complaint.id}
        onBack={() => router.back()}
        onGenerateAI={handleGenerateAIAnalysis}
        onDelete={handleDeleteComplaint}
        isGeneratingAI={isGeneratingAI}
      />

      <ComplaintStatusCard
        status={complaint.status}
        priority={complaint.priority}
        category={complaint.category}
        onStatusChange={handleStatusChange}
      />

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

          <ComplaintDetailsTab complaint={complaint} />
          <ComplaintLocationTab complaint={complaint} />
          <ComplaintEngagementTab
            complaint={complaint}
            onAddComment={handleAddAdminComment}
            onAddReply={handleAddReply}
            onGenerateCommunitySentiment={handleGenerateCommunitySentiment}
            isGeneratingSentiment={isGeneratingSentiment}
          />
          <ComplaintAIAnalysisTab
            isGenerating={isGeneratingAI}
            analysis={complaint.aiAnalysis || null}
            onGenerate={handleGenerateAIAnalysis}
          />
        </Tabs>
      </Card>

      <ResolutionDialog
        isOpen={isResolutionDialogOpen}
        onOpenChange={setIsResolutionDialogOpen}
        resolutionDescription={resolutionDescription}
        setResolutionDescription={setResolutionDescription}
        resolutionBudget={resolutionBudget}
        setResolutionBudget={setResolutionBudget}
        onSubmit={handleResolveComplaint}
      />

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
