import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const markerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [40, 40],
});

export default function Dashboard() {
  const nav = useNavigate();
  const [coords, setCoords] = useState(null);
  const location = localStorage.getItem("location");

  // Fake conversion: convert city to lat+lng temporarily
  const cityToCoords = {
    bangalore: [12.9716, 77.5946],
    chennai: [13.0827, 80.2707],
    mumbai: [19.076, 72.8777],
    delhi: [28.6139, 77.209],
  };

  useEffect(() => {
    if (location) {
      setCoords(cityToCoords[location.toLowerCase()]);
    }
  }, []);

  function logout() {
    localStorage.clear();
    nav("/");
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button onClick={logout} className="px-4 py-2 bg-red-500 text-white rounded-lg">
          Logout
        </button>
      </div>

      <div className="bg-white shadow-lg rounded-xl p-4">
        <h2 className="text-xl font-semibold mb-3">Your Location on Map</h2>

        {coords ? (
          <MapContainer center={coords} zoom={13} scrollWheelZoom={true}
            className="h-72 w-full rounded-xl shadow-lg">

            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            <Marker position={coords} icon={markerIcon}>
              <Popup>You are here!</Popup>
            </Marker>
          </MapContainer>
        ) : (
          <p className="text-gray-500">Location not found</p>
        )}


      </div>
    </div>
  );
}

