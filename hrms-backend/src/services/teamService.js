const Team = require("../models/team");
const Employee = require("../models/employee");
const EmployeeTeam = require("../models/employeeTeam");
const Log = require("../models/log");

function attachManager(team) {
  const plain = team.toJSON();

  const manager = plain.Employees?.find(
    (e) => e.EmployeeTeam?.role === "MANAGER"
  );

  return {
    ...plain,
    manager: manager || null,
  };
}

async function listTeams(orgId, user) {
  const where = { organisation_id: orgId };

  const include = [
    {
      model: Employee,
      through: { attributes: ["role"] },
    },
  ];

  let teams = await Team.findAll({
    where,
    include,
    order: [["created_at", "DESC"]],
  });

  teams = teams.map(attachManager);

  // 🔒 Role-based filtering
  if (user.role === "MANAGER") {
    teams = teams.filter((t) => t.manager?.user_id === user.id);
  }

  if (user.role === "EMPLOYEE") {
    teams = teams.filter((t) =>
      t.Employees?.some((e) => e.user_id === user.id)
    );
  }

  return teams;
}


async function getTeam(id, orgId, user) {
  const team = await Team.findOne({
    where: { id, organisation_id: orgId, is_active: true },
    include: [{ model: Employee, through: { attributes: ["role"] } }],
  });

  if (!team) return null;

  const enriched = attachManager(team);

  if (user.role === "MANAGER" && enriched.manager?.user_id !== user.id) {
    return null; // or throw Forbidden error
  }

  if (
    user.role === "EMPLOYEE" &&
    !enriched.Employees?.some((e) => e.user_id === user.id)
  ) {
    return null;
  }

  return enriched;
}


async function createTeam(data, user) {
  const team = await Team.create({
    name: data.name,
    description: data.description,
    organisation_id: user.orgId,
  });

  await Log.create({
    organisation_id: user.orgId,
    user_id: user.id,
    user_role: user.role,
    action: "team_created",
    meta: { teamId: team.id },
    timestamp: new Date(),
  });

  return team;
}

async function updateTeam(id, data, user) {
  const team = await Team.findOne({
    where: { id, organisation_id: user.orgId, is_active: true },
  });
  if (!team) return null;

  await team.update({ name: data.name, description: data.description });

  await Log.create({
    organisation_id: user.orgId,
    user_id: user.id,
    user_role: user.role,
    action: "team_updated",
    meta: { teamId: team.id },
    timestamp: new Date(),
  });

  return team;
}

async function deleteTeam(id, user) {
  const team = await Team.findOne({
    where: { id, organisation_id: user.orgId, is_active: true },
  });
  if (!team) return null;

  team.is_active = false;
  team.deleted_at = new Date();
  await team.save();

  await Log.create({
    organisation_id: user.orgId,
    user_id: user.id,
    user_role: user.role,
    action: "team_deleted",
    meta: { teamId: id },
    timestamp: new Date(),
  });

  return true;
}

async function assignEmployee(teamId, employeeId, user) {
  const team = await Team.findOne({
    where: { id: teamId, organisation_id: user.orgId, is_active: true },
  });
  if (!team) return { error: "Team not found" };

  const employee = await Employee.findOne({
    where: { id: employeeId, organisation_id: user.orgId },
  });
  if (!employee) return { error: "Employee not found" };

  const [record, created] = await EmployeeTeam.findOrCreate({
    where: { employee_id: employeeId, team_id: teamId },
    defaults: { assigned_at: new Date() },
  });

  await Log.create({
    organisation_id: user.orgId,
    user_id: user.id,
    user_role: user.role,
    action: "employee_assigned_to_team",
    meta: {
      teamId: team.id,
      teamName: team.name,
      employeeId: employee.id,
      employeeName: `${employee.first_name} ${employee.last_name || ""}`.trim(),
    },
    timestamp: new Date(),
  });

  return { assigned: !!created, record };
}

async function assignManager(teamId, employeeId, user) {
  const team = await Team.findOne({
    where: { id: teamId, organisation_id: user.orgId, is_active: true },
  });
  if (!team) return { error: "Team not found" };

  const employee = await Employee.findOne({
    where: { id: employeeId, organisation_id: user.orgId },
  });
  if (!employee) return { error: "Employee not found" };

  let [record, created] = await EmployeeTeam.findOrCreate({
    where: { employee_id: employeeId, team_id: teamId },
    defaults: {
      role: "MANAGER",
      assigned_at: new Date(),
    },
  });

  if (!created && record.role !== "MANAGER") {
    await record.update({ role: "MANAGER" });
  }

  await Log.create({
    organisation_id: user.orgId,
    user_id: user.id,
    user_role: user.role,
    action: "manager_assigned_to_team",
    meta: {
      teamId: team.id,
      teamName: team.name,
      managerId: employee.id,
      managerName: `${employee.first_name} ${employee.last_name || ""}`.trim(),
    },
    timestamp: new Date(),
  });

  return {
    assigned: true,
    assignment: {
      team: {
        id: team.id,
        name: team.name,
      },
      manager: {
        id: employee.id,
        name: `${employee.first_name} ${employee.last_name || ""}`.trim(),
      },
      assigned_at: record.assigned_at,
    },
  };
}

async function unassignManager(teamId, user) {
  const team = await Team.findOne({
    where: { id: teamId, organisation_id: user.orgId, is_active: true },
  });
  if (!team) return { error: "Team not found" };

  const record = await EmployeeTeam.findOne({
    where: { team_id: teamId, role: "MANAGER" },
  });

  if (!record) return { error: "No manager assigned to this team" };

  const managerId = record.employee_id;
  await record.destroy();

  await Log.create({
    organisation_id: user.orgId,
    user_id: user.id,
    user_role: user.role,
    action: "manager_unassigned_from_team",
    meta: {
      teamId: team.id,
      teamName: team.name,
      managerId: managerId,
    },
    timestamp: new Date(),
  });

  return { unassigned: true };
}

async function unassignEmployee(teamId, employeeId, user) {
  const team = await Team.findOne({
    where: { id: teamId, organisation_id: user.orgId, is_active: true },
  });
  if (!team) return null;

  const employee = await Employee.findOne({
    where: { id: employeeId, organisation_id: user.orgId },
  });
  if (!employee) return null;

  const record = await EmployeeTeam.findOne({
    where: { employee_id: employeeId, team_id: teamId },
  });
  if (!record) return null;

  await record.destroy();

  await Log.create({
    organisation_id: user.orgId,
    user_id: user.id,
    user_role: user.role,
    action: "employee_unassigned_from_team",
    meta: {
      teamId: team.id,
      teamName: team.name,
      employeeId: employee.id,
      employeeName: `${employee.first_name} ${employee.last_name || ""}`.trim(),
    },
    timestamp: new Date(),
  });

  return true;
}

module.exports = {
  listTeams,
  getTeam,
  createTeam,
  updateTeam,
  deleteTeam,
  assignEmployee,
  assignManager,
  unassignManager,
  unassignEmployee,
};
