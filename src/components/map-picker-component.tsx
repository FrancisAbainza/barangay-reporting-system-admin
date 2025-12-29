"use client";

import { useCallback, useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

interface MapPickerComponentProps {
  position: { lat: number; lng: number } | null;
  onLocationSelect: (lat: number, lng: number) => void;
}

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

// Default center (Barangay location)
const defaultCenter = {
  lat: 14.318734,
  lng: 121.102831,
};

const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: false,
  clickableIcons: true,
  scrollwheel: true,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: true,
};

export default function MapPickerComponent({ position, onLocationSelect }: MapPickerComponentProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey || "",
    libraries: ["places", "visualization"],
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);

  // Check if API key is missing
  if (!apiKey) {
    return (
      <div className="h-[400px] w-full rounded-md overflow-hidden border border-input bg-muted flex items-center justify-center p-4">
        <div className="text-center space-y-2">
          <p className="text-sm font-medium text-destructive">Google Maps API Key Missing</p>
          <p className="text-xs text-muted-foreground">
            Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env.local file
          </p>
        </div>
      </div>
    );
  }

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
    // Pan to position if it exists
    if (position) {
      map.panTo(position);
    }
  }, [position]);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const handleMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        onLocationSelect(lat, lng);
      }
    },
    [onLocationSelect]
  );

  if (loadError) {
    return (
      <div className="h-[400px] w-full rounded-md overflow-hidden border border-input bg-muted flex items-center justify-center p-4">
        <div className="text-center space-y-2">
          <p className="text-sm font-medium text-destructive">Error loading Google Maps</p>
          <p className="text-xs text-muted-foreground">
            Please check your API key and ensure Maps JavaScript API is enabled
          </p>
          <a 
            href="https://console.cloud.google.com/google/maps-apis" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-primary hover:underline"
          >
            Google Cloud Console
          </a>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="h-[400px] w-full rounded-md overflow-hidden border border-input bg-muted flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading map...</p>
      </div>
    );
  }

  const center = position || defaultCenter;

  // Update map center when position changes
  if (map && position) {
    map.panTo(position);
    map.setZoom(15);
  }

  return (
    <div className="h-[400px] w-full rounded-md overflow-hidden border border-input">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={position ? 15 : 13}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={handleMapClick}
        options={mapOptions}
      >
        {position && <Marker position={position} />}
      </GoogleMap>
    </div>
  );
}
