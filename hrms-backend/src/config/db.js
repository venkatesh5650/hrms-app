const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");

dotenv.config(); // Load environment variables (no secrets in code)

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: "mysql",

    logging: false, // Avoid leaking SQL queries in logs

    dialectOptions: {
      ssl: {
        require: true, // Enforce encrypted DB connection
        rejectUnauthorized: false, // Allow cloud/self-signed certificates
      },
    },

    pool: {
      max: 5, // Limit concurrent DB usage to protect database
      idle: 10000, // Free unused connections automatically
    },
  }
);

async function connectWithRetry() {
  try {
    await sequelize.authenticate(); // Health-check DB connection at startup
    console.log("MySQL connection successful!");
  } catch (err) {
    console.error(
      "DB connection failed. Retrying in 5 seconds...",
      err.message
    );
    setTimeout(connectWithRetry, 5000); // Self-healing retry for production resilience
  }
}

connectWithRetry(); // Start DB connection on app boot

// 🔍 Add this block here
sequelize
  .query("SELECT DATABASE()")
  .then(([rows]) => {
    console.log("Connected DB:", rows[0]["DATABASE()"]);
  })
  .catch((err) => {
    console.error("Failed to fetch DB name:", err);
  });

module.exports = sequelize;

module.exports = sequelize; // Single shared DB connection across the app
