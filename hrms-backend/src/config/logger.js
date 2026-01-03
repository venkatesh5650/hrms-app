const level = process.env.LOG_LEVEL || "info"; // info | error | silent

module.exports = {
  info: (...args) => {
    if (level === "info") console.log("[INFO]", ...args);
  },
  error: (...args) => {
    if (level !== "silent") console.error("[ERROR]", ...args);
  },
};
