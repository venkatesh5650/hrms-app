import ExportHeader from "../../components/exports/ExportHeader";
import ExportCard from "../../components/exports/ExportCard";
import "../../styles/exports/exportsPage.css";

export default function Exports() {
  return (
    <div className="exports-page">
      <div className="exports-card">
        <ExportHeader />

        <div className="exports-description">
          <p>
            The Exports section allows administrators to download structured
            business reports for compliance, audits, analytics, and
            decision-making.
          </p>
          <p>
            These reports are generated in real-time from system data and are
            safe to share with stakeholders, auditors, or leadership teams.
          </p>
        </div>

        <div className="exports-grid">
          <ExportCard
            title="Company Analytics"
            description="High-level KPIs including approvals, team distribution, and activity summary."
            endpoint="/export/analytics"
            filename="analytics_summary.csv"
          />
        </div>
      </div>
    </div>
  );
}
