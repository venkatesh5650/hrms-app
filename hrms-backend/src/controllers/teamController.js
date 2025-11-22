const Team = require("../models/team");
const Employee = require("../models/employee");
const EmployeeTeam = require("../models/employeeTeam");
const Log = require("../models/log");

// List all teams inside organisation scope
async function listTeams(req, res) {
  try {
    const teams = await Team.findAll({
      where: { organisation_id: req.user.orgId }, // Multi-tenant security
      include: [{ model: Employee, through: { attributes: [] } }],
      order: [["created_at", "DESC"]], // Recent first
    });
    res.json({ teams });
  } catch {
    res.status(500).json({ message: "Could not list teams" });
  }
}

// Fetch a single team detail with employee assignments
async function getTeam(req, res) {
  try {
    const id = req.params.id;
    const team = await Team.findOne({
      where: { id, organisation_id: req.user.orgId }, // Prevents cross-organisation access
      include: [{ model: Employee, through: { attributes: [] } }],
    });
    if (!team) return res.status(404).json({ message: "Team not found" });
    res.json({ team });
  } catch {
    res.status(500).json({ message: "Could not fetch team" });
  }
}

// Create team under authenticated user's organisation
async function createTeam(req, res) {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: "name required" });

    const team = await Team.create({
      name,
      description,
      organisation_id: req.user.orgId,
    });

    await Log.create({
      organisation_id: req.user.orgId,
      user_id: req.user.id,
      action: "team_created",
      meta: { teamId: team.id },
      timestamp: new Date(),
    });

    res.status(201).json({ team });
  } catch {
    res.status(500).json({ message: "Could not create team" });
  }
}

// Update team details with access validation
async function updateTeam(req, res) {
  try {
    const id = req.params.id;
    const team = await Team.findOne({
      where: { id, organisation_id: req.user.orgId },
    });
    if (!team) return res.status(404).json({ message: "Team not found" });

    const { name, description } = req.body;
    await team.update({ name, description });

    await Log.create({
      organisation_id: req.user.orgId,
      user_id: req.user.id,
      action: "team_updated",
      meta: { teamId: team.id },
      timestamp: new Date(),
    });

    res.json({ team });
  } catch {
    res.status(500).json({ message: "Could not update team" });
  }
}

// Delete team and remove mapping records
async function deleteTeam(req, res) {
  try {
    const id = req.params.id;
    const team = await Team.findOne({
      where: { id, organisation_id: req.user.orgId },
    });
    if (!team) return res.status(404).json({ message: "Team not found" });

    await team.destroy();
    await EmployeeTeam.destroy({ where: { team_id: id } }); // Clean join table

    await Log.create({
      organisation_id: req.user.orgId,
      user_id: req.user.id,
      action: "team_deleted",
      meta: { teamId: id },
      timestamp: new Date(),
    });

    res.json({ message: "Deleted" });
  } catch {
    res.status(500).json({ message: "Could not delete team" });
  }
}

// Assign employee → team (idempotent: prevents duplicate mapping)
async function assignEmployee(req, res) {
  try {
    const teamId = parseInt(req.params.teamId, 10);
    const { employeeId } = req.body;
    if (!employeeId)
      return res.status(400).json({ message: "employeeId required" });

    const team = await Team.findOne({
      where: { id: teamId, organisation_id: req.user.orgId },
    });
    if (!team) return res.status(404).json({ message: "Team not found" });

    const employee = await Employee.findOne({
      where: { id: employeeId, organisation_id: req.user.orgId },
    });
    if (!employee)
      return res.status(404).json({ message: "Employee not found" });

    const [record, created] = await EmployeeTeam.findOrCreate({
      where: { employee_id: employeeId, team_id: teamId },
      defaults: { assigned_at: new Date() },
    });

    await Log.create({
      organisation_id: req.user.orgId,
      user_id: req.user.id,
      action: "employee_assigned_to_team",
      meta: { employeeId, teamId },
      timestamp: new Date(),
    });

    res.json({ assigned: !!created, record });
  } catch {
    res
      .status(500)
      .json({ message: "Could not assign employee to team" });
  }
}

// Remove employee → team assignment
async function unassignEmployee(req, res) {
  try {
    const teamId = parseInt(req.params.teamId, 10);
    const { employeeId } = req.body;
    if (!employeeId)
      return res.status(400).json({ message: "employeeId required" });

    const record = await EmployeeTeam.findOne({
      where: { employee_id: employeeId, team_id: teamId },
    });
    if (!record)
      return res.status(404).json({ message: "Assignment not found" });

    await record.destroy();

    await Log.create({
      organisation_id: req.user.orgId,
      user_id: req.user.id,
      action: "employee_unassigned_from_team",
      meta: { employeeId, teamId },
      timestamp: new Date(),
    });

    res.json({ message: "Unassigned" });
  } catch {
    res
      .status(500)
      .json({ message: "Could not unassign employee from team" });
  }
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
