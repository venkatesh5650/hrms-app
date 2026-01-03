const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "mysql",
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  pool: {
    max: 5,
    idle: 10000,
  },
});

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

connectWithRetry();

module.exports = sequelize;
