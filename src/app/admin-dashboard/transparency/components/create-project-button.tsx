"use client";

import { useState } from "react";
import { useProjectDb } from "@/contexts/project-db-context";
import { Button } from "@/components/ui/button";
import { ProjectFormDialog } from "./project-form-dialog";
import { Plus } from "lucide-react";
import type { CreateProjectInput } from "@/types/project";

export function CreateProjectButton() {
  const { createProject } = useProjectDb();
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (data: CreateProjectInput) => {
    createProject(data);
    setIsOpen(false);
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Create Project
      </Button>

      <ProjectFormDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        onSubmit={handleSubmit}
      />
    </>
  );
}
