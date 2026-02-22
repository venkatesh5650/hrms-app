const logService = require("../services/logService");

async function listLogs(req, res, next) {
  try {
    const logs = await logService.listLogs(req.user.orgId, req.query, req.user.role);
    res.json({ logs });
  } catch (err) {
    next(err);
  }
}

async function getActivityFeed(req, res, next) {
  try {
    const feed = await logService.getActivityFeed(req.user, req.query.scope);
    res.json({ feed });
  } catch (err) {
    next(err);
  }
}

module.exports = { listLogs, getActivityFeed };
