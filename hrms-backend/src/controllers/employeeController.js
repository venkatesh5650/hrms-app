const Employee = require("../models/employee");
const Team = require("../models/team");
const Log = require("../models/log");
const logger = require("../config/logger");

// List employees under logged-in user's organisation
async function listEmployees(req, res) {
  try {
    const employees = await Employee.findAll({
      where: { organisation_id: req.user.orgId }, // Restrict scoped data access
      include: [{ model: Team, through: { attributes: [] } }], // Fetch team associations
      order: [["created_at", "DESC"]], // Latest first
    });
    res.json({ employees });
  } catch (err) {
    logger.error("listEmployees error", err);
    res.status(500).json({ message: "Could not list employees" });
  }
}

// Fetch employee detail + team associations
async function getEmployee(req, res) {
  try {
    const id = req.params.id;
    const employee = await Employee.findOne({
      where: { id, organisation_id: req.user.orgId }, // Prevent cross-org access
      include: [{ model: Team, through: { attributes: [] } }],
    });
    if (!employee)
      return res.status(404).json({ message: "Employee not found" });

    res.json({ employee });
  } catch (err) {
    logger.error("getEmployee error", err);
    res.status(500).json({ message: "Could not fetch employee" });
  }
}

// Create employee inside authenticated organisation scope
async function createEmployee(req, res) {
  try {
    const { first_name, last_name, email, phone } = req.body;
    if (!first_name)
      return res.status(400).json({ message: "first_name required" });

    const employee = await Employee.create({
      first_name,
      last_name,
      email,
      phone,
      organisation_id: req.user.orgId,
    });

    // Audit trail
    await Log.create({
      organisation_id: req.user.orgId,
      user_id: req.user.id,
      action: "employee_created",
      meta: { employeeId: employee.id },
      timestamp: new Date(),
    });

    res.status(201).json({ employee });
  } catch (err) {
    logger.error("createEmployee error", err);
    res.status(500).json({ message: "Could not create employee" });
  }
}

// Update employee safely with organisation check
async function updateEmployee(req, res) {
  try {
    const id = req.params.id;
    const employee = await Employee.findOne({
      where: { id, organisation_id: req.user.orgId },
    });
    if (!employee)
      return res.status(404).json({ message: "Employee not found" });

    const { first_name, last_name, email, phone } = req.body;
    await employee.update({ first_name, last_name, email, phone });

    await Log.create({
      organisation_id: req.user.orgId,
      user_id: req.user.id,
      action: "employee_updated",
      meta: { employeeId: employee.id },
      timestamp: new Date(),
    });

    res.json({ employee });
  } catch (err) {
    logger.error("updateEmployee error", err);
    res.status(500).json({ message: "Could not update employee" });
  }
}

// Soft-delete or hard-delete depending on model config
async function deleteEmployee(req, res) {
  try {
    const id = req.params.id;
    const employee = await Employee.findOne({
      where: { id, organisation_id: req.user.orgId },
    });
    if (!employee)
      return res.status(404).json({ message: "Employee not found" });

    await employee.destroy();

    await Log.create({
      organisation_id: req.user.orgId,
      user_id: req.user.id,
      action: "employee_deleted",
      meta: { employeeId: id },
      timestamp: new Date(),
    });

    res.json({ message: "Deleted" });
  } catch (err) {
    logger.error("deleteEmployee error", err);
    res.status(500).json({ message: "Could not delete employee" });
  }
}

module.exports = {
  listEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};
