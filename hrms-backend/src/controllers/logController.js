const logService = require("../services/logService");

async function listLogs(req, res) {
  try {
    const logs = await logService.listLogs(req.user.orgId, req.query);
    res.json({ logs });
  } catch (err) {
    next(err);
  }
}

module.exports = { listLogs };
