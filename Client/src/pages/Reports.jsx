// client/src/pages/Reports.jsx
import ReportForm from "../components/ReportForm";
import ReportTable from "../components/ReportTable";

export default function Reports() {
  const role = localStorage.getItem("role");
  const isAdmin = role === "admin" || role === "authority";

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">
        {isAdmin ? "Manage Reports" : "My Reports"}
      </h2>

      {!isAdmin && (
        <ReportForm onSuccess={() => window.location.reload()} />
      )}

      <ReportTable admin={isAdmin} />
    </div>
  );
}
