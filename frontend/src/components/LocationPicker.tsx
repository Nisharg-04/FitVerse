import { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";

// Declare global types for Google Maps
declare global {
  interface Window {
    google: any;
  }
}

interface LocationPickerProps {
  onLocationSelect: (lat: number, lng: number) => void;
  initialLocation?: { lat: number; lng: number };
}

export function LocationPicker({
  onLocationSelect,
  initialLocation,
}: LocationPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState(false);

  // Check if app is running in standalone mode (PWA)
  useEffect(() => {
    const isInStandaloneMode = () =>
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone ||
      document.referrer.includes("android-app://");

    setIsStandalone(isInStandaloneMode());
  }, []);

  useEffect(() => {
    const initMap = async () => {
      try {
        const loader = new Loader({
          apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
          version: "weekly",
        });

        const google = await loader.load();
        if (!mapRef.current) return;

        const defaultLocation = initialLocation || {
          lat: 20.5937,
          lng: 78.9629,
        }; // India center

        const mapInstance = new google.maps.Map(mapRef.current, {
          center: defaultLocation,
          zoom: 5,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          // Standard handling - allows pinch-to-zoom and other native gestures
          gestureHandling: "auto",
          // Always show zoom controls for accessibility
          zoomControl: true,
        });

        const markerInstance = new google.maps.Marker({
          map: mapInstance,
          draggable: true,
          position: initialLocation,
        });

        // Add touch event handling
        if (mapRef.current) {
          // Ensure touch events are properly handled
          mapRef.current.addEventListener("touchmove", (e) => {
            // Allow default touch behavior - this enables natural zoom
            if (e.touches.length === 1) {
              e.stopPropagation();
            }
          });
        }

        mapInstance.addListener("click", (e: any) => {
          const latLng = e.latLng;
          if (latLng) {
            markerInstance.setPosition(latLng);
            onLocationSelect(latLng.lat(), latLng.lng());
          }
        });

        markerInstance.addListener("dragend", () => {
          const position = markerInstance.getPosition();
          if (position) {
            onLocationSelect(position.lat(), position.lng());
          }
        });

        setMap(mapInstance);
        setMarker(markerInstance);

        // If initialLocation is provided, update the marker position
        if (initialLocation) {
          markerInstance.setPosition(initialLocation);
        }
      } catch (error) {
        console.error("Error initializing map:", error);
      }
    };

    initMap();
  }, [initialLocation, onLocationSelect]);

  return (
    <div
      className="map-container"
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
      }}
      ref={mapRef}
    />
  );
}
