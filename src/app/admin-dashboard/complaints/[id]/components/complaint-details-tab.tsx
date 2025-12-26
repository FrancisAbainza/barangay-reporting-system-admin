import { TabsContent } from "@/components/ui/tabs";
import { FileText, User, Calendar, CheckCircle, ImageIcon, Receipt } from "lucide-react";
import type { Complaint } from "@/contexts/complaint-db-context";

interface ComplaintDetailsTabProps {
  complaint: Complaint;
  formatDate: (date: Date) => string;
}

export function ComplaintDetailsTab({ complaint, formatDate }: ComplaintDetailsTabProps) {
  return (
    <TabsContent value="details" className="space-y-4 p-6">
      <div className="space-y-4">
        <div>
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Description
          </h4>
          <p className="text-sm text-muted-foreground">{complaint.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold mb-1 flex items-center gap-2">
              <User className="h-4 w-4" />
              Complainant
            </h4>
            <p className="text-sm">{complaint.complainantName}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-1 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Submitted
            </h4>
            <p className="text-sm">{formatDate(complaint.createdAt)}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-1 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Last Updated
            </h4>
            <p className="text-sm">{formatDate(complaint.updatedAt)}</p>
          </div>
          {complaint.resolvedAt && (
            <div>
              <h4 className="font-semibold mb-1 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Resolved
              </h4>
              <p className="text-sm">{formatDate(complaint.resolvedAt)}</p>
            </div>
          )}
        </div>

        {complaint.images && complaint.images.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              Images
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {complaint.images.map((img, idx) => (
                <div
                  key={idx}
                  className="border rounded-lg overflow-hidden"
                >
                  <img 
                    src={img.uri} 
                    alt={`Complaint image ${idx + 1}`}
                    className="w-full h-auto object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {complaint.resolutionDetails && (
          <div className="border-t pt-4">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Resolution Details
            </h4>
            <p className="text-sm mb-2">{complaint.resolutionDetails.description}</p>
            {complaint.resolutionDetails.budget && (
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Receipt className="h-4 w-4" />
                Budget: ₱{complaint.resolutionDetails.budget.toLocaleString()}
              </p>
            )}
          </div>
        )}
      </div>
    </TabsContent>
  );
}
