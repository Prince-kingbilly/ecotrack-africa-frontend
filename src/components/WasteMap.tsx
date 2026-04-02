import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Add custom marker styles
const markerStyles = `
  .custom-marker {
    background: transparent !important;
    border: none !important;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = markerStyles;
  document.head.appendChild(style);
}

// Fix default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Create colored markers without external dependencies
const makeIcon = (color: string) => {
  // Create a simple colored circle marker instead of loading external images
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      background-color: ${color};
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

// User location marker (blue)
const userIcon = makeIcon("#3b82f6");

const icons: Record<string, L.DivIcon> = {
  Waste: makeIcon("#ef4444"), // red
  "Tree Planted": makeIcon("#22c55e"), // green
  Pollution: makeIcon("#f97316"), // orange
};

const reports = [
  { id: 1, type: "Waste", location: "Kigali, Rwanda", status: "Open", lat: -1.9403, lng: 29.8739, time: "2 hours ago" },
  { id: 2, type: "Pollution", location: "Nairobi, Kenya", status: "Investigating", lat: -1.2921, lng: 36.8219, time: "5 hours ago" },
  { id: 3, type: "Tree Planted", location: "Accra, Ghana", status: "Verified", lat: 5.6037, lng: -0.187, time: "1 day ago" },
  { id: 4, type: "Waste", location: "Lagos, Nigeria", status: "Resolved", lat: 6.5244, lng: 3.3792, time: "1 day ago" },
  { id: 5, type: "Pollution", location: "Dar es Salaam, Tanzania", status: "Open", lat: -6.7924, lng: 39.2083, time: "2 days ago" },
  { id: 6, type: "Waste", location: "Addis Ababa, Ethiopia", status: "Open", lat: 9.0192, lng: 38.7525, time: "3 days ago" },
  { id: 7, type: "Tree Planted", location: "Kampala, Uganda", status: "Verified", lat: 0.3476, lng: 32.5825, time: "3 days ago" },
  { id: 8, type: "Pollution", location: "Kinshasa, DRC", status: "Investigating", lat: -4.4419, lng: 15.2663, time: "4 days ago" },
];

const WasteMap = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationLoading, setLocationLoading] = useState(true);

  // Get user's geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setLocationLoading(false);
        },
        (error) => {
          console.log("Location access denied, using default view:", error.message);
          setLocationLoading(false);
          // Use default Africa center if user denies location access
        }
      );
    } else {
      console.log("Geolocation not supported");
      setLocationLoading(false);
    }
  }, []);

  // Initialize map with user location
  useEffect(() => {
    if (!mapRef.current || mapInstance.current || locationLoading) return;

    const map = L.map(mapRef.current).setView(
      userLocation ? [userLocation.lat, userLocation.lng] : [1.5, 20],
      userLocation ? 8 : 3
    );
    mapInstance.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    // Add user's location marker if available
    if (userLocation) {
      L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
        .addTo(map)
        .bindPopup(
          `<div style="font-size:13px"><strong>Your Location</strong><br/>Latitude: ${userLocation.lat.toFixed(4)}<br/>Longitude: ${userLocation.lng.toFixed(4)}</div>`
        );

      // Add a circle showing user's detection radius (5km)
      L.circle([userLocation.lat, userLocation.lng], {
        color: "#3b82f6",
        fillColor: "#3b82f6",
        fillOpacity: 0.1,
        radius: 5000, // 5km
        weight: 2,
        dashArray: "5, 5"
      }).addTo(map);
    }

    // Add waste report markers
    reports.forEach((r) => {
      const distance = userLocation 
        ? calculateDistance(userLocation.lat, userLocation.lng, r.lat, r.lng)
        : null;
      
      L.marker([r.lat, r.lng], { icon: icons[r.type] || new L.Icon.Default() })
        .addTo(map)
        .bindPopup(
          `<div style="font-size:13px">
            <strong>${r.type}</strong><br/>
            ${r.location}<br/>
            <em>${r.status}</em><br/>
            <small>${r.time}</small>
            ${distance ? `<br/><strong>${distance.toFixed(1)} km away</strong>` : ''}
          </div>`
        );
    });

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, [userLocation, locationLoading]);

  return (
    <div className="relative">
      <div ref={mapRef} className="h-full w-full min-h-[400px] z-0" />
      {locationLoading && (
        <div className="absolute top-4 left-4 bg-white px-3 py-2 rounded shadow text-sm">
          📍 Getting your location...
        </div>
      )}
      {userLocation && (
        <div className="absolute top-4 left-4 bg-white px-3 py-2 rounded shadow text-sm">
          ✅ Location found: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
        </div>
      )}
      <div className="absolute bottom-4 left-4 bg-white px-3 py-2 rounded shadow text-xs">
        <div><strong>Legend:</strong></div>
        <div>🔴 Waste</div>
        <div>🟠 Pollution</div>
        <div>🟢 Tree Planted</div>
        <div>🔵 Your Location</div>
      </div>
    </div>
  );
};

// Calculate distance between two coordinates in km
const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export default WasteMap;
