export default function KpiCard({ label, value, subValue }) {
  return (
    <div className="kpi-card">
      <div className="kpi-label">{label}</div>
      <div className="kpi-value">{value}</div>
      {subValue && <div className="kpi-sub">{subValue}</div>}
    </div>
  );
}
