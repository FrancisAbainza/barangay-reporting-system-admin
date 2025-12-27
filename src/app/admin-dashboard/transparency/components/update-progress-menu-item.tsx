"use client";

import { useState } from "react";
import { useProjectDb } from "@/contexts/project-db-context";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { UpdateStatusDialog, type UpdateStatusFormValues } from "./update-status-dialog";
import { RefreshCw } from "lucide-react";
import type { Project } from "@/types/project";

interface UpdateProgressMenuItemProps {
  project: Project;
  onOpenChange?: (open: boolean) => void;
}

export function UpdateProgressMenuItem({ project, onOpenChange }: UpdateProgressMenuItemProps) {
  const { updateProject } = useProjectDb();
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    onOpenChange?.(open);
  };

  const handleSubmit = (data: UpdateStatusFormValues) => {
    const updateData: any = {
      status: data.status,
      progressPercentage: data.progressPercentage,
    };

    // Handle actualCompletionDate based on status
    if (data.status === "completed" && project.status !== "completed") {
      updateData.actualCompletionDate = new Date();
    } else if (data.status !== "completed" && project.status === "completed") {
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
        ...(project.progressUpdates || []),
        newProgressUpdate,
      ];
    }

    updateProject(project.id, updateData);
    setIsOpen(false);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(true);
  };

  return (
    <>
      <DropdownMenuItem onClick={handleClick}>
        <RefreshCw className="h-4 w-4 mr-2" />
        Update Status
      </DropdownMenuItem>

      <UpdateStatusDialog
        open={isOpen}
        onOpenChange={handleOpenChange}
        onSubmit={handleSubmit}
        project={project}
      />
    </>
  );
}
