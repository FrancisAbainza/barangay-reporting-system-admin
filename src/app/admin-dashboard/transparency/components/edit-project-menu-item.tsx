"use client";

import { useState } from "react";
import { useProjectDb } from "@/contexts/project-db-context";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { ProjectFormDialog } from "./project-form-dialog";
import { Pencil } from "lucide-react";
import type { Project, CreateProjectInput } from "@/types/project";

interface EditProjectMenuItemProps {
  project: Project;
  onOpenChange?: (open: boolean) => void;
}

export function EditProjectMenuItem({ project, onOpenChange }: EditProjectMenuItemProps) {
  const { updateProject } = useProjectDb();
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    onOpenChange?.(open);
  };

  const handleSubmit = (data: CreateProjectInput) => {
    updateProject(project.id, data);
    setIsOpen(false);
  };

  const handleSelect = (e: Event) => {
    e.preventDefault();
    setIsOpen(true);
  };

  return (
    <>
      <DropdownMenuItem onSelect={handleSelect}>
        <Pencil className="h-4 w-4 mr-2" />
        Edit Project
      </DropdownMenuItem>

      <ProjectFormDialog
        open={isOpen}
        onOpenChange={handleOpenChange}
        onSubmit={handleSubmit}
        project={project}
      />
    </>
  );
}
