import { useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import TeamCard from "../../components/teams/TeamCard";
import AppSpinner from "../../components/common/AppSpinner";
import "../../styles/teams/managerTeams.css";

export default function ManagerTeams() {
  const { user } = useAuth();
  const [teams, setTeams] = useState([]);
  const [activeTeamId, setActiveTeamId] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ==============================
      ACTION STATE
  ============================== */
  const [actionLoading, setActionLoading] = useState(false);
  const [activeActionId, setActiveActionId] = useState(null);
  const [actionLabel, setActionLabel] = useState("");
  const [globalError, setGlobalError] = useState("");
  const [successBanner, setSuccessBanner] = useState("");
  const [successInfo, setSuccessInfo] = useState({ teamId: null, message: "" });

  /* ==============================
      EMPLOYEE ASSIGNMENT STATE
  ============================== */
  const [employeeTarget, setEmployeeTarget] = useState(null); // { teamId, mode: 'assign' | 'unassign' }
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [allEmployees, setAllEmployees] = useState([]);

  async function loadEmployees() {
    try {
      const res = await api.get("/employees");
      setAllEmployees(res.data.employees || []);
    } catch (err) {
      console.error("Failed to load employees for assignment", err);
    }
  }

  useEffect(() => {
    if (employeeTarget?.mode === 'assign') {
      loadEmployees();
    }
  }, [employeeTarget]);

  const loadData = () => {
    setLoading(true);
    api.get("/teams")
      .then((res) => setTeams(res.data.teams || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  /* ==============================
      CENTRALIZED ACTION DISPATCHER
  ============================== */
  const handleTeamAction = async (type, team, payload) => {
    if (actionLoading) return;

    const teamId = team?.id;
    if (!teamId) return;

    let endpoint = "";
    let body = null;
    let label = "Updating team...";
    let successMsg = "Action completed";

    switch (type) {
      case "ASSIGN_EMPLOYEE":
        endpoint = `/teams/${teamId}/assign`;
        body = { employeeId: payload };
        label = "Assigning employee...";
        successMsg = "Employee added";
        break;

      case "UNASSIGN_EMPLOYEE":
        endpoint = `/teams/${teamId}/unassign`;
        body = { employeeId: payload };
        label = "Removing employee...";
        successMsg = "Employee removed";
        break;

      default:
        console.error("Unknown action type:", type);
        return;
    }

    setGlobalError("");
    setActionLoading(true);
    setActiveActionId(teamId);
    setActionLabel(label);

    try {
      await api.post(endpoint, body);
      setSuccessInfo({ teamId, message: successMsg });
      setSuccessBanner(successMsg);
      setTimeout(() => {
        setSuccessInfo({ teamId: null, message: "" });
        setSuccessBanner("");
      }, 3000);
      loadData();
    } catch (err) {
      setGlobalError(err.response?.data?.message || "Unable to complete action.");
    } finally {
      setActionLoading(false);
      setActionLabel("");
      setTimeout(() => setActiveActionId(null), 4000);
    }
  };

  const myTeams = teams.filter(
    (team) => Number(team.manager?.user_id) === Number(user.id)
  );

  return (
    <div className="manager-teams page">
      <div className="mb-6 fade-in">
        <div className="flex items-center">
          <h1 className="text-2xl font-semibold text-gray-900 leading-tight">My Teams</h1>
          {!loading && (
            <span className="ml-3 px-3 py-1 text-xs rounded-full bg-indigo-50 text-indigo-600">
              {myTeams.length} {myTeams.length === 1 ? 'team' : 'teams'}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 mt-1">Manage your teams and view assigned members</p>
      </div>

      {/* BACKGROUND ACTION BANNER */}
      <div className="h-10 mb-4 transition-all duration-300">
        {actionLoading && (
          <div className="flex items-center gap-3 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-md text-indigo-700 text-xs font-semibold">
            <span className="animate-spin h-3.5 w-3.5 border-2 border-indigo-300 border-t-indigo-600 rounded-full" />
            {actionLabel}
          </div>
        )}
        {successBanner && (
          <div className="flex items-center gap-3 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-md text-emerald-700 text-xs font-semibold animate-in fade-in slide-in-from-top-2">
            <span className="flex-shrink-0">✅</span>
            {successBanner}
          </div>
        )}
      </div>

      {/* ⭐ FLOATING ERROR NOTICE (TOP RIGHT) */}
      {globalError && (
        <div className="fixed top-6 right-6 z-[9999] animate-in slide-in-from-right-4 fade-in duration-300">
          <div className="flex items-center gap-3 px-5 py-3 bg-red-50 border border-red-200 rounded-xl shadow-2xl text-red-600 font-medium">
            <span className="text-lg">⚠️</span>
            <div className="flex flex-col">
              <span className="text-sm font-bold">Action Failed</span>
              <span className="text-xs opacity-80">{globalError}</span>
            </div>
            <button
              onClick={() => setGlobalError("")}
              className="ml-2 p-1 hover:bg-red-100 rounded-lg transition-colors"
            >
              <span className="text-sm">✖</span>
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-24">
          <AppSpinner className="h-8 w-8 text-indigo-600" />
        </div>
      ) : myTeams.length === 0 ? (
        <p className="muted py-12 text-center text-gray-500">No teams assigned to you yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 mt-6">
          {myTeams.map((team) => (
            <TeamCard
              key={team.id}
              team={team}
              isExpanded={activeTeamId === team.id}
              onViewMembers={() => setActiveTeamId(activeTeamId === team.id ? null : team.id)}
              onAction={handleTeamAction}
              statusBadge={successInfo.teamId === team.id ? successInfo.message : null}
              disabled={actionLoading && activeActionId === team.id}
              error={globalError && activeActionId === team.id ? globalError : null}
              openAssignEmployee={() => {
                setGlobalError("");
                setEmployeeTarget({ teamId: team.id, mode: 'assign', members: team.Employees || [] });
              }}
              openUnassignEmployee={() => {
                setGlobalError("");
                setEmployeeTarget({ teamId: team.id, mode: 'unassign', members: team.Employees || [] });
              }}
            >
              {team.Employees?.length ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100 rounded-t-lg">
                      <tr>
                        <th scope="col" className="px-4 py-3 rounded-tl-lg">Name</th>
                        <th scope="col" className="px-4 py-3">Email</th>
                        <th scope="col" className="px-4 py-3 rounded-tr-lg">Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {team.Employees.map((emp, idx, arr) => (
                        <tr key={emp.id} className={`${idx !== arr.length - 1 ? 'border-b border-gray-100' : ''}`}>
                          <td className="px-4 py-3 font-medium text-gray-900">
                            {emp.first_name} {emp.last_name}
                          </td>
                          <td className="px-4 py-3 text-gray-500 break-all">{emp.email}</td>
                          <td className="px-4 py-3">
                            {new Date(emp.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic text-center py-4">No members assigned.</p>
              )}
            </TeamCard>
          ))}
        </div>
      )}

      {/* ASSIGN/UNASSIGN EMPLOYEE MODAL */}
      {employeeTarget && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{employeeTarget.mode === 'assign' ? 'Assign Employee' : 'Unassign Employee'}</h3>
            <p className="text-sm text-gray-500 mb-4 text-center">
              {employeeTarget.mode === 'assign'
                ? 'Select an employee to add to this team.'
                : 'Select an employee to remove from this team.'}
            </p>

            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="w-full p-2 border rounded-md mb-4 bg-white"
            >
              <option value="">Select employee</option>
              {(employeeTarget.mode === 'assign'
                ? allEmployees.filter(emp => !employeeTarget.members?.some(m => m.id === emp.id))
                : (employeeTarget.members || [])
              ).map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.first_name} {emp.last_name} ({emp.employee_id})
                </option>
              ))}
            </select>

            <div className="modal-actions">
              <button
                className="btn ghost"
                onClick={() => {
                  setEmployeeTarget(null);
                  setSelectedEmployee("");
                }}
              >
                Cancel
              </button>

              <button
                className="btn primary"
                onClick={() => {
                  const type = employeeTarget.mode === 'assign' ? "ASSIGN_EMPLOYEE" : "UNASSIGN_EMPLOYEE";
                  const teamId = employeeTarget.teamId;
                  const empId = selectedEmployee;
                  setEmployeeTarget(null);
                  setSelectedEmployee("");
                  handleTeamAction(type, { id: teamId }, empId);
                }}
                disabled={!selectedEmployee || actionLoading}
              >
                {employeeTarget.mode === 'assign' ? 'Assign' : 'Unassign'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
