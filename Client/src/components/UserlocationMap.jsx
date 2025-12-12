// client/src/components/UserLocationMap.jsx
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// marker icon (aligned)
const markerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -36],
});

function RecenterOn({ coords, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.setView(coords, zoom ?? map.getZoom(), { animate: true });
    }
  }, [coords, zoom, map]);
  return null;
}

export default function UserLocationMap({ city, initialZoom = 10, height = 430 }) {
  const [coords, setCoords] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function geocodeCity(c) {
      if (!c) return;
      setLoading(true);

      // quick local map for common cities (avoid geocoding)
      const quick = {
        bangalore: [12.9716, 77.5946],
        bengaluru: [12.9716, 77.5946],
        chennai: [13.0827, 80.2707],
        mumbai: [19.0760, 72.8777],
        delhi: [28.6139, 77.2090],
        hyderabad: [17.3850, 78.4867],
        kolkata: [22.5726, 88.3639],
      };

      const key = c.trim().toLowerCase();
      if (quick[key]) {
        setCoords(quick[key]);
        setLoading(false);
        return;
      }

      try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(c)}&limit=1`;
        const res = await fetch(url, {
          headers: { "User-Agent": "WaterQualityMonitor/1.0 (youremail@example.com)" },
        });
        const data = await res.json();
        if (data && data.length > 0) {
          setCoords([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
        } else {
          setCoords(null);
        }
      } catch (err) {
        console.error("Geocoding error:", err);
        setCoords(null);
      } finally {
        setLoading(false);
      }
    }

    geocodeCity(city);
  }, [city]);

  return (
    <div className="rounded-xl overflow-hidden shadow-md" style={{ height }}>
      {loading ? (
        <div className="flex items-center justify-center h-full">Loading map...</div>
      ) : coords ? (
        <MapContainer center={coords} zoom={initialZoom} scrollWheelZoom={true} style={{ height: "100%", width: "100%" }} zoomControl={false}>
          <RecenterOn coords={coords} zoom={initialZoom} />
          <ZoomControl position="topright" />
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
          <Marker position={coords} icon={markerIcon}>
            <Popup>{city}</Popup>
          </Marker>
        </MapContainer>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-600">Location not available</div>
      )}
    </div>
  );
}
