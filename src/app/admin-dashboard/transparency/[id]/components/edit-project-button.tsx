"use client";

import { useState } from "react";
import { useProjectDb } from "@/contexts/project-db-context";
import { Button } from "@/components/ui/button";
import { ProjectFormDialog } from "../../components/project-form-dialog";
import { Pencil } from "lucide-react";
import type { Project, CreateProjectInput } from "@/types/project";

interface EditProjectButtonProps {
  project: Project;
}

export function EditProjectButton({ project }: EditProjectButtonProps) {
  const { updateProject } = useProjectDb();
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (data: CreateProjectInput) => {
    updateProject(project.id, data);
    setIsOpen(false);
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)} variant="outline">
        <Pencil className="mr-2 h-4 w-4" />
        Edit Project
      </Button>

      <ProjectFormDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        onSubmit={handleSubmit}
        project={project}
      />
    </>
  );
}
