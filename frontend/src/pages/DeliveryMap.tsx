import { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { LatLngExpression } from "leaflet";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const defaultPosition = useMemo<LatLngExpression>(() => [22.3072, 73.1812], []); // fallback: Vadodara
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

    const successCallback = (position: GeolocationPosition) => {
      console.log("Got position:", position.coords);
      const { latitude, longitude } = position.coords;
      setUserPosition([latitude, longitude]);
      setLoading(false);
    };

    const errorCallback = (error: GeolocationPositionError) => {
      console.error("Error getting location:", error);
      setUserPosition(defaultPosition);
      setLoading(false);
    };

    const options = {
      enableHighAccuracy: true,
      timeout: 10000, // Increased timeout
      maximumAge: 0
    };

    const watchId = navigator.geolocation.watchPosition(
      successCallback,
      errorCallback,
      options
    );

    // Cleanup the watch when component unmounts
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [defaultPosition]); // Add defaultPosition to dependencies

  // Fetch nearby gyms whenever user position changes
  useEffect(() => {
    async function fetchGyms() {
      if (!userPosition) {
        console.log("No user position yet");
        return;
      }
      
      try {
        console.log("Fetching gyms for position:", userPosition);
        const coords = Array.isArray(userPosition) ? userPosition : [userPosition.lat, userPosition.lng];
        const res = await axios.post(
          "http://localhost:8000/api/gym/nearby-gyms",
          {
            latitude: coords[0],
            longitude: coords[1],
            radius: 10,
          }
        );
        console.log("Fetched gyms response:", res.data);

        const data: Gym[] = res.data.data;

        const locations = data.map((gym) => ({
          position: [
            gym.location.coordinates[1],
            gym.location.coordinates[0],
          ] as LatLngExpression,
          name: gym.name,
          _id: gym._id,
        }));

        console.log("Processed gym locations:", locations);
        setGymsCoord(locations);
      } catch (err) {
        console.error("Failed to fetch gyms:", err);
        if (axios.isAxiosError(err)) {
          console.error("Axios error details:", err.response?.data);
        }
      }
    }

    fetchGyms();
  }, [userPosition]);

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
      zoom={13}
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
              <div className="p-3 max-w-[280px] bg-white rounded-lg shadow-sm">
                <h3 className="text-lg font-bold mb-3 text-primary border-b pb-2">{selectedGym.name}</h3>
                <div className="space-y-3 text-sm">
                  <p className="flex items-start group transition-all duration-200 hover:bg-gray-50 p-1 rounded">
                    <span className="font-semibold min-w-[70px] text-gray-700">Address:</span>
                    <span className="ml-2 text-gray-600 group-hover:text-gray-900">{selectedGym.address}</span>
                  </p>
                  <p className="flex items-start group transition-all duration-200 hover:bg-gray-50 p-1 rounded">
                    <span className="font-semibold min-w-[70px] text-gray-700">Owner:</span>
                    <span className="ml-2 text-gray-600 group-hover:text-gray-900">{selectedGym.owner}</span>
                  </p>
                  <p className="flex items-start group transition-all duration-200 hover:bg-gray-50 p-1 rounded">
                    <span className="font-semibold min-w-[70px] text-gray-700">Contact:</span>
                    <span className="ml-2 text-gray-600 group-hover:text-gray-900">{selectedGym.contact}</span>
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t">
                  <button 
                    onClick={(e) => {
                      e.preventDefault(); // Prevent popup from closing
                      navigate(`/gym/${selectedGym._id}`);
                    }}
                    className="w-full bg-primary text-white py-2.5 px-4 rounded-md hover:bg-primary/90 
                             transition-all duration-200 text-sm font-medium relative group overflow-hidden
                             shadow-md hover:shadow-lg active:scale-[0.98]"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      View Details
                      <svg 
                        className="w-4 h-4 transition-transform duration-200 transform group-hover:translate-x-1" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                    <div className="absolute inset-0 bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer">
                <span className="font-medium text-primary">{gym.name}</span>
                <p className="text-sm text-gray-600 mt-2 flex items-center gap-1.5">
                  <svg className="w-4 h-4 animate-pulse text-primary/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Click to view more details
                </p>
              </div>
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
