import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";

// Fix leaflet marker issue
const markerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [32, 32],
});

export default function Dashboard() {
  const navigate = useNavigate();

  const [coords, setCoords] = useState(null);
  const [loading, setLoading] = useState(true);

  const location = localStorage.getItem("location");
  const name = localStorage.getItem("name");
  const role = localStorage.getItem("role");

  // Redirect if not logged in
  useEffect(() => {
    if (!location) {
      navigate("/login");
      return;
    }

    fetch(
      `https://nominatim.openstreetmap.org/search?city=${location}&format=json`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) {
          setCoords([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [location, navigate]);

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#F6F8FB] px-6 py-5">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Water Quality Dashboard
          </h1>
          <p className="text-gray-500 mt-1">
            Welcome back, {name || "User"} 👋
          </p>
        </div>

        <button
          onClick={logout}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow"
        >
          Logout
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Section */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-md p-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">
            📍 Water Sources Near You
          </h2>

          {loading ? (
            <div className="h-[380px] flex items-center justify-center text-gray-400">
              Loading map...
            </div>
          ) : coords ? (
            <MapContainer
              center={coords}
              zoom={7}
              scrollWheelZoom={true}
              className="h-[380px] w-full rounded-xl"
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={coords} icon={markerIcon}>
                <Popup>
                  <strong>{location}</strong>
                  <br />
                  Registered Location
                </Popup>
              </Marker>
            </MapContainer>
          ) : (
            <p className="text-gray-500">Location not found.</p>
          )}
        </div>

        {/* Right Panel */}
        <div className="space-y-6">
          {/* Location Card */}
          <div className="bg-white rounded-2xl shadow-md p-5">
            <h3 className="text-sm text-gray-500">Your Area</h3>
            <p className="text-xl font-semibold text-gray-800 mt-1">
              {location}
            </p>
          </div>

          {/* Risk Indicator */}
          <div className="bg-white rounded-2xl shadow-md p-5">
            <h3 className="text-sm text-gray-500 mb-2">
              Water Quality Status
            </h3>

            <div className="flex items-center justify-between">
              <span className="text-green-600 font-semibold">
                ● Low Risk
              </span>
              <span className="text-xs text-gray-400">
                (sample indicator)
              </span>
            </div>

            <p className="text-gray-500 text-sm mt-3">
              Based on recent user reports near your location.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-md p-5">
            <h3 className="text-sm text-gray-500 mb-3">
              Quick Actions
            </h3>

            <div className="flex flex-col gap-3">
              {(role === "citizen" || role === "ngo") && (
                <button
                  onClick={() => navigate("/reports")}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  Upload / View My Reports
                </button>
              )}

              {(role === "admin" || role === "authority") && (
                <button
                  onClick={() => navigate("/reports")}
                  className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
                >
                  Manage Reports
                </button>
              )}

              <button
                onClick={() => window.location.reload()}
                className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg"
              >
                Refresh Map
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
