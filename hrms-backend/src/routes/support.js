const express = require("express");
const router = express.Router();
const requireRole = require("../middlewares/requireRole");
const ctrl = require("../controllers/supportController");

// auth is already applied globally in server.js before this router

// Employee submits a support request
router.post("/create", requireRole("EMPLOYEE"), ctrl.createRequest);

// HR, Manager, Admin fetch their role-specific requests
router.get(
    "/role-requests",
    requireRole("HR", "MANAGER", "ADMIN"),
    ctrl.getRoleRequests
);

// HR, Manager, Admin resolve a request
router.put(
    "/:id/resolve",
    requireRole("HR", "MANAGER", "ADMIN"),
    ctrl.resolve
);

module.exports = router;
