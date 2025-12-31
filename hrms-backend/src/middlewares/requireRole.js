const Log = require("../models/log");
const { isNonEmptyString, isArray } = require("../utils/validators");

module.exports = function requireRole(...allowedRoles) {
  if (!isArray(allowedRoles)) {
    throw new Error("allowedRoles must be an array");
  }

  const normalizedAllowed = allowedRoles
    .filter(isNonEmptyString)
    .map(r => r.toUpperCase());

  return async (req, res, next) => {
    console.log("requireRole middleware invoked");
    console.log("User role:", req.user?.role, "Allowed:", normalizedAllowed);

    if (!req.user) {
      return res.status(401).json({ message: "Unauthenticated" });
    }

    const userRole = isNonEmptyString(req.user.role)
      ? req.user.role.toUpperCase()
      : "";

    if (!normalizedAllowed.includes(userRole)) {
      try {
        await Log.create({
          organisation_id: req.user.orgId,
          user_id: req.user.id,
          action: "access_denied",
          meta: {
            requiredRoles: normalizedAllowed,
            actualRole: userRole,
            path: req.originalUrl,
            method: req.method,
          },
          timestamp: new Date(),
        });
      } catch (logErr) {
        console.error("Failed to log denied access:", logErr.message);
      }

      return res.status(403).json({ message: "Forbidden — insufficient permissions" });
    }

    next();
  };
};
