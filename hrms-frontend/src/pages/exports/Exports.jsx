import ExportCard from "../../components/exports/ExportCard";
import "../../styles/exports/exportsPage.css";

export default function Exports() {
  return (
    <div className="page p-6 max-w-7xl mx-auto">
      <div className="mb-6 fade-in">
        <h1 className="text-2xl font-semibold">Exports & Reports</h1>
        <p className="text-sm text-gray-500 mt-1">
          Download structured business reports for analytics and compliance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mt-6 fade-in">
        <ExportCard
          title="Company Analytics"
          description="High-level KPIs including approvals, team distribution, and activity summary."
          endpoint="/export/company-analytics"
          filename="analytics_summary.csv"
        />
        <ExportCard
          title="Approvals Breakdown"
          description="Detailed log of all approval requests, statuses, and reviewer comments."
          endpoint="/export/approvals"
          filename="approvals_breakdown.csv"
        />
        <ExportCard
          title="Team Distribution"
          description="Current headcount mapped across all organizational teams and departments."
          endpoint="/export/team-distribution"
          filename="team_distribution.csv"
        />
        <ExportCard
          title="User Activity"
          description="Comprehensive audit trail of user logins, role changes, and system modifications."
          endpoint="/export/user-activity"
          filename="user_activity.csv"
        />
      </div>
    </div>
  );
}
