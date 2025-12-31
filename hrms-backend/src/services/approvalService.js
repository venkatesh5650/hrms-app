const Approval = require("../models/approval");
const Employee = require("../models/employee");
const User = require("../models/user");
const Log = require("../models/log");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { isNonEmptyString } = require("../utils/validators");

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);

/**
 * HR creates an approval request
 */
async function createApproval(data, user) {
  const { type, payload } = data;

  if (!isNonEmptyString(type) || !payload) {
    throw new Error("type and payload are required");
  }

  return await Approval.create({
    organisation_id: user.orgId,
    user_id: user.id,
    type,
    payload,
    status: "PENDING",
  });
}

/**
 * List pending approvals based on role
 */
async function listPending(orgId, role) {
  const where = { organisation_id: orgId, status: "PENDING" };

  if (role === "MANAGER") where.type = "CREATE";
  if (role === "ADMIN") where.type = "LOGIN_ACCESS";

  return await Approval.findAll({
    where,
    order: [["created_at", "ASC"]],
  });
}

/**
 * Approve approval based on type and role
 */
async function approveApproval(id, user) {
  const approval = await Approval.findOne({
    where: { id, organisation_id: user.orgId, status: "PENDING" },
  });

  if (!approval) return null;

  if (approval.type === "CREATE" && user.role !== "MANAGER") {
    throw new Error("Only Manager can approve employee creation");
  }
  if (approval.type === "LOGIN_ACCESS" && user.role !== "ADMIN") {
    throw new Error("Only Admin can approve login access");
  }

  const payload =
    typeof approval.payload === "string"
      ? JSON.parse(approval.payload)
      : approval.payload;

  let responseData = null;

  // CREATE → create employee and enqueue LOGIN_ACCESS
  if (approval.type === "CREATE") {
    const employee = await Employee.create({
      ...payload,
      organisation_id: user.orgId,
    });

    await Approval.create({
      organisation_id: user.orgId,
      user_id: user.id,
      type: "LOGIN_ACCESS",
      payload: {
        employeeId: employee.id,
        email: employee.email,
      },
      status: "PENDING",
    });
  }

  // LOGIN_ACCESS → create login
  if (approval.type === "LOGIN_ACCESS") {
    const { employeeId, email } = payload;

    const employee = await Employee.findOne({
      where: { id: employeeId, organisation_id: user.orgId, is_active: true },
    });
    if (!employee) throw new Error("Employee not found");

    if (employee.user_id) throw new Error("Login already exists");

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) throw new Error("User already exists");

    const tempPassword = crypto.randomBytes(6).toString("base64").slice(0, 8);
    const password_hash = await bcrypt.hash(tempPassword, SALT_ROUNDS);

    const fullName = [employee.first_name, employee.last_name]
      .filter(Boolean)
      .join(" ");

    const newUser = await User.create({
      organisation_id: user.orgId,
      email,
      password_hash,
      role: "EMPLOYEE",
      name: fullName || null,
    });

    employee.user_id = newUser.id;
    await employee.save();

    responseData = {
      tempPassword,
      email,
      name: newUser.name,
    };
  }

  // ✅ Mark approval approved
  approval.status = "APPROVED";
  await approval.save();

  await Log.create({
    organisation_id: user.orgId,
    user_id: user.id,
    action: "approval_approved",
    meta: { approvalId: approval.id, type: approval.type },
    timestamp: new Date(),
  });

  return responseData || true;
}

/**
 * Reject approval with reason
 */
async function rejectApproval(id, reason, user) {
  if (!isNonEmptyString(reason)) throw new Error("Rejection reason required");

  const approval = await Approval.findOne({
    where: { id, organisation_id: user.orgId, status: "PENDING" },
  });

  if (!approval) return null;

  // Role enforcement
  if (approval.type === "CREATE" && user.role !== "MANAGER") {
    throw new Error("Only Manager can reject employee creation");
  }
  if (approval.type === "LOGIN_ACCESS" && user.role !== "ADMIN") {
    throw new Error("Only Admin can reject login access");
  }

  approval.status = "REJECTED";
  approval.rejection_reason = reason;
  approval.reviewed_by = user.id;
  approval.reviewed_at = new Date();
  await approval.save();

  try {
    await Log.create({
      organisation_id: user.orgId,
      user_id: user.id,
      action: "approval_rejected",
      meta: { approvalId: approval.id, type: approval.type, reason },
      timestamp: new Date(),
    });
  } catch (err) {
    console.error("Log failed:", err.message);
  }

  return true;
}

/**
 * Admin / HR history view
 */
async function listHistory(orgId) {
  return await Approval.findAll({
    where: { organisation_id: orgId },
    order: [["created_at", "DESC"]],
  });
}

module.exports = {
  createApproval,
  listPending,
  approveApproval,
  rejectApproval,
  listHistory,
};
