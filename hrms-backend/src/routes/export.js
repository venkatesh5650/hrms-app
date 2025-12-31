const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const requireRole = require("../middlewares/requireRole");
const {
  exportAnalyticsCSV,
} = require("../controllers/analyticsExportController");

router.use(auth);
router.get("/analytics", requireRole("ADMIN"), exportAnalyticsCSV);

module.exports = router;
