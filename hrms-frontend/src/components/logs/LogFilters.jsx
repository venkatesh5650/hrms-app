import "../../styles/logs/logFilters.css";

export default function LogFilters({ filters, setFilters }) {
  return (
    <div className="logs-filters">
      <input
        type="text"
        placeholder="Search by User ID..."
        className="bg-white border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-200 px-3 py-2 outline-none"
        value={filters.user}
        onChange={(e) =>
          setFilters({ ...filters, user: e.target.value })
        }
      />
      <input
        type="text"
        placeholder="Search by Action..."
        className="bg-white border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-200 px-3 py-2 outline-none"
        value={filters.action}
        onChange={(e) =>
          setFilters({ ...filters, action: e.target.value })
        }
      />
    </div>
  );
}
