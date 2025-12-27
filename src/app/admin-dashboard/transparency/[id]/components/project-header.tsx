import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash2 } from "lucide-react";

interface ProjectHeaderProps {
  title: string;
  projectId: string;
  onBack: () => void;
  onDelete: () => void;
}

export function ProjectHeader({
  title,
  projectId,
  onBack,
  onDelete,
}: ProjectHeaderProps) {
  return (
    <div className="flex flex-col justify-between items-start gap-4 xl:flex-row">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="text-sm text-muted-foreground">Project ID: {projectId}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          variant="destructive"
          onClick={onDelete}
          className="gap-2"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      </div>
    </div>
  );
}
