module.exports = function blockDemoWrites(req, res, next) {
  if (req.user?.is_demo && ["POST", "PUT", "DELETE"].includes(req.method)) {
    return res.status(403).json({
      code: "DEMO_ACCOUNT_READ_ONLY",
      message: "Write operations are restricted for demo accounts.",
    });
  }
  next();
};
