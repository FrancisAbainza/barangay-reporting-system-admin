"use client";

import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import { InfoCard } from "@/components/ui/info-card";
import { MapPin, ExternalLink, Navigation } from "lucide-react";
import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";
import type { Project } from "@/types/project";

interface ProjectLocationTabProps {
  project: Project;
}

export function ProjectLocationTab({ project }: ProjectLocationTabProps) {
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

  if (!project.location) {
    return (
      <TabsContent value="location" className="space-y-4 p-6">
        <p className="text-sm text-muted-foreground">No location information available for this project.</p>
      </TabsContent>
    );
  }

  const renderMapWithApiKey = () => (
    <APIProvider apiKey={googleMapsApiKey}>
      <Map
        defaultCenter={{
          lat: project.location!.latitude,
          lng: project.location!.longitude,
        }}
        defaultZoom={16}
        mapId="project-location-map"
        gestureHandling="greedy"
        disableDefaultUI={false}
      >
        <AdvancedMarker
          position={{
            lat: project.location!.latitude,
            lng: project.location!.longitude,
          }}
        />
      </Map>
    </APIProvider>
  );

  const renderMapPlaceholder = () => (
    <div className="w-full h-full flex items-center justify-center bg-muted">
      <p className="text-sm text-muted-foreground">
        Google Maps API key not configured
      </p>
    </div>
  );

  const renderAddressInfo = () => (
    <InfoCard icon={Navigation} title="Address">
      <p className="text-sm text-muted-foreground">{project.location!.address}</p>
    </InfoCard>
  );

  const renderInteractiveMap = () => (
    <InfoCard icon={MapPin} title="Map View">
      <div className="w-full h-150 rounded-lg overflow-hidden border">
        {googleMapsApiKey ? renderMapWithApiKey() : renderMapPlaceholder()}
      </div>
    </InfoCard>
  );

  const renderCoordinatesInfo = () => (
    <InfoCard icon={MapPin} title="Coordinates">
      <div className="space-y-2">
        <p className="text-sm">
          <span className="font-medium">Latitude:</span> {project.location!.latitude}
        </p>
        <p className="text-sm">
          <span className="font-medium">Longitude:</span> {project.location!.longitude}
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-2 gap-2"
          onClick={() => {
            window.open(
              `https://www.google.com/maps?q=${project.location!.latitude},${project.location!.longitude}`,
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
  );

  return (
    <TabsContent value="location" className="space-y-4 p-6">
      {project.location!.address && renderAddressInfo()}
      {renderInteractiveMap()}
      {renderCoordinatesInfo()}
    </TabsContent>
  );
}
