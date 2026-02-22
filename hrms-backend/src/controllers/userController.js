const userService = require("../services/userService");

async function getUsers(req, res, next) {
  try {
    const users = await userService.getUsers(req.user);
    res.json({ users });
  } catch (err) {
    next(err);
  }
}

async function createUser(req, res, next) {
  try {
    // Business logic delegated to service layer to keep controller thin
    const user = await userService.createUser(req.body, req.user);
    res.status(201).json({ message: "User created", user });
  } catch (err) {
    // Errors forwarded to centralized error handler
    next(err);
  }
}

async function updateUserRole(req, res, next) {
  try {
    // Authorization and validation handled inside service layer
    const result = await userService.updateUserRole(
      req.params.id,
      req.body.role,
      req.user
    );

    if (!result) return res.status(404).json({ message: "User not found" });

    res.json({ message: "Role updated", user: result });
  } catch (err) {
    next(err);
  }
}

async function updateUser(req, res, next) {
  try {
    // Update logic centralized in service to maintain separation of concerns
    const result = await userService.updateUser(
      req.params.id,
      req.body,
      req.user
    );

    if (!result) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User updated", user: result });
  } catch (err) {
    next(err);
  }
}

module.exports = { getUsers, createUser, updateUserRole, updateUser };
