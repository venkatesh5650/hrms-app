const Employee = require("../models/employee");
const Team = require("../models/team");
const Log = require("../models/log");

// Fetch all active employees of an organization with their assigned teams
async function listEmployees(orgId) {
  return await Employee.findAll({
    where: { organisation_id: orgId, is_active: true },
    // Include Team association but hide join-table fields for clean response
    include: [{ model: Team, through: { attributes: [] } }],
    order: [["created_at", "DESC"]],
  });
}

// Fetch single employee details with team information
async function getEmployee(id, orgId) {
  return await Employee.findOne({
    where: { id, organisation_id: orgId, is_active: true },
    include: [{ model: Team, through: { attributes: [] } }],
  });
}

// Create new employee record and log the action for audit tracking
async function createEmployee(data, user) {
  const employee = await Employee.create({
    ...data,
    organisation_id: user.orgId,
  });

  await Log.create({
    organisation_id: user.orgId,
    user_id: user.id,
    action: "employee_created",
    meta: { employeeId: employee.id },
    timestamp: new Date(),
  });

  return employee;
}

// Update existing employee only if active and belongs to same organization
async function updateEmployee(id, data, user) {
  const employee = await Employee.findOne({
    where: { id, organisation_id: user.orgId, is_active: true },
  });

  if (!employee) return null;

  await employee.update(data);

  await Log.create({
    organisation_id: user.orgId,
    user_id: user.id,
    action: "employee_updated",
    meta: { employeeId: employee.id },
    timestamp: new Date(),
  });

  return employee;
}

// Soft delete employee instead of hard delete to preserve historical data
async function deleteEmployee(id, user) {
  const employee = await Employee.findOne({
    where: { id, organisation_id: user.orgId, is_active: true },
  });

  if (!employee) return null;

  employee.is_active = false;
  employee.deleted_at = new Date();
  await employee.save();

  await Log.create({
    organisation_id: user.orgId,
    user_id: user.id,
    action: "employee_soft_deleted",
    meta: { employeeId: employee.id },
    timestamp: new Date(),
  });

  return true;
}

// Restore previously soft-deleted employee (restricted via route middleware)
async function restoreEmployee(id, user) {
  const employee = await Employee.findOne({
    where: { id, organisation_id: user.orgId, is_active: false },
  });

  if (!employee) return null;

  await employee.update({ is_active: true });

  await Log.create({
    organisation_id: user.orgId,
    user_id: user.id,
    action: "employee_restored",
    meta: { employeeId: id },
    timestamp: new Date(),
  });

  return true;
}

module.exports = {
  listEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  restoreEmployee,
};
