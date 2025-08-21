import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { LatLngExpression } from "leaflet";
import axios from "axios";

// Fix default marker icon
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import userIconImg from "../../public/profile-user.png";
import gymLogo from "../../public/gymLogo.jpg";
import RoutingControl from "./RoutingControl";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const userIcon = new L.Icon({
  iconUrl: userIconImg,
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

const gymIcon = new L.Icon({
  iconUrl: gymLogo,
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

// Component to recenter map when user position changes
const RecenterMap = ({ center }: { center: LatLngExpression }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 13);
    }
  }, [center, map]);
  return null;
};

interface DeliveryMapProps {
  height?: number; // in rem
  width?: number; // in rem
}

interface Gym {
  _id: string;
  name: string;
  location: {
    coordinates: [number, number]; // [longitude, latitude]
  };
}

interface GymDetails {
  _id: string;
  name: string;
  address: string;
  owner: string;
  contact: string;
  [key: string]: any; // extra fields allowed
}

const DeliveryMap: React.FC<DeliveryMapProps> = ({
  height = 30,
  width = 80,
}) => {
  const defaultPosition: LatLngExpression = [22.3072, 73.1812]; // fallback: Vadodara
  const [userPosition, setUserPosition] = useState<LatLngExpression | null>(null);
  const [loading, setLoading] = useState(true);

  const [gymsCoord, setGymsCoord] = useState<
    { position: LatLngExpression; name: string; _id: string }[]
  >([]);

  const [selectedGym, setSelectedGym] = useState<GymDetails | null>(null);

  // Get user's location
  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported");
      setUserPosition(defaultPosition);
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserPosition([latitude, longitude]);
        setLoading(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        setUserPosition(defaultPosition);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  }, []);

  useEffect(() => {
    async function fetchGyms() {
      if (!userPosition) return;
      
      try {
        const res = await axios.post(
          "http://localhost:8000/api/gym/nearby-gyms",
          {
            longitude: userPosition[1],
            latitude: userPosition[0],
            radius: 10,
          }
        );

        const data: Gym[] = res.data.data;

        const locations = data.map((gym) => ({
          position: [
            gym.location.coordinates[1],
            gym.location.coordinates[0],
          ] as LatLngExpression,
          name: gym.name,
          _id: gym._id,
        }));

        setGymsCoord(locations);
      } catch (err) {
        console.error("Failed to fetch gyms:", err);
      }
    }

    if (userPosition) {
      fetchGyms();
    }
  }, [userPosition]);

  useEffect(() => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords: LatLngExpression = [
          position.coords.latitude,
          position.coords.longitude,
        ];
        setUserPosition(coords);
      },
      () => {
        alert("Unable to retrieve your location");
      }
    );
  }, []);

  const fetchGymDetails = async (id: string) => {
    try {
      const res = await axios
        .get(`http://localhost:8000/api/gym/${id}`)
        .then((res) => res.data)
        .then((data) => data.data);
      console.log(res);

      const gymDetails: GymDetails = {
        _id: res?._id,
        name: res?.name,
        address: res?.address?.addressLine,
        owner: res?.ownerId?.name,
        contact: res?.contactNumber,
      };
      console.log(gymDetails);
      setSelectedGym(gymDetails);
    } catch (err) {
      console.error("Failed to fetch gym details:", err);
    }
  };

  const center = userPosition || defaultPosition;

  if (loading) {
    return (
      <div className="flex items-center justify-center" style={{ height: `${height}rem`, width: `${width}%` }}>
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <MapContainer
      center={center}
      zoom={15}
      style={{
        height: `${height}rem`,
        width: `${width}%`,
        minHeight: '300px'
      }}
    >
      <TileLayer 
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      <RecenterMap center={center} />

      {/* User marker */}
      <Marker position={center} icon={userIcon}>
        <Popup>
          <div className="font-semibold">Your Location</div>
        </Popup>
      </Marker>

      {/* Gym markers */}
      {gymsCoord.map((gym) => (
        <Marker
          key={gym._id}
          position={gym.position}
          icon={gymIcon}
          eventHandlers={{
            click: () => fetchGymDetails(gym._id),
          }}
        >
          <Popup>
            {selectedGym && selectedGym._id === gym._id ? (
              <div>
                <h3>{selectedGym.name}</h3>
                <p>
                  <b>Address:</b> {selectedGym.address}
                </p>
                <p>
                  <b>Owner:</b> {selectedGym.owner}
                </p>
                <p>
                  <b>Contact:</b> {selectedGym.contact}
                </p>
                <p>
                  <b>More details</b>
                </p>
              </div>
            ) : (
              <span>{gym.name} (click to load details...)</span>
            )}
          </Popup>
        </Marker>
      ))}
      {selectedGym && userPosition && (
        <RoutingControl
          from={userPosition}
          to={
            gymsCoord.find((gym) => gym._id === selectedGym._id)?.position ||
            userPosition
          }
        />
      )}
    </MapContainer>
  );
};

export default DeliveryMap;
