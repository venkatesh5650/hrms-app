const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const requireRole = require("../middlewares/requireRole");
const { listLogs, getActivityFeed } = require("../controllers/logController");

router.use(auth);

// Only ADMIN & HR can view logs
router.get("/", requireRole("ADMIN", "HR"), listLogs);

// Dashboards fetch the curated activity feed
router.get("/activity-feed", getActivityFeed);

module.exports = router;
