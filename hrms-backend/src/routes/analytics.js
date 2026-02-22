const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const requireRole = require("../middlewares/requireRole");
const { getAnalytics, getAdminOverview } = require("../controllers/analyticsController");

router.use(auth);
router.get("/", requireRole("ADMIN"), getAnalytics);
router.get("/admin-overview", requireRole("ADMIN"), getAdminOverview);

module.exports = router;
