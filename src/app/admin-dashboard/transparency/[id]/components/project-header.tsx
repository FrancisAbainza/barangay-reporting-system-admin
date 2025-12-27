import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash2 } from "lucide-react";
import { UpdateProgressButton } from "./update-progress-button";
import { EditProjectButton } from "./edit-project-button";
import { Project } from "@/types/project";
import { useProjectDb } from "@/contexts/project-db-context";
import { useRouter } from "next/navigation";

interface ProjectHeaderProps {
  project: Project;
}

export function ProjectHeader({
  project,
}: ProjectHeaderProps) {
  const router = useRouter();
  const { deleteProject } = useProjectDb();

  const handleDeleteProject = () => {
    if (confirm("Are you sure you want to delete this project?")) {
      deleteProject(project.id);
      router.push("/admin-dashboard/transparency");
    }
  };

  return (
    <div className="flex flex-col justify-between items-start gap-4 xl:flex-row">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{project.title}</h1>
          <p className="text-sm text-muted-foreground">Project ID: {project.id}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          variant="destructive"
          onClick={handleDeleteProject}
          className="gap-2"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
        <UpdateProgressButton project={project} />
        <EditProjectButton project={project} />
      </div>
    </div>
  );
}
