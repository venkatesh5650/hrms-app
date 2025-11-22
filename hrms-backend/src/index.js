const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const sequelize = require("./db");

// Register models (ensures associations are loaded before sync)
require("./models/organisation");
require("./models/user");
require("./models/employee");
require("./models/team");
require("./models/employeeTeam");
require("./models/log");

const authRoutes = require("./routes/auth");
const employeeRoutes = require("./routes/employees");
const teamRoutes = require("./routes/teams");
const logRoutes = require("./routes/logs");
const errorHandler = require("./middlewares/errorHandler");

const app = express();
app.use(express.json()); // JSON request parsing

// Health check / root endpoint
app.get("/", (req, res) => {
  res.json({ message: "HRMS Backend running" });
});

// API routing (tenant rules enforced via middleware inside route files)
app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/logs", logRoutes);

// Centralized error handler for clean API responses
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Server startup
async function start() {
  try {
    await sequelize.authenticate(); // DB reachability test
    console.log("Database connected");

    // ⚠ Dev only: auto-create tables
    // Production: use migrations for schema control
    await sequelize.sync();

    app.listen(PORT, () =>
      console.log(`Server started on port ${PORT}`)
    );
  } catch (err) {
    console.error("Failed to start server", err);
  }
}

start();
