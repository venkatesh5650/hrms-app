const employeeService = require("../services/employeeService");

async function listEmployees(req, res,next) {
  try {
    const employees = await employeeService.listEmployees(req.user.orgId);
    res.json({ employees });
  } catch (err) {
    next(err);
  }
}

async function getEmployee(req, res,next) {
  try {
    const employee = await employeeService.getEmployee(
      req.params.id,
      req.user.orgId
    );

    if (!employee)
      return res.status(404).json({ message: "Employee not found" });

    res.json({ employee });
  } catch (err) {
    next(err);
  }
}

async function createEmployee(req, res,next) {
  try {
    if (!req.body.first_name)
      return res.status(400).json({ message: "first_name required" });

    const employee = await employeeService.createEmployee(req.body, req.user);
    res.status(201).json({ employee });
  } catch (err) {
    next(err);
  }
}

async function updateEmployee(req, res,next) {
  try {
    const employee = await employeeService.updateEmployee(
      req.params.id,
      req.body,
      req.user
    );

    if (!employee)
      return res.status(404).json({ message: "Employee not found" });

    res.json({ employee });
  } catch (err) {
    next(err);
  }
}

async function deleteEmployee(req, res,next) {
  try {
    const success = await employeeService.deleteEmployee(
      req.params.id,
      req.user
    );

    if (!success)
      return res.status(404).json({ message: "Employee not found" });

    res.json({ message: "Employee archived" });
  } catch (err) {
    next(err);
  }
}

async function restoreEmployee(req, res,next) {
  try {
    const success = await employeeService.restoreEmployee(
      req.params.id,
      req.user
    );

    if (!success)
      return res.status(404).json({ message: "Employee not found or active" });

    res.json({ message: "Employee restored" });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  restoreEmployee,
};
