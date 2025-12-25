const express = require("express");
const router = express.Router();
const { register, login, logout } = require("../controllers/authController");
const auth = require("../middlewares/authMiddleware");

// Public authentication routes
router.post("/register", register);
router.post("/login", login);

// Protected: requires valid JWT (identifies user for audit logging)
router.post("/logout", auth, logout);

module.exports = router;
