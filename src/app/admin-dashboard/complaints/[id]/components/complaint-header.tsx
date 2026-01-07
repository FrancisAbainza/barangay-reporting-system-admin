import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash2 } from "lucide-react";
import { GenerateAIButton } from "./generate-ai-button";
import { ComplaintStatusSelect } from "./complaint-status-select";
import { ComplaintType } from "@/types/complaint";
import { useComplaintDb } from "@/contexts/complaint-db-context";
import { useRouter } from "next/navigation";

interface ComplaintHeaderProps {
  complaint: ComplaintType;
}

export function ComplaintHeader({
  complaint,
}: ComplaintHeaderProps) {
  const router = useRouter();
  const { deleteComplaint } = useComplaintDb();

  const handleDeleteComplaint = () => {
    if (confirm("Are you sure you want to delete this complaint?")) {
      deleteComplaint(complaint.id);
      router.push("/admin-dashboard/complaints");
    }
  };

  return (
    <div className="flex flex-col justify-between items-start gap-4 xl:flex-row">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{complaint.title}</h1>
          <p className="text-sm text-muted-foreground">Complaint ID: {complaint.id}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <ComplaintStatusSelect complaint={complaint} />
        <Button
          variant="destructive"
          onClick={handleDeleteComplaint}
          className="gap-2"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      </div>
    </div>
  );
}