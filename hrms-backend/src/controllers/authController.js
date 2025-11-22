const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const Organisation = require("../models/organisation");
const User = require("../models/user");
const Log = require("../models/log");
const logger = require("../config/logger");

// Configurable bcrypt salt rounds
const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);

// Register Organisation + Admin User
async function register(req, res) {
  try {
    const { orgName, adminName, email, password } = req.body;
    if (!orgName || !email || !password)
      return res.status(400).json({
        message: "orgName, email and password are required",
      });

    const org = await Organisation.create({ name: orgName });

    // Secure password hashing
    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await User.create({
      organisation_id: org.id,
      name: adminName || null,
      email,
      password_hash,
    });

    // JWT authentication (valid for 8 hours)
    const token = jwt.sign(
      { userId: user.id, orgId: org.id },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    // Audit logging
    await Log.create({
      organisation_id: org.id,
      user_id: user.id,
      action: "organisation_created",
      meta: { orgId: org.id, userId: user.id },
      timestamp: new Date(),
    });

    logger.info("organisation registered", { orgId: org.id, userId: user.id });

    res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        organisation_id: org.id,
      },
    });
  } catch (err) {
    logger.error("register error", err);
    res.status(500).json({ message: "Registration failed" });
  }
}

// Login existing user
async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({
        message: "email and password required",
      });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    // Password validation
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user.id, orgId: user.organisation_id },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    await Log.create({
      organisation_id: user.organisation_id,
      user_id: user.id,
      action: "user_logged_in",
      meta: { userId: user.id },
      timestamp: new Date(),
    });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        organisation_id: user.organisation_id,
      },
    });
  } catch (err) {
    logger.error("login error", err);
    res.status(500).json({ message: "Login failed" });
  }
}

// Logout: Token removal is handled client-side, just track event
async function logout(req, res) {
  try {
    await Log.create({
      organisation_id: req.user.orgId,
      user_id: req.user.id,
      action: "user_logged_out",
      meta: { userId: req.user.id },
      timestamp: new Date(),
    });

    res.json({ message: "Logged out" });
  } catch (err) {
    logger.error("logout error", err);
    res.status(500).json({ message: "Logout failed" });
  }
}

module.exports = { register, login, logout };
