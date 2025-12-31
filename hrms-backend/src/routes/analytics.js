const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const requireRole = require("../middlewares/requireRole");
const { getAnalytics } = require("../controllers/analyticsController");

router.use(auth);
router.get("/", requireRole("ADMIN"), getAnalytics);

module.exports = router;
