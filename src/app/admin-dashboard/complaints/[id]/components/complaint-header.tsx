import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, Trash2 } from "lucide-react";

interface ComplaintHeaderProps {
  title: string;
  complaintId: string;
  onBack: () => void;
  onGenerateAI: () => void;
  onDelete: () => void;
  isGeneratingAI: boolean;
}

export function ComplaintHeader({
  title,
  complaintId,
  onBack,
  onGenerateAI,
  onDelete,
  isGeneratingAI,
}: ComplaintHeaderProps) {
  return (
    <div className="flex flex-col justify-between items-start gap-4 xl:flex-row">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="text-sm text-muted-foreground">Complaint ID: {complaintId}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          onClick={onGenerateAI}
          disabled={isGeneratingAI}
          className="gap-2"
        >
          <Sparkles />
          {isGeneratingAI ? "Generating Analysis..." : "Generate AI Analysis"}
        </Button>
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
