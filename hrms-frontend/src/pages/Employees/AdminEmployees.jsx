import { useEffect, useState, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import EmployeeTable from "../../components/employees/EmployeeTable";
import AppSpinner from "../../components/common/AppSpinner";
import "../../styles/employees/adminEmployees.css";



const API = process.env.REACT_APP_API_BASE_URL;

export default function AdminEmployees() {
  const { token, user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [teamFilter, setTeamFilter] = useState("ALL");
  const [filterMode, setFilterMode] = useState("inclusive");

  useEffect(() => {
    async function load() {
      try {
        const [empRes, teamRes] = await Promise.all([
          fetch(`${API}/employees`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API}/teams`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!empRes.ok || !teamRes.ok) {
          console.error("API failed");
          return;
        }

        const empData = await empRes.json();
        const teamData = await teamRes.json();

        const listData = empData.employees || [];
        const mappedList = listData.map(e => ({
          ...e,
          role: e.User?.role || "EMPLOYEE"
        }));

        setEmployees(mappedList);
        setTeams(teamData.teams || []);
      } catch (err) {
        console.error("Failed to load data:", err);
      } finally {
        setLoading(false);
      }
    }

    if (token) load();
  }, [token]);

  // Build map: employeeId -> teamName
  const employeeTeamMap = useMemo(() => {
    const map = {};
    teams.forEach((t) => {
      t.Employees?.forEach((e) => {
        map[e.id] = t.name;
      });
    });
    return map;
  }, [teams]);

  const teamOptions = useMemo(() => {
    return ["ALL", ...teams.map((t) => t.name)];
  }, [teams]);

  const filteredEmployees = useMemo(() => {
    return employees.filter((e) => {
      const name =
        e.name ||
        e.full_name ||
        `${e.first_name || ""} ${e.last_name || ""}`.trim();

      const matchesName = name.toLowerCase().includes(search.toLowerCase());

      let matchesTeam = true;

      if (teamFilter !== "ALL") {
        if (!e.Teams || e.Teams.length === 0) {
          matchesTeam = false;
        } else if (filterMode === "exclusive") {
          matchesTeam =
            e.Teams.length === 1 &&
            e.Teams[0].name.toLowerCase() === teamFilter.toLowerCase();
        } else {
          matchesTeam = e.Teams.some(
            (t) => t.name.toLowerCase() === teamFilter.toLowerCase()
          );
        }
      }

      return matchesName && matchesTeam;
    });
  }, [employees, search, teamFilter, filterMode]);

  const resetFilters = () => {
    setSearch("");
    setTeamFilter("ALL");
    setFilterMode("inclusive");
  };

  const hasActiveFilters = search !== "" || teamFilter !== "ALL" || filterMode !== "inclusive";

  return (
    <div className="employees-page admin-employees">
      <div className="employees-card">
        <div className="employees-header">
          <div>
            <h1 style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              Employees Overview
              {!loading && (
                <span className="employees-count">
                  {filteredEmployees.length} employees
                </span>
              )}
            </h1>
            <p>Organization-wide visibility</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-24">
            <AppSpinner />
          </div>
        ) : (
          <>
            <div className="employees-toolbar">
              <input
                type="text"
                placeholder="Search by employee name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <div style={{ display: "flex", gap: "12px" }}>
                <select
                  value={teamFilter}
                  onChange={(e) => setTeamFilter(e.target.value)}
                >
                  {teamOptions.map((team) => (
                    <option key={team} value={team}>
                      {team === "ALL" ? "All Teams" : team}
                    </option>
                  ))}
                </select>

                {teamFilter !== "ALL" && (
                  <select
                    value={filterMode}
                    onChange={(e) => setFilterMode(e.target.value)}
                  >
                    <option value="inclusive">Inclusive (Any)</option>
                    <option value="exclusive">Exclusive (Only)</option>
                  </select>
                )}

                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#6b7280",
                      fontSize: "0.85rem",
                      cursor: "pointer",
                      textDecoration: "underline",
                      padding: "0 8px"
                    }}
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            </div>

            <div className="table-wrapper">
              <EmployeeTable
                employees={filteredEmployees.map((e) => ({
                  ...e,
                  teamName: employeeTeamMap[e.id] || "-",
                }))}
                readonly
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
