const analyticsExportService = require("../services/analyticsExportService");

async function exportAnalyticsCSV(req, res) {
  try {
    const csv = await analyticsExportService.generateAnalyticsCSV(
      req.user.orgId
    );

    res.header("Content-Type", "text/csv");
    res.attachment(`analytics_org_${req.user.orgId}.csv`);
    res.send(csv);
  } catch (err) {
    next(err);
  }
}

module.exports = { exportAnalyticsCSV };
