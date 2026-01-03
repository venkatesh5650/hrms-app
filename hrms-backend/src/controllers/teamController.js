const teamService = require("../services/teamService");

async function listTeams(req, res, next) {
  try {
    // 🔽 PASS req.user
    const teams = await teamService.listTeams(req.user.orgId, req.user);
    res.json({ teams });
  } catch (err) {
    next(err);
  }
}

async function getTeam(req, res, next) {
  try {
    // 🔽 PASS req.user
    const team = await teamService.getTeam(
      req.params.id,
      req.user.orgId,
      req.user
    );

    if (!team) return res.status(404).json({ message: "Team not found" });
    res.json({ team });
  } catch (err) {
    next(err);
  }
}

async function createTeam(req, res, next) {
  try {
    if (!req.body.name)
      return res.status(400).json({ message: "name required" });

    const team = await teamService.createTeam(req.body, req.user);
    res.status(201).json({ team });
  } catch (err) {
    next(err);
  }
}

async function updateTeam(req, res, next) {
  try {
    const team = await teamService.updateTeam(
      req.params.id,
      req.body,
      req.user
    );
    if (!team) return res.status(404).json({ message: "Team not found" });
    res.json({ team });
  } catch (err) {
    next(err);
  }
}

async function deleteTeam(req, res, next) {
  try {
    const success = await teamService.deleteTeam(req.params.id, req.user);
    if (!success) return res.status(404).json({ message: "Team not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    next(err);
  }
}

async function assignManager(req, res, next) {
  try {
    if (!req.body.employeeId)
      return res.status(400).json({ message: "employeeId required" });

    const result = await teamService.assignManager(
      parseInt(req.params.teamId, 10),
      req.body.employeeId,
      req.user
    );

    if (result?.error) return res.status(400).json({ message: result.error });

    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function assignEmployee(req, res, next) {
  try {
    if (!req.body.employeeId)
      return res.status(400).json({ message: "employeeId required" });

    const result = await teamService.assignEmployee(
      parseInt(req.params.teamId, 10),
      req.body.employeeId,
      req.user
    );

    if (result?.error) return res.status(404).json({ message: result.error });

    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function unassignEmployee(req, res, next) {
  try {
    if (!req.body.employeeId)
      return res.status(400).json({ message: "employeeId required" });

    const success = await teamService.unassignEmployee(
      parseInt(req.params.teamId, 10),
      req.body.employeeId,
      req.user
    );

    if (!success)
      return res.status(404).json({ message: "Assignment not found" });

    res.json({ message: "Unassigned" });
  } catch (err) {
    next(err);
  }
}
module.exports = {
  listTeams,
  getTeam,
  createTeam,
  updateTeam,
  deleteTeam,
  assignEmployee,
  assignManager,
  unassignEmployee,
};
