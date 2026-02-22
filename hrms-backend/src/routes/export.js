const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const requireRole = require("../middlewares/requireRole");
const {
  exportCompanyAnalytics,
  exportApprovals,
  exportTeamDistribution,
  exportUserActivity
} = require("../controllers/exportController");

router.use(auth);

router.get("/company-analytics", requireRole("ADMIN"), exportCompanyAnalytics);
router.get("/approvals", requireRole("ADMIN"), exportApprovals);
router.get("/team-distribution", requireRole("ADMIN"), exportTeamDistribution);
router.get("/user-activity", requireRole("ADMIN"), exportUserActivity);

module.exports = router;
