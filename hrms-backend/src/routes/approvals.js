const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const requireRole = require("../middlewares/requireRole");
const ctrl = require("../controllers/approvalController");

router.use(auth);

// HR creates request
router.post("/", requireRole("HR"), ctrl.createApproval);

// Manager views pending approvals
router.get("/pending", requireRole("ADMIN", "MANAGER"), ctrl.listPending);


// Manager approves employee creation only
router.post("/:id/approve-create", requireRole("MANAGER"), ctrl.approveCreate);

// Admin approves login access only
router.post("/:id/approve-login", requireRole("ADMIN"), ctrl.approveLogin);


// Manager rejects employee creation
router.post("/:id/reject-create", requireRole("MANAGER"), ctrl.rejectCreate);

// Admin rejects login access
router.post("/:id/reject-login", requireRole("ADMIN"), ctrl.rejectLogin);


router.get("/history", requireRole("ADMIN", "HR", "MANAGER"), ctrl.listHistory);

module.exports = router;
