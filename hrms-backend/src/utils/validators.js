// Small input validation helpers (extendable per domain needs)
module.exports = {
  isNonEmptyString: (v) =>
    typeof v === "string" && v.trim().length > 0, // Ensure valid string input
  isArray: (v) => Array.isArray(v), // Basic array type guard
};
