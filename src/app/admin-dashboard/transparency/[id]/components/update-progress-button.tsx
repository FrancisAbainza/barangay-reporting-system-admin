"use client";

import { useState } from "react";
import { useProjectDb } from "@/contexts/project-db-context";
import { Button } from "@/components/ui/button";
import UpdateStatusDialog from "../../components/update-progress-dialog";
import { type UpdateProgressFormValues } from "@/schemas/project.schema";
import { RefreshCw } from "lucide-react";
import type { ProjectType, ProgressUpdateType } from "@/types/project";

interface UpdateProgressButtonProps {
  project: ProjectType;
}

export default function UpdateProgressButton({ project }: UpdateProgressButtonProps) {
  const { updateProject } = useProjectDb();
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (data: UpdateProgressFormValues & { deletedProgressUpdateIndices?: number[] }) => {
    const updateData: Partial<ProjectType> = {
      status: data.status,
      progressPercentage: data.progressPercentage,
    };

    if (data.status === "completed" && project.status !== "completed") {
      updateData.actualCompletionDate = new Date();
    } else if (data.status !== "completed" && project.status === "completed") {
      updateData.actualCompletionDate = undefined;
    }

    if (data.progressUpdateDescription) {
      const newProgressUpdate: ProgressUpdateType = {
        description: data.progressUpdateDescription,
        createdAt: new Date(),
      };
      
      if (data.progressUpdateImage) {
        const imageUri = data.progressUpdateImage instanceof File 
          ? URL.createObjectURL(data.progressUpdateImage) 
          : data.progressUpdateImage;
        newProgressUpdate.image = { uri: imageUri };
      }
      
      updateData.progressUpdates = [
        ...(project.progressUpdates || []),
        newProgressUpdate,
      ];
    }

    // Handle deleted progress updates
    if (data.deletedProgressUpdateIndices && data.deletedProgressUpdateIndices.length > 0) {
      updateData.progressUpdates = (project.progressUpdates || []).filter(
        (_, index) => !data.deletedProgressUpdateIndices!.includes(index)
      );
    }

    updateProject(project.id, updateData);
    setIsOpen(false);
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)} variant="default">
        <RefreshCw className="mr-2 h-4 w-4" />
        Update Progress
      </Button>

      <UpdateStatusDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        onSubmit={handleSubmit}
        project={project}
      />
    </>
  );
}
