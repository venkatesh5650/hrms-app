module.exports = function blockDemoWrites(req, res, next) {
  if (req.user?.is_demo && ["POST", "PUT", "DELETE"].includes(req.method)) {
    return res.status(403).json({ message: "Demo accounts are read-only" });
  }
  next();
};
