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
    await sequelize.authenticate();
    console.log("MySQL connection successful!");

    const [rows] = await sequelize.query("SELECT DATABASE()");
    console.log("Connected DB:", rows[0]["DATABASE()"]);
  } catch (err) {
    console.error("DB connection failed. Retrying...", err.message);
    setTimeout(connectWithRetry, 5000);
  }
}


connectWithRetry(); // Start DB connection on app boot

// 🔍 Add this block here

module.exports = sequelize;

module.exports = sequelize; // Single shared DB connection across the app
