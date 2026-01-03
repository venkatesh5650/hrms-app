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

  if (user.role === "HR" && role === "ADMIN") {
    throw new Error("HR cannot create ADMIN users");
  }

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

  if (newUser.role === "MANAGER") {
    const employee = await Employee.create({
      organisation_id: user.orgId,
      user_id: newUser.id,
      email: newUser.email,
      first_name: newUser.name?.split(" ")[0] || null,
      last_name: newUser.name?.split(" ").slice(1).join(" ") || null,
      is_active: true,
    });

    logAction = "manager_created_and_linked";
    logMeta = { userId: newUser.id, employeeId: employee.id };
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

/* ========================= */
/* ✅ ADDED: updateUser */
/* ========================= */
async function updateUser(id, data, user) {
  const targetUser = await User.findOne({
    where: { id, organisation_id: user.orgId },
  });

  if (!targetUser) return null;

  // Permission checks
  if (user.role === "HR" && targetUser.role !== "EMPLOYEE") {
    throw new Error("HR can only update EMPLOYEE users");
  }

  if (user.role === "MANAGER") {
    throw new Error("MANAGER cannot update users");
  }

  if (user.role === "EMPLOYEE") {
    throw new Error("EMPLOYEE cannot update users");
  }

  if (user.role === "ADMIN" && targetUser.role === "ADMIN") {
    throw new Error("ADMIN cannot update another ADMIN");
  }

  const updates = {};

  if (isNonEmptyString(data.name)) updates.name = data.name;
  if (isNonEmptyString(data.email)) updates.email = data.email;

  if (isNonEmptyString(data.password)) {
    updates.password_hash = await bcrypt.hash(data.password, SALT_ROUNDS);
  }

  await targetUser.update(updates);

  await Log.create({
    organisation_id: user.orgId,
    user_id: user.id,
    action: "user_updated",
    meta: { targetUserId: id, updatedFields: Object.keys(updates) },
    timestamp: new Date(),
  });

  return {
    id: targetUser.id,
    name: targetUser.name,
    email: targetUser.email,
    role: targetUser.role,
  };
}

async function updateUserRole(id, role, user) {
  const allowedRoles = ["ADMIN", "HR", "MANAGER", "EMPLOYEE"];
  if (!allowedRoles.includes(role)) throw new Error("Invalid role");

  const targetUser = await User.findOne({
    where: { id, organisation_id: user.orgId },
  });

  if (!targetUser) return null;

  // Managers & employees cannot modify roles
  if (["MANAGER", "EMPLOYEE"].includes(user.role)) {
    throw new Error(`${user.role} cannot modify any roles`);
  }

  // HR rules
  if (user.role === "HR") {
    if (targetUser.role !== "EMPLOYEE") {
      throw new Error("HR can only modify EMPLOYEE users");
    }

    if (!["MANAGER", "HR"].includes(role)) {
      throw new Error("HR can only promote EMPLOYEE to MANAGER or HR");
    }
  }

  // Admin rules
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

module.exports = { createUser, updateUserRole, updateUser };
