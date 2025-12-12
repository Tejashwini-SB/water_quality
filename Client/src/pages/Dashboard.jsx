import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const markerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [35, 35],
});

export default function Dashboard() {
  const nav = useNavigate();
  const [coords, setCoords] = useState(null);
  const location = localStorage.getItem("location");

  useEffect(() => {
    if (!location) return nav("/login");

    // Fetch coordinates using OpenStreetMap
    fetch(`https://nominatim.openstreetmap.org/search?city=${location}&format=json`)
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
          setCoords([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
        } else {
          console.log("City not found in geocoding API");
        }
      });
  }, [location]);

  const logout = () => {
    localStorage.clear();
    nav("/login");
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Water Quality Monitor Dashboard</h1>
        <button onClick={logout} className="px-4 py-2 bg-red-500 text-white rounded-lg">
          Logout
        </button>
      </div>

      <div className="h-150 w-250 bg-white shadow-lg rounded-xl p-4">
        <h2 className="text-xl font-semibold mb-3">Your Location on Map</h2>

        {coords ? (
          <MapContainer center={coords} zoom={6} scrollWheelZoom={true} className="h-100 w-200 rounded-xl shadow-lg">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={coords} icon={markerIcon}>
              <Popup>{`You are in ${location}`}</Popup>
            </Marker>
          </MapContainer>
        ) : (
          <p className="text-gray-500">Loading location...</p>
        )}
      </div>
    </div>
  );
}
