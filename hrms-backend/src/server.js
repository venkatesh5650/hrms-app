const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const cors = require("cors");

const sequelize = require("./config/db");

// Register models
require("./models/organisation");
require("./models/user");
require("./models/employee");
require("./models/team");
require("./models/employeeTeam");
require("./models/log");
require("./models/approval");
require("./models/associations");

const app = express();
app.use(express.json());

const authRoutes = require("./routes/auth");
const employeeRoutes = require("./routes/employees");
const teamRoutes = require("./routes/teams");
const approvalRoutes = require("./routes/approvals");
const logsRoutes = require("./routes/logs");
const usersRoutes = require("./routes/users");
const exportRoutes = require("./routes/export");
const orgStats = require("./routes/orgStats");
const profile = require("./routes/profile");

const errorHandler = require("./middlewares/errorHandler");

// Enable CORS
app.use(
  cors({
    origin: ["http://localhost:3000", "https://hrms-app-five.vercel.app"],
    credentials: true,
  })
);

app.options("*", cors());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/approvals", approvalRoutes);
app.use("/api/logs", logsRoutes);
app.use("/api/analytics", require("./routes/analytics"));
app.use("/api/export", exportRoutes);
app.use("/api/org", orgStats);
app.use("/api/profile", profile);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "HRMS Backend running" });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Server startup
async function start() {
  try {
    await sequelize.authenticate();
    console.log("DB connected");

    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (err) {
    console.error("Failed to start server", err);
  }
}

start();
