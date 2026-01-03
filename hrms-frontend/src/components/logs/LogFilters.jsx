import "../../styles/logs/logFilters.css";

export default function LogFilters({ filters, setFilters }) {
  return (
    <div className="logs-filters">
      <input
        type="text"
        placeholder="Search by User ID..."
        value={filters.user}
        onChange={(e) =>
          setFilters({ ...filters, user: e.target.value })
        }
      />
      <input
        type="text"
        placeholder="Search by Action..."
        value={filters.action}
        onChange={(e) =>
          setFilters({ ...filters, action: e.target.value })
        }
      />
    </div>
  );
}
