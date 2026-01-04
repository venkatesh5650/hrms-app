module.exports = function blockDemoWrites(req, res, next) {
  if (req.user?.is_demo && ["POST", "PUT", "DELETE"].includes(req.method)) {
    return res.status(403).json({
      code: "DEMO_READ_ONLY",
      message: "Demo accounts are read-only. Please sign up to modify data.",
    });
  }
  next();
};
