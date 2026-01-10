import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import ComplaintStatusSelect from "./complaint-status-select";
import { ComplaintType } from "@/types/complaint";
import { useComplaintDb } from "@/contexts/complaint-db-context";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import DeleteButton from "@/components/delete-button";

interface ComplaintHeaderProps {
  complaint: ComplaintType;
}

export default function ComplaintHeader({
  complaint,
}: ComplaintHeaderProps) {
  const router = useRouter();
  const { deleteComplaint } = useComplaintDb();

  const handleDeleteComplaint = () => {
    deleteComplaint(complaint.id);
    toast.success("Complaint deleted successfully");
    router.push("/admin-dashboard/complaints");
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
        <DeleteButton
          onDelete={handleDeleteComplaint}
          title="Delete this complaint?"
          description="This action cannot be undone. This will permanently delete the complaint and remove it from the system."
          buttonClassName="gap-2"
        />
      </div>
    </div>
  );
}