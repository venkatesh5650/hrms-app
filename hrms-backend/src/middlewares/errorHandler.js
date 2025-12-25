// Centralized error handler for consistent API responses
module.exports = function errorHandler(err, req, res, next) {
  console.error(err); // Log full error internally (avoid exposing details to client)

  res.status(err.status || 500).json({
    message: err.message || "Internal server error", // Safe generic fallback
  });
};
