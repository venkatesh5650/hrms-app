const Log = require("../models/log");
const { isNonEmptyString, isArray } = require("../utils/validators");

module.exports = function requireRole(...allowedRoles) {

  // Validation to ensure middleware is used correctly and avoid runtime errors
  if (!isArray(allowedRoles)) {
    throw new Error("allowedRoles must be an array");
  }

  // Normalize roles to uppercase so comparison becomes case-insensitive
  const normalizedAllowed = allowedRoles
    .filter(isNonEmptyString)
    .map(r => r.toUpperCase());

  return async (req, res, next) => {

    if (!req.user) {
      return res.status(401).json({ message: "Unauthenticated" });
    }

    // Safe extraction and normalization of user role
    const userRole = isNonEmptyString(req.user.role)
      ? req.user.role.toUpperCase()
      : "";

    if (!normalizedAllowed.includes(userRole)) {
      try {
        // Logging denied access attempts for security auditing and traceability
        await Log.create({
          organisation_id: req.user.orgId,
          user_id: req.user.id,
          user_role: userRole || req.user.accountType || "UNKNOWN",
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
        // Prevent logging failure from breaking main application flow
        console.error("Failed to log denied access:", logErr.message);
      }

      return res.status(403).json({ message: "Forbidden — insufficient permissions" });
    }

    next();
  };
};
