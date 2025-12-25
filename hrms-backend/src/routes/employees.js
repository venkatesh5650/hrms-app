const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const ctrl = require("../controllers/employeeController");

// All employee operations require authentication (tenant-scoped)
router.use(auth);

// Employee REST endpoints
router.get("/", ctrl.listEmployees); // Fetch all employees of the org
router.get("/:id", ctrl.getEmployee); // Get single employee
router.post("/", ctrl.createEmployee); // Create employee
router.put("/:id", ctrl.updateEmployee); // Update employee
router.delete("/:id", ctrl.deleteEmployee); // Delete employee

module.exports = router;
