"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useComplaintDb } from "@/contexts/complaint-db-context";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles } from "lucide-react";
import type { Complaint, ComplaintStatus, ComplaintCategory, ComplaintAiAnalysis } from "@/contexts/complaint-db-context";
import { ResolutionDialog } from "../components/resolution-dialog";
import { ComplaintHeader } from "./components/complaint-header";
import { ComplaintStatusCard } from "./components/complaint-status-card";
import { ComplaintDetailsTab } from "./components/complaint-details-tab";
import { ComplaintLocationTab } from "./components/complaint-location-tab";
import { ComplaintEngagementTab } from "./components/complaint-engagement-tab";
import { ComplaintAIAnalysisTab } from "./components/complaint-ai-analysis-tab";

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
    generateAIAnalysis 
  } = useComplaintDb();
  
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [adminComment, setAdminComment] = useState("");
  const [isResolutionDialogOpen, setIsResolutionDialogOpen] = useState(false);
  const [resolutionDescription, setResolutionDescription] = useState("");
  const [resolutionBudget, setResolutionBudget] = useState("");
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
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

  const getStatusBadge = (status: ComplaintStatus) => {
    const variants: Record<ComplaintStatus, { className: string, label: string }> = {
      submitted: { className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200", label: "Submitted" },
      under_review: { className: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200", label: "Under Review" },
      scheduled: { className: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200", label: "Scheduled" },
      in_progress: { className: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200", label: "In Progress" },
      resolved: { className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200", label: "Resolved" },
      dismissed: { className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200", label: "Dismissed" },
    };
    return variants[status];
  };

  const getPriorityBadge = (priority: string) => {
    const colors: Record<string, string> = {
      low: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      high: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      urgent: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    };
    return colors[priority] || colors.medium;
  };

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

  const getCategoryBadge = (category: ComplaintCategory) => {
    const colors: Record<ComplaintCategory, string> = {
      noise: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      sanitation: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
      public_safety: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      traffic: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      infrastructure: "bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200",
      water_electricity: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200",
      domestic: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
      environment: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      others: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
    };
    return colors[category];
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleStatusChange = (newStatus: ComplaintStatus) => {
    if (newStatus === "resolved" && !complaint.resolutionDetails) {
      setIsResolutionDialogOpen(true);
    } else {
      if (complaint.status === "resolved" && newStatus !== "resolved") {
        updateComplaint(complaint.id, {
          resolutionDetails: undefined,
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
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="location">Location</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
            <TabsTrigger value="ai-analysis" className="gap-2">
              <Sparkles className="h-4 w-4" />
              AI Analysis
            </TabsTrigger>
          </TabsList>

          <ComplaintDetailsTab complaint={complaint} formatDate={formatDate} />
          <ComplaintLocationTab complaint={complaint} />
          <ComplaintEngagementTab
            complaint={complaint}
            adminComment={adminComment}
            onAdminCommentChange={setAdminComment}
            onAddComment={handleAddAdminComment}
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
    </div>
  );
}
