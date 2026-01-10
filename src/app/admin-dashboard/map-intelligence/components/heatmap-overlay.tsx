"use client";

import { useEffect, useRef } from "react";

interface HeatmapOverlayProps {
  map: google.maps.Map | null;
  data: google.maps.LatLng[];
  show: boolean;
}

export default function HeatmapOverlay({ map, data, show }: HeatmapOverlayProps) {
  const heatmapRef = useRef<google.maps.visualization.HeatmapLayer | null>(null);

  useEffect(() => {
    if (!map) return;

    // Check if visualization library is loaded
    if (!google?.maps?.visualization?.HeatmapLayer) {
      console.warn("Google Maps Visualization library is not loaded yet");
      return;
    }

    // Remove existing heatmap
    if (heatmapRef.current) {
      heatmapRef.current.setMap(null);
      heatmapRef.current = null;
    }

    // Create new heatmap if enabled
    if (show && data.length > 0) {
      heatmapRef.current = new google.maps.visualization.HeatmapLayer({
        data: data,
        map: map,
        radius: 30,
        opacity: 0.6,
        dissipating: true,
      });
    }

    // Cleanup function
    return () => {
      if (heatmapRef.current) {
        heatmapRef.current.setMap(null);
        heatmapRef.current = null;
      }
    };
  }, [map, data, show]);

  return null;
}
