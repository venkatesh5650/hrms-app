const analyticsService = require("../services/analyticsService");

async function getAnalytics(req, res, next) {
  try {
    const data = await analyticsService.getAnalytics(
      req.user.orgId,
      req.query.window
    );
    res.json(data);
  } catch (err) {
    next(err);
  }
}

module.exports = { getAnalytics };   // ✅ MUST be object
