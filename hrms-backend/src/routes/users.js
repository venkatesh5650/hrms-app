const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const requireRole = require("../middlewares/requireRole");
const User = require("../models/user");
const { createUser, updateUserRole } = require("../controllers/userController");

router.use(auth);

// Admin can view all users
router.get("/", requireRole("ADMIN"), async (req, res) => {
  const users = await User.findAll({
    where: { organisation_id: req.user.orgId },
    attributes: ["id", "name", "email", "role", "created_at"],
  });
  res.json({ users });
});

// Admin & HR can create users
router.post("/", requireRole("ADMIN", "HR"), createUser);

router.put("/:id/role", requireRole("ADMIN", "HR"), updateUserRole);

module.exports = router;
