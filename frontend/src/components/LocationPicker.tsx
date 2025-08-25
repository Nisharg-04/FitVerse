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
          gestureHandling: isStandalone ? "cooperative" : "auto", // Better touch handling in PWA mode
          zoomControl: !isStandalone, // Hide zoom controls on mobile PWA for more space
        });

        const markerInstance = new google.maps.Marker({
          map: mapInstance,
          draggable: true,
          position: initialLocation,
        });

        // Disable pinch-zoom on the map to prevent conflicts with browser gestures in PWA
        if (isStandalone) {
          // Add a listener to handle touch events better in PWA mode
          mapInstance.addListener("drag", () => {
            mapInstance.setOptions({ draggable: true });
          });

          // Add custom touch handlers for better PWA experience
          mapRef.current.addEventListener(
            "touchstart",
            (e) => {
              if (e.touches.length > 1) {
                e.preventDefault(); // Prevent pinch zoom on the map container
              }
            },
            { passive: false }
          );
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
  }, [initialLocation, onLocationSelect, isStandalone]);

  return (
    <div
      className="map-container w-full h-full touch-manipulation"
      ref={mapRef}
    />
  );
}
