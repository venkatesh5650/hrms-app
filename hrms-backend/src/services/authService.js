const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Organisation = require("../models/organisation");
const User = require("../models/user");
const Log = require("../models/log");
const RevokedToken = require("../models/revokedToken");
const { isNonEmptyString } = require("../utils/validators");

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

// Register new organisation + admin
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

  const user = await User.create({
    organisation_id: org.id,
    name: adminName || null,
    email,
    password_hash,
    role: "ADMIN",
  });

  const token = jwt.sign(
    { userId: user.id, orgId: org.id, role: user.role },
    JWT_SECRET,
    { expiresIn: "8h" }
  );

  await Log.create({
    organisation_id: org.id,
    user_id: user.id,
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
    },
  };
}

// Login existing user
async function login(data) {
  const { email, password } = data;

  try {
    console.log("Login attempt for:", email);

    const user = await User.findOne({ where: { email } });
    console.log("User found:", user?.id);

    if (!user) throw new Error("Invalid email or password");

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) throw new Error("Invalid email or password");

    return user;
  } catch (err) {
    console.error("LOGIN ERROR:");
    console.error("name:", err.name);
    console.error("message:", err.message);
    console.error("parent:", err.parent);
    console.error("original:", err.original);
    throw err;
  }
}


// Logout (audit only, JWT remains stateless)

async function logout(token, user) {
  if (!isNonEmptyString(token) || !user) {
    throw new Error("Invalid logout request");
  }

  const decoded = jwt.decode(token);

  await RevokedToken.create({
    token,
    expires_at: new Date(decoded.exp * 1000),
  });

  await Log.create({
    organisation_id: user.orgId,
    user_id: user.id,
    action: "user_logged_out",
    meta: { userId: user.id, role: user.role },
    timestamp: new Date(),
  });

  return true;
}

module.exports = { register, login, logout };
