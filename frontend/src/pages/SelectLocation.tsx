import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { LatLngExpression } from "leaflet";

// Default marker fix
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface SelectLocationProps {
  onLocationSelect?: (lat: number, lng: number) => void;
  setSelectedPosition?: (position: [number, number]) => void;
  selectedPosition?: [number, number] | null;
  height?: number;
  width?: number;
}

const SelectLocation: React.FC<SelectLocationProps> = ({
  onLocationSelect,
  setSelectedPosition: externalSetSelectedPosition,
  selectedPosition: externalSelectedPosition,
  height = 30,
  width = 100,
}) => {
  const [internalSelectedPosition, setInternalSelectedPosition] = useState<[number, number] | null>(null);
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);

  const handlePositionChange = (lat: number, lng: number) => {
    const position: [number, number] = [lat, lng];
    if (externalSetSelectedPosition) {
      externalSetSelectedPosition(position);
    } else {
      setInternalSelectedPosition(position);
    }
    if (onLocationSelect) {
      onLocationSelect(lat, lng);
    }
  };

  // Get user location
  useEffect(() => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserPosition([position.coords.latitude, position.coords.longitude]);
      },
      () => {
        alert("Unable to retrieve your location");
      }
    );
  }, []);

  // Component to handle click
  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        handlePositionChange(lat, lng);
        console.log(`Selected position: ${lat}, ${lng}`);
      },
    });

    const currentPosition = externalSelectedPosition || internalSelectedPosition;
    return currentPosition ? (
      <Marker position={currentPosition}></Marker>
    ) : null;
  };

  if (!userPosition) return <p>Fetching your location...</p>;

  return (
    <>
      
      <MapContainer
        center={userPosition}
        zoom={13}
        style={{
          height: `${height}rem`,
          width: `${width}%`,
          position: 'relative',
          zIndex: 1,
          overflow: 'hidden',
          borderRadius: '0.5rem',
          border: '1px solid rgb(229, 231, 235)'
        }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={userPosition}></Marker>
        <LocationMarker />
      </MapContainer>
    </>
  );
};

export default SelectLocation;
