// client/src/components/Navbars.jsx
import React from "react";

export default function Navbars({ user, onLogout }) {
  return (
    <header className="bg-white shadow px-6 py-3 flex justify-between items-center">
      <div className="font-bold text-lg">WaterWatch</div>
      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-700">{user?.name} — {user?.role}</div>
        <button onClick={onLogout} className="bg-red-500 text-white px-3 py-1 rounded">Logout</button>
      </div>
    </header>
  );
}
