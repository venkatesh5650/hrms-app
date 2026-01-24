const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const User = require("../models/user");
const RevokedToken = require("../models/revokedToken");

module.exports = async function authMiddleware(req, res, next) {
  try {
    const auth = req.headers.authorization || "";

    // Extract token from "Bearer <token>" format
    const token = auth.split(" ")[1];

    if (!token) 
      return res.status(401).json({ message: "No token provided" });

    // Verifies token signature and expiry
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // Prevent usage of tokens that were explicitly revoked during logout
    const revoked = await RevokedToken.findOne({ where: { token } });
    if (revoked) {
      return res.status(401).json({ message: "Token revoked" });
    }

    // Ensure token belongs to a valid existing user
    const user = await User.findByPk(payload.userId);
    if (!user)
      return res
        .status(401)
        .json({ message: "Invalid token (user not found)" });

    // Attach minimal user context for RBAC and tenant scoping
    req.user = {
      id: user.id,
      orgId: user.organisation_id,
      role: user.role,
      is_demo: user.is_demo, 
    };

    next();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid token",
      error: err.message,
    });
  }
};
