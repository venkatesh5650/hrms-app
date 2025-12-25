const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const ctrl = require("../controllers/teamController");

// All team actions require authentication (tenant scope enforced in controllers)
router.use(auth);

// Team CRUD APIs
router.get("/", ctrl.listTeams);
router.get("/:id", ctrl.getTeam);
router.post("/", ctrl.createTeam);
router.put("/:id", ctrl.updateTeam);
router.delete("/:id", ctrl.deleteTeam);

// Relationship APIs: Assign / Unassign employees from teams
router.post("/:teamId/assign", ctrl.assignEmployee);
router.post("/:teamId/unassign", ctrl.unassignEmployee);

module.exports = router;
