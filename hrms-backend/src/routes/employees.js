const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const ctrl = require("../controllers/employeeController");
const requireRole = require("../middlewares/requireRole");

// All employee operations require authentication
router.use(auth);

// Read access — Admin, HR, Manager
router.get("/", requireRole("ADMIN", "HR", "MANAGER"), ctrl.listEmployees);
router.get("/:id", requireRole("ADMIN", "HR", "MANAGER"), ctrl.getEmployee);

// Restore — Only Admin
router.put("/:id/restore", requireRole("ADMIN"), ctrl.restoreEmployee);

// Write — Only HR
router.post("/", requireRole("HR"), ctrl.createEmployee);
router.put("/:id", requireRole("HR"), ctrl.updateEmployee);

// Delete — Only HR (soft delete)
router.delete("/:id", requireRole("HR"), ctrl.deleteEmployee);

module.exports = router;
