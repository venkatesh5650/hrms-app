const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const ctrl = require("../controllers/teamController");
const requireRole = require("../middlewares/requireRole");
// All team actions require authentication (tenant scope enforced in controllers)
router.use(auth);

// Read access
router.get("/", requireRole("ADMIN", "HR", "MANAGER"), ctrl.listTeams);
router.get("/:id", requireRole("ADMIN", "HR", "MANAGER"), ctrl.getTeam);

// Write access — HR only
router.post("/", requireRole("HR"), ctrl.createTeam);
router.put("/:id", requireRole("HR"), ctrl.updateTeam);
router.delete("/:id", requireRole("HR"), ctrl.deleteTeam);

// Assignment — HR & Manager
router.post(
  "/:teamId/assign",
  requireRole("HR", "MANAGER"),
  ctrl.assignEmployee
);
router.post(
  "/:teamId/unassign",
  requireRole("HR", "MANAGER"),
  ctrl.unassignEmployee
);

module.exports = router;
