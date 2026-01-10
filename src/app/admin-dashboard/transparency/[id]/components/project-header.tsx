import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import UpdateProgressButton from "./update-progress-button";
import EditProjectButton from "./edit-project-button";
import { ProjectType } from "@/types/project";
import { useProjectDb } from "@/contexts/project-db-context";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import DeleteButton from "@/components/delete-button";

interface ProjectHeaderProps {
  project: ProjectType;
}

export default function ProjectHeader({
  project,
}: ProjectHeaderProps) {
  const router = useRouter();
  const { deleteProject } = useProjectDb();

  const handleDeleteProject = () => {
    deleteProject(project.id);
    toast.success("Project deleted successfully");
    router.push("/admin-dashboard/transparency");
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
        <EditProjectButton project={project} />
        <UpdateProgressButton project={project} />
        <DeleteButton
          onDelete={handleDeleteProject}
          title="Delete this project?"
          description="This action cannot be undone. This will permanently delete the project and remove it from the system."
          buttonClassName="gap-2"
        />
      </div>
    </div>
  );
}
