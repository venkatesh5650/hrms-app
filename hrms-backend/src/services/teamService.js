const Team = require("../models/team");
const Employee = require("../models/employee");
const EmployeeTeam = require("../models/employeeTeam");
const Log = require("../models/log");

async function listTeams(orgId) {
  return await Team.findAll({
    where: { organisation_id: orgId },
    include: [{ model: Employee, through: { attributes: [] } }],
    order: [["created_at", "DESC"]],
  });
}

async function getTeam(id, orgId) {
  return await Team.findOne({
    where: { id, organisation_id: orgId, is_active: true },
    include: [{ model: Employee, through: { attributes: [] } }],
  });
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
  unassignEmployee,
};
