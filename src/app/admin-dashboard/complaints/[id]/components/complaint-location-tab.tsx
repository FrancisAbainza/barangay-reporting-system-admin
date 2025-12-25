import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import { MapPin, ExternalLink } from "lucide-react";
import type { Complaint } from "@/contexts/complaint-db-context";

interface ComplaintLocationTabProps {
  complaint: Complaint;
}

export function ComplaintLocationTab({ complaint }: ComplaintLocationTabProps) {
  return (
    <TabsContent value="location" className="space-y-4 p-6">
      <div>
        <h4 className="font-semibold mb-2 flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Location Coordinates
        </h4>
        <div className="space-y-2">
          <p className="text-sm">
            <span className="font-medium">Latitude:</span> {complaint.location.latitude}
          </p>
          <p className="text-sm">
            <span className="font-medium">Longitude:</span> {complaint.location.longitude}
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-2 gap-2"
            onClick={() => {
              window.open(
                `https://www.google.com/maps?q=${complaint.location.latitude},${complaint.location.longitude}`,
                "_blank"
              );
            }}
          >
            <MapPin className="h-4 w-4" />
            View on Google Maps
            <ExternalLink className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </TabsContent>
  );
}
