const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const requireRole = require("../middlewares/requireRole");
const Log = require("../models/log");

router.use(auth);

// Only ADMIN & HR can view logs
router.get("/", requireRole("ADMIN", "HR"), async (req, res) => {
  const logs = await logService.listLogs(req.user.orgId, req.query);
  res.json(logs);
});

module.exports = router;
