const Log = require("../models/log");
const { isNonEmptyString } = require("../utils/validators");

async function listLogs(orgId, filters = {}) {
  const where = { organisation_id: orgId };

  if (filters.userId && Number.isInteger(Number(filters.userId))) {
    where.user_id = parseInt(filters.userId, 10);
  }

  if (isNonEmptyString(filters.action)) {
    where.action = filters.action.trim();
  }

  const rawLimit = parseInt(filters.limit, 10);
  const rawOffset = parseInt(filters.offset, 10);

  const limit = Number.isInteger(rawLimit) ? Math.min(rawLimit, 100) : 50;
  const offset = Number.isInteger(rawOffset) && rawOffset >= 0 ? rawOffset : 0;

  const { rows, count } = await Log.findAndCountAll({
    where,
    order: [["timestamp", "DESC"]],
    limit,
    offset,
  });

  return {
    data: rows,
    total: count,
    limit,
    offset,
  };
}

module.exports = { listLogs };
