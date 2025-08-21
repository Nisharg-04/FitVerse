import { useEffect } from "react";
import L from "leaflet";
import "leaflet-routing-machine";
import { useMap } from "react-leaflet";

const RoutingControl = ({ from, to }) => {
  const map = useMap();

  useEffect(() => {
    const control = L.Routing.control({
      waypoints: [L.latLng(from), L.latLng(to)],
      routeWhileDragging: true,
      show: true,
      addWaypoints: true,
      draggableWaypoints: true,
      fitSelectedRoutes: true,
      showAlternatives: false,
      lineOptions: {
        styles: [{ color: "#6FA1EC", weight: 5 }],
        addWaypoints: true,
      },
      createMarker: function (i, wp, nWps) {
        return L.marker(wp.latLng).bindPopup(
          i === 0
            ? "Start"
            : i === nWps - 1
              ? "Destination"
              : `Waypoint ${i + 1}`
        );
      },
    }).addTo(map);

    // Optional: Log distance & time
    control.on("routesfound", function (e) {
      const route = e.routes[0];
      const summary = route.summary;
      const distance = (summary.totalDistance / 1000).toFixed(2); // km
      const time = Math.ceil(summary.totalTime / 60); // minutes
      console.log(`Distance: ${distance} km, Time: ${time} mins`);
    });

    return () => map.removeControl(control);
  }, [from, to, map]);

  return null;
};

export default RoutingControl;
