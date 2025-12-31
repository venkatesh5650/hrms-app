const { Op, fn, col, literal } = require("sequelize");
const Approval = require("../models/approval");
const Log = require("../models/log");
const { isNonEmptyString } = require("../utils/validators");

function resolveWindow(window) {
  if (window === "7d") return 7;
  if (window === "30d") return 30;
  return null;
}

async function getAnalytics(orgId, windowParam) {
  if (!Number.isInteger(orgId)) {
    throw new Error("Invalid organisation id");
  }

  if (windowParam && !isNonEmptyString(windowParam)) {
    throw new Error("Invalid window parameter");
  }

  const window = resolveWindow(windowParam);

  const log_timeFilter = window
    ? { timestamp: { [Op.gte]: literal(`NOW() - INTERVAL ${window} DAY`) } }
    : {};

  const approval_timeFilter = window
    ? { created_at: { [Op.gte]: literal(`NOW() - INTERVAL ${window} DAY`) } }
    : {};

  const [approvalCounts, avgTime, topActors] = await Promise.all([
    Approval.findAll({
      where: {
        organisation_id: orgId,
        ...approval_timeFilter,
      },
      attributes: ["status", [fn("COUNT", "*"), "count"]],
      group: ["status"],
      raw: true,
    }),

    Approval.findOne({
      where: {
        organisation_id: orgId,
        status: { [Op.ne]: "PENDING" },
        ...approval_timeFilter,
      },
      attributes: [
        [
          fn(
            "AVG",
            literal("TIMESTAMPDIFF(SECOND, `created_at`, `updated_at`)")
          ),
          "avgTime",
        ],
      ],
      raw: true,
    }),

    Log.findAll({
      where: {
        organisation_id: orgId,
        ...log_timeFilter,
      },
      attributes: ["user_id", [fn("COUNT", "*"), "actions"]],
      group: ["user_id"],
      order: [[literal("actions"), "DESC"]],
      limit: 5,
      raw: true,
    }),
  ]);

  return {
    window: windowParam || "all",
    approvals: approvalCounts,
    avgDecisionTimeSeconds: Math.round(avgTime?.avgTime || 0),
    topActors,
  };
}

module.exports = { getAnalytics };
