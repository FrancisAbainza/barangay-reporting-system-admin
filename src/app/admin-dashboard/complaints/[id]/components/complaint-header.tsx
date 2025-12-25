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
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
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
          size="lg"
          className="gap-2 font-semibold"
        >
          <Sparkles className="h-5 w-5" />
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
