const orgStatsService = require("../services/orgStatsService");

async function getRoleStats(req, res,next) {
  try {
    const data = await orgStatsService.getRoleStats(req.user.orgId);
    res.json({ stats: data });
  } catch (err) {
    next(err);
  }
}

async function listManagers(req, res,next) {
  try {
    const managers = await orgStatsService.listUsersByRole(
      req.user.orgId,
      "MANAGER"
    );
    res.json({ managers });
  } catch (err) {
    next(err);
  }
}

async function listHRs(req, res,next) {
  try {
    const hrs = await orgStatsService.listUsersByRole(req.user.orgId, "HR");
    res.json({ hrs });
  } catch (err) {
    next(err);
  }
}

module.exports = { getRoleStats, listManagers, listHRs };
