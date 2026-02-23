const express = require("express");
const router = express.Router();
const { register, login, logout, verifySetupToken, setupPassword } = require("../controllers/authController");
const authenticate = require("../middlewares/authMiddleware");

// Public authentication routes
router.post("/register", register);
router.post("/login", login);

// Password setup flow — public, secured by one-time setup_token from email
router.get("/verify-token", verifySetupToken);
router.post("/setup-password", setupPassword);

// Protected: requires valid JWT (identifies user for audit logging)
router.post("/logout", authenticate, logout);

module.exports = router;
