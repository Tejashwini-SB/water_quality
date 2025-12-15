// client/src/components/ReportTable.jsx
import { useEffect, useState } from "react";
import { api } from "../api";

export default function ReportTable({ admin }) {
  const [reports, setReports] = useState([]);

  const fetchReports = async () => {
    const url = admin ? "/reports" : "/reports/my";
    const res = await api.get(url);
    setReports(res.data);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const updateStatus = async (id, status) => {
    await api.patch(`/reports/${id}`, { status });
    fetchReports();
  };

  const statusColor = (status) => {
    if (status === "pending") return "bg-yellow-100 text-yellow-700";
    if (status === "verified") return "bg-green-100 text-green-700";
    if (status === "rejected") return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-600";
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full bg-white rounded-2xl shadow-md text-sm overflow-hidden">
        <thead className="bg-gradient-to-r from-gray-100 to-gray-200">
          <tr>
            <th className="p-3 text-left">📍 Location</th>
            <th className="p-3 text-left">📝 Description</th>
            <th className="p-3 text-left">⚡ Status</th>
            {admin && <th className="p-3 text-left">🛠 Action</th>}
          </tr>
        </thead>

        <tbody>
          {reports.map(r => (
            <tr
              key={r.id}
              className="border-t hover:bg-gray-50 transition"
            >
              <td className="p-3">{r.location}</td>
              <td className="p-3">{r.description}</td>

              <td className="p-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor(r.status)}`}
                >
                  {r.status}
                </span>
              </td>

              {admin && (
                <td className="p-3">
                  <select
                    value={r.status}
                    onChange={e => updateStatus(r.id, e.target.value)}
                    className="border rounded-lg px-2 py-1 focus:ring-2 focus:ring-purple-400 outline-none"
                  >
                    <option value="pending">pending</option>
                    <option value="verified">verified</option>
                    <option value="rejected">rejected</option>
                  </select>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
