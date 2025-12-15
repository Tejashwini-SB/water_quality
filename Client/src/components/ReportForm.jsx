// client/src/components/ReportForm.jsx
import { useState } from "react";
import { api } from "../api";

export default function ReportForm({ onSuccess }) {
  const [form, setForm] = useState({
    location: "",
    description: "",
    water_source: "",
    photo_url: ""
  });

  const submit = async () => {
    await api.post("/reports", form);
    alert("Report submitted (Status: Pending)");
    setForm({ location: "", description: "", water_source: "", photo_url: "" });
    onSuccess();
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-2xl border border-blue-100 shadow-sm">
      <h2 className="font-bold text-xl mb-5 text-blue-700 flex items-center gap-2">
        📝 Upload Water Issue Report
      </h2>

      <div className="space-y-3">
        <input
          placeholder="📍 Location"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          value={form.location}
          onChange={e => setForm({ ...form, location: e.target.value })}
        />

        <input
          placeholder="💧 Water Source (River / Well / Tank)"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          value={form.water_source}
          onChange={e => setForm({ ...form, water_source: e.target.value })}
        />

        <textarea
          placeholder="🖊 Description"
          rows="3"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
        />

        <input
          placeholder="📷 Photo URL (optional)"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          value={form.photo_url}
          onChange={e => setForm({ ...form, photo_url: e.target.value })}
        />
      </div>

      <button
        onClick={submit}
        className="mt-5 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition"
      >
        🚀 Submit Report
      </button>
    </div>
  );
}
