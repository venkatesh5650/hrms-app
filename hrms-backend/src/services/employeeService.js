const Employee = require("../models/employee");
const Team = require("../models/team");
const Log = require("../models/log");

async function listEmployees(orgId) {
  return await Employee.findAll({
    where: { organisation_id: orgId, is_active: true },
    include: [{ model: Team, through: { attributes: [] } }],
    order: [["created_at", "DESC"]],
  });
}


async function getEmployee(id, orgId) {
  return await Employee.findOne({
    where: { id, organisation_id: orgId, is_active: true },
    include: [{ model: Team, through: { attributes: [] } }],
  });
}



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
