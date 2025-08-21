import { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";

interface LocationPickerProps {
  onLocationSelect: (lat: number, lng: number) => void;
  initialLocation?: { lat: number; lng: number };
}

export function LocationPicker({ onLocationSelect, initialLocation }: LocationPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
        version: "weekly",
      });

      const google = await loader.load();
      if (!mapRef.current) return;

      const defaultLocation = initialLocation || { lat: 20.5937, lng: 78.9629 }; // India center
      
      const mapInstance = new google.maps.Map(mapRef.current, {
        center: defaultLocation,
        zoom: 5,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });

      const markerInstance = new google.maps.Marker({
        map: mapInstance,
        draggable: true,
        position: initialLocation,
      });

      mapInstance.addListener("click", (e: google.maps.MapMouseEvent) => {
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
    };

    initMap();
  }, [initialLocation, onLocationSelect]);

  return (
    <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
  );
}
