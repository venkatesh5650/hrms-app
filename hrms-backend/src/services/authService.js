const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Organisation = require("../models/organisation");
const User = require("../models/user");
const Log = require("../models/log");
const RevokedToken = require("../models/revokedToken");
const { isNonEmptyString } = require("../utils/validators");

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);
const JWT_SECRET = process.env.JWT_SECRET;

// Prevent application startup if critical security secret is missing
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

async function register(data) {
  const { orgName, adminName, email, password } = data;

  if (
    !isNonEmptyString(orgName) ||
    !isNonEmptyString(email) ||
    !isNonEmptyString(password)
  ) {
    throw new Error("orgName, email and password are required");
  }

  const existing = await User.findOne({ where: { email } });
  if (existing) {
    throw new Error("User with this email already exists");
  }

  const org = await Organisation.create({ name: orgName });

  const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

  // This register flow is specifically for onboarding a new organisation,
  // so the first created user is intentionally assigned ADMIN role
  const user = await User.create({
    organisation_id: org.id,
    name: adminName || null,
    email,
    password_hash,
    role: "ADMIN",
  });

  // JWT contains user and organisation context for multi-tenant RBAC
  const token = jwt.sign(
    { userId: user.id, orgId: org.id, role: user.role },
    JWT_SECRET,
    { expiresIn: "8h" }
  );

  // Audit logging to maintain system activity trail
  await Log.create({
    organisation_id: org.id,
    user_id: user.id,
    user_role: user.role,
    action: "organisation_created",
    meta: { orgId: org.id, userId: user.id, role: user.role },
    timestamp: new Date(),
  });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      organisation_id: org.id,
      role: user.role,
      accountType: user.is_demo ? "DEMO" : "STANDARD",
    },
  };
}

async function login(data) {
  const { email, password } = data;

  try {
    console.log("Login attempt for:", email);

    const user = await User.findOne({ where: { email } });

    if (!user || !user.password_hash) {
      if (user && !user.password_hash) {
        console.log(`Login blocked for ${email}: Account setup pending (null password_hash)`);
      }
      throw new Error("Invalid email or password");
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) throw new Error("Invalid email or password");

    const token = jwt.sign(
      {
        userId: user.id,
        orgId: user.organisation_id,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "8h" }
    );

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        organisation_id: user.organisation_id,
        role: user.role,
        accountType: user.is_demo ? "DEMO" : "STANDARD",
      },
    };
  } catch (err) {
    // Detailed logging kept only on server side for debugging,
    // while client receives a sanitized error response
    console.error("LOGIN ERROR:", err.message);
    throw err;
  }
}

async function logout(token, user) {
  if (!isNonEmptyString(token) || !user) {
    throw new Error("Invalid logout request");
  }

  // decode() is used instead of verify() because token was already validated
  // earlier in authentication middleware; only expiry info is needed here
  const decoded = jwt.decode(token);

  // JWT is stateless, so blacklist approach is used to invalidate token
  await RevokedToken.create({
    token,
    expires_at: new Date(decoded.exp * 1000),
  });

  await Log.create({
    organisation_id: user.orgId,
    user_id: user.id,
    user_role: user.role,
    action: "user_logged_out",
    meta: { userId: user.id, role: user.role },
    timestamp: new Date(),
  });

  return true;
}

/**
 * Validates a one-time setup token from the onboarding email.
 * Returns basic user info so the frontend can personalise the page.
 */
async function verifySetupToken(token) {
  if (!isNonEmptyString(token)) throw new Error("Token is required");

  const user = await User.findOne({ where: { setup_token: token } });

  if (!user) throw new Error("Invalid or already used setup link");

  if (user.setup_token_expires && new Date() > new Date(user.setup_token_expires)) {
    throw new Error("This setup link has expired. Please contact HR for a new one.");
  }

  return { email: user.email, name: user.name };
}

/**
 * Sets the employee's password for the first time.
 * Clears the setup token so the link can only be used once.
 * Returns a JWT so the employee is immediately logged in.
 */
async function setupPassword(token, password) {
  if (!isNonEmptyString(token)) throw new Error("Token is required");
  if (!isNonEmptyString(password) || password.length < 8) {
    throw new Error("Password must be at least 8 characters");
  }

  const user = await User.findOne({ where: { setup_token: token } });

  if (!user) throw new Error("Invalid or already used setup link");

  if (user.setup_token_expires && new Date() > new Date(user.setup_token_expires)) {
    throw new Error("This setup link has expired. Please contact HR for a new one.");
  }

  const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

  // Atomically set password and clear setup token
  user.password_hash = password_hash;
  user.setup_token = null;
  user.setup_token_expires = null;
  await user.save();

  await Log.create({
    organisation_id: user.organisation_id,
    user_id: user.id,
    user_role: user.role,
    action: "account_setup_completed",
    meta: { userId: user.id },
    timestamp: new Date(),
  });

  const jwtToken = jwt.sign(
    { userId: user.id, orgId: user.organisation_id, role: user.role },
    JWT_SECRET,
    { expiresIn: "8h" }
  );

  return {
    token: jwtToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      organisation_id: user.organisation_id,
      role: user.role,
      accountType: user.is_demo ? "DEMO" : "STANDARD",
    },
  };
}

module.exports = { register, login, logout, verifySetupToken, setupPassword };
