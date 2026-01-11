"use client";

import { useCallback, useState, useEffect, useMemo } from "react";
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from "@react-google-maps/api";
import { Card, CardContent } from "@/components/ui/card";
import type { ComplaintType } from "@/types/complaint";
import type { ProjectType } from "@/types/project";
import ComplaintInfoWindow from "./complaint-info-window";
import ProjectInfoWindow from "./project-info-window";
import HeatmapOverlay from "./heatmap-overlay";

interface MapDisplayProps {
  complaints?: ComplaintType[];
  projects?: ProjectType[];
  type: "complaints" | "transparency";
  showHeatmap?: boolean;
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

export default function MapDisplay({ complaints, projects, type, showHeatmap = false }: MapDisplayProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey || "",
    libraries: ["places", "visualization"],
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

  // Prepare heatmap data
  const heatmapData = useMemo(() => {
    if (!isLoaded) return [];
    
    const items = type === "complaints" ? complaints : projects;
    return items
      ?.filter((item) => item.location)
      .map((item) => 
        new google.maps.LatLng(
          item.location!.latitude,
          item.location!.longitude
        )
      ) || [];
  }, [complaints, projects, type, isLoaded]);

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
            {/* Heatmap Overlay Component */}
            <HeatmapOverlay map={map} data={heatmapData} show={showHeatmap} />

            {/* Markers - hide when heatmap is active */}
            {!showHeatmap && type === "complaints" && complaints?.map((complaint) => {
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
                      position={{
                        lat: complaint.location.latitude,
                        lng: complaint.location.longitude,
                      }}
                      onCloseClick={() => setSelectedMarker(null)}
                      options={{
                        pixelOffset: new google.maps.Size(0, -10),
                      }}
                    >
                      <ComplaintInfoWindow complaint={complaint} />
                    </InfoWindow>
                  )}
                </Marker>
              );
            })}

            {!showHeatmap && type === "transparency" && projects?.map((project) => {
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
                      position={{
                        lat: project.location.latitude,
                        lng: project.location.longitude,
                      }}
                      onCloseClick={() => setSelectedMarker(null)}
                      options={{
                        pixelOffset: new google.maps.Size(0, -10),
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