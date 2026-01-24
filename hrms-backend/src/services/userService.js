const bcrypt = require("bcrypt");
const { sequelize } = require("../models"); // Sequelize instance for transactions
const User = require("../models/user");
const Employee = require("../models/employee");
const Log = require("../models/log");
const { isNonEmptyString } = require("../utils/validators");

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);

// Centralized helper for audit logging
async function createAuditLog(user, action, meta, transaction) {
  await Log.create(
    {
      organisation_id: user.orgId,
      user_id: user.id,
      action,
      meta,
      timestamp: new Date(),
    },
    { transaction },
  );
}

// Role validation rules extracted for clarity and reusability
function validateRoleCreation(currentUser, role) {
  if (currentUser.role === "ADMIN" && role === "EMPLOYEE") {
    throw new Error(
      "Admin cannot directly create employees — use approval flow",
    );
  }

  if (currentUser.role === "HR" && role === "ADMIN") {
    throw new Error("HR cannot create ADMIN users");
  }

  if (["HR", "MANAGER"].includes(role) && currentUser.role !== "ADMIN") {
    throw new Error("Only ADMIN can create HR or MANAGER users");
  }
}

// Handles EMPLOYEE specific linking logic
async function linkEmployee(newUser, employeeId, currentUser, transaction) {
  if (!employeeId) {
    throw new Error("Employee ID required for employee login creation");
  }

  const employee = await Employee.findOne({
    where: {
      id: employeeId,
      organisation_id: currentUser.orgId,
      is_active: true,
    },
    transaction,
  });

  if (!employee) throw new Error("Employee not found or inactive");
  if (employee.user_id) throw new Error("Employee already has login");

  employee.user_id = newUser.id;
  await employee.save({ transaction });

  await createAuditLog(
    currentUser,
    "employee_login_linked",
    { employeeId, userId: newUser.id },
    transaction,
  );
}

// Handles MANAGER specific employee creation
async function createManagerEmployee(newUser, currentUser, transaction) {
  const employee = await Employee.create(
    {
      organisation_id: currentUser.orgId,
      user_id: newUser.id,
      email: newUser.email,
      first_name: newUser.name?.split(" ")[0] || null,
      last_name: newUser.name?.split(" ").slice(1).join(" ") || null,
      is_active: true,
    },
    { transaction },
  );

  await createAuditLog(
    currentUser,
    "manager_created_and_linked",
    { userId: newUser.id, employeeId: employee.id },
    transaction,
  );
}

// ======================== CREATE USER =========================
async function createUser(data, currentUser) {
  const { name, email, password, role, employeeId } = data;

  // Basic input validation
  if (
    !isNonEmptyString(email) ||
    !isNonEmptyString(password) ||
    !isNonEmptyString(role)
  ) {
    const err = new Error("email, password and role are required");
    err.status = 400;
    throw err;
  }

  // Validate role creation permissions
  validateRoleCreation(currentUser, role);

  // Transaction ensures all DB operations succeed or rollback together
  return await sequelize.transaction(async (t) => {
    const existing = await User.findOne({ where: { email }, transaction: t });
    if (existing) throw new Error("User already exists");

    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = await User.create(
      {
        organisation_id: currentUser.orgId,
        name: name || null,
        email,
        password_hash,
        role,
      },
      { transaction: t },
    );

    // Role-based additional logic
    if (role === "EMPLOYEE") {
      await linkEmployee(newUser, employeeId, currentUser, t);
    }

    if (role === "MANAGER") {
      await createManagerEmployee(newUser, currentUser, t);
    }

    await createAuditLog(
      currentUser,
      "user_created",
      { createdUserId: newUser.id, role: newUser.role },
      t,
    );

    return {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    };
  });
}

// ======================== UPDATE USER =========================
async function updateUser(id, data, user) {
  return await sequelize.transaction(async (t) => {
    const targetUser = await User.findOne({
      where: { id, organisation_id: user.orgId },
      transaction: t,
    });

    if (!targetUser) return null;

    // Permission checks to prevent unauthorized updates
    if (user.role === "HR" && targetUser.role !== "EMPLOYEE") {
      throw new Error("HR can only update EMPLOYEE users");
    }

    if (["MANAGER", "EMPLOYEE"].includes(user.role)) {
      throw new Error(`${user.role} cannot update users`);
    }

    if (
      user.role === "ADMIN" &&
      targetUser.role === "ADMIN" &&
      user.id !== targetUser.id
    ) {
      throw new Error("ADMIN cannot update another ADMIN");
    }

    const updates = {};

    if (isNonEmptyString(data.name)) updates.name = data.name;
    if (isNonEmptyString(data.email)) updates.email = data.email;

    if (isNonEmptyString(data.password)) {
      updates.password_hash = await bcrypt.hash(data.password, SALT_ROUNDS);
    }

    await targetUser.update(updates, { transaction: t });

    await createAuditLog(
      user,
      "user_updated",
      { targetUserId: id, updatedFields: Object.keys(updates) },
      t,
    );

    return {
      id: targetUser.id,
      name: targetUser.name,
      email: targetUser.email,
      role: targetUser.role,
    };
  });
}

// ======================== UPDATE USER ROLE =========================
async function updateUserRole(id, role, user) {
  const allowedRoles = ["ADMIN", "HR", "MANAGER", "EMPLOYEE"];

  if (!allowedRoles.includes(role)) {
    throw new Error("Invalid role");
  }

  return await sequelize.transaction(async (t) => {
    const targetUser = await User.findOne({
      where: { id, organisation_id: user.orgId },
      transaction: t,
    });

    if (!targetUser) return null;

    // Managers and employees are not allowed to change roles
    if (["MANAGER", "EMPLOYEE"].includes(user.role)) {
      throw new Error(`${user.role} cannot modify any roles`);
    }

    // HR specific restrictions
    if (user.role === "HR") {
      if (targetUser.role !== "EMPLOYEE") {
        throw new Error("HR can only modify EMPLOYEE users");
      }

      if (!["MANAGER", "HR"].includes(role)) {
        throw new Error("HR can only promote EMPLOYEE to MANAGER or HR");
      }
    }

    // ADMIN cannot modify another ADMIN
    if (user.role === "ADMIN" && targetUser.role === "ADMIN") {
      throw new Error("ADMIN cannot modify another ADMIN");
    }

    targetUser.role = role;
    await targetUser.save({ transaction: t });

    await createAuditLog(
      user,
      "user_role_updated",
      { targetUserId: id, newRole: role },
      t,
    );

    return { id: targetUser.id, role: targetUser.role };
  });
}

module.exports = { createUser, updateUserRole, updateUser };
