const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const requireRole = require("../middlewares/requireRole");
const { listLogs } = require("../controllers/logController");

router.use(auth);

// Only ADMIN & HR can view logs
router.get("/", requireRole("ADMIN", "HR"), listLogs);

module.exports = router;
