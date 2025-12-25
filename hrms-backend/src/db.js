const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");
dotenv.config();

// Initialize Sequelize MySQL connection using environment config
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST || "127.0.0.1",
    port: process.env.DB_PORT || 3306,
    dialect: "mysql", // Chosen DB engine
    logging: false, // Hide SQL logs for cleaner output (enable in dev if needed)

    // Connection pool config for optimal performance
    pool: {
      max: 5, // Max simultaneous DB connections
      min: 0,
      idle: 10000, // Release idle connections after 10s
    },
  }
);

// Test DB connectivity on startup
sequelize
  .authenticate()
  .then(() => console.log("MySQL connection successful!"))
  .catch((err) => console.error("Unable to connect to MySQL:", err.message));

console.log(
  "ENV VALUES (debug):",
  process.env.DB_USER,
  process.env.DB_PASS,
  process.env.DB_NAME
);

module.exports = sequelize;
