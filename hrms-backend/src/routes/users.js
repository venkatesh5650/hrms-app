const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const requireRole = require("../middlewares/requireRole");
const User = require("../models/user");
const {
  getUsers,
  createUser,
  updateUserRole,
  updateUser,
} = require("../controllers/userController");

router.use(auth);

// Admin can view all users
router.get("/", requireRole("ADMIN", "HR"), getUsers);

// Admin & HR can create users
router.post("/", requireRole("ADMIN", "HR"), createUser);

router.put("/:id/role", requireRole("ADMIN", "HR"), updateUserRole);

// Update user details

router.put("/:id", requireRole("ADMIN", "HR"), updateUser);

module.exports = router;
