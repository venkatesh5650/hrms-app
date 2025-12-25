// Minimal logger utility (replace with Winston/Pino in production)
module.exports = {
  info: (...args) => console.log("[INFO]", ...args), // Standard logs
  error: (...args) => console.error("[ERROR]", ...args), // Error logs
};
