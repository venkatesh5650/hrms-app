import { useState } from "react";
import api from "../../services/api";
import "../../styles/exports/exportCard.css";

export default function ExportCard({ title, description, endpoint, filename }) {
  const [loading, setLoading] = useState(false);

  const download = async () => {
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
      alert("Export failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="export-card">
      <div className="export-info">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>

      <button onClick={download} disabled={loading}>
        {loading ? "Preparing..." : "Download CSV"}
      </button>
    </div>
  );
}
