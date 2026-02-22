import { useState } from "react";
import api from "../../services/api";
import AppSpinner from "../../components/common/AppSpinner";
import { useAuth } from "../../context/AuthContext";
import DemoRestrictionModal from "../common/DemoRestrictionModal";

export default function ExportCard({ title, description, endpoint, filename }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showRestriction, setShowRestriction] = useState(false);

  const download = async () => {
    // 5) DEMO MODE DOWNLOAD RESTRICTION
    if (user?.accountType === "DEMO") {
      setShowRestriction(true);
      return;
    }

    try {
      setLoading(true);
      const res = await api.get(endpoint, { responseType: "blob" });

      const blob = new Blob([res.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export failed:", err);

      // Attempt to extract the real error message if backend returns 400/500 JSON as a Blob
      if (err.response && err.response.data && err.response.data instanceof Blob) {
        try {
          const errorText = await err.response.data.text();
          console.error("Backend Error Description:", errorText);
        } catch (ignored) { }
      }

      alert("Export failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-100 shadow-sm p-6 bg-white">
      <DemoRestrictionModal
        isOpen={showRestriction}
        onClose={() => setShowRestriction(false)}
        message="Report downloads are disabled in demo mode."
      />

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <AppSpinner />
        </div>
      ) : (
        <>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-gray-500 mt-1">{description}</p>

          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 mt-4"
            onClick={download}
          >
            Download CSV
          </button>
        </>
      )}
    </div>
  );
}
