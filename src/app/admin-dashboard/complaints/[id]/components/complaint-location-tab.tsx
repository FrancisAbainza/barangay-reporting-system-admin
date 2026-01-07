"use client";

import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import { InfoCard } from "@/components/ui/info-card";
import { MapPin, ExternalLink, Navigation } from "lucide-react";
import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";
import type { ComplaintType } from "@/types/complaint";

interface ComplaintLocationTabProps {
  complaint: ComplaintType;
}

export function ComplaintLocationTab({ complaint }: ComplaintLocationTabProps) {
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

  if (!complaint.location) {
    return (
      <TabsContent value="location" className="space-y-4 p-6">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-sm text-muted-foreground">No location information available for this complaint.</p>
        </div>
      </TabsContent>
    );
  }

  return (
    <TabsContent value="location" className="space-y-4 p-6">
      {complaint.location!.address && (
        <InfoCard icon={Navigation} title="Address">
          <p className="text-sm text-muted-foreground">{complaint.location!.address}</p>
        </InfoCard>
      )}
      
      <InfoCard icon={MapPin} title="Map View">
        <div className="w-full h-150 rounded-lg overflow-hidden border">
          {googleMapsApiKey ? (
            <APIProvider apiKey={googleMapsApiKey}>
              <Map
                defaultCenter={{
                  lat: complaint.location!.latitude,
                  lng: complaint.location!.longitude,
                }}
                defaultZoom={16}
                mapId="complaint-location-map"
                gestureHandling="greedy"
                disableDefaultUI={false}
              >
                <AdvancedMarker
                  position={{
                    lat: complaint.location!.latitude,
                    lng: complaint.location!.longitude,
                  }}
                />
              </Map>
            </APIProvider>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <p className="text-sm text-muted-foreground">
                Google Maps API key not configured
              </p>
            </div>
          )}
        </div>
      </InfoCard>
      
      <InfoCard icon={MapPin} title="Coordinates">
        <div className="space-y-2">
          <p className="text-sm">
            <span className="font-medium">Latitude:</span> {complaint.location!.latitude}
          </p>
          <p className="text-sm">
            <span className="font-medium">Longitude:</span> {complaint.location!.longitude}
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-2 gap-2"
            onClick={() => {
              window.open(
                `https://www.google.com/maps?q=${complaint.location!.latitude},${complaint.location!.longitude}`,
                "_blank"
              );
            }}
          >
            <MapPin className="h-4 w-4" />
            View on Google Maps
            <ExternalLink className="h-3 w-3" />
          </Button>
        </div>
      </InfoCard>
    </TabsContent>
  );
}
