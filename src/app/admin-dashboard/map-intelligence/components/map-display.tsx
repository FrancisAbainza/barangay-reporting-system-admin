"use client";

import { useCallback, useState, useEffect } from "react";
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from "@react-google-maps/api";
import { Card, CardContent } from "@/components/ui/card";
import type { Complaint } from "@/types/complaint";
import type { Project } from "@/types/project";
import { ComplaintInfoWindow } from "./complaint-info-window";
import { ProjectInfoWindow } from "./project-info-window";

interface MapDisplayProps {
  complaints?: Complaint[];
  projects?: Project[];
  type: "complaints" | "transparency";
}

const mapContainerStyle = {
  width: "100%",
  height: "calc(100vh - 300px)",
  minHeight: "500px",
};

// Default center (Manila, Philippines)
const defaultCenter = {
  lat: 14.5995,
  lng: 120.9842,
};

const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: false,
  clickableIcons: true,
  scrollwheel: true,
  zoomControl: true,
  mapTypeControl: true,
  streetViewControl: false,
  fullscreenControl: true,
};

export function MapDisplay({ complaints, projects, type }: MapDisplayProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey || "",
    libraries: ["places"],
  });

  // Calculate map center based on available markers
  const getMapCenter = useCallback(() => {
    const items = type === "complaints" ? complaints : projects;
    const validLocations = items?.filter((item) => item.location) || [];

    if (validLocations.length === 0) {
      return defaultCenter;
    }

    const avgLat = validLocations.reduce((sum, item) => sum + (item.location?.latitude || 0), 0) / validLocations.length;
    const avgLng = validLocations.reduce((sum, item) => sum + (item.location?.longitude || 0), 0) / validLocations.length;

    return { lat: avgLat, lng: avgLng };
  }, [complaints, projects, type]);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  useEffect(() => {
    if (map) {
      const items = type === "complaints" ? complaints : projects;
      const validLocations = items?.filter((item) => item.location) || [];
      
      if (validLocations.length > 0) {
        const bounds = new google.maps.LatLngBounds();
        validLocations.forEach((item) => {
          if (item.location) {
            bounds.extend({
              lat: item.location.latitude,
              lng: item.location.longitude,
            });
          }
        });
        map.fitBounds(bounds);
        
        // Ensure minimum zoom level
        const listener = google.maps.event.addListenerOnce(map, 'bounds_changed', () => {
          const zoom = map.getZoom();
          if (zoom && zoom > 16) {
            map.setZoom(16);
          }
        });
      }
    }
  }, [map, complaints, projects, type]);

  if (!apiKey) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center space-y-2">
            <p className="text-sm font-medium text-destructive">Google Maps API Key Missing</p>
            <p className="text-xs text-muted-foreground">
              Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env.local file
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loadError) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center space-y-2">
            <p className="text-sm font-medium text-destructive">Error loading Google Maps</p>
            <p className="text-xs text-muted-foreground">
              Please check your API key and ensure Maps JavaScript API is enabled
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isLoaded) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Loading map...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const items = type === "complaints" ? complaints : projects;
  const validItems = items?.filter((item) => item.location) || [];

  return (
    <div className="rounded-lg overflow-hidden border border-input">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={getMapCenter()}
        zoom={13}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={mapOptions}
      >
            {type === "complaints" && complaints?.map((complaint) => {
              if (!complaint.location) return null;

              return (
                <Marker
                  key={complaint.id}
                  position={{
                    lat: complaint.location.latitude,
                    lng: complaint.location.longitude,
                  }}
                  onClick={() => setSelectedMarker(complaint.id)}
                >
                  {selectedMarker === complaint.id && (
                    <InfoWindow 
                      onCloseClick={() => setSelectedMarker(null)}
                      options={{
                        pixelOffset: new google.maps.Size(0, -40),
                      }}
                    >
                      <ComplaintInfoWindow complaint={complaint} />
                    </InfoWindow>
                  )}
                </Marker>
              );
            })}

            {type === "transparency" && projects?.map((project) => {
              if (!project.location) return null;

              return (
                <Marker
                  key={project.id}
                  position={{
                    lat: project.location.latitude,
                    lng: project.location.longitude,
                  }}
                  onClick={() => setSelectedMarker(project.id)}
                >
                  {selectedMarker === project.id && (
                    <InfoWindow 
                      onCloseClick={() => setSelectedMarker(null)}
                      options={{
                        pixelOffset: new google.maps.Size(0, -40),
                      }}
                    >
                      <ProjectInfoWindow project={project} />
                    </InfoWindow>
                  )}
                </Marker>
              );
            })}
          </GoogleMap>
    </div>
  );
}