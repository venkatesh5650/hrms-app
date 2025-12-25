const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const User = require("../models/user");

// Authentication middleware (JWT validation + tenant scoping)
module.exports = async function authMiddleware(req, res, next) {
  try {
    const auth = req.headers.authorization || "";
    const token = auth.split(" ")[1]; // Expect: "Bearer <token>"
    if (!token)
      return res.status(401).json({ message: "No token provided" });

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // Ensures user still exists + retrieves tenant scope
    const user = await User.findByPk(payload.userId);
    if (!user)
      return res
        .status(401)
        .json({ message: "Invalid token (user not found)" });

    // Attach authenticated user info to request context
    req.user = { id: user.id, orgId: user.organisation_id };

    next();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid token",
      error: err.message,
    });
  }
};
