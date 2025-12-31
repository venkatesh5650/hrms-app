const bcrypt = require("bcrypt");
const User = require("../models/user");
const Employee = require("../models/employee");
const Log = require("../models/log");
const { isNonEmptyString } = require("../utils/validators");

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);

async function createUser(data, user) {
  const { name, email, password, role, employeeId } = data;

  if (
    !isNonEmptyString(email) ||
    !isNonEmptyString(password) ||
    !isNonEmptyString(role)
  ) {
    const err = new Error("email, password and role are required");
    err.status = 400;
    throw err;
  }

  // 🚫 Admin cannot directly create EMPLOYEE users
  if (user.role === "ADMIN" && role === "EMPLOYEE") {
    await Log.create({
      organisation_id: user.orgId,
      user_id: user.id,
      action: "forbidden_employee_creation_attempt_by_admin",
      meta: { attemptedRole: role },
      timestamp: new Date(),
    });
    throw new Error(
      "Admin cannot directly create employees — use approval flow"
    );
  }

  // 🚫 HR cannot create ADMIN users
  if (user.role === "HR" && role === "ADMIN") {
    throw new Error("HR cannot create ADMIN users");
  }

  // 🚫 Only ADMIN can create HR or MANAGER
  if (["HR", "MANAGER"].includes(role) && user.role !== "ADMIN") {
    throw new Error("Only ADMIN can create HR or MANAGER users");
  }

  const existing = await User.findOne({ where: { email } });
  if (existing) throw new Error("User already exists");

  const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

  const newUser = await User.create({
    organisation_id: user.orgId,
    name: name || null,
    email,
    password_hash,
    role,
  });

  let logAction = "user_created";
  let logMeta = { createdUserId: newUser.id, role: newUser.role };

  // 🔒 Employee linking only allowed for ADMIN via approval flow
  if (newUser.role === "EMPLOYEE") {
    if (!employeeId) {
      throw new Error("Employee ID required for employee login creation");
    }

    const employee = await Employee.findOne({
      where: {
        id: employeeId,
        organisation_id: user.orgId,
        is_active: true,
      },
    });

    if (!employee) throw new Error("Employee not found or inactive");
    if (employee.user_id) throw new Error("Employee already has login");

    employee.user_id = newUser.id;
    await employee.save();

    logAction = "employee_login_linked";
    logMeta = { employeeId, userId: newUser.id };
  }

  await Log.create({
    organisation_id: user.orgId,
    user_id: user.id,
    action: logAction,
    meta: logMeta,
    timestamp: new Date(),
  });

  return {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
  };
}

async function updateUserRole(id, role, user) {
  const allowedRoles = ["ADMIN", "HR", "MANAGER", "EMPLOYEE"];
  if (!allowedRoles.includes(role)) {
    throw new Error("Invalid role");
  }

  const targetUser = await User.findOne({
    where: { id, organisation_id: user.orgId },
  });

  if (!targetUser) return null;

  // HR cannot change ADMIN or HR
  if (user.role === "HR" && ["ADMIN", "HR"].includes(targetUser.role)) {
    throw new Error("HR cannot modify this role");
  }

  // HR can only modify EMPLOYEE
  if (user.role === "HR" && targetUser.role !== "EMPLOYEE") {
    throw new Error("HR can only modify EMPLOYEE roles");
  }

  // MANAGER cannot modify anyone
  if (user.role === "MANAGER") {
    throw new Error("MANAGER cannot modify any roles");
  }

  // EMPLOYEE cannot modify anyone
  if (user.role === "EMPLOYEE") {
    throw new Error("EMPLOYEE cannot modify any roles");
  }

  // ADMIN cannot modify other ADMINs
  if (user.role === "ADMIN" && targetUser.role === "ADMIN") {
    throw new Error("ADMIN cannot modify another ADMIN");
  }

  targetUser.role = role;
  await targetUser.save();

  await Log.create({
    organisation_id: user.orgId,
    user_id: user.id,
    action: "user_role_updated",
    meta: { targetUserId: id, newRole: role },
    timestamp: new Date(),
  });

  return { id: targetUser.id, role: targetUser.role };
}

module.exports = { createUser, updateUserRole };
