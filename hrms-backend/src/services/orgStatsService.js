const { fn, col } = require("sequelize");
const User = require("../models/user");

async function getRoleStats(orgId) {
  const counts = await User.findAll({
    where: { organisation_id: orgId },
    attributes: ["role", [fn("COUNT", col("id")), "count"]],
    group: ["role"],
    raw: true,
  });

  return counts;
}

async function listUsersByRole(orgId, role) {
  return await User.findAll({
    where: { organisation_id: orgId, role },
    attributes: ["id", "name", "email"],
  });
}

module.exports = { getRoleStats, listUsersByRole };
