const userService = require("../services/userService");

// Controller layer — handles HTTP concerns and delegates business logic to services
async function createUser(req, res,next) {
  try {
    const user = await userService.createUser(req.body, req.user);
    res.status(201).json({ message: "User created", user });
  } catch (err) {
    if (err.message.includes("cannot"))
      return res.status(403).json({ message: err.message });
    if (err.message.includes("exists"))
      return res.status(400).json({ message: err.message });
    if (err.message.includes("required"))
      return res.status(400).json({ message: err.message });

    next(err);
  }
}

// Role update endpoint with centralized authorization in service layer
async function updateUserRole(req, res,next) {
  try {
    const result = await userService.updateUserRole(
      req.params.id,
      req.body.role,
      req.user
    );

    if (!result) return res.status(404).json({ message: "User not found" });

    res.json({ message: "Role updated", user: result });
  } catch (err) {
    if (err.message.includes("Invalid"))
      return res.status(400).json({ message: err.message });
    if (err.message.includes("cannot"))
      return res.status(403).json({ message: err.message });

    next(err);
  }
}

/* ========================= */
/* ✅ ADDED: updateUser */
/* ========================= */
async function updateUser(req, res, next) {
  try {
    const result = await userService.updateUser(
      req.params.id,
      req.body,
      req.user
    );

    if (!result) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User updated", user: result });
  } catch (err) {
    if (err.message.includes("cannot"))
      return res.status(403).json({ message: err.message });
    if (err.message.includes("Invalid"))
      return res.status(400).json({ message: err.message });

    next(err);
  }
}

module.exports = { createUser, updateUserRole, updateUser };
