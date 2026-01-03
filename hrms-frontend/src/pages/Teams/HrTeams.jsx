import { useEffect, useState } from "react";
import api from "../../services/api";
import TeamForm from "../../components/teams/TeamForm";
import Loader from "../../components/common/Loader";
import "../../styles/teams/hrTeams.css";

export default function HrTeams() {
  const [teams, setTeams] = useState([]);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [expandedTeam, setExpandedTeam] = useState(null);
  const [assignTarget, setAssignTarget] = useState(null);
  const [selectedManager, setSelectedManager] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);

  async function loadData() {
    try {
      console.log("📡 Loading teams & managers...");
      setLoading(true);

      const [teamsRes, usersRes] = await Promise.all([
        api.get("/teams"),
        api.get("/users"),
      ]);

      console.log("📦 Teams API response:", teamsRes.data);
      console.log("📦 Users API response:", usersRes.data);

      const loadedTeams = teamsRes.data.teams || [];
      const loadedManagers = usersRes.data.users.filter(
        (u) => u.role === "MANAGER"
      );

      console.log("🧩 Normalized teams:", loadedTeams);
      console.log("🧩 Normalized managers:", loadedManagers);

      setTeams(loadedTeams);
      setManagers(loadedManagers);
    } catch (e) {
      console.error("❌ Failed loading:", e);
      setError("Failed to load teams or managers");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleFormSubmit(data) {
    try {
      console.log("💾 Submitting team form:", data);
      if (editingTeam) {
        console.log("✏️ Updating team:", editingTeam.id);
        await api.put(`/teams/${editingTeam.id}`, data);
      } else {
        console.log("➕ Creating team");
        await api.post("/teams", data);
      }
      setShowForm(false);
      setEditingTeam(null);
      loadData();
    } catch (e) {
      console.error("❌ Failed saving team:", e);
      setError("Failed to save team");
    }
  }

  async function confirmAssignManager() {
    try {
      console.log("🎯 Assigning manager...");
      console.log("Selected teamId:", assignTarget);
      console.log("Selected employeeId:", selectedManager);

      const team = teams.find((t) => t.id === assignTarget);
      const manager = managers.find(
        (m) => String(m.employee?.id) === String(selectedManager)
      );

      console.log("Resolved team:", team);
      console.log("Resolved manager:", manager);

      await api.post(`/teams/${assignTarget}/assign-manager`, {
        employeeId: selectedManager,
      });

      console.log("✅ Assign API success");

      setSuccess(`"${team?.name}" is now managed by ${manager?.name}`);
      setAssignTarget(null);
      setSelectedManager("");
      loadData();
      setTimeout(() => setSuccess(""), 4000);
    } catch (e) {
      console.error("❌ Failed assigning manager:", e);
      setError("Failed to assign manager");
    }
  }

  if (loading) return <Loader />;

  console.log("🎨 Rendering teams:", teams);

  return (
    <div className="hr-teams">
      <header className="teams-header">
        <div>
          <h1>Teams</h1>
          <p className="subtitle">Organise teams and manage ownership</p>
        </div>

        <button
          className="btn primary compact"
          onClick={() => setShowForm(true)}
        >
          + Add Team
        </button>
      </header>

      {error && <div className="alert error">{error}</div>}
      {success && <div className="alert success">{success}</div>}

      <div className="team-grid">
        {teams.map((team) => {
          console.log("🔍 Rendering team:", team);

          const manager = team.Employees?.find(
            (e) => e.EmployeeTeam?.role === "MANAGER"
          );

          console.log(`👤 Team ${team.id} manager resolved as:`, manager);

          return (
            <div key={team.id} className="team-card">
              <div className="team-card-header">
                <div>
                  <h3>{team.name}</h3>
                  <p className="muted">
                    {team.description || "No description"}
                  </p>

                  <div className="team-meta">
                    <span className="pill">
                      {team.Employees?.length || 0} members
                    </span>

                    <span
                      className={`manager-pill ${
                        manager ? "assigned" : "unassigned"
                      }`}
                    >
                      👤 Manager:{" "}
                      {manager
                        ? `${manager.first_name} ${manager.last_name || ""}`
                        : "Not assigned"}
                    </span>
                  </div>
                </div>

                <div className="card-actions">
                  <button
                    className="btn small outline"
                    onClick={() => {
                      console.log("✏️ Edit team clicked:", team.id);
                      setEditingTeam(team);
                      setShowForm(true);
                    }}
                  >
                    Edit
                  </button>

                  <button
                    className="btn small secondary"
                    onClick={() => {
                      console.log("🎯 Assign manager clicked:", team.id);
                      setAssignTarget(team.id);
                    }}
                  >
                    Assign Manager
                  </button>

                  <button
                    className="btn small outline"
                    onClick={() => {
                      console.log("👥 Toggle members for team:", team.id);
                      setExpandedTeam(
                        expandedTeam === team.id ? null : team.id
                      );
                    }}
                  >
                    {expandedTeam === team.id ? "Hide Members" : "View Members"}
                  </button>
                </div>
              </div>

              {expandedTeam === team.id && (
                <div className="members-panel">
                  {team.Employees?.length ? (
                    <table className="members-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Role</th>
                        </tr>
                      </thead>
                      <tbody>
                        {team.Employees.map((emp) => (
                          <tr key={emp.id}>
                            <td>
                              {emp.first_name} {emp.last_name}
                            </td>
                            <td>{emp.email}</td>
                            <td>{emp.EmployeeTeam?.role || "Member"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="muted">No members in this team.</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {assignTarget && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Assign Manager</h3>
            <select
              value={selectedManager}
              onChange={(e) => {
                console.log("👤 Selected manager employeeId:", e.target.value);
                setSelectedManager(e.target.value);
              }}
            >
              <option value="">Select manager</option>
              {managers.map((m) => (
                <option key={m.id} value={m.employee?.id || ""}>
                  {m.name}
                </option>
              ))}
            </select>

            <div className="modal-actions">
              <button
                className="btn ghost"
                onClick={() => setAssignTarget(null)}
              >
                Cancel
              </button>
              <button
                className="btn primary"
                onClick={confirmAssignManager}
                disabled={!selectedManager}
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <TeamForm
          initialData={editingTeam}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingTeam(null);
          }}
        />
      )}
    </div>
  );
}
