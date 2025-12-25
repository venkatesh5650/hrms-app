const Log = require("../models/log");

// Fetch latest audit logs for organisation (secured by user scope)
async function listLogs(req, res) {
  try {
    const where = { organisation_id: req.user.orgId }; // Prevent cross-org access

    // Optional filtering
    if (req.query.userId) where.user_id = parseInt(req.query.userId, 10);
    if (req.query.action) where.action = req.query.action;

    const logs = await Log.findAll({
      where,
      order: [["timestamp", "DESC"]], // Most recent first
      limit: 500, // Avoid large payloads
    });

    res.json({ logs });
  } catch (err) {
    res.status(500).json({ message: "Could not list logs" });
  }
}

module.exports = { listLogs };
