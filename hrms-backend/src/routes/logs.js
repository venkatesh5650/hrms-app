const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const ctrl = require("../controllers/logController");

// Logs are protected: only authenticated users within the tenant
router.use(auth);

// Audit logs (future: restrict to admin-only)
router.get("/", ctrl.listLogs);

module.exports = router;
