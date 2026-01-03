import { useEffect, useState, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import EmployeeTable from "../../components/employees/EmployeeTable";
import "../../styles/employees/adminEmployees.css";

const API = process.env.REACT_APP_API_BASE_URL;

export default function AdminEmployees() {
  const { token } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [teamFilter, setTeamFilter] = useState("ALL");

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

        setEmployees(empData.employees || []);
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
      const teamName = employeeTeamMap[e.id];
      const matchesTeam = teamFilter === "ALL" || teamName === teamFilter;

      return matchesName && matchesTeam;
    });
  }, [employees, search, teamFilter, employeeTeamMap]);

  if (loading) return <p className="loading">Loading employees…</p>;

  return (
    <div className="employees-page admin-employees">
      <div className="employees-card">
        <div className="employees-header">
          <div>
            <h1>Employees Overview</h1>
            <p>Organization-wide visibility</p>
          </div>
          <span className="employees-count">
            {filteredEmployees.length} Employees
          </span>
        </div>

        <div className="employees-toolbar">
          <input
            type="text"
            placeholder="Search by employee name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

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
      </div>
    </div>
  );
}
