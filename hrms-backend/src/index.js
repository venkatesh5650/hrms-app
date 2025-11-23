const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const cors = require("cors"); // ⭐ New

const sequelize = require("./db");

// Register models
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

// ⭐ Enable CORS for frontend origin(s)
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://hrms-app-five.vercel.app", // 👉 Update after frontend deploy
    ],
    credentials: true,
  })
);

app.use(express.json()); // JSON parser

// Health check
app.get("/", (req, res) => {
  res.json({ message: "HRMS Backend running" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/logs", logRoutes);

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Server startup
async function start() {
  try {
    await sequelize.authenticate();
    console.log("DB connected");

    await sequelize.sync(); // Dev only

    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (err) {
    console.error("Failed to start server", err);
  }
}

start();
