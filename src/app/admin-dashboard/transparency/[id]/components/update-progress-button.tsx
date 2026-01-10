"use client";

import { useRef } from "react";
import { useProjectDb } from "@/contexts/project-db-context";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger, DialogClose, DialogHeader, DialogDescription } from "@/components/ui/dialog";
import UpdateProgressForm from "@/components/update-progress-form";
import { type UpdateProgressFormValues } from "@/schemas/project.schema";
import { RefreshCw } from "lucide-react";
import type { ProgressUpdateType, ProjectType, UpdateProjectInputType } from "@/types/project";
import { toast } from "sonner";

interface UpdateProgressButtonProps {
  project: ProjectType;
}

export default function UpdateProgressButton({ project }: UpdateProgressButtonProps) {
  const { updateProject } = useProjectDb();
  const closeRef = useRef<HTMLButtonElement>(null);

  const handleSubmit = (
    data: UpdateProgressFormValues,
    deletedProgressUpdateIndices: number[]
  ) => {
    const updateData: UpdateProjectInputType = {
      status: data.status,
      progressPercentage: data.progressPercentage,
    };

    if (data.status === "completed" && project.status !== "completed") {
      updateData.actualCompletionDate = new Date();
    } else if (data.status !== "completed" && project.status === "completed") {
      updateData.actualCompletionDate = undefined;
    }

    // Add new progress updates
    const description = data.progressUpdateDescription
      ? data.progressUpdateDescription
      : undefined;

    const image = data.progressUpdateImage
      ? { uri: URL.createObjectURL(data.progressUpdateImage) }
      : undefined;

    const newProgressUpdate: ProgressUpdateType = {
      description: description,
      image,
      createdAt: new Date(),
    };

    updateData.progressUpdates = [
      ...(project.progressUpdates || []),
      newProgressUpdate,
    ];

    // Handle deleted progress updates
    if (deletedProgressUpdateIndices.length > 0) {
      updateData.progressUpdates = (project.progressUpdates || []).filter(
        (_, index) => !deletedProgressUpdateIndices.includes(index)
      );
    }

    updateProject(project.id, updateData);

    toast.success("Success!", {
      description: "Project progress updated successfully",
    });

    closeRef.current?.click();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">
          <RefreshCw className="mr-2 h-4 w-4" />
          Update Progress
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Project Progress</DialogTitle>
          <DialogDescription>
            Update the status and progress of the project
          </DialogDescription>
        </DialogHeader>
        <UpdateProgressForm handleSubmit={handleSubmit} project={project} />
        <DialogClose ref={closeRef} className="hidden" />
      </DialogContent>
    </Dialog>
  );
}
