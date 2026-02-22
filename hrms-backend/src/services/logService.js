const Log = require("../models/log");
const User = require("../models/user");
const { Op } = require("sequelize");
const { isNonEmptyString } = require("../utils/validators");

async function listLogs(orgId, filters = {}, userRole = "USER") {
  const where = { organisation_id: orgId };

  if (userRole === "HR") {
    const allowedHrActions = [
      "employee_created",
      "employee_updated",
      "team_assigned",
      "employee_assigned_to_team",
      "employee_unassigned_from_team",
      "manager_assigned_to_team",
      "approval_approved",
      "approval_rejected"
    ];
    where.action = {
      [Op.in]: allowedHrActions
    };
  }

  if (filters.userId && Number.isInteger(Number(filters.userId))) {
    where.user_id = parseInt(filters.userId, 10);
  }

  if (isNonEmptyString(filters.action)) {
    if (where.action && where.action[Op.notIn]) {
      // Merge exact search with exclusion list
      where.action[Op.eq] = filters.action.trim();
    } else {
      where.action = filters.action.trim();
    }
  }

  const rawLimit = parseInt(filters.limit, 10);
  const rawOffset = parseInt(filters.offset, 10);

  const limit = Number.isInteger(rawLimit) ? Math.min(rawLimit, 100) : 50;
  const offset = Number.isInteger(rawOffset) && rawOffset >= 0 ? rawOffset : 0;

  const { rows, count } = await Log.findAndCountAll({
    where,
    include: [{ model: User, attributes: ["role"], required: false }],
    order: [["timestamp", "DESC"]],
    limit,
    offset,
  });

  let formattedLogs = rows.map((log) => ({
    id: log.id,
    action: log.action,
    created_at: log.timestamp,
    user_id: log.user_id,
    role: log.user_role || log.User?.role || "UNKNOWN",
  }));

  if (userRole === "HR") {
    const allowedHrActions = [
      "employee_created",
      "employee_updated",
      "team_assigned",
      "employee_assigned_to_team",
      "employee_unassigned_from_team",
      "manager_assigned_to_team",
      "approval_approved",
      "approval_rejected"
    ];

    formattedLogs = formattedLogs.filter(l =>
      l.role !== "ADMIN" &&
      allowedHrActions.includes(l.action)
    );
  }

  return {
    data: formattedLogs,
    total: count,
    limit,
    offset,
  };
}

async function getActivityFeed(user, scope = "employee") {
  const where = { organisation_id: user.orgId };

  // Role-based curation exactly per requirements
  if (scope === "hr") {
    where.action = {
      [Op.in]: [
        "employee_created",
        "employee_updated",
        "employee_soft_deleted",
        "employee_restored",
        "employee_assigned_to_team",
        "employee_unassigned_from_team",
        "manager_assigned_to_team",
        "approval_approved",
        "approval_rejected",
        "team_created",
        "team_updated",
        "team_deleted"
        // Explicitly excludes configuring admins, login events, exports, etc.
      ]
    };
  } else if (scope === "admin") {
    where.action = {
      [Op.in]: [
        "user_created",
        "user_updated",
        "user_role_updated",
        "employee_login_linked",
        "manager_created_and_linked",
        "user_logged_out",
        "access_denied",
        "organisation_created",
        "employee_deleted",
        "employee_soft_deleted"
      ]
    };
  } else {
    return []; // Return empty if standard employee requests it
  }

  const rows = await Log.findAll({
    where,
    include: [{ model: User, attributes: ["role"], required: false }],
    order: [["timestamp", "DESC"]],
    limit: 10,
  });

  return rows.map((log) => ({
    id: log.id,
    action: log.action,
    created_at: log.timestamp,
    user_id: log.user_id,
    role: log.user_role || log.User?.role || "UNKNOWN",
    meta: log.meta
  }));
}

module.exports = { listLogs, getActivityFeed };
