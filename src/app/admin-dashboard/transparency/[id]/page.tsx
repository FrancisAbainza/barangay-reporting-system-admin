"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useProjectDb } from "@/contexts/project-db-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, MapPin, MessageSquare, RefreshCw, Pencil } from "lucide-react";
import type { Project, ProjectStatus, CreateProjectInput } from "@/types/project";
import { ProjectHeader } from "./components/project-header";
import { ProjectStatusCard } from "./components/project-status-card";
import { ProjectDetailsTab } from "./components/project-details-tab";
import { ProjectLocationTab } from "./components/project-location-tab";
import { ProjectEngagementTab } from "./components/project-engagement-tab";
import { UpdateStatusDialog, type UpdateStatusFormValues } from "../components/update-status-dialog";
import { ProjectFormDialog } from "../components/project-form-dialog";
import { getStatusBadge, getCategoryLabel, getCategoryBadge } from "@/lib/project-helpers";
import { formatDate } from "@/lib/date-formatter";

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const {
    projects,
    updateProject,
    deleteProject,
    addProjectComment,
    addReply,
    generateCommunitySentiment
  } = useProjectDb();

  const [project, setProject] = useState<Project | null>(null);
  const [adminComment, setAdminComment] = useState("");
  const [isGeneratingSentiment, setIsGeneratingSentiment] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [isUpdateStatusDialogOpen, setIsUpdateStatusDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    const foundProject = projects.find((p) => p.id === projectId);
    setProject(foundProject || null);
  }, [projectId, projects]);

  if (!project) {
    return (
      <div className="container p-6">
        <ProjectHeader
          title="Project Not Found"
          projectId=""
          onBack={() => router.back()}
          onDelete={() => { }}
        />
        <p className="text-muted-foreground mt-6">The requested project could not be found.</p>
      </div>
    );
  }

  const handleStatusChange = (newStatus: ProjectStatus) => {
    updateProject(project.id, { status: newStatus });
  };

  const handleAddAdminComment = () => {
    if (!adminComment.trim()) {
      return;
    }

    addProjectComment(
      project.id,
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
      project.id,
      commentId,
      "admin1",
      "Admin Staff",
      content,
      true
    );
  };

  const handleGenerateCommunitySentiment = async () => {
    setIsGeneratingSentiment(true);

    try {
      await generateCommunitySentiment(project.id);
    } catch (error) {
      console.error("Error generating community sentiment:", error);
      alert("Failed to generate community sentiment. Please try again.");
    } finally {
      setIsGeneratingSentiment(false);
    }
  };

  const handleDeleteProject = () => {
    if (confirm("Are you sure you want to delete this project?")) {
      deleteProject(project.id);
      router.push("/admin-dashboard/transparency");
    }
  };

  const handleUpdateStatus = (data: UpdateStatusFormValues) => {
    const updateData: any = {
      status: data.status,
      progressPercentage: data.progressPercentage,
    };

    // Handle actualCompletionDate based on status
    if (data.status === "completed" && project?.status !== "completed") {
      // Set actualCompletionDate to today when status changes to completed
      updateData.actualCompletionDate = new Date();
    } else if (data.status !== "completed" && project?.status === "completed") {
      // Clear actualCompletionDate when status changes away from completed
      updateData.actualCompletionDate = undefined;
    }

    if (data.progressUpdateDescription) {
      const newProgressUpdate: any = {
        description: data.progressUpdateDescription,
        createdAt: new Date(),
      };
      
      if (data.progressUpdateImage) {
        newProgressUpdate.image = data.progressUpdateImage;
      }
      
      updateData.progressUpdates = [
        ...(project?.progressUpdates || []),
        newProgressUpdate,
      ];
    }

    updateProject(project!.id, updateData);
  };

  const handleEditProject = (data: CreateProjectInput) => {
    updateProject(project!.id, data);
  };

  return (
    <div className="container p-6 space-y-6">
      {/* Header with Back Button */}
      <ProjectHeader
        title={project.title}
        projectId={project.id}
        onBack={() => router.back()}
        onDelete={handleDeleteProject}
      />

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button onClick={() => setIsUpdateStatusDialogOpen(true)} variant="default">
          <RefreshCw className="mr-2 h-4 w-4" />
          Update Progress
        </Button>
        <Button onClick={() => setIsEditDialogOpen(true)} variant="outline">
          <Pencil className="mr-2 h-4 w-4" />
          Edit Project
        </Button>
      </div>

      {/* Status Update Section */}
      <ProjectStatusCard
        status={project.status}
        category={project.category}
        progressPercentage={project.progressPercentage}
        getStatusBadge={getStatusBadge}
        getCategoryLabel={getCategoryLabel}
        getCategoryBadge={getCategoryBadge}
        onStatusChange={handleStatusChange}
      />

      {/* Main Content Tabs */}
      <Card>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
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
          </TabsList>

          <ProjectDetailsTab project={project} formatDate={formatDate} />
          <ProjectLocationTab project={project} />
          <ProjectEngagementTab
            project={project}
            adminComment={adminComment}
            onAdminCommentChange={setAdminComment}
            onAddComment={handleAddAdminComment}
            onAddReply={handleAddReply}
            onGenerateCommunitySentiment={handleGenerateCommunitySentiment}
            isGeneratingSentiment={isGeneratingSentiment}
            formatDate={formatDate}
          />
        </Tabs>
      </Card>

      {/* Dialogs */}
      <UpdateStatusDialog
        open={isUpdateStatusDialogOpen}
        onOpenChange={setIsUpdateStatusDialogOpen}
        onSubmit={handleUpdateStatus}
        project={project}
      />

      <ProjectFormDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={handleEditProject}
        project={project}
        mode="edit"
      />
    </div>
  );
}
