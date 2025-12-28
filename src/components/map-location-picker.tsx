"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { MapPin, Navigation, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { ProjectLocation } from "@/types/project";

interface MapLocationPickerProps {
  value?: ProjectLocation | null;
  onChange: (location: ProjectLocation | null) => void;
}

// Dynamically import the map component to avoid SSR issues
const MapPickerComponent = dynamic(() => import("@/components/map-picker-component"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] bg-muted rounded-md flex items-center justify-center">
      <p className="text-sm text-muted-foreground">Loading map...</p>
    </div>
  ),
});

export function MapLocationPicker({ value, onChange }: MapLocationPickerProps) {
  const [isGeocoding, setIsGeocoding] = useState(false);

  const fetchAddress = async (lat: number, lng: number) => {
    setIsGeocoding(true);
    try {
      const geocoder = new google.maps.Geocoder();
      const result = await geocoder.geocode({
        location: { lat, lng },
      });

      if (result.results && result.results[0]) {
        const address = result.results[0].formatted_address;
        onChange({ latitude: lat, longitude: lng, address });
      } else {
        onChange({ latitude: lat, longitude: lng, address: "Unknown location" });
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      onChange({ latitude: lat, longitude: lng, address: `${lat.toFixed(6)}, ${lng.toFixed(6)}` });
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleMapClick = (lat: number, lng: number) => {
    fetchAddress(lat, lng);
  };

  const handleUseCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          fetchAddress(lat, lng);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Unable to get your current location. Please check your browser permissions.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const handleClear = () => {
    onChange(null);
  };

  return (
    <div className="space-y-4">
      <Card className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Click on map to select location</span>
          </div>
          {value && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Interactive Map */}
        <div className="relative">
          <MapPickerComponent
            position={
              value
                ? { lat: value.latitude, lng: value.longitude }
                : null
            }
            onLocationSelect={handleMapClick}
          />
          {isGeocoding && (
            <div className="absolute inset-0 bg-background/50 flex items-center justify-center rounded-md">
              <div className="flex items-center gap-2 text-sm">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Getting address...</span>
              </div>
            </div>
          )}
        </div>

        {/* Use Current Location Button */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleUseCurrentLocation}
          className="w-full"
          disabled={isGeocoding}
        >
          <Navigation className="h-4 w-4 mr-2" />
          Use Current Location
        </Button>

        {/* Selected Location Display */}
        {value && (
          <div className="p-3 bg-muted rounded-md text-sm space-y-1">
            <p className="font-medium">Selected Location</p>
            <p className="text-muted-foreground">{value.address}</p>
            <p className="text-xs text-muted-foreground">
              {value.latitude.toFixed(6)}, {value.longitude.toFixed(6)}
            </p>
          </div>
        )}
      </Card>

      <p className="text-xs text-muted-foreground">
        Click anywhere on the map to set the project location. The address will be automatically generated.
      </p>
    </div>
  );
}
