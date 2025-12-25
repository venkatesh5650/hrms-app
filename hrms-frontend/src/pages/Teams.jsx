import React, { useEffect, useState } from "react";
import api from "../services/api";
import Loader from "../components/Loader";
import TeamForm from "../components/TeamForm";

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [activeAssignTeamId, setActiveAssignTeamId] = useState(null);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const [teamRes, empRes] = await Promise.all([
        api.get("/teams"),
        api.get("/employees"),
      ]);
      setTeams(teamRes.data.teams || []);
      setEmployees(empRes.data.employees || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load teams");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = () => {
    setEditingTeam(null);
    setShowForm(true);
  };

  const handleEdit = (team) => {
    setEditingTeam(team);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this team?")) return;
    try {
      await api.delete(`/teams/${id}`);
      await loadData();
    } catch (err) {
      console.error(err);
      setError("Failed to delete team");
    }
  };

  const handleFormSubmit = async (data) => {
    try {
      if (editingTeam) {
        await api.put(`/teams/${editingTeam.id}`, data);
      } else {
        await api.post("/teams", data);
      }
      setShowForm(false);
      setEditingTeam(null);
      await loadData();
    } catch (err) {
      console.error(err);
      setError("Failed to save team");
    }
  };

  const toggleAssignPanel = (teamId) => {
    setActiveAssignTeamId((prev) => (prev === teamId ? null : teamId));
  };

  const isEmployeeInTeam = (team, employeeId) =>
    team.Employees?.some((e) => e.id === employeeId);

  const handleToggleMember = async (team, employee) => {
    try {
      const inTeam = isEmployeeInTeam(team, employee.id);
      if (inTeam) {
        await api.post(`/teams/${team.id}/unassign`, {
          employeeId: employee.id,
        });
      } else {
        await api.post(`/teams/${team.id}/assign`, {
          employeeId: employee.id,
        });
      }
      await loadData();
      setActiveAssignTeamId(team.id);
    } catch (err) {
      console.error(err);
      setError("Failed to update team assignment");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Teams</h1>
          <p className="page-subtitle">
            Organise employees into teams and manage their membership.
          </p>
        </div>
        <button className="btn" onClick={handleCreate}>
          + Add Team
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

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

      <div className="card mt-md">
        {teams.length === 0 ? (
          <p className="muted">No teams yet. Create your first team.</p>
        ) : (
          <div className="team-list">
            {teams.map((team) => (
              <div key={team.id} className="team-card">
                <div className="team-card-header">
                  <div>
                    <h3>{team.name}</h3>
                    <p className="muted">
                      {team.description || "No description"}
                    </p>
                    <p className="tag">{team.Employees?.length || 0} members</p>
                  </div>
                  <div className="team-card-actions">
                    <button
                      className="btn btn-small"
                      onClick={() => handleEdit(team)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-small btn-danger"
                      onClick={() => handleDelete(team.id)}
                    >
                      Delete
                    </button>
                    <button
                      className="btn btn-small btn-outline"
                      onClick={() => toggleAssignPanel(team.id)}
                    >
                      {activeAssignTeamId === team.id
                        ? "Close members"
                        : "Manage members"}
                    </button>
                  </div>
                </div>

                {activeAssignTeamId === team.id && (
                  <div className="team-assign-panel">
                    <h4>Assign Employees</h4>
                    {employees.length === 0 ? (
                      <p className="muted">
                        No employees available. Create employees first.
                      </p>
                    ) : (
                      <div className="assign-list">
                        {employees.map((emp) => {
                          const checked = isEmployeeInTeam(team, emp.id);
                          return (
                            <label
                              key={emp.id}
                              className="assign-item"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => handleToggleMember(team, emp)}
                              />
                              <span>
                                {emp.first_name} {emp.last_name}
                                {emp.email ? ` (${emp.email})` : ""}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Teams;
