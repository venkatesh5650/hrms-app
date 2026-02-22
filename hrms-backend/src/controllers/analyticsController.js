const analyticsService = require("../services/analyticsService");
const Approval = require("../models/approval");
const Log = require("../models/log");
const User = require("../models/user");
const { Sequelize } = require("sequelize");

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

async function getAdminOverview(req, res, next) {
  try {
    const orgId = req.user.orgId;

    // 1. Fetch approval metrics
    const approvals = await Approval.findAll({
      where: { organisation_id: orgId, type: "LOGIN_ACCESS" },
      raw: true,
    });

    const approvedCount = approvals.filter(a => a.status === "APPROVED").length;
    const rejectedCount = approvals.filter(a => a.status === "REJECTED").length;

    // Calculate processing time
    const reviewed = approvals.filter(a => a.status === "APPROVED" || a.status === "REJECTED");
    let avgProcessingTimeSeconds = 0;

    if (reviewed.length > 0) {
      const diffs = reviewed
        .filter(a => a.updated_at && a.created_at)
        .map(a => (new Date(a.updated_at) - new Date(a.created_at)) / 1000);

      if (diffs.length > 0) {
        avgProcessingTimeSeconds = Math.round(diffs.reduce((a, b) => a + b, 0) / diffs.length);
      }
    }

    // 2. Fetch Top Actor with Sequelize GROUP BY
    const topActorLog = await Log.findOne({
      where: { organisation_id: orgId },
      include: [{ model: User, attributes: ["name", "email"] }],
      attributes: [
        "user_id",
        "user_role",
        [Sequelize.fn("COUNT", Sequelize.col("Log.id")), "actions"],
      ],
      group: ["user_id", "user_role", "User.id", "User.name", "User.email"],
      order: [[Sequelize.fn("COUNT", Sequelize.col("Log.id")), "DESC"]],
      limit: 1,
      raw: true,
      nest: true, // Necessary when including associations with raw: true
    });

    // 3. Format response
    res.json({
      approvedCount,
      rejectedCount,
      avgDecisionTimeSeconds: avgProcessingTimeSeconds,
      topActor: topActorLog ? {
        name: topActorLog.User?.name || topActorLog.User?.email || `User #${topActorLog.user_id}`,
        role: topActorLog.user_role || "ADMIN",
        actions: parseInt(topActorLog.actions, 10),
        user_id: topActorLog.user_id
      } : null
    });
  } catch (err) {
    console.error("Failed to load admin overview:", err);
    next(err);
  }
}

module.exports = { getAnalytics, getAdminOverview };
